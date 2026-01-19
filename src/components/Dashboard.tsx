import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import { Users, Calendar, Clock, GraduationCap } from 'lucide-react';
import { employeeApi, leaveApi } from '../services/api';
import { Employee, LeaveRequest } from '../types';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { isMobile, isTablet, isDesktopXL } = useResponsive();
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
      <div className="flex items-center justify-center min-h-96 xs:min-h-64">
        <div className="text-gray-500 text-base-fluid">Chargement...</div>
      </div>
    );
  }

  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'approved').length;

  // Nombre de colonnes adapté à la taille de l'écran
  const gridColsClass = isDesktopXL
    ? 'grid-cols-6'
    : isTablet
      ? 'grid-cols-2'
      : 'grid-cols-1';

  const statsGridColsClass = isDesktopXL
    ? 'lg:grid-cols-5 xl:grid-cols-6'
    : isTablet
      ? 'md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10">
      {/* Header section */}
      <div className="px-1 xs:px-2 sm:px-0">
        <h2 className="text-2xl-fluid font-bold text-gray-800">
          Bienvenue, {user?.name}
        </h2>
        <p className="text-base-fluid text-gray-600 mt-1 xs:mt-2">
          Vue d'ensemble de votre portail RH
        </p>
      </div>

      {/* Stats cards grid */}
      <div className={`grid ${statsGridColsClass} gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6`}>
        {isAdmin && (
          <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs-fluid xs:text-sm-fluid text-gray-600 truncate">Total Employés</p>
                <p className="text-xl-fluid xs:text-2xl-fluid font-bold text-gray-800 mt-1">{employees.length}</p>
              </div>
              <div className="bg-blue-100 p-2 xs:p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs-fluid xs:text-sm-fluid text-gray-600 truncate">Congés en attente</p>
              <p className="text-xl-fluid xs:text-2xl-fluid font-bold text-gray-800 mt-1">{pendingLeaves}</p>
            </div>
            <div className="bg-yellow-100 p-2 xs:p-2.5 sm:p-3 rounded-lg flex-shrink-0">
              <Calendar className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs-fluid xs:text-sm-fluid text-gray-600 truncate">Congés approuvés</p>
              <p className="text-xl-fluid xs:text-2xl-fluid font-bold text-gray-800 mt-1">{approvedLeaves}</p>
            </div>
            <div className="bg-green-100 p-2 xs:p-2.5 sm:p-3 rounded-lg flex-shrink-0">
              <Calendar className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent leaves and training section */}
      <div className={`grid grid-cols-1 ${isTablet ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-3 xs:gap-4 sm:gap-5 md:gap-6`}>
        {/* Recent leaves card */}
        <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg-fluid xs:text-xl-fluid font-semibold text-gray-800 mb-3 xs:mb-4">
            Dernières demandes de congés
          </h3>
          <div className="space-y-2 xs:space-y-3">
            {leaves.slice(0, isMobile ? 3 : 5).map((leave) => (
              <div
                key={leave.id}
                className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs-fluid xs:text-sm-fluid font-medium text-gray-800 truncate">{leave.raison}</p>
                  <p className="text-xs text-gray-600 mt-0.5 xs:mt-1">
                    {new Date(leave.date_debut).toLocaleDateString('fr-FR', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                    {' - '}
                    {new Date(leave.date_fin).toLocaleDateString('fr-FR', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`px-2 xs:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${leave.status === 'approved'
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
              <p className="text-gray-500 text-center py-6 xs:py-8 text-base-fluid">Aucune demande de congé</p>
            )}
          </div>
        </div>

        {/* Training section */}
        <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg-fluid xs:text-xl-fluid font-semibold text-gray-800 mb-3 xs:mb-4">
            Prochaines formations
          </h3>
          <div className="space-y-3">
            <div className="text-center text-gray-500 py-6 xs:py-8 md:py-12">
              <GraduationCap className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-base-fluid">Aucune formation planifiée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
