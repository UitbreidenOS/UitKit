# Claude Cowork — GUI Agentic AI for Non-Technical Teams

Claude Cowork is the GUI-based version of Claude's agentic capabilities — no terminal, no code, no configuration required. It is built for PMs, marketers, finance teams, and small business owners who need autonomous AI assistance without developer setup. Where Claude Code operates in a terminal, Cowork operates through a point-and-click desktop and web interface backed by the same underlying agent capability.

---

## What Cowork Is vs. Claude Code

| Feature | Claude Cowork | Claude Code |
|---------|--------------|-------------|
| Interface | Web + Desktop GUI | Terminal CLI |
| Technical requirement | None | Comfortable with terminal |
| File access | User-selected folder (GUI picker) | Current directory tree |
| Connectors | Google Drive, Gmail, Docusign, FactSet | MCP servers (manual config) |
| Slash commands | Structured forms (fill in fields) | Raw text commands |
| Automation | Click-to-configure workflows | Hooks + settings.json |
| Audience | Non-technical teams | Developers |
| Agent delegation | Visual agent cards | Subagents via CLAUDE.md |

Both use the same Claude models. Cowork is the operator experience; Claude Code is the developer experience.

---

## Setting Up Connectors

Cowork connects to external tools via Connectors — OAuth-based integrations configured once from the Cowork settings panel. No API keys, no config files.

| Connector | What Claude can do |
|-----------|-------------------|
| Google Drive | Read/write files and folders, search by content |
| Gmail | Read emails, draft replies, send on approval |
| Google Calendar | View and create events, find availability |
| Google Sheets | Read and update spreadsheet data |
| Docusign | Send documents for signature, track status |
| FactSet | Financial data queries, market data retrieval |
| Slack (plugin) | Post messages, read channels, search history |
| Linear (plugin) | Create issues, update status, read project boards |

Each connector requires one-time OAuth authorization. Claude only reads or writes when a workflow explicitly triggers that action — it does not poll connectors in the background.

---

## Slash Commands with Structured Forms

Unlike Claude Code's free-form text commands, Cowork slash commands open structured forms that prevent errors and make automation accessible without prompt engineering knowledge.

```
/generate-report
  ├── Report type:   [Weekly Summary] [Monthly P&L] [Custom]
  ├── Date range:    [from ____] [to ____]
  ├── Include:       [x] Charts  [x] Raw data  [ ] Executive summary
  └── Output format: [PDF] [Google Slides] [Email]

/email-triage
  ├── Inbox:         [Primary] [All labels] [Specific label: ____]
  ├── Action:        [Summarize] [Draft replies] [Categorize + tag]
  └── Approval:      [Auto-send] [Review before send]

/meeting-prep
  ├── Meeting:       [pull from calendar ▼]
  ├── Context docs:  [attach from Drive]
  └── Output:        [Briefing doc] [Talking points] [Both]
```

Custom commands can be saved as named workflows and shared with teammates.

---

## Common Cowork Workflows

### Weekly report generation
Pull data from Google Drive and FactSet, generate a formatted PDF, and email it to a distribution list — scheduled or triggered manually.

### Email triage
Read inbox, categorize by topic or urgency, draft responses for high-priority threads, and present them for one-click approval before sending.

### Document workflows
Read contracts in Google Drive, extract key clauses and dates, flag anomalies, and route to Docusign for signature with pre-filled fields.

### Meeting prep
Read the next day's calendar, pull relevant docs for each meeting from Drive, and generate a briefing one-pager covering context, attendees, and open items.

### Standup summaries
Read Slack activity and Linear ticket updates from the past 24 hours, generate a standup summary by team member, and post to the standup channel.

### Financial snapshot
Query FactSet for portfolio data, pull actuals from a Google Sheet, and produce a one-page P&L comparison as a Google Slides deck.

---

## Plugins

Cowork supports plugins — installable workflow packages that add new slash commands and connectors. Browse available plugins in the Cowork plugin gallery.

Installing a plugin:
1. Open Cowork settings → Plugins
2. Search the gallery or paste a plugin URL
3. Authorize any new connectors the plugin requires
4. New slash commands appear immediately in the command palette

Plugins are scoped to the workspace — installing for your account does not affect teammates unless they install separately or an admin pushes to the whole workspace.

---

## Automation: Click-to-Configure vs. Hooks

Cowork automation is configured through a visual workflow builder — no `settings.json`, no shell scripts.

| Trigger type | Cowork | Claude Code equivalent |
|-------------|--------|----------------------|
| Scheduled (cron) | Time picker in workflow builder | Cron job calling `claude` |
| File change | Watch folder selector | `PostToolUse` hook on Write |
| Email received | Gmail connector trigger | No direct equivalent |
| Form submit | Webhook input | Custom MCP tool |
| Manual | Run button | Direct CLI invocation |

For teams that want Cowork automation running alongside Claude Code automation: Cowork workflows can call webhook URLs, making it possible to trigger Claude Code pipelines from Cowork events.

---

## When to Use Cowork vs. Claude Code

**Use Cowork for:**
- Document-heavy workflows (contracts, reports, decks)
- Email and calendar automation
- Non-technical team members who need autonomous AI assistance
- Business operations work that lives in Google Workspace and similar SaaS
- No-code automation that would otherwise require Zapier or Make

**Use Claude Code for:**
- Writing, editing, or debugging code
- Terminal commands and shell scripts
- Complex multi-step technical tasks with conditional logic
- Custom automation requiring hooks and fine-grained control
- Working inside a git repository

---
