"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { EpisodeMeta } from "@/lib/podcastData";

interface TranscriptWord { text: string; start: number; end?: number; duration?: number; }

interface AudioContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeEpisode: EpisodeMeta | null;
  playEpisode: (episode: EpisodeMeta) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeEpisode, setActiveEpisode] = useState<EpisodeMeta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Transcript states for the mini-player
  const [transcript, setTranscript] = useState<TranscriptWord[]>([]);
  const [activeText, setActiveText] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle Audio Element initialization and event listeners
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Fetch transcript when active episode changes
  useEffect(() => {
    if (!activeEpisode || activeEpisode.status === "Upcoming") return;

    setTranscript([]);
    setActiveText("Decrypting secure channel...");

    fetch(`/api/transcript?id=${activeEpisode.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.segments) {
          setTranscript(data.segments.flatMap((s: any) => s.words));
        }
      })
      .catch(() => setActiveText("Transmission error."));
  }, [activeEpisode]);

  // Sync active text with current audio time
  useEffect(() => {
    if (!transcript.length) return;

    const currentWord = transcript.find((w) => {
      const end = w.end || (w.start + (w.duration || 0.5));
      return currentTime >= w.start && currentTime <= end;
    });

    if (currentWord) {
      setActiveText(currentWord.text);
    }
  }, [currentTime, transcript]);

  const playEpisode = (episode: EpisodeMeta) => {
    if (!audioRef.current || !episode.audioUrl) return;
    if (activeEpisode?.id === episode.id) {
      togglePlay();
      return;
    }
    setActiveEpisode(episode);
    audioRef.current.src = episode.audioUrl;
    audioRef.current.play();
  };

  const togglePlay = () => {
    if (!audioRef.current || !activeEpisode) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  return (
    <AudioContext.Provider value={{ isPlaying, currentTime, duration, activeEpisode, playEpisode, togglePlay, seekTo }}>
      {children}
      
      {activeEpisode && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-950 border-t border-purple-900/50 z-50 px-4 md:px-6 flex items-center justify-between shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
          
          {/* Left: Episode Info */}
          <div className="flex flex-col min-w-0 max-w-[150px] sm:max-w-xs shrink-0">
            <span className="text-[10px] text-purple-500 font-bold tracking-widest uppercase truncate">
              {activeEpisode.series} // EP {activeEpisode.episode}
            </span>
            <span className="text-sm font-semibold text-white truncate">{activeEpisode.title}</span>
          </div>

          {/* Center: Live Transcript Highlight (Hidden on very small screens) */}
          <div className="hidden md:flex flex-1 mx-8 items-center justify-center overflow-hidden">
            <span className="text-white font-serif text-lg truncate drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
              {activeText}
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs font-mono text-gray-400 hidden sm:inline w-10 text-right">
              {Math.floor(currentTime / 60)}:{( "0" + Math.floor(currentTime % 60) ).slice(-2)}
            </span>
            <button 
              onClick={togglePlay} 
              className="w-10 h-10 flex items-center justify-center border border-purple-500/40 rounded-full text-purple-400 hover:bg-purple-500 hover:text-black transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-4 h-4 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        </div>
      )}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
};