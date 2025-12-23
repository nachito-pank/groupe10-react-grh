import { useEffect, useState } from 'react';
import { Employee, Service } from '../types';
import { employeeApi, serviceApi } from '../services/api';
import { Users, Search, Mail, Building2 } from 'lucide-react';

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService =
      selectedService === null || emp.service_id === selectedService;
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
      </div>

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
