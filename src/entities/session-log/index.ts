export interface SessionLog {
  id: string; // UUID của phiên học
  userId: string;
  mode: 'path' | 'practice' | 'mistakes' | 'listening' | 'boss' | 'quick-review';
  lessonId?: string; // Có nếu học theo Lộ trình (path)
  startTime: number;
  endTime: number;
  durationSeconds: number;
  xpEarned: number;
  totalExercises: number;
  correctExercises: number;
  isAbandoned: boolean; // True nếu user thoát giữa chừng
}