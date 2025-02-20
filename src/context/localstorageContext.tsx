'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  current: boolean;
}

interface WeatherData {
  data: any;
  timestamp: number;
}

interface ShortWeatherData {
  code: string;
  timestamp: number;
}

interface AppSettings {
  autoRefresh: number;
  radiusThreshold: number;
}

interface LocalStorageContextProps {
  locations: Location[];
  weatherData: Record<string, WeatherData>;
  shortWeatherData: Record<string, ShortWeatherData>;
  settings: AppSettings | null;
  saveLocation: (location: any, isCurrent: boolean) => void;
  removeLocation: (id: string) => void;
  saveWeatherData: (locationId: string, data: any) => void;
  saveShortWeatherData: (locationId: string, code: string) => void;
  saveSettings: (values: AppSettings) => void;
  clearLocations: ()=> void;
}

const LocalStorageContext = createContext<LocalStorageContextProps | undefined>(undefined);

export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [shortWeatherData, setShortWeatherData] = useState<Record<string, ShortWeatherData>>({});
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    setLocations(JSON.parse(localStorage.getItem('Locations') || '[]'));
    setWeatherData(JSON.parse(localStorage.getItem('weatherData') || '{}'));
    setShortWeatherData(JSON.parse(localStorage.getItem('shortweatherdata') || '{}'));
    setSettings(JSON.parse(localStorage.getItem('Settings') || 'null'));
    console.log('im running later')
  }, []);

  const saveLocation = (location: any, isCurrent: boolean) => {
    let updatedLocations = [...locations];

    if (isCurrent) {
      updatedLocations = updatedLocations.filter((loc) => !loc.current);
    } else if (updatedLocations.some((loc) => loc.id === location.place_id)) {
      return;
    }

    if (updatedLocations.length >= 30) {
      updatedLocations.shift();
    }

    const name = isCurrent
      ? location.address.city || location.address.town || location.address.village || location.name || 'Unknown location'
      : location.display_name.split(',')[0]?.trim();
    const country = isCurrent ? location.address.country : location.display_name.split(',').pop()?.trim();

    const newLocation: Location = {
      id: location.place_id,
      name,
      country,
      lat: location.lat,
      lon: location.lon,
      current: isCurrent,
    };

    isCurrent ? updatedLocations.unshift(newLocation) : updatedLocations.push(newLocation);

    setLocations(updatedLocations);
    localStorage.setItem('Locations', JSON.stringify(updatedLocations));
  };

  const removeLocation = (id: string) => {
    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setLocations(updatedLocations);
    localStorage.setItem('Locations', JSON.stringify(updatedLocations));

    const updatedWeatherData = { ...weatherData };
    const updatedShortWeatherData = { ...shortWeatherData };
    delete updatedWeatherData[id];
    delete updatedShortWeatherData[id];
    setWeatherData(updatedWeatherData);
    setShortWeatherData(updatedShortWeatherData);
    localStorage.setItem('weatherData', JSON.stringify(updatedWeatherData));
    localStorage.setItem('shortweatherdata', JSON.stringify(updatedShortWeatherData));
  };

  const saveWeatherData = (locationId: string, data: any) => {
    const updatedData = { ...weatherData, [locationId]: { data, timestamp: Date.now() } };
    setWeatherData(updatedData);
    console.log('saved data')
    console.log(updatedData);
    localStorage.setItem('weatherData', JSON.stringify(updatedData));
  };

  const saveShortWeatherData = (locationId: string, code: string) => {
    const updatedData = { ...shortWeatherData, [locationId]: { code, timestamp: Date.now() } };
    setShortWeatherData(updatedData);
    localStorage.setItem('shortweatherdata', JSON.stringify(updatedData));
  };

  const saveSettings = (values: AppSettings) => {
    setSettings(values);
    localStorage.setItem('Settings', JSON.stringify(values));
  };
  const clearLocations = () => {
    localStorage.removeItem('weatherData');
    localStorage.removeItem('shortWeatherdata');
    localStorage.removeItem('LOcations');
  }

  return (
    <LocalStorageContext.Provider
      value={{
        locations,
        weatherData,
        shortWeatherData,
        settings,
        saveLocation,
        removeLocation,
        saveWeatherData,
        saveShortWeatherData,
        saveSettings,
        clearLocations
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};
