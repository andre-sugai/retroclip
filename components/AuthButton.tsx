import React, { useState } from 'react';
import { UserCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';
import { ProfilePanel } from './ProfilePanel';

type ModalState = 'login' | 'signup' | 'profile' | null;

import { Video } from '../types';

interface AuthButtonProps {
  onSelectVideo?: (video: Video) => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onSelectVideo }) => {
  const { user, profile } = useAuth();
  const [modalState, setModalState] = useState<ModalState>(null);

  const handleClick = () => {
    if (user) {
      setModalState('profile');
    } else {
      setModalState('login');
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 h-10 rounded-md shadow-md transition-colors"
        aria-label={user ? 'Perfil' : 'Login'}
      >
        {user ? (
          <>
            <UserCircle className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">
              {profile?.username || 'Perfil'}
            </span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Entrar</span>
          </>
        )}
      </button>

      {/* Modals */}
      {modalState === 'login' && (
        <LoginModal
          onClose={() => setModalState(null)}
          onSwitchToSignup={() => setModalState('signup')}
        />
      )}

      {modalState === 'signup' && (
        <SignupModal
          onClose={() => setModalState(null)}
          onSwitchToLogin={() => setModalState('login')}
        />
      )}

      {modalState === 'profile' && user && (
        <ProfilePanel 
            onClose={() => setModalState(null)} 
            onSelectVideo={onSelectVideo}
        />
      )}
    </>
  );
};
