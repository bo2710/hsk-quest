export interface UserProfile {
  id: string;
  username: string;
  targetLevel: number; // HSK 1-6
  dailyGoalMinutes: number;
  createdAt: number;
  lastActive: number;
}