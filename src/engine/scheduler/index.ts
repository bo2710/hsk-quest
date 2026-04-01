import type { ItemProgress } from '../../entities/progress';

export const srsScheduler = {
  // Hàm dự đoán lần học tiếp theo (Dựa trên thuật toán SM-2)
  predictNextReview: (current: ItemProgress, isCorrect: boolean): ItemProgress => {
    let { stability, difficulty, lapses, state } = current;

    if (isCorrect) {
      // Nếu đúng: tăng độ bền (stability) để ngày ôn xa hơn
      stability = state === 'new' ? 1 : stability * (2 + (5 - difficulty) / 10);
      state = 'review';
    } else {
      // Nếu sai: reset stability và tăng số lần hỏng (lapses)
      stability = 0.2; // Ôn lại nhanh thôi
      lapses += 1;
      state = 'relearning';
    }

    // Tính ra timestamp của ngày ôn tập tiếp theo
    const nextReviewDate = Date.now() + stability * 24 * 60 * 60 * 1000;

    return { ...current, stability, state, lapses, nextReviewDate };
  }
};