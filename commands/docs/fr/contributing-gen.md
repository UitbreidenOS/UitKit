---
description: Générer un CONTRIBUTING.md adapté au flux de travail réel de ce dépôt
argument-hint: "[output-path]"
---
Générer un CONTRIBUTING.md pour ce dépôt.

Avant d'écrire quoi que ce soit :
1. Lire le README existant, toute configuration CI (`.github/workflows/`, `Makefile`, `justfile`),
   configuration de linting/formatage (`.eslintrc`, `pyproject.toml`, `.prettierrc`, etc.) et
   configuration du test runner (`jest.config.*`, `pytest.ini`, `vitest.config.*`).
2. Vérifier la documentation de contribution existante — si `CONTRIBUTING.md` existe déjà, le lire
   avant de le remplacer. Préserver les sections précises ; remplacer celles obsolètes ou manquantes.
3. Identifier les commandes réelles utilisées : install, build, test, lint, format. Utiliser ce que
   le dépôt définit, pas des valeurs par défaut génériques.

Écrire CONTRIBUTING.md avec ces sections :

### Prerequisites
Les versions exactes d'exécution/outils requises (Node, Python, Go, etc.), provenant de `.nvmrc`,
`.python-version`, `go.mod`, ou équivalent. Si aucune n'est trouvée, le signaler.

### Getting Started
Clone → install → première exécution. Commandes exactes uniquement. Pas d'hésitation du type « vous pourriez avoir besoin ».

### Development Workflow
Comment exécuter le serveur de développement / watcher / REPL. Comment exécuter les tests et les lints. Commandes exactes.

### Making Changes
Convention de nommage des branches (inférer des noms de branches existants ou des règles CI si présentes).
Format des messages de commit (inférer du git log ou de la configuration commitlint).
Processus de PR : qui examine, quels contrôles doivent réussir, comment demander un examen.

### Code Style
Résumer les règles appliquées à partir de la configuration du linter/formatteur. Ne pas lister chaque règle —
seulement les décisions qu'un contributeur ferait activement (nommage, structure de fichiers, colocation des tests).

### Testing Requirements
La couverture de test attendue. Où placer les nouveaux tests. Comment exécuter seulement un sous-ensemble.

### Submitting a PR
Liste de contrôle : les tests réussissent, le lint réussit, la documentation mise à jour si nécessaire, entrée de journal des modifications si applicable.
Lien vers CI si GitHub Actions sont présentes.

Règles de précision :
- Chaque commande doit provenir de la configuration réelle du dépôt. Ne pas inventer de scripts.
- Si une section n'a aucune preuve dans le dépôt, l'omettre plutôt que d'écrire un espace réservé générique.
- Sortie vers : $ARGUMENTS (par défaut : `CONTRIBUTING.md` à la racine du dépôt).
- Après la rédaction, imprimer la liste des fichiers sources lus pour produire la sortie.
