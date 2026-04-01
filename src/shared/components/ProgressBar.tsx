import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  colorClass?: string; // Ví dụ: 'bg-green-500', 'bg-red-500'
  heightClass?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  colorClass = 'bg-green-500',
  heightClass = 'h-4',
  showLabel = false
}) => {
  // Đảm bảo phần trăm không vượt quá 100 hoặc dưới 0
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="w-full flex flex-col gap-1">
      {showLabel && (
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
          <span>Tiến độ</span>
          <span>{current} / {max}</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${colorClass} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};