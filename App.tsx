import React, { useState, useEffect } from 'react';
import { PlayerState, SearchParams, Video } from './types';
import { fetchVideosByCriteria } from './services/imvdbService';
import { Sector1Player } from './components/Sector1Player';
import { Sector2Search } from './components/Sector2Search';
import { Sector3Playlist } from './components/Sector3Playlist';
import { Button } from './components/ui/Button';
import { PanelRightClose, PanelRightOpen, Moon, Sun } from 'lucide-react';
import { translations, Language } from './translations';

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Language State
  const [language, setLanguage] = useState<Language>('pt');
  const t = translations[language];

  // Genre State
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]); // Store full unfiltered list

  // Player & Data State
  const [state, setState] = useState<PlayerState>({
    currentVideo: null,
    queue: [],
    isPlaying: false,
    hasStarted: false,
    isLoading: false,
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

  // Logic: Search & Auto-Play
  const handleSearch = async (type: 'year' | 'decade', value: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, currentVideo: null, hasStarted: false }));
    
    try {
      const videos = await fetchVideosByCriteria(type, value);
      
      if (videos.length > 0) {
        setAllVideos(videos); // Save full list
        setSelectedGenre(null); // Reset filter on new search

        // Auto-start logic: Set queue, set first video as current, and set playing state
        setState(prev => ({
          ...prev,
          queue: videos,
          currentVideo: videos[0],
          isLoading: false,
          hasStarted: true,
          isPlaying: true
        }));
      } else {
        setState(prev => ({ 
            ...prev, 
            queue: [],
            isLoading: false, 
            error: 'Nenhum vídeo encontrado para esta data.' 
        }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Falha ao carregar vídeos.' }));
    }
  };

  // Logic: Play / Start (Manual trigger if needed from playlist)
  const handlePlay = () => {
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
  const handleGenreSelect = (genreId: string | null) => {
    setSelectedGenre(genreId);

    // Filter logic
    let filteredQueue = [...allVideos];
    
    if (genreId) {
      // Map UI Genre ID to matching sub-genres/keywords in artist_genre
      const genreMap: Record<string, string[]> = {
        'Rock Alternativo': ['Alternative Rock', 'Grunge', 'Indie Rock', 'Post-Grunge', 'Shoegaze', 'Britpop', 'Folk Rock', 'Alternative'],
        'Punk': ['Punk', 'Pop Punk', 'Ska Punk', 'Hardcore'],
        'Metal': ['Metal', 'Heavy Metal', 'Thrash Metal', 'Nu Metal', 'Industrial Metal', 'Groove Metal', 'Death Metal', 'Black Metal'],
        'Rap': ['Hip Hop', 'Rap', 'Gangsta Rap', 'Alternative Hip Hop', 'Jazz Rap'],
        'Pop': ['Pop', 'Pop Rock', 'Synth-pop', 'Teen Pop', 'Dance-Pop', 'Europop', 'Boy Band', 'Girl Group'],
        'Dance': ['Dance', 'Eurodance', 'House', 'Techno', 'Trance', 'Electronic', 'Disco'],
        'Eletronico': ['Electronic', 'Techno', 'Trance', 'House', 'Big Beat', 'Trip Hop', 'Electronica']
      };

      const targetGenres = genreMap[genreId] || [];
      
      if (targetGenres.length > 0) {
        filteredQueue = allVideos.filter(video => {
          const g = video.artist_genre;
          return g && targetGenres.some(target => g.includes(target) || g === target);
        });
      }
    }

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

    // Update State
    // If currently playing video is in the new list, keep playing it? 
    // Or just update the queue for NEXT track? 
    // Let's replace queue. Current video logic: if current video is NOT in filtered, maybe keep it until end?
    // Simply updating queue is safest.
    
    // HOWEVER: if the filtered list is empty, show empty state?
    // Let's just update queue.
    
    // Let's just update queue.
    
    setState(prev => ({
       ...prev,
       queue: shuffledFiltered,
       // Auto-play the first video of the new shuffled list if we are selecting a genre
       currentVideo: genreId ? shuffledFiltered[0] : prev.currentVideo,
       isPlaying: true,
       hasStarted: true
    }));
  };

  // Logic: Select specific video from playlist
  const handleSelectVideo = (video: Video) => {
    setState(prev => ({
      ...prev,
      currentVideo: video,
      isPlaying: true,
      hasStarted: true
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans text-foreground">
      
      {/* SECTOR 1: Main Video Area */}
      <main className="flex-1 relative flex flex-col min-w-0 transition-all duration-300">
        
        {/* Header Overlay */}
        <header className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border shadow-sm">
             <h1 className="text-xl font-black tracking-tighter uppercase leading-none">
               Retro<span className="text-primary">Clip</span>
             </h1>
             <p className="text-[10px] text-muted-foreground font-mono">V 1.0.0 // ARIA-COMPLIANT</p>
          </div>

          <div className="flex gap-2 pointer-events-auto">
             <Button variant="secondary" size="icon" onClick={toggleTheme} className="shadow-md rounded-full">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
        />
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

    </div>
  );
};

export default App;