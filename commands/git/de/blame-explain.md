---
description: Erklären Sie die Geschichte und Absicht hinter einer Datei oder bestimmten Zeilen mit git blame und log
argument-hint: "<file> [start-line:end-line]"
---
Parse $ARGUMENTS:
- First token is the file path (required).
- Optional second token is a line range in the format `start:end` (e.g., `42:67`).

If no file is provided, ask the user to supply one and stop.

Run the following, substituting the parsed values:
- `git blame -w -M -C --line-porcelain <file>` (or `-L <start>,<end>` if a range was given)
- `git log --follow --oneline -- <file>` to get the full rename/move history
- For the top 5 most-cited commits in the blame output: `git show <sha> --stat --format="%H %ae %ad %s%n%b"` to fetch their full context

Erstellen Sie eine Erklärung, die wie folgt organisiert ist:

**Dateiübersicht**
Ein Absatz: Was die Datei tut, wie alt sie ist, wie viele Autoren sie bearbeitet haben, und die grobe Form ihrer Geschichte (stabil oder häufig geändert).

**Zeilen- oder Hunks-Zuordnung**
Für jeden unterschiedlichen Commit, der Zeilen im Blame-Bereich besitzt:
- Commit SHA (kurz), Autor, Datum
- Besessene Zeilen (Bereich oder Anzahl)
- Was dieser Commit geändert hat und *warum* (aus der Commit-Nachricht und dem Diff-Kontext ableiten)
- Ob die Änderung Teil eines größeren Refactoring, einer Fehlerbehebung, einer Funktion oder einer Reversion war

**Wichtige Erkenntnisse**
Zwei bis vier Sätze: Was die Geschichte über die Designabsicht oder Einschränkungen hinter dem aktuellen Code offenbart — z. B. eine Problemumgehung für einen bekannten Bug, einen API-Vertrag, der sich nicht ändern darf, eine Leistungseinschränkung, die nur in der Commit-Historie dokumentiert ist.

**Riskante Zeilen**
Kennzeichnen Sie alle Zeilen, die:
- Vor mehr als 2 Jahren zuletzt von einem Autor geändert wurden, der nicht in neueren Commits vorkommt
- 4 oder mehr Mal geändert wurden (hohe Änderungsrate)
- Durch eine Commit-Nachricht eingeführt wurden, die "hack", "workaround", "tmp", "fixme" oder "revert" enthält

Do not modify any files. Do not run `git checkout` or any write operations.
