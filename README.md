SalamaPharma

SalamaPharma est une application mobile de gestion et de commande de médicaments destinée aux utilisateurs, pharmacies et administrateurs.
Elle permet de consulter des médicaments, passer des commandes, suivre leur état et gérer les ressources côté administration.

🚀 Fonctionnalités principales
👤 Utilisateur
Inscription / Connexion
Consultation des médicaments
Recherche et filtrage par catégories
Passage de commande
Suivi de commande en temps réel
Mode sombre / clair
🛠️ Administration
Dashboard avec statistiques
Gestion des utilisateurs
Gestion des pharmacies
Gestion des médicaments
Gestion des catégories
Suivi et gestion des commandes

🧱 Technologies utilisées
_Frontend (Mobile)
React Native (Expo)
TypeScript
Expo Router
Context API (Theme)
Axios
_Backend
Node.js
Express.js
API REST
JWT Authentication
_Base de données
MySQL (ou autre SGBD compatible)

📁 Structure du projet
.
├── app/
│   ├── admin/
│   ├── auth/
│   ├── commandes/
│   ├── medicaments/
│   ├── comptes/
│   └── index.tsx
├── components/
├── context/
├── constants/
├── src/api/
├── assets/
└── README.md

⚙️ Installation & lancement

1️⃣ Cloner le projet
git clone https://github.com/Anna272003/SalamaPharma.git
cd SalamaPharma

2️⃣ Installer les dépendances
npm install

3️⃣ Lancer l’application
npx expo start
