import React from "react";
import { useWeatherConfigStore } from "@/stores/useWeather";

const Animations = ({ weatherCode, isDay }: {weatherCode: number, isDay: boolean}) => {
  const getAnimation = useWeatherConfigStore.getState().getCodeAnimation;
  const animationClass = getAnimation(weatherCode, isDay);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {animationClass === "animate-rain" && (
        <div className="rain-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s` }}
            />
          ))}
        </div>
      )}
      {animationClass === "animate-light-rain" && (
        <div className="light-rain-container">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="light-raindrop"
              style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s` }}
            />
          ))}
        </div>
      )}


      {animationClass === "animate-snow" && (
        <div className="snow-container">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}
            />
          ))}
        </div>
      )}

      {animationClass === "animate-clouds" && (
        <div className="clouds-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="cloud" style={{ top: `${Math.random() * 70}%`,  animationDelay: `${i * 4}s` }} />
          ))}
        </div>
      )}
      {animationClass === "animate-few-clouds" && (
        <div className="few-clouds-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="light-cloud" style={{ top: `${Math.random() * 70}%`,  animationDelay: `${i * 3}s` }} />
          ))}
        </div>
      )}
      {animationClass === "animate-lightning" && (
        <div className="lightning-container">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="thunder-drops"
              style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s` }}
            />
          ))}
          <div className="flash" />
        </div>
      )}
      {animationClass === "animate-fog" && (
        <div className="fog-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="fog" style={{ top: `${Math.random() * 10}%`,  animationDelay: `${i * 3}s` }} />
          ))}
        </div>
      )}
    </div>
    
  );
};

export default Animations;
