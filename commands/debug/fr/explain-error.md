---
description: Expliquer un message d'erreur ou une exception avec analyse de cause racine et conseils de correction
argument-hint: "[error message or paste]"
---
Vous disposez d'une erreur ou d'une exception. Analysez-la en détail et produisez une explication structurée.

Erreur ou exception à analyser :
$ARGUMENTS

Suivez ce processus :

1. **Identifier le type d'erreur** — classifiez-la (runtime, compilation, réseau, permission, logique, OOM, etc.) et nommez la classe d'erreur exacte ou le code s'il est présent.

2. **Analyse de cause racine** — expliquez ce qui s'est réellement mal passé au niveau mécanique. Ne vous arrêtez pas au message de surface ; tracez jusqu'à la cause sous-jacente. Si l'erreur implique une pile d'appels, suivez chaque frame et identifiez l'appel d'origine.

3. **Indices contextuels** — extrayez tous les chemins de fichiers, numéros de ligne, noms de modules, chaînes de version ou indices d'environnement intégrés dans l'erreur. Expliquez ce que chacun nous dit.

4. **Déclencheurs courants** — listez les 3–5 scénarios les plus probables qui produisent cette erreur exacte, classés par fréquence. Pour chacun, indiquez comment la confirmer ou l'écarter.

5. **Stratégie de correction** — pour chaque cause probable, donnez la correction concrète. Soyez précis : incluez les clés de configuration, les patterns de code, les commandes ou les changements de fichiers selon les besoins. Préférez la correction minimale correcte aux réécriture larges.

6. **Prévention** — si cette classe d'erreur est systématiquement évitable (par exemple, avec une règle de linter, une annotation de type, une politique de retry, une vérification de null), indiquez-le brièvement.

Contraintes :
- Ne remplissez pas avec des conseils génériques qui s'appliquent à chaque erreur.
- Si le texte d'erreur est ambigu ou incomplet, indiquez quel contexte supplémentaire changerait votre analyse et comment.
- Lorsque la correction implique des changements de code, montrez un diff avant/après ou un snippet concret, pas une description d'un snippet.
- Gardez la réponse dense. Les ingénieurs seniors lisent vite.
