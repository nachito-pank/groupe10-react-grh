import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, Clock, GraduationCap } from 'lucide-react';
import { employeeApi, leaveApi } from '../services/api';
import { Employee, LeaveRequest } from '../types';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesData, leavesData] = await Promise.all([
        isAdmin ? employeeApi.getAll() : Promise.resolve([]),
        leaveApi.getAll(),
      ]);
      setEmployees(employeesData);
      setLeaves(leavesData.filter(leave => isAdmin || leave.employe?.user_id === user?.id));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Bienvenue, {user?.name}
        </h2>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de votre portail RH
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employés</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{employees.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Congés en attente</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pendingLeaves}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Congés approuvés</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{approvedLeaves}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>


      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Dernières demandes de congés
          </h3>
          <div className="space-y-3">
            {leaves.slice(0, 5).map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{leave.raison}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(leave.date_debut).toLocaleDateString()} -{' '}
                    {new Date(leave.date_fin).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${leave.status === 'approved'
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
            ))}
            {leaves.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune demande de congé</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Prochaines formations
          </h3>
          <div className="space-y-3">
            <div className="text-center text-gray-500 py-8">
              <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Aucune formation planifiée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
