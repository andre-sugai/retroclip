import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToSignup }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Traduzir mensagens de erro do Supabase para português
  const translateError = (errorMessage: string): string => {
    const translations: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha inválidos',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.',
      'User not found': 'Usuário não encontrado',
      'Too many requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'Email rate limit exceeded': 'Limite de emails excedido. Tente novamente mais tarde.',
    };

    // Verifica se há uma tradução exata
    if (translations[errorMessage]) {
      return translations[errorMessage];
    }

    // Verifica se a mensagem contém alguma das chaves
    for (const [key, value] of Object.entries(translations)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }

    // Retorna a mensagem original se não houver tradução
    return errorMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(translateError(signInError.message));
      setLoading(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        {/* Modal Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              Grooovio
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              V 1.25.0 // ARIA-COMPLIANT
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                />
                Lembrar-me
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implementar reset de senha
                  alert('Recuperação de Senha\n\nEm breve você poderá recuperar sua senha por email.');
                }}
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            Não tem uma conta?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
