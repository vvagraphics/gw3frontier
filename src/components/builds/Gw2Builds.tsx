"use client";

import React, { useState } from "react";

const GW2_META_BUILDS = [
  {
    id: "power-alac-mech",
    name: "Power Alacrity Mechanist",
    role: "Offensive Support",
    description: "Provides permanent Alacrity and massive power damage using the Jade Mech. Extremely beginner-friendly with a low-intensity rotation.",
    chatCode: "[&DQMGNQM+RiqbAAAAcQAAAFsAAADzAAAAJxIAAAAAAAAAAAAAAAAAAAAAAAA=]",
  },
  {
    id: "condi-quick-firebrand",
    name: "Condi Quickness Firebrand",
    role: "Offensive Support",
    description: "The staple Guardian build. Pumps out permanent Quickness, Aegis, and immense burning damage through Tomes.",
    chatCode: "[&DQYfNRz2Pjp+AAAAcQAAANwAAABvAAAA8gAAAAAAAAAAAAAAAAAAAAAAAAA=]",
  },
  {
    id: "heal-scourge",
    name: "Heal Scourge",
    role: "Hard Carry Healer",
    description: "The ultimate progression carry. Uses massive barriers and instant teleport-revives to keep groups alive through devastating mistakes.",
    chatCode: "[&DQg1KTE+PDp+AAAAWgAAAHAAAABPAAAAkgAAAAAAAAAAAAAAAAAAAAAAAAA=]",
  },
];

export default function Gw2Builds() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-widest text-[#e51b24]">Guild Wars 2 Meta</h2>
        <p className="text-white/60 mt-2 font-mono text-sm">
          // INSTRUCTIONS: Copy the chat code. Paste it into your in-game chat box, hit enter, then right-click the link to inspect or save the build.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {GW2_META_BUILDS.map((build) => (
          <div key={build.id} className="bg-black/40 border border-white/10 rounded-lg p-6 hover:border-[#e51b24]/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{build.name}</h3>
                <span className="text-xs font-mono text-[#e51b24] uppercase">{build.role}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
              {build.description}
            </p>

            <div className="flex items-center gap-2 bg-black/60 p-2 rounded border border-white/5">
              <code className="text-xs text-gray-300 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {build.chatCode}
              </code>
              <button
                onClick={() => handleCopy(build.chatCode, build.id)}
                className="px-3 py-1 bg-white/10 hover:bg-[#e51b24] hover:text-white text-white text-xs font-mono rounded transition-colors"
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