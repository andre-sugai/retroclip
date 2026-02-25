import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChannel } from '../../services/channelService';
import { useAuth } from '../../contexts/AuthContext';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'pt' | 'en' | 'es';
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose, language }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createChannelMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      return createChannel(user.id, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels', user?.id] });
      onClose();
      setTitle('');
      setDescription('');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Criar Canal</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createChannelMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Nome do Canal
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors"
                placeholder="Ex: Meus Clipes Favoritos"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                placeholder="Sobre o que é este canal?"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={createChannelMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-lg uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createChannelMutation.isPending ? 'Criando...' : 'Criar Canal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
