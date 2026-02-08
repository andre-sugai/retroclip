import { Video } from '../types';
import metadata from './metadata.json';
import metadataIndex from './metadata-index.json';

// ============================================================================
// CACHE SYSTEM
// ============================================================================

const dataCache = new Map<string, any>();

// ============================================================================
// DYNAMIC LOADERS - Now using unified structure
// ============================================================================

const loadYear = async (year: number) => {
  const key = `year-${year}`;
  if (dataCache.has(key)) return dataCache.get(key);
  
  try {
    const data = await import(`../data/videos/${year}.json`);
    dataCache.set(key, data.default);
    return data.default;
  } catch (error) {
    console.warn(`No data for year ${year}`);
    return [];
  }
};

const loadProgram = async (program: 'hermes_e_renato' | 'beavis_and_butthead' | 'documentarios') => {
  const key = `program-${program}`;
  if (dataCache.has(key)) return dataCache.get(key);
  
  const data = await import(`../data/programas/${program}.json`);
  dataCache.set(key, data.default);
  return data.default;
};

// ============================================================================
// INDEX-BASED LOADERS (New optimized functions)
// ============================================================================

/**
 * Load videos by genre using index to load only relevant years
 */
const loadByGenre = async (genreId: string, region: 'br' | 'intl' | 'all' = 'all') => {
  const genreInfo = metadataIndex.byGenre[genreId];
  
  if (!genreInfo || !genreInfo.years || genreInfo.years.length === 0) {
    console.warn(`No data found for genre: ${genreId}`);
    return [];
  }
  
  const videos = [];
  
  // Load only years that have this genre
  for (const year of genreInfo.years) {
    const yearData = await loadYear(year);
    videos.push(...yearData);
  }
  
  // Filter by region if needed
  if (region !== 'all') {
    const targetNationality = region === 'br' ? 'BR' : 'INTL';
    return videos.filter(v => v.nationality === targetNationality);
  }
  
  return videos;
};

/**
 * Load videos by festival using index
 */
const loadByFestival = async (festival: string) => {
  const festivalInfo = metadataIndex.byFestival[festival];
  
  if (!festivalInfo) {
    console.warn(`No data found for festival: ${festival}`);
    return [];
  }
  
  const videos = [];
  
  // Load from year files that have this festival tag
  if (festivalInfo.years && festivalInfo.years.length > 0) {
    for (const year of festivalInfo.years) {
      const yearData = await loadYear(year);
      const festivalVideos = yearData.filter(v => 
        v.festival === festival || (v.video_tags && v.video_tags.includes(festival))
      );
      videos.push(...festivalVideos);
    }
  }
  
  return videos;
};

// ============================================================================
// CONSTANTS (from metadata)
// ============================================================================

export const TOTAL_VIDEOS_COUNT = metadataIndex.metadata.totalVideos;
export const TOTAL_CLIPS = metadataIndex.metadata.totalClips;
export const TOTAL_SHOWS = metadataIndex.metadata.totalShows;
export const TOTAL_PROGRAMS = metadataIndex.metadata.totalPrograms;
export const INTL_VIDEOS_COUNT = metadataIndex.byNationality.INTL.count;
export const BR_VIDEOS_COUNT = metadataIndex.byNationality.BR.count;

// Static exports for radio (these are tiny)
export const KISS_FM_VIDEO = {
  id: 99999999,
  song_title: 'Ao Vivo',
  year: new Date().getFullYear(),
  artist_name: 'Kiss FM',
  artists: [{ name: 'Kiss FM', slug: 'kiss-fm' }],
  stream_url: 'https://cloud1.cdnseguro.com:9758/;',
  source: 'stream',
  artist_genre: 'Radio',
  video_type: 'live',
};

export const RADIO_89FM_VIDEO = {
  id: 99999998,
  song_title: 'Ao Vivo',
  year: new Date().getFullYear(),
  artist_name: '89 FM - A Rádio Rock',
  artists: [{ name: '89 FM', slug: '89-fm' }],
  url: 'https://www.radiorock.com.br',
  embed_id: '',
  stream_url: 'https://27223.live.streamtheworld.com:443/RADIO_89FM_SC',
  source: 'stream',
  artist_genre: 'Radio',
  video_type: 'live',
};

// ============================================================================
// PINKPOP VIDEOS (Index-based loading using video_tags)
// ============================================================================

export const loadPinkpopVideos = async () => {
  try {
    // Load all videos with pinkpop tag or festival field from index
    // This includes:
    // - Videos from pinkpop.json (169 videos without years)
    // - Videos from year files with video_tags: ["pinkpop"] (143 videos)
    const videos = await loadByFestival('pinkpop');
    
    return videos
      .map((item: any) => {
        const url = item.youtube_link || '';
        const match = url.match(
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        );
        const videoId = match && match[2].length === 11 ? match[2] : '';

        return {
          ...item,
          url,
          is_show: true,
          artists: [{ name: item.artist_name || 'Pinkpop' }],
          embed_id: videoId,
        };
      })
      .filter((video: any) => video.embed_id !== '');
  } catch (error) {
    console.error('Failed to load Pinkpop videos:', error);
    return [];
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const deduplicateData = (items: any[]) => {
  const map = new Map();
  items.forEach((item) => {
    const id = item.id;
    if (!id) return;
    if (map.has(id)) {
      map.set(id, { ...map.get(id), ...item });
    } else {
      map.set(id, item);
    }
  });
  return Array.from(map.values());
};

function getYouTubeId(url: string): string | undefined {
  if (!url) return undefined;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : undefined;
}

function getHighQualityThumbnail(videoId: string) {
  return {
    o: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    l: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    t: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// ============================================================================
// DATA ASSEMBLY - Optimized with index
// ============================================================================

const getDataset = async (
  region: string,
  type?: 'year' | 'decade' | 'all',
  value?: string
) => {
  // For specific year, only load that year
  if (type === 'year' && value) {
    const year = parseInt(value);
    const yearData = await loadYear(year);
    
    // Filter by region
    if (region !== 'all') {
      return yearData.filter((v: any) => v.nationality === region);
    }
    
    return yearData;
  }
  
  // For decade, load all years in that decade
  if (type === 'decade' && value) {
    const startYear = parseInt(value);
    const endYear = startYear + 9;
    const data = [];
    
    for (let year = startYear; year <= endYear; year++) {
      // Check if year exists in index before loading
      if (metadataIndex.byYear[year]) {
        const yearData = await loadYear(year);
        
        // Filter by region
        if (region !== 'all') {
          data.push(...yearData.filter((v: any) => v.nationality === region));
        } else {
          data.push(...yearData);
        }
      }
    }
    
    return deduplicateData(data);
  }
  
  // For 'all', load everything (expensive, used for initial load)
  return await loadAllData(region);
};

// Helper to load all data (used sparingly)
const loadAllData = async (region: string) => {
  const data = [];
  
  // Get years from index
  const years = Object.keys(metadataIndex.byYear).map(y => parseInt(y));
  
  // Load years based on region
  const yearsToLoad = years.filter(year => {
    const yearInfo = metadataIndex.byYear[year];
    if (region !== 'all') {
      return yearInfo.nationalities.includes(region);
    }
    return true; // 'all'
  });
  
  // Load all years in parallel
  const promises = yearsToLoad.map(async (year) => {
    const yearData = await loadYear(year);
    
    // Filter by region
    if (region !== 'all') {
      return yearData.filter((v: any) => v.nationality === region);
    }
    return yearData;
  });
  
  const results = await Promise.all(promises);
  data.push(...results.flat());
  
  // Load programs (always BR)
  if (region === 'BR' || region === 'all') {
    const programs = await Promise.all([
      loadProgram('hermes_e_renato'),
      loadProgram('beavis_and_butthead'),
      loadProgram('documentarios')
    ]);
    
    data.push(...programs.flat());
  }
  
  return deduplicateData(data);
};

// ============================================================================
// MAIN FETCH FUNCTIONS
// ============================================================================

const mapToVideo = (item: any): Video => {
  const embedId = getYouTubeId(item.youtube_link || '') || getYouTubeId(item.imvdb_url || '');
  const artistName = String(item.artist || item.artist_name || 'Unknown');

  return {
    id: item.id,
    song_title: item.song_title,
    artists: [
      { name: artistName, slug: artistName.toLowerCase().replace(/ /g, '-') },
    ],
    year: item.year,
    url: item.imvdb_url,
    embed_id: embedId,
    image: embedId ? getHighQualityThumbnail(embedId) : undefined,
    source: 'youtube',
    artist_genre: item.artist_genre,
    nationality: item.nationality || 'INTL',
    is_show: item.is_show,
    is_program: item.is_program,
    program_name: item.program_name,
    record_label: item.record_label,
  } as Video;
};

export const fetchVideosByCriteria = async (
  type: 'year' | 'decade' | 'all',
  value: string,
  region: string = 'all'
): Promise<Video[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const sourceData = await getDataset(region, type, value);
  
  // Map to Video type
  const mapped = sourceData
    .map((item) => mapToVideo(item))
    .filter((v) => v.embed_id); // Only return videos with valid IDs

  return shuffleArray(mapped);
};

export const getCountries = () => {
  return Object.entries(metadataIndex.byNationality)
    .map(([code, data]: [string, any]) => ({
      code,
      count: data.count,
      name: code // Ideally map this to full name
    }))
    .filter(c => c.count >= 20)
    .sort((a, b) => b.count - a.count);
};

export const getAvailableDecades = (region: string): string[] => {
  const standardDecades = ['1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'];
  
  if (region === 'all' || !metadataIndex?.byNationality?.[region]) {
    return standardDecades;
  }

  const years = metadataIndex.byNationality[region].years;
  if (!years || !Array.isArray(years)) return standardDecades;

  const decades = new Set<string>();
  years.forEach((year: number) => {
    const decade = Math.floor(year / 10) * 10;
    decades.add(decade.toString());
  });

  return Array.from(decades).sort();
};

export const fetchVideoById = async (
  id: string | number
): Promise<Video | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`[Grooovio Fetch] Looking for ID: ${id}`);
  
  // Try to find in cache first
  for (const [key, data] of dataCache.entries()) {
    const found = data.find((v: any) => v.id && v.id.toString() === id.toString());
    if (found) {
      console.log(`[Grooovio Fetch] Found in cache: ${key}`);
      return mapToVideo(found);
    }
  }
  
  // If not in cache, try to find by YouTube ID in cache
  for (const [key, data] of dataCache.entries()) {
    const found = data.find((v: any) => {
      const yId = getYouTubeId(v.youtube_link || '') || getYouTubeId(v.imvdb_url || '');
      return yId === id;
    });
    if (found) {
      console.log(`[Grooovio Fetch] Found by YouTube ID in cache: ${key}`);
      return mapToVideo(found);
    }
  }
  
  // If not in cache, load all data (expensive fallback for deep links)
  console.log(`[Grooovio Fetch] Not in cache, loading all data...`);
  const allData = await getDataset('all');
  
  let found = allData.find((v: any) => v.id && v.id.toString() === id.toString());
  
  // Try by YouTube ID
  if (!found) {
    found = allData.find((v: any) => {
      const yId = getYouTubeId(v.youtube_link || '') || getYouTubeId(v.imvdb_url || '');
      return yId === id;
    });
  }
  
  if (!found) {
    console.warn(`[Grooovio Fetch] Video not found for ID: ${id}`);
    return undefined;
  }
  
  return mapToVideo(found);
};

// ============================================================================
// GENRE MAP
// ============================================================================

export const GENRE_MAP: Record<string, string[]> = {
  'Rock Alternativo': [
    'Alternative Rock',
    'Grunge',
    'Indie Rock',
    'Post-Grunge',
    'Shoegaze',
    'Britpop',
    'Folk Rock',
    'Alternative',
    'Rock Alternativo',
  ],
  Punk: ['Punk', 'Pop Punk', 'Ska Punk', 'Hardcore'],
  Metal: [
    'Metal',
    'Heavy Metal',
    'Thrash Metal',
    'Nu Metal',
    'Industrial Metal',
    'Groove Metal',
    'Death Metal',
    'Black Metal',
  ],
  Rap: ['Hip Hop', 'Rap', 'Gangsta Rap', 'Alternative Hip Hop', 'Jazz Rap'],
  Pop: [
    'Pop',
    'Pop Rock',
    'Synth-pop',
    'Teen Pop',
    'Dance-Pop',
    'Europop',
    'Boy Band',
    'Girl Group',
  ],
  Dance: [
    'Dance',
    'Eurodance',
    'House',
    'Techno',
    'Trance',
    'Electronic',
    'Disco',
  ],
  Eletronico: [
    'Electronic',
    'Techno',
    'Trance',
    'House',
    'Big Beat',
    'Trip Hop',
    'Electronica',
    'Industrial',
    'Drum and Bass',
    'Jungle',
  ],
  'Hard Rock': ['Hard Rock', 'Glam Metal', 'Stoner Rock'],
  Hardcore: ['Hardcore', 'Hardcore Punk', 'Post-Hardcore'],
  Industrial: ['Industrial', 'Industrial Metal', 'Industrial Rock'],
  'Nu Metal': ['Nu Metal', 'Rap Metal', 'Alternative Metal'],
  Indie: [
    'Indie',
    'Indie Rock',
    'Indie Pop',
    'Garage Rock',
    'Shoegaze',
    'Britpop',
  ],
  Rock: ['Rock', 'Classic Rock', 'Rock and Roll', 'Southern Rock'],
  'R&B': ['R&B', 'Soul', 'Funk', 'Neo-Soul', 'Contemporary R&B'],
  'Latin Pop': ['Latin Pop', 'Latin', 'Reggaeton', 'Latin Rock'],
  'K-Pop': ['K-Pop', 'Korean Pop'],
  Folk: ['Folk', 'Folk Rock', 'Indie Folk', 'Contemporary Folk'],
  Gótico: [
    'Gótico',
    'Goth',
    'Gothic Rock',
    'Dark Wave',
    'Post-Punk',
    'Ethereal Wave',
    'Gothic Metal',
  ],
  Ska: ['Ska', 'Ska Punk', 'Two Tone', 'Rocksteady'],
  Reggae: ['Reggae', 'Reggaeton'],
};

// ============================================================================
// STATISTICS FUNCTIONS - Now using index
// ============================================================================

export const getGenreStatistics = async (): Promise<Record<string, number>> => {
  // Return counts directly from index
  const genreCounts: Record<string, number> = {};
  
  Object.keys(GENRE_MAP).forEach((genre) => {
    genreCounts[genre] = metadataIndex.byGenre[genre]?.count || 0;
  });
  
  genreCounts['Clássicos'] = metadataIndex.byGenre['Clássicos']?.count || 0;
  
  return genreCounts;
};

export const getTopArtists = async (limit: number = 5) => {
  const allData = await getDataset('all');
  const artistCounts: Record<string, number> = {};

  allData.forEach((video: any) => {
    const artist = video.artist || video.artist_name || 'Unknown';
    if (artistCounts[artist]) {
      artistCounts[artist]++;
    } else {
      artistCounts[artist] = 1;
    }
  });

  return Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};

export const getAllArtists = async () => {
  // Use the index for instant results instead of loading all data
  if (metadataIndex.byArtist) {
    return Object.entries(metadataIndex.byArtist)
      .map(([name, data]: [string, any]) => ({ name, count: data.count }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Already sorted in index, but ensure it
  }
  
  // Fallback to loading all data if index doesn't have artists yet
  const allData = await getDataset('all');
  const artistCounts: Record<string, number> = {};

  allData.forEach((video: any) => {
    const artist = video.artist || video.artist_name || 'Unknown';
    if (artistCounts[artist]) {
      artistCounts[artist]++;
    } else {
      artistCounts[artist] = 1;
    }
  });

  return Object.entries(artistCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
};

export const getCollectionHighlights = async () => {
  const allData = await getDataset('all');

  // 1. Oldest Video
  const validYearVideos = allData
    .filter((v: any) => v.year && v.year > 1900)
    .sort((a: any, b: any) => a.year - b.year);
  const oldest = validYearVideos.length > 0 ? validYearVideos[0] : null;

  // 2. Golden Year (Year with most videos) - Use index
  const yearCounts = metadataIndex.byYear;
  const sortedYears = Object.entries(yearCounts).sort((a, b) => b[1].count - a[1].count);
  const goldenYear =
    sortedYears.length > 0
      ? { year: parseInt(sortedYears[0][0]), count: sortedYears[0][1].count }
      : null;

  return {
    oldest: oldest
      ? {
          title: (oldest as any).song_title,
          artist: (oldest as any).artist || (oldest as any).artist_name,
          year: (oldest as any).year,
        }
      : null,
    goldenYear,
  };
};
