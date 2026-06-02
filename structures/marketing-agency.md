# Marketing Agency Operations — Project Structure

> For marketing agencies managing multiple client campaigns — from onboarding and brief intake through content production, paid media, monthly reporting, and retainer billing — in a single Claude Code workspace.

## Stack

- **Project management:** Asana (Projects, Timelines, Portfolios) or Monday.com (Boards, Automations, Dashboards)
- **CRM + campaign tracking:** HubSpot CRM (contacts, deals, campaign performance, email sequences)
- **Docs + collaboration:** Google Workspace (Docs, Sheets, Slides, Drive)
- **Creative:** Figma (brand design, ad creative, landing page mockups, presentation decks)
- **SEO:** Semrush (Keyword Magic, Position Tracking, Site Audit, Backlink Analytics)
- **Paid search:** Google Ads (Search, Display, Performance Max, Demand Gen campaigns)
- **Paid social:** Meta Business Suite (Facebook + Instagram Ads Manager, Audience Insights)
- **Communication:** Slack (client channels, internal channels, campaign alerts)
- **Time tracking:** Harvest (project-level time tracking, budget burn, team capacity)
- **Invoicing:** FreshBooks (retainer invoices, project billing, expense tracking, reports)
- **Analytics:** Google Analytics 4, Looker Studio (cross-channel dashboards)

## Directory tree

```
marketing-agency/
├── .claude/
│   ├── CLAUDE.md                                     # Workspace instructions for Claude Code
│   ├── settings.json                                 # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-client.md                             # /new-client — scaffold full client directory from template
│       ├── campaign-brief.md                         # /campaign-brief — generate campaign brief from intake notes
│       ├── monthly-report.md                         # /monthly-report — pull metrics and write client report
│       ├── retainer-check.md                         # /retainer-check — compare hours logged vs retainer scope
│       ├── proposal.md                               # /proposal — draft new-business proposal from brief
│       ├── ad-copy.md                                # /ad-copy — generate Google Ads and Meta ad copy variants
│       ├── seo-audit.md                              # /seo-audit — run Semrush site audit summary for client
│       └── scope-change.md                           # /scope-change — draft scope change order with billing impact
├── clients/
│   ├── _template/                                    # Master template — copy to clients/<client-name>/ on intake
│   │   ├── brief/
│   │   │   ├── client-intake.md                     # Intake questionnaire responses
│   │   │   └── discovery-notes.md                   # Notes from kickoff call
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md                # Overall channel strategy and 90-day roadmap
│   │   │   ├── target-audience.md                   # ICP, personas, pain points
│   │   │   └── competitor-analysis.md               # Competitive landscape, gaps, opportunities
│   │   ├── campaigns/
│   │   │   └── _campaign-template/
│   │   │       ├── campaign-brief.md                # Goals, audience, messaging, budget, timeline
│   │   │       ├── ad-copy.md                       # All ad copy variants by channel
│   │   │       ├── creative-brief.md                # Figma brief for design team
│   │   │       └── results/
│   │   │           └── campaign-report.md           # Post-campaign results writeup
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md                  # Brand colors, fonts, tone of voice
│   │   │   ├── logo/                                # Approved logo files (SVG, PNG)
│   │   │   └── approved-copy/                       # Approved headlines, taglines, boilerplate
│   │   ├── reports/
│   │   │   ├── onboarding-report.md                 # Baseline audit delivered at kickoff
│   │   │   └── _monthly-template.md                 # Copy this for each monthly report
│   │   └── contracts/
│   │       ├── sow.md                               # Statement of Work with deliverables and scope
│   │       ├── retainer-agreement.md                # Monthly retainer terms and hours
│   │       └── amendments/                          # Signed scope change orders
│   ├── acme-corp/
│   │   ├── brief/
│   │   │   ├── client-intake.md
│   │   │   └── discovery-notes.md
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md
│   │   │   ├── target-audience.md
│   │   │   └── competitor-analysis.md
│   │   ├── campaigns/
│   │   │   ├── 2026-q2-brand-awareness/
│   │   │   │   ├── campaign-brief.md
│   │   │   │   ├── ad-copy.md
│   │   │   │   ├── creative-brief.md
│   │   │   │   └── results/
│   │   │   │       └── campaign-report.md
│   │   │   └── 2026-q3-lead-gen/
│   │   │       ├── campaign-brief.md
│   │   │       ├── ad-copy.md
│   │   │       └── creative-brief.md
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md
│   │   │   ├── logo/
│   │   │   └── approved-copy/
│   │   ├── reports/
│   │   │   ├── onboarding-report.md
│   │   │   ├── 2026-04-monthly-report.md
│   │   │   ├── 2026-05-monthly-report.md
│   │   │   └── _monthly-template.md
│   │   └── contracts/
│   │       ├── sow.md
│   │       ├── retainer-agreement.md
│   │       └── amendments/
│   │           └── 2026-05-scope-change-01.md
│   └── blueprint-health/
│       ├── brief/
│       ├── strategy/
│       ├── campaigns/
│       ├── assets/
│       ├── reports/
│       └── contracts/
├── templates/
│   ├── campaign-brief.md                            # Blank campaign brief — goals, audience, budget, channels
│   ├── monthly-report.md                            # Monthly report structure — exec summary, KPIs, channel breakdown
│   ├── proposal.md                                  # New-business proposal — situation, approach, team, investment
│   ├── sow.md                                       # Statement of Work — deliverables, timelines, scope, exclusions
│   ├── creative-brief.md                            # Creative brief for Figma — context, deliverables, specs, do-nots
│   └── scope-change-order.md                        # Scope change order — description, hours, revised billing
├── campaigns/
│   └── active/
│       ├── acme-corp--q3-lead-gen/                  # Symlink or copy of active campaign dir for quick access
│       └── blueprint-health--seo-sprint/
├── new-business/
│   ├── prospect-list.md                             # CRM-style prospect tracking with stage, contact, notes
│   ├── proposals/
│   │   ├── greenfield-retail-2026-05.md             # Sent proposals archived here
│   │   └── northstar-saas-2026-06.md
│   └── pitch-decks/
│       ├── agency-capabilities-2026.md              # Master capabilities doc (pull from this for decks)
│       └── greenfield-retail-deck-outline.md        # Deck outline before moving to Slides/Figma
├── operations/
│   ├── sops/
│   │   ├── client-onboarding.md                    # Step-by-step new client onboarding checklist
│   │   ├── campaign-launch.md                      # Pre-launch checklist for paid campaigns
│   │   ├── monthly-reporting.md                    # Reporting workflow — data pull, draft, review, send
│   │   ├── offboarding.md                          # Client offboarding — asset handoff, access revocation
│   │   └── retainer-renewal.md                     # Renewal process — review, upsell, revised SOW
│   ├── onboarding/
│   │   ├── new-hire-checklist.md                   # Tools access, Slack channels, Harvest setup
│   │   └── client-onboarding-checklist.md          # Parallel checklist for client-facing setup steps
│   ├── offboarding/
│   │   └── client-offboarding-checklist.md
│   └── rate-card.md                                 # Current hourly rates and retainer tier pricing
└── resources/
    ├── brand-guidelines/
    │   └── agency-brand.md                          # Agency's own brand guide for pitches and proposals
    ├── media-kits/
    │   └── agency-media-kit-2026.md                 # Agency overview, client roster, results highlights
    └── case-studies/
        ├── acme-corp-brand-awareness.md             # Structured case study — challenge, approach, results
        └── blueprint-health-seo.md
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/new-client.md` | Slash command that creates the full `clients/<slug>/` directory tree from `clients/_template/`, pre-populates the intake form, and creates a draft SOW and retainer agreement |
| `.claude/commands/campaign-brief.md` | Takes a client slug, campaign goal, budget, and channels as input; produces a fully structured campaign brief aligned to the client's existing brand guidelines and strategy |
| `.claude/commands/monthly-report.md` | Reads channel metrics (GA4, Google Ads, Meta, Semrush) from a structured data file and writes the monthly client report using `templates/monthly-report.md` |
| `.claude/commands/retainer-check.md` | Compares Harvest hours logged against the client's retainer scope in `contracts/retainer-agreement.md` and flags overages or available budget |
| `.claude/commands/scope-change.md` | Drafts a scope change order with hours, rationale, and revised billing using `templates/scope-change-order.md`; saves to `clients/<slug>/contracts/amendments/` |
| `clients/_template/` | Master scaffolding directory — copy this entire folder when onboarding a new client to ensure every folder and file exists before kickoff |
| `operations/sops/monthly-reporting.md` | Canonical SOP for the monthly reporting process — defines who pulls data, what the review cycle is, and when reports go to clients |
| `templates/campaign-brief.md` | Agency's standard campaign brief with sections for business objective, success metrics, audience, messaging pillars, channel plan, budget, and timeline |

## Quick scaffold

```bash
# Create workspace root
mkdir -p marketing-agency && cd marketing-agency

# Claude Code config
mkdir -p .claude/commands

# Client _template directory (full depth)
mkdir -p clients/_template/brief
mkdir -p clients/_template/strategy
mkdir -p clients/_template/campaigns/_campaign-template/results
mkdir -p clients/_template/assets/logo
mkdir -p clients/_template/assets/approved-copy
mkdir -p clients/_template/reports
mkdir -p clients/_template/contracts/amendments

# Example client directories
mkdir -p clients/acme-corp/brief
mkdir -p clients/acme-corp/strategy
mkdir -p clients/acme-corp/campaigns/2026-q2-brand-awareness/results
mkdir -p clients/acme-corp/campaigns/2026-q3-lead-gen
mkdir -p clients/acme-corp/assets/logo
mkdir -p clients/acme-corp/assets/approved-copy
mkdir -p clients/acme-corp/reports
mkdir -p clients/acme-corp/contracts/amendments

mkdir -p clients/blueprint-health/brief
mkdir -p clients/blueprint-health/strategy
mkdir -p clients/blueprint-health/campaigns
mkdir -p clients/blueprint-health/assets
mkdir -p clients/blueprint-health/reports
mkdir -p clients/blueprint-health/contracts/amendments

# Templates
mkdir -p templates

# Active campaigns shortcut
mkdir -p campaigns/active

# New business
mkdir -p new-business/proposals
mkdir -p new-business/pitch-decks

# Operations
mkdir -p operations/sops
mkdir -p operations/onboarding
mkdir -p operations/offboarding

# Resources
mkdir -p resources/brand-guidelines
mkdir -p resources/media-kits
mkdir -p resources/case-studies

# Initialize config files
touch .claude/CLAUDE.md
touch .claude/settings.json

# Create placeholder template files
touch clients/_template/brief/client-intake.md
touch clients/_template/brief/discovery-notes.md
touch clients/_template/strategy/marketing-strategy.md
touch clients/_template/strategy/target-audience.md
touch clients/_template/strategy/competitor-analysis.md
touch clients/_template/campaigns/_campaign-template/campaign-brief.md
touch clients/_template/campaigns/_campaign-template/ad-copy.md
touch clients/_template/campaigns/_campaign-template/creative-brief.md
touch clients/_template/reports/_monthly-template.md
touch clients/_template/contracts/sow.md
touch clients/_template/contracts/retainer-agreement.md
touch templates/campaign-brief.md
touch templates/monthly-report.md
touch templates/proposal.md
touch templates/sow.md
touch templates/creative-brief.md
touch templates/scope-change-order.md
touch new-business/prospect-list.md
touch operations/sops/client-onboarding.md
touch operations/sops/campaign-launch.md
touch operations/sops/monthly-reporting.md
touch operations/sops/offboarding.md
touch operations/sops/retainer-renewal.md
touch operations/rate-card.md

# Install all relevant skills
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/stakeholder-report

# Install slash commands
npx claudient add command new-client
npx claudient add command campaign-brief
npx claudient add command monthly-report
npx claudient add command retainer-check
npx claudient add command proposal
npx claudient add command ad-copy
npx claudient add command seo-audit
npx claudient add command scope-change

echo "Marketing agency workspace ready."
```

## CLAUDE.md template

```markdown
# Marketing Agency Operations — Claude Instructions

## What this is

This workspace manages multi-client marketing agency operations: client onboarding,
campaign brief development, paid media (Google Ads + Meta), SEO (Semrush), monthly
reporting, retainer scope tracking, and new-business proposal development. Each client
has an isolated directory under clients/. All templates are in templates/.

## Stack

- Project management: Asana (one project per client, campaign tasks, timelines)
- CRM: HubSpot (contact and deal records, campaign tracking, email sequences)
- Docs: Google Workspace (Docs for deliverables, Sheets for media plans, Slides for decks)
- Creative: Figma (ad creative, landing pages, presentation decks)
- SEO: Semrush (keyword research, position tracking, site audit, backlink analysis)
- Paid search: Google Ads (Search, Display, Performance Max)
- Paid social: Meta Business Suite (Facebook + Instagram Ads Manager)
- Time tracking: Harvest (project-level, billable vs non-billable per client)
- Invoicing: FreshBooks (retainer invoices, project billing, expense reconciliation)
- Communication: Slack (#client-<name> per client, #campaigns, #new-business, #ops)
- Analytics: Google Analytics 4, Looker Studio dashboards

## Directory conventions

- clients/<client-slug>/ — all client deliverables; never mix client assets across folders
- clients/<client-slug>/campaigns/<YYYY-qN-campaign-name>/ — one directory per campaign
- clients/<client-slug>/reports/<YYYY-MM>-monthly-report.md — monthly reports named by period
- clients/<client-slug>/contracts/amendments/ — every scope change gets a numbered file
- templates/ — source of truth for all document structures; never draft without copying a template
- new-business/ — prospect tracking, proposals, and pitch deck outlines only
- operations/sops/ — canonical process documentation; update these when process changes

## Onboarding a new client

1. Copy clients/_template/ to clients/<new-client-slug>/:
   cp -r clients/_template clients/<new-client-slug>
2. Run /new-client client="<Name>" slug="<slug>" retainer="<monthly-hours>"
3. Complete clients/<slug>/brief/client-intake.md before the kickoff call
4. After kickoff, populate clients/<slug>/strategy/marketing-strategy.md
5. Draft SOW using templates/sow.md; save to clients/<slug>/contracts/sow.md
6. Create Asana project and link project ID in clients/<slug>/brief/discovery-notes.md
7. Set up HubSpot deal record and link deal ID in discovery-notes.md
8. Open Harvest project for the client using the rate card in operations/rate-card.md

## Campaign brief workflow

1. Run /campaign-brief client="<slug>" goal="<objective>" budget="<amount>" channels="<list>"
2. Review and refine clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md
3. Run /ad-copy brief=clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md
4. Send creative-brief.md to Figma — reference brand-guidelines.md for spec constraints
5. On launch, run /seo-audit client="<slug>" for organic campaigns; check Semrush position baseline
6. Log campaign start date in Harvest as a milestone note

## Monthly reporting process

1. Export channel data (GA4, Google Ads, Meta, Semrush position tracking) to a CSV or structured .md
2. Place exported data in clients/<slug>/reports/raw-data-<YYYY-MM>.md
3. Run /monthly-report client="<slug>" period="<YYYY-MM>" data=clients/<slug>/reports/raw-data-<YYYY-MM>.md
4. Review draft at clients/<slug>/reports/<YYYY-MM>-monthly-report.md
5. Internal review via Slack #campaigns before sending to client
6. After client approval, archive to Google Drive and mark as sent in Asana

## Retainer scope management

- Run /retainer-check client="<slug>" month="<YYYY-MM>" after each Harvest export
- Hours over scope: draft scope change order before logging additional time
  /scope-change client="<slug>" hours="<overage>" reason="<description>"
- Save output to clients/<slug>/contracts/amendments/YYYY-MM-scope-change-NN.md
- Retainer renewals: follow operations/sops/retainer-renewal.md 30 days before end date

## Ad copy conventions

- Google Ads headlines: 30 characters max; write 10+ variants per campaign
- Google Ads descriptions: 90 characters max; lead with benefit, end with CTA
- Meta primary text: 125 characters visible before truncation; hook in first 80 chars
- Meta headline: 40 characters max; benefit-driven, no clickbait
- All copy must be approved against client brand guidelines before upload

## Billing conventions

- Log time in Harvest immediately after each task — do not batch at end of week
- Billable codes: strategy, content, paid-media, reporting, account-management, design
- Non-billable: internal training, tooling setup, admin
- Invoice on the 1st of each month via FreshBooks; reference Harvest report for hours breakdown
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
        "/Users/${USER}/marketing-agency"
      ]
    },
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
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
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google-labs/google-drive-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
      }
    },
    "asana": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "${ASANA_ACCESS_TOKEN}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */campaigns/*/campaign-brief.md ]]; then echo \"[hook] Campaign brief saved: $FILE — run /ad-copy and /creative-brief next\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */contracts/amendments/*.md ]]; then echo \"[hook] Scope change order saved: $FILE — update Harvest budget and send to client for signature\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find clients/ -mindepth 1 -maxdepth 1 -type d ! -name _template | while read CLIENT; do [ ! -f \"$CLIENT/contracts/retainer-agreement.md\" ] && echo \"$CLIENT\"; done | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[reminder] $MISSING client(s) missing retainer-agreement.md — check contracts/ directories\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/social-media-manager
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/investor-update
```

## Related

- [Guide: Claude for Marketing Teams](../guides/for-content-marketer.md)
- [Workflow: Campaign Launch end-to-end](../workflows/campaign-launch.md)
- [Workflow: Monthly Client Reporting](../workflows/monthly-reporting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
