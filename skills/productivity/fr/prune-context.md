---
name: prune-context
description: "Nettoyeur de contexte Claude Code : commande slash pour résumer la session et réinitialiser l'encombrement des jetons"
updated: 2026-06-19
---

# Nettoyeur de Contexte (Context Pruner)

## Quand l'activer
À activer lorsque l'utilisateur exécute la commande `/prune-context`, ou lorsque la consommation de jetons de session est élevée, ou encore lorsque la fenêtre de contexte devient surchargée au cours d'une longue session.

## Quand ne PAS l'utiliser
Ne pas utiliser au début d'une session, ni pour des requêtes simples ne nécessitant pas de persistance d'état ou de réduction de contexte.

## Instructions
1. Mettez en pause les tâches en cours et passez en revue l'historique des conversations de la session active.
2. Résumez la session dans un état hautement condensé et économe en jetons :
   - **Objectif actif** : L'objectif de haut niveau actuel sur lequel vous travaillez.
   - **Terminé dans la session** : Une liste à puces concise des modifications, tests et fichiers complétés.
   - **Contexte architectural clé** : Détails cruciaux du projet, des API ou des fichiers découverts au cours de la session.
   - **Étapes suivantes** : Liste de contrôle explicite de ce qui doit être fait ensuite.
3. Écrivez ce résumé dans `.claude/pruned_context.md`.
4. Affichez le résumé dans le chat pour que l'utilisateur puisse le voir.
5. Invitez l'utilisateur à exécuter la commande `/clear` pour réinitialiser la fenêtre de contexte et éliminer l'encombrement des jetons.
6. Fournissez la commande ou le texte qu'il doit saisir après la réinitialisation pour reprendre : *"Veuillez exécuter `/clear` maintenant pour réinitialiser la mémoire. Une fois effacé, dites-moi : 'Resume from `.claude/pruned_context.md`' pour restaurer cet état."*

## Exemple
Utilisateur : `/prune-context`
Claude :
Démarrage du nettoyage du contexte pour réduire la consommation de jetons.
[Claude écrit le résumé dans .claude/pruned_context.md]

### Instantané de la Session Actuelle
- **Objectif actif** : Restructurer la documentation du README et ajouter des règles d'arrêt immédiat (fail-fast).
- **Terminé** : Création de `rules/common/fail-fast.md` et de `hooks/post-tool-use/fail-fast.sh`.
- **Contexte clé** : Le compilateur est lancé via `npm test` et nécessite une configuration spécifique de l'auteur git.
- **Étapes suivantes** : Implémenter le crochet pre-tool-use Plan-First.

État enregistré dans `.claude/pruned_context.md`.
Veuillez exécuter `/clear` maintenant pour réinitialiser la mémoire et éliminer l'encombrement des jetons. Une fois effacé, dites-moi : `Resume from .claude/pruned_context.md` pour restaurer cet état.
