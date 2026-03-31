import { create } from 'zustand';
import { profileService } from '../db/profileService';

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  hasProfile: boolean | null; // null: đang check, true: đã có, false: chưa có
  checkProfile: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  hasProfile: null,
  toggleDarkMode: () => set((state) => {
    const newMode = !state.isDarkMode;
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { isDarkMode: newMode };
  }),
  checkProfile: async () => {
    const profile = await profileService.getProfile();
    set({ hasProfile: !!profile });
  }
}));