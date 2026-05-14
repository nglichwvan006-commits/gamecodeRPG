import { createClient } from '@/utils/supabase/client'
import { UserDailyQuest, DailyQuest } from '@/types/quest'

export const dailyQuestService = {
  async getDailyQuests(userId: string): Promise<UserDailyQuest[]> {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]

    // 1. Fetch user's quests for today
    const { data: userQuests, error: fetchError } = await supabase
      .from('user_daily_quests')
      .select(`
        *,
        daily_quest:daily_quests (*)
      `)
      .eq('profile_id', userId)
      .eq('quest_date', today)
    
    if (fetchError) throw fetchError
    
    if (userQuests && userQuests.length > 0) {
      return userQuests as unknown as UserDailyQuest[]
    }

    // 2. If no quests for today, initialize them
    const { data: allQuests, error: allQuestsError } = await supabase
      .from('daily_quests')
      .select('*')
    
    if (allQuestsError) throw allQuestsError
    if (!allQuests || allQuests.length === 0) return []

    const newQuests = allQuests.map(q => ({
      profile_id: userId,
      daily_quest_id: q.id,
      quest_date: today,
      current_value: 0,
      is_completed: false,
      is_claimed: false
    }))

    const { data: createdQuests, error: insertError } = await supabase
      .from('user_daily_quests')
      .insert(newQuests)
      .select(`
        *,
        daily_quest:daily_quests (*)
      `)
    
    if (insertError) {
      // Handle potential race condition if another process inserted quests at the same time
      if (insertError.code === '23505') { // unique_violation
        return this.getDailyQuests(userId)
      }
      throw insertError
    }

    return createdQuests as unknown as UserDailyQuest[]
  },

  async updateProgress(userId: string, goalType: DailyQuest['goal_type'], increment: number) {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]

    // 1. Get user quest of this type for today that are not yet completed
    const { data: userQuests, error: fetchError } = await supabase
      .from('user_daily_quests')
      .select(`
        *,
        daily_quest:daily_quests (*)
      `)
      .eq('profile_id', userId)
      .eq('quest_date', today)
      .eq('is_completed', false)
    
    if (fetchError || !userQuests) return

    const targetQuests = userQuests.filter(uq => (uq.daily_quest as unknown as DailyQuest).goal_type === goalType)
    
    for (const quest of targetQuests) {
      const dailyQuest = quest.daily_quest as unknown as DailyQuest
      const newValue = Math.min(quest.current_value + increment, dailyQuest.goal_value)
      const isCompleted = newValue >= dailyQuest.goal_value

      await supabase
        .from('user_daily_quests')
        .update({
          current_value: newValue,
          is_completed: isCompleted
        })
        .eq('id', quest.id)
    }
  },

  async claimReward(userId: string, userQuestId: string) {
    const supabase = createClient()

    // 1. Get quest and check completion
    const { data: quest, error: fetchError } = await supabase
      .from('user_daily_quests')
      .select(`
        *,
        daily_quest:daily_quests (*)
      `)
      .eq('id', userQuestId)
      .single()
    
    if (fetchError || !quest || !quest.is_completed || quest.is_claimed) {
      throw new Error('Quest not found, not completed, or already claimed.')
    }

    // 2. Mark as claimed
    const { error: updateQuestError } = await supabase
      .from('user_daily_quests')
      .update({ is_claimed: true })
      .eq('id', userQuestId)

    if (updateQuestError) throw updateQuestError

    // 3. Award coins to character
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('coins')
      .eq('profile_id', userId)
      .single()
    
    if (charError) throw charError

    if (character) {
      const rewardCoins = (quest.daily_quest as unknown as DailyQuest).reward_coins
      const { error: updateCharError } = await supabase
        .from('characters')
        .update({ coins: character.coins + rewardCoins })
        .eq('profile_id', userId)
      
      if (updateCharError) throw updateCharError
      return rewardCoins
    }
    
    return 0
  }
}
