import React from 'react';
import Logo from './Logo';

export default function Terms() {
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
                <h1 className="text-4xl font-bold text-white mb-8">Conditions d'Utilisation</h1>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptation des Conditions</h2>
                        <p>
                            En utilisant le Portail RH, vous acceptez de respecter ces conditions d'utilisation.
                            Si vous n'acceptez pas ces conditions, vous ne pouvez pas utiliser notre service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Utilisation du Service</h2>
                        <p>
                            Vous vous engagez à utiliser le Portail RH de manière légale et responsable.
                            Vous ne devez pas utiliser notre service pour violer des lois ou droits d'autrui.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Comptes Utilisateur</h2>
                        <p>
                            Vous êtes responsable de la confidentialité de vos identifiants de connexion.
                            Vous acceptez toute activité effectuée sur votre compte.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Propriété Intellectuelle</h2>
                        <p>
                            Tout contenu fourni par le Portail RH est protégé par les droits d'auteur.
                            Vous ne pouvez pas reproduire ou distribuer ce contenu sans permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation de Responsabilité</h2>
                        <p>
                            Le Portail RH n'est pas responsable des dommages indirects ou consécutifs
                            résultant de l'utilisation de notre service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Modification des Conditions</h2>
                        <p>
                            Nous nous réservons le droit de modifier ces conditions à tout moment.
                            Les modifications entrent en vigueur immédiatement après publication.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Droit Applicable</h2>
                        <p>
                            Ces conditions sont régies par la loi française.
                            Tout différend sera soumis aux tribunaux compétents de Paris.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                        <p>
                            Pour toute question concernant ces conditions, veuillez nous contacter à :
                            <a href="mailto:legal@portail-rh.com" className="text-cyan-400 hover:text-cyan-300"> legal@portail-rh.com</a>
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
