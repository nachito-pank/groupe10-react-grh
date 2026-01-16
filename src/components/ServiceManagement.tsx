import { useEffect, useState } from 'react';
import { Service } from '../types';
import { serviceApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';

export default function ServiceManagement() {
    const { isAdmin } = useAuth();
    const { showToast } = useToast();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({ nom: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await serviceApi.getAll();
            setServices(data.filter((s) => s.id !== 0));
        } catch (error) {
            console.error('Error loading services:', error);
            showToast('Erreur lors du chargement des services', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.nom.trim()) {
            setError('Le nom du service est requis');
            showToast('Le nom du service est requis', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('📝 Submitting form:', { editingId, formData });

            if (editingId) {
                // Modifier un service existant
                console.log('🔄 Updating service:', editingId);
                const updatedService = await serviceApi.update(editingId, {
                    nom: formData.nom,
                    description: formData.description || undefined,
                });
                console.log('✅ Service updated:', updatedService);
                setServices(services.map((s) => (s.id === editingId ? updatedService : s)));
                showToast('Service modifié avec succès', 'success');
            } else {
                // Créer un nouveau service
                console.log('➕ Creating new service');
                const newService = await serviceApi.create({
                    nom: formData.nom,
                    description: formData.description || undefined,
                });
                console.log('✅ Service created:', newService);
                setServices([...services, newService]);
                showToast('Service créé avec succès', 'success');
            }

            setFormData({ nom: '', description: '' });
            setShowAddForm(false);
            setEditingId(null);
            setError(null);
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

    const handleEdit = (service: Service) => {
        setFormData({ nom: service.nom, description: service.description || '' });
        setEditingId(service.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

        try {
            await serviceApi.delete(id);
            setServices(services.filter((s) => s.id !== id));
            showToast('Service supprimé avec succès', 'success');
        } catch (err: any) {
            console.error('Error deleting service:', err);
            showToast(err?.message || 'Erreur lors de la suppression', 'error');
        }
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingId(null);
        setFormData({ nom: '', description: '' });
    };

    if (!isAdmin) {
        return (
            <div className="bg-white rounded-xl p-8 text-center">
                <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
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
                    <h2 className="text-3xl font-bold text-gray-800">Gestion des services</h2>
                    <p className="text-gray-600 mt-1">{services.length} services configurés</p>
                </div>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingId(null);
                        setFormData({ nom: '', description: '' });
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>{showAddForm ? 'Annuler' : 'Ajouter service'}</span>
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingId ? 'Modifier le service' : 'Ajouter un service'}
                    </h3>
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 font-medium text-sm">⚠️ {error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du service *
                            </label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                placeholder="Ex: Développement, RH, Finance..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (optionnel)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Description du service..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
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
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {isSubmitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3 flex-1">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{service.nom}</h3>
                                    {service.description && (
                                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(service)}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>Modifier</span>
                            </button>
                            <button
                                onClick={() => handleDelete(service.id)}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Supprimer</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && !showAddForm && (
                <div className="bg-white rounded-xl p-12 text-center">
                    <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Aucun service configuré</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Créer le premier service</span>
                    </button>
                </div>
            )}
        </div>
    );
}
