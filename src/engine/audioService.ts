import { type AudioRef } from '../db';

class AudioService {
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  // 1. Hàm tải ngầm (Lazy-load): Chỉ gọi khi user chuẩn bị vào bài học
  preloadPack(packId: string) {
    if (!this.audioCache.has(packId)) {
      const audio = new Audio(`/audio/${packId}.mp3`);
      audio.preload = 'auto'; // Báo cho trình duyệt biết cần tải file này về Cache trước
      this.audioCache.set(packId, audio);
      console.log(`[AudioService] Đã tải ngầm Audio Pack: ${packId}`);
    }
  }

  // 2. Hàm phát âm thanh (Audio Sprite)
  async play(ref?: AudioRef, fallbackText?: string) {
    if (!ref) {
      if (fallbackText) this.playTTS(fallbackText);
      return;
    }

    try {
      let audio = this.audioCache.get(ref.packId);
      
      // Nếu chưa được preload (cache miss), thì tạo mới
      if (!audio) {
        audio = new Audio(`/audio/${ref.packId}.mp3`);
        this.audioCache.set(ref.packId, audio);
      }

      // Tua đến đúng thời gian bắt đầu của từ đó (Cắt Sprite)
      audio.currentTime = ref.startMs / 1000;
      audio.play();

      // Tự động dừng khi hết thời lượng của từ
      setTimeout(() => {
        audio?.pause();
      }, ref.endMs - ref.startMs);

    } catch (error) {
      console.error("Lỗi phát audio file, chuyển sang đọc AI:", error);
      if (fallbackText) this.playTTS(fallbackText);
    }
  }

  // 3. Fallback: Đọc bằng AI offline nếu không có file hoặc file lỗi
  private playTTS(text: string) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

export const audioService = new AudioService();