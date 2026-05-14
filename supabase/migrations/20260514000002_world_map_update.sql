-- Add specific maps for the world progression
DELETE FROM public.maps;

INSERT INTO public.maps (id, name, description, min_level) VALUES
('map-beginner-001', 'Beginner Village', 'The starting point for all aspiring coders. Learn the basics of syntax and variables.', 1),
('map-arrays-002', 'Forest of Arrays', 'A dense forest where paths repeat. Master loops and array manipulations.', 5),
('map-stack-003', 'Stack Mountain', 'A vertical climb where the last step is always the first to be taken.', 10),
('map-graph-004', 'Graph Kingdom', 'A complex network of interconnected cities. Navigate through nodes and edges.', 15),
('map-dp-005', 'DP Temple', 'A sacred place where small solutions build great answers. Master dynamic programming.', 20)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    min_level = EXCLUDED.min_level;

-- Add zones for each map
DELETE FROM public.zones;

INSERT INTO public.zones (id, map_id, name, description, enemy_type, problem_id) VALUES
-- Beginner Village
('zone-beg-1', 'map-beginner-001', 'Syntax Slime Den', 'Meet your first enemy: a syntax error slime.', 'Slime', '77777777-7777-7777-7777-777777777777'),
-- Forest of Arrays
('zone-arr-1', 'map-arrays-002', 'Infinite Loop Trap', 'Beware of getting stuck forever.', 'Goblin', '88888888-8888-8888-8888-888888888888'),
-- Stack Mountain (Need new problems or use existing ones)
-- For now, let's use Fibonacci for DP Temple
('zone-dp-1', 'map-dp-005', 'Recursive Peak', 'The peak where calls echo endlessly.', 'Golem', '99999999-9999-9999-9999-999999999999');

