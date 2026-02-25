import React, { useState, useEffect } from 'react';
import { Episode } from '../../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchEpisodeItems, updateEpisodeItems, createEpisode } from '../../services/channelService';
import { supabase } from '../../lib/supabaseClient';

interface EpisodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null; // If null, we might be creating? No, let's assume editing.
  channelId: string;
}

export const EpisodeEditorModal: React.FC<EpisodeEditorModalProps> = ({ isOpen, onClose, episode, channelId }) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [videoCount, setVideoCount] = useState(5);
  const [openingUrl, setOpeningUrl] = useState('');
  const [introUrl, setIntroUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  // Fetch existing items if editing
  const { data: existingItems } = useQuery({
    queryKey: ['episode_items', episode?.id],
    queryFn: () => episode ? fetchEpisodeItems(episode.id) : Promise.resolve([]),
    enabled: !!episode && isOpen,
  });

  useEffect(() => {
    if (isOpen && episode) {
      setTitle(episode.title);
      setOpeningUrl(episode.opening_video_url || '');
      setIntroUrl(episode.intro_video_url || '');
      setStep(1);
    } else {
        // Reset
        setTitle('');
        setOpeningUrl('');
        setIntroUrl('');
        setVideoUrls([]);
        setStep(1);
    }
  }, [isOpen, episode]);

  useEffect(() => {
      if (existingItems && existingItems.length > 0) {
          setVideoUrls(existingItems.map(i => i.video_url));
          setVideoCount(existingItems.length);
      } else {
          setVideoUrls(Array(5).fill(''));
          setVideoCount(5);
      }
  }, [existingItems]);

  const handleNext = () => {
      // Initialize videoUrls array based on count, preserving existing values
      const newUrls = [...videoUrls];
      if (newUrls.length < videoCount) {
          // Add empty strings
          for (let i = newUrls.length; i < videoCount; i++) {
              newUrls.push('');
          }
      } else if (newUrls.length > videoCount) {
          // Trim
          newUrls.length = videoCount;
      }
      setVideoUrls(newUrls);
      setStep(2);
  };

  const saveMutation = useMutation({
      mutationFn: async () => {
          if (!episode) return;

          // 1. Update Episode Details
          const { error: episodeError } = await supabase
              .from('episodes' as any)
              .update({ 
                  title,
                  opening_video_url: openingUrl, 
                  intro_video_url: introUrl 
              })
              .eq('id', episode.id);
          
          if (episodeError) throw episodeError;

          // 2. Update Items
          const itemsToSave = videoUrls
              .map((url, index) => ({ video_url: url, order: index + 1 }))
              .filter(item => item.video_url.trim() !== '');
            
          await updateEpisodeItems(episode.id, itemsToSave);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['episodes', channelId] });
          queryClient.invalidateQueries({ queryKey: ['episode_items', episode?.id] });
          onClose();
      }
  });

  if (!isOpen || !episode) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
                <h2 className="text-xl font-bold">Editor de Episódio</h2>
                <p className="text-sm text-muted-foreground">{episode.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {step === 1 ? (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Quantos clipes musicais terá este episódio?</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="50"
                            value={videoCount}
                            onChange={(e) => setVideoCount(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full bg-zinc-100 dark:bg-black/20 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 text-lg font-bold"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Você poderá colar os links do YouTube na próxima etapa.
                        </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <h4 className="font-bold text-sm mb-4">Configurações Opcionais</h4>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground mb-1">Título do Episódio</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground mb-1">Vídeo de Abertura (Link YouTube)</label>
                                <input 
                                    type="text" 
                                    value={openingUrl}
                                    onChange={(e) => setOpeningUrl(e.target.value)}
                                    placeholder="https://youtube.com/..."
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground mb-1">Vídeo de Apresentação (Link YouTube)</label>
                                <input 
                                    type="text" 
                                    value={introUrl}
                                    onChange={(e) => setIntroUrl(e.target.value)}
                                    placeholder="https://youtube.com/..."
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                />
                            </div>
                         </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">Cole os links dos vídeos</h3>
                        <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Total: {videoUrls.length}</span>
                    </div>

                    {videoUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <span className="text-sm font-mono text-muted-foreground w-6 text-center">{index + 1}</span>
                            <input 
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    const newUrls = [...videoUrls];
                                    newUrls[index] = e.target.value;
                                    setVideoUrls(newUrls);
                                }}
                                autoFocus={index === 0}
                                placeholder="https://youtube.com/..."
                                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            />
                        </div>
                    ))}
                    
                    <button 
                        type="button"
                        onClick={() => setVideoUrls([...videoUrls, ''])}
                        className="w-full py-2 border border-dashed border-zinc-300 dark:border-zinc-700 rounded text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-3 h-3" /> Adicionar mais um campo
                    </button>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
            {step === 2 && (
                <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors"
                >
                    Voltar
                </button>
            )}
            
            {step === 1 ? (
                 <button 
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                    Continuar
                </button>
            ) : (
                <button 
                    type="button"
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {saveMutation.isPending ? 'Salvando...' : 'Salvar Playlist'}
                </button>
            )}
        </div>

      </div>
    </div>
  );
};
