-- Update achievements seed data with specific requirements
DELETE FROM public.achievements;

INSERT INTO public.achievements (id, name, description, icon, condition_type, condition_value) VALUES
('30303030-3030-3030-3030-303030303030', 'First AC', 'Solve your first coding challenge successfully.', 'Trophy', 'problems_solved', 1),
('40404040-4040-4040-4040-404040404040', 'Bug Hunter', 'Exterminate 10 bugs by solving 10 challenges.', 'Bug', 'problems_solved', 10),
('50505050-5050-5050-5050-505050505050', '7-Day Streak', 'Code for 7 days in a row without breaking your streak.', 'Flame', 'streak_days', 7),
('80808080-8080-8080-8080-808080808080', 'Array Master', 'Conquer the data of arrays by solving 5 array problems.', 'Layout', 'category_solved_Arrays', 5),
('90909090-9090-9090-9090-909090909090', 'Graph Conqueror', 'Navigate through complex nodes by solving 3 graph problems.', 'Zap', 'category_solved_Algorithms', 3);
