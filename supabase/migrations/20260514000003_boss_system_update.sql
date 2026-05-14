-- Update bosses table to link with maps and problems
ALTER TABLE public.bosses ADD COLUMN IF NOT EXISTS map_id UUID REFERENCES public.maps(id);
ALTER TABLE public.bosses ADD COLUMN IF NOT EXISTS problem_id UUID REFERENCES public.problems(id);

-- Seed Bosses
INSERT INTO public.bosses (id, name, description, total_hp, required_level, map_id, problem_id, reward_pool) VALUES
('boss-spaghetti-001', 'The Spaghetti Monster', 'A terrifying beast made of entangled, unmaintainable code. Untangle it to win!', 5000, 5, 'map-beginner-001', '99999999-9999-9999-9999-999999999999', '{"coins": 1000, "xp": 2000, "items": ["ffffffff-ffff-ffff-ffff-ffffffffffff"]}')
ON CONFLICT (id) DO UPDATE SET
    map_id = EXCLUDED.map_id,
    problem_id = EXCLUDED.problem_id,
    reward_pool = EXCLUDED.reward_pool;
