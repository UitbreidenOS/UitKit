# Nonprofit Organization Operations — Project Structure

> For a nonprofit managing programs, fundraising, donor relations, grant writing, and compliance — optimizing the full cycle from prospect research and grant applications to program delivery, donor stewardship, and IRS 990 reporting.

## Stack

- **Salesforce Nonprofit Success Pack (NPSP)** — donor CRM, gift tracking, relationship management, campaign reporting
- **Bloomerang** — alternative donor CRM; retention scoring, lapsed donor segmentation, engagement timeline
- **Mailchimp** or **Constant Contact** — email newsletters, donor segmentation campaigns, event invitations, automated stewardship sequences
- **QuickBooks Nonprofit** — fund accounting, restricted/unrestricted revenue tracking, grant expense reporting, 990 prep exports
- **Google Workspace** (Gmail, Docs, Drive, Sheets, Calendar) — internal communications, board documents, shared file storage
- **Canva** — impact reports, social media graphics, grant cover pages, event materials, annual report design
- **Zoom** — board meetings, donor cultivation events, program delivery (virtual), staff all-hands
- **DonorSearch** or **iWave** — prospect research, wealth screening, philanthropic capacity scoring, affinity ratings
- **Submittable** or **Fluxx** — grant application submission and management portal
- **Claude Code** — grant narrative drafting, donor acknowledgment letters, board report writing, impact story generation, 990 prep assistance

## Directory tree

```
nonprofit-operations/
├── .claude/
│   ├── CLAUDE.md                                    # Workspace instructions — donor confidentiality, grant deadlines, 990 schedule
│   ├── settings.json                                # MCP servers, hooks, permissions
│   └── commands/
│       ├── grant-narrative.md                       # /grant-narrative — draft grant proposal section from funder brief and program data
│       ├── donor-acknowledgment.md                  # /donor-acknowledgment — generate IRS-compliant gift acknowledgment letter
│       ├── impact-story.md                          # /impact-story — write a participant impact story from staff interview notes
│       ├── board-report.md                          # /board-report — assemble monthly/quarterly board report from program and finance data
│       ├── prospect-profile.md                      # /prospect-profile — synthesize a major gift prospect profile from research inputs
│       ├── grant-report.md                          # /grant-report — draft a funder progress or final report from program outcome data
│       └── donor-segment.md                         # /donor-segment — generate a segmented appeal or stewardship message for a donor tier
├── programs/
│   ├── README.md                                    # Programs overview — list of active programs, directors, fiscal years
│   ├── youth-workforce-development/                 # Example program folder — one folder per active program
│   │   ├── logic-model.md                           # Theory of change: inputs, activities, outputs, outcomes, impact
│   │   ├── activities.md                            # Activity calendar, session plans, curriculum outline, facilitator assignments
│   │   ├── outcomes-tracking.md                     # Outcome indicators, measurement methods, data collection schedule, targets vs. actuals
│   │   ├── participant-data-sop.md                  # SOP for collecting, storing, and protecting participant PII — consent forms, Salesforce entry, retention schedule
│   │   └── program-budget.md                        # Program-level budget by expense category — links to grant restrictions
│   ├── senior-food-assistance/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   ├── financial-literacy-education/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   └── evaluation/
│       ├── evaluation-framework.md                  # Organization-wide evaluation approach — common indicators, data standards
│       ├── data-collection-tools.md                 # Survey templates, intake forms, pre/post assessments — no real participant data
│       └── annual-outcomes-report-template.md       # Template for compiling cross-program outcomes into funder-facing annual report
├── fundraising/
│   ├── donor-segments.md                            # Segment definitions — major donors ($10K+), mid-level ($1K–$9,999), annual fund (<$1K), lapsed, new
│   ├── major-gift-prospects.md                      # Top 25 major gift prospects — capacity rating, affinity, relationship owner, next step, ask amount
│   ├── event-calendar.md                            # Fundraising event calendar — gala, golf tournament, giving Tuesday, peer-to-peer campaigns
│   ├── annual-fund-plan.md                          # Annual fund strategy — appeal schedule, channel mix, matching gift targets, retention goals
│   ├── planned-giving.md                            # Legacy society program — bequest language, estate planning resources, member stewardship plan
│   ├── major-gifts/
│   │   ├── cultivation-moves-template.md            # Moves management template — discovery, cultivation, solicitation, stewardship steps
│   │   ├── gift-agreement-template.md               # Major gift agreement template — gift amount, purpose, recognition, reporting obligations
│   │   ├── solicitation-letter-template.md          # Major gift ask letter template — personalization fields, case for support narrative
│   │   └── stewardship-calendar.md                  # Annual touchpoint calendar for major donors — calls, site visits, reports, recognition
│   ├── annual-fund/
│   │   ├── direct-mail-appeal-template.md           # Direct mail appeal letter template — fall, year-end, spring versions
│   │   ├── email-appeal-template.md                 # Email appeal template — subject line variants, A/B test structure
│   │   ├── matching-gift-tracker.md                 # Corporate matching gift opportunities — employer, match ratio, deadline, status
│   │   └── retention-report-template.md             # Donor retention analysis template — new, retained, lapsed, reactivated counts by year
│   └── prospect-research/
│       ├── prospect-research-sop.md                 # SOP for DonorSearch/iWave screening — when to run, how to log results in Salesforce/Bloomerang
│       ├── wealth-screen-criteria.md                # Capacity and affinity scoring criteria — real estate, SEC filings, prior giving, philanthropic history
│       └── prospect-briefing-template.md            # One-page prospect briefing template — biography, giving history, connections, suggested ask
├── grants/
│   ├── grant-calendar.md                            # Master grant deadline calendar — funder, amount, deadline, assigned writer, status, report due
│   ├── funder-research/
│   │   ├── funder-research-sop.md                   # SOP for researching new funders — 990 analysis, priorities, past grantees, fit assessment
│   │   ├── funder-profiles/
│   │   │   ├── smith-family-foundation.md           # Funder profile: priorities, eligibility, average grant size, past grants to org, contact
│   │   │   ├── city-arts-council.md
│   │   │   └── federal-cdbg-program.md
│   │   └── prospect-funders.md                      # Funders under research — name, fit rating, next action, assigned staff
│   ├── active-grants/
│   │   ├── README.md                                # Active grant inventory — funder, award amount, period, restricted purpose, report dates
│   │   ├── smith-family-foundation-fy2025/
│   │   │   ├── grant-agreement.md                   # Award amount, restrictions, reporting requirements, contact info
│   │   │   ├── budget-narrative.md                  # Approved budget with line-item narrative — matches QuickBooks grant code
│   │   │   ├── progress-report-q1.md                # Q1 narrative progress report — activities, outcomes, expenditures
│   │   │   └── final-report-draft.md                # Final report draft — narrative, financials, lessons learned
│   │   └── federal-workforce-grant-fy2025/
│   │       ├── grant-agreement.md
│   │       ├── budget-narrative.md
│   │       ├── subrecipient-monitoring-log.md       # Subrecipient monitoring log — site visits, desk reviews, findings (required for federal awards)
│   │       └── sam-registration-renewal.md          # SAM.gov registration renewal checklist and expiration date
│   ├── reporting-templates/
│   │   ├── progress-report-template.md              # Standard interim progress report — activities, outputs, outcomes, financial summary
│   │   ├── final-report-template.md                 # Final grant report — narrative, outcomes vs. targets, financial accounting, lessons
│   │   └── budget-variance-report-template.md       # Budget vs. actual variance explanation template for funders
│   └── past-applications/
│       ├── README.md                                 # Index of past applications — funder, year, result, reusable narrative sections
│       ├── youth-workforce-development-narrative.md  # Reusable program narrative for youth workforce grant applications
│       └── organizational-capacity-narrative.md     # Reusable organizational capacity and track record section
├── communications/
│   ├── social-calendar.md                           # Social media content calendar — platform, post date, content theme, campaign, graphic asset
│   ├── annual-report.md                             # Annual report outline and production checklist — content sections, Canva template, distribution plan
│   ├── newsletter-templates/
│   │   ├── monthly-newsletter-template.md           # Monthly donor newsletter — sections: impact story, program update, upcoming events, ask
│   │   ├── event-invitation-template.md             # Event invitation email — subject line, RSVP link placeholder, logistics
│   │   └── year-end-appeal-email-series.md          # Year-end email series — 4-email sequence with subject lines, timing, CTAs
│   └── impact-stories/
│       ├── impact-story-sop.md                      # SOP for collecting, reviewing, and publishing participant stories — consent required, privacy guidelines
│       ├── story-interview-guide.md                 # Staff guide for conducting participant story interviews — open-ended questions, release form
│       └── published-stories/
│           ├── 2025-maria-workforce-story.md        # Published impact story — anonymized or consented, program outcome illustrated
│           └── 2025-james-food-assistance-story.md
├── finance/
│   ├── budget-template.md                           # Annual operating budget template — by program, restricted vs. unrestricted, prior year actuals
│   ├── 990-prep-checklist.md                        # IRS Form 990 preparation checklist — due dates, schedules required, data to pull from QuickBooks
│   ├── audit-prep.md                                # Annual audit preparation checklist — document requests, bank reconciliations, grant drawdown confirmations
│   ├── grant-expense-tracking.md                    # Grant expense tracking SOP — QuickBooks grant codes, allocations, restricted fund rules
│   ├── fund-accounting-sop.md                       # Fund accounting SOP — restricted vs. unrestricted, temporarily restricted release, FASB ASC 958
│   └── financial-reports/
│       ├── monthly-financial-report-template.md     # Board-ready monthly financial report — budget vs. actual, YTD, narrative summary
│       └── grant-financial-report-template.md       # Funder financial report template — expenditures by budget line, balance remaining
├── board/
│   ├── board-roster.md                              # Board member roster — name, term, committee, contact, employer, giving status
│   ├── meeting-agendas/
│   │   ├── agenda-template.md                       # Standard board meeting agenda template — consent agenda, committee reports, action items
│   │   ├── 2025-01-board-agenda.md
│   │   ├── 2025-03-board-agenda.md
│   │   └── 2025-06-board-agenda.md
│   ├── resolutions/
│   │   ├── resolution-template.md                   # Board resolution template — WHEREAS/RESOLVED format, vote record
│   │   ├── 2025-01-banking-resolution.md
│   │   └── 2025-03-executive-compensation-resolution.md
│   └── committee-charters/
│       ├── finance-committee-charter.md             # Finance committee scope, membership, meeting cadence, responsibilities
│       ├── executive-committee-charter.md
│       ├── fundraising-committee-charter.md
│       └── program-committee-charter.md
└── compliance/
    ├── state-registration-tracker.md               # Charitable solicitation registration by state — expiration dates, filing fees, registered agent
    ├── conflict-of-interest-log.md                 # Annual conflict of interest disclosure log — board and key staff, per IRS 990 Schedule L
    ├── document-retention-policy.md                # IRS-compliant document retention schedule — categories, retention periods, destruction log
    ├── whistleblower-policy.md                     # Whistleblower and anti-retaliation policy — required for 990 Part VI disclosure
    └── 990-schedule-checklist/
        ├── schedule-a-checklist.md                 # Public support test — 509(a)(1) or (a)(2) calculation checklist
        ├── schedule-b-checklist.md                 # Schedule B contributors — threshold, anonymization rules, state disclosure requirements
        ├── schedule-d-checklist.md                 # Schedule D supplemental financial statements — endowment, restricted funds
        └── schedule-o-checklist.md                 # Schedule O supplemental information — governance policies, compensation explanation
```

## Key files explained

| Path | Purpose |
|---|---|
| `grants/grant-calendar.md` | Master grant deadline calendar covering all active and pipeline funders — the single most critical file for grant operations; includes funder name, award amount, application deadline, assigned writer, submission status, and report due dates |
| `.claude/commands/grant-narrative.md` | Slash command that drafts a grant proposal section (need statement, program description, evaluation plan, or sustainability) from a funder brief and program outcome data — reduces first-draft time from 4+ hours to under 30 minutes |
| `fundraising/major-gift-prospects.md` | Top 25 major gift prospect list with DonorSearch/iWave capacity ratings, relationship owner, last contact date, next cultivation step, and target ask amount — treated as confidential; never shared outside the organization |
| `finance/990-prep-checklist.md` | IRS Form 990 preparation checklist with filing deadline (4.5 months after fiscal year end, or 11/15 for calendar-year filers), required schedules by org profile, QuickBooks reports to run, and CPA handoff checklist |
| `grants/active-grants/README.md` | Inventory of all active grants with funder, award amount, grant period, restricted purpose, QuickBooks grant code, and upcoming report dates — used in monthly finance and board reports |
| `programs/[program]/participant-data-sop.md` | Per-program SOP for collecting and protecting participant personally identifiable information (PII) — defines consent requirements, Salesforce data entry procedures, access controls, and retention/destruction schedule |
| `board/board-roster.md` | Current board roster with term expiration, committee assignments, annual giving status, and employer for matching gift screening — updated after each board meeting |
| `fundraising/prospect-research/prospect-briefing-template.md` | One-page major gift prospect briefing template populated from DonorSearch/iWave — biography, philanthropic history, connection to the organization, suggested ask range, and cultivation strategy |
| `communications/impact-stories/impact-story-sop.md` | Governs the collection and publication of participant stories — consent form requirements, anonymization rules, approval workflow, and Canva asset production steps |
| `compliance/state-registration-tracker.md` | Charitable solicitation registration tracker for all states where the organization solicits — expiration dates, renewal fees, registered agent contacts, and annual filing due dates |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p nonprofit-operations

# Create .claude structure
mkdir -p nonprofit-operations/.claude/commands

# Create programs directories
mkdir -p nonprofit-operations/programs/youth-workforce-development
mkdir -p nonprofit-operations/programs/senior-food-assistance
mkdir -p nonprofit-operations/programs/financial-literacy-education
mkdir -p nonprofit-operations/programs/evaluation

# Create fundraising directories
mkdir -p nonprofit-operations/fundraising/major-gifts
mkdir -p nonprofit-operations/fundraising/annual-fund
mkdir -p nonprofit-operations/fundraising/prospect-research

# Create grants directories
mkdir -p nonprofit-operations/grants/funder-research/funder-profiles
mkdir -p nonprofit-operations/grants/active-grants
mkdir -p nonprofit-operations/grants/reporting-templates
mkdir -p nonprofit-operations/grants/past-applications

# Create communications directories
mkdir -p nonprofit-operations/communications/newsletter-templates
mkdir -p nonprofit-operations/communications/impact-stories/published-stories

# Create finance directories
mkdir -p nonprofit-operations/finance/financial-reports

# Create board directories
mkdir -p nonprofit-operations/board/meeting-agendas
mkdir -p nonprofit-operations/board/resolutions
mkdir -p nonprofit-operations/board/committee-charters

# Create compliance directories
mkdir -p nonprofit-operations/compliance/990-schedule-checklist

# Seed the grant calendar with column headers
cat > nonprofit-operations/grants/grant-calendar.md << 'EOF'
# Grant Deadline Calendar

**Updated:** [date]
**Owner:** [Grants Manager name]

| Funder | Program | Amount | Application Deadline | Assigned Writer | Status | Report Due |
|---|---|---|---|---|---|---|
| Smith Family Foundation | Youth Workforce | $50,000 | 2025-09-15 | [name] | Drafting | 2026-06-30 |
| City Arts Council | Financial Literacy | $15,000 | 2025-10-01 | [name] | Research | 2026-03-31 |

## Upcoming (next 90 days)
- [auto-populate from table above filtered by deadline]

## Report Due (next 90 days)
- [auto-populate from table above filtered by report due date]
EOF

# Seed active grants README
cat > nonprofit-operations/grants/active-grants/README.md << 'EOF'
# Active Grants Inventory

| Funder | Award Amount | Grant Period | Restricted Purpose | QuickBooks Grant Code | Next Report Due |
|---|---|---|---|---|---|
| Smith Family Foundation | $50,000 | 7/1/2025–6/30/2026 | Youth workforce stipends and staffing | GR-2025-001 | 2026-01-15 |

**Rule:** Each active grant must have its own subfolder named [funder-kebab-case]-[fiscal-year].
Subfolder must contain: grant-agreement.md, budget-narrative.md, and one file per progress/final report.
EOF

# Seed the donor confidentiality policy README
cat > nonprofit-operations/fundraising/prospect-research/prospect-research-sop.md << 'EOF'
# Prospect Research SOP

## Confidentiality policy
Prospect research data (DonorSearch ratings, iWave scores, wealth estimates) is strictly confidential.
- Do NOT share prospect profiles outside the development department without VP approval
- Do NOT store prospect data in shared Google Drive folders accessible to program staff or volunteers
- Salesforce/Bloomerang prospect records are accessible to development staff only — check role permissions quarterly
- Printed prospect briefings must be collected and shredded after board or committee meetings

## When to run a screen
- New board member prospects before nomination committee vote
- Major gift prospects with cumulative giving $5,000+
- Event attendees before personal outreach at $10,000+ capacity events
- Planned giving society inquiries

## Process
1. Export name and address list from Salesforce/Bloomerang in CSV format
2. Upload to DonorSearch batch screening portal (Settings > Batch Upload)
3. Allow 24–48 hours for results
4. Download results and import ratings back into Salesforce using the DonorSearch integration or manual field update
5. Log screening date in the prospect record
6. Flag top-rated prospects (DS Rating 5+) to Major Gifts Officer for briefing preparation
EOF

# Install nonprofit skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report
```

## CLAUDE.md template

```markdown
# Nonprofit Organization Operations — Claude Code Instructions

## What this is

This is the working directory for a nonprofit organization managing programs, fundraising, donor
relations, grant writing and reporting, board governance, and IRS compliance.

DONOR CONFIDENTIALITY RULE: Donor records, giving amounts, prospect research data (DonorSearch/iWave
ratings, wealth estimates, capacity scores), and planned giving intentions are strictly confidential.
Do not include specific donor names, gift amounts, or prospect ratings in any file that could be
accessed by volunteers, interns, or program staff. Development-sensitive files live under
fundraising/major-gift-prospects.md and fundraising/prospect-research/ — treat these as restricted.

PARTICIPANT PRIVACY RULE: Program participant names, contact information, demographic data, and
outcome records are personally identifiable information (PII). This data lives in Salesforce NPSP
or the program database — not in this workspace. Templates use bracketed placeholders only.

## Stack

- Salesforce Nonprofit Success Pack (NPSP) — donor CRM; all donor records and giving history live here
- Bloomerang — alternative CRM if used; retention scoring, engagement timeline, lapsed donor reports
- Mailchimp / Constant Contact — email campaigns, newsletter sends, event invitations, appeal sequences
- QuickBooks Nonprofit — fund accounting; grant expense codes, restricted fund tracking, 990 prep exports
- Google Workspace — Docs, Drive, Sheets, Calendar for internal collaboration and document storage
- Canva — annual report design, impact story graphics, social media assets, grant cover pages
- Zoom — board meetings, donor cultivation events, virtual program delivery
- DonorSearch / iWave — prospect wealth screening and philanthropic capacity ratings (development team only)
- Submittable / Fluxx — grant application submission portal for foundation and government funders

## Grant deadline calendar

See grants/grant-calendar.md — this is the single source of truth for all grant deadlines.
Review and update this file every Monday morning. When a new grant opportunity is confirmed:
1. Add a row to grant-calendar.md with funder, amount, deadline, assigned writer, and report due date
2. Create a subfolder under grants/active-grants/ using the naming convention [funder-kebab-case]-[fiscal-year]
3. Add the grant to grants/active-grants/README.md with the QuickBooks grant code
4. Block the submission deadline in Google Calendar 30 days and 7 days out

Key deadlines:
- IRS Form 990: due 4.5 months after fiscal year end (calendar year = May 15; with extension = November 15)
- State charitable solicitation registrations: see compliance/state-registration-tracker.md
- Annual audit: typically 3–4 months after fiscal year end — see finance/audit-prep.md

## IRS 990 prep schedule

- Month 1 after fiscal year close: Run QuickBooks reports; reconcile all grant codes; confirm restricted fund balances
- Month 2: Complete finance/990-prep-checklist.md; gather Schedule A public support data; log conflict of interest disclosures
- Month 3: Provide QuickBooks data package and supporting documents to auditors/CPA
- Month 4 (or month 10 with extension): File Form 990; post to GuideStar/Candid within 30 days of filing

## Common tasks and exact commands

### Draft a grant proposal section
```
/grant-narrative

Funder: [foundation name]
Section: [need statement / program description / evaluation plan / sustainability / organization capacity]
Program: [program name]
Funder priorities: [paste from funder guidelines or profile in grants/funder-research/funder-profiles/]
Outcomes data: [paste relevant outcome metrics from programs/[program]/outcomes-tracking.md]
Word limit: [number]
```

### Generate a donor acknowledgment letter
```
/donor-acknowledgment

Gift type: [cash / stock / in-kind / matching gift / planned gift notification]
Gift amount: $[amount] (leave blank for non-cash gifts without appraisal)
Fund/purpose: [unrestricted / [program name] restricted]
Donor type: [individual / couple / foundation / corporate]
IRS language required: [yes — no goods or services provided / yes — event ticket value was $X]
Personalization notes: [any special context — e.g., memorial gift, first-time donor, board member]
```

### Write a funder progress or final report
```
/grant-report

Funder: [foundation name]
Report type: [interim / final]
Grant period: [dates]
Approved purpose: [paste from grants/active-grants/[folder]/grant-agreement.md]
Activities completed: [paste from programs/[program]/activities.md]
Outcomes achieved vs. targets: [paste from programs/[program]/outcomes-tracking.md]
Budget summary: [expenditures vs. approved budget — from QuickBooks grant expense report]
Word limit: [number]
```

### Create a major gift prospect profile
```
/prospect-profile

Prospect name: [name]
DonorSearch rating: [1–10] / iWave score: [RFM or capacity estimate]
Prior giving to org: [amounts and years — from Salesforce/Bloomerang]
Employment: [employer, title]
Board or community connections: [known relationships to board members or staff]
Philanthropic interests: [known giving to other organizations — from 990 data or DonorSearch]
Suggested ask range: [$X–$Y]
```

### Draft an impact story from staff interview notes
```
/impact-story

Program: [program name]
Story source: [paste staff interview notes or key quotes — use participant first name or pseudonym only]
Consent status: [signed release on file / anonymized — no identifying details]
Outcomes to highlight: [which program outcomes does this story illustrate]
Intended use: [annual report / newsletter / grant application / social media]
Target word count: [150–300 / 300–500 / 500–800]
```

### Assemble a board report
```
/board-report

Report period: [month or quarter]
Program updates: [paste highlights from program directors — activities, outcomes, enrollment]
Financial summary: [paste budget vs. actual from QuickBooks monthly report]
Fundraising update: [YTD raised vs. goal, major gifts closed, upcoming events]
Grant pipeline: [paste from grants/grant-calendar.md]
Action items needed: [decisions or votes required at this meeting]
```

### Generate a donor segmentation message
```
/donor-segment

Segment: [major donors $10K+ / mid-level $1K–$9,999 / annual fund / lapsed 13–24 months / new donors]
Message type: [year-end appeal / spring campaign / event invitation / impact update / stewardship]
Campaign theme: [brief description of the campaign narrative]
Specific ask: [gift amount suggestion, upgrade amount, or event RSVP]
```

## Conventions to follow

- Grant calendar (grants/grant-calendar.md) is updated every Monday; never let a deadline pass without a 30-day alert
- Every active grant has a subfolder under grants/active-grants/ named [funder-kebab-case]-[fiscal-year]
- QuickBooks grant codes follow the format GR-[YYYY]-[###] — assign sequentially each fiscal year
- Donor acknowledgment letters must include IRS 501(c)(3) language: no goods or services were provided in exchange (or state the fair market value of any benefit received)
- Impact stories require a signed participant release form before publication — reference the file in communications/impact-stories/impact-story-sop.md
- Board meeting materials are uploaded to the board Google Drive folder at least 5 days before each meeting
- Prospect research briefings are labeled CONFIDENTIAL and not saved to shared drives accessible to non-development staff
- New funder profiles go in grants/funder-research/funder-profiles/ using the naming convention [funder-kebab-case].md
- 990 prep begins in Month 1 after fiscal year close — see finance/990-prep-checklist.md for the full schedule
```

## MCP servers

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp-server"],
      "env": {
        "SF_LOGIN_URL": "https://login.salesforce.com",
        "SF_USERNAME": "your-salesforce-username",
        "SF_PASSWORD": "your-salesforce-password",
        "SF_SECURITY_TOKEN": "your-salesforce-security-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/nonprofit-operations"
      ]
    },
    "mailchimp": {
      "command": "npx",
      "args": ["-y", "@mailchimp/mcp-server"],
      "env": {
        "MAILCHIMP_API_KEY": "your-mailchimp-api-key",
        "MAILCHIMP_SERVER_PREFIX": "us1"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/grant-calendar\"; then echo \"[grants] grant-calendar.md updated — verify all deadlines have Google Calendar events 30 days and 7 days out\"; fi'"
          },
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/active-grants\"; then echo \"[grants] Active grant file updated — confirm the QuickBooks grant code in grants/active-grants/README.md matches finance/grant-expense-tracking.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'python3 -c \"\nimport datetime, re\ntry:\n    with open(\\\"grants/grant-calendar.md\\\") as f:\n        content = f.read()\n    today = datetime.date.today()\n    lines = content.split(\\\"\\\\n\\\")\n    warnings = []\n    for line in lines:\n        dates = re.findall(r\\\"(\\\\d{4}-\\\\d{2}-\\\\d{2})\\\", line)\n        for d in dates:\n            delta = (datetime.date.fromisoformat(d) - today).days\n            if 0 < delta <= 30:\n                warnings.append(f\\\"DEADLINE IN {delta} DAYS: {line.strip()}\\\")\n    if warnings:\n        print(\\\"[grant-deadline-alert] \\\" + \\\"\\\\n\\\".join(warnings))\nexcept:\n    pass\n\" 2>/dev/null'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"fundraising/major-gift-prospects|prospect-research\"; then echo \"[confidentiality] Writing to a donor-confidential file. Confirm this file is not in a Google Drive folder shared with volunteers or program staff before proceeding.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Grant writing and reporting
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report

# Donor communications and fundraising
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/lesson-planner

# Board and governance
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/doc-site-builder

# Program management and outcomes
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/interview-scorecard
```

## Related

- [Nonprofit Operations guide](../guides/for-nonprofit-operations.md)
- [Grant writing workflow](../workflows/grant-writing-workflow.md)
- [Donor stewardship workflow](../workflows/donor-stewardship-workflow.md)
- [IRS 990 preparation workflow](../workflows/990-prep-workflow.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
