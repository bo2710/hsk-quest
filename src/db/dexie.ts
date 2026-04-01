import Dexie, { type Table } from 'dexie';
import { dbSchema } from './schema';

// Import các interface từ entities/ (Ông check xem có thiếu file nào thì tạo nốt nhé)
import type { ContentItem } from '../entities/item';
import type { Lesson } from '../entities/lesson';
import type { Unit } from '../entities/unit';
import type { Course } from '../entities/course';
import type { ItemProgress } from '../entities/progress';
import type { DailyState } from '../entities/daily-state';
import type { UserAchievement } from '../entities/achievement';
import type { QuestProgress } from '../entities/quest';
import type { SessionLog } from '../entities/session-log';
import type { UserProfile } from '../entities/profile';

export class HSKDatabase extends Dexie {
  // Bảng tạm thời để any nếu ông chưa tạo interface
  profiles!: Table<UserProfile, string>; 
  dailyStates!: Table<DailyState, string>;
  courses!: Table<Course, string>;
  units!: Table<Unit, string>;
  lessons!: Table<Lesson, string>;
  contentItems!: Table<ContentItem, string>;
  itemProgress!: Table<ItemProgress, string>;
  skillProgress!: Table<any, string>; 
  userAchievements!: Table<UserAchievement, string>;
  questProgress!: Table<QuestProgress, string>;
  sessionLogs!: Table<SessionLog, string>;

  constructor() {
    super('HSKQuestV2_DB');
    this.version(2).stores(dbSchema);
  }
}

export const db = new HSKDatabase();