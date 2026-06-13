---
name: dashboard-narrator
description: "Vertaal dashboardgegevens en grafieken naar begrijpelijke tekst: kerninsights, afwijkingen, aanbevelingen — geschreven voor niet-technische belanghebbenden die geen grafieken lezen"
---

# Dashboard Narrator Vaardigheid

## Wanneer activeren
- Een belanghebbende heeft een schriftelijke samenvatting nodig van wat het dashboard toont — niet alleen een link ernaar
- Bij de voorbereiding van een wekelijkse of maandelijkse bedrijfsreview waarbij tekst de grafieken moet vergezellen
- Uw leiderschapsteam leest de dashboards niet en u moet de gegevens naar hen toe brengen
- U heeft meerdere statistieken die moeten worden samengevat tot een coherent verhaal, niet een lijst met cijfers
- Het vertalen van een complex dashboard met meerdere statistieken naar een leiderschapsbriefing

## Wanneer NIET gebruiken
- Grondoorzaakanalyse die SQL-queries op ruwe gegevens vereist — gebruik daarvoor `/sql`
- Het bouwen van het dashboard zelf — gebruik uw BI-tool (Looker, Tableau, Metabase)
- Statistische analyse of hypothesetoetsing — gebruik `/pandas-polars` of `/sql`
- Realtime datameldingen — stel die in het meldingssysteem van uw BI-tool in

## Instructies

### Kernprompt voor dashboardnarratief

```
Vertaal deze dashboardgegevens naar een begrijpelijke tekst voor een niet-technisch publiek.

DASHBOARD: [naam en wat het bijhoudt — bijv. "Wekelijkse Bedrijfsreview", "Groeistatistieken", "Productstatus"]
PUBLIEK: [wie dit leest — directieteam / raad van bestuur / afdelingshoofd / investeerders]
RAPPORTAGEPERIODE: [deze week / deze maand / K? 202?]
VERGELIJKINGSPERIODE: [vs. vorige week / vorige maand / zelfde periode vorig jaar]

STATISTIEKEN (plak uw gegevens):
[Per statistiek: naam, huidige waarde, waarde vorige periode, doel/plan indien van toepassing]

Voorbeeldformaat:
- Wekelijks actieve gebruikers: 48.200 (↑ 3,1% vs. vorige week, doel: 50.000, -3,6% vs. doel)
- Omzet: $1,24M (↑ 8,4% vs. vorige week, ↑ 22% vs. zelfde week vorig jaar)
- Conversieratio: 3,2% (↓ 0,4pp vs. vorige week — was 3,6%)
- Klantverloop: 1,8% maandelijks (↑ 0,3pp vs. vorige maand — hoogste in 6 maanden)
- CAC: $142 (↓ 12% vs. vorige maand — verbetert)
- LTV/CAC: 4,1x (stabiel)
- NPS: 42 (gedaald van 48 vorig kwartaal)

CONTEXT DIE IK WEET:
[Zakelijke gebeurtenissen die de gegevens verklaren — productlancering, marketingcampagne, prijswijziging, seizoensgebondenheid, incident]

Schrijf:
1. KOPTEKST (1 zin): Wat is de algehele status van het bedrijf deze periode?
2. WINSTEN (2-3 punten): Wat is verbeterd en waarom dat belangrijk is
3. ZORGEN (2-3 punten): Wat is verslechterd, de omvang, en of het een trend of eenmalig is
4. AFWIJKINGEN (indien aanwezig): Alles wat niet in het patroon past — vlaggen voor onderzoek
5. AANBEVELING: 1-2 acties die het team op basis van deze gegevens moet ondernemen
6. BEWAKINGSLIJST: Statistieken die de volgende periode nauwlettend gevolgd moeten worden

Houd het onder 400 woorden. Schrijf voor een CEO die het in 90 seconden leest.
```

---

### Afwijkingsdetectie en -verklaring

```
Ik heb een afwijking in mijn dashboardgegevens. Help me deze duidelijk te beschrijven en mogelijke oorzaken te onderzoeken.

STATISTIEK: [naam statistiek]
VERWACHTE WAARDE: [wat het normaal is of wat het plan aangeeft]
WERKELIJKE WAARDE: [wat het is deze periode]
OMVANG: [X% boven/onder verwacht, X standaarddeviaties van 30-daags gemiddelde]
DUUR: [wanneer het begon — eenmalige piek of aanhoudende verandering?]

OMRINGENDE CONTEXT (plak nabijgelegen statistieken die mogelijk gecorreleerd zijn):
[Andere statistieken uit dezelfde tijdsperiode]

Te onderzoeken mogelijke oorzaken:
1. [Zakelijke gebeurtenis — is er iets operationeel veranderd?]
2. [Gegevenskwaliteit — kan dit een tracking- of logprobleem zijn?]
3. [Seizoensgebonden of extern — is er een bekend patroon of externe factor?]
4. [Upstream afhankelijkheid — is een gegevensbron of pipeline gewijzigd?]

Schrijf:
1. Een begrijpelijke beschrijving van de afwijking (1-2 zinnen) die een niet-technische belanghebbende kan begrijpen
2. De 3 meest waarschijnlijke verklaringen, gerangschikt op waarschijnlijkheid
3. Hoe te bepalen welke verklaring juist is (wat te controleren)
4. Of dit dringende actie of monitoring vereist
```

---

### Synthese van meerdere grafieken (wekelijkse bedrijfsreview)

```
Ik heb meerdere dashboards die ik moet samenvatten tot één wekelijks bedrijfsreviewnarratief.

ZAKELIJKE CONTEXT:
- Bedrijf: [beknopte beschrijving]
- Fase: [seed / Series A / groei / gevestigd]
- Primair bedrijfsmodel: [SaaS / marktplaats / e-commerce / etc.]
- Huidige strategische prioriteit: [groei / winstgevendheid / retentie / expansie]

DASHBOARD 1 — GROEI:
[Plak statistieken: nieuwe gebruikers, aanmeldingen, MQL's, proefperiodes, demo-aanvragen]

DASHBOARD 2 — OMZET:
[Plak statistieken: MRR/ARR, expansie, krimp, verloop, NRR]

DASHBOARD 3 — PRODUCT:
[Plak statistieken: DAU/WAU/MAU, activatieratio, functiegebruik, NPS]

DASHBOARD 4 — UNIT ECONOMICS (indien van toepassing):
[Plak statistieken: CAC, LTV, terugverdientijd, brutomarge]

GEBEURTENISSEN DEZE WEEK:
[Productreleases, campagnes, incidenten, extern nieuws]

Schrijf één coherent bedrijfsreviewnarratief dat:
1. Opent met de algehele bedrijfsstatus (één-zins-oordeel)
2. Het verhaal vertelt over groei → omzet → product → efficiëntie in logische volgorde
3. De 2-3 belangrijkste zaken benadrukt die plaatsvinden over alle dashboards
4. Tegenstrijdigheden signaleert (bijv. "activatie verbeterde maar NPS daalde — het onderzoeken waard")
5. Eindigt met wat de volgende week te volgen

Doel: maximaal 500 woorden. Leesbaar in 3 minuten. Geen opsommingstekens om de opsommingstekens — verhalende proza met ingebedde datapunten.
```

---

### Doelgroepgerichte framing

Pas de uitvoer aan op basis van wie er leest:

**Voor de CEO:**
```
Formuleer het dashboardnarratief voor een CEO.
Focus op: Is het bedrijf op koers? Waar moeten we ons op richten? Zijn er urgente beslissingen?
Sla over: Technische statistiekdefinities, methodologische opmerkingen.
Begin met het oordeel, onderbouw met 3 datapunten, sluit af met aanbevolen actie.
```

**Voor de raad van bestuur:**
```
Formuleer het dashboardnarratief voor een bestuursvergadering.
Focus op: Voortgang versus plan, kernrisico's, kapitaalefficiëntie.
Formaat: 3 punten — wat goed ging, wat niet, wat we eraan doen.
Voeg toe: Vergelijking met plan/doel, niet alleen periode-over-periode.
Vermijd: Operationele details die zij niet hoeven goed te keuren of over te beslissen.
```

**Voor een functioneel team (marketing, product, sales):**
```
Formuleer het dashboardnarratief voor het [marketing / product / sales]-team.
Focus op: Statistieken die zij bezitten en op kunnen handelen.
Voeg toe: Specifieke acties die zij moeten ondernemen op basis van wat de gegevens tonen.
Toon: Direct, actiegericht. Zij willen weten wat ze moeten doen, niet alleen wat er is gebeurd.
```

---

### Patronen voor grafiek-naar-tekst-vertaling

Gebruik deze patronen bij het beschrijven van specifieke grafiektypen:

```
Beschrijf een trendlijndiagram:
"[Statistiek] [richting: steeg / daalde / bleef stabiel] van [X] naar [X] over [periode], 
een [omvang: scherpe / geleidelijke / bescheiden] [stijging/daling] van [X%]. 
[Indien trend): De [stijgende/dalende] trend begon in [maand] en heeft [doorgezet / omgekeerd / gestabiliseerd]."

Beschrijf een staafdiagramvergelijking:
"[Categorie A] presteerde beter dan [Categorie B] met [X%] ([A: X] vs. [B: X]). 
[Categorie C] toonde de grootste [stijging/daling], [omhoog/omlaag] [X%] vs. [vorige periode]."

Beschrijf een trechter:
"Van [X] [bovenkant trechter] bereikte [X]% ([N]) [Fase 2], en [X]% ([N]) converteerde naar [eindfase]. 
De grootste uitval vindt plaats bij [fase], waar [X]% [van degenen die deze fase bereikten] niet doorging."

Beschrijf een verdeling / histogram:
"De mediaan [statistiek] is [X], met [X]% van [entiteiten] vallend tussen [X] en [X]. 
De [rechter/linker] staart geeft aan dat [X]% van [entiteiten] waarden heeft boven/onder [drempel]."
```

---

### Kwaliteitschecklist voor insights

Verifieer vóór het verzenden van een dashboardnarratief:

```
Beoordeel dit dashboardnarratief op kwaliteit.

Doet het:
[ ] Leidt met de belangrijkste bevinding, niet de meest voor de hand liggende?
[ ] Kwantificeert elke bewering (niet "omzet groeide" — "omzet groeide 14%")?
[ ] Onderscheidt correlatie van causaliteit?
[ ] Scheidt feiten van interpretaties (feiten: "verloop steeg 0,3pp"; interpretatie: "waarschijnlijk te wijten aan...")?
[ ] Markeert wat we niet weten of niet kunnen verklaren uit de gegevens?
[ ] Eindigt met een specifieke actie, niet een vaag "we moeten dit in de gaten houden"?
[ ] Vermijdt jargon dat het publiek niet begrijpt?

Als een item faalt, herschrijf die secties.
```

## Voorbeeld

**Gebruiker:** Wekelijks dashboard — WAU's: 48.200 (+3,1% WoW, doel was 50K). Conversieratio: 3,2% (was 3,6% vorige week). Omzet: $1,24M (+8,4% WoW). Verloop: 1,8% (was 1,5% vorige maand). NPS: 42 (was 48 vorig kwartaal). Nieuwe productfunctie gelanceerd dinsdag. Publiek: CEO en directieteam.

**Verwachte uitvoer:** Openingsoordeel ("Omzetgroei versnelt maar conversie- en retentiesignalen vereisen aandacht"). Winsten: omzetgroei sterk, WAU-trend positief. Zorgen: daling conversieratio valt samen met dinsdaglancering — nieuwe functie kan de aanmeldingsstroom verstoren; verhoogd verloop is vroeg maar een 3-maandstrend om te volgen. Aanbeveling: A/B-test de nieuwe onboarding-flow versus de vorige versie; plan verloopcohorte-analyse om te identificeren of een specifiek segment de 1,8% aanstuurt. Bewakingslijst: conversieratio en verloop voor de komende 2 weken.

---
