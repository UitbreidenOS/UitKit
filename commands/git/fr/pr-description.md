---
description: Rédiger un titre et une description de pull request à partir des commits et du diff de la branche
argument-hint: "[branche-de-base]"
---
Déterminez la branche de base : utilisez $ARGUMENTS si fourni, sinon par défaut `main`.

Exécutez ces commandes pour rassembler le contexte :
1. `git log <branche-de-base>...HEAD --oneline` — lister les commits de cette branche
2. `git diff <branche-de-base>...HEAD --stat` — résumé des modifications au niveau des fichiers
3. `git diff <branche-de-base>...HEAD` — diff complet pour l'analyse sémantique

À partir de ce contexte, produisez une description de pull request en Markdown :

```
## Résumé
<2-4 points de balle couvrant ce qui a changé et pourquoi — pas une liste de fichiers>

## Modifications
<Groupées par préoccupation, pas par fichier. Utilisez des sous-puces pour les détails.>

## Tests
<Étapes de test spécifiques qu'un relecteur devrait exécuter pour valider la correctitude.
Si les tests sont automatisés, nommez les fichiers de test ou les commandes.>

## Notes pour les relecteurs
<Signaler les décisions non évidentes, les compromis, les zones d'incertitude ou les TODOs laissés pour un suivi ultérieur.
Omettez cette section s'il n'y a rien de remarquable.>
```

En haut, avant le corps, affichez une seule ligne :
`Titre : <impérative, ≤70 caractères, sans point>`

N'incluez pas les en-têtes de modèle que le dépôt n'a pas besoin. Ne résumez pas chaque fichier modifié — synthétisez l'intention.
