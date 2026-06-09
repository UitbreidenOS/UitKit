---
description: Rédiger un Enregistrement de Décision Architecturale pour une décision technique spécifique
argument-hint: "[decision topic]"
---
Rédiger un Enregistrement de Décision Architecturale (ADR) pour: $ARGUMENTS

Avant de rédiger:
1. Vérifiez l'existence d'un répertoire `docs/decisions/`, `docs/adr/`, ou `adr/` pour déterminer
   la convention de numérotation et le schéma de nommage des fichiers en usage. Respectez-le exactement.
2. Si un modèle d'ADR existe déjà dans le dépôt, utilisez-le. Sinon, utilisez le format ci-dessous.
3. Lisez les fichiers sources pertinents pour fonder les sections "Contexte" et "Conséquences" sur
   du code réel, pas sur des hypothétiques.

Format ADR:

# ADR-NNN: [Titre — syntagme nominal décrivant la décision, pas le problème]

## Statut
Proposé | Accepté | Déprécié | Remplacé par ADR-NNN

## Date
YYYY-MM-DD

## Contexte
Quelle situation, contrainte ou exigence a forcé cette décision?
Incluez: l'échelle, la taille de l'équipe, les contraintes du système existant, les exigences externes.
Restez aux faits — pas d'advocacy ici.

## Décision
Énoncez la décision en une phrase commençant par "Nous allons…".
Ensuite, expliquez le mécanisme: ce qui sera construit, modifié ou adopté, et comment.

## Alternatives Considérées
Pour chaque alternative considérée:
- **Nom de l'option**: ce qu'elle est, pourquoi elle a été considérée, pourquoi elle a été rejetée.
Au moins deux alternatives. Ne listez pas les options qui n'ont jamais été sérieusement considérées.

## Conséquences
**Positives:**
- Bénéfices concrets et vérifiables (performance, simplicité, coût, vélocité de l'équipe).

**Négatives:**
- Vrais compromis acceptés. Ne les minimisez pas.

**Risques:**
- Ce qui pourrait mal tourner. Ce qui déclencherait une révision de cette décision.

## Références
Liens vers les PRs pertinentes, les problèmes, les benchmarks, ou la documentation externe qui a informé la décision.

Règles de rédaction:
- Soyez précis et neutre. Un ADR est un enregistrement historique, pas un discours de vente.
- Écrivez au passé pour les décisions acceptées, au futur pour les décisions proposées.
- Évitez les adjectifs vagues: "simple", "flexible", "scalable" ne signifient rien sans preuve.
- Si $ARGUMENTS est vague, posez une question de clarification avant de procéder: quelle décision
  spécifique doit être enregistrée, et qu'est-ce qui a été choisi?
- Exportez le fichier dans le répertoire ADR correct avec le numéro suivant disponible.
  Confirmez le chemin complet du fichier après l'écriture.
