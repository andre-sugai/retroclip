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
    <div className="fixed inset-0 z-[100] bg-zinc-900 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src="/videos/web2-optimized.webm" type="video/webm" />
        </video>

        {/* CRT TV Effects */}
        {/* Scanlines */}
        <div className="crt-scanlines" />

        {/* Blue Vignette */}
        <div className="crt-vignette" />

        {/* Grain/Noise */}
        <div className="crt-grain" />

        {/* Curvature Overlay */}
        <div className="crt-curve" />
      </div>

      <style>{`
        /* CRT Scanlines */
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .crt-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.2) 0px,
            rgba(0, 0, 0, 0.2) 2px,
            transparent 2px,
            transparent 3px
          );
          pointer-events: none;
          z-index: 3;
        }
        
        .crt-scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.05) 51%
          );
          background-size: 100% 4px;
          animation: scanline 8s linear infinite;
        }
        
        /* Blue Vignette */
        .crt-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 40%,
            rgba(0, 40, 80, 0.3) 70%,
            rgba(0, 20, 50, 0.6) 100%
          );
          pointer-events: none;
          z-index: 2;
        }
        
        /* Grain/Noise */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
        
        .crt-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
          animation: grain 1s steps(10) infinite;
          z-index: 4;
        }
        
        /* Barrel Distortion / Curvature */
        .crt-curve {
          position: absolute;
          inset: 0;
          border-radius: 3% / 2%;
          box-shadow: 
            inset 0 0 100px rgba(0, 0, 0, 0.5),
            inset 0 0 50px rgba(0, 40, 80, 0.3);
          pointer-events: none;
          z-index: 5;
        }
        
        /* Subtle Flicker */
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
        }
        
        .crt-curve::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.02);
          animation: flicker 0.15s infinite;
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in overflow-y-auto min-h-screen">
        {/* Seta animada voltou para o canto superior direito */}
        <div className="absolute top-4 right-4 animate-bounce duration-1000">
          <ArrowUpRight className="w-12 h-12 text-primary rotate-12 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>

        <div className="max-w-md w-full space-y-6 relative my-auto">
          <div className="space-y-4">
            {/* Logo do Grooovio centralizado */}
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tighter uppercase text-white">
                Grooov<span className="text-primary">io</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">
                V 1.13.18 // ARIA-COMPLIANT
              </p>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight">
              {t.title}
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              {t.subtitle}
            </p>

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
    </div>
  );
};
