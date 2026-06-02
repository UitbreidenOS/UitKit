---
name: board-pack-builder
description: "Stel een board pack samen: financiën, KPI-dashboard, strategische initiatieven, risico's, verzoeken — op basis van ruwe data"
---

# Vaardigheid: Board Pack Builder

## Wanneer activeren
- Een maandelijks of kwartaallijks board pack voorbereiden op basis van financiële data en managementrapporten
- Ruwe spreadsheetdata omzetten in een board-klaar verhaal met context
- Een board deck structureren voor bedrijven in de Series A-, B- of C-fase
- Investeerdersupdates voorbereiden die een board pack-formaat volgen
- Een CFO of CEO informeren over wat er in een aankomende boardvergadering moet worden opgenomen

## Wanneer NIET gebruiken
- Kwartaalverslagen van beursgenoteerde bedrijven — ander formaat en SEC-openbaarmakingsvereisten
- Éénpagina-investeerdersupdates per e-mail — gebruik een lichter sjabloon
- Boardmaterialen die juridische beoordeling vereisen vóór distributie — Claude maakt een concept, advocaten keuren goed
- Gecontroleerde jaarrekeningen — Claude werkt met managementaccounts, geen gecontroleerde cijfers

## BELANGRIJK

Alle financiële cijfers in board packs moeten worden gemarkeerd met `[VERIFIEER]` totdat ze zijn bevestigd aan de hand van de brondata. Board packs zijn besluitvormingsdocumenten — presenteer data nauwkeurig en geef aan waar schattingen worden gebruikt. Maak nooit cijfers gladder of laat negatieve afwijkingen weg zonder melding.

## Instructies

### Board pack-structuur

```
Standaard board pack — 7 secties:

1. Managementsamenvatting (1 pagina)
   - Maand-/kwartaalsnapshot: omzet, verbranding, looptijd, belangrijkste KPI's
   - Wat goed ging, wat niet, wat we eraan doen
   - De 1-2 beslissingen die de board vandaag moet nemen

2. Financieel dashboard (2-3 pagina's)
   - W&V: werkelijk vs. budget vs. voorgaande periode
   - Kasstroomoverzicht
   - Balanshoofdzaken
   - Belangrijkste financiële ratio's

3. KPI-dashboard (1-2 pagina's)
   - Operationele statistieken per functie (groei, product, klant)
   - Trendgrafieken (afgelopen 6-12 maanden)
   - Voorlopende vs. achterblijvende indicatoren

4. Bedrijfsupdate (2-3 pagina's)
   - GTM: pijplijn, boekingen, verloop, NRR
   - Product: voortgang roadmap, belangrijkste releases
   - Ops: personeelsbezetting, sleutelaanwervingen/-vertrekken

5. Strategische initiatieven (1-2 pagina's)
   - Voortgang op door de board goedgekeurde initiatieven
   - Status: op schema / risico / vertraagd + reden

6. Risicoregister (1 pagina)
   - Top 3-5 risico's, kans, impact, eigenaar, mitigatie

7. Verzoeken (1 pagina)
   - Beslissingen vereist van de board
   - Gevraagde introducties of middelen
   - Ter goedkeuring ingediende items (herprognoses, optietoekenningen, enz.)
```

### Kernprompt voor generatie

```
Stel een board pack op voor [BEDRIJFSNAAM] voor [MAAND/KWARTAAL JAAR].

Bedrijfscontext:
- Fase: [Seed / Series A / B / C / groei]
- Sector: [sector]
- Bedrijfsmodel: [SaaS / marktplaats / diensten / hardware]
- Boardsamenstelling: [investeerders + onafhankelijken, korte lijst]
- Laatste boardvergadering: [datum — wat werd besproken/afgesproken]

Financiële data (plak ruw of beschrijf):
- Omzet: [werkelijk] vs. budget [X] vs. vorige maand/kwartaal [Y]
- Brutowinst / brutomarge: [%]
- Operationele kosten: [per categorie indien beschikbaar]
- Netto verbranding: [$X/maand]
- Kasgeld: [$X per [datum]]
- Looptijd: [X maanden bij huidige verbranding]

Belangrijkste KPI's (geef werkelijke cijfers):
[Geef een lijst van je belangrijkste operationele statistieken met werkelijke cijfers]

Narratieve context:
- 3 dingen die goed gingen: [lijst]
- 2-3 dingen die ondermaats presteerden: [lijst + korte reden]
- Grootste risico voor de volgende periode: [beschrijf]
- Beslissingen/verzoeken voor de board: [lijst]

Genereer: alle 7 secties met executive-niveau schrijven. Markeer alle cijfers met [VERIFIEER].
```

### Prompt financieel dashboard

```
Stel de financieel dashboard-sectie van het board pack op.

Ruwe data:
[Plak W&V-tabel, of beschrijf posten]

Instructies:
1. Formatteer als een beknopte management-W&V:
   - Omzet (met MoM- of QoQ-groei%)
   - Inkoopkosten / Brutowinst / Brutomarge%
   - Operationele kosten per hoofdcategorie (S&M, R&D, G&A)
   - EBITDA / Operationeel verlies
   - Netto verbranding
   
2. Voeg variantiekolommen toe:
   - Werkelijk vs. Budget ($ en %)
   - Werkelijk vs. Vorige Periode ($ en %)
   - Noteer elke afwijking > 10% met een korte toelichting

3. Sectie kaspositie:
   - Openingsbalans kas
   - Kasontvangsten / kasuitgaven (operationeel, investerend, financierend)
   - Sluitingsbalans kas
   - Maanden looptijd bij huidige verbranding
   
4. Kernratio's (berekenen en markeren voor verificatie):
   - Brutomarge%
   - LTV:CAC (bij SaaS)
   - Verbrandingsmultiplier: Netto verbranding / Netto nieuwe ARR
   - Rule of 40: Omzetgroei% + VKM-marge%

Alle cijfers: [VERIFIEER]-markering. Variantietoelichtingen moeten feitelijk zijn, niet defensief.
```

### Prompt KPI-dashboard

```
Stel de KPI-dashboard-sectie op.

Type bedrijf: [SaaS / marktplaats / e-commerce / diensten]

GROEISTATISTIEKEN (geef werkelijke cijfers):
- MRR / ARR: [huidig] vs. [vorige maand] vs. [vorig jaar]
- Nieuwe MRR: [van nieuwe klanten in deze periode]
- Uitbreidings-MRR: [van upgrades/upsells]
- Verlopen MRR: [verloren in deze periode]
- Netto omzetretentie (NRR): [%]
- Nieuw klantenaantal: [deze periode] vs. [vorige]

PIJPLIJN (bij sales-led):
- Pijplijnwaarde: [$X]
- Pijplijndekking: [X:1 vs. omzetdoel]
- Winpercentage: [%]
- Gemiddelde dealgrootte: [$X]
- Verkoopcyclusduur: [X dagen]

PRODUCT / BETROKKENHEID:
- DAU/MAU: [X]
- Kernactiveringsstatistiek: [wat is het? wat is het %?]
- Functieadoptie: [kernfunctie + gebruik%]
- NPS: [score + trend]

KLANTENSUCCES:
- GRR (Bruto omzetretentie): [%]
- Verlooppercentage: [% op aantal / op omzet]
- Tijd tot waarde: [dagen van aanmelding tot eerste kernresultaat]
- Supporttickets: [volume + oplostijd]

Formatteer als een 2-koloms dashboard: statistiek links, sparkline-beschrijving + huidige waarde + trend rechts.
Markeer elke statistiek die achterloopt op doel met [OP RISICO].
```

### Tracker voor strategische initiatieven

```
Stel de sectie strategische initiatieven op.

Geef elk door de board goedgekeurd initiatief op:

Initiatief 1: [Naam]
- Doel: [hoe succes eruitziet]
- Eigenaar: [naam, functie]
- Tijdlijn: [start → beoogde voltooiing]
- Status: [Op Schema / Op Risico / Vertraagd / Voltooid]
- Voortgangsupdate: [2-3 zinnen — wat er in deze periode is gebeurd]
- Volgende mijlpaal: [specifiek volgende resultaat + datum]
- Als op risico / vertraagd: [hoofdoorzaak + herstelplan]

Initiatief 2: [Naam]
...

Controle boardverwachtingen:
- Waren er toezeggingen gedaan tijdens de laatste boardvergadering?
- Komen we die toezeggingen na, of moeten we een wijziging melden?
```

### Prompt risicoregister

```
Stel de sectie risicoregister op.

Geef voor elk risico op:
- Risico: [naam]
- Categorie: [financieel / operationeel / markt / regelgevend / mensen]
- Omschrijving: [1-2 zinnen over wat er zou kunnen gebeuren]
- Kans: [Hoog / Gemiddeld / Laag]
- Impact: [Hoog / Gemiddeld / Laag]
- Eigenaar: [wie beheert dit risico]
- Mitigatie: [wat er wordt gedaan]
- Statuswijziging t.o.v. laatste boardvergadering: [Nieuw / Toenemend / Stabiel / Afnemend]

Veelvoorkomende risico's voor bedrijven in [fase]:
- Verbrandingssnelheid vs. tijdlijn fondsenwerving
- Afhankelijkheid van sleutelpersonen (CTO, topverkoper, enz.)
- Verloopversnelling / NRR-compressie
- Concurrentbewegingen
- Regelgevende of nalevingsblootstelling
- Aanwervingsvertragingen die roadmap blokkeren
```

### Prompt managementsamenvatting

```
Schrijf de managementsamenvatting voor dit board pack.

Dit is het eerste dat boardleden lezen. Het moet:
1. Het hoofdverhaal in 150-200 woorden overbrengen
2. 3 opsommingspunten geven: wat goed ging / wat niet / wat we eraan doen
3. Duidelijk aangeven: welke beslissingen de board vandaag moet nemen

Structuur:
KOPZIN: Één zin over de periode — waren we op schema, vooruit of achter?
FINANCIEEL SNAPSHOT: [Omzet] | [Verbranding] | [Looptijd] | [ARR/MRR]

HOOGTEPUNTEN:
- [Succes 1 — wees specifiek, niet vaag]
- [Succes 2]
- [Succes 3]

UITDAGINGEN:
- [Uitdaging 1 + korte hoofdoorzaak]
- [Uitdaging 2]

WAT WE DOEN:
- [Actie 1 — eigenaar + tijdlijn]
- [Actie 2]

BOARDVERZOEKEN VANDAAG:
1. [Vereiste beslissing of input]
2. [Gevraagde introducties]
3. [Vereiste goedkeuringen]

Toon: Feitelijk, helder, geen spin. Boardleden zijn ervaren — ze stellen openheid op prijs boven glans.
Als er slecht nieuws is, begin daarmee — begraaf het niet.
```

### Prompt board pack-beoordeling

```
Beoordeel dit concept-board pack en geef feedback.

Controleer op:
1. Volledigheid — zijn alle 7 secties aanwezig en inhoudsvol?
2. Nauwkeurigheid — zijn alle variantietoelichtingen consistent met de data?
3. Narratieve duidelijkheid — kan een boardlid in 10 minuten een duidelijk beeld vormen?
4. Beslissingsgereedheid — zijn de verzoeken specifiek en uitvoerbaar?
5. Risico-openbaarmaking — zijn negatieve trends openbaar gemaakt zonder begraven te worden?
6. Cijferconsistentie — kloppen cijfers over secties heen (omzet in managementsamenvatting moet overeenkomen met W&V)?
7. Ontbrekende context — welke vragen zal een boardlid stellen die niet beantwoord worden?

Uitvoer: Feedback per sectie + een lijst van 3-5 wijzigingen vóór distributie.
```

## Voorbeeld

**Gebruiker:** Help me een board pack te bouwen. We zijn een Series B SaaS, $3,2M ARR, $280K/maand verbranding, 14 maanden looptijd. MoM ARR-groei was 3,2% vs. 4,5% budget. NRR is 108%, verloop steeg naar 1,8% van 1,4% vorige maand.

**Verwachte uitvoer:**
```markdown
# Board Pack — [Bedrijf] — Juni 2026
[VERIFIEER alle onderstaande cijfers aan de hand van brondata]

## Managementsamenvatting
Juni was een gemengde maand. Omzet groeide naar $3,2M ARR (+3,2% MoM) maar bleef onder ons budget van 4,5% — een kloof die we toeschrijven aan twee enterprise-deals die naar Q3 zijn verschoven. Verloop steeg naar 1,8%, ons hoogste in 6 maanden, gedreven door drie mid-market verlopen in ons legacy-segment. NRR blijft gezond op 108%. Met $3,9M kas en 14 maanden looptijd lopen we geen risico, maar de verlooptrend vereist een boardbespreking.

FINANCIEEL SNAPSHOT: $3,2M ARR | $280K netto verbranding | 14 maanden looptijd | NRR 108%

HOOGTEPUNTEN:
- $420K nieuwe ARR afgesloten van 3 enterprise-klanten (grootste deal in bedrijfsgeschiedenis)
- Product heeft de AI-workflowfunctie uitgebracht — 34% van actieve klanten activeerde binnen 30 dagen
- VP Customer Success aangenomen — start 14 juli

UITDAGINGEN:
- Twee enterprise-deals ($180K gecombineerde ARR) verschoven naar Q3 — nieuwe MRR beïnvloed met ~40%
- Verloop van 1,8% vs. 1,4% vorige periode — 3 legacy-planverlopen, allemaal klanten van vóór 2024 op afgeschreven niveaus
- SDR-team op 60% quota — onboarding nieuwe aanwerving vertraagd

WAT WE DOEN:
- CS-draaiboek voor legacy-niveauklanten gelanceerd op 15 juni (eigenaar: aankomende VP CS)
- SDR-onboarding versneld — volledige productiviteit verwacht in augustus
- Enterprise-pijplijn opnieuw beoordeeld — beide verschoven deals bevestigd voor Q3-afsluiting

BOARDVERZOEKEN VANDAAG:
1. Input bij herprognose: ARR-doel handhaven of herzien naar $4,1M gezien de pijplijndekking?
2. Goedkeuring: optietoekenning voor VP CS (0,35% volledig verwaterd, 4-jarig vest, 1-jarig cliff)
3. Introducties: enterprise CISO's in financiële dienstverlening (voor onze Q3-doelaccounts)
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
