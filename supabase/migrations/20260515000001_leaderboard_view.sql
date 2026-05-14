-- Create a view for leaderboard to aggregate metrics
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
    p.id as profile_id,
    p.username,
    p.full_name,
    p.avatar_url,
    c.level,
    c.xp,
    s.current_streak,
    (SELECT COUNT(*) FROM public.submissions sub WHERE sub.profile_id = p.id AND sub.status = 'Passed') as problems_solved,
    (SELECT COUNT(*) FROM public.boss_progress bp WHERE bp.profile_id = p.id AND bp.is_defeated = true) as bosses_defeated
FROM 
    public.profiles p
JOIN 
    public.characters c ON p.id = c.profile_id
LEFT JOIN 
    public.streaks s ON p.id = s.profile_id;

-- Enable RLS for the view (Supabase views inherit RLS from underlying tables, but we can be explicit)
-- Actually, views in Postgres don't have their own RLS, they use the owner's permissions or we can use security invoker.
-- In Supabase, it's recommended to use "security invoker" for views if you want them to respect RLS of underlying tables.

CREATE OR REPLACE VIEW public.leaderboard_view WITH (security_invoker = on) AS
SELECT 
    p.id as profile_id,
    p.username,
    p.full_name,
    p.avatar_url,
    c.level,
    c.xp,
    s.current_streak,
    (SELECT COUNT(*) FROM public.submissions sub WHERE sub.profile_id = p.id AND sub.status = 'Passed') as problems_solved,
    (SELECT COUNT(*) FROM public.boss_progress bp WHERE bp.profile_id = p.id AND bp.is_defeated = true) as bosses_defeated
FROM 
    public.profiles p
JOIN 
    public.characters c ON p.id = c.profile_id
LEFT JOIN 
    public.streaks s ON p.id = s.profile_id;
