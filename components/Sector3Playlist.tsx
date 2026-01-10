import React from 'react';
import { Video } from '../types';
import { SkipForward, Music, Loader2, Radio } from 'lucide-react';
import { Button } from './ui/Button';

interface Sector3PlaylistProps {
  queue: Video[];
  currentVideo: Video | null;
  onPlay: () => void;
  onSkip: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  hasStarted: boolean;
}

export const Sector3Playlist: React.FC<Sector3PlaylistProps> = ({
  queue,
  currentVideo,
  onSkip,
  isLoading,
  hasStarted
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background" role="region" aria-label="Playlist">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-3 h-3" /> Up Next
             </h2>
             <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                {queue.length} Tracks
             </span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-zinc-50/30 dark:bg-black/20">
        
        {/* Empty State */}
        {queue.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-8 text-center opacity-60">
                <Music className="w-12 h-12 mb-4 opacity-30" />
                <p>Playlist Empty.</p>
                <p className="text-xs mt-2 opacity-70">Use the Time Machine above to load clips.</p>
            </div>
        )}

        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-40 gap-4 text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-mono uppercase animate-pulse">Retrieving Data...</p>
            </div>
        )}

        {/* List Items */}
        {queue.map((video, index) => {
          const isCurrent = currentVideo?.id === video.id;
          
          return (
            <div 
              key={`${video.id}-${index}`}
              className={`group relative flex gap-3 p-2 rounded-lg transition-all border border-transparent 
                ${isCurrent 
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm' 
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 sm:w-16 sm:h-12 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                 {video.image ? (
                    <img src={video.image.t || video.image.o} alt="Thumb" className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full bg-zinc-700" />
                 )}
                 
                 {/* Playing Animation Overlay */}
                 {isCurrent && hasStarted && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-0.5">
                         <div className="w-0.5 h-3 bg-primary animate-bounce" style={{animationDelay:'0ms'}}/>
                         <div className="w-0.5 h-5 bg-primary animate-bounce" style={{animationDelay:'150ms'}}/>
                         <div className="w-0.5 h-2 bg-primary animate-bounce" style={{animationDelay:'300ms'}}/>
                     </div>
                 )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className={`text-xs font-bold truncate leading-tight mb-0.5 ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                    {video.song_title}
                </h4>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wide">
                    {video.artists.map(a => a.name).join(', ')}
                </p>
              </div>

              {/* Hover Actions (Skip) */}
              {isCurrent && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md" onClick={(e) => { e.stopPropagation(); onSkip(); }} title="Skip">
                        <SkipForward className="w-3 h-3" />
                    </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};