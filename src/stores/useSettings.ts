'use client';
import { create } from 'zustand';

// Define types
interface Settings {
  temperature: string;
  speed: string;
  distance: string;
  autorefreshduration: number;
  radiusthreshold: number;
  displaySize: string;
  version: string;
}

const defaultSettings: Settings = {
  temperature: 'celcius',
  speed: 'km/h',
  distance: 'kilometers',
  autorefreshduration: 3,
  radiusthreshold: 10000,
  displaySize: 'sleek',
  version: 'v1',
};

// Zustand store for settings management
export const useSettingsStore = create<{
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  temperatureUnit: (temp: number) => string;
  temperatureUnitChart: (temp: number) => number;
  speedUnit: (spd: number) => string;
  distanceUnit: (dst: number) => string;
  getAutoAge: () => number;
  getThreshold: () => number;
}>((set, get) => ({
  settings: (typeof window !== 'undefined' && localStorage.getItem('Settings'))
    ? JSON.parse(localStorage.getItem('Settings') as string)
    : defaultSettings,

  updateSettings: (newSettings) => {
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('Settings', JSON.stringify(updatedSettings));
      }
      return { settings: updatedSettings };
    });
  },

  resetSettings: () => {
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('Settings', JSON.stringify(defaultSettings));
      }
      return { settings: defaultSettings };
    });
  },

  temperatureUnit: (temp) => {
    const { temperature } = get().settings;
    return temperature === 'fahrenheit'
      ? `${Math.round((temp * 9) / 5 + 32)}°`
      : `${Math.round(temp)}°`;
  },

  temperatureUnitChart: (temp) => {
    const { temperature } = get().settings;
    return temperature === 'fahrenheit'
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);
  },

  speedUnit: (spd) => {
    const { speed } = get().settings;
    switch (speed) {
      case 'm/s': return `${Math.round(spd * 10 / 36)} m/s`;
      case 'mph': return `${Math.round(spd * 0.621371)} mph`;
      case 'knots': return `${Math.round(spd * 0.539957)} knots`;
      default: return `${Math.round(spd)} km/h`;
    }
  },

  distanceUnit: (dst) => {
    const { distance } = get().settings;
    switch (distance) {
      case 'kilometers': return `${Math.round(dst / 1000)} km`;
      case 'miles': return `${Math.round(dst / 1609.344)} mi`;
      default: return `${Math.round(dst)} m`;
    }
  },

  getAutoAge: () => get().settings.autorefreshduration,
  getThreshold: () => get().settings.radiusthreshold,
}));