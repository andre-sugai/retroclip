export interface Artist {
  name: string;
  slug: string;
}

export interface VideoImage {
  o: string; // Original size
  l?: string; // Large
  t?: string; // Thumbnail
}

export interface Video {
  id: number;
  song_title: string;
  artists: Artist[];
  image?: VideoImage;
  url: string; // The IMVDB url
  year: number;
  // Note: The public IMVDB search endpoint often requires an extra call to get the stream URL (YouTube ID).
  // For this demo, we will simulate the streaming ID or parse it if available in a robust app.
  // We will add a property for the embeddable ID we try to resolve.
  embed_id?: string;
  source?: 'youtube' | 'vimeo' | 'unknown';
  artist_genre?: string;
  nationality?: 'BR' | 'INTL';
}

export interface SearchParams {
  type: 'year' | 'decade';
  value: string;
}

export interface PlayerState {
  currentVideo: Video | null;
  queue: Video[];
  isPlaying: boolean;
  hasStarted: boolean; // Has the user clicked the main play button in Sector 3?
  isLoading: boolean;
  error: string | null;
}