import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Logo from './Logo';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Message envoyé:', formData);
        alert('Merci pour votre message! Nous vous répondrons bientôt.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

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
                        Nous Contacter
                    </h1>
                    <p className="text-xl text-slate-400">
                        Des questions? Contactez notre équipe
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {[
                        { icon: <Mail size={32} />, title: 'Email', value: 'contact@portail-rh.com' },
                        { icon: <Phone size={32} />, title: 'Téléphone', value: '+242 06 783 36 84' },
                        { icon: <MapPin size={32} />, title: 'Adresse', value: 'Plateau des 15 ans' }
                    ].map((contact, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center hover:border-cyan-500/50 transition"
                        >
                            <div className="text-cyan-400 mb-4 flex justify-center">{contact.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {contact.title}
                            </h3>
                            <p className="text-slate-400">
                                {contact.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Envoyez-nous un Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white font-semibold mb-2">Nom</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                                    placeholder="Votre nom"
                                />
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Sujet</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                                placeholder="Sujet du message"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition resize-none"
                                placeholder="Votre message..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2 w-full md:w-auto"
                        >
                            <Send size={20} />
                            Envoyer le Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
