"use client";

import React, { useEffect, useState } from "react";

const ERAS = [
  { id: "gw1", title: "GW: REFORGED", subtitle: "The Age of Ascalon", color: "hover:border-yellow-600", activeBg: "bg-yellow-900/40" },
  { id: "gw2", title: "GUILD WARS 2", subtitle: "The Elder Dragons", color: "hover:border-red-600", activeBg: "bg-red-900/40" },
  { id: "gw3", title: "GUILD WARS 3", subtitle: "The Frontier", color: "hover:border-mesmer-neon", activeBg: "bg-mesmer-neon/20" }
];

export default function EraNavigator() {
  const [activeEra, setActiveEra] = useState("gw3");

  // Load the saved era on initial load
  useEffect(() => {
    const savedEra = localStorage.getItem("gw-active-era") || "gw3";
    setActiveEra(savedEra);
    document.documentElement.setAttribute("data-era", savedEra);
  }, []);

  // Handle changing the era
  const handleEraChange = (eraId: string) => {
    setActiveEra(eraId);
    localStorage.setItem("gw-active-era", eraId);
    document.documentElement.setAttribute("data-era", eraId);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Chronological Navigator</span>
        <span className="text-[10px] font-mono text-gray-500">SYSTEM.THEME_OVERRIDE</span>
      </div>
      
      {/* Tapestry Banner Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 bg-black/50 p-2 rounded-xl border border-gray-800 backdrop-blur-md">
        {ERAS.map((era) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => handleEraChange(era.id)}
              className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-lg border-2 transition-all duration-300 overflow-hidden group
                ${isActive ? `border-gray-300 ${era.activeBg}` : `border-transparent ${era.color} bg-black/40`}
              `}
            >
              {/* Background Image Placeholder - Replace src with your actual tapestry images */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                <img 
                  src={`/images/${era.id}-tapestry.jpg`} 
                  alt={`${era.title} background`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hides broken image icon if image doesn't exist yet
                />
              </div>

              <span className="relative z-10 text-sm md:text-lg font-black italic tracking-wider text-gray-200 group-hover:text-white drop-shadow-md">
                {era.title}
              </span>
              <span className="relative z-10 text-[9px] md:text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest hidden md:block">
                {era.subtitle}
              </span>

              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}