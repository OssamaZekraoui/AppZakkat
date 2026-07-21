# Setup du projet App Zakkat

## Prérequis

- Node.js v22+
- Docker

## 1. Installer les dépendances

```bash
npm install
```

## 2. Lancer la base de données PostgreSQL

```bash
docker compose up -d
```

Cela lance un container PostgreSQL avec :

| Paramètre | Valeur |
|---|---|
| Host | 127.0.0.1 |
| Port | 5433 |
| Database | app_zakkat |
| User | postgres |
| Password | password |

> **Note :** Le port 5433 est utilisé (et non 5432) car un PostgreSQL natif peut déjà occuper le port 5432 sur Windows.

## 3. Créer les tables

```bash
npx prisma generate
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script | docker exec -i zakkat-db psql -U postgres -d app_zakkat
```

> `prisma migrate dev` a un bug connu avec Prisma 7 sur Windows. On passe par le SQL direct via Docker.

## 4. Configurer le fichier .env

Vérifier que le fichier `.env` contient :

```
DATABASE_URL="postgresql://postgres:password@127.0.0.1:5433/app_zakkat"
JWT_SECRET="change-this-to-a-strong-secret-key-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 5. Lancer le projet

```bash
npm run dev
```

Le site est accessible sur http://localhost:3000

## 6. Charger la simulation demandeur → validation admin

```bash
npm run db:seed:demo
```

Cette commande crée une demande en attente qui n'est pas visible sur le site public.

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Demandeur | `demandeur@zakkat.demo` | `Demandeur2026!` |
| Administrateur | `admin@zakkat.demo` | `AdminZakkat2026!` |

Scénario de vérification :

1. Se connecter comme demandeur et créer une nouvelle demande depuis `/fr/demandes/nouvelle` (ou utiliser la demande `SIMULATION-PENDING-001` déjà créée).
2. Vérifier qu'elle ne figure pas dans `/fr/demandes` tant qu'elle est en attente.
3. Se déconnecter, puis se connecter avec le compte administrateur.
4. Ouvrir **Administration → Demandes**, sélectionner la demande et cliquer sur **Approuver**.
5. Revenir sur `/fr/demandes` : la demande approuvée est maintenant publiée.

## Commandes utiles

| Commande | Description |
|---|---|
| `docker compose up -d` | Démarrer la base de données |
| `docker compose down` | Arrêter la base de données |
| `docker compose down -v` | Arrêter et supprimer les données |
| `npx prisma generate` | Régénérer le client Prisma |
| `npx prisma studio` | Interface web pour voir la base |

## Connexion DBeaver

Pour visualiser la base dans DBeaver :
- Host : `127.0.0.1`
- Port : `5433`
- Database : `app_zakkat`
- User : `postgres`
- Password : `password`

## Partager l'image Docker (avec données)

```bash
docker login
docker commit zakkat-db ton-username/zakkat-db:latest
docker push ton-username/zakkat-db:latest
```
