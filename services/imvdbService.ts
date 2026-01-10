import { Video } from '../types';

// Provided Database for 1994 (Validated Subset)
// Provided Database for 1994 (Validated Subset)
import data1996 from '../data/1996.json';
import data1994 from '../data/1994.json';
import data1993 from '../data/1993.json';
import data1992 from '../data/1992.json';
import data1991 from '../data/1991.json';
import data1990 from '../data/1990.json';

const RAW_DATA = [...data1990, ...data1991, ...data1992, ...data1993, ...data1994, ...data1996];
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
export const fetchVideosByCriteria = async (type: 'year' | 'decade', value: string): Promise<Video[]> => {
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
  }

  // Shuffle Results
  const shuffled = shuffleArray(filtered);

  // Map to App Domain
  return shuffled.map((item, index) => {
    const embedId = getYouTubeId(item.youtube_link);
    
    // Fallback if ID extraction fails (shouldn't with this dataset)
    if (!embedId) return null;

    return {
      id: index + 1000,
      song_title: item.song_title,
      artists: [{ name: String(item.artist), slug: String(item.artist).toLowerCase().replace(/ /g, '-') }],
      year: item.year,
      url: item.imvdb_url,
      embed_id: embedId,
      image: getHighQualityThumbnail(embedId),
      source: 'youtube',
      artist_genre: item.artist_genre // Map the genre
    };
  }).filter(Boolean) as Video[];
};
