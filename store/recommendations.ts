import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecommendationState {
  selected: number;
  setSelected: (selected: number) => void;
}

export const useRecommendationStore = create<RecommendationState>()(
  devtools(
    persist(
      (set) => ({
        selected: 0,
        setSelected: (selected) => set(() => ({ selected: selected })),
      }),
      {
        name: "recommendation-storage",  storage: createJSONStorage(() => AsyncStorage), 
      }
    )
  )
);
