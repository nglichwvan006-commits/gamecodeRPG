import { createClient } from '@/utils/supabase/client'

export interface Boss {
  id: string;
  name: string;
  description: string;
  total_hp: number;
  required_level: number;
  map_id: string;
  problem_id: string;
  reward_pool: {
    coins: number;
    xp: number;
    items?: string[];
    pets?: string[];
  };
  is_defeated?: boolean;
}

export const bossService = {
  async getBossesByMap(mapId: string, userId: string): Promise<Boss[]> {
    const supabase = createClient()
    
    // 1. Get bosses
    const { data: bosses } = await supabase
      .from('bosses')
      .select('*')
      .eq('map_id', mapId)
    
    if (!bosses) return []

    // 2. Check defeat status
    const { data: progress } = await supabase
      .from('boss_progress')
      .select('boss_id, is_defeated')
      .eq('profile_id', userId)
    
    const defeatedIds = new Set((progress || []).filter(p => p.is_defeated).map(p => p.boss_id))

    return bosses.map(b => ({
      ...b,
      is_defeated: defeatedIds.has(b.id)
    }))
  },

  async recordDefeat(userId: string, bossId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('boss_progress')
      .upsert({
        profile_id: userId,
        boss_id: bossId,
        is_defeated: true
      }, { onConflict: 'profile_id, boss_id' })

    if (error) throw error
  }
}
