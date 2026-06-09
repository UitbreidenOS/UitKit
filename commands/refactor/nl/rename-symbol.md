---
description: Hernoem een symbool consistent in alle bestanden in bereik
argument-hint: "[old-name] [new-name] [file or directory]"
---
Hernoem het symbool opgegeven in $ARGUMENTS — format: `<old-name> <new-name> <path>`.

1. Parse de argumenten: oude naam, nieuwe naam, en het bestand of de map waarop moet worden gewerkt.

2. Valideer voordat je hernoemt:
   - De nieuwe naam volgt de naamgevingsconventie die voor dat symbooltype in deze codebase wordt gebruikt (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, enz.)
   - De nieuwe naam bestaat nog niet in hetzelfde bereik
   - De nieuwe naam is geen gereserveerd sleutelwoord of een naam die door een geïmporteerde afhankelijkheid wordt gebruikt

3. Zoek alle verwijzingen naar de oude naam binnen het opgegeven bereik:
   - Declaratie (functiedefinitie, klasse, variabele, type alias, constante, enum-lid)
   - Alle aanroepplaatsen en gebruikspunten
   - Import/export-instructies (benoemde imports, re-exports)
   - String-letterwaarden waarvan bekend is dat ze naar het symbool verwijzen (bijv. gebeurtenisnamen, dynamische `require()`, `keyof` string-toegang) — markeer maar hernoem deze niet automatisch, omdat ze API-contracten kunnen zijn
   - JSDoc / docstring-verwijzingen
   - Opmerkingen die het symbool noemen — werk deze bij als de hernoaming de opmerking onjuist maakt

4. Pas de hernoaming toe op elke geïdentificeerde locatie. Hernoem niet:
   - Gedeeltelijke overeenkomsten (bijv. hernoemen van `user` mag `username` of `currentUser` niet aanraken)
   - Niet-gerelateerde symbolen die toevallig dezelfde naam hebben in een ander bereik
   - Externe bestanden buiten het opgegeven pad tenzij het symbool wordt geëxporteerd en deze bestanden zich in de repo bevinden

5. Controleer na hernoemen dat alle importpaden en module re-exports intern consistent zijn.

6. Uitvoer: totaal aantal bijgewerkte verwijzingen, lijst met gewijzigde bestanden, en alle locaties die voor handmatige beoordeling zijn gemarkeerd (string-letterwaarden, dynamische toegang).
