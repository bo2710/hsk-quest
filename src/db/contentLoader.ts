import { z } from 'zod';
import { db } from './index';

// Khai báo lại cấu trúc y hệt Spec để Zod soi chiếu
const ContentItemSchema = z.object({
  id: z.string(),
  type: z.enum(['vocab', 'chunk', 'grammar', 'reading', 'listening']),
  level: z.number().min(1).max(6),
  hanzi: z.string().optional(),
  pinyin: z.string().optional(),
  meaning_vi: z.string().optional(),
  pos: z.string().optional(),
  tags: z.array(z.string()).optional(),
  topic: z.array(z.string()).optional(),
  difficulty: z.number().optional(),
  confusionGroup: z.string().optional(),
  distractorPolicy: z.enum(['auto', 'manual', 'hybrid']).optional().default('auto'),
  manualDistractors: z.array(z.string()).optional(),
  example: z.object({
    text: z.string(),
    pinyin: z.string(),
    meaning_vi: z.string()
  }).optional(),
  audioRef: z.object({
    packId: z.string(),
    startMs: z.number(),
    endMs: z.number()
  }).optional()
});

export const loadContentPack = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Ép dữ liệu phải chạy qua cổng Zod. Thằng nào sai type, rác, thiếu field bắt buộc sẽ bị dội lại
    const validatedData = z.array(ContentItemSchema).parse(data);
    
    // Lưu vào IndexedDB (Version 2)
    await db.content_items.bulkPut(validatedData as any);
    console.log(`Đã nạp thành công ${validatedData.length} items từ ${url}`);
  } catch (error) {
    console.error("Lỗi khi nạp dữ liệu Content Pack:", error);
    alert("Dữ liệu JSON không hợp lệ hoặc sai định dạng Spec! Hãy kiểm tra lại Console log.");
    throw error;
  }
};