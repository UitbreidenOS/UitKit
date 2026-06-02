# Newsletter Business — Project Structure

> For a creator or media company running a newsletter — managing issue writing, editorial planning, sponsorship deals, list growth, and performance analysis in a single Claude Code workspace.

## Stack

- **ESP + Publishing:** Beehiiv (preferred for monetisation), Substack (creator-native), or ConvertKit (automation-first)
- **Social distribution:** Typefully (Twitter/X thread scheduling, analytics) or Hypefury (auto-retweet, evergreen queues)
- **Editorial planning:** Notion (content calendar database, idea backlog, pipeline views)
- **Visuals:** Canva (issue header images, sponsor banners, social cards — 1200x630px and 1080x1080px)
- **Sponsorship billing:** Sponsy (booking, invoicing, ad-copy workflow) or Stripe (manual invoicing via Stripe Invoices)
- **Analytics:** Google Analytics 4 (web/archive traffic), Beehiiv/Substack native analytics (open rate, CTR, subscriber growth)
- **Communication:** Slack (editorial alerts, sponsor comms, growth experiments channel)
- **Claude Code skills:** productivity/newsletter-writer, productivity/stakeholder-comms, data-ml/stakeholder-report, productivity/vendor-evaluator

## Directory tree

```
newsletter-business/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions for Claude Code
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

## Key files explained

| Path | Purpose |
|---|---|
| `issues/<date-slug>/draft.md` | Working copy for each issue — written here, edited here, then locked to final.md before scheduling in ESP |
| `issues/<date-slug>/final.md` | Immutable post-send copy — never edited after sending; used for archival and repurposing |
| `issues/<date-slug>/performance-metrics.md` | Open rate, CTR, top links, unsubscribes, replies — filled at 7, 30, and 60 days post-send |
| `editorial/content-calendar.md` | Single source of truth for upcoming issues: publish date, topic, sponsor slot confirmed or open, draft status |
| `editorial/style-guide.md` | Voice and formatting rules enforced by Claude on every edit — sentence length limits, prohibited filler phrases, section ordering |
| `sponsorships/sponsor-tracker.md` | Full sponsorship pipeline from prospect to paid; each row is a deal with issue slot, rate, copy deadline, and payment status |
| `sponsorships/media-kit.md` | Audience size, open rate, demographics, ad format specs, and pricing — the document sent to inbound and outbound sponsor prospects |
| `analytics/weekly-dashboard.md` | Rolling weekly table of key metrics — used as context when Claude writes performance reports or growth recommendations |

## Quick scaffold

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
# Newsletter Business — Claude Instructions

## What this is

This workspace manages a newsletter publication end-to-end: issue writing and editing,
editorial scheduling, sponsorship sales and fulfilment, list growth experiments, and
performance analysis. The newsletter publishes on a fixed cadence (weekly or biweekly).
All content is written for a specific niche audience — see editorial/style-guide.md.

## Stack

- ESP + Publishing: Beehiiv (primary) — issues are drafted here and scheduled in Beehiiv
- Social distribution: Typefully — Twitter/X threads and LinkedIn posts scheduled post-send
- Editorial planning: Notion (canonical editorial calendar, mirrored to editorial/content-calendar.md)
- Visuals: Canva — header images at 1200x630px, sponsor banners at 600x200px
- Sponsorship billing: Sponsy (booking and invoicing) + Stripe (payment processing)
- Analytics: Beehiiv native analytics + Google Analytics 4 (archive page traffic)
- Communication: Slack #newsletter-ops for send alerts and sponsor confirmations

## Directory conventions

- issues/<YYYY-MM-DD-issue-NNN>/ — one directory per issue; always use date-slug naming
- issues/<slug>/draft.md — active working copy; edited until send day
- issues/<slug>/final.md — locked copy; paste in exactly what was sent to ESP
- issues/<slug>/performance-metrics.md — fill at 7, 30, and 60 days after send
- editorial/ — planning documents; content-calendar.md is the source of truth for schedule
- sponsorships/ — all sponsor-related files; sponsor-tracker.md is the pipeline source of truth
- growth/ — experiment log and channel tracking; one row per experiment in experiment-log.md
- analytics/ — aggregate dashboards; weekly-dashboard.md updated every Monday

## Issue writing workflow

1. Check editorial/content-calendar.md for the next scheduled issue topic
2. Create issues/<YYYY-MM-DD-issue-NNN>/ directory; copy issues/_template/draft.md into it
3. Run /write-issue topic="[topic]" audience="[reader persona]" sponsor="[sponsor name or none]"
4. Review draft.md; run /edit-issue draft=issues/<slug>/draft.md to tighten and style-check
5. Check sponsorships/sponsor-tracker.md — if a sponsor is confirmed for this slot, run
   /sponsorship-brief sponsor="[name]" product="[product]" cta="[URL]" words=75
6. Paste final ad copy into draft.md in the designated sponsor slot
7. Review final copy; copy to issues/<slug>/final.md; schedule in Beehiiv
8. Update editorial/content-calendar.md status to "scheduled"
9. After send: run /social-promo source=issues/<slug>/final.md; schedule in Typefully
10. At 7 days: fill issues/<slug>/performance-metrics.md from Beehiiv analytics dashboard
11. At 30 days: update analytics/weekly-dashboard.md with cohort retention data

## Sponsorship cadence

- Sponsor pipeline lives in sponsorships/sponsor-tracker.md — update after every sponsor touchpoint
- Ad copy deadline is 5 business days before issue send date — enforce this with sponsors
- All new ad copy drafts go through /sponsorship-brief before sending to sponsor for approval
- Once sponsor approves copy, mark "copy approved" in sponsor-tracker.md
- Invoice via Sponsy immediately after issue sends; log in sponsorships/invoice-log.md
- Follow up on unpaid invoices at 14 days; escalate at 30 days

## List health monitoring

- Run /list-health-check weekly — it reads analytics/weekly-dashboard.md and flags:
    - Open rate drop >3pp week-over-week (deliverability or content signal)
    - Unsubscribe rate >0.3% on any single issue (content/audience fit signal)
    - Net subscriber growth below weekly target (acquisition signal)
- If 90-day inactive cohort exceeds 15% of list: trigger re-engagement sequence
  (use templates/re-engagement.md as base; run /edit-issue to personalise)
- Segment data lives in Beehiiv — cross-reference with analytics/cohort-benchmarks.md

## Common tasks — exact commands

**Write a new issue draft:**
/write-issue topic="[topic]" audience="[persona]" sponsor="[name or none]" length=800

**Edit and style-check a draft:**
/edit-issue draft=issues/[slug]/draft.md style=editorial/style-guide.md

**Generate sponsor ad copy:**
/sponsorship-brief sponsor="[company]" product="[product description]" cta="[URL]" words=75

**Generate social promotion posts:**
/social-promo source=issues/[slug]/final.md channels="twitter,linkedin"

**Weekly performance report:**
/performance-report dashboard=analytics/weekly-dashboard.md period=7d

**Design a growth experiment:**
/growth-experiment channel="[channel]" hypothesis="[hypothesis]" log=growth/experiment-log.md

**List health check:**
/list-health-check dashboard=analytics/weekly-dashboard.md benchmarks=analytics/cohort-benchmarks.md

## Style conventions (from editorial/style-guide.md)

- Subject lines: max 9 words, no clickbait, front-load the topic
- First sentence: max 20 words, state the point immediately
- Paragraphs: max 4 sentences; never use filler openers ("In today's issue...")
- Sponsor slots: clearly delimited, honest disclosure ("This issue is sponsored by...")
- CTAs: one primary CTA per issue; place after the main body, before sign-off
- Tone: direct, informed, conversational — no corporate hedging, no exclamation marks
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

## Skills to install

```bash
npx claudient add skill productivity/newsletter-writer
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/founder-weekly-review
```

## Related

- [Guide: Claude for Content Creators](../guides/for-content-creator.md)
- [Workflow: Issue Production end-to-end](../workflows/newsletter-issue-production.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
