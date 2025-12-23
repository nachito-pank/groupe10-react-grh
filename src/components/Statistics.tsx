import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export default function Statistics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Statistiques RH</h2>
        <p className="text-gray-600 mt-1">Vue d'ensemble des métriques RH</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employés</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">147</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% ce mois
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de présence</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">94%</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2% ce mois
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Congés en cours</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">23</p>
              <p className="text-xs text-gray-500 mt-2">En ce moment</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">4.2</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.3 ce trimestre
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Répartition par service
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Développement', count: 45, color: 'bg-blue-500' },
              { name: 'Marketing', count: 32, color: 'bg-green-500' },
              { name: 'RH', count: 18, color: 'bg-purple-500' },
              { name: 'Finance', count: 28, color: 'bg-yellow-500' },
              { name: 'Ventes', count: 24, color: 'bg-red-500' },
            ].map((service) => (
              <div key={service.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {service.name}
                  </span>
                  <span className="text-sm text-gray-600">{service.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${service.color} h-2 rounded-full`}
                    style={{ width: `${(service.count / 147) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tendances mensuelles
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Nouvelles recrues</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
              </div>
              <div className="text-green-600 flex items-center text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +33%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Formations complétées</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">24</p>
              </div>
              <div className="text-green-600 flex items-center text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +20%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Évaluations effectuées</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">15</p>
              </div>
              <div className="text-green-600 flex items-center text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +50%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Indicateurs clés de performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Taux de rétention</p>
            <p className="text-4xl font-bold text-blue-900">92%</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">Satisfaction employés</p>
            <p className="text-4xl font-bold text-green-900">4.5/5</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-sm text-purple-800 font-medium mb-2">Temps moyen recrutement</p>
            <p className="text-4xl font-bold text-purple-900">21j</p>
          </div>
        </div>
      </div>
    </div>
  );
}
