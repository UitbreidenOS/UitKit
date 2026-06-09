---
description: Changelog-Eintrag für Commits seit dem letzten Tag oder einer bestimmten Referenz generieren
argument-hint: "[from-ref]"
---
Bestimme den Bereich:
- Wenn $ARGUMENTS angegeben ist, verwende `git log $ARGUMENTS...HEAD`
- Andernfalls führe `git describe --tags --abbrev=0` aus, um das letzte Tag zu finden, und verwende dann `git log <last-tag>...HEAD`
- Falls keine Tags existieren, verwende die vollständige Historie: `git log HEAD`

Führe auch `git log <range> --oneline` und `git diff <range> --stat` aus, um die Struktur zu erhalten.

Erstelle einen Changelog-Eintrag im Keep a Changelog Format (https://keepachangelog.com):

```markdown
## [Unreleased] — <today's date YYYY-MM-DD>

### Added
- <new features and capabilities>

### Changed
- <modifications to existing behavior>

### Deprecated
- <features flagged for future removal>

### Removed
- <deleted features or APIs>

### Fixed
- <bug fixes>

### Security
- <vulnerability patches>
```

Regeln:
- Lasse Abschnitte weg, die keine Einträge haben
- Jeder Eintrag ist eine Zeile, geschrieben für einen Endnutzer oder API-Konsumenten — nicht für interne Entwicklung
- Gruppiere verwandte Commits in einen einzigen Eintrag; führe nicht jeden Commit einzeln auf
- Referenziere PRs oder Issues in Klammern, wenn Commit-Nachrichten sie erwähnen: `(#123)`
- Einträge beginnen mit einem Großbuchstaben, kein Punkt am Ende
- Ignoriere chore/style/refactor Commits, es sei denn, sie beeinflussen das öffentliche Verhalten

Geben Sie nur den Markdown-Block aus.
