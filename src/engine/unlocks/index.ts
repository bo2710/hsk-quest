export const unlockEngine = {
  canUnlockLesson: (lessonOrder: number, completedLessonsCount: number): boolean => {
    // Đơn giản: Bài học số N mở khóa khi đã xong N-1 bài
    return lessonOrder <= completedLessonsCount + 1;
  },
  
  canUnlockUnit: (unitOrder: number, starsEarned: number): boolean => {
    // Ví dụ: Mỗi Unit cần ít nhất 5 sao để sang Unit mới
    return starsEarned >= (unitOrder - 1) * 5;
  }
};