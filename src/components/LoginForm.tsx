import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LogIn, ArrowRight, Mail, Lock, Shield, Home } from 'lucide-react';
import SplineBackground from './SplineBackground';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [asAdmin, setAsAdmin] = useState(false);
  const { login, logout } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      // Si l'utilisateur demande explicitement un accès admin, vérifier le rôle directement depuis l'utilisateur retourné
      if (asAdmin && String(user.role || '').toLowerCase() !== 'admin') {
        // Déconnecter et informer
        await logout();
        showToast("Accès administrateur refusé : les identifiants fournis ne correspondent pas à un compte administrateur.", 'error');
        setError("Accès administrateur refusé : les identifiants fournis ne correspondent pas à un compte administrateur.");
        return;
      }

      // Success
      showToast('Connexion réussie', 'success');
    } catch (err) {
      showToast('Email ou mot de passe incorrect', 'error');
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments de décoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <SplineBackground url="https://prod.spline.design/P9M2dlKhXebtaaFH/scene.splinecode" />

      {/* Conteneur principal */}
      <div className="absolute w-full max-w-md z-10">
        {/* Carte de connexion */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl shadow-2xl backdrop-blur-xl bg-opacity-95 border border-white border-opacity-20 overflow-hidden">

          {/* Header gradient */}
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

          <div className="p-8">
            {/* Logo et titre */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-md opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                    <LogIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Portail RH
              </h1>
              <p className="text-slate-600 text-xs font-medium">
                Accédez à votre espace personnel
              </p>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Champ Email */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Bouton Se connecter */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-500">Pas encore de compte?</span>
              </div>
            </div>

            {/* Bouton S'inscrire */}
            <button
              onClick={onSwitchToRegister}
              className="w-full py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300"
            >
              Créer un compte
            </button>

            {/* Bouton Accueil */}
            <button
              onClick={() => window.location.href = '/'}
              className="w-full mt-3 py-3 rounded-lg text-slate-600 font-medium hover:text-slate-700 hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Retour à l'accueil
            </button>
          </div>
        </div>

        {/* Footer informatif */}
        <div className="text-center mt-6 text-slate-400 text-xs">
          <p>© 2026 Portail RH. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
