"use client";

import React from "react";
import Link from "next/link";
import { useAudio } from "@/context/AudioContext";
import { PLAYLIST_MANIFEST, EpisodeMeta } from "@/lib/podcastData";

export default function PodcastMiniPlayer() {
  const { activeEpisode, playEpisode, togglePlay, isPlaying } = useAudio();

  // Filter for released episodes, assuming the first one in the array is the newest
  const releasedEpisodes = PLAYLIST_MANIFEST.filter((ep) => ep.status === "Released");
  const latestEpisode = releasedEpisodes[0];
  const olderEpisodes = releasedEpisodes.slice(1);

  const handlePlayClick = (episode: EpisodeMeta) => {
    // If clicking the episode that is already loaded, just play/pause it
    if (activeEpisode?.id === episode.id) {
      togglePlay();
    } else {
      // Otherwise, load and play the new episode
      playEpisode(episode);
    }
  };

  if (!latestEpisode) return null; // Fallback if no episodes are released

  return (
    <div className="panel-slf p-6 rounded-xl flex flex-col h-105 lg:h-full justify-between anime-glitch-hover gap-4">
      
      {/* LATEST EPISODE SECTION */}
      <div className="flex flex-col gap-3 flex-1 min-h-0 border-b border-gray-900 pb-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-mesmer-neon uppercase tracking-widest block">
            LATEST PODCAST
          </span>
          {latestEpisode.spotifyUrl && (
            <a 
              href={latestEpisode.spotifyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-mono text-[#1DB954] hover:text-white transition-colors"
            >
              Spotify ↗
            </a>
          )}
        </div>

        {/* Featured Play Card */}
        <div 
  className={`flex-1 min-h-0 rounded-md border ${
    activeEpisode?.id === latestEpisode.id ? 'border-mesmer-neon' : 'border-gray-800'
  } p-4 relative overflow-hidden group cursor-pointer hover:border-mesmer-neon/50 transition-all flex flex-col justify-center items-center text-center gap-4`}
  style={{
    backgroundImage: `url("https://mr3anderson.pro/podcast/gw3frontier/gw3frontier.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
  onClick={() => handlePlayClick(latestEpisode)}
>
  {/* 1. Dark Fade Overlay: Ensures text pops. Adjust bg-black/60 to change darkness */}
  <div className="absolute inset-0 bg-black/60 z-0"></div>

  {/* 2. Your Existing Gradient Overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-mesmer-neon/5 via-transparent to-transparent pointer-events-none z-0"></div>
  
  {/* 3. Button Container: Added relative and z-10 to ensure it stays on top */}
  <button className={`relative z-10 w-16 h-16 rounded-full border flex items-center justify-center transition-all shadow-[0_0_15px_rgba(217,70,239,0.15)] ${
    activeEpisode?.id === latestEpisode.id && isPlaying 
      ? 'border-mesmer-neon text-black bg-mesmer-neon shadow-[0_0_20px_rgba(217,70,239,0.5)]' 
      : 'border-mesmer-neon text-mesmer-neon group-hover:bg-mesmer-neon group-hover:text-black'
  }`}>
    {activeEpisode?.id === latestEpisode.id && isPlaying ? (
      <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
    ) : (
      <svg className="w-8 h-8 fill-current " viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    )}
  </button>

  {/* 4. Text Content: Added relative and z-10 */}
  <div className="space-y-1 relative z-10">
    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-mesmer-neon transition-colors line-clamp-2">
      {latestEpisode.title}
    </h3>
    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
      {latestEpisode.series} // EP {latestEpisode.episode}
    </p>
  </div>
</div>
      </div>

      {/* EPISODE PICKER LIST (Scrollable for older episodes) */}
      {olderEpisodes.length > 0 && (
        <div className="space-y-2 shrink-0 max-h-[35%] overflow-y-auto custom-scrollbar pr-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Previous Logs</span>
          
          {olderEpisodes.map((ep) => (
            <div 
              key={ep.id} 
              onClick={() => handlePlayClick(ep)}
              className={`flex items-center gap-3 p-2.5 rounded cursor-pointer transition-colors border-l-2 ${activeEpisode?.id === ep.id ? 'bg-mesmer-neon/10 border-mesmer-neon' : 'bg-black/40 border-gray-800 hover:border-gray-500'}`}
            >
              <button className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${activeEpisode?.id === ep.id ? 'border-mesmer-neon text-mesmer-neon' : 'border-gray-600 text-gray-400'}`}>
                  {activeEpisode?.id === ep.id && isPlaying ? (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
              </button>
              <div className="flex flex-col min-w-0">
                <span className={`text-sm truncate ${activeEpisode?.id === ep.id ? 'text-white font-bold' : 'text-gray-300'}`}>
                  {ep.title}
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase">
                  EP {ep.episode} {ep.spotifyUrl && <span className="ml-2 text-[#1DB954]/70">SPOTIFY</span>}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LINK TO FULL STUDIO */}
      <Link href="/podcast" className="block text-center text-[10px] uppercase tracking-widest text-guardian-light hover:text-white transition-colors shrink-0 pt-3 border-t border-gray-900 mt-1">
        Enter Full Interactive Studio ↗
      </Link>

    </div>
  );
}