import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Location {
    latitude: number;
    longitude: number;
    id: number;
    name: string;
    current: boolean;
}

interface LocationContextType{}