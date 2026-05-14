import { createClient } from '@/utils/supabase/client'

export interface LeaderboardEntry {
  profile_id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  level: number;
  xp: number;
  current_streak: number;
  problems_solved: number;
  bosses_defeated: number;
}

export type LeaderboardMetric = 'level' | 'xp' | 'problems_solved' | 'bosses_defeated' | 'current_streak';

export const leaderboardService = {
  async getLeaderboard(metric: LeaderboardMetric = 'level', limit: number = 50): Promise<LeaderboardEntry[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .order(metric, { ascending: false })
      .order('xp', { ascending: false }) // Secondary sort by XP
      .limit(limit)
    
    if (error) throw error
    return data as LeaderboardEntry[]
  }
}
