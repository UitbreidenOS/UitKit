---
description: Décomposer un objectif ou une fonctionnalité en tâches délimitées, séquencées avec des estimations d'effort
argument-hint: "[description de l'objectif ou de la fonctionnalité]"
---
Décomposer ce qui suit en une liste de tâches séquencées : $ARGUMENTS

Produire une liste plate et ordonnée de tâches. Pour chaque tâche :

```
[ ] <titre de tâche commençant par un verbe>
    Taille : XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3j, XL=>3j)
    Dépend de : <numéro(s) de tâche, ou "aucune">
    Notes : <une ligne — hypothèse clé, risque ou contrainte. Omettre s'il n'y a rien de remarquable.>
```

Après la liste, ajouter une section **Risques et Hypothèses** (3–6 puces) couvrant :
- Les inconnues qui pourraient invalider les estimations
- Les dépendances externes (APIs, autres équipes, infrastructure)
- Les délimitations de portée — ce qui est explicitement EXCLUS

Règles :
- Les tâches doivent être complétables indépendamment par une personne en une seule session (M ou plus petit de préférence).
- Si une tâche serait XL, la diviser.
- Ordonner les tâches de sorte que chacune puisse démarrer une fois ses dépendances terminées — pas de dépendances circulaires.
- Utiliser des verbes au niveau implémentation : Écrire, Ajouter, Refactoriser, Déployer, Tester, Configurer — pas de verbes vagues comme « Gérer » ou « Travailler sur ».
- Ne pas inclure de tâches pour la gestion de projet (stand-ups, révisions) à moins que la demande le demande explicitement.
- Si $ARGUMENTS est trop vague pour être décomposé sans deviner la portée, poser une question de clarification avant de procéder.
- Pas de langage marketing. Pas de « assurer une expérience transparente ».

Produire uniquement la liste de tâches et la section des risques.
