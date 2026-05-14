import { describe, it, expect } from 'vitest'
import { getXPForLevel, getLevelFromXP, getTotalXPForLevel } from '../utils/game-logic'

describe('Game Logic - Level Calculations', () => {
  describe('getXPForLevel', () => {
    it('should return 0 for level 1', () => {
      expect(getXPForLevel(1)).toBe(0)
    })

    it('should calculate XP correctly for higher levels', () => {
      // Level 2: 100 * (1.5 ^ 1) = 150
      expect(getXPForLevel(2)).toBe(150)
      // Level 3: 100 * (1.5 ^ 2) = 225
      expect(getXPForLevel(3)).toBe(225)
    })
  })

  describe('getLevelFromXP', () => {
    it('should start at level 1 with 0 XP', () => {
      const result = getLevelFromXP(0)
      expect(result.level).toBe(1)
      expect(result.progress).toBe(0)
    })

    it('should level up when enough XP is provided', () => {
      // Level 2 requires 150 XP
      const result = getLevelFromXP(150)
      expect(result.level).toBe(2)
      expect(result.xpRemaining).toBe(0)
      expect(result.progress).toBe(0)
    })

    it('should calculate progress to next level', () => {
      // Level 2 requires 150 XP, Level 3 requires 225 XP
      // Total 200 XP = Level 2 + 50 XP remaining
      // Progress = 50 / 225 = ~22%
      const result = getLevelFromXP(200)
      expect(result.level).toBe(2)
      expect(result.xpRemaining).toBe(50)
      expect(result.progress).toBe(22)
    })

    it('should handle high XP amounts', () => {
      const totalXPForLevel5 = getTotalXPForLevel(5) // sum(150, 225, 337, 506) = 1218
      const result = getLevelFromXP(totalXPForLevel5)
      expect(result.level).toBe(5)
      expect(result.xpRemaining).toBe(0)
    })
  })
})
