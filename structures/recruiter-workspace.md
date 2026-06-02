# Recruiter / Talent Acquisition Workspace — Project Structure

> Daily operating system for in-house and agency recruiters: job description drafting, candidate sourcing, screening, interview coordination, offer management, and pipeline reporting — all driven by Claude Code slash commands wired to Greenhouse/Lever/Ashby, LinkedIn Recruiter, and Slack.

## Stack

- **Greenhouse / Lever / Ashby** — ATS of record: job postings, candidate pipeline, stage tracking, offer management
- **LinkedIn Recruiter** — Boolean search, InMail outreach, talent pool management, sourcing analytics
- **Slack** — Hiring manager coordination, debrief scheduling, offer approvals, team alerts
- **HireRight** — Background check ordering, adjudication, compliance documentation
- **Karat / CoderPad** — Technical screening assignments, live coding interviews, assessment results
- **Calendly** — Interview scheduling, panel availability, candidate self-schedule links
- **Notion** — Recruiting playbooks, interview guides, hiring manager onboarding
- **Claude Code** — Slash commands for every repeatable recruiting workflow

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
| `.claude/commands/job-description.md` | Takes a `role-brief.md` as context and drafts a complete JD with responsibilities, requirements, preferred qualifications, and an inclusive-language pass — ready to post to Greenhouse or LinkedIn |
| `.claude/commands/sourcing-strategy.md` | Generates Boolean search strings, recommends sourcing channels with response rate estimates, and outputs a sourcing plan scoped to the role brief and talent pool |
| `.claude/commands/interview-scorecard.md` | Builds a structured scorecard from a role brief: competency list, behavioral question bank, and numeric rubric (1-5 scale with anchors) for each competency |
| `.claude/commands/offer-letter.md` | Takes candidate name, role, level, start date, and comp inputs; pulls the appropriate template from `offer-management/offer-letter-templates/`; generates a complete draft for review |
| `.claude/commands/pipeline-report.md` | Queries Greenhouse or Ashby for open roles, active candidates per stage, and time-in-stage data; formats a weekly pipeline summary with velocity highlights and blockers |
| `roles/_template/` | Canonical folder structure for every new open role — copy this directory when a new req opens to ensure consistent documentation across the recruiting lifecycle |
| `offer-management/comp-bands.md` | Single source of truth for salary bands by level and function — updated quarterly; referenced by `/offer-letter` and `/comp-benchmarker` to keep offers in band |
| `candidates/silver-medalists/silver-medalist-index.md` | Indexed list of strong candidates who were not hired — reactivated when a new role opens to reduce sourcing cycle time |
| `sourcing/boolean-strings/` | Pre-built Boolean search strings organized by role family — load the relevant file before any LinkedIn Recruiter session to avoid rebuilding strings from scratch |
| `reports/dei-metrics.md` | Tracks representation at each funnel stage (applied, screened, interviewed, offered, hired) to surface drop-off points and inform sourcing channel strategy |

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

This is a talent acquisition daily operating workspace. Every directory and command
here is optimized for one outcome: filling roles with great candidates, faster. Claude
Code handles JD drafting, sourcing strategy, screening, scorecard generation, offer
letters, and pipeline reporting — you handle relationships, judgment calls, and approvals.

Do not add application code here. This is a content and workflow workspace.

## Stack

- Greenhouse / Ashby: ATS of record — reqs, candidates, pipeline stages, offers, reporting
- LinkedIn Recruiter: Boolean search, InMail, saved searches, talent pool management
- Slack: hiring manager comms, debrief coordination, offer approval threads
- HireRight: background check ordering and adjudication
- Karat / CoderPad: technical assessment delivery and results access
- Calendly: candidate scheduling, panel coordination
- Notion: recruiting playbooks, process documentation

## Open roles

- All active reqs live in roles/ — one subdirectory per open role
- Role brief (role-brief.md) must be filled out before running any commands for that role
- Scorecard (scorecard.md) must exist before any interviews start
- Offers always require approval before sending — see offer-management/approval-workflow.md

## Common tasks — exact commands

### Write a job description
/job-description
→ Read the role-brief.md first, then draft a complete JD. Confirm before writing to
  the role's job-description.md.

### Build a sourcing strategy
/sourcing-strategy
→ Takes role type + level, outputs Boolean strings and channel recommendations with
  expected response rate benchmarks.

### Draft a screening email or InMail
/screen-email
→ Prompts for role, candidate background, and outreach type (cold InMail vs. warm
  referral vs. application follow-up); outputs subject + body.

### Build an interview scorecard
/interview-scorecard
→ Takes role brief, outputs competency list with behavioral questions and a 1-5 rubric
  with rating anchors for each competency.

### Generate an offer letter
/offer-letter
→ Takes candidate name, role, level, start date, base salary, equity, and signing bonus
  inputs; pulls appropriate template from offer-management/offer-letter-templates/;
  outputs draft for review. Never send without approval sign-off.

### Pull weekly pipeline report
/pipeline-report
→ Queries ATS for open roles, candidate counts by stage, time-in-stage, and blockers;
  formats and saves to reports/weekly/YYYY-WNN.md.

### Structure a debrief
/candidate-debrief
→ Takes raw interviewer notes + scorecard, synthesizes a hire/no-hire recommendation
  with supporting evidence mapped to each competency.

## Conventions

- Role folders: always copy roles/_template/ when opening a new req — never create ad hoc
- JDs: use inclusive language; avoid gendered pronouns, "rockstar", "ninja", "culture fit"
- Scorecards: all competencies scored 1-5 with anchors — no free-form only evaluations
- Offers: comp must fall within the band in offer-management/comp-bands.md before drafting
- Pipeline tracker: update candidates/pipeline-tracker.md after every stage change
- Silver medalists: log any strong no-hire to candidates/silver-medalists/silver-medalist-index.md
  with role, date, reason, and re-engage date suggestion
- Reports: saved to reports/weekly/YYYY-WNN.md — never overwrite historical reports
- Declined candidates: log to candidates/declined/declined-log.md with reason code for analytics

## What Claude should not do

- Do not send offer letters without explicit approval confirmation from the user
- Do not post job descriptions to LinkedIn or Greenhouse without user confirmation
- Do not order background checks (HireRight) — flag when appropriate, user initiates
- Do not share comp band details in any candidate-facing draft
- Do not create scorecards without first reading the role-brief.md for that role
- Do not recommend declining a candidate based on protected characteristics
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
