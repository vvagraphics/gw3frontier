import React from "react";

interface TransformedProduct {
  id: string;
  name: string;
  imageUrl: string;
  status: string;
  externalUrl: string;
}

async function fetchLiveInventory(): Promise<TransformedProduct[]> {
  try {
    // Using absolute URLs to guarantee error-free routing on Vercel deployments
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/printful`, { cache: 'no-store' });
    
    if (!res.ok) return [];
    
    const rawData = await res.json();
    
    // Explicitly safe data normalization from the Manual Store's payload API
    return rawData.map((item: { id: string | number; name: unknown; imageUrl: unknown }) => ({
      id: String(item.id),
      name: String(item.name || "Unknown Asset"),
      imageUrl: String(item.imageUrl || "/images/gw3-logo-darkbg.png"),
      status: "AVAILABLE",
      // Force clicks straight to your active Quick Store hosted checkout engine
      externalUrl: "https://gw3frontier.printful.me/"
    }));
  } catch (err) {
    console.error("Could not reach internal inventory API pipeline:", err);
    return [];
  }
}

export default async function RequisitionsPage() {
  const products = await fetchLiveInventory();

  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      
      {/* HEADER SECTION BLOCK */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-jade-tech/10 border border-jade-tech/30 rounded text-jade-tech text-xs font-mono uppercase tracking-widest animate-pulse">
          <span className="w-2 h-2 bg-jade-tech rounded-full"></span>
          Secure Connection Established // Black Lion API
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Physical Asset <span className="text-jade-tech">Requisitions</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
          Authorized community personnel may requisition custom physical gear. All assets are manufactured on-demand and shipped directly to your terminal coordinates via secure encrypted transaction channels.
        </p>
      </section>

      {/* DYNAMIC PRODUCT GRID LAYOUT */}
      {products.length === 0 ? (
        <div className="panel-slf p-8 text-center rounded-xl border border-dashed border-gray-800 text-gray-500 font-mono text-sm">
          ⚠️ Terminal Alert: No active inventory streams detected. Ensure your items are pushed to your primary Printful store container.
        </div>
      ) : (
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="panel-slf flex flex-col p-5 rounded-xl space-y-4 anime-glitch-hover bg-black/60 border border-gray-800 group transition-all hover:border-jade-tech/50">
              
              {/* Card Meta Elements */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  ITEM_REF // {product.id.padStart(4, '0')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold tracking-widest uppercase bg-green-900/40 text-green-400 border border-green-900">
                  {product.status}
                </span>
              </div>

              {/* Dynamic Design Mockup Rendering */}
              <div className="relative aspect-square w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group-hover:border-jade-tech/30 transition-colors flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="object-contain max-h-full max-w-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                />
              </div>

              {/* Purchase Gateway and Callouts */}
              <div className="grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </div>
                
                <div className="pt-3 border-t border-gray-800 flex justify-end">
                  <a 
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center px-4 py-2 bg-jade-tech/10 hover:bg-jade-tech/20 text-jade-tech border border-jade-tech/50 rounded font-mono text-xs uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(var(--color-jade-tech),0.1)]"
                  >
                    Acquire Asset ↗
                  </a>
                </div>
              </div>

            </div>
          ))}
        </section>
      )}

    </div>
  );
}