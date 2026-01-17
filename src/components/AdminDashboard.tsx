import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, Clock, TrendingUp, UserPlus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { employeeApi, leaveApi, serviceApi } from '../services/api';
import { Employee, LeaveRequest, Service } from '../types';
import Logo from './Logo';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesData, leavesData, servicesData] = await Promise.all([
        employeeApi.getAll(),
        leaveApi.getAll(),
        serviceApi.getAll(),
      ]);
      setEmployees(employeesData.filter((e) => e.id !== 0));
      setLeaves(leavesData);
      setServices(servicesData.filter((s) => s.id !== 0));
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
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
  const rejectedLeaves = leaves.filter((l) => l.status === 'rejected').length;

  const recentEmployees = employees.slice(-5).reverse();
  const recentLeaves = leaves.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Logo size="sm" showText={false} variant="dark" />
            <h2 className="text-3xl font-bold text-gray-800">
              Tableau de bord Administrateur
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Bienvenue, {user?.name} - Vue d'ensemble complète du système RH
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
          <span className="font-semibold">ADMIN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Employés</p>
              <p className="text-4xl font-bold mt-1">{employees.length}</p>
              <p className="text-blue-100 text-xs mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Actifs dans le système
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Congés en attente</p>
              <p className="text-4xl font-bold mt-1">{pendingLeaves}</p>
              <p className="text-yellow-100 text-xs mt-2">
                Nécessite votre attention
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Congés approuvés</p>
              <p className="text-4xl font-bold mt-1">{approvedLeaves}</p>
              <p className="text-green-100 text-xs mt-2">
                Ce mois
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Services</p>
              <p className="text-4xl font-bold mt-1">{services.length}</p>
              <p className="text-purple-100 text-xs mt-2">
                Départements actifs
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Aperçu des congés
          </h3>
          <p className="text-sm text-gray-500 mb-4">Statut des demandes</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-800">En attente</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{pendingLeaves}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-800">Approuvés</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{approvedLeaves}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-800">Rejetés</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{rejectedLeaves}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Demandes de congés récentes
              </h3>
              <p className="text-sm text-gray-500">Actions requises</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {recentLeaves.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {leave.employe?.name || 'Employé'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{leave.raison}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(leave.date_debut).toLocaleDateString()} -{' '}
                    {new Date(leave.date_fin).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${leave.status === 'approved'
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
            {recentLeaves.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Aucune demande récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Employés récents
              </h3>
              <p className="text-sm text-gray-500">Dernières inscriptions</p>
            </div>
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {recentEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold">
                  {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{employee.name || 'Sans nom'}</p>
                  <p className="text-sm text-gray-600 truncate">{employee.email || 'email indisponible'}</p>
                </div>
                <span className="text-xs text-gray-500 capitalize whitespace-nowrap">
                  {employee.role || 'role indisponible'}
                </span>
              </div>
            ))}
            {recentEmployees.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Aucun employé récent</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Répartition par service
              </h3>
              <p className="text-sm text-gray-500">Vue d'ensemble</p>
            </div>
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            {services.map((service) => {
              const employeeCount = employees.filter(
                (e) => e.service_id === service.id
              ).length;
              const percentage = employees.length > 0
                ? (employeeCount / employees.length) * 100
                : 0;

              return (
                <div key={service.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {service.nom}
                    </span>
                    <span className="text-sm text-gray-600">{employeeCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {services.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Aucun service configuré</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Actions rapides</h3>
            <p className="text-blue-100 text-sm">Accédez aux fonctions administratives</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
              Gérer les employés
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition">
              Approuver les congés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
