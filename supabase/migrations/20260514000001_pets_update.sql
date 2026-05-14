-- Add specific pets for the system
INSERT INTO public.pets (id, name, description, buff_type, buff_value, rarity) VALUES
('dragon-001-uuid', 'Baby Dragon', 'A tiny but fierce dragon that increases your attack power.', 'attack_boost', 15, 'Epic'),
('fox-001-uuid', 'Cyber Fox', 'An agile fox with neon fur that boosts your speed and agility.', 'speed_boost', 10, 'Rare'),
('cat-001-uuid', 'Shadow Cat', 'A mysterious feline that hides in the shadows, increasing your MP regeneration.', 'mp_regen', 5, 'Legendary')
ON CONFLICT (id) DO NOTHING;
