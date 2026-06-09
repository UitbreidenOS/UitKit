---
description: Generiere eine CI-Pipeline-Konfiguration für das aktuelle Projekt
argument-hint: "[platform: github|gitlab|circleci|bitbucket] [optional: extra steps]"
---
Generiere eine vollständige CI-Pipeline-Konfiguration für die in $ARGUMENTS angegebene Plattform. Falls keine Plattform angegeben ist, verwende standardmäßig GitHub Actions. Wenn $ARGUMENTS zusätzliche Schritte enthält (z.B. `deploy`, `notify`, `sonar`), füge diese Phasen ein.

Schritte:
1. Erkenne die Sprache, Runtime und Test-Framework des Projekts durch Inspektion von Paket-Manifesten und Konfigurationsdateien.
2. Gestalte eine Pipeline mit diesen Phasen in dieser Reihenfolge:
   - **Lint** — führe den Linter des Projekts aus (ESLint, Flake8, golangci-lint, Clippy, etc.) und scheitere schnell bei Fehlern.
   - **Test** — führe die vollständige Test-Suite mit Coverage-Berichterstattung aus. Cache Dependencies zwischen Läufen.
   - **Build** — kompiliere oder bündele die Anwendung. Produziere ein versioniertes Artefakt.
   - **Security scan** — führe einen Dependency-Vulnerability-Scan durch (npm audit, pip-audit, govulncheck, Trivy für Images, etc.).
   - **Docker build** — baue und push das Image in eine Registry (parametrisiert über Secrets/Umgebungsvariablen). Tag mit dem Commit-SHA und Branch-Name.
   - **Deploy** (falls in $ARGUMENTS angefordert) — füge eine Deploy-Phase hinzu, die an den Ziel-Branch gebunden ist (z.B. `main`).
3. Wende plattformspezifische Best Practices an:
   - GitHub Actions: verwende `actions/cache`, Matrix-Strategie für Multi-Version-Tests falls anwendbar, OIDC-basierte Cloud-Authentifizierung statt langfristiger Credentials.
   - GitLab CI: verwende `cache`, `artifacts`, `rules` statt `only/except`, OIDC wo unterstützt.
   - CircleCI: verwende Orbs für Docker und Language-Setup.
   - Bitbucket: verwende `caches`, `artifacts`, und Bitbucket Pipelines Service Container.
4. Parametrisiere alle Registry-URLs, Image-Namen und Deploy-Ziele als Umgebungsvariablen oder CI-Secrets — hardcodiere sie niemals.
5. Füge einen `pull_request` (oder äquivalent) Trigger hinzu, der Lint, Test und Security Scan ausführt, aber Push und Deploy überspringt.
6. Nach der Konfiguration liste alle Secrets/Variablen auf, die in den CI-Plattform-Einstellungen konfiguriert werden müssen.
