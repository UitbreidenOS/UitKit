# GTM Engineer Stack

> The complete Claude Code workspace for B2B outbound — research, sequence, review, log. Run high-velocity account campaigns with built-in compliance, ICP scoring, and human approval gates.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Add MCP servers** — Configure Firecrawl and Exa in `settings.json` for deep web research and real-time data.
3. **Set your ICP** — Open `CLAUDE.md`, customize the Target ICP section, and define banned words for your brand voice.
4. **Run `/research-account [company]`** — Get a full brief: funding, recent hires, product changes, leadership, news.
5. **Run `/write-sequence`** — Draft a 3–5 email cold sequence, then review and approve before sending.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, ICP matrix, skills, hooks, tone guidelines, and brand persona. Start here. |
| `session-log.md` | Log | Auto-updated with every action: accounts researched, sequences drafted, approvals, call debrief notes. |
| `skills/` | Directory | 8 reusable skills for research, writing, review, and meeting prep. |
| `linkedin-content.md` | Skill | Framework for high-converting LinkedIn posts, teardowns, and contrarian takes. |

---

## Skills (8)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `icp-qualifier` | Before research | ICP Matrix | Score prospects 0–100; return GO/CAUTION/NO-GO decision |
| `account-researcher` | `/research-account` | WebSearch, WebFetch, Firecrawl, Exa | Deep dive: funding, recent hires, product launches, leadership changes, news |
| `cold-email-sequencer` | `/write-sequence` | Read, Write | Draft 3–5 email sequence with hooks, objection handles, and conversational CTAs |
| `linkedin-content-writer` | `/write-linkedin` | Read, Write | Create posts, comments, or DMs optimized for engagement and click-through |
| `output-reviewer` | Before sending | Read | 5-check audit: tone, banned words, email length (<120 words), insight-first lead, ICP fit |
| `battlecard-builder` | Before discovery | WebSearch, WebFetch, Exa | Create 1-pager: prospect pain, our differentiator, proof points, objection handles |
| `meeting-prep` | 24h before call | Read, WebSearch | Pre-call brief: agenda, key questions, discovery plan, win conditions, risks |
| `post-call-processor` | After call | Read, Write | Summarize notes, extract next steps, score deal stage, flag risks, log to session |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/research-account` | Run before drafting any outbound. Gathers company intel, recent news, leadership changes, and funding. Outputs to session log. |
| `/write-sequence` | Generate cold email sequence (3–5 emails) with context from account research. Drafts for human approval; does not send. |
| `/review-output` | Audit any draft (email, post, battlecard) for tone compliance, banned words, length, and ICP alignment. Returns pass/fail + fixes. |

---

## Hooks (4)

| Hook | Event | What It Protects Against |
|---|---|---|
| `tone-enforcement` | PostToolUse | Flags banned words (synergy, leverage, etc.), corporate jargon, non-insight-first leads |
| `sequence-validator` | PostToolUse | Enforces <120 word email limit, subject line hook strength, CTA clarity |
| `icp-filter` | PreToolUse | Blocks research and outreach for accounts scoring <40 unless explicitly overridden with human justification |
| `session-summary` | Stop | Auto-logs to `session-log.md` at session end: accounts researched, sequences drafted, approvals, meeting outcomes |

---

## MCP Setup

### Firecrawl (Web Scraping)

Get your API key at [firecrawl.dev](https://www.firecrawl.dev/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Exa (Real-Time Web Search)

Get your API key at [exa.ai](https://exa.ai/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["@exa/mcp"],
      "env": {
        "EXA_API_KEY": "your-key-here"
      }
    }
  }
}
```

---

## How It Works

### 1. ICP Scoring
Every prospect is scored 0–100 against 4 dimensions: company size, role seniority, industry fit, software adoption. Go/Caution/No-Go decision gates research.

### 2. Research → Context
`/research-account` pulls company intel, recent news, leadership changes, funding. Output informs hook, tone, and CTA strategy.

### 3. Draft → Review → Approve
Claude drafts all outbound (emails, LinkedIn, posts). Human reviews, requests changes, or approves. Only approved content is sent via the human's own client.

### 4. Session Logging
Every action is logged to `session-log.md` with account name, contact, ICP score, action type, status, and notes. Build a searchable history of your campaign.

---

## Tone & Output Rules

- **Voice:** Professional, concise, high-agency. No hedging.
- **Email length:** Max 120 words. Every sentence drives toward a single action.
- **Lead with insight.** Start with a business truth or observation—never "Hi [Name], I hope this finds you well."
- **Banned words (15):** synergy, revolutionary, game-changer, delve, robust, leverage, holistic, reach out, touch base, circle back, paradigm, disruptive, innovative, seamlessly, checking in, just following up, per my last email.
- **Be specific.** Reference their recent hire, product launch, funding round, or industry shift. Show you know their business.
- **No jargon.** Avoid: "verticals," "solution," "ecosystem," "unlock value," "empower."

---

## Human Approval Gate

**Nothing gets sent without explicit human approval.** This is non-negotiable.

- Claude drafts all outbound (emails, LinkedIn messages, posts).
- Human reviews and approves or requests changes.
- Only after approval does the human send via their own email client, LinkedIn, or tool.
- Approval is logged: `[APPROVED] Cold email to jane.smith@acme.com — 2026-06-12 14:35`

---

## Success Metrics

Track and report on:
- **Open rate:** Target >35% on cold emails.
- **Reply rate:** Target >8% from GO-scored accounts.
- **Meeting rate:** Target >15% of replies convert to discovery calls.
- **Approval velocity:** Average time from draft to human approval.
- **ICP adherence:** Percentage of outreach sent to GO-scored accounts (target >85%).

---

## Key Constraints

- **Legal/compliance:** Workspace flags requests for misleading claims, fake credentials, or domain spoofing. These are not drafted.
- **GDPR/privacy:** Respects data protection regulations when researching or storing prospect information.
- **Rate limiting:** Sequences are spaced 3–5 days apart per account to avoid spam triggers.
- **Unsubscribe respect:** If a prospect unsubscribes or declines, they are removed from all future sequences immediately.

---

## Stats

**8 skills** · **3 commands** · **4 hooks** · **2 MCP servers** (Firecrawl + Exa) · **Full audit trail** via session logging

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudient/Claudient) · [Claude Code](https://claude.com/claude-code)
