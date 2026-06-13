---
name: btw-side-question
description: "Questions latérales sans rupture de flux : poser une question rapide en milieu de session sans qu'elle n'apparaisse dans l'historique de la conversation"
---

# /btw — Questions latérales sans rupture de flux

## Quand activer
- L'utilisateur veut poser une question rapide en milieu de session sans qu'elle n'apparaisse dans l'historique de la conversation
- L'utilisateur veut chercher quelque chose pendant que Claude travaille activement, sans interrompre la tâche principale
- L'utilisateur demande comment poser une question latérale, vérifier quelque chose tranquillement, ou obtenir une réponse ponctuelle sans polluer le contexte
- L'utilisateur veut utiliser la commande `/btw` ou demande comment utiliser le panneau de chat latéral
- L'utilisateur veut vérifier un nom, un chemin, une variable, une branche ou une valeur de config en milieu de tâche sans dérailler la conversation

## Quand ne PAS utiliser
- La question nécessite l'accès aux outils (lectures de fichiers, commandes Bash, recherche Web) — les réponses `/btw` n'ont pas accès aux outils
- La réponse doit influencer ce que Claude fait ensuite dans la conversation principale — utiliser une invite régulière pour que la réponse atterrisse dans le contexte
- L'utilisateur souhaite une discussion latérale multi-tour — `/btw` est une réponse unique, pas un fil de conversation
- L'utilisateur est sur l'interface Web Claude — `/btw` est une fonctionnalité CLI uniquement

## Instructions

### Utilisation de base

```
/btw <question>
```

La question voit le contexte complet de la conversation — tout ce que Claude sait sur la session actuelle est disponible. La réponse apparaît comme une superposition. Elle ne laisse aucune trace dans l'historique du chat : pas de message utilisateur, pas de message assistant, rien. Une fois rejetée, elle a disparu.

**Rejeter la superposition:** Appuyez sur Espace, Entrée ou Échap.

**Équivalent de bureau:** `Cmd+;` ouvre un panneau de chat latéral avec le même comportement.

### Ce que /btw peut et ne peut pas faire

| Capability | Available |
|---|---|
| Full conversation context | Yes |
| Prompt cache reuse | Yes (very low cost) |
| Tool access (Read, Bash, etc.) | No |
| Multi-turn exchange | No |
| Persists in history | No |
| Works during active Claude turn | Yes — non-blocking overlay |

### Coût

`/btw` réutilise le cache d'invite de la conversation actuelle. Le coût supplémentaire est les jetons de sortie pour la réponse uniquement — pas de réencodage du contexte. Pour les questions rapides, c'est effectivement négligeable.

### Bonnes questions pour /btw

- "Comment s'appelait cette variable de config déjà?"
- "Sur quelle branche suis-je dans cette session?"
- "Quel était le nom du fichier que nous avons refactorisé plus tôt?"
- "Rappelle-moi le nom de la variable d'env du webhook Stripe dans ce projet."
- "À quoi `OTEL_EXPORTER_OTLP_ENDPOINT` par défaut?"
- "Explique ce que fait le décorateur que nous avons ajouté plus tôt — version rapide."
- "Quel était le message d'erreur du test qui a échoué?"
- "Combien de fichiers avons-nous modifiés jusqu'à présent?"

### Questions qui appartiennent à la conversation principale

- "Lire `config/database.yml` et me dire la taille du pool de connexion." — nécessite l'outil Read
- "Que montre `git log --oneline -10`?" — nécessite Bash
- "Maintenant que vous savez X, mettez à jour l'approche." — la réponse doit influencer l'action suivante de Claude

## Exemple

**Scénario:** Claude est en milieu d'extraction d'une classe de service. Vous lisez le fichier original sur un deuxième moniteur et ne pouvez pas vous souvenir du nom d'interface convenu plus tôt dans la session.

Au lieu de taper un message (qui apparaîtrait dans l'historique et pourrait potentiellement distraire Claude de son travail actuel), vous tapez :

```
/btw comment avons-nous nommé la nouvelle interface pour l'abstraction du processeur de paiement?
```

Claude répond dans une superposition :

```
PaymentGateway — défini dans la section interfaces autour du tour 12.
```

Appuyez sur Espace pour rejeter. La tâche principale continue sans interruption. Rien n'apparaît dans l'historique de la conversation.

---

**Contraste avec une invite régulière:**

Si vous posiez la même question en tant que message normal, cela :
1. Apparaîtrait dans la conversation en tant que tour utilisateur
2. Pourrait potentiellement interrompre la chaîne de raisonnement actuelle de Claude
3. Resterait dans le contexte pour tous les tours futurs (ajoutant du bruit)
4. Compterait dans l'historique de la conversation qui informe les réponses ultérieures

Pour les recherches pures sans effet aval, `/btw` est le bon outil.

---
