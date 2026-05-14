-- Add is_equipped to user_inventory and rarity to inventory_items
ALTER TABLE public.user_inventory ADD COLUMN IF NOT EXISTS is_equipped BOOLEAN DEFAULT false;
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS rarity VARCHAR(20) DEFAULT 'Common' CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary', 'Mythic'));
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS icon VARCHAR(255);
