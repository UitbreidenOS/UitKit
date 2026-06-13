---
description: Einen Changelog-Eintrag für Commits seit dem letzten Tag oder einer gegebenen Referenz generieren
argument-hint: "[from-ref]"
---
Bestimmen Sie den Bereich:
- Wenn $ARGUMENTS bereitgestellt wird, verwenden Sie `git log $ARGUMENTS...HEAD`
- Ansonsten führen Sie `git describe --tags --abbrev=0` aus, um den letzten Tag zu finden, und verwenden Sie dann `git log <last-tag>...HEAD`
- Wenn keine Tags vorhanden sind, verwenden Sie den vollständigen Verlauf: `git log HEAD`

Führen Sie auch `git log <range> --oneline` und `git diff <range> --stat` für die Struktur aus.

Erstellen Sie einen Changelog-Eintrag im Keep a Changelog-Format (https://keepachangelog.com):

```markdown
## [Unreleased] — <heutiges Datum YYYY-MM-DD>

### Added
- <neue Funktionen und Fähigkeiten>

### Changed
- <Änderungen am bestehenden Verhalten>

### Deprecated
- <Funktionen, die für zukünftige Entfernung gekennzeichnet sind>

### Removed
- <gelöschte Funktionen oder APIs>

### Fixed
- <Fehlerbehebungen>

### Security
- <Sicherheitspatches>
```

Regeln:
- Lassen Sie Abschnitte weg, die keine Einträge haben
- Jeder Eintrag ist eine Zeile, geschrieben für einen Endbenutzer oder API-Konsumenten – nicht für interne Entwicklung
- Gruppieren Sie verwandte Commits in einen einzigen Eintrag; listen Sie nicht jeden Commit einzeln auf
- Referenzieren Sie PRs oder Issues in Klammern, wenn Commit-Nachrichten diese erwähnen: `(#123)`
- Einträge beginnen mit einem Großbuchstaben, ohne Punkt am Ende
- Ignorieren Sie chore/style/refactor Commits, es sei denn, sie beeinflussen das öffentliche Verhalten

Geben Sie nur den Markdown-Block aus.
