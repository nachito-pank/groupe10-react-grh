import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Mail, Lock, Eye, EyeOff, Home, Sparkles } from 'lucide-react';
import '../styles/glassmorphism.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      if (asAdmin && String(user.role || '').toLowerCase() !== 'admin') {
        await logout();
        showToast("Accès administrateur refusé", 'error');
        setError("Accès administrateur refusé");
        return;
      }

      showToast('Connexion réussie', 'success');
    } catch (err) {
      showToast('Email ou mot de passe incorrect', 'error');
      setError('Email ou mot de passe incorrect');
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
        <div className="glass-form relative backdrop-blur-2xl bg-white/10 border border-cyan-400/30 rounded-3xl p-12 shadow-2xl border-l border-t border-cyan-300/20">
          {/* Shine effect with cyan glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-500/10 opacity-0 rounded-3xl pointer-events-none group-hover:opacity-100 transition-opacity"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo and title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Portail RH</h1>
              <p className="text-slate-300 text-sm font-medium">Accédez à votre espace personnel</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-xl animate-pulse">
                <p className="text-red-100 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email input */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-100 mb-3 glass-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60 group-focus-within:text-cyan-300 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Admin checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={asAdmin}
                  onChange={(e) => setAsAdmin(e.target.checked)}
                  className="w-5 h-5 rounded-lg bg-white/10 border border-cyan-400/30 checked:bg-cyan-500 checked:border-cyan-400 cursor-pointer accent-cyan-500"
                />
                <span className="text-slate-300 text-sm font-medium group-hover:text-slate-100 transition-colors">Connexion administrateur</span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="glass-button w-full relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/30"></div>
              <span className="text-slate-400 text-xs font-medium">OU</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/30"></div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="social-button backdrop-blur-md bg-white/5 border border-cyan-400/30 text-white py-3 rounded-xl font-semibold hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all">
                Google
              </button>
              <button className="social-button backdrop-blur-md bg-white/5 border border-cyan-400/30 text-white py-3 rounded-xl font-semibold hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all">
                GitHub
              </button>
            </div>

            {/* Register link */}
            <button
              onClick={onSwitchToRegister}
              className="w-full text-center text-slate-400 hover:text-slate-100 transition-colors mb-3"
            >
              <span className="text-sm">Pas encore de compte? </span>
              <span className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">S'inscrire</span>
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
