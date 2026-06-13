---
description: Identificeer en vermeld lokale en externe branches die veilig kunnen worden verwijderd
argument-hint: "[remote]"
---
Bepaal de standaard remote. Gebruik $ARGUMENTS als deze is opgegeven, detecteer anders via `git remote show` of val terug op `origin`.

Voer de volgende opdrachten uit en leg hun uitvoer vast:
- `git branch -vv` — lokale branches met upstream tracking-informatie
- `git branch -r` — externe branches
- `git log --oneline -1 HEAD` — bevestig HEAD-status
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — branch-metagegevens

Classificeer elke lokale branch in een van deze categorieën:

**Veilig om te verwijderen:**
- Tracking branch waarbij upstream `[gone]` is (externe branch verwijderd)
- Volledig samengevoegd in de standaard branch (`git branch --merged <default>`)
- Laatste commit ouder dan 90 dagen met geen geassocieerde open PR

**Mogelijk verouderd — controleer eerst:**
- Laatste commit tussen 30–90 dagen geleden
- Niet samengevoegd, geen upstream tracking ingesteld
- Naam komt overeen met een patroon dat een kortstondige branch suggereert (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**Behouden:**
- Huidige HEAD branch
- `main`, `master`, `develop`, `staging`, `release/*` standaard
- Elke branch met commits die niet bereikbaar zijn vanaf de standaard branch en waarvan de laatste commit binnen 30 dagen is

Voer drie secties uit met branchnaam, datum van laatste commit en reden voor classificatie.

Print vervolgens de exacte opdrachten om de veilige branches te verwijderen:
```
# Lokaal
git branch -d <branch> ...

# Extern (indien van toepassing)
git push <remote> --delete <branch> ...
```

Gebruik `-d` (veilig verwijderen), niet `-D`, tenzij de branch al is bevestigd samengevoegd. Voer geen verwijderopdrachten uit — print ze alleen zodat de gebruiker ze kan controleren en uitvoeren.
