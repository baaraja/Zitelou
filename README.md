# 📱 Zitelou - Messagerie pour enfants sécurisée

Une platforme de messagerie mobile et web moderne construite avec **React Native (Expo)** et **NestJS**, permettant la gestion de contacts, la génération de QR codes, et les appels vidéo cryptés via **Jitsi Meet**.

## 🎯 Vue d'ensemble du Projet

Ce module de l'application **Zitelou** vise a recréer une plateforme de communication décentralisée où les utilisateurs peuvent:
- ✅ Gérer leurs contacts via ID ou QR code
- ✅ Accéder à un profil utilisateur personnalisé
- ✅ Envoyer des messages chiffrés à leurs contacts
- ✅ Effectuer des appels vidéo sécurisés avec Jitsi Meet

**Stack Technologique:**
- **Frontend:** React Native + Expo Router + TypeScript
- **Backend:** NestJS + Prisma + PostgreSQL
- **Communication Real-time:** Socket.io
- **Sécurité:** JWT, Crypto-JS
- **Vidéo:** Jitsi Meet intégré

---

## 🚀 Guide de Démarrage pour Développeurs

### Prérequis
Assurez-vous d'avoir installé:
- **Node.js** 18+ et **npm** 8+
- **Git**
- **Expo CLI**: `npm install -g expo-cli`
- **PostgreSQL** (si vous n'utilisez pas NeonDB)

### 1️⃣ Cloner le Projet

```bash
git clone <repository-url>
cd Zitelou
```

### 2️⃣ Configuration de la Base de Données

#### Option A: NeonDB (Recommandé - Serverless PostgreSQL)

1. Créer un compte sur [https://neon.tech](https://neon.tech)
2. Créer un nouveau projet et obtenir l'URL de connexion PostgreSQL
3. Créer un fichier `.env` à la racine de `packages/backend/`:

```env
# packages/backend/.env
DATABASE_URL="postgresql://user:password@ep-xxxxx.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3000
```

#### Option B: PostgreSQL Local

```bash
# Windows (avec PostgreSQL installé)
createdb zitelou

# macOS/Linux
createdb zitelou
```

Ensuite, créer `.env`:

```env
# packages/backend/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zitelou"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3000
```

#### Option C: Firebase (Alternative)

Pour utiliser Firebase au lieu de PostgreSQL:
1. Créer un projet Firebase sur [https://firebase.google.com](https://firebase.google.com)
2. Télécharger les clés JSON depuis la console Firebase
3. Adapter le code `packages/backend/src/prisma/prisma.service.ts` pour Firebase

### 3️⃣ Installation des Dépendances

```bash
# Installer les dépendances du backend
cd packages/backend
npm install
npm run prisma:generate
npm run prisma:migrate

# Installer les dépendances du mobile
cd ../../apps/mobile
npm install

# (Optionnel) Retour à la racine
cd ../..
```

### 4️⃣ Configuration du Frontend

Créer un fichier `.env` ou modifier `apps/mobile/services/api.ts`:

```typescript
// apps/mobile/services/api.ts - Ligne 7
const EXPO_PUBLIC_API_URL='http://localhost:3000/api'; // ou votre IP
```

**Important pour Android:**
- Remplacer par votre adresse IP : ipconfig sur le terminal Windows

---

## 🎮 Démarrage du Projet

### Terminal 1: Démarrer le Backend

```bash
cd packages/backend
npm run dev
```

**Attendu:** Message "Listening on port 3000"

### Terminal 2: Démarrer le Frontend

```bash
cd apps/mobile
npm start
```

**Attendu:** Menu Expo avec options:
- `w` → Ouvrir dans le navigateur (Web)
- `a` → Envoyer vers Android
- `i` → Envoyer vers iOS

---

## 📱 Options de Test

### Sur Navigateur Web (Localhost)

```bash
npm start
# Puis appuyer sur 'w'
```

L'app s'ouvre sur `http://localhost:8081`

### Sur Android Physique (Expo Go)

1. **Installer Expo Go:** Play Store → Rechercher "Expo Go"
2. **Vérifier la connexion réseau:**
   - PC et téléphone sur le **même Wi-Fi**
   - Windows Defender Firewall: Autoriser port 8081

3. **Démarrer l'app:**
   ```bash
   npm start
   # Appuyer sur 'a' pour Android
   # Ou scanner le QR code avec Expo Go
   ```

4. **Utiliser l'IP locale:**
   - Par défaut, Metro Bundler utilise `localhost`
   - Pour Android: Appuyer sur 'w' dans le terminal, puis utiliser l'URL affichée
   - **OU** modifier `apps/mobile/services/api.ts` avec votre IP

### Sur Simulateur iOS (macOS)

```bash
npm start
# Puis appuyer sur 'i'
```

---

## 📂 Structure du Projet

```
Zitelou/
├── apps/
│   └── mobile/                          # Application React Native/Expo
│       ├── app/                         # Expo Router - Structure de routes
│       │   ├── _layout.tsx              # Layout racine
│       │   ├── index.tsx                # Redirection vers /contacts
│       │   ├── modal.tsx                # Modal partagé
│       │   └── (app)/                   # Groupe de routes authentifiées
│       │       ├── _layout.tsx          # Stack navigator
│       │       ├── index.tsx            # → Redirige vers contacts
│       │       ├── contacts.tsx         # 🎯 Gestion des contacts (page principale)
│       │       ├── profile.tsx          # 🎯 Profil utilisateur
│       │       ├── my-qr.tsx            # Afficher QR code personnel
│       │       ├── scan-qr.tsx          # Scannage QR code (web fallback)
│       │       ├── scan-qr.native.tsx   # Scannage QR code (Android/iOS)
│       │       ├── video-call.tsx       # 🎥 Appels vidéo (web)
│       │       ├── video-call.native.tsx # 🎥 Appels vidéo (mobile)
│       │       └── chat/
│       │           └── [conversationId].tsx # 💬 DÉSACTIVÉ (messages)
│       │   └── (auth)/                  # Routes d'authentification
│       │       ├── index.tsx            # Accueil avant login
│       │       ├── login.tsx            # 🔐 Connexion
│       │       └── register.tsx         # 🔐 Inscription
│       ├── components/                  # Composants réutilisables
│       │   ├── BottomNav.tsx            # Barre de navigation inférieure
│       │   ├── external-link.tsx
│       │   ├── parallax-scroll-view.tsx
│       │   ├── themed-text.tsx          # Texte stylisé
│       │   ├── themed-view.tsx          # View stylisée
│       │   └── ui/                      # Composants UI
│       ├── services/                    # Logique métier
│       │   ├── api.ts                   # Requêtes HTTP + Socket.io
│       │   ├── crypto.ts                # Chiffrement/déchiffrement
│       │   ├── messageQueue.ts          # Queue de messages offline
│       │   └── socket.ts                # Configuration Socket.io
│       ├── context/                     # React Context
│       │   ├── AuthContext.tsx          # État authentification
│       │   └── MessagesContext.tsx      # État messages (inutilisé)
│       ├── hooks/                       # Custom hooks
│       │   ├── use-color-scheme.ts
│       │   └── use-theme-color.ts
│       └── constants/
│           └── theme.ts                 # Couleurs et thème
│
├── packages/
│   └── backend/                         # API NestJS
│       ├── src/
│       │   ├── main.ts                  # Entry point, configuration CORS
│       │   ├── app.module.ts            # Module racine
│       │   ├── auth/                    # 🔐 Authentification JWT
│       │   │   ├── auth.controller.ts   # POST /auth/register, /auth/login
│       │   │   ├── auth.service.ts      # Logique JWT + mot de passe
│       │   │   └── jwt-auth.guard.ts    # Middleware protection routes
│       │   ├── users/                   # 👤 Gestion utilisateurs
│       │   │   ├── users.controller.ts  # GET /users, POST /users/avatar
│       │   │   └── users.service.ts
│       │   ├── contacts/                # 👥 Gestion contacts
│       │   │   ├── contacts.controller.ts # POST/GET/DELETE /contacts
│       │   │   └── contacts.service.ts
│       │   ├── conversations/           # 💬 Conversations (inutilisé)
│       │   │   └── conversations.service.ts
│       │   ├── messages/                # 💬 Messages
│       │   │   ├── messages.gateway.ts  # WebSocket events (call-start, etc.)
│       │   │   └── messages.service.ts
│       │   ├── devices/                 # 📱 Enregistrement appareils
│       │   │   └── devices.service.ts
│       │   ├── crypto/                  # 🔐 Chiffrement côté serveur
│       │   │   └── crypto.service.ts
│       │   └── prisma/                  # ORM
│       │       └── prisma.service.ts
│       ├── prisma/                      # Schéma base de données
│       │   ├── schema.prisma            # Modèles (User, Contact, etc.)
│       │   └── migrations/              # Historique migrations
│       └── package.json
│
├── README.md                            # 👈 Vous êtes ici
└── .gitignore
```

---

## 🔑 Composants Clés Expliqués

### Frontend

| Fichier | Rôle | Status |
|---------|------|--------|
| **contacts.tsx** | Affiche liste contacts, ajouter par ID/QR, supprimer | ✅ Actif |
| **profile.tsx** | Profil utilisateur, upload avatar | ✅ Actif |
| **my-qr.tsx** | Génère et affiche le QR code personnel | ✅ Actif |
| **scan-qr.tsx** | Scanner QR code | ✅ Actif |
| **video-call.tsx** | Jitsi Meet en iframe (web) | ✅ Actif |
| **video-call.native.tsx** | Jitsi Meet en WebView (mobile) | ✅ Actif |
| **chat/[conversationId].tsx** | Affichage messages (SUPPRIMÉ) | ❌ Désactivé |
| **BottomNav.tsx** | Navigation: Contacts + Profil | ✅ Actif |

### Backend

| Endpoint | Méthode | Fonction | Status |
|----------|---------|----------|--------|
| `/auth/register` | POST | Créer compte | ✅ |
| `/auth/login` | POST | Connexion | ✅ |
| `/users` | GET | Info utilisateur | ✅ |
| `/users/avatar` | POST | Upload avatar | ✅ |
| `/contacts` | GET | Lister contacts | ✅ |
| `/contacts` | POST | Ajouter contact | ✅ |
| `/contacts/:id` | DELETE | Supprimer contact | ✅ |
| **WebSocket Events** | - | - | - |
| `call-start` | - | Initier appel vidéo | ✅ |
| `call-answer` | - | Répondre appel | ✅ |
| `incoming-call` | - | Notif appel entrant | ✅ |
| `call-ended` | - | Fin d'appel | ✅ |

---

## 🔧 Configuration pour Développeurs

### Variables d'Environnement Essentielles

**Backend** (`packages/backend/.env`):
```env
DATABASE_URL="postgresql://..."  # NeonDB ou local
JWT_SECRET="secret-key-32-chars-min"
PORT=3000
NODE_ENV=development
```

**Frontend** (`apps/mobile/services/api.ts`):
```typescript
const EXPO_PUBLIC_API_URL='http://localhost:3000/api';
```

### Scripts Utiles

```bash
# Backend
npm run dev              # Mode dev avec watch
npm run build            # Build production
npm run prisma:migrate   # Exécuter migrations DB
npm run prisma:studio    # GUI Prisma (port 5555)

# Frontend
npm start                # Démarrer Metro Bundler
npm run web              # Ouvrir directement en web
npm run android          # Ouvrir directement sur Android
npm run lint             # ESLint check
```

---

## 📊 Base de Données - Schéma

Les modèles principaux (voir `packages/backend/prisma/schema.prisma`):

```prisma
model User {
  id         String      @id @default(cuid())
  username   String      @unique
  email      String      @unique
  password   String      // hash bcrypt
  avatar     String?
  contacts   Contact[]
  devices    Device[]
}

model Contact {
  id        String  @id @default(cuid())
  userId    String
  contactId String
  verified  Boolean @default(false)
  user      User    @relation(fields: [userId], references: [id])
}

model Device {
  id        String  @id @default(cuid())
  userId    String
  platform  String  // "android", "ios", "web"
  tokenFCM  String?
  user      User    @relation(fields: [userId], references: [id])
}

// Conversations et Messages modèles existent mais inutilisés (feature à venir)
```

---

## 🎬 Flux d'Utilisation Actuel

```
1. USER S'INSCRIT
   ↓
   POST /auth/register → Création compte + JWT
   
2. USER CONNEXION
   ↓
   POST /auth/login → JWT + Redirection /contacts
   
3. PAGE CONTACTS
   ↓
   GET /contacts → Affiche liste
   ↓
   Option A: Ajouter par ID → POST /contacts?contactId=xxx
   Option B: Ajouter par QR → Scanne QR + POST /contacts
   ↓
   DELETE /contacts/:id → Supprimer contact
   
4. PAGE PROFIL
   ↓
   GET /users → Affiche données utilisateur
   ↓
   POST /users/avatar → Upload nouvelle image
   
5. APPEL VIDÉO (À IMPLÉMENTER PLEINEMENT)
   ↓
   Socket.io: call-start → Jitsi Meet s'ouvre
   ↓
   Socket.io: call-answer / call-ended
```

---

## 🚦 Problèmes Connus & Solutions

### ❌ Impossible de se connecter depuis Android

**Problème:** `Network Error` ou timeout

**Solutions:**
1. Vérifier que backend écoute sur `0.0.0.0` (non `localhost`)
   ```typescript
   // packages/backend/src/main.ts
   await app.listen(process.env.PORT || 3000, '0.0.0.0');
   ```

2. Utiliser l'IP locale au lieu de `localhost`
   ```typescript
   // apps/mobile/services/api.ts
   const EXPO_PUBLIC_API_URL='http://192.168.X.X:3000/api';
   ```

3. Firewall Windows: Autoriser port 8081 et 3000

### ❌ Erreur "Métro Bundler not running"

**Solution:**
```bash
npm start  # Relancer le Metro Bundler
```

---

## 🔮 Prochaines Étapes Possibles (Roadmap)

### Phase 1: Réactiver Messagerie (Court terme)
- [ ] Réactiver le dossier `chat/[conversationId].tsx`
- [ ] Implémenter affichage messages
- [ ] Ajouter indicateur "En ligne"
- [ ] Notification messages en temps réel

### Phase 2: Améliorer Appels Vidéo
- [ ] Tester Jitsi Meet sur tous les appareils
- [ ] Ajouter bouton "Raccrocher" plus visible
- [ ] Notification call-ended pour terminer l'appel
- [ ] Support audio uniquement (fallback réseau faible)

### Phase 3: Sécurité & Chiffrement
- [ ] Implémenter chiffrement End-to-End messages
- [ ] Signature cryptographique des messages
- [ ] Gestion certificats utilisateurs
- [ ] Audit sécurité externe

### Phase 4: UX Enfants
- [ ] **Interface Simplifiée**
  - [ ] Mode interface "cartoon" avec animations
  - [ ] Texte plus grand et vocabulaire simplifié
  - [ ] Icônes plus grandes et colorées
  - [ ] Réduction des notifications
  - [ ] Navigation tactile optimisée (hit zones larges)
  - [ ] Pas de contenu vidéo violent/effrayant
  - [ ] Pagination contacts
  
- [ ] **Avatars & Personnalisation**
  - [ ] Création d'avatars enfants (anime style, cartoon)
  - [ ] Sélection d'émojis animés pour profil
  - [ ] Couleurs personnalisables par enfant
  - [ ] Noms d'utilisateur avec validation (pas de contenu adulte)
  - [ ] Animal compagnon virtuel (gamification)
  - [ ] Thème sombre

- [ ] **Gamification**
  - [ ] Système de badges/trophées pour activités
  - [ ] Points récompense pour interactions saines
  - [ ] Leaderboard amical (pas compétition excessive)
  - [ ] Achievements: "Première conversation", "5 amis", etc.

- [ ] **Intégration GIFs Modérés**
  - [ ] API Giphy avec filtrage "G-rated" uniquement
  - [ ] Stockage local de GIFs pré-validés en cache
  - [ ] Système de cache pour performance (< 5MB par GIF)
  - [ ] Synchronisation périodique nouvelle whitelist

### Phase 5: Déploiement
- [ ] Build APK/IPA (EAS Build)
- [ ] Déployer backend (Railway, Heroku, AWS)
- [ ] CDN images (Cloudinary)
- [ ] Monitoring errors (Sentry)

---

### Afficher les logs dans Expo

```javascript
// Apps/mobile/services/api.ts
console.log('[API] Calling:', url);
console.error('[API] Error:', error);
```

### Voir les WebSocket events

```typescript
// apps/mobile/services/socket.ts
socket.on('call-start', (data) => {
  console.log('[Socket] call-start:', data);
});
```

### Accéder à Prisma Studio (GUI DB)

```bash
cd packages/backend
npm run prisma:studio
# Ouvre http://localhost:5555
```

---

## 📞 Support & Questions

Pour tout problème:
1. Vérifier la console (navigateur F12 ou terminal)
2. Consulter `.env` et vérifier les URLs
3. Relancer les serveurs (backend + frontend)
4. Vérifier les logs Prisma: `npm run prisma:studio`
