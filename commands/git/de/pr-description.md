---
description: Erstelle einen Pull-Request-Titel und eine Beschreibung aus Branch-Commits und Diff
argument-hint: "[base-branch]"
---
Bestimme den Basis-Branch: verwende $ARGUMENTS falls angegeben, ansonsten Standard `main`.

Führe diese Befehle aus, um Kontext zu sammeln:
1. `git log <base-branch>...HEAD --oneline` — Liste der Commits auf diesem Branch
2. `git diff <base-branch>...HEAD --stat` — Zusammenfassung der Änderungen auf Dateiebene
3. `git diff <base-branch>...HEAD` — vollständiger Diff für semantische Analyse

Erstelle aus diesem Kontext eine Pull-Request-Beschreibung in Markdown:

```
## Summary
<2-4 Aufzählungspunkte, die beschreiben, was sich geändert hat und warum — keine Dateiliste>

## Changes
<Gruppiert nach Belang, nicht nach Datei. Verwende Unteraufzählungen für Details.>

## Testing
<Spezifische Test-Schritte, die ein Reviewer ausführen sollte, um die Korrektheit zu überprüfen.
Wenn Tests automatisiert sind, gib die Test-Dateien oder Befehle an.>

## Notes for reviewers
<Kennzeichne nicht offensichtliche Entscheidungen, Kompromisse, Unsicherheiten oder TODOs für die Nachbereitung.
Lass diesen Abschnitt weg, wenn es nichts Bemerkenswertes gibt.>
```

Gib am Anfang vor dem Body eine einzelne Zeile aus:
`Title: <imperativ, ≤70 Zeichen, kein Punkt>`

Berücksichtige keine Boilerplate-Überschriften, die das Repository nicht benötigt. Fasse die Absicht zusammen, anstatt jede geänderte Datei zu beschreiben.
