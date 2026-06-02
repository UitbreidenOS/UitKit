# Recruiter / Talent Acquisition Workspace — Project Structure

> Dagelijks operationeel systeem voor in-house en agency recruiters: job description drafting, candidate sourcing, screening, interview coordination, offer management, en pipeline reporting — allemaal aangestuurd door Claude Code slash commands gekoppeld aan Greenhouse/Lever/Ashby, LinkedIn Recruiter, en Slack.

## Stack

- **Greenhouse / Lever / Ashby** — ATS of record: job postings, candidate pipeline, stage tracking, offer management
- **LinkedIn Recruiter** — Boolean search, InMail outreach, talent pool management, sourcing analytics
- **Slack** — Hiring manager coordination, debrief scheduling, offer approvals, team alerts
- **HireRight** — Background check ordering, adjudication, compliance documentation
- **Karat / CoderPad** — Technical screening assignments, live coding interviews, assessment results
- **Calendly** — Interview scheduling, panel availability, candidate self-schedule links
- **Notion** — Recruiting playbooks, interview guides, hiring manager onboarding
- **Claude Code** — Slash commands voor elke herhaalbare recruiting workflow

## Directory tree

```
recruiter-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions for Claude
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── job-description.md                 # Drafts JD from role brief (takes $ROLE arg)
│       ├── sourcing-strategy.md               # Boolean strings + channels for a role type
│       ├── screen-email.md                    # Screening email or InMail template writer
│       ├── interview-scorecard.md             # Builds structured scorecard for a role
│       ├── offer-letter.md                    # Generates offer letter from comp band + inputs
│       ├── pipeline-report.md                 # Pulls ATS data → weekly pipeline summary
│       └── candidate-debrief.md              # Structures debrief notes post-interview panel
├── roles/
│   ├── _template/                             # Copy this folder for each new open role
│   │   ├── job-description.md                 # Final approved JD (sourced from /job-description)
│   │   ├── role-brief.md                      # HM intake form: level, scope, must-haves, nice-to-haves
│   │   ├── sourcing-log.md                    # Boolean strings used, channels tried, response rates
│   │   ├── interview-guide.md                 # Stage-by-stage interview structure + question banks
│   │   ├── scorecard.md                       # Evaluation rubric with competency weights
│   │   └── offers/
│   │       ├── offer-draft.md                 # Working draft before approval
│   │       └── offer-final.md                 # Approved offer sent to candidate
│   ├── senior-engineer-backend/
│   │   ├── job-description.md
│   │   ├── role-brief.md
│   │   ├── sourcing-log.md
│   │   ├── interview-guide.md
│   │   ├── scorecard.md
│   │   └── offers/
│   │       ├── offer-draft.md
│   │       └── offer-final.md
│   ├── product-manager-growth/
│   │   ├── job-description.md
│   │   ├── role-brief.md
│   │   ├── sourcing-log.md
│   │   ├── interview-guide.md
│   │   ├── scorecard.md
│   │   └── offers/
│   │       └── offer-draft.md
│   └── account-executive-mid-market/
│       ├── job-description.md
│       ├── role-brief.md
│       ├── sourcing-log.md
│       ├── interview-guide.md
│       ├── scorecard.md
│       └── offers/
│           └── offer-draft.md
├── candidates/
│   ├── pipeline-tracker.md                    # Active candidates across all roles: stage, status, owner
│   ├── feedback-log.md                        # Indexed interview feedback by candidate + role
│   ├── declined/
│   │   ├── declined-template.md               # Standard rejection email templates by stage
│   │   └── declined-log.md                    # Declined candidates with reason codes for analytics
│   └── silver-medalists/
│       ├── silver-medalist-index.md           # Runners-up to re-engage when new roles open
│       └── re-engagement-template.md          # Warm outreach for silver medalists
├── sourcing/
│   ├── boolean-strings/
│   │   ├── software-engineer.md               # Boolean strings for SWE sourcing by stack
│   │   ├── product-manager.md                 # Boolean strings for PM sourcing
│   │   ├── data-scientist.md                  # Boolean strings for DS/ML roles
│   │   ├── sales-ae-sdr.md                    # Boolean strings for GTM roles
│   │   └── design-ux.md                       # Boolean strings for design roles
│   ├── sourcing-channels.md                   # Channel list with response rate benchmarks per role type
│   ├── talent-pools/
│   │   ├── engineering-pool.md                # Warm engineering contacts to re-engage
│   │   ├── gtm-pool.md                        # Warm GTM contacts
│   │   └── leadership-pool.md                 # VP/Director-level passive candidates
│   └── linkedin-saved-searches.md             # Named LinkedIn Recruiter searches to rerun monthly
├── offer-management/
│   ├── comp-bands.md                          # Salary bands by level and function (updated quarterly)
│   ├── offer-letter-templates/
│   │   ├── full-time-standard.md              # Standard FTE offer letter template
│   │   ├── full-time-executive.md             # Executive offer letter with equity cliff language
│   │   └── contract-to-hire.md                # Contract-to-hire offer letter template
│   ├── equity-explainer.md                    # Plain-language equity FAQ for candidates
│   ├── negotiation-scripts.md                 # Counter-offer response scripts by scenario
│   └── approval-workflow.md                   # Offer approval chain: recruiter → HRBP → Finance → CEO
├── onboarding/
│   ├── day-1-checklist.md                     # IT, badge, tools, intro meetings
│   ├── first-week-schedule-template.md        # Day-by-day schedule for new hire's first week
│   ├── welcome-email-template.md              # Pre-start welcome email sent 3 days before start
│   ├── hiring-manager-checklist.md            # HM tasks before and on day 1
│   └── new-hire-survey.md                     # 30-day new hire experience survey
├── employer-brand/
│   ├── company-overview.md                    # 2-page company brief for candidates
│   ├── culture-deck.md                        # Values, working style, team composition
│   ├── candidate-faq.md                       # Common candidate questions with approved answers
│   ├── glassdoor-response-templates.md        # Approved responses to common Glassdoor themes
│   └── job-board-descriptions/
│       ├── linkedin-company-bio.md            # 300-char LinkedIn company description
│       └── greenhouse-about-us.md             # ATS "About Us" block for job postings
└── reports/
    ├── weekly-pipeline.md                     # Weekly snapshot: active roles, stages, velocity
    ├── time-to-fill.md                        # Time-to-fill by role type and quarter
    ├── source-of-hire.md                      # Hire attribution by sourcing channel
    ├── dei-metrics.md                         # Funnel diversity data by stage and role
    └── weekly/
        ├── 2026-W22.md                        # Archived weekly pipeline report
        ├── 2026-W21.md
        └── 2026-W20.md
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/job-description.md` | Neemt een `role-brief.md` als context en drafts een volledige JD met responsibilities, requirements, preferred qualifications, en een inclusive-language pass — klaar om te plaatsen op Greenhouse of LinkedIn |
| `.claude/commands/sourcing-strategy.md` | Genereert Boolean search strings, beveelt sourcing channels aan met response rate estimates, en outputs een sourcing plan scoped tot de role brief en talent pool |
| `.claude/commands/interview-scorecard.md` | Bouwt een structured scorecard vanuit een role brief: competency list, behavioral question bank, en numeric rubric (1-5 scale met anchors) voor elke competency |
| `.claude/commands/offer-letter.md` | Neemt candidate name, role, level, start date, en comp inputs; trekt de juiste template uit `offer-management/offer-letter-templates/`; genereert een volledige draft voor review |
| `.claude/commands/pipeline-report.md` | Queries Greenhouse of Ashby voor open roles, active candidates per stage, en time-in-stage data; formats een weekly pipeline summary met velocity highlights en blockers |
| `roles/_template/` | Canonical folder structure voor elke nieuwe open role — copy deze directory wanneer een nieuwe req opengaat om consistente documentatie te garanderen gedurende de recruiting lifecycle |
| `offer-management/comp-bands.md` | Single source of truth voor salary bands per level en function — updated quarterly; referenced door `/offer-letter` en `/comp-benchmarker` om offers in band te houden |
| `candidates/silver-medalists/silver-medalist-index.md` | Indexed list van sterke candidates die niet werden ingehuurd — geactiveerd wanneer een nieuwe role opent om sourcing cycle time te verminderen |
| `sourcing/boolean-strings/` | Pre-built Boolean search strings georganiseerd per role family — laad het relevante file voor elke LinkedIn Recruiter sessie om het opnieuw bouwen van strings uit het niets te voorkomen |
| `reports/dei-metrics.md` | Tracks representatie op elke funnel stage (applied, screened, interviewed, offered, hired) om drop-off punten aan het licht te brengen en sourcing channel strategy te informeren |

## Quick scaffold

```bash
# Create the workspace and all subdirectories
mkdir -p recruiter-workspace/.claude/commands
mkdir -p recruiter-workspace/roles/_template/offers
mkdir -p recruiter-workspace/roles/senior-engineer-backend/offers
mkdir -p recruiter-workspace/roles/product-manager-growth/offers
mkdir -p recruiter-workspace/roles/account-executive-mid-market/offers
mkdir -p recruiter-workspace/candidates/declined
mkdir -p recruiter-workspace/candidates/silver-medalists
mkdir -p recruiter-workspace/sourcing/boolean-strings
mkdir -p recruiter-workspace/sourcing/talent-pools
mkdir -p recruiter-workspace/offer-management/offer-letter-templates
mkdir -p recruiter-workspace/onboarding
mkdir -p recruiter-workspace/employer-brand/job-board-descriptions
mkdir -p recruiter-workspace/reports/weekly

# Stub out Claude commands
touch recruiter-workspace/.claude/commands/job-description.md
touch recruiter-workspace/.claude/commands/sourcing-strategy.md
touch recruiter-workspace/.claude/commands/screen-email.md
touch recruiter-workspace/.claude/commands/interview-scorecard.md
touch recruiter-workspace/.claude/commands/offer-letter.md
touch recruiter-workspace/.claude/commands/pipeline-report.md
touch recruiter-workspace/.claude/commands/candidate-debrief.md

# Stub out role template
touch recruiter-workspace/roles/_template/job-description.md
touch recruiter-workspace/roles/_template/role-brief.md
touch recruiter-workspace/roles/_template/sourcing-log.md
touch recruiter-workspace/roles/_template/interview-guide.md
touch recruiter-workspace/roles/_template/scorecard.md
touch recruiter-workspace/roles/_template/offers/offer-draft.md

# Stub out sourcing files
touch recruiter-workspace/sourcing/boolean-strings/software-engineer.md
touch recruiter-workspace/sourcing/boolean-strings/product-manager.md
touch recruiter-workspace/sourcing/boolean-strings/data-scientist.md
touch recruiter-workspace/sourcing/boolean-strings/sales-ae-sdr.md
touch recruiter-workspace/sourcing/boolean-strings/design-ux.md
touch recruiter-workspace/sourcing/sourcing-channels.md
touch recruiter-workspace/sourcing/linkedin-saved-searches.md
touch recruiter-workspace/sourcing/talent-pools/engineering-pool.md
touch recruiter-workspace/sourcing/talent-pools/gtm-pool.md
touch recruiter-workspace/sourcing/talent-pools/leadership-pool.md

# Stub out offer management files
touch recruiter-workspace/offer-management/comp-bands.md
touch recruiter-workspace/offer-management/offer-letter-templates/full-time-standard.md
touch recruiter-workspace/offer-management/offer-letter-templates/full-time-executive.md
touch recruiter-workspace/offer-management/offer-letter-templates/contract-to-hire.md
touch recruiter-workspace/offer-management/equity-explainer.md
touch recruiter-workspace/offer-management/negotiation-scripts.md
touch recruiter-workspace/offer-management/approval-workflow.md

# Stub out onboarding files
touch recruiter-workspace/onboarding/day-1-checklist.md
touch recruiter-workspace/onboarding/first-week-schedule-template.md
touch recruiter-workspace/onboarding/welcome-email-template.md
touch recruiter-workspace/onboarding/hiring-manager-checklist.md
touch recruiter-workspace/onboarding/new-hire-survey.md

# Stub out employer brand files
touch recruiter-workspace/employer-brand/company-overview.md
touch recruiter-workspace/employer-brand/culture-deck.md
touch recruiter-workspace/employer-brand/candidate-faq.md
touch recruiter-workspace/employer-brand/glassdoor-response-templates.md
touch recruiter-workspace/employer-brand/job-board-descriptions/linkedin-company-bio.md
touch recruiter-workspace/employer-brand/job-board-descriptions/greenhouse-about-us.md

# Stub out candidate tracking
touch recruiter-workspace/candidates/pipeline-tracker.md
touch recruiter-workspace/candidates/feedback-log.md
touch recruiter-workspace/candidates/declined/declined-template.md
touch recruiter-workspace/candidates/declined/declined-log.md
touch recruiter-workspace/candidates/silver-medalists/silver-medalist-index.md
touch recruiter-workspace/candidates/silver-medalists/re-engagement-template.md

# Stub out report files
touch recruiter-workspace/reports/weekly-pipeline.md
touch recruiter-workspace/reports/time-to-fill.md
touch recruiter-workspace/reports/source-of-hire.md
touch recruiter-workspace/reports/dei-metrics.md
echo "# Weekly Pipeline — $(date +%Y-W%V)" > recruiter-workspace/reports/weekly/$(date +%Y-W%V).md

# Install all recruiter skills
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description

echo "Recruiter workspace scaffold complete."
```

## CLAUDE.md template

```markdown
# Recruiter Workspace — Claude Instructions

## What this is

Dit is een talent acquisition daily operating workspace. Elke directory en command
hier is geoptimaliseerd voor één outcome: het vullen van rollen met geweldige candidates, sneller. Claude
Code handelt JD drafting, sourcing strategy, screening, scorecard generation, offer
letters, en pipeline reporting af — jij handelt relationships, judgment calls, en approvals af.

Voeg geen application code hier toe. Dit is een content en workflow workspace.

## Stack

- Greenhouse / Ashby: ATS of record — reqs, candidates, pipeline stages, offers, reporting
- LinkedIn Recruiter: Boolean search, InMail, saved searches, talent pool management
- Slack: hiring manager comms, debrief coordination, offer approval threads
- HireRight: background check ordering and adjudication
- Karat / CoderPad: technical assessment delivery and results access
- Calendly: candidate scheduling, panel coordination
- Notion: recruiting playbooks, process documentation

## Open roles

- Alle active reqs leven in roles/ — één subdirectory per open role
- Role brief (role-brief.md) moet ingevuld zijn voordat je commands voor die role uitvoert
- Scorecard (scorecard.md) moet bestaan voor interviews beginnen
- Offers vereisen altijd approval voordat ze worden verzonden — zie offer-management/approval-workflow.md

## Common tasks — exact commands

### Write a job description
/job-description
→ Lees eerst de role-brief.md, drafte dan een volledige JD. Bevestig voordat je schrijft naar
  de job-description.md van de role.

### Build a sourcing strategy
/sourcing-strategy
→ Neemt role type + level, outputs Boolean strings en channel recommendations met
  expected response rate benchmarks.

### Draft a screening email or InMail
/screen-email
→ Vraagt om role, candidate background, en outreach type (cold InMail vs. warm
  referral vs. application follow-up); outputs subject + body.

### Build an interview scorecard
/interview-scorecard
→ Neemt role brief, outputs competency list met behavioral questions en een 1-5 rubric
  met rating anchors voor elke competency.

### Generate an offer letter
/offer-letter
→ Neemt candidate name, role, level, start date, base salary, equity, en signing bonus
  inputs; trekt juiste template uit offer-management/offer-letter-templates/;
  outputs draft voor review. Stuur nooit zonder approval sign-off.

### Pull weekly pipeline report
/pipeline-report
→ Queries ATS voor open roles, candidate counts per stage, time-in-stage, en blockers;
  formats en slaat op naar reports/weekly/YYYY-WNN.md.

### Structure a debrief
/candidate-debrief
→ Neemt raw interviewer notes + scorecard, synthesizeert een hire/no-hire recommendation
  met supporting evidence gemapped naar elke competency.

## Conventions

- Role folders: kopieer altijd roles/_template/ wanneer je een nieuwe req opent — nooit ad hoc aanmaken
- JDs: gebruik inclusive language; vermijd gendered pronouns, "rockstar", "ninja", "culture fit"
- Scorecards: alle competencies scored 1-5 met anchors — geen free-form only evaluations
- Offers: comp moet binnen de band in offer-management/comp-bands.md vallen voordat je draft
- Pipeline tracker: update candidates/pipeline-tracker.md na elke stage change
- Silver medalists: log elke sterke no-hire naar candidates/silver-medalists/silver-medalist-index.md
  met role, date, reason, en re-engage date suggestion
- Reports: opgeslagen naar reports/weekly/YYYY-WNN.md — overschrijf nooit historische reports
- Declined candidates: log naar candidates/declined/declined-log.md met reason code voor analytics

## What Claude should not do

- Stuur offer letters niet zonder expliciete approval confirmation van de user
- Post job descriptions niet naar LinkedIn of Greenhouse zonder user confirmation
- Order background checks niet (HireRight) — flag wanneer van toepassing, user initieert
- Deel comp band details niet in enig candidate-facing draft
- Maak scorecards niet zonder eerst de role-brief.md voor die role te lezen
- Beveel niet aan candidates af te wijzen op basis van protected characteristics
```

## MCP servers

```json
{
  "mcpServers": {
    "greenhouse": {
      "command": "npx",
      "args": ["-y", "@greenhouse/mcp-server"],
      "env": {
        "GREENHOUSE_API_KEY": "${GREENHOUSE_API_KEY}",
        "GREENHOUSE_ON_BEHALF_OF": "${GREENHOUSE_USER_ID}"
      }
    },
    "ashby": {
      "command": "npx",
      "args": ["-y", "@ashby-hq/mcp-server"],
      "env": {
        "ASHBY_API_KEY": "${ASHBY_API_KEY}"
      }
    },
    "linkedin": {
      "command": "npx",
      "args": ["-y", "@linkedin/mcp-server"],
      "env": {
        "LINKEDIN_ACCESS_TOKEN": "${LINKEDIN_ACCESS_TOKEN}",
        "LINKEDIN_ORGANIZATION_ID": "${LINKEDIN_ORGANIZATION_ID}"
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
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/$USER/recruiter-workspace"
      ]
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */offers/offer-draft.md ]]; then echo \"[hook] Offer draft written. Reminder: obtain approval before sending — see offer-management/approval-workflow.md\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */reports/weekly/* ]]; then echo \"[hook] Pipeline report saved: $CLAUDE_TOOL_RESULT_PATH\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__greenhouse__create_offer",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[hook] Offer creation triggered in Greenhouse — confirm approval chain in offer-management/approval-workflow.md is complete before proceeding.\"'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
```

## Related

- [Recruiter guide — full workflow documentation](../guides/for-recruiter.md)
- [Hiring pipeline workflow — end-to-end process](../workflows/hiring-pipeline.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
