import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ProgressBar } from '../../shared/components/ProgressBar';
import { useGameTimer } from '../../shared/hooks/useGameTimer';
import { Swords, Heart, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export const ExercisePlayerScreen: React.FC = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  // 1. Kết nối Store
  const { 
    activeUserId, 
    startLesson, 
    answerCurrentQuestion, 
    quitSession, 
    questions, 
    currentIndex, 
    battleState, 
    isSessionActive 
  } = useAppStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // 2. Đồng hồ đếm ngược (60 giây sinh tử)
  const { timeLeft, start, pause } = useGameTimer(60, () => {
    alert('HẾT GIỜ! Boss đã tung chiêu cuối, bạn đã thất bại!');
    handleQuit();
  });

  // 3. Khởi tạo trận đấu (ĐÃ KHÓA CHẶT VÒNG LẶP INFINITE LOOP)
  useEffect(() => {
    if (activeUserId && lessonId) {
      startLesson(lessonId, 1); 
      start(); 
    }
    
    return () => {
      quitSession();
      pause();
    };
    
    // Bỏ qua cảnh báo linter để ép React chỉ chạy effect này 1 lần duy nhất khi vào map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, activeUserId]);

  const handleQuit = () => {
    quitSession();
    pause();
    navigate('/');
  };

  const currentQ = questions[currentIndex];

  // 4. Xử lý khi người dùng chọn đáp án
  const handleSelect = (option: string) => {
    if (isAnswering || !activeUserId || !currentQ) return;
    
    setSelectedOption(option);
    setIsAnswering(true);
    
    const isCorrect = option === currentQ.correctAnswer;
    const timeSpent = 60 - timeLeft; 

    setTimeout(async () => {
      await answerCurrentQuestion(isCorrect, timeSpent);
      
      setSelectedOption(null);
      setIsAnswering(false);
      
      const isLastQuestion = currentIndex >= questions.length - 1;
      const isBossDead = battleState && battleState.bossHp <= 0;
      const isPlayerDead = battleState && battleState.playerHp <= 0;

      if (isLastQuestion || isBossDead || isPlayerDead) {
        pause();
        if (isPlayerDead) alert('BẠN ĐÃ TỬ TRẬN! Hãy luyện tập thêm nhé.');
        else alert('CHIẾN THẮNG! Boss đã bị tiêu diệt sạch sẽ!');
        navigate('/');
      }
    }, 1000);
  };

  // Màn hình chờ nếu dữ liệu đang nạp
  if (!isSessionActive || !battleState || !currentQ) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-900 text-white gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-black tracking-widest animate-pulse uppercase">Đang chuẩn bị vũ khí...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden relative font-sans">
      
      {/* --- HUD: THANH TRẠNG THÁI --- */}
      <div className="p-5 bg-slate-800/80 backdrop-blur-md border-b-2 border-slate-700 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-2xl border border-green-500/30">
            <Heart size={20} className={cn("fill-green-500 text-green-500", battleState.playerHp < 30 && "animate-[heartbeat_1s_infinite]")} />
            <span className="font-black text-green-400">{battleState.playerHp}</span>
          </div>

          <div className={cn(
            "text-3xl font-black transition-colors",
            timeLeft < 10 ? "text-red-500 animate-pulse" : "text-white"
          )}>
            {Math.ceil(timeLeft)}s
          </div>

          <div className="flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-2xl border border-red-500/30 text-right">
            <span className="font-black text-red-500">{battleState.bossHp}</span>
            <ShieldAlert size={20} className="fill-red-500 text-red-500" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-yellow-400 fill-yellow-400" />
          <ProgressBar 
            current={currentIndex + 1} 
            max={questions.length} 
            colorClass="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            heightClass="h-2.5" 
          />
        </div>

        {battleState.combo > 1 && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-orange-400 font-black italic text-3xl animate-[pulse-glow_0.8s_infinite] drop-shadow-2xl">
            {battleState.combo}x COMBO!
          </div>
        )}
      </div>

      {/* --- ARENA: KHU VỰC CÂU HỎI --- */}
      <main className="flex-1 flex flex-col p-6 pt-12 relative overflow-y-auto no-scrollbar">
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6">
          <div className="bg-slate-800/30 p-8 rounded-full mb-4 border border-slate-700/50">
            <Swords size={48} className="text-slate-500 opacity-40 animate-pulse" />
          </div>
          
          <h2 className="text-4xl font-black leading-tight tracking-tight drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            {currentQ.questionText}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-10">
          {currentQ.options.map((option: string, idx: number) => {
            const isCorrectOption = option === currentQ.correctAnswer;
            const isSelected = option === selectedOption;
            
            return (
              <button
                key={idx}
                disabled={isAnswering}
                onClick={() => handleSelect(option)}
                className={cn(
                  "p-5 rounded-2xl text-xl font-bold transition-all duration-200 border-2 border-b-[6px] relative overflow-hidden",
                  !isAnswering && "bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-200 active:translate-y-1 active:border-b-2",
                  isAnswering && isCorrectOption && "bg-green-500 border-green-700 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] z-20",
                  isAnswering && isSelected && !isCorrectOption && "bg-red-500 border-red-700 text-white animate-[shake_0.4s_ease-in-out]",
                  isAnswering && !isCorrectOption && !isSelected && "bg-slate-800 border-slate-700 opacity-20 scale-95"
                )}
              >
                {option}
                {isAnswering && isCorrectOption && (
                   <Zap size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-white animate-bounce" />
                )}
              </button>
            );
          })}
        </div>
      </main>

      <button 
        onClick={handleQuit}
        className="absolute top-4 right-4 z-20 text-slate-500 hover:text-white transition-colors text-2xl"
      >
        ✕
      </button>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, 0) scale(1); filter: brightness(1); }
          50% { transform: translate(-50%, -5px) scale(1.1); filter: brightness(1.3); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px) rotate(-2deg); }
          40% { transform: translateX(6px) rotate(2deg); }
          60% { transform: translateX(-4px) rotate(-1deg); }
          80% { transform: translateX(4px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default ExercisePlayerScreen;