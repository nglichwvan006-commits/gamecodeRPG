import { createClient } from '@/utils/supabase/client'
import { useAchievementNotificationStore } from '@/store/use-achievement-notification-store'

export const achievementService = {
  async checkAndUnlockAchievements(userId: string) {
    const supabase = createClient()
    const { addAchievement } = useAchievementNotificationStore.getState()

    // 1. Get all locked achievements for this user
    // We use a join or subquery to find achievements NOT in user_achievements
    const { data: unlockedData } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('profile_id', userId)
    
    const unlockedIds = (unlockedData || []).map(a => a.achievement_id)

    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
    
    if (!allAchievements) return

    const lockedAchievements = allAchievements.filter(a => !unlockedIds.includes(a.id))
    if (lockedAchievements.length === 0) return

    // 2. Gather user stats
    // Count total passed submissions
    const { count: totalPassed } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId)
      .eq('status', 'Passed')

    // Count passed by categories
    const { data: passedSubmissions } = await supabase
      .from('submissions')
      .select(`
        *,
        problems:problem_id (category)
      `)
      .eq('profile_id', userId)
      .eq('status', 'Passed')
    
    const categoryCounts: Record<string, number> = {}
    passedSubmissions?.forEach(sub => {
      const cat = (sub.problems as any)?.category
      if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

    // Get current streak
    const { data: streakData } = await supabase
      .from('streaks')
      .select('current_streak')
      .eq('profile_id', userId)
      .maybeSingle()
    
    const currentStreak = streakData?.current_streak || 0

    // 3. Check each locked achievement
    for (const ach of lockedAchievements) {
      let isUnlocked = false

      if (ach.condition_type === 'problems_solved') {
        if ((totalPassed || 0) >= ach.condition_value) isUnlocked = true
      } 
      else if (ach.condition_type === 'streak_days') {
        if (currentStreak >= ach.condition_value) isUnlocked = true
      }
      else if (ach.condition_type.startsWith('category_solved_')) {
        const category = ach.condition_type.replace('category_solved_', '')
        if ((categoryCounts[category] || 0) >= ach.condition_value) isUnlocked = true
      }

      if (isUnlocked) {
        try {
          await this.unlock(userId, ach)
          addAchievement(ach)
        } catch (err) {
          console.error(`Failed to unlock achievement ${ach.name}:`, err)
        }
      }
    }
  },

  async unlock(userId: string, achievement: any) {
    const supabase = createClient()
    const { error } = await supabase.from('user_achievements').insert({
      profile_id: userId,
      achievement_id: achievement.id
    })
    if (error) throw error
  }
}
