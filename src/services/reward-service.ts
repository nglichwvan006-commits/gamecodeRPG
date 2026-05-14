import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { dailyQuestService } from './daily-quest-service'

export const rewardService = {
  calculateRequiredExp(level: number) {
    return Math.floor(100 * Math.pow(level, 1.5))
  },

  async awardPlayer(userId: string, difficulty: string, points: number) {
    // Define XP based on difficulty
    const xpReward = difficulty === 'Easy' ? 10 : 
                     difficulty === 'Medium' ? 25 : 
                     difficulty === 'Hard' ? 50 : 100;

    const coinsReward = points * 10;

    return this.awardCustomRewards(userId, xpReward, coinsReward)
  },

  async awardCustomRewards(userId: string, xpReward: number, coinsReward: number) {
    const supabase = createClient()

    // 1. Get current character data
    const { data: character, error: fetchError } = await supabase
      .from('characters')
      .select('xp, level, coins')
      .eq('profile_id', userId)
      .single()

    if (fetchError) throw fetchError

    // Update Daily Quest progress for EXP
    await dailyQuestService.updateProgress(userId, 'earn_exp', xpReward)

    let newXp = character.xp + xpReward
    let newLevel = character.level
    let newCoins = character.coins + coinsReward
    let leveledUp = false

    // Level up logic using the new formula
    let requiredExp = this.calculateRequiredExp(newLevel)
    while (newXp >= requiredExp) {
      newXp -= requiredExp
      newLevel += 1
      leveledUp = true
      requiredExp = this.calculateRequiredExp(newLevel)
    }

    // 2. Update character
    const { error: updateError } = await supabase
      .from('characters')
      .update({
        xp: newXp,
        level: newLevel,
        coins: newCoins
      })
      .eq('profile_id', userId)

    if (updateError) throw updateError

    return {
      leveledUp,
      newLevel,
      xpGained: xpReward,
      coinsGained: coinsReward
    }
  },

  async recordSubmission(userId: string, problemId: string, code: string, status: string, time: number, memory: number) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('submissions')
      .insert({
        profile_id: userId,
        problem_id: problemId,
        code,
        status,
        execution_time: time,
        memory_used: memory
      })

    if (error) console.error('Error recording submission:', error)
  }
}
