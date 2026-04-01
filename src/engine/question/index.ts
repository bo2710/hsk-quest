import type { ContentItem } from '../../entities/item';

export const questionEngine = {
  // Trộn các từ vựng để tạo phương án trắc nghiệm
  generateQuiz: (target: ContentItem, allItems: ContentItem[]) => {
    const distractors = allItems
      .filter(item => item.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const options = [...distractors, target].sort(() => 0.5 - Math.random());
    
    return {
      question: `Nghĩa của từ "${target.hanzi}" là gì?`,
      correctAnswer: target.meaning,
      options: options.map(o => o.meaning)
    };
  }
};