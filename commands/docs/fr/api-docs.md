---
description: Générer une documentation de référence API complète pour les modules ou points de terminaison publics
argument-hint: "[file-or-directory]"
---
Générer une documentation de référence API complète pour : $ARGUMENTS

Si aucun argument n'est donné, scannez le dépôt pour les surfaces API publiques — modules exportés, points de terminaison REST/GraphQL, interfaces CLI — et documentez-les tous.

Processus :
1. Identifiez la surface API :
   - Pour les bibliothèques : fonctions exportées, classes, types (lire la source + tous les fichiers index/barrel).
   - Pour les APIs HTTP : définitions de routes (Express, FastAPI, Django, Rails, etc.).
   - Pour les CLIs : analyseurs d'arguments (argparse, click, cobra, yargs, etc.).
2. Pour chaque symbole/point de terminaison public, extrayez : nom, signature/route+méthode, paramètres avec types, type de retour, description à partir des docstrings/commentaires existants (le cas échéant), conditions d'erreur.
3. Notez tout schéma d'authentification, limitation de débit ou versioning présent dans le code.

Format de sortie — Document de référence Markdown :

## Référence API

Pour chaque module / espace de noms / groupe de routes :

### `<SymbolName>` / `<METHOD /path>`

**Description :** Ce qu'elle fait (déduit de l'implémentation si aucune docstring n'existe).

**Paramètres / Requête :**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| ... | ...  | ...    | ...         |

**Retour / Réponse :** type et forme, ou codes de statut HTTP avec forme du corps.

**Erreurs :** Énumérez les conditions d'erreur connues et leurs codes/types.

**Exemple :**
```<lang>
// minimal working example
```

Règles :
- Documentez uniquement ce qui se trouve réellement dans le code — n'inventez pas de paramètres.
- Si le type d'un paramètre est ambigu, énoncez le type déduit et signalez-le avec `<!-- verify -->`.
- Pour les APIs HTTP, montrez des exemples curl.
- Pour les fonctions de bibliothèque, montrez le langage hôte.
- Groupez par espace de noms logique / ressource / module — alphabétique dans chaque groupe.
- Si la cible est un répertoire, récursez dans tous les fichiers source.

Écrivez la sortie dans `docs/api-reference.md` (créez `docs/` si absent), ou vers $ARGUMENTS si elle se termine par `.md`. Confirmez le chemin écrit.
