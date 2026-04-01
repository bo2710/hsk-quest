// src/shared/lib/audioEngine.ts
class AudioEngine {
  private cache: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  // Preload âm thanh vào RAM để phát ngay lập tức không bị delay
  public preload(url: string, id: string) {
    if (this.cache.has(id)) return;
    const audio = new Audio(url);
    audio.load();
    this.cache.set(id, audio);
  }

  public play(id: string, volume: number = 1.0) {
    if (this.isMuted) return;
    const audio = this.cache.get(id);
    if (audio) {
      // Clone node để có thể phát đè nhiều âm thanh cùng lúc (VD: Bấm liên tục)
      const soundClone = audio.cloneNode() as HTMLAudioElement;
      soundClone.volume = volume;
      soundClone.play().catch(e => console.warn('Audio play blocked by browser:', e));
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

// Bật singleton pattern
export const soundManager = new AudioEngine();