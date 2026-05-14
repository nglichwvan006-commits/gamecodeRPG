import { createClient } from '@/utils/supabase/client'
import { MapData, Zone } from '@/types/map'

export const mapService = {
  async getWorldMapData(userId: string): Promise<MapData[]> {
    const supabase = createClient()

    // 1. Get character level
    const { data: character } = await supabase
      .from('characters')
      .select('level')
      .eq('profile_id', userId)
      .single()
    
    const userLevel = character?.level || 1

    // 2. Get all maps, zones, and bosses
    const { data: maps, error: mapsError } = await supabase
      .from('maps')
      .select(`
        *,
        zones (*),
        bosses (*)
      `)
      .order('min_level', { ascending: true })

    if (mapsError) throw mapsError

    // 3. Get completed problems and defeated bosses
    const { data: completedProblems } = await supabase
      .from('submissions')
      .select('problem_id')
      .eq('profile_id', userId)
      .eq('status', 'Passed')
    
    const { data: defeatedBosses } = await supabase
      .from('boss_progress')
      .select('boss_id')
      .eq('profile_id', userId)
      .eq('is_defeated', true)
    
    const completedProblemIds = new Set((completedProblems || []).map(s => s.problem_id))
    const defeatedBossIds = new Set((defeatedBosses || []).map(b => b.boss_id))

    // 4. Enrich map data
    return maps.map(map => {
      const zones = (map.zones || []).map((zone: any) => ({
        ...zone,
        is_completed: completedProblemIds.has(zone.problem_id)
      }))

      const bosses = (map.bosses || []).map((boss: any) => ({
        ...boss,
        is_defeated: defeatedBossIds.has(boss.id),
        is_unlocked: zones.every((z: any) => z.is_completed) // Unlock boss only if all zones are done
      }))

      const totalZones = zones.length + bosses.length
      const completedTasks = zones.filter((z: any) => z.is_completed).length + bosses.filter((b: any) => b.is_defeated).length
      const completionPercentage = totalZones > 0 ? Math.round((completedTasks / totalZones) * 100) : 0

      return {
        ...map,
        zones,
        bosses,
        is_unlocked: userLevel >= map.min_level,
        completion_percentage: completionPercentage
      }
    })
  }
}
