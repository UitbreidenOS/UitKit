# Brand Manager Stack

> The complete Claude Code workspace for brand strategy, messaging, content, and reputation — built-in tone consistency, brand voice enforcement, competitive intelligence, and campaign tracking. Run multi-channel brand campaigns with unified messaging, real-time monitoring, and AI-powered content review.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Add MCP servers** — Configure Firecrawl, Exa, and Google Analytics in `settings.json` for competitive intelligence, brand monitoring, and campaign analytics.
3. **Set your brand** — Open `CLAUDE.md`, customize Brand Identity, Core Values, and Banned Phrases for your organization.
4. **Run `/analyze-competitors`** — Get a full competitive landscape: positioning, messaging, recent announcements, brand perception.
5. **Run `/create-campaign`** — Draft a complete brand campaign: value prop, messaging pillars, content formats, distribution plan.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, brand identity, tone guidelines, competitive set, and messaging matrix. Start here. |
| `session-log.md` | Log | Auto-updated with every action: campaigns created, content audits, competitive analysis, approvals, performance tracking. |
| `skills/` | Directory | 8 reusable skills for brand strategy, competitive analysis, content creation, and monitoring. |
| `commands/` | Directory | 3 slash commands for campaign creation, competitive analysis, and content review. |
| `hooks/` | Directory | 3+ event-triggered automations for brand voice enforcement, compliance checks, and logging. |
| `mcp/` | Directory | MCP server configurations for Firecrawl, Exa, and Google Analytics integration. |

---

## Skills (8)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `brand-auditor` | Before campaign | Read, Write | Audit brand presence across web; check tone consistency, message alignment, visual identity adherence |
| `competitor-analyst` | `/analyze-competitors` | WebSearch, WebFetch, Firecrawl, Exa | Deep dive on 3-5 competitors: positioning, messaging, recent launches, brand perception, customer sentiment |
| `messaging-architect` | `/create-campaign` | Read, Write | Design messaging matrix: value props, pillars, customer jobs-to-be-done, differentiators, proof points |
| `content-generator` | Campaign drafting | Read, Write | Generate blog posts, social copy, email sequences, and case studies aligned to messaging pillars |
| `tone-enforcer` | PostToolUse | Read | Scans all content; flags banned words, corporate jargon, passive voice, and off-brand tone |
| `social-strategist` | `/plan-social` | Read, Write | Create 30-day social media calendar with content mix, posting times, engagement hooks, and analytics targets |
| `campaign-tracker` | PostToolUse | Read, Write | Logs all campaign activities to session log: drafts created, reviews passed/failed, approvals, performance metrics |
| `brand-monitor` | Daily | WebSearch, Exa | Monitors brand mentions, competitive moves, customer sentiment shifts; flags reputation risks and opportunities |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/analyze-competitors` | Deep dive on 3-5 competitors: market positioning, messaging, recent product launches, customer reviews, brand perception. Returns positioning map and opportunity matrix. |
| `/create-campaign` | Design complete brand campaign: messaging pillars, content calendar, distribution strategy. Drafts for human approval; does not publish. |
| `/review-content` | Audit any brand asset (post, email, blog, ad copy) for tone compliance, banned words, message alignment, and brand fit. Returns pass/fail + fixes. |

---

## Hooks (3+)

| Hook | Event | What It Protects Against |
|---|---|---|
| `tone-enforcement` | PostToolUse | Flags banned words, jargon, passive voice, and off-brand tone in all content |
| `compliance-check` | PostToolUse | Blocks legally risky claims, unsupported assertions, and competitor disparagement |
| `session-logger` | Stop | Auto-logs to `session-log.md`: campaigns created, competitive analysis, content audits, approvals, performance |
| `brand-monitor` | Scheduled (daily) | Scans web for brand mentions, competitor moves, and customer sentiment shifts |

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
        "EXA_API_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Google Analytics (Campaign Tracking)

Configure for real-time campaign performance tracking:

```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "node",
      "args": ["path/to/google-analytics-mcp.js"],
      "env": {
        "GA_PROJECT_ID": "your-project-id",
        "GA_CREDENTIALS": "path/to/credentials.json"
      }
    }
  }
}
```

---

## How It Works

### 1. Competitive Mapping
Every campaign starts with competitive analysis. Identify 3–5 key competitors, map their positioning, messaging, and recent moves. Use this to find white space and differentiate.

### 2. Messaging Architecture
Design your messaging pillars aligned to customer jobs-to-be-done and core differentiators. All content flows from these pillars—ensuring consistency across channels.

### 3. Content Velocity
Generate blog posts, social copy, emails, and case studies from the messaging architecture. Tone enforcer catches brand drift and corporate jargon before publishing.

### 4. Campaign Launch & Approval
All content drafts require human review and approval before publishing. Compliance checks block legally risky claims and unsupported assertions.

### 5. Performance Tracking
Every campaign is logged with performance targets (traffic, engagement, conversions). Real-time monitoring flags reputation risks and customer sentiment shifts.

---

## Tone & Output Rules

- **Voice:** Authentic, insightful, human-centered. No buzzwords, no fluff.
- **Message lead:** Always lead with customer value and outcome, never feature or company.
- **Proof over promises:** Back every claim with data, case study, or customer quote.
- **Banned words (20):** synergy, leverage, disruptive, revolutionary, game-changer, blockchain, AI-powered, cutting-edge, best-in-class, world-class, industry-leading, seamless, robust, pivot, circle back, reach out, touch base, per my last email, low-hanging fruit, deep dive.
- **Tone:** Professional but conversational. Write as if you're talking to a peer, not selling.
- **No jargon:** Avoid: "verticals," "solution," "ecosystem," "unlock value," "empower," "paradigm shift," "market penetration."

---

## Competitive Set

Define your 3–5 key competitors for ongoing monitoring:

| Company | Positioning | Key Differentiator |
|---|---|---|
| [Competitor 1] | [How they position] | [What they claim to do best] |
| [Competitor 2] | [How they position] | [What they claim to do best] |
| [Competitor 3] | [How they position] | [What they claim to do best] |

---

## Messaging Pillars

Design 4–6 messaging pillars aligned to customer jobs and differentiators:

| Pillar | Customer Job | Our Claim | Proof Point |
|---|---|---|---|
| [Pillar 1] | [What customer is trying to achieve] | [What we enable] | [Case study / metric / quote] |
| [Pillar 2] | [What customer is trying to achieve] | [What we enable] | [Case study / metric / quote] |
| [Pillar 3] | [What customer is trying to achieve] | [What we enable] | [Case study / metric / quote] |

---

## Human Approval Gate

**Nothing gets published without explicit human approval.** This is non-negotiable.

- Claude drafts all brand content (blogs, social, emails, campaigns).
- Human reviews, approves, or requests changes.
- Only after approval does the human publish via their own platform, website, or social channel.
- Approval is logged: `[APPROVED] Blog post "How to Scale..." — 2026-06-12 14:35`

---

## Content Calendar Format

All campaigns are logged with a content calendar:

```
## Campaign: [Campaign Name]

**Launch Date:** [YYYY-MM-DD]
**Duration:** [X weeks]
**Objectives:** [What this campaign aims to achieve]
**Target Audience:** [Who we're reaching]

### Content Pieces

| Format | Title | Status | Channel | Publish Date |
|---|---|---|---|---|
| Blog | [Title] | DRAFT / APPROVED / PUBLISHED | Website | [Date] |
| LinkedIn | [Title] | DRAFT / APPROVED / PUBLISHED | LinkedIn | [Date] |
| Email | [Title] | DRAFT / APPROVED / PUBLISHED | Email | [Date] |

### Performance Targets

- **Traffic:** X visits
- **Engagement:** X% CTR, X shares
- **Conversions:** X leads captured
- **Brand Lift:** X% awareness increase
```

---

## Success Metrics

Track and report on:
- **Brand awareness:** Website traffic, search impressions, brand mentions (YoY growth).
- **Message clarity:** Customer sentiment scores on brand positioning (target >75% positive).
- **Competitive share of voice:** Brand mentions vs. competitor mentions (target >40% SOV).
- **Content velocity:** Pieces per month, approval-to-publish cycle time (target <48h).
- **Campaign ROI:** Traffic, leads, and conversions attributed to each campaign (target >3:1 ROAS).
- **Content engagement:** Avg CTR, shares, comments per piece (target >5% CTR on social).

---

## Key Constraints

- **Legal/compliance:** Workspace flags requests for false claims, competitor disparagement, and unsupported assertions. These are not drafted.
- **Brand guidelines:** All visual and messaging assets adhere to brand standards. Tone enforcer flags deviations automatically.
- **Fact-check:** Every customer claim, metric, and proof point is verified before publishing. No speculation presented as fact.
- **Rate limiting:** Campaigns are spaced 1–2 weeks apart to avoid brand message saturation and social fatigue.
- **Attribution:** All campaign activity is logged with timestamp, author, approval status, and performance metrics.

---

## Stats

**8 skills** · **3 commands** · **3+ hooks** · **3 MCP servers** (Firecrawl + Exa + Google Analytics) · **Full audit trail** via session logging

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
