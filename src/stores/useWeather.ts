import { create } from "zustand";

// Define types
export interface WeatherCondition {
  codes: number[];
  icon: string;
  iconnight: string;
  gradient: string;
  gradientNight: string;
  animation: string;
}

export interface MoonPhase {
  text: string;
  image: string;
}

// Weather conditions
const codeDetails: Record<string, WeatherCondition> = {
  clear: {
    codes: [0],
    icon: "clear.png",
    iconnight: "clear-night.png",
    gradient: "bg-gradient-to-b from-yellow-400 to-orange-500 blur-md",
    gradientNight: "bg-gradient-to-b from-indigo-900 to-black blur-md",
    animation: "",
  },
  "mostly clear": {
    codes: [1],
    icon: "clear.png",
    iconnight: "clear-night.png",
    gradient: "bg-gradient-to-b from-yellow-400 to-orange-500 blur-md",
    gradientNight: "bg-gradient-to-b from-indigo-900 to-black blur-md",
    animation: "",
  },
  "partly cloudy": {
    codes: [2],
    icon: "p-cloudy.png",
    iconnight: "p-cloudy-night.png",
    gradient: "bg-gradient-to-b from-blue-700 to-gray-900 blur-md",
    gradientNight: "bg-gradient-to-b from-indigo-900 to-black blur-md",
    animation: "animate-few-clouds",
  },
  cloudy: {
    codes: [3],
    icon: "cloudy.png",
    iconnight: "cloudy.png",
    gradient: "bg-gradient-to-b from-gray-400 to-gray-650 blur-md",
    gradientNight: "bg-gradient-to-b from-gray-800 to-black blur-md",
    animation: "animate-clouds",
  },
  drizzle: {
    codes: [51, 53, 55, 56, 57],
    icon: "rain.png",
    iconnight: "rain.png",
    gradient: "bg-gradient-to-b from-blue-700 to-gray-900 blur-md",
    gradientNight: "bg-gradient-to-b from-blue-900 to-black blur-md",
    animation: "animate-rain",
  },
  rain: {
    codes: [61, 63, 65, 66, 67],
    icon: "rain.png",
    iconnight: "rain.png",
    gradient: "bg-gradient-to-b from-blue-700 to-gray-900 blur-md",
    gradientNight: "bg-gradient-to-b from-blue-900 to-black blur-md",
    animation: "animate-rain",
  },
  "rain showers": {
    codes: [80, 81, 82],
    icon: "rain.png",
    iconnight: "rain.png",
    gradient: "bg-gradient-to-b from-blue-700 to-gray-900 blur-md",
    gradientNight: "bg-gradient-to-b from-blue-900 to-black blur-md",
    animation: "animate-rain",
  },
  thunderstorm: {
    codes: [95, 96, 99],
    icon: "thunderstorm.png",
    iconnight: "thunderstorm.png",
    gradient: "bg-gradient-to-b from-gray-800 to-black blur-md",
    gradientNight: "bg-gradient-to-b from-black to-purple-900 blur-md",
    animation: "animate-lightning",
  },
  snow: {
    codes: [71, 73, 75, 77],
    icon: "snow.png",
    iconnight: "snow.png",
    gradient: "bg-gradient-to-b from-blue-200 to-white blur-md",
    gradientNight: "bg-gradient-to-b from-blue-500 to-gray-900 blur-md",
    animation: "animate-snow",
  },
  fog: {
    codes: [45, 48], // Fog Codes
    icon: "fog.png",
    iconnight: "fog.png",
    gradient: "bg-gradient-to-b from-gray-600 to-gray-900 blur-md",
    gradientNight: "bg-gradient-to-b from-gray-700 to-black blur-md",
    animation: "animate-fog",
  },
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

// Helper functions stored inside Zustand
export const useWeatherConfigStore = create(() => ({
  getCodeCondition: (code: number): string => {
    for (let condition in codeDetails) {
      if (codeDetails[condition].codes.includes(code)) return condition;
    }
    return "unknown";
  },

  getCodeBackground: (code: number, isDay: boolean): string => {
    return Object.values(codeDetails).find(({ codes }) => codes.includes(code))?.[
      isDay ? "gradient" : "gradientNight"
    ] || "bg-gradient-to-b from-gray-600 to-gray-900 blur-md";
  },

  getCodeAnimation: (code: number, isDay: boolean): string => {
    return Object.values(codeDetails).find(({ codes }) => codes.includes(code))?.[
      "animation"
    ] || "";
  },

  getCodeIcon: (code: number, isDay: boolean): string => {
    return `/images/icons/${Object.values(codeDetails).find(({ codes }) => codes.includes(code))?.[
      isDay ? "icon" : "iconnight"
    ] || "clear-night.png"}`;
  },

  getPrecipDetails: (precip: number): string => {
    return ["rain", "snow", "cold rain", "sleet"][precip - 1] || "rain";
  },

  getMoonDetails,

  truncateSentence: (sentence: string, length = 13): string =>
    sentence.length > length ? sentence.slice(0, length) + "..." : sentence,

  formatWind: (wind: number): string =>
    wind < 3 ? "calm" : wind < 30 ? "breeze" : wind < 70 ? "stormy" : "hurricane",

  formatVisibility: (visibility: number): string =>
    visibility >= 10 ? "excellent" : visibility >= 5 ? "good" : visibility >= 1 ? "moderate" : "very poor",

  formatWindDirection: (deg: number): string => {
    const directions = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
    return directions[Math.floor((deg + 22.5) / 45) % 8];
  },

  uvHealth: (index: number): string => ["#00ff37", "#ffe75c", "#ffab5c", "#ff905c", "#ff675c"][
    index <= 2 ? 0 : index <= 5 ? 1 : index <= 7 ? 2 : index <= 10 ? 3 : 4
  ],
}));
