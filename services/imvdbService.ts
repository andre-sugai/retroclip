import { Video } from '../types';

// Provided Database for 1994 (Validated Subset)
const RAW_DATA = [
  { "artist": "Brownstone", "song_title": "Grapevyne", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=3E5bg02oauA", "imvdb_url": "https://imvdb.com/video/brownstone/grapevyne" },
  { "artist": "Soundgarden", "song_title": "Black Hole Sun", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=3mbBbFH9fAg", "imvdb_url": "https://imvdb.com/video/soundgarden/black-hole-sun" },
  { "artist": "Silverchair", "song_title": "Tomorrow", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=RZD982yrmx4", "imvdb_url": "https://imvdb.com/video/silverchair/tomorrow" },
  { "artist": "Beastie Boys", "song_title": "Sabotage", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=z5rRZdiu1UE", "imvdb_url": "https://imvdb.com/video/beastie-boys/sabotage" },
  { "artist": "Green Day", "song_title": "Basket Case", "year": 1994, "artist_genre": "Punk", "youtube_link": "https://www.youtube.com/watch?v=NUTGr5t3MoY", "imvdb_url": "https://imvdb.com/video/green-day/basket-case" },
  { "artist": "Weezer", "song_title": "Buddy Holly", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=kemivUKb4f4", "imvdb_url": "https://imvdb.com/video/weezer/buddy-holly" },
  { "artist": "The Offspring", "song_title": "Come Out And Play", "year": 1994, "artist_genre": "Punk", "youtube_link": "https://www.youtube.com/watch?v=1jOk8dk-qaU", "imvdb_url": "https://imvdb.com/video/the-offspring/come-out-and-play" },
  { "artist": "Nirvana", "song_title": "About A Girl (MTV Unplugged)", "year": 1994, "artist_genre": "Grunge", "youtube_link": "https://www.youtube.com/watch?v=AhcttcXcRYY", "imvdb_url": "https://imvdb.com/video/nirvana/about-a-girl" },
  { "artist": "Beck", "song_title": "Loser", "year": 1994, "artist_genre": "Alternative", "youtube_link": "https://www.youtube.com/watch?v=YgSPaXgAdzE", "imvdb_url": "https://imvdb.com/video/beck/loser" },
  { "artist": "Coolio", "song_title": "Fantastic Voyage", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=a3QAHZicSjQ", "imvdb_url": "https://imvdb.com/video/coolio/fantastic-voyage" },
  { "artist": "Warren G", "song_title": "Regulate", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=1plPyJdXKIY", "imvdb_url": "https://imvdb.com/video/warren-g/regulate" },
  { "artist": "Oasis", "song_title": "Supersonic", "year": 1994, "artist_genre": "Britpop", "youtube_link": "https://www.youtube.com/watch?v=FOTsS2mplA0", "imvdb_url": "https://imvdb.com/video/oasis/supersonic" },
  { "artist": "TLC", "song_title": "Creep", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=LlZydtG3xqI", "imvdb_url": "https://imvdb.com/video/tlc/creep" },
  { "artist": "TLC", "song_title": "Waterfalls", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=8WEtxJ4-sh4", "imvdb_url": "https://imvdb.com/video/tlc/waterfalls" },
  { "artist": "Madonna", "song_title": "Secret", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=EPHUZenprKc", "imvdb_url": "https://imvdb.com/video/madonna/secret" },
  { "artist": "Jamiroquai", "song_title": "Space Cowboy", "year": 1994, "artist_genre": "Funk", "youtube_link": "https://www.youtube.com/watch?v=OPkjnRIdQXQ", "imvdb_url": "https://imvdb.com/video/jamiroquai/space-cowboy" },
  { "artist": "Bon Jovi", "song_title": "Always", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=9BMwcO6_hyA", "imvdb_url": "https://imvdb.com/video/bon-jovi/always" },
  { "artist": "The Cranberries", "song_title": "Zombie", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=6Ejga4kJUts", "imvdb_url": "https://imvdb.com/video/the-cranberries/zombie" },
  { "artist": "Blur", "song_title": "Parklife", "year": 1994, "artist_genre": "Britpop", "youtube_link": "https://www.youtube.com/watch?v=SIEsmGzo2UE", "imvdb_url": "https://imvdb.com/video/blur/parklife" },
  { "artist": "Aerosmith", "song_title": "Crazy", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=NMNgbISmF4I", "imvdb_url": "https://imvdb.com/video/aerosmith/crazy" },
  { "artist": "R.E.M.", "song_title": "What's The Frequency, Kenneth?", "year": 1994, "artist_genre": "Alternative", "youtube_link": "https://www.youtube.com/watch?v=jWkMhCLkVOg", "imvdb_url": "https://imvdb.com/video/r.e.m./whats-the-frequency-kenneth" },
  { "artist": "Sheryl Crow", "song_title": "All I Wanna Do", "year": 1994, "artist_genre": "Pop Rock", "youtube_link": "https://www.youtube.com/watch?v=yAEpLMTjCC8", "imvdb_url": "https://imvdb.com/video/sheryl-crow/all-i-wanna-do" },
  { "artist": "Seal", "song_title": "Kiss From A Rose", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=ateQQc-AgEM", "imvdb_url": "https://imvdb.com/video/seal/kiss-from-a-rose" },
  { "artist": "Nine Inch Nails", "song_title": "Closer", "year": 1994, "artist_genre": "Industrial", "youtube_link": "https://www.youtube.com/watch?v=PTFwQP86BRs", "imvdb_url": "https://imvdb.com/video/nine-inch-nails/closer" },
  { "artist": "Nas", "song_title": "The World Is Yours", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=e5PnuIRnJW8", "imvdb_url": "https://imvdb.com/video/nas/the-world-is-yours" },
  { "artist": "The Notorious B.I.G.", "song_title": "Juicy", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=_JZom_gVfuw", "imvdb_url": "https://imvdb.com/video/the-notorious-big/juicy" },
  { "artist": "Soundgarden", "song_title": "Spoonman", "year": 1994, "artist_genre": "Grunge", "youtube_link": "https://www.youtube.com/watch?v=T0_zzCLLRvE", "imvdb_url": "https://imvdb.com/video/soundgarden/spoonman" },
  { "artist": "Rednex", "song_title": "Cotton Eye Joe", "year": 1994, "artist_genre": "Eurodance", "youtube_link": "https://www.youtube.com/watch?v=VcDy8HEg1QY", "imvdb_url": "https://imvdb.com/video/rednex/cotton-eye-joe" },
  { "artist": "Crash Test Dummies", "song_title": "Mmm Mmm Mmm Mmm", "year": 1994, "artist_genre": "Alternative", "youtube_link": "https://www.youtube.com/watch?v=eTeg1txDv8w", "imvdb_url": "https://imvdb.com/video/crash-test-dummies/mmm-mmm-mmm-mmm" },
  { "artist": "Ace of Base", "song_title": "Don't Turn Around", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=INi7srItF6g", "imvdb_url": "https://imvdb.com/video/ace-of-base/dont-turn-around" },
  { "artist": "Boyz II Men", "song_title": "On Bended Knee", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=jSUSFow70no", "imvdb_url": "https://imvdb.com/video/boyz-ii-men/on-bended-knee" },
  { "artist": "Stone Temple Pilots", "song_title": "Vasoline", "year": 1994, "artist_genre": "Grunge", "youtube_link": "https://www.youtube.com/watch?v=ht672-wYelc", "imvdb_url": "https://imvdb.com/video/stone-temple-pilots/vasoline" },
  { "artist": "Salt-N-Pepa", "song_title": "Whatta Man", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=8-WFNbMohTQ", "imvdb_url": "https://imvdb.com/video/salt-n-pepa/whatta-man" },
  { "artist": "Mariah Carey", "song_title": "All I Want for Christmas Is You", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=yXQViqx6GMY", "imvdb_url": "https://imvdb.com/video/mariah-carey/all-i-want-for-christmas-is-you" },
  { "artist": "The Prodigy", "song_title": "No Good (Start the Dance)", "year": 1994, "artist_genre": "Electronic", "youtube_link": "https://www.youtube.com/watch?v=svJvT6ruolA", "imvdb_url": "https://imvdb.com/video/the-prodigy/no-good-start-the-dance" },
  { "artist": "Kylie Minogue", "song_title": "Confide In Me", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=WSFDCmmsqEI", "imvdb_url": "https://imvdb.com/video/kylie-minogue/confide-in-me" },
  { "artist": "Pavement", "song_title": "Cut Your Hair", "year": 1994, "artist_genre": "Indie", "youtube_link": "https://www.youtube.com/watch?v=QTTgpTeb0Z8", "imvdb_url": "https://imvdb.com/video/pavement/cut-your-hair" },
  { "artist": "Hole", "song_title": "Violet", "year": 1994, "artist_genre": "Grunge", "youtube_link": "https://www.youtube.com/watch?v=cH_rfGBwamc", "imvdb_url": "https://imvdb.com/video/hole/violet" },
  { "artist": "Mazzy Star", "song_title": "Fade Into You", "year": 1994, "artist_genre": "Alternative", "youtube_link": "https://www.youtube.com/watch?v=ImKY6TZEyrI", "imvdb_url": "https://imvdb.com/video/mazzy-star/fade-into-you" },
  { "artist": "Portishead", "song_title": "Sour Times", "year": 1994, "artist_genre": "Trip Hop", "youtube_link": "https://www.youtube.com/watch?v=AWXr68l6ACQ", "imvdb_url": "https://imvdb.com/video/portishead/sour-times" },
  { "artist": "Alice In Chains", "song_title": "I Stay Away", "year": 1994, "artist_genre": "Grunge", "youtube_link": "https://www.youtube.com/watch?v=ODTv9Lt5WYs", "imvdb_url": "https://imvdb.com/video/alice-in-chains/i-stay-away" },
  { "artist": "Bush", "song_title": "Everything Zen", "year": 1994, "artist_genre": "Grunge", "youtube_link": "https://www.youtube.com/watch?v=Ps317u9Rhl0", "imvdb_url": "https://imvdb.com/video/bush/everything-zen" },
  { "artist": "Live", "song_title": "Lightning Crashes", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=xsJ4O-nSveg", "imvdb_url": "https://imvdb.com/video/live/lightning-crashes" },
  { "artist": "Veruca Salt", "song_title": "Seether", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=jC9AUR-iTo0", "imvdb_url": "https://imvdb.com/video/veruca-salt/seether" },
  { "artist": "Snoop Dogg", "song_title": "Gin and Juice", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=0Cxr1-b6Xkc", "imvdb_url": "https://imvdb.com/video/snoop-dogg/gin-and-juice" },
  { "artist": "Céline Dion", "song_title": "Think Twice", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=vGwIaL0jOUg", "imvdb_url": "https://imvdb.com/video/celine-dion/think-twice" },
  { "artist": "Youssou N'Dour", "song_title": "7 Seconds", "year": 1994, "artist_genre": "World", "youtube_link": "https://www.youtube.com/watch?v=wqCpjFMvz-k", "imvdb_url": "https://imvdb.com/video/youssou-ndour/7-seconds" },
  { "artist": "Lucas", "song_title": "Lucas With The Lid Off", "year": 1994, "artist_genre": "Hip Hop", "youtube_link": "https://www.youtube.com/watch?v=sY5zaDZq0sc", "imvdb_url": "https://imvdb.com/video/lucas/lucas-with-the-lid-off" },
  { "artist": "Des'ree", "song_title": "You Gotta Be", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=pO40TcKa_5U", "imvdb_url": "https://imvdb.com/video/desree/you-gotta-be" },
  { "artist": "R. Kelly", "song_title": "Bump N' Grind", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=uAXxkNaRkp8", "imvdb_url": "https://imvdb.com/video/r.-kelly/bump-n-grind" },
  { "artist": "Janet Jackson", "song_title": "Any Time, Any Place", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=3HO9H1VMMOk", "imvdb_url": "https://imvdb.com/video/janet-jackson/any-time-any-place" },
  { "artist": "The Rolling Stones", "song_title": "Love Is Strong", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=TeT4l-o48Dk", "imvdb_url": "https://imvdb.com/video/the-rolling-stones/love-is-strong" },
  { "artist": "Elton John", "song_title": "Can You Feel The Love Tonight", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=Y1hcc1QvM2Q", "imvdb_url": "https://imvdb.com/video/elton-john/can-you-feel-the-love-tonight" },
  { "artist": "Hootie & The Blowfish", "song_title": "Hold My Hand", "year": 1994, "artist_genre": "Rock", "youtube_link": "https://www.youtube.com/watch?v=xoW3bqnr7tw", "imvdb_url": "https://imvdb.com/video/hootie-and-the-blowfish/hold-my-hand" },
  { "artist": "Aaliyah", "song_title": "At Your Best (You Are Love)", "year": 1994, "artist_genre": "R&B", "youtube_link": "https://www.youtube.com/watch?v=8D1Zn-Ij6Mw", "imvdb_url": "https://imvdb.com/video/aaliyah/at-your-best-you-are-love" },
  { "artist": "Mariah Carey", "song_title": "Anytime You Need a Friend", "year": 1994, "artist_genre": "Pop", "youtube_link": "https://www.youtube.com/watch?v=Li6BurNVrr8", "imvdb_url": "https://imvdb.com/video/mariah-carey/anytime-you-need-a-friend" }
];

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
      artists: [{ name: item.artist, slug: item.artist.toLowerCase().replace(/ /g, '-') }],
      year: item.year,
      url: item.imvdb_url,
      embed_id: embedId,
      image: getHighQualityThumbnail(embedId),
      source: 'youtube'
    };
  }).filter(Boolean) as Video[];
};
