export type PetRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface Pet {
  id: string;
  name: string;
  description: string;
  buff_type: 'attack_boost' | 'speed_boost' | 'mp_regen' | 'xp_boost' | 'hp_boost';
  buff_value: number;
  rarity: PetRarity;
  icon?: string;
}

export interface UserPet {
  id: string;
  profile_id: string;
  pet_id: string;
  is_active: boolean;
  level: number;
  xp: number;
  pet: Pet;
  created_at?: string;
}
