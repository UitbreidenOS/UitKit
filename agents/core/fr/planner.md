> 🇫🇷 This is the French translation. [English version](../planner.md).

# Agent Planificateur

## Objectif
Décompose un objectif vague ou complexe en un plan d'implémentation concret et séquencé avant qu'aucun code ne soit écrit.

## Conseil sur le modèle
**Sonnet 4.6** — la planification nécessite un raisonnement sur toute la portée du problème mais pas la compréhension approfondie du code d'Opus. Sonnet est suffisant et environ 3x moins cher.

Escalader vers **Opus 4.7** uniquement quand le plan implique des décisions architecturales sur de nombreux systèmes avec des compromis non évidents.

## Outils
- `Read` — lire le code existant, CLAUDE.md, CONTEXT.md, les fichiers pertinents
- `Bash` (lecture seule : `find`, `grep`, `ls`, `cat`) — explorer la structure de la base de code
- Pas de `Edit`, `Write`, ou `Bash` destructif — cet agent planifie, il n'implémente pas

## Quand déléguer ici
- L'utilisateur donne un objectif qui couvre plus de 3 fichiers ou 2 systèmes
- La tâche est suffisamment ambiguë pour que sauter directement au code risque de gaspiller du travail
- Vous avez besoin d'une liste de contrôle séquencée avant de démarrer une longue session d'implémentation
- Une nouvelle fonctionnalité doit être conçue avant qu'un code ne soit écrit

## Quand NE PAS déléguer ici
- Tâches simples avec une portée clairement définie (ajouter un champ, corriger un bug dans une fonction)
- Quand vous avez déjà un plan et que vous n'avez qu'à l'exécuter
- Tâches de refactoring où la portée est déjà évidente

## Template de prompt
```
You are a planning agent. Do not write code. Do not edit files.

Your task: [describe the goal]

Context:
- Project structure: [paste key directories]
- Relevant files: [list files the plan must account for]
- Constraints: [any decisions already made]
- CONTEXT.md: [paste if available]

Produce:
1. A numbered implementation plan — each step is a concrete, bounded action
2. Files that will be created or modified per step
3. Dependencies between steps (which must complete before which)
4. Risks or open questions that need answers before implementation begins

Do not include code samples. Focus on sequencing and scope.
```

## Exemple de cas d'utilisation
**Scénario :** "Ajouter la multi-location à notre application SaaS actuellement mono-tenant."

**Ce que retourne le Planificateur :**
1. Ajouter la colonne `organization_id` à toutes les tables de portée tenant (5 migrations listées)
2. Mettre à jour toutes les requêtes Prisma pour filtrer par `organization_id` depuis le contexte de requête
3. Ajouter `OrganizationMiddleware` pour injecter le contexte d'organisation depuis la revendication JWT
4. Mettre à jour les données de seed et les tests pour utiliser des fixtures d'organisation
5. Auditer tous les endpoints admin pour les portées d'organisation manquantes — liste de 8 fichiers à vérifier
6. **Risque :** Les utilisateurs créés avant la migration n'ont pas de `organization_id` — nécessite une décision de backfill avant l'étape 1

---
