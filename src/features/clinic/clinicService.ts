import { db } from '../../db';

export const clinicService = {
  // Lấy danh sách các từ vựng đang bị "thương" (sai nhiều hoặc yếu)
  async getFragileItems() {
    return await db.user_progress
      .where('status')
      .anyOf(['fragile', 'leech'])
      .toArray();
  },

  // Thống kê nhanh tình trạng sức khỏe của kho từ vựng
  async getHealthStats() {
    const total = await db.user_progress.count();
    const fragile = await db.user_progress.where('status').equals('fragile').count();
    const mastered = await db.user_progress.where('status').equals('mastered').count();
    
    return {
      total,
      fragile,
      mastered,
      healthPercentage: total === 0 ? 100 : Math.round(((total - fragile) / total) * 100)
    };
  }
};