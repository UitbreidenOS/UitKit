# Claude voor Product Managers

Alles wat een product manager nodig heeft om AI-versterkte discovery, roadmapplanning, sprintlevering, stakeholderafstemming en data-gedreven beslissingen te runnen — met Claude Code.

---

## Voor wie is dit

Je bent een PM bij een startup of scale-up die een product beheert met echte klanten, een engineeringteam dat van jou afhankelijk is voor duidelijke specificaties en stakeholders die afstemming nodig hebben. Je besteedt te veel tijd aan het schrijven van documenten, het voorbereiden van vergaderingen en het najagen van beslissingen. Claude Code vermindert die overhead zodat je meer tijd kunt besteden aan klanten en nadenken over het product.

**Voor Claude Code:** 4 uur om een PRD te schrijven. 2 uur om discovery-interviews voor te bereiden. 1 uur om sprintverhalen te schrijven. Een halve dag om een concurrentieanalyse te bouwen.

**Daarna:** PRD ontworpen in 45 minuten. Interviewgids in 10 minuten. Sprintbacklog verfijnd in 30 minuten. Concurrentieanalyse in een uur.

---

## Installatie in 30 seconden

```bash
# Install the full PM stack
npx claudient add skill product/product-discovery
npx claudient add skill product/product-roadmap
npx claudient add skill product/experiment-designer
npx claudient add skill product/product-analytics
npx claudient add skill product/competitive-teardown
npx claudient add skill product/ux-researcher
npx claudient add skill product/code-to-prd
npx claudient add skill product/product-manager-toolkit
npx claudient add skill product/pm-sprint-review
npx claudient add skill product/user-story-writer
npx claudient add agents advisors/cpo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Jouw Claude Code PM-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/product-discovery` | Klantinterviewgidsen, JTBD-analyse, kansscoring, probleembriefs | Voordat je committit aan het bouwen van iets |
| `/user-story-writer` | Zet ruwe ideeen om naar gestructureerde verhalen met AC en randgevallen | Backlog-grooming, sprintplanning |
| `/code-to-prd` | Reverse-engineer een PRD vanuit bestaande code — of genereer een PRD vanuit een brief | Functiedocumentatie, stakeholderafstemming |
| `/product-roadmap` | Bouw en communiceer een geprioriteerde roadmap met redenering | Kwartaalplanning, stakeholderreviews |
| `/pm-sprint-review` | Sprintsnelheid, verzonden versus gepland, retro, volgende sprintprioriteiten | Einde van elke sprint |
| `/experiment-designer` | A/B-testontwerp, hypotheseformulering, steekproefgrootte, succesmetrieken | Groei-experimenten, feature flags |
| `/product-analytics` | Funnelanalyse, cohortretentie, event-schema, metrieken-interpretatie | Wekelijkse datareview, na lancering |
| `/ux-researcher` | Bruikbaarheidstestscripts, interviewsynthese, persona-opbouw | Ontwerpvalidatie |
| `/competitive-teardown` | Volledige concurrentieanalyse: positionering, functies, prijsstelling, SWOT | Kwartaalmatig, voor planningscycli |
| `/product-manager-toolkit` | Prioriteringsframeworks (RICE, ICE, MoSCoW), stakeholderskaarten, beslissingsdocumenten | Dagelijks PM-vakmanschap |

### Agenten

| Agent | Model | Wanneer in te zetten |
|---|---|---|
| `cpo-advisor` | Opus | Strategische productbeslissingen, roadmap-afwegingen, organisatieontwerp |
| `competitive-analyst` | Sonnet | Gedetailleerde concurrentie-intelligentie, functiebenchmarking |

---

## Dagelijkse workflow

### Voorbereiding ochtend-standup (10 minuten)

```
/pm-sprint-review

Quick standup summary for Sprint [N] — Day [X]:

Team: [N engineers, N designers]
Sprint goal: [state it]

Yesterday's updates (pull from Linear/Jira):
- [Ticket] completed by [person]
- [Ticket] in review
- [Ticket] blocked — [reason]

Today's plan:
- [Ticket] — [engineer name]
- [Ticket] — [designer name]

Blockers needing PM attention:
- [Blocker 1 — what do I need to resolve today?]

Summarise as a 2-minute standup briefing I can read aloud or post in Slack.
```

### Backlog-grooming (naar behoefte)

```
/user-story-writer

Groom these rough items from the backlog:

1. "[Rough idea or stakeholder request]"
   Context: [any additional detail you have]

2. "[Rough idea]"
   Context: [...]

For each: write a full user story with AC, edge cases, definition of done, and story point estimate. Flag if any need more discovery before writing.
```

### Stakeholderscommunicatie

```
/product-manager-toolkit

Write a stakeholder update for [audience — exec team / CEO / sales / customer success]:

Sprint [N] outcome: [shipped / missed / partial]
Key deliverable: [what shipped that they care about]
Impact: [what does this enable — customer value or business metric]
What's next: [Sprint N+1 top item]
Any risks or decisions needed from them: [list]

Keep it to a Slack message or short email. No bullet soup.
```

---

## Belangrijkste workflows per scenario

### Nieuw functieverzoek van een klant of stakeholder

```
Stap 1: Is dit reeel?
/product-discovery

Customer request: "[paste the request or feature ask]"
Source: [enterprise customer / 15 separate support tickets / CEO / one power user]

Analyse:
- Is this a symptom or the real job to be done?
- How many customers have this problem?
- What are they doing today as a workaround?
- Does solving this align with our product thesis?
- What would we need to believe for this to be in the top 5 priorities?

Stap 2: Als reeel — schrijf het verhaal
/user-story-writer

Feature brief: [paste what you learned from step 1]
Write the user story ready for sprint planning.

Stap 3: Schat en prioriteer
/product-manager-toolkit

Add this story to my prioritisation matrix.
Current candidates: [list existing backlog items]
RICE scores: [Reach, Impact, Confidence, Effort]
Where does this new story land in priority order?
```

### PRD voor een significante functie

```
/code-to-prd

Write a PRD for: [FEATURE NAME]

Problem: [what problem this solves and for whom]
Evidence: [customer research, support data, analytics showing the gap]
Scope: [what's in and what's explicitly not in this release]
Success metric: [the one metric that proves this feature succeeded]
Timeline: [target sprint or date]
Dependencies: [other teams, APIs, design work needed]

Generate the full PRD: problem statement, goals and non-goals, user stories, success metrics, open questions, out of scope.
```

### Kwartaalroadmapplanning

```
/product-roadmap

Build the product roadmap for [QUARTER/YEAR].

Input themes (from customer research, business goals, technical debt):
Theme 1: [description] — strategic importance: [why this matters now]
Theme 2: [description]
Theme 3: [description]

Constraints:
- Engineering capacity: [N engineer-weeks]
- Design capacity: [N designer-weeks]
- Hard deadlines: [any commitments already made]
- Non-negotiables: [anything that must ship regardless of prioritisation]

Produce: a NOW / NEXT / LATER roadmap with rationale per item, dependencies, and risks.
```

### Analyse na lancering

```
/product-analytics

Analyse the performance of [FEATURE] launched on [DATE].

Metrics available:
- Adoption: [X% of users triggered the feature in first 2 weeks]
- Retention impact: [D14 retention for feature users vs. control: X% vs. Y%]
- Funnel: [X users saw it, Y activated, Z completed the core flow]
- Support tickets: [N tickets related to this feature since launch]
- NPS comments mentioning it: [paste any relevant comments]

Tell me:
1. Is this feature working? (strong signal / weak signal / too early to tell)
2. What does the data suggest we do next? (iterate, expand, retire, or wait)
3. What's the one metric I should track weekly to know if it's improving?
```

---

## 30-dagenplan (PM die een nieuw team of product bijvoegt)

### Week 1 — Context en discovery
- Installeer alle PM-skills via de bovenstaande opdrachten
- Voer `/product-discovery` uit op de top 3 klantpijnpunten die je hebt gehoord
- Praat met 5 klanten — gebruik de interviewgids van `/product-discovery`
- Breng het bestaande product in kaart met `/competitive-teardown` (je eigen product, niet een concurrent) — begrijp wat je hebt

### Week 2 — Backlog en sprintritme
- Voer `/pm-sprint-review` uit op de laatste 3 sprints — begrijp snelheid en terugkerende blokkeringen
- Ga door de top 20 backlog-items met `/user-story-writer` — beoordeel kwaliteit en verfijn de slechtste verhalen
- Woon alle sprintrituelen bij — voer ze nog niet uit, observeer alleen

### Week 3 — Roadmap en stakeholders
- Gebruik `/product-roadmap` om in kaart te brengen wat er bestaat en wat er is toegezegd
- Gebruik `/product-manager-toolkit` om een stakeholderskaart te bouwen — wie heeft invloed op roadmap-beslissingen?
- Ontwerp je eerste stakeholdersupdate met `/product-manager-toolkit`

### Week 4 — Neem de leiding
- Voer je eerste volledige sprintreview uit met `/pm-sprint-review`
- Schrijf je eerste gebruikersverhalen voor de volgende sprint met `/user-story-writer`
- Deel je 30-60-90 dagen product-thesis met de CPO — gebruik `/cpo-advisor` om het te toetsen

---

## Tool-integraties

### Linear (aanbevolen voor sprintbeheer)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Met Linear verbonden kan Claude sprintstatus, ticketdetails en cyclusgeschiedenis lezen — sprintreviews uitvoeren zonder handmatig kopiëren en plakken.

### Notion (voor PRD's en roadmaps)

Verbind de Notion MCP om Claude je PRD-database, roadmapweergave en discovery-notities te laten lezen en bijwerken — documentatie gesynchroniseerd houden met beslissingen.

### Amplitude / Mixpanel

Exporteer eventdata als CSV of plak queryresultaten in `/product-analytics`. Voor realtime-analyse kan de Amplitude API via MCP worden verbonden voor live metriekenquery's tijdens planningssessies.

### Figma

Voor design-PM-samenwerking kan Claude Figma-links lezen en visuele context raadplegen bij het schrijven van acceptatiecriteria. Combineer met `/user-story-writer` om AC te schrijven die verwijst naar specifieke ontwerp-states.

---

## Te volgen metrieken

### Sprintgezondheid

| Metriek | Doel | Waarschuwingssignaal |
|---|---|---|
| Sprintdoel-slagingspercentage | >70% | <50%: plannings- of scopeprobleem |
| Snelheidsvoorspelbaarheid | ±20% van gemiddelde | Grote schommelingen: schattings- of ongepland werkprobleem |
| Ongepland werk | <20% van sprintcapaciteit | >30%: reactief team, niet proactief |
| Story point-nauwkeurigheid | ±1 punt gemiddeld | Consistente overschattingen: veiligheidsbuffering |

### Productgezondheid

| Metriek | Doel (varieert per product) | Waarom het telt |
|---|---|---|
| Functie-adoptie (D14) | >30% van actieve gebruikers | Gebruikt iemand wat je hebt verzonden? |
| Time-to-value | Afnemend | Verbetert onboarding? |
| Supportticket-percentage per functie | Afnemend | Verbetert kwaliteit? |
| NPS-impact van nieuwe functies | Neutraal tot positief | Bouw je dingen die gebruikers leuk vinden? |
| Experimentwinstpercentage | >30% | Zijn je hypotheses goed gekalibreerd? |

---

## Veelgemaakte PM-fouten die Claude Code helpt te vermijden

**Fout 1: Bouwen voordat je valideert**
`/product-discovery` dwingt je het probleem te formuleren en bewijs te verzamelen voordat je een woord van de specificatie schrijft. Geen discovery → geen verhaal.

**Fout 2: Verhalen te groot om in één sprint af te ronden**
`/user-story-writer` bevat een groottecheck en een splitshandleiding. Alles geschat op > 5 punten wordt gesplitst voordat het naar sprintplanning gaat.

**Fout 3: Acceptatiecriteria die niet testbaar zijn**
De AC-kwaliteitscontrole in `/user-story-writer` markeert criteria die te vaag zijn voor een QA-engineer om te testen. Elk AC moet observeerbaar en specifiek zijn.

**Fout 4: Retrospectives zonder actie**
`/pm-sprint-review` legt een maximum van 2 retro-actiepunten per sprint op. Meer dan 2 betekent dat er geen worden uitgevoerd.

**Fout 5: Roadmap zonder redenering**
`/product-roadmap` genereert redenering voor elk item in de roadmap. Als je niet kunt uitleggen waarom iets op de roadmap staat, hoort het er niet op.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [PM-sprint-workflow](../workflows/pm-sprint.md)
- [Product discovery skill](../skills/product/product-discovery.md)
- [User story writer skill](../skills/product/user-story-writer.md)
- [Sprint review skill](../skills/product/pm-sprint-review.md)
- [CPO-adviseur agent](../agents/advisors/cpo-advisor.md)

---
