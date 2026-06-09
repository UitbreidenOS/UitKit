---
description: Conceptversie release notes opstellen op basis van commits tussen twee refs of sinds de laatste tag
argument-hint: "[from-ref] [to-ref]"
---
Parseer $ARGUMENTS als maximaal twee git refs gescheiden door een spatie: `from-ref` en `to-ref`. Als twee refs gegeven zijn, gebruik deze direct. Als één ref gegeven is, behandel deze als `from-ref` en gebruik `HEAD` als `to-ref`. Als geen argumenten gegeven zijn, detecteer de vorige tag met `git describe --tags --abbrev=0` als `from-ref` en `HEAD` als `to-ref`.

Voer uit:
```
git log <from-ref>..<to-ref> --pretty=format:"%H %s" --no-merges
```

Verzamel ook PR/issue verwijzingen door onderwerpen te scannen op `#\d+` en voettekstregels (`Closes`, `Fixes`, `Refs`).

Classificeer elke commit op basis van het Conventional Commits-voorvoegsel:
- `feat` → Features
- `fix` → Bug Fixes
- `perf` → Performance
- `refactor` → Internal Changes (weglaten uit externe release notes tenzij significant)
- `docs` → Documentation
- `build` / `ci` → Infrastructure (weglaten uit externe release notes)
- `BREAKING CHANGE` voettekst of `!` achtervoegsel → Breaking Changes (altijd eerst, altijd prominent)
- Niet-geclassificeerd → Other Changes

Concept release notes in deze structuur:

```markdown
## [version] — YYYY-MM-DD

### Breaking Changes
- ...

### Features
- ...

### Bug Fixes
- ...

### Performance
- ...

### Documentation
- ...
```

Regels:
- Herschrijf commit-onderwerpen naar gebruiksvriendelijke taal: imperatief, present tense, geen intern jargon
- Groepeer gerelateerde commits in een enkele bullet als zij hetzelfde feature of fix aanpakken
- Voeg `(#N)` PR/issue verwijzingen toe aan het einde van elke bullet waar beschikbaar
- Weglaten van `build`, `ci` en zuivere `chore` commits tenzij zij de openbare interface beïnvloeden
- Als `to-ref` HEAD is en nog niet getagged, gebruik `[Unreleased]` als versieplek

Voer de concept uit. Schrijf niet naar een bestand of maak een tag aan.
