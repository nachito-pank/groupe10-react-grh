import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, ArrowRight } from 'lucide-react';
import SplineBackground from './SplineBackground';

export default function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'employe',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/groupe-10/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <SplineBackground url="https://prod.spline.design/P9M2dlKhXebtaaFH/scene.splinecode" />
      {/* la taille du formulaire doit etre egale a la hauteur du navigateur */}
      <div className="absolute rounded-2xl shadow-xl w-full max-w-md p-8 bg-white blur-backdrop-filter backdrop-blur-md bg-opacity-60 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">
          Créer un compte
        </h1>
        <p className="text-center mb-8">
          Inscrivez-vous pour accéder au portail RH
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium  mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium  mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium  mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Rôle
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="employe">Employé</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Inscription...' : 'S\'inscrire'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm ">
            Vous avez déjà un compte?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-white bg-blue-600  rounded-lg font-medium hover:bg-white hover:text-blue-600 h-8 w-56 transition"
            >
              Se connecter
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
