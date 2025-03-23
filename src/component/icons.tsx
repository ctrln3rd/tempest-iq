import {FilePenLine, FileText, Bolt, Share2, MapPinCheckInside,
    Thermometer, Umbrella, CircleAlert, ClockAlert, Accessibility, Hourglass, TrendingUpDown, CalendarClock, ListRestart, SunMoon, Droplet,
    Smile, Globe, 
    Sun, Moon, CloudSun, CloudMoon, Cloud, CloudRain, CloudDrizzle, CloudFog, CloudSnow, CloudLightning,
    LucideIcon
} from "lucide-react"


interface ConditionIconProps {
    condition: 'clear' | 'pcloudy' | 'cloudy' | 'drizzle' | 'rain' | 'fog' | 'snow' | 'thunderstorm';
    isDay: boolean
}

function ConditionIcon({condition, isDay}: ConditionIconProps){
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
    return <IconComponent strokeWidth={0.7} className='w-12 h-12 max-sm:w-10 max-sm:h-10 opacity-70'/>
}

interface HelperIconProps {
    icon: 'temperature' | 'precipitation' | 'warning1' | 'warning2' | 'activity' | 'forecast' |'hour' | 'day' |'resetlist' | 'astro' | 'droplet'
}

function HelperIcon({icon}: HelperIconProps){
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
        droplet: Droplet
    }

    const IconComponent = iconMap[icon] || Thermometer
    return <IconComponent className='w-7 h-7'/>
}

interface HeaderIconProps {
    icon: 'locations' | 'editlocations' | 'settings' | 'share' | 'updatelocation'
}

function HeaderIcon({icon}: HeaderIconProps){
    const iconMap: Record<HeaderIconProps['icon'], LucideIcon>= {
        locations: FileText,
        editlocations: FilePenLine,
        settings: Bolt,
        share: Share2,
        updatelocation: MapPinCheckInside
    }

    const IconComponent = iconMap[icon] || Thermometer
    return <IconComponent className='w-6 h-6'/>
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