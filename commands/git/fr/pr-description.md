---
description: Rédigez un titre et une description de pull request à partir des commits et diff de la branche
argument-hint: "[base-branch]"
---
Déterminez la branche de base : utilisez $ARGUMENTS si fourni, sinon utilisez `main` par défaut.

Exécutez ces commandes pour collecter le contexte :
1. `git log <base-branch>...HEAD --oneline` — liste des commits sur cette branche
2. `git diff <base-branch>...HEAD --stat` — résumé des modifications au niveau des fichiers
3. `git diff <base-branch>...HEAD` — diff complet pour l'analyse sémantique

À partir de ce contexte, produisez une description de pull request en Markdown :

```
## Résumé
<2-4 points couvrant ce qui a changé et pourquoi — pas une liste de fichiers>

## Modifications
<Regroupées par domaine, pas par fichier. Utilisez des sous-points pour plus de détails.>

## Tests
<Étapes de test spécifiques qu'un relecteur devrait exécuter pour valider la correction.
Si les tests sont automatisés, nommez les fichiers ou commandes de test.>

## Remarques pour les relecteurs
<Signalez les décisions non évidentes, les compromis, les zones d'incertitude, ou les TODOs laissés pour un suivi ultérieur.
Omettez cette section s'il n'y a rien de particulier à noter.>
```

En haut, avant le corps, affichez une seule ligne :
`Title: <impératif, ≤70 caractères, sans point>`

N'incluez pas les titres génériques que le dépôt n'a pas besoin. Ne résumez pas chaque fichier modifié — synthétisez l'intention.
