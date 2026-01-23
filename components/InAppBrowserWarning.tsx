import React, { useState } from 'react';
import {
  Copy,
  ExternalLink,
  ArrowUpRight,
  X,
  Smartphone,
  MousePointer,
} from 'lucide-react';
import { Language, translations } from '../translations';

interface InAppBrowserWarningProps {
  language: Language;
  onDismiss: () => void;
}

export const InAppBrowserWarning: React.FC<InAppBrowserWarningProps> = ({
  language,
  onDismiss,
}) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const t = translations[language].inAppBrowser;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in overflow-y-auto">
      {/* Logo no lugar da seta */}
      <div className="absolute top-4 right-4">
        <div className="text-right">
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
            Grooov<span className="text-primary">io</span>
          </h1>
          <p className="text-[8px] text-muted-foreground font-mono">
            V 1.13.14 // ARIA-COMPLIANT
          </p>
        </div>
      </div>

      <div className="max-w-md w-full space-y-6 relative my-auto">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center border border-zinc-700 shadow-2xl">
            <ExternalLink className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">
            {t.title}
          </h2>

          <p className="text-zinc-400 text-lg leading-relaxed">{t.subtitle}</p>

          {/* Step by step instructions */}
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 text-left space-y-4">
            <h3 className="text-primary font-bold text-lg text-center mb-4">
              {t.stepByStep.title}
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MousePointer className="w-4 h-4 text-primary" />
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {t.stepByStep.step1}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {t.stepByStep.step2}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {t.stepByStep.step3}
                </p>
              </div>
            </div>

            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 mt-4">
              <p className="text-primary font-bold text-lg">
                {t.openBrowserOption}
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                {t.alternativeOption}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
            {t.alternativeTitle}
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
                <>{t.copiedButton}</>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {t.copyButton}
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-white text-sm underline underline-offset-4 transition-colors pt-4"
        >
          {t.dismissButton}
        </button>
      </div>
    </div>
  );
};
