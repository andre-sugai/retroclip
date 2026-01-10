import React, { useEffect, useRef, useState } from 'react';
import { Video } from '../types';
import { Disc3 } from 'lucide-react';
import { translations, Language } from '../translations';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Sector1PlayerProps {
  currentVideo: Video | null;
  onEnded: () => void;
  isSidebarOpen: boolean;
  language: Language;
}

export const Sector1Player: React.FC<Sector1PlayerProps> = ({ currentVideo, onEnded, language }) => {
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const t = translations[language].sector1;
  
  // Keep the latest onEnded in a ref to call it from event handlers without stale closures
  const onEndedRef = useRef(onEnded);

  // 3. Info Visibility Timer (Refactored for interaction)
  const [showInfo, setShowInfo] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activateInfo = () => {
    setShowInfo(true);
    
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
        setShowInfo(false);
    }, 15000);
  };

  useEffect(() => {
    if (currentVideo) {
        activateInfo();
    }
    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentVideo?.id]);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // 1. Load YouTube API script safely
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if(previousCallback) previousCallback();
        setIsApiReady(true);
      };
    } else {
      if(window.YT.Player) {
          setIsApiReady(true);
      } else {
          const previousCallback = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            if(previousCallback) previousCallback();
            setIsApiReady(true);
          };
      }
    }
  }, []);

  // 2. Initialize Player
  useEffect(() => {
    if (!currentVideo || !isApiReady || !playerWrapperRef.current) return;

    // Destroy existing instance
    if (playerInstanceRef.current) {
        try {
            if (typeof playerInstanceRef.current.destroy === 'function') {
                playerInstanceRef.current.destroy();
            }
        } catch (e) {
            console.warn("Player destroy failed", e);
        }
    }

    // Reset DOM
    playerWrapperRef.current.innerHTML = '';
    // Ensure visibility is reset for next video
    playerWrapperRef.current.style.opacity = '1'; 
    
    const placeholderDiv = document.createElement('div');
    playerWrapperRef.current.appendChild(placeholderDiv);

    const player = new window.YT.Player(placeholderDiv, {
        height: '100%',
        width: '100%',
        videoId: currentVideo.embed_id || '',
        playerVars: {
            'autoplay': 1,
            'controls': 0, 
            'disablekb': 1,
            'fs': 0,
            'rel': 0,
            'modestbranding': 1,
            'iv_load_policy': 3,
            'origin': window.location.origin,
            'playsinline': 1
        },
        events: {
            'onReady': (event: any) => {
                event.target.playVideo();
                
                // Start polling for end of video
                // We clear any existing interval first just in case
                if ((player as any)._timeUpdateInterval) {
                   clearInterval((player as any)._timeUpdateInterval);
                }

                (player as any)._timeUpdateInterval = setInterval(() => {
                   try {
                     const currentTime = event.target.getCurrentTime();
                     const duration = event.target.getDuration();
                     
                     if (duration > 0 && (duration - currentTime) <= 1) { // 1 second before end
                        event.target.pauseVideo();
                        clearInterval((player as any)._timeUpdateInterval);
                        onEndedRef.current(); // Trigger next video
                     }
                   } catch (e) {
                      // Player might be destroyed
                   }
                }, 1000); 
            },
            'onStateChange': (event: any) => {
                // 0 = ENDED
                // We rely on polling now, but keep this as fallback IF it slips through (unlikely with 1s buffer)
                if (event.data === 0) {
                     onEndedRef.current();
                }
            },
            'onError': (event: any) => {
                // Error 150/153: Restricted content. 
                // Error 100/101: Not found/Restricted.
                console.warn(`Video unavailable (Code ${event.data}). Skipping...`);
                // Immediate skip to keep flow
                onEndedRef.current();
            }
        }
    });

    playerInstanceRef.current = player;
    
    // Attach interval to instance for cleanup
    (playerInstanceRef.current as any)._timeUpdateInterval = (player as any)._timeUpdateInterval;

    return () => {
        if (playerInstanceRef.current) {
            // Clear interval if it exists
            if ((playerInstanceRef.current as any)._timeUpdateInterval) {
                clearInterval((playerInstanceRef.current as any)._timeUpdateInterval);
            }

            try {
                if (typeof playerInstanceRef.current.destroy === 'function') {
                    playerInstanceRef.current.destroy();
                }
            } catch (e) {}
            playerInstanceRef.current = null;
        }
    };
  }, [currentVideo?.embed_id, isApiReady]);

  // IDLE STATE
  if (!currentVideo) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 p-10 text-center select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
                <Disc3 className="w-12 h-12 text-zinc-600 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-zinc-200">{t.awaitingSignal}</h2>
            <p className="max-w-md text-sm opacity-60">
            {t.instruction}
            </p>
        </div>
      </div>
    );
  }

  // PLAYING STATE
  return (
    <div 
        className="relative w-full h-full bg-black overflow-hidden group"
        onMouseEnter={activateInfo}
        onClick={activateInfo}
        onMouseMove={activateInfo}
    >
        <div ref={playerWrapperRef} className="absolute inset-0 z-0 bg-black" />
        
        {/* Interaction Layer - ensuring clicks on video work */}
        <div className="absolute inset-0 z-10 bg-transparent" onClick={activateInfo} />
        
        <div className="absolute inset-x-0 bottom-0 z-20 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none flex flex-col justify-end p-8 md:p-12">
            <div key={currentVideo.id} className="flex flex-col justify-end">
                <div className={`flex items-center gap-3 mb-2 opacity-0 ${showInfo ? 'animate-fade-in' : 'animate-fade-out'}`} style={{ animationDelay: showInfo ? '0.1s' : '0s' }}>
                    <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        {currentVideo.year}
                    </span>
                    <div className="h-px w-8 bg-white/40"></div>
                    <span className="text-xs font-mono text-white/80 uppercase tracking-widest">
                        {t.nowPlaying}
                    </span>
                </div>

                <h1 className={`text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tighter uppercase leading-none mb-2 line-clamp-2 opacity-0 ${showInfo ? 'animate-slide-up' : 'animate-slide-down-out'}`} style={{ animationDelay: showInfo ? '0.2s' : '0s' }}>
                    {currentVideo.song_title}
                </h1>
                
                <p className={`text-xl md:text-2xl text-white/90 font-medium tracking-wide drop-shadow-lg opacity-0 ${showInfo ? 'animate-fade-in' : 'animate-fade-out'}`} style={{ animationDelay: showInfo ? '0.4s' : '0s' }}>
                    {currentVideo.artists.map(a => a.name).join(', ')}
                </p>
            </div>
        </div>
    </div>
  );
};