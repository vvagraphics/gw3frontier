"use client";

import React, { useState } from "react";

// Speculative GW3 Skill Interface
interface SkillNode {
  id: string;
  name: string;
  type: "strike" | "momentum" | "seeker-sync";
  description: string;
  kineticCost: number;
}

export default function BuildCrafterPage() {
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const MAX_SKILLS = 8; // Based on speculated controller-parity limitations

  const skillDatabase: SkillNode[] = [
    { id: "s1", name: "Kinetic Vault", type: "momentum", description: "Converts forward velocity into a vertical strike.", kineticCost: 15 },
    { id: "s2", name: "Vaelwarden's Grasp", type: "strike", description: "A tethering attack that pulls you toward the target.", kineticCost: 10 },
    { id: "s3", name: "Seeker Deployment", type: "seeker-sync", description: "Summons your Vael spirit for a frictionless mount transition.", kineticCost: 30 },
    { id: "s4", name: "Inertial Slide", type: "momentum", description: "Maintains sprint momentum while dodging projectiles.", kineticCost: 20 },
    { id: "s5", name: "Arah's Judgment", type: "strike", description: "Heavy frontal cleave. Damage scales with current movement speed.", kineticCost: 25 },
    { id: "s6", name: "Ley-Line Funnel", type: "seeker-sync", description: "Absorbs ambient Orr magic to reset momentum cooldowns.", kineticCost: 40 },
  ];

  const handleToggleSkill = (skillId: string) => {
    if (activeSkills.includes(skillId)) {
      setActiveSkills(activeSkills.filter(id => id !== skillId));
    } else if (activeSkills.length < MAX_SKILLS) {
      setActiveSkills([...activeSkills, skillId]);
    }
  };

  // Calculate current kinetic load
  const currentLoad = activeSkills.reduce((acc, id) => {
    const skill = skillDatabase.find(s => s.id === id);
    return acc + (skill?.kineticCost || 0);
  }, 0);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <section className="border-b border-gray-800 pb-6">
        <div className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-mesmer-neon/10 text-mesmer-neon border border-mesmer-neon/30 mb-4">
          Vaelwarden // Combat Matrix
        </div>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
          KINETIC COMBAT <span className="text-guardian-light">CRAFTER</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl font-mono mt-2">
          Configure your 8-slot action deck. Optimize momentum transfer ratios and Seeker-sync combinations for the Orrian frontier.
        </p>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Skill Deck Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="panel-slf p-4 rounded-xl flex justify-between items-center anime-glitch-hover">
            <div>
              <p className="text-[10px] text-gray-500 font-mono uppercase">Deck Capacity</p>
              <h2 className="text-lg font-bold text-white">Active Slots</h2>
            </div>
            <div className="text-3xl font-black text-mesmer-neon tracking-tighter">
              {activeSkills.length} <span className="text-sm text-gray-500">/ {MAX_SKILLS}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {skillDatabase.map((skill) => {
              const isActive = activeSkills.includes(skill.id);
              const typeColor = 
                skill.type === "momentum" ? "text-guardian-light border-guardian-light/30 bg-guardian-light/10" :
                skill.type === "seeker-sync" ? "text-jade-tech border-jade-tech/30 bg-jade-tech/10" :
                "text-white border-gray-600 bg-gray-800/50";

              return (
                <div
                  key={skill.id}
                  onClick={() => handleToggleSkill(skill.id)}
                  className={`p-5 rounded-xl transition-all cursor-pointer select-none group anime-glitch-hover ${
                    isActive ? "panel-slf border-mesmer-neon shadow-[0_0_15px_rgba(217,70,239,0.15)]" : "bg-black/40 border border-gray-800 hover:border-gray-600"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-sm uppercase tracking-wide ${isActive ? "text-mesmer-neon" : "text-gray-300"}`}>
                      {skill.name}
                    </h3>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${typeColor}`}>
                      {skill.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono leading-relaxed">{skill.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[10px] text-gray-600 font-mono">COST: {skill.kineticCost} Kv</span>
                    <span className={`w-3 h-3 rounded-sm border ${isActive ? "bg-mesmer-neon border-mesmer-neon" : "border-gray-600"}`}></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Telemetry Output */}
        <div className="panel-slf p-6 rounded-xl space-y-6 h-fit lg:sticky lg:top-24 anime-glitch-hover">
          <div className="border-b border-gray-800 pb-3">
            <h2 className="text-lg font-black text-white italic tracking-wide uppercase">Velocity Telemetry</h2>
            <p className="text-[10px] text-gray-500 font-mono">Projected physics engine scaling</p>
          </div>

          <div className="space-y-4 font-mono">
            {/* Stat 1 */}
            <div className="p-3 bg-black/60 border border-gray-800 rounded space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">KINETIC LOAD</span>
                <span className="text-guardian-light font-bold">{currentLoad} Kv</span>
              </div>
              <div className="w-full bg-gray-900 h-1.5 rounded-none overflow-hidden">
                <div 
                  className="bg-guardian-light h-full transition-all duration-500" 
                  style={{ width: `${Math.min((currentLoad / 150) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-3 bg-black/60 border border-gray-800 rounded space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">SEEKER SYNC RATIO</span>
                <span className="text-jade-tech font-bold">
                  {Math.round((activeSkills.filter(id => skillDatabase.find(s => s.id === id)?.type === "seeker-sync").length / MAX_SKILLS) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-900 h-1.5 rounded-none overflow-hidden">
                <div 
                  className="bg-jade-tech h-full transition-all duration-500" 
                  style={{ width: `${(activeSkills.filter(id => skillDatabase.find(s => s.id === id)?.type === "seeker-sync").length / MAX_SKILLS) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-black/80 rounded border border-gray-900 text-[10px] text-gray-500 leading-normal font-mono">
            <strong>System Engine Note:</strong> Action combat in GW3 requires precise hitbox awareness and physical travel times[cite: 43]. Standing static to execute rotations will be mathematically penalized[cite: 44].
          </div>
        </div>
      </div>
    </div>
  );
}