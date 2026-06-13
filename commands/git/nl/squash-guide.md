---
description: Plan en genereer een interactief rebase squash script voor de huidige branch
argument-hint: "[base-branch]"
---
Bepaal de base branch: gebruik $ARGUMENTS indien verstrekt, anders detecteer de merge-base met `git merge-base HEAD origin/main` (of `origin/master` indien main afwezig is).

Voer `git log --oneline <base>..HEAD` uit om alle commits op de huidige branch op te sommen.

Analyseer de commitlijst en produceer een squash plan volgens deze regels:

**Commits die moeten worden gecombineerd:**
- `fixup!` of `squash!` commits horen bij de commit waarnaar zij verwijzen
- Commits met berichten zoals "wip", "fix typo", "address review", "lint", "fmt", "cleanup" moeten worden samengevoegd met de dichtstbijzijnde voorgaande substantiële commit
- Commits die slechts één logische eenheid van verandering aanraken (bv. allemaal aanraking van dezelfde module of feature) kunnen worden gequashed als hun berichten overbodig zijn

**Afzonderlijk laten staan:**
- Verschillende features, bugfixes of refactors die elk hun eigen invoer in de geschiedenis verdienen
- Commits met verschillende types (feat vs. fix vs. docs) die in een changelog zullen verschijnen
- Merge commits — markeer deze en waarschuw dat squashing erover heen vereist voorzichtigheid

Voer de voorgestelde `git rebase -i` todo list uit met het exacte rebase script formaat:

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

Voor elke `squash` of `reword` invoer, voeg het voorgestelde gecombineerde commit bericht onder het script blok.

Print vervolgens de enkele opdracht om de rebase te starten:
```
git rebase -i <base-sha>
```

Voer de rebase niet uit. Waarschuw als de branch al naar een gedeelde remote is gepusht — squashing zal een force push vereisen.
