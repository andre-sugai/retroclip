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
  onVideoPlay?: () => void;
}

export const Sector1Player: React.FC<Sector1PlayerProps> = ({ currentVideo, onEnded, language, onVideoPlay }) => {
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

  // 2. Initialize Player & Handle Updates
  useEffect(() => {
    // If we have no video or no API, we can't do anything.
    if (!currentVideo || !isApiReady) return;

    // Creation Logic
    if (!playerInstanceRef.current && playerWrapperRef.current) {
        // Reset DOM for fresh start (only on first creation)
        playerWrapperRef.current.innerHTML = '';
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
                'playsinline': 1,
                'loop': 1,
                'playlist': currentVideo.embed_id
            },
            events: {
                'onReady': (event: any) => {
                    event.target.playVideo();
                    startProgressInterval(event.target);
                },
                'onStateChange': (event: any) => {
                    // 0 = ENDED
                    if (event.data === 0) {
                         onEndedRef.current();
                    }
                    // 1 = PLAYING
                    if (event.data === 1) {
                        if (onVideoPlay) onVideoPlay();
                        startProgressInterval(event.target);
                    }
                },
                'onError': (event: any) => {
                    console.warn(`Video unavailable (Code ${event.data}). Skipping...`);
                    onEndedRef.current();
                }
            }
        });
        playerInstanceRef.current = player;
    } 
    // Update Logic
    else if (playerInstanceRef.current) {
        // Safe check if player is destroyed or not valid
        if (typeof playerInstanceRef.current.getVideoData === 'function') {
            const currentId = playerInstanceRef.current.getVideoData()?.video_id;
            if (currentId !== currentVideo.embed_id) {
                playerInstanceRef.current.loadVideoById(currentVideo.embed_id);
                // We don't need to manually play, loadVideoById autoplays. 
                // Checks will resume in onStateChange(PLAYING).
            }
        }
    }

  }, [currentVideo?.embed_id, isApiReady]);

  // Cleanup on Unmount or if currentVideo becomes null (view-switching)
  useEffect(() => {
      // If currentVideo is null, we should destroy the player if it exists
      // because the wrapper ref is gone from DOM in that case.
      // But this effect runs on every render.
      // We only want to destroy if the COMPONENT unmounts or currentVideo becomes null.
      
      return () => {
          // This cleanup runs when deps change. 
          // If we restrict deps to [!!currentVideo], it runs when video toggles.
      };
  }, []);

  // Dedicated Cleanup Effect
  useEffect(() => {
      if (!currentVideo && playerInstanceRef.current) {
          try {
             playerInstanceRef.current.destroy();
          } catch(e) {}
          playerInstanceRef.current = null;
      }
  }, [!currentVideo]); // Trigger when currentVideo becomes falsy

  // Component Unmount Cleanup
  useEffect(() => {
      return () => {
        if (playerInstanceRef.current) {
            try {
                if ((playerInstanceRef.current as any)._timeUpdateInterval) {
                    clearInterval((playerInstanceRef.current as any)._timeUpdateInterval);
                }
                playerInstanceRef.current.destroy();
            } catch (e) {}
            playerInstanceRef.current = null;
        }
      };
  }, []);

  const startProgressInterval = (player: any) => {
    // Clear existing
    if (player._timeUpdateInterval) {
        clearInterval(player._timeUpdateInterval);
    }

    player._timeUpdateInterval = setInterval(() => {
        try {
            // Check if player is still valid
            if (typeof player.getCurrentTime !== 'function') return;

            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            
            // Background Tab Fix: 
            // Browsers throttle setInterval to 1s in background. 
            // If we are close to the end, we might miss the exact <1s window if checks are spaced out.
            // We increase the threshold slightly to 2s to catch it safely even with throttling, 
            // but ensure we don't skip too early by checking state.
            
            if (duration > 0 && (duration - currentTime) <= 1.5) { 
                clearInterval(player._timeUpdateInterval);
                onEndedRef.current(); // Trigger next video
            }
        } catch (e) {
            // Player destroyed
            if (player._timeUpdateInterval) clearInterval(player._timeUpdateInterval);
        }
    }, 250); // Increased from 100ms to 250ms to be less aggressive but still sufficient, aligning closer to throttled rates
  };

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