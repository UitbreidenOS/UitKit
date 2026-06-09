---
description: Voeg verklarende opmerkingen toe aan complexe of niet-voor-de-hand-liggende codesecties
argument-hint: "[file or function]"
---
Voeg verklarende opmerkingen toe aan de code op: $ARGUMENTS

Regels:
- Commentaar het WAAROM, niet het WAT. Herhaal nooit wat de code al zegt.
- Een goed commentaar verklaart: een verborgen beperking, een niet-voor-de-hand-liggende algoritmekeuze, een eigenaardigheden van een externe API, een prestatieruil, of een invariant die moet gelden.
- Slecht commentaar: `// increment i` — de code zegt dat al.
- Goed commentaar: `// skip index 0 — the API returns a sentinel value there, not real data`.

Proces:
1. Lees het doelbestand of de doelfunctie volledig voordat je iets schrijft.
2. Identificeer elk blok waarvoor een competente lezer zou pauzeren en vragen stellen "waarom?".
3. Voor elk dergelijk blok schrijft u een opmerking van één regel (of maximaal twee regels) boven.
4. Als een functie of methode een niet-voor-de-hand-liggende contract heeft (precondities, neveneffecten, ordeningsvereiste), voegt u een kort kopcommentaar toe dat alleen zegt wat niet duidelijk is uit de handtekening.
5. Verwijder alle bestaande opmerkingen die alleen beschrijven wat de code doet — ze voegen ruis toe.
6. Voeg niet een commentaar toe aan elke functie. Alleen waar echt dubbelzinnigheid bestaat.

Commentaarstijl:
- Match de bestaande commentaarstijl in het bestand (taal, opmaak, kapitalisatie).
- Voor JavaScript/TypeScript: `//` voor inline, `/** */` alleen voor openbare API JSDoc.
- Voor Python: `#` inline; docstrings alleen voor openbare functies/klassen, één regel indien mogelijk.
- Geen blokcommentaren die hele secties uitleggen, tenzij de sectie een niet-triviaal algoritme is.

Na het bewerken:
- Rapporteer elke locatie waar u een opmerking hebt toegevoegd of verwijderd met bestand:regel en een éénzinige
  reden voor de wijziging.
- Wijzig de omringende code niet. Alleen chirurgische bewerkingen.
- Als $ARGUMENTS naar een hele directory verwijst, verwerk elk bestand maar sla gegenereerde bestanden over,
  gevendorde code en testaccessoires.
