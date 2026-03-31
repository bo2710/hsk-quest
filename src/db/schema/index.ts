import Dexie, { type Table } from 'dexie';

// --- 1. ENTITIES: HỆ THỐNG NỘI DUNG KHÓA HỌC (CONTENT SYSTEM) ---
export interface Course {
  id: string;
  title: string;
  description: string;
  total_units: number;
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  targetSkills: string[];
  guidebookRef?: string;
  lessonOrder: string[]; // Mảng các lessonId theo thứ tự Path
  checkpointLesson: string;
  legendaryLesson: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  objective: string;
  itemRefs: string[]; // Các từ/cấu trúc học trong lesson này
  exerciseTemplates: string[];
  unlockRequirements: string[];
  xpValue: number;
}

export interface ContentItem {
  id: string;
  type: 'vocab' | 'chunk' | 'grammar' | 'reading' | 'listening';
  level: number;
  hanzi?: string;
  pinyin?: string;
  meaning_vi?: string;
  pos?: string;
  skillTags?: string[];
  confusionGroup?: string;
  distractorPolicy?: 'auto' | 'manual' | 'hybrid';
  manualDistractors?: string[];
  example?: { text: string; pinyin: string; meaning_vi: string };
  audioRef?: { packId: string; startMs: number; endMs: number };
}

export interface Guidebook {
  id: string;
  unitId: string;
  markdownContent: string;
}

// --- 2. ENTITIES: TIẾN TRÌNH & NGƯỜI DÙNG (PROGRESS & USER) ---
export interface UserProfile {
  id: string;
  name: string;
  target_level: number;
  joined_at: string;
}

export interface DailyState {
  id: string; // Thường lưu 'today' hoặc format YYYY-MM-DD
  streak: number;
  today_xp: number;
  today_lessons_completed: number;
  quick_save_used: boolean;
  hearts: number; // Hệ thống năng lượng (Duolingo)
  gems: number;   // Kinh tế
}

export interface SkillProgress {
  id: string; // vd: 'reading', 'listening', 'grammar'
  level: number;
  errorRate: number;
  confidence: number;
  speed: number;
}

export interface UserProgress {
  item_id: string;
  status: 'new' | 'learning' | 'fragile' | 'mastered' | 'leech';
  stability: number;
  difficulty: number;
  retrievabilityEstimate: number;
  masteryScore: number;
  lapseCount: number;
  lastErrorType?: string;
  last_seen_at: string;
  next_review_at: string;
}

export interface LessonProgress {
  lesson_id: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed' | 'legendary';
  score: number;
  completed_at?: string;
}

export interface UnitProgress {
  unit_id: string;
  status: 'locked' | 'active' | 'completed';
}

// --- 3. ENTITIES: LOGS & GAMIFICATION ---
export interface SessionLog {
  id?: number;
  session_type: 'path' | 'practice' | 'mistakes' | 'boss';
  xp_earned: number;
  duration_ms: number;
  created_at: string;
}

export interface ExerciseLog {
  id?: number;
  item_id: string;
  is_correct: boolean;
  error_type?: 'meaning_confusion' | 'collocation_confusion' | 'grammar_pattern_confusion' | 'tone_confusion' | 'careless';
  response_time_ms: number;
  created_at: string;
}

export interface QuestProgress {
  id: string;
  type: 'daily' | 'weekly';
  objective: string;
  current_amount: number;
  target_amount: number;
  is_completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  tier: number;
  progress: number;
  unlocked_at?: string;
}

export interface EventLog {
  id?: number;
  event_type: 'lesson_started' | 'lesson_completed' | 'hint_used' | 'abandoned_session';
  metadata: Record<string, any>;
  created_at: string;
}

// --- KHỞI TẠO DATABASE V3 THEO CHUẨN DUOLINGO ---
export class HSKDatabaseV3 extends Dexie {
  courses!: Table<Course>;
  units!: Table<Unit>;
  lessons!: Table<Lesson>;
  content_items!: Table<ContentItem>;
  guidebooks!: Table<Guidebook>;
  
  user_profile!: Table<UserProfile>;
  daily_state!: Table<DailyState>;
  skill_progress!: Table<SkillProgress>;
  user_progress!: Table<UserProgress>;
  lesson_progress!: Table<LessonProgress>;
  unit_progress!: Table<UnitProgress>;
  
  session_logs!: Table<SessionLog>;
  exercise_logs!: Table<ExerciseLog>;
  quest_progress!: Table<QuestProgress>;
  achievements!: Table<Achievement>;
  event_logs!: Table<EventLog>;

  constructor() {
    super('HSKQuestPlatformDB');
    this.version(3).stores({
      courses: 'id',
      units: 'id, courseId',
      lessons: 'id, unitId',
      content_items: 'id, type, level, pos, confusionGroup',
      guidebooks: 'id, unitId',
      
      user_profile: 'id',
      daily_state: 'id',
      skill_progress: 'id',
      user_progress: 'item_id, status, next_review_at',
      lesson_progress: 'lesson_id, status',
      unit_progress: 'unit_id, status',
      
      session_logs: '++id, session_type, created_at',
      exercise_logs: '++id, item_id, error_type, created_at',
      quest_progress: 'id, type',
      achievements: 'id',
      event_logs: '++id, event_type, created_at'
    });
  }
}

export const db = new HSKDatabaseV3();