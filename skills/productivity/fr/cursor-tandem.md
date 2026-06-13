# Workflow Cursor + Claude Code en Tandem

## Quand activer
L'utilisateur utilise à la fois Cursor et Claude Code et demande comment les utiliser ensemble efficacement ; l'utilisateur mentionne le passage entre l'IDE et le terminal avec IA ; l'utilisateur veut savoir quel outil utiliser pour une tâche donnée quand les deux sont disponibles.

## Quand ne PAS utiliser
L'utilisateur n'a qu'un des deux outils ; l'utilisateur pose une question sur un outil isolément sans référence à l'autre ; l'utilisateur veut une comparaison pour décider quel outil acheter.

## Instructions

**Rôles des outils — gardez-les distincts :**

- **Cursor** = IDE intelligent. Autocomplétion en ligne, chat multi-fichiers, recherche de codebase, éditions rapides, écriture de composants, examen des diffs, exploration de code inconnu.
- **Claude Code** = agent autonome en terminal. Exécute des commandes shell, orchestre les sous-agents, gère les tâches multi-étapes sur plusieurs fichiers, fait des commits, configure l'infrastructure.

**Routage des tâches — quel outil pour quel travail :**

Bonnes tâches Cursor :
- Écrire de nouveaux composants ou fonctions
- Examiner un diff avant de le commit
- Explorer une codebase inconnue pour comprendre la structure
- Renommages rapides et refactorisations locales
- Documentation en ligne

Bonnes tâches Claude Code :
- Exécuter la suite de tests complète, puis corriger les défaillances
- Refactorisations à grande échelle sur 20+ fichiers
- Configurer GitHub Actions, Dockerfiles, ou configs CI/CD
- Migrations de bases de données
- Tout ce qui nécessite des commandes bash ou l'orchestration de sous-agents
- Génération de features end-to-end du spec au PR

**Contexte partagé via CLAUDE.md :**
Les deux outils lisent `CLAUDE.md`. Écrivez vos conventions, règles de nommage, décisions architecturales et préférences une fois — les deux outils les respectent automatiquement. C'est le point d'intégration le plus important.

**Règle critique — ne laissez jamais les deux éditer le même fichier simultanément.** Cela provoque des conflits git que ni l'un ni l'autre ne peut résoudre proprement. Finissez la tâche Claude Code, commitez, puis ouvrez dans Cursor.

**Modèle de handoff :**
1. Claude Code exécute la tâche multi-étapes → commit le résultat
2. Vous ouvrez le commit dans Cursor pour affinage, revue de code, ou polissage
3. Les éditions Cursor vont dans un commit de suivi

**Modèle d'utilisation parallèle :**
Exécutez Claude Code en arrière-plan sur une tâche longue (suite de tests, migration, build) tandis que vous travaillez dans Cursor sur des fichiers non liés. Claude Code rapporte quand c'est fait sans bloquer votre workflow d'éditeur.

## Exemple

"J'utilise Cursor pour écrire des composants React et explorer la codebase. Je bascule vers le terminal Claude Code quand j'ai besoin de : exécuter la suite de tests complète, refactoriser sur 30 fichiers, configurer GitHub Actions, ou faire une migration de base de données. `CLAUDE.md` contient nos conventions partagées — les deux outils les récupèrent automatiquement sans configuration supplémentaire."

---
