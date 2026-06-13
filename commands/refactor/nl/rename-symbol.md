---
description: Hernoem een symbool consistent in alle bestanden in bereik
argument-hint: "[oude-naam] [nieuwe-naam] [bestand of directory]"
---
Hernoem het symbool gespecificeerd in $ARGUMENTS — formaat: `<oude-naam> <nieuwe-naam> <pad>`.

1. Parse de argumenten: oude naam, nieuwe naam, en het bestand of directory waarop gewerkt moet worden.

2. Valideer voordat je gaat hernoemen:
   - De nieuwe naam volgt de naamconventie gebruikt voor dat symbooltype in deze codebase (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, enz.)
   - De nieuwe naam bestaat nog niet in dezelfde scope
   - De nieuwe naam is geen gereserveerd trefwoord of naam gebruikt door een geïmporteerde afhankelijkheid

3. Vind elke verwijzing naar de oude naam binnen het gespecificeerde bereik:
   - Declaratie (functiedefinitie, klasse, variabele, type alias, constant, enum member)
   - Alle oproeplocaties en gebruikspunten
   - Import/export statements (named imports, re-exports)
   - String literals die bekend verwijzen naar het symbool (bijv. event names, dynamische `require()`, `keyof` string access) — vlag maar hernoem niet automatisch, omdat dit API-contracten kunnen zijn
   - JSDoc / docstring verwijzingen
   - Opmerkingen die het symbool noemen — werk bij als de hernoaming de opmerking incorrect maakt

4. Pas de hernoaming toe op elke geïdentificeerde locatie. Hernoem niet:
   - Gedeeltelijke matches (bijv. `user` hernoemen mag `username` of `currentUser` niet aanraken)
   - Niet-gerelateerde symbolen die toevallig dezelfde naam delen in een ander bereik
   - Externe bestanden buiten het gespecificeerde pad tenzij het symbool wordt geëxporteerd en die bestanden zich in de repo bevinden

5. Na het hernoemen, controleer dat alle import paden en module re-exports intern consistent zijn.

6. Output: totale aantal bijgewerkte verwijzingen, lijst met gewijzigde bestanden, en alle locaties gemarkeerd voor handmatige controle (string literals, dynamische access).
