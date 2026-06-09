---
description: Maak een veilig, stap-voor-stap rebase plan voor de huidige branch naar een doel
argument-hint: "[target-branch]"
---
Doelbranch: $ARGUMENTS (standaard naar `main` als niet opgegeven).

Verzamel context:
1. `git log <target>...HEAD --oneline` — commits die moeten worden gerebase
2. `git diff <target>...HEAD --stat` — bestanden die zijn aangeraakt
3. `git log <target> -5 --oneline` — recente geschiedenis van target
4. `git status` — status van de werkruimte

Analyseer en maak een rebase plan met:

**Pre-flight checks**
- Geef een lijst van eventuele uncommitted changes die eerst moeten worden gestashed of gecommit
- Identificeer commits die mogelijk conflicteren op basis van overlappende bestandspaden
- Markeer merge commits — interactive rebase heeft `--rebase-merges` nodig als deze aanwezig zijn

**Aanbevolen commando**
Geef de exacte `git rebase` aanroep (interactief of niet, met flags) die geschikt is voor deze situatie.

**Commit plan** (voor interactive rebase)
Geef een overzicht van de commits in rebase volgorde met de aanbevolen actie voor elk:
- `pick` — behoud ongewijzigd
- `squash` / `fixup` — combineer met voorganger (leg uit waarom)
- `reword` — verbeter het bericht (geef het nieuwe bericht op)
- `drop` — verwijder (leg uit waarom)
- `edit` — pauzeer om aan te passen (leg uit wat er moet veranderen)

**Conflict prediction**
Voor elk bestand dat in zowel de branch als de recente target geschiedenis verschijnt, noteer het waarschijnlijke conflict en stel een resolutiestrategie voor.

**Herstel**
Geef het exacte commando om af te breken en de originele staat te herstellen als er iets misgaat.

Wees precies. Twijfel niet. Als de rebase eenvoudig is, zeg dat dan kort.
