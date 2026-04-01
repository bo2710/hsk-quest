import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { profileRepository } from '../../db/repositories/profileRepository';
import { Button } from '../../shared/components/Button';
import { Flame, Target, BookOpen, Clock, User } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthLoading } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: 'Khánh',
    goal: 'hsk_exam',
    targetLevel: 5,
    dailyTimeMinutes: 15
  });

  const handleFinish = async () => {
    // 1. Khởi tạo Nick qua Store (V2 Logic)
    await login(formData.username);
    
    // 2. Lấy ID của user vừa tạo/đăng nhập từ Store
    const state = useAppStore.getState();
    const activeUserId = state.activeUserId;

    if (activeUserId) {
      // 3. Cập nhật các thiết lập chi tiết xuống Database (V2 DB)
      await profileRepository.updateProfile(activeUserId, {
        targetLevel: formData.targetLevel,
        dailyGoalMinutes: formData.dailyTimeMinutes
      });
      
      // 4. Update trực tiếp state profile hiện tại cho nóng
      useAppStore.setState({
        profile: { ...state.profile!, targetLevel: formData.targetLevel, dailyGoalMinutes: formData.dailyTimeMinutes }
      });
    }
    
    // Đá thẳng vào Lộ trình
    navigate('/');
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full z-10 pt-10">
        
        {/* Header (Thanh tiến trình) */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-500",
                step >= i ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-700"
              )} 
            />
          ))}
        </div>

        {/* CÁC BƯỚC ONBOARDING */}
        <div className="flex-1 relative">
          
          {/* Step 1: Nhập Tên (Bắt buộc cho V2) */}
          {step === 1 && (
            <div className="animate-[fade-in-right_0.3s_ease-out]">
              <div className="flex justify-center mb-6"><User size={64} className="text-blue-400" /></div>
              <h2 className="text-3xl font-black text-center mb-8">Danh xưng của dũng sĩ?</h2>
              <input
                type="text"
                placeholder="Nhập tên..."
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-800 border-2 border-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-xl font-bold text-center mb-6"
                autoFocus
              />
              <Button size="lg" className="w-full" onClick={nextStep} disabled={!formData.username.trim()}>
                Tiếp tục
              </Button>
            </div>
          )}

          {/* Step 2: Chọn mục tiêu (Kế thừa V1) */}
          {step === 2 && (
            <div className="animate-[fade-in-right_0.3s_ease-out]">
              <div className="flex justify-center mb-6"><Target size={64} className="text-purple-400" /></div>
              <h2 className="text-3xl font-black text-center mb-8">Mục tiêu của bạn?</h2>
              <div className="flex flex-col gap-4">
                {[
                  { id: 'hsk_exam', label: '🎓 Thi lấy chứng chỉ HSK' },
                  { id: 'communicate', label: '🗣️ Giao tiếp đời sống' },
                  { id: 'maintain', label: '🔥 Học duy trì mỗi ngày' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setFormData({ ...formData, goal: item.id }); nextStep(); }}
                    className="p-5 text-left border-2 border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-slate-800 transition-all font-bold text-lg text-slate-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Cấp độ HSK */}
          {step === 3 && (
            <div className="animate-[fade-in-right_0.3s_ease-out]">
              <div className="flex justify-center mb-6"><BookOpen size={64} className="text-green-400" /></div>
              <h2 className="text-3xl font-black text-center mb-8">Mục tiêu chinh phục?</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(level => (
                  <button
                    key={level}
                    onClick={() => { setFormData({ ...formData, targetLevel: level }); nextStep(); }}
                    className={cn(
                      "p-5 border-2 rounded-2xl transition-all font-black text-xl text-center",
                      formData.targetLevel === level 
                        ? "border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                        : "border-slate-700 hover:border-slate-500 text-slate-300"
                    )}
                  >
                    HSK {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Thời gian học mỗi ngày */}
          {step === 4 && (
            <div className="animate-[fade-in-right_0.3s_ease-out]">
              <div className="flex justify-center mb-6"><Clock size={64} className="text-orange-400" /></div>
              <h2 className="text-3xl font-black text-center mb-8">Bạn có bao nhiêu phút?</h2>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { time: 5, label: '5 phút (Chống cháy)' },
                  { time: 15, label: '15 phút (Tiêu chuẩn)' },
                  { time: 30, label: '30 phút (Bứt tốc)' }
                ].map(item => (
                  <button
                    key={item.time}
                    onClick={() => setFormData({ ...formData, dailyTimeMinutes: item.time })}
                    className={cn(
                      "p-5 text-left border-2 rounded-2xl transition-all font-bold text-lg",
                      formData.dailyTimeMinutes === item.time 
                        ? "border-orange-500 bg-orange-500/20 text-orange-400" 
                        : "border-slate-700 text-slate-300"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              <Button 
                variant="battle" 
                size="lg" 
                onClick={handleFinish} 
                isLoading={isAuthLoading}
                className="w-full text-xl h-16"
              >
                KHAI MỞ HÀNH TRÌNH <Flame className="ml-2" />
              </Button>
            </div>
          )}

        </div>

        {/* Nút Back ẩn hiện tùy Step */}
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="mt-6 text-slate-500 font-bold hover:text-slate-300 transition-colors py-4"
          >
            ← Quay lại
          </button>
        )}
      </div>
    </div>
  );
};