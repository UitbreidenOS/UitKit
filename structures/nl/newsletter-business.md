# Newsletter Business — Projectstructuur

> Voor een creator of mediabedrijf dat een nieuwsbrief uitgeeft — beheer van issue-schrijven, redactionele planning, sponsorshipdeals, lijstgroei en prestatie-analyse in één Claude Code-werkruimte.

## Stack

- **ESP + Publishing:** Beehiiv (voorkeur voor monetisatie), Substack (creator-native) of ConvertKit (automatisering-eerst)
- **Sociale distributie:** Typefully (Twitter/X thread scheduling, analytics) of Hypefury (auto-retweet, evergreen queues)
- **Redactionele planning:** Notion (content calendar database, idea backlog, pipeline views)
- **Visuals:** Canva (issue header images, sponsor banners, social cards — 1200x630px en 1080x1080px)
- **Sponsorship billing:** Sponsy (boeking, facturering, ad-copy workflow) of Stripe (handmatige facturering via Stripe Invoices)
- **Analytics:** Google Analytics 4 (web/archive traffic), Beehiiv/Substack native analytics (open rate, CTR, subscriber growth)
- **Communicatie:** Slack (redactionele alerts, sponsor comms, growth experiments channel)
- **Claude Code skills:** productivity/newsletter-writer, productivity/stakeholder-comms, data-ml/stakeholder-report, productivity/vendor-evaluator

## Directoryboom

```
newsletter-business/
├── .claude/
│   ├── CLAUDE.md                              # Werkruimte-instructies voor Claude Code
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── write-issue.md                     # /write-issue — draft a full issue from topic + outline
│       ├── edit-issue.md                      # /edit-issue — proofread, tighten, apply style guide
│       ├── sponsorship-brief.md               # /sponsorship-brief — generate ad copy from sponsor intake
│       ├── growth-experiment.md               # /growth-experiment — design A/B test for acquisition channel
│       ├── performance-report.md              # /performance-report — pull weekly open/CTR/growth metrics
│       ├── social-promo.md                    # /social-promo — generate Twitter/X + LinkedIn promo for issue
│       └── list-health-check.md               # /list-health-check — flag churn signals, re-engagement triggers
├── issues/
│   ├── _template/
│   │   ├── draft.md                           # Blank issue draft (copy before writing each issue)
│   │   └── performance-metrics.md             # Blank metrics sheet (fill at 7/30/60 days post-send)
│   ├── 2026-06-02-issue-001/
│   │   ├── draft.md                           # Working draft — in progress
│   │   ├── final.md                           # Locked copy sent to ESP
│   │   └── performance-metrics.md             # Open rate, CTR, replies, unsubscribes — filled post-send
│   ├── 2026-05-26-issue-000/
│   │   ├── draft.md
│   │   ├── final.md
│   │   └── performance-metrics.md             # Historical metrics for benchmarking
│   └── 2026-05-19-issue-999/
│       ├── draft.md
│       ├── final.md
│       └── performance-metrics.md
├── editorial/
│   ├── content-calendar.md                    # Monthly issue plan: date, topic, sponsor slot, status
│   ├── idea-backlog.md                        # Running list of story ideas with source and priority
│   ├── topic-clusters.md                      # Recurring themes and how issues map to them
│   └── style-guide.md                         # Voice, tone, prohibited phrases, formatting rules
├── sponsorships/
│   ├── media-kit.md                           # Audience stats, rate card, ad format specs — send to sponsors
│   ├── sponsor-tracker.md                     # Pipeline: prospect, negotiating, confirmed, invoiced, paid
│   ├── ad-copy-templates.md                   # Reusable ad copy structures (primary, secondary, classified)
│   └── invoice-log.md                         # Issued invoices: sponsor, amount, issue date, paid date
├── growth/
│   ├── referral-program.md                    # Beehiiv/SparkLoop referral rules, tiers, reward fulfilment
│   ├── acquisition-channels.md                # Channel breakdown: organic, cross-promos, paid, SEO archive
│   └── experiment-log.md                      # A/B tests: hypothesis, variant, result, decision
├── templates/
│   ├── issue-format.md                        # Standard issue skeleton (hook, body sections, sponsor slot, CTA)
│   ├── welcome-email.md                       # Automated welcome sequence — issues 1 and 2
│   ├── re-engagement.md                       # Win-back email for 90-day inactives
│   └── social-promo.md                        # Twitter/X thread template + LinkedIn post template
└── analytics/
    ├── weekly-dashboard.md                    # Weekly snapshot: subscribers, open rate, CTR, revenue
    └── cohort-benchmarks.md                   # Subscriber cohort retention at 30/60/90/180 days
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `issues/<date-slug>/draft.md` | Werkend exemplaar voor elke issue — hier geschreven, hier bewerkt, vervolgens vergrendeld naar final.md vóór planning in ESP |
| `issues/<date-slug>/final.md` | Onveranderbare kopie na verzending — nooit bewerkt na verzenden; gebruikt voor archivering en hergebruik |
| `issues/<date-slug>/performance-metrics.md` | Open rate, CTR, top links, unsubscribes, replies — ingevuld op 7, 30 en 60 dagen na verzending |
| `editorial/content-calendar.md` | Enige bron van waarheid voor aankomende issues: publicatiedatum, onderwerp, sponsorslot bevestigd of open, draft status |
| `editorial/style-guide.md` | Stem- en opmaakregels afgedwongen door Claude bij elke bewerking — lengtelimieten voor zinnen, verboden vulwoorden, sectievolgorde |
| `sponsorships/sponsor-tracker.md` | Volledige sponsorpijplijn van prospect tot betaald; elke rij is een deal met issue slot, tarief, kopie deadline en betalingsstatus |
| `sponsorships/media-kit.md` | Publieksgrootte, open rate, demografie, ad format specs en prijzen — het document verzonden naar inkomende en uitgaande sponsorprospectussen |
| `analytics/weekly-dashboard.md` | Rollende wekelijkse tabel met sleutelwaarden — gebruikt als context wanneer Claude prestatierapporten of groeiaanbevelingen schrijft |

## Snelle scaffolding

```bash
# Create workspace root
mkdir -p newsletter-business && cd newsletter-business

# Claude Code directories
mkdir -p .claude/commands

# Issue directories — template + two recent issues
mkdir -p issues/_template
mkdir -p issues/2026-06-02-issue-001
mkdir -p issues/2026-05-26-issue-000

# Editorial
mkdir -p editorial

# Sponsorships
mkdir -p sponsorships

# Growth
mkdir -p growth

# Templates
mkdir -p templates

# Analytics
mkdir -p analytics

# Seed template files
touch issues/_template/draft.md
touch issues/_template/performance-metrics.md

# Seed editorial files
touch editorial/content-calendar.md
touch editorial/idea-backlog.md
touch editorial/topic-clusters.md
touch editorial/style-guide.md

# Seed sponsorship files
touch sponsorships/media-kit.md
touch sponsorships/sponsor-tracker.md
touch sponsorships/ad-copy-templates.md
touch sponsorships/invoice-log.md

# Seed growth files
touch growth/referral-program.md
touch growth/acquisition-channels.md
touch growth/experiment-log.md

# Seed template files
touch templates/issue-format.md
touch templates/welcome-email.md
touch templates/re-engagement.md
touch templates/social-promo.md

# Seed analytics files
touch analytics/weekly-dashboard.md
touch analytics/cohort-benchmarks.md

# Initialize Claude Code config
touch .claude/CLAUDE.md
touch .claude/settings.json

# Install skills
npx claudient add skill productivity/newsletter-writer
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper

# Install slash commands
npx claudient add command write-issue
npx claudient add command edit-issue
npx claudient add command sponsorship-brief
npx claudient add command growth-experiment
npx claudient add command performance-report
npx claudient add command social-promo
npx claudient add command list-health-check

echo "Newsletter business workspace ready."
```

## CLAUDE.md template

```markdown
# Newsletter Business — Claude-instructies

## Wat dit is

Deze werkruimte beheert een nieuwsbriefpublicatie end-to-end: issue-schrijven en bewerken,
redactionele planning, sponsorverkoop en vervulling, lijstgroei-experimenten en
prestatie-analyse. De nieuwsbrief wordt gepubliceerd op een vast interval (wekelijks of eens per twee weken).
Alle inhoud is geschreven voor een specifiek nichepubliek — zie editorial/style-guide.md.

## Stack

- ESP + Publishing: Beehiiv (primair) — issues worden hier opgesteld en gepland in Beehiiv
- Sociale distributie: Typefully — Twitter/X threads en LinkedIn posts gepland na verzending
- Redactionele planning: Notion (canonieke redactionele kalender, gespiegeld naar editorial/content-calendar.md)
- Visuals: Canva — header images at 1200x630px, sponsor banners at 600x200px
- Sponsorship billing: Sponsy (boeking en facturering) + Stripe (betalingsverwerking)
- Analytics: Beehiiv native analytics + Google Analytics 4 (archive page traffic)
- Communicatie: Slack #newsletter-ops for send alerts and sponsor confirmations

## Directory-conventies

- issues/<YYYY-MM-DD-issue-NNN>/ — één directory per issue; altijd date-slug naamgeving gebruiken
- issues/<slug>/draft.md — actieve werkende kopie; bewerkt tot verzenddag
- issues/<slug>/final.md — vergrendelde kopie; plak in exact wat naar ESP is verzonden
- issues/<slug>/performance-metrics.md — invullen op 7, 30 en 60 dagen na verzending
- editorial/ — planningsdocumenten; content-calendar.md is de bron van waarheid voor schema
- sponsorships/ — alle sponsor-gerelateerde bestanden; sponsor-tracker.md is de pijplijnbron van waarheid
- growth/ — experiment log en channel tracking; één rij per experiment in experiment-log.md
- analytics/ — geaggregeerde dashboards; weekly-dashboard.md elke maandag bijgewerkt

## Issue schrijfworkflow

1. Controleer editorial/content-calendar.md voor het volgende geplande issue-onderwerp
2. Maak issues/<YYYY-MM-DD-issue-NNN>/ directory; kopieer issues/_template/draft.md erin
3. Voer /write-issue topic="[topic]" audience="[reader persona]" sponsor="[sponsor name or none]" uit
4. Controleer draft.md; voer /edit-issue draft=issues/<slug>/draft.md uit om strakker te maken en style-check
5. Controleer sponsorships/sponsor-tracker.md — als een sponsor is bevestigd voor dit slot, voer uit
   /sponsorship-brief sponsor="[name]" product="[product]" cta="[URL]" words=75
6. Plak de uiteindelijke ad copy in draft.md in het aangewezen sponsorslot
7. Controleer de uiteindelijke kopie; kopieer naar issues/<slug>/final.md; plan in Beehiiv
8. Update editorial/content-calendar.md status naar "scheduled"
9. Na verzending: voer /social-promo source=issues/<slug>/final.md uit; plan in Typefully
10. Op 7 dagen: vul issues/<slug>/performance-metrics.md in vanuit Beehiiv analytics dashboard
11. Op 30 dagen: update analytics/weekly-dashboard.md met cohort retention data

## Sponsorshipcadence

- Sponsorpijplijn leeft in sponsorships/sponsor-tracker.md — update na elk sponsorcontactpunt
- Ad copy deadline is 5 werkdagen vóór issue verzendatum — zet dit af bij sponsors
- Alle nieuwe ad copy drafts gaan door /sponsorship-brief vóór verzending naar sponsor voor goedkeuring
- Zodra sponsor kopie goedkeurt, markeer "copy approved" in sponsor-tracker.md
- Factuuur via Sponsy onmiddellijk na issue verzending; log in sponsorships/invoice-log.md
- Volg onbetaalde facturen op op 14 dagen; escaleer op 30 dagen

## Lijstgezondheidscontrole

- Voer /list-health-check wekelijks uit — het leest analytics/weekly-dashboard.md en markeert:
    - Open rate drop >3pp week-over-week (deliverability of content signal)
    - Unsubscribe rate >0.3% op elke enkele issue (content/audience fit signal)
    - Net subscriber growth onder wekelijks doel (acquisition signal)
- Als 90-day inactief cohort meer dan 15% van de lijst overschrijdt: trigger re-engagement sequence
  (gebruik templates/re-engagement.md als basis; voer /edit-issue uit om aan te passen)
- Segmentgegevens bevinden zich in Beehiiv — kruisverwijzing met analytics/cohort-benchmarks.md

## Veelgestelde taken — exacte commando's

**Schrijf een nieuw issue draft:**
/write-issue topic="[topic]" audience="[persona]" sponsor="[name or none]" length=800

**Bewerk en style-check een draft:**
/edit-issue draft=issues/[slug]/draft.md style=editorial/style-guide.md

**Genereer sponsor ad copy:**
/sponsorship-brief sponsor="[company]" product="[product description]" cta="[URL]" words=75

**Genereer sociale promotieposten:**
/social-promo source=issues/[slug]/final.md channels="twitter,linkedin"

**Wekelijks prestatiesrapport:**
/performance-report dashboard=analytics/weekly-dashboard.md period=7d

**Ontwerp een groeisexperiment:**
/growth-experiment channel="[channel]" hypothesis="[hypothesis]" log=growth/experiment-log.md

**Lijstgezondheidscontrole:**
/list-health-check dashboard=analytics/weekly-dashboard.md benchmarks=analytics/cohort-benchmarks.md

## Stijlconventies (uit editorial/style-guide.md)

- Onderwerpregel: max 9 woorden, geen clickbait, onderwerp vooraan
- Eerste zin: max 20 woorden, verklaar onmiddellijk het punt
- Alinea's: max 4 zinnen; gebruik nooit vulling openers ("In today's issue...")
- Sponsorslots: duidelijk begrensd, eerlijke disclosure ("This issue is sponsored by...")
- CTA's: één primaire CTA per issue; plaats na de hoofdtekst, vóór afscheid
- Toon: direct, informed, conversational — geen corporate hedging, geen uitroeptekens
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/newsletter-business"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

## Aanbevolen hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */issues/*/draft.md ]]; then echo \"[hook] Draft saved — run /edit-issue to apply style guide before finalising\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == */issues/*/final.md ]]; then echo \"[hook] Writing to final.md — confirm this is the exact copy sent to Beehiiv/Substack before locking\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" 2>/dev/null || exit 0; UNFILLED=$(find issues/ -name \"performance-metrics.md\" -empty 2>/dev/null | grep -v _template | wc -l | tr -d \" \"); [ \"$UNFILLED\" -gt 0 ] && echo \"[reminder] $UNFILLED issue(s) have empty performance-metrics.md — fill from Beehiiv analytics\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
npx claudient add skill productivity/newsletter-writer
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/founder-weekly-review
```

## Gerelateerd

- [Guide: Claude for Content Creators](../guides/for-content-creator.md)
- [Workflow: Issue Production end-to-end](../workflows/newsletter-issue-production.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
