---
description: Analyseer testdekkingsgaten en genereer tests om deze te sluiten
argument-hint: "[file-or-directory]"
---
Analyseer en verbeter testdekking voor: $ARGUMENTS

Stap 1 — Meet huidige dekking.
Voer het dekkingshulpmiddel van het project uit (Jest --coverage, pytest --cov, go test -cover, enz.) beperkt tot $ARGUMENTS. Parseer de uitvoer en identificeer:
- Regels/takken met nul dekking
- Functies die volledig ongetest zijn
- Takken (if/else, switch, ternair) waarbij slechts één pad wordt uitgevoerd

Stap 2 — Prioriteer gaten op basis van risico.
Rangschik ongedekte code op:
1. Zakelijk kritieke paden (betaling, authenticatie, gegevensmutatie)
2. Foutafhandeling en fallback-takken
3. Complexe voorwaardelijke logica (cyclomatische complexiteit > 3)
4. Openbare API-oppervlak versus interne helpers

Stap 3 — Schrijf voor elk gat met hoge prioriteit een gerichte test.
- Noem de test naar het exacte scenario dat het dekt ("throws AuthError when token is expired")
- Houd setup minimaal — alleen wat nodig is om de ongedekte tak te bereiken
- Bevestig het specifieke gedrag, niet alleen dat geen uitzondering is geworpen

Stap 4 — Voer dekking opnieuw uit na het toevoegen van tests en bevestig dat het gat is gesloten. Rapporteer:
- Dekking daarvoor: X%
- Dekking daarna: Y%
- Resterende gaten en waarom het aanvaardbaar is deze te laten staan (bijv. dode code, platformspecifieke takken)

Genereer geen tests die dekkingsstatistieken opvullen zonder werkelijk gedrag te bevestigen (bijv. een functie aanroepen en `toBeTruthy()` bevestigen). Kwaliteit boven kwantiteit.
