import { useState, useEffect } from 'react';
import { db, type ContentItem } from '../../db';
import { questionGenerator } from '../../engine/generator';
import { Swords, Heart } from 'lucide-react';

export default function Battle() {
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(3);
  const [currentQ, setCurrentQ] = useState<any>(null);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Load câu hỏi ngẫu nhiên làm đòn tấn công
  const loadQuestion = async () => {
    const items = await db.content_items.toArray();
    if(items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const q = await questionGenerator.generateMCQ(randomItem);
      setCurrentQ(q);
    }
  };

  useEffect(() => { loadQuestion(); }, []);

  const handleAttack = (choice: string) => {
    if (choice === currentQ?.correctAnswer) {
      // Đánh trúng Boss (-25 HP)
      const newBossHp = bossHp - 25;
      setBossHp(newBossHp);
      if (newBossHp <= 0) setStatus('won');
      else loadQuestion();
    } else {
      // Đánh trượt, bị Boss phản đòn (-1 Tim)
      const newPlayerHp = playerHp - 1;
      setPlayerHp(newPlayerHp);
      if (newPlayerHp <= 0) setStatus('lost');
    }
  };

  if (status === 'won') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center pt-20 animate-in zoom-in">
        <div className="text-8xl mb-4">👑</div>
        <h2 className="text-3xl font-black text-green-500 uppercase tracking-tighter mb-2">Boss Bị Hạ!</h2>
        <p className="text-gray-500 mb-8">Bạn nhận được +50 EXP vào Profile.</p>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-gray-900 dark:bg-blue-600 text-white font-black rounded-2xl">Đánh lại</button>
      </div>
    );
  }

  if (status === 'lost') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center pt-20 animate-in zoom-in">
        <div className="text-8xl mb-4 text-red-500">💀</div>
        <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter mb-2">Thất bại!</h2>
        <p className="text-gray-500 mb-8">Bạn đã hết sạch thể lực.</p>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl">Thử lại lần nữa</button>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24 space-y-8 animate-fade-in flex flex-col h-full mt-4">
      {/* Khung Máu Boss */}
      <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl border-2 border-red-100 dark:border-red-800 shadow-sm relative overflow-hidden">
        <div className="z-10 w-full pr-16">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Ma Vương HSK</span>
            <span className="text-xs font-bold text-red-500">{bossHp}/100</span>
          </div>
          <div className="w-full h-4 bg-white dark:bg-red-950 rounded-full overflow-hidden border border-red-200 dark:border-red-800">
            <div className="h-full bg-red-500 transition-all duration-500" style={{width: `${bossHp}%`}}/>
          </div>
        </div>
        <div className="text-6xl absolute right-2 -bottom-2 z-0 opacity-80 animate-bounce">👹</div>
      </div>
      
      {/* Khung Sinh Lực Player */}
      <div className="flex justify-center items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase mr-2">Sinh lực:</span>
        {[...Array(3)].map((_, i) => (
          <Heart key={i} size={28} className={`transition-all ${i < playerHp ? "text-red-500 fill-red-500 scale-110" : "text-gray-200 dark:text-gray-700"}`} />
        ))}
      </div>

      {/* Giao diện tung chiêu (Câu hỏi) */}
      {currentQ && (
        <div className="flex-1 flex flex-col items-center text-center mt-10">
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-md mb-6">Đọc chiêu thức để tấn công</span>
          <h1 className="text-7xl font-black dark:text-white mb-2">{currentQ.question}</h1>
          <p className="text-xl text-gray-400 font-bold italic mb-8">[{currentQ.pinyin}]</p>
          
          <div className="grid gap-3 w-full">
            {currentQ.choices.map((c: string) => (
              <button 
                key={c} 
                onClick={() => handleAttack(c)} 
                className="p-5 border-2 border-gray-100 dark:border-gray-800 rounded-3xl font-black text-lg active:bg-blue-50 dark:active:bg-blue-900/30 dark:text-white transition-all active:scale-95 hover:border-blue-400"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}