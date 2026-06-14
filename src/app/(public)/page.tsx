import React from "react";
import fs from "fs";
import path from "path";
import PodcastMiniPlayer from "@/components/PodcastMiniPlayer";
import EraNavigator from "@/components/EraNavigator";
import StatusAnimation from "@/components/StatusAnimation";

interface NewsItem {
  title: string;
  link: string;
  date: string;
  source: string;
}

async function fetchFeaturedMerch() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/printful`, { cache: 'no-store' });
    if (!res.ok) return null;
    const rawData = await res.json();
    const featured = rawData[0]; 
    if (!featured) return null;

    return {
      id: String(featured.id),
      name: String(featured.name || "Unknown Asset"),
      imageUrl: String(featured.imageUrl || "/images/gw3-logo-darkbg.png"),
      externalUrl: "https://gw3frontier.printful.me/"
    };
  } catch (err) {
    console.error("Could not fetch featured merch for homepage:", err);
    return null;
  }
}

export default async function HomePage() {
  let newsArticles: NewsItem[] = [];
  try {
    const filePath = path.join(process.cwd(), "src/lib/api/news.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    newsArticles = JSON.parse(fileData);
  } catch (error) {
    console.error("Could not load news data file:", error);
  }

  const featuredMerch = await fetchFeaturedMerch();

  // UPTIME CALCULATIONS
  const today = new Date();
  const gw1ReleaseDate = new Date("2005-04-28");
  const gw2ReleaseDate = new Date("2012-08-28");
  
  // Calculate days difference
  const gw1DaysOnline = Math.floor((today.getTime() - gw1ReleaseDate.getTime()) / (1000 * 60 * 60 * 24));
  const gw2DaysOnline = Math.floor((today.getTime() - gw2ReleaseDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex flex-col gap-6 py-0">
      
      {/* CHRONOLOGICAL NAVIGATOR */}
      <EraNavigator />

      {/* HERO SECTION - Framed with a clean top track separator */}
      <section className="relative text-center max-w-4xl mx-auto flex flex-col items-center pt-4 pb-0 w-full border-t border-gray-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-mesmer-neon/15 via-transparent to-transparent -z-10 blur-3xl pointer-events-none"></div>
        
        {/* --- DYNAMIC STATUS MODULES --- */}
        
        {/* GW1 Status (Online) - Now a Link */}
        <a href="https://wiki.guildwars.com/wiki/Game_status" target="_blank" rel="noopener noreferrer" className="status-gw1 flex-col items-center bg-black/60 border border-yellow-900/50 px-6 py-2 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(202,138,4,0.1)] w-full max-w-xs mb-3 hover:border-yellow-600 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] group-hover:animate-pulse"></div>
              <span className="text-xs font-mono text-gray-300 tracking-widest uppercase">
                Server Status: <span className="text-green-400 font-bold ml-1">Online</span>
              </span>
            </div>
            <span className="text-[10px] text-yellow-500/80 font-mono tracking-wider">
              Uptime: {gw1DaysOnline.toLocaleString()} Days
            </span>
          </div>
        </a>

        {/* GW2 Status (Online) - Now a Link */}
        <a href="https://en-forum.guildwars2.com/" target="_blank" rel="noopener noreferrer" className="status-gw2 flex-col items-center bg-black/60 border border-red-900/50 px-6 py-2 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.1)] w-full max-w-xs mb-3 hover:border-red-600 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] group-hover:animate-pulse"></div>
              <span className="text-xs font-mono text-gray-300 tracking-widest uppercase">
                Server Status: <span className="text-green-400 font-bold ml-1">Online</span>
              </span>
            </div>
            <span className="text-[10px] text-red-500/80 font-mono tracking-wider">
              Uptime: {gw2DaysOnline.toLocaleString()} Days
            </span>
          </div>
        </a>

        {/* GW3 Status (Offline/Construction) - Animation moved to the right */}
        <div className="status-gw3 flex flex-row flex-wrap md:flex-nowrap items-center justify-center md:justify-between bg-black/60 border border-mesmer-neon/20 px-6  rounded-xl backdrop-blur-md shadow-[0_0_25px_rgba(0,255,170,0.05)] w-full max-w-xs md:max-w-sm mb-4 cursor-default anime-glitch-hover gap-x-4">
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)] shrink-0"></div>
            <span className="text-xs font-mono text-gray-300 tracking-widest uppercase">
              Server Status: <span className="text-red-400 font-bold ml-1">Offline</span>
            </span> 
          </div>
          <div className="flex justify-center pt-7 items-center h-16 w-16 overflow-hidden shrink-0">
            <StatusAnimation />
          </div>
        </div>

        {/* LOGO BLOCK */}
        <div className="relative p-5 bg-white/5 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.03)] anime-glitch-hover w-full max-w-md border border-gray-900 mt-2">
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-mesmer-neon border border-black rounded-sm animate-pulse"></div>
          <img src="/images/gw3-logo-darkbg.png" alt="Guild Wars 3 Official Logo" className="w-full object-contain" />
        </div>
        
        <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto font-mono mt-4 leading-relaxed">
          Tracking news, analyzing momentum-based combat, and building player analytics tools for the upcoming saga in Tyria.
        </p>
      </section>

      {/* MEDIA HUB */}
      <section className="space-y-4">
        <div className="flex items-center gap-4 border-b border-gray-800 pb-2">
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
            GW3 <span className="text-mesmer-neon">REWIND</span>
          </h2>
          <div className="h-0.5 grow bg-linear-to-r from-mesmer-neon/50 to-transparent"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 panel-slf p-5 space-y-4 rounded-xl anime-glitch-hover">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400">YOUTUBE // Average “Casual” Gaming</span>
              <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold tracking-widest uppercase animate-pulse">Broadcast</span>
            </div>
            <div className="aspect-video w-full rounded border border-gray-800 bg-black shadow-inner overflow-hidden">
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/ftAHYnmlCPk" title="Guild Wars 3 Announcement REWIND" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">Guild Wars 3 Announcement REWIND</h3>
          </div>
          <PodcastMiniPlayer />
        </div>
      </section>

      {/* DATA ARCHITECTURE & MONETIZATION */}
      <section className="grid lg:grid-cols-3 gap-6">
        
        {/* Column 1: Scraper Feed */}
        <div className="panel-slf p-6 rounded-xl flex flex-col anime-glitch-hover h-120">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0">
            <h2 className="text-lg font-black text-white italic tracking-wide uppercase">LIVE TRANSMISSIONS</h2>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar grow">
            {newsArticles.length === 0 ? (
              <p className="text-gray-500 text-sm italic font-mono">No data streams detected.</p>
            ) : (
              newsArticles.map((article, index) => (
                <div key={index} className="p-3 rounded bg-black/60 border-l-2 border-gray-700 hover:border-mesmer-neon transition-all space-y-1 group">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-mono text-gray-500">{article.date || "RECENT"}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{article.title}</h3>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Ecosystem Modules */}
        <div className="panel-slf p-6 rounded-xl flex flex-col anime-glitch-hover h-120">
          <div className="border-b border-gray-800 pb-3 mb-4 shrink-0">
            <h2 className="text-lg font-black text-white italic tracking-wide uppercase">ECOSYSTEM MODULES</h2>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar grow">
            <div className="p-3 rounded bg-black/50 border border-gray-800 group hover:border-guardian-light/50 transition-colors cursor-pointer">
              <p className="text-sm font-bold text-gray-200">Kinetic Combat Build Crafter</p>
              <p className="text-xs text-gray-500 font-mono mt-1">Modeling momentum arrays and trait distributions.</p>
            </div>
            <div className="p-3 rounded bg-black/50 border border-gray-800 group hover:border-guardian-light/50 transition-colors cursor-pointer">
              <p className="text-sm font-bold text-gray-200">Momentum Mini-Game</p>
              <p className="text-xs text-gray-500 font-mono mt-1">Interactive physics module mimicking Seeker mechanics.</p>
            </div>
          </div>
        </div>

        {/* Column 3: Monetization (Merch & Ads) */}
        <div className="flex flex-col gap-6 h-120">
          
          <div className="panel-slf p-5 rounded-xl flex flex-col anime-glitch-hover border-jade-tech/30 flex-1">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3 shrink-0">
              <h2 className="text-sm font-black text-jade-tech italic tracking-wide uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-jade-tech animate-pulse rounded-full"></span>
                FEATURED REQUISITION
              </h2>
            </div>
            
            {featuredMerch ? (
              <a 
                href={featuredMerch.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/60 rounded border border-gray-800 p-3 text-center group hover:border-jade-tech/50 transition-all grow flex flex-col justify-center items-center"
              >
                <div className="aspect-square w-full max-h-32 bg-gray-900 rounded mb-3 flex items-center justify-center overflow-hidden p-2">
                  <img 
                    src={featuredMerch.imageUrl} 
                    alt={featuredMerch.name} 
                    className="object-contain w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all" 
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200 line-clamp-1">{featuredMerch.name}</p>
                  <p className="text-xs text-jade-tech font-mono mt-1">Acquire Asset ↗</p>
                </div>
              </a>
            ) : (
              <div className="bg-black/60 rounded border border-gray-800 p-3 text-center grow flex flex-col justify-center items-center font-mono text-gray-500 text-xs">
                No active items on network.
              </div>
            )}
          </div>

          <div className="panel-slf p-4 rounded-xl flex flex-col anime-glitch-hover bg-black/80 shrink-0 h-50">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Sponsored Link</span>
            </div>
            <div className="w-full grow bg-gray-900 border border-gray-800 rounded flex flex-col items-center justify-center overflow-hidden">
              <img 
                src="https://placehold.co/300x250/111111/00ffaa?text=MOMENTUM+ENERGY\n+SPONSORED+" 
                alt="Test Advertisement" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}