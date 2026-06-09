---
description: Identificeer en vermeld verouderde lokale en externe branches die veilig kunnen worden verwijderd
argument-hint: "[remote]"
---
Bepaal de standaard externe opslagplaats. Gebruik $ARGUMENTS als dit is opgegeven, anders detecteer van `git remote show` of val terug op `origin`.

Voer de volgende opdrachten uit en leg hun uitvoer vast:
- `git branch -vv` — lokale branches met upstream-trackinginformatie
- `git branch -r` — externe branches
- `git log --oneline -1 HEAD` — bevestig HEAD-status
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — branch-metagegevens

Classificeer elke lokale branch in een van deze categorieën:

**Veilig om te verwijderen:**
- Branch die upstream volgt waar upstream `[gone]` is (externe branch verwijderd)
- Volledig samengevoegd in de standaardbranch (`git branch --merged <default>`)
- Laatste commit ouder dan 90 dagen zonder gekoppelde open PR

**Mogelijk verouderd — eerst controleren:**
- Laatste commit tussen 30–90 dagen geleden
- Niet samengevoegd, geen upstream-tracking ingesteld
- Naam komt overeen met een patroon dat een kortlopende branch suggereert (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**Behouden:**
- Huidige HEAD-branch
- `main`, `master`, `develop`, `staging`, `release/*` standaard
- Elke branch met commits die niet bereikbaar zijn vanuit de standaardbranch en waarvan de laatste commit binnen 30 dagen ligt

Voer drie secties uit met branchnaam, datum van laatste commit en reden voor classificatie.

Druk vervolgens de exacte opdrachten af om de veilige branches te verwijderen:
```
# Local
git branch -d <branch> ...

# Remote (if applicable)
git push <remote> --delete <branch> ...
```

Gebruik `-d` (veilig verwijderen), niet `-D`, tenzij de branch al is bevestigd samengevoegd. Voer geen verwijderopdrachten uit — druk ze alleen af zodat de gebruiker ze kan controleren en uitvoeren.
