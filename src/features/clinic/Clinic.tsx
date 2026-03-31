import { useLiveQuery } from 'dexie-react-hooks';
import { clinicService } from './clinicService';
import { db } from '../../db';
import { Activity, HeartPulse, ShieldAlert, ChevronRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Clinic() {
  const navigate = useNavigate();
  const stats = useLiveQuery(() => clinicService.getHealthStats());
  const fragileItems = useLiveQuery(async () => {
    const progress = await clinicService.getFragileItems();
    // Lấy thông tin chi tiết từ bảng content_items cho các item bị fragile
    const ids = progress.map(p => p.item_id);
    return await db.content_items.where('id').anyOf(ids).toArray();
  });

  if (!stats) return null;

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Header: Chỉ số sức khỏe */}
      <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-red-100 dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
          <HeartPulse size={32} className="animate-pulse" />
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase">Chỉ số sức khỏe</span>
        </div>
        <div className="text-4xl font-black mb-1">{stats.healthPercentage}%</div>
        <p className="text-sm opacity-90 font-medium">
          {stats.fragile > 0 
            ? `Có ${stats.fragile} "vết thương" cần được chữa trị ngay!` 
            : "Tuyệt vời! Kiến thức của bạn đang rất khỏe mạnh."}
        </p>
      </div>

      {/* Nút bắt đầu chữa trị */}
      {stats.fragile > 0 && (
        <button 
          onClick={() => navigate('/session?mode=clinic')}
          className="w-full bg-white dark:bg-gray-800 border-2 border-red-500 text-red-500 p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-red-50 transition-all active:scale-95"
        >
          <PlayCircle size={24} /> BẮT ĐẦU TRỊ LIỆU NGAY
        </button>
      )}

      {/* Danh sách bệnh nhân (Các từ hay sai) */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 uppercase text-sm tracking-wider">
          <ShieldAlert size={18} className="text-red-500" /> Danh sách từ yếu
        </h3>

        {fragileItems?.length === 0 ? (
          <div className="text-center py-10 text-gray-400 italic text-sm">Chưa có dữ liệu sai sót nào.</div>
        ) : (
          <div className="grid gap-3">
            {fragileItems?.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="text-2xl font-black text-gray-900 dark:text-white w-12">{item.hanzi}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{item.pinyin}</div>
                  <div className="text-xs text-gray-500">{item.meaning_vi}</div>
                </div>
                <div className="text-red-500 font-black text-xs bg-red-50 px-2 py-1 rounded-lg">Yếu</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}