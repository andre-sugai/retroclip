import React, { useEffect, useRef, useState } from 'react';
import { Video } from '../types';
import { Disc3, CircleArrowRight, Play } from 'lucide-react';
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
  isMuted?: boolean;
  isPlaying?: boolean;
  hasNext?: boolean;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
  forceCaptions?: boolean;
}

export const Sector1Player: React.FC<Sector1PlayerProps> = ({
  currentVideo,
  onEnded,
  language,
  onVideoPlay,
  isMuted = false,
  isPlaying = false,
  hasNext = false,
  initialTime = 0,
  onTimeUpdate,
  forceCaptions = false,
}) => {
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const t = translations[language].sector1;

  // Keep the latest onEnded in a ref to call it from event handlers without stale closures
  const onEndedRef = useRef(onEnded);
  const globalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 3. Info Visibility Timer (Refactored for interaction)
  const [showInfo, setShowInfo] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Play Overlay for In-App Browsers (Instagram, Facebook, etc.)
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);

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

  // Handle Media Session API to prevent external pausing (Bluetooth/Hardware keys)
  // AND Handle Visibility Change (Auto-Resume on return)
  useEffect(() => {
    // 1. Media Session
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('pause', () => {
        // Do nothing to prevent pausing, or force play if needed
        console.log('External pause blocked');
        if (
          playerInstanceRef.current &&
          typeof playerInstanceRef.current.playVideo === 'function'
        ) {
          playerInstanceRef.current.playVideo();
        }
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        console.log('External stop blocked');
      });
      navigator.mediaSession.setActionHandler('play', () => {
        if (
          playerInstanceRef.current &&
          typeof playerInstanceRef.current.playVideo === 'function'
        ) {
          playerInstanceRef.current.playVideo();
        }
      });
    }

    // 2. Visibility Change (Fix for iOS Safari Freeze)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Grooovio] Tab became visible. Checking playback state...');
        // Small delay to ensure browser engine is fully woke up
        setTimeout(() => {
          if (
            isPlaying && 
            playerInstanceRef.current && 
            typeof playerInstanceRef.current.getPlayerState === 'function'
          ) {
            const state = playerInstanceRef.current.getPlayerState();
            // If supposed to be playing but isn't (paused=2, unstarted=-1, cued=5)
            if (state === 2 || state === -1 || state === 5) {
               console.log('[Grooovio] Auto-resuming after background backgrounding');
               playerInstanceRef.current.playVideo();
            }
          }
        }, 300);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('stop', null);
        navigator.mediaSession.setActionHandler('play', null);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]); // Added isPlaying dependency to know if we SHOULD be playing

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // 1. Load YouTube API script safely
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        setIsApiReady(true);
      };
    } else {
      if (window.YT.Player) {
        setIsApiReady(true);
      } else {
        const previousCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (previousCallback) previousCallback();
          setIsApiReady(true);
        };
      }
    }
  }, []);

  // 2. Initialize Player & Handle Updates
  useEffect(() => {
    // If we have no video or no API, we can't do anything.
    if (!currentVideo || !isApiReady) return;

    // Clear any existing timeouts
    if (globalTimeoutRef.current) {
      clearTimeout(globalTimeoutRef.current);
      globalTimeoutRef.current = null;
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // Set a global timeout as ultimate fallback
    // Shows and acoustic performances can be longer, so give them more time
    const isShow = currentVideo.is_show;
    const isAcoustic =
      currentVideo.artist_genre?.includes('acousticShow') ||
      currentVideo.artist_genre?.includes('acoustic') ||
      currentVideo.song_title?.toLowerCase().includes('acoustic') ||
      currentVideo.song_title?.toLowerCase().includes('acústico');

    const maxDuration = isShow || isAcoustic ? 15 * 60 * 1000 : 8 * 60 * 1000; // 15min for shows/acoustic, 8min for regular clips

    globalTimeoutRef.current = setTimeout(() => {
      console.log(
        `[Grooovio] Global timeout reached (${
          maxDuration / 60000
        }min), forcing next video`
      );
      onEndedRef.current();
    }, maxDuration);

    // Set a loading timeout to detect videos that fail to load/start
    loadingTimeoutRef.current = setTimeout(() => {
      console.log(
        '[Grooovio] Video failed to load within 10 seconds, skipping to next'
      );
      onEndedRef.current();
    }, 10000); // 10 seconds to load

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
          autoplay: 0, // Manual control via isPlaying prop
          mute: 1, // Start muted to bypass browser autoplay restrictions
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          cc_load_policy: forceCaptions ? 1 : 0,
          origin: window.location.origin,
          playsinline: 1,
          loop: 0,
          start: Math.floor(initialTime), // Start at specific time if provided
          widget_referrer: window.location.href,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log('[Grooovio] Player ready');

            // Clear loading timeout since video loaded successfully
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
            }

            if (isPlaying) {
              event.target.playVideo();
              event.target.playVideo();
              // event.target.setLoop(true); // Removed to fix infinite loop issue
              
              // Detect autoplay failure (in-app browsers like Instagram)
              setTimeout(() => {
                try {
                  const state = event.target.getPlayerState();
                  // If not playing after attempt, show overlay
                  if (state !== 1) {
                    console.log('[Grooovio] Autoplay blocked, showing play overlay');
                    setShowPlayOverlay(true);
                  }
                } catch (e) {
                  console.warn('[Grooovio] Could not check player state');
                }
              }, 1000);
              
              // Unmute after starting only if not muted
              if (!isMuted) {
                setTimeout(() => {
                  event.target.unMute();
                }, 100);
              }
            }
            startProgressInterval(event.target);
          },
          onStateChange: (event: any) => {
            // Clear loading timeout when video starts playing
            if (event.data === 1 && loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
            }

            // 0 = ENDED
            if (event.data === 0) {
              console.log('[Grooovio] Video ended, triggering next');
              onEndedRef.current();
            }
            // 1 = PLAYING
            if (event.data === 1) {
              // Hide play overlay when video starts
              setShowPlayOverlay(false);
              if (onVideoPlay) onVideoPlay();
              startProgressInterval(event.target);
            }
            // 2 = PAUSED - restart progress interval to catch near-end
            if (event.data === 2) {
              startProgressInterval(event.target);
            }
          },
          onError: (event: any) => {
            console.warn(
              `Video unavailable (Code ${event.data}). Skipping to next...`
            );
            // Immediately skip to the next video when an error occurs
            setTimeout(() => {
              if (onEndedRef.current) {
                onEndedRef.current();
              }
            }, 100); // Reduced from 500ms to 100ms for faster skipping
          },
        },
      });
      playerInstanceRef.current = player;
    }
    // Update Logic
    else if (playerInstanceRef.current) {
      // Safe check if player is destroyed or not valid
      if (typeof playerInstanceRef.current.getVideoData === 'function') {
        const currentId = playerInstanceRef.current.getVideoData()?.video_id;
        if (currentId !== currentVideo.embed_id) {
          // Use loadVideoById for standard behavior. The restart logic handles the gap.
          playerInstanceRef.current.loadVideoById(currentVideo.embed_id);
          if (isPlaying) {
            // loadVideoById usually autoplays, but we enforce specific handling if needed
          }
        }
      }
    }
  }, [currentVideo?.embed_id, isApiReady]);

  // Handle Play/Pause Prop Changes
  useEffect(() => {
    if (
      playerInstanceRef.current &&
      typeof playerInstanceRef.current.playVideo === 'function'
    ) {
      if (isPlaying) {
        playerInstanceRef.current.playVideo();
        // Try unmuting if playing and not muted
        if (!isMuted) {
          setTimeout(() => {
            try {
              playerInstanceRef.current.unMute();
            } catch (e) {}
          }, 100);
        }
      } else {
        playerInstanceRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

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
      } catch (e) {}
      playerInstanceRef.current = null;
    }
  }, [!currentVideo]); // Trigger when currentVideo becomes falsy

  // Handle Mute/Unmute
  useEffect(() => {
    if (
      playerInstanceRef.current &&
      typeof playerInstanceRef.current.isMuted === 'function'
    ) {
      if (isMuted) {
        playerInstanceRef.current.mute();
      } else {
        playerInstanceRef.current.unMute();
      }
    }
  }, [isMuted]);

  // Component Unmount Cleanup
  useEffect(() => {
    return () => {
      if (globalTimeoutRef.current) {
        clearTimeout(globalTimeoutRef.current);
        globalTimeoutRef.current = null;
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (playerInstanceRef.current) {
        try {
          if ((playerInstanceRef.current as any)._timeUpdateInterval) {
            clearInterval(
              (playerInstanceRef.current as any)._timeUpdateInterval
            );
          }
          if ((playerInstanceRef.current as any)._safetyTimeout) {
            clearTimeout((playerInstanceRef.current as any)._safetyTimeout);
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

    // Clear existing safety timeout
    if (player._safetyTimeout) {
      clearTimeout(player._safetyTimeout);
    }

    player._timeUpdateInterval = setInterval(() => {
      try {
        // Check if player is still valid
        if (typeof player.getCurrentTime !== 'function') return;

        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const playerState = player.getPlayerState();

        // Safety timeout - if video is longer than expected, force next
        if (duration > 0 && currentTime > duration + 5) {
          console.log('[Grooovio] Video exceeded duration, forcing next');
          clearInterval(player._timeUpdateInterval);
          onEndedRef.current();
          return;
        }

        // ULTRA aggressive end detection - start checking when 5 seconds remain
        if (duration > 0 && duration - currentTime <= 5.0) {
          console.log(
            `[Grooovio] Near end detected: ${currentTime}/${duration}, state: ${playerState}`
          );

          // Set a safety timeout to force advance if nothing else works - MUCH shorter
          if (!player._safetyTimeout) {
            const remainingTime = Math.max(duration - currentTime, 0.2);
            player._safetyTimeout = setTimeout(() => {
              console.log(
                '[Grooovio] Safety timeout triggered, forcing next video'
              );
              clearInterval(player._timeUpdateInterval);
              onEndedRef.current();
            }, (remainingTime + 0.5) * 1000); // Add only 0.5 second buffer
          }

          // MUCH more aggressive - trigger when 2 seconds remain OR if paused with 5 seconds remaining
          if (
            duration - currentTime <= 2.0 ||
            (playerState === 2 && duration - currentTime <= 5.0) ||
            playerState === 0 // Also check if already ended
          ) {
            console.log(
              '[Grooovio] Triggering next video from progress interval'
            );
            clearInterval(player._timeUpdateInterval);
            if (player._safetyTimeout) {
              clearTimeout(player._safetyTimeout);
              player._safetyTimeout = null;
            }
            onEndedRef.current();
            return;
          }
        }

        // Also check if video is stuck/paused at the very end
        if (
          duration > 0 &&
          currentTime >= duration - 0.5 &&
          playerState !== 1
        ) {
          console.log('[Grooovio] Video stuck at end, triggering next');
          clearInterval(player._timeUpdateInterval);
          if (player._safetyTimeout) {
            clearTimeout(player._safetyTimeout);
            player._safetyTimeout = null;
          }
          onEndedRef.current();
          return;
        }

        // Check if video has been paused for too long near the end
        if (
          playerState === 2 &&
          duration > 0 &&
          duration - currentTime <= 10.0
        ) {
          if (!player._pauseStartTime) {
            player._pauseStartTime = Date.now();
          } else {
            // Be more tolerant with shows and acoustic performances
            const isShow = currentVideo?.is_show;
            const isAcoustic =
              currentVideo?.artist_genre?.includes('acousticShow') ||
              currentVideo?.artist_genre?.includes('acoustic') ||
              currentVideo?.song_title?.toLowerCase().includes('acoustic') ||
              currentVideo?.song_title?.toLowerCase().includes('acústico');

            const pauseThreshold = isShow || isAcoustic ? 30000 : 15000; // 30s for shows/acoustic, 15s for regular

            if (Date.now() - player._pauseStartTime > pauseThreshold) {
              console.log(
                `[Grooovio] Video paused too long near end (${
                  pauseThreshold / 1000
                }s), forcing next`
              );
              clearInterval(player._timeUpdateInterval);
              if (player._safetyTimeout) {
                clearTimeout(player._safetyTimeout);
                player._safetyTimeout = null;
              }
              onEndedRef.current();
              return;
            }
          }
        } else {
          player._pauseStartTime = null;
        }

        if (onTimeUpdate) onTimeUpdate(currentTime);
      } catch (e) {
        // Player destroyed
        if (player._timeUpdateInterval)
          clearInterval(player._timeUpdateInterval);
        if (player._safetyTimeout) {
          clearTimeout(player._safetyTimeout);
          player._safetyTimeout = null;
        }
      }
    }, 50); // Check every 50ms for more responsive detection
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
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-zinc-200">
            {t.awaitingSignal}
          </h2>
          <p className="max-w-md text-sm opacity-60">{t.instruction}</p>
        </div>
      </div>
    );
  }

  // PLAYING STATE
  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden group"
      onMouseEnter={activateInfo}
      onMouseMove={activateInfo}
    >
      <div ref={playerWrapperRef} className="absolute inset-0 z-0 bg-black" />

      {/* Transparent layer to prevent clicks on the YouTube iframe */}
      <div className="absolute inset-0 z-[5] bg-transparent cursor-default" />

      <div className={`absolute inset-x-0 bottom-0 z-20 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none flex flex-col justify-end px-5 pt-5 pb-24 md:p-12 transition-opacity duration-700 ${
        showInfo ? 'opacity-100' : 'opacity-100 md:opacity-0'
      }`}>
        <div key={currentVideo.id} className="flex flex-col justify-end">
          <div
            className={`flex items-center gap-3 mb-1 md:mb-2 opacity-100 md:opacity-0 ${
              showInfo ? 'md:animate-fade-in' : 'md:animate-fade-out'
            }`}
            style={{ animationDelay: showInfo ? '0.1s' : '0s' }}
          >
            <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              {currentVideo.year}
            </span>
            <div className="h-px w-8 bg-white/40"></div>
            <span className="text-xs font-mono text-white/80 uppercase tracking-widest">
              {t.nowPlaying}
            </span>
          </div>

          <h1
            className={`text-2xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tighter uppercase leading-none mb-1 md:mb-2 line-clamp-2 opacity-100 md:opacity-0 ${
              showInfo ? 'md:animate-slide-up' : 'md:animate-slide-down-out'
            }`}
            style={{ animationDelay: showInfo ? '0.2s' : '0s' }}
          >
            {currentVideo.song_title}
          </h1>

          <p
            className={`text-sm md:text-2xl text-white/90 font-medium tracking-wide drop-shadow-lg opacity-100 md:opacity-0 ${
              showInfo ? 'md:animate-fade-in' : 'md:animate-fade-out'
            }`}
            style={{ animationDelay: showInfo ? '0.4s' : '0s' }}
          >
            {currentVideo.artists.map((a) => a.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Play Overlay - For In-App Browsers (Instagram, Facebook, etc.) */}
      {showPlayOverlay && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            // Global click handler on the overlay also works
            if (playerInstanceRef.current && typeof playerInstanceRef.current.playVideo === 'function') {
                playerInstanceRef.current.playVideo();
                playerInstanceRef.current.unMute();
            }
            setShowPlayOverlay(false);
          }}
        >
          <div className="flex flex-col items-center gap-4 px-6 pointer-events-none"> 
             {/* pointer-events-none so the click passes through to the parent div or we handle it on button specifically */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Handle it directly here
                if (playerInstanceRef.current && typeof playerInstanceRef.current.playVideo === 'function') {
                    playerInstanceRef.current.playVideo();
                    playerInstanceRef.current.unMute();
                }
                setShowPlayOverlay(false);
              }}
              className="pointer-events-auto bg-white/90 hover:bg-white text-black rounded-full p-6 md:p-8 transition-all duration-300 hover:scale-110 shadow-2xl flex items-center justify-center animate-pulse"
              aria-label="Play Video"
            >
              <Play className="w-12 h-12 md:w-16 md:h-16 ml-1" fill="currentColor" />
            </button>
            <p className="text-white text-sm md:text-base text-center font-medium drop-shadow-lg animate-pulse">
              {language === 'pt' 
                ? 'Toque para iniciar' 
                : 'Tap to start'}
            </p>
          </div>
        </div>
      )}

      {/* Next Button - Bottom Right */}
      <div className={`absolute bottom-8 right-8 z-30 transition-opacity duration-700 ${
        showInfo ? 'opacity-100' : 'opacity-100 md:opacity-0'
      }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnded();
          }}
          className={`pointer-events-auto text-white transition-all duration-300 hover:scale-110 opacity-100 md:opacity-0 ${
            showInfo ? 'md:animate-fade-in' : 'md:animate-fade-out'
          }`}
          style={{ animationDelay: showInfo ? '0.5s' : '0s' }}
          aria-label={t.nextVideo || 'Next video'}
        >
          <CircleArrowRight className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
