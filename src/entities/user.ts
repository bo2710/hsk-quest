export interface UserProfile {
  id: string; // UUID
  username: string;
  email?: string; // Dành cho tính năng Sync cloud
  passwordHash?: string; // Tùy chọn nếu làm local auth strict
  targetLevel: number; // HSK 1-6
  dailyGoalMinutes: number;
  createdAt: number;
  lastLogin: number;
  isGuest: boolean;
}

export interface DailyState {
  userId: string;
  date: string; // YYYY-MM-DD
  streak: number;
  todayXp: number;
  lessonsCompleted: number;
  questStatus: Record<string, boolean>; // id -> done?
}