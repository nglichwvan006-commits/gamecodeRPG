-- Performance Indexes for frequently queried columns

-- Problems table: Used in filtering and sorting
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_category ON public.problems(category);

-- Submissions table: Used in tracking progress and achievements
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- Leaderboard support: Speed up XP and Level sorting
CREATE INDEX IF NOT EXISTS idx_characters_level_xp ON public.characters(level DESC, xp DESC);

-- Quests support:
CREATE INDEX IF NOT EXISTS idx_user_daily_quests_date_completed ON public.user_daily_quests(quest_date, is_completed);

-- Achievements support:
CREATE INDEX IF NOT EXISTS idx_achievements_condition_type ON public.achievements(condition_type);
