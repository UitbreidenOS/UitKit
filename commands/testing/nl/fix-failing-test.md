---
description: Diagnose en repareer een falende test, identificeer de oorzaak voordat je aanpassingen maakt
argument-hint: "[test-naam-of-bestand]"
---
Repareer de falende test: $ARGUMENTS

Raak de test of de implementatie niet aan totdat je de oorzaak hebt gediagnosticeerd.

Stap 1 — Voer de falende test geïsoleerd uit en leg de volledige foutuitvoer vast, inclusief stack trace.

Stap 2 — Classificeer de fout:
- Assertion fout: het code-gedrag is veranderd of de assertion was van het begin af aan verkeerd
- Setup/teardown probleem: gedeelde status lekt tussen tests, ontbrekende mock reset, verkeerde volgorde
- Omgevingsprobleem: ontbrekende omgevingsvariabele, verkeerde werkmap, niet-geïnitialiseerde DB/service
- Type- of import-fout: handtekening gewijzigd, module-pad verkeerd, afhankelijkheid ontbreekt
- Timing/async-probleem: onopgeloste promise, ontbrekende await, race condition

Stap 3 — Traceer de fout naar de bron. Lees de implementatie die wordt getest. Lees alle betrokken mocks of fixtures. Begrijp wat de test oorspronkelijk bedoelde te verifiëren.

Stap 4 — Bepaal wie ervan schuldig is:
- Als de implementatie een echte fout heeft die door een recent wijziging is geïntroduceerd, repareer de implementatie en behoud de test.
- Als de test vanaf het begin incorrect gedrag asserteerde, repareer de test.
- Als de test iets asserteert dat nu opzettelijk anders is (specificatie gewijzigd), update de test en noteer de wijziging van de specificatie.

Stap 5 — Pas de minimale fix toe. Refactor geen omringende code. Wijzig geen gerelateerde assertions.

Stap 6 — Voer de volledige test suite voor de betrokken module uit om te bevestigen dat geen regressies zijn geïntroduceerd.

Rapport: classificatie van de oorzaak, wat je hebt gewijzigd, en waarom.
