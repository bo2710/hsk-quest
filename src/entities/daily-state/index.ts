export interface DailyState {
  userId: string;
  date: string; // YYYY-MM-DD
  xpEarned: number;
  lessonsCompleted: number;
  isStreakActive: boolean;
}