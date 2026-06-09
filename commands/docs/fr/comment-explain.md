---
description: Ajouter des commentaires explicatifs aux sections de code complexes ou non évidentes
argument-hint: "[file or function]"
---
Ajouter des commentaires explicatifs au code à: $ARGUMENTS

Règles:
- Commenter le POURQUOI, pas le QUOI. Ne jamais reformuler ce que le code dit déjà.
- Un bon commentaire explique: une contrainte cachée, un choix algorithmique non évident, une particularité
  d'une API externe, un compromis de performance, ou un invariant qui doit se maintenir.
- Mauvais commentaire: `// increment i` — le code le dit déjà.
- Bon commentaire: `// skip index 0 — the API returns a sentinel value there, not real data`.

Processus:
1. Lire le fichier ou la fonction cible entièrement avant d'écrire quoi que ce soit.
2. Identifier chaque bloc qui ferait un lecteur compétent se demander « pourquoi? ».
3. Pour chaque bloc de ce type, écrire un commentaire sur une ligne (ou deux au maximum) au-dessus.
4. Si une fonction ou une méthode a un contrat non évident (préconditions, effets secondaires, exigence
   d'ordre), ajouter un court commentaire d'en-tête indiquant seulement ce qui n'est pas évident à partir de la signature.
5. Supprimer les commentaires existants qui décrivent simplement ce que le code fait — ils ajoutent du bruit.
6. Ne pas ajouter un commentaire à chaque fonction. Uniquement où une ambiguïté réelle existe.

Style des commentaires:
- Respecter le style des commentaires existants dans le fichier (langue, mise en forme, capitalisation).
- Pour JavaScript/TypeScript: `//` pour l'inline, `/** */` seulement pour JSDoc des API publiques.
- Pour Python: `#` inline; les docstrings uniquement pour les fonctions/classes publiques, une ligne si possible.
- Pas de commentaires en bloc expliquant des sections entières sauf si la section est un algorithme non trivial.

Après édition:
- Rapporter chaque localisation où un commentaire a été ajouté ou supprimé avec fichier:ligne et une phrase
  expliquant la raison du changement.
- Ne pas reformater le code environnant. Éditions chirurgicales uniquement.
- Si $ARGUMENTS pointe vers un répertoire entier, traiter chaque fichier mais ignorer les fichiers générés,
  le code vendorisé, et les fixtures de test.
