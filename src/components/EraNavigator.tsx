"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEra } from "@/context/EraContext";

const ERAS = [
  { id: "gw1", title: "GW: REFORGED", subtitle: "THE AGE OF ASCALON", logo: "/images/gw_reforge.avif" },
  { id: "gw2", title: "GUILD WARS 2", subtitle: "THE ELDER DRAGONS", logo: "/images/guild_wars_2.avif" },
  { id: "gw3", title: "GUILD WARS 3", subtitle: "THE FRONTIER", logo: "/images/guild_wars_3.avif" },
];

export default function EraNavigator() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mounted, setMounted] = useState(false);
  const eraContext = useEra();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const { activeEra, changeEra } = eraContext;

  // SLIM BAR (Used on Build pages and others)
  if (!isHome) {
    return (
      <div className="w-full bg-black/80 border-b border-white/10 p-3 flex justify-center items-center gap-8">
        {ERAS.map((era) => (
          <button
            key={era.id}
            onClick={() => changeEra(era.id)}
            className={`text-xs font-mono uppercase tracking-widest transition-colors ${
              activeEra === era.id ? "text-[#00ffcc] font-bold" : "text-white/40 hover:text-white"
            }`}
          >
            {era.title}
          </button>
        ))}
      </div>
    );
  }

  // BIG CARD UI (Restored from your "before_2.png" look)
  return (
    <div className="w-full flex flex-col items-center gap-6 my-8">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 w-full max-w-6xl px-4">
        {ERAS.map((era) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => changeEra(era.id)}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-500 w-full md:w-1/3
                ${isActive 
                  ? "bg-gradient-to-b from-[#3a200a]/80 to-black border-[#d4af37] opacity-100 shadow-[0_0_20px_rgba(212,175,55,0.3)] transform scale-105" 
                  : "bg-black/60 border-white/5 opacity-40 hover:opacity-80 hover:border-white/20"
                }
              `}
            >
              <div className="h-16 w-48 relative mb-4">
                <Image src={era.logo} alt={era.title} fill className="object-contain" />
              </div>
              <h2 className="text-lg font-bold italic tracking-wider text-white">{era.title}</h2>
              <p className="text-xs font-mono tracking-[0.2em] text-gray-400 mt-1 uppercase">{era.subtitle}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-6 py-2 border border-[#d4af37]/50 rounded text-xs font-mono text-[#d4af37] bg-[#d4af37]/10">
        <span>⚠️ PRESET APPLIED. // NOTICE: DATA FOR EACH ERA IS PENDING DEPLOYMENT.</span>
      </div>
    </div>
  );
}