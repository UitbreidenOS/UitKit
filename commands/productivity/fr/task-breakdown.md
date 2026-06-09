---
description: Décomposer un objectif ou une fonctionnalité en tâches délimitées, ordonnées et estimées
argument-hint: "[goal or feature description]"
---
Décomposez ce qui suit en une liste de tâches ordonnées : $ARGUMENTS

Produisez une liste aplatie et ordonnée de tâches. Pour chaque tâche :

```
[ ] <task title starting with verb>
    Size: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Depends on: <task number(s), or "none">
    Notes: <one line — key assumption, risk, or constraint. Omit if nothing notable.>
```

Après la liste, ajoutez une section **Risques & Hypothèses** (3–6 points) couvrant :
- Les inconnues qui pourraient dévier les estimations
- Les dépendances externes (APIs, autres équipes, infra)
- Les limites de portée — ce qui est explicitement NON inclus

Règles :
- Les tâches doivent être complétables indépendamment par une personne en une seule session (M ou plus petit de préférence).
- Si une tâche serait XL, divisez-la.
- Ordonnez les tâches de sorte que chacune puisse commencer une fois ses dépendances terminées — pas de dépendances circulaires.
- Utilisez des verbes au niveau implémentation : Write, Add, Refactor, Deploy, Test, Configure — pas de verbes vagues comme « Handle » ou « Work on ».
- Ne pas inclure les tâches pour les frais généraux de gestion de projet (standups, revues) sauf si la demande l'explicite.
- Si $ARGUMENTS est trop vague pour être décomposé sans deviner la portée, posez une question de clarification avant de continuer.
- Pas de langage marketing. Pas de « assurer une expérience transparente ».

Produisez uniquement la liste des tâches et la section risques.
