import { create } from 'zustand';

import { Profile } from '@/types/profile';

type SwipeRecord = { profile: Profile; direction: 'left' | 'right' };

type SwipeState = {
  currentIndex: number;
  swipeHistory: SwipeRecord[];
  setCurrentIndex: (index: number) => void;
  addSwipe: (record: SwipeRecord) => void;
  popSwipe: () => SwipeRecord | null;
  reset: () => void;
};

export const useSwipeStore = create<SwipeState>((set) => ({
  currentIndex: 0,
  swipeHistory: [],
  setCurrentIndex: (index) => set({ currentIndex: index }),
  addSwipe: (record) => set((state) => ({ swipeHistory: [...state.swipeHistory, record] })),
  popSwipe: () => {
    let popped: SwipeRecord | null = null;
    set((state) => {
      if (state.swipeHistory.length === 0) return state;
      popped = state.swipeHistory[state.swipeHistory.length - 1];
      const nextHistory = state.swipeHistory.slice(0, -1);
      return { swipeHistory: nextHistory };
    });
    return popped;
  },
  reset: () => set({ currentIndex: 0, swipeHistory: [] }),
}));
