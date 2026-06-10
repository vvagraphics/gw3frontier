// src/app/(public)/page.tsx
import React from "react";
import fs from "fs";
import path from "path";
// Import the new Client Mini Player
import PodcastMiniPlayer from "@/components/PodcastMiniPlayer";

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
      {/* 1. HERO SECTION (With Official Logo) */}
      <section className="relative text-center py-12 md:py-16 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-mesmer-neon/15 via-transparent to-transparent -z-10 blur-3xl pointer-events-none"></div>
        
        <div className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-jade-tech/10 text-jade-tech rounded-none border-l-4 border-jade-tech anime-glitch-hover">
          System Link // Tyria Server
        </div>

        <div className="relative p-8 bg-white rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.15)] anime-glitch-hover w-full max-w-lg border border-gray-300">
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-mesmer-neon border border-black rounded-sm animate-pulse"></div>
          <img 
            src="/images/gw3-logo-darkbg.png" 
            alt="Guild Wars 3 Official Logo" 
            className="w-full object-contain"
          />
        </div>

        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-mono">
          Tracking news, analyzing momentum-based combat, and building player analytics tools for the upcoming saga in Tyria.
        </p>
      </section>

      {/* 2. MEDIA HUB (YouTube + Podcast) */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-800 pb-2">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
            GW3 <span className="text-mesmer-neon">REWIND</span>
          </h2>
          <div className="h-0.5 grow bg-linear-to-r from-mesmer-neon/50 to-transparent"></div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* YouTube Video Main */}
          <div className="lg:col-span-2 panel-slf p-5 space-y-4 rounded-xl anime-glitch-hover">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400">YOUTUBE // Average “Casual” Gaming</span>
              <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold tracking-widest uppercase animate-pulse">Broadcast</span>
            </div>
            
            <div className="aspect-video w-full rounded border border-gray-800 bg-black shadow-inner overflow-hidden">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/ftAHYnmlCPk" 
                title="Guild Wars 3 Announcement REWIND" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">Guild Wars 3 Announcement REWIND</h3>
          </div>

          {/* Clean Swap Applied: Replaced static card with operational MiniPlayer */}
          <PodcastMiniPlayer />
        </div>
      </section>

      {/* 3. DATA ARCHITECTURE (The Scraper & Tools) */}
      <section className="grid md:grid-cols-2 gap-8 pt-8">
        <div className="panel-slf p-6 rounded-xl space-y-4 anime-glitch-hover">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="text-xl font-black text-white italic tracking-wide uppercase">LIVE TRANSMISSIONS</h2>
            <span className="text-xs px-2 py-1 rounded bg-jade-tech/20 text-jade-tech font-mono uppercase tracking-widest font-bold border border-jade-tech/30">
              Java Engine
            </span>
          </div>

          <div className="space-y-3 max-h-87.5 overflow-y-auto pr-2 custom-scrollbar">
            {newsArticles.length === 0 ? (
              <p className="text-gray-500 text-sm italic font-mono">No data streams detected. Execute scraper backend.</p>
            ) : (
              newsArticles.map((article, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded bg-black/60 border-l-2 border-gray-700 hover:border-mesmer-neon transition-all space-y-1 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-mono text-gray-500">{article.date || "RECENT"}</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">
                      {article.source}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {article.title}
                  </h3>
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block text-[11px] text-guardian-light/80 hover:text-guardian-light uppercase tracking-widest font-bold mt-2"
                  >
                    Access Feed ↗
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel-slf p-6 rounded-xl space-y-4 anime-glitch-hover">
          <div className="border-b border-gray-800 pb-3">
            <h2 className="text-xl font-black text-white italic tracking-wide uppercase">ECOSYSTEM MODULES</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded bg-black/50 border border-gray-800 flex justify-between items-center group hover:border-guardian-light/50 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-200">Data Scraper Service</p>
                <p className="text-xs text-gray-500 font-mono">Automated Java pipelines pulling from official feeds.</p>
              </div>
              <span className="text-[10px] px-2 py-1 bg-purple-900/40 text-purple-400 font-mono rounded border border-purple-900">Java 17</span>
            </div>
            <div className="p-3 rounded bg-black/50 border border-gray-800 flex justify-between items-center group hover:border-guardian-light/50 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-200">Kinetic Combat Build Crafter</p>
                <p className="text-xs text-gray-500 font-mono">Modeling momentum arrays and trait distributions.</p>
              </div>
              <span className="text-[10px] px-2 py-1 bg-blue-900/40 text-blue-400 font-mono rounded border border-blue-900">React</span>
            </div>
            <div className="p-3 rounded bg-black/50 border border-gray-800 flex justify-between items-center group hover:border-guardian-light/50 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-200">Momentum Mini-Game</p>
                <p className="text-xs text-gray-500 font-mono">Interactive physics module mimicking Seeker mechanics.</p>
              </div>
              <span className="text-[10px] px-2 py-1 bg-yellow-900/40 text-yellow-500 font-mono rounded border border-yellow-900">Awaiting Data</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}