import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { fetchVideoById } from '../services/imvdbService';
import { Play, X, Camera, Save, LogOut, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePanelProps {
  onClose: () => void;
  onSelectVideo?: (video: Video) => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose, onSelectVideo }) => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
  });

  React.useEffect(() => {
    const loadFavorites = async () => {
      if (profile?.favorite_videos && profile.favorite_videos.length > 0) {
        setLoadingFavorites(true);
        try {
          const videos = await Promise.all(
            profile.favorite_videos.map(id => fetchVideoById(id))
          );
          setFavoriteVideos(videos.filter((v): v is Video => !!v));
        } catch (err) {
          console.error('Failed to load favorites', err);
        } finally {
          setLoadingFavorites(false);
        }
      } else {
          setFavoriteVideos([]);
      }
    };
    
    loadFavorites();
  }, [profile?.favorite_videos]);

  const handleSave = async () => {
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
    setEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handlePlayFavorite = (video: Video) => {
      if (onSelectVideo) {
          onSelectVideo(video);
          onClose(); // Close panel when playing
      }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-zinc-900/90 backdrop-blur-xl border-l border-zinc-800 shadow-2xl overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
                Grooovio
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                V 1.25.2 // ARIA-COMPLIANT
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-3xl font-black text-black ring-4 ring-amber-500/20">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <button className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-black p-2 rounded-full transition-all shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">
              {profile?.full_name || 'Usuário'}
            </h3>
            <p className="text-sm text-zinc-400">@{profile?.username || 'username'}</p>
            <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-amber-500">
                {profile?.listened_count || 0}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Clips</div>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-amber-500">
                {favoriteVideos.length}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Favoritos</div>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-amber-500">
                {Math.floor((profile?.listened_count || 0) * 4.5 / 60)}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Horas</div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white">Informações</h4>
              <button
                onClick={() => setEditing(!editing)}
                className="text-amber-500 hover:text-amber-400 transition-colors"
                title="Editar informações"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {editing ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    maxLength={200}
                    rows={3}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    placeholder="Conte um pouco sobre você..."
                  />
                  <p className="text-xs text-zinc-500 mt-1 text-right">
                    {formData.bio.length}/200
                  </p>
                </div>
              </>
            ) : (
              <div className="text-sm text-zinc-300">
                <p>{profile?.bio || 'Adicione uma bio para se apresentar!'}</p>
              </div>
            )}
          </div>

          {/* Favorite Videos */}
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4">
            <h4 className="font-bold text-white mb-3">Vídeos Favoritos ({favoriteVideos.length})</h4>
            {loadingFavorites ? (
                <div className="text-center py-4 text-zinc-500">Carregando...</div>
            ) : favoriteVideos.length > 0 ? (
                <div className="space-y-2">
                  {favoriteVideos.map((video) => (
                    <div 
                        key={video.id} 
                        className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer group"
                        onClick={() => handlePlayFavorite(video)}
                    >
                        <div className="relative w-16 h-9 bg-zinc-900 rounded overflow-hidden flex-shrink-0">
                            {video.image ? (
                                <img src={video.image.t} alt={video.song_title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                    <Play className="w-4 h-4 text-zinc-600" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-semibold text-white truncate">{video.song_title}</h5>
                            <p className="text-xs text-zinc-400 truncate">{video.artists.map(a => a.name).join(', ')}</p>
                        </div>
                    </div>
                  ))}
                </div>
            ) : (
                <p className="text-sm text-zinc-500">Nenhum vídeo favorito ainda.</p>
            )}
          </div>

          {/* Listening History */}
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4">
            <h4 className="font-bold text-white mb-3">Histórico Recente</h4>
            <div className="space-y-2">
              {profile?.listened_count && profile.listened_count > 0 ? (
                <p className="text-sm text-zinc-400">Você assistiu {profile.listened_count} clipes!</p>
              ) : (
                <p className="text-sm text-zinc-400">Nenhum histórico ainda. Comece a explorar!</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-6 space-y-3">
          {editing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-zinc-700 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};
