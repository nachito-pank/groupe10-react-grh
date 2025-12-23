# Système de Gestion des Ressources Humaines

Interface complète pour la gestion des ressources humaines développée avec React, TypeScript et Tailwind CSS.

## Fonctionnalités

### Pour tous les utilisateurs
- **Tableau de bord** : Vue d'ensemble des statistiques et activités RH
- **Annuaire des employés** : Recherche et consultation des profils des employés
- **Gestion des congés** : Demander des congés et consulter l'historique
- **Suivi des présences** : Historique de pointage et présences
- **Évaluations de performance** : Consultation des évaluations
- **Gestion des formations** : Parcours de formation et inscription
- **Historique professionnel** : Suivi de carrière

### Pour les administrateurs
- **Statistiques RH** : Métriques et indicateurs clés de performance
- **Approbation des congés** : Valider ou rejeter les demandes
- **Gestion des services** : Créer et organiser les services
- **Vue globale** : Accès à toutes les données RH

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

### Production

```bash
npm run build
npm run preview
```

## API

L'application communique avec l'API Laravel du groupe 10 :

### Endpoints principaux

#### Authentification
- `POST /api/groupe-10/auth/register` - Inscription
- `POST /api/groupe-10/auth/login` - Connexion
- `POST /api/groupe-10/auth/logout` - Déconnexion

#### Employés
- `GET /api/groupe-10/employes` - Liste des employés
- `GET /api/groupe-10/mon-profil` - Profil de l'utilisateur connecté
- `POST /api/groupe-10/admin/employes` - Créer un employé (Admin)

#### Services
- `GET /api/groupe-10/services` - Liste des services
- `POST /api/groupe-10/admin/services` - Créer un service (Admin)

#### Congés
- `GET /api/groupe-10/conges` - Liste des congés
- `POST /api/groupe-10/conges` - Demander un congé
- `PUT /api/groupe-10/admin/conges/:id/status` - Approuver/Rejeter (Admin)

## Structure du projet

```
src/
├── components/           # Composants React
│   ├── LoginForm.tsx    # Formulaire de connexion
│   ├── Layout.tsx       # Layout principal avec navigation
│   ├── Dashboard.tsx    # Tableau de bord
│   ├── EmployeeDirectory.tsx
│   ├── LeaveManagement.tsx
│   ├── AttendanceTracking.tsx
│   ├── PerformanceReview.tsx
│   ├── TrainingManagement.tsx
│   └── Statistics.tsx
├── contexts/            # Contextes React
│   └── AuthContext.tsx  # Gestion de l'authentification
├── services/            # Services API
│   └── api.ts          # Appels API
├── types/              # Types TypeScript
│   └── index.ts        # Définitions de types
├── App.tsx             # Composant principal
└── main.tsx            # Point d'entrée

```

## Technologies utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool
- **Lucide React** - Icônes

## Comptes de démonstration

- **Admin**: admin@example.com / password123
- **Employé**: employe@example.com / password123

## Développé par

Groupe 10 - Projet React de Gestion RH
