import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PathScreen } from '../path';
import { ProgressBar } from '../../shared/components/ProgressBar';
import { Flame, Target } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { profile, dailyState, fetchDailyStatus } = useAppStore();

  // Load lại trạng thái ngày mỗi khi về Home
  useEffect(() => {
    fetchDailyStatus();
  }, [fetchDailyStatus]);

  if (!profile) return null;

  // Tính % hoàn thành mục tiêu ngày (VD: cày được 10p / 15p)
  const goalProgress = Math.min(100, Math.round(((dailyState?.lessonsCompleted || 0) * 5 / profile.dailyGoalMinutes) * 100));

  return (
    <div className="flex flex-col h-full animate-[fade-in-right_0.3s_ease-out]">
      {/* Khu vực Lời chào & Nhiệm vụ ngày */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm border-b-2 border-slate-200 mb-6 relative overflow-hidden z-20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              Chào dũng sĩ, <span className="text-blue-500">{profile.username}</span>!
            </h1>
            <p className="text-slate-500 font-medium">Hôm nay học hành thế nào rồi?</p>
          </div>
          <div className="bg-orange-100 p-2 rounded-xl flex flex-col items-center border border-orange-200">
            <Flame size={24} className={dailyState?.isStreakActive ? "text-orange-500 fill-orange-500" : "text-slate-400"} />
            <span className="font-bold text-orange-600 text-sm">{dailyState?.isStreakActive ? '1' : '0'}</span>
          </div>
        </div>

        {/* Thanh mục tiêu ngày */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
            <span className="flex items-center gap-1"><Target size={16} className="text-blue-500"/> Nhiệm vụ ngày</span>
            <span>{goalProgress}%</span>
          </div>
          <ProgressBar current={goalProgress} max={100} colorClass="bg-blue-500" heightClass="h-3" />
        </div>
      </div>

      {/* Nhúng Cây Lộ Trình (Path) vào bên dưới */}
      <div className="flex-1 overflow-visible">
        <PathScreen />
      </div>
    </div>
  );
};