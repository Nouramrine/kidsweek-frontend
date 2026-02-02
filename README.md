# KidsWeek – Frontend (Mobile App)

KidsWeek est une application mobile destinée aux parents d’enfants de 3 à 12 ans.
Elle permet d’organiser la semaine familiale (routines, activités, responsabilités)
de manière simple, ludique et collaborative.

Ce repository contient le frontend mobile de l’application, développé avec React Native
et Expo.

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
(un fichier .env.local.example est fournie pour l'exemple):

```env
API_URL=http://localhost:3000
```

### Lancer l'application

```bash
yarn start
```

puis :
-a pour android
-i pour IOS
-ou scan du QR code avec Expo Go(recommandé)

### Backend

Le frontend communique avec une API REST déceloppée en Node.js/Express.

### Respository backend:

https://github.com/Nouramrine/kidsweek-backend.git
