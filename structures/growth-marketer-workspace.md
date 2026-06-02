# Growth Marketer Workspace — Project Structure

> For growth marketers running the full acquisition-to-retention loop — experiment design, paid channel management, funnel CRO, cohort analysis, and weekly growth reporting — in a single Claude Code workspace.

## Stack

- **Product analytics:** Mixpanel (event tracking, funnels, cohorts, retention) or Amplitude (behavioral analytics, charts, notebooks)
- **CDP:** Segment (event collection, identity resolution, audience syncing to ad platforms)
- **Paid acquisition:** Google Ads (search, performance max, display) + Meta Ads (Facebook + Instagram, audience-based)
- **Experimentation:** Optimizely (feature flags, web experiments, stats engine) or GrowthBook (open-source A/B, feature flags, Bayesian + frequentist)
- **Marketing automation:** HubSpot (lifecycle stages, email workflows, lead scoring, campaign attribution)
- **Web analytics:** Google Analytics 4 (traffic sources, conversion events, funnel exploration)
- **Landing page design:** Figma (wireframes, hi-fi mockups, handoff specs for dev or no-code)
- **Communication:** Slack (growth channel, experiment alerts, weekly digest)
- **Claude Code skills:** marketing/experiment-tracker, marketing/growth-dashboard, marketing/paid-ads, marketing/page-cro, marketing/onboarding-cro, marketing/referral-program, marketing/pricing-strategy

## Directory tree

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

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/experiment-design.md` | Takes a hypothesis string and produces a full test spec: control vs. variant definition, primary + guardrail metrics, minimum detectable effect, required sample size, test duration, GrowthBook or Optimizely flag name, and decision criteria |
| `.claude/commands/funnel-analysis.md` | Reads drop-off data from Mixpanel/Amplitude exports or pasted funnel screenshots, maps conversion rates at each stage, identifies the highest-leverage leak, and proposes experiments to address it |
| `.claude/commands/cro-audit.md` | Reviews a landing page URL or Figma spec against CRO principles: above-the-fold value prop, CTA clarity, form friction, trust signals, page speed flags, and mobile usability — outputs a scored audit with prioritized fixes |
| `.claude/commands/growth-report.md` | Generates a weekly growth report covering north star metric trend, MRR/ARR adds, channel-level CAC, top experiment status, and risks — formatted for Slack digest or leadership sync |
| `experiments/_template/` | Master experiment template directory — copy to `experiments/<date>-<slug>/` before starting any test; ensures every experiment has hypothesis, design, and results documented consistently |
| `experiments/backlog.md` | ICE-scored experiment queue; the canonical prioritization list consulted before starting any new test |
| `retention/churn-analysis/churn-risk-signals.md` | Behavioral signals from Mixpanel correlated with churn within 30 days — used to trigger proactive lifecycle emails and flag at-risk accounts to CS |
| `reports/north-star-tracking/north-star-definition.md` | Single source of truth for what the north star metric is, how it is calculated in Mixpanel/Amplitude, and what the weekly target is |

## Quick scaffold

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

## CLAUDE.md template

```markdown
# Growth Marketer Workspace — Claude Instructions

## What this is

This workspace manages the full growth loop: experiment design and tracking,
paid acquisition (Google Ads + Meta), landing page CRO, funnel analysis,
cohort and retention analysis, and weekly growth reporting. The north star
metric and all experiment decisions are owned here.

## Stack

- Product analytics: Mixpanel — primary source for funnels, cohorts, retention,
  event-level user behavior
- CDP: Segment — event routing, identity resolution, audience syncing to ad platforms
- Paid channels: Google Ads (search + PMax) and Meta Ads (Facebook + Instagram)
- Experimentation: GrowthBook — feature flags, A/B test assignment, Bayesian stats engine
- Marketing automation: HubSpot — lifecycle stages, email workflows, lead scoring
- Web analytics: Google Analytics 4 — traffic attribution, macro conversion events
- Design: Figma — landing page wireframes and hi-fi specs
- Communication: Slack #growth channel for experiment alerts and weekly digest

## Directory conventions

- experiments/<date>-<slug>/ — one directory per experiment; always copy _template/
- funnels/ — funnel maps and drop-off analysis live here; never overwrite, add dated files
- paid/_briefs/ — campaign brief before launching any paid campaign
- paid/performance-logs/ — weekly snapshots of CPC, CTR, CVR, CPA, ROAS per campaign
- landing-pages/cro-notes/ — one file per page; append findings, never overwrite
- retention/churn-analysis/ — quarterly churn reports + evergreen risk-signal doc
- reports/weekly-growth-dashboard/ — one file per week, named YYYY-WWW

## Common tasks — exact commands

**Design a new experiment:**
/experiment-design hypothesis="If [action] then [metric] will [direction] because [reason]" audience="[segment]" metric="[primary metric in Mixpanel]"

**Analyze a funnel drop-off:**
/funnel-analysis funnel=funnels/acquisition-funnel.md data="[pasted Mixpanel funnel output or CSV path]"

**Generate ad copy variants:**
/ad-copy-test channel="[google-search|meta]" goal="[trial|awareness|retargeting]" offer="[offer or value prop]" variants=5

**Audit a landing page:**
/cro-audit url="[landing page URL]" goal="[trial signup|demo request]" traffic-source="[paid search|organic|email]"

**Run a cohort analysis:**
/cohort-analysis cohort-def="[signup date range or segment]" metric="[day-7 retention|trial-to-paid CVR]" data="[Mixpanel/Amplitude export path]"

**Generate weekly growth report:**
/growth-report week="[YYYY-WXX]" north-star="[current value]" target="[weekly target]"

**Review a paid channel:**
/channel-review channel="[google|meta|linkedin]" period="[2026-06]" data=paid/performance-logs/[file].md

## Experiment conventions

- Every experiment starts with a hypothesis in experiments/_template/hypothesis.md format
- ICE score every new experiment idea in experiments/backlog.md before scheduling
- Minimum sample size must be calculated before launch — no gut-feel sample sizes
- Primary metric must be a Mixpanel event; guardrail metrics must include at least one
  downstream metric (e.g., day-30 retention if primary is trial CVR)
- Statistical significance threshold: 95% confidence; minimum run time: 14 days
- Results documented in results.md within 48 hours of experiment conclusion

## Paid channel conventions

- Always write a campaign brief in paid/_briefs/ before any campaign goes live
- Ad copy variants must be documented in paid/ad-copy/ before upload to platform
- Performance logs updated weekly every Monday — previous week CPC/CTR/CVR/CPA/ROAS
- Budget tracker updated whenever spend pacing deviates more than 15% from plan

## CRO conventions

- No landing page change ships without a brief in landing-pages/_briefs/
- CRO audit required before any major page redesign — file it in landing-pages/cro-notes/
- All A/B results documented in landing-pages/test-results/ — include confidence level and
  sample size, not just lift percentage

## Reporting conventions

- Weekly growth report published to Slack #growth every Monday by 10am
- North star metric logged to reports/north-star-tracking/north-star-log.md weekly
- Channel ROI report produced quarterly — includes CAC, LTV:CAC ratio, payback period
```

## MCP servers

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

## Recommended hooks

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

## Skills to install

```bash
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
```

## Related

- [Guide: Claude for Growth Marketers](../guides/for-growth-marketer.md)
- [Workflow: Experiment Design to Decision](../workflows/experiment-lifecycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
