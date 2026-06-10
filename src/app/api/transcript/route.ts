// src/app/api/transcript/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("http://mr3anderson.pro/podcast/gw3frontier/Guild_Wars_3_Resets_the_Tyrian_Timeline.json", {
      // Disables caching so if you update the JSON on your server, the site gets the new one
      cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error('Failed to fetch data');
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
  }
}