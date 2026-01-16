import { useEffect, useState } from 'react';
import { Award, Star, TrendingUp } from 'lucide-react';
import { performanceApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function PerformanceReview() {
  const { user, isAdmin } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ employe_id: 0, note: 0, commentaire: '' });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await performanceApi.getAll();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newReview = await performanceApi.create({ ...form, evaluateur_id: user?.id || 0 });
      setReviews((prev) => [newReview, ...prev]);
      setForm({ employe_id: 0, note: 0, commentaire: '' });
      showToast('Évaluation ajoutée', 'success');
    } catch (error: any) {
      console.error('Error creating review:', error);
      showToast(error?.message || 'Erreur lors de l\'ajout de l\'évaluation', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const avg = reviews.length > 0 ? (reviews.reduce((a, r) => a + (r.note || 0), 0) / reviews.length).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Évaluations de performance</h2>
        <p className="text-gray-600 mt-1">Historique de vos évaluations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{avg}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Évaluations</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{reviews.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tendance</p>
              <p className="text-3xl font-bold text-green-600 mt-1">+0.5</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter une évaluation</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="number" placeholder="ID employé" value={form.employe_id || ''} onChange={(e) => setForm({ ...form, employe_id: Number(e.target.value) })} className="px-4 py-2 border rounded-lg" required />
              <input type="number" placeholder="Note" value={form.note || ''} onChange={(e) => setForm({ ...form, note: Number(e.target.value) })} className="px-4 py-2 border rounded-lg" step="0.1" min="0" max="5" required />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Ajouter</button>
            </div>
            <textarea placeholder="Commentaire" value={form.commentaire} onChange={(e) => setForm({ ...form, commentaire: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={3} />
          </form>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Évaluation du {new Date(review.date_evaluation || review.date).toLocaleDateString()}</h3>
                <p className="text-sm text-gray-600 mt-1">Évaluateur: {review.evaluateur_name || review.evaluateur_id || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-yellow-700">{review.note}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{review.commentaire}</p>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune évaluation disponible</p>
        </div>
      )}
    </div>
  );
}
