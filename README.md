# KidsWeek – Frontend (Mobile App)

KidsWeek est une application mobile destinée aux parents.
Elle permet d’organiser la semaine familiale (routines, activités, responsabilités)
de manière simple, ludique et collaborative.

Ce repository contient le frontend mobile de l’application, développé avec React Native
et Expo.

---

## 📌 Origine du projet

KidsWeek est initialement né comme projet de fin de formation,
réalisé en collaboration avec deux autres développeurs.

À l’issue de la formation, j’ai repris le projet en main de manière individuelle :

- sécurisation des accès et des secrets
- nettoyage de l’historique Git
- amélioration de l’architecture et de la documentation
- poursuite du développement dans une logique produit

Le projet est aujourd’hui maintenu et développé exclusivement par moi,
dans une démarche professionnelle et orientée bonnes pratiques.

---

## 🚀 Objectif du projet

- Simplifier l’organisation familiale au quotidien
- Rendre les routines plus engageantes pour les enfants
- Centraliser les informations entre parents et encadrants
- Mettre en pratique des compétences full-stack modernes

---

## 📱 Fonctionnalités principales

- Interface mobile intuitive pour les parents et les enfants
- Création et suivi d’activités hebdomadaires
- Gestion des membres de la famille
- Navigation fluide par onglets et écrans
- Persistance des données côté client
- Connexion à une API backend sécurisée

---

## 🛠️ Stack technique

- React Native
- Expo
- Redux Toolkit
- Redux Persist
- React Navigation (stack & tabs)
- AsyncStorage
- UI components (React Native Paper)
- Compatible Android / iOS / Web

---

## 🧱 Architecture & bonnes pratiques

- Séparation claire frontend / backend
- État global centralisé avec Redux Toolkit
- Persistance contrôlée des données utilisateur
- Variables d’environnement isolées (.env.local)
- Fichiers sensibles exclus du versioning (.gitignore)
- Code structuré par fonctionnalités et responsabilités

## 🧠 Ce que j’ai réalisé

- Développement de l’interface mobile
- Mise en place de la navigation (stack & tabs)
- Gestion de l’état global avec Redux Toolkit
- Persistance des données utilisateur
- Intégration avec l’API backend KidsWeek
- Structuration du projet et organisation des composants

---

## ⚙️ Installation & lancement

### Prérequis

- Node.js
- Yarn
- Expo CLI
- Un émulateur Android / iOS ou l’application Expo Go

### Installation

```bash
yarn install
```

### Variable d'environnement

Créer un fichier .env.local à la racine du projet
(un fichier .env.local.example est fourni):

```env
API_URL=http://localhost:3000
```

### Lancer l'application

```bash
yarn start
```

puis :

- a → Android
- i → iOS
- ou scan du QR code avec Expo Go (recommandé)

### Backend

Le frontend communique avec une API REST développée en Node.js/Express.

### Repository backend:

https://github.com/Nouramrine/kidsweek-backend.git

---

## 📌 Statut du projet

### 🛠️ En cours de développement (MVP fonctionnel)

Nouvelles fonctionnalités et améliorations prévues.

---

## 👤 Auteur

Nour El Islam AMRINE
Concepteur développeur d'application web & mobile - Full-stack JavaScript (MERN)

Projet personnel full-stack, repris et maintenu après une phase initiale de travail en équipe.
