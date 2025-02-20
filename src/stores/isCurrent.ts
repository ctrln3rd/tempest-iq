import { create } from "zustand";

interface IsCurrentCheckedState {
  isCurrentChecked: boolean;
  setIsCurrentChecked: (checked: boolean) => void;
}

export const useIsCurrentCheckedStore = create<IsCurrentCheckedState>((set) => ({
  isCurrentChecked: false,
  setIsCurrentChecked: (checked) => set({ isCurrentChecked: checked }),
}));
