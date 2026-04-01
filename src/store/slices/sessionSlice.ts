import type { StateCreator } from 'zustand';
import { sessionDomain, type QuizQuestion } from '../../domains/session';
import { battleDomain, type BattleState } from '../../domains/battle';
import { useAppStore } from '../useAppStore'; // Quan trọng: Để lấy userId

export interface SessionSlice {
  isSessionActive: boolean;
  questions: QuizQuestion[];
  currentIndex: number;
  battleState: BattleState | null;
  // Bắt đầu học: Chỉ cần ID bài và Level
  startLesson: (lessonId: string, hskLevel: number) => Promise<void>;
  // Trả lời: Không cần truyền userId từ UI, Store tự lo
  answerCurrentQuestion: (isCorrect: boolean, timeSec: number) => Promise<void>;
  quitSession: () => void;
}

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set, get) => ({
  isSessionActive: false,
  questions: [],
  currentIndex: 0,
  battleState: null,

  startLesson: async (lessonId: string, hskLevel: number) => {
    const sessionData = await sessionDomain.startLessonSession(lessonId);
    const initialBattleState = battleDomain.initializeBoss(hskLevel);

    set({
      isSessionActive: true,
      questions: sessionData.questions,
      currentIndex: 0,
      battleState: initialBattleState
    });
  },

  answerCurrentQuestion: async (isCorrect: boolean, timeSec: number) => {
    const state = get();
    // Lấy userId từ UserSlice trong cùng Store tổng
    const userId = (useAppStore.getState() as any).activeUserId; 
    
    if (!userId || !state.questions[state.currentIndex]) return;

    const currentQ = state.questions[state.currentIndex];
    
    // Gọi Domain: Truyền đủ 4 tham số (userId, itemId, isCorrect, timeSpentSec)
    await sessionDomain.processAnswer(userId, currentQ.itemId, isCorrect, timeSec);
    
    const newBattleState = battleDomain.calculateDamage(state.battleState!, isCorrect, timeSec);

    set({
      battleState: newBattleState,
      currentIndex: state.currentIndex + 1
    });
  },

  quitSession: () => set({ isSessionActive: false, questions: [], currentIndex: 0, battleState: null })
});