# Guide AGENTS.md

AGENTS.md est un compagnon de CLAUDE.md — il rend vos instructions de projet portables sur tous les assistants de codage IA, pas seulement Claude Code.

## Qu'est-ce qu'AGENTS.md?

Alors que `CLAUDE.md` est spécifique à Claude Code, `AGENTS.md` est une convention communautaire pour la compatibilité inter-agents. Le même projet peut être utilisé avec :
- Claude Code (`CLAUDE.md`)
- Cursor (lit `AGENTS.md` ou `cursor.md`)
- OpenAI Codex CLI
- Gemini CLI
- Tout agent suivant la convention AGENTS.md

## CLAUDE.md vs AGENTS.md

| | CLAUDE.md | AGENTS.md |
|---|---|---|
| **Le lit** | Claude Code uniquement | Claude Code + Cursor + Codex + autres |
| **Localisation** | Racine du projet | Racine du projet |
| **Priorité Claude Code** | Principale | Secondaire (CLAUDE.md a la priorité) |
| **Format** | Markdown | Markdown |
| **Objectif** | Contexte spécifique à Claude | Contexte d'agent universel |

## Création d'AGENTS.md

Gardez-le concentré sur ce que n'importe quel assistant de codage IA doit être efficace sur votre projet — pas de fonctionnalités spécifiques à Claude :

```markdown
# AGENTS.md

## Vue d'ensemble du projet
[2-3 phrases : ce que ce projet fait, qui il sert]

## Pile technologique
- Langage : [TypeScript 5.4]
- Framework : [Next.js 15, App Router]
- Base de données : [PostgreSQL via Drizzle ORM]
- Auth : [Better Auth]
- Déploiement : [Railway]

## Commandes
- Dev : `npm run dev`
- Tests : `npm test`
- Build : `npm run build`
- Lint : `npm run lint`
- Migration DB : `npx drizzle-kit migrate`

## Répertoires clés
- `src/app/` — pages Next.js App Router
- `src/components/` — composants UI partagés
- `src/lib/` — utilitaires et aides
- `src/db/` — schéma et requêtes de base de données

## Conventions de codage
- Mode TypeScript strict — pas d'`any`
- Composants serveur par défaut ; `use client` uniquement si nécessaire
- Commits conventionnels : feat/fix/chore/docs/refactor
- Tests obligatoires pour la nouvelle logique métier

## Ne pas modifier
- `src/db/schema.ts` — coordonnez les changements de schéma avec l'équipe
- `.env.example` — mettez à jour lors de l'ajout de nouvelles variables env
- `src/middleware.ts` — coordonnez les changements d'authentification

## Tâches courantes
- Ajout d'une route API : créez `src/app/api/[name]/route.ts`
- Ajout d'un composant : créez dans `src/components/[name].tsx`
- Requête de base de données : ajoutez à `src/db/queries/[entity].ts`
```

## Quoi inclure vs. exclure

**Inclure :**
- Commandes de construction et de test
- Structure des répertoires et objectif
- Conventions de codage qui s'appliquent à tous les agents
- Fichiers qui ne doivent pas être modifiés sans coordination

**Exclure :**
- Fonctionnalités spécifiques à Claude Code (hooks, agents, `/skills`) → mettez dans CLAUDE.md
- Secrets ou identifiants → jamais dans aucun fichier suivi
- Choses déjà évidentes du code

## Génération automatique d'AGENTS.md

Demandez à Claude Code de le générer :

```
"Lire le projet et générer un fichier AGENTS.md.
Concentrez-vous sur : pile technologique, répertoires clés, commandes, conventions et ce qu'il ne faut pas toucher.
Gardez-le sous 80 lignes — assez concis pour que n'importe quel agent le lise entièrement."
```

## Le garder synchronisé

AGENTS.md doit être mis à jour lorsque :
- La pile technologique change (mise à jour du framework, nouveau service)
- De nouveaux développeurs ou agents rejoignent le projet
- Les répertoires clés sont restructurés
- Les commandes changent (runner de test, processus de compilation)

Ajouter un rappel dans votre CLAUDE.md :
```markdown
## Maintenance
Lors du changement de pile technologique ou de commandes : mettez à jour CLAUDE.md et AGENTS.md
```

## Relation avec CLAUDE.md

Un projet typique a les deux :
- **AGENTS.md**: contexte universel (80 lignes, concentré sur ce que tout agent a besoin)
- **CLAUDE.md**: additions spécifiques à Claude (hooks à charger, agents à utiliser, modèles spécifiques à Claude Code)

CLAUDE.md peut référencer AGENTS.md :
```markdown
# CLAUDE.md

Voir AGENTS.md pour vue d'ensemble du projet, pile et commandes.

## Spécifique à Claude Code
- Charger /skills/backend/nodejs/nextjs au démarrage de la session
- Exécuter /ship-gate avant tout déploiement en production
- Utiliser /agents/advisors/cto-advisor pour les questions d'architecture
```

---
