import React from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';
import Logo from './Logo';

export default function Security() {
    const securityFeatures = [
        {
            icon: <Lock size={32} />,
            title: 'Chiffrement End-to-End',
            description: 'Tous les données sensibles sont chiffrées avec le standard AES-256'
        },
        {
            icon: <Shield size={32} />,
            title: 'Protection des Données',
            description: 'Conforme aux normes RGPD et CCPA pour la protection des données personnelles'
        },
        {
            icon: <Eye size={32} />,
            title: 'Authentification Multi-Facteurs',
            description: 'Sécurité renforcée avec 2FA et biométrie'
        },
        {
            icon: <Server size={32} />,
            title: 'Infrastructure Sécurisée',
            description: 'Serveurs hébergés dans des datacenters certifiés ISO 27001'
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
                        Sécurité et Confidentialité
                    </h1>
                    <p className="text-xl text-slate-400">
                        Votre sécurité est notre priorité absolue
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {securityFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-cyan-500/50 transition"
                        >
                            <div className="text-cyan-400 mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Certifications</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['ISO 27001', 'RGPD', 'CCPA', 'SOC 2 Type II'].map((cert, idx) => (
                            <div key={idx} className="text-center p-4 bg-slate-700/50 rounded-lg">
                                <Shield size={24} className="text-cyan-400 mx-auto mb-2" />
                                <p className="text-white font-semibold">{cert}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
