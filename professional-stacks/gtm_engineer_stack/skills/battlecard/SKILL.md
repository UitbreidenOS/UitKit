---
name: battlecard-builder
description: Builds a competitive battlecard for a named competitor using G2, Capterra, and Exa review data. Returns: 3 strengths to acknowledge, 3 landmine questions to plant in discovery, and a positioning wedge. Used in discovery calls and SDR prep.
allowed-tools: WebSearch, WebFetch, mcp__exa__search
effort: medium
---

# Battlecard Builder

## When to activate
A prospect mentions a specific competitor by name. Preparing for a competitive deal or loss. Building SDR objection handling scripts for a rival. Sales team needs a battlecard for a deal at risk of losing to a known competitor.

## When NOT to use
General market research or landscape analysis. Competitors you don't actually compete with. Building positioning against an entire category. Academic or analytical research.

## Research Sources

Pull from four sources in order of priority:

1. **G2 Reviews** — Filter 1–3 star reviews only. Search for "but" clauses ("Great UI but..."). These reveal what customers wish was different, not marketing spin. Look for feature gaps, integration issues, pricing frustrations.

2. **Capterra Reviews** — Similar filtering. Often more candid than G2. Check for complaints about customer support, onboarding friction, or missing features specific to your ICP.

3. **Competitor Pricing Page** — What price tiers do they offer? Who is their ICP (mid-market, enterprise, SMB)? What features are locked behind higher tiers? Reveals their positioning.

4. **Job Postings** — Search their careers page or LinkedIn. New engineering hires signal what they're building next. Product manager roles hint at roadmap priorities. Sales roles in new verticals reveal expansion plans.

5. **Reddit/Community Forums** — Subreddits like r/sales, r/startups, industry forums. Users vent here in unfiltered language. Keyword search: "{competitor_name} {feature} {complaint}".

## Battlecard Structure

A battlecard has three sections. All three must be present.

### 1. Their Strengths (2–3 honest points)

What their customers actually love. This is your credibility move — it shows you did homework and aren't just bashing them. Use their own review language where possible.

Format: One sentence per strength. Begin with the capability, end with the user outcome.
- Example: "Their API integrations are native across Slack, Salesforce, and HubSpot — teams can move data between tools without custom code."

**Why:** In discovery, when you acknowledge their real strength, the prospect trusts you more. They assume you'll be honest about weaknesses too.

### 2. Landmine Questions (3 questions)

Open-ended questions that reveal their weakness naturally, without naming them. The prospect answers the question and surfaces their own pain with the competitor.

**Format:** "How do you currently handle {X}?" where X is their known weak point.

**Rules:**
- Never say "Apex CRM doesn't do X." Ask "How do you handle X?" and let silence do the work.
- Use past or present tense. Assume they're already using the competitor.
- Each question targets a different weakness (e.g., one on integration, one on reporting, one on support).
- The prospect's answer should naturally lead to a conversation about your solution.

**Examples of good landmine questions:**
- "How are you managing custom fields across your sales and customer success tools right now?" (exposes integration pain)
- "Walk me through how you get visibility into pipeline health across multiple managers." (exposes reporting/collaboration pain)
- "When something breaks in your workflow, how quickly do you usually get support?" (exposes support SLA pain)

### 3. Positioning Wedge (1–2 sentences)

Your differentiator. Avoid superlatives, avoid naming them, avoid attack language. Lead with an outcome, not a feature.

**Format:**
1. Acknowledge their strength: "Apex CRM does do X well."
2. State your outcome: "We're built for teams that need Y because Z."

**Rules:**
- One claim max. Don't list five differentiators.
- Never say "better than" or "unlike." Use contrast instead: "We designed for remote-first teams" (implies they didn't; doesn't say it).
- If their strength is real, acknowledge it. Credibility > micro-win.

**Example of good wedge:**
"Apex CRM is strong on deal tracking. We're built for teams selling land-and-expand, where you need deal tracking plus multi-threaded stakeholder mapping so you can identify which relationships own the expansion decision."

**Bad wedge (don't do this):**
"Apex CRM is slow and bloated. We're faster." (Attack language, no outcome)

---

## Example Battlecard

**Competitor:** Apex CRM

**Their Strengths:**
1. Native Slack integration with push notifications for deal alerts — teams don't need custom webhooks to get alerted when something moves.
2. Robust API with strong Salesforce + HubSpot sync — sales ops can build complex workflows without engineering help.
3. Mobile app with full deal visibility — reps can update deals from site visits.

**Landmine Questions:**
1. "Walk me through how you're currently managing forecast accuracy across multiple sales managers — are you doing any predictive modeling, or mostly manual pipeline reviews?"
2. "How are you handling the handoff between SDR and AE right now — is there a risk of deals getting re-qualified twice or deals falling through the cracks?"
3. "When your reps are deep in a deal with five stakeholders, how do you currently track who owns which relationship — is that in Apex, or are you using a spreadsheet or Slack thread?"

**Positioning Wedge:**
"Apex CRM does a good job with standard deal tracking. We're purpose-built for high-complexity B2B sales where you're tracking multiple stakeholder relationships and need to map buyer consensus across the organization — so you know exactly who is blocking a close and can focus your coaching there."

---
