import React from 'react';
import { Check } from 'lucide-react';
import Logo from './Logo';

export default function Pricing() {
    const plans = [
        {
            name: 'Starter',
            price: '29',
            description: 'Pour les petites équipes',
            features: [
                'Jusqu\'à 20 employés',
                'Gestion basique des présences',
                'Suivi des congés',
                'Support par email',
                '1 administrateur'
            ]
        },
        {
            name: 'Professional',
            price: '79',
            description: 'Pour les entreprises en croissance',
            features: [
                'Jusqu\'à 100 employés',
                'Toutes les fonctionnalités Starter',
                'Évaluations de performance',
                'Gestion des formations',
                'Support prioritaire',
                '5 administrateurs'
            ],
            highlighted: true
        },
        {
            name: 'Enterprise',
            price: 'Sur devis',
            description: 'Pour les grandes organisations',
            features: [
                'Employés illimités',
                'Toutes les fonctionnalités',
                'API personnalisée',
                'Intégrations avancées',
                'Support 24/7',
                'Administrateurs illimités'
            ]
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
                        Tarification Simple et Transparente
                    </h1>
                    <p className="text-xl text-slate-400">
                        Choisissez le plan qui convient à votre entreprise
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-lg p-8 flex flex-col ${plan.highlighted
                                ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500'
                                : 'bg-slate-800/50 border border-slate-700'
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="text-cyan-400 text-sm font-semibold mb-4">POPULAIRE</div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">${plan.price}</span>
                                {plan.price !== 'Sur devis' && <span className="text-slate-400">/mois</span>}
                            </div>

                            <button
                                className={`w-full py-2 px-4 rounded-lg font-semibold mb-8 transition ${plan.highlighted
                                    ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                                    : 'bg-slate-700 text-white hover:bg-slate-600'
                                    }`}
                            >
                                Commencer
                            </button>

                            <ul className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-slate-300">
                                        <Check size={20} className="text-cyan-400 mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
