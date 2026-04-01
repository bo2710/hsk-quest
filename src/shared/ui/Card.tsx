// src/shared/ui/Card.tsx
import React from 'react';
import { cn } from '../lib/utils'; // Gọi cái hàm nối chuỗi nãy vừa viết
import type { BaseComponentProps } from '../types';

interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  selected = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={cn(
        // Style cơ bản
        'bg-white rounded-2xl border-2 p-5 transition-all duration-200',
        // Nếu là card có thể tương tác (bấm được)
        interactive && 'cursor-pointer hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-sm border-b-4',
        // Trạng thái được chọn
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
        // Merge class custom từ bên ngoài
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};