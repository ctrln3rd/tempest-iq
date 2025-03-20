'use client';

import { create } from 'zustand';
import { 
    format, parseISO, startOfDay, isToday, getTime, isSameHour, addHours, addMinutes, addDays, 
    differenceInMinutes, isSameDay, formatDistanceToNow, differenceInMilliseconds, 
    differenceInDays
} from 'date-fns';

interface DateConfigState {
    filterDate: (inputDate: string) => Date;
    formatDay: (inputDate: string, currentDate: string) => string;
    formatLocalDate: (inputDate: string) => string;
    getTimeDifference: (inputTime: number) => string;
    formatHour: (inputDate: string, currentDate: string) => string;
    formatStringTime: (inputDate: Date) => string;
    formatZuluTime: (inputDate: Date) => string;
    formatTime: (inputDate: Date) => number;
    addHour: (inputDate: Date, amt: number) => Date;
    adjustZuluTime: (inputDate: string, currentDate: string) => Date;
    addDay: (inputDate: string, num: number) => Date;
    checkSameDay: (day: string, day1: string) => boolean;
    calculateAstro: (first: string, last: string, currentTime: string, isDay: boolean) => { progress: string; last: string; first: string };
    formatSunriseSet: (inputDate: string, currentDate: string) => string;
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
            const diff = differenceInDays (filtered1, filtered)
            if(diff === 0) return 'Today';
            if(diff === 1) return 'Tomorrow';
            if(diff === -1) return 'Yesterday';
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
    formatStringTime: (inputDate) => format(inputDate, 'hh:mm a').toLowerCase(),
    formatZuluTime: (inputDate) => format(inputDate, 'hh:mm a').toLowerCase(),
    formatTime: (inputDate) => getTime(inputDate),
    addHour: (inputDate, amt) => addHours(inputDate, amt),
    adjustZuluTime: (inputDate, currentDate) => {
        try {
            let offset = '-00:00';
            if (/[+-]\d{2}:\d{2}/.test(currentDate)) {
                offset = currentDate.slice(-6);
            }
            const addedHours = addHours(parseISO(inputDate), parseInt(offset.slice(0, 3)));
            return addMinutes(addedHours, parseInt(`${offset.slice(0, 1)}${offset.slice(-2)}`));
        } catch (err) {
            console.error(err);
            return new Date("2025-01-01T00:00:00");
        }
    },
    addDay: (inputDate, num) => addDays(parseISO(inputDate), num),
    checkSameDay: (day) => isToday(parseISO(day)),
    calculateAstro: (first, last, currentTime, isDay) => {
        try {
            let percentage, lastHour, firstHour;
            if (isDay) {
                percentage = (differenceInMinutes(currentTime, first) / differenceInMinutes(last, first)) * 100;
                lastHour = format(last, 'hh:mm a');
                firstHour = format(first, 'hh:mm a');
            } else {
                let localRise  = parseISO(first);
                if (isSameDay(last, currentTime)) localRise = addDays(localRise, 1);
                percentage = (differenceInMinutes(currentTime, last) / differenceInMinutes(localRise, last)) * 100;
                lastHour = format(first, 'hh:mm a');
                firstHour = format(last, 'hh:mm a');
            }
            return { progress: percentage.toFixed(2), last: lastHour, first: firstHour };
        } catch (err) {
            console.error(err);
            return { progress: '50', last: '06:00 pm', first: '06:00 am' };
        }
    },
    formatSunriseSet: (inputDate) => format(parseISO(inputDate), 'hh:mm a').toLowerCase(),
    checkWeatherDiffExpired: (lastDate, hours) => differenceInMilliseconds(Date.now(), lastDate) >= hours * 3600000,
}));
