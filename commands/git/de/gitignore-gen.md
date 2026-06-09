---
description: .gitignore für den erkannten oder angegebenen Projekt-Stack generieren oder erweitern
argument-hint: "[stack or language]"
---
Wenn $ARGUMENTS bereitgestellt wird, behandeln Sie es als Stack-Spezifikation (z. B. "node react", "python fastapi", "rust", "go terraform").

Wenn $ARGUMENTS leer ist, erkennen Sie den Stack durch Inspektion des Arbeitsverzeichnisses:
- Führen Sie `ls -1` im Repo-Root aus und scannen Sie nach Indikatordateien: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`, `Gemfile`, `pom.xml`, `build.gradle`, `*.sln`, `Dockerfile`, `.terraform/`, etc.
- Prüfen Sie auf Editor-/IDE-Dateien: `.vscode/`, `.idea/`, `*.xcodeproj`
- Prüfen Sie das Betriebssystem: erkennen Sie macOS (`.DS_Store`-Risiko) oder Windows (`Thumbs.db`-Risiko) aus der Umgebung

Wenn eine `.gitignore` bereits im Repo-Root existiert, lesen Sie diese zuerst. Fügen Sie nur Regeln hinzu, die fehlen — duplizieren Sie keine vorhandenen Einträge.

Generieren Sie den `.gitignore`-Inhalt in beschrifteten Abschnitten organisiert:

```
# === <Stack> ===
# === Editor / IDE ===
# === OS ===
# === Secrets & local config ===
# === Build output ===
# === Test artifacts ===
```

Regeln für jeden Abschnitt:
- **Stack**: sprachspezifische Build-Verzeichnisse, kompilierte Artefakte, Package-Caches, virtuelle Umgebungen, Abhängigkeitsverzeichnisse
- **Editor/IDE**: `.vscode/` (behalten Sie `.vscode/extensions.json` und `settings.json`, falls team-geteilt — vermerken Sie dies), `.idea/`, `*.swp`, `*.swo`, `.DS_Store`, `Thumbs.db`
- **Secrets**: `.env`, `.env.*` (außer `.env.example`), `*.pem`, `*.key`, `secrets.*`, `credentials.*`
- **Build output**: `dist/`, `build/`, `out/`, `target/`, `*.o`, `*.a`, `*.so`, `*.dll`
- **Test artifacts**: `coverage/`, `.nyc_output/`, `*.lcov`, `htmlcov/`, `.pytest_cache/`, `__snapshots__/` (nur wenn nicht absichtlich versionskontrolliert)

Nach dem Inhaltsblock vermerken Sie alle Muster, die Teamdiskussion erfordern, bevor sie hinzugefügt werden (z. B. ob `.vscode/settings.json` ignoriert werden soll).

Schreiben Sie die Datei nicht auf die Festplatte. Geben Sie den vollständigen `.gitignore`-Inhalt aus, damit der Benutzer diese überprüfen und anwenden kann.
