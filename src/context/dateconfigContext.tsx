'use client';

import { createContext, useContext } from "react";
import { 
    format, parseISO, isToday, isYesterday, isTomorrow, getTime, isSameHour, addHours, addMinutes, addDays, 
    getHours, getMinutes, differenceInMinutes, isSameDay,
    formatDistanceToNow,
    differenceInMilliseconds 
} from "date-fns";

interface DateConfigContextType {
    filterDate: (inputDate: string) => Date;
    formatDay: (inputDate: string, currentDate: string) => string;
    formatLocalDate: (inputDate: string) => string;
    getTimeDifference: (inputTime: number) => string;
    formatHour: (inputDate: string, currentDate: string) => string;
    formatStringTime: (inputDate: string) => string;
    formatZuluTime: (inputDate: Date) => string;
    formatTime: (inputDate: Date) => number;
    addHour: (inputDate: Date, amt: number) => Date;
    adjustZuluTime: (inputDate: string, currentDate: string) => Date;
    addDay: (inputDate: string, num: number) => Date;
    checkSameDay: (day: string, day1: string) => boolean;
    calculateAstro: (first: Date, last: Date, currentTime: Date, isDay: boolean) => { progress: string; last: string; first: string };
    formatSunriseSet: (inputDate: string, currentDate: string) => string;
    checkWeatherDiffExpired: (lastDate: number, hours: number) => boolean;
}

export const DateConfigContext = createContext<DateConfigContextType | undefined>(undefined);



export const DateConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const filterDate = (inputDate: string): Date => {
        try {
            let newDate = inputDate;
            const regex = /([+-]\d{2}:\d{2}|Z)$/;
            if (regex.test(inputDate)) {
                newDate = inputDate.replace(regex, '');
            }
            return parseISO(newDate);
        } catch (err) {
            console.error(err);
            return new Date("2025-01-01T00:00:00");
        }
    };
    function formatStringTime(inputdate: Date){
        try{
            return format(inputdate, 'hh:mm a').toLocaleLowerCase()
        }catch(err){
            console.error(err)
            return '12:00 am'
        }
    }
    function formatZuluTime(inputdate: Date){
        try{
            return format(inputdate, 'hh:mm a').toLocaleLowerCase()
        }catch(err){
            console.error(err)
            return '12:00 am'
        }
    }

    const formatDay = (inputDate: string, currentDate: string): string => {
        try {
            const filtered1 = parseISO(inputDate);
            const filtered2 = parseISO(currentDate);

            if (isToday(filtered1)) return 'Today';
            if (isYesterday(filtered1)) return 'Yesterday';
            if (isTomorrow(filtered1)) return 'Tomorrow';
            return format(filtered1, 'EEE');
        } catch (err) {
            console.error(err);
            return 'day';
        }
    };

    const formatLocalDate = (inputDate: string): string => {
        try {
            return format(parseISO(inputDate), 'EEE hh:mm a').toLowerCase();
        } catch (err) {
            console.error(err);
            return 'sun 12:00am';
        }
    };

    const getTimeDifference = (inputTime: number): string => {
        try {
            console.log('input date: ', new Date(inputTime))
            return formatDistanceToNow( new Date(inputTime), { addSuffix: true });
        } catch (err) {
            console.error(err);
            return 'unknown time ago';
        }
    };

    const formatHour = (inputDate: string, currentDate: string): string => {
        try {
            const inputDateFiltered = filterDate(inputDate);
            const currentDateFiltered = filterDate(currentDate);
            if (isSameHour(inputDateFiltered, currentDateFiltered)) return 'now';
            return format(inputDateFiltered, 'h a').toLowerCase();
        } catch (err) {
            console.error(err);
            return '12am';
        }
    };

    const contextValue: DateConfigContextType = {
        filterDate,
        formatDay,
        formatLocalDate,
        getTimeDifference,
        formatHour,
        formatStringTime: (inputDate) => format(parseISO(inputDate), 'hh:mm a').toLowerCase(),
        formatZuluTime: (inputDate) => format(inputDate, 'hh:mm a').toLowerCase(),
        formatTime: (inputDate) => getTime(inputDate),
        addHour: (inputDate, amt) => addHours(inputDate, amt),
        adjustZuluTime: (inputDate, currentDate) => {
            try {
                let filteredCurrent = '-00:00';
                const filteredInput = filterDate(inputDate);
                if (/[+-]\d{2}:\d{2}/.test(currentDate)) {
                    filteredCurrent = currentDate.slice(-6);
                }
                const addedHours = addHours(filteredInput, parseInt(filteredCurrent.slice(0, 3)));
                return addMinutes(addedHours, parseInt(`${filteredCurrent.slice(0, 1)}${filteredCurrent.slice(-2)}`));
            } catch (err) {
                console.error(err);
                return new Date("2025-01-01T00:00:00");
            }
        },
        addDay: (inputDate, num) => addDays(filterDate(inputDate), num),
        checkSameDay: (day, day1) => isToday(filterDate(day)),
        calculateAstro: (first, last, currentTime, isDay) => {
            try {
                let percentage, lastHour, firstHour;
                if (isDay) {
                    const dayTotalMinutes = differenceInMinutes(last, first);
                    const dayElapsedMinutes = Math.max(0, differenceInMinutes(currentTime, first));
                    percentage = Math.min((dayElapsedMinutes / dayTotalMinutes) * 100, 100);
                    lastHour = formatStringTime(last);
                    firstHour = formatStringTime(first);
                } else {
                    let localRise = first;
                    if (isSameDay(last, currentTime)) localRise = addDays(localRise, 1);
                    const nightTotalMinutes = differenceInMinutes(localRise, last);
                    let nightElapsedMinutes = Math.max(0, differenceInMinutes(currentTime, last));
                    percentage = Math.min((nightElapsedMinutes / nightTotalMinutes) * 100, 100);
                    lastHour = formatStringTime(first);
                    firstHour = formatStringTime(last);
                }
                return { progress: percentage.toFixed(2), last: lastHour, first: firstHour };
            } catch (err) {
                console.error(err);
                return { progress: '50', last: '06:00 pm', first: '06:00 am' };
            }
        },
        formatSunriseSet: (inputDate, currentDate) => formatZuluTime(filterDate(inputDate)),
        checkWeatherDiffExpired: (lastDate, hours) => differenceInMilliseconds(Date.now(), lastDate) >= hours * 3600000,
    };

    return <DateConfigContext.Provider value={contextValue}>{children}</DateConfigContext.Provider>;
};

export function useDateConfig() {
    const context = useContext(DateConfigContext);
    if (!context) {
        throw new Error("useDateConfig must be used within a DateConfigProvider");
    }
    return context;
}
