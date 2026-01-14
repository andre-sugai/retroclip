import { Video } from '../types';

// Provided Database for 1994 (Validated Subset)
// Provided Database for 1994 (Validated Subset)
// Provided Database for 1994 (Validated Subset)
// Provided Database for 1994 (Validated Subset)
import data1999 from '../data/1999.json';
import data1998 from '../data/1998.json';
import data1997 from '../data/1997.json';
import data1996 from '../data/1996.json';
import data1995 from '../data/1995.json';
import data1994 from '../data/1994.json';
import data1993 from '../data/1993.json';
import data1992 from '../data/1992.json';
import data1991 from '../data/1991.json';
import data1990 from '../data/1990.json';
import data1989 from '../data/1989.json';
import data1988 from '../data/1988.json';
import data1987 from '../data/1987.json';
import data1986 from '../data/1986.json';
import data1985 from '../data/1985.json';
import data1984 from '../data/1984.json';
import data1983 from '../data/1983.json';
import data1982 from '../data/1982.json';
import data1981 from '../data/1981.json';
import data1980 from '../data/1980.json';
import data1978 from '../data/1978.json';
import data1979 from '../data/1979.json';
import data1977 from '../data/1977.json';
import data1976 from '../data/1976.json';
import data1975 from '../data/1975.json';
import data1974 from '../data/1974.json';
import data1973 from '../data/1973.json';
import data1972 from '../data/1972.json';
import data1971 from '../data/1971.json';
import data1970 from '../data/1970.json';
import data1969 from '../data/1969.json';
import data1968 from '../data/1968.json';
import data1967 from '../data/1967.json';
import data1966 from '../data/1966.json';
import data1965 from '../data/1965.json';
import data1964 from '../data/1964.json';
import data1963 from '../data/1963.json';
import data2000 from '../data/2000.json';
import data2001 from '../data/2001.json';
import data2002 from '../data/2002.json';
import data2003 from '../data/2003.json';
import data2004 from '../data/2004.json';
import data2005 from '../data/2005.json';
import data2006 from '../data/2006.json';
import data2007 from '../data/2007.json';
import data2008 from '../data/2008.json';
import data2009 from '../data/2009.json';
import data2015 from '../data/2015.json';
import data2020 from '../data/2020.json';
import data2021 from '../data/2021.json';
import data2022 from '../data/2022.json';
import data2023 from '../data/2023.json';
import data2024 from '../data/2024.json';
import data2025 from '../data/2025.json';
import data2010 from '../data/2010.json';
import data2011 from '../data/2011.json';
import data2012 from '../data/2012.json';
import data2013 from '../data/2013.json';
import data2014 from '../data/2014.json';
import data2016 from '../data/2016.json';
import data2017 from '../data/2017.json';
import data2018 from '../data/2018.json';
import data2019 from '../data/2019.json';

// BR Data Imports
import data1963BR from '../data/br/1963-BR.json';
import data1984BR from '../data/br/1984-BR.json';
import data1985BR from '../data/br/1985-BR.json';
import data1986BR from '../data/br/1986-BR.json';
import data1987BR from '../data/br/1987-BR.json';
import data1988BR from '../data/br/1988-BR.json';
import data1989BR from '../data/br/1989-BR.json';
import data1991BR from '../data/br/1991-BR.json';
import data1992BR from '../data/br/1992-BR.json';
import data1993BR from '../data/br/1993-BR.json';
import data1995BR from '../data/br/1995-BR.json';
import data1997BR from '../data/br/1997-BR.json';
import data1999BR from '../data/br/1999-BR.json';
import data2000BR from '../data/br/2000-BR.json';
import data2001BR from '../data/br/2001-BR.json';
import data2002BR from '../data/br/2002-BR.json';
import data2003BR from '../data/br/2003-BR.json';
import data2004BR from '../data/br/2004-BR.json';
import data2005BR from '../data/br/2005-BR.json';
import data2006BR from '../data/br/2006-BR.json';
import data2007BR from '../data/br/2007-BR.json';
import data2008BR from '../data/br/2008-BR.json';
import data2009BR from '../data/br/2009-BR.json';
import data2010BR from '../data/br/2010-BR.json';
import data2011BR from '../data/br/2011-BR.json';
import data2012BR from '../data/br/2012-BR.json';
import data2013BR from '../data/br/2013-BR.json';
import data2014BR from '../data/br/2014-BR.json';
import data2015BR from '../data/br/2015-BR.json';
import data2016BR from '../data/br/2016-BR.json';
import data2017BR from '../data/br/2017-BR.json';
import data2018BR from '../data/br/2018-BR.json';
import data2019BR from '../data/br/2019-BR.json';
import data2020BR from '../data/br/2020-BR.json';
import data2021BR from '../data/br/2021-BR.json';
import data2022BR from '../data/br/2022-BR.json';
import data2023BR from '../data/br/2023-BR.json';

const INTL_DATA = [...data1988, ...data1989, ...data1987, ...data1986, ...data1985, ...data1984, ...data1983, ...data1982, ...data1981, ...data1980, ...data1979, ...data1978, ...data1977, ...data1976, ...data1975, ...data1974, ...data1973, ...data1972, ...data1971, ...data1970, ...data1969, ...data1968, ...data1967, ...data1966, ...data1965, ...data1964, ...data1963, ...data1990, ...data1991, ...data1992, ...data1993, ...data1994, ...data1995, ...data1996, ...data1997, ...data1998, ...data1999, ...data2000, ...data2001, ...data2002, ...data2003, ...data2004, ...data2005, ...data2006, ...data2007, ...data2008, ...data2009, ...data2010, ...data2011, ...data2012, ...data2013, ...data2014, ...data2015, ...data2016, ...data2017, ...data2018, ...data2019, ...data2020, ...data2021, ...data2022, ...data2023, ...data2024, ...data2025];
const BR_DATA = [...data1963BR, ...data1984BR, ...data1985BR, ...data1986BR, ...data1987BR, ...data1988BR, ...data1989BR, ...data1991BR, ...data1992BR, ...data1993BR, ...data1995BR, ...data1997BR, ...data1999BR, ...data2000BR, ...data2001BR, ...data2002BR, ...data2003BR, ...data2004BR, ...data2005BR, ...data2006BR, ...data2007BR, ...data2008BR, ...data2009BR, ...data2010BR, ...data2011BR, ...data2012BR, ...data2013BR, ...data2014BR, ...data2015BR, ...data2016BR, ...data2017BR, ...data2018BR, ...data2019BR, ...data2020BR, ...data2021BR, ...data2022BR, ...data2023BR].map(item => ({ ...item, nationality: 'BR' }));

// Helper to get dataset by region
const getDataset = (region: 'br' | 'intl' | 'all') => {
    if (region === 'br') return BR_DATA;
    if (region === 'intl') return INTL_DATA;
    return [...INTL_DATA, ...BR_DATA];
}

export const TOTAL_VIDEOS_COUNT = INTL_DATA.length + BR_DATA.length;
export const INTL_VIDEOS_COUNT = INTL_DATA.length;
export const BR_VIDEOS_COUNT = BR_DATA.length;

/**
 * Helper to extract YouTube ID from various URL formats
 */
function getYouTubeId(url: string): string | undefined {
  if (!url) return undefined;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : undefined;
}

/**
 * Helper to generate thumbnail URLs
 */
function getHighQualityThumbnail(videoId: string) {
  return {
    o: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    l: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    t: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  };
}

/**
 * Shuffle array
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Main Fetch Function
 */
export const fetchVideosByCriteria = async (type: 'year' | 'decade' | 'all', value: string, region: 'br' | 'intl' | 'all' = 'intl'): Promise<Video[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const sourceData = getDataset(region);
  let filtered = sourceData;

  if (type === 'year') {
    const year = parseInt(value);
    filtered = sourceData.filter(v => v.year === year);
  } else if (type === 'decade') {
    const startYear = parseInt(value);
    const endYear = startYear + 9;
    filtered = sourceData.filter(v => v.year >= startYear && v.year <= endYear);
  } else if (type === 'all') {
    // No filtering needed, use all data
    filtered = sourceData;
  }

  // Map to Video type
  const mapped = filtered.map(item => {
    const i = item as any;
    const embedId = getYouTubeId(i.youtube_link || '') || getYouTubeId(i.imvdb_url || '');
    const artistName = String(i.artist || i.artist_name || 'Unknown');
    
    return {
      id: i.id,
      song_title: i.song_title,
      artists: [{ name: artistName, slug: artistName.toLowerCase().replace(/ /g, '-') }],
      year: i.year,
      url: i.imvdb_url,
      embed_id: embedId,
      image: embedId ? getHighQualityThumbnail(embedId) : undefined,
      source: 'youtube',
      artist_genre: i.artist_genre,
      nationality: i.nationality || 'INTL'
    } as Video;
  }).filter(v => v.embed_id); // Only return videos with valid IDs

  return shuffleArray(mapped);
};

/**
 * Fetch a specific video by ID (for deep linking)
 */
export const fetchVideoById = async (id: string | number): Promise<Video | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log(`[Grooovio Fetch] Looking for ID: ${id}`);
  const allData = getDataset('all');
  console.log(`[Grooovio Fetch] RAW_DATA length: ${allData.length}`);

  const found = allData.find((v: any) => v.id && v.id.toString() === id.toString());
  
  if (!found) {
    console.warn(`[Grooovio Fetch] Video not found in RAW_DATA for ID: ${id}`);
    return undefined;
  }

  console.log(`[Grooovio Fetch] Found raw entry:`, found);

  const i = found as any;
  const embedId = getYouTubeId(i.youtube_link || '') || getYouTubeId(i.imvdb_url || '');
  
  console.log(`[Grooovio Fetch] Extracted Embed ID: ${embedId}`);

  if (!embedId) {
    console.warn(`[Grooovio Fetch] Could not extract Embed ID for video ${id}`);
    return undefined;
  }

  const artistName = String(i.artist || i.artist_name || 'Unknown');

  return {
    id: i.id,
    song_title: i.song_title,
    artists: [{ name: artistName, slug: artistName.toLowerCase().replace(/ /g, '-') }],
    year: i.year,
    url: i.imvdb_url,
    embed_id: embedId,
    image: getHighQualityThumbnail(embedId),
    source: 'youtube',
    artist_genre: i.artist_genre,
    nationality: i.nationality || 'INTL'
  } as Video;
};

/**
 * Calculate genre statistics
 */
export const getGenreStatistics = (): Record<string, number> => {
  const allData = getDataset('all');
  
  const genreMap: Record<string, string[]> = {
    'Rock Alternativo': ['Alternative Rock', 'Grunge', 'Indie Rock', 'Post-Grunge', 'Shoegaze', 'Britpop', 'Folk Rock', 'Alternative'],
    'Punk': ['Punk', 'Pop Punk', 'Ska Punk', 'Hardcore'],
    'Metal': ['Metal', 'Heavy Metal', 'Thrash Metal', 'Nu Metal', 'Industrial Metal', 'Groove Metal', 'Death Metal', 'Black Metal'],
    'Rap': ['Hip Hop', 'Rap', 'Gangsta Rap', 'Alternative Hip Hop', 'Jazz Rap'],
    'Pop': ['Pop', 'Pop Rock', 'Synth-pop', 'Teen Pop', 'Dance-Pop', 'Europop', 'Boy Band', 'Girl Group'],
    'Dance': ['Dance', 'Eurodance', 'House', 'Techno', 'Trance', 'Electronic', 'Disco'],
    'Eletronico': ['Electronic', 'Techno', 'Trance', 'House', 'Big Beat', 'Trip Hop', 'Electronica', 'Industrial', 'Drum and Bass', 'Jungle'],
    'Hard Rock': ['Hard Rock', 'Glam Metal', 'Stoner Rock'],
    'Hardcore': ['Hardcore', 'Hardcore Punk', 'Post-Hardcore'],
    'Industrial': ['Industrial', 'Industrial Metal', 'Industrial Rock'],
    'Nu Metal': ['Nu Metal', 'Rap Metal', 'Alternative Metal'],
    'Indie': ['Indie', 'Indie Rock', 'Indie Pop', 'Garage Rock', 'Shoegaze', 'Britpop'],
    'Rock': ['Rock', 'Classic Rock', 'Rock and Roll', 'Southern Rock'],
    'R&B': ['R&B', 'Soul', 'Funk', 'Neo-Soul', 'Contemporary R&B'],
    'Latin Pop': ['Latin Pop', 'Latin', 'Reggaeton', 'Latin Rock'],
    'K-Pop': ['K-Pop', 'Korean Pop'],
    'Folk': ['Folk', 'Folk Rock', 'Indie Folk', 'Contemporary Folk'],
    'Gótico': ['Gótico', 'Goth', 'Gothic Rock', 'Dark Wave', 'Post-Punk', 'Ethereal Wave', 'Gothic Metal'],
    'Ska': ['Ska', 'Ska Punk', 'Two Tone', 'Rocksteady'],
    'Reggae': ['Reggae', 'Reggaeton'],
    'Clássicos': []
  };

  const genreCounts: Record<string, number> = {};

  // Initialize counts
  Object.keys(genreMap).forEach(genre => {
    genreCounts[genre] = 0;
  });

  // Count videos per genre
  allData.forEach((video: any) => {
    const artistGenre = video.artist_genre;
    const year = video.year;

    if (year && year >= 1960 && year <= 1999) {
      genreCounts['Clássicos']++;
    }

    if (artistGenre) {
      Object.entries(genreMap).forEach(([genreName, keywords]) => {
        if (keywords.some(keyword => artistGenre.includes(keyword) || artistGenre === keyword)) {
          genreCounts[genreName]++;
        }
      });
    }
  });

  return genreCounts;
};

/**
 * Get Top Artists by video count
 */
export const getTopArtists = (limit: number = 5) => {
  const allData = getDataset('all');
  const artistCounts: Record<string, number> = {};

  allData.forEach((video: any) => {
    // Normalize artist name: remove extra spaces and handle "feat." if simple
    // For now, use the main artist field
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

/**
 * Get Collection Highlights
 */
export const getCollectionHighlights = () => {
  const allData = getDataset('all');
  
  // 1. Oldest Video
  // Filter for valid years (e.g., > 1900) to avoid bad data
  const validYearVideos = allData.filter((v: any) => v.year && v.year > 1900).sort((a: any, b: any) => a.year - b.year);
  const oldest = validYearVideos.length > 0 ? validYearVideos[0] : null;

  // 2. Golden Year (Year with most videos)
  const yearCounts: Record<number, number> = {};
  allData.forEach((v: any) => {
    if (v.year) {
      yearCounts[v.year] = (yearCounts[v.year] || 0) + 1;
    }
  });

  const sortedYears = Object.entries(yearCounts).sort((a, b) => b[1] - a[1]);
  const goldenYear = sortedYears.length > 0 ? { year: parseInt(sortedYears[0][0]), count: sortedYears[0][1] } : null;

  return {
    oldest: oldest ? { 
        title: oldest.song_title, 
        artist: oldest.artist || oldest.artist_name, 
        year: oldest.year 
    } : null,
    goldenYear
  };
};
