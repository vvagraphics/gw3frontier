"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Timestamp { label: string; time: number; }
interface Episode { id: string; title: string; series: string; episode: number; audioUrl: string; status: string; timestamps: Timestamp[]; }

interface AudioContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeEpisode: Episode | null;
  playEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const playEpisode = (episode: Episode) => {
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
      {/* Persistent Bottom Bar Mini-Player */}
      {activeEpisode && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-950 border-t border-gray-800 z-50 px-6 flex items-center justify-between shadow-2xl">
          <div className="flex flex-col min-w-0 max-w-xs sm:max-w-sm">
            <span className="text-[10px] text-purple-400 font-bold tracking-widest uppercase">COMMS BROADCASTING //</span>
            <span className="text-sm font-semibold text-white truncate">{activeEpisode.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="p-2 border border-purple-500/40 rounded-full text-purple-400 hover:bg-purple-500 hover:text-black transition-all">
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <span className="text-xs font-mono text-gray-400 hidden sm:inline">
              {Math.floor(currentTime / 60)}:{( "0" + Math.floor(currentTime % 60) ).slice(-2)}
            </span>
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