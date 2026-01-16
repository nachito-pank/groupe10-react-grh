import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, Award, GraduationCap, User, CheckCircle } from 'lucide-react';
import { leaveApi } from '../services/api';
import { LeaveRequest } from '../types';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const leavesData = await leaveApi.getAll();
      setLeaves(leavesData.filter(leave => leave.employe?.id === user?.id));
    } catch (error) {
      console.error('Error loading employee dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'approved').length;
  const totalLeaveDays = leaves
    .filter((l) => l.status === 'approved')
    .reduce((acc, leave) => {
      const start = new Date(leave.date_debut);
      const end = new Date(leave.date_fin);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return acc + days;
    }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 shadow-lg text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-full">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Bienvenue, {user?.name}
            </h2>
            <p className="text-blue-100 mt-1">
              Votre espace personnel RH
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Congés en attente</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pendingLeaves}</p>
              <p className="text-xs text-gray-500 mt-2">Demandes soumises</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Congés approuvés</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{approvedLeaves}</p>
              <p className="text-xs text-gray-500 mt-2">Cette année</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Jours de congé pris</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalLeaveDays}</p>
              <p className="text-xs text-gray-500 mt-2">Jours utilisés</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Présence</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">94%</p>
              <p className="text-xs text-gray-500 mt-2">Taux de présence</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Mes demandes de congés
              </h3>
              <p className="text-sm text-gray-500">Historique récent</p>
            </div>
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {leaves.slice(0, 5).map((leave) => (
              <div
                key={leave.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-800">{leave.raison}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${leave.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : leave.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {leave.status === 'approved'
                      ? 'Approuvé'
                      : leave.status === 'rejected'
                        ? 'Rejeté'
                        : 'En attente'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Du {new Date(leave.date_debut).toLocaleDateString()} au{' '}
                  {new Date(leave.date_fin).toLocaleDateString()}
                </p>
              </div>
            ))}
            {leaves.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Aucune demande de congé</p>
                <p className="text-sm text-gray-400 mt-1">
                  Créez votre première demande
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Mes formations
              </h3>
              <p className="text-sm text-gray-500">Parcours de développement</p>
            </div>
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Aucune formation planifiée</p>
              <p className="text-sm text-gray-400 mt-1">
                Consultez le catalogue des formations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Performance</h3>
              <p className="text-sm text-gray-500">Dernière évaluation</p>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-800 mb-1">4.2/5</div>
            <p className="text-sm text-gray-600">Note moyenne</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Présences</h3>
              <p className="text-sm text-gray-500">Ce mois</p>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-800 mb-1">20/22</div>
            <p className="text-sm text-gray-600">Jours présents</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Formations</h3>
              <p className="text-sm text-gray-500">Complétées</p>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-800 mb-1">5</div>
            <p className="text-sm text-gray-600">Cette année</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Actions rapides
            </h3>
            <p className="text-gray-600 text-sm">
              Accédez rapidement aux fonctionnalités principales
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
              Demander un congé
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
              Voir mes évaluations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
