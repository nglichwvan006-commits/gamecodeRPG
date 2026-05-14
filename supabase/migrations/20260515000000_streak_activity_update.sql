-- Create user_activities table for heatmap tracking
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own activities" ON public.user_activities FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Create index for faster lookups
CREATE INDEX idx_user_activities_profile_date ON public.user_activities(profile_id, activity_date);

-- Add milestone_rewards column to streaks if not exists (for future expansion)
-- ALTER TABLE public.streaks ADD COLUMN IF NOT EXISTS claimed_milestones INT[] DEFAULT '{}';
