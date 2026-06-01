# Claude for Executive Assistants and Chiefs of Staff

Everything an EA, Senior EA, or Chief of Staff needs to run AI-augmented executive support — briefings, meeting management, stakeholder communications, board prep, and project tracking in Claude Code.

---

## Who this is for

You are an Executive Assistant or Chief of Staff supporting a C-suite executive. Your job is to make your executive more effective by controlling what reaches them, preparing them for what matters, and handling everything that doesn't require their direct attention. You spend your days in a permanent state of context-switching — board prep, stakeholder communications, briefings, logistics, and anything that falls through the cracks.

Claude Code becomes your preparation engine: briefings drafted in minutes, sensitive communications reviewed before they land on your executive's desk, and board decks structured before the exec touches them.

**Before Claude Code:** 90 minutes to prepare a solid executive briefing. 45 minutes to draft a sensitive all-hands announcement. 2 hours to build a board prep document from scratch.

**After:** Executive briefing in 20 minutes. Announcement draft in 15 minutes. Board prep in 30 minutes.

---

## 30-second install

```bash
# Install EA and CoS skills
npx claudient add skill small-business/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/board-deck-builder
npx claudient add skill productivity/confluence-expert
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Install the chief of staff agent
npx claudient add agent advisors/chief-of-staff
```

---

## Your Claude Code EA and CoS stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/exec-briefing` | Pre-meeting briefing: attendee profiles, talking points, agenda, desired outcomes, what NOT to commit to | Any high-stakes meeting |
| `/stakeholder-comms` | Company announcements, sensitive updates, all-hands prep, board communications, crisis messaging | Any significant communication draft |
| `/meeting-to-action` | Transcript or notes → action items, decisions, owners, deadlines | After every important meeting |
| `/monday-brief` | Weekly briefing document for the executive — priorities, key meetings, watchlist | Every Monday morning |
| `/board-deck-builder` | Board meeting deck structure, narrative, and content preparation | Monthly or quarterly board meetings |
| `/confluence-expert` | Document management, wiki structure, team knowledge base | Documentation and knowledge management |

### Agent

| Agent | Model | When to spawn |
|---|---|---|
| `chief-of-staff` | Sonnet | Complex strategic planning, multi-stakeholder coordination, operating cadence design |

---

## Daily workflow

### Morning (30 minutes)

**1. Monday brief — what your exec needs to know this week**

Run every Monday morning before the exec starts their day:

```
/monday-brief

Weekly brief for [executive name] — week of [date range].

KEY MEETINGS THIS WEEK:
- [Day, time]: [Meeting name] — [brief context — who, what's at stake]
- [Day, time]: [Meeting name] — [brief context]
- [Day, time]: [Meeting name] — [context]

DELIVERABLES DUE FROM EXEC THIS WEEK:
- [Item] — due [date] — [who needs it]
- [Item]

THINGS THEY NEED TO KNOW (but probably don't yet):
- [Important development — competitor news, team situation, stakeholder sentiment]
- [Item]

DECISIONS PENDING (exec needs to make this week):
- [Decision] — context: [brief] — deadline: [date]

WHAT TO WATCH:
[Anything developing that hasn't become urgent yet but will if not managed]

Format: maximum 1 page. Bullets. No fluff. The exec reads this in 3 minutes.
```

**2. Pre-meeting briefings — same-day prep**

For any high-stakes meeting today:

```
/exec-briefing

[Exec] has a meeting with [attendee(s)] at [time].

Meeting purpose: [what this meeting is about]
Attendees: [name, title, company — key facts for each]
What we want from this meeting: [outcome]
What they want from us: [their objective]
History: [any relevant background]
What NOT to commit to: [any constraints]

Generate the briefing. I need it by [time — 1-2 hours before the meeting].
```

---

### Post-meeting (15 minutes after important meetings)

**3. Meeting to action items**

```
/meeting-to-action

Extract action items from this meeting.

Meeting: [name]
Date: [date]
Attendees: [list]

[Paste notes, transcript, or your summary]

Extract:
- Decisions made
- Action items (who owns what by when)
- Open questions (no decision made, needs follow-up)
- Follow-up communications needed
```

---

### Communication drafting (on demand)

**4. Sensitive company communication**

```
/stakeholder-comms

Draft: [type of communication]
From: [executive name and title]
To: [audience]

The news: [what's happening]
Why it's happening: [rationale]
What it means for the audience: [impact]
Tone: [empathetic / direct / celebratory / careful]
Constraints: [anything legal/HR has said we can't include]

Review for: tone, clarity, anything that could be misread, what's missing.
```

**5. Board communication**

```
/stakeholder-comms

Board [type: meeting summary / off-cycle update / request / milestone announcement].

What happened or what's happening: [facts]
What the board needs to do or know: [action or information]
Timeline: [when decision needed or when more info available]

Under 400 words. Direct. Facts first.
```

---

### Board meeting prep (monthly or quarterly)

**6. Board deck preparation**

```
/board-deck-builder

Build the board meeting deck structure for [company name] — [Q? Month] [Year].

Board meeting date: [date]
Board composition: [list key members]
Key topics this quarter: [list agenda items]
Performance highlights to feature: [metrics and milestones]
Challenges to present honestly: [what didn't go as planned]
Decisions needed from the board: [list]

Generate: deck outline, slide-by-slide content structure, talking points per section, anticipated board questions.
```

---

### Weekly close (Friday)

**7. End-of-week summary**

```
/monday-brief

End-of-week summary for [executive].

WHAT GOT DONE THIS WEEK:
[List major completed items]

OPEN ITEMS CARRYING INTO NEXT WEEK:
[List]

WHAT NEEDS EXEC ATTENTION BEFORE MONDAY:
[Any urgent items to handle before the week closes]

NEXT WEEK PREVIEW:
[Key meetings, deliverables, and situations to watch]
```

---

## 30-day ramp plan (new EA or CoS)

### Week 1 — Map the landscape
- Install all EA/CoS skills: `npx claudient add skill productivity/[name]`
- Learn the executive's calendar: what meetings recur, which are high-stakes, which they dread
- Run the Monday brief format past the exec — do they want more or less detail? different focus?
- Identify the 5 most important stakeholders in the exec's world and build profiles using `/exec-briefing`

### Week 2 — Communications workflow
- Draft the next board update or significant announcement using `/stakeholder-comms`
- Show the exec the draft before and after — let them see the time savings and quality
- Establish the communication review process: who reviews sensitive drafts before they go out?
- Use `/meeting-to-action` on every meeting for a week — track what gets done vs. what doesn't

### Week 3 — Board and stakeholder prep
- Use `/exec-briefing` to prep the exec for their next significant external meeting
- Use `/board-deck-builder` on the upcoming board meeting
- Review the output with the exec — calibrate detail level and what to add from internal knowledge

### Week 4 — Systems and automation
- Document your weekly cadence — which Claude skills you run on which days
- Build a library of reusable prompts for your most frequent tasks
- Identify what you're still spending too much time on — there's likely a Claude workflow for it
- Set benchmarks: how long does each task take? Track improvement over the next 90 days

---

## High-stakes communication principles

These apply to everything you draft for your executive:

**1. Lead with the news, not the context**
"We are closing the London office effective March 1." Not "As we continue to evaluate our real estate footprint in the context of our evolving hybrid work strategy..."

**2. Say the difficult thing clearly**
Euphemisms don't soften bad news — they signal that leadership doesn't trust the audience with honesty, which destroys more trust than the news itself.

**3. Three things maximum**
People remember three things from any communication. If you have seven points, pick three. The rest goes in the appendix or the follow-up.

**4. Tell them what happens next**
Every significant announcement should end with a specific next step — a follow-up meeting, a person to contact, a date for more information.

**5. Legal review is not optional for sensitive communications**
Claude drafts efficiently and catches tone issues. It does not replace HR and legal review for: layoffs, performance actions, regulatory matters, material business changes.

---

## Tool integrations

### Google Calendar
Claude can't read your exec's calendar directly (unless you use a calendar MCP), but you can paste the week's meetings as text. Use this format:
```
Monday 9am: [meeting title] — [attendees] — [duration] — [goal]
Monday 11am: [meeting] ...
```
Then run `/monday-brief` with that as context.

### Slack / Teams
Draft sensitive messages or announcements in Claude → review → paste to Slack. For recurring all-hands summaries, paste the bullet points from `/meeting-to-action` into your team channel.

### Notion / Confluence
Use `/confluence-expert` to structure documentation pages. Claude drafts the content — you paste into your wiki. For recurring documents (board updates, weekly briefs), build templates in Notion and fill them with Claude outputs.

### Board portal (Diligent, Boardvantage)
Claude generates board communications as text → format and upload to your board portal. For deck content, Claude provides the structure and talking points — your designer builds the visual version.

---

## Metrics to track

| Activity | Time before Claude | Time with Claude |
|---|---|---|
| Executive briefing document | 90 min | 20 min |
| Company-wide announcement draft | 45 min | 15 min |
| Board meeting prep | 3 hours | 45 min |
| Meeting action items | 30 min | 8 min |
| Monday brief | 30 min | 10 min |
| Sensitive communication draft | 60 min | 20 min |

---

## Common mistakes (and how Claude Code prevents them)

**Mistake 1: Briefings that are too long**
`/exec-briefing` is structured to produce concise, scannable documents. Executives don't read long briefs — they get a summary whether you write one or not. Make it intentional.

**Mistake 2: Announcements that bury the news**
`/stakeholder-comms` is prompted to lead with the news in the first sentence. If Claude buries it, flag it and ask for a rewrite with the news in sentence 1.

**Mistake 3: Meeting action items that don't get done**
`/meeting-to-action` structures action items with owner, due date, and success metric. Ambiguous actions don't get done. Specific ones do.

**Mistake 4: Sensitive communications that miss the emotional register**
Claude checks for clarity and tone issues, but you know your exec and your culture. Review every sensitive communication before it leaves your desk — Claude is the first editor, not the last.

**Mistake 5: Board materials that report instead of inform**
`/board-deck-builder` is designed to structure materials around decisions, not just data. Boards need to decide things. Make it easy for them.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [Executive briefing skill](../skills/productivity/exec-briefing.md)
- [Stakeholder communications skill](../skills/productivity/stakeholder-comms.md)
- [Meeting to action skill](../skills/small-business/meeting-to-action.md)
- [Board deck builder skill](../skills/productivity/board-deck-builder.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
