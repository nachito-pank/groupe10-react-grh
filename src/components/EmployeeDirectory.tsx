import { useEffect, useState } from 'react';
import { Employee, Service } from '../types';
import { employeeApi, serviceApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Users, Search, Mail, Building2, Plus } from 'lucide-react';

export default function EmployeeDirectory() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', password_confirmation: '', service_id: 0 });
  const [adding, setAdding] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({ nom: '', description: '' });
  const [addingService, setAddingService] = useState(false);

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
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: name === 'service_id' ? Number(value) : value }));
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.nom.trim()) {
      showToast('Le nom du service est requis', 'error');
      return;
    }

    setAddingService(true);

    try {
      const newService = await serviceApi.create({
        nom: newServiceForm.nom,
        description: newServiceForm.description || undefined,
      });

      setServices([...services, newService]);
      setNewServiceForm({ nom: '', description: '' });
      setShowAddService(false);
      showToast('Service créé avec succès', 'success');
    } catch (err: any) {
      console.error('Error adding service:', err);
      showToast(err?.message || 'Erreur lors de la création du service', 'error');
    } finally {
      setAddingService(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Seul un administrateur peut ajouter un employé.");
      return;
    }

    if (addForm.password !== addForm.password_confirmation) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    setAdding(true);

    try {
      // 1) Create the user via auth register (role forced to 'employe')
      const base_url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const resp = await fetch(`${base_url}/api/groupe-10/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          password: addForm.password,
          password_confirmation: addForm.password_confirmation,
          role: 'employe',
          service_id: addForm.service_id || undefined,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur création utilisateur');
      }

      const json = await resp.json();
      // normalize shape
      const newUser = json.data?.user || json.user || json;
      const userId = newUser.id;

      // 2) Create employee record via admin endpoint
      await employeeApi.create({ user_id: userId, role: 'employe', service_id: addForm.service_id });

      // Reload list
      await loadData();
      setShowAddForm(false);
      setAddForm({ name: '', email: '', password: '', password_confirmation: '', service_id: 0 });
      showToast('Employé ajouté avec succès', 'success');
    } catch (err: any) {
      console.error('Error adding employee:', err);
      showToast(err?.message || 'Erreur lors de l\'ajout', 'error');
    } finally {
      setAdding(false);
    }
  };


  const filteredEmployees = employees.filter((emp) => {
    const name = (emp.name || '').toLowerCase();
    const email = (emp.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = name.includes(term) || email.includes(term);
    const matchesService = selectedService === null || emp.service_id === selectedService;
    return matchesSearch && matchesService;
  });

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
          <h2 className="text-3xl font-bold text-gray-800">Annuaire des employés</h2>
          <p className="text-gray-600 mt-1">{employees.length} employés</p>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddForm((s) => !s)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showAddForm ? 'Annuler' : 'Ajouter employé'}
            </button>
          </div>
        )}
      </div>

      {showAddForm && isAdmin && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter un employé</h3>

          {services.length === 0 && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium mb-2">⚠️ Aucun service disponible</p>
              <p className="text-amber-700 text-sm mb-3">Vous devez d'abord créer au moins un service avant d'ajouter un employé.</p>
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="flex items-center space-x-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Créer un service</span>
              </button>
            </div>
          )}

          {showAddService && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-blue-900 font-medium mb-3">Créer un nouveau service</h4>
              <form onSubmit={handleAddService} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Nom du service</label>
                  <input
                    name="nom"
                    type="text"
                    value={newServiceForm.nom}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, nom: e.target.value })}
                    placeholder="Ex: Développement, RH, Finance..."
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Description (optionnel)</label>
                  <input
                    name="description"
                    type="text"
                    value={newServiceForm.description}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                    placeholder="Description du service..."
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={addingService}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium"
                  >
                    {addingService ? 'Création...' : 'Créer le service'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input name="name" value={addForm.name} onChange={handleAddChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input name="email" type="email" value={addForm.email} onChange={handleAddChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input name="password" type="password" value={addForm.password} onChange={handleAddChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer mot de passe</label>
                <input name="password_confirmation" type="password" value={addForm.password_confirmation} onChange={handleAddChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service <span className="text-red-500">*</span></label>
                {services.length === 0 ? (
                  <div className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
                    Créez un service d'abord
                  </div>
                ) : (
                  <select
                    name="service_id"
                    value={addForm.service_id || ''}
                    onChange={handleAddChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Sélectionner un service --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.nom}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={adding || services.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {adding ? 'Ajout...' : 'Créer employé'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedService || ''}
            onChange={(e) =>
              setSelectedService(e.target.value ? Number(e.target.value) : null)
            }
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les services</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold text-lg">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {employee.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">{employee.role}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>
              {employee.service && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{employee.service.nom}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucun employé trouvé</p>
        </div>
      )}
    </div>
  );
}
