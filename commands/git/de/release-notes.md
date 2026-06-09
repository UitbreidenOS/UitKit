---
description: Entwurf von Release Notes aus Commits zwischen zwei Refs oder seit dem letzten Tag
argument-hint: "[from-ref] [to-ref]"
---
Parse $ARGUMENTS als bis zu zwei git refs, getrennt durch ein Leerzeichen: `from-ref` und `to-ref`. Wenn zwei refs gegeben sind, verwende sie direkt. Wenn eine ref gegeben ist, behandle sie als `from-ref` und verwende `HEAD` als `to-ref`. Wenn keine args gegeben sind, erkenne das vorherige Tag mit `git describe --tags --abbrev=0` als `from-ref` und `HEAD` als `to-ref`.

Führe aus:
```
git log <from-ref>..<to-ref> --pretty=format:"%H %s" --no-merges
```

Sammle auch PR/Issue-Referenzen, indem du Subjects nach `#\d+` und Footer-Zeilen (`Closes`, `Fixes`, `Refs`) scannst.

Klassifiziere jeden Commit anhand seines Conventional Commits Präfix:
- `feat` → Features
- `fix` → Bug Fixes
- `perf` → Performance
- `refactor` → Interne Änderungen (weglassen aus externen Release Notes, es sei denn, sie sind bedeutsam)
- `docs` → Dokumentation
- `build` / `ci` → Infrastruktur (weglassen aus externen Release Notes)
- `BREAKING CHANGE` Footer oder `!` Suffix → Breaking Changes (immer zuerst, immer prominent)
- Unklassifiziert → Sonstige Änderungen

Entwerfe Release Notes in dieser Struktur:

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
- Schreibe Commit-Subjects in benutzergerichtete Sprache um: Imperativ, Präsens, keine interne Fachsprache
- Gruppiere verwandte Commits in eine einzelne Aufzählung, wenn sie sich auf das gleiche Feature oder Fix beziehen
- Hänge `(#N)` PR/Issue-Referenzen am Ende jeder Aufzählung an, wenn verfügbar
- Lasse `build`, `ci` und reine `chore` Commits weg, es sei denn, sie beeinflussen die öffentliche Schnittstelle
- Wenn `to-ref` HEAD ist und noch nicht getaggt, verwende `[Unreleased]` als Versions-Platzhalter

Gib nur den Entwurf aus. Schreibe nicht in eine Datei oder erstelle ein Tag.
