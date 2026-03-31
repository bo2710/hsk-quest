import { db, type ContentItem } from '../db';

export const questionGenerator = {
  // Lấy các đáp án sai cho câu hỏi
  async getDistractors(targetItem: ContentItem, count: number = 3): Promise<string[]> {
    // Trường hợp 1: Giáo viên tự gán đáp án sai (ví dụ đề thi ngữ pháp khó)
    if (targetItem.distractorPolicy === 'manual' && targetItem.manualDistractors) {
      return targetItem.manualDistractors.slice(0, count);
    }

    // Trường hợp 2: Bật chế độ Auto hoặc Hybrid
    // Lấy nguyên một rổ từ cùng level hoặc lân cận (±1)
    let candidates = await db.content_items
      .where('level').between(Math.max(1, targetItem.level - 1), targetItem.level + 1, true, true)
      .and(item => item.id !== targetItem.id && item.meaning_vi !== targetItem.meaning_vi)
      .toArray();

    // Lọc tiếp: Cố gắng lấy từ cùng loại từ (Noun ra Noun, Verb ra Verb)
    if (targetItem.pos) {
       const posCandidates = candidates.filter(c => c.pos === targetItem.pos);
       if (posCandidates.length >= count) candidates = posCandidates; // Nếu đủ thì chỉ lấy cùng POS
    }

    // Chấm điểm ưu tiên độ khó của đáp án nhiễu
    const scoredCandidates = candidates.map(c => {
      let score = Math.random() * 5; // Cấp độ random nhẹ để đổi gió mỗi lần học
      
      // Bẫy tử thần: Cùng nhóm từ đồng nghĩa hoặc dễ nhầm (Ví dụ: nhóm "increase")
      if (targetItem.confusionGroup && c.confusionGroup === targetItem.confusionGroup) {
        score += 100;
      }
      
      // Cùng đúng level thì ưu tiên hơn level lân cận
      if (c.level === targetItem.level) score += 10;
      return { item: c, score };
    });

    // Sắp xếp điểm giảm dần (ưu tiên từ điểm cao nhất)
    scoredCandidates.sort((a, b) => b.score - a.score);

    // Bóc tách nghĩa tiếng Việt, lấy cái unique
    let distractors = Array.from(new Set(scoredCandidates.map(c => c.item.meaning_vi || '')));

    // Bổ sung Hybrid: Ghép hàng Auto và Manual (Nếu cần)
    if (targetItem.distractorPolicy === 'hybrid' && targetItem.manualDistractors) {
       distractors = Array.from(new Set([...targetItem.manualDistractors, ...distractors]));
    }

    // Cắt vừa đủ số lượng
    distractors = distractors.slice(0, count);

    // Fallback: Nếu Database nghèo quá không đủ từ, lấy vét cho đủ
    if (distractors.length < count) {
      const fallback = await db.content_items.where('level').equals(targetItem.level).toArray();
      const fallbackMeanings = Array.from(new Set(fallback.map(f => f.meaning_vi || '')))
        .filter(m => m !== targetItem.meaning_vi && !distractors.includes(m));
      
      distractors = [...distractors, ...fallbackMeanings].slice(0, count);
    }

    return distractors;
  },

  // Ráp lại thành Object câu hỏi tiêu chuẩn
  async generateMCQ(item: ContentItem) {
    const distractors = await this.getDistractors(item);
    
    // Gộp đúng sai, lọc unique lại lần nữa cho chắc, rồi đảo ngẫu nhiên
    const choices = Array.from(new Set([item.meaning_vi || '', ...distractors]))
      .sort(() => 0.5 - Math.random());
    
    return {
      id: `q_${item.id}`,
      type: item.type === 'grammar' ? 'grammar_mcq' : 'recognition_mcq',
      question: item.hanzi || item.example?.text || 'N/A',
      pinyin: item.pinyin || item.example?.pinyin || '',
      choices,
      correctAnswer: item.meaning_vi,
      explanation: item.example?.meaning_vi
    };
  }
};