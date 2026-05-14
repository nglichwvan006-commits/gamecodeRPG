export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Weapon' | 'Armor' | 'Accessory' | 'Potion' | 'Material';
  description: string;
  rarity: ItemRarity;
  stats_boost: {
    hp?: number;
    mp?: number;
    attack?: number;
    defense?: number;
    speed?: number;
    xp_boost?: number;
  };
  price: number;
  icon?: string;
}

export interface UserInventoryItem {
  id: string;
  profile_id: string;
  item_id: string;
  quantity: number;
  is_equipped: boolean;
  item: InventoryItem;
}
