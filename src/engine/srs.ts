import { type UserProgress } from '../db';

export const srsEngine = {
  // Tính toán trạng thái mới dựa trên kết quả làm bài
  calculateNextReview(current: UserProgress, isCorrect: boolean): Partial<UserProgress> {
    let { stability, times_correct, times_wrong, times_seen } = current;
    
    times_seen += 1;
    if (isCorrect) {
      times_correct += 1;
      // Nếu đúng, tăng độ ổn định (stability) gấp đôi
      stability = stability === 0 ? 1 : stability * 2;
    } else {
      times_wrong += 1;
      // Nếu sai, reset độ ổn định về mức thấp (fragile)
      stability = 0.5;
    }

    // Tính ngày tiếp theo dựa trên stability (đơn vị: ngày)
    const now = new Date();
    const nextReview = new Date(now.getTime() + stability * 24 * 60 * 60 * 1000);

    return {
      stability,
      times_seen,
      times_correct,
      times_wrong,
      last_seen_at: now.toISOString(),
      next_review_at: nextReview.toISOString(),
      status: stability > 4 ? 'mastered' : stability < 1 ? 'fragile' : 'learning'
    };
  }
};