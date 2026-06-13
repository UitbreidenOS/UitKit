---
name: analytics-tracking
description: "Analytics-implementatie: GA4, Mixpanel, Amplitude, PostHog event tracking, trechter analyse, retentie cohorten, en attributiemodellering"
---

# Analytics Tracking Skill

## Wanneer activeren
- Event tracking instellen voor een web-app of marketing website
- Een meetplan ontwerpen voor het implementeren van analytics
- Foutopsporing van verbroken of ontbrekende analytics-gegevens
- Trechters bouwen om conversie drop-offs te vinden
- Retentie cohorten analyseren om churn te begrijpen
- Kiezen tussen analytics tools (GA4, Mixpanel, Amplitude, PostHog)

## Wanneer NIET gebruiken
- Business intelligence of SQL-level data warehouse queries — dat is een data-ml taak
- A/B testing framework setup — gebruik de experiment-designer skill
- Privacy/GDPR compliance audits voor tracking — gebruik de privacy-pia skill

## Instructies

### Meetplan

```
Bouw een meetplan voor [product/website].

Product type: [SaaS / ecommerce / content site / mobile app]
Bedrijfsdoelen: [welke resultaten belangrijk zijn — aanmeldingen, aankopen, retentie, engagement]
Huidige analytics setup: [GA4 / Mixpanel / Amplitude / PostHog / geen]
Team: [developer + analist / solo / marketing team]

Meetplan structuur:

1. North Star Metric:
   [Het ene getal dat de productgezondheid het beste vastlegt]
   bijv. Weekly Active Users / MRR / Activation Rate

2. Ondersteunende metreken (niveau 2):
   [3-5 metreken die de North Star verklaren]

3. Belangrijke gebruikersevenementen om te volgen:
   Voor elk evenement:
   - Ereignisnaam: [snake_case, consistent naming]
   - Trigger: [welke gebruikersactie activeert dit]
   - Properties: [sleutelattributen om vast te leggen — plan: string, amount: number, etc.]
   - Waarom: [welke zakelijke vraag beantwoordt dit?]

4. Te meten trechters:
   - [Acquisitie trechter: bron → aanmelding → activering]
   - [Kern product trechter: inloggen → belangrijkste actie → waardeert moment]
   - [Monetarisatie trechter: trial → upgrade → retentie]

5. Benodigde dashboards:
   - [Leidinggevenden: MRR, churn, NPS]
   - [Product: activation rate, feature adoption, retentie]
   - [Marketing: traffic, conversion, CAC per kanaal]

Produceert het event tracking plan als een tabel:
Event | Trigger | Properties | Prioriteit | Dashboard
```

### GA4-implementatie

```
Stel GA4 event tracking in voor [website/app].

Website type: [marketing site / web app / ecommerce]
Framework: [Next.js / React / vanilla JS / WordPress]
Doelen: [volg deze conversies — lijst]

Implementatieplan:

1. Basis setup:
   - Installeer GA4 via gtag.js of GTM (gebruik GTM als marketeers later tags moeten toevoegen)
   - Configureer data stream en measurement ID
   - Enable Enhanced Measurement voor: scrolls, outbound clicks, file downloads, site search

2. Aangepaste events om te implementeren:
   Event: [naam]
   Code:
   gtag('event', '[event_name]', {
     event_category: '[category]',
     event_label: '[label]',
     value: [optionele numerieke waarde],
     [custom_parameter]: '[value]'
   });
   Waar activeren: [component / page / action]

3. Conversie-events:
   Markeer deze als conversies in GA4 admin:
   - [signup_complete]
   - [purchase]
   - [demo_requested]
   Markeer in: Admin → Events → Mark as conversion

4. Doelgroepen voor retargeting:
   - Trial-gebruikers die niet hebben geconverteerd (bezochten /pricing 2+ keer)
   - High-intent bezoekers (3+ pagina's, 2+ minuten)

5. Debug en verifieer:
   - GA4 DebugView: enable debug mode in GTM of voeg ?debug_mode=1 toe
   - Realtime rapport: bevestig events die live triggeren
   - Check op duplicate events (eenmaal triggeren, niet bij elke re-render)

Genereer de implementatiecode voor mijn framework.
```

### Trechter analyse

```
Analyseer mijn conversie trechter en identificeer drop-offs.

Trechter stappen: [list elke stap op volgorde]
Voorbeeld: Homepage → Signup pagina → Email bevestigd → Dashboard → Feature gebruikt → Upgrade

Huidige conversiesnelheden per stap (indien bekend): [X%]
Analytics tool: [GA4 / Mixpanel / Amplitude / PostHog]
Periode: [afgelopen 30 / 60 / 90 dagen]
Segmenten om te vergelijken: [mobiel vs. desktop / kanaal / plan type]

Analyse structuur:
1. Totale trechter conversie (eerste stap → laatste stap): [X%]
2. Stap-voor-stap drop-off:
   Stap 1 → 2: [X% drop — hoog/medium/laag vergeleken met benchmarks]
   Stap 2 → 3: [X% drop]
   [doorgaan voor elke stap]

3. Slechtste drop-off stap: [welke stap verliest het meeste mensen]
   Hypothesen voor waarom:
   - [wrijving in de UI?]
   - [ontbrekende informatie?]
   - [technische bug?]
   - [verwachtings mismatch?]

4. Experimenten om uit te voeren:
   - [één wijziging per hypothese, meetbaar in analytics]

5. Segmentatie inzicht:
   - Vallen mobiele gebruikers op een ander stap dan desktop?
   - Converteren betaalde advertentie bezoekers anders dan organisch?

Query om uit te voeren in [tool]: [schrijf de trechter query of stappen om in te stellen]
```

### Retentie cohort analyse

```
Voer een retentie cohort analyse uit voor [product].

Analytics tool: [Mixpanel / Amplitude / PostHog / GA4 / raw SQL]
Retentie definitie: [gebruiker keerde terug en deed X binnen Y dagen]
Tijd venster: [wekelijks / maandelijks cohorten]
Product leeftijd: [X maanden beschikbare gegevens]

Cohort analyse setup:
1. Definieer retentie event: [de actie die telt als "retained"]
   - Niet alleen "ingelogd" — definieer betekenisvol engagement
   - bijv. "Kern feature gebruikt", "item gemaakt", "bericht verzonden"

2. Bouw cohort tabel:
   - Rijen: signup cohorten (week of maand van eerste gebruik)
   - Kolommen: Dag 1, Dag 7, Dag 14, Dag 30, Dag 60, Dag 90
   - Cel: % gebruikers die op die dag terugkeerden

3. Interpreteer de vorm:
   - Platte curve na Dag 14: product heeft zijn retentie vloer gevonden (goed)
   - Continue daling zonder vloer: product-market fit probleem
   - Steile Dag 1 drop: onboarding probleem, niet retentie
   - Recente cohorten beter dan ouder: verbeteringstrend (goed)

4. Identificeer welke cohorten het beste behouden:
   - Per acquisitie kanaal (organisch vs. betaald)
   - Per signup feature gebruikt in eerste sessie
   - Per plan of segment

5. Interventie experiment:
   Gebaseerd op drop-off op Dag [X], test: [email / in-app nudge / feature highlight]

Schrijf de query voor [tool] en interpreteer de resultaten.
```

### Tool selectie gids

```
Help me het juiste analytics tool te kiezen.

Product stadium: [pre-launch / early growth / scaling]
Team: [solo / 2-5 / 5+]
Technische middelen: [developer beschikbaar / alleen no-code]
Budget: $[X/maand]
Primaire behoefte: [product analytics / marketing attribution / ecommerce / BI]
Data privacy eisen: [GDPR / HIPAA / geen speciale eisen]

Vergelijk:

GA4 — Best voor: marketing sites, ecommerce, Google Ads integratie. Gratis. Beperkte product analytics diepte.

Mixpanel — Best voor: SaaS product analytics, trechter en retentie analyse. Gratis start (beperkte events).

Amplitude — Best voor: grotere product teams, cohort analyse, predictive analytics. Gratis tier beschikbaar.

PostHog — Best voor: self-hosted optie, feature flags + analytics in één, open source. Gratis tot 1M events/maand.

Plausible / Fathom — Best voor: privacy-first, geen cookie toestemming nodig, eenvoudige traffic metreken. $9-14/maand.

Heap — Best voor: retroactieve event capture (geen vooraf planning nodig), enterprise.

Aanbeveling voor mijn situatie: [tool + waarom + kosten bij mijn schaal]
```

## Voorbeeld

**Gebruiker:** Onze SaaS heeft een 23% trial-to-paid conversie, maar we weten niet waar mensen weggaan. We gebruiken PostHog. Help me funnel tracking in te stellen.

**Claudes plan:**

**Trechter om in PostHog te bouwen:**
1. Trial aanmelding voltooid → 2. Dashboard eerste keer geladen → 3. Kern feature gebruikt (definieer: "project gemaakt") → 4. Teamlid uitgenodigd → 5. Upgrade naar betaald

**PostHog trechter setup:**
In PostHog: Insights → Funnels → voeg deze 5 stappen in volgorde toe. Stel conversie venster in: 14 dagen (lengte van je trial).

**Voorspelling waar je de drop zult zien:**
- Stap 1→2 (aanmelding → dashboard): meestal 85-95%. Als lager, e-mail bevestiging is verbroken of langzaam.
- Stap 2→3 (dashboard → eerste actie): dit is meestal de grootste drop (40-60%). Lege staat wrijving.
- Stap 3→4 (alleen gebruik → team uitnodigen): 15-30% uitnodigingspercentage is normaal voor team tools.
- Stap 4→5 (actief → betaald): als activering (stap 1-4) voltooid, 50-70% moeten converteren.

**Eerste experiment:** Voeg een "quick start" checklist in de lege dashboard staat met 3 taken toe. Elke task voltooid event = tracked. Lege staat is de #1 hefboom bij stap 2→3.

---
