import { achievementRepository } from '../../db/repositories/achievementRepository';
import type { SessionLog } from '../../entities/session-log';

export const achievementsDomain = {
  // Hàm này gọi ngầm sau khi kết thúc 1 phiên học
  checkPostSessionUnlocks: async (userId: string, session: SessionLog) => {
    const newlyUnlocked: string[] = [];

    // Danh hiệu 1: Cỗ máy hoàn hảo (Hoàn thành bài học không sai câu nào)
    if (session.correctExercises === session.totalExercises && session.totalExercises > 5) {
      await achievementRepository.updateProgress(userId, 'perfect-machine', 1);
      newlyUnlocked.push('perfect-machine');
    }

    // Danh hiệu 2: Kẻ săn điểm (Cày được > 100 XP trong 1 session)
    if (session.xpEarned >= 100) {
      await achievementRepository.updateProgress(userId, 'xp-hunter', 1);
      newlyUnlocked.push('xp-hunter');
    }

    return newlyUnlocked; // Trả về list ID để UI hiển thị Toast Popup chúc mừng
  }
};