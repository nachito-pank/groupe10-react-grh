import { useEffect, useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { attendanceApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function AttendanceTracking() {
  useAuth(); // we don't need user here but keep auth available if needed later
  const { showToast } = useToast();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const data = await attendanceApi.getAll();
      setAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordNow = async () => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const record: any = await attendanceApi.record({ date, heure_arrivee: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'present' });
      setAttendance((prev) => [record, ...prev]);
      showToast('Présence enregistrée avec succès', 'success');
    } catch (error: any) {
      console.error('Error recording attendance:', error);
      showToast(error?.message || "Impossible d'enregistrer la présence", 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'retard':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'retard':
        return 'Retard';
      case 'absent':
        return 'Absent';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const presentCount = attendance.filter((r) => r.status === 'present').length;
  const lateCount = attendance.filter((r) => r.status === 'retard').length;
  const absentCount = attendance.filter((r) => r.status === 'absent').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Suivi des présences</h2>
        <p className="text-gray-600 mt-1">Historique de présence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jours présents</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{presentCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retards</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{lateCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absences</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{absentCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Pointage</h3>
          <p className="text-sm text-gray-600">Enregistrez votre arrivée rapidement</p>
        </div>
        <div>
          <button onClick={recordNow} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Pointer</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Historique</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure d'arrivée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure de départ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900"><Calendar className="w-4 h-4 mr-2 text-gray-400" />{new Date(record.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center text-sm text-gray-900"><Clock className="w-4 h-4 mr-2 text-gray-400" />{record.heure_arrivee}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center text-sm text-gray-900"><Clock className="w-4 h-4 mr-2 text-gray-400" />{record.heure_depart || '-'}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center space-x-2">{getStatusIcon(record.status)}<span className="text-sm text-gray-900">{getStatusLabel(record.status)}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
