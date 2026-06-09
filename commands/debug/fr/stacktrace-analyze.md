---
description: Analyser une trace de pile pour identifier la cause racine, la chaîne d'appels et un correctif actionnable
argument-hint: "[paste stack trace]"
---
Analysez la trace de pile suivante et produisez un diagnostic précis et exploitable.

Trace de pile :
$ARGUMENTS

Travaillez systématiquement :

1. **Analysez la trace** — identifiez le langage et l'environnement d'exécution (Python, JVM, Go, Node, Rust, .NET, etc.). Notez le type d'exception/erreur et le message en haut de la trace.

2. **Parcourez la chaîne d'appels** — à partir du point de lancement d'origine (cadre pertinent le plus profond), remontez à travers chaque cadre :
   - Identifiez quels cadres sont du code d'application par rapport au framework/bibliothèque par rapport aux internes du runtime
   - Concentrez l'analyse sur les cadres d'application — c'est là que réside le bogue
   - Pour chaque cadre d'application, expliquez ce dont cette fonction est responsable et pourquoi elle se trouve dans cette chaîne d'appels

3. **Identifiez l'origine** — identifiez le cadre unique où le contrôle aurait dû s'écarter du chemin correct. Ce n'est pas toujours le cadre le plus profond ; c'est le cadre où une mauvaise hypothèse, une vérification manquante ou un état invalide a été introduit.

4. **Lisez la source** — si les chemins de fichier de la trace existent dans ce référentiel, lisez les lignes pertinentes. Comparez les numéros de ligne de la trace avec le code réel. Ne vous fiez pas à la trace seule.

5. **Diagnostiquez la cause racine** — énoncez exactement quelle condition a déclenché cette trace. Soyez précis sur les valeurs des variables, les états des objets ou le timing qui a conduit ici si cela peut être déduit.

6. **Éliminez les fausses pistes** — si des cadres sont du bruit (wrappers asynchrones, middleware, boucles de réessai), dites-le explicitement afin que le lecteur ne les pourchasse pas.

7. **Correctif** — fournissez la modification de code concrète qui élimine ce chemin d'échec. Montrez l'emplacement exact (fichier, fonction, plage de lignes) et la modification avant/après. Si le correctif nécessite de comprendre l'état externe, expliquez ce qu'il faut vérifier et comment.

8. **Garde contre la régression** — suggérez le test minimal qui aurait détecté ceci avant qu'il ne soit livré en production.
