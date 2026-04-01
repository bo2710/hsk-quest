export interface Achievement {
  id: string; // VD: 'streak-7-days', 'vocab-100'
  title: string;
  description: string;
  iconUrl: string; // Đường dẫn tới public/images/badges/
  requirementType: 'xp' | 'streak' | 'words_mastered' | 'perfect_lessons';
  targetValue: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: number; // Timestamp
  progress: number; // Tiến độ hiện tại (VD: đã học 50/100 từ)
}