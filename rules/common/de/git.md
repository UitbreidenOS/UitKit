> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../git.md).

# Git Regeln

Relevante Abschnitte in die `CLAUDE.md` des Projekts kopieren.

---

## Commit-Nachrichten

- Format: `type: kurze Beschreibung` (Imperativ-Modus, ≤ 72 Zeichen)
- Typen: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Beispiele: `feat: add webhook signature verification`, `fix: handle null user in auth middleware`
- Keine generischen Nachrichten: "update", "changes", "fix bug", "wip" sind nicht akzeptabel
- Body (optional): WARUM erklären, nicht was. Das Diff zeigt was.

## Branches

- Feature-Branches: `feat/kurze-beschreibung`
- Bugfixes: `fix/kurze-beschreibung`
- Niemals direkt in `main` oder `master` committen
- Branches nach dem Merge löschen

## Was niemals committen

- `.env`-Dateien oder jede Datei, die Secrets enthält
- `node_modules/`, `__pycache__/`, Build-Artefakte
- Persönliche Editor-Einstellungen (`.idea/`, `.vscode/settings.json`)
- Dateien > 10MB (git-lfs oder externen Speicher verwenden)
- Generierte Dateien, die aus dem Quellcode reproduziert werden können

## Vor dem Pushen

- Tests lokal ausführen — niemals rot pushen
- Eigenes Diff vor jedem Push überprüfen: `git diff origin/main...HEAD`
- WIP-Commits squashen, bevor zu einem geteilten Branch gepusht wird
- Niemals `force-push` auf `main` oder einem geteilten Branch

## Gefährliche Befehle — immer bestätigen vor der Ausführung

- `git reset --hard` — zerstört uncommittete Änderungen dauerhaft
- `git clean -f` — löscht nicht verfolgte Dateien dauerhaft
- `git push --force` — überschreibt die Remote-Historie
- `git stash drop` — verwirft gespeicherte Änderungen dauerhaft

---
