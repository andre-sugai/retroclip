import React, { useState } from 'react';
import { Calendar, Film, PlayCircle, Clock, Coffee } from 'lucide-react';
import { Button } from './ui/Button';
import { DonationModal } from './DonationModal';
import { TOTAL_VIDEOS_COUNT } from '../services/imvdbService';
import { translations, Language } from '../translations';

// Simple Flag Components as SVGs
const FlagBR = () => (
    <svg viewBox="0 0 640 480" className="w-full h-full grayscale hover:grayscale-0 transition-all">
        <path fill="#009c3b" d="M0 0h640v480H0z"/>
        <path fill="#ffdf00" d="m320 40 277 200-277 200L43 240z"/>
        <circle cx="320" cy="240" r="83" fill="#002776"/>
        <path fill="#fff" d="M309 237h0c22 0 42 10 56 25l6-3c-15-18-39-28-62-28v6z"/>
    </svg>
);

const FlagUS = () => (
    <svg viewBox="0 0 640 480" className="w-full h-full grayscale hover:grayscale-0 transition-all">
        <path fill="#bd3d44" d="M0 0h640v480H0z"/>
        <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
        <path fill="#192f5d" d="M0 0h296v258H0z"/>
        {/* Simplified Stars */}
        <path fill="#fff" d="M34 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM94 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM153 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM213 23l4 13h14l-11 8 4 13-11-7-10 7 4-13-11-8h14zM272 23l4 13h13l-10 8 4 13-11-7-10 7 4-13-11-8h13zM64 54l4 12h13l-10 8 4 12-11-7-10 7 4-12-11-8h13zM123 54l4 12h14l-11 8 4 12-11-7-10 7 4-12-11-8h14zM183 54l4 12h13l-10 8 4 12-11-7-10 7 4-12-11-8h13zM242 54l4 12h13l-10 8 4 12-11-7-10 7 4-12-11-8h13z"/>
    </svg>
);

interface Sector2SearchProps {
  onSearch: (type: 'year' | 'decade', value: string) => void;
  isLoading: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Sector2Search: React.FC<Sector2SearchProps> = ({ onSearch, isLoading, language, onLanguageChange }) => {
  const [value, setValue] = useState<string>('2000');
  const [mode, setMode] = useState<'year' | 'decade'>('year');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const t = translations[language].sector2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(mode, value);
  };

  const quickDecades = ['1980', '1990', '2000', '2010'];

  return (
    <div className="w-full flex flex-col p-6 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm" role="search">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" /> {t.timeMachine}
        </h2>
        
        {/* Language Toggles */}
        <div className="flex gap-2">
             <button title="Português" onClick={() => onLanguageChange('pt')} className={`w-6 h-4 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10 transition-transform ${language === 'pt' ? 'ring-primary ring-2 scale-110' : 'opacity-50 hover:opacity-100'}`}>
                <FlagBR />
             </button>
             <button title="English" onClick={() => onLanguageChange('en')} className={`w-6 h-4 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10 transition-transform ${language === 'en' ? 'ring-primary ring-2 scale-110' : 'opacity-50 hover:opacity-100'}`}>
                <FlagUS />
             </button>
        </div>
      </div>

      {/* Availability Notice & Count */}
      <div className="bg-primary/10 border border-primary/20 text-primary rounded-md p-3 text-xs mb-4 text-center leading-relaxed relative overflow-hidden">
          <p className="font-bold mb-1">{t.comingSoon}</p>
          <p className="opacity-80 mb-2">{t.availabilityNotice}</p>
          <div className="inline-block bg-background/50 dark:bg-black/20 rounded px-2 py-1 font-mono text-[10px] tracking-wide mt-1">
             <span className="opacity-70">{t.totalClips}:</span> <span className="font-bold">{TOTAL_VIDEOS_COUNT}</span>
          </div>

           {/* Donation Button */}
           <button
             type="button"
             onClick={() => setIsDonationModalOpen(true)}
             className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-[10px] font-bold py-2 px-3 rounded shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
           >
                <Coffee className="w-3 h-3" />
                Me Pague um Café
           </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Mode Toggles */}
        <div className="grid grid-cols-2 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            type="button"
            onClick={() => setMode('year')}
            className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${mode === 'year' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Calendar className="w-3 h-3" /> {t.yearMode}
          </button>
          <button 
            type="button"
            onClick={() => {
                setMode('decade');
                // Ensure value is decade-compliant roughly
                if(value.slice(-1) !== '0') setValue(value.slice(0,3) + '0');
            }}
            className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${mode === 'decade' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Film className="w-3 h-3" /> {t.decadeMode}
          </button>
        </div>

        {/* Input */}
        <div className="relative group">
            <input
                type="number"
                min="1950"
                max="2025"
                step={mode === 'decade' ? 10 : 1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-14 pl-4 pr-4 rounded-xl border-2 border-transparent bg-zinc-200 dark:bg-zinc-800 focus:bg-background text-2xl font-black tracking-widest text-center transition-all focus:border-primary focus:outline-none"
                placeholder="2000"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono opacity-50 pointer-events-none">
                {mode === 'decade' ? 's' : ''}
            </span>
        </div>

        {/* Quick Select Chips */}
        {mode === 'decade' && (
            <div className="flex justify-between gap-2">
                {quickDecades.map(decade => {
                    const isAvailable = decade === '1990';
                    return (
                        <button
                            key={decade}
                            type="button"
                            onClick={() => {
                                setValue(decade);
                                onSearch('decade', decade);
                            }}
                            className={`
                                flex-1 py-2 text-xs font-bold rounded-md border transition-all
                                ${isAvailable 
                                    ? 'bg-primary text-primary-foreground border-primary shadow-md hover:brightness-110 scale-105' 
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-zinc-200 dark:border-zinc-700 opacity-50 hover:opacity-100'
                                }
                            `}
                        >
                            {decade}s
                        </button>
                    );
                })}
            </div>
        )}
        
        {/* Main Action Button */}
        <Button 
            type="submit" 
            disabled={isLoading} 
            size="lg"
            className="w-full h-12 text-base gap-2 rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
        >
            {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                <PlayCircle className="h-5 w-5 fill-current" />
            )}
            {isLoading ? t.traveling : `${t.play} ${value}${mode === 'decade' ? 's' : ''}`}
        </Button>


      </form>

      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
      />
    </div>
  );
};