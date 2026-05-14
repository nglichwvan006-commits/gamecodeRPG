/**
 * Game logic utilities for RPG mechanics
 */

export const GAME_CONSTANTS = {
  BASE_XP: 100,
  XP_MULTIPLIER: 1.5,
  MAX_LEVEL: 100,
}

/**
 * Calculate the XP required to reach a specific level
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0
  // Formula: floor(100 * (1.5 ^ (level - 1)))
  // Or a more linear/quadratic approach
  return Math.floor(GAME_CONSTANTS.BASE_XP * Math.pow(GAME_CONSTANTS.XP_MULTIPLIER, level - 1))
}

/**
 * Calculate cumulative XP required to reach a specific level from level 1
 */
export function getTotalXPForLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i + 1)
  }
  return total
}

/**
 * Determine current level and progress based on total XP
 */
export function getLevelFromXP(totalXP: number) {
  let level = 1
  let xpRemaining = totalXP
  
  while (true) {
    const nextLevelXP = getXPForLevel(level + 1)
    if (xpRemaining >= nextLevelXP && level < GAME_CONSTANTS.MAX_LEVEL) {
      xpRemaining -= nextLevelXP
      level++
    } else {
      break
    }
  }

  const xpToNextLevel = getXPForLevel(level + 1)
  const progress = Math.min(100, Math.floor((xpRemaining / xpToNextLevel) * 100))

  return {
    level,
    xpRemaining,
    xpToNextLevel,
    progress
  }
}
