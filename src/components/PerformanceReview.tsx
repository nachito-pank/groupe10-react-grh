import { Award, Star, TrendingUp } from 'lucide-react';

export default function PerformanceReview() {
  const mockReviews = [
    {
      id: 1,
      date: '2025-06-15',
      note: 4.5,
      commentaire: 'Excellent travail sur le projet Q2. Démontre de grandes compétences en leadership.',
      evaluateur: 'Marie Dupont',
    },
    {
      id: 2,
      date: '2025-03-10',
      note: 4.0,
      commentaire: 'Bonne performance globale. Amélioration continue sur les compétences techniques.',
      evaluateur: 'Jean Martin',
    },
  ];

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
              <p className="text-3xl font-bold text-gray-800 mt-1">4.25</p>
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
              <p className="text-3xl font-bold text-gray-800 mt-1">{mockReviews.length}</p>
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

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Évaluation du {new Date(review.date).toLocaleDateString()}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Évaluateur: {review.evaluateur}
                </p>
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

      {mockReviews.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune évaluation disponible</p>
        </div>
      )}
    </div>
  );
}
