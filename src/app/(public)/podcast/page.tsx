"use client";

import React, { useState, useRef, useEffect } from "react";

interface TranscriptWord { text: string; start: number; end?: number; duration?: number; }

export default function PodcastPage() {
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
      .catch((err) => console.error("Failed to load full dashboard transcript:", err));
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

  const forceSnapBack = () => {
    setIsUserScrolling(false);
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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto h-[calc(100vh-120px)]">
      {/* Header Section */}
      <div className="border-b border-guardian-light/30 pb-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-wider">
            COMMS ARRAY // <span className="text-mesmer-neon">EP. 01</span>
          </h1>
          <p className="text-gray-400 mt-1">Guild Wars 3 Resets the Tyrian Timeline</p>
        </div>
        {isUserScrolling && (
          <button 
            onClick={forceSnapBack}
            className="text-xs font-mono uppercase bg-mesmer-neon/20 border border-mesmer-neon/40 text-mesmer-neon px-3 py-1.5 rounded-sm hover:bg-mesmer-neon hover:text-black transition-all animate-pulse"
          >
            🎯 Recenter Transmission
          </button>
        )}
      </div>

      {/* TRANSCRIPT VIEWPORT CORE PLATFORM */}
      <div className="flex-1 min-h-0 bg-black/50 rounded-xl border border-gray-800/60 shadow-2xl relative overflow-hidden">
        <div
          ref={scrollRef}
          onWheel={handleUserScroll}
          onTouchMove={handleUserScroll}
          className="absolute inset-0 overflow-y-auto custom-scrollbar p-8 lg:p-12 text-center leading-loose flex flex-wrap justify-center content-start gap-x-3 gap-y-2"
          style={{ contain: 'content' }}
        >
          {transcript.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-md animate-pulse">
              Decrypting master timeline matrix coordinates...
            </div>
          ) : (
            transcript.map((w, i) => (
              <span
                key={i}
                onClick={() => seekToWord(w.start)}
                className={`cursor-pointer text-2xl lg:text-3xl font-serif transition-all duration-300 inline-block h-fit ${
                  i === activeIndex 
                    ? "text-white font-bold scale-105 drop-shadow-[0_0_12px_rgba(217,70,239,0.95)]" 
                    : "text-gray-600 hover:text-gray-300"
                }`}
              >
                {w.text}
              </span>
            ))
          )}
        </div>
      </div>

      {/* CORE CONTROL CONSOLE INTERFACE BAR */}
      <div className="panel-slf p-6 rounded-xl shrink-0 space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 rounded-full border border-mesmer-neon text-mesmer-neon flex items-center justify-center hover:bg-mesmer-neon hover:text-black transition-all shadow-[0_0_15px_rgba(217,70,239,0.2)] shrink-0"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <div className="text-sm font-mono text-gray-400 w-12 text-right shrink-0">
            {formatTime(currentTime)}
          </div>

          <div 
            className="flex-1 h-2 bg-gray-800 rounded-full cursor-pointer relative group" 
            onClick={seekFromBar}
          >
            <div 
              className="absolute h-full bg-linear-to-r from-mesmer-neon to-guardian-light rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} 
            />
          </div>

          <div className="text-sm font-mono text-gray-500 w-12 shrink-0">
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
    </div>
  );
}