---
description: Planen und generieren Sie ein interaktives Rebase-Squash-Skript für den aktuellen Branch
argument-hint: "[base-branch]"
---
Bestimmen Sie den Basis-Branch: Verwenden Sie $ARGUMENTS, falls vorhanden, ansonsten erkennen Sie die Merge-Base mit `git merge-base HEAD origin/main` (oder `origin/master`, falls main nicht vorhanden ist).

Führen Sie `git log --oneline <base>..HEAD` aus, um alle Commits im aktuellen Branch aufzulisten.

Analysieren Sie die Commit-Liste und erstellen Sie einen Squash-Plan nach diesen Regeln:

**Gruppieren Sie Commits, die kombiniert werden sollen:**
- `fixup!` oder `squash!` Commits gehören zum Commit, auf den sie sich beziehen
- Commits mit Nachrichten wie "wip", "fix typo", "address review", "lint", "fmt", "cleanup" sollten in den nächstgelegenen vorangehenden substantiellen Commit gefaltet werden
- Commits, die nur eine logische Änderungseinheit betreffen (z. B. alle, die dasselbe Modul oder Feature betreffen), können gequetscht werden, wenn ihre Nachrichten redundant sind

**Belassen Sie als separate Commits:**
- Unterschiedliche Features, Bug-Fixes oder Refactorings, die jeweils einen eigenen Eintrag in der Historie verdienen
- Commits mit unterschiedlichen Typen (feat vs. fix vs. docs), die in einem Changelog erscheinen
- Merge-Commits — markieren Sie diese und warnen Sie, dass Squashing über diese hinweg Vorsicht erfordert

Geben Sie die vorgeschlagene `git rebase -i` Todo-Liste im exakten Rebase-Skriptformat aus:

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

Geben Sie für jeden `squash` oder `reword` Eintrag die vorgeschlagene kombinierte Commit-Nachricht unterhalb des Skriptblocks an.

Geben Sie dann den einzelnen Befehl aus, um das Rebase zu starten:
```
git rebase -i <base-sha>
```

Führen Sie das Rebase nicht aus. Warnen Sie, wenn der Branch bereits an ein gemeinsames Remote-Repository gepusht wurde — Squashing erfordert einen Force-Push.
