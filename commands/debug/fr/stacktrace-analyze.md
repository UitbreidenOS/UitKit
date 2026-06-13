---
description: Analyser une stack trace pour identifier la cause racine, la chaîne d'appels et un correctif exploitable
argument-hint: "[coller stack trace]"
---
Analysez la stack trace suivante et produisez un diagnostic précis et exploitable.

Stack trace :
$ARGUMENTS

Travaillez systématiquement à travers ceci :

1. **Analyser la trace** — identifiez le langage et le runtime (Python, JVM, Go, Node, Rust, .NET, etc.). Notez le type d'exception/erreur et le message en haut de la trace.

2. **Parcourir la chaîne d'appels** — en partant du point d'origine du lancement (frame pertinent le plus profond), tracez vers le haut à travers chaque frame :
   - Identifiez quels frames sont du code application par rapport à framework/bibliothèque par rapport aux internals du runtime
   - Concentrez l'analyse sur les frames application — c'est là que vivent les bugs
   - Pour chaque frame application, indiquez ce que cette fonction est responsable de faire et pourquoi elle est dans cette chaîne d'appels

3. **Identifier précisément l'origine** — identifiez le frame unique où le contrôle aurait dû diverger du chemin correct. Ce n'est pas toujours le frame le plus profond ; c'est le frame où une hypothèse erronée, une vérification manquante ou un état invalide a été introduit.

4. **Lire la source** — si les chemins de fichier dans la trace existent dans ce dépôt, lisez les lignes pertinentes. Effectuez une recoupement entre les numéros de ligne dans la trace et le code réel. Ne vous fiez pas à la trace seule.

5. **Diagnostiquer la cause racine** — indiquez exactement quelle condition a déclenché cette trace. Soyez spécifique concernant les valeurs de variables, les états d'objets ou les timings qui ont mené ici si on peut les déduire.

6. **Écarter les fausses pistes** — si des frames sont du bruit (wrappers asynchrones, middleware, boucles de retry), dites-le explicitement afin que le lecteur ne les poursuive pas.

7. **Correctif** — fournissez le changement de code concret qui élimine ce chemin d'échec. Montrez l'emplacement exact (fichier, fonction, plage de lignes) et le changement avant/après. Si le correctif nécessite de comprendre l'état externe, indiquez quoi vérifier et comment.

8. **Garde de régression** — suggérez le test minimal qui aurait attrapé ceci avant qu'il ne atteigne la production.
