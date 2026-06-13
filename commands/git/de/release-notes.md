---
description: Entwürfe von Versionshinweisen aus Commits zwischen zwei Referenzen oder seit dem letzten Tag
argument-hint: "[from-ref] [to-ref]"
---
Analysiere $ARGUMENTS als bis zu zwei Git-Referenzen, getrennt durch ein Leerzeichen: `from-ref` und `to-ref`. Wenn zwei Referenzen gegeben sind, nutze sie direkt. Wenn eine Referenz gegeben ist, behandle sie als `from-ref` und nutze `HEAD` als `to-ref`. Wenn keine Argumente gegeben sind, erkenne den vorherigen Tag mit `git describe --tags --abbrev=0` als `from-ref` und `HEAD` als `to-ref`.

Führe aus:
```
git log <from-ref>..<to-ref> --pretty=format:"%H %s" --no-merges
```

Sammle auch PR-/Issue-Referenzen, indem du Subjekte nach `#\d+` und Footer-Zeilen (`Closes`, `Fixes`, `Refs`) durchsuchst.

Klassifiziere jeden Commit anhand seines Conventional Commits Präfix:
- `feat` → Features
- `fix` → Fehlerbehebungen
- `perf` → Leistung
- `refactor` → Interne Änderungen (bei externen Versionshinweisen auslassen, es sei denn, sie sind erheblich)
- `docs` → Dokumentation
- `build` / `ci` → Infrastruktur (bei externen Versionshinweisen auslassen)
- `BREAKING CHANGE` Footer oder `!` Suffix → Breaking Changes (immer zuerst, immer prominent)
- Nicht klassifiziert → Sonstige Änderungen

Erstelle Versionshinweise in dieser Struktur:

```markdown
## [version] — YYYY-MM-DD

### Breaking Changes
- ...

### Features
- ...

### Bug Fixes
- ...

### Performance
- ...

### Documentation
- ...
```

Regeln:
- Schreibe Commit-Subjekte in benutzerfreundliche Sprache um: Imperativ, Präsens, keine internen Fachbegriffe
- Gruppiere verwandte Commits in einen einzelnen Punkt, wenn sie dieselbe Funktion oder Fehlerbehebung adressieren
- Hänge `(#N)` PR-/Issue-Referenzen am Ende jedes Punkts an, wo vorhanden
- Lasse `build`, `ci` und reine `chore` Commits aus, es sei denn, sie beeinflussen die öffentliche Schnittstelle
- Wenn `to-ref` HEAD ist und noch nicht getaggt, nutze `[Unreleased]` als Versions-Platzhalter

Gib nur den Entwurf aus. Schreibe nicht in eine Datei und erstelle keinen Tag.
