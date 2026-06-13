> 🇫🇷 This is the French translation. [English version](../new-project-bootstrap.md).

# Workflow de Bootstrap de Nouveau Projet

Comment lancer un nouveau projet avec Claude Code — structuré, opinionné et prêt à construire dès le premier jour.

---

## Quand utiliser ce workflow
- Démarrer une nouvelle application de zéro
- Configurer un nouveau service dans un système existant
- Créer un nouveau dépôt pour un projet secondaire ou une mission client

---

## Étape 1 — Définir ce que vous construisez

Avant de toucher au code ou à la config, répondez clairement à ces questions.

**Prompt Claude :**
```
I am starting a new project. Help me define it clearly before we write any code.

What I want to build: [describe in 2–3 sentences]

Ask me the following questions one at a time and wait for my answer before asking the next:
1. Who are the users and what is the primary thing they do?
2. What is the expected scale at launch? (users, requests/sec, data volume)
3. What are the hard constraints? (budget, timeline, team size, existing tech stack)
4. What does "done" look like for v1?
5. What is explicitly out of scope for v1?

After I answer all five, summarize what we're building and confirm with me before proceeding.
```

Ne pas continuer tant que la portée n'est pas confirmée par écrit.

---

## Étape 2 — Choisir la stack

**Prompt Claude :**
```
Based on what we're building:
- [paste summary from Step 1]

Recommend a specific stack. For each component (backend, frontend, database, auth, deployment), recommend:
- Your recommended choice and why it fits our constraints
- What we'd be giving up vs the next-best alternative
- No more than 2 options per component — I need a decision, not a menu

Be opinionated. I will push back if I disagree.
```

Validez la stack avant d'écrire du code. Enregistrez les décisions dans `docs/adr/` si elles ne sont pas évidentes.

---

## Étape 3 — Bootstrapper la structure du projet

**Prompt Claude :**
```
Set up the initial project structure for: [stack from Step 2]

Create:
1. The directory structure (show as a tree before creating anything)
2. Package/dependency files with pinned versions
3. Configuration files (TypeScript, ESLint, Prettier, etc.)
4. .gitignore appropriate for this stack
5. A minimal working "hello world" that proves the stack runs

Do not add features yet. The goal is a running skeleton.
```

Vérifiez qu'il fonctionne avant de continuer.

---

## Étape 4 — Configurer CLAUDE.md

**Prompt Claude :**
```
Create a CLAUDE.md for this project.

Include:
1. What this project is (one paragraph)
2. Stack summary (language, framework, key libraries, DB)
3. Directory structure with purpose of each directory
4. Coding conventions specific to this stack
5. Commands to run (dev server, tests, build, lint)
6. Decisions already made (from Steps 1–3) that should not be revisited
7. What NOT to do in this project

Make it dense and useful — not a tutorial. A senior developer should be able to start contributing after reading it.
```

---

## Étape 5 — Configurer l'environnement de développement

**Prompt Claude :**
```
Set up the development environment:

1. Docker Compose file for local dependencies (database, cache, queues)
2. Environment variable template (.env.example with all required vars, no real values)
3. Database migrations setup (initial schema if applicable)
4. Test setup (test runner config, example test, CI-ready)
5. A Makefile or scripts/ directory with common commands:
   - make dev (start local environment)
   - make test (run tests)
   - make build (production build)
   - make lint (lint and format check)
```

---

## Étape 6 — Configurer la CI

**Prompt Claude :**
```
Set up a GitHub Actions CI pipeline:

On every PR:
- Install dependencies (with cache)
- Run lint
- Run tests
- Build (if applicable)

Use the github-actions skill for best practices:
- Pin action versions
- Explicit permissions
- Dependency caching
- Fail fast on test failures

The pipeline must pass on the current skeleton before we add features.
```

Vérifiez que la CI passe sur le commit initial avant de passer au développement de fonctionnalités.

---

## Étape 7 — Planification de la première fonctionnalité

Une fois le squelette en cours d'exécution et la CI verte :

**Prompt Claude :**
```
The project is bootstrapped. Now plan the first feature:

Feature: [describe the first user-facing capability]

Use the feature-development workflow to plan and implement it.
Start with Step 1 of that workflow.
```

Voir `workflows/feature-development.md`.

---

## Liste de contrôle de bootstrap

- [ ] Portée définie et confirmée par écrit
- [ ] Stack décidée avec un raisonnement documenté
- [ ] Structure du projet créée et fonctionnelle ("hello world" fonctionne)
- [ ] CLAUDE.md rédigé et commité
- [ ] Docker Compose / dépendances locales en cours d'exécution
- [ ] .env.example commité avec toutes les variables requises
- [ ] Tests configurés et au moins un qui passe
- [ ] Pipeline CI vert sur le premier push
- [ ] `docs/adr/` créé avec les décisions architecturales initiales

---
