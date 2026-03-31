import Dexie, { type Table } from 'dexie';

// 1. Import User
import type { UserProfile, DailyState } from '../entities/user';
// 2. Import Content
import type { Course, Unit, Lesson, ContentItem } from '../entities/content';
// 3. Import Progress (Cái ông vừa tạo xong đây)
import type { ItemProgress, LessonProgress, SessionLog } from '../entities/progress';

export class HSKDatabase extends Dexie {
  // Auth & User
  profiles!: Table<UserProfile, string>;
  dailyStates!: Table<DailyState, string>;
  
  // Content Hierarchy
  courses!: Table<Course, string>;
  units!: Table<Unit, string>;
  lessons!: Table<Lesson, string>;
  contentItems!: Table<ContentItem, string>;
  
  // Progress & Logs (Đã bay màu chữ "any")
  itemProgress!: Table<ItemProgress, string>; 
  lessonProgress!: Table<LessonProgress, string>;
  sessionLogs!: Table<SessionLog, string>;

  constructor() {
    super('HSKQuestDB');
    
    // Đánh index cho các trường hay query để DB chạy mượt
    this.version(2).stores({
      profiles: 'id, username',
      dailyStates: '[userId+date]', 
      courses: 'id',
      units: 'id, courseId',
      lessons: 'id, unitId',
      contentItems: 'id, hskLevel',
      // Dùng compound index [userId+itemId] để tìm nhanh tiến độ của 1 user với 1 từ
      itemProgress: '[userId+itemId], nextReviewDate', 
      lessonProgress: '[userId+lessonId]',
      sessionLogs: 'id, userId'
    });
  }
}

export const db = new HSKDatabase();