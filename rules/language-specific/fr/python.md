> 🇫🇷 This is the French translation. [English version](../python.md).

# Règles Python

## S'applique à
Tous les fichiers Python (`*.py`) dans n'importe quel projet.

## Règles

1. **Annotations de type sur toutes les signatures de fonctions** — paramètres et types de retour. Utiliser `from __future__ import annotations` pour les références en avant. Pas de fonctions non typées en code de production.

2. **`pathlib.Path` plutôt que `os.path`** — `Path("dir") / "file.txt"` est plus propre et fonctionne sur toutes les plateformes. `os.path` est du code legacy.

3. **f-strings plutôt que `.format()` et `%`** — `f"Hello {name}"` partout. `.format()` uniquement quand le template est stocké dans une variable chaîne.

4. **Ne jamais utiliser des arguments par défaut mutables** — `def fn(items: list = [])` crée une liste unique partagée entre tous les appels. Utiliser `def fn(items: list | None = None)` et assigner à l'intérieur.

5. **`dataclasses` pour les conteneurs de données, `Pydantic` pour les données externes validées** — si elles traversent une frontière système (HTTP, fichier, env), utiliser Pydantic. Si c'est uniquement un état interne, `@dataclass` est plus léger.

6. **Préférer les instructions `with` pour toute gestion de ressources** — fichiers, connexions DB, verrous, sessions HTTP. Ne jamais appeler `.close()` manuellement.

7. **Expressions génératrices plutôt que compréhensions de listes quand vous n'itérez qu'une fois** — `sum(x*x for x in range(1000))` n'alloue pas de liste.

8. **Définir `__all__` dans chaque module public** — API publique explicite. Évite la pollution des `import *` et documente l'intention.

9. **Lever des exceptions spécifiques, attraper des exceptions spécifiques** — `raise ValueError("message")` pas `raise Exception`. `except ValueError` pas `except Exception` sauf à une frontière d'erreur de niveau supérieur.

10. **Module `logging` pour le code de production, jamais `print()`** — `import logging; logger = logging.getLogger(__name__)`. `print()` uniquement dans le code de sortie CLI.

11. **Utiliser `Enum` pour les ensembles de valeurs fixes** — pas des constantes chaînes. `class Status(str, Enum): ACTIVE = "active"` donne la sécurité de type et la complétion IDE.

12. **`subprocess.run()` plutôt que `os.system()`** — capture la sortie, lève sur échec avec `check=True`, évite l'injection shell avec des args en liste : `subprocess.run(["git", "status"], check=True)`.

13. **`dict.get(key, default)` plutôt que `key in dict` + `dict[key]`** — une recherche au lieu de deux.

14. **Classes de base abstraites via `abc.ABC`** — quand vous avez besoin de contrats d'interface appliqués. `Protocol` pour le sous-typage structurel (duck typing avec vérification de type).

15. **Environnements virtuels toujours, dépendances dans `pyproject.toml`** — `uv` ou `poetry` pour la gestion. Pas de `requirements.txt` pour les nouveaux projets.


---
