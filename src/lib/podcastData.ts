export interface Timestamp {
  label: string;
  time: number;
}

export interface EpisodeMeta {
  id: string;
  series: string;
  episode: number;
  title: string;
  status: string;
  audioUrl: string;
  spotifyUrl?: string;
  appleUrl?: string;
}

export const PLAYLIST_MANIFEST: EpisodeMeta[] = [
  {
    id: "frontier-01",
    series: "GW3 Frontier",
    episode: 1,
    title: "Guild Wars 3 Resets the Tyrian Timeline",
    status: "Released",
    audioUrl: "http://mr3anderson.pro/podcast/gw3frontier/Guild_Wars_3_Resets_the_Tyrian_Timeline.m4a",
    spotifyUrl: "https://open.spotify.com",
    appleUrl: "https://podcasts.apple.com"
  },
  {
    id: "frontier-02",
    series: "GW3 Frontier",
    episode: 2,
    title: "Ancient Orr Returns from the Depths",
    status: "Released",
    audioUrl: "http://mr3anderson.pro/podcast/gw3frontier/ep2_sample.m4a",
    spotifyUrl: "https://open.spotify.com"
  },
  {
    id: "wrapup-01",
    series: "The Wrap-Up",
    episode: 1,
    title: "Launch Week Speculation Framework",
    status: "Upcoming",
    audioUrl: ""
  }
];