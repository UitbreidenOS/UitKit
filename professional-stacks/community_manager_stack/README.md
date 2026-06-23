# Community Manager Stack

> The complete Claude Code workspace for community building, engagement, and advocacy. Manage community channels, track engagement metrics, respond intelligently, identify advocates, and orchestrate campaigns. Keep communities thriving with data-driven insights and human-first strategy.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Add MCP servers** — Configure Discord and Slack handlers in `settings.json` for real-time community insights.
3. **Set your community strategy** — Open `CLAUDE.md`, customize your brand voice, engagement rules, and member scoring criteria.
4. **Run `/analyze-community [channel]`** — Get member sentiment, engagement trends, and risk flags.
5. **Run `/engage-members [prompt]`** — Draft community posts, responses, or advocacy requests with brand alignment.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, brand voice, engagement strategy, member scoring, and hook configuration. Start here. |
| `session-log.md` | Log | Auto-updated with every action: channels analyzed, posts drafted, engagement metrics, advocacy campaigns. |
| `skills/` | Directory | 8 reusable skills for community intelligence, engagement, moderation, and advocacy building. |

---

## Skills (8)

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `sentiment-analyzer` | `/analyze-community` | WebFetch, Read | Analyze channel sentiment, identify trending topics, flag heated discussions, extract member pain points |
| `engagement-tracker` | Continuous | Read, WebSearch | Track engagement velocity, member participation patterns, identify lurkers and power users |
| `response-writer` | `/engage-members` | Read, Write | Draft responses to member questions, community posts, and discussions with brand voice alignment |
| `advocate-identifier` | `/find-advocates` | WebFetch, Read | Surface high-engagement members, score advocacy potential, identify brand champions |
| `moderation-guide` | Before sensitive posts | Read | Review community content for compliance, safety, and brand alignment before posting |
| `campaign-orchestrator` | `/launch-campaign` | Read, Write | Plan and execute multi-channel community campaigns with messaging, timing, and success metrics |
| `feedback-synthesizer` | Post-discussion | Read, Write | Synthesize member feedback, extract actionable insights, document feature requests and pain points |
| `community-report` | Session end | Read, Write | Generate weekly/monthly community health report: growth, engagement, churn, sentiment, top issues |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/analyze-community` | Deep dive into a community channel: sentiment, member distribution, trending topics, health metrics, and risk flags. Outputs to session log. |
| `/engage-members` | Draft community content—responses, posts, announcements, or advocacy requests. Checks brand alignment before output. |
| `/launch-campaign` | Design and schedule a multi-touch community campaign with messaging, cohort targeting, and success metrics. |

---

## Hooks (4)

| Hook | Event | What It Protects Against |
|---|---|---|
| `brand-voice-enforcer` | PostToolUse | Flags off-brand language, tone inconsistency, contradictions to past community messaging |
| `engagement-threshold` | PreToolUse | Blocks outreach to members below engagement threshold unless explicitly overridden with justification |
| `moderation-rules` | PostToolUse | Prevents posting of content flagged for compliance risk, harassment, or unsafe community behavior |
| `session-summary` | Stop | Auto-logs to `session-log.md`: channels analyzed, posts drafted, members engaged, campaigns launched, sentiment shifts |

---

## MCP Setup

### Discord Integration

Get your bot token from [Discord Developer Portal](https://discord.com/developers/applications). Add to `settings.json`:

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["@discord/mcp"],
      "env": {
        "DISCORD_BOT_TOKEN": "your-token-here"
      }
    }
  }
}
```

### Slack Integration

Get your bot token from [Slack App Directory](https://api.slack.com/apps). Add to `settings.json`:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["@slack/mcp"],
      "env": {
        "SLACK_BOT_TOKEN": "your-token-here"
      }
    }
  }
}
```

---

## How It Works

### 1. Community Intelligence
Continuously monitor and analyze member sentiment, engagement patterns, and topic trends. Identify at-risk members and power users.

### 2. Engagement at Scale
Draft contextual, brand-aligned responses and community posts. Review for compliance and tone before posting. Never post without explicit human approval.

### 3. Advocacy Identification
Score members for advocacy potential based on engagement, sentiment, and influence. Build lists of champions for campaigns.

### 4. Campaign Orchestration
Plan multi-channel campaigns with messaging variants, timing, cohort segmentation, and KPI tracking.

### 5. Session Logging
Every action is logged to `session-log.md` with channel name, action type, member count, sentiment metrics, and outcomes.

---

## Brand Voice & Engagement Rules

- **Voice:** Authentic, helpful, approachable—never corporate or dismissive.
- **Response time:** Aim to acknowledge every member question within 4 hours during business hours.
- **Lead with empathy.** Start by validating member concerns before offering solutions.
- **Banned phrases (10):** just use, obviously, simply, just FYI, at the end of the day, needless to say, it goes without saying, for all intents and purposes, circling back, moving forward.
- **Be specific.** Reference their exact use case, pain point, or suggestion. Show you read their message.
- **No gatekeeping.** Welcome all experience levels. Encourage questions and contribution.

---

## Member Scoring & Advocacy

Members are scored 0–100 on a health index:

| Dimension | High (25 pts) | Medium (12 pts) | Low (5 pts) |
|---|---|---|---|
| **Engagement Frequency** | 3+ posts/week | 1–2 posts/week | <1 post/week |
| **Sentiment** | Consistently positive | Mixed but constructive | Negative or dismissive |
| **Influence/Reach** | 500+ followers or trusted voice | 100–500 followers | <100 followers |
| **Contribution Quality** | Helps others, shares insights | Participates, asks questions | Lurks mostly |

**Advocacy Threshold:** Score ≥75 for proactive outreach, ≥50 for inclusion in broader campaigns.

---

## Human Approval Gate

**Nothing gets posted to community without explicit human approval.** This is non-negotiable.

- Claude drafts all community content (posts, responses, announcements).
- Human reviews and approves or requests changes.
- Only after approval does the human post via their own community platform.
- Approval is logged: `[APPROVED] Response in #general to @member-name — 2026-06-12 14:35`

---

## Key Constraints

- **Safety first:** Never engage in harassment, discrimination, or exclusionary behavior.
- **Transparency:** Disclose Claude's involvement in moderation/responses when asked.
- **Privacy:** Do not share member data, DMs, or private information without explicit consent.
- **Rate limiting:** Space outreach campaigns 5–7 days apart to avoid spam perception.
- **Unsubscribe/mute respect:** Honor member preferences immediately if they opt out.

---

## Success Metrics

Track and report on:
- **Growth:** New members/month; retention rate at 30/60/90 days.
- **Engagement:** Active members %; messages/member/week; response rate to questions.
- **Sentiment:** % positive sentiment; churn signals; at-risk member count.
- **Advocacy:** # advocates identified; advocates-to-member ratio; advocacy campaign conversion.
- **Response velocity:** Median time to first response on member questions.

---

## Stats

**8 skills** · **3 commands** · **4 hooks** · **2 MCP servers** (Discord + Slack) · **Full audit trail** via session logging

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
