# Billing and Pricing — Claude Plans, Agent SDK Credits, and Cost Management

A practical reference for understanding Claude's subscription tiers, the June 15 billing split, API token rates, and cost optimization strategies.

---

## Plans Overview

| Plan | Monthly Price | Interactive Limits | Agent SDK Credits |
|---|---|---|---|
| **Pro** | $20/mo | Standard | $20/mo |
| **Max 5×** | $100/mo | 5× standard | $100/mo |
| **Max 20×** | $200/mo | 20× standard | $200/mo |
| **Team** | Per user | Shared pool | Separate API billing |
| **Enterprise** | Per user | Negotiated | Separate API billing |

**Team and Enterprise** accounts use per-user pricing with API billing at token rates — there is no fixed Agent SDK credit pool. All token consumption is metered directly against the API.

---

## The June 15, 2026 Billing Change

> **This change affects all Pro and Max subscribers.** API key users (no subscription) are unaffected — they have always been billed per token.

Before June 15, 2026: `claude -p` (print mode), Agent SDK sessions, and Managed Agent sessions all drew from the same pool as interactive Claude chat and Claude Code terminal sessions.

After June 15, 2026: **Two separate pools.**

### Pool 1 — Interactive Pool
Covers:
- Claude.ai chat sessions
- Claude Code terminal sessions (`claude` in your terminal, interactive mode)

### Pool 2 — Agent SDK Credit Pool
Covers:
- `claude -p` (print mode / non-interactive)
- Agent SDK sessions (programmatic API calls)
- Managed Agent sessions (cloud-hosted agents via `client.beta.sessions`)

### What This Means in Practice

- You can run `claude -p` scripts, pipelines, and automation all month without touching your interactive chat limits.
- Agent SDK credits do **not** roll over month to month. Unused credits expire at the billing period end.
- If you hit the Agent SDK credit limit, subsequent calls return a `429` with `X-Limit-Pool: agent_sdk` in the response header. Interactive usage is unaffected.
- API key users: no change. Billed per token as always — no pools, no rollover.

### Monitoring Usage

```bash
# In Claude Code — shows per-category breakdown
/usage
```

The `/usage` output now shows two rows: `interactive` and `agent_sdk`, each with tokens used and remaining allowance. Check this before running large batch jobs to confirm you have sufficient Agent SDK credits.

The Claude.ai usage page (Settings → Usage) also tracks monthly limits per pool with a progress bar for each.

---

## API Pricing (API Key Users)

Billed per token. No subscription required. Rates as of June 2026:

### Input / Output Rates

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| Claude Opus 4.7 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $0.25 | $1.25 |

### Prompt Cache Rates

| Cache operation | Multiplier on input price |
|---|---|
| Cache read | 0.1× (90% discount) |
| Cache write | 1.25× (25% premium on first write) |

Caching is net-positive whenever you expect more than 1 read per write. At Opus 4.7 rates: a 100K-token context costs $0.50 to write into cache, and $0.05 per cache read. Break-even at 1.25 reads; every read after that saves $0.45.

### Batch API

The Batch API processes requests asynchronously and returns results within 24 hours. Discount: **50% off standard rates** on both input and output tokens. Use it for:
- Classification jobs
- Bulk document processing
- Overnight analysis pipelines
- Any workload where latency is not a constraint

---

## Cost Optimization Strategies

### 1. Use Haiku for Mechanical Tasks

Haiku 4.5 is roughly 12× cheaper than Opus 4.7 on input tokens. For tasks that do not require reasoning — classification, summarization, template filling, translation, extraction from structured data — Haiku produces equivalent results at a fraction of the cost.

Rule of thumb: if you could write a regex for it, Haiku handles it. If the task requires multi-step reasoning or judgment, reach for Sonnet or Opus.

### 2. Prompt Caching for Repeated Large Contexts

Any context block that recurs across calls — system prompts, large codebases, reference documents, tool schemas — should be cached. At a 0.1× cache-read rate, a 200K-token system prompt costs $1.00 to write once and $0.10 per read thereafter.

Cache writes are explicit: use the `cache_control: {"type": "ephemeral"}` marker on the content block. Cached content has a 5-minute TTL that resets on each read.

### 3. Batch API for Non-Time-Sensitive Workloads

If a pipeline can tolerate up to 24-hour latency, route it through the Batch API. 50% discount across all models. At scale, this halves your API spend on asynchronous jobs.

### 4. Output Length Control

Output tokens cost 5× more than input tokens at the same rate. Instruct the model to be concise when you only need structured output or short answers. Add to your system prompt:

```
Respond with only what was asked. Do not add explanations, caveats, or summaries unless explicitly requested.
```

For extraction tasks: instruct JSON-only output with no surrounding prose.

### 5. Deferred Tool Loading

Listing 50+ tools in a system prompt can add 10K–20K tokens of context per call. Claude Code's deferred tool loading pattern loads tool schemas only when Claude requests them, reducing startup context by up to 85% for large tool catalogs.

See `guides/token-cost-reduction.md` for the deferred loading implementation pattern.

### 6. Use Agent SDK Credits Before API Keys for Scripting

If you have a Max subscription, your Agent SDK credit pool is pre-paid. Running `claude -p` scripts against your subscription costs nothing extra until the credit pool is exhausted. Only fall back to direct API key billing when your credit pool is depleted or for workloads that exceed the credit limit.

---

## Monitoring

| Tool | What it shows |
|---|---|
| `/usage` in Claude Code | Current session token usage by category (interactive / agent_sdk) |
| Claude.ai → Settings → Usage | Monthly limits, per-pool progress bars |
| `hooks/post-tool-use/cost-tracker.sh` | Per-session cost logging via PostToolUse hook |

For API key users, the Anthropic Console (console.anthropic.com) provides per-day token usage broken down by model and a spend graph for the billing period.

---
