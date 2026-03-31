export interface SessionPlan {
  id: string;
  mode: 'path' | 'practice' | 'mistakes' | 'listening' | 'boss' | 'quick-review';
  lessonId?: string; // Có nếu mode là 'path'
  objective: string;
  items: PlannedExercise[];
  xpReward: number;
  estimatedSeconds: number;
}

export interface PlannedExercise {
  itemId: string;
  type: 'recognition' | 'listening' | 'ordering' | 'collocation';
  difficulty: 'easy' | 'medium' | 'hard';
  distractors?: string[];
}