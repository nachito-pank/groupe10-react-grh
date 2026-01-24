import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function Features() {
    const features = [
        {
            title: 'Gestion des Employés',
            description: 'Gérez l\'ensemble de votre personnel avec un système centralisé et intuitif',
            icon: '👥'
        },
        {
            title: 'Présences et Absences',
            description: 'Suivi automatisé des présences et gestion des congés en temps réel',
            icon: '📋'
        },
        {
            title: 'Évaluations de Performance',
            description: 'Système complet d\'évaluation et de suivi des performances',
            icon: '⭐'
        },
        {
            title: 'Gestion des Formations',
            description: 'Planifiez et suivez les formations de vos collaborateurs',
            icon: '🎓'
        },
        {
            title: 'Gestion des Services',
            description: 'Organisez et gérez les différents services de votre entreprise',
            icon: '🏢'
        },
        {
            title: 'Contrôle par Gestes',
            description: 'Interface innovante avec reconnaissance des gestes par caméra',
            icon: '🖐️'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="border-b border-slate-700 sticky top-0 z-50 bg-slate-950/80 backdrop-blur">
                <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <Logo size="sm" showText={false} variant="light" />
                        <span className="text-white font-semibold">Portail RH</span>
                    </div>
                    <a href="#landing" className="text-cyan-400 hover:text-cyan-300 transition">Retour</a>
                </nav>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Fonctionnalités Complètes
                    </h1>
                    <p className="text-xl text-slate-400">
                        Tout ce dont vous avez besoin pour gérer vos ressources humaines efficacement
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-cyan-500/50 transition group"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400">
                                {feature.description}
                            </p>
                            <div className="mt-4 flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                                <CheckCircle2 size={20} className="mr-2" />
                                <span>Disponible</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
