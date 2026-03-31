import { db, type UserProgress, type ExerciseLog } from './index';

export const progressService = {
  // 1. Lấy tiến độ của 1 từ vựng cụ thể
  async getProgress(itemId: string): Promise<UserProgress | undefined> {
    return await db.user_progress.get(itemId);
  },

  // 2. Khởi tạo tiến độ lần đầu cho 1 từ (khi từ chuyển từ "chưa học" sang "đang học")
  async initProgress(itemId: string): Promise<UserProgress> {
    const newProgress: UserProgress = {
      item_id: itemId,
      status: 'new',
      mastery_score: 0,
      stability: 0,
      familiarity: 0,
      last_seen_at: new Date().toISOString(),
      next_review_at: new Date().toISOString(), // Đến hạn ôn ngay lập tức
      times_seen: 0,
      times_correct: 0,
      times_wrong: 0,
      avg_response_ms: 0,
      error_tags: []
    };
    await db.user_progress.put(newProgress);
    return newProgress;
  },

  // 3. Ghi lại lịch sử làm bài (Dùng để chẩn đoán lỗi sau này ở Clinic)
  async logExercise(log: Omit<ExerciseLog, 'id'>): Promise<void> {
     await db.exercise_logs.add(log as ExerciseLog);
  }
};