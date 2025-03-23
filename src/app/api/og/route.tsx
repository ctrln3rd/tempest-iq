import {ImageResponse} from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';


export async function GET(req: NextRequest) {
   const {searchParams} = new URL(req.url)
   const location = searchParams.get('location') || 'Nairobi'
   const imageUrl = 'https://weatherrush.netlify.app/logo512.png'
    return new ImageResponse(
       <div style={{
            display:'flex',
            flexDirection: 'row',
            width: '1200px',
            height: '630px',
            backgroundColor: '#767171',
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            paddingInline: '10px',
            gap: '10px'
        }}> 
        <img src={imageUrl} style={{width: '30%', height: '48%'}} alt='background image'/>
       
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
            <h1>Weather Rush</h1>
            <h3>weather for-<span style={{color: 'wheat', opacity: 0.8}}>{location}</span></h3>
        </div>
        </div>,{
            width: 1200,
            height: 630,
        }
    )
}