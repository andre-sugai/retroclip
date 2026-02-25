import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TermsModal } from './TermsModal';

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength calculator
  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (pwd.length < 6) return 'weak';
    
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    const score = [hasLowerCase, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (score >= 3 && pwd.length >= 8) return 'strong';
    if (score >= 2 && pwd.length >= 6) return 'medium';
    return 'weak';
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Traduzir mensagens de erro do Supabase para português
  const translateError = (errorMessage: string): string => {
    const translations: Record<string, string> = {
      'User already registered': 'Usuário já cadastrado',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'Invalid login credentials': 'Email ou senha inválidos',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Unable to validate email address: invalid format': 'Formato de email inválido',
      'Email rate limit exceeded': 'Limite de emails excedido. Tente novamente mais tarde.',
      'Signup requires a valid password': 'É necessária uma senha válida',
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

    // Validation
    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!acceptTerms) {
      setError('Você deve aceitar os termos e condições');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password, {
      full_name: fullName,
      username: username,
    });

    if (signUpError) {
      setError(translateError(signUpError.message));
      setLoading(false);
    } else {
      // Success - show confirmation message
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
              V 1.25.3 // ARIA-COMPLIANT
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="space-y-6 text-center py-8">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
              </div>

              {/* Success Title */}
              <div>
                <h2 className="text-2xl font-black text-white mb-2">
                  Conta Criada!
                </h2>
                <p className="text-zinc-400 text-sm">
                  Bem-vindo ao Grooovio, {fullName}!
                </p>
              </div>

              {/* Email Confirmation Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-500 mb-1">
                      Confirme seu email
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Enviamos um email de confirmação para <strong className="text-white">{email}</strong>.
                      Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-zinc-500 space-y-1">
                <p>Não recebeu o email? Verifique sua pasta de spam.</p>
                <p>O link de confirmação expira em 24 horas.</p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
              >
                Entendi
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300 mb-2">
                Nome Completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
                required
              />
            </div>

            {/* Email */}
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

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                Nome de Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="nomedeusuario"
              />
            </div>

            {/* Password */}
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div className={`h-1 flex-1 rounded-full transition-colors ${
                      passwordStrength === 'weak' ? 'bg-red-500' : 
                      passwordStrength === 'medium' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`} />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${
                      passwordStrength === 'medium' || passwordStrength === 'strong' ? 
                      passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500' : 
                      'bg-zinc-700'
                    }`} />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${
                      passwordStrength === 'strong' ? 'bg-green-500' : 'bg-zinc-700'
                    }`} />
                  </div>
                  <p className={`text-xs ${
                    passwordStrength === 'weak' ? 'text-red-400' :
                    passwordStrength === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    Força da senha: {
                      passwordStrength === 'weak' ? 'Fraca' :
                      passwordStrength === 'medium' ? 'Média' :
                      'Forte'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 mr-2 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-zinc-400">
                Aceito os{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTerms(true);
                  }}
                  className="text-amber-500 hover:text-amber-400 transition-colors underline"
                >
                  termos e condições
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
          )}

          {/* Footer - only show when not in success state */}
          {!success && (
            <p className="mt-6 text-center text-sm text-zinc-400">
              Já tem uma conta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
              >
                Fazer login
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
};
