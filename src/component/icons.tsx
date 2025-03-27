import {FilePenLine, FileText, Bolt, Share2, MapPinCheckInside,
    Thermometer, Umbrella, CircleAlert, ClockAlert, Accessibility, Hourglass, TrendingUpDown, CalendarClock, ListRestart, SunMoon, Droplet,
    Smile, Globe, Hand, Wind, Eye, Clock,
    Sun, Moon, CloudSun, CloudMoon, Cloud, CloudRain, CloudDrizzle, CloudFog, CloudSnow, CloudLightning,
    LucideIcon
} from "lucide-react"

import { useSettingsStore } from "@/stores/useSettings";


interface ConditionIconProps {
    condition: 'clear' | 'pcloudy' | 'cloudy' | 'drizzle' | 'rain' | 'fog' | 'snow' | 'thunderstorm';
    isDay: boolean
}

function ConditionIcon({condition, isDay}: ConditionIconProps){
    const size = useSettingsStore().settings.displaySize
    const iconMap : Record<ConditionIconProps['condition'], LucideIcon>= {
        clear: isDay ? Sun : Moon,
        pcloudy: isDay ? CloudSun : CloudMoon,
        cloudy: Cloud,
        drizzle: CloudDrizzle,
        rain: CloudRain,
        fog: CloudFog,
        snow: CloudSnow,
        thunderstorm: CloudLightning
    }
    const IconComponent = iconMap[condition] || Cloud
    return <IconComponent strokeWidth={size === 'bold' ? 1 : 0.7} className={`${size === 'bold' ? 'w-12 h-12 max-sm:w-10 max-sm:h-10' : 'w-11 h-11 max-sm:w-9 max-sm:h-9'} opacity-70`}/>
}

interface HelperIconProps {
    icon: 'temperature' | 'precipitation' | 'warning1' | 'warning2' | 'activity' | 'forecast' |'hour' | 'day' |'resetlist' | 'astro' | 'droplet' |
    'wind' | 'feelslike' | 'visibility'  | 'uv' | 'humidity' | 'clock'
}

function HelperIcon({icon}: HelperIconProps){
    const size = useSettingsStore().settings.displaySize
    const iconMap: Record<HelperIconProps['icon'], LucideIcon>= {
        temperature: Thermometer,
        precipitation: Umbrella,
        warning1: CircleAlert,
        warning2: ClockAlert,
        activity: Accessibility,
        forecast: TrendingUpDown,
        hour: Hourglass,
        day: CalendarClock,
        resetlist: ListRestart,
        astro: SunMoon,
        droplet: Droplet,
        humidity: Droplet,
        wind: Wind,
        feelslike: Hand,
        uv: Sun,
        visibility: Eye,
        clock: Clock
    }

    const IconComponent = iconMap[icon] || Thermometer
    return <IconComponent strokeWidth={!(size === 'bold') ? 1.5 : 2} className={`${size === 'bold' ? 'w-7 h-7' : 'w-5.5 h-5.5'}`}/>
}

interface HeaderIconProps {
    icon: 'locations' | 'editlocations' | 'settings' | 'share' | 'updatelocation'
}

function HeaderIcon({icon}: HeaderIconProps){
    const size = useSettingsStore().settings.displaySize
    const iconMap: Record<HeaderIconProps['icon'], LucideIcon>= {
        locations: FileText,
        editlocations: FilePenLine,
        settings: Bolt,
        share: Share2,
        updatelocation: MapPinCheckInside
    }

    const IconComponent = iconMap[icon] || Thermometer
    return <IconComponent strokeWidth={!(size === 'bold') ? 1.5 : 2} className={`${size === 'bold' ? 'w-6 h-6' : 'w-5.5 h-5.5'}`}/>
}

interface ThemeIconProps {
    icon : 'waitingsmile'
}

function ThemeIcon({icon}: ThemeIconProps){
    const iconMap: Record<ThemeIconProps['icon'], LucideIcon>= {
        waitingsmile: Smile
    }

    const IconComponent = iconMap[icon] || Thermometer
    return <IconComponent className='w-16 h-16 max-sm:w-12 max-sm:h-12'/>
}

interface OtherIconProps {
    icon : 'weather'
}

function OtherIcon({icon}: OtherIconProps){
    const iconMap: Record<OtherIconProps['icon'], LucideIcon>= {
        weather: Globe
    }

    const IconComponent = iconMap[icon] || Thermometer
    return <IconComponent strokeWidth={1.5} className='w-9 h-9 max-sm:w-7 max-sm:h-7'/>
}

export {HeaderIcon, ConditionIcon, HelperIcon, ThemeIcon, OtherIcon}