import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, BrainCircuit, CheckCircle} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { progressRepository } from '../../db/repositories/progressRepository';
import { Button } from '../../shared/components/Button';

export const PracticeHubScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeUserId } = useAppStore();
  const [dueCount, setDueCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeUserId) return;
    const fetchDue = async () => {
      setIsLoading(true);
      const items = await progressRepository.getDueItems(activeUserId, Date.now());
      setDueCount(items.length);
      setIsLoading(false);
    };
    fetchDue();
  }, [activeUserId]);

  if (isLoading) return <div className="p-6 text-center font-bold text-slate-400">Đang quét trí nhớ...</div>;

  return (
    <div className="flex flex-col gap-6 p-4 animate-[fade-in-right_0.3s_ease-out]">
      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
        <BrainCircuit className="text-purple-500" /> Lò Luyện Tập
      </h2>
      
      <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-slate-200 text-center relative overflow-hidden">
        {dueCount > 0 ? (
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-200">
              <Dumbbell size={48} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Tới giờ mài gươm!</h3>
            <p className="text-slate-500 font-medium mb-8 text-lg">
              Thuật toán phát hiện <span className="text-red-500 font-black text-2xl mx-1">{dueCount}</span> từ vựng bạn sắp quên.
            </p>
            <Button 
              variant="battle" 
              size="lg" 
              className="w-full text-xl h-16"
              onClick={() => navigate('/session/review')}
            >
              VÀO LÒ ÔN TẬP
            </Button>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center py-8">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-200">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Trí nhớ kim cương!</h3>
            <p className="text-slate-500 font-medium mb-8 text-lg">Không có từ vựng nào cần ôn lúc này. Hãy đi học bài mới nhé.</p>
            <Button variant="secondary" size="lg" className="w-full text-lg" onClick={() => navigate('/')}>
              QUAY VỀ LỘ TRÌNH
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};