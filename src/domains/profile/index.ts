import { profileRepository } from '../../db/repositories/profileRepository';
import { useAppStore } from '../../store/useAppStore';
import type { UserProfile } from '../../entities/profile';
import type { DailyState } from '../../entities/daily-state';

export const profileDomain = {
  // Hàm này UI sẽ gọi khi user ấn nút "Bắt đầu học" hoặc gõ tên
  loginOrCreate: async (username: string): Promise<string> => {
    const profiles = await profileRepository.getAllProfiles();
    let user = profiles.find(p => p.username === username);

    if (!user) {
      // Nếu chưa có nick, tạo nick mới
      const newProfile: UserProfile = {
        id: crypto.randomUUID(),
        username,
        targetLevel: 1, // Mặc định HSK 1
        dailyGoalMinutes: 15,
        createdAt: Date.now(),
        lastActive: Date.now()
      };
      await profileRepository.createProfile(newProfile);
      user = newProfile;
    } else {
      // Cập nhật thời gian online
      await profileRepository.updateProfile(user.id, { lastActive: Date.now() });
    }

    // Lưu vào Zustand Store để toàn App biết ai đang học
    useAppStore.getState().setActiveUser(user.id);
    return user.id;
  },

  // Lấy trạng thái học tập của ngày hôm nay (VD: nay cày được bao nhiêu XP rồi)
  getTodayState: async (userId: string): Promise<DailyState> => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    let state = await profileRepository.getDailyState(userId, today);

    if (!state) {
      state = {
        userId,
        date: today,
        xpEarned: 0,
        lessonsCompleted: 0,
        isStreakActive: false
      };
      await profileRepository.upsertDailyState(state);
    }
    return state;
  }
};