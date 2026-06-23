# Newsletter Writer Stack

> The complete Claude Code workspace for high-impact newsletter creation — research, drafting, editing, analytics. Write engaging newsletters that drive subscriber growth, engagement, and conversions with built-in quality gates and performance tracking.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Configure your newsletter voice** — Open `CLAUDE.md`, customize tone, topics, and distribution preferences.
3. **Run `/research-topic [topic]`** — Gather trending insights, data points, and expert commentary for deep dives.
4. **Run `/draft-newsletter`** — Create a complete newsletter with hook, sections, CTA, and subject line.
5. **Run `/review-draft`** — Audit for engagement, clarity, tone compliance, and brand fit before sending.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, audience profile, newsletter guidelines, tone, and distribution settings. Start here. |
| `session-log.md` | Log | Auto-updated with every action: topics researched, drafts created, reviews, sends, performance notes. |
| `skills/` | Directory | Reusable skills for research, drafting, editing, and analytics. |
| `commands/` | Directory | Slash commands for rapid workflow: `/draft-newsletter`, `/research-topic`, `/review-draft`. |
| `hooks/` | Directory | Event-triggered automations: tone enforcement, length validation, link checking, session logging. |

---

## Skills

| Skill | Trigger | Tools Used | Purpose |
|---|---|---|---|
| `topic-researcher` | `/research-topic` | WebSearch, WebFetch | Gather trending data, expert insights, news, and competitive angles for deep dives |
| `newsletter-drafter` | `/draft-newsletter` | Read, Write | Create complete newsletter: hook, 3–5 sections, CTA, subject line |
| `output-reviewer` | `/review-draft` | Read | Audit: engagement hooks, clarity, tone, brand voice, link validity, length |
| `subject-line-optimizer` | Before send | Read, Write | Test 3 variations and score by predicted open rate and click-through potential |
| `editor` | Post-draft | Read, Write | Tighten copy, fix grammar, enhance readability, adjust tone |
| `analytics-tracker` | Post-send | Read, Write | Log opens, clicks, unsubscribes, engagement rate, and performance insights |

---

## Commands

| Command | What It Does |
|---|---|
| `/research-topic [topic]` | Gather trending data, expert insights, competitive angles, and news for the topic. Outputs summary for use in drafting. |
| `/draft-newsletter` | Generate complete newsletter: hook, sections, CTA, subject line. Drafts for human review; does not send. |
| `/review-draft` | Audit newsletter for engagement, clarity, tone, brand fit, links, and length. Returns pass/fail + recommendations. |

---

## Hooks

| Hook | Event | What It Does |
|---|---|---|
| `tone-enforcement` | PostToolUse | Flags non-brand tone, unnecessary jargon, and clarity issues |
| `length-validator` | PostToolUse | Checks newsletter length (recommended 300–800 words for body), subject line, and preview text |
| `link-checker` | PostToolUse | Validates all URLs are working and properly formatted |
| `session-summary` | Stop | Auto-logs to `session-log.md`: topics researched, drafts created, reviews, sends, performance data |

---

## Workspace Structure

```
newsletter_writer_stack/
├── CLAUDE.md                 (workspace rules and guidelines)
├── session-log.md            (auto-updated activity log)
├── README.md                 (this file)
├── skills/
│   ├── topic-researcher.md
│   ├── newsletter-drafter.md
│   ├── output-reviewer.md
│   ├── subject-line-optimizer.md
│   ├── editor.md
│   └── analytics-tracker.md
├── commands/
│   ├── research-topic.md
│   ├── draft-newsletter.md
│   └── review-draft.md
├── hooks/
│   ├── tone-enforcement.md
│   ├── length-validator.md
│   ├── link-checker.md
│   └── session-summary.md
├── mcp/
│   └── recommended-servers.md
└── templates/
    ├── newsletter-structure.md
    ├── subject-lines.md
    └── cta-templates.md
```

---

## Key Features

- **Topic Research:** Deep dives into trending topics with data, expert quotes, and competitive context
- **Structured Drafting:** Hook + 3–5 sections + CTA formula ensures engagement from open to click
- **Quality Gates:** Tone enforcement, length validation, link checking, and brand voice alignment
- **Session Logging:** Build a searchable history of all newsletters, performance metrics, and insights
- **Subject Line Optimization:** Test variations and predict open rates before send

---

## Newsletter Structure

Every newsletter follows this template:

1. **Hook** (1–2 sentences): Curiosity-driven opener or bold statement
2. **Context** (1 section): Why this topic matters now
3. **Insight** (2–3 sections): Key data, trend analysis, or expert commentary
4. **Takeaway** (1 section): What readers should do with this knowledge
5. **CTA** (1 sentence): Single clear action (read, download, register, reply)
6. **Subject Line:** Curiosity, urgency, or specificity; tested for predicted open rate

---

## Tone & Output Rules

- **Voice:** Knowledgeable, conversational, expert. No fluff or corporate jargon.
- **Length:** 300–800 words for body. Subject line max 50 characters. Preview text 40–80 characters.
- **Lead with value.** Open with why this matters to the reader—not who wrote it.
- **Banned words:** synergy, revolutionary, game-changer, delve, robust, leverage, ecosystem, disruptive, innovative, paradigm, holistic.
- **Be specific.** Use data, case studies, and expert quotes. Avoid generic statements.
- **One CTA.** Single, clear action. No link sprawl.

---

## Human Approval Gate

**Nothing gets sent without explicit human approval.**

- Claude drafts all newsletters.
- Human reviews, requests changes, or approves.
- Only after approval does the human send via their distribution platform.
- Approval is logged: `[APPROVED] Newsletter: "5 AI Trends..." — 2026-06-13 09:45`

---

## Success Metrics

Track and report on:
- **Open rate:** Target >25% depending on list quality
- **Click-through rate:** Target >5% of opens
- **Unsubscribe rate:** Keep <0.5%
- **Reply rate:** Track if applicable
- **Engagement velocity:** Average time from draft to human approval and send

---

## Key Constraints

- **Accuracy:** All data, statistics, and quotes must be sourced and verified.
- **Brand consistency:** Every newsletter reflects the voice and values defined in `CLAUDE.md`.
- **Link integrity:** All URLs must be tested and functional before send.
- **Unsubscribe respect:** Honor all preference changes and unsubscribe requests immediately.

---

**Stats:** 6 skills · 3 commands · 4 hooks · Built-in performance tracking via session logging

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
