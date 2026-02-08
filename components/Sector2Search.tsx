import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calendar,
  Film,
  Play,
  Clock,
  Coffee,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from './ui/Button';
import { DonationModal } from './DonationModal';
import {
  TOTAL_VIDEOS_COUNT,
  TOTAL_CLIPS,
  TOTAL_SHOWS,
  TOTAL_PROGRAMS,
  getCountries,
  getAvailableDecades,
} from '../services/imvdbService';
import { translations, Language } from '../translations';
import { getTotalVisits } from '../services/goatCounterService';

// Simple Flag Components as SVGs
const FlagBR = () => (
  <svg
    viewBox="0 0 640 480"
    className="w-full h-full grayscale hover:grayscale-0 transition-all"
  >
    <path fill="#009c3b" d="M0 0h640v480H0z" />
    <path fill="#ffdf00" d="m320 40 277 200-277 200L43 240z" />
    <circle cx="320" cy="240" r="83" fill="#002776" />
    <path
      fill="#fff"
      d="M309 237h0c22 0 42 10 56 25l6-3c-15-18-39-28-62-28v6z"
    />
  </svg>
);

const FlagUS = () => (
  <svg
    viewBox="0 0 640 480"
    className="w-full h-full grayscale hover:grayscale-0 transition-all"
  >
    <path fill="#bd3d44" d="M0 0h640v480H0z" />
    <path
      stroke="#fff"
      strokeWidth="37"
      d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
    />
    <path fill="#192f5d" d="M0 0h296v258H0z" />
    {/* Simplified Stars */}
    <path
      fill="#fff"
      d="M34 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM94 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM153 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM213 23l4 13h14l-11 8 4 13-11-7-10 7 4-13-11-8h14zM272 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM64 54l4 12h13l-10 8 4 12-11-7-10 7 4-12-11-8h13zM123 54l4 12h14l-11 8 4 12-11-7-10 7 4-12-11-8h14zM183 54l4 12h13l-10 8 4 12-11-7-10 7 4-12-11-8h13zM242 54l4 12h13l-10 8 4 12-11-7-10 7 4-12-11-8h13z"
    />
  </svg>
);

const COUNTRY_NAMES: Record<string, string> = {
  BR: 'Brasil',
  US: 'Estados Unidos',
  GB: 'Reino Unido',
  EN: 'Inglaterra',
  CA: 'Canadá',
  AU: 'Austrália',
  DE: 'Alemanha',
  SE: 'Suécia',
  IT: 'Itália',
  IE: 'Irlanda',
  FR: 'França',
  ES: 'Espanha',
  INTL: 'Internacional/Desconhecido',
};

interface Sector2SearchProps {
  onSearch: (type: 'year' | 'decade' | 'all', value: string) => void;
  isLoading: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentVideo: any | null;
  selectedRegion: string;
  onRegionChange: (region: string, forceAllMode?: boolean) => void;
}

export const Sector2Search: React.FC<Sector2SearchProps> = ({
  onSearch,
  isLoading,
  language,
  onLanguageChange,
  currentVideo,
  selectedRegion,
  onRegionChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [value, setValue] = useState<string>('2000');
  const [mode, setMode] = useState<'year' | 'decade' | 'all'>('all');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [showCountryList, setShowCountryList] = useState(false);
  
  // Dynamic decades based on selected region
  const [availableDecades, setAvailableDecades] = useState<string[]>(['1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020']);

  useEffect(() => {
    // When region changes, update available decades
    const decades = getAvailableDecades(selectedRegion);
    setAvailableDecades(decades);
  }, [selectedRegion]);

  const t = translations[language].sector2;

  const countries = useMemo(() => getCountries(), []);

  // Show country list if a specific country is selected (not 'all' and not 'intl')
  // OR if user manually toggled it open
  // Note: 'Global' maps to 'all'.
  
  // Ref to visit widget
  const widgetRef = useRef<HTMLDivElement>(null);

  // Sync value when region changes and current decade is not available...
  // Simplified logic: ensure value is somewhat valid.
  React.useEffect(() => {
    if (mode === 'decade') {
      const decades = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];
      
      // If we restrict decades by region, we would check here.
      // For now, allow all decades, but maybe check if data exists?
      // Keeping it simple.
      if (!decades.includes(value) && selectedRegion === 'all') {
         // Default if invalid
      }
    }
  }, [mode, value, selectedRegion]);

  React.useEffect(() => {
    // Fetch total visits from GoatCounter
    getTotalVisits().then((count) => {
      setVisitCount(count);
    });
  }, []);

  React.useEffect(() => {
    if (visitCount !== null && widgetRef.current) {
      const el = widgetRef.current;
      // Inject script if not present
      if (!el.querySelector('#_waud22')) {
        const script1 = document.createElement('script');
        script1.id = '_waud22';
        script1.innerHTML =
          'var _wau = _wau || []; _wau.push(["small", "t6392gpmdf", "d22"]);';
        el.appendChild(script1);

        const script2 = document.createElement('script');
        script2.async = true;
        script2.src = '//waust.at/s.js';
        el.appendChild(script2);
      }

      // Observer to ensure link opens in new tab
      const observer = new MutationObserver(() => {
        const link = el.querySelector('a');
        if (link && link.getAttribute('target') !== '_blank') {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });

      observer.observe(el, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, [visitCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(mode, value);
  };

  const quickDecades = availableDecades;

  return (
    <div
      className="w-full flex flex-col bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm"
      role="search"
    >
      {/* Collapsible Header */}
      <div
        className="flex flex-col border-b border-border z-20 sticky top-0 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors w-full"
        onClick={() => setIsCollapsed(!isCollapsed)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }
        }}
        aria-expanded={!isCollapsed}
        aria-controls="sector2-content"
      >
        <div className="px-6 py-3 flex items-center justify-between">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 border border-muted-foreground/30 rounded bg-zinc-100 dark:bg-zinc-800">
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </div>
            <span className="flex items-center gap-2">
              <Clock className="w-3 h-3" /> {t.timeMachine}
            </span>
          </h2>

          {/* Language Toggles */}
          <div className="flex gap-2">
            <button
              title="Português"
              aria-label="Mudar para Português"
              onClick={(e) => {
                e.stopPropagation();
                onLanguageChange('pt');
              }}
              className={`w-6 h-4 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10 transition-transform ${
                language === 'pt'
                  ? 'ring-primary ring-2 scale-110'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <FlagBR />
            </button>
            <button
              title="English"
              aria-label="Switch to English"
              onClick={(e) => {
                e.stopPropagation();
                onLanguageChange('en');
              }}
              className={`w-6 h-4 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10 transition-transform ${
                language === 'en'
                  ? 'ring-primary ring-2 scale-110'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <FlagUS />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        id="sector2-content"
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6">
            {/* Availability Notice & Count */}
            <div className="bg-primary/10 border border-primary/20 text-primary rounded-md p-3 text-xs mb-4 text-center leading-relaxed relative overflow-hidden">
              <p className="font-bold mb-1">{t.comingSoon}</p>
              <p className="opacity-80 mb-2">
                {currentVideo ? (
                  <>
                    <span className="font-bold">{currentVideo.song_title}</span>
                    {' - '}
                    <span>
                      {currentVideo.artists?.map((a: any) => a.name).join(', ')}
                    </span>{' '}
                    <span className="opacity-70">({currentVideo.year})</span>
                    {currentVideo.nationality && (
                      <span className="ml-2 text-[10px] bg-green-500/20 text-green-500 px-1 rounded">
                        {currentVideo.nationality}
                      </span>
                    )}
                  </>
                ) : (
                  t.availabilityNotice
                )}
              </p>

              {/* Stats Breakdown */}
              <div className="flex flex-col gap-1 items-center bg-background/50 dark:bg-black/20 rounded px-3 py-2 font-mono text-[10px] tracking-wide mt-1 w-full">
                <div className="flex justify-between w-full">
                  <span className="opacity-70">Clipes:</span>
                  <span className="font-bold">{TOTAL_CLIPS}</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="opacity-70">Shows:</span>
                  <span className="font-bold">{TOTAL_SHOWS}</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="opacity-70">Programas:</span>
                  <span className="font-bold">{TOTAL_PROGRAMS}</span>
                </div>
                <div className="w-full h-px bg-current opacity-10 my-0.5"></div>
                <div className="flex justify-between w-full">
                  <span className="opacity-70 font-bold uppercase">Total:</span>
                  <span className="font-bold">{TOTAL_VIDEOS_COUNT}</span>
                </div>
              </div>
              {/* Donation Button */}
              <button
                type="button"
                onClick={() => setIsDonationModalOpen(true)}
                className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] font-bold py-2 px-3 rounded shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                style={{
                  textShadow:
                    '1px 0 0 white, 0 1px 0 white, -1px 0 0 white, 0 -1px 0 white',
                }}
              >
                <Coffee className="w-3 h-3" />
                {t.donation?.button || 'Me Pague um Café'}
              </button>

              {visitCount !== null && (
                <div className="w-full flex items-center justify-center mt-2 gap-2">
                  <div className="h-[20px] flex items-center bg-background/50 dark:bg-black/20 rounded px-2 font-mono text-[10px] tracking-wide border border-transparent">
                    <span className="opacity-70 mr-1">Visitas:</span>
                    <span className="font-bold">
                      {visitCount.toLocaleString()}
                    </span>
                  </div>
                  {/* Visit Counter Widget */}
                  <div
                    className="h-[20px] flex items-center overflow-hidden rounded xs"
                    ref={widgetRef}
                  />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Region / Signal Source Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  {t.signalSource}
                </label>
                <div className="grid grid-cols-2 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                        onRegionChange('all');
                        setShowCountryList(false);
                        // Also trigger play? handled by parent when region changes
                    }}
                    className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                      selectedRegion === 'all' && !showCountryList
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Músicas de todos os países"
                  >
                    Global
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCountryList(!showCountryList)}
                    className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                      selectedRegion !== 'all' || showCountryList
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Escolher país"
                  >
                    Países {selectedRegion !== 'all' && `(${selectedRegion})`}
                  </button>
                </div>

                {/* Country List - Horizontal Scroll */}
                {(showCountryList || (selectedRegion !== 'all' && selectedRegion !== 'intl')) && (
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar mask-linear-fade">
                        {countries.map((country) => {
                            const label = COUNTRY_NAMES[country.code] || country.code;
                            
                            return (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                    onRegionChange(country.code, true);
                                    setMode('all');
                                }}
                                className={`
                                    flex-none px-3 py-1.5 text-xs font-medium rounded-md border transition-all whitespace-nowrap
                                    ${
                                        selectedRegion === country.code
                                            ? 'bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 shadow-md scale-105'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                    }
                                `}
                            >
                                {label}
                                <span className="opacity-50 ml-1 text-[10px]">({country.count})</span>
                            </button>
                        )})}
                    </div>
                )}
              </div>

              {/* Mode Toggles */}
              <div className="grid grid-cols-3 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMode('year')}
                  className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${
                    mode === 'year'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Calendar className="w-3 h-3" /> {t.yearMode}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('decade');
                    // Ensure value is decade-compliant roughly
                    if (value.slice(-1) !== '0')
                      setValue(value.slice(0, 3) + '0');
                  }}
                  className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${
                    mode === 'decade'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Film className="w-3 h-3" /> {t.decadeMode}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('all');
                    onSearch('all', 'all');
                  }}
                  className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${
                    mode === 'all'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Film className="w-3 h-3" /> {t.allMode}
                </button>
              </div>

              {/* Quick Select Chips */}
              {mode === 'decade' && (
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar mask-linear-fade">
                  {quickDecades.map((decade) => {
                    const isSelected = value === decade;
                    return (
                      <button
                        key={decade}
                        type="button"
                        onClick={() => {
                          setValue(decade);
                          onSearch('decade', decade);
                        }}
                        className={`
                                flex-none px-4 py-2 text-xs font-bold rounded-md border transition-all
                                ${
                                  isSelected
                                    ? 'bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 shadow-md scale-105'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-zinc-200 dark:border-zinc-700 hover:bg-primary hover:text-primary-foreground hover:border-primary'
                                }
                            `}
                        {...(isSelected
                          ? {
                              style: {
                                textShadow:
                                  '1px 0 0 white, 0 1px 0 white, -1px 0 0 white, 0 -1px 0 white',
                              },
                            }
                          : {})}
                      >
                        {decade}s
                      </button>
                    );
                  })}
                </div>
              )}

              {mode === 'year' && (
                <div className="flex gap-3">
                  {/* Input - Only in 'year' mode */}
                  {mode === 'year' && (
                    <div className="relative group flex-1">
                      <input
                        type="number"
                        min="1920"
                        max="2026"
                        step={mode === 'decade' ? 10 : 1}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full h-12 pl-4 pr-4 rounded-xl border-2 border-transparent bg-zinc-200 dark:bg-zinc-800 focus:bg-background text-2xl font-black tracking-widest text-center transition-all focus:border-primary focus:outline-none"
                        placeholder="2000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono opacity-50 pointer-events-none">
                        {mode === 'decade' ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {/* Main Action Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className={`h-12 text-base gap-2 rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] ${
                      mode !== 'all' ? 'w-auto px-8' : 'w-full'
                    }`}
                  >
                    {isLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Play className="h-5 w-5 fill-current" />
                    )}
                    {isLoading ? t.traveling : t.play}
                  </Button>
                </div>
              )}
            </form>

            <DonationModal
              isOpen={isDonationModalOpen}
              onClose={() => setIsDonationModalOpen(false)}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
