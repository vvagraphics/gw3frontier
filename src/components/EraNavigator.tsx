"use client";

import React, { useEffect, useState } from "react";

const ERAS = [
  { id: "gw1", title: "GW: REFORGED", subtitle: "The Age of Ascalon", borderHover: "hover:border-yellow-600", textHover: "group-hover:text-yellow-400", activeBg: "bg-yellow-900/40" },
  { id: "gw2", title: "GUILD WARS 2", subtitle: "The Elder Dragons", borderHover: "hover:border-red-600", textHover: "group-hover:text-red-400", activeBg: "bg-red-900/40" },
  { id: "gw3", title: "GUILD WARS 3", subtitle: "The Frontier", borderHover: "hover:border-mesmer-neon", textHover: "group-hover:text-mesmer-neon", activeBg: "bg-mesmer-neon/20" }
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
      {/* Tapestry Banner Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 bg-black/50 p-2 rounded-xl border border-gray-800 backdrop-blur-md">
        {ERAS.map((era) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => handleEraChange(era.id)}
              className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all duration-300 overflow-hidden group
                ${isActive ? `border-gray-300 ${era.activeBg}` : `border-transparent ${era.borderHover} bg-black/40`}
              `}
            >
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                <img 
                  src={`/images/${era.id}-tapestry.jpg`} 
                  alt={`${era.title} background`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              <span className={`relative z-10 text-sm md:text-lg font-black italic tracking-wider transition-colors drop-shadow-md ${isActive ? "text-white" : "text-gray-200"} ${era.textHover}`}>
                {era.title}
              </span>
              <span className="relative z-10 text-[9px] md:text-xs font-mono text-gray-400 mt-0.5 uppercase tracking-widest hidden md:block">
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
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-black/40 px-3 py-1 rounded border border-gray-800/60">
          ⚠️ Terminal Alert: Deep-data matrix syncing in progress. Era selection currently limited to visual override.
        </span>
      </div>
    </div>
  );
}