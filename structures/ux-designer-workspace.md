# UX Designer Workspace — Project Structure

> For UX designers running end-to-end research, interaction design, prototyping, and developer handoff — optimizing the full loop from user interview to shipped spec.

## Stack

- **Design + prototyping + handoff:** Figma (desktop app + Dev Mode)
- **Research repository:** Dovetail — tagging, synthesis, insight tracking
- **Usability testing:** Maze (unmoderated) or UserTesting (moderated)
- **Research docs + project notes:** Notion
- **Workshops + journey maps:** Miro
- **Design system documentation:** Zeroheight
- **Communication:** Slack
- **Version control:** Git + GitHub (for this workspace, linked specs, and CLAUDE.md)

## Directory tree

```
my-ux-workspace/
├── .claude/
│   ├── commands/                          # slash commands available in this project
│   │   ├── ux-audit.md                    # /ux-audit <product-area> — heuristic + accessibility audit
│   │   ├── research-plan.md               # /research-plan — draft study plan, screener, discussion guide
│   │   ├── persona-update.md              # /persona-update — update persona from new research signals
│   │   ├── usability-test.md              # /usability-test — draft test script, tasks, success metrics
│   │   ├── design-critique.md             # /design-critique — structured critique against design principles
│   │   ├── accessibility-check.md         # /accessibility-check — WCAG 2.2 AA audit for a given flow
│   │   └── handoff-checklist.md           # /handoff-checklist — generate dev handoff checklist per feature
│   ├── settings.json                      # hooks, MCP server refs, permissions
│   └── mcp.json                           # MCP server configs (figma, notion, slack)
├── research/                              # all primary research, organised by round
│   ├── round-01-onboarding/               # naming: round-<NN>-<topic>
│   │   ├── screener.md                    # participant screener criteria and questions
│   │   ├── discussion-guide.md            # moderator guide with probes and tasks
│   │   ├── participants.md                # anonymised participant roster (P01–P08)
│   │   ├── sessions/
│   │   │   ├── P01-interview-notes.md     # raw notes per participant
│   │   │   ├── P02-interview-notes.md
│   │   │   ├── P03-interview-notes.md
│   │   │   └── P04-interview-notes.md
│   │   ├── survey-results.csv             # Maze or UserTesting export (if applicable)
│   │   └── synthesis/
│   │       ├── affinity-clusters.md       # tagged themes from Dovetail export
│   │       ├── key-findings.md            # top 5–8 findings with evidence quotes
│   │       └── opportunity-areas.md       # HMW statements derived from findings
│   ├── round-02-checkout-flow/
│   │   ├── screener.md
│   │   ├── discussion-guide.md
│   │   ├── participants.md
│   │   ├── sessions/
│   │   │   ├── P01-interview-notes.md
│   │   │   └── P02-interview-notes.md
│   │   └── synthesis/
│   │       ├── affinity-clusters.md
│   │       ├── key-findings.md
│   │       └── opportunity-areas.md
│   └── competitive/                       # competitor teardowns
│       ├── competitor-teardown-stripe.md  # structured teardown: flows, patterns, strengths, gaps
│       └── competitor-teardown-square.md
├── personas/                              # user personas and jobs-to-be-done
│   ├── persona-maya-growth-lead.md        # primary persona — updated as research accumulates
│   ├── persona-alex-ops-manager.md        # secondary persona
│   ├── persona-riley-end-user.md          # tertiary persona
│   ├── jobs-to-be-done.md                 # JTBD statements mapped to each persona
│   └── persona-changelog.md              # log of when and why each persona was revised
├── journey-maps/                          # experience maps — current and future state
│   ├── current-state/
│   │   ├── onboarding-journey-current.md  # current state map with pain points and moments of delight
│   │   ├── checkout-journey-current.md
│   │   └── settings-journey-current.md
│   └── future-state/
│       ├── onboarding-journey-future.md   # aspirational flow post-redesign
│       └── checkout-journey-future.md
├── wireframes/                            # Figma file links and annotation docs
│   ├── onboarding-flow/
│   │   ├── figma-link.md                  # canonical Figma URL + last-updated date
│   │   ├── annotations.md                 # screen-by-screen annotations for devs
│   │   └── design-decisions.md           # why key decisions were made (not just what)
│   ├── checkout-flow/
│   │   ├── figma-link.md
│   │   ├── annotations.md
│   │   └── design-decisions.md
│   ├── settings-redesign/
│   │   ├── figma-link.md
│   │   ├── annotations.md
│   │   └── design-decisions.md
│   └── explorations/                      # early-stage, unpolished concepts
│       ├── nav-restructure-v1.md
│       └── dashboard-widget-concepts.md
├── usability-tests/                       # moderated and unmoderated test artefacts
│   ├── 2026-05-onboarding-maze/
│   │   ├── test-plan.md                   # goals, methodology, participant criteria
│   │   ├── task-scripts.md                # exact task prompts given to participants
│   │   ├── session-notes/
│   │   │   ├── P01-session.md
│   │   │   └── P02-session.md
│   │   ├── maze-export.csv                # raw completion rates, click maps, time-on-task
│   │   └── findings-report.md            # findings ranked by severity, with design recommendations
│   ├── 2026-03-checkout-usertesting/
│   │   ├── test-plan.md
│   │   ├── task-scripts.md
│   │   ├── session-notes/
│   │   │   ├── P01-session.md
│   │   │   └── P02-session.md
│   │   └── findings-report.md
│   └── templates/
│       ├── test-plan-template.md          # reusable test plan scaffold
│       ├── task-script-template.md        # standard task prompt format
│       └── findings-report-template.md    # severity-ranked findings format
├── design-system/                         # component documentation and decision history
│   ├── components/
│   │   ├── button.md                      # usage rules, variants, do/don't examples, Figma link
│   │   ├── form-inputs.md
│   │   ├── modal.md
│   │   ├── navigation.md
│   │   ├── data-table.md
│   │   └── toast-notifications.md
│   ├── foundations/
│   │   ├── color.md                       # color tokens, contrast ratios, usage rules
│   │   ├── typography.md                  # type scale, usage guidance, accessibility notes
│   │   ├── spacing.md                     # spacing scale and when to deviate
│   │   ├── icons.md                       # icon library source, naming conventions
│   │   └── motion.md                      # animation principles, duration tokens, reduced motion
│   ├── patterns/
│   │   ├── empty-states.md               # when, what content, CTA guidance
│   │   ├── error-handling.md             # error types, message writing, recovery patterns
│   │   └── loading-states.md             # skeleton screens, spinners, progressive disclosure
│   ├── decision-log.md                    # ADR-style record of design system decisions
│   └── zeroheight-link.md                # canonical Zeroheight URL for published system docs
├── handoff/                               # per-feature dev handoff packages
│   ├── feature-onboarding-v2/
│   │   ├── figma-link.md                  # Dev Mode link to the specific Figma frame
│   │   ├── spec-annotations.md           # component specs, spacing, states, interactions
│   │   ├── edge-cases.md                 # empty states, errors, loading, permission edge cases
│   │   ├── acceptance-criteria.md        # testable criteria for QA and engineering sign-off
│   │   └── open-questions.md             # unresolved questions that need eng input
│   ├── feature-checkout-redesign/
│   │   ├── figma-link.md
│   │   ├── spec-annotations.md
│   │   ├── edge-cases.md
│   │   ├── acceptance-criteria.md
│   │   └── open-questions.md
│   └── templates/
│       ├── spec-annotations-template.md  # scaffold for new handoff packages
│       └── acceptance-criteria-template.md
├── .env.example                           # Figma token, Notion token — never commit .env
└── CLAUDE.md                              # project instructions for Claude Code
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/ux-audit.md` | Slash command that takes a product area, runs a heuristic evaluation against Nielsen's 10 and WCAG 2.2 AA, and outputs a severity-ranked finding list |
| `.claude/commands/handoff-checklist.md` | Generates a per-feature checklist covering spec annotations, edge cases, acceptance criteria, accessibility notes, and open questions |
| `research/round-<NN>-<topic>/synthesis/key-findings.md` | Primary deliverable from each research round — 5–8 findings with supporting evidence quotes and confidence levels |
| `personas/persona-changelog.md` | Auditable log of every persona revision, which research round triggered it, and what changed — prevents persona drift |
| `usability-tests/templates/findings-report-template.md` | Standard severity-ranked findings format (Critical / Major / Minor / Observation) with design recommendation column |
| `design-system/decision-log.md` | ADR-style record of why design system decisions were made — essential context for future component changes |
| `handoff/feature-<name>/acceptance-criteria.md` | Testable, unambiguous criteria for engineering and QA — each criterion maps to a specific interaction or state |
| `wireframes/<flow>/design-decisions.md` | Documents the reasoning behind key design choices — not a description of the design, but the why behind it |

## Quick scaffold

```bash
# Create the workspace directory and enter it
mkdir my-ux-workspace && cd my-ux-workspace
git init

# Create Claude Code config directories and command files
mkdir -p .claude/commands

# Touch all slash command files
touch .claude/commands/ux-audit.md
touch .claude/commands/research-plan.md
touch .claude/commands/persona-update.md
touch .claude/commands/usability-test.md
touch .claude/commands/design-critique.md
touch .claude/commands/accessibility-check.md
touch .claude/commands/handoff-checklist.md

# Research directory — first two rounds as scaffold
mkdir -p research/round-01-onboarding/sessions
mkdir -p research/round-01-onboarding/synthesis
mkdir -p research/round-02-checkout-flow/sessions
mkdir -p research/round-02-checkout-flow/synthesis
mkdir -p research/competitive
touch research/round-01-onboarding/{screener.md,discussion-guide.md,participants.md}
touch research/round-01-onboarding/synthesis/{affinity-clusters.md,key-findings.md,opportunity-areas.md}

# Personas
mkdir -p personas
touch personas/{persona-maya-growth-lead.md,persona-alex-ops-manager.md,jobs-to-be-done.md,persona-changelog.md}

# Journey maps
mkdir -p journey-maps/current-state journey-maps/future-state
touch journey-maps/current-state/onboarding-journey-current.md
touch journey-maps/future-state/onboarding-journey-future.md

# Wireframes
mkdir -p wireframes/{onboarding-flow,checkout-flow,settings-redesign,explorations}
for dir in wireframes/onboarding-flow wireframes/checkout-flow wireframes/settings-redesign; do
  touch "$dir"/{figma-link.md,annotations.md,design-decisions.md}
done

# Usability tests
mkdir -p usability-tests/2026-05-onboarding-maze/session-notes
mkdir -p usability-tests/templates
touch usability-tests/2026-05-onboarding-maze/{test-plan.md,task-scripts.md,findings-report.md}
touch usability-tests/templates/{test-plan-template.md,task-script-template.md,findings-report-template.md}

# Design system
mkdir -p design-system/{components,foundations,patterns}
touch design-system/components/{button.md,form-inputs.md,modal.md,navigation.md,data-table.md,toast-notifications.md}
touch design-system/foundations/{color.md,typography.md,spacing.md,icons.md,motion.md}
touch design-system/patterns/{empty-states.md,error-handling.md,loading-states.md}
touch design-system/{decision-log.md,zeroheight-link.md}

# Handoff
mkdir -p handoff/{feature-onboarding-v2,feature-checkout-redesign,templates}
for dir in handoff/feature-onboarding-v2 handoff/feature-checkout-redesign; do
  touch "$dir"/{figma-link.md,spec-annotations.md,edge-cases.md,acceptance-criteria.md,open-questions.md}
done
touch handoff/templates/{spec-annotations-template.md,acceptance-criteria-template.md}

# Env template
cat > .env.example <<'EOF'
FIGMA_ACCESS_TOKEN=your-figma-personal-access-token
FIGMA_TEAM_ID=your-figma-team-id
NOTION_API_KEY=secret_your-notion-integration-token
NOTION_RESEARCH_DB_ID=your-notion-database-id
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_TEAM_ID=T0XXXXXXXXX
EOF

# .gitignore
cat > .gitignore <<'EOF'
.env
.DS_Store
*.csv
!usability-tests/**/*.csv
EOF

# Install Claude Code skills
npx claudient add skill product/ux-audit
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/competitive-teardown

git add .
git commit -m "chore: initial ux designer workspace scaffold"
```

## CLAUDE.md template

```markdown
# UX Designer Workspace

This is a UX design workspace covering the full research-to-handoff loop:
user interviews, persona management, journey mapping, wireframe annotation,
usability testing, design system documentation, and developer handoff.

The canonical source of truth for each artefact type:
- Research synthesis: `research/<round>/synthesis/key-findings.md`
- Personas: `personas/persona-<name>.md` (see changelog for revision history)
- Design decisions: `wireframes/<flow>/design-decisions.md`
- Dev specs: `handoff/<feature>/spec-annotations.md`
- Design system rationale: `design-system/decision-log.md`

---

## Stack

- Design + prototyping: Figma (Dev Mode for handoff)
- Research repository: Dovetail (synthesis, tagging, insight storage)
- Usability testing: Maze (unmoderated), UserTesting (moderated)
- Docs + project notes: Notion
- Workshops + journey maps: Miro
- Design system docs: Zeroheight
- Communication: Slack

---

## Common tasks and exact commands

| Task | Command |
|---|---|
| Audit a product area for UX issues | `/ux-audit <product-area>` |
| Draft a research study plan | `/research-plan` |
| Update a persona from new findings | `/persona-update <persona-filename> — <summary of new findings>` |
| Write a usability test script | `/usability-test <flow-name>` |
| Run a design critique | `/design-critique <figma-link or flow-name>` |
| Check a flow for WCAG 2.2 AA compliance | `/accessibility-check <flow-name>` |
| Generate a dev handoff checklist | `/handoff-checklist <feature-name>` |

---

## Research conventions

- Round directories: `research/round-<NN>-<topic>/` — zero-padded, kebab-case topic
- Participants: always anonymised as P01, P02, etc. — never use real names in files
- Session notes: raw and unedited — synthesis happens in the `synthesis/` subdirectory
- Findings are severity-ranked: Critical / Major / Minor / Observation
- Every finding must cite at least one participant quote or data point as evidence
- Dovetail is the system of record — notes here are the working copy for Claude to read

---

## Persona conventions

- Persona files: `persona-<first-name>-<role-slug>.md` (e.g., `persona-maya-growth-lead.md`)
- Every update must be logged in `persona-changelog.md` with the triggering research round
- Jobs-to-be-done statements live in `jobs-to-be-done.md`, not inside persona files
- Do not invent new persona attributes without supporting research evidence

---

## Wireframe and design decision conventions

- `figma-link.md` must include: URL, Figma file name, frame name, last-updated date
- `annotations.md`: screen-by-screen, referencing component names from the design system
- `design-decisions.md`: written as "We chose X over Y because Z" — not a description of the UI
- Never duplicate design decisions across files — link back to `design-decisions.md`

---

## Handoff conventions

- One directory per feature: `handoff/feature-<slug>/`
- `spec-annotations.md` must cover: spacing, states (default/hover/focus/disabled/error), responsive behaviour
- `edge-cases.md` must cover: empty state, error state, loading state, permission-restricted state
- `acceptance-criteria.md`: each criterion starts with "Given / When / Then" or a testable assertion
- `open-questions.md`: tag each item with `[ENG]`, `[DESIGN]`, or `[PM]` to indicate owner

---

## Accessibility standards

- Minimum standard: WCAG 2.2 Level AA for all shipped flows
- Color contrast: 4.5:1 for normal text, 3:1 for large text and UI components
- Interactive elements: must have focus indicators, keyboard operability, and ARIA labels
- Motion: all animations must respect `prefers-reduced-motion`
- Run `/accessibility-check` before every handoff

---

## Design system conventions

- Component docs live in `design-system/components/<component>.md`
- Decision log uses ADR format: Context / Decision / Consequences
- Never change a component's usage rules without an entry in `design-system/decision-log.md`
- Zeroheight is the published source — `design-system/` is the working draft

---

## Do not

- Do not write participant names in any file — use P01, P02, etc.
- Do not commit `.env` — Figma and Notion tokens are sensitive
- Do not create handoff packages without running `/accessibility-check` first
- Do not modify `personas/` without logging the change in `persona-changelog.md`
- Do not describe UI in `design-decisions.md` — explain the reasoning, not the pixels
```

## MCP servers

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-personal-access-token",
        "FIGMA_TEAM_ID": "your-figma-team-id"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token",
        "NOTION_RESEARCH_DB_ID": "your-notion-research-database-id"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */personas/*.md && \"$CLAUDE_TOOL_INPUT_FILE_PATH\" != */persona-changelog.md ]]; then echo \"[hook] Persona file updated — remember to log this change in persona-changelog.md\" >&2; fi'",
            "async": true
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */handoff/*/acceptance-criteria.md ]]; then echo \"[hook] Handoff criteria written — run /accessibility-check before marking this feature ready.\" >&2; fi'",
            "async": true
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */sessions/*-interview-notes.md ]]; then if grep -qiE \"\\b(full name|surname|[A-Z][a-z]+ [A-Z][a-z]+)\\b\" <<< \"$CLAUDE_TOOL_INPUT_NEW_STRING\" 2>/dev/null; then echo \"PII WARNING: possible real name detected in session notes. Use P01, P02, etc. instead.\" >&2; exit 1; fi; fi'"
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
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/competitive-teardown
```

## Related

- [Guide: Claude for UX Designers](../guides/for-ux-designer.md)
- [Workflow: Research to Handoff](../workflows/research-to-handoff.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
