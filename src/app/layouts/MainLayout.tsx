import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Home, Dumbbell, User, Flame, Zap } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeUserId, dailyState, fetchDailyStatus } = useAppStore();

  // 1. Kiểm tra bảo mật: Nếu chưa có ID thì đá văng về Onboarding
  useEffect(() => {
    if (!activeUserId) {
      navigate('/onboarding');
    } else {
      fetchDailyStatus();
    }
  }, [activeUserId, navigate, fetchDailyStatus]);

  // 2. Danh sách Menu dưới đáy
  const navItems = [
    { path: '/', icon: Home, label: 'LỘ TRÌNH' },
    { path: '/practice', icon: Dumbbell, label: 'LUYỆN TẬP' },
    { path: '/profile', icon: User, label: 'HỒ SƠ' }
  ];

  if (!activeUserId) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] border-x border-slate-200 dark:border-slate-800">
      
      {/* --- TOP HEADER (Kính mờ Backdrop Blur) --- */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="text-xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
          HSK<span className="text-slate-800 dark:text-white">QUEST</span>
        </div>
        
        <div className="flex gap-4">
          {/* Streak Lửa */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-100 dark:border-orange-800/50">
            <Flame size={18} className={cn("transition-all", dailyState?.isStreakActive ? "text-orange-500 fill-orange-500" : "text-slate-300")} />
            <span className="font-black text-orange-600 dark:text-orange-400 text-sm">
              {dailyState?.isStreakActive ? '1' : '0'}
            </span>
          </div>
          
          {/* XP Sét */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full border border-yellow-100 dark:border-yellow-800/50">
            <Zap size={18} className="text-yellow-500 fill-yellow-500" />
            <span className="font-black text-yellow-600 dark:text-yellow-400 text-sm">
              {dailyState?.xpEarned || 0}
            </span>
          </div>
        </div>
      </header>

      {/* --- VÙNG HIỂN THỊ NỘI DUNG (CUỘN ĐƯỢC) --- */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative bg-slate-50 dark:bg-slate-950 transition-colors">
        {/* Render nội dung của HomeScreen, PracticeHub, Profile ở đây */}
        <div className="animate-[fade-in-right_0.3s_ease-out]">
           <Outlet />
        </div>
      </main>

      {/* --- BOTTOM NAVIGATION BAR (NỔI TRÊN MẶT) --- */}
      <nav className="absolute bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-end px-2 pb-6 pt-2 z-40 transition-colors">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center group relative min-w-[80px]"
            >
              {/* Hiệu ứng thanh highlight trên đầu icon khi active */}
              {isActive && (
                <div className="absolute -top-2 w-12 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
              )}
              
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300 flex items-center justify-center mb-1",
                isActive 
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-110" 
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
              )}>
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={cn(
                "text-[10px] font-black tracking-widest uppercase transition-colors",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};