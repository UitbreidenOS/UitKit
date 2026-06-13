---
description: Testdekkingsgaten analyseren en tests genereren om deze op te lossen
argument-hint: "[bestand-of-map]"
---
Testdekking analyseren en verbeteren voor: $ARGUMENTS

Stap 1 — Huidige dekking meten.
Voer het dekkingsprogramma van het project uit (Jest --coverage, pytest --cov, go test -cover, enz.) scoped op $ARGUMENTS. Parseer de uitvoer en identificeer:
- Regels/takken met nul dekking
- Functies die helemaal niet zijn getest
- Takken (if/else, switch, ternair) waarbij slechts één pad wordt uitgevoerd

Stap 2 — Prioriteer gaten op risico.
Classificeer ongedekte code op volgorde van:
1. Zakelijk kritieke paden (betaling, authenticatie, gegevensmutatie)
2. Foutafhandeling en fallback-takken
3. Complexe voorwaardelijke logica (cyclomatische complexiteit > 3)
4. Openbare API-oppervlak vs. interne hulpfuncties

Stap 3 — Schrijf voor elk belangrijk gat een gerichte test.
- Noem de test naar het exacte scenario dat deze omvat ("throws AuthError when token is expired")
- Houd setup minimaal — alleen wat nodig is om de ongedekte tak te bereiken
- Assert het specifieke gedrag, niet alleen dat er geen uitzondering werd gegooid

Stap 4 — Voer dekking opnieuw uit na het toevoegen van tests en bevestig dat het gat is gesloten. Rapporteer:
- Dekking voor: X%
- Dekking na: Y%
- Resterende gaten en waarom het aanvaardbaar is om deze achter te laten (bijv. dode code, platformspecifieke takken)

Genereer geen tests die dekkingswaarden opblazen zonder reëel gedrag te assert (bijv. een functie aanroepen en assert `toBeTruthy()`). Kwaliteit boven kwantiteit.
