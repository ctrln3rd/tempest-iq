import {ImageResponse} from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';


export async function GET(req: NextRequest) {
   const {searchParams} = new URL(req.url)
   const location = searchParams.get('location') || 'Nairobi'
   const imageUrl = 'https://tempestiq.netlify.app/thunder.png'
    return new ImageResponse(
       <div style={{
            display:'flex',
            flexDirection: 'row',
            width: '1200px',
            height: '630px',
            backgroundColor: '#',
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            paddingInline: '10px',
            gap: '10px'
        }}> 
        <img src={imageUrl} style={{width: '250px', height: '250px'}} alt='background image'/>
       
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
            <h1>Tempest Iq - <span style={{color: '#42b0f5', opacity: 0.8}}>{location}</span></h1>
        </div>
        </div>,{
            width: 1200,
            height: 630,
        }
    )
}