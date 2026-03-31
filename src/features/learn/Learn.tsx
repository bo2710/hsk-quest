import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { Search, Book } from 'lucide-react';
import { audioService } from '../../engine/audioService';

export default function Learn() {
  const [searchTerm, setSearchTerm] = useState('');
  const items = useLiveQuery(() => db.content_items.toArray());

  // Lọc từ vựng theo từ khóa tìm kiếm
  const filtered = items?.filter(item =>
    item.hanzi?.includes(searchTerm) ||
    item.pinyin?.includes(searchTerm) ||
    item.meaning_vi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 pb-24 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
          <Book className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Kho từ vựng</h1>
          <p className="text-sm text-gray-500">Tìm kiếm và tra cứu nhanh</p>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative shadow-sm">
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm Hán tự, Pinyin, Nghĩa..."
          className="w-full pl-12 p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 dark:text-white font-medium focus:border-blue-500 transition-colors outline-none"
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Danh sách từ */}
      <div className="space-y-3">
        {filtered?.length === 0 ? (
          <div className="text-center py-10 text-gray-400 italic">Không tìm thấy từ nào.</div>
        ) : (
          filtered?.map(item => (
            <div 
              key={item.id} 
              onClick={() => audioService.play(item.audioRef, item.hanzi)}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-all active:scale-95"
            >
              <div className="text-4xl font-black text-gray-900 dark:text-white w-14 text-center">{item.hanzi}</div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-800 dark:text-gray-200">{item.pinyin}</div>
                <div className="text-sm text-gray-500">{item.meaning_vi}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}