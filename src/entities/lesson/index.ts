export interface Lesson {
  id: string;
  unitId: string;
  type: 'learning' | 'practice' | 'checkpoint' | 'legendary';
  title: string;
  objective: string;
  itemRefs: string[]; // Danh sách ID của ContentItem
  xpReward: number;
}