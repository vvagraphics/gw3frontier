// src/app/(public)/page.tsx
import React from "react";
import fs from "fs";
import path from "path";
import PodcastMiniPlayer from "@/components/PodcastMiniPlayer";
import EraNavigator from "@/components/EraNavigator";

interface NewsItem {
  title: string;
  link: string;
  date: string;
  source: string;
}

export default function HomePage() {
  let newsArticles: NewsItem[] = [];

  try {
    const filePath = path.join(process.cwd(), "src/lib/api/news.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    newsArticles = JSON.parse(fileData);
  } catch (error) {
    console.error("Could not load news data file:", error);
  }

  return (
    <div className="space-y-16 py-4">
      <EraNavigator />
      {/* 1. HERO SECTION (Unchanged) */}
      <section className="relative text-center py-12 md:py-16 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-mesmer-neon/15 via-transparent to-transparent -z-10 blur-3xl pointer-events-none"></div>
        <div className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-jade-tech/10 text-jade-tech rounded-none border-l-4 border-jade-tech anime-glitch-hover">
          System Link // Tyria Server
        </div>
        <div className="relative p-8 bg-white rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.15)] anime-glitch-hover w-full max-w-lg border border-gray-300">
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-mesmer-neon border border-black rounded-sm animate-pulse"></div>
          <img src="/images/gw3-logo-darkbg.png" alt="Guild Wars 3 Official Logo" className="w-full object-contain" />
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-mono">
          Tracking news, analyzing momentum-based combat, and building player analytics tools for the upcoming saga in Tyria.
        </p>
      </section>

      {/* 2. MEDIA HUB (Unchanged) */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-800 pb-2">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
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

      {/* 3. DATA ARCHITECTURE & MONETIZATION (Updated to 3 columns) */}
      
      {/* 3. DATA ARCHITECTURE & MONETIZATION (Locked Heights) */}
      <section className="grid lg:grid-cols-3 gap-6 pt-8">
        
        {/* Column 1: Scraper Feed */}
        <div className="panel-slf p-6 rounded-xl flex flex-col anime-glitch-hover h-120">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0">
            <h2 className="text-lg font-black text-white italic tracking-wide uppercase">GUILD WARS NEWS</h2>
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
            <h2 className="text-lg font-black text-white italic tracking-wide uppercase">META BUILDS</h2>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar grow">
            <div className="p-3 rounded bg-black/50 border border-gray-800 group hover:border-guardian-light/50 transition-colors">
              <p className="text-sm font-bold text-gray-200">Kinetic Combat Build Crafter</p>
              <p className="text-xs text-gray-500 font-mono mt-1">Modeling momentum arrays and trait distributions.</p>
            </div>
            <div className="p-3 rounded bg-black/50 border border-gray-800 group hover:border-guardian-light/50 transition-colors">
              <p className="text-sm font-bold text-gray-200">Momentum Mini-Game</p>
              <p className="text-xs text-gray-500 font-mono mt-1">Interactive physics module mimicking Seeker mechanics.</p>
            </div>
          </div>
        </div>

        {/* Column 3: Monetization (Merch & Ads) */}
        <div className="flex flex-col gap-6 h-120">
          
          {/* Merch Widget */}
          <div className="panel-slf p-5 rounded-xl flex flex-col anime-glitch-hover border-jade-tech/30 flex-1">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3 shrink-0">
              <h2 className="text-sm font-black text-jade-tech italic tracking-wide uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-jade-tech animate-pulse rounded-full"></span>
                MERCH DROP
              </h2>
            </div>
            <div className="bg-black/60 rounded border border-gray-800 p-3 text-center group cursor-pointer hover:border-jade-tech/50 transition-all grow flex flex-col justify-center items-center">
              <p className="text-sm font-bold text-gray-200">Age of Orr Desk Mat</p>
              <p className="text-xs text-jade-tech font-mono mt-1">Secure Loadout ↗</p>
            </div>
            
          </div>

          {/* Styled Ad Placement */}
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