"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import StatusAnimation from "@/components/StatusAnimation"; // <-- Make sure this path is correct!

type EraContextType = {
  activeEra: string;
  isTransitioning: boolean;
  changeEra: (eraId: string) => void;
};

const EraContext = createContext<EraContextType | undefined>(undefined);

export function EraProvider({ children }: { children: React.ReactNode }) {
  const [activeEra, setActiveEra] = useState("gw3");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    const savedEra = localStorage.getItem("gw-active-era") || "gw3";
    setActiveEra(savedEra);
    document.documentElement.setAttribute("data-era", savedEra);
  }, []);

  const changeEra = (eraId: string) => {
    if (eraId === activeEra) return;

    setIsTransitioning(true);
    
    if (eraId === "gw1") setLoadingText("Traveling to Old Tyria...");
    if (eraId === "gw2") setLoadingText("Awakening the Elder Dragons...");
    if (eraId === "gw3") setLoadingText("Connecting to the Frontier...");

    // Halved the loading time to 750ms for a snappier feel
    setTimeout(() => {
      setActiveEra(eraId);
      localStorage.setItem("gw-active-era", eraId);
      document.documentElement.setAttribute("data-era", eraId);
      setIsTransitioning(false);
    }, 750);
  };

  return (
    <EraContext.Provider value={{ activeEra, isTransitioning, changeEra }}>
      {children}
      
      {/* GLOBAL TELEPORT OVERLAY */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center animate-fadeIn">
          {/* Replaced CSS spinner with your custom animation */}
          <div className="mb-6">
            <StatusAnimation />
          </div>
          <h2 className="text-2xl font-mono text-white tracking-widest uppercase animate-pulse">
            {loadingText}
          </h2>
        </div>
      )}
    </EraContext.Provider>
  );
}

export const useEra = () => {
  const context = useContext(EraContext);
  if (!context) throw new Error("useEra must be used within EraProvider");
  return context;
};