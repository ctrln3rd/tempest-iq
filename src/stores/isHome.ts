import { create } from "zustand";

interface HomeStates {
  isCurrentChecked: boolean;
  setIsCurrentChecked: (checked: boolean) => void;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  isCurrentRefresh: boolean;
  setCurrentRefresh: (refresh: boolean) => void;
}

export const useHomeStore = create<HomeStates>((set) => ({
  isCurrentChecked: false,
  setIsCurrentChecked: (checked) => set({ isCurrentChecked: checked }),
  isEditMode: false,
  setEditMode: (mode) => set({ isEditMode: mode }),
  isCurrentRefresh: false,
  setCurrentRefresh: (refresh) => set({ isCurrentRefresh: refresh }),
}));
