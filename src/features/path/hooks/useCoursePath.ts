import { useState, useEffect } from 'react';
import { pathDomain, type PathData } from '../../../domains/path';

export const useCoursePath = (courseId: string) => {
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      setIsLoading(true);
      try {
        // Giả lập User đã hoàn thành 2 bài học đầu tiên (để test logic khóa/mở bài học)
        // Sau này thay số 2 bằng dữ liệu thật từ Profile/Store
        const completedLessonsMock = 2; 
        const data = await pathDomain.getCoursePath(courseId, completedLessonsMock);
        setPathData(data);
      } catch (e) {
        console.error('Lỗi khi tải Lộ trình:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPath();
  }, [courseId]);

  return { pathData, isLoading };
};