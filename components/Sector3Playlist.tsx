import React from 'react';
import { Video } from '../types';
import { Loader2, Radio } from 'lucide-react';
import { translations, Language } from '../translations';

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
  language: Language;
}

// Map IDs to Translation Keys
const GENRE_IDS = [
  { id: 'all', key: 'all' },
  { id: 'Rock Alternativo', key: 'rockAlt' },
  { id: 'Punk', key: 'punk' },
  { id: 'Metal', key: 'metal' },
  { id: 'Rap', key: 'rap' },
  { id: 'Pop', key: 'pop' },
  { id: 'Dance', key: 'dance' },
  { id: 'Eletronico', key: 'electronic' },
  { id: 'Hardcore', key: 'hardcore' },
  { id: 'Industrial', key: 'industrial' },
  { id: 'Nu Metal', key: 'nuMetal' },
  { id: 'Indie', key: 'indie' },
] as const;

export const Sector3Playlist: React.FC<Sector3PlaylistProps> = ({
  queue,
  currentVideo,
  isLoading,
  selectedGenre,
  onSelectGenre,
  language
}) => {
  const t = translations[language].sector3;
  const tGenres = translations[language].sector3.genres;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background" role="region" aria-label="Playlist">
      
      {/* Header */}
      <div className="flex flex-col border-b border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-10">
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-3 h-3" /> {t.selectGenre}
             </h2>
             <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                {t.autoPlay}
             </span>
        </div>
      </div>

      {/* Main Content: Genre Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-zinc-50/30 dark:bg-black/20">
        
        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-40 gap-4 text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-mono uppercase animate-pulse">{t.loading}</p>
            </div>
        )}

        {/* Info Text if not loading and empty queue */}
        {!isLoading && queue.length === 0 && (
           <div className="text-center text-muted-foreground opacity-50 text-xs mb-4">
              {t.emptyState}
           </div>
        )}

        {/* Genre Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 h-full content-start">
            {GENRE_IDS.map((genre) => {
               const isSelected = selectedGenre === (genre.id === 'all' ? null : genre.id) || (genre.id === 'all' && !selectedGenre);
               // @ts-ignore - dynamic key access
               const label = tGenres[genre.key];

               return (
                  <button
                    key={genre.id}
                    onClick={() => {
                        if (isSelected) return;
                        onSelectGenre(genre.id === 'all' ? null : genre.id);
                    }}
                    className={`
                      relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all h-16 flex items-center justify-center text-center
                      ${isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md'
                      }
                    `}
                  >
                    {label}
                    {isSelected && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                  </button>
               );
            })}
        </div>
      </div>
    </div>
  );
};