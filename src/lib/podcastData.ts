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
    spotifyUrl: "https://open.spotify.com/episode/6rtpfS3fuVVB16jNWcwytE?si=gcJZ-UekS4aso-I2F7THNQ",
    appleUrl: "https://podcasts.apple.com"
  },
  {
    id: "frontier-02",
    series: "GW3 Frontier",
    episode: 2,
    title: "Ancient Orr Returns from the Depths",
    status: "Released",
    audioUrl: "http://mr3anderson.pro/podcast/gw3frontier/Ancient_Orr_returns_in_Guild_Wars_3.m4a",
    spotifyUrl: "https://open.spotify.com/episode/020CxR9tFPGOniBqLvnaR9?si=Lfw5rdcuTuSRUsz7tg8O6w"
  },
    {
    id: "frontier-03",
    series: "GW3 Frontier",
    episode: 3,
    title: "The Combat Revolution & The Card Game Shift",
    status: "Released",
    audioUrl: "http://mr3anderson.pro/podcast/gw3frontier/The_Combat_Revolution_&_The_Card_Game_Shift.m4a",
    spotifyUrl: "https://open.spotify.com/episode/7cE30QxMzxPSyE1QelqwWK?si=omK7o0ZuQX2a1OZnfBiFeA"
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