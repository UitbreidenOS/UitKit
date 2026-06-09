---
description: Générez une documentation de référence API complète pour les modules ou points de terminaison publics
argument-hint: "[file-or-directory]"
---
Générez une documentation de référence API complète pour : $ARGUMENTS

Si aucun argument n'est fourni, scannez le référentiel pour les surfaces d'API publiques — modules exportés, points de terminaison REST/GraphQL, interfaces CLI — et documentez-les tous.

Processus :
1. Identifiez la surface d'API :
   - Pour les bibliothèques : fonctions exportées, classes, types (lisez la source + tout fichier d'index/barrel).
   - Pour les API HTTP : définitions de routes (Express, FastAPI, Django, Rails, etc.).
   - Pour les CLI : parseurs d'arguments (argparse, click, cobra, yargs, etc.).
2. Pour chaque symbole/point de terminaison public, extrayez : nom, signature/route+méthode, paramètres avec types, type de retour, description à partir des docstrings/commentaires existants (le cas échéant), conditions d'erreur.
3. Notez les schémas d'authentification, de limitation de débit ou de versioning présents dans le code.

Format de sortie — Document de référence Markdown :

## API Reference

Pour chaque module / espace de noms / groupe de routes :

### `<SymbolName>` / `<METHOD /path>`

**Description:** Ce qu'il fait (déduit de l'implémentation si aucune docstring n'existe).

**Parameters / Request:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| ...  | ...  | ...      | ...         |

**Returns / Response:** type et forme, ou codes de statut HTTP avec forme de corps.

**Errors:** Répertoriez les conditions d'erreur connues et leurs codes/types.

**Example:**
```<lang>
// minimal working example
```

Règles :
- Documentez uniquement ce qui est réellement dans le code — n'inventez pas de paramètres.
- Si le type d'un paramètre est ambigu, indiquez le type déduit et signalez-le avec `<!-- verify -->`.
- Pour les API HTTP, montrez des exemples curl.
- Pour les fonctions de bibliothèque, montrez le langage hôte.
- Groupez par espace de noms logique / ressource / module — ordre alphabétique au sein de chaque groupe.
- Si la cible est un répertoire, parcourez récursivement tous les fichiers source.

Écrivez la sortie dans `docs/api-reference.md` (créez `docs/` s'il est absent), ou vers $ARGUMENTS s'il se termine par `.md`. Confirmez le chemin écrit.
