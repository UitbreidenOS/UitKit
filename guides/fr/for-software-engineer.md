# Claude pour les Ingénieurs Logiciels

Tout ce dont un Ingénieur Logiciel ou un Développeur Full-Stack a besoin pour exécuter le développement de fonctionnalités, la revue de code, le débogage, la documentation d'architecture et la prise de décision technique augmentés par l'IA dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes ingénieur logiciel, développeur full-stack ou responsable technique dont le travail consiste à livrer du code fiable — concevoir des systèmes, développer des fonctionnalités, réviser des PRs, corriger des bugs et empêcher la dette technique de s'accumuler. Vous passez trop de temps à changer de contexte entre les outils, à écrire du code générique et à générer manuellement de la documentation. Claude Code réduit cette charge de 20 à 40 fois.

**Avant Claude Code :** 45 minutes pour réviser une PR complexe. 2 heures pour déboguer un problème de production sans stack trace évidente. Les décisions d'architecture documentées des semaines plus tard, si tant est qu'elles le soient. L'intégration d'un nouveau coéquipier prend une semaine entière.

**Après :** PR révisée avec des commentaires inline en moins de 5 minutes. Cause racine identifiée en une session de débogage. ADRs rédigés au moment de la décision. Document d'intégration généré à partir du code source en 30 secondes.

---

## Installation en 30 secondes

```bash
# Installer les ensembles de compétences par discipline
npx claudient add skills backend
npx claudient add skills devops-infra
npx claudient add skills ai-engineering
npx claudient add skills database
npx claudient add skills productivity

# Ou choisir à la carte :
npx claudient add skill backend/next-js
npx claudient add skill backend/fastapi
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/pr-review
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/ship-gate
npx claudient add skill productivity/tech-debt-tracker
npx claudient add skill ai-engineering/claude-api
npx claudient add skill ai-engineering/rag-architect
npx claudient add skill ai-engineering/mcp-server-builder
npx claudient add skill database/drizzle
npx claudient add skill database/postgres
```

---

## Votre stack d'ingénierie Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/next-js` | Scaffolding Next.js App Router, patterns RSC, routage, routes API, server actions | Construire ou étendre des applications Next.js |
| `/fastapi` | Génération d'endpoints FastAPI, schémas Pydantic, injection de dépendances, tâches en arrière-plan | Développement d'API Python |
| `/docker` | Rédaction de Dockerfile, builds multi-étapes, fichiers Compose, optimisation d'images | Conteneurisation de services |
| `/kubernetes` | Génération de manifestes, stratégies de déploiement, revue de charts Helm, limites de ressources | Configuration K8s et revues de déploiement |
| `/terraform` | Modules d'infrastructure-as-code, revue de plan, guidance sur la gestion de l'état | Provisionnement d'infrastructure cloud |
| `/code-review` | Revue approfondie de la correction : bugs, erreurs logiques, cas limites, problèmes de sécurité | Réviser votre propre code avant de pousser |
| `/debug` | Analyse systématique de la cause racine — stack traces, logs, hypothèses, étapes de reproduction | Tout bug qui n'est pas évident en 10 minutes |
| `/refactor` | Refactorisation structurée avec un diff avant/après et analyse de l'impact sur les tests | Nettoyer le code sans casser le comportement |
| `/pr-review` | Résumé de PR, évaluation du risque, génération de commentaires inline, recommandation de merge | Réviser les PRs entrantes |
| `/adr-writer` | Génération d'Architecture Decision Record à partir d'un contexte et d'une décision | Documenter les choix architecturaux au moment de la décision |
| `/ship-gate` | Checklist pré-merge : tests, couverture, sécurité, performance, docs | Vérification finale avant le merge vers main |
| `/tech-debt-tracker` | Identifier, catégoriser et prioriser la dette technique à travers un code source | Sessions trimestrielles de planification de la dette |
| `/claude-api` | Intégration de l'API Claude et du SDK Anthropic avec mise en cache des prompts, utilisation d'outils, streaming | Construire des fonctionnalités sur Claude |
| `/rag-architect` | Conception de pipeline RAG : chunking, embeddings, récupération, reranking | Construire des fonctionnalités de récupération de connaissances |
| `/mcp-server-builder` | Scaffold et câblage d'un serveur Model Context Protocol | Étendre Claude avec des outils personnalisés |
| `/drizzle` | Conception de schéma Drizzle ORM, migrations, génération de requêtes, relations | Travail de base de données TypeScript |
| `/postgres` | Optimisation de requêtes, conception de schéma, stratégie d'indexation, analyse EXPLAIN | Travail de base de données PostgreSQL |

### Agents

| Agent | Modèle | Quand l'invoquer |
|---|---|---|
| `core/architect` | Opus | Décisions de conception système, architecture inter-services, refactorisations majeures |
| `core/code-reviewer` | Sonnet | Revue approfondie de PR, audits de correction, vérification logique |
| `core/security-reviewer` | Sonnet | Audits de sécurité, revue de dépendances, modélisation des menaces |
| `core/planner` | Sonnet | Découpage des epics en tâches, planification de sprint, estimation |
| `roles/senior-backend` | Sonnet | Implémentation backend, conception d'API, optimisation des performances |
| `roles/senior-frontend` | Sonnet | Implémentation UI/UX, architecture de composants, accessibilité |
| `roles/fullstack-developer` | Sonnet | Fonctionnalités couvrant le frontend et le backend avec des types partagés |
| `build-resolvers/typescript-resolver` | Haiku | Erreurs de compilation TypeScript, échecs d'inférence de type, problèmes de tsconfig |
| `build-resolvers/python-resolver` | Haiku | Erreurs d'import Python, conflits de dépendances, problèmes d'environnement virtuel |

---

## Workflow quotidien

### Matin — chargement du contexte (10-15 minutes)

**1. S'orienter sur ce qui a changé pendant la nuit**
```
/pr-review

Listez toutes les PRs ouvertes sur main. Pour chacune :
- Résumé d'une ligne de ce qu'elle fait
- Évaluation du risque (faible / moyen / élevé)
- Si elle nécessite ma revue aujourd'hui
```

**2. Charger le contexte sur votre branche de fonctionnalité actuelle**
```
/adr-writer

Je reprends le travail sur [nom de la fonctionnalité].
Voici le diff de la branche : [collez git diff ou décrivez l'état]

Résumez ce qui a été décidé, ce qui est encore ouvert,
et signalez toute décision que je dois prendre avant d'écrire plus de code.
```

---

### Développement de fonctionnalités (continu)

**3. Scaffolding d'un nouvel endpoint ou composant**
```
/fastapi

Ajoutez un endpoint POST /api/v1/documents/ingest :
- Auth : Bearer token, valider contre la table users
- Body : { source_url: str, metadata: dict }
- Tâche en arrière-plan : récupérer le contenu, chunker, embedder, stocker dans pgvector
- Réponse : { job_id: uuid, status: "queued" }

Utilisez le pattern d'injection de dépendances existant dans app/dependencies.py.
```

**4. Réviser votre propre code avant de pousser**
```
/code-review

[collez le diff ou décrivez le fichier]

Vérifiez :
- Bugs de correction et cas limites
- Risques d'injection SQL ou de contournement d'auth
- Requêtes N+1 ou index manquants
- Gestion des erreurs manquante
- Toute logique qui se cassera sous la concurrence
```

---

### Revue de PR (5-10 minutes par PR)

**5. Réviser une PR entrante**
```
/pr-review

PR : [titre ou lien]
Auteur : [nom]
Diff :
[collez le diff]

Donnez-moi :
- Ce que fait cette PR en 2-3 phrases
- Évaluation du risque et pourquoi
- Tout bug ou problème de correction
- Les commentaires inline que je devrais poster
- Recommandation de merge
```

---

### Débogage (à la demande)

**6. Diagnostiquer un bug systématiquement**
```
/debug

Erreur :
[collez la stack trace ou décrivez le symptôme]

Contexte :
- Environnement : [production / staging / local]
- Quand ça a commencé : [déploiement, changement de config, événement de données]
- Fréquence : [à chaque requête / intermittent / sous charge]
- Ce que j'ai déjà vérifié : [liste]

Guidez-moi à travers l'isolation de la cause racine étape par étape.
```

---

### Architecture et documentation

**7. Documenter une décision au moment de la prendre**
```
/adr-writer

Décision : Passer de REST à tRPC pour la communication interne entre services
Contexte : Nous avons 4 services partageant des types TypeScript. REST génère de la dérive.
Alternatives considérées : GraphQL, gRPC, REST simple avec un package de types partagés
Décision : tRPC — même langage, zéro dérive de schéma, sécurité des types de bout en bout
Conséquences : L'équipe frontend doit mettre à jour, tous les clients REST existants dépréciés

Rédigez l'ADR en format standard.
```

**8. Session hebdomadaire de dette technique**
```
/tech-debt-tracker

Scannez les fichiers/répertoires suivants pour détecter la dette technique :
[collez la liste de fichiers ou décrivez la zone]

Catégorisez par :
- Risque de correction (est-ce que ça va casser ?)
- Frein à la vélocité (est-ce que ça ralentit le développement ?)
- Exposition sécurité
- Coût de maintenance

Produisez une entrée de backlog priorisée pour chaque élément.
```

---

## Plan d'intégration sur 30 jours (ingénieurs nouveaux à Claude Code)

### Semaine 1 — Installation et premières victoires
- Installer tous les ensembles de compétences : `npx claudient add skills backend devops-infra productivity`
- Configurer GitHub MCP (voir les intégrations d'outils ci-dessous)
- Exécuter `/pr-review` sur les 5 dernières PRs mergées dans votre dépôt — calibrez-vous aux patterns de votre code source
- Utiliser `/debug` sur le dernier bug que vous avez résolu manuellement — voyez ce qu'il aurait détecté plus rapidement
- Utiliser `/code-review` sur votre prochaine PR avant de pousser — trouvez au moins un problème que vous auriez manqué

### Semaine 2 — Intégration au workflow quotidien
- Commencer chaque matin avec un scan de la file de PR en utilisant `/pr-review`
- Utiliser `/fastapi` ou `/next-js` pour chaque nouvel endpoint ou scaffold de page — plus de syndrome de la page blanche
- Rédiger votre premier ADR avec `/adr-writer` — toute décision prise cette semaine est éligible
- Exécuter `/ship-gate` sur votre prochaine PR avant de demander une revue

### Semaine 3 — Automatisation plus profonde
- Configurer le hook Sentry (voir les intégrations d'outils ci-dessous) pour que le contexte des bugs arrive automatiquement dans Claude
- Exécuter `/tech-debt-tracker` sur la zone du code source que vous possédez
- Utiliser `core/architect` pour toute décision de conception impliquant plus de 2 services
- Invoquer `build-resolvers/typescript-resolver` pour la prochaine erreur de build TypeScript — arrêtez de lire le texte rouge manuellement

### Semaine 4 — Levier d'équipe
- Exécuter `/pr-review` sur chaque PR avant d'approuver — postez les commentaires inline générés par Claude directement
- Utiliser `core/planner` pour décomposer votre prochain epic en une liste de tâches dimensionnée pour un sprint
- Planifier une session trimestrielle de dette technique avec `/tech-debt-tracker` sur l'ensemble du dépôt
- Mesurez : suivez le temps de revue de PR, le temps de résolution des bugs et la couverture de documentation avant et après

---

## Intégrations d'outils

### GitHub MCP (recommandé)

```json
// Ajouter à ~/.claude/settings.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Avec cette connexion, Claude peut :
- Lire les diffs de PR, les commentaires et les fils de revue sans copier-coller
- Poster des commentaires de revue inline directement sur GitHub
- Lire les descriptions de tickets et les lier aux modifications de code
- Vérifier le statut CI et faire remonter la sortie des tests échoués

### Jira / Linear MCP

```json
// Linear — ajouter à ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Avec cette connexion, Claude peut :
- Lire les descriptions de tickets lors de la planification de l'implémentation
- Mettre à jour le statut des tickets et ajouter des notes d'ingénierie
- Lier les PRs aux tickets automatiquement pendant les sessions `/pr-review`
- Générer des résumés de sprint à partir des tickets terminés

### Hook Sentry (contexte de bug automatisé)

Configurez un hook qui achemine le contexte d'alerte Sentry dans Claude avant une session `/debug` :

```json
// Ajouter à .claude/settings.json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "sentry",
        "command": "python .claude/hooks/sentry-context.py"
      }
    ]
  }
}
```

Le hook récupère l'événement Sentry complet — stack trace, breadcrumbs, tags, utilisateurs affectés — et le préfixe automatiquement à votre session `/debug`. Pas de copier-coller manuel depuis le tableau de bord Sentry.

---

## Benchmarks

Ce sont des résultats observés auprès d'équipes d'ingénierie utilisant la stack Claudient complète. Les résultats individuels varient selon la complexité du code source et l'adoption du workflow.

| Métrique | Avant Claude Code | Après Claude Code |
|---|---|---|
| Temps de revue de PR (moyen) | 35-50 min | 5-8 min |
| Temps de résolution des bugs (P2) | 2-4 heures | 25-45 min |
| Couverture des ADRs (décisions documentées) | 20-30% | 85-95% |
| Temps pour scaffolding d'un nouvel endpoint | 20-30 min | 3-5 min |
| Temps d'intégration (nouvel ingénieur à la première PR) | 5-7 jours | 2-3 jours |
| Éléments de backlog de dette technique identifiés/trimestre | 10-20 (manuels) | 60-100 (scan automatisé) |
| Temps de résolution des erreurs de build | 15-30 min | 3-8 min |

---

## Ressources

- [Prise en main de Claude Code](./getting-started.md)
- [Configuration GitHub MCP](../mcp/github.md)
- [Configuration Jira MCP](../mcp/jira.md)
- [Workflow de revue de code](../workflows/code-review.md)
- [Compétence rédacteur d'ADR](../skills/productivity/adr-writer.md)
- [Compétence architecture RAG](../skills/ai-engineering/rag-architect.md)
- [Compétence constructeur de serveur MCP](../skills/ai-engineering/mcp-server-builder.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
