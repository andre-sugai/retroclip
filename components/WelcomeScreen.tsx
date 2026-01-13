import React from 'react';
import { Button } from './ui/Button';
import { PlayCircle, Clock, Film, Disc3, Coffee } from 'lucide-react';
import { translations, Language } from '../translations';

interface WelcomeScreenProps {
  onStart: () => void;
  language: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, language }) => {
  const t = translations[language].welcome;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black tracking-tighter uppercase mb-2">
            Groov<span className="text-primary">io</span>
          </h1>
          <p className="text-sm text-muted-foreground font-mono">V 0.1.0 // ARIA-COMPLIANT</p>
        </div>

        {/* Welcome Message */}
        <div className="bg-background/80 backdrop-blur-md rounded-2xl p-8 border border-border shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t.subtitle}</p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{t.feature1Title}</h3>
                <p className="text-sm text-muted-foreground">{t.feature1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Film className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{t.feature2Title}</h3>
                <p className="text-sm text-muted-foreground">{t.feature2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Disc3 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{t.feature3Title}</h3>
                <p className="text-sm text-muted-foreground">{t.feature3Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Coffee className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{t.feature4Title}</h3>
                <p className="text-sm text-muted-foreground">{t.feature4Desc}</p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={onStart}
            className="w-full h-14 text-lg font-bold"
            variant="primary"
          >
            <PlayCircle className="w-6 h-6 mr-2" />
            {t.startButton}
          </Button>
        </div>
      </div>
    </div>
  );
};
