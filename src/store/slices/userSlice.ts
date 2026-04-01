import { type StateCreator } from 'zustand';
import { profileDomain } from '../../domains/profile';
import { profileRepository } from '../../db/repositories/profileRepository';
import type { UserProfile } from '../../entities/profile';
import type { DailyState } from '../../entities/daily-state';

export interface UserSlice {
  activeUserId: string | null;
  profile: UserProfile | null;
  dailyState: DailyState | null;
  isAuthLoading: boolean;
  
  // Actions
  setActiveUser: (id: string) => void;
  login: (username: string) => Promise<void>;
  fetchDailyStatus: () => Promise<void>;
  logout: () => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set, get) => ({
  activeUserId: null,
  profile: null,
  dailyState: null,
  isAuthLoading: false,

  setActiveUser: (id: string) => set({ activeUserId: id }),

  login: async (username: string) => {
    set({ isAuthLoading: true });
    try {
      const userId = await profileDomain.loginOrCreate(username);
      const profile = await profileRepository.getProfile(userId);
      const dailyState = await profileDomain.getTodayState(userId);
      
      set({ activeUserId: userId, profile, dailyState, isAuthLoading: false });
    } catch (error) {
      console.error('Login failed:', error);
      set({ isAuthLoading: false });
    }
  },

  fetchDailyStatus: async () => {
    const { activeUserId } = get();
    if (!activeUserId) return;
    const dailyState = await profileDomain.getTodayState(activeUserId);
    set({ dailyState });
  },

  logout: () => set({ activeUserId: null, profile: null, dailyState: null })
});