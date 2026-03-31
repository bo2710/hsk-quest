import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, type ContentItem } from '../../db';
import { questionGenerator } from '../../engine/generator';
import { srsEngine } from '../../engine/srs';
import { audioService } from '../../engine/audioService';
import { CheckCircle2, XCircle, ArrowRight, Volume2, X } from 'lucide-react';

export default function ExerciseSession() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const initSession = async () => {
      const allItems = await db.content_items.toArray();
      if (allItems.length === 0) {
        alert("Chưa có dữ liệu! Hãy nạp HSK ở Dashboard trước.");
        navigate('/home');
        return;
      }
      
      const shuffled = allItems.sort(() => 0.5 - Math.random()).slice(0, 5);
      setItems(shuffled);
      
      // --- LOGIC LAZY LOAD AUDIO TẠI ĐÂY ---
      // Lọc ra danh sách các Audio Pack cần dùng trong phiên học này
      const uniquePacks = new Set(
        shuffled.map(item => item.audioRef?.packId).filter(Boolean) as string[]
      );
      // Ra lệnh tải ngầm
      uniquePacks.forEach(packId => audioService.preloadPack(packId));
      // -------------------------------------

      generateQuestion(shuffled[0]);
    };
    initSession();
  }, []);

  const generateQuestion = async (item: ContentItem) => {
    const q = await questionGenerator.generateMCQ(item);
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setStartTime(Date.now());
    
    // Auto-play khi hiển thị
    setTimeout(() => {
      audioService.play(item.audioRef, item.hanzi);
    }, 300);
  };

  const handleAnswer = async (choice: string) => {
    if (selectedAnswer) return;

    const responseTime = Date.now() - startTime;
    const correct = choice === currentQuestion.correctAnswer;
    setSelectedAnswer(choice);

    const item = items[currentIndex];
    const currentProgress = await db.user_progress.get(item.id) || {
      item_id: item.id, status: 'new', mastery_score: 0, stability: 0, familiarity: 0,
      last_seen_at: new Date().toISOString(), next_review_at: new Date().toISOString(),
      times_seen: 0, times_correct: 0, times_wrong: 0, avg_response_ms: 0, error_tags: []
    };

    const updatedData = srsEngine.calculateNextReview(currentProgress as any, correct);
    await db.user_progress.put({ ...currentProgress, ...updatedData } as any);
    
    await db.exercise_logs.add({
      item_id: item.id,
      created_at: new Date().toISOString(),
      is_correct: correct,
      response_time_ms: responseTime,
      error_type: correct ? undefined : 'wrong_meaning'
    });
  };

  const nextQuestion = () => {
    if (currentIndex < items.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      generateQuestion(items[nextIdx]);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center animate-fade-in bg-white dark:bg-gray-900">
        <div className="text-8xl mb-6">🏆</div>
        <h2 className="text-3xl font-black mb-2 dark:text-white uppercase tracking-tighter">Hoàn thành!</h2>
        <p className="text-gray-500 mb-10 font-medium">Hệ thống SRS đã cập nhật tiến độ của bạn.</p>
        <button onClick={() => navigate('/home')} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none transition-transform active:scale-95">
          QUAY VỀ DASHBOARD
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 p-6 relative overflow-hidden">
      <button onClick={() => navigate('/home')} className="absolute top-6 left-6 p-2 text-gray-300 hover:text-gray-600 transition-colors">
        <X size={28} />
      </button>

      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-14 mb-10">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-md">
          Nhận diện mặt chữ
        </span>
        <h1 className="text-8xl font-black dark:text-white tracking-tighter animate-in fade-in zoom-in duration-300">
          {currentQuestion.question}
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-gray-400 font-bold italic tracking-wide">
            [{currentQuestion.pinyin}]
          </p>
          <button 
            onClick={() => audioService.play(items[currentIndex].audioRef, items[currentIndex].hanzi)}
            className="p-5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none active:scale-90 transition-all"
          >
            <Volume2 size={32} fill="white" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 mb-6">
        {currentQuestion.choices.map((choice: string) => {
          const isThisCorrect = choice === currentQuestion.correctAnswer;
          const isThisSelected = selectedAnswer === choice;
          let btnStyle = "p-5 text-left border-2 rounded-3xl font-black text-lg transition-all duration-200 ";
          
          if (!selectedAnswer) {
            btnStyle += "border-gray-100 dark:border-gray-800 dark:text-white hover:border-blue-400 active:scale-[0.98]";
          } else if (isThisCorrect) {
            btnStyle += "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 shadow-sm shadow-green-100";
          } else if (isThisSelected) {
            btnStyle += "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 animate-shake";
          } else {
            btnStyle += "border-transparent opacity-30 dark:text-white scale-95";
          }

          return (
            <button key={choice} onClick={() => handleAnswer(choice)} className={btnStyle} disabled={!!selectedAnswer}>
              <div className="flex justify-between items-center">
                {choice}
                {selectedAnswer && isThisCorrect && <CheckCircle2 size={24} strokeWidth={3} />}
                {isThisSelected && !isThisCorrect && <XCircle size={24} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      <div className={`h-24 transition-all duration-300 ${selectedAnswer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button onClick={nextQuestion} className="w-full py-5 bg-gray-900 dark:bg-blue-700 text-white font-black rounded-3xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform">
          TIẾP THEO <ArrowRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}