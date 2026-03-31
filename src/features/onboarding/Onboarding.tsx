import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../db/profileService';
import { useAppStore } from '../../store/useAppStore';

export default function Onboarding() {
  const navigate = useNavigate();
  const checkProfile = useAppStore(state => state.checkProfile);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    target_level: 1,
    daily_time_minutes: 10
  });

  const handleFinish = async () => {
    // 1. Lưu vào Database cục bộ
    await profileService.createProfile({
      name: 'Chiến thần HSK',
      goal: formData.goal,
      target_level: formData.target_level,
      daily_time_minutes: formData.daily_time_minutes,
      current_estimated_level: Math.max(1, formData.target_level - 1) // Tạm ước tính level hiện tại
    });
    
    // 2. Cập nhật state toàn cục và chuyển về Home
    await checkProfile();
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full gap-8">
        
        {/* Header (Thanh tiến trình) */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        {/* Step 1: Chọn mục tiêu */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mục tiêu học của bạn là gì?</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'hsk_exam', label: '🎓 Thi lấy chứng chỉ HSK' },
                { id: 'communicate', label: '🗣️ Giao tiếp đời sống' },
                { id: 'maintain', label: '🔥 Học duy trì mỗi ngày' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setFormData({ ...formData, goal: item.id }); setStep(2); }}
                  className="p-4 text-left border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Cấp độ HSK mục tiêu */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bạn muốn đạt HSK mấy?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map(level => (
                <button
                  key={level}
                  onClick={() => { setFormData({ ...formData, target_level: level }); setStep(3); }}
                  className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all font-bold text-lg text-center text-gray-700 dark:text-gray-200"
                >
                  HSK {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Thời gian học mỗi ngày */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mỗi ngày bạn có bao nhiêu phút?</h2>
            <div className="flex flex-col gap-3 mb-8">
              {[
                { time: 5, label: '5 phút (Chống cháy)' },
                { time: 10, label: '10 phút (Tiêu chuẩn)' },
                { time: 20, label: '20 phút (Bứt tốc)' }
              ].map(item => (
                <button
                  key={item.time}
                  onClick={() => setFormData({ ...formData, daily_time_minutes: item.time })}
                  className={`p-4 text-left border-2 rounded-xl transition-all font-medium ${
                    formData.daily_time_minutes === item.time 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-ui-correct text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-lg"
            >
              Bắt đầu hành trình 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}