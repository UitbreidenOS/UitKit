# Investor / VC Stack

> Deal sourcing, due diligence automation, and portfolio company monitoring for venture capital and growth equity investors.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Add MCP servers** — Configure Crunchbase, PitchBook, and Exa in `settings.json` for company intelligence and real-time signals.
3. **Add hooks** — Copy each `.sh` script from `hooks/` into `.claude/hooks/`, make them executable, and add settings.json entries.
4. **Run `/score-opportunity [company_name, stage, industry]`** — Score a deal against your investment thesis before deep research.
5. **Run `/company-batch`** — Queue and rank a list of potential investments for the session.
6. **Run `/dd-report`** — Generate a structured due diligence report with key metrics, risks, and recommendation.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Investment thesis, scoring matrix, focus areas, SOPs, and decision rules. Start here. |
| `session-log.md` | Log | Auto-updated: deals scored, DD reports, key calls, investment decisions, portfolio updates. |
| `skills/` | Directory | 6 reusable VC skills — scoring, due diligence, market analysis, document review. |
| `commands/` | Directory | 3 slash commands for the core deal workflow. |
| `hooks/` | Directory | 3 hooks enforcing decision rules, due diligence gates, and deal tracking. |
| `mcp/` | Directory | Crunchbase, PitchBook, and Exa MCP server configs and setup guides. |

---

## Skills (6)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `opportunity-scorer` | Before any research | WebSearch, WebFetch, Read | Score 0–100 against investment thesis; GO/REVIEW/PASS with category breakdown |
| `financials-analyzer` | /dd-report | Read, Write | ARR, burn rate, CAC, LTV, runway analysis; flag red flags and metrics against benchmarks |
| `market-analyzer` | /dd-report | WebSearch, WebFetch, Read | TAM, market share, competitive landscape, growth trends; positioning assessment |
| `dd-report-generator` | /dd-report | Read, Write | Structured due diligence report: Company overview, financials, market, team, risks, recommendation |
| `portfolio-monitor` | /portfolio-check | WebSearch, WebFetch, Read | Track portfolio company updates: funding, exec changes, product launches, key signals |
| `deal-logger` | After any decision | Read, Write | Log deal scorecard, decision rationale, and recommendation to session log |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/score-opportunity` | Score a company against investment thesis before deep research; GO/REVIEW/PASS decision |
| `/company-batch` | Score and rank a batch of company targets; return prioritized deal queue |
| `/dd-report` | Generate structured due diligence report with financials, market, team, risks, and recommendation |

---

## Hooks (3)

| Hook | Event | What It Enforces |
|---|---|---|
| `dd-gate` | PreToolUse | Ensures minimum DD depth (market analysis + financial metrics) before investment decision |
| `decision-logger` | PostToolUse | Immutable investment decision record with scoring rationale |
| `portfolio-monitor-scheduler` | Stop | Auto-surfaces portfolio company alerts and signal tracking |

---

## MCP Setup

### Crunchbase (Company intelligence)

Get your API key at [crunchbase.com](https://crunchbase.com/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "crunchbase": {
      "command": "npx",
      "args": ["-y", "crunchbase-mcp"],
      "env": { "CRUNCHBASE_API_KEY": "your-key-here" }
    }
  }
}
```

### PitchBook (VC data)

Get your API key at [pitchbook.com](https://pitchbook.com/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "pitchbook": {
      "command": "npx",
      "args": ["-y", "pitchbook-mcp"],
      "env": { "PITCHBOOK_API_KEY": "your-key-here" }
    }
  }
}
```

### Exa (Real-time signals)

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

Run `/score-opportunity` before deep research. Investment thesis score gates DD effort — PASS (<50) companies don't get full DD unless partner override with written justification.

### 2. Market + Financials + Team

Structured DD covers three pillars: market opportunity (TAM, growth, positioning), financial health (ARR, burn, runway), and team strength. Each section surfaces red flags and benchmark comparisons.

### 3. Generate DD Report

Claude synthesizes research into a 3–5 page DD report with executive summary, scoring breakdown, risk analysis, and clear GO/REVIEW/PASS recommendation.

### 4. Log Decision

Every investment decision is logged with opportunity score, DD findings, recommendation, and partner comments. Audit trail for LP reporting and post-mortems.

### 5. Monitor Portfolio

Continuous monitoring of existing portfolio companies. Track funding announcements, key hires, product launches, and sector signals. Surface alerts for proactive follow-up or risk management.

---

## Success Metrics

- **Thesis fit:** Target >70% of pipeline at GO tier (≥70 score).
- **Deal velocity:** Target 3–5 qualified DD reports per week.
- **DD turnaround:** Target <48 hours from initial inquiry to final report.
- **Portfolio signal coverage:** Target 100% of portfolio companies tracked for key signals.
- **Decision documentation:** 100% of investments with signed scorecard and decision log.

---

## Key Constraints

- **Minimum DD depth required.** No investment decision without market analysis AND financial metrics.
- **Thesis alignment.** Every deal scores against investment thesis. Non-aligned deals get PASS unless partner override.
- **No FOMO decisions.** Investment recommendation is based on data, not competitive pressure.
- **Portfolio risk tracking.** Key signals from all portfolio companies surfaced weekly.

---

**6 skills · 3 commands · 3 hooks · 3 MCP servers · Full audit trail**

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudients/Claudient) · [Claude Code](https://claude.com/claude-code)
