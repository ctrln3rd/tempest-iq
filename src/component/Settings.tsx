'use client';
import React, { Suspense } from 'react';
import { useSettingsStore } from '@/stores/useSettings';
import { useState } from 'react';
import { HelperIcon } from './icons';

interface Settings {
    temperature: string;
    speed: string;
    distance: string;
    autorefreshduration: number;
    radiusthreshold: number;
    [key: string]:{};
  }

interface Settings_Units{
    [key: string] : {
    units: string[] | number[];
    }
}
const settingsunits : Settings_Units ={
    temperature: {
        units: ['celcius', 'fahrenheit'],
    },
    speed: {
        units: ['km/h', 'm/s', 'mph', 'knots']
    },
    distance: {
        units: ['metres', 'kilometers', 'miles']
    },
    autorefreshduration: {
        units: [1, 2, 3, 6, 12, 24, 48]
    },
    radiusthreshold: {
        units: [1000, 2000, 5000, 10000, 20000, 40000, 80000]
    }
}


export default function Settings(){

    const {settings, updateSettings, resetSettings} = useSettingsStore();
    const [showchangeCard, setshowchangeCard] = useState<boolean>(false);
    const [currentSetting, setcurrentSettings] = useState<string>('');
    const [activeValue, setactiveValue] = useState<any | OnErrorEventHandlerNonNull>(null);


    const handelOpenChangeCard = (settingsKey: string) =>{
        setcurrentSettings(settingsKey);
        setactiveValue(settings[settingsKey as keyof typeof settings]);
        setshowchangeCard(true);
    }
    const handlesaveChange = (newvalue: any)=>{
        setactiveValue(newvalue)
        let newsettings : any = settings;
        newsettings[currentSetting] = isNaN(newvalue) ? newvalue : parseInt(newvalue);
        updateSettings(newsettings)
        setshowchangeCard(false)
    }
    const handlereset = ()=>{
        resetSettings()
    }

    const configtitle = (key: string)=>{
        switch(key){
            case 'autorefreshduration': return ' auto refresh weather after?';
            case 'radiusthreshold' : return 'auto change location after?';
            default: return key
        }
    }
    const configUnits = (key: string, unit: number)=>{
        switch(key){
            case 'autorefreshduration': return `${unit} hour`;
            case 'radiusthreshold' : return `${unit / 1000} kilometres`;
            default: return unit
        }
    }

    return(
        <div className="flex flex-col items-start gap-5 px-20 pt-7 max-md:px-10 max-sm:px-5">
            <div className="flex flex-col items-stretch gap-2">
                {Object.entries(settings).map(([key, value])=>(
                    <div key={key} className='flex flex-row justify-between w-[50vw] items-center px-2 py-3 shadow-md shadow-black rounded-lg
                    max-sm:w-[90vw]'>
                        <div>
                            <h4>{configtitle(key)}</h4>
                            <p className='opacity-70'>{configUnits(key, value)}</p>
                        </div>
                        <button onClick={() =>handelOpenChangeCard(key)}>change</button>
                    </div>
                ))}
             <button onClick={handlereset} className='self-start flex flex-row'> <HelperIcon icon='resetlist'/>reset setting</button>
            </div>

            {showchangeCard && <div className='fixed top-[50%] left-[50%] transform translate-[-50%] bg-gray-900 px-5 py-3 flex flex-col min-w-[40vw]
            items-start gap-4 z-5 max-sm:min-w-[80vw] rounded-lg'>
                <h4>change {configtitle(currentSetting)}</h4>
                <div className='flex flex-col gap-2'>
                {settingsunits[currentSetting]?.units ? (
                    settingsunits[currentSetting].units.map((unit: any)=> (
                        <label key={unit} className='flex flex-row gap-1 items-center'>
                            <input type='radio' value={unit} checked={activeValue === unit} onChange={(e)=> handlesaveChange(e.target.value)}/>
                            {configUnits(currentSetting, unit)}
                        </label>
                    ))
                ): <p>no value to change</p>}
                </div>
                <button onClick={()=>setshowchangeCard(false)} className='self-end'>cancel</button>
            </div>}

        
            <div className='flex flex-col gap-3'>
            <h3 className='opacity-80'>About weather rush</h3>
            <p>Weather rush is a showcase of my React expertise and API integration,
                 demonstrating my proficiency in modern web development.
                 With a sleek and responsive design, the app provides real-time weather
                  updates using external APIs, 
                 allowing users to stay informed about current conditions and forecasts worldwide. 
                 Weather rush reflects a commitment to user-centric design, 
                 offering an intuitive interface and seamless navigation.<br/> <br/> For more projects showcasing my  skills, 
                visit <a href="https://austinemark.netlify.app">my website</a> and
                 experience the blend of functionality, aesthetics, and technical excellence firsthand.</p>
                <h4>contributors</h4>
                <p><span className='opacity-70'> Main Developer</span> Austine Mark</p>
                <p><span className='opacity-70'>Location features</span> nominatim via openstreetmap,org</p>
                <p><span className='opacity-70'>Weather Data</span> open-meteo.com</p>
                <p><span className='opacity-70'>navigation icons</span> flaticon.com</p>
                <p><span className='opacity-70'>weather background images</span> deep ai</p>
                <p><span className='opacity-70'>background images</span> pixabay.com</p>
                <p><span className='opacity-70'>weather icons</span> Bas Milius via meteocons</p>
            </div>
            <footer>
            <p id="creator">created by austine mark - <a href="https://austinemark.netlify.app">see others</a></p>
    </footer>
        </div>
    )
}

