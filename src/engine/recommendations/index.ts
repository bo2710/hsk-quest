import type { UserProfile } from '../../entities/profile';

export const recommendationEngine = {
  // Gợi ý User nên làm gì tiếp theo mỗi khi mở App
  suggestNextActivity: (profile: UserProfile, dueItemsCount: number) => {
    // Nếu có quá nhiều từ vựng tới hạn ôn tập (vd: > 15 từ), ép User phải ôn trước
    if (dueItemsCount > 15) {
      return {
        type: 'practice',
        title: 'Ôn tập từ vựng',
        description: `Bạn có ${dueItemsCount} từ vựng đang chờ được ôn tập!`,
        priority: 'high'
      };
    }
    
    // Nếu từ vựng ổn thỏa, gợi ý đi tiếp lộ trình HSK
    return {
      type: 'path',
      title: 'Học bài mới',
      description: `Tiếp tục lộ trình HSK ${profile.targetLevel} của bạn.`,
      priority: 'normal'
    };
  }
};