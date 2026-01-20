# 🎥 Guide de Démarrage Rapide - Contrôle par Gestes

## ✅ Installation

Les dépendances ont déjà été installées:
```bash
npm install three @mediapipe/tasks-vision @types/three
```

## 🚀 Utilisation Rapide

### 1. **Configuration minimale** (1 minute)

```tsx
import GestureScrollController from './components/GestureScrollController';

function App() {
  return (
    <div>
      <GestureScrollController
        showDemo={true}        // Affiche la démo de bienvenue
        showVisualizer={true}  // Affiche la visualisation 3D
        showDebug={false}      // Débogage
      />
      
      {/* Votre contenu */}
      <div className="h-[200vh]">
        {/* Contenu scrollable */}
      </div>
    </div>
  );
}
```

### 2. **Utilisation avancée avec le hook** (2 minutes)

```tsx
import { useHandGestureScroll } from './hooks/useHandGestureScroll';

function MyComponent() {
  const {
    isInitialized,
    detectionResult,
    startDetection,
    stopDetection,
    videoRef,
    error,
  } = useHandGestureScroll({
    enabled: true,
    maxVelocity: 5,
    onDetectionChange: (result) => {
      console.log('Geste détecté:', result.gestureAction);
    },
  });

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      
      <button onClick={startDetection}>
        Démarrer détection
      </button>
      
      {detectionResult && (
        <p>Mains détectées: {detectionResult.handsDetected}</p>
      )}
    </div>
  );
}
```

### 3. **Intégration sur la LandingPage** ✓

C'est déjà fait! Cliquez sur le bouton "🎥 Gestes" dans la navigation.

## 🎮 Gestes Disponibles

| Geste | Action | Vitesse |
|-------|--------|---------|
| 👋 Une paume ouverte | Scroll bas | Fluide & Progressive |
| 🙌 Deux paumes ouvertes | Scroll haut | Fluide & Progressive |
| ✋ Aucune main | Arrêt | Doux (avec friction) |

## 🔧 Configuration

### Vitesse de défilement

```tsx
// Lent (3 pixels/frame)
<GestureScrollController maxVelocity={3} />

// Normal (5 pixels/frame) - défaut
<GestureScrollController maxVelocity={5} />

// Rapide (8 pixels/frame)
<GestureScrollController maxVelocity={8} />
```

### Démo automatique

```tsx
// Affiche la démo 8 secondes
<GestureScrollController showDemo={true} />

// Sans démo
<GestureScrollController showDemo={false} />
```

### Visualisation 3D

```tsx
// Affiche le visualiseur Three.js
<GestureScrollController showVisualizer={true} />

// Sans visualisation
<GestureScrollController showVisualizer={false} />
```

## 🐛 Débogage

### Mode débogage console

```tsx
<GestureScrollController showDebug={true} />
```

### Vérifier la détection

```tsx
const { detectionResult } = useHandGestureScroll({
  onDetectionChange: (result) => {
    console.log('Détection:', result);
    console.log('- Mains:', result.handsDetected);
    console.log('- Action:', result.gestureAction);
    console.log('- Paume gauche ouverte:', result.leftPalmOpen);
    console.log('- Paume droite ouverte:', result.rightPalmOpen);
  },
});
```

## 📱 Tests sur différents appareils

### Desktop (recommandé)
- ✅ Caméra USB ou webcam
- ✅ Éclairage normal
- ✅ Distance 50-100cm

### Laptop
- ✅ Webcam intégrée
- ⚠️ Éclairer correctement le visage aussi
- ✅ Distance 30-60cm

### Mobile (iOS/Android)
- ⚠️ Nécessite HTTPS (sauf localhost)
- ⚠️ Moins stable que desktop
- ⚠️ Caméra arrière peut être mieux

## ⚠️ Résolution des problèmes

### "Permission denied"
```
→ Accepter l'accès à la caméra quand demandé
→ Vérifier les paramètres de permission du navigateur
```

### "Détection instable"
```
→ Améliorer l'éclairage ambiant
→ Se positionner correctement (50-100cm)
→ Éviter contre-jour ou ombres fortes
```

### "Scroll ne fonctionne pas"
```
→ Vérifier que la page a du contenu scrollable
→ Vérifier la console pour les erreurs
→ Augmenter showDebug={true} pour voir les logs
```

### "Performance lente"
```
→ Diminuer showVisualizer={false}
→ Fermer d'autres onglets
→ Réduire showDebug={false}
```

## 📊 Exemple complet avec tous les paramètres

```tsx
import GestureScrollController from './components/GestureScrollController';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <GestureScrollController
        showDemo={true}        // Démo de bienvenue
        showVisualizer={true}  // Visualisation 3D
        showDebug={false}      // Logs de débogage
      />

      {/* Contenu scrollable - IMPORTANT! */}
      <div className="h-[300vh] p-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Contenu Scrollable
        </h1>
        
        <div className="space-y-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <section
              key={i}
              className="bg-slate-800 rounded-lg p-6 text-white"
            >
              <h2 className="text-2xl font-bold mb-4">Section {i + 1}</h2>
              <p className="text-gray-300">
                Contenu de la section {i + 1}. Scroll avec votre main!
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Cas d'usage populaires

### 1. Demo sur Landing Page
```tsx
// Dans LandingPage.tsx - déjà configuré
<button onClick={() => setShowGestureController(true)}>
  🎥 Activer les gestes
</button>
```

### 2. Désactiver lors de l'édition
```tsx
const handleInputFocus = () => stopDetection();
const handleInputBlur = () => startDetection();
```

### 3. Vitesse adaptative au device
```tsx
const isMobile = window.innerWidth < 768;
const maxVelocity = isMobile ? 3 : 5;

<GestureScrollController maxVelocity={maxVelocity} />
```

### 4. Feedback utilisateur
```tsx
const { detectionResult } = useHandGestureScroll();

{detectionResult?.gestureAction === 'scroll-down' && (
  <div className="fixed bottom-4 right-4 text-green-400">
    ✓ Scroll vers le bas
  </div>
)}
```

## 📚 Ressources

- [Documentation complète](./GESTURE_CONTROL_DOCUMENTATION.md)
- [Service HandDetection](./src/services/handDetection.ts)
- [Service ScrollController](./src/services/scrollController.ts)
- [Hook useHandGestureScroll](./src/hooks/useHandGestureScroll.ts)
- [Composant Principal](./src/components/GestureScrollController.tsx)

## ✨ Caractéristiques

- ✅ Détection en temps réel via MediaPipe
- ✅ Scroll fluide sans à-coups
- ✅ Support de 1-2 mains
- ✅ Visualisation 3D en Three.js
- ✅ Demo interactive automatique
- ✅ Responsive et performant
- ✅ Gestion des erreurs robuste
- ✅ TypeScript full type-safe

## 🎓 Prochaines étapes

1. ✓ Installation des dépendances
2. ✓ Intégration sur LandingPage
3. → Tester avec votre caméra
4. → Personnaliser les couleurs/vitesses si besoin
5. → Ajouter à d'autres pages

## 💡 Tips & Tricks

- **Éclairage**: Bonne lumière = meilleure détection
- **Distance**: Optimal à 50-100cm de la caméra
- **Gestes clairs**: Mains ouvertes et visibles
- **Démo**: Montre tout au premier chargement

Amusez-vous bien! 🎉
