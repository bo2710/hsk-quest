import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createUserSlice, type UserSlice } from './slices/userSlice';
import { createSessionSlice, type SessionSlice } from './slices/sessionSlice';

// Hợp nhất các Type
type StoreState = UserSlice & SessionSlice;

// Khởi tạo Store tổng
export const useAppStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createUserSlice(...a),
      ...createSessionSlice(...a),
    }),
    { name: 'HSK-Quest-Store' } // Tên hiển thị trên Redux DevTools
  )
);