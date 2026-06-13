---
description: Leg de geschiedenis en intentie achter een bestand of specifieke regels uit met git blame en log
argument-hint: "<bestand> [start-regel:eind-regel]"
---
Parse $ARGUMENTS:
- Eerste token is het bestandspad (verplicht).
- Optionele tweede token is een regelbereik in het formaat `start:eind` (bijv. `42:67`).

Als geen bestand wordt gegeven, vraag de gebruiker om er een op te geven en stop.

Voer het volgende uit, vervang de geparste waarden:
- `git blame -w -M -C --line-porcelain <bestand>` (of `-L <start>,<eind>` als een bereik werd gegeven)
- `git log --follow --oneline -- <bestand>` om de volledige hernoem-/verplaatsingsgeschiedenis te verkrijgen
- Voor de top 5 meest geciteerde commits in de blame-uitvoer: `git show <sha> --stat --format="%H %ae %ad %s%n%b"` om hun volledige context op te halen

Maak een uitleg die is georganiseerd als:

**Bestandsoverzicht**
Eén alinea: wat het bestand doet, hoe oud het is, hoeveel auteurs hebben eraan gewerkt, en de ruwe vorm van zijn geschiedenis (stabiel vs. frequent veranderd).

**Regel-voor-regel (of hunk-voor-hunk) toewijzing**
Voor elke afzonderlijke commit die eigenaar is van regels in het blame-bereik:
- Commit SHA (kort), auteur, datum
- Regels in eigendom (bereik of aantal)
- Wat die commit veranderde en *waarom* (afleiden uit het commit-bericht en diff-context)
- Of de wijziging deel uitmaakte van een grotere refactor, een bugfix, een feature, of een revert

**Belangrijkste inzicht**
Twee tot vier zinnen: wat de geschiedenis onthult over de ontwerpintentie of beperkingen achter de huidige code — bijv. een workaround voor een bekend bug, een API-contract dat niet kan veranderen, een prestatiebeperkation gedocumenteerd alleen in commit-geschiedenis.

**Riskante regels**
Markeer regels die:
- Voor het laatst meer dan 2 jaar geleden zijn aangepast door een auteur die niet in recente commits voorkomt
- 4 of meer keer zijn gewijzigd (hoge churn)
- Zijn geïntroduceerd door een commit-bericht met "hack", "workaround", "tmp", "fixme", of "revert"

Wijzig geen bestanden. Voer `git checkout` of geen schrijfbewerkingen uit.
