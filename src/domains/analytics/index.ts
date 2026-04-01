import { progressRepository } from '../../db/repositories/progressRepository';

export const analyticsDomain = {
  // Thống kê XP trong 7 ngày gần nhất để vẽ biểu đồ Cột
  getWeeklyActivity: async (userId: string) => {
    const recentLogs = await progressRepository.getRecentSessions(userId, 50);
    const xpPerDay: Record<string, number> = {};

    // Gom nhóm XP theo ngày
    recentLogs.forEach(log => {
      // Chuyển timestamp thành YYYY-MM-DD
      const dateStr = new Date(log.startTime).toISOString().split('T')[0];
      if (!xpPerDay[dateStr]) xpPerDay[dateStr] = 0;
      xpPerDay[dateStr] += log.xpEarned;
    });

    return Object.entries(xpPerDay).map(([date, xp]) => ({ date, xp }));
  },

  // Tính tỷ lệ chính xác tổng thể (Accuracy Rate)
  getOverallAccuracy: async (userId: string): Promise<number> => {
    const logs = await progressRepository.getRecentSessions(userId, 100);
    if (logs.length === 0) return 0;

    let totalExercises = 0;
    let totalCorrect = 0;

    logs.forEach(log => {
      totalExercises += log.totalExercises;
      totalCorrect += log.correctExercises;
    });

    return totalExercises === 0 ? 0 : Math.round((totalCorrect / totalExercises) * 100);
  }
};