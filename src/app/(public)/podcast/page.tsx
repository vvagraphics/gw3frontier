"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";

interface TranscriptWord { text: string; start: number; end?: number; duration?: number; }
interface Timestamp { label: string; time: number; }

interface EpisodeMeta {
  id: string;
  series: string;
  episode: number;
  title: string;
  status: string;
  audioUrl: string;
  spotifyUrl?: string;
  appleUrl?: string;
}

// Master tracking index for playlist layout
const PLAYLIST_MANIFEST: EpisodeMeta[] = [
  {
    id: "ep-01",
    series: "GW3 Frontier",
    episode: 1,
    title: "Guild Wars 3 Resets the Tyrian Timeline",
    status: "Released",
    audioUrl: "http://mr3anderson.pro/podcast/gw3frontier/Guild_Wars_3_Resets_the_Tyrian_Timeline.m4a",
    spotifyUrl: "https://open.spotify.com",
    appleUrl: "https://podcasts.apple.com"
  },
  {
    id: "ep-02",
    series: "GW3 Frontier",
    episode: 2,
    title: "Ancient Orr returns in Guild Wars 3",
    status: "Released",
    audioUrl: "http://mr3anderson.pro/podcast/gw3frontier/ep2_sample.m4a",
    spotifyUrl: "https://open.spotify.com"
  },
  {
    id: "ep-wrapup-01",
    series: "The Wrap-Up",
    episode: 1,
    title: "Launch Week Speculation Framework",
    status: "Upcoming",
    audioUrl: ""
  }
];

export default function PodcastPage() {
  const { isPlaying, currentTime, duration, activeEpisode, playEpisode, seekTo } = useAudio();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeSeries, setActiveSeries] = useState("All");
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>("ep-01");
  const [transcript, setTranscript] = useState<TranscriptWord[]>([]);
  const [liveTimestamps, setLiveTimestamps] = useState<Timestamp[]>([]);
  const [liveDescription, setLiveDescription] = useState("");
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const selectedEpisode = PLAYLIST_MANIFEST.find((ep) => ep.id === selectedEpisodeId) || PLAYLIST_MANIFEST[0];

  // Dynamically load active payload metadata from endpoint
  useEffect(() => {
    setTranscript([]);
    setLiveTimestamps([]);
    setLiveDescription("");

    if (selectedEpisode.status === "Upcoming") return;

    fetch(`/api/transcript?id=${selectedEpisodeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Data stream unavailable");
        return res.json();
      })
      .then((data) => {
        if (data.description) setLiveDescription(data.description);
        if (data.timestamps) setLiveTimestamps(data.timestamps);
        if (data.segments) {
          setTranscript(data.segments.flatMap((s: any) => s.words));
        }
      })
      .catch((err) => console.error("Error synchronizing tracking vectors:", err));
  }, [selectedEpisodeId]);

  const handleUserScroll = () => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 4000);
  };

  const activeIndex = transcript.findIndex((w) => {
    const end = w.end || (w.start + (w.duration || 0.5));
    return activeEpisode?.id === selectedEpisodeId && currentTime >= w.start && currentTime <= end;
  });

  useEffect(() => {
    if (!isUserScrolling && activeIndex !== -1 && scrollRef.current) {
      const activeEl = scrollRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeIndex, isUserScrolling]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)] p-4 lg:p-0">
      
      {/* LEFT DRAWER PANEL: DIRECTORY INDEX */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full overflow-hidden shrink-0">
        <div className="border-b border-gray-800 pb-4 shrink-0">
          <h2 className="text-xl font-bold tracking-wider text-white">COMMUNICATIONS LOGS</h2>
          <div className="flex gap-2 mt-3">
            {["All", "GW3 Frontier", "The Wrap-Up"].map((series) => (
              <button
                key={series}
                onClick={() => setActiveSeries(series)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs transition-colors ${
                  activeSeries === series 
                    ? "bg-purple-500 text-black font-bold" 
                    : "border border-gray-800 text-gray-400 hover:border-purple-500 hover:text-purple-400"
                }`}
              >
                {series}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
          {PLAYLIST_MANIFEST.filter((ep) => activeSeries === "All" || ep.series === activeSeries).map((ep) => (
            <div 
              key={ep.id}
              onClick={() => setSelectedEpisodeId(ep.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedEpisodeId === ep.id 
                  ? "bg-black/60 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "bg-black/20 border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-purple-400 tracking-wider">
                  {ep.series} // EPISODE {ep.episode}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider ${ep.status === "Released" ? "bg-green-950 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                  {ep.status}
                </span>
              </div>
              <h3 className="text-md font-bold text-white leading-snug">{ep.title}</h3>
              
              {selectedEpisodeId === ep.id && (
                <div className="mt-3 pt-3 border-t border-gray-800/80 space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-gray-400 leading-relaxed">{liveDescription || ep.title}</p>
                  
                  {liveTimestamps.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-500 block mb-1">DATA NODES:</span>
                      {liveTimestamps.map((ts, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeEpisode?.id !== ep.id) playEpisode(ep as any);
                            setTimeout(() => seekTo(ts.time), 100);
                          }}
                          className="w-full text-left flex justify-between items-center text-xs p-1.5 rounded-sm hover:bg-white/5 transition-colors"
                        >
                          <span className="text-gray-300 truncate pr-2">{ts.label}</span>
                          <span className="font-mono text-purple-400 shrink-0">{formatTime(ts.time)}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    {ep.spotifyUrl && (
                      <a href={ep.spotifyUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-1.5 border border-green-500/30 bg-green-500/5 hover:bg-green-500/20 text-green-400 text-[10px] font-mono uppercase tracking-wider rounded-xs transition-colors">
                        Spotify
                      </a>
                    )}
                    {ep.appleUrl && (
                      <a href={ep.appleUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-1.5 border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/20 text-purple-300 text-[10px] font-mono uppercase tracking-wider rounded-xs transition-colors">
                        Apple
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT DRAWER PANEL: MASTER TRANSMISSION DECRYPTION VIEW */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
        <div className="border-b border-gray-800 pb-4 shrink-0 flex justify-between items-end">
          <div>
            <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">LIVE BROADCAST FEED //</span>
            <h2 className="text-xl font-bold text-white truncate mt-0.5">{selectedEpisode.title}</h2>
          </div>
          {isUserScrolling && (
            <button 
              onClick={() => setIsUserScrolling(false)}
              className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-black transition-all"
            >
              Recenter
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 bg-black/40 rounded-xl border border-gray-800/80 relative">
          <div 
            ref={scrollRef}
            onWheel={handleUserScroll}
            onTouchMove={handleUserScroll}
            className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 lg:p-10 text-center flex flex-wrap justify-center content-start gap-x-2.5 gap-y-1.5"
          >
            {selectedEpisode.status === "Upcoming" ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 font-mono text-sm gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>SIGNAL OFFLINE // TRANSMISSION EMBARGO ACTIVE</span>
              </div>
            ) : transcript.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-600 font-mono text-sm animate-pulse">
                Decrypting sync arrays...
              </div>
            ) : (
              transcript.map((w, i) => (
                <span
                  key={i}
                  onClick={() => {
                    if (activeEpisode?.id !== selectedEpisodeId) playEpisode(selectedEpisode as any);
                    setTimeout(() => seekTo(w.start), 50);
                  }}
                  className={`cursor-pointer text-xl lg:text-2xl font-serif transition-all duration-200 ${
                    activeEpisode?.id === selectedEpisodeId && i === activeIndex
                      ? "text-white font-bold scale-105 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {w.text}
                </span>
              ))
            )}
          </div>
        </div>

        {/* CONTROLLER TERMINAL DECK BAR */}
        <div className="p-4 bg-gray-950/60 rounded-xl border border-gray-800 flex items-center gap-4 shrink-0">
          <button
            disabled={selectedEpisode.status === "Upcoming"}
            onClick={() => playEpisode(selectedEpisode as any)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
              selectedEpisode.status === "Upcoming"
                ? "border border-gray-800 text-gray-700 cursor-not-allowed"
                : "border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black shadow-[0_0_10px_rgba(168,85,247,0.1)]"
            }`}
          >
            {activeEpisode?.id === selectedEpisodeId && isPlaying ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <div className="flex-1 h-1 bg-gray-800 rounded-full relative overflow-hidden">
            <div 
              className="absolute h-full bg-purple-500 rounded-full" 
              style={{ 
                width: `${activeEpisode?.id === selectedEpisodeId && duration > 0 
                  ? (currentTime / duration) * 100 
                  : 0}%` 
              }}
            />
          </div>

          <div className="text-xs font-mono text-gray-500 w-20 text-right shrink-0">
            {activeEpisode?.id === selectedEpisodeId ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "--:-- / --:--"}
          </div>
        </div>

      </div>
    </div>
  );
}