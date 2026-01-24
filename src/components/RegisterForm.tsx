import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Mail, Lock, User, Briefcase, Home, Sparkles, Eye, EyeOff } from 'lucide-react';
import '../styles/glassmorphism.css';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      backgroundImage: 'url("https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1200")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Overlay gradient with cyan/blue theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-slate-950/85"></div>
      {/* Animated gradient orbs - cyan/blue theme */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '4s' }}></div>

      {/* Glass container */}
      <div className="glass-container relative w-full max-w-md z-10">
        {/* Glassmorphism card */}
        <div className="glass-form relative backdrop-blur-2xl bg-white/10 border border-cyan-400/30 rounded-3xl p-8 shadow-2xl border-l border-t border-cyan-300/20">
          {/* Shine effect with cyan glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-500/10 opacity-0 rounded-3xl pointer-events-none group-hover:opacity-100 transition-opacity"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo and title */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Créer un compte</h1>
              <p className="text-slate-300 text-sm font-medium">Rejoignez le Portail RH</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-xl animate-pulse">
                <p className="text-red-100 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name input */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-100 mb-3 glass-label">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60 group-focus-within:text-cyan-300 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="glass-input w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-cyan-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 outline-none"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-100 mb-3 glass-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60 group-focus-within:text-cyan-300 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-cyan-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 outline-none"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-100 mb-3 glass-label">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60 group-focus-within:text-cyan-300 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="glass-input w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-cyan-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/60 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm password input */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-100 mb-3 glass-label">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60 group-focus-within:text-cyan-300 transition-colors" />
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="glass-input w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-cyan-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/60 hover:text-cyan-300 transition-colors"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Role select */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-100 mb-3 glass-label">Rôle</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60 pointer-events-none" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="glass-input w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-cyan-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="employe" className="bg-slate-900 text-white">Employé</option>
                    <option value="admin" className="bg-slate-900 text-white">Admin</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="glass-button w-full relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:shadow-lg hover:shadow-cyan-500/50 mt-2"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? 'Inscription en cours...' : 'Créer un compte'}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/30"></div>
              <span className="text-slate-400 text-xs font-medium">OU</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/30"></div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="social-button backdrop-blur-md bg-white/5 border border-cyan-400/30 text-white py-3 rounded-xl font-semibold hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all">
                Google
              </button>
              <button className="social-button backdrop-blur-md bg-white/5 border border-cyan-400/30 text-white py-3 rounded-xl font-semibold hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all">
                GitHub
              </button>
            </div>

            {/* Login link */}
            <button
              onClick={onSwitchToLogin}
              className="w-full text-center text-slate-400 hover:text-slate-100 transition-colors mb-3"
            >
              <span className="text-sm">Déjà inscrit? </span>
              <span className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">Se connecter</span>
            </button>

            {/* Home button */}
            <button
              onClick={() => window.location.hash = '#landing'}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
