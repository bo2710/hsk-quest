import { db } from '../dexie';
import type { UserProfile } from '../../entities/profile';
import type { DailyState } from '../../entities/daily-state';

export const profileRepository = {
  // --- THAO TÁC VỚI PROFILE ---
  async createProfile(profile: UserProfile): Promise<string> {
    return await db.profiles.add(profile);
  },
  
  async getProfile(id: string): Promise<UserProfile | undefined> {
    return await db.profiles.get(id);
  },

  async getAllProfiles(): Promise<UserProfile[]> {
    return await db.profiles.toArray();
  },

  async updateProfile(id: string, changes: Partial<UserProfile>): Promise<number> {
    return await db.profiles.update(id, changes);
  },

  // --- THAO TÁC VỚI DAILY STATE (Chuỗi ngày học) ---
  async getDailyState(userId: string, date: string): Promise<DailyState | undefined> {
    // date phải ở định dạng chuẩn, VD: '2026-04-01'
    return await db.dailyStates.where({ userId, date }).first();
  },

  async upsertDailyState(state: DailyState): Promise<string> {
    // put() sẽ tạo mới nếu chưa có, hoặc ghi đè nếu đã tồn tại khóa chính (userId+date)
    return await db.dailyStates.put(state);
  }
};