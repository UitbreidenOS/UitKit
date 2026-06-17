# AI SDR Stack

> Autonomous sales development with human-in-the-loop approval gates on every outbound message.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Add MCP servers** — Configure Firecrawl and Exa in `settings.json` for JS-rendered page scraping and real-time signal search.
3. **Add hooks** — Copy each `.sh` script from `hooks/` into `.claude/hooks/`, make them executable, and add settings.json entries.
4. **Run `/score-lead [name, title, company]`** — Score the first prospect before spending any research time.
5. **Run `/prospect-batch`** — Queue and rank a list of leads for the session.
6. **Run `/execute-sequence`** — Draft the email, review it, approve it, then send from your own client.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, ICP matrix, tone guidelines, SOPs, and approval gate. Start here. |
| `session-log.md` | Log | Auto-updated: prospects scored, emails drafted, approvals, meetings booked. |
| `skills/` | Directory | 8 reusable SDR skills — scoring, writing, classifying, confirming, handling. |
| `commands/` | Directory | 3 slash commands for the core SDR workflow. |
| `hooks/` | Directory | 4 hooks enforcing the approval gate, compliance, and duplicate prevention. |
| `mcp/` | Directory | Firecrawl and Exa MCP server configs and setup guides. |

---

## Skills (8)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `lead-scorer` | Before any research | WebSearch, WebFetch, Read | Score 0–100 against ICP matrix; GO/CAUTION/NO-GO with dimensional breakdown |
| `email-personalizer` | /execute-sequence | Read, Write | One personalized cold email from research brief; trigger reference; under 120 words |
| `follow-up-scheduler` | After initial send | Read, Write | Day 3/7/14 follow-up schedule; unique hook per touch; no repeated angles |
| `crm-logger` | After any action | Read, Write, Bash | Structured CRM log entry with duplicate hash check |
| `campaign-tracker` | /review-campaign | Read, Write | Open/reply/meeting rates per sequence; top and bottom performer flags |
| `response-classifier` | On reply | Read | Classify intent; confidence score; recommended next action; draft response |
| `meeting-confirmator` | On booked meeting | Read, Write | Confirmation with 3-item agenda, dial-in, pre-read; personalized to trigger |
| `objection-handler` | On objection | Read, Write | Tailored response to price/timing/competitor/no-need; under 80 words |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/score-lead` | Score a single prospect against the ICP matrix before spending any research time |
| `/prospect-batch` | Score and rank a batch of leads; returns prioritized queue with next actions |
| `/execute-sequence` | Draft next email in sequence; runs review checklist; presents for human approval before send |

---

## Hooks (4)

| Hook | Event | What It Enforces |
|---|---|---|
| `approval-gate` | PreToolUse | Blocks all outbound sends until human approval is logged |
| `email-compliance` | PostToolUse | CAN-SPAM and GDPR checks on every email draft |
| `crm-sync-validator` | PostToolUse | Prevents duplicate CRM log entries via activity hash |
| `activity-logger` | Stop | Immutable session-end record; surfaces pending approvals |

---

## MCP Setup

### Firecrawl (JS-rendered web scraping)

Get your key at [firecrawl.dev](https://www.firecrawl.dev/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "your-key-here" }
    }
  }
}
```

### Exa (semantic signal search)

Get your key at [exa.ai](https://exa.ai/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": { "EXA_API_KEY": "your-key-here" }
    }
  }
}
```

---

## How It Works

### 1. Score First
Run `/score-lead` before touching any account. ICP score gates research — NO-GO (<40) accounts don't get researched unless human overrides with written justification.

### 2. Research → Trigger → Draft
Account research surfaces the strongest trigger from the last 90 days. The trigger is the core of every first email — without one, no draft is written.

### 3. Draft → Approve → Human Sends
Claude drafts the email. Human reviews the draft, ICP score, trigger reference, and word count. Only after approval does the human send via their own client. Claude never sends directly.

### 4. Reply → Classify → Handle
Every reply is classified by intent before any response is drafted. Interested replies get meeting confirmations. Objections get tailored handlers. Opt-outs are flagged immediately and logged to prevent future contact.

### 5. Log Everything
Every action is logged to `session-log.md` with an activity hash to prevent duplicates. Campaign performance is surfaced on demand with `/review-campaign`.

---

## Success Metrics

- **ICP score distribution:** Target >70% of pipeline at GO (≥60)
- **Reply rate:** Target >8% from GO-scored accounts
- **Meeting rate:** Target >15% of replies → discovery calls
- **Approval velocity:** Target <10 min from draft to approval
- **Duplicate CRM entries:** 0
- **Opt-out compliance:** 100%

---

## Key Constraints

- **Nothing is sent without explicit human approval.** Non-negotiable.
- **Maximum 4 touches per account.** After 4 no-replies, archive and remove from active rotation.
- **Opt-out respect.** Sequence enrollment checks CRM before every send.
- **GDPR/CAN-SPAM.** Every email includes unsubscribe option. Physical address required.

---

**8 skills · 3 commands · 4 hooks · 2 MCP servers · Full audit trail**

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudients/Claudient) · [Claude Code](https://claude.com/claude-code)
