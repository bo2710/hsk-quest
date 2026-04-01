export interface ContentItem {
  id: string; // hsk1-u1-1
  hskLevel: number;
  type: 'vocab' | 'grammar' | 'phrase';
  hanzi: string;
  pinyin: string;
  meaning: string;
  audioUrl?: string;
  components?: string[]; // Phân tích bộ thủ
  collocations?: string[]; 
  confusionSetId?: string; // Dùng để lấy từ gây nhiễu khi làm quiz
  tags: string[];
}