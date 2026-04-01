import { db } from '../dexie';
import type { QuestProgress } from '../../entities/quest';

export const questRepository = {
  async getQuestsByCycle(userId: string, cycleId: string) {
    return await db.questProgress.where({ userId, cycleId }).toArray();
  },
  async updateQuestProgress(progress: QuestProgress) {
    return await db.questProgress.put(progress);
  }
};