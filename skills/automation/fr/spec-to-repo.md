---
name: spec-to-repo
description: "Spec vers repo : convertir une spécification de produit, une PRD ou une description de fonctionnalité en un référentiel de travail complet avec code, tests, CI et documentation"
---

# Spec to Repo Skill

## Quand activer
- Vous avez une spécification ou PRD claire et voulez que Claude construise l'implémentation complète
- Démarrer un projet greenfield à partir d'un bref produit
- Convertir un document de conception ou une spécification technique en code exécutable
- Construire une preuve de concept qui implémente une interface bien définie

## Quand ne PAS utiliser
- Prototypes exploratoires où la spécification est vague — découvrir d'abord, puis spécifier
- Grands systèmes complexes qui dépassent une fenêtre de contexte unique
- Quand vous voulez apprendre en construisant — cela génère tout à la fois

## Instructions

### Ingestion de spécification

```
Construire un référentiel à partir de cette spécification.

Specification: [coller spec, PRD, ou description de fonctionnalité]

Avant de générer du code, produire:
1. UNDERSTANDING CHECK:
   - Résumer ce que vous construisez en 3 points à puces
   - Lister les ambiguïtés ou informations manquantes
   - Confirmer la pile technologique que vous utiliserez

2. FILE PLAN:
   - Lister chaque fichier que vous allez créer avant d'en créer un
   - Cela vous donne une chance de rediriger avant de commencer

3. IMPLEMENTATION ORDER:
   - Qu'est-ce que vous construisez en premier? (généralement: schema → types → logic principale → API → UI → tests)

Attendre mon approbation avant de procéder.
```

### Génération de référentiel complet

```
Générer un référentiel complet pour [project].

Spec: [coller spec]
Stack: [spécifier ou utiliser les valeurs par défaut]

Générer dans cet ordre:
1. Project scaffolding (package.json, tsconfig, .gitignore, .env.example)
2. Database schema (si applicable)
3. Core business logic (services, utilities)
4. API layer (routes, controllers, validation)
5. UI layer (si applicable)
6. Tests (unit + integration for core logic)
7. CI/CD (GitHub Actions)
8. README with setup instructions

Règles:
- Chaque fichier doit être complet et exécutable — pas de TODOs, pas de placeholders
- Les tests doivent réellement tester la logique (pas tout mocker)
- README doit inclure: commandes install, configure, run, test
- .env.example doit documenter chaque variable requise
- Tout TypeScript (si Node.js) doit compiler sans erreurs
```

### Spec-to-code incrémental

```
Construire [feature] à partir de cette spécification de manière incrémentale.

Spec: [coller spec]

Phase 1 — Couche de données:
Build: schema, types, database migrations
Deliver: répertoires migrations/ et types/
Test avant de continuer: exécuter les migrations sur la base de données de test

Phase 2 — Logique métier:
Build: fonctions de service qui implémentent la spécification
Deliver: répertoire services/
Test avant de continuer: les tests unitaires passent

Phase 3 — Couche API:
Build: points de terminaison API qui exposent les services
Deliver: répertoire routes/ ou app/api/
Test avant de continuer: les tests d'intégration passent

Phase 4 — Documentation:
Build: README, docs API, .env.example
Deliver: répertoire docs/ et README.md mis à jour

Terminer une phase complètement avant de commencer la suivante.
```

### Validation de spécification avant la construction

```
Examiner cette spécification avant que je la construise.

Spec: [coller]

Vérifier:
1. COMPLETENESS: Y a-t-il suffisamment de détails pour construire sans deviner?
   - Tous les types de données et structures sont-ils définis?
   - Tous les cas d'erreur sont-ils spécifiés?
   - Toutes les exigences d'authentification/autorisation sont-elles claires?

2. CONSISTENCY: La spécification se contredit-elle?
   - Les termes sont-ils utilisés de manière cohérente?
   - Les entrées/sorties de l'API correspondent-elles au modèle de données?

3. BUILDABILITY: Est-ce réalisable en une seule session?
   - Combien de fichiers cela générerait? (estimation)
   - Y a-t-il des dépendances externes qui nécessitent un accès pré-configuré?

4. OPEN QUESTIONS: Qu'est-ce que je devrais deviner?
   - Lister chaque hypothèse que je devrais faire sans demander

Produire: une liste des lacunes à résoudre avant la construction.
```

## Exemple

**User:** Construis-moi un service de raccourcissement d'URL à partir de cette spécification:
- POST /links with {url, customSlug?, expiresAt?} → returns {id, shortUrl}
- GET /:slug redirects to original URL (302)
- GET /links/:id returns link metadata
- Links expire after expiresAt if set
- Track click counts

**Claude's file plan:**

```
Fichiers que je vais créer (en attente d'approbation):

Infrastructure:
- package.json (Express, Drizzle, Neon)
- tsconfig.json
- .env.example

Database:
- db/schema.ts (liens table: id, slug, originalUrl, expiresAt, clicks, createdAt)
- drizzle.config.ts
- db/migrations/0001_create_links.sql

Business logic:
- services/links.ts (createLink, getBySlug, getLinkById, incrementClicks)
- lib/slugify.ts (generate random slug if none provided)
- lib/db.ts (Drizzle client)

API:
- app.ts (Express setup)
- routes/links.ts (POST /links, GET /links/:id)
- routes/redirect.ts (GET /:slug)
- middleware/validation.ts (Zod schemas)

Tests:
- tests/links.test.ts (unit tests for services)
- tests/api.test.ts (integration tests for routes)

Docs:
- README.md
- .env.example

Total: 14 fichiers

Dois-je procéder?
```

Après approbation, génère tous les 14 fichiers complètement et correctement avec:
```bash
npm install && npx drizzle-kit migrate && npm test && npm run dev
# Tout réussit du premier coup
```

---
