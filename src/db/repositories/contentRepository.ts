import { db } from '../dexie';
import type { ContentItem } from '../../entities/item';
import type { Lesson } from '../../entities/lesson';
import type { Unit } from '../../entities/unit';
import type { Course } from '../../entities/course';

export const contentRepository = {
  // Lấy toàn bộ lộ trình (Course) - Dùng cho màn hình Path chính
  async getAllCourses(): Promise<Course[]> {
    return await db.courses.toArray();
  },

  // Lấy danh sách Unit của một Course cụ thể (VD: HSK 1)
  async getUnitsByCourse(courseId: string): Promise<Unit[]> {
    return await db.units.where('courseId').equals(courseId).toArray();
  },

  // Lấy tất cả Lesson trong một Unit
  async getLessonsByUnit(unitId: string): Promise<Lesson[]> {
    return await db.lessons.where('unitId').equals(unitId).toArray();
  },

  // [QUAN TRỌNG] Lấy data của 1 bài học cụ thể để tống vào Engine sinh Session
  async getLessonById(lessonId: string): Promise<Lesson | undefined> {
    return await db.lessons.get(lessonId);
  },

  // Lôi danh sách từ vựng/ngữ pháp (ContentItem) dựa trên list ID
  async getItemsByIds(itemIds: string[]): Promise<ContentItem[]> {
    // Dexie hỗ trợ bulkGet để query nhiều ID cùng lúc rất nhanh
    return await db.contentItems.bulkGet(itemIds) as ContentItem[];
  },

  // Lấy ngẫu nhiên từ gây nhiễu (distractors) cùng cấp HSK để làm câu hỏi trắc nghiệm
  async getDistractors(hskLevel: number, limit: number): Promise<ContentItem[]> {
    const allItemsInLevel = await db.contentItems.where('hskLevel').equals(hskLevel).toArray();
    // Shuffle mảng (thuật toán Fisher-Yates đơn giản)
    for (let i = allItemsInLevel.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allItemsInLevel[i], allItemsInLevel[j]] = [allItemsInLevel[j], allItemsInLevel[i]];
    }
    return allItemsInLevel.slice(0, limit);
  }
};