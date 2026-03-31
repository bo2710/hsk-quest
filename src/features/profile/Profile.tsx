import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { profileService } from '../../db/profileService';
import { useAppStore } from '../../store/useAppStore';
import { User, Award, Flame, Moon, Volume2, Type, Settings2 } from 'lucide-react';

export default function Profile() {
  // Lấy dữ liệu từ DB và Global Store
  const profile = useLiveQuery(() => db.user_profile.get('local-user'));
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const stats = useLiveQuery(async () => {
    const mastered = await db.user_progress.where('status').equals('mastered').count();
    const totalSeen = await db.user_progress.count();
    return { mastered, totalSeen };
  });

  if (!profile) return null;

  // Hàm xử lý bật/tắt cài đặt và lưu thẳng vào Database
  const handleTogglePref = async (key: keyof typeof profile.preferences) => {
    const newValue = !profile.preferences[key];
    await profileService.updatePreferences({ [key]: newValue });
  };

  return (
    <div className="p-5 space-y-6 animate-fade-in pb-24">
      {/* Header: Avatar & Info */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full p-1 mb-4 shadow-xl shadow-blue-200 dark:shadow-none">
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-transparent">
            <User size={40} className="text-blue-500" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{profile.name}</h1>
        <p className="text-gray-500 font-medium">Chiến thần HSK {profile.target_level}</p>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
          <Flame size={28} className="text-orange-500 mb-2" />
          <div className="text-2xl font-black text-gray-900 dark:text-white">1</div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Ngày Streak</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
          <Award size={28} className="text-blue-500 mb-2" />
          <div className="text-2xl font-black text-gray-900 dark:text-white">{stats?.mastered || 0}</div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Từ Mastered</div>
        </div>
      </div>

      {/* Cài đặt (Settings) */}
      <div className="space-y-4 pt-4">
        <h3 className="font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 uppercase text-sm tracking-wider px-2">
          <Settings2 size={18} className="text-gray-400" /> Cài đặt ứng dụng
        </h3>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Nút bật/tắt Dark Mode */}
          <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl"><Moon size={20} className="text-gray-700 dark:text-gray-300" /></div>
              <div className="font-bold text-gray-800 dark:text-gray-200">Giao diện Tối</div>
            </div>
            <button 
              onClick={() => {
                toggleDarkMode();
                handleTogglePref('dark_mode');
              }}
              className={`w-14 h-8 rounded-full transition-colors relative ${isDarkMode ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Nút bật/tắt Âm thanh */}
          <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl"><Volume2 size={20} className="text-blue-500" /></div>
              <div className="font-bold text-gray-800 dark:text-gray-200">Tự động phát Âm thanh</div>
            </div>
            <button 
              onClick={() => handleTogglePref('sound')}
              className={`w-14 h-8 rounded-full transition-colors relative ${profile.preferences.sound ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${profile.preferences.sound ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Nút bật/tắt Pinyin */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-xl"><Type size={20} className="text-green-500" /></div>
              <div className="font-bold text-gray-800 dark:text-gray-200">Hiển thị Pinyin trợ giúp</div>
            </div>
            <button 
              onClick={() => handleTogglePref('romanization')}
              className={`w-14 h-8 rounded-full transition-colors relative ${profile.preferences.romanization ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${profile.preferences.romanization ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}