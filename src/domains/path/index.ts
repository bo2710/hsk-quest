import { contentRepository } from '../../db/repositories/contentRepository';
import { unlockEngine } from '../../engine/unlocks';
import type { Course } from '../../entities/course';
import type { Unit } from '../../entities/unit';
import type { Lesson } from '../../entities/lesson';

export interface PathData {
  course: Course;
  units: {
    unit: Unit;
    lessons: (Lesson & { isUnlocked: boolean })[];
  }[];
}

export const pathDomain = {
  // Lấy toàn bộ dữ liệu để vẽ lên cái Cây lộ trình (Tree) giống Duolingo
  getCoursePath: async (courseId: string, completedLessonsCount: number): Promise<PathData | null> => {
    const courses = await contentRepository.getAllCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;

    const units = await contentRepository.getUnitsByCourse(course.id);
    const pathData: PathData['units'] = [];

    let globalLessonIndex = 1;

    for (const unit of units.sort((a, b) => a.order - b.order)) {
      const lessons = await contentRepository.getLessonsByUnit(unit.id);
      
      const enrichedLessons = lessons.map(lesson => {
        // Dùng Engine để check xem bài này được mở khóa chưa
        const isUnlocked = unlockEngine.canUnlockLesson(globalLessonIndex, completedLessonsCount);
        globalLessonIndex++;
        return { ...lesson, isUnlocked };
      });

      pathData.push({ unit, lessons: enrichedLessons });
    }

    return { course, units: pathData };
  }
};