# App Zakkat

Application de calcul et de gestion de la Zakat, développée avec Next.js et PostgreSQL.

## Stack technique

- **Frontend & Backend** : Next.js 15 (App Router)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Language** : TypeScript
- **Style** : Tailwind CSS
- **Auth** : JWT (JSON Web Tokens)

## Prérequis

- Node.js 18+
- PostgreSQL

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/OssamaZekraoui/AppZakkat.git
cd AppZakkat
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Modifier `.env` avec vos paramètres de connexion PostgreSQL.

4. Créer la base de données et appliquer les migrations :
```bash
npx prisma migrate dev --name init
```

5. Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
├── app/
│   ├── api/            # Routes API (backend)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── zakat/      # CRUD calculs Zakat
│   ├── (auth)/         # Pages d'authentification
│   └── dashboard/      # Tableau de bord
├── components/         # Composants UI réutilisables
├── lib/
│   ├── prisma.ts       # Client Prisma singleton
│   └── zakat.ts        # Logique de calcul Zakat
└── types/              # Types TypeScript
prisma/
└── schema.prisma       # Schéma de base de données
```

## API Endpoints

| Méthode | Route              | Description          |
|---------|--------------------|----------------------|
| POST    | /api/auth/register | Créer un compte      |
| POST    | /api/auth/login    | Se connecter         |
| GET     | /api/zakat         | Lister les calculs   |
| POST    | /api/zakat         | Créer un calcul      |
| GET     | /api/zakat/[id]    | Détail d'un calcul   |
| DELETE  | /api/zakat/[id]    | Supprimer un calcul  |

## Calcul de la Zakat

La Zakat est calculée à **2,5%** sur les actifs nets qui dépassent le seuil du Nisab.

Actifs pris en compte :
- Or
- Argent
- Liquidités
- Actions
