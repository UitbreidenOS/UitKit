---
description: Voeg verklarende opmerkingen toe aan complexe of niet-voor-de-hand-liggende codesecties
argument-hint: "[bestand of functie]"
---
Voeg verklarende opmerkingen toe aan de code op: $ARGUMENTS

Regels:
- Commenteer het WAAROM, niet het WAT. Herhaal nooit wat de code al zegt.
- Een goed commentaar verklaart: een verborgen beperking, een niet-voor-de-hand-liggende algoritmische keuze, een eigenaardigheid
  van een externe API, een prestatieafweging, of een invariant dat moet gelden.
- Slecht commentaar: `// increment i` — de code zegt dat al.
- Goed commentaar: `// skip index 0 — de API retourneert daar een sentinelwaarde, geen echte data`.

Proces:
1. Lees het doelbestand of de doelfunctie volledig voordat je iets schrijft.
2. Identificeer elk blok dat een competente lezer zou doen pauzeren en "waarom?" vragen.
3. Schrijf voor elk dergelijk blok een éénregels opmerking (of maximaal twee regels) erboven.
4. Als een functie of methode een niet-voor-de-hand-liggende contract heeft (precondities, bijwerkingen, ordeningsvereiste),
   voeg dan een kort header-commentaar toe dat alleen verklaart wat niet voor de hand ligt uit de handtekening.
5. Verwijder alle bestaande commentaren die alleen beschrijven wat de code doet — ze voegen ruis toe.
6. Voeg niet aan elke functie een commentaar toe. Alleen waar echte ambiguïteit bestaat.

Commentairstijl:
- Stem af op de bestaande commentairstijl in het bestand (taal, opmaak, kapitalisering).
- Voor JavaScript/TypeScript: `//` voor inline, `/** */` alleen voor openbare API JSDoc.
- Voor Python: `#` inline; docstrings alleen voor openbare functies/klassen, één regel indien mogelijk.
- Geen blokcommentaren die hele secties uitleggen tenzij de sectie een niet-triviaal algoritme is.

Na bewerking:
- Rapporteer elke locatie waar je een commentaar hebt toegevoegd of verwijderd met bestand:regel en een éénzinsreden
  voor de wijziging.
- Herformateer geen omringende code. Alleen chirurgische bewerkingen.
- Als $ARGUMENTS naar een heel directory verwijst, verwerk elk bestand maar sla gegenereerde bestanden,
  leverancierscode en testfixtures over.
