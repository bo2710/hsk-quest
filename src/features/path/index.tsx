import React from 'react';
import { useCoursePath } from './hooks/useCoursePath';
import { LessonNode } from './components/LessonNode';

export const PathScreen: React.FC = () => {
  // Tạm hardcode ID 'hsk1' vì mình mới seed data cho HSK 1
  const { pathData, isLoading } = useCoursePath('hsk1'); 

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!pathData) return <div className="text-center mt-10 font-bold text-gray-500">Chưa có dữ liệu khóa học. Bạn đã chạy Seed chưa?</div>;

  return (
    <div className="flex flex-col gap-10 pb-10">
      {pathData.units.map((unitData) => (
        <div key={unitData.unit.id} className="flex flex-col relative">
          
          {/* Header Unit - Sticky trượt theo màn hình */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/30 mb-8 sticky top-[72px] z-10 mx-2">
            <h2 className="text-3xl font-black mb-1 drop-shadow-md">
              Cửa ải {unitData.unit.order}: {unitData.unit.title}
            </h2>
            <p className="text-blue-50 font-semibold opacity-90">{unitData.unit.description}</p>
          </div>

          {/* Vòng lặp render Cây bài học */}
          <div className="flex flex-col items-center py-4">
            {unitData.lessons.map((lesson, lIndex) => (
              <LessonNode 
                key={lesson.id} 
                lesson={lesson} 
                index={lIndex} 
                isLast={lIndex === unitData.lessons.length - 1} 
              />
            ))}
          </div>
          
        </div>
      ))}
    </div>
  );
};