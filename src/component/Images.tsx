'use client';
import React from "react";
import Image from "next/image";

interface CustomIconProps {
    src: string;
    alt: string;
}
interface CustomImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export function SmallIcon({src, alt}: CustomIconProps){
    return(
        <div className=" relative w-5 h-5">
            <Image src={src} alt={alt} fill={true} sizes="(max-width: 70px)"/>
        </div>
    )
}
export function HeaderIcon({src, alt}: CustomIconProps){
    return(
        <div className=" relative w-6 h-6">
            <Image src={src} alt={alt} fill={true} sizes="(max-width: 70px)"/>
        </div>
    )
}
export function MediumIcon({src, alt}: CustomIconProps){
    return(
        <div className=" relative w-8 h-8">
            <Image src={src} alt={alt} fill={true} sizes="(max-width: 100px)"/>
        </div>
    )
}
export function LargeIcon({src, alt}: CustomIconProps){
    return(
        <div className=" relative w-14 h-14">
            <Image src={src} alt={alt} fill={true} sizes="(max-width: 200px)"/>
        </div>
    )

}