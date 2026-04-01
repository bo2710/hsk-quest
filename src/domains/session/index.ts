import { contentRepository } from '../../db/repositories/contentRepository';
import { progressRepository } from '../../db/repositories/progressRepository';
import { scoringEngine } from '../../engine/scoring';
import { srsScheduler } from '../../engine/scheduler';
import { questionEngine } from '../../engine/question';
import type { SessionLog } from '../../entities/session-log';

export interface QuizQuestion {
  itemId: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
}

export const sessionDomain = {
  // 1. Chỉ cần lessonId để khởi tạo bài học
  startLessonSession: async (lessonId: string) => {
    const lesson = await contentRepository.getLessonById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    const items = await contentRepository.getItemsByIds(lesson.itemRefs);
    const distractors = await contentRepository.getDistractors(1, 20);

    const questions: QuizQuestion[] = items.map(item => {
      const quiz = questionEngine.generateQuiz(item, distractors);
      return {
        itemId: item.id,
        questionText: quiz.question,
        correctAnswer: quiz.correctAnswer,
        options: quiz.options
      };
    });

    return {
      sessionId: crypto.randomUUID(),
      lesson,
      questions: questions.sort(() => 0.5 - Math.random())
    };
  },

  // 2. GIỮ NGUYÊN userId ở đây vì cần cho progressRepository.getItemProgress
  processAnswer: async (userId: string, itemId: string, isCorrect: boolean, timeSpentSec: number) => {
    let progress = await progressRepository.getItemProgress(userId, itemId);
    if (!progress) {
      progress = { userId, itemId, stability: 0.5, difficulty: 5, elapsedDays: 0, scheduledDays: 0, nextReviewDate: 0, state: 'new', lapses: 0 };
    }

    const grading = scoringEngine.evaluateResponse(isCorrect, timeSpentSec);
    const xpEarned = scoringEngine.calculateXp(grading, progress.difficulty);

    const updatedProgress = srsScheduler.predictNextReview(progress, isCorrect);
    await progressRepository.upsertItemProgress(updatedProgress);

    return { isCorrect, xpEarned, grading, updatedProgress };
  },

  finalizeSession: async (log: SessionLog) => {
    await progressRepository.logSession(log);
    return log.xpEarned;
  }
};