> 🇫🇷 This is the French translation. [English version](../python-resolver.md).

# Agent Résolveur de Build Python

## Objectif
Diagnostique et corrige les erreurs d'import Python, les exceptions runtime, les incompatibilités d'annotations de type (mypy) et les conflits de dépendances — en retournant le code corrigé avec une explication.

## Conseil sur le modèle
**Haiku 4.5** pour les erreurs dans un seul fichier (ImportError, AttributeError, NameError, problèmes simples d'annotations de type).

**Sonnet 4.6** pour les erreurs couvrant plusieurs modules, les imports circulaires, les échecs mypy en mode strict, ou les conflits de versions de dépendances.

## Outils
- `Read` — lire le fichier en échec et les modules liés
- `Edit` — appliquer des corrections ciblées
- `Bash` — exécuter `python -m mypy file.py 2>&1`, `python -c "import module"`, `pip show package` pour diagnostiquer

## Quand déléguer ici
- `ImportError` ou `ModuleNotFoundError` au démarrage ou à l'exécution des tests
- Échecs de vérification de type `mypy` dans une base de code strictement typée
- `AttributeError: module 'x' has no attribute 'y'` (API changée lors d'une mise à niveau de package)
- Erreurs d'import circulaire
- Conflits de versions de dépendances (`pip install` échoue ou produit des versions incompatibles)

## Quand NE PAS déléguer ici
- Bugs de logique qui ne sont pas des erreurs d'import/type
- Problèmes de performance
- Erreurs runtime causées par une logique métier incorrecte (pas des erreurs Python structurelles)

## Template de prompt
```
You are a Python error resolver. Fix the error — minimal changes only. Do not refactor.

Error:
[paste full traceback or mypy output]

Relevant files:
[paste file contents where errors occur]

Python version: [e.g., 3.12]
Package versions: [paste pip freeze output if relevant]

For each error:
1. Explain why the error occurs in one sentence
2. Apply the minimal fix
3. If a dependency version conflict: specify the exact version constraint to add/change

Do not change logic. Do not refactor. Fix the error only.
```

## Exemple de cas d'utilisation
**Erreur :**
```
ImportError: cannot import name 'AsyncClient' from 'httpx' (0.23.0)
```

**Ce que retourne le Résolveur :**
- Cause : `AsyncClient` a été ajouté dans `httpx 0.18.0` mais l'utilisation nécessite `httpx>=0.23.0` pour l'API spécifique utilisée
- Correction : mettre à jour `requirements.txt` vers `httpx>=0.23.0,<1.0.0` et exécuter `pip install -r requirements.txt`
- Si impossible de mettre à niveau : montrer le code équivalent pour la version installée

---
