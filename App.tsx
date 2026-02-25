import React, { useState, useEffect, useMemo } from 'react';
import { PlayerState, SearchParams, Video } from './types';
import {
  fetchVideosByCriteria,
  fetchVideoById,
  TOTAL_VIDEOS_COUNT,
  TOTAL_CLIPS,
  TOTAL_SHOWS,
  TOTAL_PROGRAMS,
  GENRE_MAP,
  loadPinkpopVideos,
  KISS_FM_VIDEO,
  RADIO_89FM_VIDEO,
  getAvailableGenresFromIndex,
} from './services/imvdbService';
import { Sector1Player } from './components/Sector1Player';
import { Sector2Search } from './components/Sector2Search';
import { Sector3Playlist } from './components/Sector3Playlist';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Button } from './components/ui/Button';
import {
  PanelRightClose,
  PanelRightOpen,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Share2,
  Check,
  Info,
  Menu,
  X,
} from 'lucide-react';
import { translations, Language } from './translations';
import { TVStatic } from './components/TVStatic';
import { InfoModal } from './components/InfoModal';
import { useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Channel, Episode } from './types';
import { fetchChannels, fetchEpisodeItems } from './services/channelService';
import { ChannelView } from './components/channels/ChannelView';
import { CreateChannelModal } from './components/channels/CreateChannelModal';
import { EpisodeEditorModal } from './components/channels/EpisodeEditorModal';

import { AuthButton } from './components/AuthButton';
import { FavoriteButton } from './components/FavoriteButton';

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMuted, setIsMuted] = useState(false);

  const { user } = useAuth();
  
  // Layout State
  // Default to closed on mobile (< 768px), open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareCopied, setShowShareCopied] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPlayerInfoVisible, setIsPlayerInfoVisible] = useState(true);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  // State for Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Language State
  const [language, setLanguage] = useState<Language>('pt');
  const t = translations[language];

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all'); // Default to Global/All
  const [selectedVideoType, setSelectedVideoType] = useState<'all' | 'clips' | 'live'>('all');
  const [allVideos, setAllVideos] = useState<Video[]>([]); // Store full unfiltered list
  const [lastSearchParams, setLastSearchParams] = useState<{
    type: 'year' | 'decade' | 'all';
    value: string;
  } | null>(null);
  const [isTuning, setIsTuning] = useState(false);
  const [showClickToStart, setShowClickToStart] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  // Player & Data State
  const [state, setState] = useState<PlayerState>({
    currentVideo: null,
    queue: [],
    isPlaying: false,
    hasStarted: false,
    error: null,
  });

  // Session History State (to avoid repetition)
  const [playedVideoIds, setPlayedVideoIds] = useState<Set<string>>(new Set());

  // Pinkpop Videos State (loaded asynchronously)
  const [pinkpopVideos, setPinkpopVideos] = useState<Video[]>([]);

  // Channels State
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  const { data: userChannels } = useQuery({
    queryKey: ['channels', user?.id],
    queryFn: () => fetchChannels(user!.id),
    enabled: !!user,
  });

  // Handle Play Episode
  const handlePlayEpisode = async (episode: Episode) => {
     try {
       setState(prev => ({ ...prev, isLoading: true, error: null }));
       
       // Build queue for episode
       const items = await fetchEpisodeItems(episode.id);
       
       const queue: Video[] = [];

       // Helper to create video object
       // We generate a negative ID to avoid conflicts with real IDs (assuming real IDs are positive)
       // Using timestamp + index for uniqueness
       const createVideoObject = (url: string, title: string, index: number): Video => {
          // Identify source
          let source: 'youtube' | 'vimeo' = 'youtube';
          if (url.includes('vimeo')) source = 'vimeo';

          // Extract ID (naive extraction)
          // You might need a more robust extraction if allowing various URL formats
          // This is a placeholder. For now assuming simple YouTube/Vimeo ID extraction or just using URL as source for a player that supports it.
          // BUT: The current player likely expects specific ID formats.
          // App's fetchVideoById logic suggests it fetches from DB.
          // Here we are creating "virtual" videos not in the DB.
          // The current Player components (Sector1Player) likely render YouTube/Vimeo embeds.
          // If they expect 'id' to be the embed ID, we need to extract it.
          
          let embedId = url; // Default fallback
          if (source === 'youtube') {
             try {
                 const urlObj = new URL(url);
                 if (urlObj.hostname === 'youtu.be') {
                     embedId = urlObj.pathname.slice(1);
                 } else {
                     embedId = urlObj.searchParams.get('v') || embedId;
                 }
             } catch(e) {}
          }
          // Assuming the player uses `embed_id` or `id` to play.
          
          return {
              id: -1 * (Date.now() + index), // safe negative ID
              song_title: title,
              artists: [{ name: 'Episode Segment', slug: 'episode-segment' }],
              year: new Date().getFullYear(),
              video_type: 'clip', // or 'unknown'
              source: source,
              embed_id: embedId,
              program_name: '',
              record_label: '',
              artist_genre: '',
              url: url,
              is_program: false
          };
       };

       if (episode.opening_video_url) {
           queue.push(createVideoObject(episode.opening_video_url, 'Abertura', 0));
       }
       if (episode.intro_video_url) {
           queue.push(createVideoObject(episode.intro_video_url, 'Apresentação', 1));
       }
       
       items.forEach((item, idx) => {
           queue.push(createVideoObject(item.video_url, `Clipe ${idx + 1}`, idx + 2));
       });

       if (queue.length > 0) {
           setState(prev => ({
               ...prev,
               queue: queue,
               currentVideo: queue[0],
               isLoading: false,
               isPlaying: true,
               hasStarted: true
           }));
           // Close sidebars if needed
           if (typeof window !== 'undefined' && window.innerWidth < 768) {
             setIsSidebarOpen(false);
           }
       } else {
           setState(prev => ({ ...prev, isLoading: false, error: 'Este episódio está vazio.' }));
       }

     } catch (e) {
         console.error('Error playing episode:', e);
         setState(prev => ({ ...prev, isLoading: false, error: 'Erro ao reproduzir episódio.' }));
     }
  };


  // Track Played Videos
  useEffect(() => {
    if (state.currentVideo) {
      setPlayedVideoIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(state.currentVideo!.id);
        return newSet;
      });
    }
  }, [state.currentVideo]);

  // Helper: Filter unplayed videos
  const getUnplayedVideos = (videos: Video[]) => {
    // If we have no history, return all
    if (playedVideoIds.size === 0) return videos;

    const unplayed = videos.filter((v) => !playedVideoIds.has(v.id));

    // If we have unplayed videos, return them
    // If all videos in this set have been played, reset for this context (return all)
    return videos;
  };

  // Helper: Filter videos by type
  const filterByVideoType = (videos: Video[], type: 'all' | 'clips' | 'live'): Video[] => {
    if (type === 'all') return videos;

    return videos.filter((video) => {
      if (type === 'live') {
        // Live performances: video_type is 'live' OR is_live flag OR is_show flag
        return (
          video.video_type === 'live' ||
          video.is_live === true ||
          video.is_show === true
        );
      }

      if (type === 'clips') {
        // Studio clips: video_type is 'clip' or 'visualizer', or 'unknown' without live/show flags
        const videoType = video.video_type;
        const isLive = video.is_live;
        const isShow = video.is_show;

        return (
          (videoType === 'clip' || videoType === 'visualizer' || videoType === 'unknown' || !videoType) &&
          !isLive &&
          !isShow
        );
      }

      return true;
    });
  };

  // Handle Theme Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Load Pinkpop videos on mount
  useEffect(() => {
    loadPinkpopVideos().then(setPinkpopVideos).catch(err => {
      // Silently fail in production or log to error reporting service
    });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen changes (e.g. user presses Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Logic: Handle URL Parameters (Deep Linking)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v') || params.get('video');

    if (videoId) {
      setIsTuning(true); // Show static start
      setShowClickToStart(true); // Require user click to start video for deep links
      // Actually usually direct link implies autoplay or ready to play
      setShowWelcome(false);

      const loadDeepLinkedVideo = async () => {
        try {
          // 1. Fetch the specific video first
          const video = await fetchVideoById(videoId);

          if (video) {
            // 2. Determine context for "Up Next" (Year or All)
            const contextType = video.year ? 'year' : 'all';
            const contextValue = video.year ? video.year.toString() : 'all';
            const contextRegion =
              video.nationality === 'BR'
                ? 'br'
                : video.nationality
                ? 'intl'
                : 'all';

            // Set state immediately with the single video so it's ready
            setState((prev) => ({
              ...prev,
              currentVideo: video,
              queue: [video],
              isLoading: false, // temporarily false while we fetch context
              hasStarted: true,
              isPlaying: false, // Wait for user click interaction
            }));

            // 3. Fetch related videos in background to fill the queue

            try {
              const relatedVideos = await fetchVideosByCriteria(
                contextType,
                contextValue,
                contextRegion
              );

              if (relatedVideos.length > 0) {
                // Filter out the current video to avoid immediate duplicate
                const otherVideos = relatedVideos.filter(
                  (v) => v.id !== video.id
                );

                // Shuffle
                const shuffle = (array: Video[]) => {
                  const newArr = [...array];
                  for (let i = newArr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
                  }
                  return newArr;
                };

                const shuffledContext = shuffle(otherVideos);

                // Update queue: [Current, ...Rest]
                setAllVideos(relatedVideos); // Update "All Videos" for genre filtering context
                setSelectedRegion(contextRegion); // Sync region selector

                setState((prev) => ({
                  ...prev,
                  queue: [video, ...shuffledContext],
                }));
              }
            } catch (err) {
              console.warn('Failed to fetch context for deep link', err);
            }
          } else {
            // Not found fallback
            setState((prev) => ({
              ...prev,
              isLoading: false,
              error: `Vídeo não encontrado (ID: ${videoId})`,
            }));
            setIsTuning(false); // Stop static so error is visible
          }

        } catch (e) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Erro ao carregar vídeo.',
          }));
          setIsTuning(false);
        } finally {
          setTimeout(() => setIsTuning(false), 1000);
        }
      };

      loadDeepLinkedVideo();
    }
  }, []);

  // NOTE: loadInitialVideos was removed to prevent loading ALL ~97K videos on mount.
  // Previously, this loaded all videos just to populate genre dropdowns.
  // Now we use the metadata index (160KB) for genre detection.

  // Determine available genres from metadata index (NO data loading!)
  // This reads from the pre-imported 160KB metadata-index.json
  const availableGenres = useMemo(() => {
    const genres = getAvailableGenresFromIndex();
    return genres;
  }, []);

  // Handle Share
  const handleShare = async () => {
    if (!state.currentVideo) return;

    // Use current URL origin + path, append ?v=ID
    const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    const shareUrl = `${baseUrl}?v=${
      state.currentVideo.embed_id || state.currentVideo.id
    }`;

    const shareText = `Acho que você vai curtir esse clipe, conheça o Grooovio!\n\n${
      state.currentVideo.song_title
    } - ${state.currentVideo.artists.map((a) => a.name).join(', ')} (${
      state.currentVideo.year
    })\n${shareUrl}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setShowShareCopied(true);
      setTimeout(() => setShowShareCopied(false), 2000);
    } catch (err) {
      // Ignore clipboard errors
    }
  };

  // Logic: Search & Auto-Play
  const handleSearch = async (
    type: 'year' | 'decade' | 'all',
    value: string
  ) => {
    setLastSearchParams({ type, value });
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      currentVideo: null,
      hasStarted: false,
    }));
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen

    // Show TV static while loading
    setIsTuning(true);

    try {
      const videos = await fetchVideosByCriteria(type, value, selectedRegion);

      if (videos.length > 0) {
        setAllVideos(videos); // Save full list
        setSelectedGenre(null); // Reset filter on new search

        // Apply video type filter
        let filteredVideos = filterByVideoType(videos, selectedVideoType);

        // Initial List is now already filtered by region from service
        let initialList = getUnplayedVideos(filteredVideos);

        // Keep static visible for a moment before starting video
        setTimeout(() => {
          setIsTuning(false);

          if (initialList.length > 0) {
            // Auto-start logic: Set queue, set first video as current, and set playing state
            setState((prev) => ({
              ...prev,
              queue: initialList,
              currentVideo: initialList[0],
              isLoading: false,
              hasStarted: true,
              isPlaying: true,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              queue: [],
              isLoading: false,
              error: 'Nenhum vídeo encontrado para esta região nesta data.',
            }));
          }
        }, 1500); // 1.5 second static effect
      } else {
        setIsTuning(false);
        setState((prev) => ({
          ...prev,
          queue: [],
          isLoading: false,
          error: 'Nenhum vídeo encontrado para esta data.',
        }));
      }
    } catch (err) {
      setIsTuning(false);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Falha ao carregar vídeos.',
      }));
    }
  };

  // Logic: Play / Start (Manual trigger if needed from playlist)
  const handlePlay = () => {
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen

    // If we already have a video selected (e.g. from deep link), just resume/play it
    if (state.currentVideo) {
      setState((prev) => ({
        ...prev,
        hasStarted: true,
        isPlaying: true,
      }));
      return;
    }

    // Otherwise, play start of queue
    if (state.queue.length > 0) {
      const firstVideo = state.queue[0];
      setState((prev) => ({
        ...prev,
        currentVideo: firstVideo,
        hasStarted: true,
        isPlaying: true,
      }));
    }
  };

  // Logic: Next Video
  const handleNext = () => {
    // Special handling for radio stations
    if (state.currentVideo?.source === 'stream') {
      // Determine which radio is currently playing
      const currentRadioId = state.currentVideo.id;
      let nextRadioGenre: string;
      
      if (currentRadioId === 99999999) { // KISS FM
        nextRadioGenre = 'radio_89fm';
      } else if (currentRadioId === 99999998) { // 89 FM
        nextRadioGenre = 'kiss_fm';
      } else {
        // Unknown radio, default to KISS FM
        nextRadioGenre = 'kiss_fm';
      }
      
      // Trigger the genre selection which will handle the transition
      handleGenreSelect(nextRadioGenre);
      return;
    }
    
    // Original logic for non-radio content
    // Trigger tuning static if next video is a stream
    const currentIdx = state.queue.findIndex(
      (v) => v.id === state.currentVideo?.id
    );
    const nextIdx = currentIdx + 1;

    let targetVideo = null;
    if (nextIdx < state.queue.length) {
       targetVideo = state.queue[nextIdx];
    }

    if (targetVideo && targetVideo.source === 'stream') {
        setIsTuning(true);
    }

    setState((prev) => {
      const currentIndex = prev.queue.findIndex(
        (v) => v.id === prev.currentVideo?.id
      );
      const nextIndex = currentIndex + 1;

      if (nextIndex < prev.queue.length) {
        return {
          ...prev,
          currentVideo: prev.queue[nextIndex],
          isPlaying: true,
        };
      } else {
        // End of playlist
        return {
          ...prev,
          currentVideo: null,
          isPlaying: false,
          hasStarted: false,
        };
      }
    });
  };

  // Logic: Previous Video
  const handlePrevious = () => {
    // Special handling for radio stations
    if (state.currentVideo?.source === 'stream') {
      // Determine which radio is currently playing
      const currentRadioId = state.currentVideo.id;
      let prevRadioGenre: string;
      
      if (currentRadioId === 99999999) { // KISS FM
        prevRadioGenre = 'radio_89fm';
      } else if (currentRadioId === 99999998) { // 89 FM
        prevRadioGenre = 'kiss_fm';
      } else {
        // Unknown radio, default to 89 FM
        prevRadioGenre = 'radio_89fm';
      }
      
      // Trigger the genre selection which will handle the transition
      handleGenreSelect(prevRadioGenre);
      return;
    }
    
    // Original logic for non-radio content
    // Trigger tuning static if previous video is a stream
    const currentIdx = state.queue.findIndex(
      (v) => v.id === state.currentVideo?.id
    );
    const prevIdx = currentIdx - 1;

    let targetVideo = null;
    if (prevIdx >= 0) {
       targetVideo = state.queue[prevIdx];
    }

    if (targetVideo && targetVideo.source === 'stream') {
        setIsTuning(true);
    }

    setState((prev) => {
      const currentIndex = prev.queue.findIndex(
        (v) => v.id === prev.currentVideo?.id
      );
      const prevIndex = currentIndex - 1;

      if (prevIndex >= 0) {
        return {
          ...prev,
          currentVideo: prev.queue[prevIndex],
          isPlaying: true,
        };
      } else {
        // Beginning of playlist - stay on first video
        return prev;
      }
    });
  };

  // Logic: Genre Filtering
  const handleGenreSelect = async (genreId: string | null) => {
    setSelectedGenre(genreId);
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen

    // Auto-close sidebar on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    // Ensure we have videos to filter - load on demand if needed
    let sourceVideos = allVideos;
    if (sourceVideos.length === 0 && genreId !== 'pinkpop' && genreId !== 'kiss_fm' && genreId !== 'radio_89fm') {
      setIsTuning(true); // visual feedback
      try {
        // Load only the relevant data based on context
        const searchType = lastSearchParams?.type || 'all';
        const searchValue = lastSearchParams?.value || 'all';
        const fetched = await fetchVideosByCriteria(searchType, searchValue, selectedRegion);
        if (fetched.length > 0) {
          setAllVideos(fetched);
          sourceVideos = fetched;
        } else {
          setIsTuning(false);
          setIsTuning(false);
          return; // No videos found
        }
      } catch (error) {
        setIsTuning(false);
        return;
      }
    }

    // Filter logic
    let filteredQueue = [...sourceVideos];

    if (genreId) {
      if (genreId === 'Clássicos') {
        filteredQueue = sourceVideos.filter(
          (video) => video.year && video.year >= 1960 && video.year <= 1999
        );
      } else if (genreId === 'full_show') {
        // Filter videos flagged as shows
        filteredQueue = sourceVideos.filter((video) => video.is_show);
      } else if (genreId === 'hermes_renato') {
        // Filter videos for Hermes & Renato program
        filteredQueue = sourceVideos.filter(
          (video) =>
            video.is_program &&
            video.program_name === 'hermes_e_renato'
        );
      } else if (genreId === 'beavis_butthead') {
        // Filter videos for Beavis and Butt-Head program
        filteredQueue = sourceVideos.filter(
          (video) =>
            video.is_program &&
            video.program_name === 'beavis_and_butthead'
        );
      } else if (genreId === 'documentarios') {
        // Filter videos for Documentários program
        filteredQueue = sourceVideos.filter(
          (video) =>
            video.is_program &&
            video.program_name === 'documentarios'
        );
      } else if (genreId === 'atlantic') {
        // Filter videos for Atlantic Records
        filteredQueue = sourceVideos.filter(
          (video) => video.record_label === 'atlantic'
        );
      } else if (genreId === 'road_runner') {
        // Filter videos for Road Runner Records
        filteredQueue = sourceVideos.filter(
          (video) => video.record_label === 'road_runner'
        );
      } else if (genreId === 'subpop') {
        // Filter videos for Sub Pop Records
        filteredQueue = sourceVideos.filter(
          (video) => video.record_label === 'subpop'
        );
      } else if (genreId === 'epitaph') {
        // Filter videos for Epitaph Records
        filteredQueue = sourceVideos.filter(
          (video) => video.record_label === 'epitaph'
        );
      } else if (genreId === 'acoustic') {
        filteredQueue = sourceVideos.filter(
          (video) =>
            video.artist_genre === 'acousticShow' ||
            (video.artist_genre && video.artist_genre.includes('acousticShow'))
        );
      } else if (genreId === 'pinkpop') {
        // Load Pinkpop videos
        filteredQueue = [...pinkpopVideos];
      } else if (genreId === 'kiss_fm') {
        filteredQueue = [KISS_FM_VIDEO];
      } else if (genreId === 'radio_89fm') {
        filteredQueue = [RADIO_89FM_VIDEO];
      } else {
        // Map UI Genre ID to matching sub-genres/keywords in artist_genre
        // Uses exported GENRE_MAP from service
        const targetGenres = GENRE_MAP[genreId] || [];

        if (targetGenres.length > 0) {
          filteredQueue = sourceVideos.filter((video) => {
            const g = video.artist_genre;
            return (
              g &&
              targetGenres.some((target) => g.includes(target) || g === target)
            );
          });
        }
      }
    } else {
      // Filter out programs when 'All' is selected
      // We want 'All' to be a mix of music clips/shows, but exclude specific programs like Hermes & Renato
      filteredQueue = sourceVideos.filter(
        (video) => !video.is_program
      );
    }

    // Apply Region Filter on top of Genre Filter
    // Note: Region is already handled by the fetch source (allVideos contains only selected region data),
    // so we don't need additional filtering here unless we were mixing client-side.
    // However, if we fetched 'Mix' and then this runs, we might want to filter?
    // Wait, the design is: if you change Region, we Re-Fetch.
    // So 'allVideos' ALWAYS respects 'selectedRegion'.
    // Therefore, no extra filtering needed here.

    // Trigger tuning effect if switching genre (or to 'All')
    setIsTuning(true);

    // Stop current video immediately (force unmount for silence)
    setState((prev) => ({
      ...prev,
      currentVideo: null,
      isPlaying: false,
      hasStarted: false,
    }));

    // Shuffle the filtered result for variety
    // Helper shuffle
    const shuffle = (array: Video[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    // Apply video type filter after genre filtering
    filteredQueue = filterByVideoType(filteredQueue, selectedVideoType);

    const unplayedQueue = getUnplayedVideos(filteredQueue);
    const shuffledFiltered = shuffle(unplayedQueue);

    // Update State with delay to allow tuning effect
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        queue: shuffledFiltered,
        // Auto-play the first video of the new shuffled list if 'All' is selected or a specific genre
        currentVideo: shuffledFiltered[0],
        isPlaying: true,
        hasStarted: true,
      }));
    }, 1000); // 1s tuning effect
  };

  // Logic: Region Filtering
  const handleRegionSelect = async (
    region: string,
    forceAllMode: boolean = false
  ) => {
    setSelectedRegion(region);

    let searchTarget = lastSearchParams;

    if (forceAllMode) {
      searchTarget = { type: 'all', value: 'all' };
      setLastSearchParams(searchTarget);
      setSelectedGenre(null);
    }

    // Fallback for deep links: use current video's year if no search history
    if (!searchTarget && state.currentVideo?.year) {
      searchTarget = {
        type: 'year',
        value: state.currentVideo.year.toString(),
      };
    }

    // If we have a past search or a derived one, we re-run it with the new region
    if (searchTarget) {
      let adjustedSearchParams = { ...searchTarget };

      setIsTuning(true);
      setState((prev) => ({
        ...prev,
        currentVideo: null,
        isPlaying: false,
        hasStarted: false,
      }));

      try {
        const videos = await fetchVideosByCriteria(
          adjustedSearchParams.type,
          adjustedSearchParams.value,
          region
        );
        setAllVideos(videos);
        setLastSearchParams(adjustedSearchParams);

        // Filter by Genre?
        let startQueue = videos;
        if (selectedGenre) {
          const targetGenres = GENRE_MAP[selectedGenre] || [];
          if (targetGenres.length > 0) {
            startQueue = videos.filter((video) => {
              const g = video.artist_genre;
              return (
                g &&
                targetGenres.some(
                  (target) => g.includes(target) || g === target
                )
              );
            });
          }
        }

        // Apply Repetition Logic Check
        startQueue = getUnplayedVideos(startQueue);

        // Apply video type filter
        startQueue = filterByVideoType(startQueue, selectedVideoType);

        // Shuffle
        const shuffle = (array: Video[]) => {
          const newArr = [...array];
          for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
          }
          return newArr;
        };
        startQueue = shuffle(startQueue);

        setTimeout(() => {
          if (startQueue.length > 0) {
            setState((prev) => ({
              ...prev,
              queue: startQueue,
              currentVideo: startQueue[0],
              isLoading: false,
              hasStarted: true,
              isPlaying: true,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              queue: [],
              isLoading: false,
              error: 'Nenhum vídeo encontrado para esta combinação.',
            }));
          }
          setIsTuning(false);
        }, 1000);
      } catch (error) {
        console.error('Error switching region:', error);
        setIsTuning(false);
      }
    }
  };

  // Logic: Video Type Filtering
  const handleVideoTypeChange = (type: 'all' | 'clips' | 'live') => {
    console.log('[Grooovio] Changing video type to:', type);
    console.log('[Grooovio] Current allVideos length:', allVideos.length);
    console.log('[Grooovio] Current selectedGenre:', selectedGenre);
    
    setSelectedVideoType(type);
    setShowClickToStart(false);
    setShowWelcome(false);

    // Re-apply filters with new video type
    if (allVideos.length > 0) {
      let filtered = [...allVideos];

      // Apply genre filter if active
      if (selectedGenre) {
        if (selectedGenre === 'Clássicos') {
          filtered = filtered.filter(
            (video) => video.year && video.year >= 1960 && video.year <= 1999
          );
        } else if (selectedGenre === 'full_show') {
          filtered = filtered.filter((video) => video.is_show);
        } else if (selectedGenre === 'hermes_renato') {
          filtered = filtered.filter(
            (video) =>
              (video as any).is_program &&
              (video as any).program_name === 'hermes_e_renato'
          );
        } else if (selectedGenre === 'beavis_butthead') {
          filtered = filtered.filter(
            (video) =>
              (video as any).is_program &&
              (video as any).program_name === 'beavis_and_butthead'
          );
        } else if (selectedGenre === 'documentarios') {
          filtered = filtered.filter(
            (video) =>
              (video as any).is_program &&
              (video as any).program_name === 'documentarios'
          );
        } else if (selectedGenre === 'atlantic') {
          filtered = filtered.filter(
            (video) => video.record_label === 'atlantic'
          );
        } else if (selectedGenre === 'road_runner') {
          filtered = filtered.filter(
            (video) => video.record_label === 'road_runner'
          );
        } else if (selectedGenre === 'subpop') {
          filtered = filtered.filter(
            (video) => video.record_label === 'subpop'
          );
        } else if (selectedGenre === 'epitaph') {
          filtered = filtered.filter(
            (video) => video.record_label === 'epitaph'
          );
        } else if (selectedGenre === 'acoustic') {
          filtered = filtered.filter(
            (video) =>
              video.artist_genre === 'acousticShow' ||
              (video.artist_genre && video.artist_genre.includes('acousticShow'))
          );
        } else if (selectedGenre === 'pinkpop') {
          filtered = [...pinkpopVideos];
        } else if (selectedGenre === 'kiss_fm' || selectedGenre === 'radio_89fm') {
          // Radio stations - don't filter
          return;
        } else {
          const targetGenres = GENRE_MAP[selectedGenre] || [];
          if (targetGenres.length > 0) {
            filtered = filtered.filter((video) => {
              const g = video.artist_genre;
              return (
                g &&
                targetGenres.some((target) => g.includes(target) || g === target)
              );
            });
          }
        }
      } else {
        // Filter out programs when 'All' is selected
        filtered = filtered.filter((video) => !(video as any).is_program);
      }

      console.log('[Grooovio] Filtered length after genre/program check:', filtered.length);

      // Apply video type filter
      filtered = filterByVideoType(filtered, type);

      console.log('[Grooovio] Filtered length after type check:', filtered.length);

      // Shuffle
      const shuffle = (array: Video[]) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
      };

      const unplayed = getUnplayedVideos(filtered);
      const shuffled = shuffle(unplayed);

      // Trigger tuning effect
      setIsTuning(true);
      setState((prev) => ({
        ...prev,
        currentVideo: null,
        isPlaying: false,
        hasStarted: false,
      }));

      setTimeout(() => {
        if (shuffled.length > 0) {
          setState((prev) => ({
            ...prev,
            queue: shuffled,
            currentVideo: shuffled[0],
            isPlaying: true,
            hasStarted: true,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            queue: [],
            error: 'Nenhum vídeo encontrado para este tipo.',
          }));
        }
        setIsTuning(false);
      }, 1000);
    }
  };

  // Logic: Select specific video from playlist
  const handleSelectVideo = (video: Video) => {
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen
    setState((prev) => ({
      ...prev,
      currentVideo: video,
      isPlaying: true,
      hasStarted: true,
    }));
  };

  // Handle Start Journey from Welcome Screen
  const handleStartJourney = () => {
    setShowWelcome(false);
    setShowClickToStart(false); // Skip click-to-start since user already clicked
    // Auto-trigger "Tudo" (All) mode
    handleSearch('all', '');
  };

  return (

      <div className="flex h-screen w-screen overflow-hidden bg-background font-sans text-foreground">
        {/* Welcome Screen */}
        {showWelcome && (
          <WelcomeScreen onStart={handleStartJourney} language={language} />
        )}

      {/* SECTOR 1: Main Video Area */}
      <main className="flex-1 relative flex flex-col min-w-0 transition-all duration-300">
        {/* Header Overlay */}
        <header className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border shadow-sm">
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">
              Grooov<span className="text-primary">io</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono">
              V 1.25.3 // ARIA-COMPLIANT
            </p>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden pointer-events-auto flex items-center gap-2">
            <AuthButton onSelectVideo={handleSelectVideo} />
            {!isSidebarOpen && (
              <Button
                variant="primary"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="shadow-md rounded-full"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div className="hidden md:flex gap-2 pointer-events-auto">
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleTheme}
              className="shadow-md rounded-full"
              aria-label="Toggle Theme" // ARIA-COMPLIANT
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleMute}
              className="shadow-md rounded-full"
              aria-label="Toggle Mute" // ARIA-COMPLIANT
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={toggleFullscreen}
              className="shadow-md rounded-full"
              aria-label="Toggle Fullscreen" // ARIA-COMPLIANT
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="shadow-md rounded-full relative"
              disabled={!state.currentVideo}
              title="Compartilhar clipe"
              aria-label="Share Video" // ARIA-COMPLIANT
            >
              {showShareCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </Button>

            {/* Retract Toggle Button */}
            <Button
              variant="primary"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="shadow-md rounded-full transition-all"
              aria-label={
                isSidebarOpen ? 'Fechar Barra Lateral' : 'Abrir Barra Lateral'
              }
              title={
                isSidebarOpen
                  ? 'Recolher Barra Lateral'
                  : 'Expandir Barra Lateral'
              }
            >
              {isSidebarOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </Button>

            {/* Auth Button and Favorite Button */}
            <div className="relative group pointer-events-auto">
              <AuthButton 
                  onSelectVideo={handleSelectVideo} 
                  channels={userChannels || []}
                  onCreateChannel={() => setIsCreateChannelModalOpen(true)}
                  onSelectChannel={(channel) => {
                      setSelectedChannel(channel);
                       // Auto-close sidebar on mobile
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                  }}
              />
              
              <div 
                className={`absolute top-full right-0 pt-4 flex flex-col items-center pointer-events-none md:pointer-events-auto ${
                  isPlayerInfoVisible ? 'md:animate-fade-in opacity-100' : 'md:animate-fade-out opacity-0'
                }`}
                style={{ animationDelay: isPlayerInfoVisible ? '0.5s' : '0s' }}
              >
                 <FavoriteButton currentVideo={state.currentVideo} />
              </div>
            </div>
          </div>
        </header>

        <Sector1Player
          currentVideo={state.currentVideo}
          onEnded={handleNext}
          onPrevious={handlePrevious}
          isSidebarOpen={isSidebarOpen}
          language={language}
          onVideoPlay={() => setIsTuning(false)}
          isMuted={isMuted}
          isPlaying={state.isPlaying}
          hasNext={
            (state.queue.findIndex((v) => v.id === state.currentVideo?.id) <
            state.queue.length - 1) || (state.queue.length > 0 && state.queue[0].source === 'stream')
          }
          hasPrevious={state.queue.findIndex((v) => v.id === state.currentVideo?.id) > 0}
          initialTime={0}
          onTimeUpdate={(time) => {}}
          forceCaptions={state.currentVideo?.program_name === 'documentarios'}
          onInfoVisibilityChange={(visible) => setIsPlayerInfoVisible(visible)}
        />

        <TVStatic active={isTuning} enableAudio={!showClickToStart} />

        {/* Click to Start Overlay - Requires real user click */}
        {showClickToStart && state.hasStarted && (
          <button
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 cursor-pointer w-full h-full border-none p-0 text-left"
            onClick={() => {
              setShowClickToStart(false);
              // Force play after user interaction
              setState((prev) => ({ ...prev, isPlaying: true }));
            }}
            aria-label="Click to start video"
          >
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 mb-6">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-16 h-16 text-primary-foreground ml-2"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white drop-shadow-md">
                Clique para Iniciar
              </p>
              <p className="text-sm text-white/70 mt-1 font-medium">
                Click to Start
              </p>
            </div>
          </button>
        )}

        {/* Error Overlay */}
        {state.error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95">
            <div className="text-center p-8 max-w-md border border-red-500/50 rounded-lg bg-red-950/20 backdrop-blur">
              <div className="text-4xl mb-4 text-red-500">⚠️</div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Erro</h3>
              <p className="text-muted-foreground mb-6">{state.error}</p>
              <Button
                variant="secondary"
                onClick={() => setState((prev) => ({ ...prev, error: null }))}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* RIGHT SIDEBAR */}
      <aside
        className={`
            flex flex-col border-l border-border bg-card transition-all duration-500 ease-in-out overflow-hidden shadow-2xl z-40
            fixed inset-0 w-full md:relative md:inset-auto
            ${
              isSidebarOpen
                ? 'translate-x-0 opacity-100 md:w-80'
                : 'translate-x-[100%] md:translate-x-10 opacity-0 pointer-events-none md:w-0'
            }
        `}
        aria-hidden={!isSidebarOpen}
      >
        {/* Mobile Controls Header */}
        <div className="md:hidden flex items-center justify-between px-4 pb-4 pt-24 border-b border-border bg-card/95 backdrop-blur z-30">
          <h2 className="font-bold text-lg">Menu</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-8 w-8"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="secondary" // Reverted to secondary variant
              size="icon"
              onClick={toggleMute}
              className="rounded-full h-8 w-8"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="rounded-full h-8 w-8 relative"
              disabled={!state.currentVideo}
            >
              {showShareCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </Button>
            <FavoriteButton currentVideo={state.currentVideo} />
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsInfoModalOpen(true)}
              className="rounded-full h-8 w-8"
            >
              <Info className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-border mx-1"></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-full h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* SECTOR 2: Top Right (Search) */}
        <div className="flex-none h-auto z-20 relative border-b border-border">
          <Sector2Search
            onSearch={handleSearch}
            isLoading={state.isLoading || false}
            language={language}
            onLanguageChange={setLanguage}
            currentVideo={state.currentVideo}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionSelect}
            selectedVideoType={selectedVideoType}
            onVideoTypeChange={handleVideoTypeChange}
          />
        </div>

        {/* SECTOR 3: Bottom Right (Playlist) */}
        {selectedChannel ? (
            <ChannelView
               channel={selectedChannel}
               onBack={() => setSelectedChannel(null)}
               onPlayEpisode={handlePlayEpisode}
               onEditEpisode={(episode) => setEditingEpisode(episode)}
            />
        ) : (
          <Sector3Playlist
            queue={state.queue}
            currentVideo={state.currentVideo}
            onPlay={handlePlay} // Only used if stopped
            onSkip={handleNext}
            isPlaying={state.isPlaying}
            isLoading={state.isLoading}
            hasStarted={state.hasStarted}
            selectedGenre={selectedGenre}
            onSelectGenre={handleGenreSelect}
            onSelectVideo={handleSelectVideo}
            language={language}
            availableGenres={availableGenres}
            channels={userChannels || []}
            onSelectChannel={(channel) => {
                setSelectedChannel(channel);
                 // Auto-close sidebar on mobile
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
            }}
            user={user}
          />
        )}
      </aside>

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        language={language}
      />
      
      {/* Create Channel Modal */}
      <CreateChannelModal 
         isOpen={isCreateChannelModalOpen}
         onClose={() => setIsCreateChannelModalOpen(false)}
         language={language as any}
      />

      {/* Episode Editor Modal */}
      <EpisodeEditorModal 
         isOpen={!!editingEpisode}
         onClose={() => setEditingEpisode(null)}
         episode={editingEpisode}
         channelId={selectedChannel?.id || ''}
      />
      </div>
  );
};

export default App;
