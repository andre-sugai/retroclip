
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';
import { Video } from '../types';

interface FavoriteButtonProps {
  currentVideo: Video | null;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ currentVideo }) => {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const [modalState, setModalState] = useState<'login' | 'signup' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFav = currentVideo ? isFavorite(currentVideo.id) : false;

  const handleClick = async () => {
    if (!currentVideo) return;

    if (!user) {
      setModalState('login');
      return;
    }

    setIsLoading(true);
    try {
      await toggleFavorite(currentVideo.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className={`relative group ${isLoading ? 'opacity-50' : ''}`}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-label={isFav ? "Unfavorite Video" : "Favorite Video"}
        className={`
           flex items-center justify-center
           w-12 h-12
           rounded-full
           border-[1.5px]
           transition-all duration-300
           hover:scale-110
           drop-shadow-2xl
           ${isFav 
             ? 'border-pink-500 text-pink-500' 
             : 'border-white text-white hover:border-pink-300 hover:text-pink-300'
           }
        `}
      >
        <Heart 
          strokeWidth={1.5}
          className={`w-6 h-6 ${isFav ? 'fill-pink-500' : ''}`} 
        />
      </button>
    </div>

      {/* Auth Modals */}
      {modalState === 'login' && (
        <LoginModal
          onClose={() => setModalState(null)}
          onSwitchToSignup={() => setModalState('signup')}
        />
      )}

      {modalState === 'signup' && (
        <SignupModal
          onClose={() => setModalState(null)}
          // Fix: SignupModal prop might be named differently or not exist? 
          // Checking AuthButton usage: onSwitchToLogin
          onSwitchToLogin={() => setModalState('login')}
        />
      )}
    </>
  );
};
