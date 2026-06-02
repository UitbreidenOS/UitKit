# Design Agency / Design Studio — Project Structure

> For design agencies managing client projects across branding, UX, and digital design — from brief intake and moodboarding through design production, async review, client handoff, and project invoicing — in a single Claude Code workspace.

## Stack

- **Design + prototyping + handoff:** Figma (components, auto-layout, dev mode, prototype flows, design tokens, Figma Sites)
- **Project management + briefs:** Notion (client databases, project wikis, creative briefs, meeting notes)
- **Task tracking:** Linear (issue-level task management, sprint cycles, priority triage) or Asana (project timelines, task dependencies, client-visible boards)
- **Time tracking:** Harvest (project-level time logging, budget burn, team capacity reports)
- **Invoicing:** FreshBooks (client invoices, retainer billing, expense tracking, payment reminders)
- **Async video review:** Loom (concept walkthroughs, revision explanations, handoff walkthroughs for developers)
- **Communication:** Slack (#client-<name> per client, #design-production, #new-business, #ops)
- **Docs + shared drives:** Google Workspace (Docs for deliverables, Slides for presentations, Drive for asset storage)

## Directory tree

```
design-agency/
├── .claude/
│   ├── CLAUDE.md                                        # Workspace instructions for Claude Code
│   ├── settings.json                                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-client.md                                # /new-client — scaffold full client directory from _template
│       ├── creative-brief.md                            # /creative-brief — generate structured creative brief from intake notes
│       ├── design-review.md                             # /design-review — produce agenda + feedback framework for design review session
│       ├── handoff.md                                   # /handoff — generate developer handoff checklist and Figma annotation guide
│       ├── revision-log.md                              # /revision-log — log a revision round with scope, rationale, and round count
│       ├── proposal.md                                  # /proposal — draft new-business project proposal from prospect notes
│       ├── ux-audit.md                                  # /ux-audit — run structured UX heuristic audit against a brief or Figma link
│       └── invoice-summary.md                          # /invoice-summary — summarize Harvest hours for FreshBooks invoice preparation
├── clients/
│   ├── _template/                                       # Master template — copy to clients/<client-slug>/ on intake
│   │   ├── brief.md                                     # Client creative brief — goals, audience, deliverables, constraints, timeline
│   │   ├── contract.md                                  # Project contract or retainer agreement with scope and payment terms
│   │   ├── brand-assets/
│   │   │   ├── brand-guidelines.md                      # Colors, typography, logo rules, tone of voice
│   │   │   ├── logo/                                    # Approved logo files: SVG, PNG, dark/light variants
│   │   │   ├── fonts/                                   # Licensed font files or Google Fonts spec
│   │   │   └── photography/                             # Approved photography style guide and approved hero images
│   │   ├── design-files-links.md                        # Links to all Figma files: main file, component library, prototype
│   │   ├── feedback-log.md                              # Timestamped log of all client feedback by round
│   │   ├── deliverables/
│   │   │   ├── _handoff-checklist.md                    # Completion checklist before handing off any deliverable
│   │   │   └── exports/                                 # Final exported assets: PNG, SVG, PDF, ZIP
│   │   └── invoice-log.md                               # Invoice history: date, amount, scope, status (paid/outstanding)
│   ├── nova-brand-co/
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── brand-assets/
│   │   │   ├── brand-guidelines.md
│   │   │   ├── logo/
│   │   │   │   ├── nova-logo-primary.svg
│   │   │   │   ├── nova-logo-dark.svg
│   │   │   │   └── nova-logo-mark.png
│   │   │   ├── fonts/
│   │   │   │   └── font-spec.md
│   │   │   └── photography/
│   │   │       └── style-guide.md
│   │   ├── design-files-links.md
│   │   ├── feedback-log.md
│   │   ├── deliverables/
│   │   │   ├── _handoff-checklist.md
│   │   │   └── exports/
│   │   │       ├── nova-brand-kit-v1.zip
│   │   │       └── nova-logo-package.zip
│   │   └── invoice-log.md
│   └── meridian-app/
│       ├── brief.md
│       ├── contract.md
│       ├── brand-assets/
│       │   ├── brand-guidelines.md
│       │   ├── logo/
│       │   └── fonts/
│       ├── design-files-links.md
│       ├── feedback-log.md
│       ├── deliverables/
│       │   ├── _handoff-checklist.md
│       │   └── exports/
│       └── invoice-log.md
├── projects/
│   ├── nova-brand-identity/                             # Active project — one directory per named project
│   │   ├── brief.md                                     # Project-specific brief (may differ from client-level brief)
│   │   ├── moodboard.md                                 # Visual references, inspiration links, style direction notes
│   │   ├── concepts/
│   │   │   ├── concept-a-modern-minimal/
│   │   │   │   ├── notes.md                             # Design rationale and presentation talking points
│   │   │   │   └── figma-link.md                        # Link to Figma frame or page for this concept
│   │   │   └── concept-b-bold-expressive/
│   │   │       ├── notes.md
│   │   │       └── figma-link.md
│   │   ├── revisions/
│   │   │   ├── round-1/
│   │   │   │   ├── client-feedback.md                   # Verbatim or summarized client feedback
│   │   │   │   ├── revision-notes.md                    # Designer notes on what changed and why
│   │   │   │   └── figma-link.md
│   │   │   └── round-2/
│   │   │       ├── client-feedback.md
│   │   │       ├── revision-notes.md
│   │   │       └── figma-link.md
│   │   └── final/
│   │       ├── approved-concept.md                      # Record of which concept was approved and approval date
│   │       ├── handoff-notes.md                         # Notes to developer or client for final delivery
│   │       └── figma-link.md
│   └── meridian-app-ux/
│       ├── brief.md
│       ├── moodboard.md
│       ├── concepts/
│       │   └── concept-a-card-based-nav/
│       │       ├── notes.md
│       │       └── figma-link.md
│       ├── revisions/
│       │   └── round-1/
│       │       ├── client-feedback.md
│       │       ├── revision-notes.md
│       │       └── figma-link.md
│       └── final/
│           ├── approved-concept.md
│           ├── handoff-notes.md
│           └── figma-link.md
├── templates/
│   ├── creative-brief.md                                # Standard creative brief: goals, audience, deliverables, timeline, constraints
│   ├── project-proposal.md                              # New-business proposal: situation, approach, team, investment, timeline
│   ├── design-review-agenda.md                          # Design review meeting agenda with structured feedback prompts
│   ├── handoff-checklist.md                             # Pre-handoff checklist: Figma cleanup, exports, annotations, dev-mode
│   └── revision-policy.md                               # Studio revision policy: what counts as a revision, round limits, out-of-scope
├── new-business/
│   ├── prospect-tracker.md                              # Pipeline of prospects: company, contact, stage, last-touch, next-action
│   ├── case-studies/
│   │   ├── nova-brand-identity.md                       # Structured case study: challenge, approach, outcome, testimonial
│   │   └── meridian-app-ux.md
│   ├── capabilities-deck.md                             # Agency capabilities overview: services, process, team, selected work
│   └── rate-card.md                                     # Hourly rates, project minimums, retainer tiers, rush premiums
└── ops/
    ├── onboarding-sop.md                                # New client onboarding: intake, kickoff, Figma setup, Slack channel, Harvest
    ├── revision-policy.md                               # Internal version of revision policy (includes escalation path)
    ├── brand-guidelines-for-agency.md                   # Agency's own brand: logo, colors, typography, voice for pitches and docs
    ├── new-hire-checklist.md                            # Designer onboarding: tool access, Figma org, Slack, Harvest, file naming
    └── offboarding-sop.md                               # Client offboarding: final asset delivery, access revocation, archive
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/new-client.md` | Slash command that copies `clients/_template/` to `clients/<slug>/`, pre-populates `brief.md` from intake answers, and creates a draft `contract.md` and `invoice-log.md` |
| `.claude/commands/creative-brief.md` | Takes client slug, project type, and intake notes as input; produces a fully structured creative brief aligned to the client's brand guidelines and business objective |
| `.claude/commands/handoff.md` | Generates a Figma dev-mode handoff checklist and annotation guide from `templates/handoff-checklist.md`; links to the client's `design-files-links.md` |
| `.claude/commands/revision-log.md` | Logs a new revision round in `projects/<project>/revisions/round-N/` with client feedback, designer notes, round count, and scope-change flag if out-of-policy |
| `clients/_template/` | Master scaffolding directory — copy this entire folder when onboarding a new client to ensure every file and folder is present before kickoff |
| `clients/<slug>/feedback-log.md` | Chronological log of all client feedback across all rounds; used to track revision history and support scope-change conversations |
| `projects/<project>/revisions/` | One subdirectory per revision round, keeping client feedback and designer notes paired with the Figma link for that round — enables clear version tracking |
| `templates/revision-policy.md` | Source of truth for what counts as a revision, how many rounds are included, and what triggers an out-of-scope fee; referenced in all proposals and contracts |
| `ops/onboarding-sop.md` | Step-by-step checklist for bringing a new client live: intake to kickoff to tool setup to first deliverable |
| `new-business/rate-card.md` | Current pricing for all service tiers; referenced by `/proposal` when calculating project investment |

## Quick scaffold

```bash
# Create workspace root
mkdir -p design-agency && cd design-agency

# Claude Code config
mkdir -p .claude/commands

# Client _template (full depth)
mkdir -p clients/_template/brand-assets/logo
mkdir -p clients/_template/brand-assets/fonts
mkdir -p clients/_template/brand-assets/photography
mkdir -p clients/_template/deliverables/exports

# Example client: nova-brand-co
mkdir -p clients/nova-brand-co/brand-assets/logo
mkdir -p clients/nova-brand-co/brand-assets/fonts
mkdir -p clients/nova-brand-co/brand-assets/photography
mkdir -p clients/nova-brand-co/deliverables/exports

# Example client: meridian-app
mkdir -p clients/meridian-app/brand-assets/logo
mkdir -p clients/meridian-app/brand-assets/fonts
mkdir -p clients/meridian-app/deliverables/exports

# Active projects
mkdir -p projects/nova-brand-identity/concepts/concept-a-modern-minimal
mkdir -p projects/nova-brand-identity/concepts/concept-b-bold-expressive
mkdir -p projects/nova-brand-identity/revisions/round-1
mkdir -p projects/nova-brand-identity/revisions/round-2
mkdir -p projects/nova-brand-identity/final

mkdir -p projects/meridian-app-ux/concepts/concept-a-card-based-nav
mkdir -p projects/meridian-app-ux/revisions/round-1
mkdir -p projects/meridian-app-ux/final

# Templates
mkdir -p templates

# New business
mkdir -p new-business/case-studies

# Operations
mkdir -p ops

# Initialize Claude config files
touch .claude/CLAUDE.md
touch .claude/settings.json

# Create _template placeholder files
touch clients/_template/brief.md
touch clients/_template/contract.md
touch clients/_template/brand-assets/brand-guidelines.md
touch clients/_template/design-files-links.md
touch clients/_template/feedback-log.md
touch clients/_template/deliverables/_handoff-checklist.md
touch clients/_template/invoice-log.md

# Create template files
touch templates/creative-brief.md
touch templates/project-proposal.md
touch templates/design-review-agenda.md
touch templates/handoff-checklist.md
touch templates/revision-policy.md

# New business files
touch new-business/prospect-tracker.md
touch new-business/capabilities-deck.md
touch new-business/rate-card.md

# Ops files
touch ops/onboarding-sop.md
touch ops/revision-policy.md
touch ops/brand-guidelines-for-agency.md
touch ops/new-hire-checklist.md
touch ops/offboarding-sop.md

# Install relevant skills
npx claudient add skill product/ux-audit
npx claudient add skill product/persona-builder
npx claudient add skill marketing/brand-guidelines
npx claudient add skill productivity/creative-brief
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/stakeholder-report

# Install slash commands
npx claudient add command new-client
npx claudient add command creative-brief
npx claudient add command design-review
npx claudient add command handoff
npx claudient add command revision-log
npx claudient add command proposal
npx claudient add command ux-audit
npx claudient add command invoice-summary

echo "Design agency workspace ready."
```

## CLAUDE.md template

```markdown
# Design Agency — Claude Instructions

## What this is

This workspace manages a design studio's full client lifecycle: intake, creative briefing,
concept development, revision tracking, async review (Loom), developer handoff (Figma dev
mode), and project billing (Harvest + FreshBooks). Each client has an isolated directory
under clients/. Active projects live under projects/. All document templates are in
templates/. Ops documentation is in ops/.

## Stack

- Design: Figma (main design tool, component libraries, prototypes, dev-mode handoff)
- Project management: Notion (project wikis, creative briefs, client databases, meeting notes)
- Task tracking: Linear (sprint issues, bug triage, design QA tasks)
- Time tracking: Harvest (per-project, billable vs non-billable, budget burn alerts)
- Invoicing: FreshBooks (client invoices, retainer billing, expense tracking)
- Async review: Loom (concept walkthroughs, revision explanations, handoff walkthroughs)
- Communication: Slack (#client-<slug> per client, #design-production, #new-business, #ops)
- Docs + assets: Google Workspace (Slides for presentations, Drive for final asset delivery)

## Directory conventions

- clients/<client-slug>/ — all client-level files; never mix assets across client folders
- clients/<client-slug>/brand-assets/ — source of truth for approved logos, colors, fonts
- clients/<client-slug>/feedback-log.md — append every feedback round here with date and round number
- clients/<client-slug>/invoice-log.md — append every invoice with date, amount, scope, status
- projects/<project-name>/ — one directory per named project deliverable (not per client)
- projects/<project>/revisions/round-N/ — one subdirectory per revision round
- projects/<project>/final/ — populated only after client approval; do not put drafts here
- templates/ — canonical document structures; always copy a template before drafting
- new-business/ — prospect tracking, proposals, and case studies only; no active client work here

## Onboarding a new client

1. Copy clients/_template/ to clients/<new-client-slug>/:
   cp -r clients/_template clients/<new-client-slug>
2. Run /new-client client="<Name>" slug="<slug>" project-type="<branding|ux|digital>"
3. Complete clients/<slug>/brief.md from the intake call before the kickoff meeting
4. After kickoff, populate clients/<slug>/brand-assets/brand-guidelines.md
5. Draft contract using templates/project-proposal.md scope section; save to clients/<slug>/contract.md
6. Add client Figma file links to clients/<slug>/design-files-links.md immediately on project creation
7. Create Harvest project and log project ID in clients/<slug>/brief.md
8. Open FreshBooks client record and link to clients/<slug>/invoice-log.md

## Starting a new project

1. Create projects/<project-name>/ from scratch or copy an existing project structure
2. Run /creative-brief client="<slug>" project="<project-name>" type="<branding|ux|digital>"
3. Populate projects/<project-name>/moodboard.md with Figma frame links and reference URLs
4. Build concepts under projects/<project-name>/concepts/concept-<letter>-<short-label>/
5. Each concept directory needs: notes.md (rationale + talking points) and figma-link.md

## Design review workflow

1. Run /design-review project="<project-name>" round="<N>" concepts="<list>"
2. Use generated agenda from templates/design-review-agenda.md for the Loom walkthrough
3. Record Loom video and share link in Slack #client-<slug>
4. After call or async review, append feedback verbatim to clients/<slug>/feedback-log.md
5. Run /revision-log project="<project-name>" round="<N>" to open the revision directory

## Revision management

- Each round gets its own directory: projects/<project>/revisions/round-N/
- Log client feedback in round-N/client-feedback.md before making any changes
- After revisions, document what changed in round-N/revision-notes.md
- Check templates/revision-policy.md (and ops/revision-policy.md) before starting round 3+
- Out-of-policy requests: discuss scope before logging time; draft an amendment if needed

## Handoff workflow

1. Run /handoff project="<project-name>" client="<slug>" to generate the handoff checklist
2. Complete every item in deliverables/_handoff-checklist.md before marking delivery done
3. Figma handoff: enable dev mode on all final frames, name all layers, add redline annotations
4. Export final assets to clients/<slug>/deliverables/exports/ (PNG 1x/2x, SVG, PDF)
5. Record a Loom walkthrough of the Figma file for the receiving developer or client
6. Share Google Drive folder link for assets; confirm access before closing the project

## Billing conventions

- Log time in Harvest immediately after each work session — never batch at end of week
- Billable codes: discovery, strategy, design-production, revisions, handoff, account-management
- Non-billable: internal critique, tooling setup, admin, pitch work (unless proposal is won)
- Run /invoice-summary client="<slug>" month="<YYYY-MM>" before generating FreshBooks invoice
- Invoice on project milestone completion or on the 1st of the month for retainer clients
- Append every sent invoice to clients/<slug>/invoice-log.md with date, amount, and status

## Figma file naming conventions

- Main file: [Client Name] — [Project Name] — Design
- Component library: [Client Name] — Component Library
- Prototype: [Client Name] — [Project Name] — Prototype
- Archived file: [Client Name] — [Project Name] — ARCHIVED YYYY-MM
- Always record all file links in clients/<slug>/design-files-links.md on creation
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
        "/Users/${USER}/design-agency"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_TOKEN": "${NOTION_API_TOKEN}"
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
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */projects/*/revisions/*/client-feedback.md ]]; then echo \"[hook] Revision feedback logged: $FILE — run /revision-log to open designer notes and update feedback-log.md\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */projects/*/final/approved-concept.md ]]; then echo \"[hook] Concept approved: $FILE — run /handoff to generate the developer handoff checklist\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find clients/ -mindepth 1 -maxdepth 1 -type d ! -name _template | while read C; do [ ! -f \"$C/design-files-links.md\" ] || grep -q \"figma.com\" \"$C/design-files-links.md\" 2>/dev/null || echo \"$C\"; done | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[reminder] $MISSING client(s) missing Figma links in design-files-links.md\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill product/ux-audit
npx claudient add skill product/persona-builder
npx claudient add skill marketing/brand-guidelines
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
```

## Related

- [Guide: Claude for UX Designers](../guides/for-ux-designer.md)
- [Workflow: Client Project Kickoff to Handoff](../workflows/design-project-lifecycle.md)
- [Workflow: Design Review and Revision Cycle](../workflows/design-review-cycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
