---
description: Verklaar de geschiedenis en bedoeling achter een bestand of specifieke regels met git blame en log
argument-hint: "<file> [start-line:end-line]"
---
Parse $ARGUMENTS:
- First token is the file path (required).
- Optional second token is a line range in the format `start:end` (e.g., `42:67`).

Vraag de gebruiker om een bestand op te geven als dit niet is opgegeven, en stop.

Voer het volgende uit, met vervanging van de geparste waarden:
- `git blame -w -M -C --line-porcelain <file>` (of `-L <start>,<end>` als een bereik is opgegeven)
- `git log --follow --oneline -- <file>` om de volledige hernoem-/verplaatsingsgeschiedenis op te halen
- Voor de top 5 meest geciteerde commits in de blame output: `git show <sha> --stat --format="%H %ae %ad %s%n%b"` om hun volledige context op te halen

Produceer een verklaring ingedeeld als:

**Bestands overzicht**
Één alinea: wat het bestand doet, hoe oud het is, hoeveel auteurs het hebben aangeraakt, en de ruwe vorm van zijn geschiedenis (stabiel versus regelmatig gewijzigd).

**Regel-voor-regel (of chunk-voor-chunk) toewijzing**
Voor elke afzonderlijke commit die regels in het blame bereik bezit:
- Commit SHA (kort), auteur, datum
- Eigenaar regels (bereik of aantal)
- Wat die commit heeft gewijzigd en *waarom* (afleiden uit het commit bericht en diff context)
- Of de wijziging deel uitmaakte van een grotere refactoring, een bugfix, een functie, of een revert

**Belangrijk inzicht**
Twee tot vier zinnen: wat de geschiedenis openbaart over de ontwerpintentie of beperkingen achter de huidige code — bijv. een workaround voor een bekende bug, een API-contract dat niet kan veranderen, een prestatiebegroting die alleen in commit geschiedenis is gedocumenteerd.

**Riskante regels**
Markeer alle regels die:
- Het laatst zijn aangeraakt meer dan 2 jaar geleden door een auteur die niet meer in recente commits voorkomt
- 4 of meer keer zijn gewijzigd (hoge churn)
- Zijn geïntroduceerd door een commit bericht met "hack", "workaround", "tmp", "fixme", of "revert"

Wijzig geen bestanden. Voer `git checkout` of andere schrijfbewerkingen niet uit.
