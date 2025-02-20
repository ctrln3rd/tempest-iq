'use client';
import { createContext, useContext, useState, ReactNode } from "react";

// Define types
export interface WeatherCondition {
  codes: number[];
  icon: string;
  iconnight: string;
  background: string;
  backgroundnight: string;
}

export interface MoonPhase {
  text: string;
  image: string;
}

// Weather conditions
const codeDetails: Record<string, WeatherCondition> = {
  clear: { codes: [0], icon: "clear.png", iconnight: "clear-night.png", background: "clear.jpg", backgroundnight: "clear-night.jpg" },
  "mostly clear": { codes: [1], icon: "clear.png", iconnight: "clear-night.png", background: "clear.jpg", backgroundnight: "clear-night.jpg" },
  "partly cloudy": { codes: [2], icon: "p-cloudy.png", iconnight: "p-cloudy-night.png", background: "p-cloudy.jpg", backgroundnight: "p-cloudy-night.jpg" },
  cloudy: { codes: [3], icon: "cloudy.png", iconnight: "cloudy.png", background: "cloudy.jpg", backgroundnight: "cloudy-night.jpg" },
  fog: { codes: [45, 48], icon: "fog.png", iconnight: "fog.png", background: "fog.jpg", backgroundnight: "fog-night.jpg" },
  drizzle: { codes: [51, 53, 55, 56, 57], icon: "drizzle.png", iconnight: "drizzle.png", background: "drizzle.jpg", backgroundnight: "drizzle-night.jpg" },
  rain: { codes: [61, 63, 65, 66, 67], icon: "rain.png", iconnight: "rain.png", background: "rain.jpg", backgroundnight: "rain-night.jpg" },
  snow: { codes: [71, 73, 75, 77], icon: "snow.png", iconnight: "snow.png", background: "snow.jpg", backgroundnight: "snow-night.jpg" },
  "rain showers": { codes: [80, 81, 82], icon: "rain.png", iconnight: "rain.png", background: "rain.jpg", backgroundnight: "rain-night.jpg" },
  "snow showers": { codes: [85, 86], icon: "snow.png", iconnight: "snow.png", background: "snow.jpg", backgroundnight: "snow-night.jpg" },
  thunderstorm: { codes: [95, 96, 99], icon: "thunderstorm.png", iconnight: "thunderstorm.png", background: "thunderstorm.jpg", backgroundnight: "thunderstorm-night.jpg" },
};

// Moon phase details
const getMoonDetails: Record<number, MoonPhase> = {
  0: { text: "new moon", image: "/images/icons/newmoon.png" },
  1: { text: "waxing crescent", image: "/images/icons/waxingcresent.png" },
  2: { text: "first quarter", image: "/images/icons/waxingcresent.png" },
  3: { text: "waxing gibbous", image: "/images/icons/fullmoon.png" },
  4: { text: "full moon", image: "/images/icons/fullmoon.png" },
  5: { text: "waning gibbous", image: "/images/icons/fullmoon.png" },
  6: { text: "last quarter", image: "/images/icons/waningcresent.png" },
  7: { text: "waning crescent", image: "/images/icons/waningcresent.png" },
};

// Functions
const getCodeCondition = (code: number): string => {
  for (let condition in codeDetails) {
    if (codeDetails[condition].codes.includes(code)) return condition;
  }
  return "unknown";
};

const getCodeBackground = (code: number, isDay: boolean): string => {
  for (let condition in codeDetails) {
    if (codeDetails[condition].codes.includes(code)) {
      return `/images/backgrounds/${isDay ? codeDetails[condition].background : codeDetails[condition].backgroundnight}`;
    }
  }
  return "/images/backgrounds/clearnight.jpg";
};

const getCodeIcon = (code: number, isDay: boolean): string => {
  for (let condition in codeDetails) {
    if (codeDetails[condition].codes.includes(code)) {
      return `/images/icons/${isDay ? codeDetails[condition].icon : codeDetails[condition].iconnight}`;
    }
  }
  return "/images/icons/mclearnight.png";
};

const getPrecipDetails = (precip: number): string => {
  switch (precip) {
    case 1:
      return "rain";
    case 2:
      return "snow";
    case 3:
      return "cold rain";
    case 4:
      return "sleet";
    default:
      return "rain";
  }
};

// Format helpers
const truncateSentence = (sentence: string, length = 13): string => {
  return sentence.length > length ? sentence.slice(0, length) + "..." : sentence;
};

const formatWind = (wind: number): string => {
  if (wind < 3) return "calm";
  if (wind < 30) return "breeze";
  if (wind < 70) return "stormy";
  return "hurricane";
};

const formatVisibility = (visibility: number): string => {
  if (visibility >= 10) return "excellent";
  if (visibility >= 5) return "good";
  if (visibility >= 1) return "moderate";
  return "very poor";
};

// Context definition
interface WeatherContextProps {
  getCodeCondition: (code: number) => string;
  getCodeBackground: (code: number, isDay: boolean) => string;
  getCodeIcon: (code: number, isDay: boolean) => string;
  getPrecipDetails: (precip: number) => string;
  getMoonDetails: Record<number, MoonPhase>;
  truncateSentence: (sentence: string, length?: number) => string;
  formatWind: (wind: number) => string;
  formatVisibility: (visibility: number) => string;
}

const WeatherConfigContext = createContext<WeatherContextProps | undefined>(undefined);

// Provider component
export const WeatherConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WeatherConfigContext.Provider
      value={{
        getCodeCondition,
        getCodeBackground,
        getCodeIcon,
        getPrecipDetails,
        getMoonDetails,
        truncateSentence,
        formatWind,
        formatVisibility,
      }}
    >
      {children}
    </WeatherConfigContext.Provider>
  );
};

// Custom hook
export const useWeatherConfig = (): WeatherContextProps => {
  const context = useContext(WeatherConfigContext);
  if (!context) {
    throw new Error("useWeatherConfig must be used within a WeatherConfigProvider");
  }
  return context;
};
