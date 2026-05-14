-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-----------------------------------------
-- 1. PROFILES
-----------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 2. CLASSES
-----------------------------------------
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    base_hp INT NOT NULL DEFAULT 100,
    base_mp INT NOT NULL DEFAULT 50,
    icon VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 3. CHARACTERS
-----------------------------------------
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    level INT NOT NULL DEFAULT 1,
    xp INT NOT NULL DEFAULT 0,
    hp INT NOT NULL DEFAULT 100,
    mp INT NOT NULL DEFAULT 50,
    coins INT NOT NULL DEFAULT 0,
    gems INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id)
);

CREATE TRIGGER set_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_characters_profile_id ON characters(profile_id);

-----------------------------------------
-- 4. PROBLEMS
-----------------------------------------
CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Epic')),
    points INT NOT NULL DEFAULT 10,
    xp_reward INT NOT NULL DEFAULT 50,
    test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    initial_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_problems_updated_at BEFORE UPDATE ON problems FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 5. SUBMISSIONS
-----------------------------------------
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Passed', 'Failed')),
    execution_time FLOAT,
    memory_used FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_submissions_profile_id ON submissions(profile_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);

-----------------------------------------
-- 6. ACHIEVEMENTS
-----------------------------------------
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255),
    condition_type VARCHAR(50) NOT NULL,
    condition_value INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 7. USER_ACHIEVEMENTS
-----------------------------------------
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, achievement_id)
);

CREATE INDEX idx_user_achievements_profile_id ON user_achievements(profile_id);

-----------------------------------------
-- 8. INVENTORY_ITEMS
-----------------------------------------
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    stats_boost JSONB,
    price INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 9. USER_INVENTORY
-----------------------------------------
CREATE TABLE user_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, item_id)
);

CREATE TRIGGER set_user_inventory_updated_at BEFORE UPDATE ON user_inventory FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_user_inventory_profile_id ON user_inventory(profile_id);

-----------------------------------------
-- 10. PETS
-----------------------------------------
CREATE TABLE pets (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    buff_type VARCHAR(50),
    buff_value FLOAT,
    rarity VARCHAR(20) CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 11. USER_PETS
-----------------------------------------
CREATE TABLE user_pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT false,
    level INT NOT NULL DEFAULT 1,
    xp INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_user_pets_updated_at BEFORE UPDATE ON user_pets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_user_pets_profile_id ON user_pets(profile_id);

-----------------------------------------
-- 12. MAPS
-----------------------------------------
CREATE TABLE maps (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_maps_updated_at BEFORE UPDATE ON maps FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 13. ZONES
-----------------------------------------
CREATE TABLE zones (
    id TEXT PRIMARY KEY,
    map_id TEXT NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    enemy_type VARCHAR(100),
    problem_id UUID REFERENCES problems(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_zones_updated_at BEFORE UPDATE ON zones FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_zones_map_id ON zones(map_id);

-----------------------------------------
-- 14. QUESTS
-----------------------------------------
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    zone_id TEXT REFERENCES zones(id) ON DELETE CASCADE,
    reward_xp INT NOT NULL DEFAULT 0,
    reward_coins INT NOT NULL DEFAULT 0,
    reward_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_quests_updated_at BEFORE UPDATE ON quests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_quests_zone_id ON quests(zone_id);

-----------------------------------------
-- 15. USER_QUESTS
-----------------------------------------
CREATE TABLE user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('Active', 'Completed', 'Failed')),
    progress INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, quest_id)
);

CREATE TRIGGER set_user_quests_updated_at BEFORE UPDATE ON user_quests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_user_quests_profile_id ON user_quests(profile_id);

-----------------------------------------
-- 16. DAILY_QUESTS
-----------------------------------------
CREATE TABLE daily_quests (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) NOT NULL,
    goal_value INT NOT NULL,
    reward_coins INT NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_daily_quests_updated_at BEFORE UPDATE ON daily_quests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 17. STREAKS
-----------------------------------------
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    max_streak INT NOT NULL DEFAULT 0,
    last_login_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id)
);

CREATE TRIGGER set_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_streaks_profile_id ON streaks(profile_id);

-----------------------------------------
-- 18. BOSSES
-----------------------------------------
CREATE TABLE bosses (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_hp INT NOT NULL,
    required_level INT NOT NULL DEFAULT 1,
    reward_pool JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_bosses_updated_at BEFORE UPDATE ON bosses FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-----------------------------------------
-- 19. BOSS_PROGRESS
-----------------------------------------
CREATE TABLE boss_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    boss_id TEXT NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,
    damage_dealt INT NOT NULL DEFAULT 0,
    is_defeated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, boss_id)
);

CREATE TRIGGER set_boss_progress_updated_at BEFORE UPDATE ON boss_progress FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX idx_boss_progress_profile_id ON boss_progress(profile_id);
CREATE INDEX idx_boss_progress_boss_id ON boss_progress(boss_id);

-----------------------------------------
-- ROW LEVEL SECURITY (RLS)
-----------------------------------------

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_progress ENABLE ROW LEVEL SECURITY;

-- Public read access policies for global entities
CREATE POLICY "Public classes are viewable by everyone" ON classes FOR SELECT USING (true);
CREATE POLICY "Public problems are viewable by everyone" ON problems FOR SELECT USING (true);
CREATE POLICY "Public achievements are viewable by everyone" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public inventory_items are viewable by everyone" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Public pets are viewable by everyone" ON pets FOR SELECT USING (true);
CREATE POLICY "Public maps are viewable by everyone" ON maps FOR SELECT USING (true);
CREATE POLICY "Public zones are viewable by everyone" ON zones FOR SELECT USING (true);
CREATE POLICY "Public quests are viewable by everyone" ON quests FOR SELECT USING (true);
CREATE POLICY "Public daily_quests are viewable by everyone" ON daily_quests FOR SELECT USING (true);
CREATE POLICY "Public bosses are viewable by everyone" ON bosses FOR SELECT USING (true);

-- User-specific data policies (Select, Insert, Update for owned rows based on auth.uid())

-- profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- characters
CREATE POLICY "Users can view all characters" ON characters FOR SELECT USING (true);
CREATE POLICY "Users can insert own character" ON characters FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own character" ON characters FOR UPDATE USING (auth.uid() = profile_id);

-- submissions
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own submission" ON submissions FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- user_achievements
CREATE POLICY "Users can view all user_achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "System inserts user_achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- user_inventory
CREATE POLICY "Users can view own inventory" ON user_inventory FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert to own inventory" ON user_inventory FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own inventory" ON user_inventory FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete from own inventory" ON user_inventory FOR DELETE USING (auth.uid() = profile_id);

-- user_pets
CREATE POLICY "Users can view all user_pets" ON user_pets FOR SELECT USING (true);
CREATE POLICY "Users can insert own pet" ON user_pets FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own pet" ON user_pets FOR UPDATE USING (auth.uid() = profile_id);

-- user_quests
CREATE POLICY "Users can view own user_quests" ON user_quests FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own user_quests" ON user_quests FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own user_quests" ON user_quests FOR UPDATE USING (auth.uid() = profile_id);

-- streaks
CREATE POLICY "Users can view own streaks" ON streaks FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own streaks" ON streaks FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own streaks" ON streaks FOR UPDATE USING (auth.uid() = profile_id);

-- boss_progress
CREATE POLICY "Users can view all boss_progress" ON boss_progress FOR SELECT USING (true);
CREATE POLICY "Users can insert own boss_progress" ON boss_progress FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own boss_progress" ON boss_progress FOR UPDATE USING (auth.uid() = profile_id);
