import React from 'react';

// Định nghĩa các loại nút cực kỳ chi tiết
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'battle';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Cấu hình màu sắc phức tạp chuẩn gamification
  const variants = {
    primary: 'bg-green-500 hover:bg-green-400 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1',
    secondary: 'bg-blue-500 hover:bg-blue-400 text-white border-b-4 border-blue-700 active:border-b-0 active:translate-y-1',
    danger: 'bg-red-500 hover:bg-red-400 text-white border-b-4 border-red-700 active:border-b-0 active:translate-y-1',
    battle: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-red-500/50 hover:scale-105 active:scale-95 transition-transform',
    ghost: 'bg-transparent hover:bg-gray-200 text-gray-500 font-medium',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-xl',
    md: 'px-5 py-3 text-base font-bold rounded-2xl',
    lg: 'px-8 py-4 text-lg font-extrabold rounded-2xl w-full',
    icon: 'p-3 rounded-full'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center gap-2 
        transition-all duration-150 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : leftIcon}
      {children}
    </button>
  );
};