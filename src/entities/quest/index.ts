export interface Quest {
  id: string;
  title: string; // VD: "Đạt 300 XP", "Hoàn thành 2 bài học không sai lỗi"
  type: 'daily' | 'weekly';
  goalType: 'xp' | 'lessons' | 'perfect_exercises' | 'boss_defeats';
  targetValue: number;
  rewardXp: number;
  rewardItem?: string; // VD: 'streak_freeze'
}

export interface QuestProgress {
  userId: string;
  questId: string;
  cycleId: string; // YYYY-MM-DD cho daily, hoặc YYYY-Www cho weekly
  currentValue: number;
  isCompleted: boolean;
  isRewardClaimed: boolean;
}