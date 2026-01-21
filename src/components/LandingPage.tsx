import { useEffect } from 'react';
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
import AOS from 'aos';
import 'aos/dist/aos.css';
import Logo from './Logo';
import GestureScrollPage from './GestureScrollPage';


interface LandingPageProps {
  onNavigate: (view: 'login' | 'register') => void;
  enableGestureScroll?: boolean;
}

export default function LandingPage({ onNavigate, enableGestureScroll = true }: LandingPageProps) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 100,
    });
  }, []);


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

  const content = (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Logo size="md" showText={true} variant="light" />
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg transition"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-up">
                <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight text-3d-shine">
                  Système complet de gestion RH
                </h1>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Simplifiez la gestion de vos ressources humaines avec notre plateforme tout-en-un.
                  De la gestion des employés aux formations, en passant par les évaluations de
                  performance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => onNavigate('register')}
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition shadow-lg"
                  >
                    <span>Commencer maintenant</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-8 py-4 border-2 border-slate-600 text-slate-100 rounded-xl font-semibold hover:border-cyan-500 hover:text-cyan-400 transition"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
              <div className="lg:block hidden relative floating" data-aos="fade-left">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl blur-2xl glow-pulse"></div>
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Équipe travaillant ensemble"
                  className="rounded-2xl shadow-2xl object-cover w-full h-500 relative border border-cyan-500/30 glow-pulse"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-700">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '1000+', label: 'Entreprises' },
                { number: '50K+', label: 'Utilisateurs' },
                { number: '99.9%', label: 'Uptime' },
                { number: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div key={index} data-aos="zoom-in" data-aos-delay={`${index * 100}`} className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 feature-card floating-slow" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                Fonctionnalités complètes
              </h2>
              <p className="text-xl text-slate-400">
                Tout ce dont vous avez besoin pour gérer votre RH efficacement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={`${index * 100}`}
                    className="feature-card floating group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 hover:border-cyan-500 transition"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 border border-cyan-500/30 group-hover:glow-pulse">
                        <Icon className="w-7 h-7 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-100 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-700">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
                  Avantages clés
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <span className="text-lg text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative floating" data-aos="fade-left">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl blur-2xl glow-pulse\"></div>
                <img
                  src="https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Analyse et statistiques"
                  className="rounded-2xl shadow-2xl object-cover w-full h-96 relative border border-cyan-500/30 glow-pulse"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center relative floating-slow" data-aos="zoom-in">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur-3xl glow-pulse\"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-12 border border-cyan-500/30 glow-pulse">
              <h2 className="text-4xl font-bold text-white mb-6">
                Prêt à transformer votre RH?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Inscrivez-vous maintenant et accédez à tous les outils dont vous avez besoin
              </p>
              <button
                onClick={() => onNavigate('register')}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition shadow-lg"
              >
                <span>Commencer l'essai gratuit</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-700 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Logo size="sm" showText={false} variant="light" />
                  <h3 className="text-white font-semibold">Portail RH</h3>
                </div>
                <p className="text-sm">
                  Plateforme complète de gestion des ressources humaines
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Produit</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Fonctionnalités
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Tarifs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Sécurité
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Entreprise</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      À propos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Légal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Confidentialité
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan-400 transition">
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-8 text-center text-sm">
              <p>© 2025 Groupe 10 GRH. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );

  // Si les gestes sont activés, envelopper le contenu
  if (enableGestureScroll) {
    return (
      <GestureScrollPage
        showDemo={true}
        downSpeed={12}
        upSpeed={12}
      >
        {content}
      </GestureScrollPage>
    );
  }

  return content;
}