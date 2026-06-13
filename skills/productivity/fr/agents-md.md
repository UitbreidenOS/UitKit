---
name: agents-md
description: "Générer AGENTS.md pour la portabilité multi-agents (Claude Code, Cursor, Codex, Gemini CLI). Document de contexte de repo agnostique aux outils, distinct de CLAUDE.md."
---

# AGENTS.md Writer

## Quand l'activer

- L'utilisateur veut que le repo fonctionne de manière cohérente sur plusieurs outils d'IA (Claude Code, Cursor, Codex, Gemini CLI)
- Configurer un nouveau repo pour le développement assisté par IA et besoin d'un document de contexte partagé unique
- CLAUDE.md existe mais est spécifique à Claude Code et d'autres outils donnent des résultats incohérents
- L'équipe se standardise sur une convention de contexte IA agnostique aux outils
- Après un audit CLAUDE.md quand vous voulez extraire le sous-ensemble agnostique aux outils

## Quand ne pas l'utiliser

- Le projet n'utilise que Claude Code — CLAUDE.md est le document approprié, pas AGENTS.md
- Le repo a déjà un AGENTS.md qui a juste besoin d'une mise à jour (utiliser la requête context-auditor pour réduire CLAUDE.md et mettre en miroir les changements)
- Configurations MCP, scripts hooks ou définitions de commandes slash — ceux-ci sont spécifiques à Claude Code et n'appartiennent pas à AGENTS.md

## Instructions

### AGENTS.md vs CLAUDE.md

| CLAUDE.md | AGENTS.md |
|---|---|
| Spécifique à Claude Code | Fonctionne avec n'importe quel outil d'IA |
| Peut référencer hooks, MCP, slash commands | Agnostique aux outils — pas de fonctionnalités Claude |
| Peut être verbeux (chargé une fois par session) | Doit être concis (<400 lignes) |
| Règles de projet + comportement Claude | Conventions de projet + règles de sécurité agent |
| Détenu par les utilisateurs de Claude Code | Détenu par n'importe quelle équipe assistée par IA |

Les deux fichiers peuvent coexister. AGENTS.md est le sur-ensemble de ce que tous les outils partagent ; CLAUDE.md ajoute des extensions spécifiques à Claude Code par-dessus.

### Structure AGENTS.md

Chaque AGENTS.md doit contenir ces sections dans l'ordre :

**1. Présentation du projet**
Deux à quatre phrases. Ce que fait le projet, à qui il sert, quel problème il résout. Pas de langage marketing.

**2. Tech Stack**
Liste à puces : langage + version, framework + version, bibliothèques majeures, base de données, hébergement/infrastructure.
Seulement ce qui est réellement dans le repo — pas d'ajouts aspirationnels.

**3. Conventions clés**
Les règles que tout développeur (ou agent IA) doit suivre pour produire un code acceptable. Extraire de :
- CLAUDE.md existant si présent
- Configuration de linting (`.eslintrc`, `pyproject.toml`, `rubocop.yml`)
- README
- Motifs observés dans la base de code existante

Inclure : conventions de nommage, organisation des fichiers, motifs à utiliser, motifs à éviter.

**4. Règles de comportement des agents**
Instructions spécifiquement pour les agents IA :
- Commandes sûres à exécuter sans demander : tests, linting, formatage, vérification de type
- Commandes nécessitant une confirmation humaine : déploiement, migration, publication, drop, truncate, redémarrage
- Politique de création de fichiers : demander avant de créer de nouveaux fichiers vs éditer en premier
- Politique de commit : demander avant de committer vs commits autonomes autorisés
- Discipline de portée : ce que l'agent ne doit PAS faire même si cela semble utile

**5. Carte de sécurité des fichiers**
Un tableau classant les chemins par risque :

| Chemin / Motif | Statut | Notes |
|---|---|---|
| `src/`, `lib/`, `app/` | SÛR | Code de fonctionnalité — édition normale |
| `tests/`, `spec/`, `__tests__/` | SÛR | Tests — modifier librement |
| `docs/` | SÛR | Documentation |
| `prisma/migrations/`, `db/migrate/` | ATTENTION | Exécuter seulement avec approbation |
| `src/auth/`, `src/payments/` | ATTENTION | Sensible à la sécurité — signaler avant changement |
| `.env`, `*.secret`, `credentials.*` | DANGEREUX | Ne jamais lire ou modifier |
| `Dockerfile`, `.github/workflows/` | DANGEREUX | Infrastructure — approbation requise |
| `dist/`, `build/`, `.next/` | DANGEREUX | Généré — ne pas éditer directement |

**6. Commandes de test**
Commandes exactes copiées de scripts `package.json`, Makefile ou configuration CI. Pas de paraphrase.

```
Test:    npm test
Lint:    npm run lint
Typecheck: npm run typecheck
Format:  npm run format
```

### Ce qu'il faut exclure d'AGENTS.md

- Hooks Claude Code (`PreToolUse`, `PostToolUse`, `Stop`)
- Configurations de serveurs MCP
- Définitions de commandes slash Claude
- Orientation du modèle (Haiku vs Sonnet vs Opus)
- Instructions référençant des fonctionnalités spécifiques à Claude (outil Agent, /compact, fichiers mémoire)
- Noms d'équipes internes, numéros de tickets Jira, préférences personnelles

Ceux-ci appartiennent uniquement à CLAUDE.md.

### Générer AGENTS.md

Utilisez la requête `prompts/task-specific/agents-md-generator.md` pour une passe de génération entièrement automatisée. La compétence ici couvre le format ; la requête couvre l'invocation.

## Exemple

**Projet:** Application SaaS Next.js 14 avec Prisma + PostgreSQL, déployée sur Vercel.

Extrait AGENTS.md généré :

```markdown
# AGENTS.md

## Présentation du projet
Un tableau de bord SaaS multi-tenant pour suivre les métriques de livraison logicielle.
Construit pour les équipes d'ingénierie de 5–50 personnes. Valeur principale : répondre à
"à quelle vitesse livrons-nous et où sommes-nous bloqués" en moins de 30 secondes.

## Tech Stack
- TypeScript 5.4
- Next.js 14 (App Router)
- Prisma 5 + PostgreSQL 16
- Tailwind CSS 3.4
- Vercel (hébergement + Fonctions Edge)
- Vitest (unité), Playwright (e2e)

## Conventions clés
- Tous les composants : PascalCase, un composant par fichier
- Tous les utilitaires : fonctions camelCase, noms de fichiers kebab-case
- Pas d'exports barrel (pas de ré-exports index.ts)
- Composants serveur par défaut ; ajouter 'use client' uniquement si nécessaire
- Requêtes de base de données uniquement dans `src/lib/db/` — jamais directement dans les composants ou routes API
- Pas de types `any` — utiliser `unknown` + type guard si la forme est incertaine

## Règles de comportement des agents
Sûr à exécuter de manière autonome : `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`
Nécessite confirmation : `prisma migrate deploy`, `vercel --prod`, tout SQL `DROP`
Demander avant de créer de nouveaux fichiers dans : `src/lib/db/`, `prisma/migrations/`
Ne pas committer de manière autonome — toujours présenter les changements pour révision d'abord

## Carte de sécurité des fichiers
| Chemin | Statut | Notes |
|---|---|---|
| `src/components/` | SÛR | |
| `src/app/` | SÛR | |
| `src/lib/` | ATTENTION | Logique métier principale |
| `prisma/migrations/` | DANGEREUX | Ne jamais modifier les migrations existantes |
| `.env*` | DANGEREUX | Ne jamais lire ou écrire |
| `.github/` | DANGEREUX | CI/CD — approbation requise |

## Commandes de test
pnpm test          # Tests unitaires Vitest
pnpm test:e2e      # Playwright end-to-end
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
```

---
