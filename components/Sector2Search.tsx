import React, { useState } from 'react';
import { Calendar, Film, PlayCircle, Clock } from 'lucide-react';
import { Button } from './ui/Button';

interface Sector2SearchProps {
  onSearch: (type: 'year' | 'decade', value: string) => void;
  isLoading: boolean;
}

export const Sector2Search: React.FC<Sector2SearchProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState<string>('2000');
  const [mode, setMode] = useState<'year' | 'decade'>('year');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(mode, value);
  };

  const quickDecades = ['1980', '1990', '2000', '2010'];

  return (
    <div className="w-full flex flex-col p-6 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm" role="search">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" /> Time Machine
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Mode Toggles */}
        <div className="grid grid-cols-2 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            type="button"
            onClick={() => setMode('year')}
            className={`text-xs font-medium px-2 py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${mode === 'year' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Calendar className="w-3 h-3" /> Exact Year
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
            <Film className="w-3 h-3" /> Decade
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
                {quickDecades.map(decade => (
                    <button
                        key={decade}
                        type="button"
                        onClick={() => {
                            setValue(decade);
                            onSearch('decade', decade);
                        }}
                        className="flex-1 py-2 text-xs font-bold rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-primary hover:text-primary-foreground border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                        {decade}s
                    </button>
                ))}
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
            {isLoading ? "Traveling..." : `Play ${value}${mode === 'decade' ? 's' : ''}`}
        </Button>
      </form>
    </div>
  );
};