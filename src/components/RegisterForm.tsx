import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LogIn, ArrowRight, Mail, Lock, User, Briefcase, Home } from 'lucide-react';
import SplineBackground from './SplineBackground';

export default function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'employe',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: formData.role,
      });

      showToast('Compte créé et connecté avec succès', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      showToast(err instanceof Error ? err.message : 'Erreur lors de l\'inscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments de décoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000"></div>

      <SplineBackground url="https://prod.spline.design/P9M2dlKhXebtaaFH/scene.splinecode" />

      {/* Conteneur principal */}
      <div className="absolute w-full max-w-md z-10">
        {/* Carte d'inscription */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl shadow-2xl backdrop-blur-xl bg-opacity-95 border border-white border-opacity-20 overflow-hidden">

          {/* Header gradient */}
          <div className="h-1.5 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600"></div>

          <div className="p-6">
            {/* Logo et titre */}
            <div className="text-center mb-4">
              <div className="flex justify-center mb-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-md opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                    <LogIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Créer un compte
              </h1>
              <p className="text-slate-600 text-xs font-medium mt-0.5">
                Rejoignez le Portail RH
              </p>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-700 text-xs font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5 max-h-80 overflow-y-auto pr-1.5">
              {/* Champ Nom */}
              <div className="group">
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 text-sm"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              </div>

              {/* Champ Email */}
              <div className="group">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 text-sm"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="group">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Champ Confirmation Mot de passe */}
              <div className="group">
                <label htmlFor="password_confirmation" className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmer
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Champ Rôle */}
              <div className="group">
                <label htmlFor="role" className="block text-xs font-semibold text-slate-700 mb-1">
                  Rôle
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-700 appearance-none cursor-pointer text-sm"
                    required
                  >
                    <option value="employe">Employé</option>
                    <option value="admin">Admin</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Bouton S'inscrire */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-1 group mt-3 text-sm"
              >
                <span>{loading ? 'Inscription...' : 'Créer compte'}</span>
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Séparateur */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-500">Déjà inscrit?</span>
              </div>
            </div>

            {/* Bouton Se connecter */}
            <button
              onClick={onSwitchToLogin}
              className="w-full py-2 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50/50 transition-all duration-300 text-sm"
            >
              Se connecter
            </button>

            {/* Bouton Accueil */}
            <button
              onClick={() => window.location.href = '/'}
              className="w-full mt-2 py-2 rounded-lg text-slate-600 font-medium hover:text-slate-700 hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-1 group text-sm"
            >
              <Home className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              Accueil
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
