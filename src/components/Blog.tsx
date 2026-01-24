import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Logo from './Logo';

export default function Blog() {
    const posts = [
        {
            id: 1,
            title: '5 Tendances RH pour 2025',
            excerpt: 'Découvrez les principales tendances qui vont transformer le secteur des ressources humaines cette année.',
            author: 'Marie Dupont',
            date: '15 Jan 2025',
            category: 'Tendances'
        },
        {
            id: 2,
            title: 'Optimiser la Gestion des Congés',
            excerpt: 'Comment simplifier et automatiser le processus de gestion des congés dans votre entreprise.',
            author: 'Jean Martin',
            date: '12 Jan 2025',
            category: 'Guide'
        },
        {
            id: 3,
            title: 'L\'Importance de l\'Engagement des Employés',
            excerpt: 'Pourquoi l\'engagement des collaborateurs est crucial pour la productivité et la rétention des talents.',
            author: 'Sophie Bernard',
            date: '10 Jan 2025',
            category: 'Conseils'
        },
        {
            id: 4,
            title: 'Numérisation des Processus RH',
            excerpt: 'Les avantages de transformer vos processus RH avec une plateforme numérique intégrée.',
            author: 'Thomas Leclerc',
            date: '8 Jan 2025',
            category: 'Technologie'
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
                        Notre Blog
                    </h1>
                    <p className="text-xl text-slate-400">
                        Actualités et conseils sur la gestion des ressources humaines
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-500/50 transition group cursor-pointer"
                        >
                            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 h-32"></div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {post.date}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500 flex items-center gap-1">
                                        <User size={14} />
                                        {post.author}
                                    </span>
                                    <ArrowRight size={20} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
