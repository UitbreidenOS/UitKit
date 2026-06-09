---
description: Mettre à jour le code selon les idiomes actuels du langage sans modifier le comportement
argument-hint: "[file or directory]"
---
Modernisez la syntaxe et les idiomes dans $ARGUMENTS selon les normes actuelles du langage.

1. Lisez le(s) fichier(s) et identifiez le langage et sa version stable actuelle en cours d'utilisation (vérifiez package.json, go.mod, Cargo.toml, pyproject.toml, ou similaire).

2. Appliquez uniquement les modifications qui sont :
   - Supportées par la version du langage déjà en utilisation (ne mettez pas à jour la version du langage)
   - De pures relectures syntaxiques — même sémantique, nouvelle forme
   - Cohérentes avec les modèles déjà présents dans le fichier

3. Cibles de modernisation courantes par langage :

   JavaScript / TypeScript :
   - `var` → `const`/`let` avec mutabilité correcte
   - `.then()/.catch()` chains → `async/await`
   - `arguments` → rest parameters
   - Object spread manuel → `{ ...obj }`
   - `Array.prototype.forEach` pour les effets secondaires est acceptable ; `.map`/`.filter`/`.reduce` où une valeur est nécessaire
   - Exports nommés plutôt que exports par défaut où le codebase les utilise déjà

   Python :
   - Chaînes `.format()` et `%` anciennes → f-strings (Python 3.6+)
   - `open()` sans context manager → `with open()`
   - Boucles de construction manuelle de listes → list/dict/set comprehensions où lisible
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → types natifs `list/dict/tuple` (Python 3.9+)

   Go :
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Boucles manuelles sur slices où `range` est plus propre
   - Valeurs de retour nommées uniquement où elles aident la clarté, pas par défaut

   Rust :
   - `unwrap()` dans le code non-test → propagation d'erreurs correcte avec `?`
   - `match` plutôt que chaînes `if let` lors de la correspondance de plusieurs branches
   - Appels `.clone()` redondants où un emprunt suffît

4. Ne modernisez pas :
   - Le code avec un commentaire expliquant pourquoi la forme plus ancienne est intentionnelle
   - Les modèles qui nécessitent une mise à jour de version de langage
   - Les préférences de style (par ex., tabulations vs. espaces) — cela appartient au formateur

5. Appliquez toutes les modifications. Résultat : liste des modèles remplacés et comptage des lignes.
