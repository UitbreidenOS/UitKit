# Email Marketer Workspace — Project Structure

> For an email marketer managing lifecycle programs, campaigns, and deliverability — covering sequence design, A/B testing, list hygiene, and performance reporting across Klaviyo, Mailchimp, or ActiveCampaign.

## Stack

- **Klaviyo** or **Mailchimp** or **ActiveCampaign** — ESP of record: campaign sends, flow/automation builder, list segmentation, engagement tracking
- **Litmus** — Email rendering across 100+ clients, spam filter testing, deliverability scoring, preflight checklist
- **Google Analytics 4** — UTM attribution, conversion tracking, revenue per email, post-click behavior
- **Figma** — Design handoffs, annotated template specs, brand asset exports for dev-ready HTML
- **Slack** — Campaign review threads, launch approvals, deliverability incident channels
- **Notion** — Campaign calendar, content briefs, stakeholder approvals, retrospective notes
- **Claude Code** — Sequence drafting, A/B hypothesis generation, copy variants, performance narrative, list hygiene scripts

## Directory tree

```
email-marketer-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Workspace instructions (paste the template below)
│   ├── settings.json                              # MCP servers, hooks, permissions
│   └── commands/
│       ├── email-draft.md                         # /email-draft — takes segment + goal, returns subject + body + CTA copy
│       ├── ab-test-setup.md                       # /ab-test-setup — hypothesis, variant specs, sample size, success metric
│       ├── sequence-builder.md                    # /sequence-builder — full multi-email flow with timing and branch logic
│       ├── deliverability-check.md                # /deliverability-check — pre-send checklist: SPF/DKIM, list health, content flags
│       ├── performance-report.md                  # /performance-report — narrative summary of campaign or monthly metrics
│       ├── re-engagement.md                       # /re-engagement — win-back sequence for lapsed subscribers
│       └── list-clean.md                          # /list-clean — suppression criteria, segment rules, sunset policy
├── campaigns/
│   ├── _template/                                 # Copy this when briefing any one-off send
│   │   ├── brief.md                               # Campaign brief: goal, audience, offer, timeline, success metric
│   │   ├── copy.md                                # Final approved subject line, preheader, body, CTA
│   │   └── results.md                             # Post-send results: opens, clicks, conversions, revenue
│   ├── 2026-06-product-launch/
│   │   ├── brief.md                               # Campaign brief for June product launch
│   │   ├── copy.md                                # Final copy — subject: "Introducing [Feature]"
│   │   ├── copy-variants.md                       # A/B subject line variants tested before send
│   │   ├── litmus-report.md                       # Litmus preflight — rendering results, spam score
│   │   └── results.md                             # 34.2% open rate, 4.1% CTR, $12,400 attributed revenue
│   ├── 2026-05-flash-sale/
│   │   ├── brief.md
│   │   ├── copy.md
│   │   ├── litmus-report.md
│   │   └── results.md
│   └── 2026-04-spring-promo/
│       ├── brief.md
│       ├── copy.md
│       └── results.md
├── sequences/
│   ├── welcome/
│   │   ├── sequence-map.md                        # Flow diagram: triggers, timing, branch logic, exit conditions
│   │   ├── email-1-welcome.md                     # Day 0: welcome + value prop, sent immediately on signup
│   │   ├── email-2-quick-win.md                   # Day 2: first action nudge, highlights one key feature
│   │   ├── email-3-social-proof.md                # Day 5: testimonials, case study, trust signals
│   │   └── results-log.md                         # Running performance by email: open/click/unsubscribe rates
│   ├── onboarding/
│   │   ├── sequence-map.md                        # Trigger: account created; exits on first key action
│   │   ├── email-1-setup-guide.md                 # Day 1: step-by-step setup, inline CTA to complete profile
│   │   ├── email-2-activation-nudge.md            # Day 3: sent only if setup not completed — urgency angle
│   │   ├── email-3-feature-spotlight.md           # Day 7: highlight top feature for new users
│   │   ├── email-4-milestone.md                   # Day 14: celebrate first action, introduce next milestone
│   │   └── results-log.md
│   ├── nurture/
│   │   ├── sequence-map.md                        # Bi-weekly cadence for engaged non-converters
│   │   ├── email-1-education.md                   # Industry insight, no product push
│   │   ├── email-2-use-case.md                    # Customer story aligned to segment pain point
│   │   ├── email-3-objection-handler.md           # Addresses top 3 conversion objections
│   │   ├── email-4-soft-cta.md                    # Low-friction offer: free trial extension, webinar invite
│   │   └── results-log.md
│   ├── win-back/
│   │   ├── sequence-map.md                        # Trigger: no open/click in 90 days
│   │   ├── email-1-we-miss-you.md                 # Tone: warm, low-pressure, no discount yet
│   │   ├── email-2-whats-new.md                   # Product updates or content they missed
│   │   ├── email-3-incentive.md                   # Discount or exclusive offer to re-engage
│   │   └── results-log.md
│   └── sunset/
│       ├── sequence-map.md                        # Trigger: no engagement after win-back sequence
│       ├── email-1-last-chance.md                 # Final keep/remove ask — explicit opt-in confirmation
│       └── suppression-criteria.md                # Rules for moving to suppression list after no response
├── a-b-tests/
│   ├── _template/
│   │   ├── hypothesis.md                          # One-sentence hypothesis, variable being tested, control vs. variant
│   │   └── results.md                             # Winning variant, lift, confidence level, decision
│   ├── 2026-q2-subject-line-length/
│   │   ├── hypothesis.md                          # H: shorter subjects (<40 chars) outperform longer on mobile
│   │   └── results.md                             # Variant B won, +6.3% open rate, 97% confidence — adopt in welcome flow
│   ├── 2026-q2-cta-copy/
│   │   ├── hypothesis.md                          # H: action-oriented CTA ("Start free") beats passive ("Learn more")
│   │   └── results.md                             # No statistically significant difference — retest with larger sample
│   └── 2026-q1-send-time/
│       ├── hypothesis.md
│       └── results.md
├── templates/
│   ├── headers/
│   │   ├── header-promo.html                      # Promotional campaign header — logo + offer banner
│   │   ├── header-transactional.html              # Clean header for receipts, confirmations, alerts
│   │   └── header-newsletter.html                 # Newsletter header — logo + date + issue number
│   ├── ctas/
│   │   ├── cta-primary.html                       # Primary button — brand color, max contrast, 44px tap target
│   │   ├── cta-secondary.html                     # Ghost/outline button for secondary actions
│   │   └── cta-text-link.html                     # Plain text link CTA for plain-text fallback
│   ├── footers/
│   │   ├── footer-full.html                       # Full footer: unsubscribe, address, social links, legal
│   │   ├── footer-minimal.html                    # Minimal footer for transactional/system emails
│   │   └── footer-gdpr.html                       # GDPR-compliant footer with preference center link
│   └── layouts/
│       ├── single-column.html                     # Standard single-column layout, mobile-first
│       ├── two-column.html                        # Two-column grid — image left, copy right
│       └── plain-text.md                          # Plain-text template with variable placeholders
├── compliance/
│   ├── unsubscribe-sop.md                         # Unsubscribe handling SOP: 10-day rule, suppression sync, audit log
│   ├── gdpr-checklist.md                          # GDPR compliance checklist: consent, data minimization, right to erasure
│   ├── can-spam-checklist.md                      # CAN-SPAM requirements: sender ID, subject honesty, opt-out mechanism
│   ├── casl-checklist.md                          # CASL requirements for Canadian subscribers
│   └── consent-records/
│       └── consent-log-template.md                # Template for documenting consent acquisition method per list source
├── reports/
│   ├── monthly/
│   │   ├── 2026-05-performance.md                 # May: 28.1% avg open rate, 3.4% CTR, $48K attributed revenue
│   │   ├── 2026-04-performance.md
│   │   └── _template.md                           # Monthly dashboard template: KPIs, list health, top campaigns
│   ├── quarterly/
│   │   ├── 2026-q1-review.md                      # Q1 summary: list growth, deliverability trends, top sequences
│   │   └── _template.md                           # Quarterly review template with benchmarks and YoY deltas
│   └── deliverability/
│       ├── bounce-log.md                          # Monthly hard/soft bounce rates, action taken per spike
│       ├── spam-complaint-log.md                  # Complaint rate by campaign — flag any above 0.08%
│       └── domain-reputation-log.md               # Monthly sender score, Google Postmaster domain/IP reputation
└── scratch/
    ├── copy-drafts.md                             # In-progress copy before it moves to campaigns/ or sequences/
    └── ideas.md                                   # Unvetted campaign ideas, test hypotheses, audience observations
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/email-draft.md` | Slash command that takes a segment description and campaign goal, returns a complete email with subject line, preheader, body copy, and CTA — ready for Litmus preflight |
| `.claude/commands/ab-test-setup.md` | Slash command that generates a structured A/B test: one-sentence hypothesis, control vs. variant spec, minimum sample size calculation, and primary success metric |
| `.claude/commands/sequence-builder.md` | Slash command that produces a full multi-email lifecycle flow with email-by-email goals, timing logic, branch conditions, and exit criteria |
| `.claude/commands/deliverability-check.md` | Slash command that runs a pre-send deliverability checklist: SPF/DKIM status, list engagement health, content spam triggers, unsubscribe link presence |
| `.claude/commands/performance-report.md` | Slash command that takes raw metrics and returns a narrative performance summary with trend callouts and next-action recommendations |
| `sequences/welcome/sequence-map.md` | Source of truth for the welcome flow — trigger conditions, timing, branch logic, and exit conditions; updated whenever the flow is modified in the ESP |
| `compliance/unsubscribe-sop.md` | Step-by-step SOP for processing unsubscribes: 10-business-day requirement, suppression list sync across ESPs, monthly audit log |
| `reports/deliverability/spam-complaint-log.md` | Monthly log of complaint rates per campaign — any rate above 0.08% triggers a review; feeds into domain reputation monitoring |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p email-marketer-workspace

# Create .claude structure
mkdir -p email-marketer-workspace/.claude/commands

# Create campaign directories
mkdir -p email-marketer-workspace/campaigns/_template
mkdir -p email-marketer-workspace/campaigns/2026-06-product-launch
mkdir -p email-marketer-workspace/campaigns/2026-05-flash-sale

# Create sequence directories
mkdir -p email-marketer-workspace/sequences/welcome
mkdir -p email-marketer-workspace/sequences/onboarding
mkdir -p email-marketer-workspace/sequences/nurture
mkdir -p email-marketer-workspace/sequences/win-back
mkdir -p email-marketer-workspace/sequences/sunset

# Create A/B test directories
mkdir -p email-marketer-workspace/a-b-tests/_template
mkdir -p email-marketer-workspace/a-b-tests/2026-q2-subject-line-length
mkdir -p email-marketer-workspace/a-b-tests/2026-q2-cta-copy

# Create template module directories
mkdir -p email-marketer-workspace/templates/headers
mkdir -p email-marketer-workspace/templates/ctas
mkdir -p email-marketer-workspace/templates/footers
mkdir -p email-marketer-workspace/templates/layouts

# Create compliance directory
mkdir -p email-marketer-workspace/compliance/consent-records

# Create report directories
mkdir -p email-marketer-workspace/reports/monthly
mkdir -p email-marketer-workspace/reports/quarterly
mkdir -p email-marketer-workspace/reports/deliverability

# Create scratch directory
mkdir -p email-marketer-workspace/scratch

# Seed placeholder files
touch email-marketer-workspace/campaigns/_template/brief.md
touch email-marketer-workspace/campaigns/_template/copy.md
touch email-marketer-workspace/campaigns/_template/results.md
touch email-marketer-workspace/a-b-tests/_template/hypothesis.md
touch email-marketer-workspace/a-b-tests/_template/results.md
touch email-marketer-workspace/reports/monthly/_template.md
touch email-marketer-workspace/reports/quarterly/_template.md

# Install email marketing skills
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/email-deliverability
npx claudient add skill marketing/email-ab-tester
npx claudient add skill small-business/email-campaign

# Copy command stubs into .claude/commands/
npx claudient add skill marketing/email-sequence --output email-marketer-workspace/.claude/commands/email-draft.md
npx claudient add skill marketing/email-ab-tester --output email-marketer-workspace/.claude/commands/ab-test-setup.md
npx claudient add skill marketing/email-sequence --output email-marketer-workspace/.claude/commands/sequence-builder.md
npx claudient add skill marketing/email-deliverability --output email-marketer-workspace/.claude/commands/deliverability-check.md
npx claudient add skill small-business/email-campaign --output email-marketer-workspace/.claude/commands/performance-report.md
```

## CLAUDE.md template

```markdown
# Email Marketer Workspace — Claude Code Instructions

## What this is

This is the working directory for an email marketer managing lifecycle programs, campaigns,
A/B tests, list hygiene, and deliverability. Campaigns are documented in campaigns/, lifecycle
sequences live in sequences/, test records in a-b-tests/, reusable HTML modules in templates/,
compliance SOPs in compliance/, and monthly dashboards in reports/. All copy drafting, sequence
building, A/B test structuring, and performance narrative generation runs through Claude Code skills.

## Stack

- Klaviyo / Mailchimp / ActiveCampaign — ESP of record; flows and campaign sends
- Litmus — Pre-send rendering and deliverability preflight
- Google Analytics 4 — UTM attribution and post-click conversion tracking
- Figma — Design handoffs and annotated template specs
- Slack — Campaign approvals and deliverability incident channels
- Notion — Campaign calendar, content briefs, stakeholder sign-offs

## Common tasks and exact commands

### Draft a campaign email
```
/email-draft

Segment: [describe the audience — e.g., "trial users who have not activated in 7 days"]
Goal: [conversion objective — e.g., "get them to complete profile setup"]
Offer: [if any — discount, free resource, feature unlock]
Tone: [brand voice descriptor — e.g., "warm, direct, no fluff"]
Max length: [word count or scroll depth target]
```

### Set up an A/B test
```
/ab-test-setup

What we are testing: [subject line / CTA copy / send time / layout / offer]
Hypothesis: [if we change X, we expect Y because Z]
Control: [current version verbatim]
Variant: [proposed change verbatim]
List size available: [number of contacts in segment]
Primary metric: [open rate / CTR / conversion rate / revenue per email]
Confidence threshold: [95% standard or specify]
```

### Build a lifecycle sequence
```
/sequence-builder

Sequence type: [welcome / onboarding / nurture / win-back / sunset]
Trigger: [what event starts the flow — e.g., "signup", "90 days no engagement"]
Audience: [describe the segment]
Goal: [what success looks like — activation, purchase, re-engagement]
Emails needed: [number]
Cadence: [timing between emails — e.g., "day 0, day 3, day 7, day 14"]
Exit condition: [what removes someone from the flow early]
```

### Run a pre-send deliverability check
```
/deliverability-check

Campaign name: [what you are about to send]
Segment: [who is receiving it — list name or segment definition]
List age: [when was this list last cleaned?]
Engagement window: [what is the active engagement window for this segment?]
From domain: [sending domain — e.g., email.company.com]
Content concerns: [any elements that might trigger spam filters — e.g., heavy images, urgency words]
```

### Generate a performance report
```
/performance-report

Period: [month, quarter, or campaign name]
Sends: [number of emails sent]
Open rate: [X%] — industry benchmark: [Y%]
CTR: [X%] — industry benchmark: [Y%]
Unsubscribe rate: [X%]
Bounce rate: [X%]
Revenue attributed: [$X] via [GA4 / ESP attribution]
Top performer: [campaign or sequence with best results]
Concern: [metric or trend that needs attention]
```

### Write a re-engagement sequence
```
/re-engagement

Lapsed definition: [e.g., "no open or click in 90 days"]
Segment size: [contacts eligible]
Last product update relevant to them: [feature, offer, or content they missed]
Incentive available: [discount / exclusive content / none]
Emails in sequence: [2 or 3]
Sunset after: [how many emails with no response before suppression]
```

### Run a list clean
```
/list-clean

Total list size: [number]
Last cleaned: [date]
Current bounce rate: [X%]
Engagement window for active definition: [e.g., "opened in last 180 days"]
Segments to suppress: [bounced, complained, unengaged beyond X days]
Compliance requirement: [GDPR / CAN-SPAM / CASL — note which apply]
```

## Conventions to follow

- Every campaign must have brief.md completed and approved before copy.md is drafted
- Save final approved copy to campaigns/<name>/copy.md before uploading to the ESP
- Litmus preflight results go into campaigns/<name>/litmus-report.md — do not send without a passing report
- A/B test hypotheses are logged in a-b-tests/<name>/hypothesis.md before the test is created in the ESP
- Results are documented in a-b-tests/<name>/results.md within 48 hours of statistical significance
- Sequence changes must be reflected in sequences/<name>/sequence-map.md before editing the ESP flow
- Compliance checklists in compliance/ are reviewed before any list import or new flow launch
- Unsubscribe requests are processed per the SOP in compliance/unsubscribe-sop.md — 10-business-day maximum
- Monthly performance dashboards are filed in reports/monthly/YYYY-MM-performance.md by the 5th of each month
- Any spam complaint rate above 0.08% is logged in reports/deliverability/spam-complaint-log.md with root cause
```

## MCP servers

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "pk_your-klaviyo-private-api-key"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@slack/mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-slack-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/email-marketer-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"campaigns/.*/copy\\.md\"; then echo \"[hook] Campaign copy saved — run /deliverability-check before uploading to ESP, then complete campaigns/$(basename $(dirname $CLAUDE_TOOL_INPUT_FILE_PATH))/litmus-report.md\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"a-b-tests/.*/results\\.md\"; then echo \"[hook] A/B results logged — if a winner emerged, update the relevant sequence or campaign template to adopt the winning variant\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DAY=$(date +%d); if [ \"$DAY\" = \"01\" ]; then echo \"[reminder] First of the month — file reports/monthly/$(date -v-1m +%Y-%m)-performance.md and update reports/deliverability/bounce-log.md and spam-complaint-log.md\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core email marketing skills
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/email-deliverability
npx claudient add skill marketing/email-ab-tester
npx claudient add skill small-business/email-campaign

# Install all marketing skills at once
npx claudient add skills marketing
```

## Related

- [Email marketer guide](../guides/for-email-marketer.md)
- [Lifecycle sequence workflow](../workflows/lifecycle-sequence-build.md)
- [Deliverability incident workflow](../workflows/deliverability-incident-response.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
