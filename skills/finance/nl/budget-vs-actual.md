---
name: budget-vs-actual
description: "Budget vs. werkelijk analyse: variantietoelichting, trendidentificatie, herprognoseaanbevelingen"
---

# Vaardigheid: Budget vs. Werkelijk

## Wanneer activeren
- Maandelijkse of kwartaallijkse budget vs. werkelijk (BvW)-analyse uitvoeren
- Afwijkingen toelichten aan leiderschap, de board of investeerders
- Trends vroegtijdig identificeren om bijsturing mogelijk te maken
- Een herprognose opstellen na significante afwijking van het oorspronkelijke budget
- Een managementcommentaarsectie produceren ter begeleiding van financiële rapporten

## Wanneer NIET gebruiken
- Voorbereiding van gecontroleerde jaarrekeningen — vereist een gecertificeerde accountant
- Belastingberekening — andere aanpassingen van toepassing, gebruik een belastingadviseur
- Prospectussen voor investeerders — gereguleerde openbaarmaking, vereist juridische beoordeling
- Je hebt geen budgetbasislijn — voer eerst een financiële planningssessie uit (`/financial-plan`)

## BELANGRIJK

Alle afwijkingscijfers moeten een `[VERIFIEER]`-markering dragen totdat ze zijn bevestigd aan de hand van brondata. Managementcommentaar is slechts zo goed als de onderliggende data — geef aan waar schattingen, overlopende posten of voorlopige cijfers zijn gebruikt.

## Instructies

### Kernprompt voor BvW-analyse

```
Voer een budget vs. werkelijk analyse uit voor [BEDRIJF] — [PERIODE: Maand/Kwartaal/JTD].

Plak je data of geef deze invoer:

OMZET:
- Budget: $[X]
- Werkelijk: $[X]
- Afwijking: $[X] ([X]% G/O) ← Claude berekent als je budget + werkelijk geeft

INKOOPKOSTEN:
- Budget: $[X]
- Werkelijk: $[X]

BRUTOWINST:
- Budget: $[X]
- Werkelijk: $[X]

OPEX PER POST:
Verkoop & Marketing: Budget $[X] | Werkelijk $[X]
R&D / Engineering: Budget $[X] | Werkelijk $[X]
G&A: Budget $[X] | Werkelijk $[X]
Overig: Budget $[X] | Werkelijk $[X]

EBITDA / OPERATIONEEL VERLIES:
- Budget: $[X]
- Werkelijk: $[X]

NETTO VERBRANDING (kas):
- Budget: $[X]
- Werkelijk: $[X]

CONTEXT:
- Hoofdredenen voor afwijkingen (kort): [beschrijf wat je weet]
- Eenmalige posten: [ja/nee — beschrijf]
- Werkelijke cijfers vorige maand (voor trend): [optioneel]

Produceer:
1. Samenvatting afwijkingstabel ($ en %)
2. Managementcommentaar voor elke materiële afwijking (>5% of >$X drempel)
3. Trendanalyse t.o.v. vorige periode
4. Vroege waarschuwingssignalen
5. Herprognoseaanbeveling
```

### Raamwerk voor variantieanalyse

```typescript
type VarianceDirection = 'FAVORABLE' | 'UNFAVORABLE'

interface LineItemVariance {
  name: string
  budget: number
  actual: number
  variance: number            // actual - budget (negative = favorable for costs)
  variancePct: number         // variance / budget * 100
  direction: VarianceDirection
  material: boolean           // true if abs(variancePct) > threshold (usually 5-10%)
  explanation: string         // root cause
  oneTimeItem: boolean        // if true, adjust run-rate for reforecast
  forwardImplication: string  // what this means for next period
}

// CONVENTION:
// Revenue: positive variance = favorable (actual > budget = beat)
// Costs: negative variance = favorable (actual < budget = underspend)
// Use F (favorable) / U (unfavorable) notation in tables

// MATERIALITY THRESHOLDS (customise):
// Large company: >5% AND >$50K
// Startup: >10% OR >$10K
// Always flag any line that is >20% regardless of dollar amount
```

### Generator voor afwijkingstabel

```
Genereer een budget vs. werkelijk afwijkingstabel voor [PERIODE].

Formaat:

| Post | Budget | Werkelijk | Afwijking $ | Afwijking % | G/O | Commentaar |
|---|---|---|---|---|---|---|
| Omzet | $[X] | $[X] | $[X] | [X]% | G/O | [1-regel toelichting] |
| Inkoopkosten | $[X] | $[X] | $[X] | [X]% | G/O | [1-regel toelichting] |
| Brutowinst | $[X] | $[X] | $[X] | [X]% | G/O | — |
| **Brutomarge%** | [X]% | [X]% | [X]bps | — | G/O | — |
| Verkoop & Marketing | $[X] | $[X] | $[X] | [X]% | G/O | [1-regel toelichting] |
| R&D | $[X] | $[X] | $[X] | [X]% | G/O | [1-regel toelichting] |
| G&A | $[X] | $[X] | $[X] | [X]% | G/O | [1-regel toelichting] |
| EBITDA | $[X] | $[X] | $[X] | [X]% | G/O | — |
| Netto Verbranding | $[X] | $[X] | $[X] | [X]% | G/O | — |

Regels:
- Alle $ in duizenden (of miljoenen indien opgegeven)
- Afronden op dichtstbijzijnde $K
- Markeer rijen waar |afwijking%| > [DREMPEL]% met ⚠
- Eenmalige posten: voeg "(eenmalig)" toe aan commentaar
```

### Prompt managementcommentaar

```
Schrijf managementcommentaar voor de volgende materiële afwijkingen.

OMZETAFWIJKING — $[X]K [G/O] ([X]%):
Context: [wat er is gebeurd — bijv. 2 deals verschoven, prijswijziging, verloop, seizoensgebonden]
Schrijf commentaar dat: de hoofdoorzaak toelicht, de aanjager kwantificeert, onderscheidt
terugkerend vs. eenmalig, en de voorwaartse implicatie noteert.

Formaat:
"Omzet bedroeg $[X]K, $[X]K [onder/boven] budget ([X]%). De primaire aanjager was
[hoofdoorzaak]. [Kwantificering]. [Eenmalig vs. structureel]. [Voorwaartse implicatie]."

OPEX-AFWIJKING — [Post] — $[X]K [G/O] ([X]%):
Context: [bijv. aanwerving trager dan gepland, leverancierscontract vertraagd, eenmalig consultantenhonorarium]
Schrijf commentaar met hetzelfde formaat.

Regels voor goed managementcommentaar:
- Specifiek, niet vaag ("drie enterprise-deals verschoven" niet "tragere verkoop")
- Kwantificeer elke aanjager ("vertegenwoordigt $180K van het tekort van $240K")
- Scheid terugkerende van eenmalige posten expliciet
- Vermeld de voorwaartse implicatie (blijft deze afwijking voortduren in de volgende maand?)
- Wees niet defensief — beschrijf wat er is gebeurd en wat er aan wordt gedaan
```

### Prompt herprognose

```
Stel een herprognose op op basis van BvW-resultaten.

Oorspronkelijk volledig jaarbudget:
[Plak of beschrijf het oorspronkelijke jaarbudget per post]

Jaar-tot-datum werkelijke cijfers ([X] maanden):
[Plak JTD werkelijke cijfers]

Sleutelwijzigingen in aannames:
1. Omzet: [bijv. Q1-tekort van $X was alleen timing — geen structurele wijziging]
2. Personeelsbezetting: [bijv. 2 aanwervingen verschoven van Q1 naar Q2 — impact $X/maand in kostentiming]
3. Eenmalige posten: [bijv. $X herstructureringskosten niet in oorspronkelijk budget]
4. Marktomstandigheden: [eventuele wijziging in de onderliggende aannames]

Produceer:
- Herziene prognose volledig jaar per kwartaal
- Afwijking van oorspronkelijk budget (hoeveel is het volledige jaar gewijzigd en waarom)
- Beste geval / basisscenario / negatief scenario (3 scenario's)
- Herziene kaslooptijd bij elk scenario
- Sleutelaannames die de bandbreedte tussen scenario's bepalen

Formatteer de uitvoer als herprognosenarratief + ondersteunende tabel.
Markeer alle herprognose-cijfers [VERIFIEER].
```

### Prompt trendanalyse

```
Voer een trendanalyse over 6 maanden uit.

Geef data voor de afgelopen 6 maanden (of zoveel als beschikbaar):
[Maand 1]: Omzet $X, Brutomarge X%, Netto Verbranding $X, [Kern KPI] X
[Maand 2]: ...
...
[Maand 6]: ...

Analyseer:
1. Omzettraject: versnelt de groei, is deze stabiel of vertraagt ze?
   - Bereken MoM-groeipercentages
   - Identificeer buigpunten

2. Margetrend: breidt de brutomarge uit, krimpt ze of is ze stabiel?
   - Markeer als de brutomarge >2 procentpunten per maand krimpt — onderzoek inkoopkosten

3. Verbrandingstrend: neemt de verbranding toe of af ten opzichte van de omzet?
   - Bereken verbrandingsmultiplier per maand: netto verbranding / netto nieuwe ARR
   - Een verbrandingsmultiplier >2x duidt op inefficiënte groei

4. Voorlopende indicatoren om in de gaten te houden:
   - Pijplijn- / boekingstrend (voorlopend → omzet met X maanden vertraging)
   - Trend nieuw klantenaantal
   - Verlooppercentagetrend

5. Vroege waarschuwingen:
   - Elke statistiek die 2+ opeenvolgende maanden de verkeerde kant op is gegaan
   - Elke eenmaandsuitschieters die de trend kan vertekenen

Uitvoer: trendtabel + 3-zin commentaar per statistiek.
```

### CFO-commentaarsjabloon

```
Schrijf de CFO-financiële samenvatting voor [PERIODE].

Dit 1-paginasectie gaat naar de CEO, board en investeerders. Het moet:
- Openen met het hoofdoordeel (op schema, vooruit, achter, en met hoeveel)
- Omzet, brutomarge, verbranding, looptijd in één alinea behandelen
- De 2-3 meest materiële afwijkingen in gewone taal toelichten
- Aangeven wat de herprognose laat zien voor de rest van het jaar
- Eindigen met eventuele ondernomen acties en vereiste beslissingen

Lengte: 250-350 woorden. Geen opsommingspunten — volledige zinnen. Toon: direct, geen spin.

Sleutelcijfers:
[Plak hier je werkelijke cijfers]

Te toelichten sleutelafwijkingen:
[Geef de 2-3 grootste afwijkingen en hoofdoorzaken een lijst]

Samenvatting herprognose:
[Hoe ziet het herziene volledig jaar eruit?]
```

### Gevoeligheidsanalyse

```
Voer gevoeligheidsanalyse uit op de herprognose.

Basisscenario-aannames:
- Omzetgroeipercentage: [X]% MoM
- Brutomarge: [X]%
- Maandelijkse verbranding: $[X]K
- Kasgeld: $[X]K

Gevoeligheid 1 — Omzetnegatief scenario (10% onder basis):
- Herziene maandelijkse omzet: $[X]K
- Impact op jaarlijkse omzet: $[X]K
- Impact op looptijd (extra maanden verbranding bij lagere omzet): [X] maanden

Gevoeligheid 2 — Verbrandingsstijging (2 posities eerder aangeworven dan gepland):
- Extra maandelijkse verbranding: $[X]K
- Impact op looptijd: [X] maanden minder

Gevoeligheid 3 — Gecombineerd (omzetmislukking + verbrandingsstijging):
- Meest conservatieve scenario
- Minimale looptijd: [X] maanden
- Break-even drempel: bij welke omzet wordt het bedrijf zelfvoorzienend?

Formatteer als tornadodiagram-beschrijving + scenariotabel.
[VERIFIEER] alle gevoeligheidsuitvoer aan de hand van het werkelijke financieel model.
```

## Voorbeeld

**Gebruiker:** Voer een BvW-analyse uit. Omzetbudget $500K, werkelijk $435K. V&M-budget $180K, werkelijk $162K. R&D-budget $210K, werkelijk $218K. G&A-budget $80K, werkelijk $74K. Netto verbrandingsbudget $170K, werkelijk $219K.

**Verwachte uitvoer:**
```markdown
# Budget vs. Werkelijk — [Periode]
[VERIFIEER alle onderstaande cijfers]

## Samenvatting Afwijkingen

| Post | Budget | Werkelijk | Afwijking $ | Afwijking % | G/O |
|---|---|---|---|---|---|
| Omzet | $500K | $435K | ($65K) | (13,0%) | ⚠ O |
| Inkoopkosten | [nodig] | [nodig] | — | — | — |
| Brutowinst | [berekend] | [berekend] | — | — | — |
| Verkoop & Marketing | $180K | $162K | $18K | 10,0% | G |
| R&D | $210K | $218K | ($8K) | (3,8%) | O |
| G&A | $80K | $74K | $6K | 7,5% | G |
| Netto Verbranding | $170K | $219K | ($49K) | (28,8%) | ⚠ O |

## Managementcommentaar

**Omzet — ($65K) | (13,0%) Ongunstig [VERIFIEER]**
Omzet bedroeg $435K tegen een budget van $500K, een tekort van $65K (13%). 
[Hoofdoorzaak nodig van management — bijv. "Twee enterprise-deals met in totaal $55K zijn verschoven 
naar volgende maand, wat 85% van het tekort verklaart. De resterende $10K weerspiegelt lagere 
gemiddelde dealgroottes in het SMB-segment."]
Voorwaartse implicatie: Als verschoven deals worden afgesloten in [volgende periode], herstelt de JTD-omzet. 
Als structureel, aanbevolen herprognose van $480K voor volgende maand.

**Netto Verbranding — ($49K) | (28,8%) Ongunstig [VERIFIEER]**
Netto verbranding van $219K overschreed het budget met $49K. Ondanks opex-besparingen in V&M ($18K G) 
en G&A ($6K G) dreef het omzettekort van $65K het verbrandingsoverschot, met een 
gedeeltelijke compensatie door kostenbesparingen. Verbrandingsmultiplier: [netto verbranding $219K / netto nieuwe ARR — 
netto nieuwe ARR-cijfer nodig voor berekening].

**Verkoop & Marketing — $18K | 10,0% Gunstig [VERIFIEER]**
V&M bleef $18K onder budget. Onderzoek of dit: (a) geplande evenementen/campagnes zijn 
vertraagd — kostentiming, zal volgende periode optreden; of (b) openstaande vacature — structureel
ondertekort. Onderscheid maken vóór prognose.

## Herprognose Signaal
Gezien het omzettekort en verhoogde verbranding wordt een herprognose aanbevolen. 
Geef de [komende 6 maanden] pijplijn en aanwervingsplan voor een volledig herprognosemodel.
```

---
