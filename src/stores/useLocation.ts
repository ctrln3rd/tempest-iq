import { create } from "zustand";

interface Location {
  name: string;
  lat: number;
  lon: number;
  id: number;
  country: string;
  current: boolean;
}

interface SelectedLocationStore {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}

export const useSelectedLocationStore = create<SelectedLocationStore>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
