"use client";

import React, { useState } from "react";

const GW1_META_BUILDS = [
  {
    id: "dagger-spam",
    name: "Dagger Spam Assassin",
    role: "General PvE / DPS",
    description: "The absolute king of GW1 melee DPS. Relies on Jagged Strike, Fox Fangs, and Death Blossom for infinite attack chains.",
    templateCode: "OwFj0xfzITKzJw2kmD2kXT1A",
  },
  {
    id: "55hp-monk",
    name: "55 HP Monk",
    role: "Solo Farming",
    description: "A legendary farming build that reduces max health to 55 and uses Protective Spirit to limit incoming damage to 5, which is then out-healed.",
    templateCode: "OwUTM228VSce2kkH/E+go1mDAA",
  },
  {
    id: "imbagon",
    name: "The Imbagon (Paragon)",
    role: "Hard Mode Support",
    description: "An unkillable support Paragon build that spams 'Save Yourselves!' to keep the entire party alive through the hardest content.",
    templateCode: "OQGjUpqMphXTqG1TZG0Thn4A",
  },
];

export default function Gw1Builds() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-widest text-[#d4af37]">GW: Reforged Meta</h2>
        <p className="text-white/60 mt-2 font-mono text-sm">
          // INSTRUCTIONS: Copy the template code below. In-game, open your Skills panel (K), click Templates, and select "Load from Template Code".
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {GW1_META_BUILDS.map((build) => (
          <div key={build.id} className="bg-black/40 border border-white/10 rounded-lg p-6 hover:border-[#d4af37]/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{build.name}</h3>
                <span className="text-xs font-mono text-[#d4af37] uppercase">{build.role}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
              {build.description}
            </p>

            <div className="flex items-center gap-2 bg-black/60 p-2 rounded border border-white/5">
              <code className="text-xs text-gray-300 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {build.templateCode}
              </code>
              <button
                onClick={() => handleCopy(build.templateCode, build.id)}
                className="px-3 py-1 bg-white/10 hover:bg-[#d4af37] hover:text-black text-white text-xs font-mono rounded transition-colors"
              >
                {copiedId === build.id ? "COPIED!" : "COPY"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}