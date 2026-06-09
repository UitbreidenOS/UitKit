---
description: Projektabhängigkeiten auf bekannte CVEs und Supply-Chain-Risiken prüfen
argument-hint: "[package-file or ecosystem]"
---
Überwachen Sie die Abhängigkeiten in diesem Projekt auf bekannte Sicherheitslücken und Supply-Chain-Risiken.

Ziel: $ARGUMENTS (automatische Erkennung, falls leer — gescannte Repo-Root und Unterverzeichnisse nach Manifest-Dateien).

1. **Ökosysteme erkennen**: Identifizieren Sie alle vorhandenen Lockfiles und Manifeste:
   - Node: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - Python: `requirements*.txt`, `Pipfile.lock`, `pyproject.toml`, `poetry.lock`
   - Go: `go.mod`, `go.sum`
   - Rust: `Cargo.toml`, `Cargo.lock`
   - Java/Kotlin: `pom.xml`, `build.gradle`
   - Ruby: `Gemfile.lock`

2. **Native Audit-Tools ausführen**, falls verfügbar:
   - `npm audit --json` / `yarn audit` / `pnpm audit`
   - `pip-audit` oder `safety check`
   - `cargo audit`
   - `govulncheck ./...`
   - `bundle audit`
   Erfassen Sie die Ausgabe und analysieren Sie die Ergebnisse.

3. **CVEs identifizieren**: Für jeden verwundbaren Paketbericht:
   - Paketname und aktuelle Version
   - CVE-ID(s) und CVSS-Score
   - Beschreibung der Sicherheitslücke (ein Satz)
   - Behobene Version (falls verfügbar)
   - Ob dies eine direkte oder transitive Abhängigkeit ist
   - Ob der verwundbare Code-Pfad von der Anwendung erreichbar ist

4. **Supply-Chain-Signale**: Markieren Sie jedes Paket, das zeigt:
   - Unveröffentlichte oder gelöschte Versionen in der Lockfile
   - Pakete ohne Downloads, einzelner Wartungsperson oder sehr recent Besitzwechsel
   - Dependency-Confusion-Risiko (interne Paketnamen, die in öffentlichen Registern existieren)
   - Pakete mit Install-Skripten (`preinstall`, `postinstall`), die beliebigen Code ausführen
   - Wildcard-Versionsangaben (`*`, `>=0.0.0`), die jede zukünftige Version akzeptieren

5. **Priorisieren**: Nach Erreichbarkeit > CVSS-Score > direkt vs. transitiv ordnen.

6. **Ausgabe**:
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

Wenn Audit-Tools nicht verfügbar sind, kreuzen Sie Versionen mit bekannten CVE-Datenbanken aus Trainingsdaten ab und beachten Sie die Einschränkung. Ändern Sie keine Dateien und führen Sie keine Install-Befehle aus.
