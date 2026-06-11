import { NextResponse } from 'next/server';

export async function GET() {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

  if (!PRINTFUL_API_KEY) {
    return NextResponse.json({ error: "System configuration error: API Key missing" }, { status: 500 });
  }

  try {
    // 1. Fetch all sync products from your Printful store container
    const response = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 1800 } // Cache results for 30 minutes to protect performance
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Printful API Error Details:", JSON.stringify(errorData, null, 2));
      throw new Error(`Printful returned status: ${response.status}`);
    }

    const data = await response.json();
    
    // Printful arrays are always wrapped inside a 'result' key
    const rawProducts = data.result || [];

    // 2. Map Printful's data architecture into our clean theme layout structure
    const cleanedProducts = rawProducts.map((item: { id: string | number; name: string; thumbnail_url?: string; external_url?: string }) => ({
      id: String(item.id),
      name: item.name,
      // Printful storefront API provides a high-res flat thumbnail image
      imageUrl: item.thumbnail_url || "/images/Extra_Large_Desk_Mat_GW3Frontier.avif", 
      status: "IN STOCK", // Default fallback string
      // Printful returns product variants; if you have a public storefront link, we capture it here
      externalUrl: item.external_url || null 
    }));

    return NextResponse.json(cleanedProducts);
  } catch (error ) {
    console.error("Printful sync pipeline failed:", error);
    return NextResponse.json({ error: "Failed to extract active inventory streams" }, { status: 500 });
  }
}