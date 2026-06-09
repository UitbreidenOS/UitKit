---
description: Plan en genereer een interactief rebase squash script voor de huidige branch
argument-hint: "[base-branch]"
---
Bepaal de basis branch: gebruik $ARGUMENTS indien aangeboden, anders detecteer de merge-base met `git merge-base HEAD origin/main` (of `origin/master` als main afwezig is).

Voer `git log --oneline <base>..HEAD` uit om alle commits op de huidige branch weer te geven.

Analyseer de commit list en produceer een squash plan volgens deze regels:

**Groepeer commits die gecombineerd moeten worden:**
- `fixup!` of `squash!` commits horen bij de commit waarnaar ze verwijzen
- Commits met berichten zoals "wip", "fix typo", "address review", "lint", "fmt", "cleanup" moeten worden gevouwen in de dichtstbijzijnde voorgaande substantiële commit
- Commits die slechts één logische wijzigingseenheid raken (bijv. allemaal dezelfde module of feature) kunnen worden gesquashed als hun berichten redundant zijn

**Laat als aparte commits:**
- Verschillende functies, bugfixes of refactorings die elk hun eigen entry in history verdienen
- Commits met verschillende typen (feat vs. fix vs. docs) die verschijnen in een changelog
- Merge commits — flag deze en waarschuw dat squashing over hen heen voorzichtigheid vereist

Voer de voorgestelde `git rebase -i` todo list uit met het exacte rebase script format:

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

Voor elke `squash` of `reword` entry, geef het voorgestelde gecombineerde commit bericht onder het script block.

Druk dan de enkele comando af om de rebase te starten:
```
git rebase -i <base-sha>
```

Voer de rebase niet uit. Waarschuw als de branch al naar een gedeelde remote is gepusht — squashing vereist een force push.
