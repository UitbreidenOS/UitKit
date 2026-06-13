---
description: Produceer een veilig, stap-voor-stap rebase-plan voor de huidige branch naar een doelbranch
argument-hint: "[target-branch]"
---
Doelbranch: $ARGUMENTS (standaard `main` als niet opgegeven).

Verzamel context:
1. `git log <target>...HEAD --oneline` — commits die opnieuw gebaseerd moeten worden
2. `git diff <target>...HEAD --stat` — getroffen bestanden
3. `git log <target> -5 --oneline` — recente doelbranch-geschiedenis
4. `git status` — staat van de werkboom

Analyseer en produceer een rebase-plan dat het volgende omvat:

**Pre-flight controles**
- Vermeld eventuele niet-gecommitte wijzigingen die eerst gestashed of gecommit moeten worden
- Identificeer commits die mogelijk conflicteren op basis van overlappende bestandspaden
- Markeer merge commits — interactieve rebase zal `--rebase-merges` nodig hebben als deze aanwezig zijn

**Aanbevolen commando**
Geef de exacte `git rebase`-aanroep (interactief of niet, met vlaggen) die geschikt is voor deze situatie.

**Commit-plan** (voor interactieve rebase)
Vermeld de commits in rebase-volgorde met de aanbevolen actie voor elk:
- `pick` — behoud zoals het is
- `squash` / `fixup` — combineer met voorganger (leg uit waarom)
- `reword` — verbeter het bericht (geef het nieuwe bericht op)
- `drop` — verwijder (leg uit waarom)
- `edit` — pauzeer om aan te passen (leg uit wat te wijzigen)

**Conflictvoorspelling**
Voor elk bestand dat zowel in de branch als in recente doelbranch-geschiedenis voorkomt, noteer het waarschijnlijke conflict en stel de oplossingsstrategie voor.

**Herstel**
Geef het exacte commando om af te breken en de originele staat te herstellen als iets fout gaat.

Wees precies. Twijfel niet. Als de rebase eenvoudig is, zeg dat kort.
