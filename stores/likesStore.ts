import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Profile } from '@/types/profile';
import { zustandStorage } from '@/utils/storage';

type LikesState = {
  likes: Profile[];
  addLike: (profile: Profile) => void;
  removeLike: (id: string) => void;
  clearLikes: () => void;
};

export const useLikesStore = create<LikesState>()(
  persist(
    (set) => ({
      likes: [],
      addLike: (profile) =>
        set((state) => {
          const exists = state.likes.some((item) => item.id === profile.id);
          if (exists) return state;
          return { likes: [...state.likes, profile] };
        }),
      removeLike: (id) => set((state) => ({ likes: state.likes.filter((item) => item.id !== id) })),
      clearLikes: () => set({ likes: [] }),
    }),
    {
      name: '@tinder-likes-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ likes: state.likes }),
    },
  ),
);
