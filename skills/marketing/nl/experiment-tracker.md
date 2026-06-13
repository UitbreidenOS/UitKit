---
name: experiment-tracker
description: "A/B-testtracker: hypotheseschrijven, steekproefgroottecalculator, resultatenanalyse en interpretatie van statistische significantie voor groeisexperimenten"
---

# Vaardigheid: Experimenttracker

## Wanneer te activeren
- Je voert een A/B-test uit en hebt een gestructureerde hypothese en succescriteria nodig vóór de lancering
- Je berekent de steekproefgrootte en testduur voordat je een experiment start
- Je analyseert testresultaten en bepaalt of je statistische significantie hebt bereikt
- Je documenteert experimentleerlingen voor het team of het experimentenlogboek
- Je prioriteert welke experimenten je vervolgens gaat uitvoeren op basis van ICE- of RICE-scoring
- Een test is afgerond en je moet beslissen: uitrollen, stoppen of itereren

## Wanneer NIET te gebruiken
- Volledig experimentontwerp van nul — gebruik daarvoor `/experiment-designer`
- Analytics-opstelling en event-tracking — gebruik `/analytics-tracking`
- Kwalitatief onderzoek of gebruikersinterviews interpreteren — andere methodologie
- Als je steekproefgrootte te klein is voor een geldige test (< 100 verwachte conversies per variant)

## Instructies

### Framework voor het schrijven van hypothesen

```
Schrijf een gestructureerde experimenthypothese voor mijn A/B-test.

Testidee: [beschrijf de wijziging die je wilt doorvoeren]
Pagina / functie: [waar in het product of de funnel]
Huidige staat: [wat er vandaag bestaat]
Voorgestelde wijziging: [wat je wilt testen]

Produceer een hypothese in dit format:

We geloven dat [WIJZIGING]
voor [DOELGROEPSEGMENT]
zal resulteren in [VERWACHT RESULTAAT]
omdat [MECHANISME / REDENERING]
We weten dat dit waar is wanneer [MEETBAAR SUCCESCRITERIUM]
en de test [MINIMALE STEEKPROEFGROOTTE] conversies per variant heeft bereikt
met [95%] statistische betrouwbaarheid.

Produceer ook:
- Primaire metriek: [de ene metriek die winst/verlies bepaalt]
- Secundaire metrieken: [drempelmetrieken — mogen niet teruglopen]
- Minimaal detecteerbaar effect (MDE): [kleinste verbetering die het uitrollen waard is]
- Risico: [wat er mis kan gaan — nieuwheidseffect, segmentinteractie, etc.]
```

### Steekproefgroottecalculator

```
Bereken de benodigde steekproefgrootte voor mijn A/B-test.

Testtype: [conversieratio / omzet per gebruiker / retentie / betrokkenheid]
Huidige basisratio: [X%] (bijv. huidige conversieratio)
Minimaal detecteerbaar effect (MDE): [X%] (relatieve verbetering die het waard is te detecteren)
  — Conservatief: 5-10% relatieve lift (grote steekproef nodig)
  — Gemiddeld: 15-20% relatieve lift (typisch)
  — Agressief: 30%+ relatieve lift (kleine steekproef, detecteert alleen grote veranderingen)
Statistische significantie: [95%] (standaard) of [90%] (acceptabel voor laag-risicotests)
Statistisch vermogen: [80%] (standaard) of [90%] (hoge-risicotests)
Aantal varianten: [2] (A vs. B) of [3+] (multi-variant — deel door n-1)

Berekening:

Gebruik voor conversieratiotests de twee-proporties z-test:

Benodigde n per variant = (z_α/2 + z_β)² × [p1(1-p1) + p2(1-p2)] / (p1 - p2)²

Waarbij:
- p1 = basisratio
- p2 = basisratio × (1 + MDE)
- z_α/2 = 1,96 (95% significantie)
- z_β = 0,842 (80% vermogen)

Lever op:
- Benodigde conversies per variant: [N]
- Benodigde bezoekers per variant (bij huidige conversieratio): [N]
- Verwachte testduur bij [huidig verkeer] per dag: [X dagen / weken]
- Waarschuwing als duur > 8 weken (seizoenseffecten zullen resultaten verontreinigen)
- Waarschuwing als conversies per variant < 100 (test is ondervermogen — verhoog MDE of wacht)

Laat me de cijfers voor mijn test zien.
```

### Checklist vóór lancering

```
Voer een pre-lanceringcheck uit op mijn A/B-test voordat ik hem start.

Testnaam: [naam]
Tool: [Optimizely / VWO / LaunchDarkly / GrowthBook / eigen oplossing]
Hypothese: [uit het hypotheseframework hierboven]
Benodigde steekproefgrootte: [N per variant]
Verwacht verkeer per dag: [N bezoekers]
Verwachte testduur: [X dagen]

Checklist vóór lancering:

TRACKING
□ Primaire metriek wordt correct bijgehouden (event vuurt bij conversie, niet bij paginaweergave)
□ Secundaire/drempelmetrieken worden bijgehouden (omzet, sessieduur, foutpercentage)
□ Testtowijzingsevent wordt bijgehouden (zodat je in analytics kunt segmenteren op variant)
□ Geen bestaande funnelfouten of bugs in de controle — een kapotte baseline testen = ongeldige resultaten
□ QA in staging: bevestig dat de variant correct wordt weergegeven op alle browsers + mobiel

INSTELLING
□ Verkeersopstelling bevestigd: [50/50 of X/Y — documenteer de opstelling]
□ Targetingregels gedocumenteerd: [wie wordt opgenomen / uitgesloten]
□ Wederzijdse exclusiviteit: conflicteert deze test met een andere lopende test?
□ Holdback indien nodig: als de test significant invloed heeft op omzet, houd dan 5-10% buiten alle tests

DUUR
□ Minimaal 2 volledige bedrijfscycli uitvoeren (minimaal 2 weken — nooit stoppen bij eerste significantie)
□ Niet dagelijks naar resultaten kijken en vroegtijdig stoppen — dit vergroot de fout-positiefratio
□ Stel een harde stopdatum in: [datum] — verleng niet zonder gedocumenteerde reden

RISICO
□ Kun je de variant onmiddellijk terugdraaien als een drempelmetriek crasht?
□ Is er een nieuwheidseffectrisico? (nieuwe UI = kortetermijnlift die niet aanhoudt)
□ Zal dit testsegment interageren met een andere test? Breng je testmatrix in kaart.

Parafeer wanneer alle vakjes zijn aangevinkt.
```

### Resultatenanalyse

```
Analyseer mijn A/B-testresultaten en vertel me wat ik moet doen.

Test: [naam]
Duur: [X dagen]
Tool: [analyticsplatform]

Resultaten:
Controle (A):
- Bezoekers: [N]
- Conversies: [N]
- Conversieratio: [X%]
- Omzet per bezoeker (indien van toepassing): $[X]

Variant (B):
- Bezoekers: [N]
- Conversies: [N]
- Conversieratio: [X%]
- Omzet per bezoeker (indien van toepassing): $[X]

Relatieve lift: [(B-A)/A × 100]%
P-waarde: [X] (van je testtool)
Betrouwbaarheid: [X%]
Statistische significantie bereikt: [Ja / Nee]

Analyse:

BESLISSINGSRAAMWERK:
1. Is het resultaat statistisch significant bij 95%?
   JA → ga door naar zakelijke impactanalyse
   NEE → controleer: heb je je benodigde steekproefgrootte bereikt?
     - Als ja + geen significantie: het effect is kleiner dan MDE → waarschijnlijk niet het uitrollen waard
     - Als nee: verleng de test of accepteer dat je een zo klein effect niet kunt detecteren

2. Is de lift zinvol in euro's?
   Jaarlijkse omzetimpact van deze lift = [berekening]:
   Lift × dagelijkse conversies × gemiddelde orderwaarde × 365 = $[X]/jaar
   Als de jaarlijkse impact kleiner is dan de kosten voor permanente implementatie, heroverweeg dan.

3. Zijn drempelmetrieken teruggegaan?
   Omzet per bezoeker, sessieduur, foutpercentage, ondersteuningscontacten?
   Als ja: NIET uitrollen ook al is de primaire metriek positief. Een lift in aanmeldingen die het ondersteuningscontact verdubbelt is geen overwinning.

4. Segmentanalyse — houdt de lift stand over:
   - Mobiel vs. desktop?
   - Nieuwe vs. terugkerende gebruikers?
   - Verkeersbron (betaald vs. organisch)?
   - Geografie?
   Significante interactie-effecten suggereren dat de variant werkt voor een segment, niet universeel.

BESLISSING: [UITROLLEN / STOPPEN / SEGMENT-UITROLLEN / ITEREREN]
Redenering: [specifiek, op basis van de cijfers]
Volgend experiment: [wat je vervolgens test op basis van deze resultaten]
```

### Sjabloon voor experimentenlogboek

```
Documenteer dit experiment voor het teamexperimentenlogboek.

Experiment: [naam — doorzoekbaar, beschrijvend]
Datum: [start] → [einde]
Eigenaar: [naam]
Team: [groei / product / marketing]
Status: [lopend / afgerond]

## Hypothese
[Uit het hypotheseframework]

## Instelling
- Tool: [Optimizely / VWO / eigen oplossing]
- Verkeersopstelling: [50/50]
- Doelgroep: [alle gebruikers / nieuwe gebruikers / mobiel / etc.]
- Targeting: [URL, segment, feature flag]

## Resultaten
| Metriek | Controle | Variant | Lift | Significantie |
|---|---|---|---|---|
| Primair: [metriek] | [X%] | [X%] | [+X%] | [95%] |
| Drempel: [metriek] | [X] | [X] | [+/-X%] | [n.v.t.] |
| Drempel: [metriek] | [X] | [X] | [+/-X%] | [n.v.t.] |

Steekproef: [N] per variant | Duur: [X dagen] | P-waarde: [X]

## Beslissing
[UITGEROLD / GESTOPT / GEÏTEREERD]
Redenering: [waarom]

## Lering
[Wat dit ons vertelt over gebruikersgedrag — niet alleen "variant won"]
[Wat we vervolgens testen]

## Jaarlijkse impact (indien uitgerold)
$[X] incrementele omzet of [X%] metriekverbetering
```

### Prioritering van experimenten

```
Prioriteer mijn experimentenbacklog met ICE-scoring.

Mijn experimentideeën:
1. [Idee 1]
2. [Idee 2]
3. [Idee 3]
[voeg zoveel toe als nodig]

Beoordeel elk op ICE:

IMPACT (1-10): Als dit werkt met de verwachte lift, hoe groot is de omzet/metriekimpact?
- 10: > $100K jaarlijkse impact of > 20% lift op een sleutelmetriek
- 7: $20-100K of 10-20% lift
- 4: $5-20K of 5-10% lift
- 1: < $5K of < 5% lift

BETROUWBAARHEID (1-10): Hoe zeker zijn we dat dit werkt?
- 10: Eerdere data, gebruikersonderzoek en bewezen elders wijzen hier allemaal op
- 7: Sterk kwalitatief signaal of vergelijkbare test werkte in aangrenzend gebied
- 4: Theorie-gebaseerd, geen direct bewijs
- 1: Puur onderbuikgevoel

GEMAK (1-10): Hoe snel kunnen we deze test uitvoeren?
- 10: Alleen tekstwijziging, geen ontwikkeling nodig, live in 1 dag
- 7: Kleine frontend-wijziging, 1-2 dagen ontwikkeling
- 4: Backend- of logicawijziging, 1 week ontwikkeling
- 1: Architectuurwijziging, 4+ weken ontwikkeling

ICE-score = (Impact + Betrouwbaarheid + Gemak) / 3

Rangschik alle ideeën op ICE-score. Markeer alle ideeën die > 2 weken engineering vereisen als Hoge Inspanning — evalueer of ze in de productbacklog moeten worden opgenomen.

Lever een gerangschikt experimentenkalender op voor de komende 4 weken.
```

## Voorbeeld

**Gebruiker:** Ik wil testen of we de CTA op onze prijspagina wijzigen van "Start Free Trial" naar "See Pricing" omdat ik denk dat gebruikers de prijzen willen zien voordat ze zich vastleggen. De basisconversie is 3,2%. Welke steekproefgrootte heb ik nodig en hoe stel ik dit in?

**Uitvoer van Claude:**

**Hypothese:**
We geloven dat het wijzigen van de primaire CTA van "Start Free Trial" naar "See Pricing"
voor alle bezoekers die op /pricing landen
zal resulteren in een hogere click-through rate naar de afrekenpagina of planselectiepagina
omdat gebruikers met een prijsvergelijkende mindset de prijzen willen zien voordat ze zich vastleggen aan een "trial"-framing.
We weten dat dit waar is wanneer de CTA-klikfrequentie met ≥ 15% (relatief) stijgt
met 95% statistische betrouwbaarheid en 80% vermogen.

**Berekening steekproefgrootte:**
- Baseline: 3,2% CTA-klikfrequentie
- MDE: 15% relatief = 3,68% doelratio
- Vereist: **2.843 bezoekers per variant** (5.686 totaal)
- Bij 500 bezoekers/dag op de prijspagina: **12-dagen test**
- Bij 200 bezoekers/dag: **29-dagen test** — voer hem uit, het wachten is waard

**Vóór lancering:**
- Bevestig dat het CTA-klikevent vuurt in analytics (niet bij paginaweergave)
- Bijhouden: weergaven van de planselectiepagina (drempelmetriek — mag niet dalen)
- Bijhouden: trial-aanmeldingen (de echte downstream-metriek — segmenteer op variant in je analyticsplatform)
- Niet vroegtijdig stoppen — ook al bereik je significantie in week 1, voer de volledige 2 weken uit

**Wat te volgen:**
Als "See Pricing" wint op klikken maar trial-aanmeldingen niet stijgen, zijn gebruikers nieuwsgieriger maar niet meer gecommitteerd. Dat is een prijsduidelijkheidsprobleem, geen CTA-probleem — de volgende test is de prijspagina zelf.

---
