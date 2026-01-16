import { useEffect, useState } from 'react';
import { GraduationCap, Calendar, Users, BookOpen } from 'lucide-react';
import { trainingApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function TrainingManagement() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const data = await trainingApi.getAll();
      setTrainings(data);
    } catch (error) {
      console.error('Error loading trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  const { showToast } = useToast();

  const enroll = async (id: number) => {
    try {
      await trainingApi.enroll(id, user?.id || 0);
      // reload trainings to update participants
      await loadTrainings();
      showToast("Inscription prise en compte", 'success');
    } catch (error: any) {
      console.error('Error enrolling:', error);
      showToast(error?.message || "Impossible de s'inscrire", 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const totalFollowed = trainings.reduce((acc, t) => acc + (t.participants ? t.participants.length : (t.participants_count || 0)), 0);
  const upcomingCount = trainings.filter((t) => new Date(t.date_debut) > new Date()).length;
  const totalHours = trainings.reduce((acc, t) => {
    const start = new Date(t.date_debut);
    const end = new Date(t.date_fin);
    const hours = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
    return acc + hours;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Gestion des formations</h2>
        <p className="text-gray-600 mt-1">Parcours de formation et développement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Formations suivies</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalFollowed}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À venir</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{upcomingCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Heures totales</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalHours}h</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {trainings.map((training) => (
          <div key={training.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{training.titre}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${new Date(training.date_debut) > new Date() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {new Date(training.date_debut) > new Date() ? 'À venir' : 'Terminé'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{training.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{new Date(training.date_debut).toLocaleDateString()} - {new Date(training.date_fin).toLocaleDateString()}</span></div>
                  <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>{training.participants ? training.participants.length : (training.participants_count || 0)} participants</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg"><GraduationCap className="w-8 h-8 text-white" /></div>
            </div>

            {new Date(training.date_debut) > new Date() && (
              <div className="pt-4 border-t border-gray-200">
                <button onClick={() => enroll(training.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">S'inscrire</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {trainings.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center"><GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" /><p className="text-gray-600">Aucune formation disponible</p></div>
      )}
    </div>
  );
}
