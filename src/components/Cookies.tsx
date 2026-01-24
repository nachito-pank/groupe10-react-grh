import React from 'react';
import Logo from './Logo';

export default function Cookies() {
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
                <h1 className="text-4xl font-bold text-white mb-8">Politique sur les Cookies</h1>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Qu'est-ce qu'un Cookie?</h2>
                        <p>
                            Un cookie est un petit fichier texte stocké sur votre appareil.
                            Les cookies nous aident à personnaliser votre expérience et à analyser l'utilisation de notre site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Types de Cookies Utilisés</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Cookies Essentiels</h3>
                                <p>Nécessaires au fonctionnement du site (authentification, sécurité)</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Cookies Fonctionnels</h3>
                                <p>Mémorisent vos préférences (langue, thème)</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Cookies Analytiques</h3>
                                <p>Nous aident à comprendre comment vous utilisez notre site</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Cookies Publicitaires</h3>
                                <p>Utilisés pour afficher des annonces pertinentes</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Cookies de Tiers</h2>
                        <p>
                            Nous utilisons des services tiers (Google Analytics, etc.) qui peuvent placer des cookies.
                            Ces services respectent les mêmes standards de confidentialité que nous.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Consentement aux Cookies</h2>
                        <p>
                            Avant de placer des cookies non-essentiels, nous demandons votre consentement.
                            Vous pouvez modifier vos préférences à tout moment dans les paramètres de confidentialité.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Gestion des Cookies</h2>
                        <p>
                            Vous pouvez contrôler les cookies via :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Les paramètres de votre navigateur</li>
                            <li>Les paramètres de confidentialité du site</li>
                            <li>Les outils de gestion de consentement</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Durée de Stockage</h2>
                        <p>
                            Les cookies essentiels sont conservés pendant la durée de votre session.
                            Les autres cookies peuvent être conservés jusqu'à 2 ans selon les paramètres.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Impact sur la Confidentialité</h2>
                        <p>
                            Les cookies ne contiennent pas vos données personnelles sensibles.
                            Ils sont liés à votre appareil et à votre navigateur, non à votre identité réelle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                        <p>
                            Pour toute question sur notre politique de cookies, veuillez nous contacter à :
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
