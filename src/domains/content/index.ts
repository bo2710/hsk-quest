import { contentRepository } from '../../db/repositories/contentRepository';

export const contentDomain = {
  // Lấy tổng quan số lượng khóa học để hiển thị ngoài trang chủ
  getCourseLibraryOverview: async () => {
    const courses = await contentRepository.getAllCourses();
    return courses.map(course => ({
      id: course.id,
      title: course.title,
      totalUnits: course.totalUnits,
      isPremium: false // V2 mở free hết
    }));
  }
};