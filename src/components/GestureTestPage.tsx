import React, { useRef, useState } from "react";
import GestureScrollPage from "./GestureScrollPage";
import type { HandDetectionResult } from "../services/handDetection";

const GestureTestPage: React.FC = () => {
    const [gestureHistory, setGestureHistory] = useState<HandDetectionResult[]>(
        []
    );
    const [scrollInfo, setScrollInfo] = useState({
        position: 0,
        velocity: 0,
    });

    const handleGestureChange = (gesture: HandDetectionResult) => {
        setGestureHistory((prev) => [gesture, ...prev.slice(0, 19)]);
    };

    const handleScroll = () => {
        setScrollInfo({
            position: window.scrollY,
            velocity: window.scrollY - scrollInfo.position,
        });
    };

    React.useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrollInfo.position]);

    const testSections = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <GestureScrollPage showDemo={true} downSpeed={3} upSpeed={3}>
            <div className="relative z-20">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-cyan-500/30 z-30 pt-20 pb-4 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
                            🎥 Test de Reconnaissance des Gestes
                        </h1>
                        <p className="text-slate-300">
                            Utilisez vos mains pour contrôler le scroll de la page
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-40 pb-20 px-4">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Instructions */}
                        <section className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-8 border border-cyan-500/30">
                            <h2 className="text-2xl font-bold text-white mb-6">📖 Instructions</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        gesture: "Une paume",
                                        icon: "🤚",
                                        action: "Scroll vers le bas",
                                        color: "border-blue-500",
                                    },
                                    {
                                        gesture: "Deux paumes",
                                        icon: "👐",
                                        action: "Scroll vers le haut",
                                        color: "border-purple-500",
                                    },
                                    {
                                        gesture: "Pas de main",
                                        icon: "👁️",
                                        action: "Arrête le scroll",
                                        color: "border-green-500",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`bg-black/30 border-2 ${item.color} rounded-lg p-6 text-center`}
                                    >
                                        <div className="text-5xl mb-3">{item.icon}</div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {item.gesture}
                                        </h3>
                                        <p className="text-slate-300">{item.action}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Real-time Gesture Status */}
                        <section className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-8 border border-green-500/30">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                📊 État en temps réel
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Gesture Detection */}
                                <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/30">
                                    <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase">
                                        Geste Détecté
                                    </h3>
                                    <div className="text-3xl font-bold text-white">
                                        {gestureHistory.length > 0
                                            ? gestureHistory[0].gesture === "one-palm"
                                                ? "🤚"
                                                : gestureHistory[0].gesture === "two-palms"
                                                    ? "👐"
                                                    : "👁️"
                                            : "❓"}
                                    </div>
                                    <p className="text-slate-400 text-sm mt-2">
                                        {gestureHistory.length > 0
                                            ? gestureHistory[0].gesture.replace(/-/g, " ").toUpperCase()
                                            : "EN ATTENTE"}
                                    </p>
                                </div>

                                {/* Hands Detected */}
                                <div className="bg-black/30 rounded-lg p-6 border border-purple-500/30">
                                    <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase">
                                        Mains Détectées
                                    </h3>
                                    <div className="text-3xl font-bold text-white">
                                        {gestureHistory.length > 0 ? gestureHistory[0].handsDetected : 0}
                                    </div>
                                    <p className="text-slate-400 text-sm mt-2">
                                        {gestureHistory.length > 0
                                            ? gestureHistory[0].handsDetected === 0
                                                ? "Aucune main"
                                                : gestureHistory[0].handsDetected === 1
                                                    ? "Une main"
                                                    : "Deux mains"
                                            : "---"}
                                    </p>
                                </div>

                                {/* Confidence */}
                                <div className="bg-black/30 rounded-lg p-6 border border-green-500/30">
                                    <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase">
                                        Confiance
                                    </h3>
                                    <div className="text-3xl font-bold text-white">
                                        {gestureHistory.length > 0
                                            ? (gestureHistory[0].confidence * 100).toFixed(0)
                                            : "0"}
                                        %
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-200"
                                            style={{
                                                width: `${gestureHistory.length > 0
                                                        ? gestureHistory[0].confidence * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Gesture History */}
                        <section className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-8 border border-orange-500/30">
                            <h2 className="text-2xl font-bold text-white mb-6">⏱️ Historique</h2>

                            <div className="bg-black/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {gestureHistory.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8">
                                        En attente de gestes...
                                    </p>
                                ) : (
                                    <div className="space-y-2 font-mono text-sm">
                                        {gestureHistory.map((gesture, index) => (
                                            <div
                                                key={index}
                                                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex justify-between items-center"
                                            >
                                                <div className="text-slate-300">
                                                    <span className="text-orange-400">#{index}</span>{" "}
                                                    <span className="text-cyan-400">
                                                        {gesture.gesture.toUpperCase()}
                                                    </span>
                                                    {" · "}
                                                    <span className="text-purple-400">
                                                        {gesture.handsDetected} main(s)
                                                    </span>
                                                </div>
                                                <div className="text-green-400">
                                                    {(gesture.confidence * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Test Sections */}
                        {testSections.map((num) => (
                            <section
                                key={num}
                                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur rounded-xl p-8 border border-slate-700 min-h-80"
                            >
                                <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                                    Section {num}
                                </h2>
                                <div className="space-y-4 text-slate-300">
                                    <p>
                                        Utilisez les gestes de vos mains pour faire défiler cette
                                        page. Cette section est un point de test pour valider le
                                        fonctionnement du scroll.
                                    </p>
                                    <p>
                                        📍 Assurez-vous que votre caméra est allumée et que vous
                                        êtes bien éclairé pour une meilleure détection des gestes.
                                    </p>
                                    <p>
                                        💡 Le système utilise MediaPipe pour détecter vos mains en
                                        temps réel. La détection fonctionne mieux avec un éclairage
                                        frontal et un contraste clair avec le fond.
                                    </p>

                                    <div className="mt-6 p-4 bg-black/30 rounded-lg border border-slate-600">
                                        <h3 className="font-semibold text-cyan-300 mb-2">
                                            💻 Conseils de performance
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-sm">
                                            <li>Gardez votre caméra stable</li>
                                            <li>Assurez-vous d'avoir une bonne résolution de caméra</li>
                                            <li>
                                                Testez dans un environnement bien éclairé pour une
                                                meilleure détection
                                            </li>
                                            <li>Fermez les onglets inutiles pour améliorer les performances</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        ))}

                        {/* Scroll Position Debug */}
                        <section className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-8 border border-red-500/30">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                📈 Informations de Scroll
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-black/30 rounded-lg p-6 border border-red-500/30">
                                    <h3 className="text-sm font-semibold text-red-400 mb-3 uppercase">
                                        Position Y
                                    </h3>
                                    <div className="text-2xl font-bold text-white font-mono">
                                        {Math.round(scrollInfo.position)}px
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded-lg p-6 border border-pink-500/30">
                                    <h3 className="text-sm font-semibold text-pink-400 mb-3 uppercase">
                                        Vélocité
                                    </h3>
                                    <div className="text-2xl font-bold text-white font-mono">
                                        {Math.round(scrollInfo.velocity)}px/frame
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <section className="text-center py-12 border-t border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                ✅ Tests Terminés?
                            </h2>
                            <p className="text-slate-400 mb-6">
                                Si tout fonctionne correctement, vous devriez pouvoir faire
                                défiler cette page avec vos gestes.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
                                >
                                    ⬆️ Retour au début
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </GestureScrollPage>
    );
};

export default GestureTestPage;
