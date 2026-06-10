// src/app/(public)/podcast/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

// Types based on your Angular model
interface TranscriptWord {
  text: string;
  start: number;
  duration?: number;
  end?: number; // Depending on if your JSON uses duration or end
}

export default function PodcastPage() {
  const [currentTime, setCurrentTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptWord[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  // 1. Fetch the live JSON transcript on mount
  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await fetch("/api/transcript");
        const data = await response.json();
        
        // Extract words from segments (matching your Angular data structure)
        if (data && data.segments) {
          const allWords = data.segments.flatMap((segment: any) => segment.words);
          setTranscript(allWords);
        }
      } catch (error) {
        console.error("Failed to load transcript:", error);
      }
    };

    fetchTranscript();
  }, []);

  // 2. Sync audio time and find the active word
  const handleTimeUpdate = () => {
    if (audioRef.current && transcript.length > 0) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      // Find which word is currently being spoken
      const currentIndex = transcript.findIndex(word => {
        const wordEnd = word.end || (word.start + (word.duration || 0));
        return time >= word.start && time <= wordEnd;
      });

      if (currentIndex !== -1 && currentIndex !== activeIndex) {
        setActiveIndex(currentIndex);
      }
    }
  };

  // 3. Auto-scroll to the active word (Replaces the complex math from Angular)
  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  // Click text to jump audio
  const handleTextClick = (startTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section - Tailwind Fixes Applied */}
      <div className="border-b border-guardian-light/30 pb-4">
        <h1 className="text-4xl font-bold text-white tracking-wider">
          GW3 FRONTIER <span className="text-mesmer-neon">EP. 01</span>
        </h1>
        <p className="text-gray-400 mt-2">Guild Wars 3 Resets the Tyrian Timeline</p>
      </div>

      {/* Audio Player Container */}
      <div className="panel-slf p-6 rounded-lg flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-guardian-light uppercase tracking-widest">
            Audio Stream Active
          </span>
        </div>
        
        {/* Live Audio Source */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          controls
          className="w-full h-12 rounded bg-black/50 custom-scrollbar"
          src="http://mr3anderson.pro/podcast/gw3frontier/Guild_Wars_3_Resets_the_Tyrian_Timeline.m4a" 
        >
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Transcript Container - Tailwind Fixes Applied */}
      <div className="panel-slf p-6 rounded-lg h-125 overflow-y-auto custom-scrollbar relative">
        <h2 className="text-sm font-semibold text-gray-500 mb-6 uppercase tracking-widest border-b border-gray-800 pb-2 sticky top-0 bg-panelDark/90 backdrop-blur-sm z-10">
          Decrypted Transcript
        </h2>
        
        <div className="text-lg leading-relaxed text-gray-400">
          {transcript.length === 0 ? (
            <p className="animate-pulse">Decrypting audio logs...</p>
          ) : (
            transcript.map((word, index) => {
              const isActive = index === activeIndex;

              return (
                <span
                  key={index}
                  ref={isActive ? activeWordRef : null}
                  onClick={() => handleTextClick(word.start)}
                  className={`transition-all duration-200 cursor-pointer inline-block mr-1 rounded px-1 ${
                    isActive 
                      ? "text-mesmer-neon font-bold bg-mesmer-neon/10 scale-110 shadow-[0_0_10px_rgba(217,70,239,0.2)]" 
                      : "hover:text-gray-200"
                  }`}
                >
                  {word.text}
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}