import React from 'react';
import { Button } from './ui/Button';
import { PlayCircle, Clock, Film, Disc3, Coffee, Sparkles } from 'lucide-react';
import { translations, Language } from '../translations';
import { getTotalVisits } from '../services/goatCounterService';
import { isInAppBrowser } from '../utils/detectInAppBrowser';
import { InAppBrowserWarning } from './InAppBrowserWarning';

interface WelcomeScreenProps {
  onStart: () => void;
  language: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  language,
}) => {
  const t = translations[language].welcome;
  const [visitCount, setVisitCount] = React.useState<number | null>(null);
  const [showInAppWarning, setShowInAppWarning] = React.useState(false);

  React.useEffect(() => {
    // Check for In-App Browser immediately on mount
    if (isInAppBrowser()) {
      setShowInAppWarning(true);
    }
  }, []);

  React.useEffect(() => {
    // Fetch total visits from GoatCounter
    getTotalVisits().then((count) => {
      setVisitCount(count);
    });
  }, []);

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-zinc-900 overflow-hidden">
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
        
        /* Neon Button Animation */
        @keyframes neon-border {
          0%, 100% { 
            box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 20px #ffffff; 
            border-color: #ffffff; 
          }
          50% { 
            box-shadow: 0 0 10px #ffffff, 0 0 25px #ffffff, 0 0 50px #ffffff; 
            border-color: #ffffff; 
          }
        }
        .neon-button {
          animation: neon-border 3s infinite linear;
          border-width: 1px;
          border-style: solid;
        }
      `}</style>

      <div className="relative z-10 p-4 md:p-8 flex items-center justify-center w-full min-h-screen">
        <div className="max-w-2xl w-full my-auto">
          {/* Logo */}
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-1 md:mb-2">
              Grooov<span className="text-primary">io</span>
            </h1>
            <p className="text-[10px] md:text-sm text-muted-foreground font-mono">
              V 1.13.15 // ARIA-COMPLIANT
            </p>
          </div>

          {/* Welcome Message */}
          <div className="bg-background/80 backdrop-blur-md rounded-2xl p-5 md:p-8 border border-border shadow-2xl">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 text-center">
              {t.title}
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-6 leading-tight">
              {t.subtitle}
            </p>

            {/* Features */}
            <div className="space-y-2 md:space-y-4 mb-6 md:mb-8">
              <div className="flex items-start gap-2 md:gap-3">
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm md:text-base leading-none md:leading-normal">
                    {t.feature1Title}
                  </h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground leading-tight">
                    {t.feature1Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Film className="w-4 h-4 md:w-6 md:h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm md:text-base leading-none md:leading-normal">
                    {t.feature2Title}
                  </h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground leading-tight">
                    {t.feature2Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Disc3 className="w-4 h-4 md:w-6 md:h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm md:text-base leading-none md:leading-normal">
                    {t.feature3Title}
                  </h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground leading-tight">
                    {t.feature3Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm md:text-base leading-none md:leading-normal">
                    {t.featureFreeTitle}
                  </h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground leading-tight">
                    {t.featureFreeDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Coffee className="w-4 h-4 md:w-6 md:h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm md:text-base leading-none md:leading-normal">
                    {t.feature4Title}
                  </h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground leading-tight">
                    {t.feature4Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex flex-col items-center w-full gap-3 md:gap-6">
              <Button
                onClick={() => {
                  if (isInAppBrowser()) {
                    setShowInAppWarning(true);
                    return;
                  }
                  onStart();
                }}
                className="w-auto px-8 md:px-12 h-10 md:h-14 text-base md:text-lg font-bold neon-button rounded-full"
                variant="primary"
              >
                <PlayCircle className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                {t.startButton}
              </Button>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] md:text-xs text-muted-foreground/70 text-center leading-tight">
                  {t.desktopNotice}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground/60 text-center leading-tight">
                  {t.credits}
                </p>
                {visitCount !== null && (
                  <p className="text-[10px] text-muted-foreground/50 text-center font-mono leading-tight">
                    Total Visitas: {visitCount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInAppWarning && (
        <InAppBrowserWarning
          language={language}
          onDismiss={() => {
            setShowInAppWarning(false);
            onStart();
          }}
        />
      )}
    </div>
  );
};
