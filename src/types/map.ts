export interface Zone {
  id: string;
  map_id: string;
  name: string;
  description: string;
  enemy_type: string;
  problem_id: string;
  is_completed?: boolean;
}

export interface MapData {
  id: string;
  name: string;
  description: string;
  min_level: number;
  zones: Zone[];
  bosses: any[];
  is_unlocked: boolean;
  completion_percentage: number;
}
