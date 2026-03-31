import Dexie, { type Table } from 'dexie'; // <-- Thêm chữ 'type' ở đây để hết báo đỏ

export type ContentType = 'vocab' | 'chunk' | 'grammar' | 'reading' | 'listening';
export type DistractorPolicy = 'auto' | 'manual' | 'hybrid';

export interface AudioRef {
  packId: string;
  startMs: number;
  endMs: number;
}

// 1. Dữ liệu chuẩn (Content Pack)
export interface ContentItem {
  id: string;
  type: ContentType;
  level: number;
  hanzi?: string;
  pinyin?: string;
  meaning_vi?: string;
  pos?: string; // Noun, Verb, Adj...
  tags?: string[];
  topic?: string[];
  difficulty?: number;
  confusionGroup?: string; // Ví dụ: 'increase_verbs'
  distractorPolicy?: DistractorPolicy;
  manualDistractors?: string[];
  example?: {
    text: string;
    pinyin: string;
    meaning_vi: string;
  };
  audioRef?: AudioRef;
}

// 2. Profile Người dùng
export interface UserProfile {
  id: string;
  name: string;
  goal: string;
  target_level: number;
  daily_time_minutes: number;
  current_estimated_level: number;
  created_at: string;
  preferences: {
    sound: boolean;
    romanization: boolean;
    dark_mode: boolean;
  };
}

// 3. Tiến độ học (SRS)
export interface UserProgress {
  item_id: string;
  status: 'new' | 'learning' | 'fragile' | 'mastered' | 'leech';
  mastery_score: number;
  stability: number;
  familiarity: number;
  last_seen_at: string;
  next_review_at: string;
  times_seen: number;
  times_correct: number;
  times_wrong: number;
  avg_response_ms: number;
  error_tags: string[];
}

// 4. Lịch sử bài tập (Clinic dùng)
export interface ExerciseLog {
  id?: number;
  item_id: string;
  created_at: string;
  is_correct: boolean;
  response_time_ms: number;
  error_type?: string;
}

// 5. Khởi tạo Dexie.js
export class HSKDatabase extends Dexie {
  content_items!: Table<ContentItem>;
  user_profile!: Table<UserProfile>;
  user_progress!: Table<UserProgress>;
  exercise_logs!: Table<ExerciseLog>;

  constructor() {
    super('HSKQuestDB');
    this.version(2).stores({
      content_items: 'id, type, level, pos, confusionGroup',
      user_profile: 'id',
      user_progress: 'item_id, status, next_review_at',
      exercise_logs: '++id, item_id, created_at'
    });
  }
}

export const db = new HSKDatabase();