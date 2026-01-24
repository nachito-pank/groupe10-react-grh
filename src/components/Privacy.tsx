import React from 'react';
import Logo from './Logo';

export default function Privacy() {
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
            <div className="max-w-3xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-white mb-8">Politique de Confidentialité</h1>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Collecte de Données</h2>
                        <p>
                            Nous collectons les données personnelles que vous nous fournissez volontairement,
                            notamment votre nom, email, et informations d'entreprise. Nous pouvons également
                            collecter des données d'utilisation pour améliorer notre service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Utilisation des Données</h2>
                        <p>
                            Vos données sont utilisées pour :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Fournir et maintenir notre service</li>
                            <li>Vous envoyer des mises à jour et notifications</li>
                            <li>Répondre à vos demandes</li>
                            <li>Améliorer notre plateforme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Protection des Données</h2>
                        <p>
                            Nous utilisons le chiffrement SSL/TLS pour protéger vos données en transit.
                            Vos données sont stockées de manière sécurisée sur nos serveurs avec accès restreint.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Partage de Données</h2>
                        <p>
                            Nous ne partageons pas vos données personnelles avec des tiers, sauf :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Avec votre consentement explicite</li>
                            <li>Pour respecter la loi</li>
                            <li>Avec nos prestataires de service (sous confidentialité)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Vos Droits</h2>
                        <p>
                            Conformément au RGPD, vous avez le droit de :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Accéder à vos données personnelles</li>
                            <li>Rectifier vos données inexactes</li>
                            <li>Demander la suppression de vos données</li>
                            <li>Vous opposer au traitement</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
                        <p>
                            Nous utilisons des cookies pour améliorer votre expérience.
                            Vous pouvez gérer les cookies dans les paramètres de votre navigateur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Conservation des Données</h2>
                        <p>
                            Vos données sont conservées aussi longtemps que nécessaire pour fournir notre service.
                            Vous pouvez demander la suppression à tout moment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                        <p>
                            Pour toute question sur notre politique de confidentialité, veuillez nous contacter à :
                            <a href="mailto:privacy@portail-rh.com" className="text-cyan-400 hover:text-cyan-300"> privacy@portail-rh.com</a>
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center text-slate-500">
                    <p>Dernière mise à jour : 24 janvier 2025</p>
                </div>
            </div>
        </div>
    );
}
