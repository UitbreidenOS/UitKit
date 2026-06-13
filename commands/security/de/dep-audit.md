---
description: Projektabhängigkeiten auf bekannte CVEs und Supply-Chain-Risiken prüfen
argument-hint: "[Paketdatei oder Ökosystem]"
---
Prüfen Sie die Abhängigkeiten in diesem Projekt auf bekannte Anfälligkeiten und Supply-Chain-Risiken.

Ziel: $ARGUMENTS (automatische Erkennung, wenn leer — gescannt das Repository-Verzeichnis und Unterverzeichnisse nach Manifestdateien).

1. **Ökosystem(e) erkennen**: Identifizieren Sie alle vorhandenen Lockfiles und Manifeste:
   - Node: `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - Python: `requirements*.txt`, `Pipfile.lock`, `pyproject.toml`, `poetry.lock`
   - Go: `go.mod`, `go.sum`
   - Rust: `Cargo.toml`, `Cargo.lock`
   - Java/Kotlin: `pom.xml`, `build.gradle`
   - Ruby: `Gemfile.lock`

2. **Native Audit-Tools ausführen**, wo verfügbar:
   - `npm audit --json` / `yarn audit` / `pnpm audit`
   - `pip-audit` oder `safety check`
   - `cargo audit`
   - `govulncheck ./...`
   - `bundle audit`
   Erfassen Sie die Ausgabe und analysieren Sie die Ergebnisse.

3. **CVEs identifizieren**: Für jedes anfällige Paket berichten Sie:
   - Paketname und aktuelle Version
   - CVE-ID(s) und CVSS-Score
   - Anfälligkeitsbeschreibung (ein Satz)
   - Behobene Version (falls vorhanden)
   - Ob dies eine direkte oder transitive Abhängigkeit ist
   - Ob der anfällige Code-Pfad von der Anwendung aus erreichbar ist

4. **Supply-Chain-Signale**: Kennzeichnen Sie alle Pakete mit:
   - Unveröffentlichte oder verworfene Versionen, die in der Lockfile festgelegt sind
   - Pakete mit null Downloads, einzelnem Betreuer oder sehr kürzlichen Besitzerwechseln
   - Dependency-Confusion-Risiko (interne Paketnamen, die in öffentlichen Registern vorhanden sind)
   - Pakete mit Install-Skripten (`preinstall`, `postinstall`), die beliebigen Code ausführen
   - Wildcard-Version-Pins (`*`, `>=0.0.0`), die zukünftige Versionen akzeptieren

5. **Priorisieren**: Bewerten Sie nach Erreichbarkeit > CVSS-Score > direkt vs. transitiv.

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

Wenn Audit-Tools nicht verfügbar sind, gleichen Sie Versionen mit bekannten CVE-Datenbanken aus Trainingsdaten ab und vermerken Sie die Einschränkung. Ändern Sie keine Dateien und führen Sie keine Install-Befehle aus.
