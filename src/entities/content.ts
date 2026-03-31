export interface Course {
  id: string; // 'hsk-1', 'hsk-2'
  title: string;
}

export interface Unit {
  id: string;
  courseId: string;
  order: number;
  title: string;
  guidebookRef: string; // Link to markdown
  targetSkills: string[];
}

export interface Lesson {
  id: string;
  unitId: string;
  type: 'learning' | 'checkpoint' | 'legendary';
  objective: string;
  itemRefs: string[]; // Các từ vựng/ngữ pháp sẽ học
  xpValue: number;
}

// Thêm đoạn này vào src/entities/content.ts
export interface ContentItem {
  id: string; // VD: 'hsk1-1-wo'
  hskLevel: number;
  type: 'vocab' | 'grammar' | 'phrase'; // Spec V2 phân loại rõ
  hanzi: string;
  pinyin: string;
  meaning: string;
  audioUrl?: string; // Audio Pack
  
  // Dành riêng cho Spec V2
  components?: string[]; // Phân tích chữ Hán
  collocations?: string[];
  confusionSetId?: string; // Dùng cho generator distractor
}