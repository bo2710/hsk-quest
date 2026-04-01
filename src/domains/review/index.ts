import { progressRepository } from '../../db/repositories/progressRepository';
import { contentRepository } from '../../db/repositories/contentRepository';
import { questionEngine } from '../../engine/question';
import type { QuizQuestion } from '../session'; // Import type từ session

export const reviewDomain = {
  // Tạo bài ôn tập đặc biệt chứa toàn từ yếu
  generateDailyReview: async (userId: string): Promise<QuizQuestion[]> => {
    const now = Date.now();
    // Lấy các từ đã đến hạn ôn tập
    const dueItemsProgress = await progressRepository.getDueItems(userId, now);
    
    // Thuật toán: Ưu tiên ôn những từ có stability (độ bền) thấp nhất trước
    const urgentItems = dueItemsProgress
      .sort((a, b) => a.stability - b.stability)
      .slice(0, 20); // Tối đa 20 câu mỗi lần review

    if (urgentItems.length === 0) return [];

    const itemIds = urgentItems.map(p => p.itemId);
    const itemsData = await contentRepository.getItemsByIds(itemIds);
    const distractors = await contentRepository.getDistractors(1, 30);

    return itemsData.map(item => {
      const quiz = questionEngine.generateQuiz(item, distractors);
      return {
        itemId: item.id,
        questionText: `Ôn tập: ${quiz.question}`,
        correctAnswer: quiz.correctAnswer,
        options: quiz.options
      };
    });
  }
};