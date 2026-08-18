import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  keepTheoryOpen: boolean;
  setKeepTheoryOpen: (value: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      keepTheoryOpen: false,
      setKeepTheoryOpen: (keepTheoryOpen) => set({ keepTheoryOpen }),
    }),
    { name: "pdc-ui" },
  ),
);
