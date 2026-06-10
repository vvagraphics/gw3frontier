"use client";

import React, { useState, useRef, MouseEvent, WheelEvent } from "react";

interface MapMarker {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "resource-node" | "skill-cache" | "divine-chamber" | "ley-line";
  description: string;
  drops?: string[];
  wikiSlug?: string;
}

export default function TacticalMapPage() {
  // Layer state controls what markers and maps are visible
  const [activeLayer, setActiveLayer] = useState<string>("all-systems");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapRef = useRef<HTMLDivElement>(null);

  const mapMarkers: MapMarker[] = [
    { id: "m1", label: "Temple of the Deposed", x: 45, y: 30, type: "divine-chamber", description: "A colossal ruined chamber. High-density kinetic energy detected.", drops: ["Fragment of the Unnamed", "Ascended Kinetic Core"], wikiSlug: "/wiki/temple-of-the-deposed" },
    { id: "m2", label: "Ancient Orrian Ironwood", x: 62, y: 55, type: "resource-node", description: "Pristine gathering node for early-game crafting materials.", drops: ["Ironwood Log", "Resin of Antiquity"], wikiSlug: "/wiki/orrian-ironwood" },
    { id: "m3", label: "Seeker Sync Cache", x: 28, y: 68, type: "skill-cache", description: "A forgotten Vaelwarden altar. Grants new momentum skill.", drops: ["Skill: Vaelwarden's Grasp"], wikiSlug: "/wiki/skill-vaelwardens-grasp" },
    { id: "m4", label: "Unstable Ley-Anomaly", x: 75, y: 20, type: "ley-line", description: "Massive localized magic storm. Dangerous environmental hazard.", wikiSlug: "/wiki/ley-anomalies" },
  ];

  // --- FILTERING LOGIC ---
  const visibleMarkers = mapMarkers.filter(marker => {
    if (activeLayer === "all-systems") return true;
    if (activeLayer === "resources" && marker.type === "resource-node") return true;
    if (activeLayer === "divine-entities" && marker.type === "divine-chamber") return true;
    if (activeLayer === "tactical" && (marker.type === "skill-cache" || marker.type === "ley-line")) return true;
    return false;
  });

  // --- DYNAMIC BACKGROUND MAP LOGIC ---
  const getMapImage = () => {
    // If you ever make a specific "resource" map image, you would add it here:
    // if (activeLayer === "resources") return "url('/images/Orr_Resource_Heatmap.jpeg')";
    return "url('/images/Fantasy_map_of_Orr_region.jpeg')"; // Your base map
  };

  // --- INTERACTION HANDLERS ---
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Mouse Wheel Scrolling for Zoom
  const handleWheel = (e: WheelEvent) => {
    // Prevent zooming out too far or in too close
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(prev + 0.2, 4)); // Zoom in
    } else {
      setZoom(prev => Math.max(prev - 0.2, 1)); // Zoom out
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
  const resetMap = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <section className="border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-jade-tech/10 text-jade-tech border border-jade-tech/30 mb-4 anime-glitch-hover">
            System Map // Interactive Canvas
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            TACTICAL <span className="text-guardian-light">INTERFACE</span>
          </h1>
        </div>

        {/* Map Layer Controls */}
        <div className="flex bg-black/40 p-1 rounded-sm border border-gray-800 font-mono text-xs">
          {["all-systems", "tactical", "resources", "divine-entities"].map((layer) => (
            <button
              key={layer}
              onClick={() => {
                setActiveLayer(layer);
                setSelectedMarker(null); // Clear selection when swapping layers
              }}
              className={`px-3 py-1.5 uppercase font-bold tracking-wider transition-all ${
                activeLayer === layer ? "bg-guardian-light text-black shadow-[0_0_10px_rgba(56,189,248,0.5)]" : "text-gray-400 hover:text-white"
              }`}
            >
              {layer.replace("-", " ")}
            </button>
          ))}
        </div>
      </section>

      {/* Map Workspace */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Viewport Wrapper */}
        <div className="lg:col-span-3 panel-slf rounded-xl relative overflow-hidden flex flex-col shadow-inner min-h-125">
          
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button onClick={handleZoomIn} className="w-8 h-8 panel-slf text-white flex items-center justify-center font-bold hover:text-mesmer-neon hover:border-mesmer-neon transition-colors">+</button>
            <button onClick={handleZoomOut} className="w-8 h-8 panel-slf text-white flex items-center justify-center font-bold hover:text-mesmer-neon hover:border-mesmer-neon transition-colors">-</button>
            <button onClick={resetMap} className="w-8 h-8 panel-slf text-gray-400 flex items-center justify-center text-xs hover:text-white transition-colors">RST</button>
          </div>

          {/* Draggable & Scrollable Canvas */}
          <div 
            ref={mapRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`absolute inset-0 w-full h-full transform-origin-center transition-transform duration-75 ease-linear ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
          >
            {/* Dynamic Map Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-screen transition-all duration-500 pointer-events-none"
              style={{ backgroundImage: getMapImage() }} 
            />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none opacity-40" />

            {/* Render Filtered Map Markers */}
            {visibleMarkers.map((marker) => {
              const color = 
                marker.type === "divine-chamber" ? "bg-dragon-fire" :
                marker.type === "skill-cache" ? "bg-mesmer-neon" :
                marker.type === "resource-node" ? "bg-jade-tech" : "bg-guardian-light";

              return (
                <button
                  key={marker.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedMarker(marker); }}
                  className="absolute group/node -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none z-10"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <span className={`absolute inset-0 rounded-full ${color} opacity-40 animate-ping duration-1000`} />
                  <div className={`w-3.5 h-3.5 rounded-sm rotate-45 border-2 border-black shadow-[0_0_12px] shadow-current text-current ${color.replace('bg-', 'text-')}`} />
                  
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 panel-slf text-white text-[10px] font-mono p-1.5 rounded-sm whitespace-nowrap opacity-0 pointer-events-none group-hover/node:opacity-100 transition-opacity z-20">
                    {marker.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-gray-500 panel-slf px-2 py-1 pointer-events-none z-20">
            ZOOM_LVL // <span className="text-mesmer-neon">{zoom.toFixed(1)}x</span><br/>
            COORD // X:{Math.round(pan.x)} Y:{Math.round(pan.y)}
          </div>
        </div>

        {/* Sidebar Intel */}
        <div className="panel-slf p-6 rounded-xl flex flex-col gap-6 anime-glitch-hover h-fit">
          <div className="border-b border-gray-800 pb-3">
            <h2 className="text-base font-black text-white tracking-wide uppercase">Target Intel</h2>
            <p className="text-[10px] text-gray-500 font-mono">Cross-referencing global database</p>
          </div>

          {selectedMarker ? (
            <div className="space-y-4 font-mono text-xs animate-fadeIn grow">
              <div>
                <span className="text-gray-500 block text-[10px] mb-1">OBJECTIVE CLASS</span>
                <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold
                  ${selectedMarker.type === "divine-chamber" ? "bg-dragon-fire/20 text-dragon-fire border-dragon-fire/50" :
                    selectedMarker.type === "skill-cache" ? "bg-mesmer-neon/20 text-mesmer-neon border-mesmer-neon/50" :
                    selectedMarker.type === "resource-node" ? "bg-jade-tech/20 text-jade-tech border-jade-tech/50" : 
                    "bg-guardian-light/20 text-guardian-light border-guardian-light/50"}`
                }>
                  {selectedMarker.type.replace("-", " ")}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] mb-1">IDENTIFIER</span>
                <span className="text-white font-bold text-sm">{selectedMarker.label}</span>
              </div>
              <div className="bg-black/50 p-2 border border-gray-800 rounded-sm text-gray-400 leading-relaxed">
                {selectedMarker.description}
              </div>
              {selectedMarker.drops && (
                <div className="pt-2">
                  <span className="text-gray-500 block text-[10px] mb-2">PROJECTED LOOT TABLE</span>
                  <ul className="space-y-1.5">
                    {selectedMarker.drops.map((drop, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] text-gray-300">
                        <div className="w-1 h-1 bg-guardian-light rounded-full"></div>
                        {drop}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="w-full mt-4 py-2 border border-mesmer-neon/50 bg-mesmer-neon/10 text-mesmer-neon hover:bg-mesmer-neon hover:text-black font-bold uppercase tracking-widest transition-all">
                Access Lore DB ↗
              </button>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-gray-800 rounded text-center text-[10px] text-gray-500 italic font-mono grow flex items-center justify-center">
              Awaiting waypoint initialization input via tactical view grid.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}