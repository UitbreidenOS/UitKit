---
name: meeting-prep
description: Generates a pre-call brief in under 60 seconds. Returns: 30-second company context, 3 discovery questions tied to their specific triggers, primary pain angle, and a voicemail script. Run this before every call.
allowed-tools: Read, WebSearch, WebFetch
effort: low
---

## When to activate

Before any cold call, discovery call, or follow-up call. Requires an account brief to exist in `accounts/{slug}-brief.md`.

## When NOT to use

Not a substitute for account research. Run account-researcher first if no brief exists.

## Brief Structure (5 parts)

A complete pre-call brief contains exactly these five sections:

1. **30-second context**: company name, what they do, company size, and the single most recent trigger
2. **Trigger summary**: the specific event to open with and why it's relevant to your value prop
3. **Stakeholder context**: their role, likely priorities given the trigger, likely first objection
4. **3 discovery questions**: open-ended, each tied to a specific signal from the account brief, not yes/no
5. **Voicemail script**: for if no answer — max 27 seconds when read at normal speaking pace

## Discovery Question Rules

Each question must:

- Be open-ended (never yes/no)
- Reference a specific signal from the brief ("Since you raised Series A…", "When you hired…")
- Reveal their current state (don't assume you know it)
- Contain one hypothesis per question (not multiple angles)

**Strong examples:**
- "Since you raised Series A, how is your finance team thinking about GTM tool consolidation right now?"
- "When you look at your current customer data stack, what's the biggest bottleneck your RevOps team hits most often?"

**Weak examples:**
- "Are you looking for a RevOps tool?" (yes/no, no signal)
- "Do you have pain points with your current stack?" (vague, not tied to anything from the brief)

## Voicemail Rules

- **Max 27 seconds** at normal speaking pace (~65 words)
- **Format**: Your name + company name + specific reason (reference the trigger) + single CTA (reply to email OR call back number)
- **Avoid**: No pitch, no "I wanted to see if you might be open to…", no false urgency

**Strong example:**
"Hi Jamie, this is Alex Chen from Meridian Stack. I saw you raised your Series A last month, and we work with scaling ops teams on the exact handoff problem between sales and finance. I've got two 30-minute slots this week — does Wednesday or Thursday work better for you? It's 415-555-0147."

## Call Type Variants

| Call Type | Focus | Discovery Angle |
|---|---|---|
| **Cold** | Trigger + curiosity | Why now matters, not pain. Permission to keep talking. |
| **Discovery** | Current pain + current state | What they're doing now, gaps in execution. Understand maturity level. |
| **Follow-up** | Last conversation + next step | Reference what they told you, advance it. Commit to next milestone. |

## Example Brief

**Prospect**: Jamie Park, VP Operations  
**Company**: Meridian Analytics  
**Company Size**: 180 employees  
**Recent Trigger**: Raised Series A $18M 5 weeks ago; hired Head of RevOps  
**Call Type**: Cold outreach

---

### 30-Second Context
Meridian Analytics is a 180-person, Series A-funded analytics platform for consumer finance. They just closed $18M and brought in a new Head of RevOps — which means they're scaling ops function from startup to scale-up.

### Trigger Summary
The Series A close + RevOps hire is the opening. Your value prop: ops teams at their stage hit a bottleneck between sales pipeline data and finance close data. This is their immediate problem.

### Stakeholder Context
**Role**: VP Operations — owns the entire ops stack, likely reports to the CFO.  
**Likely Priority**: Getting the new RevOps hire ramped and aligned with finance reporting within 90 days.  
**Likely First Objection**: "We just implemented a new stack, we're not looking right now" or "Our sales team is spread across too many tools already."

### 3 Discovery Questions

1. "With your new head of rev ops starting, what's the biggest data flow problem between sales pipeline and finance close that's been on the backlog?"
   - *Hypothesis*: She's feeling the pain of fragmented data but hasn't solved it yet.

2. "When you closed this Series A, did your board or finance team flag any gaps in real-time revenue visibility?"
   - *Hypothesis*: Finance is asking for monthly close visibility, which reveals the underlying ops gap.

3. "As you think about the next 12 months and 3x headcount in ops, what's the one integration problem that's going to get worse if you don't fix it now?"
   - *Hypothesis*: She's thinking about scale and wants to prevent tech debt.

### Voicemail Script

"Hi Jamie, this is Alex Chen from Meridian Stack. Congrats on closing your Series A — I saw that hit the news last month. We work specifically with ops teams who just brought in their first RevOps hire, helping them avoid the classic disconnect between sales data and finance reporting. I've got three 30-minute slots this Thursday — does morning or afternoon work better? It's 415-555-0147."

*(Reading time: 24 seconds.)*

---
