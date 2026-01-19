import { useEffect, useState } from 'react';
import { LeaveRequest } from '../types';
import { leaveApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar, Plus, Check, X, Trash2 } from 'lucide-react';

export default function LeaveManagement() {
  const { isAdmin, user } = useAuth();
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date_debut: '',
    date_fin: '',
    raison: '',
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      console.log('🔄 Loading leaves...');
      const data = await leaveApi.getAll();
      console.log('📋 Leaves loaded:', data);
      console.log('👤 Current user:', user);
      console.log('👤 User ID:', user?.id);
      console.log('👤 User role:', user?.role);

      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data);
        console.log('Data type:', typeof data);
        setLeaves([]);
        return;
      }

      console.log('Total leaves from API:', data.length);

      // Filter based on user role
      const filteredLeaves = isAdmin
        ? data
        : data.filter(leave => {
          const employeeId = leave.employe?.id || leave.employe_id;
          console.log(`Comparing: leave.employe?.id=${leave.employe?.id}, leave.employe_id=${leave.employe_id}, user.id=${user?.id}, match=${employeeId === user?.id}`);
          return employeeId === user?.id;
        });

      console.log('✅ Filtered leaves:', filteredLeaves);
      console.log('Filtered leaves count:', filteredLeaves.length);
      setLeaves(filteredLeaves);
    } catch (error) {
      console.error('❌ Error loading leaves:', error);
      console.error('Error type:', error instanceof Error ? error.message : 'Unknown error');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leaveApi.create(formData);
      await loadLeaves();
      setShowForm(false);
      setFormData({ date_debut: '', date_fin: '', raison: '' });
      showToast('Demande de congé soumise avec succès', 'success');
    } catch (error: any) {
      console.error('Error creating leave request:', error);
      showToast(error?.message || 'Erreur lors de la création de la demande', 'error');
    }
  };

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await leaveApi.updateStatus(id, status);
      await loadLeaves();
      showToast('Statut mis à jour', 'success');
    } catch (error: any) {
      console.error('Error updating leave status:', error);
      showToast(error?.message || 'Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande de congé ?')) return;

    try {
      await leaveApi.delete(id);
      setLeaves(leaves.filter((l) => l.id !== id));
      showToast('Demande de congé supprimée avec succès', 'success');
    } catch (err: any) {
      console.error('Error deleting leave:', err);
      showToast(err?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-slate-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Gestion des congés</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{leaves.length} demandes au total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle demande</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Nouvelle demande de congé
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) =>
                    setFormData({ ...formData, date_debut: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.date_fin}
                  onChange={(e) =>
                    setFormData({ ...formData, date_fin: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Raison
              </label>
              <textarea
                value={formData.raison}
                onChange={(e) => setFormData({ ...formData, raison: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors duration-300"
                placeholder="Motif de la demande..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Soumettre
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <tr>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Employé
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Date début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Date fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Raison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Statut
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {leave.employe?.name || `ID: ${leave.employe_id}`}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">
                    {new Date(leave.date_debut).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">
                    {new Date(leave.date_fin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-slate-300 max-w-xs truncate">
                      {leave.raison}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : leave.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                    >
                      {leave.status === 'approved'
                        ? 'Approuvé'
                        : leave.status === 'rejected'
                          ? 'Rejeté'
                          : 'En attente'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {leave.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'approved')}
                              className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition"
                              title="Approuver"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                              title="Rejeter"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(leave.id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaves.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Aucune demande de congé</p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Créer une demande</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
