import { describe, it, expect, vi, beforeEach } from 'vitest'
import { achievementService } from '@/services/achievement-service'
import { mockSupabase } from './setup'

vi.mock('@/store/use-achievement-notification-store', () => ({
  useAchievementNotificationStore: {
    getState: () => ({
      addAchievement: vi.fn()
    })
  }
}))

describe('Achievement Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should unlock achievement manually', async () => {
    const userId = 'user-1'
    const achievement = { id: 'ach-1', name: 'First Blood' }
    
    mockSupabase.insert.mockResolvedValue({ error: null })

    await achievementService.unlock(userId, achievement)
    
    expect(mockSupabase.from).toHaveBeenCalledWith('user_achievements')
    expect(mockSupabase.insert).toHaveBeenCalledWith({
      profile_id: userId,
      achievement_id: achievement.id
    })
  })
})
