import { create } from "zustand";
import { BeamDesignInput, BeamDesignResults } from "./types";
import { calculateBeamDesign } from "./calculations";

interface BeamDesignState {
  input: BeamDesignInput | null;
  results: BeamDesignResults | null;
  setInput: (input: BeamDesignInput) => void;
  calculate: () => void;
}

const useBeamDesignStore = create<BeamDesignState>()((set) => ({
  input: null,
  results: null,
  setInput: (input) => {
    if (typeof window !== "undefined") {
      set({ input });
    }
  },
  calculate: () => {
    if (typeof window !== "undefined") {
      set((state) => ({
        results: state.input ? calculateBeamDesign(state.input) : null,
      }));
    }
  },
}));

// Selectors
export const selectResults = (state: BeamDesignState) => state.results;
export const selectLastInput = (state: BeamDesignState) => state.input;

export { useBeamDesignStore };
