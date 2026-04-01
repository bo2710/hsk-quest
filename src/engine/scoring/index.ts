export type QualityGrading = 'perfect' | 'correct_slow' | 'hesitant' | 'wrong_close' | 'wrong';

export const scoringEngine = {
  // Tính XP: Từ khó + Trả lời nhanh/chuẩn = Nhiều điểm
  calculateXp: (grading: QualityGrading, difficulty: number): number => {
    const weights: Record<QualityGrading, number> = {
      perfect: 15,
      correct_slow: 10,
      hesitant: 5,
      wrong_close: 2,
      wrong: 0
    };
    return Math.round(weights[grading] * (1 + difficulty / 10));
  },

  // Tự động đánh giá dựa trên thời gian (giây)
  evaluateResponse: (isCorrect: boolean, timeSec: number): QualityGrading => {
    if (!isCorrect) return 'wrong';
    if (timeSec < 2.5) return 'perfect';
    if (timeSec < 6) return 'correct_slow';
    return 'hesitant';
  }
};