import { z } from 'zod';

// Định nghĩa schema kiểm tra khớp 100% với Interface đã viết ở index.ts
export const AudioRefSchema = z.object({
  packId: z.string(),
  startMs: z.number(),
  endMs: z.number(),
});

export const ContentItemSchema = z.object({
  id: z.string(),
  type: z.enum(["vocab", "chunk", "grammar", "reading", "listening"]),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  hanzi: z.string().optional(),
  pinyin: z.string().optional(),
  meaning_vi: z.string().optional(),
  pos: z.enum(["noun", "verb", "adj", "adv", "grammar", "chunk"]).optional(),
  tags: z.array(z.string()).optional(),
  collocations: z.array(z.string()).optional(),
  confusions: z.array(z.string()).optional(),
  example: z.object({
    hanzi: z.string(),
    pinyin: z.string(),
    meaning_vi: z.string(),
  }).optional(),
  audioRef: AudioRefSchema.optional(),
  difficulty: z.number().optional(),
  distractorPolicy: z.enum(["auto", "manual", "hybrid"]).optional(),
  manualDistractors: z.array(z.string()).optional(),
});

// Một Pack là một mảng các ContentItem
export const ContentPackSchema = z.array(ContentItemSchema);