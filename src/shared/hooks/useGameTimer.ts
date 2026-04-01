// src/shared/hooks/useGameTimer.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export const useGameTimer = (initialSeconds: number, onComplete?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  
  // Dùng useRef để tránh re-render liên tục gây nghẽn cổ chai
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;
    
    const now = performance.now();
    const remaining = Math.max(0, (endTimeRef.current - now) / 1000);
    
    setTimeLeft(remaining);

    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  const start = useCallback(() => {
    if (isRunning) return;
    endTimeRef.current = performance.now() + timeLeft * 1000;
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [isRunning, timeLeft, tick]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const reset = useCallback((newTime: number = initialSeconds) => {
    pause();
    setTimeLeft(newTime);
  }, [initialSeconds, pause]);

  // Cleanup khi Component bị hủy
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { timeLeft, isRunning, start, pause, reset };
};