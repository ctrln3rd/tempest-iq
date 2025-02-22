import { ImageResponse } from "next/og";

export const runtime = 'edge';

type PageProps = {
    params: {
        location: string;
    };
};

export async function Image({ params }: PageProps) {
    const location = params.location || 'nairobi'
    return new ImageResponse(
       <div style={{
            display:'flex',
            width: '1200px',
            height: '630px',
            backgroundColor: '#1e293b',
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            fontWeight: 'bold'
        }}>
            weather in {location}
        </div>,{
            width: 1200,
            height: 630,
        }
    )
}