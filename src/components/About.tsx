import React from 'react';
import { Target, Users, Zap } from 'lucide-react';
import Logo from './Logo';

export default function About() {
    const values = [
        {
            icon: <Target size={32} />,
            title: 'Notre Mission',
            description: 'Simplifier la gestion RH des entreprises avec une plateforme intuitive et moderne'
        },
        {
            icon: <Users size={32} />,
            title: 'Notre Équipe',
            description: 'Des experts en RH et technologie passionnés par l\'innovation'
        },
        {
            icon: <Zap size={32} />,
            title: 'Notre Vision',
            description: 'Révolutionner la façon dont les entreprises gèrent leurs ressources humaines'
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
                        À Propos de Nous
                    </h1>
                    <p className="text-xl text-slate-400">
                        Découvrez l\'histoire derrière le Portail RH
                    </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-16">
                    <h2 className="text-2xl font-bold text-white mb-4">Notre Histoire</h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        Fondé en 2024, le Portail RH est né de la vision de simplifier la gestion des ressources humaines.
                        Notre équipe a reconnu les défis auxquels font face les entreprises modernes dans la gestion de leurs talents
                        et a décidé de créer une solution innovante et accessible.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        Aujourd\'hui, nous servons des centaines d\'entreprises de toutes tailles, du startups aux grandes organisations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center hover:border-cyan-500/50 transition"
                        >
                            <div className="text-cyan-400 mb-4 flex justify-center">{value.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {value.title}
                            </h3>
                            <p className="text-slate-400">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Nos Chiffres</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { number: '500+', label: 'Entreprises' },
                            { number: '50k+', label: 'Utilisateurs' },
                            { number: '99.9%', label: 'Disponibilité' },
                            { number: '24/7', label: 'Support' }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-3xl font-bold text-cyan-400">{stat.number}</p>
                                <p className="text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
