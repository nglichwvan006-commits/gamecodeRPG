export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  goal_type: 'solve_problems' | 'earn_exp' | 'defeat_boss';
  goal_value: number;
  reward_coins: number;
}

export interface UserDailyQuest {
  id: string;
  profile_id: string;
  daily_quest_id: string;
  current_value: number;
  is_completed: boolean;
  is_claimed: boolean;
  quest_date: string;
  daily_quest: DailyQuest;
}
