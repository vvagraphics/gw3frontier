"use client";

import React, { useEffect, useState } from "react";

const ERAS = [
  { 
    id: "gw1", 
    title: "GW: REFORGED", 
    subtitle: "The Age of Ascalon", 
    borderHover: "hover:border-yellow-600", 
    textHover: "group-hover:text-yellow-400", 
    activeBg: "bg-yellow-900/40", 
    logoUrl: "/images/gw_reforge.avif" 
  },
  { 
    id: "gw2", 
    title: "GUILD WARS 2", 
    subtitle: "The Elder Dragons", 
    borderHover: "hover:border-red-600", 
    textHover: "group-hover:text-red-400", 
    activeBg: "bg-red-900/40", 
    logoUrl: "/images/guild_wars_2.avif" 
  },
  { 
    id: "gw3", 
    title: "GUILD WARS 3", 
    subtitle: "The Frontier", 
    borderHover: "hover:border-mesmer-neon", 
    textHover: "group-hover:text-mesmer-neon", 
    activeBg: "bg-mesmer-neon/20", 
    logoUrl: "/images/guild_wars_3.avif" 
  }
];

export default function EraNavigator() {
  const [activeEra, setActiveEra] = useState("gw3");

  useEffect(() => {
    const savedEra = localStorage.getItem("gw-active-era") || "gw3";
    setActiveEra(savedEra);
    document.documentElement.setAttribute("data-era", savedEra);
  }, []);

  const handleEraChange = (eraId: string) => {
    setActiveEra(eraId);
    localStorage.setItem("gw-active-era", eraId);
    document.documentElement.setAttribute("data-era", eraId);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-0 px-4">
      {/* Tapestry Banner Grid Container */}
      <div className="relative grid grid-cols-3 gap-2 md:gap-4 bg-black/50 p-2 rounded-xl border border-gray-800 backdrop-blur-md overflow-hidden">
        
        {/* SINGLE BACKDROP IMAGE SPANNING ENTIRE NAVIGATOR */}
        {/* <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <img 
            src="/images/tapestry-backdrop.avif" 
            alt="Eras Tapestry Backdrop"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div> */}

        {ERAS.map((era) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => handleEraChange(era.id)}
              className={`relative z-10 flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all duration-300 group
                ${isActive ? `border-gray-300 ${era.activeBg}` : `border-transparent ${era.borderHover} bg-black/40`}
              `}
            >
              {/* DYNAMIC LOGO CONTAINER */}
              <div className="relative z-10 h-8 md:h-12 w-full flex items-center justify-center mb-1 md:mb-2">
                 <img 
                   src={era.logoUrl} 
                   alt={`${era.title} Logo`}
                   className={`max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300 ${isActive ? 'opacity-100 scale-105' : 'opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}
                   onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
              </div>

              {/* Title & Subtitle */}
              <span className={`relative z-10 text-xs md:text-sm font-black italic tracking-wider transition-colors drop-shadow-md ${isActive ? "text-white" : "text-gray-200"} ${era.textHover}`}>
                {era.title}
              </span>
              <span className="relative z-10 text-[8px] md:text-xs font-mono text-gray-400 mt-0.5 uppercase tracking-widest hidden md:block">
                {era.subtitle}
              </span>

              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Balanced Alert Container */}
     <div className="text-center mt-2 mb-1">
  {/* The 'animate-pulse' class makes the whole badge gently glow */}
  <span className="text-[9px] font-mono uppercase tracking-widest px-3 py-1 rounded border border-amber-500/50 text-amber-400 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
    {/* Adding a custom icon or emoji to emphasize the warning */}
    <span className="mr-2">⚠️</span><span className="text-blue-400"></span> Preset applied. 
  <span className="text-gray-600"> // </span> 
  <span className="text-amber-500">NOTICE:</span> Data for each era is pending deployment.
  </span>
</div>
    </div>
  );
}