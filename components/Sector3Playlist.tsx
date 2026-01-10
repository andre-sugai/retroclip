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
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
  onSelectVideo?: (video: Video) => void;
}

const GENRES = [
  { id: 'all', label: 'Tudo' },
  { id: 'Rock Alternativo', label: 'Rock Alt.' },
  { id: 'Punk', label: 'Punk' },
  { id: 'Metal', label: 'Metal' },
  { id: 'Rap', label: 'Rap' },
  { id: 'Pop', label: 'Pop' },
  { id: 'Dance', label: 'Dance' },
  { id: 'Eletronico', label: 'Eletrônico' },
];

export const Sector3Playlist: React.FC<Sector3PlaylistProps> = ({
  queue,
  currentVideo,
  onSkip,
  isLoading,
  hasStarted,
  selectedGenre,
  onSelectGenre,
  onSelectVideo
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background" role="region" aria-label="Playlist">
      
      {/* Header */}
      <div className="flex flex-col border-b border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-10">
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-3 h-3" /> Select Genre
             </h2>
             <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                Auto-Play
             </span>
        </div>
        {/* Removed horizontal genre scroll */}
      </div>

      {/* Main Content: Genre Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-zinc-50/30 dark:bg-black/20">
        
        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-40 gap-4 text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-mono uppercase animate-pulse">Retrieving Data...</p>
            </div>
        )}

        {/* Info Text if not loading and empty queue (shouldn't happen often if genres are static) */}
        {!isLoading && queue.length === 0 && (
           <div className="text-center text-muted-foreground opacity-50 text-xs mb-4">
              Select a genre to load clips.
           </div>
        )}

        {/* Genre Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 h-full content-start">
            {GENRES.map((genre) => {
               const isSelected = selectedGenre === (genre.id === 'all' ? null : genre.id) || (genre.id === 'all' && !selectedGenre);
               
               return (
                  <button
                    key={genre.id}
                    onClick={() => onSelectGenre(genre.id === 'all' ? null : genre.id)}
                    className={`
                      relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all h-24 flex items-center justify-center text-center
                      ${isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md'
                      }
                    `}
                  >
                    {genre.label}
                    {isSelected && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                  </button>
               );
            })}
        </div>
      </div>
    </div>
  );
};