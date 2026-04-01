// src/shared/types/index.ts
import type { SVGProps } from 'react';

// Cấu trúc chuẩn cho mọi Icon trong App
export type IconElement = React.FC<SVGProps<SVGSVGElement>>;

// Hệ thống Kích thước chuẩn
export type BaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Hệ thống Màu sắc chuẩn (Dùng cho Badge, Toast, Button)
export type BaseColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'battle';

// Interface nền tảng cho mọi Component giao diện
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
}