import { create } from "zustand";

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

// Helper functions stored inside Zustand
export const useWeatherConfigStore = create(() => ({
  getCodeCondition: (code: number): string => {
    for (let condition in codeDetails) {
      if (codeDetails[condition].codes.includes(code)) return condition;
    }
    return "unknown";
  },

  getCodeBackground: (code: number, isDay: boolean): string => {
    for (let condition in codeDetails) {
      if (codeDetails[condition].codes.includes(code)) {
        return `/images/backgrounds/${isDay ? codeDetails[condition].background : codeDetails[condition].backgroundnight}`;
      }
    }
    return "/images/backgrounds/clear-night.jpg";
  },

  getCodeIcon: (code: number, isDay: boolean): string => {
    for (let condition in codeDetails) {
      if (codeDetails[condition].codes.includes(code)) {
        return `/images/icons/${isDay ? codeDetails[condition].icon : codeDetails[condition].iconnight}`;
      }
    }
    return "/images/icons/clear-night.png";
  },

  getPrecipDetails: (precip: number): string => {
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
  },

  getMoonDetails,

  truncateSentence: (sentence: string, length = 13): string => {
    return sentence.length > length ? sentence.slice(0, length) + "..." : sentence;
  },

  formatWind: (wind: number): string => {
    if (wind < 3) return "calm";
    if (wind < 30) return "breeze";
    if (wind < 70) return "stormy";
    return "hurricane";
  },

  formatVisibility: (visibility: number): string => {
    if (visibility >= 10) return "excellent";
    if (visibility >= 5) return "good";
    if (visibility >= 1) return "moderate";
    return "very poor";
  },
  formatWindDirection : (deg: number)=>{
    if(deg >= 337 || deg < 22.5) return 'north';
    if(deg >= 22.5 && deg < 67.5) return 'northeast';
    if(deg >= 67.5 && deg < 112.5) return 'east';
    if(deg >= 112.5 && deg < 157.5) return 'Southeast';
    if(deg >= 157.5 && deg < 202.5) return 'south';
    if(deg >= 202.5 && deg < 247.5) return 'southwest';
    if(deg >=  247.5 && deg < 292.5) return 'west';
    if(deg >= 292.5 && deg < 337.5) return 'northwest';
  },
  uvHealth : (index: number) =>{
    if(index <= 2) return '#00ff37';
    if(index <= 5) return '#ffe75c';
    if(index <= 7) return '#ffab5c';
    if(index <= 10)return '#ff905c';
        return '#ff675c'
}
}));
