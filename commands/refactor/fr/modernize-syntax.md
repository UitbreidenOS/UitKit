---
description: Mettre à jour le code aux idiomes de langage actuels sans modifier le comportement
argument-hint: "[fichier ou répertoire]"
---
Modernisez la syntaxe et les idiomes dans $ARGUMENTS selon les normes linguistiques actuelles.

1. Lisez le(s) fichier(s) et identifiez le langage et sa version stable actuelle en utilisation (vérifiez package.json, go.mod, Cargo.toml, pyproject.toml, ou similaire).

2. Appliquez uniquement les modifications qui sont :
   - Supportées par la version linguistique déjà en utilisation (ne pas mettre à jour la version du langage)
   - Des réécritures pures de syntaxe — mêmes sémantiques, forme plus récente
   - Cohérentes avec les motifs déjà présents dans le fichier

3. Cibles de modernisation courantes par langage :

   JavaScript / TypeScript :
   - `var` → `const`/`let` avec mutabilité correcte
   - Chaînes `.then()/.catch()` → `async/await`
   - `arguments` → paramètres de reste
   - Spread d'objet manuel → `{ ...obj }`
   - `Array.prototype.forEach` pour les effets secondaires est acceptable ; `.map`/`.filter`/`.reduce` où une valeur est nécessaire
   - Exports nommés plutôt que exports par défaut où la base de code les utilise déjà

   Python :
   - Anciennes chaînes de style `%` et `.format()` → f-strings (Python 3.6+)
   - `open()` sans gestionnaire de contexte → `with open()`
   - Boucles de construction de liste manuelle → compréhensions de liste/dict/ensemble où lisible
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → `list/dict/tuple` intégrés (Python 3.9+)

   Go :
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Boucles de slice manuelles où `range` est plus propre
   - Valeurs de retour nommées uniquement où elles aident à la clarté, pas par défaut

   Rust :
   - `unwrap()` dans le code non-test → propagation d'erreur appropriée avec `?`
   - `match` plutôt que chaînes `if let` lors de la correspondance de plusieurs bras
   - Appels `.clone()` redondants où un emprunt suffit

4. Ne modernisez pas :
   - Le code qui a un commentaire expliquant pourquoi la forme plus ancienne est intentionnelle
   - Les motifs qui nécessitent une mise à jour de version linguistique
   - Les préférences de style (par exemple, onglets vs. espaces) — cela appartient au formateur

5. Appliquez tous les changements. Sortie : liste des motifs remplacés et comptes de lignes.
