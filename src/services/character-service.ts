import { createClient } from '@/utils/supabase/client'

export const characterService = {
  async getCharacterData(userId: string) {
    const supabase = createClient()
    
    // Fetch character, class info, and profile in one go if possible, 
    // but here we'll use separate or joined queries for clarity
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        classes:class_id (*),
        profiles:profile_id (*)
      `)
      .eq('profile_id', userId)
      .single()

    if (error) throw error
    return data
  },

  async getActivePet(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_pets')
      .select(`
        *,
        pets:pet_id (*)
      `)
      .eq('profile_id', userId)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    return data
  },

  async getDailyQuests() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('daily_quests')
      .select('*')
      .limit(3)

    if (error) throw error
    return data
  },

  async getRecentAchievements(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements:achievement_id (*)
      `)
      .eq('profile_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(4)

    if (error) throw error
    return data
  },

  async getStreak(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle()

    if (error) throw error
    return data
  }
}
