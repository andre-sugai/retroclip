import React, { useState } from 'react';
import { Video } from '../types';
import { Radio, ChevronDown, ChevronUp } from 'lucide-react';
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
  availableGenres: Set<string>;
}

// Map IDs to Translation Keys
const GENRE_IDS = [
  { id: 'all', key: 'all' },
  { id: 'Clássicos', key: 'classics' },
  { id: 'Rock Alternativo', key: 'rockAlt' },
  { id: 'Punk', key: 'punk' },
  { id: 'Metal', key: 'metal' },
  { id: 'Rap', key: 'rap' },
  { id: 'Pop', key: 'pop' },
  { id: 'Dance', key: 'dance' },
  { id: 'Eletronico', key: 'electronic' },
  { id: 'Hardcore', key: 'hardcore' },
  { id: 'Hard Rock', key: 'hardRock' },
  { id: 'Industrial', key: 'industrial' },
  { id: 'Nu Metal', key: 'nuMetal' },
  { id: 'Indie', key: 'indie' },
  { id: 'Rock', key: 'rock' },
  { id: 'R&B', key: 'rnb' },
  { id: 'Latin Pop', key: 'latinPop' },
  { id: 'K-Pop', key: 'kpop' },
  { id: 'Folk', key: 'folk' },
  { id: 'Ska', key: 'ska' },
  { id: 'Reggae', key: 'reggae' },
] as const;

export const Sector3Playlist: React.FC<Sector3PlaylistProps> = ({
  queue,
  currentVideo,
  isLoading,
  selectedGenre,
  onSelectGenre,
  language,
  availableGenres
}) => {
  const t = translations[language].sector3;
  const tGenres = translations[language].sector3.genres;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLabelsCollapsed, setIsLabelsCollapsed] = useState(false);
  const [isShowsCollapsed, setIsShowsCollapsed] = useState(false);
  const [isFestivalsCollapsed, setIsFestivalsCollapsed] = useState(false);
  const [isProgramsCollapsed, setIsProgramsCollapsed] = useState(false);
  const [isRadiosCollapsed, setIsRadiosCollapsed] = useState(false);


  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background overflow-y-auto custom-scrollbar" role="region" aria-label="Playlist">
      
      {/* Header */}
      <button 
        className="flex flex-col border-b border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-20 sticky top-0 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors w-full text-left"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls="genres-grid"
      >
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 border border-muted-foreground/30 rounded bg-zinc-100 dark:bg-zinc-800">
                  {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
                {t.selectGenre}
             </h2>
        </div>
      </button>

      {/* Main Content: Genre Grid */}
      <div 
        id="genres-grid"
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 bg-zinc-50/30 dark:bg-black/20">
            
            {/* Loading State Removed from Here */}

            {/* Info Text if not loading and empty queue */}
            {!isLoading && queue.length === 0 && (
               <div className="text-center text-muted-foreground opacity-50 text-xs mb-4">
                  {t.emptyState}
               </div>
            )}

            {/* Genre Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 h-full content-start pb-4">
                {GENRE_IDS.map((genre) => {
                   // Check availability (except for 'all' which is always available)
                   if (genre.id !== 'all' && !availableGenres.has(genre.id)) {
                       return null;
                   }

                   const isSelected = selectedGenre === (genre.id === 'all' ? null : genre.id) || (genre.id === 'all' && !selectedGenre);
                   // @ts-ignore - dynamic key access
                   const label = tGenres[genre.key];

                   return (
                      <button
                        key={genre.id}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent header toggle when clicking buttons
                            if (isSelected) return;
                            onSelectGenre(genre.id === 'all' ? null : genre.id);
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
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
      </div>

      {/* GRAVADORAS SECTION */}
      {/* Header */}
      <button 
        className="flex flex-col border-y border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-10 sticky top-[48px] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors w-full text-left"
        onClick={() => setIsLabelsCollapsed(!isLabelsCollapsed)}
        aria-expanded={!isLabelsCollapsed}
        aria-controls="labels-grid"
      >
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 border border-muted-foreground/30 rounded bg-zinc-100 dark:bg-zinc-800">
                  {isLabelsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
                {t.recordLabels}
             </h2>
        </div>
      </button>

      {/* Labels Content */}
      <div 
        id="labels-grid"
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isLabelsCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      >
        <div className="overflow-hidden">
             <div className="p-4 bg-zinc-50/30 dark:bg-black/20">
                <div className="grid grid-cols-1 gap-3">
                    {/* Atlantic Button */}
                    <button
                        onClick={(e) => {
                           e.stopPropagation();
                           if (selectedGenre === 'atlantic') return;
                           onSelectGenre('atlantic');
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${selectedGenre === 'atlantic'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                          }
                        `}
                    >
                        {t.labels.atlantic}
                        {selectedGenre === 'atlantic' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </button>

                    {/* Epitaph Button */}
                    <button
                        onClick={(e) => {
                           e.stopPropagation();
                           if (selectedGenre === 'epitaph') return;
                           onSelectGenre('epitaph');
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${selectedGenre === 'epitaph'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                          }
                        `}
                    >
                        {t.labels.epitaph}
                        {selectedGenre === 'epitaph' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </button>

                    {/* Road Runner Button */}
                    <button
                        onClick={(e) => {
                           e.stopPropagation();
                           if (selectedGenre === 'road_runner') return;
                           onSelectGenre('road_runner');
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${selectedGenre === 'road_runner'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                          }
                        `}
                    >
                        {t.labels.roadRunner}
                        {selectedGenre === 'road_runner' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </button>

                    {/* Sub Pop Button */}
                    <button
                        onClick={(e) => {
                           e.stopPropagation();
                           if (selectedGenre === 'subpop') return;
                           onSelectGenre('subpop');
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${selectedGenre === 'subpop'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                          }
                        `}
                    >
                        {t.labels.subpop}
                        {selectedGenre === 'subpop' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </button>


                </div>
             </div>
        </div>
       </div>

      {/* SHOWS SECTION */}
      {/* Header */}
      <button 
        className="flex flex-col border-y border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-10 sticky top-[96px] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors w-full text-left"
        onClick={() => setIsShowsCollapsed(!isShowsCollapsed)}
        aria-expanded={!isShowsCollapsed}
        aria-controls="shows-grid"
      >
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 border border-muted-foreground/30 rounded bg-zinc-100 dark:bg-zinc-800">
                  {isShowsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
                {t.shows}
             </h2>
        </div>
      </button>

      {/* Shows Content */}
      <div 
        id="shows-grid"
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isShowsCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      >
        <div className="overflow-hidden">
             <div className="p-4 bg-zinc-50/30 dark:bg-black/20">
                <div className="grid grid-cols-1 gap-3">
                    {/* Full Show Button */}
                    {availableGenres.has('full_show') && (
                        <button
                            onClick={() => {
                               if (selectedGenre === 'full_show') return;
                               onSelectGenre('full_show');
                            }}
                            className={`
                              relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                              ${selectedGenre === 'full_show'
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                              }
                            `}
                        >
                            {t.fullShow}
                            {selectedGenre === 'full_show' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    )}

                    {/* Acoustic Button */}
                    {availableGenres.has('acoustic') && (
                        <button
                            onClick={() => {
                               if (selectedGenre === 'acoustic') return; 
                               onSelectGenre('acoustic');
                            }}
                            className={`
                              relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                              ${selectedGenre === 'acoustic'
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                              }
                            `}
                        >
                            {t.acoustic}
                            {selectedGenre === 'acoustic' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    )}
                </div>
             </div>
        </div>
       </div>

      {/* FESTIVAIS SECTION */}
      {/* Header */}
      <button 
        className="flex flex-col border-y border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-10 sticky top-[144px] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors w-full text-left"
        onClick={() => setIsFestivalsCollapsed(!isFestivalsCollapsed)}
        aria-expanded={!isFestivalsCollapsed}
        aria-controls="festivals-grid"
      >
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 border border-muted-foreground/30 rounded bg-zinc-100 dark:bg-zinc-800">
                  {isFestivalsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
                FESTIVAIS
             </h2>
        </div>
      </button>

      {/* Festivals Content */}
      <div 
        id="festivals-grid"
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isFestivalsCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      >
        <div className="overflow-hidden">
             <div className="p-4 bg-zinc-50/30 dark:bg-black/20">
                <div className="grid grid-cols-1 gap-3">
                    {/* Pinkpop Button */}
                    <button
                        onClick={() => {
                           if (selectedGenre === 'pinkpop') return;
                           onSelectGenre('pinkpop');
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${selectedGenre === 'pinkpop'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                          }
                        `}
                    >
                        PINKPOP
                        {selectedGenre === 'pinkpop' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </button>
                </div>
             </div>
        </div>
       </div>

      {/* RADIOS SECTION */}
      {/* Header */}
      <button 
        className="flex flex-col border-y border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-10 sticky top-[192px] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors w-full text-left"
        onClick={() => setIsRadiosCollapsed(!isRadiosCollapsed)}
        aria-expanded={!isRadiosCollapsed}
        aria-controls="radios-grid"
      >
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 border border-muted-foreground/30 rounded bg-zinc-100 dark:bg-zinc-800">
                  {isRadiosCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
                RADIOS
             </h2>
        </div>
      </button>

      {/* Radios Content */}
      <div 
        id="radios-grid"
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isRadiosCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      >
        <div className="overflow-hidden">
             <div className="p-4 bg-zinc-50/30 dark:bg-black/20">
                <div className="grid grid-cols-1 gap-3">
                    {/* Kiss FM Button */}
                    <button
                        onClick={(e) => {
                           e.stopPropagation();
                           if (selectedGenre === 'kiss_fm') return;
                           onSelectGenre('kiss_fm');
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${selectedGenre === 'kiss_fm' || currentVideo?.id === 99999999
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                          }
                        `}
                    >
                        KISS FM
                        {(selectedGenre === 'kiss_fm' || currentVideo?.id === 99999999) && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </button>

                    {/* 89 FM Button */}
                    <button
                        onClick={(e) => {
                           e.stopPropagation();
                           if (selectedGenre === 'radio_89fm') return;
                           onSelectGenre('radio_89fm');
                        }}
                        className={`
                          relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                          ${selectedGenre === 'radio_89fm' || currentVideo?.id === 99999998
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                          }
                        `}
                    >
                        89 FM
                        {(selectedGenre === 'radio_89fm' || currentVideo?.id === 99999998) && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </button>
                </div>
             </div>
        </div>
       </div>

      {/* PROGRAMS SECTION */}
      {/* Header */}
      <button 
        className="flex flex-col border-y border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-10 sticky top-[240px] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors w-full text-left"
        onClick={() => setIsProgramsCollapsed(!isProgramsCollapsed)}
        aria-expanded={!isProgramsCollapsed}
        aria-controls="programs-grid"
      >
        <div className="px-6 py-3 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 border border-muted-foreground/30 rounded bg-zinc-100 dark:bg-zinc-800">
                  {isProgramsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
                Programas
             </h2>
        </div>
      </button>

      {/* Programs Content */}
      <div 
        id="programs-grid"
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isProgramsCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      >
        <div className="overflow-hidden">
             <div className="p-4 bg-zinc-50/30 dark:bg-black/20">
                <div className="grid grid-cols-1 gap-3">
                    {/* Documentários Button */}
                    {availableGenres.has('documentarios') && (
                        <button
                            onClick={() => {
                               if (selectedGenre === 'documentarios') return;
                               onSelectGenre('documentarios');
                            }}
                            className={`
                              relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                              ${selectedGenre === 'documentarios'
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                              }
                            `}
                        >
                            Documentários
                            {selectedGenre === 'documentarios' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    )}

                    {/* Hermes & Renato Button */}
                    {availableGenres.has('hermes_renato') && (
                        <button
                            onClick={() => {
                               if (selectedGenre === 'hermes_renato') return;
                               onSelectGenre('hermes_renato');
                            }}
                            className={`
                              relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                              ${selectedGenre === 'hermes_renato'
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                              }
                            `}
                        >
                            Hermes & Renato
                            {selectedGenre === 'hermes_renato' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    )}

                    {/* Beavis and Butt-Head Button */}
                    {availableGenres.has('beavis_butthead') && (
                        <button
                            onClick={() => {
                               if (selectedGenre === 'beavis_butthead') return;
                               onSelectGenre('beavis_butthead');
                            }}
                            className={`
                              relative p-4 rounded-lg border text-sm font-bold uppercase tracking-widest transition-all duration-300 h-16 flex items-center justify-center text-center overflow-hidden
                              ${selectedGenre === 'beavis_butthead'
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:border-primary/50 hover:text-primary dark:hover:border-zinc-700 hover:shadow-md hover:scale-[1.01]'
                              }
                            `}
                        >
                            Beavis and Butt-Head
                            {selectedGenre === 'beavis_butthead' && <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    )}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};