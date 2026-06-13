# Session Learning Capture

End-of-session workflow dat lessen, besluiten en ontdekkingen uit Claude Code-sessie extraheert en houdt voordat het contextvenster sluit. Voorkomt kennisevaporatie tussen sessies.

---

## Wanneer te gebruiken

- Aan het einde van elke sessie langer dan 30 minuten
- Na het nemen van architectuurbeslissing tijdens coderingssessie
- Wanneer u niet-triviaal probleem oplost en wilt dat toekomstige Claude-sessies van oplossing profiteren
- Voordat u lange autonome sessie sluit om wat werd gelernd te behouden
- Elke keer u uzelf denkt "Ik zal dit onthouden" — u niet, en Claude ook niet

---

## Fasen

### Fase 1 — Sessie-samenvatting

Begin deze fase voordat context te veel gecomprimeerd wordt.

```
Wij eindigen deze sessie. Voordat we sluiten:

Vat samen wat in deze sessie gebeurde:
1. Wat was origineel doel?
2. Wat was werkelijk gebouwd of gewijzigd?
3. Welke benaderingen werden geprobeerd en afgebroken — en waarom?
4. Welke niet-triviale dingen hebben wij ontdekt? (gotchas, niet-gedocumenteerd gedrag, beperkingen)
5. Wat is nog onvolledig en wat is volgende concrete stap?

Houd het feitelijk. Geen opvulling.
```

Herzie samenvatting voor nauwkeurigheid voordat u voortgaat. Corrigeer alles dat Claude verkeerd begreep over wat werd beslist.

---

### Fase 2 — Regel-extractie

```
Gebaseerd op deze sessie-samenvatting, identificeer instructies die aan CLAUDE.md moeten worden toegevoegd.

Een regel hoort bij CLAUDE.md als:
- Het is specifiek voor dit project (geen algemeen programmeeradvies)
- Claude zou ander besluit nemen zonder het verteld te worden
- Het kwam van werkelijk besluit in deze sessie genomen

Voor elke kandidaat-regel:
  - Voorgestelde tekst (een of twee regels, directieve toon)
  - Sectie van CLAUDE.md waar het hoort
  - Waarom het in toekomstige sessie zou matteren

Stel geen regels voor die al in CLAUDE.md aanwezig zijn.
Stel geen generieke adviezen voor ("schrijf schone code", "verwerk fouten").
```

Herzie elke voorgestelde regel. Accepteer, wijs af of bewerk elk. Voeg geen regels toe waar u het niet mee eens bent — Claude volgt ze letterlijk in toekomstige sessies.

---

### Fase 3 — Architectuurbesluitings-capture

```
Heeft deze sessie architectuurbesluiten impliceert?

Een besluit kwalificeert als ADR als:
- Het was moeilijk omgekeerd (of duur om later te wijzigen)
- Het redenering zou niet duidelijk zijn voor iemand die code leest
- Er was werkelijk alternatief dat werd overwogen en afgewezen

Voor elk kwalificerend besluit:
  - Besluiting-titel (één lijn)
  - Context (welk probleem dwong dit besluit)
  - Besluit genomen (één zin, actieve stem)
  - Alternatieven die waren afgewezen en waarom
  - Gevolgen (wat maakt dit eenvoudiger, wat maakt dit moeilijker)

Als geen ADR-waardig besluiten werden genomen, zeg dat expliciet.
```

Als ADRs zijn geïdentificeerd, genereer ze met ADR-formaat van `skills/productivity/adr-writer.md` en bewaar in `docs/decisions/`.

---

### Fase 4 — LESSONS.md-update

```
Werk LESSONS.md bij met wat in deze sessie werd gelernd.

Als LESSONS.md niet bestaat, maak het met deze structuur:
# Leçons apprises
Levend verslag van niet-triviale dingen ontdekt tijdens ontwikkeling.

## [Datum] — [Sessieonderwerp in 5 woorden]
### Wat wij leerden
[2–5 kogels van concrete, specifieke bevindingen]
### Wat volgende keer te doen
[1–3 actiepunten]

Als LESSONS.md bestaat, voeg nieuwe gedateerde ingang toe — herschrijf bestaande ingangen niet.

Belangrijk: alleen dingen opnemen die werkelijk niet-triviaal waren.
Niet vullen met dingen die volgens plan liepen.
```

---

### Fase 5 — Bevestiging voor schrijven

Toon gebruiker samenvatting van alle voorgestelde schrijvingen voordat u enig bestand raakt:

```
Dit is wat ik ga schrijven:

1. CLAUDE.md toevoegingen: [zet lijst met geaccepteerde regels]
2. Nieuwe ADR-bestanden: [zet bestandspaden en eenregelssamenvattingen]
3. LESSONS.md toevoegingen: [preview van nieuwe ingang]

Bevestig om voort te gaan, of zeg mij wat te wijzigen.
```

Schrijf bestanden alleen na expliciete gebruikersbevestiging. Werk CLAUDE.md nooit stilzwijgend bij.

---

## Voorbeeld

Sessie: "Debugged waarom Prisma-queries in productie timeoutten"

Fase 1 samenvatting: ontdekt dat Prisma verbindingspool-defaults naar 5 verbindingen, productie-belasting vereiste 20, reparatie was `DATABASE_CONNECTION_LIMIT=20` in env + `connection_limit=20` in databaseURL.

Fase 2 regel-extractie:
- Voorgestelde CLAUDE.md-regel: "Controleer altijd `DATABASE_CONNECTION_LIMIT` bij debuggen traagdatabase-queries in productie — Prisma standaardpool van 5 is te klein voor werkelijke belasting."
- Sectie: `## Database`

Fase 3 ADR: geen architectuurniveaubesluit, alleen configuratiereparatie → geen ADR.

Fase 4 LESSONS.md ingang:
```
## 2026-05-23 — Prisma-verbindingspool te klein
### Wat wij leerden
- Prisma standaard naar 5 DB-verbindingen onafhankelijk van plan of servergrootte
- Pooluitputting ziet eruit als traagquery's, geen verbindingsfouten
- Reparatie is `connection_limit=N` in DATABASE_URL, niet toepassingscode
### Wat volgende keer te doen
- Stel connection_limit expliciet in DATABASE_URL op elk nieuw project in
- Monitor `pg_stat_activity` voor inactieve verbindingen voordat u aanneemt query-prestatieproblemen
```

---
