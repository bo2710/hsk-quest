// src/shared/lib/utils.ts
// Hàm này giúp gộp Class Tailwind gọn gàng, có thể nhận chuỗi, mảng, hoặc object { 'class-name': boolean }
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const result: string[] = [];
  
  for (const item of classes) {
    if (!item) continue;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) result.push(key);
      }
    }
  }
  
  return result.join(' ').trim();
}

// Format giây thành chuỗi MM:SS cho đồng hồ đếm ngược
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (Math.floor(seconds) % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};