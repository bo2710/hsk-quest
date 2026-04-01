import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { achievementRepository } from '../../db/repositories/achievementRepository';
import { Flame, Zap, Trophy, LogOut, Award, Moon, Volume2, Type, Settings2} from 'lucide-react';
import { cn } from '../../shared/lib/utils';
import type { UserAchievement } from '../../entities/achievement';

export const ProfileScreen: React.FC = () => {
  const { profile, dailyState, logout, activeUserId } = useAppStore();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  
  // Tạm quản lý state Dark Mode ở Local, sau này có thể đưa vào Zustand nếu cần
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (activeUserId) {
      achievementRepository.getUnlockedAchievements(activeUserId).then(setAchievements);
    }
    // Tự động kiểm tra hệ điều hành xem có đang bật Dark Mode không
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [activeUserId]);

  const handleLogout = () => {
    logout();
    navigate('/onboarding');
  };

  // Hàm bật/tắt Cài đặt (giả lập lưu xuống DB vì hiện tại entity Profile chưa có cột preferences)
  // Tương lai ông vào src/entities/profile.ts thêm trường preferences là lưu thật được
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 animate-[fade-in-right_0.3s_ease-out]">
      {/* 1. Header: Avatar & Info */}
      <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center mt-12 transition-colors">
        <div className="absolute -top-12 w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white text-4xl font-black">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-10 transition-colors">{profile.username}</h2>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-4 py-1.5 rounded-xl mt-2 border border-blue-200 dark:border-blue-800 transition-colors">
          Chinh phục HSK {profile.targetLevel}
        </div>
      </div>

      {/* 2. Grid Chỉ Số */}
      <h3 className="text-xl font-black text-slate-800 dark:text-white mt-2 px-1 transition-colors">Chỉ Số Của Bạn</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center shadow-sm transition-colors">
          <Flame size={36} className={cn("mb-2", dailyState?.isStreakActive ? "text-orange-500 fill-orange-500" : "text-slate-300 dark:text-slate-600")} />
          <span className="text-3xl font-black text-slate-800 dark:text-white transition-colors">{dailyState?.isStreakActive ? '1' : '0'}</span>
          <span className="text-slate-500 font-bold text-sm uppercase">Ngày Lửa</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center shadow-sm transition-colors">
          <Zap size={36} className="text-yellow-500 fill-yellow-500 mb-2" />
          <span className="text-3xl font-black text-slate-800 dark:text-white transition-colors">{dailyState?.xpEarned || 0}</span>
          <span className="text-slate-500 font-bold text-sm uppercase">Tổng XP</span>
        </div>
      </div>

      {/* 3. Kho Danh Hiệu */}
      <h3 className="text-xl font-black text-slate-800 dark:text-white mt-2 px-1 flex items-center gap-2 transition-colors">
        <Trophy className="text-yellow-500" /> Tủ Kính Danh Hiệu
      </h3>
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-sm min-h-[100px] transition-colors">
        {achievements.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {achievements.map((ach) => (
              <div key={ach.achievementId} className="flex flex-col items-center min-w-[80px]">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center border-2 border-yellow-400 mb-2 transition-colors">
                  <Award size={32} className="text-yellow-600" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 text-center transition-colors">{ach.achievementId}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 font-medium text-center py-4">Chưa có danh hiệu nào. Hãy chiến đấu thêm!</p>
        )}
      </div>

      {/* 4. Cài đặt (Settings) - Tái sinh từ V1 */}
      <div className="space-y-4 pt-4">
        <h3 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase text-sm tracking-wider px-2 transition-colors">
          <Settings2 size={18} className="text-slate-400" /> Cài đặt ứng dụng
        </h3>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
          
          {/* Toggle Dark Mode */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-xl transition-colors"><Moon size={20} className="text-slate-700 dark:text-slate-300" /></div>
              <div className="font-bold text-slate-800 dark:text-slate-200 transition-colors">Giao diện Tối</div>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={cn("w-14 h-8 rounded-full transition-colors relative", isDarkMode ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-600')}
            >
              <div className={cn("w-6 h-6 bg-white rounded-full absolute top-1 transition-all", isDarkMode ? 'left-7' : 'left-1')} />
            </button>
          </div>

          {/* Nút bật/tắt Âm thanh (Chỉ làm UI, sau này ông ráp audioEngine vào) */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl transition-colors"><Volume2 size={20} className="text-blue-500" /></div>
              <div className="font-bold text-slate-800 dark:text-slate-200 transition-colors">Tự động phát Âm thanh</div>
            </div>
            <button className="w-14 h-8 rounded-full transition-colors relative bg-blue-500">
              <div className="w-6 h-6 bg-white rounded-full absolute top-1 transition-all left-7" />
            </button>
          </div>

          {/* Nút bật/tắt Pinyin */}
          <div className="flex items-center justify-between p-5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-xl transition-colors"><Type size={20} className="text-green-500" /></div>
              <div className="font-bold text-slate-800 dark:text-slate-200 transition-colors">Hiển thị Pinyin trợ giúp</div>
            </div>
            <button className="w-14 h-8 rounded-full transition-colors relative bg-blue-500">
              <div className="w-6 h-6 bg-white rounded-full absolute top-1 transition-all left-7" />
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout} 
        className="mt-6 flex items-center justify-center gap-2 text-red-500 font-bold p-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors border-2 border-transparent hover:border-red-200 dark:hover:border-red-800"
      >
        <LogOut size={20} /> Đăng xuất thiết bị
      </button>
    </div>
  );
};