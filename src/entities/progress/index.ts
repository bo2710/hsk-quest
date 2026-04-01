// src/entities/progress/index.ts

export interface ItemProgress {
  userId: string;
  itemId: string;
  stability: number;   // Độ bền trí nhớ
  difficulty: number;  // Độ khó của từ
  elapsedDays: number; // Số ngày đã trôi qua kể từ lần học cuối
  scheduledDays: number; // Số ngày dự kiến đến lần học tiếp theo
  nextReviewDate: number; // Timestamp ngày ôn tập tiếp theo
  
  // Đây là 2 thứ đang bị thiếu trong ảnh của ông:
  state: 'new' | 'learning' | 'review' | 'relearning'; 
  lapses: number; // Số lần trả lời sai
}