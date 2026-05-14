import { createClient } from '@/utils/supabase/client'

export interface StreakData {
  current_streak: number;
  max_streak: number;
  last_login_date: string;
}

export interface Activity {
  activity_date: string;
}

export const streakService = {
  async getStreak(userId: string): Promise<StreakData | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async recordActivity(userId: string) {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    
    // 1. Record activity for heatmap
    await supabase
      .from('user_activities')
      .upsert({ profile_id: userId, activity_date: today }, { onConflict: 'profile_id, activity_date' })

    // 2. Update streak logic
    const { data: streak } = await supabase
      .from('streaks')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle()

    if (!streak) {
      // First time initialization
      await supabase.from('streaks').insert({
        profile_id: userId,
        current_streak: 1,
        max_streak: 1,
        last_login_date: today
      })
      return { current: 1, milestoneReached: false }
    }

    const lastDate = new Date(streak.last_login_date)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24))

    let newStreak = streak.current_streak
    let newMax = streak.max_streak

    if (diffDays === 1) {
      // Consecutive day
      newStreak += 1
    } else if (diffDays > 1) {
      // Broken streak
      newStreak = 1
    } else {
      // Same day, no change
      return { current: newStreak, milestoneReached: false }
    }

    if (newStreak > newMax) newMax = newStreak

    await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        max_streak: newMax,
        last_login_date: today
      })
      .eq('profile_id', userId)
    
    // Check milestones (e.g., 7, 30, 100 days)
    const milestones = [7, 30, 100, 365]
    const milestoneReached = milestones.includes(newStreak)

    return { current: newStreak, milestoneReached }
  },

  async getActivityHistory(userId: string, days: number = 365): Promise<string[]> {
    const supabase = createClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('user_activities')
      .select('activity_date')
      .eq('profile_id', userId)
      .gte('activity_date', startDate.toISOString().split('T')[0])
    
    if (error) throw error
    return data.map(a => a.activity_date)
  }
}
