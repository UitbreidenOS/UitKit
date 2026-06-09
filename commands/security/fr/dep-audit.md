---
description: Auditer les dépendances du projet pour les CVE connues et les risques de chaîne d'approvisionnement
argument-hint: "[package-file or ecosystem]"
---
Auditez les dépendances de ce projet pour identifier les vulnérabilités connues et les risques de chaîne d'approvisionnement.

Cible : $ARGUMENTS (auto-détection si vide — analyse le répertoire racine et les sous-répertoires pour les fichiers manifeste).

1. **Détectez les écosystèmes** : Identifiez tous les lockfiles et manifestes présents :
   - Node: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - Python: `requirements*.txt`, `Pipfile.lock`, `pyproject.toml`, `poetry.lock`
   - Go: `go.mod`, `go.sum`
   - Rust: `Cargo.toml`, `Cargo.lock`
   - Java/Kotlin: `pom.xml`, `build.gradle`
   - Ruby: `Gemfile.lock`

2. **Exécutez les outils d'audit natifs** si disponibles :
   - `npm audit --json` / `yarn audit` / `pnpm audit`
   - `pip-audit` ou `safety check`
   - `cargo audit`
   - `govulncheck ./...`
   - `bundle audit`
   Capturez la sortie et analysez les résultats.

3. **Identifiez les CVE** : Pour chaque rapport de paquet vulnérable :
   - Nom du paquet et version actuelle
   - ID(s) CVE et score CVSS
   - Description de la vulnérabilité (une phrase)
   - Version corrigée (si disponible)
   - Si c'est une dépendance directe ou transitive
   - Si le chemin du code vulnérable est accessible depuis l'application

4. **Signaux de chaîne d'approvisionnement** : Marquez tout paquet qui montre :
   - Versions non publiées ou rejetées épinglées dans le lockfile
   - Paquets avec zéro téléchargements, un seul mainteneur, ou transfert de propriété très récent
   - Risque de confusion de dépendance (noms de paquets internes existant sur des registres publics)
   - Paquets avec des scripts d'installation (`preinstall`, `postinstall`) qui exécutent du code arbitraire
   - Épingles de version générique (`*`, `>=0.0.0`) acceptant toute version future

5. **Classez par priorité** : Classez par accessibilité > score CVSS > dépendance directe vs transitive.

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

Si l'outil d'audit n'est pas disponible, recoupez les versions par rapport aux bases de données CVE connues à partir des données d'entraînement et notez la limitation. Ne modifiez pas les fichiers et n'exécutez pas les commandes d'installation.
