-- Seed Data for Code Adventure RPG

-- 1. CLASSES
INSERT INTO classes (id, name, description, base_hp, base_mp, icon) VALUES
('11111111-1111-1111-1111-111111111111', 'Warrior', 'Specializes in C++. High HP and strong memory management skills.', 150, 30, 'Sword'),
('22222222-2222-2222-2222-222222222222', 'Mage', 'Specializes in Python. High MP and powerful data manipulation spells.', 80, 100, 'Wand'),
('33333333-3333-3333-3333-333333333333', 'Assassin', 'Specializes in JavaScript. High speed and event-driven agility.', 100, 60, 'Zap'),
('44444444-4444-4444-4444-444444444444', 'Engineer', 'Specializes in C#. Balanced stats with strong structural design.', 120, 50, 'Cog')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_hp = EXCLUDED.base_hp,
    base_mp = EXCLUDED.base_mp,
    icon = EXCLUDED.icon;

-- 2. MAPS
INSERT INTO maps (id, name, description, min_level) VALUES
('44444444-4444-4444-4444-444444444444', 'Beginner Village', 'The starting point for all aspiring coders. Learn the basics of syntax.', 1),
('55555555-5555-5555-5555-555555555555', 'Forest of Loops', 'A dense forest where paths repeat. Master loops and arrays here.', 5),
('66666666-6666-6666-6666-666666666666', 'Mountain of Objects', 'A rocky terrain filled with structured data. Conquer objects and classes.', 10)
ON CONFLICT (id) DO NOTHING;

-- 3. PROBLEMS
INSERT INTO problems (id, title, description, difficulty, points, xp_reward, test_cases, initial_code) VALUES
('77777777-7777-7777-7777-777777777777', 'Hello World', 'Write a function that returns the string "Hello World".', 'Easy', 10, 50, '[{"input": [], "expected": "Hello World"}]', 'function helloWorld() {\n  // Write your code here\n}'),
('88888888-8888-8888-8888-888888888888', 'Sum of Array', 'Given an array of integers, return the sum of all elements.', 'Easy', 20, 100, '[{"input": [[1, 2, 3]], "expected": 6}, {"input": [[10, -5, 5]], "expected": 10}]', 'function sumArray(arr) {\n  // Write your code here\n}'),
('99999999-9999-9999-9999-999999999999', 'Fibonacci Sequence', 'Return the nth number in the Fibonacci sequence.', 'Medium', 50, 250, '[{"input": [5], "expected": 5}, {"input": [10], "expected": 55}]', 'function fibonacci(n) {\n  // Write your code here\n}')
ON CONFLICT (id) DO NOTHING;

-- 4. ZONES (Linked to Maps and Problems)
INSERT INTO zones (id, map_id, name, description, enemy_type, problem_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Syntax Slime Den', 'A muddy area full of syntax errors.', 'Slime', '77777777-7777-7777-7777-777777777777'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Infinite Loop Trap', 'Beware of getting stuck forever.', 'Goblin', '88888888-8888-8888-8888-888888888888'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', 'Recursive Peak', 'The peak where calls echo endlessly.', 'Golem', '99999999-9999-9999-9999-999999999999')
ON CONFLICT (id) DO NOTHING;

-- 5. INVENTORY ITEMS
INSERT INTO inventory_items (id, name, type, description, stats_boost, price) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Health Potion', 'Potion', 'Restores 50 HP.', '{"hp": 50}', 20),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Mana Potion', 'Potion', 'Restores 30 MP.', '{"mp": 30}', 20),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Iron Sword', 'Weapon', 'Increases attack power.', '{"attack": 10}', 100)
ON CONFLICT (id) DO NOTHING;

-- 6. PETS
INSERT INTO pets (id, name, description, buff_type, buff_value, rarity) VALUES
('10101010-1010-1010-1010-101010101010', 'Rubber Duck', 'Your trusty debugging companion. Helps you find errors faster.', 'xp_boost', 1.1, 'Common'),
('20202020-2020-2020-2020-202020202020', 'Code Owl', 'A wise owl that increases MP regeneration.', 'mp_regen', 5, 'Rare')
ON CONFLICT (id) DO NOTHING;

-- 7. ACHIEVEMENTS
INSERT INTO achievements (id, name, description, icon, condition_type, condition_value) VALUES
('30303030-3030-3030-3030-303030303030', 'First Blood', 'Complete your first coding problem.', 'Trophy', 'problems_solved', 1),
('40404040-4040-4040-4040-404040404040', 'Bug Hunter', 'Solve 10 problems.', 'Bug', 'problems_solved', 10),
('50505050-5050-5050-5050-505050505050', 'Rich Kid', 'Accumulate 1000 coins.', 'Coin', 'coins_earned', 1000)
ON CONFLICT (id) DO NOTHING;

-- 8. BOSSES
INSERT INTO bosses (id, name, description, total_hp, required_level, reward_pool) VALUES
('60606060-6060-6060-6060-606060606060', 'The Spaghetti Monster', 'A terrifying beast made of entangled, unmaintainable code.', 5000, 5, '{"coins": 500, "xp": 1000, "item_drops": ["ffffffff-ffff-ffff-ffff-ffffffffffff"]}'),
('70707070-7070-7070-7070-707070707070', 'Null Pointer Exception', 'An invisible assassin that strikes when you least expect it.', 10000, 10, '{"coins": 1000, "xp": 2500}')
ON CONFLICT (id) DO NOTHING;
