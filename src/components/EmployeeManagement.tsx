import { useEffect, useState } from 'react';
import { Employee, Service } from '../types';
import { employeeApi, serviceApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Users, Plus, Edit2, Trash2, Mail, Building2, Shield, AlertCircle } from 'lucide-react';

export default function EmployeeManagement() {
    const { isAdmin } = useAuth();
    const { showToast } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'employe',
        service_id: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [employeesData, servicesData] = await Promise.all([
                employeeApi.getAll(),
                serviceApi.getAll(),
            ]);
            setEmployees(employeesData.filter((e) => e.id !== 0));
            setServices(servicesData.filter((s) => s.id !== 0));
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim() || !formData.email.trim()) {
            const msg = 'Le nom et email sont requis';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        if (!editingId && formData.password !== formData.password_confirmation) {
            const msg = 'Les mots de passe ne correspondent pas';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        if (!editingId && !formData.password) {
            const msg = 'Le mot de passe est requis';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('📝 Submitting employee form:', { editingId, formData });

            if (editingId) {
                // Modifier un employé existant
                console.log('🔄 Updating employee:', editingId);
                const updatedEmployee = await employeeApi.update(editingId, {
                    role: formData.role,
                    service_id: formData.service_id || undefined,
                });
                console.log('✅ Employee updated:', updatedEmployee);
                setEmployees(employees.map((e) => (e.id === editingId ? updatedEmployee : e)));
                showToast('Employé modifié avec succès', 'success');
            } else {
                // Créer un nouvel employé via register
                console.log('➕ Creating new employee');
                const base_url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                const resp = await fetch(`${base_url}/api/groupe-10/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        password_confirmation: formData.password_confirmation,
                        role: formData.role,
                        service_id: formData.service_id || undefined,
                    }),
                });

                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    throw new Error(err.message || 'Erreur lors de la création');
                }

                const json = await resp.json();
                const newUser = json.data?.user || json.user || json;

                // Créer le record employé via admin endpoint
                const newEmployee = await employeeApi.create({
                    user_id: newUser.id,
                    role: formData.role,
                    service_id: formData.service_id,
                });

                setEmployees([...employees, newEmployee]);
                showToast('Employé créé avec succès', 'success');
            }

            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 'employe',
                service_id: 0,
            });
            setShowAddForm(false);
            setError(null);
            setEditingId(null);
        } catch (err: any) {
            console.error('❌ Error:', err);
            console.error('Error details:', {
                message: err?.message,
                status: err?.status,
                response: err?.response,
            });
            const errorMsg = err?.message || 'Erreur lors de l\'opération';
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (employee: Employee) => {
        setFormData({
            name: employee.name,
            email: employee.email,
            password: '',
            password_confirmation: '',
            role: employee.role,
            service_id: employee.service_id || 0,
        });
        setEditingId(employee.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;

        try {
            await employeeApi.delete(id);
            setEmployees(employees.filter((e) => e.id !== id));
            showToast('Employé supprimé avec succès', 'success');
        } catch (err: any) {
            console.error('Error deleting employee:', err);
            showToast(err?.message || 'Erreur lors de la suppression', 'error');
        }
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingId(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'employe',
            service_id: 0,
        });
    };

    if (!isAdmin) {
        return (
            <div className="bg-white rounded-xl p-8 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Accès réservé aux administrateurs</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gestion des employés</h2>
                    <p className="text-gray-600 mt-1">{employees.length} employés configurés</p>
                </div>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingId(null);
                        setFormData({
                            name: '',
                            email: '',
                            password: '',
                            password_confirmation: '',
                            role: 'employe',
                            service_id: 0,
                        });
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>{showAddForm ? 'Annuler' : 'Ajouter employé'}</span>
                </button>
            </div>

            {services.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-amber-900 font-medium">Aucun service disponible</p>
                        <p className="text-amber-800 text-sm">Créez d'abord des services avant d'ajouter des employés.</p>
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingId ? 'Modifier l\'employé' : 'Ajouter un employé'}
                    </h3>
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 font-medium text-sm">⚠️ {error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Jean Dupont"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jean@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {!editingId && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mot de passe *
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required={!editingId}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmer mot de passe *
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password_confirmation}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password_confirmation: e.target.value })
                                            }
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required={!editingId}
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rôle *
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="employe">Employé</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service {services.length === 0 && <span className="text-red-500">*</span>}
                                </label>
                                <select
                                    value={formData.service_id || ''}
                                    onChange={(e) => setFormData({ ...formData, service_id: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required={services.length > 0}
                                    disabled={services.length === 0}
                                >
                                    <option value="">-- Sélectionner un service --</option>
                                    {services.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || services.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {isSubmitting ? 'Traitement...' : editingId ? 'Modifier' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                    {employee.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                                    <div className="space-y-1 mt-2">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{employee.email}</span>
                                        </div>
                                        {employee.service && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Building2 className="w-4 h-4" />
                                                <span>{employee.service.nom}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${employee.role === 'admin'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}
                                >
                                    {employee.role === 'admin' ? (
                                        <>
                                            <Shield className="w-3 h-3 inline mr-1" />
                                            Admin
                                        </>
                                    ) : (
                                        'Employé'
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex space-x-2 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(employee)}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>Modifier</span>
                            </button>
                            <button
                                onClick={() => handleDelete(employee.id)}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Supprimer</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {employees.length === 0 && !showAddForm && (
                <div className="bg-white rounded-xl p-12 text-center">
                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Aucun employé configuré</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        disabled={services.length === 0}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Créer le premier employé</span>
                    </button>
                </div>
            )}
        </div>
    );
}
