"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useBuildStorage, SavedBuild } from "@/hooks/useBuildStorage";

// ==========================================
// Speculative AAA Action-Combat Data Models
// ==========================================

const ARCHETYPES = [
  { 
    id: "vanguard", 
    name: "Ironclad Vanguard", 
    color: "text-guardian-light", 
    border: "border-guardian-light/30",
    bg: "bg-guardian-light/10",
    desc: "Heavy plate-armored combatants focusing on high-commitment poise, crowd control, and front-line momentum preservation." 
  },
  { 
    id: "aetherweaver", 
    name: "Aetherweaver", 
    color: "text-mesmer-neon", 
    border: "border-mesmer-neon/30",
    bg: "bg-mesmer-neon/10",
    desc: "Tactical spellcasters shifting environmental ley-lines into explosive fluid fields and instantaneous spatial phase teleports." 
  },
  { 
    id: "wayfinder", 
    name: "Frontier Wayfinder", 
    color: "text-jade-tech", 
    border: "border-jade-tech/30",
    bg: "bg-jade-tech/10",
    desc: "Highly mobile marksmen utilizing specialized tracking arrays, traversal zip-tethers, and range-to-melee momentum transitions." 
  },
  { 
    id: "stalker", 
    name: "Umbral Stalker", 
    color: "text-purple-400", 
    border: "border-purple-400/30",
    bg: "bg-purple-400/10",
    desc: "Hooded high-APM executioners who scale attack speeds via rapid lateral dodging and shadow-slip strike patterns." 
  }
];

const KINETIC_STANCES = [
  { id: "posture_vanguard", name: "Vanguard Posture", desc: "Builds momentum upon parrying and blocking attacks. Grants hyper-armor." },
  { id: "stance_seeker", name: "Seeker Stance", desc: "Builds momentum dynamically through continuous movement, sprints, and aerial wall-runs." }
];

// Collected Active Skills (Mapped to Q, E, R, F hotkeys)
const ACTIVE_SKILLS = [
  { id: "act_1", name: "Kinetic Vault", desc: "Launches forward into the air, converting velocity into a heavy downward strike.", type: "Strike", cost: 15 },
  { id: "act_2", name: "Vaelwarden's Grasp", desc: "Fires a grappling hook line that pulls you instantly toward targets or surfaces.", type: "Mobility", cost: 10 },
  { id: "act_3", name: "Arah's Judgment", desc: "A massive horizontal blade wave. Structural damage scales directly with your movement speed.", type: "Strike", cost: 25 },
  { id: "act_4", name: "Inertial Slide", desc: "Slide along the ground while executing a continuous defensive weapon deflecting parry.", type: "Defense", cost: 20 },
  { id: "act_5", name: "Ley-Line Funnel", desc: "Absorbs local kinetic shockwaves to instantly reset all active mobility cooldowns.", type: "Utility", cost: 30 }
];

// Momentum Runes (Passives triggered by high-speed motion states)
const MOMENTUM_RUNES = [
  { id: "rn_1", name: "Inertial Clone", desc: "Executing a perfect dodge above 50% momentum leaves a shattering holographic decoy behind." },
  { id: "rn_2", name: "Kinetic Friction", desc: "Sprinting for more than 2 seconds ignites the ground, leaving a lethal trailing ring of fire." },
  { id: "rn_3", name: "Apex Acceleration", desc: "At 100% full momentum capacity, your next structural strike skill deals double raw damage." },
  { id: "rn_4", name: "Seeker Synchronizer", desc: "Reduces mount transition durations by half when activated while moving at maximum movement velocity." }
];

// ==========================================
// Embedded Vector Archetype SVG Library
// ==========================================

const ArchetypeIcon = ({ id, className = "w-5 h-5" }: { id: string; className?: string }) => {
  switch (id) {
    case "vanguard":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M8 10h8" />
        </svg>
      );
    case "aetherweaver":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10-10 10 10-10 10L2 12z" />
          <circle cx="12" cy="12" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      );
    case "wayfinder":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M12 3v18M3 12h18" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      );
    case "stalker":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s-5 4-5 9 5 11 5 11 5-6 5-11-5-9-5-9z" />
          <circle cx="12" cy="11" r="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11h10" />
        </svg>
      );
    default:
      return null;
  }
};

// ==========================================
// Operational Matrix Core Component
// ==========================================

function BuildCrafterContent() {
  const searchParams = useSearchParams();
  const { savedBuilds, saveBuild, deleteBuild } = useBuildStorage();

  // Active matrix configuration variables
  const [buildName, setBuildName] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState("vanguard");
  const [selectedStance, setSelectedStance] = useState("posture_vanguard");
  const [activeDeck, setActiveDeck] = useState<string[]>(Array(4).fill("")); 
  const [activeRunes, setActiveRunes] = useState<string[]>(Array(3).fill("")); 
  
  const [selectingSlot, setSelectingSlot] = useState<{ type: "deck" | "rune"; index: number } | null>(null);
  const [shareLink, setShareLink] = useState("");

  // Hydrate configurations from base64 URL query string parameter tokens
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      try {
        const decoded = JSON.parse(atob(code));
        if (decoded.a) setSelectedArchetype(decoded.a);
        if (decoded.st) setSelectedStance(decoded.st);
        if (decoded.d) setActiveDeck(decoded.d);
        if (decoded.r) setActiveRunes(decoded.r);
        setBuildName("DECRYPTED_TACTICAL_FRAMEWORK");
      } catch (e) {
        console.error("Signal corruption processing remote matrix transmission payload:", e);
      }
    }
  }, [searchParams]);

  const handleSelectModule = (itemId: string) => {
    if (!selectingSlot) return;
    if (selectingSlot.type === "deck") {
      const updated = [...activeDeck];
      updated[selectingSlot.index] = itemId;
      setActiveDeck(updated);
    } else {
      const updated = [...activeRunes];
      updated[selectingSlot.index] = itemId;
      setActiveRunes(updated);
    }
    setSelectingSlot(null);
  };

  const executeLocalCacheSave = () => {
    saveBuild({
      name: buildName || `TACTICAL_${selectedArchetype.toUpperCase()}_PATTERN`,
      profession: selectedArchetype,
      skills: [selectedStance, ...activeDeck], 
      traits: activeRunes.map(r => parseInt(r.replace(/\D/g, "")) || 0) 
    });
    alert("Tactical framework array localized safely inside browser cache matrices.");
  };

  const generateStatelessTokenURL = () => {
    const payload = { a: selectedArchetype, st: selectedStance, d: activeDeck, r: activeRunes };
    const compressed = btoa(JSON.stringify(payload));
    const fullUrl = `${window.location.origin}/build-crafter?code=${compressed}`;
    setShareLink(fullUrl);
    navigator.clipboard.writeText(fullUrl);
  };

  const loadLocalBuildIntoWorkspace = (build: SavedBuild) => {
    setBuildName(build.name);
    setSelectedArchetype(build.profession);
    // Dynamic structural extraction handling stance versus active modules indices mapping
    if (build.skills && build.skills.length > 0) {
      setSelectedStance(build.skills[0]);
      setActiveDeck([build.skills[1] || "", build.skills[2] || "", build.skills[3] || "", build.skills[4] || ""]);
    }
    if (build.traits) {
      setActiveRunes(build.traits.map(t => t ? `rn_${t}` : ""));
    }
  };

  const currentMeta = ARCHETYPES.find(p => p.id === selectedArchetype) || ARCHETYPES[0];

  // Run telemetry metric logic tracking current active configurations weight loads
  const currentKineticLoad = activeDeck.reduce((acc, id) => {
    const skill = ACTIVE_SKILLS.find(s => s.id === id);
    return acc + (skill?.cost || 0);
  }, 0);

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Title Dashboard Header Section */}
      <div className="border-b border-gray-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            KINETIC COMBAT // <span className={currentMeta.color}>MATRIX</span>
          </h1>
          <p className="text-sm text-gray-400 font-mono mt-1">
            Theorycraft high-APM movement loadouts based on real-time physics and structural tracking vectors.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={executeLocalCacheSave} className="px-4 py-2 text-xs font-mono font-bold uppercase bg-jade-tech/20 border border-jade-tech/40 text-jade-tech hover:bg-jade-tech hover:text-black transition-all rounded-sm shrink-0">
            Save Local Core
          </button>
          <button onClick={generateStatelessTokenURL} className={`px-4 py-2 text-xs font-mono font-bold uppercase bg-black border ${currentMeta.border} ${currentMeta.color} hover:bg-white hover:text-black transition-all rounded-sm shrink-0`}>
            Generate Link Code
          </button>
        </div>
      </div>

      {shareLink && (
        <div className="p-3 bg-black/60 rounded border border-mesmer-neon/30 text-xs font-mono text-mesmer-neon flex justify-between items-center break-all animate-pulse">
          <span>BROADCAST STREAM LINK READY: {shareLink}</span>
          <button onClick={() => alert("Copied core bridge link array.")} className="text-white ml-4 uppercase underline shrink-0">Copy</button>
        </div>
      )}

      {/* Primary Infrastructure Selection Hub Grid Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Core Configuration Blocks */}
        <div className="space-y-6 xl:col-span-3">
          <div className="panel-slf p-6 rounded-xl space-y-8">
            
            {/* Class Selection Dropdowns Array Layouts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Matrix Identification Label</label>
                <input 
                  type="text" 
                  value={buildName} 
                  onChange={(e) => setBuildName(e.target.value)}
                  placeholder="EX: SL_WAYFINDER_EVASIVE_PATTERN"
                  className="w-full bg-black/50 border border-gray-800 focus:border-white p-3 rounded text-sm text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Archetype Focus Grid</label>
                <div className="relative flex items-center">
                  <div className={`absolute left-3 ${currentMeta.color} shrink-0 pointer-events-none`}>
                    <ArchetypeIcon id={selectedArchetype} />
                  </div>
                  <select 
                    value={selectedArchetype}
                    onChange={(e) => setSelectedArchetype(e.target.value)}
                    className="w-full bg-black/50 border border-gray-800 p-3 pl-10 rounded text-sm text-white font-mono outline-none appearance-none cursor-pointer"
                  >
                    {ARCHETYPES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Base Kinetic Movement Stance</label>
                <select 
                  value={selectedStance}
                  onChange={(e) => setSelectedStance(e.target.value)}
                  className="w-full bg-black/50 border border-gray-800 p-3 rounded text-sm text-white font-mono outline-none cursor-pointer"
                >
                  {KINETIC_STANCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-mono italic bg-black/30 p-3 rounded border border-gray-900 leading-relaxed">
              <strong>Archetype Core Assessment:</strong> {currentMeta.desc}
            </p>

            {/* SPLIT MODULE ACTIONS INTERACTIVE PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Active Skill Modules (Q, E, R, F Action Deck) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase font-mono border-b border-gray-800 pb-2 flex items-center justify-between">
                  <span>Active Combat Payload</span>
                  <span className="text-[10px] text-gray-500 normal-case">4 Input Sockets</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {activeDeck.map((skillId, idx) => {
                    const skill = ACTIVE_SKILLS.find(s => s.id === skillId);
                    const isTargeted = selectingSlot?.type === "deck" && selectingSlot.index === idx;
                    const hotkeys = ["Q", "E", "R", "F"];

                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectingSlot({ type: "deck", index: idx })}
                        className={`h-24 border rounded-lg cursor-pointer flex flex-col p-3 justify-between transition-all relative group select-none ${
                          isTargeted 
                            ? "border-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.1)]" 
                            : skill ? `${currentMeta.border} bg-black/60 hover:border-white/40` : "border-gray-800 bg-black/30 hover:border-gray-600"
                        }`}
                      >
                        <span className="absolute top-2 right-2 text-[10px] font-black text-gray-700 tracking-widest font-mono group-hover:text-white/40 transition-colors">{hotkeys[idx]}</span>
                        {skill ? (
                          <>
                            <div className="pr-6">
                              <h4 className="text-xs font-bold text-white leading-tight uppercase tracking-wider truncate">{skill.name}</h4>
                              <p className="text-[9px] text-gray-500 font-mono uppercase mt-0.5">{skill.type}</p>
                            </div>
                            <span className="text-[9px] font-mono text-gray-500">LOAD: {skill.cost} Kv</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-600 font-mono my-auto w-full text-center uppercase tracking-widest">Empty Socket</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Momentum Passive Trigger System Modules */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase font-mono border-b border-gray-800 pb-2 flex items-center justify-between">
                  <span>Motion-Triggered Runes</span>
                  <span className="text-[10px] text-gray-500 normal-case">3 Passive Overlays</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {activeRunes.map((runeId, idx) => {
                    const rune = MOMENTUM_RUNES.find(r => r.id === runeId);
                    const isTargeted = selectingSlot?.type === "rune" && selectingSlot.index === idx;

                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectingSlot({ type: "rune", index: idx })}
                        className={`p-3 border rounded-lg cursor-pointer flex items-center gap-4 transition-all relative group select-none ${
                          isTargeted 
                            ? "border-white bg-white/10" 
                            : rune ? "border-gray-700 bg-black/60 hover:border-gray-500" : "border-gray-800 bg-black/30 hover:border-gray-600"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-md border text-[10px] font-mono flex items-center justify-center shrink-0 transition-colors ${
                          rune ? "border-gray-600 text-gray-400 bg-black" : "border-gray-800 text-gray-600"
                        }`}>
                          M{idx + 1}
                        </div>
                        {rune ? (
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">{rune.name}</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5 line-clamp-1 leading-normal">{rune.desc}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600 font-mono uppercase tracking-wider">Unassigned Passive Trigger</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selection Deployment Window System Layout Modal */}
            {selectingSlot && (
              <div className="p-4 bg-black border border-gray-800 rounded-lg space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2 shrink-0">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Selecting Component Allocation Matrix for Position #{selectingSlot.index + 1}
                  </h4>
                  <button onClick={() => setSelectingSlot(null)} className="text-xs text-gray-500 hover:text-white uppercase font-mono shrink-0">Cancel</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {(selectingSlot.type === "deck" ? ACTIVE_SKILLS : MOMENTUM_RUNES).map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectModule(item.id)}
                      className="p-3 bg-gray-900/40 rounded border border-gray-800 hover:border-white transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <h5 className="text-xs font-bold text-white uppercase tracking-wide">{item.name}</h5>
                      <p className="text-[11px] text-gray-400 mt-1 font-mono leading-relaxed line-clamp-2">{item.desc}</p>
                      {"cost" in item && (
                        <span className="text-[9px] font-mono text-gray-500 mt-2">CAPACITY LOAD: {item.cost} Kv</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Console Navigation Cache Manager Section */}
        <div className="space-y-4 xl:col-span-1 h-105 lg:h-full flex flex-col min-h-0">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase font-mono shrink-0">
            Localized Vectors Array ({savedBuilds.length})
          </h2>

          <div className="panel-slf p-4 rounded-xl flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-3 relative">
            {savedBuilds.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-gray-500 font-mono text-xs">
                No telemetry profiles detected in localized device matrix logs.
              </div>
            ) : (
              savedBuilds.map((build) => (
                <div 
                  key={build.id} 
                  className="p-3 bg-black/50 border border-gray-800 rounded flex flex-col justify-between hover:border-gray-600 transition-all gap-3 group"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white font-mono truncate group-hover:text-mesmer-neon transition-colors">
                      {build.name}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5 uppercase tracking-wider">
                      Archetype Paradigm: {build.profession}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0 pt-1.5 border-t border-gray-900/60">
                    <button 
                      onClick={() => loadLocalBuildIntoWorkspace(build)}
                      className="flex-1 py-1 text-[9px] font-mono uppercase bg-gray-800 text-gray-300 hover:bg-white hover:text-black transition-all rounded-sm shrink-0"
                    >
                      Mount
                    </button>
                    <button 
                      onClick={() => deleteBuild(build.id)}
                      className="px-2 py-1 text-[9px] font-mono uppercase bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-600 hover:text-white transition-all rounded-sm shrink-0"
                    >
                      Wipe
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuildCrafterPage() {
  return (
    <Suspense fallback={<div className="text-center font-mono text-sm text-gray-500 animate-pulse py-12">Synchronizing tactical telemetry systems...</div>}>
      <BuildCrafterContent />
    </Suspense>
  );
}