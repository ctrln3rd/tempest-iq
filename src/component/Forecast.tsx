import React, { useEffect, useState } from "react";
//import { getcodecondition, getcodeIconChart} from "../weatherConfig";;
import { XAxis, YAxis, ResponsiveContainer, Line, LineChart } from 'recharts';
import { DailyForecast, DailyChartData } from "@/types/weatherTypes";
import { MediumIcon, SmallIcon } from "./Images";
import { useDateConfigStore } from "@/stores/useDate";
import { useSettingsStore } from "@/stores/useSettings";
import { useWeatherConfigStore } from "@/stores/useWeather";



interface PropsData {
    dailyforecast: DailyForecast;
    currenttime: string;
    isDay: Boolean;
    handleRefresh: ()=> void;
}
interface AstroTime{
    first: string;
    last: string;
}
interface CustomAxisData{
    x: number;
    y: number;
    payload: {value: string;};
}

export default function Forecast({dailyforecast, currenttime, isDay, handleRefresh }: PropsData){
    const [dailychartdata, setdaillychartdata] = useState<any[] | undefined>(undefined);
    const [chartheight, setchartheight] = useState(230);
    const [astrotime, setastrotime] = useState<AstroTime>({ first: '0', last: '0' })
    const [astroposition, setastroposition] = useState<number>(0)

    const {getCodeIcon, getCodeCondition } = useWeatherConfigStore();
    const {formatDay, calculateAstro, formatLocalDate} = useDateConfigStore();
    const {temperatureUnitChart, temperatureUnit} = useSettingsStore();
    
    useEffect(()=>{
        const calculateastro = ()=>{
        const astrodata = calculateAstro(dailyforecast.sunrise[0], dailyforecast.sunset[0], currenttime, Boolean(isDay));

            setastroposition(Number(astrodata.progress))
            setastrotime({first: astrodata.first, last: astrodata.last})
        }
        if(currenttime &&  dailyforecast.sunrise && dailyforecast.sunset){
            calculateastro();
        }
    },[currenttime, isDay, dailyforecast])
    
    useEffect(()=>{
        const handleSize = ()=>{
            if (window.innerWidth < 768) setchartheight(220);
            
            
        };
        window.addEventListener('resize', handleSize);
        handleSize();
        return ()=>{
            window.removeEventListener('resize', handleSize)
        
        }
    },[])


    // summaries
    const precipitationSummary = ()=>{
        const precipitationSum = dailyforecast.precipitation_sum;
        const dates = dailyforecast.time;
        const precipitationDays = precipitationSum.map((value, index)=> ({index: index, prep: value})).filter(day => day.prep > 0)
        if(precipitationDays.length > 3){
            return `wet days a head from ${formatDay(dates[precipitationDays[0].index], currenttime)}`;
        }else if(precipitationDays.length > 0){
            const firstprepday = precipitationDays[0];
            const amount  = firstprepday.prep;
            const day = formatDay(dates[firstprepday.index], currenttime)
            let chance ;
            if(amount < 0.3){
                chance = 'low chance'
            }else if(amount < 1){
                chance = 'possible'
            }else{
               chance = 'expected'
            }
            return `${chance} ${(day === 'Yesterday'|| day === 'Today' || day === 'Tomorrow') ? day : `on ${day}`}`
        }else{
            return 'dry days a head'
        }
    }

    const actvitySummary = ()=>{
        if(dailyforecast.precipitation_sum[0] === 0  && dailyforecast.temperature_2m_max[0] >=15 && dailyforecast.temperature_2m_max[0] <=25 && 
            dailyforecast.uv_index_max[0] <= 7) {
            return 'hike or picnic'
        }
        if(dailyforecast.precipitation_sum[0] > 1){
            return 'best for indoor activites'
        }
        return 'no activity to recommend'
    }

    const cautionSummary = ()=>{
        if(dailyforecast.precipitation_sum[0] >= 10) return 'extreme precipitation';
        if(dailyforecast.uv_index_max[0] > 7) return 'high uv, limit outdoor';
        if(dailyforecast.temperature_2m_min[0] < -5) return 'extreme cold, stay warm';
        if(dailyforecast.temperature_2m_max[0] > 35) return 'extreme hot, stay hydrated';
        return 'good day'
    }



    useEffect(()=>{
        let myarray: DailyChartData[] = [];
        dailyforecast.time.forEach((dt, index)=>{
            const details = `${formatDay(dt, currenttime)} ${temperatureUnit(dailyforecast.temperature_2m_max[index])}/${temperatureUnit(dailyforecast.temperature_2m_min[index])}`;
            //const temp =  Math.round(settings.temp === 'celcius' ? dt.values.temperature: toFahrenheit(dt.values.temperature));
            const temp = temperatureUnitChart(dailyforecast.temperature_2m_max[index]);
            const icon = dailyforecast.weather_code[index];
            const prep = dailyforecast.precipitation_probability_max[index]
            myarray.push({day: details, temp: temp, icon: icon, prep: prep})
        })
        setdaillychartdata(myarray)
    }, [dailyforecast, currenttime])


    const CustomDot = (props: any)=>{
        const {cx, cy, payload} = props;
        //const cleanedValue = payload.temp.toString().replace(/^0+/, '');
        return(
            <g style={{backgroundColor: 'blue'}} fill="blue">
            <image x={cx-20} y={cy- 100} width={60} height={60} href={getCodeIcon(payload.icon, Boolean(isDay))}/>
            {/*<circle cx={cx} cy={cy} r={1.5} fill="#ededed"/>*/}
            <text x={cx} y={cy -10} textAnchor="middle" fill="#ededed" fontSize={'0.9em'}>{payload.temp}°</text>
            </g>
        )
    }
    const CustomXasis = ({x, y, payload}: any)=>{
        //const cleanedValue = payload.temp.toString().replace(/^0+/, '');
        return(
            <g transform={`translate(${x}, ${y})`}>
            {dailychartdata?.find(t => t.day === payload.value).prep > 0 &&<g>
            <image x={-15} y={-5} width={17} height={17} href="/images/drop.png"/>
            <text x={5} y={10} fill="#ffffff99">{dailychartdata?.find(t => t.day === payload.value).prep}%</text>
            </g>}
            <text x={-15} y={60} dy={10} fill="#ededed" textAnchor="start">{payload.value}</text>
            <text x={-15} y={75} dy={10} fill="#ffffff99" textAnchor="start" fontSize={'0.9em'}>{ getCodeCondition(dailychartdata?.find(t => t.day === payload.value).icon)}</text>
            </g>
        )
    }

    
    
    const scrollchart = (direction: string)=>{
       const chartcontainer = document.getElementById('chart-scroll');
       if(chartcontainer){
        const scrolldistance = window.innerWidth / 3
        const scrollamount = direction === 'right' ? scrolldistance: -scrolldistance;
        chartcontainer.scrollBy({left: scrollamount, behavior: 'smooth'})
       }
    }


    return(
        <div className='flex flex-col gap-10 bg-gray-900 rounded-t-xl px-5 pt-2 pb-20'>
        <div className="flex flex-row justify-between items-center pb-1 border-b border-amber-50">
        <div className="flex flex-row items-center gap-1">
        <SmallIcon src='/images/forecast.png' alt="f"/>
        <h3>Forecast next 7 days | <span>{formatLocalDate(currenttime)}</span></h3>
        </div>
        <button onClick={handleRefresh}>refresh</button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-1">
          <SmallIcon src='/images/summary.png' alt="ico"/>
          <h4>summary</h4>
          </div>
          <div className="flex flex-row items-start gap-10 flex-wrap max-sm:gap-4">
          <div className="bg-gray-600 px-4 py-1 rounded-lg flex flex-col items-start gap-3">
            <div className="flex flex-row items-center gap-1">
            <SmallIcon src='/images/umbrella.png' alt="ico"/>
            <h5 className="opacity-75">precipitation</h5>
            </div>     
            <p>{precipitationSummary()}</p>
          </div>
          <div className="bg-gray-600 px-4 py-1 rounded-lg flex flex-col items-start gap-3">
          <div className="flex flex-row items-center gap-1">
            <SmallIcon src='/images/activity.png' alt="ico"/>
            <h5 className="opacity-75">today's activity</h5>
            </div>
            <p>{actvitySummary()}</p>
          </div>
          <div className=" bg-gray-600 px-4 py-1 rounded-lg flex flex-col items-start gap-3">
          <div className="flex flex-row items-center gap-1">
            <SmallIcon src='/images/caution.png' alt="ico"/>
            <h5 className="opacity-75">caution</h5>
            </div>
            <p>{cautionSummary()}</p>
          </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-start">
        <div className="flex flex-row items-center gap-1 self-end pb-5">
          <SmallIcon src='/images/day.png' alt="ico"/>
          <h4>day by day</h4>
          </div>
        <div className="w-[70vw] overflow-x-auto scrollbar-hidden hide-scrollbar max-sm:w-[95vw]" id="chart-scroll">
        <div className="w-[160%] max-sm:w-[280%]">
        <ResponsiveContainer width={'100%'} height={chartheight}  {...{overflow: 'visible'}}>
            <LineChart data={dailychartdata} margin={{left: 20, top: 80, right: 90, bottom: 70}}  {...{overflow: 'visible'}}>
            <XAxis dataKey={'day'} stroke="#ffffffb3" strokeWidth={0.8} axisLine={false} interval={0} textAnchor="middle"
            tick={<CustomXasis/>} tickLine={false} />

            <YAxis axisLine={false} hide={true} stroke="#ffffffb3" tickLine={false} />
            {/*<CartesianGrid strokeDasharray={'3 3'} vertical={true} horizontal={false} stroke="#ffffff66" strokeWidth={0.5}/>*/}
            <Line type={'monotone'} dataKey={'temp'}  dot={<CustomDot/>} stroke="#d3d3d3cc" strokeWidth={2}
            activeDot={false}/>
            </LineChart>
        </ResponsiveContainer>
        </div>
        </div>
        <div className="flex flex-row items-center gap-2 self-end">
            <button onClick={()=>scrollchart('left')}>{'<'}</button>
            <p>scroll or swipe</p>
            <button onClick={()=>scrollchart('right')}>{'>'}</button>
        </div>
        </div>

       <div className="flex flex-col items-center self-stretch gap-3">
       <div className="flex flex-row items-center gap-1 self-start">
          <SmallIcon src='/images/astro.png' alt="ico"/>
          <h4>astro track | <span className="opacity-70">{isDay ? 'day-time': 'night-time'}</span></h4>
          </div>
            <div className="flex flex-row gap-5 relative max-sm:gap-2">
            <p id='sunrise'><span>{isDay ? 'sunrise': 'sunset'}</span> <br/>{astrotime.first}</p>
            <div className="w-[50vw] relative items-center justify-center max-sm:w-[70vw]" >
                <div className={`w-[100%] h-1 ${isDay ? 'bg-sky-500':'bg-black'}  absolute top-[50%] left-[50%] tranform translate-[-50%] `}></div>
                <div className={`absolute top-[50%] left-[${astroposition}%] tranform translate-y-[-50%]`}>
                <MediumIcon src={`/images/${isDay ? 'sun' : 'star'}.png`} alt="ico" />
                </div>
            </div>
            <p id='sunset'><span>{isDay ? 'sunset': 'sunrise'}</span> <br/>{astrotime.last}</p>
            </div>
        </div>
</div>
    )
}

//style={{background: `radial-gradient(circle at top,${isDay ? '#2cb8f0' : '#0d0d3d'} 10%, transparent 90%)`}}

