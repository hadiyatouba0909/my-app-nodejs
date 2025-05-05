# mon-app-nodejs
# API Node.js pour la Gestion d'Utilisateurs et de Produits

Cette API REST développée avec Node.js, Express et MongoDB offre une gestion complète des utilisateurs et des produits. Elle implémente un système d'authentification sécurisé et des fonctionnalités de gestion de produits.

## Fonctionnalités

### Authentification et Gestion des Utilisateurs
- Inscription avec validation des données
- Connexion avec JWT
- Récupération du profil utilisateur
- Mise à jour du profil
- Changement de mot de passe
- Récupération et réinitialisation de mot de passe par email

### Gestion des Produits
- Création de produits
- Consultation de tous les produits
- Consultation d'un produit spécifique
- Mise à jour d'un produit
- Suppression d'un produit

## Technologies Utilisées

- **Node.js** et **Express** : Framework backend
- **MongoDB** avec **Mongoose** : Base de données et ODM
- **JWT** (JSON Web Token) : Authentification
- **Bcrypt.js** : Hachage des mots de passe
- **Joi** : Validation des données
- **Nodemailer** : Envoi d'emails
- **Dotenv** : Gestion des variables d'environnement
- **Cors** : Gestion des requêtes cross-origin

## Installation

1. Clonez le dépôt
   ```bash
   git clone "https://github.com/hadiyatouba0909/my-app-nodejs"
   cd my-app-nodejs
   ```

2. Installez les dépendances
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement
   Créez un fichier `.env` à la racine du projet basé sur l'exemple fourni :
   ```
   PORT=5000
   MONGODB_URI=votre_uri_mongodb
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=votre_email
   EMAIL_PASS=votre_mot_de_passe
   JWT_SECRET=votre_secret_jwt
   JWT_EXPIRES_IN=30d
   ```

4. Démarrez le serveur
   ```bash
   # Mode développement
   npm run dev
   
   # Mode production
   npm start
   ```

## Structure du Projet

```
my-app-nodejs/
├── src/
│   ├── config/
│   │   ├── dbMongo.js
│   │   └── emailConfig.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── services/
│   │   └── emailService.js
│   └── validations/
│       ├── authValidation.js
│       └── profileValidation.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## API Endpoints

### Authentification et Profil

- **POST /api/auth/register** : Inscription d'un nouvel utilisateur
- **POST /api/auth/login** : Connexion
- **GET /api/auth/me** : Récupération du profil utilisateur (protégé)
- **PUT /api/auth/update-profile** : Mise à jour du profil (protégé)
- **PUT /api/auth/update-password** : Changement de mot de passe (protégé)
- **POST /api/auth/forgot-password** : Demande de réinitialisation de mot de passe
- **PUT /api/auth/reset-password/:resetToken** : Réinitialisation du mot de passe

### Produits

- **GET /api/products** : Récupération de tous les produits
- **GET /api/products/:id** : Récupération d'un produit spécifique
- **POST /api/products** : Création d'un nouveau produit
- **PUT /api/products/:id** : Mise à jour d'un produit
- **DELETE /api/products/:id** : Suppression d'un produit

## Sécurité

- Hachage des mots de passe avec bcrypt
- Authentification par JWT
- Validation des données avec Joi
- Gestion des erreurs centralisée
- Protection des routes sensibles

## Fonctionnalités Additionnelles

- Envoi d'emails de bienvenue lors de l'inscription
- Envoi d'emails de réinitialisation de mot de passe
- Gestion des erreurs adaptée pour le frontend
- Format de réponse JSON standardisé pour toutes les routes

## Licence

Ce projet est sous licence ISC.