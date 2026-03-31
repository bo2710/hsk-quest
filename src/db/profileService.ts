import { db, type UserProfile } from './index';

const DEFAULT_USER_ID = 'local-user';

export const profileService = {
  // 1. Lấy thông tin user hiện tại
  async getProfile(): Promise<UserProfile | undefined> {
    return await db.user_profile.get(DEFAULT_USER_ID);
  },

  // 2. Khởi tạo profile mới (Dùng lúc Onboarding)
  async createProfile(data: Partial<UserProfile>): Promise<void> {
    const newProfile: UserProfile = {
      id: DEFAULT_USER_ID,
      name: data.name || 'HSK Player',
      goal: data.goal || 'hsk_exam',
      target_level: data.target_level || 1,
      daily_time_minutes: data.daily_time_minutes || 10,
      current_estimated_level: data.current_estimated_level || 0,
      created_at: new Date().toISOString(),
      preferences: data.preferences || {
        sound: true,
        romanization: true, // Hiển thị Pinyin
        dark_mode: false,
      }
    };
    await db.user_profile.put(newProfile);
  },

  // 3. Cập nhật cài đặt (Bật/tắt Dark mode, Âm thanh)
  async updatePreferences(prefs: Partial<UserProfile['preferences']>): Promise<void> {
    const profile = await this.getProfile();
    if (profile) {
      await db.user_profile.update(DEFAULT_USER_ID, {
        preferences: { ...profile.preferences, ...prefs }
      });
    }
  }
};