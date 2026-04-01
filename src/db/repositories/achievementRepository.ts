import { db } from '../dexie';
import type { UserAchievement } from '../../entities/achievement';

export const achievementRepository = {
  // Thêm Promise<UserAchievement[]> vào đây để xài cái type vừa import
  async getUnlockedAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.userAchievements.where('userId').equals(userId).toArray();
  },
  
  async updateProgress(userId: string, achievementId: string, progress: number): Promise<string> {
    // Ép kiểu object này về UserAchievement để xài type
    const achievement: UserAchievement = {
      userId,
      achievementId,
      progress,
      unlockedAt: Date.now()
    };
    return await db.userAchievements.put(achievement);
  }
};