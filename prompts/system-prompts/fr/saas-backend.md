> 🇫🇷 This is the French translation. [English version](../saas-backend.md).

# Starter CLAUDE.md — Backend SaaS

Déposez ceci dans le `CLAUDE.md` de votre projet et remplissez les sections entre crochets.

---

```markdown
# [Nom du Projet] — Instructions Claude Code

## Ce que c'est
[Un paragraphe : ce que fait le produit, qui l'utilise, quel problème il résout]

## Stack
- Langage : [TypeScript / Python / Go]
- Framework : [Express / FastAPI / Gin / NestJS]
- Base de données : [PostgreSQL via Prisma / raw pg / SQLAlchemy]
- Auth : [JWT avec tokens d'accès 15 min + tokens de rafraîchissement 7 jours / Clerk / Auth0]
- Cache : [Redis]
- Queue : [BullMQ / SQS / Celery]
- Déploiement : [AWS ECS / Fly.io / Railway]

## Structure du projet
src/
├── api/          ← Route handlers — minces, délèguent aux services
├── services/     ← Logique métier — pas de préoccupations HTTP
├── db/           ← Requêtes de base de données — pas de logique métier
├── middleware/   ← Auth, rate limiting, gestion des erreurs
├── models/       ← Définitions de types et schémas
└── utils/        ← Fonctions pures, pas d'effets secondaires

## Conventions
- Les route handlers sont minces : valider l'entrée, appeler le service, retourner la réponse
- Les services contiennent toute la logique métier : ils ne connaissent pas HTTP
- La couche DB contient uniquement des requêtes : pas de logique métier, pas de préoccupations HTTP
- Tous les accès à la base de données passent par la couche db/ — ne jamais appeler l'ORM directement depuis les services
- Les erreurs se propagent vers le haut avec du contexte — ne jamais avaler silencieusement
- Toutes les routes API retournent : 200 (succès), 201 (créé), 204 (pas de contenu), 400 (mauvaise entrée), 401 (non auth), 403 (interdit), 404 (non trouvé), 409 (conflit), 422 (validation), 500 (inattendu)

## Décisions (ne pas re-discuter)
- [Mécanisme d'auth décidé : JWT, pas de sessions]
- [Choix ORM : Prisma — pas de SQL brut sauf pour les requêtes d'analytique complexes]
- [Format d'erreur : { error: string, code: string } — ne jamais changer la forme]
- [Pas de fichiers barrel — importer directement depuis la source]

## Tests
- Les tests d'intégration touchent une vraie base de données de test — pas de mocks DB
- Tests unitaires pour la logique métier pure dans services/
- Fichier de test : [filename].test.ts à côté du fichier source
- Exécuter : npm test

## Commandes
- npm run dev — démarrer le serveur de développement avec rechargement à chaud
- npm test — exécuter tous les tests
- npm run build — build de production
- npm run lint — vérification ESLint + Prettier
- npm run db:migrate — exécuter les migrations en attente
- npm run db:seed — seeder les données de développement

## Ne jamais faire
- Ne jamais mettre de logique métier dans les route handlers
- Ne jamais appeler la base de données directement depuis les route handlers
- Ne jamais retourner les erreurs brutes de la base de données aux clients
- Ne jamais committer des fichiers .env
- Ne jamais utiliser le type `any` en TypeScript
```

---
