---
description: Erstellen Sie einen sicheren, schrittweisen Rebase-Plan für den aktuellen Branch auf ein Ziel
argument-hint: "[target-branch]"
---
Ziel-Branch: $ARGUMENTS (Standardwert ist `main`, falls nicht angegeben).

Kontext sammeln:
1. `git log <target>...HEAD --oneline` — Commits, die rebasiert werden
2. `git diff <target>...HEAD --stat` — betroffene Dateien
3. `git log <target> -5 --oneline` — aktuelle Ziel-Historie
4. `git status` — Status des Arbeitsverzeichnisses

Analysieren und einen Rebase-Plan erstellen, der Folgendes umfasst:

**Vorflug-Checks**
- Auflisten nicht committeter Änderungen, die zunächst gestasht oder committiert werden müssen
- Commits identifizieren, die Konflikte aufgrund überlappender Dateipfade verursachen können
- Merge-Commits kennzeichnen — interaktiver Rebase benötigt `--rebase-merges`, falls vorhanden

**Empfohlener Befehl**
Den exakten `git rebase` Aufruf bereitstellen (interaktiv oder nicht, mit Flags), der für diese Situation geeignet ist.

**Commit-Plan** (für interaktiven Rebase)
Die Commits in Rebase-Reihenfolge mit der empfohlenen Aktion für jeden auflisten:
- `pick` — unverändert beibehalten
- `squash` / `fixup` — mit Vorgänger kombinieren (Grund erklären)
- `reword` — Commit-Nachricht verbessern (neue Nachricht angeben)
- `drop` — entfernen (Grund erklären)
- `edit` — Pause zum Ändern (erklären, was zu ändern ist)

**Konflikt-Vorhersage**
Für jede Datei, die in beiden der Branch und der aktuellen Ziel-Historie vorkommt, die wahrscheinlichen Konflikt notieren und die Lösungsstrategie vorschlagen.

**Wiederherstellung**
Den exakten Befehl bereitstellen, um abzubrechen und den ursprünglichen Status wiederherzustellen, falls etwas schiefgeht.

Seien Sie präzise. Schwächen Sie nicht ab. Falls der Rebase unkompliziert ist, sagen Sie dies kurz.
