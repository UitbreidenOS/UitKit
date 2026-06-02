# Growth Marketer Workspace — Projectstructuur

> Voor growth marketers die de volledige acquisition-to-retention-loop uitvoeren — experimentontwerp, beheer van betaalde kanalen, funnel CRO, cohortanalyse en wekelijkse groeirapportage — in één Claude Code-workspace.

## Stack

- **Product analytics:** Mixpanel (event tracking, funnels, cohorts, retention) of Amplitude (behavioral analytics, charts, notebooks)
- **CDP:** Segment (event collection, identity resolution, audience syncing to ad platforms)
- **Paid acquisition:** Google Ads (search, performance max, display) + Meta Ads (Facebook + Instagram, audience-based)
- **Experimentation:** Optimizely (feature flags, web experiments, stats engine) of GrowthBook (open-source A/B, feature flags, Bayesian + frequentist)
- **Marketing automation:** HubSpot (lifecycle stages, email workflows, lead scoring, campaign attribution)
- **Web analytics:** Google Analytics 4 (traffic sources, conversion events, funnel exploration)
- **Landing page design:** Figma (wireframes, hi-fi mockups, handoff specs for dev or no-code)
- **Communication:** Slack (growth channel, experiment alerts, weekly digest)
- **Claude Code skills:** marketing/experiment-tracker, marketing/growth-dashboard, marketing/paid-ads, marketing/page-cro, marketing/onboarding-cro, marketing/referral-program, marketing/pricing-strategy

## Directorystructuur

```
growth-marketer-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Workspace instructions for Claude Code
│   ├── settings.json                              # MCP servers, hooks, permissions
│   └── commands/
│       ├── experiment-design.md                   # /experiment-design — takes hypothesis, outputs full test spec
│       ├── funnel-analysis.md                     # /funnel-analysis — maps drop-off at each stage from Mixpanel data
│       ├── ad-copy-test.md                        # /ad-copy-test — generates ad copy variants for A/B testing
│       ├── cro-audit.md                           # /cro-audit — reviews landing page against CRO best practices
│       ├── cohort-analysis.md                     # /cohort-analysis — analyzes retention by signup cohort
│       ├── growth-report.md                       # /growth-report — weekly north star + channel summary report
│       └── channel-review.md                      # /channel-review — ROI and efficiency review per paid channel
├── experiments/
│   ├── _template/
│   │   ├── hypothesis.md                          # Hypothesis format: If [action] then [outcome] because [reason]
│   │   ├── test-design.md                         # Control vs. variant spec, audience split, success metrics
│   │   └── results.md                             # Stat sig check, lift %, confidence interval, decision
│   ├── 2026-06-checkout-cta-copy/
│   │   ├── hypothesis.md                          # Hypothesis: directional CTA drives higher checkout CVR
│   │   ├── test-design.md                         # 50/50 split, GrowthBook flag: checkout-cta-v2, n=4000
│   │   ├── results.md                             # +8.3% lift, 95% CI, shipped to 100%
│   │   └── segment-breakdown.md                   # Results sliced by device, traffic source, plan type
│   ├── 2026-06-pricing-page-layout/
│   │   ├── hypothesis.md
│   │   ├── test-design.md                         # 3-variant test: current, annual-first, feature-table
│   │   ├── results.md
│   │   └── heatmap-notes.md                       # Hotjar / FullStory observations during test
│   ├── 2026-05-onboarding-email-sequence/
│   │   ├── hypothesis.md
│   │   ├── test-design.md
│   │   ├── results.md
│   │   └── cohort-comparison.md                   # Day-7 and day-30 retention for test vs. control cohorts
│   └── backlog.md                                 # Prioritized experiment queue (ICE-scored)
├── funnels/
│   ├── acquisition-funnel.md                      # Visitor → Trial → Activation → Paid — stage definitions
│   ├── activation-funnel.md                       # Signup → Aha moment — event sequence and benchmarks
│   ├── conversion-benchmarks.md                   # Current CVRs per stage vs. industry benchmarks
│   ├── drop-off-analysis/
│   │   ├── 2026-06-checkout-drop-off.md           # Exit point analysis: where users leave checkout
│   │   ├── 2026-05-onboarding-drop-off.md         # Step-by-step onboarding completion funnel
│   │   └── 2026-04-trial-to-paid-drop-off.md      # Upgrade blocker analysis — price, timing, features
│   └── funnel-maps/
│       ├── top-of-funnel.md                       # Paid + organic → landing page → trial signup
│       ├── mid-funnel.md                          # Trial → activation events → upgrade intent signals
│       └── bottom-of-funnel.md                   # Upgrade triggers, pricing page, checkout flow
├── paid/
│   ├── _briefs/
│   │   ├── brief-template.md                      # Campaign brief: goal, audience, budget, creative specs
│   │   ├── 2026-06-google-search-trial.md         # Brief: drive trial signups via branded + competitor search
│   │   ├── 2026-06-meta-retargeting-q2.md         # Brief: retarget trial users who didn't convert in 7 days
│   │   └── 2026-05-linkedin-icp-awareness.md      # Brief: brand awareness to ICP titles in target industries
│   ├── ad-copy/
│   │   ├── google-search/
│   │   │   ├── branded-variants.md                # RSA headline + description variants for branded terms
│   │   │   ├── competitor-variants.md             # Copy for competitor conquest campaigns
│   │   │   └── generic-variants.md                # Non-branded keyword copy (e.g., "growth analytics tool")
│   │   └── meta/
│   │       ├── awareness-copy.md                  # Top-of-funnel creative copy: hook, body, CTA
│   │       ├── retargeting-copy.md                # Mid-funnel copy: objection handling, social proof
│   │       └── conversion-copy.md                 # Bottom-funnel: offer-led, urgency, direct response
│   └── performance-logs/
│       ├── 2026-06-weekly.md                      # CPC, CTR, CVR, CPA, ROAS per campaign — weekly snapshot
│       ├── 2026-05-weekly.md
│       └── budget-tracker.md                      # Monthly spend vs. budget by channel and campaign
├── landing-pages/
│   ├── _briefs/
│   │   ├── page-brief-template.md                 # Brief: goal, traffic source, audience, hypothesis, CTA
│   │   ├── 2026-06-trial-signup-v3.md             # Brief for redesigned trial landing page
│   │   └── 2026-05-pricing-page-refresh.md        # Brief: annual plan emphasis, feature comparison table
│   ├── cro-notes/
│   │   ├── trial-signup-cro-audit.md              # CRO audit: friction points, trust signals, form fields
│   │   ├── pricing-page-cro-audit.md              # CRO audit: plan clarity, objection handling, CTA placement
│   │   └── homepage-cro-audit.md                  # CRO audit: value prop clarity, above-the-fold analysis
│   └── test-results/
│       ├── trial-page-v2-vs-v3.md                 # A/B result: V3 +12% CVR, shipped
│       ├── pricing-annual-vs-monthly.md            # A/B result: annual-first layout increased ARR mix by 9%
│       └── homepage-headline-test.md              # Multivariate headline test — inconclusive, extended
├── retention/
│   ├── churn-analysis/
│   │   ├── 2026-q2-churn-report.md                # Churn rate, reason codes, segment breakdown
│   │   ├── 2026-q1-churn-report.md
│   │   └── churn-risk-signals.md                  # Behavioral signals correlated with churn (Mixpanel)
│   ├── win-back/
│   │   ├── win-back-sequence.md                   # 3-email win-back: re-engagement offer, testimonial, final CTA
│   │   ├── win-back-segment-rules.md              # HubSpot workflow trigger conditions for win-back enrollment
│   │   └── win-back-results.md                    # Recovery rate by churn reason and time-since-churn
│   └── lifecycle-emails/
│       ├── day-3-activation-nudge.md              # Email for users who haven't hit activation event by day 3
│       ├── day-7-check-in.md                      # Progress email + tutorial link for low-engagement users
│       └── day-30-upgrade-prompt.md               # Upgrade email triggered on usage milestone
├── reports/
│   ├── weekly-growth-dashboard/
│   │   ├── 2026-W22.md                            # North star metric, channel CAC, MRR adds, experiment status
│   │   ├── 2026-W21.md
│   │   └── _template.md                           # Template for weekly growth dashboard
│   ├── channel-roi/
│   │   ├── 2026-q2-channel-roi.md                 # CAC, LTV:CAC, payback period per channel
│   │   └── 2026-q1-channel-roi.md
│   └── north-star-tracking/
│       ├── north-star-definition.md               # Metric definition, why it matters, how it's measured
│       └── north-star-log.md                      # Weekly north star value + variance vs. target
└── notes/
    ├── ice-scoring-rubric.md                      # ICE (Impact / Confidence / Ease) scoring guide for experiments
    ├── growth-model.md                            # Bottom-up growth model: inputs, levers, sensitivities
    └── competitor-intel.md                        # Observed competitor moves, pricing, channel activity
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/experiment-design.md` | Leidt een hypothesereeks in en levert een volledige testspecificatie: control- vs. variantdefinitie, primaire + waarschuwingsmetreken, minimaal detecteerbaar effect, vereiste steekproefgrootte, testduur, GrowthBook- of Optimizely-vlaggenaam en besluitcriteria |
| `.claude/commands/funnel-analysis.md` | Leest drop-offgegevens uit Mixpanel/Amplitude-exports of geplakte funnelschermafbeeldingen, wijst conversieratio's toe op elk stadium, identificeert de hoogste-leverage lek en stelt experimenten voor om dit aan te pakken |
| `.claude/commands/cro-audit.md` | Controleert een landingspagina-URL of Figma-spec tegen CRO-principes: above-the-fold value proposition, CTA-duidelijkheid, formulierfriction, vertrouwenssignalen, paginasnelheidsmarkering en mobiele bruikbaarheid — voert een gescoorde controle uit met geprioriteerde fixes |
| `.claude/commands/growth-report.md` | Genereert een wekelijks groeirapport met betrekking tot north star-metrictend, MRR/ARR-toevoegingen, kanaal-niveau CAC, beste experimentstatus en risico's — opgemaakt voor Slack-digest of leiderschap-synchronisatie |
| `experiments/_template/` | Masterexperimenttemplate-directory — kopieer naar `experiments/<date>-<slug>/` voordat u een test start; zorgt ervoor dat elk experiment consistent is gedocumenteerd met hypothese, ontwerp en resultaten |
| `experiments/backlog.md` | ICE-gescoorde experimentwachtrij; de canonieke prioriteringslijst die wordt geraadpleegd voordat een nieuwe test wordt gestart |
| `retention/churn-analysis/churn-risk-signals.md` | Gedragskenmerken van Mixpanel gecorreleerd met churn binnen 30 dagen — gebruikt om proactieve levenscycluse-e-mails te activeren en risico's voor accounts op CS-niveau te markeren |
| `reports/north-star-tracking/north-star-definition.md` | Enige bron van waarheid voor wat de north star-metriek is, hoe deze wordt berekend in Mixpanel/Amplitude en wat het wekelijkse doel is |

## Snel scaffold

```bash
# Create workspace root
mkdir -p growth-marketer-workspace && cd growth-marketer-workspace

# Claude Code directories
mkdir -p .claude/commands

# Experiments
mkdir -p experiments/_template
mkdir -p experiments/2026-06-checkout-cta-copy
mkdir -p experiments/2026-06-pricing-page-layout

# Funnels
mkdir -p funnels/drop-off-analysis
mkdir -p funnels/funnel-maps

# Paid acquisition
mkdir -p paid/_briefs
mkdir -p paid/ad-copy/google-search
mkdir -p paid/ad-copy/meta
mkdir -p paid/performance-logs

# Landing pages
mkdir -p landing-pages/_briefs
mkdir -p landing-pages/cro-notes
mkdir -p landing-pages/test-results

# Retention
mkdir -p retention/churn-analysis
mkdir -p retention/win-back
mkdir -p retention/lifecycle-emails

# Reports
mkdir -p reports/weekly-growth-dashboard
mkdir -p reports/channel-roi
mkdir -p reports/north-star-tracking

# Notes
mkdir -p notes

# Initialize key files
touch .claude/CLAUDE.md
touch .claude/settings.json
touch experiments/_template/hypothesis.md
touch experiments/_template/test-design.md
touch experiments/_template/results.md
touch experiments/backlog.md
touch funnels/acquisition-funnel.md
touch funnels/conversion-benchmarks.md
touch paid/_briefs/brief-template.md
touch paid/performance-logs/budget-tracker.md
touch landing-pages/_briefs/page-brief-template.md
touch reports/weekly-growth-dashboard/_template.md
touch reports/north-star-tracking/north-star-definition.md
touch reports/north-star-tracking/north-star-log.md
touch notes/ice-scoring-rubric.md
touch notes/growth-model.md

# Install all growth marketing skills
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy

# Install slash commands
npx claudient add command experiment-design
npx claudient add command funnel-analysis
npx claudient add command ad-copy-test
npx claudient add command cro-audit
npx claudient add command cohort-analysis
npx claudient add command growth-report
npx claudient add command channel-review

echo "Growth marketer workspace ready."
```

## CLAUDE.md sjabloon

```markdown
# Growth Marketer Workspace — Claude Instructies

## Wat dit is

Deze workspace beheert de volledige groeisluis: experimentontwerp en tracking,
betaalde acquisitie (Google Ads + Meta), landing page CRO, funnelanalyse,
cohort- en retentieanalyse, en wekelijkse groeirapportage. De north star-
metriek en alle experimentbeslissingen zijn hier eigendom.

## Stack

- Product analytics: Mixpanel — primaire bron voor funnels, cohorts, retention,
  event-level user behavior
- CDP: Segment — event routing, identity resolution, audience syncing to ad platforms
- Paid channels: Google Ads (search + PMax) en Meta Ads (Facebook + Instagram)
- Experimentation: GrowthBook — feature flags, A/B test assignment, Bayesian stats engine
- Marketing automation: HubSpot — lifecycle stages, email workflows, lead scoring
- Web analytics: Google Analytics 4 — traffic attribution, macro conversion events
- Design: Figma — landing page wireframes en hi-fi specs
- Communication: Slack #growth channel voor experiment alerts en wekelijkse digest

## Directoryconventies

- experiments/<date>-<slug>/ — één directory per experiment; altijd _template/ kopiëren
- funnels/ — funnelkaarten en drop-off analyse leven hier; nooit overschrijven, gedateerde bestanden toevoegen
- paid/_briefs/ — campagnebrief voordat een betaalde campagne live gaat
- paid/performance-logs/ — wekelijkse snapshots van CPC, CTR, CVR, CPA, ROAS per campagne
- landing-pages/cro-notes/ — één bestand per pagina; bevindingen toevoegen, nooit overschrijven
- retention/churn-analysis/ — driemaandelijkse churn-rapporten + evergreen risicokaart
- reports/weekly-growth-dashboard/ — één bestand per week, benoemd YYYY-WWW

## Veelvoorkomende taken — exacte commando's

**Ontwerp een nieuw experiment:**
/experiment-design hypothesis="If [action] then [metric] will [direction] because [reason]" audience="[segment]" metric="[primary metric in Mixpanel]"

**Analyseer een funneldrop-off:**
/funnel-analysis funnel=funnels/acquisition-funnel.md data="[pasted Mixpanel funnel output or CSV path]"

**Genereer adcopy-varianten:**
/ad-copy-test channel="[google-search|meta]" goal="[trial|awareness|retargeting]" offer="[offer or value prop]" variants=5

**Controleer een landingspagina:**
/cro-audit url="[landing page URL]" goal="[trial signup|demo request]" traffic-source="[paid search|organic|email]"

**Voer cohortanalyse uit:**
/cohort-analysis cohort-def="[signup date range or segment]" metric="[day-7 retention|trial-to-paid CVR]" data="[Mixpanel/Amplitude export path]"

**Genereer wekelijks groeirapport:**
/growth-report week="[YYYY-WXX]" north-star="[current value]" target="[weekly target]"

**Controleer een betaald kanaal:**
/channel-review channel="[google|meta|linkedin]" period="[2026-06]" data=paid/performance-logs/[file].md

## Experimentconventies

- Elk experiment begint met een hypothese in experiments/_template/hypothesis.md-indeling
- ICE score elk nieuw experimentidee in experiments/backlog.md voordat u planning uitvoert
- Minimale steekproefgrootte moet worden berekend voordat u start — geen buikgevoel-steekproefgroottes
- Primaire metriek moet een Mixpanel-event zijn; waarschuwingsmetreken moeten minstens één bevatten
  downstream metriek (bijv. dag-30 retention als primair trial CVR is)
- Statistische significantiedrempel: 95% vertrouwen; minimale looptijd: 14 dagen
- Resultaten gedocumenteerd in results.md binnen 48 uur na experimentconclusie

## Betaalde kanaalgconventies

- Schrijf altijd een campagnebrief in paid/_briefs/ voordat een campagne live gaat
- Adcopy-varianten moeten worden gedocumenteerd in paid/ad-copy/ voordat ze naar platform worden geüpload
- Performance logs wekelijks bijgewerkt elke maandag — vorige week CPC/CTR/CVR/CPA/ROAS
- Budgettracker bijgewerkt wanneer uitgavensnelheid meer dan 15% afwijkt van plan

## CRO-conventies

- Geen landingspaginaverbetering wordt verzonden zonder een brief in landing-pages/_briefs/
- CRO-controle vereist voordat een grote paginareontwerp — bestand in landing-pages/cro-notes/
- Alle A/B-resultaten gedocumenteerd in landing-pages/test-results/ — vertrouwensniveau en
  steekproefgrootte opnemen, niet alleen liftpercentage

## Rapportageconventies

- Wekelijks groeirapport gepubliceerd naar Slack #growth elke maandag vóór 10:00 uur
- North star-metriek wekelijks geregistreerd in reports/north-star-tracking/north-star-log.md
- Kanaal ROI-rapport driemaandelijks geproduceerd — inclusief CAC, LTV:CAC-verhouding, terugverdientijd
```

## MCP-servers

```json
{
  "mcpServers": {
    "mixpanel": {
      "command": "npx",
      "args": ["-y", "@mixpanel/mcp-server"],
      "env": {
        "MIXPANEL_SERVICE_ACCOUNT_USERNAME": "${MIXPANEL_SERVICE_ACCOUNT_USERNAME}",
        "MIXPANEL_SERVICE_ACCOUNT_SECRET": "${MIXPANEL_SERVICE_ACCOUNT_SECRET}",
        "MIXPANEL_PROJECT_ID": "${MIXPANEL_PROJECT_ID}"
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
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/growth-marketer-workspace"
      ]
    },
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */experiments/*/results.md ]]; then echo \"[hook] Experiment results saved: $FILE — update experiments/backlog.md with outcome and ICE re-score if applicable\"; fi'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == */experiments/*/test-design.md && ! -f \"$(dirname $FILE)/hypothesis.md\" ]]; then echo \"[hook] WARNING: No hypothesis.md found for this experiment — create hypothesis.md before test-design.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && OPEN=$(find experiments/ -name \"test-design.md\" -not -newer experiments/ 2>/dev/null | xargs -I{} dirname {} | xargs -I{} sh -c \"[ ! -f {}/results.md ] && echo {}\" 2>/dev/null | wc -l | tr -d \" \"); [ \"$OPEN\" -gt 0 ] && echo \"[reminder] $OPEN experiment(s) have a test-design.md but no results.md — check if any tests have concluded\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
```

## Gerelateerd

- [Guide: Claude for Growth Marketers](../guides/for-growth-marketer.md)
- [Workflow: Experiment Design to Decision](../workflows/experiment-lifecycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
