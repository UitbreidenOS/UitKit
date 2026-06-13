---
description: Auditer les dépendances du projet pour les CVE connues et les risques de chaîne d'approvisionnement
argument-hint: "[package-file or ecosystem]"
---
Auditez les dépendances de ce projet pour les vulnérabilités connues et les risques de chaîne d'approvisionnement.

Cible : $ARGUMENTS (détection automatique si vide — scannez la racine du repo et les sous-répertoires pour les fichiers de manifeste).

1. **Détecter l'écosystème** : Identifiez tous les lockfiles et manifestes présents :
   - Node : `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - Python : `requirements*.txt`, `Pipfile.lock`, `pyproject.toml`, `poetry.lock`
   - Go : `go.mod`, `go.sum`
   - Rust : `Cargo.toml`, `Cargo.lock`
   - Java/Kotlin : `pom.xml`, `build.gradle`
   - Ruby : `Gemfile.lock`

2. **Exécuter l'outillage d'audit natif** où disponible :
   - `npm audit --json` / `yarn audit` / `pnpm audit`
   - `pip-audit` ou `safety check`
   - `cargo audit`
   - `govulncheck ./...`
   - `bundle audit`
   Capturez la sortie et analysez les résultats.

3. **Identifier les CVE** : Pour chaque rapport de package vulnérable :
   - Nom du package et version actuelle
   - ID CVE et score CVSS
   - Description de la vulnérabilité (une phrase)
   - Version corrigée (si disponible)
   - S'il s'agit d'une dépendance directe ou transitive
   - Si le chemin de code vulnérable est accessible depuis l'application

4. **Signaux de chaîne d'approvisionnement** : Signalez tout package qui montre :
   - Des versions non publiées ou révoquées épinglées dans le lockfile
   - Des packages sans téléchargements, à maintien unique, ou avec transfert de propriétaire récent
   - Risque de confusion de dépendance (noms de package internes qui existent sur les registres publics)
   - Des packages avec des scripts d'installation (`preinstall`, `postinstall`) qui exécutent du code arbitraire
   - Des épinglages de version en caractères génériques (`*`, `>=0.0.0`) acceptant toute version future

5. **Prioriser** : Classez par accessibilité > score CVSS > dépendance directe vs transitive.

6. **Sortie** :
   ```
   ## Dependency Audit

   ### Critical / High CVEs
   [package@version] CVE-XXXX-XXXXX (CVSS N.N) — description
   Fix: upgrade to X.Y.Z
   Reachable: yes/no/unknown

   ### Supply-Chain Flags
   - [package]: reason

   ### Upgrade Commands
   Paste-ready commands to fix all critical/high issues.
   ```

Si l'outillage d'audit n'est pas disponible, recoupez les versions par rapport aux bases de données CVE connues à partir des données d'entraînement et notez la limitation. Ne modifiez pas les fichiers et n'exécutez pas les commandes d'installation.
