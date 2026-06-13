# Patterns de conception de sous-agents

Comment structurer les tâches multi-agents dans Claude Code pour le parallélisme, la correction et l'efficacité des coûts. Chaque pattern ci-dessous présente un profil d'utilisation, un diagramme textuel, des conseils d'implémentation et les erreurs courantes à éviter.

---

## Comprendre les sous-agents dans Claude Code

Quand Claude Code lance un sous-agent, il utilise l'outil `Agent` pour démarrer une instance Claude séparée avec sa propre fenêtre de contexte. L'agent parent continue à s'exécuter (ou attend, selon le pattern). Les sous-agents peuvent utiliser des outils, lire des fichiers, écrire des fichiers et renvoyer des résultats au parent.

Contraintes clés :
- Chaque sous-agent a son propre budget de tokens — le fan-out multiplie les coûts linéairement
- Les sous-agents ne peuvent pas partager de mémoire directement — ils communiquent via des fichiers ou des valeurs de retour
- Le lancement est asynchrone par défaut ; le parent peut attendre les résultats ou continuer
- Les permissions d'outils s'appliquent à chaque sous-agent indépendamment

---

## Pattern 1 : Fan-Out

**Dispatcher N agents simultanément, agrégation des résultats.**

```
Parent
  ├── Agent A (traite la partition 1)
  ├── Agent B (traite la partition 2)
  ├── Agent C (traite la partition 3)
  └── [attente de tous]
        └── Le parent agrège les résultats
```

**Quand l'utiliser :**
- Unités de travail indépendantes qui ne partagent pas d'état
- Traitement d'une liste (fichiers, dépôts, endpoints, cas de test) où chaque élément est autonome
- Toute tâche où l'exécution séquentielle prendrait N× plus longtemps sans bénéfice qualitatif

**Quand NE PAS l'utiliser :**
- Tâches avec état mutable partagé (les écritures de fichiers simultanées causent des conflits)
- Quand les résultats de partition dépendent les uns des autres
- Quand le coût en tokens est un problème et que la qualité par token prime sur la vitesse

**Implémentation :**
```
Lancer 4 agents en parallèle. Chaque agent traite un répertoire de service :
  - Agent 1 : auditer /services/auth/
  - Agent 2 : auditer /services/payments/
  - Agent 3 : auditer /services/notifications/
  - Agent 4 : auditer /services/reporting/

Chaque agent écrit ses conclusions dans /tmp/audit-[service].json.
Après que les 4 agents ont terminé, lire les quatre fichiers et produire un rapport consolidé.
```

**Erreurs courantes :**
- Ne pas donner à chaque agent un chemin de sortie unique (ils s'écrasent mutuellement)
- Lancer plus d'agents que d'unités de travail significatives (un fichier de 3 lignes n'a pas besoin de son propre agent)
- Agréger avant que tous les agents aient terminé (vérifier la présence de tous les fichiers de sortie avant de consolider)

---

## Pattern 2 : Chaîne de validation

**Agent A → gate → Agent B → gate → Agent C. Chaque agent peut bloquer la progression.**

```
Entrée → Agent A → [GATE : réussite/échec ?] → Agent B → [GATE : réussite/échec ?] → Agent C → Sortie
                          │                                        │
                        ARRÊT                                    ARRÊT
                   (correction requise)                    (correction requise)
```

**Quand l'utiliser :**
- Pipelines d'assurance qualité (écriture → révision → approbation)
- Workflows sensibles à la sécurité où une étape non vérifiée est pire qu'aucune étape
- Quand chaque étape produit un artefact transformé dont l'étape suivante a besoin
- Le workflow `workflows/pre-human-review.md` utilise ce pattern

**Quand NE PAS l'utiliser :**
- Quand les étapes sont indépendantes et pourraient s'exécuter en parallèle (utiliser le fan-out à la place)
- Quand tous les agents sont susceptibles de passer (trois agents révisant un changement de deux lignes est une sur-ingénierie)
- Quand le coût de la chaîne complète dépasse le coût d'un seul agent soigneux

**Implémentation :**
```
Chaîne : simplificateur → réviseur de sécurité → réviseur de code

Après chaque agent, vérifier sa sortie pour un signal RÉUSSITE/ÉCHEC avant de lancer le suivant.
Si un agent retourne ÉCHEC, arrêter la chaîne et faire remonter les problèmes.
Ne lancer le prochain agent qu'après une RÉUSSITE explicite.

Ne jamais regrouper la chaîne en un seul appel d'agent — la logique de gate doit être appliquée par le parent.
```

**Erreurs courantes :**
- Définir des gates trop lâchement (chaque agent passe, la chaîne n'apporte aucune valeur)
- Définir des gates trop strictement (un avertissement mineur arrête tout)
- Laisser les agents savoir ce qui vient après eux (ils doivent évaluer indépendamment, sans calibrer par rapport à l'étape suivante)

---

## Pattern 3 : Routage vers spécialistes

**Classifier la tâche, router vers le bon agent expert.**

```
Entrée → Classificateur → décision de routage
                               ├── [type : sécurité]  → Spécialiste sécurité
                               ├── [type : base de données] → Spécialiste BD
                               ├── [type : frontend]  → Spécialiste UI
                               └── [type : inconnu]   → Agent généraliste
```

**Quand l'utiliser :**
- Une file hétérogène de tâches nécessitant des expertises différentes
- Éviter un agent généraliste qui est médiocre dans tout
- Quand les agents spécialistes portent des instructions spécifiques au domaine dont l'agent généraliste ne devrait pas être alourdi

**Quand NE PAS l'utiliser :**
- Tâches qui sont clairement d'un seul type — pas besoin de classifier ce qu'on sait déjà
- Quand le classificateur lui-même est coûteux (classifier un correctif d'une ligne avec un appel Sonnet gaspille des tokens)

**Implémentation :**
```
Étape 1 — Classifier (utiliser Haiku pour réduire les coûts) :
  "Lis cette description de tâche et retourne un seul mot : sécurité | base_de_données | frontend | backend | inconnu"

Étape 2 — Router selon la classification :
  si sécurité          → lancer agents/security-reviewer.md
  si base_de_données   → lancer agents/db-specialist.md
  si frontend          → lancer agents/ui-reviewer.md
  sinon                → lancer agent généraliste

Étape 3 — Retourner le résultat du spécialiste à l'utilisateur.
```

**Erreurs courantes :**
- Utiliser Sonnet ou Opus pour la classification — Haiku classe aussi précisément pour une fraction du coût
- Router vers un spécialiste sans lui donner le contexte complet du classificateur
- Sur-segmenter (10 agents spécialistes pour une application qui n'en a besoin que de 2)

---

## Pattern 4 : Chien de garde

**Un agent moniteur observe et peut intervenir sur un agent travailleur de longue durée.**

```
Agent travailleur ──── mises à jour de progression ───→ Agent chien de garde
       │                                                        │
       │                                                  [surveille pour]
       │                                                  - boucles bloquées
       └── [le chien de garde peut signaler un arrêt] ←── - actions dangereuses
                                                          - dégradation de qualité
```

**Quand l'utiliser :**
- Longues sessions autonomes où dériver est coûteux
- Quand l'agent travailleur utilise des outils avec des effets réels (écriture de fichiers, appels API, déploiements)
- Exécutions nocturnes ou sans surveillance où vous avez besoin d'un disjoncteur

**Quand NE PAS l'utiliser :**
- Tâches courtes (< 5 minutes) — la surcharge du chien de garde ne vaut pas la peine
- Tâches d'exploration en lecture seule où le pire résultat est une mauvaise réponse

**Implémentation :**
```
Lancer le chien de garde avec ces déclencheurs :
  ARRÊT si : le travailleur tente d'écrire dans /etc/, d'exécuter rm -rf, ou d'accéder aux fichiers .env
  AVERTISSEMENT si : le travailleur a fait le même appel d'outil 3+ fois sans progression
  AVERTISSEMENT si : la taille de sortie du travailleur dépasse 50k tokens (probablement en boucle)
  RAPPORT à : la complétion ou l'arrêt de la tâche

Le chien de garde ne peut pas annuler le travailleur directement — il signale au parent, qui décide d'arrêter ou non.
```

**Erreurs courantes :**
- Rendre le chien de garde trop sensible (il s'arrête au premier essai, annulant l'intérêt)
- Rendre le chien de garde trop permissif (il ne se déclenche jamais, donnant une fausse sécurité)
- Faire tourner le chien de garde sur le même modèle que le travailleur (utiliser Haiku pour le chien de garde — il observe, il ne raisonne pas)

---

## Pattern 5 : Investigation parallèle

**Plusieurs agents testent différentes hypothèses simultanément ; le premier résultat correct gagne (ou tous les résultats sont comparés).**

```
Hypothèse 1 → Agent A ──────┐
Hypothèse 2 → Agent B ──────┼──→ Le parent compare les résultats → meilleure réponse
Hypothèse 3 → Agent C ──────┘
```

**Quand l'utiliser :**
- Débogage où la cause racine est incertaine et plusieurs théories sont plausibles
- Tâches de recherche où différentes stratégies de recherche pourraient donner des résultats différents
- Toute tâche où la meilleure approche est genuinement incertaine à l'avance

**Quand NE PAS l'utiliser :**
- Tâches avec une approche correcte évidente
- Situations sensibles aux coûts — ce pattern est le plus cher par réponse correcte
- Quand les hypothèses ne sont pas indépendantes (le résultat de l'Agent A change si l'Hypothèse B est valide)

**Implémentation :**
```
Lancer 3 agents avec différentes hypothèses sur pourquoi la base de données est lente :
  - Agent A : investiguer les plans de requête et les index manquants
  - Agent B : investiguer l'épuisement du pool de connexions
  - Agent C : investiguer la contention de verrous

Chaque agent écrit ses conclusions et son niveau de confiance dans /tmp/hypothese-[A/B/C].md.
Après que tous ont terminé, comparer les conclusions et retourner la cause racine la plus probable avec preuves.
```

**Erreurs courantes :**
- Formuler des hypothèses si similairement que les agents produisent des résultats quasi-identiques
- Ne pas inclure un score de confiance — sans lui, on ne peut pas choisir entre des conclusions contradictoires
- Exécuter trop d'hypothèses (3-4 est généralement correct ; au-delà, le coût dépasse le bénéfice marginal d'une autre théorie)

---

## Tableau comparatif des coûts en tokens

| Pattern | Coût relatif | Meilleure efficacité coût |
|---|---|---|
| Fan-out (N agents) | N × agent seul | Quand N tâches sont entièrement parallélisables |
| Chaîne de validation (3 agents) | 3× si tous passent, moins si arrêt précoce | Quand l'arrêt précoce est fréquent |
| Routage vers spécialistes | ~1× (classificateur en Haiku) | Presque toujours moins cher qu'un généraliste + correction après coup |
| Chien de garde | ~1,05–1,1× (Haiku pour le chien de garde) | Longues sessions autonomes |
| Investigation parallèle | N× sans arrêt précoce | Uniquement quand l'incertitude est élevée et que les erreurs sont coûteuses |

**Conseils sur les coûts :**
- Utiliser Haiku pour : classificateurs, chiens de garde, agents de traduction, tout agent de transformation mécanique
- Utiliser Sonnet pour : spécialistes, réviseurs, agents qui ont besoin de jugement
- Utiliser Opus pour : décisions à enjeux élevés, analyse d'architecture complexe — pas pour les rôles de soutien

---
