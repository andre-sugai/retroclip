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
import data2022 from '../data/2022.json';
import data2023 from '../data/2023.json';

const RAW_DATA = [...data1988, ...data1989, ...data1987, ...data1986, ...data1985, ...data1984, ...data1983, ...data1982, ...data1981, ...data1980, ...data1979, ...data1978, ...data1977, ...data1976, ...data1975, ...data1974, ...data1973, ...data1972, ...data1971, ...data1970, ...data1969, ...data1968, ...data1967, ...data1966, ...data1965, ...data1964, ...data1963, ...data1990, ...data1991, ...data1992, ...data1993, ...data1994, ...data1995, ...data1996, ...data1997, ...data1998, ...data1999, ...data2000, ...data2001, ...data2002, ...data2003, ...data2004, ...data2005, ...data2006, ...data2007, ...data2008, ...data2009, ...data2015, ...data2022, ...data2023];
console.log(`[Groovio Data] Loaded 1999 data:`, data1999 ? data1999.length : 'undefined');
console.log(`[Groovio Data] Total RAW_DATA:`, RAW_DATA.length);
export const TOTAL_VIDEOS_COUNT = RAW_DATA.length;

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
export const fetchVideosByCriteria = async (type: 'year' | 'decade' | 'all', value: string): Promise<Video[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filtered = RAW_DATA;

  if (type === 'year') {
    const year = parseInt(value);
    filtered = RAW_DATA.filter(v => v.year === year);
  } else if (type === 'decade') {
    const startYear = parseInt(value);
    const endYear = startYear + 9;
    filtered = RAW_DATA.filter(v => v.year >= startYear && v.year <= endYear);
  } else if (type === 'all') {
    // No filtering needed, use all data
    filtered = RAW_DATA;
  }

  // Map to Video type
  const mapped = filtered.map(item => {
    const embedId = getYouTubeId(item.youtube_link || '') || getYouTubeId(item.imvdb_url || '');
    const i = item as any;
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
      artist_genre: i.artist_genre
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

  console.log(`[Groovio Fetch] Looking for ID: ${id}`);
  console.log(`[Groovio Fetch] RAW_DATA length: ${RAW_DATA.length}`);

  const found = RAW_DATA.find((v: any) => v.id && v.id.toString() === id.toString());
  
  if (!found) {
    console.warn(`[Groovio Fetch] Video not found in RAW_DATA for ID: ${id}`);
    return undefined;
  }

  console.log(`[Groovio Fetch] Found raw entry:`, found);

  const i = found as any;
  const embedId = getYouTubeId(i.youtube_link || '') || getYouTubeId(i.imvdb_url || '');
  
  console.log(`[Groovio Fetch] Extracted Embed ID: ${embedId}`);

  if (!embedId) {
    console.warn(`[Groovio Fetch] Could not extract Embed ID for video ${id}`);
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
    artist_genre: i.artist_genre
  } as Video;
};
