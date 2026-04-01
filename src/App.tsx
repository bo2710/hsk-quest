import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useAppStore } from './store/useAppStore';
import { db } from './db/dexie';
import { Flame, Loader2 } from 'lucide-react';

// Khối logic Seed Data giả lập
const bootstrapDatabase = async () => {
  try {
    const courseCount = await db.courses.count();
    if (courseCount === 0) {
      console.log('📦 Phát hiện App mới cài, đang khởi tạo Dữ liệu HSK 1...');
      
      // Dùng 'as any' để ép kiểu dữ liệu mồi, ép TypeScript bỏ qua việc check Interface
      await db.courses.put({
        id: 'hsk1',
        title: 'HSK 1 - Nhập môn',
        totalUnits: 1
      } as any);

      await db.units.put({
        id: 'unit_1',
        courseId: 'hsk1',
        title: 'Xin chào!',
        order: 1
      } as any);

      await db.lessons.put({
        id: 'lesson_1',
        unitId: 'unit_1',
        title: 'Bài 1: Nǐ hǎo',
        type: 'learning',
        itemRefs: ['item_1'] 
      } as any);
      
      await db.contentItems.put({
        id: 'item_1',
        type: 'vocabulary',
        hskLevel: 1,
        hanzi: '你好',
        pinyin: 'nǐ hǎo',
        meaning: 'Xin chào'
      } as any);

      console.log('✅ Khởi tạo dữ liệu thành công!');
    }
  } catch (error) {
    console.error('❌ Lỗi khi Boot Database:', error);
  }
};

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const { activeUserId, fetchDailyStatus } = useAppStore();

  useEffect(() => {
    const systemBoot = async () => {
      // 1. Dựng Database và nhồi Data gốc
      await bootstrapDatabase();

      // 2. Khôi phục trạng thái User
      if (activeUserId) {
        await fetchDailyStatus();
      }

      // 3. Giữ màn hình Boot 1 giây cho mượt
      setTimeout(() => {
        setIsBooting(false);
      }, 1000);
    };

    systemBoot();
  }, [activeUserId, fetchDailyStatus]);

  // MÀN HÌNH CHỜ (SPLASH SCREEN)
  if (isBooting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white relative overflow-hidden">
        {/* Vòng sáng nền */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            <Loader2 size={64} className="text-blue-500 animate-spin absolute" />
            <Flame size={32} className="text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          
          <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            HSK QUEST
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            Đang khởi động lõi Engine...
          </p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;