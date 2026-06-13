# Guide de gestion du contexte

Comment gérer efficacement la fenêtre contextuelle de Claude Code — maintenir les sessions focalisées, prévenir la surcharge contextuelle et maintenir la qualité sur les longues sessions de travail.

## Comprendre la fenêtre contextuelle

Claude Code a une fenêtre contextuelle limitée. À mesure que vous travaillez, la conversation grandit :
- Chaque appel d'outil et son résultat sont ajoutés au contexte
- Chaque lecture de fichier est ajoutée au contexte
- Chaque modification de code est suivie dans le contexte
- Les longues conversations finissent par atteindre les limites et sont résumées automatiquement

**Signes que vous atteignez les limites de contexte :**
- Claude commence à oublier les décisions antérieures
- Les réponses deviennent moins spécifiques à votre projet
- La compaction automatique s'active (résume le contexte antérieur)
- Claude demande des informations qu'il a déjà

## Garder les sessions focalisées

**Une session = une tâche.** N'utilisez pas la même session Claude Code pour plusieurs tâches non liées.

```bash
# Mauvais : une session pour tout
claude
# (construit une fonctionnalité, puis corrige un bug non lié, puis écrit des docs, puis examine une PR)

# Correct : sessions séparées par tâche
claude "implémenter l'authentification utilisateur"  # Session 1
claude "corriger le bug de timeout du paiement"    # Session 2
claude "écrire la documentation API"        # Session 3
```

**Pourquoi :** Le contexte de la tâche 1 pollue la tâche 3. Claude Code fonctionne mieux quand le contexte est pertinent.

## Pré-charger le contexte efficacement

Au lieu de faire découvrir votre codebase à Claude :

```bash
# Ajouter un fichier CLAUDE.md à votre projet
# Claude le lit au démarrage de la session — il devient votre contexte persistant
cat CLAUDE.md
```

Un bon `CLAUDE.md` contient :
- Description du projet (2-3 phrases)
- Répertoires clés et ce qu'ils contiennent
- Conventions importantes (nommage, modèles, décisions)
- Choses À NE PAS modifier sans demander
- Commandes courantes (comment exécuter les tests, construire, etc.)

Cela remplace des douzaines de lectures de fichiers exploratoires avec un chargement de contexte structuré.

## Utiliser la commande `/compact`

Quand une session devient longue :
```
/compact
```

Cela résume la conversation antérieure en une représentation plus courte, libérant l'espace de la fenêtre contextuelle sans perdre les décisions clés et le contexte.

**Utilisez compact quand :**
- Vous avez terminé une sous-tâche majeure dans une session plus longue
- Le contexte semble gonflé avec une exploration qui n'est plus pertinente
- Vous êtes sur le point de commencer une nouvelle phase de travail dans la même session

## Lecture stratégique de fichiers

Claude lit les fichiers dans le contexte — soyez sélectif :

```
# Trop large :
"Lire tous les fichiers du module d'authentification"

# Mieux :
"Lire src/auth/jwt.ts et src/middleware/auth.ts — je veux comprendre l'implémentation JWT"
```

Demandez à Claude de résumer les fichiers plutôt que de les lire quand vous avez besoin de compréhension :
```
"Sans lire le fichier, basé sur son nom et les imports que vous pouvez voir, que fait probablement src/services/email.ts?"
```

## Worktrees pour l'isolation à long terme

Pour les tâches qui s'étendent sur des jours, utilisez les arbres de travail git :
```bash
git worktree add ../project-feature feature/my-feature
cd ../project-feature
claude "travailler sur la fonctionnalité d'authentification utilisateur"
```

Chaque arbre de travail = sa propre session Claude Code avec son propre contexte propre.

## La compétence `/lean-claude`

Chargez `/lean-claude` au début de toute session pour activer le mode efficace en jetons :
- Réponses plus courtes et plus précises
- Moins d'informations répétées
- Réponses directes sans préambule

```bash
npx claudient add skills productivity
# Puis dans Claude Code :
/lean-claude
```

## Récupérer d'une session obsolète

Si Claude perd la trace du contexte antérieur :

1. **Redémarrer avec une invite de résumé :**
   ```
   "Laissez-moi vous rattraper sur ce que nous avons fait. [Résumé des décisions clés, état actuel, ensuite]"
   ```

2. **Utiliser `/compact`** pour condenser et refocaliser

3. **Commencer à nouveau avec le contexte pré-chargé :**
   ```bash
   # Terminer la session, en commencer une nouvelle
   claude "Je continue à travailler sur [fonctionnalité]. Voici le contexte : [bref résumé]. L'état actuel est [décrire]. L'étape suivante est [tâche spécifique]."
   ```

## Stratégies contextuelles multi-fichiers

Quand travail sur plusieurs fichiers :

```
# Au lieu de : "lire les 15 fichiers de ce module"
# Faire : "Je vais travailler sur le module des paiements. Les fichiers clés sont payments.service.ts (gère la logique de charge), payments.controller.ts (routes), et payments.dto.ts (types). Lire d'abord uniquement ces trois."
```

Puis lire des fichiers supplémentaires au besoin seulement, pas de manière spéculative.

## Conscience des coûts tokenisés

Contexte plus long = coût par demande plus élevé. Stratégies pour réduire les coûts :
- Utiliser `/lean-claude` pour le mode économe en jetons
- Diviser les grandes tâches en sessions focalisées multiples
- Éviter de relire les fichiers qui n'ont pas changé
- Utiliser `CLAUDE.md` pour pré-charger le contexte stable à bas prix

---
