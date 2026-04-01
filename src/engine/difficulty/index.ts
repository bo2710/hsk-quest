export const difficultyEngine = {
  // Tính toán độ khó động dựa trên số lần User sai từ đó
  calculateDynamicDifficulty: (baseDiff: number, lapses: number): number => {
    // Độ khó tăng 0.5 cho mỗi lần sai, tối đa là 10
    return Math.min(10, baseDiff + lapses * 0.5);
  }
};