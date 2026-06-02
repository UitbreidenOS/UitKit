# Claude voor Investeerders en VC-analisten

Alles wat een VC-analist, associate, of partner nodig heeft om AI-versterkte dealscreening, due diligence, financiële modellering, portfoliobewaking en IC-voorbereiding uit te voeren in Claude Code.

---

## Voor wie is dit

Je bent een venture capital-analist, associate, partner of onafhankelijke angel-investeerder. Je taak is om elke relevante deal te zien, snel te screenen, de beste te onderzoeken en goede investeringsbeslissingen te nemen. Je verdrinkt in inkomende deals, besteedt 40% van je tijd aan het schrijven van memo's en rapporten, en hebt nooit genoeg uren om diepgaand onderzoek te doen naar elk bedrijf dat het verdient. Claude Code verandert die verhouding.

**Voor Claude Code:** 6 uur om een eerste deal-memo te schrijven. Een halve dag om voor te bereiden op een bestuursvergadering. 3 uur om een kwartaalrapport voor LP's samen te stellen over 15 bedrijven.

**Daarna:** Eerste deal-memo in 45 minuten. Voorbereiding bestuursvergadering in 20 minuten. LP-rapport portfoliosectie in 30 minuten.

---

## Installatie in 30 seconden

```bash
# Install all investor skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/dcf-model
npx claudient add skill finance/diligence-review
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/earnings-analysis

# Install relevant agents
npx claudient add agent advisors/cfo-advisor
npx claudient add agent roles/quant-analyst
npx claudient add agent roles/scientific-researcher
```

---

## Jouw Claude Code investeerders-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/deal-screening` | Eerste screening: markt, moat, management, financiën, fit — pass/proceed-oordeel | Eerste blik op elke nieuwe deal |
| `/deal-memo` | Volledig deal-memo: thesis, team, markt, financiën, risico's, due diligence-lijst, aanbeveling | Na een oprichtervergadering |
| `/ic-memo` | Investment Committee-memo (9-secties PE/growth-formaat) | Voor IC-presentatie |
| `/dcf-model` | DCF-financieel model: aannames, projecties, terminalwaarde, gevoeligheid — in Python of Excel-formaat | Elk waarderingswerk |
| `/diligence-review` | Due diligence structureren en uitvoeren: klantgesprekken, technische review, referentiegesprekken, financiele audit-checklist | Due diligence na term sheet |
| `/comps-analysis` | Vergelijkbare bedrijfs- en transactieanalyse: EV/Omzet, EV/EBITDA, groeigecorrigeerde multiples | Waarderingsbenchmarking |
| `/portfolio-monitor` | Synthese van bestuursupdates, KPI-tracking, follow-on triggers, rode vlaggen, LP-rapportsecties | Maandelijkse/kwartaalportfolioreview |
| `/earnings-analysis` | Analyse van earnings calls van beursgenoteerde bedrijven — doorvertaling naar privémarkt-comps | Concurrentieonderzoek |

### Agenten

| Agent | Model | Wanneer in te zetten |
|---|---|---|
| `cfo-advisor` | Opus | Review financieel model, uitdaging unit economics |
| `quant-analyst` | Opus | Kwantitatieve marktomvang, data-gedreven thesis |
| `scientific-researcher` | Opus | Diepgaand sectoronderzoek, academische literatuur voor deep tech |

---

## Dagelijkse workflow

### Ochtend (30-45 minuten)

**1. Dealflow-review — inkomende deals screenen**
```
/deal-screening

Screen these inbound deals quickly. Give me a pass/proceed verdict on each.

[Deal 1 — company name, sector, stage, ARR/revenue, growth, valuation ask, brief description]
[Deal 2]
[Deal 3]

My fund thesis: [describe your mandate — stage, sector, check size]
Skip obvious mismatches. Flag the one worth a deeper look.
```

**2. Portfoliocheck — ontvangen bestuursupdates**
```
/portfolio-monitor

I received a monthly update from [company]. Synthesize it and flag anything requiring my attention this week.

[Paste board update or key metrics]
```

---

### Na oprichtervergadering (45-90 minuten)

**3. Deal-memo — eerste indruk op papier**
```
/deal-memo

Company: [name]
What I learned in the meeting: [your notes — paste or summarize]
My gut: [preliminary view]

Fill in the deal memo structure. Mark anything I didn't learn as [NEED TO VERIFY].
```

---

### Due diligence-fase (doorlopend)

**4. Voorbereiding klantreferentiegesprek**
```
/diligence-review

I'm calling [company]'s reference customer [name, title, company] tomorrow.

Investment thesis: [what we believe about the company]
Key risks to validate: [what could be wrong]

Generate 12 reference call questions that probe:
- How they use the product and how embedded it is
- What would make them cancel
- How the product compares to alternatives they've evaluated
- Any concerns with the company or team
```

**5. Comps-analyse**
```
/comps-analysis

Run a comparable company analysis for [company] in [sector].

Our company metrics: ARR $[X]M, [X]% growth, [X]% gross margin, [X]x NRR
Round: $[X]M at $[X]M pre-money

Find public comps and recent private transaction comps. What multiple are we paying vs. the market?
```

---

### IC-voorbereiding

**6. IC-memo — volledige Investment Committee-presentatie**
```
/ic-memo

Convert my deal memo into a full IC memo for [company].

Deal memo (paste or summarize): [...]
Diligence findings: [what we verified, what we couldn't]
Updated recommendation: [invest / pass / conditional]

Generate all 9 sections with [VERIFY] flags on any unconfirmed data.
```

---

### Portfolioondersteuning (bestuursvergaderdagen)

**7. Voorbereiding bestuursvergadering**
```
/portfolio-monitor

Board meeting with [company] is tomorrow. Prepare me.

Last board meeting: [summary]
Current board package: [paste]
My concerns going in: [list]
What I want to drive: [topics]

Give me: pre-read synthesis, hard questions, my agenda, potential asks from the team.
```

---

### Wekelijks (vrijdag — 30 minuten)

**8. Wekelijkse dealflow-samenvatting**
```
/deal-screening

Summarize this week's deal flow:
- Deals screened: [N]
- Passed: [N] — [brief reason for each major pass]
- In pipeline: [N] — [status of each]
- Moving to IC: [N]

What should I prioritize next week?
```

---

## 30-dagenplan (nieuwe VC-analist)

### Week 1 — Dealscreening beheersen
- Installeer alle investeerdersskills: `npx claudient add skill finance/[name]`
- Voer `/deal-screening` uit op 20 recente deals uit het archief van je fonds — vergelijk je uitvoer met wat partners besloten
- Begrijp het ICP van je fonds: fase, sector, chequegrootte, follow-on-strategie
- Lees de `/comps-analysis`-skill — begrijp hoe multiples werken in jouw sectoren

### Week 2 — Deal-memo-oefening
- Woon 3 partnervergaderingen bij als schaduw → schrijf zelfstandig deal-memo's → vergelijk met versie van senior analist
- Voer `/dcf-model` uit op een portfoliobedrijf — begrijp de aannames en gevoeligheden
- Begin je sectorcomps-database te bouwen — `/comps-analysis` helpt het te structureren

### Week 3 — Due diligence en portfolio
- Voer `/diligence-review` uit op een actieve deal — wees eigenaar van het klantreferentieproces
- Gebruik `/portfolio-monitor` om Q1-updates te synthetiseren voor 5 portfoliobedrijven
- Bereid je voor op een bestuursvergadering met `/portfolio-monitor` bestuursvoorbereiding-modus

### Week 4 — IC-presentatie
- Schrijf een volledig IC-memo met `/ic-memo` over een deal waaraan je hebt gewerkt
- Presenteer aan de partners — gebruik de uitvoer van Claude als jouw structuur, niet als jouw script
- Bijhouden: hoeveel van je vragen voor de vergadering kwamen ter sprake tijdens IC? (benchmark: >60% toont goede vraagkwaliteit)

---

## Tool-integraties

### Notion (dealtracking)
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token-here"
      }
    }
  }
}
```

Met Notion verbonden: Claude kan je deal-pipelinedatabase lezen, bedrijfsnotities ophalen en deal-memoconcepten rechtstreeks in je dealpagina's schrijven.

### Airtable / deal-pipeline
Exporteer deal-pipeline als CSV → plak in `/deal-screening` → ontvang gerangschikte pass/proceed-oordelen. Gebruik Airtable MCP voor live-integratie.

### Financiële modellen
Claude genereert Python- of gestructureerde Excel-klare tabellen voor DCF- en comps-werk. Voor complexe modellen: genereer de structuur en aannames in Claude → bouw in Excel/Google Sheets → plak resultaten terug voor narratief.

### Gong / gespreksopnames
Plak gesprekstranscript van oprichter in `/deal-memo` → Claude extraheert belangrijke claims, markeert niet-geverifieerde uitspraken en structureert in deal-memoformaat.

---

## Te volgen metrieken

| Activiteit | Handmatige tijd | Met Claude |
|---|---|---|
| Eerste screening per deal | 45 min | 8 min |
| Deal-memoconcepte | 6 uur | 45 min |
| IC-memo | 8 uur | 2 uur |
| Voorbereiding bestuursvergadering | 2 uur | 20 min |
| LP-kwartaalrapport (portfoliosectie) | 4 uur | 45 min |
| Voorbereiding referentiegesprek | 30 min | 10 min |
| Comps-analyse | 3 uur | 30 min |

Doel: 3x meer deals beoordeeld met hetzelfde aantal analisten. De kwaliteitsdrempel stijgt omdat Claude je denken structureert, niet alleen tijd bespaart.

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Verankeren op het narratief van de oprichter**
`/deal-memo` vraagt je elke door de oprichter verstrekte claim te markeren als `[UNVERIFIED]`. Dwingt intellectuele eerlijkheid voordat je verliefd wordt op een verhaal.

**Fout 2: Rode vlaggen missen in bestuursupdates**
`/portfolio-monitor` voert een gestructureerde rode-vlaggen-checklist uit op elke bestuursupdate. Je mist "verbrand budget steeg 40% terwijl omzet gelijk bleef" begraven in dia 12 niet meer.

**Fout 3: Memo's schrijven die pleiten in plaats van analyseren**
De risicosectie van Claude is gestructureerd om evenwichtige analyse te forceren. IC-leden die pleidooizware memo's ontvangen, waarderen ze minder.

**Fout 4: Referentiegesprekken overslaan**
`/diligence-review` genereert referentiegespreksragen die verder gaan dan de zachte vragen die oprichters klanten leren te beantwoorden.

**Fout 5: De verkeerde waardering betalen**
`/comps-analysis` verankert elke deal aan marktcomps voordat je enthousiast wordt over het bedrijf.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [Dealscreening skill](../skills/finance/deal-screening.md)
- [Deal-memo skill](../skills/finance/deal-memo.md)
- [IC-memo skill](../skills/finance/ic-memo.md)
- [Portfoliomonitor skill](../skills/finance/portfolio-monitor.md)
- [Dealscreening-workflow](../workflows/deal-screening.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
