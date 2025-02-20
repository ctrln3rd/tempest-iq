'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types
interface Settings {
  temperature: string;
  speed: string;
  distance: string;
  autorefreshduration: number;
  radiusthreshold: number;
  [key: string]: string | number; 
}

const defaultSettings: Settings = {
  temperature: "celcius",
  speed: "km/h",
  distance: "metres",
  autorefreshduration: 3,
  radiusthreshold: 10000,
};

// Create context
const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  resetSettings: () => void;
  temperatureUnit: (temp: number) => string;
  temperatureUnitChart: (temp: number) => number;
  speedUnit: (spd: number) => string;
  distanceUnit: (dst: number) => string;
  getAutoAge: () => number;
  getThreshold: () => number;
} | null>(null);

// Provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const saveSettings = (values: Settings) => {
    setSettings(values);
    localStorage.setItem('Settings', JSON.stringify(values));
  };

  useEffect(() => {
    const existingSetting = JSON.parse(localStorage.getItem("Settings") || "null");
    if (existingSetting) {
      setSettings(existingSetting);
    }else{
        saveSettings(defaultSettings)
    }
  }, []);
  

  const updateSettings = (newSettings: Settings) => {
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    saveSettings(defaultSettings);
  };

  const temperatureUnit = (temp: number): string => {
    return settings.temperature === "fahrenheit"
      ? `${Math.round((temp * 9) / 5 + 32)}°`
      : `${Math.round(temp)}°`;
  };

  const temperatureUnitChart = (temp: number): number => {
    return settings.temperature === "fahrenheit"
      ? Math.round((temp * 9) / 5 + 32)
      : Math.round(temp);
  };

  const speedUnit = (spd: number): string => {
    switch (settings.speed) {
      case "m/s": return `${Math.round(spd * 10 / 36)} m/s`;
      case "mph": return `${Math.round(spd * 0.621371)} mph`;
      case "knots": return `${Math.round(spd * 0.539957)} knots`;
      default: return `${Math.round(spd)} km/h`;
    }
  };

  const distanceUnit = (dst: number): string => {
    switch (settings.distance) {
      case "kilometers": return `${Math.round(dst / 1000)} km`;
      case "miles": return `${Math.round(dst / 1609.344)} mi`;
      default: return `${Math.round(dst)} m`;
    }
  };

  const getAutoAge = (): number => settings.autorefreshduration;

  const getThreshold = (): number => settings.radiusthreshold;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        temperatureUnit,
        temperatureUnitChart,
        speedUnit,
        distanceUnit,
        getAutoAge,
        getThreshold,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for accessing settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
