import Dexie from 'dexie';
import { db } from '../dexie';
import type { ItemProgress } from '../../entities/progress';
import type { SessionLog } from '../../entities/session-log';

export const progressRepository = {
  // --- SRS (Spaced Repetition) ---
  // Lấy trạng thái học tập của 1 từ vựng cụ thể
  async getItemProgress(userId: string, itemId: string): Promise<ItemProgress | undefined> {
    return await db.itemProgress.where({ userId, itemId }).first();
  },

  // [QUAN TRỌNG] Lưu lại kết quả sau khi User trả lời 1 câu hỏi
  async upsertItemProgress(progress: ItemProgress): Promise<string> {
    return await db.itemProgress.put(progress);
  },

  // Tìm tất cả các từ CẦN ÔN TẬP NGAY HÔM NAY (dùng cho Practice Hub)
  async getDueItems(userId: string, currentDateTimestamp: number): Promise<ItemProgress[]> {
    return await db.itemProgress
      .where('[userId+itemId]')
      .between([userId, Dexie.minKey], [userId, Dexie.maxKey])
      // Lọc ra những từ có nextReviewDate nhỏ hơn hoặc bằng thời điểm hiện tại
      .filter(item => item.nextReviewDate <= currentDateTimestamp && item.state !== 'new')
      .toArray();
  },

  // --- LOGGING ---
  // Ghi lại lịch sử 1 phiên học (Session) để thống kê
  async logSession(sessionLog: SessionLog): Promise<string> {
    return await db.sessionLogs.add(sessionLog);
  },

  // Lấy lịch sử học tập gần đây của User
  async getRecentSessions(userId: string, limit: number = 10): Promise<SessionLog[]> {
    return await db.sessionLogs
      .where('userId')
      .equals(userId)
      .reverse() // Lấy mới nhất lên đầu
      .limit(limit)
      .toArray();
  }
};