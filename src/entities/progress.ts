export interface ItemProgress {
  userId: string;
  itemId: string;
  // SRS V2 (Dựa trên FSRS hoặc thuật toán tương tự)
  stability: number;
  difficulty: number;
  retrievabilityEstimate: number;
  lapseCount: number;
  lastReviewDate: number; // timestamp
  nextReviewDate: number; // timestamp
  lastErrorType?: 'meaning' | 'collocation' | 'grammar' | 'audio' | 'none';
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  status: 'locked' | 'available' | 'completed' | 'legendary';
  score: number; // Điểm số đạt được
  completedAt?: number;
}

export interface SessionLog {
  id: string; // UUID của session
  userId: string;
  mode: 'path' | 'practice' | 'mistakes' | 'listening' | 'boss' | 'quick-review';
  startTime: number;
  endTime: number;
  xpEarned: number;
  exercisesTotal: number;
  exercisesCorrect: number;
  abandoned: boolean; // Có quit giữa chừng không
}