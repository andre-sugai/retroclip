import React, { useState, useEffect } from 'react';
import { PlayerState, SearchParams, Video } from './types';
import { fetchVideosByCriteria, fetchVideoById } from './services/imvdbService';
import { Sector1Player } from './components/Sector1Player';
import { Sector2Search } from './components/Sector2Search';
import { Sector3Playlist } from './components/Sector3Playlist';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Button } from './components/ui/Button';
import { PanelRightClose, PanelRightOpen, Moon, Sun, Volume2, VolumeX, Maximize, Minimize, Share2, Check, Info } from 'lucide-react';
import { translations, Language } from './translations';
import { TVStatic } from './components/TVStatic';
import { InfoModal } from './components/InfoModal';

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMuted, setIsMuted] = useState(false);
  
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareCopied, setShowShareCopied] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Language State
  const [language, setLanguage] = useState<Language>('pt');
  const t = translations[language];

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<'br' | 'intl' | 'all'>('all'); // Default to Mix
  const [allVideos, setAllVideos] = useState<Video[]>([]); // Store full unfiltered list
  const [lastSearchParams, setLastSearchParams] = useState<{type: 'year'|'decade'|'all', value: string} | null>(null);
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

  // Handle Theme Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
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
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Logic: Handle URL Parameters (Deep Linking)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v') || params.get('video');
    
    if (videoId) {
      setIsTuning(true); // Show static start
      setShowClickToStart(false); // Can skip this for deep link or keep it? Let's keep play req but load video
      // Actually usually direct link implies autoplay or ready to play
      setShowWelcome(false);

      const loadDeepLinkedVideo = async () => {
        console.log(`[Grooovio App] Deep linking to video: ${videoId}`);
        try {
          const video = await fetchVideoById(videoId);
          if (video) {
             console.log(`[Grooovio App] Video found: ${video.song_title}`);
             setState(prev => ({
               ...prev,
               currentVideo: video,
               queue: [video], // Set single video queue or fetch context? Single for now or fetch year...
               // For now just set the video. If they want more they can search/filter.
               isLoading: false,
               hasStarted: true,
               isPlaying: false // Wait for user click interaction
             }));
             // Also fetch context? Maybe fetch 'all' in background?
             // Simple version: just play the video.
          } else {
             // Not found fallback
             console.warn('Video not found by ID:', videoId);
             setState(prev => ({ 
               ...prev, 
               isLoading: false, 
               error: `Vídeo não encontrado (ID: ${videoId})` 
             }));
             setIsTuning(false); // Stop static so error is visible
          }
        } catch (e) {
          console.error("Deep link fetch failed", e);
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'Erro ao carregar vídeo.' 
          }));
          setIsTuning(false);
        } finally {
          setTimeout(() => setIsTuning(false), 1000);
        }
      };
      
      loadDeepLinkedVideo();
    }
  }, []);

  // Handle Share
  const handleShare = async () => {
    if (!state.currentVideo) return;

    // Use current URL origin + path, append ?v=ID
    const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    const shareUrl = `${baseUrl}?v=${state.currentVideo.id}`;

    const shareText = `Acho que você vai curtir esse clipe, conheça o Grooovio!\n\n${state.currentVideo.song_title} - ${state.currentVideo.artists.map(a => a.name).join(', ')} (${state.currentVideo.year})\n${shareUrl}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setShowShareCopied(true);
      setTimeout(() => setShowShareCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Logic: Search & Auto-Play
  const handleSearch = async (type: 'year' | 'decade' | 'all', value: string) => {
    setLastSearchParams({ type, value });
    setState(prev => ({ ...prev, isLoading: true, error: null, currentVideo: null, hasStarted: false }));
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen
    
    // Show TV static while loading
    setIsTuning(true);
    
    
    try {
      const videos = await fetchVideosByCriteria(type, value, selectedRegion);
      
      if (videos.length > 0) {
        setAllVideos(videos); // Save full list
        setSelectedGenre(null); // Reset filter on new search
        
        // Initial List is now already filtered by region from service
        let initialList = videos;
        
        // Keep static visible for a moment before starting video
        setTimeout(() => {
          setIsTuning(false);
          
          if (initialList.length > 0) {
            // Auto-start logic: Set queue, set first video as current, and set playing state
            setState(prev => ({
                ...prev,
                queue: initialList,
                currentVideo: initialList[0],
                isLoading: false,
                hasStarted: true,
                isPlaying: true
            }));
          } else {
             setState(prev => ({ 
                ...prev, 
                queue: [],
                isLoading: false, 
                error: 'Nenhum vídeo encontrado para esta região nesta data.' 
            }));
          }
        }, 1500); // 1.5 second static effect
      } else {
        setIsTuning(false);
        setState(prev => ({ 
            ...prev, 
            queue: [],
            isLoading: false, 
            error: 'Nenhum vídeo encontrado para esta data.' 
        }));
      }
    } catch (err) {
      setIsTuning(false);
      setState(prev => ({ ...prev, isLoading: false, error: 'Falha ao carregar vídeos.' }));
    }
  };

  // Logic: Play / Start (Manual trigger if needed from playlist)
  const handlePlay = () => {
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen
    
    // If we already have a video selected (e.g. from deep link), just resume/play it
    if (state.currentVideo) {
      setState(prev => ({
        ...prev,
        hasStarted: true,
        isPlaying: true,
      }));
      return;
    }

    // Otherwise, play start of queue
    if (state.queue.length > 0) {
      const firstVideo = state.queue[0];
      setState(prev => ({
        ...prev,
        currentVideo: firstVideo,
        hasStarted: true,
        isPlaying: true,
      }));
    }
  };

  // Logic: Next Video
  const handleNext = () => {
    setState(prev => {
      const currentIndex = prev.queue.findIndex(v => v.id === prev.currentVideo?.id);
      const nextIndex = currentIndex + 1;

      if (nextIndex < prev.queue.length) {
        return {
          ...prev,
          currentVideo: prev.queue[nextIndex],
          isPlaying: true
        };
      } else {
        // End of playlist
        return {
          ...prev,
          currentVideo: null,
          isPlaying: false,
          hasStarted: false
        };
      }
    });
  };

  // Logic: Genre Filtering
  const handleGenreSelect = async (genreId: string | null) => {
    setSelectedGenre(genreId);
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen

    // Ensure we have videos to filter
    let sourceVideos = allVideos;
    if (sourceVideos.length === 0) {
        setIsTuning(true); // visual feedback
        try {
            const fetched = await fetchVideosByCriteria('all', '');
            if (fetched.length > 0) {
                setAllVideos(fetched);
                sourceVideos = fetched;
            } else {
                setIsTuning(false);
                return; // No videos found
            }
        } catch (error) {
            console.error("Auto-fetch failed", error);
            setIsTuning(false);
            return;
        }
    }

    // Filter logic
    let filteredQueue = [...sourceVideos];
    
    if (genreId) {
      if (genreId === 'Clássicos') {
        filteredQueue = sourceVideos.filter(video => video.year && video.year >= 1960 && video.year <= 1999);
      } else if (genreId === 'acoustic') {
        filteredQueue = sourceVideos.filter(video => video.artist_genre === 'acousticShow' || (video.artist_genre && video.artist_genre.includes('acousticShow')));
      } else {
        // Map UI Genre ID to matching sub-genres/keywords in artist_genre
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
          'Reggae': ['Reggae', 'Reggaeton']
        };

        const targetGenres = genreMap[genreId] || [];
        
        if (targetGenres.length > 0) {
          filteredQueue = sourceVideos.filter(video => {
            const g = video.artist_genre;
            return g && targetGenres.some(target => g.includes(target) || g === target);
          });
        }
      }
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
    setState(prev => ({ ...prev, currentVideo: null, isPlaying: false, hasStarted: false }));

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
    
    const shuffledFiltered = shuffle(filteredQueue);

    // Update State with delay to allow tuning effect
    setTimeout(() => {
        setState(prev => ({
           ...prev,
           queue: shuffledFiltered,
           // Auto-play the first video of the new shuffled list if 'All' is selected or a specific genre
           currentVideo: shuffledFiltered[0],
           isPlaying: true,
           hasStarted: true
        }));
    }, 1000); // 1s tuning effect
  };

  // Logic: Region Filtering
  const handleRegionSelect = async (region: 'br' | 'intl' | 'all') => {
      setSelectedRegion(region);
      
      // If we have a past search, we re-run it with the new region
      if (lastSearchParams) {
          // Re-use logic similar to handleSearch but we must not reset 'selectedGenre' necessarily, 
          // but for consistency with the new data source, it's safer to re-fetch and apply genre if needed.
          // For simplicity, let's treat it as a new search but keep the genre if we can.
          
          setIsTuning(true);
          setState(prev => ({ ...prev, currentVideo: null, isPlaying: false, hasStarted: false }));
          
          try {
              const videos = await fetchVideosByCriteria(lastSearchParams.type, lastSearchParams.value, region);
              setAllVideos(videos);

              setTimeout(() => {
                  let startQueue = videos;
                  
                  // Re-apply current genre if it exists
                  if (selectedGenre) {
                      if (selectedGenre === 'Clássicos') {
                        startQueue = videos.filter(video => video.year && video.year >= 1960 && video.year <= 1999);
                      } else {
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
                          'Reggae': ['Reggae', 'Reggaeton']
                        };
                        const targetGenres = genreMap[selectedGenre] || [];
                        if (targetGenres.length > 0) {
                          startQueue = videos.filter(video => {
                            const g = video.artist_genre;
                            return g && targetGenres.some(target => g.includes(target) || g === target);
                          });
                        }
                      }
                  }

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

                  if (startQueue.length > 0) {
                      setState(prev => ({
                        ...prev,
                        queue: startQueue,
                        currentVideo: startQueue[0],
                        isLoading: false,
                        hasStarted: true,
                        isPlaying: true
                      }));
                  } else {
                       setState(prev => ({ 
                            ...prev, 
                            queue: [],
                            isLoading: false, 
                            error: 'Nenhum vídeo encontrado para esta combinação.' 
                        }));
                  }
                  setIsTuning(false);
              }, 1000);
              
          } catch (e) {
              console.error(e);
              setIsTuning(false);
          }
      }
  };

  // Logic: Select specific video from playlist
  const handleSelectVideo = (video: Video) => {
    setShowClickToStart(false); // Dismiss overlay on interaction
    setShowWelcome(false); // Dismiss welcome screen
    setState(prev => ({
      ...prev,
      currentVideo: video,
      isPlaying: true,
      hasStarted: true
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
        <WelcomeScreen 
          onStart={handleStartJourney}
          language={language}
        />
      )}
      
      {/* SECTOR 1: Main Video Area */}
      <main className="flex-1 relative flex flex-col min-w-0 transition-all duration-300">
        
        {/* Header Overlay */}
        <header className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border shadow-sm">
             <h1 className="text-xl font-black tracking-tighter uppercase leading-none">
               Grooov<span className="text-primary">io</span>
             </h1>
             <p className="text-[10px] text-muted-foreground font-mono">V 1.5.0 // ARIA-COMPLIANT</p>
          </div>

          <div className="flex gap-2 pointer-events-auto">
             <Button variant="secondary" size="icon" onClick={toggleTheme} className="shadow-md rounded-full">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </Button>
                          <Button variant="secondary" size="icon" onClick={toggleMute} className="shadow-md rounded-full">
                 {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

               <Button variant="secondary" size="icon" onClick={toggleFullscreen} className="shadow-md rounded-full">
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
               </Button>

               <Button 
                 variant="secondary" 
                 size="icon" 
                 onClick={handleShare} 
                 className="shadow-md rounded-full relative"
                 disabled={!state.currentVideo}
                 title="Compartilhar clipe"
               >
                  {showShareCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
               </Button>

               <Button 
                 variant="secondary" 
                 size="icon" 
                 onClick={() => setIsInfoModalOpen(true)} 
                 className="shadow-md rounded-full"
                 title="Informações"
               >
                  <Info className="w-4 h-4" />
               </Button>
              
              {/* Retract Toggle Button */}
             <Button 
                variant="primary" 
                size="icon" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="shadow-md rounded-full transition-all"
                aria-label={isSidebarOpen ? "Fechar Barra Lateral" : "Abrir Barra Lateral"}
                title={isSidebarOpen ? "Recolher Barra Lateral" : "Expandir Barra Lateral"}
             >
                {isSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
             </Button>
          </div>
        </header>

        <Sector1Player 
            currentVideo={state.currentVideo} 
            onEnded={handleNext}
            isSidebarOpen={isSidebarOpen}
            language={language}
            onVideoPlay={() => setIsTuning(false)}
            isMuted={isMuted}
            isPlaying={state.isPlaying}
            hasNext={state.queue.findIndex(v => v.id === state.currentVideo?.id) < state.queue.length - 1} // Check if next video exists
        />

        <TVStatic active={isTuning} enableAudio={!showClickToStart} />
        
        {/* Click to Start Overlay - Requires real user click */}
        {showClickToStart && state.hasStarted && (
          <div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer animate-pulse"
            onClick={() => {
              setShowClickToStart(false);
              // Force play after user interaction
              setState(prev => ({ ...prev, isPlaying: true }));
            }}
          >
            <div className="text-center">
              <div className="text-8xl mb-4 animate-bounce">▶</div>
              <p className="text-2xl font-bold">Clique para Iniciar</p>
              <p className="text-sm text-muted-foreground mt-2">Click to Start</p>
            </div>
          </div>
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
                        onClick={() => setState(prev => ({ ...prev, error: null }))}
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
            ${isSidebarOpen ? 'w-80 translate-x-0 opacity-100' : 'w-0 translate-x-10 opacity-0'}
        `}
        aria-hidden={!isSidebarOpen}
      >
        {/* SECTOR 2: Top Right (Search) */}
        <div className="flex-none h-auto z-20 relative border-b border-border">
            <Sector2Search 
                onSearch={handleSearch} 
                isLoading={state.isLoading}
                language={language}
                onLanguageChange={setLanguage}
                currentVideo={state.currentVideo}
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionSelect}
            />
        </div>

        {/* SECTOR 3: Bottom Right (Playlist) */}
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
        />
      </aside>

      {/* Info Modal */}
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
        language={language}
      />

    </div>
  );
};

export default App;