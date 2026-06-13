> 🇫🇷 Version française. [English version](../claude-md-architecture.md).

# Guide d'architecture CLAUDE.md

Comment structurer `CLAUDE.md` pour des projets de toute taille — des dépôts solo aux grands monorepos avec plusieurs équipes.

---

## À quoi sert CLAUDE.md

`CLAUDE.md` est la mémoire de projet de Claude Code. Il se charge automatiquement dans chaque session et indique à Claude :
- Ce qu'est ce code source et comment il est structuré
- Comment l'exécuter, le tester et le déployer
- Les règles et conventions qui s'appliquent toujours
- Ce qu'il NE FAUT PAS faire

Un bon `CLAUDE.md` élimine les instructions répétées. Un mauvais est ignoré, trop long ou contredit ce que Claude sait déjà.

---

## Les trois niveaux

Claude Code lit trois fichiers CLAUDE.md, fusionnés dans l'ordre (le dernier remplace le précédent) :

```
~/.claude/CLAUDE.md           # User-level: your personal preferences across all projects
{project-root}/CLAUDE.md      # Project-level: checked into the repo, applies to everyone
{project-root}/.claude/       # Local-level (gitignored): your overrides for this project
```

**Niveau utilisateur** — vos règles personnelles : style de réponse préféré, outils que vous souhaitez toujours, préférences de formatage. Non versionnées.

**Niveau projet** — les règles partagées de l'équipe : comment exécuter le projet, conventions de codage, zones interdites. Versionnées dans git.

**Niveau local** — vos remplacements personnels pour ce projet spécifique : clés API personnelles, instructions en cours de travail, éléments non prêts à partager avec l'équipe.

---

## Modèle CLAUDE.md

Voici la structure qui fonctionne pour la plupart des projets. Copiez et remplissez vos détails.

```markdown
# {Project Name}

{One sentence describing what this project does and who it's for.}

---

## Architecture

{Describe the high-level architecture in 3–5 sentences. What are the main components? How do they interact?}

### Directory structure
{Show the important directories and what lives there. Skip boilerplate.}

---

## Key commands

{The commands developers run every day. Be exact — copy-paste ready.}

\`\`\`bash
{dev-start}   # Start development server
{test}        # Run the test suite
{lint}        # Run linter
{build}       # Production build
\`\`\`

---

## Conventions

### Code style
{Describe the style conventions that aren't enforced by the linter — naming patterns, file organisation, patterns to follow.}

### Patterns to use
{Describe the architectural patterns in use. E.g., "Use the repository pattern for all data access" or "Server Components by default, Client Components only when interactive."}

### Patterns to avoid
{Describe common mistakes or anti-patterns that apply to this specific codebase. E.g., "Never call the DB from a route handler — use a service layer."}

---

## What not to touch

{List files, directories, or systems Claude should not modify without explicit instruction.}

- `migrations/` — never edit migration files; create new ones with the migration CLI
- `public/vendor/` — third-party files, don't edit

---

## Testing

{Describe how tests are organised and what kind of coverage is expected.}

\`\`\`bash
{test-unit}          # Run unit tests
{test-integration}   # Run integration tests
{test-e2e}           # Run end-to-end tests
\`\`\`

Test files live next to source files: `foo.ts` → `foo.test.ts`.

---

## Environment

{List required env vars and how to get them.}

\`\`\`bash
DATABASE_URL=...   # PostgreSQL connection string — see 1Password > {vault name}
API_KEY=...        # {service name} API key — see .env.example
\`\`\`

Start local services: \`docker compose up -d\`
```

---

## Guide de dimensionnement

| Taille du projet | Taille du CLAUDE.md | Ce qu'il faut inclure |
|---|---|---|
| Solo, simple | 20–50 lignes | Commandes clés, conventions principales, liste "ne pas toucher" |
| Équipe, service unique | 50–150 lignes | Modèle complet ci-dessus |
| Multi-service | 150–300 lignes | Vue d'ensemble de l'architecture + pointeurs par service |
| Monorepo | 100–200 lignes à la racine + CLAUDE.md par paquet | Racine = règles globales, paquets = règles locales |

**Limite absolue :** Gardez CLAUDE.md sous 500 lignes. Au-delà, cela devient du bruit. Les règles qui ne sont pas suivies n'aident pas.

---

## Structure monorepo

Pour les monorepos, utilisez plusieurs fichiers CLAUDE.md — un à la racine et un dans chaque paquet ayant ses propres conventions.

```
repo/
├── CLAUDE.md                 # Global: shared conventions, monorepo tooling, workspace commands
├── packages/
│   ├── api/
│   │   └── CLAUDE.md         # API-specific: FastAPI patterns, DB access, auth
│   ├── web/
│   │   └── CLAUDE.md         # Frontend-specific: Next.js patterns, component rules
│   └── shared/
│       └── CLAUDE.md         # Shared lib: what this exports, how to add to it
└── infra/
    └── CLAUDE.md             # Infra-specific: Terraform conventions, cloud setup
```

**CLAUDE.md racine** couvre :
- Ce que contient le monorepo et comment les paquets sont liés
- Commandes de workspace (`npm run build --workspace=api`)
- Conventions partagées (format de commit, nommage des branches, processus de PR)
- Dépendances entre paquets et ce qui est autorisé

**CLAUDE.md par paquet** couvre :
- Uniquement ce qui diffère de la racine
- Patterns et anti-patterns spécifiques au paquet
- Commandes locales et stratégie de tests

---

## Règles qui fonctionnent

### Rédigez les règles comme des contraintes, pas des demandes
```markdown
# Bad (ignored)
Please try to use the service layer for database access.

# Good (followed)
Never call the database from a controller or route handler.
All DB access must go through a service in src/services/.
```

### Soyez spécifique, pas générique
```markdown
# Bad (Claude already knows this)
Write clean, readable code.
Follow best practices.
Use meaningful variable names.

# Good (project-specific)
Use snake_case for Python, camelCase for TypeScript.
All public functions must have type annotations.
Never use `Any` — use `Unknown` or define the type.
```

### Expliquez le *pourquoi* pour les règles non évidentes
```markdown
# Bad (mysterious)
Don't use the UserService from the AuthModule.

# Good (explains the constraint)
Don't import from AuthModule in other modules — it creates circular dependencies.
Use the shared UserRepository from @/shared/db instead.
```

### La liste "ne pas toucher" est fondamentale
```markdown
## Do not modify
- `src/generated/` — auto-generated from the OpenAPI spec, run `npm run generate` to update
- `migrations/` — create new migrations with `npm run migration:create`, never edit existing ones
- `public/service-worker.js` — generated by the build, do not edit directly
```

---

## Anti-patterns

**Trop long.** Si votre CLAUDE.md fait 500+ lignes, Claude traite la moitié inférieure comme un contexte de faible priorité. Supprimez sans pitié — chaque ligne doit être essentielle.

**Dupliquer ce que le linter applique.** Ne documentez pas les règles qu'ESLint ou Prettier appliquent déjà. Si l'outil le détecte, Claude n'a pas besoin de le savoir.

**Conseils génériques.** "Écrivez des tests pour toutes les nouvelles fonctionnalités" — Claude le sait déjà. Écrivez des règles spécifiques aux conventions de *votre* projet.

**Instructions obsolètes.** Un CLAUDE.md périmé qui décrit comment le projet *fonctionnait* est pire qu'aucun CLAUDE.md. Revoyez-le lors des refactorisations majeures.

**Règles contradictoires.** "Toujours utiliser TypeScript" dans le CLAUDE.md racine et "Python préféré" dans le CLAUDE.md du service va perturber Claude. Rendez la hiérarchie claire.

---

## Mettre à jour CLAUDE.md

**Après un refactoring :** mettez à jour la section structure des répertoires et tout anti-pattern modifié.

**Après l'intégration d'un nouveau membre d'équipe :** demandez-leur ce qui les a perturbés. Leurs points de confusion indiquent du contenu CLAUDE.md manquant.

**Après une erreur répétée :** si vous corrigez Claude pour la même chose deux fois, ajoutez une règle. Si vous ajoutez une règle et qu'elle est violée à nouveau, renforcez-la — déplacez-la en haut, transformez-la en contrainte plutôt qu'en préférence.

**Revue trimestrielle :** lisez l'intégralité du fichier, supprimez tout ce qui est obsolète, ajoutez tout ce qui revient régulièrement dans vos sessions récentes.

---
