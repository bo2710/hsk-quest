import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Lock, Check } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import type { Lesson } from '../../../entities/lesson';

interface LessonNodeProps {
  lesson: Lesson & { isUnlocked: boolean };
  index: number;
  isLast: boolean;
}

export const LessonNode: React.FC<LessonNodeProps> = ({ lesson, index, isLast }) => {
  const navigate = useNavigate();
  
  // Thuật toán dạo chơi: Dùng hàm Sin để tính độ lệch X, tạo đường đi Zigzag uốn lượn
  const xOffset = Math.sin((index * Math.PI) / 3) * 65; 

  // Giả lập logic trạng thái (Sau này sẽ map với tiến độ thật)
  const isCompleted = lesson.isUnlocked && index < 2; 
  const isCurrent = lesson.isUnlocked && !isCompleted;

  return (
    <div 
      className="relative flex flex-col items-center my-6 z-0" 
      style={{ transform: `translateX(${xOffset}px)` }}
    >
      {/* Sợi dây thừng nối bài học (Không render ở bài cuối cùng) */}
      {!isLast && (
        <div className="absolute top-14 w-4 h-24 bg-gray-200 -z-10" />
      )}

      {/* Nút bấm 3D siêu cấp */}
      <button
        disabled={!lesson.isUnlocked}
        onClick={() => navigate(`/session/${lesson.id}`)}
        className={cn(
          "relative w-[75px] h-[75px] rounded-full flex items-center justify-center border-b-[6px] transition-all duration-200",
          !lesson.isUnlocked ? "active:translate-y-0" : "active:border-b-0 active:translate-y-[6px]", // Chỉ nhún khi đã unlock
          isCompleted ? "bg-yellow-400 border-yellow-600 shadow-xl shadow-yellow-400/40" :
          isCurrent ? "bg-green-500 border-green-700 shadow-xl shadow-green-500/50 animate-[bounce_2s_infinite]" :
          "bg-gray-300 border-gray-400 cursor-not-allowed opacity-90"
        )}
      >
        {isCompleted ? <Check size={36} strokeWidth={4} className="text-yellow-600" /> :
         isCurrent ? <Star size={36} className="text-white fill-white" /> :
         <Lock size={28} className="text-gray-400 fill-gray-400" />}
      </button>
      
      {/* Nhãn tên bài học (Kính mờ Backdrop Blur) */}
      <div className="mt-4 font-extrabold text-sm text-gray-600 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white">
        {lesson.title}
      </div>
    </div>
  );
};