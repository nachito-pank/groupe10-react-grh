import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LogIn, ArrowRight } from 'lucide-react';
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

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      {/* boutton retour a la  page d'acceuil */}
      <SplineBackground url="https://prod.spline.design/P9M2dlKhXebtaaFH/scene.splinecode" />
      <div className="absolute rounded-2xl shadow-xl w-full max-w-md p-8 bg-white blur-backdrop-filter backdrop-blur-md bg-opacity-60 max-h-screen overflow-y-auto">

        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">
          Portail RH
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Connectez-vous pour accéder à votre espace
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium   mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium   mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="asAdmin"
              type="checkbox"
              checked={asAdmin}
              onChange={(e) => setAsAdmin(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="asAdmin" className="text-sm text-gray-700">
              Se connecter en tant qu'administrateur
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm ">
            Pas encore de compte?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-white bg-blue-600  rounded-lg font-medium hover:bg-white hover:text-blue-600 h-8 w-56 transition"
            >
              S'inscrire
            </button>
          </p>
        </div>
        <br />
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
