---
name: product-analytics
description: "Product analytics: metrics frameworks definiëren, dashboards bouwen, feature-adoptie analyseren, activering en retentie meten, gegevens interpreteren om productbeslissingen te nemen"
---

# Productanalytics Vaardigheid

## Wanneer activeren
- Bepalen welke metriek voor een product of functie moet worden bijgehouden
- Analyseer waarom een functie na lancering lage adoptie heeft
- Bouw een productmetrics-dashboard van nul af aan
- Interpreteer retentie- of activeringsgegevens om problemen te vinden
- Voorbereiding van een gegevensgestuurde productreview of roadmap-beslissing
- Ontwerp een metrics-framework (North Star, L1/L2-hiërarchie)

## Wanneer NIET gebruiken
- Het instellen van analytics-infrastructuur — use the analytics-tracking vaardigheid
- A/B-testontwerp en statistieken — use the experiment-designer vaardigheid
- Marketing attributieanalyse — dat is paid-ads of analytics-tracking

## Instructies

### Metrics framework ontwerp

```
Ontwerp een metrics framework voor [product].

Product: [beschrijf]
Stadium: [pre-PMF / groeiend / schaalen]
Businessmodel: [abonnement / op gebruik gebaseerd / freemium / marktplaats]
Teamgrootte: [1-5 / 6-20 / 20+]

Metrics hiërarchie:

Niveau 0 — North Star Metriek (1 metriek):
[De enkele metriek die het beste waarde aan gebruikers vertegenwoordigt]
Moet zijn: leidende indicator van inkomsten, meetbaar, actief door het team
Voorbeelden: DAU, wekelijks actieve projecten, verstuurde berichten, gegenereerde rapporten

Niveau 1 — Pijler metrics (3-5 metriek):
[De onderdelen die de North Star Metriek verklaren]
Framework: Acquisitie, Activering, Retentie, Verwijzing, Inkomsten (AARRR)

Niveau 2 — Diagnostische metrics (voor elke pijler):
[Metrics die helpen diagnosticeren waarom een L1 metriek beweegt]

Voorbeeld framework voor een B2B SaaS tool:
NSM: Wekelijks actieve teams (teams met ≥ 3 leden die deze week kern feature gebruikten)
L1: 
  - Nieuwe teams ingeschreven (Acquisitie)
  - % die in week 1 3+ leden hebben uitgenodigd (Activering)
  - % behouden in week 4 (Retentie)
  - Netto Inkomsten Retentie (Inkomsten)
L2 (voor Activering):
  - Tijd tot eerste kernactie
  - % die onboarding checklist hebben voltooid
  - Uitnodigingsverzendingspercentage in sessie 1

Ontwerp het framework voor mijn product. Inclusief: wat NIET moet worden bijgehouden (vanity metrics).
```

### Feature-adoptie analyse

```
Analyseer adoptie voor [functie].

Functie: [beschrijf wat het doet]
Lanceerdatum: [X weken/maanden geleden]
Huidige adoptiesnelheid: [X% van in aanmerking komende gebruikers hebben deze gebruikt]
Doel adoptiesnelheid: [X%]
Analytics-tool: [Mixpanel / Amplitude / PostHog / GA4]

Framework adoptie analyse:

1. Definieer "aangenomen":
   □ Eerste gebruik? (bewustzijn) — te vaag
   □ X keer gebruikt? (betrokkenheid) — beter
   □ In X% van sessies gebruikt? (gewoonte) — best
   [Stel duidelijke adoptiethreshold vast voordat u analyzeert]

2. Trechter van feature-ontdekking naar adoptie:
   - Zag feature-invoerpunt: [X%]
   - Geklikt / gestart: [X%]
   - Eerste gebruik voltooid: [X%]
   - Terugkeerde en gebruikte opnieuw: [X%]
   - "Aangenomen" (volgens uw definitie): [X%]

3. Segmentatie (welke gebruikers nemen aan of niet):
   - Per gebruikersrol / plan / bedrijfsgrootte
   - Per activeringscohorte (nieuwere vs oudere gebruikers)
   - Per primair use case of workflow

4. Barrières voor adoptie (kwalitatief):
   - Is de feature ontdekbaar? (controleren: weten gebruikers überhaupt dat het bestaat?)
   - Is de waarde onmiddellijk duidelijk? (eerste gebruikservaring)
   - Vereist het setup of voorwaarde state?
   - Is er een concurrent workflow al in gebruik?

5. Aanbevelingen per uitvalpoint:
   - Laag bewustzijn → in-app aankondiging, tooltip, e-mail
   - Laag eerste-gebruik afronding → vereenvoudig UI of voeg geleide setup toe
   - Laag hergebruik → controleer of kernwaarde bij eerste gebruik werd afgeleverd

Query om in [analytics tool] uit te voeren + interpretatie van resultaten.
```

### Retentie analyse

```
Analyseer retentiegegevens en identificeer verbeteringskansen.

Product: [beschrijf]
Retentiedefinitie: [gebruiker deed X binnen Y dagen]
Huidige D1/D7/D14/D30 retentie: [X% / X% / X% / X%]
Benchmark voor uw categorie: [zoek uw branche op — varieert sterk]
Analytics-tool: [tool]

Retentie analyse stappen:

1. Vormanalyse:
   - Abvlakkende curve: retentie bereikt een vloer → product heeft kernretentie (goed)
   - Continu dalend: geen retentievloer → PMF-probleem, geen optimalisatieprobleem
   - Stap-functie val op specifieke dag: iets gebeurt op dat moment (proefperiode verloopt? e-mail stopt? functiegrens bereikt?)

2. Cohortenvergelijking:
   - Vergelijk wekelijkse cohorten — behouden recente cohorten beter dan oudere?
   - Verbetering: uw wijzigingen werken
   - Achteruitgang: iets is achteruitgegaan (functie verslechterd, concurrentie verbeterd)
   - Vlak: geen verbetering, geen achteruitgang

3. Segment retentie:
   Welke gebruikers behouden het beste?
   - Kanaal (organisch vs betaald — organisch behoudt doorgaans 2-3x beter)
   - Feature-gebruik (gebruikers die feature X gebruikten behouden Y% vs Z% voor niet-gebruikers)
   - Onboarding pad (checklist voltooid of niet)
   - Bedrijfsgrootte of plan

4. Identificeer de "activeringsfeature":
   Vind de event/feature die het meest correleert met dag-30 retentie.
   Run: event correlatie → retentieanalyse in Amplitude of Mixpanel
   Maak deze feature onderdeel van de onboarding flow.

5. Interventieontwerp:
   D1 daling (< 40% terugkeer dag 1): onboarding probleem
   D7 daling: gewoontevormingsprobleem (push notifications, e-mail, in-app nudge)
   D30 daling: waardeverdieepingsprobleem (nieuwe features, integraties, teamexpansie)

Analyseer mijn retentiegegevens en beveel de meest impactvolle interventie aan.
```

### Product review dashboard

```
Ontwerp een wekelijks product review dashboard voor [product/team].

Team: [product / engineering / volledig bedrijf]
Frequentie: [wekelijks / om de twee weken]
Doelen: [roadmap-beslissingen nemen / regressies identificeren / OKR-voortgang volgen]

Dashboard secties:

1. North Star Metriek (week over week):
   [Metriek naam]: [huidige waarde] vs [vorige week] vs [vorige week vorige maand]
   Trend: ↑/↓ [X%] — [is dit binnen verwacht bereik?]

2. Acquisitie:
   Nieuwe aanmeldingen: [X] (week) / [X] (maand) / [X doel]
   CAC per kanaal: [organisch / betaald / verwijzing]

3. Activering:
   Activeringspercentage (gedefinieerd als [X]): [X%] vs doel [X%]
   Tijd tot activering: p50 [Xh] / p90 [Xh]

4. Retentie:
   D7 retentie: [X%] / D30 retentie: [X%]
   Wekelijks actieve gebruikers trend: [sparkline gegevens]

5. Inkomsten:
   MRR: $[X] — [+/-X% WoW]
   Nieuwe MRR: $[X] / Expansie: $[X] / Churn: $[X]
   Netto MRR-verandering: $[X]

6. Product gezondheid:
   Top feature op gebruik deze week: [X]
   Feature adoptie op recente launches: [namen + %]
   Ondersteuningsvolume: [X tickets] — [trend]

7. Experimenten:
   Lopend: [testnaam] — [dagen resterend] — [huidig resultaat]
   Afgeloten deze week: [testnaam] — [resultaat] — [besluit]

8. Sleutelvragen voor deze week:
   - [Wat is veranderd en waarom?]
   - [Wat heeft een beslissing nodig?]
   - [Wat weten we nog niet?]

Bouw dit dashboard in [Mixpanel / Amplitude / PostHog / Metabase / Notion].
```

## Voorbeeld

**Gebruiker:** Onze SaaS (B2B teamcollaboratie tool) heeft 35% D30 retentie. We denken dat het een activerincoprobleem is. Analytics in Mixpanel. Wat moeten we onderzoeken?

**Claude's analyse plan:**

35% D30 voor een B2B collaborationstool ligt onder het typische (45-60% voor de categorie). Maar "activerincoprobleem" is een hypothese — laten we deze valideren voordat we repareren.

**Stap 1 — Bevestig de uitvallocatie in Mixpanel:**
Bouw deze trechter: Aanmelden → Eerste login → Team-uitnodiging verzonden → Kernfeature 3x gebruikt → D30 behouden.

Als het retentiepercentage voor gebruikers die alle trechtersstappen voltooien > 60% is, is het probleem ACTIVERING (niet productwaarde). U hebt een goed product dat de meeste gebruikers nooit ervaren.

**Stap 2 — Vind de activeringsvoorspeller:**
In Mixpanel: Retentie → Vergelijk op "Heb ik event X in de eerste 7 dagen gedaan". Test deze events:
- Teamlid uitgenodigd → behouden op D30?
- Kernfeature 3+ keer gebruikt → behouden op D30?
- Integratie verbonden → behouden op D30?

De event met de hoogste D30 retentiecorrelatie = uw aha moment. Maak dit het activersdoel.

**Stap 3 — Vind de barrière:**
Als het activerevent "team-uitnodiging verzonden" is en slechts 22% van aanmeldingen een in week 1 verzendt, is de vraag: waarom nodigen ze hun team niet uit?

Segmenteer per: solo aanmeldingen vs team aanmeldingen. Als solo aanmeldingen 15% en team aanmeldingen 58% retentie hebben, is het probleem dat u te veel solo gebruikers acquireert, niet dat uw activeringsflow kapot is.

**Beslissingsstructuur output:**
- Lage activeringssnelheid + hoge post-activering retentie → repareer activeringsflow
- Hoge activeringssnelheid + lage retentie → repareer productwaarde of doelsegment
- Lage activering + lage post-activering retentie → diepere ontdekking nodig

---
