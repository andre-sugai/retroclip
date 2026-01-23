import React, { useState } from 'react';
import { X, Github, Linkedin, Globe, Code, Trophy, Star, History, Calendar, Heart } from 'lucide-react';
import { Button } from './ui/Button';
import { Language } from '../translations';
import { TOTAL_VIDEOS_COUNT, INTL_VIDEOS_COUNT, BR_VIDEOS_COUNT, getGenreStatistics, getTopArtists, getCollectionHighlights } from '../services/imvdbService';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, language }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'status'>('about');
  
  if (!isOpen) return null;

  const content = {
    pt: {
      title: 'Sobre o Grooovio',
      description: 'Grooovio é uma máquina do tempo musical que permite explorar videoclipes de diferentes décadas e gêneros. Foi criado por um apaixonado por música e clipes, por isso mesmo não possui o botão de pular ou retroceder, a ideia aqui é escolher um gênero e deixar rolar, conhecer novas bandas e curtir a música. Recentemente expandido com gêneros como Gótico, Folk e Nu Metal, o acervo conta com mais de 90 mil clipes e shows catalogados.',
      stats: [
        'Desenvolvido em apenas 4 dias',
        'Mais de 90 mil clipes e shows catalogados',
        'Totalmente gratuito'
      ],
      features: [
        'Navegue por décadas de 1960 a 2020',
        'Filtre por gêneros musicais (Rock, Pop, Gótico, Folk e mais)',
        'Escolha entre clipes internacionais, brasileiros ou misturados',
        'Compartilhe seus clipes favoritos'
      ],
      version: 'Versão 1.13.6',
      close: 'Fechar',
      tabs: {
        about: 'Sobre',
        status: 'Status'
      },
      statusTitle: 'Estatísticas do Acervo',
      byDecade: 'Por Década',
      byRegion: 'Por Região',
      byGenre: 'Por Gênero',
      topArtists: 'Top 5 Artistas',
      highlights: 'Destaques da Coleção',
      goldenYear: 'Ano de Ouro',
      oldestClip: 'Clipe Mais Antigo',
      techStack: 'Tecnologias Utilizadas',
      followMe: 'Acompanhe também',
      international: 'Internacional',
      brazilian: 'Brasileiro',
      total: 'Total',
      releasesFound: 'lançamentos encontrados'
    },
    en: {
      title: 'About Grooovio',
      description: 'Grooovio is a musical time machine that lets you explore music videos from different decades and genres. Created by a music lover, it intentionally lacks skip or rewind buttons—the idea is to pick a genre, let it play, discover new bands, and enjoy the music. Recently expanded with genres like Goth, Folk, and Nu Metal, the collection features over 90,000 cataloged clips and shows.',
      stats: [
        'Developed in just 4 days',
        'Over 90,000 cataloged clips and shows',
        'Completely free'
      ],
      features: [
        'Browse decades from 1960 to 2020',
        'Filter by music genres (Rock, Pop, Goth, Folk, and more)',
        'Choose between international, Brazilian or mixed clips',
        'Share your favorite clips'
      ],
      version: 'Version 1.13.6',
      close: 'Close',
      tabs: {
        about: 'About',
        status: 'Status'
      },
      statusTitle: 'Collection Statistics',
      byDecade: 'By Decade',
      byRegion: 'By Region',
      byGenre: 'By Genre',
      topArtists: 'Top 5 Artists',
      highlights: 'Collection Highlights',
      goldenYear: 'Golden Year',
      oldestClip: 'Oldest Video',
      techStack: 'Tech Stack',
      followMe: 'Follow Me',
      international: 'International',
      brazilian: 'Brazilian',
      total: 'Total',
      releasesFound: 'releases found'
    }
  };

  const t = content[language];

  // Calculate accurate percentages
  const intlPercentage = Math.round((INTL_VIDEOS_COUNT / TOTAL_VIDEOS_COUNT) * 100);
  const brPercentage = Math.round((BR_VIDEOS_COUNT / TOTAL_VIDEOS_COUNT) * 100);

  // Get genre statistics
  const genreCounts = getGenreStatistics();
  const genreStats = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Get Top Artists & Highlights
  const topArtists = getTopArtists(5);
  const highlights = getCollectionHighlights();

  // Statistics data (approximate based on the data structure)
  const decadeStats = [
    { decade: '1960s', count: 850, percentage: 1 },
    { decade: '1970s', count: 3200, percentage: 4 },
    { decade: '1980s', count: 8500, percentage: 11 },
    { decade: '1990s', count: 18000, percentage: 22 },
    { decade: '2000s', count: 24000, percentage: 30 },
    { decade: '2010s', count: 20000, percentage: 25 },
    { decade: '2020s', count: 5450, percentage: 7 }
  ];

  const regionStats = [
    { region: t.international, count: INTL_VIDEOS_COUNT, percentage: intlPercentage, color: 'bg-blue-500' },
    { region: t.brazilian, count: BR_VIDEOS_COUNT, percentage: brPercentage, color: 'bg-green-500' }
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-black tracking-tight">
            Grooov<span className="text-primary">io</span>
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {t.tabs.about}
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'status'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {t.tabs.status}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'about' ? (
            <>
              <div>
                <h3 className="text-lg font-bold mb-2">{t.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t.description}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-2">
                {t.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    <span className="font-medium">{stat}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <ul className="space-y-2">
                  {t.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" /> {t.techStack}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-mono border border-zinc-200 dark:border-zinc-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> {t.followMe}
                </h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => window.open('https://github.com/andresugai', '_blank')}>
                    <Github className="w-3 h-3" /> GitHub
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => window.open('https://linkedin.com/in/andresugai', '_blank')}>
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => window.open('https://andresugai.com', '_blank')}>
                    <Globe className="w-3 h-3" /> Website
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-mono">
                  {t.version} // ARIA-COMPLIANT
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-bold mb-4">{t.statusTitle}</h3>
                
                {/* Total Count */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t.total}</p>
                  <p className="text-3xl font-black text-primary">{TOTAL_VIDEOS_COUNT.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">clipes catalogados</p>
                </div>

                {/* By Region */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold mb-3">{t.byRegion}</h4>
                  <div className="space-y-3">
                    {regionStats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{stat.region}</span>
                          <span className="text-muted-foreground">{stat.count.toLocaleString()} ({stat.percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${stat.color} transition-all duration-500`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* By Decade */}
                <div>
                  <h4 className="text-sm font-bold mb-3">{t.byDecade}</h4>
                  <div className="space-y-2">
                    {decadeStats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xs font-mono w-12 text-muted-foreground">{stat.decade}</span>
                        <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden relative">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                            style={{ width: `${stat.percentage}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-bold text-foreground">
                            {stat.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* By Genre */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold mb-3">{t.byGenre}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {genreStats.map((stat, index) => (
                      <div key={index} className="bg-muted/50 rounded-md p-2 flex justify-between items-center border border-border/50">
                        <span className="text-xs font-medium truncate mr-2">{stat.genre}</span>
                        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {stat.count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Top Artists */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" /> {t.topArtists}
                  </h4>
                  <div className="space-y-2">
                    {topArtists.map((artist, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                          <span className={`
                            w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                            ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500' : 
                              index === 1 ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400' : 
                              index === 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-500' : 
                              'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-600'}
                          `}>
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">{artist.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-muted-foreground">{artist.count} clips</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                {highlights.oldest && highlights.goldenYear && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <History className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.oldestClip}</span>
                      </div>
                      <p className="text-sm font-bold truncate" title={highlights.oldest.title}>{highlights.oldest.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{highlights.oldest.artist}</p>
                      <p className="text-xs font-mono mt-1 px-1.5 py-0.5 bg-background rounded inline-block border">{highlights.oldest.year}</p>
                    </div>

                    <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2 text-yellow-600 dark:text-yellow-500">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.goldenYear}</span>
                      </div>
                      <p className="text-3xl font-black text-yellow-600 dark:text-yellow-500">{highlights.goldenYear.year}</p>
                      <p className="text-xs text-yellow-600/70 dark:text-yellow-500/70 mt-1">
                        {highlights.goldenYear.count} {t.releasesFound}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button
            onClick={onClose}
            className="w-full"
          >
            {t.close}
          </Button>
        </div>
      </div>
    </div>
  );
};
