"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface TranscriptWord { text: string; start: number; end?: number; duration?: number; }

export default function PodcastMiniPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptWord[]>([]);

  useEffect(() => {
    fetch("/api/transcript")
      .then((res) => res.json())
      .then((data) => setTranscript(data.segments.flatMap((s: any) => s.words)))
      .catch(console.error);
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const activeIndex = transcript.findIndex((w) => {
    const end = w.end || (w.start + (w.duration || 0.5));
    return currentTime >= w.start && currentTime <= end;
  });

  useEffect(() => {
    if (activeIndex !== -1 && scrollRef.current) {
      const activeEl = scrollRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        // "center" keeps the text epic and focused in the middle of the frame
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeIndex]);

  return (
    <div className="panel-slf p-6 rounded-xl space-y-6 anime-glitch-hover">
      
      {/* EPIC TRANSCRIPT SECTION (NOW ON TOP) */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-mesmer-neon uppercase tracking-widest">Live Decryption</span>
        <div
          ref={scrollRef}
          className="h-40 overflow-y-hidden bg-black/60 p-4 rounded-md border border-mesmer-neon/20 shadow-inner"
          style={{ contain: 'content' }}
        >
          {transcript.map((w, i) => (
            <span
              key={i}
              className={`mr-2 text-2xl font-serif ptransition-all duration-300 ${
                i === activeIndex 
                  ? "text-white font-bold scale-110 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]" 
                  : "text-gray-600"
              }`}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>

      {/* PLAYER SECTION */}
      <div className="flex flex-col gap-3">
        <h4 className="text-white font-bold text-md">GW3 Resets the Tyrian Timeline</h4>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-10 rounded bg-black/40"
          src="http://mr3anderson.pro/podcast/gw3frontier/Guild_Wars_3_Resets_the_Tyrian_Timeline.m4a"
          controls
        />
        <Link 
          href="/podcast" 
          className="text-center text-[10px] uppercase text-guardian-light hover:text-white transition-colors"
        >
          Full Interactive Mode ↗
        </Link>
      </div>
    </div>
  );
}