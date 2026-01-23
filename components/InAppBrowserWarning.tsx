import React, { useState } from 'react';
import { Copy, ExternalLink, ArrowUpRight, X } from 'lucide-react';
import { Language } from '../translations';

interface InAppBrowserWarningProps {
  language: Language;
  onDismiss: () => void;
}

export const InAppBrowserWarning: React.FC<InAppBrowserWarningProps> = ({ language, onDismiss }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isPT = language === 'pt';

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      {/* Animated Arrow pointing to top right menu */}
      <div className="absolute top-4 right-4 animate-bounce duration-1000">
        <ArrowUpRight className="w-12 h-12 text-primary rotate-12 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center border border-zinc-700 shadow-2xl">
            <ExternalLink className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isPT ? 'Abra no Navegador' : 'Open in Browser'}
          </h2>
          
          <p className="text-zinc-400 text-lg leading-relaxed">
            {isPT 
              ? 'Este aplicativo bloqueia a reprodução de vídeo. Para a melhor experiência, toque no menu ' 
              : 'This app restricts video playback. For the best experience, tap the menu '}
            <span className="text-white font-bold px-1 py-0.5 bg-zinc-800 rounded text-sm inline-block mx-1">•••</span>
            {isPT ? ' acima e selecione:' : ' above and select:'}
          </p>

          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50"> 
            <p className="text-primary font-bold text-xl">
              {isPT ? '"Abrir no Navegador"' : '"Open in Browser"'}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {isPT ? 'ou "Abrir no Chrome/Safari"' : 'or "Open in Chrome/Safari"'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
            {isPT ? 'Alternativa' : 'Alternative'}
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-900 h-12 rounded-lg flex items-center px-4 text-zinc-500 text-sm font-mono truncate border border-zinc-800">
              {url}
            </div>
            <button
              onClick={handleCopy}
              className={`h-12 px-4 rounded-lg font-bold transition-all flex items-center gap-2 ${
                copied 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {copied ? (
                <>Copied!</>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {isPT ? 'Copiar' : 'Copy'}
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-white text-sm underline underline-offset-4 transition-colors pt-4"
        >
          {isPT ? 'Tentar navegar aqui mesmo (Instável)' : 'Try browsing here anyway (Unstable)'}
        </button>
      </div>
    </div>
  );
};
