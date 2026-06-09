---
description: Générer ou étendre un .gitignore pour la pile de projet détectée ou spécifiée
argument-hint: "[stack or language]"
---
Si $ARGUMENTS est fourni, traitez-le comme une spécification de pile (par exemple, « node react », « python fastapi », « rust », « go terraform »).

Si $ARGUMENTS est vide, détectez la pile en inspectant l'arborescence de travail :
- Exécutez `ls -1` à la racine du référentiel et scannez les fichiers indicateurs : `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `pom.xml`, `build.gradle`, `*.sln`, `Dockerfile`, `.terraform/`, etc.
- Vérifiez les fichiers d'éditeur/IDE : `.vscode/`, `.idea/`, `*.xcodeproj`
- Vérifiez le système d'exploitation : détectez macOS (risque `.DS_Store`) ou Windows (risque `Thumbs.db`) depuis l'environnement

Si un `.gitignore` existe déjà à la racine du référentiel, lisez-le d'abord. Ajoutez uniquement les règles manquantes — ne dupliquez pas les entrées existantes.

Générez le contenu de `.gitignore` organisé en sections étiquetées :

```
# === <Stack> ===
# === Editor / IDE ===
# === OS ===
# === Secrets & local config ===
# === Build output ===
# === Test artifacts ===
```

Règles pour chaque section :
- **Stack** : répertoires de compilation spécifiques à une langue, artefacts compilés, caches de paquets, environnements virtuels, répertoires de dépendances
- **Éditeur/IDE** : `.vscode/` (conservez `.vscode/extensions.json` et `settings.json` s'ils sont partagés en équipe — notez ceci), `.idea/`, `*.swp`, `*.swo`, `.DS_Store`, `Thumbs.db`
- **Secrets** : `.env`, `.env.*` (sauf `.env.example`), `*.pem`, `*.key`, `secrets.*`, `credentials.*`
- **Build output** : `dist/`, `build/`, `out/`, `target/`, `*.o`, `*.a`, `*.so`, `*.dll`
- **Test artifacts** : `coverage/`, `.nyc_output/`, `*.lcov`, `htmlcov/`, `.pytest_cache/`, `__snapshots__/` (uniquement s'ils ne sont pas versionnés intentionnellement)

Après le bloc de contenu, notez tous les modèles qui nécessitent une discussion d'équipe avant ajout (par exemple, s'il faut ignorer `.vscode/settings.json`).

Ne écrivez pas le fichier sur le disque. Affichez le contenu `.gitignore` complet pour que l'utilisateur le révise et l'applique.
