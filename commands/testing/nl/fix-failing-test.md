---
description: Diagnose en repareer een falende test door de onderliggende oorzaak te identificeren voordat je patches
argument-hint: "[test-name-or-file]"
---
Repareer de falende test: $ARGUMENTS

Pas de test of implementatie niet aan totdat je de onderliggende oorzaak hebt gediagnosticeerd.

Stap 1 — Voer de falende test in isolatie uit en leg de volledige foutuitvoer vast, inclusief stack trace.

Stap 2 — Classificeer de fout:
- Assertion failure: het gedrag van de code is veranderd of de assertion was van het begin af aan fout
- Setup/teardown problem: gedeelde toestand lekt tussen tests, ontbrekende mock reset, verkeerde volgorde
- Environment issue: ontbrekende env var, verkeerde werkdirectory, niet-geïnitialiseerde DB/service
- Type of import error: handtekening is veranderd, modulepath is fout, afhankelijkheid ontbreekt
- Timing/async issue: onopgelost promise, ontbrekende await, race condition

Stap 3 — Traceer de fout naar de bron. Lees de implementatie die wordt getest. Lees alle betrokken mocks of fixtures. Begrijp wat de test oorspronkelijk bedoeld was te verifiëren.

Stap 4 — Bepaal wie schuldig is:
- Als de implementatie een echte bug bevat die is geïntroduceerd door een recente wijziging, repareer de implementatie en houd de test.
- Als de test van het begin af aan incorrect gedrag stelde, repareer de test.
- Als de test iets stelt dat nu opzettelijk anders is (spec is veranderd), werk de test bij en noteer de spec wijziging.

Stap 5 — Pas de minimale fix toe. Refactor geen omliggende code. Wijzig geen ongerelateerde assertions.

Stap 6 — Voer de volledige testsuite voor de betrokken module uit om te bevestigen dat geen regressies zijn geïntroduceerd.

Rapport: classificatie van de onderliggende oorzaak, wat je hebt gewijzigd en waarom.
