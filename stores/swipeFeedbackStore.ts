import { create } from 'zustand';

type SwipeFeedbackState = {
  likeProgress: number;
  nopeProgress: number;
  setLikeProgress: (value: number) => void;
  setNopeProgress: (value: number) => void;
  reset: () => void;
};

export const useSwipeFeedbackStore = create<SwipeFeedbackState>((set) => ({
  likeProgress: 0,
  nopeProgress: 0,
  setLikeProgress: (value) => set({ likeProgress: value }),
  setNopeProgress: (value) => set({ nopeProgress: value }),
  reset: () => set({ likeProgress: 0, nopeProgress: 0 }),
}));
