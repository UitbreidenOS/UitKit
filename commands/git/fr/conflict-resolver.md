---
description: Expliquer et résoudre les conflits de fusion dans l'arborescence de travail actuelle
argument-hint: "[file]"
---
Exécutez `git diff --diff-filter=U --name-only` pour lister tous les fichiers avec des conflits de fusion non résolus. Si $ARGUMENTS est fourni, limitez l'analyse à ce fichier.

Pour chaque fichier en conflit (ou simplement le fichier spécifié), lisez le contenu brut et localisez chaque bloc de marqueur de conflit :

```
<<<<<<< HEAD
... ours ...
=======
... theirs ...
>>>>>>> branch-name
```

Pour chaque bloc de conflit :
1. Identifiez le côté HEAD et le côté entrant en lisant le contexte environnant (nom de fonction, portée de variable, bloc d'importation, clé de configuration, etc.).
2. Énoncez en une phrase ce que chaque côté tente de faire.
3. Déterminez la résolution correcte en utilisant cet ordre de priorité :
   - Si un côté est un non-événement par rapport à l'autre (par exemple, uniquement des espaces blancs ou une annulation), préférez le changement substantif.
   - Si les deux côtés ajoutent une logique distincte, fusionnez-les (l'ordre importe — expliquez votre choix d'ordre).
   - Si les deux côtés sont sémantiquement incompatibles, dites-le et demandez à l'utilisateur quelle intention garder avant d'écrire une résolution.
4. Écrivez le bloc résolu — pas de marqueurs de conflit, pas de lignes vides supplémentaires ajoutées gratuitement.

Après avoir résolu tous les blocs dans un fichier, affichez la version complète résolue de chaque section en conflit (pas le fichier entier sauf s'il est court).

Ensuite, affichez un tableau récapitulatif :

| File | Conflicts resolved | Action taken |
|------|--------------------|--------------|
| ...  | N                  | merged / chose ours / chose theirs / needs decision |

N'exécutez pas `git add` ou `git commit`. Ne modifiez pas les fichiers sur disque sauf si l'utilisateur confirme les résolutions proposées.

Si un conflit se trouve dans un fichier verrou (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`), conseillez à l'utilisateur de supprimer le fichier verrou et de le régénérer plutôt que de le résoudre manuellement, et ignorez ce fichier.
