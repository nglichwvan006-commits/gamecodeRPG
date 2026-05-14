-- Create user_daily_quests table to track progress
CREATE TABLE IF NOT EXISTS public.user_daily_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    daily_quest_id TEXT NOT NULL REFERENCES public.daily_quests(id) ON DELETE CASCADE,
    current_value INT NOT NULL DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    is_claimed BOOLEAN DEFAULT false,
    quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, daily_quest_id, quest_date)
);

-- Enable RLS
ALTER TABLE public.user_daily_quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own daily quests" ON public.user_daily_quests FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can update own daily quests" ON public.user_daily_quests FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own daily quests" ON public.user_daily_quests FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Trigger for updated_at
CREATE TRIGGER set_user_daily_quests_updated_at BEFORE UPDATE ON public.user_daily_quests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed Daily Quests
DELETE FROM public.daily_quests;

INSERT INTO public.daily_quests (id, title, description, goal_type, goal_value, reward_coins) VALUES
('dq-solve-3', 'Daily Coder', 'Solve 3 coding problems today.', 'solve_problems', 3, 100),
('dq-exp-50', 'Quick Learner', 'Earn 50 experience points.', 'earn_exp', 50, 75),
('dq-boss-1', 'Giant Slayer', 'Defeat any world boss.', 'defeat_boss', 1, 500)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    goal_type = EXCLUDED.goal_type,
    goal_value = EXCLUDED.goal_value,
    reward_coins = EXCLUDED.reward_coins;
