import {ImageResponse} from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';


export async function GET(req: NextRequest) {
   const {searchParams} = new URL(req.url)
   const location = searchParams.get('location') || 'Nairobi'
   const imageUrl = 'https://weatherrush.netlify.app/opengraph-plain.jpg'
    return new ImageResponse(
       <div style={{
            display:'flex',
            flexDirection: 'column',
            width: '1200px',
            height: '630px',
            backgroundColor: '#1e2939',
            color: 'white',
            alignItems: 'flex-end',
            justifyContent: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
        }}> 
        <img src={imageUrl} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' , zIndex: 0}} alt='background image'/>
       
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', paddingRight: '10px'}}>
            <h1>Weather Rush</h1>
            <div style={{display: 'flex', flexDirection: 'row' , justifyContent: 'center' , alignItems: 'center' , gap: '3px'}}>
            <p style={{color: 'yellow'}}>{location} </p>
            <p>weather</p>
            </div>
        </div>
        </div>,{
            width: 1200,
            height: 630,
        }
    )
}