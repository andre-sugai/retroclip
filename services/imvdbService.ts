import { Video } from '../types';

// Provided Database for 1994 (Validated Subset)
// Provided Database for 1994 (Validated Subset)
// Provided Database for 1994 (Validated Subset)
// Provided Database for 1994 (Validated Subset)
import data1999 from '../data/clipes/global/1999.json';
import data1998 from '../data/clipes/global/1998.json';
import data1997 from '../data/clipes/global/1997.json';
import data1996 from '../data/clipes/global/1996.json';
import data1995 from '../data/clipes/global/1995.json';
import data1994 from '../data/clipes/global/1994.json';
import data1993 from '../data/clipes/global/1993.json';
import data1992 from '../data/clipes/global/1992.json';
import data1991 from '../data/clipes/global/1991.json';
import data1990 from '../data/clipes/global/1990.json';
import data1989 from '../data/clipes/global/1989.json';
import data1988 from '../data/clipes/global/1988.json';
import data1987 from '../data/clipes/global/1987.json';
import data1986 from '../data/clipes/global/1986.json';
import data1985 from '../data/clipes/global/1985.json';
import data1984 from '../data/clipes/global/1984.json';
import data1983 from '../data/clipes/global/1983.json';
import data1982 from '../data/clipes/global/1982.json';
import data1981 from '../data/clipes/global/1981.json';
import data1980 from '../data/clipes/global/1980.json';
import data1978 from '../data/clipes/global/1978.json';
import data1979 from '../data/clipes/global/1979.json';
import data1977 from '../data/clipes/global/1977.json';
import data1976 from '../data/clipes/global/1976.json';
import data1975 from '../data/clipes/global/1975.json';
import data1974 from '../data/clipes/global/1974.json';
import data1973 from '../data/clipes/global/1973.json';
import data1972 from '../data/clipes/global/1972.json';
import data1971 from '../data/clipes/global/1971.json';
import data1970 from '../data/clipes/global/1970.json';
import data1969 from '../data/clipes/global/1969.json';
import data1968 from '../data/clipes/global/1968.json';
import data1967 from '../data/clipes/global/1967.json';
import data1966 from '../data/clipes/global/1966.json';
import data1965 from '../data/clipes/global/1965.json';
import data1964 from '../data/clipes/global/1964.json';
import data1963 from '../data/clipes/global/1963.json';
import data1960 from '../data/clipes/global/1960.json';
import data2000 from '../data/clipes/global/2000.json';
import data2001 from '../data/clipes/global/2001.json';
import data2002 from '../data/clipes/global/2002.json';
import data2003 from '../data/clipes/global/2003.json';
import data2004 from '../data/clipes/global/2004.json';
import data2005 from '../data/clipes/global/2005.json';
import data2006 from '../data/clipes/global/2006.json';
import data2007 from '../data/clipes/global/2007.json';
import data2008 from '../data/clipes/global/2008.json';
import data2009 from '../data/clipes/global/2009.json';
import data2015 from '../data/clipes/global/2015.json';
import data2020 from '../data/clipes/global/2020.json';
import data2021 from '../data/clipes/global/2021.json';
import data2022 from '../data/clipes/global/2022.json';
import data2023 from '../data/clipes/global/2023.json';
import data2024 from '../data/clipes/global/2024.json';
import data2025 from '../data/clipes/global/2025.json';
import data2010 from '../data/clipes/global/2010.json';
import data2011 from '../data/clipes/global/2011.json';
import data2012 from '../data/clipes/global/2012.json';
import data2013 from '../data/clipes/global/2013.json';
import data2014 from '../data/clipes/global/2014.json';
import data2016 from '../data/clipes/global/2016.json';
import data2017 from '../data/clipes/global/2017.json';
import data2018 from '../data/clipes/global/2018.json';
import data2019 from '../data/clipes/global/2019.json';

// BR Data Imports
import data1929BR from '../data/clipes/brasil/1929-BR.json';
import data1936BR from '../data/clipes/brasil/1936-BR.json';
import data1949BR from '../data/clipes/brasil/1949-BR.json';
import data1950BR from '../data/clipes/brasil/1950-BR.json';
import data1959BR from '../data/clipes/brasil/1959-BR.json';
import data1960BR from '../data/clipes/brasil/1960-BR.json';
import data1962BR from '../data/clipes/brasil/1962-BR.json';
import data1963BR from '../data/clipes/brasil/1963-BR.json';
import data1966BR from '../data/clipes/brasil/1966-BR.json';
import data1967BR from '../data/clipes/brasil/1967-BR.json';
import data1969BR from '../data/clipes/brasil/1969-BR.json';
import data1970BR from '../data/clipes/brasil/1970-BR.json';
import data1972BR from '../data/clipes/brasil/1972-BR.json';
import data1973BR from '../data/clipes/brasil/1973-BR.json';
import data1974BR from '../data/clipes/brasil/1974-BR.json';
import data1975BR from '../data/clipes/brasil/1975-BR.json';
import data1976BR from '../data/clipes/brasil/1976-BR.json';
import data1977BR from '../data/clipes/brasil/1977-BR.json';
import data1978BR from '../data/clipes/brasil/1978-BR.json';
import data1980BR from '../data/clipes/brasil/1980-BR.json';
import data1983BR from '../data/clipes/brasil/1983-BR.json';
import data1984BR from '../data/clipes/brasil/1984-BR.json';
import data1985BR from '../data/clipes/brasil/1985-BR.json';
import data1986BR from '../data/clipes/brasil/1986-BR.json';
import data1987BR from '../data/clipes/brasil/1987-BR.json';
import data1988BR from '../data/clipes/brasil/1988-BR.json';
import data1989BR from '../data/clipes/brasil/1989-BR.json';
import data1990BR from '../data/clipes/brasil/1990-BR.json';
import data1991BR from '../data/clipes/brasil/1991-BR.json';
import data1992BR from '../data/clipes/brasil/1992-BR.json';
import data1993BR from '../data/clipes/brasil/1993-BR.json';
import data1994BR from '../data/clipes/brasil/1994-BR.json';
import data1995BR from '../data/clipes/brasil/1995-BR.json';
import data1996BR from '../data/clipes/brasil/1996-BR.json';
import data1997BR from '../data/clipes/brasil/1997-BR.json';
import data1999BR from '../data/clipes/brasil/1999-BR.json';
import data2000BR from '../data/clipes/brasil/2000-BR.json';
import data2001BR from '../data/clipes/brasil/2001-BR.json';
import data2002BR from '../data/clipes/brasil/2002-BR.json';
import data2003BR from '../data/clipes/brasil/2003-BR.json';
import data2004BR from '../data/clipes/brasil/2004-BR.json';
import data2005BR from '../data/clipes/brasil/2005-BR.json';
import data2006BR from '../data/clipes/brasil/2006-BR.json';
import data2007BR from '../data/clipes/brasil/2007-BR.json';
import data2008BR from '../data/clipes/brasil/2008-BR.json';
import data2009BR from '../data/clipes/brasil/2009-BR.json';
import data2010BR from '../data/clipes/brasil/2010-BR.json';
import data2011BR from '../data/clipes/brasil/2011-BR.json';
import data2012BR from '../data/clipes/brasil/2012-BR.json';
import data2013BR from '../data/clipes/brasil/2013-BR.json';
import data2014BR from '../data/clipes/brasil/2014-BR.json';
import data2015BR from '../data/clipes/brasil/2015-BR.json';
import data2016BR from '../data/clipes/brasil/2016-BR.json';
import data2017BR from '../data/clipes/brasil/2017-BR.json';
import data2018BR from '../data/clipes/brasil/2018-BR.json';
import data2019BR from '../data/clipes/brasil/2019-BR.json';
import data2020BR from '../data/clipes/brasil/2020-BR.json';
import data2021BR from '../data/clipes/brasil/2021-BR.json';
import data2022BR from '../data/clipes/brasil/2022-BR.json';
import data2023BR from '../data/clipes/brasil/2023-BR.json';
import data2024BR from '../data/clipes/brasil/2024-BR.json';
import data2025BR from '../data/clipes/brasil/2025-BR.json';
import data2026BR from '../data/clipes/brasil/2026-BR.json';

// Programs Imports
import hermesRenatoData from '../data/programas/hermes_e_renato.json';
import beavisButtheadData from '../data/programas/beavis_and_butthead.json';
import documentariosData from '../data/programas/documentarios.json';

const PROGRAMS_DATA = [
  ...hermesRenatoData.map((item) => ({ ...item, is_program: true, program_name: 'hermes_renato' })),
  ...beavisButtheadData.map((item) => ({ ...item, is_program: true, program_name: 'beavis_butthead' })),
  ...documentariosData.map((item) => ({ ...item, is_program: true, program_name: 'documentarios' })),
];


// Global Shows Imports
import show1979 from '../data/shows/global/1979.json';
import show1985 from '../data/shows/global/1985.json';
import show1991 from '../data/shows/global/1991.json';
import show1992 from '../data/shows/global/1992.json';
import show1993 from '../data/shows/global/1993.json';
import show1994 from '../data/shows/global/1994.json';
import show1997 from '../data/shows/global/1997.json';
import show1999 from '../data/shows/global/1999.json';
import show2002 from '../data/shows/global/2002.json';
import show2003 from '../data/shows/global/2003.json';
import show2007 from '../data/shows/global/2007.json';
import show2008 from '../data/shows/global/2008.json';
import show2009 from '../data/shows/global/2009.json';
import show2011 from '../data/shows/global/2011.json';
import show2012 from '../data/shows/global/2012.json';
import show2014 from '../data/shows/global/2014.json';
import show2015 from '../data/shows/global/2015.json';
import show2017 from '../data/shows/global/2017.json';
import show2021 from '../data/shows/global/2021.json';
import show2023 from '../data/shows/global/2023.json';
import show2025 from '../data/shows/global/2025.json';

const SHOWS_GLOBAL = [
  ...show1979,
  ...show1985,
  ...show1991,
  ...show1992,
  ...show1993,
  ...show1994,
  ...show1997,
  ...show1999,
  ...show2002,
  ...show2003,
  ...show2007,
  ...show2008,
  ...show2009,
  ...show2011,
  ...show2012,
  ...show2014,
  ...show2015,
  ...show2017,
  ...show2021,
  ...show2023,
  ...show2025,
].map((item) => ({ ...item, is_show: true }));

// Brazil Shows Imports
import show1969BR from '../data/shows/brasil/1969.json';
import show1972BR from '../data/shows/brasil/1972.json';
import show1986BR from '../data/shows/brasil/1986.json';
import show1991BR from '../data/shows/brasil/1991.json';
import show1992BR from '../data/shows/brasil/1992.json';
import show1997BR from '../data/shows/brasil/1997.json';
import show2005BR from '../data/shows/brasil/2005.json';
import show2007BR from '../data/shows/brasil/2007.json';
import show2009BR from '../data/shows/brasil/2009.json';
import show2011BR from '../data/shows/brasil/2011.json';
import show2012BR from '../data/shows/brasil/2012.json';
import show2013BR from '../data/shows/brasil/2013.json';
import show2014BR from '../data/shows/brasil/2014.json';
import show2015BR from '../data/shows/brasil/2015.json';
import show2016BR from '../data/shows/brasil/2016.json';
import show2017BR from '../data/shows/brasil/2017.json';
import show2018BR from '../data/shows/brasil/2018.json';
import show2019BR from '../data/shows/brasil/2019.json';
import show2020BR from '../data/shows/brasil/2020.json';
import show2021BR from '../data/shows/brasil/2021.json';
import show2022BR from '../data/shows/brasil/2022.json';
import show2023BR from '../data/shows/brasil/2023.json';
import show2024BR from '../data/shows/brasil/2024.json';
import show2025BR from '../data/shows/brasil/2025.json';

const SHOWS_BRASIL = [
  ...show1969BR,
  ...show1972BR,
  ...show1986BR,
  ...show1991BR,
  ...show1992BR,
  ...show1997BR,
  ...show2005BR,
  ...show2007BR,
  ...show2009BR,
  ...show2011BR,
  ...show2012BR,
  ...show2013BR,
  ...show2014BR,
  ...show2015BR,
  ...show2016BR,
  ...show2017BR,
  ...show2018BR,
  ...show2019BR,
  ...show2020BR,
  ...show2021BR,
  ...show2022BR,
  ...show2023BR,
  ...show2024BR,
  ...show2025BR,
].map((item) => ({ ...item, is_show: true }));

const INTL_DATA = [
  ...data1988,
  ...data1989,
  ...data1987,
  ...data1986,
  ...data1985,
  ...data1984,
  ...data1983,
  ...data1982,
  ...data1981,
  ...data1980,
  ...data1979,
  ...data1978,
  ...data1977,
  ...data1976,
  ...data1975,
  ...data1974,
  ...data1973,
  ...data1972,
  ...data1971,
  ...data1970,
  ...data1969,
  ...data1968,
  ...data1967,
  ...data1966,
  ...data1965,
  ...data1964,
  ...data1963,
  ...data1960,
  ...data1990,
  ...data1991,
  ...data1992,
  ...data1993,
  ...data1994,
  ...data1995,
  ...data1996,
  ...data1997,
  ...data1998,
  ...data1999,
  ...data2000,
  ...data2001,
  ...data2002,
  ...data2003,
  ...data2004,
  ...data2005,
  ...data2006,
  ...data2007,
  ...data2008,
  ...data2009,
  ...data2010,
  ...data2011,
  ...data2012,
  ...data2013,
  ...data2014,
  ...data2015,
  ...data2016,
  ...data2017,
  ...data2018,
  ...data2019,
  ...data2020,
  ...data2021,
  ...data2022,
  ...data2023,
  ...data2024,
  ...data2025,
  ...SHOWS_GLOBAL,
];
const BR_DATA = [
  ...data1929BR,
  ...data1936BR,
  ...data1949BR,
  ...data1950BR,
  ...data1959BR,
  ...data1960BR,
  ...data1962BR,
  ...data1963BR,
  ...data1966BR,
  ...data1967BR,
  ...data1969BR,
  ...data1970BR,
  ...data1972BR,
  ...data1973BR,
  ...data1974BR,
  ...data1975BR,
  ...data1976BR,
  ...data1977BR,
  ...data1978BR,
  ...data1980BR,
  ...data1983BR,
  ...data1984BR,
  ...data1985BR,
  ...data1986BR,
  ...data1987BR,
  ...data1988BR,
  ...data1989BR,
  ...data1990BR,
  ...data1991BR,
  ...data1992BR,
  ...data1993BR,
  ...data1994BR,
  ...data1995BR,
  ...data1996BR,
  ...data1997BR,
  ...data1999BR,
  ...data2000BR,
  ...data2001BR,
  ...data2002BR,
  ...data2003BR,
  ...data2004BR,
  ...data2005BR,
  ...data2006BR,
  ...data2007BR,
  ...data2008BR,
  ...data2009BR,
  ...data2010BR,
  ...data2011BR,
  ...data2012BR,
  ...data2013BR,
  ...data2014BR,
  ...data2015BR,
  ...data2016BR,
  ...data2017BR,
  ...data2018BR,
  ...data2019BR,
  ...data2020BR,
  ...data2021BR,
  ...data2022BR,
  ...data2023BR,
  ...data2024BR,
  ...data2025BR,
  ...data2026BR,
  ...SHOWS_BRASIL,
  ...PROGRAMS_DATA,
].map((item) => ({ ...item, nationality: 'BR' }));

// Helper to get dataset by region
const getDataset = (region: 'br' | 'intl' | 'all') => {
  if (region === 'br') return BR_DATA;
  if (region === 'intl') return INTL_DATA;
  return [...INTL_DATA, ...BR_DATA];
};

const allItems = [...INTL_DATA, ...BR_DATA];
export const TOTAL_VIDEOS_COUNT = allItems.length;
export const TOTAL_SHOWS = allItems.filter((i) => (i as any).is_show).length;
export const TOTAL_PROGRAMS = allItems.filter((i) => (i as any).is_program).length;
export const TOTAL_CLIPS = TOTAL_VIDEOS_COUNT - TOTAL_SHOWS - TOTAL_PROGRAMS;


export const INTL_VIDEOS_COUNT = INTL_DATA.length;
export const BR_VIDEOS_COUNT = BR_DATA.length;

/**
 * Helper to extract YouTube ID from various URL formats
 */
function getYouTubeId(url: string): string | undefined {
  if (!url) return undefined;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : undefined;
}

/**
 * Helper to generate thumbnail URLs
 */
function getHighQualityThumbnail(videoId: string) {
  return {
    o: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    l: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    t: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
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
export const fetchVideosByCriteria = async (
  type: 'year' | 'decade' | 'all',
  value: string,
  region: 'br' | 'intl' | 'all' = 'intl'
): Promise<Video[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const sourceData = getDataset(region);
  let filtered = sourceData;

  if (type === 'year') {
    const year = parseInt(value);
    filtered = sourceData.filter((v) => v.year === year);
  } else if (type === 'decade') {
    const startYear = parseInt(value);
    const endYear = startYear + 9;
    filtered = sourceData.filter(
      (v) => v.year >= startYear && v.year <= endYear
    );
  } else if (type === 'all') {
    // No filtering needed, use all data
    filtered = sourceData;
  }

  // Map to Video type
  const mapped = filtered
    .map((item) => {
      const i = item as any;
      const embedId =
        getYouTubeId(i.youtube_link || '') || getYouTubeId(i.imvdb_url || '');
      const artistName = String(i.artist || i.artist_name || 'Unknown');

      return {
        id: i.id,
        song_title: i.song_title,
        artists: [
          {
            name: artistName,
            slug: artistName.toLowerCase().replace(/ /g, '-'),
          },
        ],
        year: i.year,
        url: i.imvdb_url,
        embed_id: embedId,
        image: embedId ? getHighQualityThumbnail(embedId) : undefined,
        source: 'youtube',
        artist_genre: i.artist_genre,
        nationality: i.nationality || 'INTL',
        is_show: i.is_show,
        is_program: i.is_program,
        program_name: i.program_name,
      } as Video;
    })
    .filter((v) => v.embed_id); // Only return videos with valid IDs

  return shuffleArray(mapped);
};

/**
 * Fetch a specific video by ID (for deep linking)
 */
export const fetchVideoById = async (
  id: string | number
): Promise<Video | undefined> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`[Grooovio Fetch] Looking for ID: ${id}`);
  const allData = getDataset('all');
  console.log(`[Grooovio Fetch] RAW_DATA length: ${allData.length}`);

  const found = allData.find(
    (v: any) => v.id && v.id.toString() === id.toString()
  );

  if (!found) {
    console.warn(`[Grooovio Fetch] Video not found in RAW_DATA for ID: ${id}`);
    return undefined;
  }

  console.log(`[Grooovio Fetch] Found raw entry:`, found);

  const i = found as any;
  const embedId =
    getYouTubeId(i.youtube_link || '') || getYouTubeId(i.imvdb_url || '');

  console.log(`[Grooovio Fetch] Extracted Embed ID: ${embedId}`);

  if (!embedId) {
    console.warn(`[Grooovio Fetch] Could not extract Embed ID for video ${id}`);
    return undefined;
  }

  const artistName = String(i.artist || i.artist_name || 'Unknown');

  return {
    id: i.id,
    song_title: i.song_title,
    artists: [
      { name: artistName, slug: artistName.toLowerCase().replace(/ /g, '-') },
    ],
    year: i.year,
    url: i.imvdb_url,
    embed_id: embedId,
    image: getHighQualityThumbnail(embedId),
    source: 'youtube',
    artist_genre: i.artist_genre,
    nationality: i.nationality || 'INTL',
    is_show: i.is_show,
    is_program: i.is_program,
    program_name: i.program_name,
  } as Video;
};

/**
 * Calculate genre statistics
 */
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

/**
 * Calculate genre statistics
 */
export const getGenreStatistics = (): Record<string, number> => {
  const allData = getDataset('all');

  const genreCounts: Record<string, number> = {};

  // Initialize counts
  // Initialize counts
  Object.keys(GENRE_MAP).forEach((genre) => {
    genreCounts[genre] = 0;
  });
  genreCounts['Clássicos'] = 0;

  // Count videos per genre
  allData.forEach((video: any) => {
    const artistGenre = video.artist_genre;
    const year = video.year;

    if (year && year >= 1960 && year <= 1999) {
      genreCounts['Clássicos']++;
    }

    if (artistGenre) {
      Object.entries(GENRE_MAP).forEach(([genreName, keywords]) => {
        if (
          keywords.some(
            (keyword) =>
              artistGenre.includes(keyword) || artistGenre === keyword
          )
        ) {
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
  const validYearVideos = allData
    .filter((v: any) => v.year && v.year > 1900)
    .sort((a: any, b: any) => a.year - b.year);
  const oldest = validYearVideos.length > 0 ? validYearVideos[0] : null;

  // 2. Golden Year (Year with most videos)
  const yearCounts: Record<number, number> = {};
  allData.forEach((v: any) => {
    if (v.year) {
      yearCounts[v.year] = (yearCounts[v.year] || 0) + 1;
    }
  });

  const sortedYears = Object.entries(yearCounts).sort((a, b) => b[1] - a[1]);
  const goldenYear =
    sortedYears.length > 0
      ? { year: parseInt(sortedYears[0][0]), count: sortedYears[0][1] }
      : null;

  return {
    oldest: oldest
      ? {
          title: oldest.song_title,
          artist: oldest.artist || oldest.artist_name,
          year: oldest.year,
        }
      : null,
    goldenYear,
  };
};
