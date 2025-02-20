import { createContext, useState, useContext, ReactNode } from "react";

interface Location {
    name: string;
    lat: number;
    lon: number;
    id: number;
    country: string;
    current: boolean;
}

interface SelectedLocationContextType{
    selectedLocation: Location | null;
    setSelectedLocation: (location: Location | null) => void;
}

const selectedLocationContext = createContext<SelectedLocationContextType | undefined>(undefined);

export const SelectedLocationProvider = ({children}: {children: ReactNode})=>{
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    return(
        <selectedLocationContext.Provider value={{selectedLocation, setSelectedLocation}}>
            {children}
        </selectedLocationContext.Provider>
    )
}

export const useLocation = (): SelectedLocationContextType=>{
    const context = useContext(selectedLocationContext);
    if(!context) {
        throw new Error('UseLocation must be within a loactionProvider')
    }
    return context
}