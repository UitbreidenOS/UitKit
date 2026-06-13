# Team Onboarding

## Quand l'activer

- L'utilisateur exécute `/team-onboarding`
- L'utilisateur demande de générer un document d'intégration pour un nouveau membre d'équipe ou un contractant
- L'utilisateur veut capturer le contexte du projet pour un développeur qui rejoint le projet
- L'utilisateur veut un document "commencer ici" couvrant la configuration jusqu'au premier déploiement
- Configuration de l'intégration assistée par IA pour une équipe où les nouveaux membres utilisent Claude Code

## Quand ne pas l'utiliser

- Le projet a déjà un `ONBOARDING.md` ou équivalent à jour — mettre à jour le document existant plutôt que de régénérer
- La demande concerne l'intégration RH générale de l'entreprise — cette compétence couvre uniquement l'intégration de projet technique
- L'utilisateur veut un README — un README est public ; les documents d'intégration sont internes, opinionnés, et supposent que le lecteur a accès au repo

## Instructions

### Quoi générer

Le document d'intégration couvre tout ce qu'un développeur doit savoir pour passer de zéro au premier commit. Sections :

1. **Aperçu du projet** — Ce qu'il fait, qui l'utilise, et pourquoi il existe (2–4 phrases max)
2. **Tech Stack** — Framework, langage, runtime, base de données, cache, file d'attente — avec les numéros de version exacts tirés de `package.json`, `pyproject.toml`, `go.mod`, ou équivalent
3. **Configuration locale** — Commandes étape par étape pour cloner, installer, configurer env, remplir les données, et exécuter le serveur dev ; chaque commande doit être copiable-collable
4. **Emplacements des fichiers clés** — Où vivent les choses importantes : points d'entrée, configuration, routes, schéma db, tests, configuration CI
5. **Test** — Comment exécuter les tests (unité, intégration, e2e), quel est le seuil de couverture, comment exécuter un seul fichier de test
6. **Déploiement** — Comment fonctionnent les déploiements staging et production, qui peut les déclencher, quelle est la procédure de rollback
7. **Conventions de l'équipe** — Nommage des branches, format de commit, processus PR, qui examine quoi, application du style de code
8. **Configuration Claude Code** — Quelles compétences sont actives dans `.claude/skills/`, quels agents sont disponibles, quels serveurs MCP sont configurés, commandes slash utiles pour ce projet

### Comment sourcer les informations

Lire ces fichiers avant de générer :

```
README.md                  — description du projet, démarrage rapide
package.json / pyproject.toml / go.mod / Cargo.toml — versions, scripts, dépendances
CLAUDE.md                  — conventions d'équipe, configuration Claude
Makefile                   — commandes disponibles
docker-compose.yml         — services, ports, environnement
.env.example               — variables d'environnement requises
.github/workflows/         — pipeline CI/CD, commandes de test, déclencheurs de déploiement
src/ ou app/               — points d'entrée, structure de niveau supérieur
```

Ne pas inventer d'informations. Si le fichier source d'une section n'existe pas ou ne contient pas les informations pertinentes, écrire un espace réservé comme `[TODO: ajouter le processus de déploiement]` plutôt que de deviner.

### Format de sortie

Sortie : un seul document Markdown. Pas de HTML, pas de front matter.

Structure :
```markdown
# Nom du projet — Intégration des développeurs

> Description en une phrase de ce que fait le projet.

## Prérequis
## Configuration locale
## Tech Stack
## Emplacements des fichiers clés
## Exécution des tests
## Déploiement
## Conventions de l'équipe
## Configuration Claude Code
## Obtenir de l'aide
```

Garder cela scannable. Utiliser les blocs de code pour chaque commande. Utiliser les tableaux pour le tech stack et les emplacements des fichiers. Longueur cible : 2–4 pages lors de l'impression.

### Où sauvegarder

Vérifier dans cet ordre :
1. Si le répertoire `docs/` existe → sauvegarder dans `docs/onboarding.md`
2. Si `ONBOARDING.md` existe déjà → le mettre à jour sur place
3. Par défaut → sauvegarder dans `ONBOARDING.md` à la racine du projet

Après la sauvegarde, dire à l'utilisateur le chemin du fichier et lui suggérer de l'ajouter à la liste de contrôle des nouvelles embauches ou à un lien Slack/Notion épinglé.

### Remplir la section Configuration Claude Code

Lire `.claude/` pour remplir cette section :

```bash
ls .claude/skills/     # lister les compétences actives → documenter les commandes slash
ls .claude/agents/     # lister les agents → documenter quand utiliser chaque agent
cat .claude/settings.json  # serveurs MCP, hooks, approbations automatiques
```

Formater sous forme de table de référence rapide :

| Commande slash | Ce qu'elle fait |
|---|---|
| `/graphql-client` | Configurer Apollo Client avec codegen |
| `/db-specialist` | Déléguer l'optimisation complexe des requêtes à l'agent DB |
| `/pr-review` | Exécuter la révision PR automatisée avant la fusion |

## Exemple

Exécuter `/team-onboarding` sur un projet Next.js + Drizzle + Vercel.

Claude lit : `package.json` (Next.js 15, Drizzle ORM 0.30, TypeScript 5.4), `docker-compose.yml` (PostgreSQL 16 sur le port 5432), `.env.example` (DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY), `Makefile` (targets dev, test, migrate, seed), `.github/workflows/deploy.yml` (aperçu Vercel sur PR, production sur fusion vers main), `CLAUDE.md` (stratégie de fusion squash, commits conventionnels, PR nécessite 1 approbation).

`docs/onboarding.md` généré incluant :

```markdown
# Acme App — Intégration des développeurs

> SaaS B2B pour la gestion des factures — frontend Next.js 15, backend Drizzle ORM + PostgreSQL, déployé sur Vercel.

## Prérequis
- Node.js 20+
- Docker Desktop (pour PostgreSQL local)
- Vercel CLI : `npm i -g vercel`

## Configuration locale
\`\`\`bash
git clone git@github.com:org/acme-app.git
cd acme-app
npm install
cp .env.example .env.local        # remplir DATABASE_URL et NEXTAUTH_SECRET
docker compose up -d               # démarre PostgreSQL sur localhost:5432
npm run db:migrate                 # appliquer toutes les migrations
npm run db:seed                    # charger les fixtures de dev
npm run dev                        # http://localhost:3000
\`\`\`

## Tech Stack
| Couche | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.0 |
| Langage | TypeScript | 5.4.5 |
| ORM | Drizzle ORM | 0.30.9 |
| Base de données | PostgreSQL | 16 |
| Auth | NextAuth.js | 5.0.0-beta |
| Email | Resend | 3.2.0 |
| Déploiement | Vercel | — |

...
```

Le document complet s'exécute sur ~3 pages et couvre tout du premier clone au premier PR fusionné.

---
