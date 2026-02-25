import React, { useState } from 'react';
import { Channel, Episode } from '../../types';
import { ChevronLeft, Plus, Play, Trash2, Edit2 } from 'lucide-react'; // Assuming icons exist
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Check imports
import { fetchEpisodes, deleteEpisode, createEpisode } from '../../services/channelService';

interface ChannelViewProps {
  channel: Channel;
  onBack: () => void;
  onPlayEpisode: (episode: Episode) => void;
  onEditEpisode: (episode: Episode) => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({ channel, onBack, onPlayEpisode, onEditEpisode }) => {
  const queryClient = useQueryClient();
  const [isCreatingEpisode, setIsCreatingEpisode] = useState(false);

  const { data: episodes, isLoading } = useQuery({
    queryKey: ['episodes', channel.id],
    queryFn: () => fetchEpisodes(channel.id),
  });

  const deleteEpisodeMutation = useMutation({
      mutationFn: deleteEpisode,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['episodes', channel.id] });
      }
  });

  // Inline Create Episode Form State
  const [newEpisodeTitle, setNewEpisodeTitle] = useState('');
  const createEpisodeMutation = useMutation({
      mutationFn: async () => {
          return createEpisode(channel.id, newEpisodeTitle);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['episodes', channel.id] });
          setIsCreatingEpisode(false);
          setNewEpisodeTitle('');
      }
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="border-b border-border bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur z-20 sticky top-0">
        <div className="px-6 py-4 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">{channel.title}</h2>
            <p className="text-xs text-muted-foreground">{channel.description || 'Programação do canal'}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
         {/* Create Episode Button */}
         {!isCreatingEpisode ? (
             <button
                onClick={() => setIsCreatingEpisode(true)}
                className="w-full py-3 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
             >
                <Plus className="w-4 h-4" />
                Criar Novo Episódio
             </button>
         ) : (
             <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 animate-in fade-in zoom-in-95 duration-200">
                 <h3 className="text-xs font-bold uppercase tracking-wider mb-3">Novo Episódio</h3>
                 <input 
                    type="text" 
                    placeholder="Título do Episódio (ex: Especial Rock 90)"
                    value={newEpisodeTitle}
                    onChange={(e) => setNewEpisodeTitle(e.target.value)}
                    className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-600 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                 />
                 <div className="flex justify-end gap-2">
                     <button 
                        onClick={() => setIsCreatingEpisode(false)}
                        className="px-3 py-1.5 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                     >
                        Cancelar
                     </button>
                     <button 
                        onClick={() => createEpisodeMutation.mutate()}
                        disabled={!newEpisodeTitle.trim() || createEpisodeMutation.isPending}
                        className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
                     >
                        {createEpisodeMutation.isPending ? 'Criando...' : 'Criar'}
                     </button>
                 </div>
             </div>
         )}


         {/* Episodes List */}
         <div className="space-y-2">
             {isLoading ? (
                 <div className="text-center py-8 text-muted-foreground text-xs">Carregando episódios...</div>
             ) : episodes?.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground text-xs opacity-50">Nenhum episódio criado ainda.</div>
             ) : (
                 episodes?.map((episode) => (
                     <div key={episode.id} className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-primary/50 transition-all">
                         <div className="flex-1 min-w-0 pr-4">
                             <h3 className="font-bold text-sm truncate">{episode.title}</h3>
                             <p className="text-xs text-muted-foreground mt-0.5">
                                 {new Date(episode.created_at).toLocaleDateString()}
                             </p>
                         </div>
                         <div className="flex items-center gap-2">
                             <button
                                onClick={() => onPlayEpisode(episode)}
                                className="p-2 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
                                title="Reproduzir"
                             >
                                <Play className="w-4 h-4" />
                             </button>
                             <button
                                type="button"
                                onClick={() => onEditEpisode(episode)}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                title="Editar"
                             >
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button
                                onClick={() => {
                                    if(confirm('Tem certeza que deseja excluir este episódio?')) {
                                        deleteEpisodeMutation.mutate(episode.id);
                                    }
                                }}
                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors"
                                title="Excluir"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                     </div>
                 ))
             )}
         </div>
      </div>
    </div>
  );
};
