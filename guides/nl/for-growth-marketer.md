# Claude voor Growth Marketeers

Alles wat een Growth Hacker of Performance Marketeer nodig heeft om AI-versterkte experimenten uit te voeren, betaalde acquisitie te optimaliseren, funnels te analyseren en te rapporteren over groei — zonder te hoeven wachten op datateams of engineeringsprints.

---

## Voor wie is dit

Je bent een growth marketeer, performance marketeer of growth hacker die verantwoordelijk is voor het bewegen van metrics: aanmeldingen, activeringspercentages, betaalde CAC, conversiepercentages, MRR-groei. Je voert constant experimenten uit, leeft in spreadsheets en dashboards en hebt altijd tijdgebrek.

**Voor Claude Code:** 3 uur om een experimentbrief en steekproefgrootte-berekening te schrijven. 2 uur om een wekelijks groeioverzicht te bouwen. 45 minuten per A/B-testdocumentatie. Handmatige funnelanalyse van ruwe data-exports.

**Daarna:** Experimentbrieven in 5 minuten. Wekelijks groeirapport geschreven en gestructureerd in 10 minuten. Steekproefgrootte-berekeningen direct. Funnelanalyse gestructureerd en geinterpreteerd op basis van je ruwe cijfers. Jij focust op de beslissingen, Claude doet de synthese.

---

## Installatie in 30 seconden

```bash
# Install the full growth marketer stack
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/analytics-tracking
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
npx claudient add skill product/experiment-designer
npx claudient add agent advisors/cmo-advisor
npx claudient add agent advisors/cro-advisor
```

---

## Jouw Claude Code growth-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/experiment-tracker` | Hypothese schrijven, steekproefgrootte-calculator, resultatenanalyse, statistische significantie | Elke A/B-test — voor, tijdens en na |
| `/growth-dashboard` | Wekelijks AARRR-dashboard met trendanalyse en commentaar | Maandagochtend metriekenreview |
| `/paid-ads` | Google-, Meta-, LinkedIn-campagnestructuur, creative brief, ROAS-optimalisatie | Elk betaald kanaalwerk |
| `/onboarding-cro` | Activatiefunnelanalyse, onboarding-sequentie-optimalisatie | Wanneer activeringspercentage de bottleneck is |
| `/page-cro` | Landingspagina en conversieratio-optimalisatie — tekst, opmaak, CTA-testen | Conversiewerk op paginaniveau |
| `/analytics-tracking` | GA4, Mixpanel, Amplitude, PostHog instellen en funnelanalyse | Analytics-instrumentatie |
| `/referral-program` | Referral-mechanismen, incentivestructuur, virale-coefficient-modellering | Referral opbouwen of verbeteren |
| `/pricing-strategy` | Prijspaginastrategie, planpositionering, prijstesten | Prijsexperimenten |
| `/experiment-designer` | End-to-end experimentontwerp: hypothese, methodologie, succesmetrieken | Complexe multivariabele experimenten |

### Agenten

| Agent | Model | Wanneer in te zetten |
|---|---|---|
| `cmo-advisor` | Opus | Strategische kanaalmix, budgetallocatie, groeistrategie-beslissingen |
| `cro-advisor` | Sonnet | Specifieke conversieratio-problemen — wat te testen en waarom |

---

## Dagelijkse workflow

### Ochtend (30-45 minuten)

**1. Wekelijks groeioverzicht — alleen op maandag**
```
/growth-dashboard

Weekly growth metrics — week of [DATE]:

Acquisition:
- New signups: [N] (vs [N] last week)
- Paid spend: $[X]
- CAC by channel: Google $[X] | Meta $[X] | Organic $[X]

Activation:
- Activation rate: [X%] (vs [X%] last week)
- Time to aha moment (median): [X days]

Retention:
- 7-day retention: [X%]
- 30-day retention: [X%]
- DAU/MAU: [X%]

Revenue:
- MRR: $[X] (+$[X] WoW)
- Churned MRR: $[X]
- LTV:CAC: [X:1]

Experiments running:
- [Test name]: Day [X], lift [+/-X%], significance [X%]

Write me the dashboard with commentary, traffic light status, and recommended actions.
```

**2. Dagelijkse experimentcheck — duurt 5 minuten**
```
/experiment-tracker

My live tests:
1. [Test name]: control [X%] vs variant [X%], [N] visitors each, running [X days]
2. [Test name]: control [X] vs variant [X], [N] visitors each, running [X days]

For each test:
- Have we reached statistical significance yet?
- Are we on track to conclude by [target date]?
- Any guardrail metrics showing concern?
- Should I extend, stop, or keep running?
```

---

### Middag — campagne- en experimentwerk

**3. Betaalde acquisitie-optimalisatie**
```
/paid-ads

Channel: [Google / Meta / LinkedIn]
Current ROAS: [X] (target: [X])
Current CPA: $[X] (target: $[X])
Monthly spend: $[X]

This week's issues:
- [Describe what's underperforming and any changes made]

Diagnose the issue and give me 3 actions to improve ROAS this week.
```

**4. CRO — landingspagina of funnel**
```
/page-cro

Page: [URL or describe]
Current conversion rate: [X%]
Traffic source: [paid / organic / email]
Goal: [signup / purchase / demo request]
Top friction points I suspect: [describe]

Audit the page and give me the top 3 experiments to run ranked by expected impact.
```

---

### Checklist voor experimentlancering

**Voor het starten van een A/B-test:**
```
/experiment-tracker

I'm about to launch this test. Run the pre-launch checklist.

Test: [describe the change]
Primary metric: [conversion rate / click rate / revenue per visitor]
Baseline: [X%]
MDE: [X% relative improvement I need to detect]
Traffic: [X visitors per day to this page/flow]
Tool: [Optimizely / VWO / GrowthBook / LaunchDarkly]

Confirm:
1. Sample size required (per variant)
2. Expected test duration
3. Pre-launch checklist (tracking, mutual exclusivity, rollback plan)
4. Any risks I should know about
```

---

### Vrijdag — wekelijkse experimentreview

**5. Experimentportfolio-review**
```
/experiment-tracker

Review my experiment portfolio this week.

Concluded tests:
[Test name]: control [X%] vs variant [X%], [N] per variant, p-value [X], ran [X days]
Decision I made: [shipped / killed]

Running tests:
[continue for each active test]

Backlog (unstarted):
1. [Idea 1] — estimated impact [high/med/low], effort [high/med/low]
2. [Idea 2]

Give me: ICE scores for the backlog, whether my concluded tests are documented correctly,
and what I should run next quarter.
```

---

## 30-dagenplan (nieuwe growth marketeers)

### Week 1 — Basislijnmeting
- Installeer alle skills via bovenstaande installatieopdrachten
- Verbind je analytics-tool (GA4, Mixpanel, Amplitude of PostHog)
- Voer `/analytics-tracking` uit om je huidige tracking te auditen — vind wat kapot of ontbrekend is
- Voer `/growth-dashboard` uit met historische data — stel je basislijngetallen vast
- Breng je volledige funnel in kaart: van verkeersbron tot betalende klant — elke stap

### Week 2 — Hypotheseachterstand
- Voer `/experiment-designer` en `/experiment-tracker` uit om je hypotheseachterstand te scoren
- Gebruik ICE-scoring om de top 5 experimenten voor dit kwartaal te rangschikken
- Schrijf voor elke hypothese een formele hypothese, steekproefgrootte-berekening en succescriteria voordat je code aanraakt
- Lanceer niets in week 2 — begrijp eerst de basislijn

### Week 3 — Eerste experimenten
- Lanceer je top 2 experimenten uit de achterstand
- Gebruik `/paid-ads` om de huidige betaalde acquisitie-opzet te auditen — vind verspild budget
- Voer een CRO-audit uit met `/page-cro` op je conversiepagina met het meeste verkeer
- Bijhouden: hoe lang duurt het om een experimentbrief te schrijven? Volg dit wekelijks — het moet voor week 4 onder de 10 minuten dalen

### Week 4 — Snelheid en rapportage
- Voer je eerste volledige wekelijkse groeioverzicht helemaal zelf uit
- Stel je experimentsnelheid vast: hoeveel tests kan je team per maand uitvoeren?
- Presenteer aan het management: wat zijn de top 3 groeihefbomen en wat voer je uit tegen elk?
- Identificeer je analytics-gaten — wat kun je niet meten wat je wel nodig hebt?

---

## Tool-integraties

### Amplitude / Mixpanel / PostHog

Dit zijn je primaire gegevensbronnen voor elke Claude-sessie. Verbind ze via MCP voor live data-toegang:

```json
// For PostHog — add to ~/.claude/settings.json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": ["-y", "@posthog/mcp-server"],
      "env": {
        "POSTHOG_API_KEY": "your-api-key",
        "POSTHOG_HOST": "https://app.posthog.com"
      }
    }
  }
}
```

Met live analytics-toegang kan Claude:
- Funnelconversiedata ophalen per cohort, segment of tijdvenster
- Gebeurtenisaantallen en gebruikerseigenschappen opvragen zonder exporteren naar CSV
- Op verzoek retentietabellen bouwen
- Segmenten met afwijkend gedrag identificeren

### Google Ads en Meta Ads

Exporteer prestatiedata als CSV → plak in `/paid-ads` voor analyse.
Voor geautomatiseerde rapportage, verbind via n8n of Make — haal wekelijkse campagnedata op in een Notion-pagina en voer dan `/growth-dashboard` uit op de data.

### GrowthBook / LaunchDarkly (experimentplatforms)

Exporteer experimentresultaten → plak in `/experiment-tracker` voor statistische analyse en beslissingsondersteuning.
Claude neemt geen ship/kill-beslissingen — het brengt het statistische beeld in beeld en biedt het kader. Jij neemt de beslissing.

### Notion / Confluence (experimentlogboek)

Gebruik Claude om experimentdocumentatie te genereren → plak in het experimentlogboek van je team na elke afgeronde test. Consistente documentatie is het allerbelangrijkste wat groeiteams niet doen.

---

## Te volgen metrieken

| Metriek | Definitie | Groen | Geel | Rood |
|---|---|---|---|---|
| Wekelijkse experimentsnelheid | Gelanceerde tests per week | ≥ 2 | 1 | 0 |
| Winstpercentage | % van experimenten met significante positieve lift | 25-35% | 15-25% | < 15% of > 40% |
| Activeringspercentage | % nieuwe aanmeldingen die het aha-moment voltooien | > 40% | 20-40% | < 20% |
| CAC-terugverdientijd | Maanden om CAC terug te verdienen uit bruto marge van een cohort | < 12 mnd | 12-18 mnd | > 18 mnd |
| LTV:CAC-verhouding | Klant-LTV gedeeld door CAC | > 3:1 | 2-3:1 | < 2:1 |
| Netto inkomstenretentie | (MRR + uitbreiding - verloop) / begin MRR | > 100% | 90-100% | < 90% |
| D30-retentie | % van dag 0-gebruikers nog actief op dag 30 | > 30% | 15-30% | < 15% |

---

## Veelgemaakte groeifouten (en hoe Claude Code helpt ze te vermijden)

**Fout 1: Experimenten lanceren zonder een goede hypothese**
`/experiment-tracker` dwingt je de hypothese, MDE en succescriteria te schrijven voordat je het testtool aanraakt. Geen hypothese = geen lancering.

**Fout 2: Tests stoppen bij eerste significantie**
De pre-lancering checklist legt een testduur en einddatum vast. Claude geeft een waarschuwing als je resultaten leest voordat de vereiste steekproefgrootte is bereikt.

**Fout 3: Een kapotte funnel optimaliseren**
`/analytics-tracking` en `/page-cro` identificeren tracking-gaten en UX-wrijving voordat je CRO-experimenten uitvoert. Het repareren van een kapotte onboarding-flow is geen test — het is een bugfix.

**Fout 4: Metrieken rapporteren zonder context**
`/growth-dashboard` genereert narratief commentaar bij elk rapport — niet alleen cijfers. "Aanmeldingen daalden 18%" heeft een uitleg en actie nodig, niet alleen een rode stoplicht.

**Fout 5: Betaald adverteren voordat de funnel converteert**
`/onboarding-cro` en `/page-cro` identificeren de grootste conversiedalingen. Los die op voordat je betaalde acquisitie opschaalt — anders vul je een lekke emmer.

---

## Bronnen

- [Aan de slag met Claude Code](./getting-started.md)
- [Experiment tracker skill](../skills/marketing/experiment-tracker.md)
- [Growth dashboard skill](../skills/marketing/growth-dashboard.md)
- [Groeiexperiment-workflow](../workflows/growth-experiment.md)
- [Analytics tracking instellen](../skills/marketing/analytics-tracking.md)
- [Betaalde advertentie-optimalisatie](../skills/marketing/paid-ads.md)

---
