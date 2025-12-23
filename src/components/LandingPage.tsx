// import { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Award,
  GraduationCap,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'register') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // const [activeTab, setActiveTab] = useState(0);
  

  const features = [
    {
      icon: Users,
      title: 'Annuaire des employés',
      description: 'Gérez facilement tous les profils et informations de vos employés',
    },
    {
      icon: Calendar,
      title: 'Gestion des congés',
      description: 'Demandes et approbations de congés en ligne',
    },
    {
      icon: Clock,
      title: 'Suivi des présences',
      description: 'Pointage et historique de présence en temps réel',
    },
    {
      icon: Award,
      title: 'Évaluations',
      description: 'Évaluations de performance et feedback structuré',
    },
    {
      icon: GraduationCap,
      title: 'Formations',
      description: 'Gestion des formations et développement des compétences',
    },
    {
      icon: BarChart3,
      title: 'Statistiques',
      description: 'Tableaux de bord et indicateurs RH avancés',
    },
  ];

  const benefits = [
    'Automatisation des processus RH',
    'Gain de temps et productivité',
    'Meilleure communication interne',
    'Suivi centralisé des données',
    'Prise de décision basée sur les données',
    'Conformité et audit',
  ];

  return (
  <>
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Portail RH</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                Connexion
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Système complet de gestion RH
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Simplifiez la gestion de vos ressources humaines avec notre plateforme tout-en-un.
                De la gestion des employés aux formations, en passant par les évaluations de
                performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
                  >
                  <span>Commencer maintenant</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-xl font-semibold hover:border-gray-400 transition"
                  >
                  Se connecter
                </button>
              </div>
            </div>
            <div className="lg:block hidden">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Équipe travaillant ensemble"
                className="rounded-2xl shadow-2xl object-cover w-full h-500"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '1000+', label: 'Entreprises' },
              { number: '50K+', label: 'Utilisateurs' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités complètes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce dont vous avez besoin pour gérer votre RH efficacement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Avantages clés
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Analyse et statistiques"
                className="rounded-2xl shadow-lg object-cover w-full h-200"
                />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à transformer votre RH?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Inscrivez-vous maintenant et accédez à tous les outils dont vous avez besoin
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
            >
            <span>Commencer l'essai gratuit</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Portail RH</h3>
              <p className="text-sm">
                Plateforme complète de gestion des ressources humaines
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Portail RH. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  </>
  );
}
