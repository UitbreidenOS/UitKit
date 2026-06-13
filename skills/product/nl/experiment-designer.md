---
name: experiment-designer
description: "A/B test en experiment design: hypothese schrijven, steekproef grootte berekenen, statistische significantie, experiment tracking, vermijd gemeenschappelijke valkuilen, resultaten interpreteren"
---

# Experiment Designer Vaardigheid

## Wanneer activeren
- Ontwerp van A/B test of multivariate experiment
- Berekening van vereiste steekproef grootte voordat test wordt uitgevoerd
- Interpretatie van experiment resultaten (is dit significant? moeten we het versturen?)
- Opzetting van experiment framework voor team
- Vermijd gemeenschappelijke test fouten (peeking, novelty effect, multiple comparisons)
- Bepaal of experiment moet worden uitgevoerd of gewoon verstuurd

## Wanneer NIET gebruiken
- Wanneer u < 1.000 users/week heeft — niet genoeg traffic voor betekenisvolle tests; gebruik kwalitatief
- Wanneer verandering bugfix of duidelijk goed is — test niet het voor de hand liggend, verstuur het
- Wanneer u resultaten in < 1 week nodig heeft — underpowered tests zijn erger dan geen tests
- Analytics tool setup — use the analytics-tracking vaardigheid

## Instructies

### Hypothese en experiment design

```
Ontwerp A/B test voor [verandering].

Wat we testen: [beschrijf verandering — copy, UI, flow, feature]
Waarom wij denken dat het zal werken: [insight of data achter dit idee]
Primaire metriek: [de ene metriek die we optimaliseren]
Secundaire metrieken: [metrieken om regressies in te controleren]
Traffic beschikbaar: [sessions/dag of users/week op deze pagina/flow]

Experiment design:

1. Hypothese (schrijf voordat je code aanraakt):
   Format: "Wij geloven dat [verandering] zal [metriek verbeteren] voor [user segment] omdat [reden gebaseerd op insight/data]."
   
   Slecht: "Wij geloven dat grotere CTA knop conversies zal verhogen."
   Goed: "Wij geloven dat het wijzigen van CTA kopie van 'Get Started' naar 'Start Free Trial' trial signups zal verhogen voor first-time bezoekers omdat onze interview data toont dat users niet realiseren dat de trial gratis is."

2. Varianten:
   - Control (A): huidiige staat — onveranderd
   - Variant B: de verandering
   - (Optioneel) Variant C: een mudigere versie van verandering
   
   Regel: test één ding per experiment. Twee veranderingen = u weet niet welke het resultaat dreef.

3. Traffic split:
   - 2 varianten: 50/50 (maximale statistische macht)
   - 3 varianten: 33/33/33 — vereist meer traffic of langere test
   - Ramp up: begin op 5-10% → bevestig geen bugs → volledige exposure

4. Primaire metriek:
   [Naam] — gemeten als: [definitie]
   Minimum detecteerbaar effect: [X% relatieve verbetering we consider waarde]
   
5. Success criteria (bepaal voor lancering — geen doelpaalsverandering):
   Win: p-waarde < 0.05 EN MDE bereikt EN geen significante regressie in secundaire metrieken
   Roep snel: alleen als duidelijk schadelijk — STOP NIET voor vroeg winning resultaat

Genereer volledige experiment brief voor mijn test.
```

### Steekproef grootte calculator

```
Bereken vereiste steekproef grootte voor [experiment].

Primaire metriek type: [conversion rate / mean waarde / proportie]
Hudigie baseline: [X% conversion rate / $X gemiddelde / X% van users]
Minimum detecteerbaar effect (MDE): [X% relative verandering — kleinste win waard om te versturen]
Statistische macht: [80% standaard / 90% voor kritieke experiments]
Significantie niveau: [α = 0.05 standaard / α = 0.01 voor hoog-inzet]
Aantal varianten: [2 / 3 / 4]

Steekproef grootte formule (voor proporties):
n = 2 × (z_α/2 + z_β)² × p(1-p) / δ²

waar:
- z_α/2 = 1.96 (voor α=0.05, twee-staart)
- z_β = 0.84 (voor 80% macht)
- p = baseline conversion rate
- δ = absolute difference (baseline × MDE)

Voor uw invoer:
Baseline: [X%]
MDE: [X% relatief] = [Y% absoluut]
Vereist n per variant: [berekend]
Totaal steekproef: [n × aantal varianten]

Op uw traffic niveau ([X bezoekers/dag]):
Test duration nodig: [X dagen]

Waarschuwing vlaggen:
- Als duration > 4 weken: redesign test (verhoog MDE, of wacht op meer traffic)
- Als MDE < 1%: waarschijnlijk niet waard om te testen — moeilijk om significantie te bereiken
- Als MDE > 30%: zeer optimistisch — verifieer dat business case echt is

Bereken voor mijn speci inputs en bevestig dat duration haalbaar is.
```

### Gemeenschappelijke experiment fouten

```
Controleer mijn experiment design en flag mogelijke problemen.

Experiment beschrijving: [beschrijf test die u plant]
Duration gepland: [X dagen]
Traffic bron: [al traffic / segment / specifieke pagina]

Gemeenschappelijke fouten om te controleren:

□ PEEKING: Test vroeg stoppen omdat resultaten goed lijken
  Risico: false positive rate stijgt enorm — winning variant is meestal toeval
  Fix: Bepaal run duration voor lancering en hou eraan (of gebruik sequential testing)

□ MULTIPLE COMPARISONS: Testen van 5 varianten = 5 kansen op false positive
  Risico: op α=0.05, 5 tests uitvoeren → verwachte 0.25 false positives per batch
  Fix: Gebruik Bonferroni correctie (α/n) of beperk tot 2-3 varianten

□ NOVELTY EFFECT: Eerste-keer users reageren op alles nieuw
  Risico: initiële lift verdwijnt na eerste exposure
  Fix: Voer test uit voor volledige 2+ business cycles (typisch 2 weken minimum)

□ SAMPLE RATIO MISMATCH: Ongelijke traffic naar varianten
  Risico: randomisatie kapot — resultaten ongeldig
  Fix: Plot cumulatieve toewijzings ratio dagelijks; alert als > 5% van doel

□ NETWORK EFFECTS: Users interacteren met elkaar
  Risico: controle en variant groepen niet onafhankelijk
  Fix: Cluster randomiseer per team/account, niet per individuele user

□ SURVIVORSHIP BIAS: Alleen engaged users meten
  Risico: uplift ziet geweldig uit maar alleen voor users die toch zouden converteren
  Fix: Inclusief alle berechtigde users, niet alleen degenen die "engaged" met variant

□ INSTRUMENTATION LAG: Metriek berekening vertraagd achter experiment
  Risico: vroege resultaten tonen opgeblazen of deflationair getallen
  Fix: Voeg 24-48 uur toe voordat je resultaten leest; verifieer event firing in debug mode

Flag welke hiervan op mijn geplande experiment van toepassing zijn + specifieke fixes.
```

### Resultaten interpretatie

```
Interpreteer mijn experiment resultaten.

Experiment: [beschrijf test]
Duration: [X dagen]
Steekproef grootte per variant: [X control / X variant]
Primaire metriek:
  Control: [X%]
  Variant: [X%]
  Relatieve lift: [+X%]
  p-waarde: [X]
  Betrouwbaarheids interval: [X% tot X%]
Secundaire metrieken: [lijst en of zij verplaatsten]

Interpretatie framework:

Statistisch significant + praktisch significant: VERSTUUR
  Beide p < 0.05 EN relatieve lift ≥ MDE → duidelijke win, verstuur

Statistisch significant + NIET praktisch significant: NIET VERSTUUR
  p < 0.05 maar lift 0.3% op 2% baseline → echt maar niet waard onderhoud kost

NIET significant + directioneel positief: VERLENG OF HEROVERWEEG
  p = 0.12 met positieve trend → underpowered; verleng als kost laag; heroverweeg als duur

NIET significant + plat: VOORTGAAN
  p > 0.5, effect dicht bij nul → idee werkte niet; fail snel en probeer volgende hypothese

Significante regressie in secundaire metriek: STOP, NIET VERSTUUR
  Zelfs als primaire metriek won, regressie in inkomsten of retentie overweegt

Voor mijn resultaten:
1. Statistische conclusie: [significant / niet significant / borderline]
2. Praktische significantie: [betekenisvol / niet betekenisvol]
3. Secundaire metriek beoordeling: [enige regressies?]
4. Besluit: [verstuur / niet verstuur / verleng / heroverweeg]
5. Wat wij leerden (zelfs als we niet versturen): [insight dat volgende test beter maakt]
```

## Voorbeeld

**User:** Wij testen nieuwe checkout flow. Baseline conversie is 3.2%. Wij willen 15% relatieve verbetering detecteren (tot 3.68%). Wij krijgen 500 bezoekers/dag naar checkout. Hoe lang moeten wij lopen?

**Claude's berekening:**

**Steekproef grootte berekening:**
- Baseline: 3.2%
- Target: 3.68% (15% relatieve lift = 0.48% absoluut)
- α = 0.05 (twee-staart), Macht = 80%
- Vereist n per variant ≈ **4.950 users**
- Totaal steekproef nodig: **9.900 users** (beide varianten)

**Op 500 bezoekers/dag:**
- 9.900 ÷ 500 = **~20 dagen minimum**

**Mijn aanbeveling: voer uit voor 28 dagen (4 volle weken)**

Waarom 4 weken, niet 20 dagen:
1. Vangt volledige wekelijkse seizoensgebondenheid (checkout gedrag verschilt weekdag vs. weekend)
2. Buffer voor novelty effect — nieuwe checkout UI kan kunstmatig goed in week 1 lijken
3. Staat toe 4 volledige business cycles (maandag-zondag)

**Voordat u lanceert:**
- Bevestig dat uw analytics tool "checkout bezocht" event en "aankoop voltooid" event apart en correct opneemt
- Stel nu uw success criteria in: "Wij versturen als p < 0.05 EN lift ≥ 15% EN geen regressie in gemiddelde order waarde"
- Kijk niet naar resultaten totdat dag 28

**Één voorzorg:** Als uw 500 bezoekers/dag figuur mobiele en desktop users omvat, segment de resultaten per device. Checkout flows gedragen zich zeer verschillend op mobiel vs. desktop — een winning resultaat overall zou een regressie op één platform kunnen maskeren.

---
