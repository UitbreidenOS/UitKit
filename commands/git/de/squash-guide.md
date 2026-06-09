---
description: Planen und generieren Sie ein interaktives Rebase-Squash-Skript für den aktuellen Branch
argument-hint: "[base-branch]"
---
Bestimmen Sie den Basis-Branch: Verwenden Sie $ARGUMENTS, falls bereitgestellt, sonst erkennen Sie die Merge-Base mit `git merge-base HEAD origin/main` (oder `origin/master`, falls main nicht vorhanden ist).

Führen Sie `git log --oneline <base>..HEAD` aus, um alle Commits im aktuellen Branch aufzulisten.

Analysieren Sie die Commit-Liste und erstellen Sie einen Squash-Plan nach folgenden Regeln:

**Commits gruppieren, die kombiniert werden sollten:**
- `fixup!` oder `squash!` Commits gehören zu dem Commit, auf den sie sich beziehen
- Commits mit Nachrichten wie "wip", "fix typo", "address review", "lint", "fmt", "cleanup" sollten in den nächsten vorherigen substantiellen Commit integriert werden
- Commits, die nur eine logische Änderungseinheit berühren (z. B. alle das gleiche Modul oder Feature berühren), können gequetscht werden, wenn ihre Nachrichten redundant sind

**Als separate Commits belassen:**
- Unterschiedliche Features, Bugfixes oder Refactors, die jeweils ihren eigenen Eintrag in der History verdienen
- Commits mit verschiedenen Typen (feat vs. fix vs. docs), die in einem Changelog angezeigt werden
- Merge Commits — kennzeichnen Sie diese und warnen Sie, dass das Squashing über diese hinweg Vorsicht erfordert

Geben Sie die vorgeschlagene `git rebase -i` Todo-Liste im exakten Rebase-Skript-Format aus:

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

Für jeden `squash`- oder `reword`-Eintrag geben Sie die vorgeschlagene kombinierte Commit-Nachricht unter dem Skript-Block an.

Geben Sie dann den einzelnen Befehl aus, um das Rebase zu starten:
```
git rebase -i <base-sha>
```

Führen Sie das Rebase nicht aus. Warnen Sie, wenn der Branch bereits zu einem gemeinsamen Remote gepusht wurde — Squashing erfordert einen Force Push.
