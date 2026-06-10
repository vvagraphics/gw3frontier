"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface TranscriptWord { text: string; start: number; end?: number; duration?: number; }

export default function PodcastMiniPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptWord[]>([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    fetch("/api/transcript")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.segments) {
          setTranscript(data.segments.flatMap((s: any) => s.words));
        }
      })
      .catch((err) => console.error("Failed to load transcript:", err));
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) audioRef.current.play();
      else audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const seekFromBar = (e: React.MouseEvent<HTMLDivElement>) => {
    const rail = e.currentTarget;
    const rect = rail.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const seekToWord = (startTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
      setIsUserScrolling(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeIndex = transcript.findIndex((w) => {
    const end = w.end || (w.start + (w.duration || 0.5));
    return currentTime >= w.start && currentTime <= end;
  });

  const handleUserScroll = () => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 4000);
  };

  useEffect(() => {
    if (!isUserScrolling && activeIndex !== -1 && scrollRef.current) {
      const activeEl = scrollRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeIndex, isUserScrolling]);

  return (
    <div className="panel-slf p-6 rounded-xl flex flex-col h-105 lg:h-full justify-between anime-glitch-hover gap-4">
      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <span className="text-[10px] font-bold text-mesmer-neon uppercase tracking-widest block">
          Live Decryption
        </span>

        <div className="flex-1 min-h-0 bg-black/60 rounded-md border border-mesmer-neon/20 shadow-inner relative overflow-hidden">
          <div
            ref={scrollRef}
            onWheel={handleUserScroll}
            onTouchMove={handleUserScroll}
            className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 text-center leading-loose flex flex-wrap justify-center content-start gap-x-2 gap-y-1"
            style={{ contain: 'content' }}
          >
            {transcript.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500 animate-pulse font-mono text-sm">
                Intercepting audio log array...
              </div>
            ) : (
              transcript.map((w, i) => (
                <span
                  key={i}
                  onClick={() => seekToWord(w.start)}
                  className={`cursor-pointer text-xl lg:text-2xl font-serif transition-all duration-300 inline-block h-fit ${
                    i === activeIndex 
                      ? "text-white font-bold scale-110 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]" 
                      : "text-gray-600 hover:text-gray-300"
                  }`}
                >
                  {w.text}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-gray-900 shrink-0">
        <h4 className="text-white font-bold text-sm truncate">GW3 Resets the Tyrian Timeline</h4>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay} 
            className="w-10 h-10 rounded-full border border-mesmer-neon text-mesmer-neon flex items-center justify-center hover:bg-mesmer-neon hover:text-black transition-all shadow-[0_0_10px_rgba(217,70,239,0.15)] hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] shrink-0"
            aria-label={isPlaying ? "Pause Stream" : "Play Stream"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <div className="text-xs font-mono text-gray-400 w-10 text-right shrink-0">
            {formatTime(currentTime)}
          </div>
          
          <div 
            className="flex-1 h-1.5 bg-gray-800/60 rounded-full cursor-pointer relative group" 
            onClick={seekFromBar}
          >
            <div 
              className="absolute h-full bg-mesmer-neon rounded-full group-hover:shadow-[0_0_8px_rgba(217,70,239,0.8)] transition-all" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} 
            />
          </div>
          
          <div className="text-xs font-mono text-gray-500 w-10 shrink-0">
            {formatTime(duration)}
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src="http://mr3anderson.pro/podcast/gw3frontier/Guild_Wars_3_Resets_the_Tyrian_Timeline.m4a" 
        onPlay={() => setIsPlaying(true)} 
        onPause={() => setIsPlaying(false)} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} 
        className="hidden"
      />

      <Link href="/podcast" className="block text-center text-[10px] uppercase tracking-widest text-guardian-light hover:text-white transition-colors shrink-0">
        Enter Full Interactive Studio ↗
      </Link>
    </div>
  );
}