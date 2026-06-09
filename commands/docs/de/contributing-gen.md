---
description: Erstellen Sie eine CONTRIBUTING.md, die auf den aktuellen Workflow dieses Repositorys zugeschnitten ist
argument-hint: "[output-path]"
---
Generieren Sie eine CONTRIBUTING.md für dieses Repository.

Bevor Sie etwas schreiben:
1. Lesen Sie die vorhandene README, alle CI-Konfigurationen (`.github/workflows/`, `Makefile`, `justfile`),
   Lint-/Format-Konfiguration (`.eslintrc`, `pyproject.toml`, `.prettierrc`, etc.) und Test-Runner-
   Konfiguration (`jest.config.*`, `pytest.ini`, `vitest.config.*`).
2. Überprüfen Sie auf vorhandene Beitragsdokumentation — falls `CONTRIBUTING.md` bereits existiert, lesen Sie sie
   vor dem Überschreiben. Bewahren Sie genaue Abschnitte auf; ersetzen Sie veraltete oder fehlende.
3. Identifizieren Sie die tatsächlich verwendeten Befehle: install, build, test, lint, format. Verwenden Sie, was das
   Repository definiert, nicht generische Standards.

Schreiben Sie CONTRIBUTING.md mit diesen Abschnitten:

### Prerequisites
Genaue erforderliche Runtime-/Tool-Versionen (Node, Python, Go, etc.), aus `.nvmrc`,
`.python-version`, `go.mod` oder Äquivalent entnommen. Falls nichts gefunden, notieren Sie dies.

### Getting Started
Clone → install → first run. Nur genaue Befehle. Keine „Sie könnten möglicherweise" Abschwächungen.

### Development Workflow
Wie Sie den Dev-Server / Watcher / REPL ausführen. Wie Sie Tests und Lints ausführen. Genaue Befehle.

### Making Changes
Konvention für Branch-Namen (aus vorhandenen Branch-Namen oder CI-Regeln ableiten, falls vorhanden).
Commit-Nachrichtenformat (aus git log oder commitlint-Konfiguration ableiten).
PR-Prozess: Wer überprüft, welche Checks müssen bestehen, wie fordert man Review an.

### Code Style
Fassen Sie durchgesetzte Regeln aus der Linter-/Formatter-Konfiguration zusammen. Listen Sie nicht jede Regel auf —
nur Entscheidungen, die ein Beitragender aktiv treffen würde (Benennungskonvention, Dateistruktur, Test-Kolokation).

### Testing Requirements
Welche Test-Abdeckung wird erwartet. Wo platzieren Sie neue Tests. Wie führen Sie nur eine Teilmenge aus.

### Submitting a PR
Checkliste: Tests bestanden, Lint bestanden, Docs aktualisiert, falls erforderlich, Changelog-Eintrag, falls relevant.
Link zur CI, falls GitHub Actions vorhanden sind.

Genauigkeitsregeln:
- Jeder Befehl muss aus tatsächlicher Repo-Konfiguration stammen. Erfinden Sie keine Skripte.
- Falls ein Abschnitt keine Belege im Repo hat, lassen Sie ihn weg, anstatt einen generischen Platzhalter zu schreiben.
- Ausgabe zu: $ARGUMENTS (Standard: `CONTRIBUTING.md` im Repository-Root).
- Nach dem Schreiben drucken Sie die Liste der Quelldateien, die Sie gelesen haben, um die Ausgabe zu erzeugen.
