---
name: post-call-processor
description: Processes a call transcript or notes and produces: follow-up email draft, CRM update fields (stage, next step, decision maker, budget signal, timeline), and call quality score (1–10) with improvement notes. Run within 30 minutes of hanging up.
allowed-tools: Read, Write
effort: medium
---

# Post-Call Processor

## When to activate
Within 30 minutes of any call — cold, discovery, or follow-up.

## When NOT to use
Not for demos (use a dedicated demo-debrief). Not for internal calls.

## Input Formats Accepted

- **Transcript paste**: paste raw transcript, Claude extracts key moments
- **Bullet notes**: unstructured notes, Claude structures and fills gaps
- **Gong/Chorus summary**: paste the AI summary, Claude formats and scores it

## Follow-Up Email Rules

Send within 2 hours. Reference 1 specific thing they said verbatim (shows you listened). Confirm next step with specific date. Max 100 words. Subject line format: "Next steps — [Company]" or "Following up on [specific topic they raised]".

## CRM Update Fields

Output a structured block with: Stage, Next step + date, Economic buyer (name/title/confirmed yes/no), Budget signal (explicit dollar/implicit signal/none), Decision timeline, Technical fit (yes/no/unknown), Champion confidence (1–5 scale with reason).

## Call Quality Score (10-point rubric)

- **Discovery questions asked (3 pts)**: 3+ open questions = 3, 1–2 = 1, 0 = 0
- **Objections handled with proof or story (2 pts)**: handled with example = 2, deflected = 1, missed = 0
- **Next step confirmed with date (2 pts)**: yes = 2, vague = 1, no = 0
- **Talked less than 50% of call (2 pts)**: yes = 2, 50–60% = 1, >60% = 0
- **Trigger referenced by name (1 pt)**: yes = 1, no = 0

## Red Flags to Surface

5 deal risk signals to escalate:

1. No next step agreed
2. Only one stakeholder engaged
3. Budget never came up
4. Close was "send me info"
5. Call under 8 minutes

## Example Output

**Discovery call with Jamie Park at Meridian Analytics** — 28 minutes, Series A funded, RevOps tooling need identified, budget unconfirmed, demo scheduled 2 weeks.

---

### Follow-Up Email

**Subject:** Next steps — Meridian Analytics

Hi Jamie,

Thanks for the call today. I appreciated hearing how you're thinking about RevOps consolidation—especially the point about three separate tools eating into your team's velocity.

We'll send over that case study on deal staging workflows (similar to what you described) by tomorrow morning. The demo is locked for June 26 at 2pm—I'll send the Zoom link Wednesday.

Quick question: who else from RevOps should we include? Wanted to make sure we're covering the full picture.

Talk soon,
[Your name]

---

### CRM Update

| Field | Value |
|-------|-------|
| **Stage** | Qualified Lead / Discovery |
| **Next Step** | Product demo, June 26, 2:00 PM PT |
| **Economic Buyer** | Jamie Park, VP of RevOps — confirmed |
| **Budget Signal** | Implicit (Series A funding, tool-shopping phase, no explicit number mentioned) |
| **Decision Timeline** | 4–6 weeks (pilot before year-end) |
| **Technical Fit** | Yes (Salesforce stack, existing API integrations) |
| **Champion Confidence** | 4/5 — Jamie is engaged, has budget authority, but needs CRO sign-off on tool selection |

---

### Call Quality Score: 7/10

**Breakdown:**
- Discovery questions: 3/3 (asked about current tools, workflow gaps, CRO involvement)
- Objections handled: 1/2 (Jamie mentioned "we tried integration platforms before"—missed chance to ask what failed)
- Next step + date: 2/2 (demo confirmed June 26)
- Talk ratio: 2/2 (Jamie spoke ~55%, you ~45%)
- Trigger referenced: 1/1 (mentioned tool sprawl by name: "three separate tools")

**Improvement:** On the integration platform objection, pause and dig: "What specifically didn't work?" Get the past failure story before the demo. This prevents repeating their mistake and surfaces the exact capability gap to demo.

---
