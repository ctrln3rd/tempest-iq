'use client';

import { create } from 'zustand';
import { 
    format, parseISO, startOfDay, isToday, getTime, isSameHour, addHours, addMinutes, addDays, 
    differenceInMinutes, isSameDay, formatDistanceToNow, differenceInMilliseconds, 
    differenceInDays,
    getHours,
    getMinutes
} from 'date-fns';

interface DateConfigState {
    filterDate: (inputDate: string) => Date;
    formatDay: (inputDate: string, currentDate: string) => string;
    formatLocalDate: (inputDate: string) => string;
    getTimeDifference: (inputTime: number) => string;
    getElapsed: (inputime: number) => number;
    formatHour: (inputDate: string, currentDate: string) => string;
    isDayHour: (hour: string, sunrise: string, sunset: string) => boolean;
    checkSameDay: (day: string) => boolean;
    dayTime: (hour: string) => string;
    calculateAstro: (sunrise: string, sunset: string, current: string, nextSunrise: string, isDay: boolean) => { progress: number; last: string; first: string };
    checkWeatherDiffExpired: (lastDate: number, hours: number) => boolean;
}

export const useDateConfigStore = create<DateConfigState>(() => ({
    filterDate: (inputDate) => {
        try {
            let newDate = inputDate.replace(/([+-]\d{2}:\d{2}|Z)$/, '');
            return parseISO(newDate);
        } catch (err) {
            console.error(err);
            return new Date("2025-01-01T00:00:00");
        }
    },
    formatDay: (inputDate, currentDate) => {
        try {
            const filtered1 = startOfDay(parseISO(inputDate));
            const filtered = startOfDay(parseISO(currentDate));
            const diff = differenceInDays(filtered1, filtered);
            if (diff === 0) return 'Today';
            if (diff === 1) return 'Tomorrow';
            if (diff === -1) return 'Yesterday';
            return format(filtered1, 'EEE');
        } catch (err) {
            console.error(err);
            return 'day';
        }
    },
    formatLocalDate: (inputDate) => {
        try {
            return format(parseISO(inputDate), 'EEE hh:mm a').toLowerCase();
        } catch (err) {
            console.error(err);
            return 'sun 12:00am';
        }
    },
    getTimeDifference: (inputTime) => {
        try {
            return formatDistanceToNow(new Date(inputTime), { addSuffix: true });
        } catch (err) {
            console.error(err);
            return 'unknown time ago';
        }
    },
    formatHour: (inputDate, currentDate) => {
        try {
            const inputDateFiltered = parseISO(inputDate);
            if (isSameHour(inputDateFiltered, parseISO(currentDate))) return 'now';
            return format(inputDateFiltered, 'h a').toLowerCase();
        } catch (err) {
            console.error(err);
            return '12am';
        }
    },
    isDayHour: (hour, sunrise, sunset)=> {
        try{
           const hourTime = getHours(parseISO(hour)) * 60 + getMinutes(parseISO(hour))
           const sunriseTime = getHours(parseISO(sunrise)) * 60 + getMinutes(parseISO(sunrise))
           const sunsetTime = getHours(parseISO(sunset)) * 60 + getMinutes(parseISO(sunset))
           return hourTime >= sunriseTime && hourTime <= sunsetTime;
        }catch(err){
            console.error(err)
            return false;
        }
    },
    dayTime: (hour) => {
        try{
            const thehour = getHours(parseISO(hour))
            if(thehour >= 5 && thehour < 8) return "dawn";
            if(thehour >= 8 && thehour < 12) return "morning";
            if(thehour >= 12 && thehour < 17) return "afternoon";
            if(thehour >= 17 && thehour < 20) return "evening";
            return "night";
        }catch(err){
            console.error(err)
            return "uknown"
        }
    },
    checkSameDay: (day) => isToday(parseISO(day)),
    calculateAstro: (sunrise, sunset, current, nextSunrise, isDay) => {
        try {
            const currentTime = getHours(parseISO(current)) * 60 + getMinutes(parseISO(current))
            const sunriseTime = getHours(parseISO(sunrise)) * 60 + getMinutes(parseISO(sunrise))
            const sunsetTime = getHours(parseISO(sunset)) * 60 + getMinutes(parseISO(sunset))
            const nextSunriseTime = getHours(parseISO(nextSunrise)) * 60 + getMinutes(parseISO(nextSunrise))
            let percentage = 0;
            let lastHour = "2025-01-01T06:00:00"
            let firstHour = "2025-01-01T18:00:00"
            if(isDay){
                percentage = ((currentTime -sunriseTime) / (sunsetTime -sunriseTime)) * 100
                firstHour = sunrise
                lastHour = sunset
            }else{
                const adjustedcurrentTime = currentTime < sunriseTime ? currentTime + 1440 :  currentTime
                const adjustedSunsetTime = sunriseTime < sunsetTime ? sunsetTime - 1440 :  sunsetTime
                percentage = ((adjustedcurrentTime - sunsetTime) / (nextSunriseTime - adjustedSunsetTime)) * 100
                firstHour = sunset
                lastHour  = nextSunrise
            }
            return { progress: Math.max(0, Math.min(100, percentage)), 
                last: format(parseISO(lastHour), 'h:mm a').toLowerCase(), first: format(parseISO(firstHour), 'h:mm a').toLowerCase() };
        } catch (err) {
            console.error(err);
            return { progress: 50, last: '06:00 pm', first: '06:00 am' };
        }
    },
    checkWeatherDiffExpired: (lastDate, hours) => differenceInMilliseconds(Date.now(), lastDate) >= hours * 3600000,
    getElapsed: (inputtime) => differenceInMilliseconds(Date.now(),inputtime)
}));
