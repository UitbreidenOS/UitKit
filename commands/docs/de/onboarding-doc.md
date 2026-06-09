---
description: Generieren Sie ein Onboarding-Dokument für Entwickler dieser Codebasis
argument-hint: "[output-file]"
---
Sie schreiben ein Onboarding-Dokument für Entwickler dieser Codebasis. Das Ziel ist es, einen neuen Ingenieur so schnell wie möglich produktiv zu machen — ohne Umschweife, ohne Unternehmenssprache.

Target output file (if specified): $ARGUMENTS

Schritte zum Abschließen:

1. Scannen Sie das Repository-Stammverzeichnis auf folgende Dateien: README, package.json, pyproject.toml, Makefile, Dockerfile, docker-compose.yml, .env.example und beliebige CI-Konfigurationsdateien (.github/, .gitlab-ci.yml usw.).

2. Identifizieren Sie:
   - Was das Projekt tut (ein Absatz, keine Marketing-Sprache)
   - Primäre Sprache(n) und Laufzeit-Versionen
   - Wie man Abhängigkeiten installiert
   - Wie man das Projekt lokal ausführt (Dev-Modus)
   - Wie man Tests ausführt
   - Wie man Linting / Typ-Checks ausführt
   - Alle erforderlichen Umgebungsvariablen (aus .env.example oder Dokumentation)
   - Alle erforderlichen externen Dienste (Datenbanken, Warteschlangen, APIs)

3. Suchen Sie nach nicht offensichtlichen Setup-Schritten: Migrationen, Seed-Skripte, Zertifikatsinstallationen, lokale Tunnel, Service-Mocks. Nehmen Sie sie explizit auf.

4. Überprüfen Sie auf CONTRIBUTING.md oder ähnliches. Falls vorhanden, extrahieren Sie die Branching-Strategie, den PR-Prozess und die Erwartungen an die Code-Überprüfung und fassen Sie diese zusammen.

5. Identifizieren Sie die primären Einstiegspunkte: Hauptdateien, Schlüsselmodule, wichtige Verzeichnisse. Geben Sie eine kurze Karte (3–8 Elemente), damit der Leser weiß, wo er zuerst nachschauen soll.

6. Notieren Sie bekannte Stolpersteine, Eigenheiten oder Dinge, die neue Entwickler überraschen (defekte Tools, flaky Tests, ungewöhnliche Konventionen, erforderliche manuelle Schritte).

Schreiben Sie das Dokument in Markdown mit den folgenden Abschnitten — nehmen Sie nur Abschnitte auf, für die Sie echten Inhalt haben:

## Overview
## Prerequisites
## Installation
## Running Locally
## Running Tests
## Environment Variables
## External Dependencies
## Codebase Map
## Contributing
## Known Issues / Gotchas

Rules:
- Write for a senior developer who has never seen this project
- Every command must be copy-pasteable and correct
- Do not invent information — if something is unclear, say so explicitly with a TODO marker
- No motivational language, no "happy path" framing — just facts and commands
- Keep each section tight; bullet points over prose where appropriate

If $ARGUMENTS is a file path, write the output to that file. Otherwise print the document to the conversation.
