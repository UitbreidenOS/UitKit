# YouTube Creator Stack

> Strategic content planning, research, SEO optimization, and growth analytics for YouTube creators.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Add MCP servers** — Configure Exa for real-time trend detection and YouTube API access in `settings.json`.
3. **Add hooks** — Copy each `.sh` script from `hooks/` into `.claude/hooks/`, make them executable, and add settings.json entries.
4. **Run `/analyze-topic`** — Validate topic viability before spending research time.
5. **Run `/content-batch`** — Plan and rank video ideas for the month.
6. **Run `/script-draft`** — Generate optimized script with SEO keywords and chapters.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Creator persona, target audience, content pillars, tone guidelines, and workflows. Start here. |
| `session-log.md` | Log | Auto-updated: topics analyzed, videos planned, scripts drafted, performance tracked. |
| `skills/` | Directory | Reusable creator skills — topic research, script writing, thumbnail ideation, analytics. |
| `commands/` | Directory | Slash commands for topic analysis, content planning, and script generation. |
| `hooks/` | Directory | Hooks for analytics logging, SEO validation, and performance tracking. |
| `mcp/` | Directory | YouTube API and Exa MCP server configs and setup guides. |

---

## Skills (8)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `topic-analyzer` | Before content planning | WebSearch, Exa, YouTube API | Validate topic viability; search volume, competition, trend momentum |
| `script-optimizer` | /script-draft | Read, Write | SEO-optimized script with keywords, chapters, CTAs, pacing |
| `thumbnail-ideator` | /generate-thumbnails | Read, Write | 3 thumbnail concepts with hook analysis and text overlay guidance |
| `metadata-writer` | After script completion | Read, Write | Title, description, tags optimized for click-through and discovery |
| `trend-scout` | Daily | WebSearch, Exa | Surface emerging topics in creator niche; rank by growth velocity |
| `seo-validator` | PostToolUse | Read | Validate keyword density, title format, description optimization |
| `analytics-tracker` | After video publish | YouTube API | Track views, watch time, CTR, audience retention per video |
| `competitor-analyzer` | /analyze-competitors | WebSearch, YouTube API | Dissect top-performing competitors; extract formats, hooks, CTAs |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/analyze-topic` | Validate topic viability; search volume, competition, trend momentum |
| `/content-batch` | Plan and rank video ideas; return prioritized queue with scripts and thumbnails |
| `/script-draft` | Generate SEO-optimized script with chapters, keywords, and thumbnails for review |

---

## Hooks (4)

| Hook | Event | What It Enforces |
|---|---|---|
| `seo-validator` | PostToolUse | Validates keyword density, title optimization, and description SEO |
| `analytics-logger` | PostToolUse | Auto-logs video performance metrics to session log |
| `trend-monitor` | Daily | Surfaces trending topics in creator niche; ranks by growth |
| `content-scheduler` | Stop | Immutable session-end record; surfaces pending video publishes |

---

## MCP Setup

### YouTube API

Get your API key at [Google Cloud Console](https://console.cloud.google.com/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "youtube-mcp"],
      "env": { "YOUTUBE_API_KEY": "your-key-here" }
    }
  }
}
```

### Exa (semantic trend search)

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

### 1. Analyze Topic First
Run `/analyze-topic` before investing time in research. Topic analysis gates planning — low-viability topics (<40 score) are flagged unless creator overrides with justification.

### 2. Research → Trend → Plan
Topic research surfaces trend momentum, competitor landscape, and audience demand. Trending topics form the core of every content plan — without momentum, no script is written.

### 3. Plan → Script → Optimize
Creator reviews video plan, SEO keywords, and competitor hooks. Script is generated with keyword optimization, chapter structure, and CTAs. Creator approves, requests edits, or rejects before scheduling.

### 4. Publish → Track → Iterate
Video publishes. Performance is tracked daily: views, watch time, click-through rate, audience retention. Analytics inform next video iteration.

### 5. Log Everything
Every action is logged to `session-log.md`. Content ideas, scripts drafted, videos published, performance tracked.

---

## Success Metrics

- **Topic viability score:** Target >70% of planned videos at GO (≥60)
- **Click-through rate:** Target >5% from optimized thumbnails and titles
- **Average watch time:** Target >50% of video duration
- **Growth rate:** Target >20% month-over-month subscriber growth
- **Publishing consistency:** Target 2+ videos per week
- **SEO optimization:** 100% of videos with keyword-optimized titles and descriptions

---

## Key Constraints

- **Data-driven decisions.** Every content decision backed by analytics or trends.
- **SEO first.** Title, description, tags optimized before publishing.
- **Consistency matters.** Maintain publishing schedule. Sporadic uploads tank growth.
- **Audience first.** Content created for your audience, not your preferences.
- **Competitive advantage.** Know what competitors are doing; find the gap.

---

**8 skills · 3 commands · 4 hooks · 2 MCP servers · Full analytics trail**

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudients/Claudient) · [Claude Code](https://claude.com/claude-code)
