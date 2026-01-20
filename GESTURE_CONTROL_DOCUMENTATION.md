# 🎥 Système de Contrôle par Gestes - Documentation

## Vue d'ensemble

Le système de contrôle par gestes utilise la détection des mains via **MediaPipe** et **Three.js** pour permettre à l'utilisateur de naviguer sur le site sans contact, uniquement par les mouvements des mains.

## 🏗️ Architecture

### Services

#### 1. `handDetection.ts`
Service de détection des mains utilisant MediaPipe.

**Fonctionnalités:**
- Initialisation de la détection des mains
- Accès à la caméra via WebRTC
- Détection en temps réel de la position des mains
- Classification des gestes (paume ouverte/fermée)
- Identification des deux mains (gauche/droite)

**Exports:**
```typescript
handDetectionService.initialize(videoElement, canvasElement)
handDetectionService.startDetection()
handDetectionService.stopDetection()
handDetectionService.onDetection(callback)
handDetectionService.onError(callback)
```

#### 2. `scrollController.ts`
Contrôle du défilement fluide et progressif de la page.

**Fonctionnalités:**
- Scroll fluide avec accélération/décélération
- Vitesse progressive et contrôlée
- Friction appliquée à l'arrêt
- Pas de saccades ou de sauts

**Exports:**
```typescript
scrollController.startScrolling('down' | 'up')
scrollController.stopScrolling()
scrollController.start()
scrollController.stop()
scrollController.setMaxVelocity(velocity)
```

### Composants

#### 1. `GestureScrollController.tsx`
Composant principal contrôlant l'intégration complète.

**Props:**
```typescript
showDemo?: boolean        // Afficher la démo automatique
showVisualizer?: boolean  // Afficher la visualisation 3D
showDebug?: boolean       // Afficher les logs de débogage
```

**Fonctionnalités:**
- Interface de contrôle avec boutons
- Affichage du statut de détection
- Statistiques en temps réel
- Gestion des erreurs

#### 2. `GestureVisualizerThree.tsx`
Visualisation 3D interactive en Three.js.

**Props:**
```typescript
isActive: boolean              // Détection active
handsDetected: number          // Nombre de mains détectées
gestureAction: string          // Action détectée (scroll-down, scroll-up, stop)
velocity?: number              // Vitesse actuelle du scroll
```

**Caractéristiques visuelles:**
- Système de particules animées
- Flèches directionnelles dynamiques
- Changements de couleur basés sur l'action
- Rotations et transformations fluides

#### 3. `GestureDemo.tsx`
Modal de démonstration automatique pour la page d'accueil.

**Props:**
```typescript
onDismiss?: () => void         // Callback de fermeture
autoHideDuration?: number      // Durée avant fermeture automatique (ms)
```

**Affichage:**
- Explications des gestes
- Instructions claires avec icônes
- Fermeture automatique après 8 secondes
- Fermeture sur clic

### Hooks

#### `useHandGestureScroll`
Hook personnalisé pour intégrer la détection et le scroll.

**Options:**
```typescript
{
  enabled?: boolean              // Activation/désactivation
  showDebug?: boolean           // Mode débogage
  maxVelocity?: number          // Vitesse maximale
  onDetectionChange?: callback  // Callback à chaque détection
}
```

**Retour:**
```typescript
{
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  detectionResult: HandDetectionResult
  startDetection: () => Promise<void>
  stopDetection: () => void
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
}
```

## 🎯 Gestes Reconnus

### 1️⃣ Une paume ouverte
```
Condition: 1 seule main détectée, paume ouverte
Action: Scroll vers le bas
Vitesse: Fluide et progressive
```

### 2️⃣ Deux paumes ouvertes
```
Condition: 2 mains détectées, paumes ouvertes
Action: Scroll vers le haut
Vitesse: Fluide et progressive
```

### ✋ Aucune main
```
Condition: Aucune main détectée
Action: Arrêt immédiat du scroll
Friction: Appliquée pour un arrêt doux
```

## 🚀 Utilisation

### 1. Intégration basique

```tsx
import GestureScrollController from './components/GestureScrollController';

export default function App() {
  return (
    <div>
      <GestureScrollController
        showDemo={true}
        showVisualizer={true}
        showDebug={false}
      />
      {/* Votre contenu... */}
    </div>
  );
}
```

### 2. Utilisation du Hook

```tsx
import { useHandGestureScroll } from './hooks/useHandGestureScroll';

function MyComponent() {
  const {
    isInitialized,
    isLoading,
    error,
    detectionResult,
    startDetection,
    stopDetection,
    videoRef,
  } = useHandGestureScroll({
    enabled: true,
    showDebug: true,
    onDetectionChange: (result) => {
      console.log('Detection:', result);
    },
  });

  return (
    <div>
      <video ref={videoRef} />
      {/* Votre interface... */}
    </div>
  );
}
```

### 3. Configuration LandingPage

La LandingPage inclut un bouton "🎥 Gestes" dans la navigation pour activer/désactiver le contrôle.

```tsx
<button
  onClick={() => setShowGestureController(!showGestureController)}
  className="px-4 py-2 text-sm bg-purple-600/20 text-purple-300..."
>
  🎥 Gestes
</button>
```

## 🔧 Configuration

### Paramètres principaux

**Dans `scrollController.ts`:**
```typescript
maxVelocity = 5              // Vitesse maximale (pixels/frame)
acceleration = 0.15         // Accélération
friction = 0.08            // Friction d'arrêt
```

**Dans `handDetection.ts`:**
```typescript
numHands: 2                 // Nombre maximum de mains
confidence: > 0.5          // Seuil de confiance minimum
```

## 🎨 Personnalisation

### Couleurs et styles

**Visualiseur Three.js:**
```typescript
// Particules
color: 0x00d4ff           // Cyan
opacity: 0.7              // 70% opacité

// Flèches
scrollDown: 0x00d4ff      // Cyan
scrollUp: 0xff6b6b        // Rouge
```

### Vitesses

```typescript
scrollController.setMaxVelocity(3);  // Lent
scrollController.setMaxVelocity(5);  // Normal
scrollController.setMaxVelocity(8);  // Rapide
```

## 🐛 Débogage

Activez le mode débogage pour voir les logs:

```tsx
<GestureScrollController showDebug={true} />
```

Ou avec le hook:
```tsx
const { detectionResult } = useHandGestureScroll({
  showDebug: true,
  onDetectionChange: (result) => console.log(result),
});
```

## 📊 Structure des données de détection

```typescript
interface HandDetectionResult {
  handsDetected: number           // 0, 1, ou 2
  leftHandConfidence: number      // 0-1
  rightHandConfidence: number     // 0-1
  leftPalmOpen: boolean           // Paume gauche ouverte
  rightPalmOpen: boolean          // Paume droite ouverte
  gestureAction: string           // 'scroll-down' | 'scroll-up' | 'stop'
}
```

## ⚙️ Dépendances requises

```json
{
  "@mediapipe/tasks-vision": "latest",
  "three": "latest",
  "react": "^18.0.0",
  "lucide-react": "latest"
}
```

## 🔒 Permissions requises

L'application demande l'accès à:
- **Caméra**: Pour la détection des mains
- **Aucun** stockage de données de la caméra

## 📱 Compatibilité

- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari (iOS 14.5+)
- ⚠️ Nécessite HTTPS (sauf localhost)
- ⚠️ Nécessite une caméra disponible

## 🚨 Gestion des erreurs

Les erreurs courantes et solutions:

### "Camera access denied"
```
Cause: L'utilisateur a refusé l'accès à la caméra
Solution: Vérifier les paramètres de permission du navigateur
```

### "Hand detection not initialized"
```
Cause: Le service n'a pas été correctement initialisé
Solution: Vérifier la connexion Internet (pour charger les modèles)
```

### "Poor gesture detection"
```
Cause: Éclairage insuffisant ou distance suboptimale
Solution: Améliorer l'éclairage, se positionner à 50-100cm de la caméra
```

## 🎓 Cas d'usage avancés

### Désactiver temporairement

```tsx
const { startDetection, stopDetection } = useHandGestureScroll();

// Désactiver lors de l'édition de formulaires
const handleFocusInput = () => stopDetection();
const handleBlurInput = () => startDetection();
```

### Vitesse adaptative

```tsx
const [velocity, setVelocity] = useState(5);

const { startDetection } = useHandGestureScroll({
  maxVelocity: velocity,
});

// Ajuster selon l'appareil
useEffect(() => {
  if (window.innerWidth < 768) {
    setVelocity(3);  // Mobile plus lent
  }
}, []);
```

## 📝 Notes

- La détection est optimisée pour un affichage en 1280x720
- Le modèle MediaPipe se charge depuis le CDN (environ 200MB)
- La performance dépend de la puissance GPU disponible
- La latence typique est de 30-50ms

## 🔄 Mise à jour

Pour mettre à jour les dépendances:

```bash
npm install --save-dev @mediapipe/tasks-vision@latest three@latest
```
