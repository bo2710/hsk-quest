import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db';
import { loadContentPack } from '../../db/contentLoader';
import { Flame, Target, Zap, ShieldAlert, ChevronRight, DownloadCloud } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Lấy dữ liệu từ IndexedDB
  const profile = useLiveQuery(() => db.user_profile.get('local-user'));
  const vocabCount = useLiveQuery(() => db.content_items.count(), []);
  
  const stats = useLiveQuery(async () => {
    const mastered = await db.user_progress.where('status').equals('mastered').count();
    const fragile = await db.user_progress.where('status').equals('fragile').count();
    return { mastered, fragile };
  });

  if (!profile) return null;

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Chào, {profile.name}!</h1>
          <p className="text-sm text-gray-500">Mục tiêu: {profile.goal === 'hsk_exam' ? 'Thi lấy chứng chỉ' : 'Học duy trì'}</p>
        </div>
        <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full border border-orange-200">
          <Flame size={18} className="text-orange-500 fill-orange-500" />
          <span className="font-bold text-orange-600 dark:text-orange-400">1</span> 
        </div>
      </div>

      {/* NÚT HỌC CHÍNH */}
      <button 
        onClick={() => navigate('/session')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-3xl shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-between group transition-all transform active:scale-95"
      >
        <div className="text-left">
          <div className="text-xs uppercase opacity-80 font-black tracking-widest mb-1">Daily Loop</div>
          <div className="text-2xl font-black">Học ngay 5 phút</div>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl group-hover:translate-x-1 transition-transform">
          <ChevronRight size={24} />
        </div>
      </button>

      {/* Daily Missions */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 uppercase text-sm tracking-wider">
          <Target size={18} className="text-blue-500" /> Nhiệm vụ hôm nay
        </h3>
        
        <div className="grid gap-3">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-xl"><Zap size={20} className="text-yellow-500" /></div>
            <div className="flex-1">
              <div className="font-bold text-sm">Khởi động (Warm-up)</div>
              <div className="text-xs text-gray-500">5 câu ôn lại cơ bản</div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-xl"><ShieldAlert size={20} className="text-red-500" /></div>
            <div className="flex-1">
              <div className="font-bold text-sm">Sửa lỗi (Repair)</div>
              <div className="text-xs text-gray-500">{stats?.fragile || 0} mục cần chữa cháy</div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </div>
      </div>

      {/* Progress & Content Loader */}
      <div className="bg-gray-900 dark:bg-blue-600 p-6 rounded-3xl text-white space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm uppercase tracking-widest opacity-80">HSK {profile.target_level} Progress</span>
          <span className="text-xs font-black bg-white/20 px-2 py-1 rounded-md">{vocabCount || 0} từ đã nạp</span>
        </div>
        
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '5%' }} />
        </div>

        {/* Nút nạp dữ liệu nếu chưa có */}
        {(!vocabCount || vocabCount === 0) && (
          <button 
            onClick={() => loadContentPack('/content/hsk1/vocab.json')}
            className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl flex items-center justify-center gap-2 text-sm"
          >
            <DownloadCloud size={16} /> Nạp dữ liệu HSK {profile.target_level}
          </button>
        )}
      </div>
    </div>
  );
}