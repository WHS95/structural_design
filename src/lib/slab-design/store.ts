import { create } from "zustand";
import { SlabDesignInput, SlabDesignResults } from "./types";
import { calculateSlabDesign } from "./calculations";

interface SlabDesignState {
  input: SlabDesignInput | null;
  results: SlabDesignResults | null;
  setInput: (input: SlabDesignInput) => void;
  calculate: () => void;
}

export const useSlabDesignStore = create<SlabDesignState>((set) => ({
  input: null,
  results: null,
  setInput: (input) => set({ input }),
  calculate: () =>
    set((state) => ({
      results: state.input ? calculateSlabDesign(state.input) : null,
    })),
}));

// 선택자 함수들
export const selectResults = (state: SlabDesignState) => state.results;
export const selectLastInput = (state: SlabDesignState) => state.input;
