import {ImageResponse} from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';


export async function GET(req: NextRequest) {
   const {searchParams} = new URL(req.url)
   const location = searchParams.get('location') || 'Nairobi'
   const imageUrl = 'https://tempestiq.netlify.app/logo512.png'
    return new ImageResponse(
       <div style={{
            display:'flex',
            flexDirection: 'row',
            width: '1200px',
            height: '630px',
            backgroundColor: '#333f50',
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            paddingInline: '10px',
            gap: '10px'
        }}> 
        <img src={imageUrl} style={{width: '300px', height: '300px'}} alt='background image'/>
       
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
            <h1 style={{margin: 0, padding: 0}}>TempestIQ</h1>
            <h2 style={{color: '#42b0f5', opacity: 0.8, margin: 0, padding: 0}}>{location}</h2>
        </div>

        </div>,{
            width: 1200,
            height: 630,
        }
    )
}