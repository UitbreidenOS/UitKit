# Deal Screening Workflow

A repeatable, step-by-step process for evaluating inbound deal flow — from first look to IC-ready decision — using Claude Code skills at each stage.

---

## Overview

This workflow covers a full deal evaluation cycle: approximately 2-3 weeks from first contact to IC decision for a seed/Series A deal. Steps are designed to be used with Claude Code skills at each phase. Time estimates assume Claude augmentation.

**Total time (with Claude):** 8-12 hours across 3 weeks for a deal that proceeds to IC
**Total time (without Claude):** 25-40 hours

---

## Stage 1: First-pass screen (Day 1 — 30-60 minutes)

### Trigger
Inbound deal from: founder cold outreach, LP referral, co-investor, conference, accelerator batch, scout.

### Step 1.1 — Capture deal information

Before touching Claude, collect:
- Company name and URL
- Founder names and LinkedIn profiles
- Deck or one-pager (if provided)
- Brief description of what they do
- Stage and round size they're raising
- Revenue or ARR (if disclosed)

### Step 1.2 — Quick screen

```
/deal-screening

Run a quick first-pass screen on [company name].

What I know:
- Company: [name], [website]
- What they do: [paste their description]
- Stage: [pre-seed / seed / Series A]
- Raising: $[X]M at $[X]M pre-money (if disclosed)
- Revenue/ARR: $[X]M (if disclosed)
- Founder background: [brief]

My fund mandate:
- Target stage: [seed / Series A]
- Target sectors: [list]
- Target check size: $[X]M–$[X]M
- Geographic focus: [US / EU / global]

Verdict options: PASS / REQUEST DECK / REQUEST MEETING / FLAG FOR PARTNER
```

### Step 1.3 — Deal log entry

If the verdict is REQUEST DECK or REQUEST MEETING, log to your pipeline:
- Company name, sector, stage
- Source of intro
- First-pass notes (2-3 sentences)
- Next action and owner
- Date of first contact

**Outcome of Stage 1:** Pass (logged as pass with reason) or proceed to Stage 2.

---

## Stage 2: Deck review and first meeting (Days 3-7)

### Step 2.1 — Deck analysis

```
/deal-screening

Analyze this pitch deck and extract the key investment signals.

[Paste deck content or key slides as text]

Extract:
1. What problem are they solving and for whom?
2. What is the proposed solution and business model?
3. Key metrics highlighted: [revenue, growth, customers, NPS]
4. Market size claim: [TAM/SAM] — does this seem credible?
5. Team: [who they are, what they've done before]
6. Ask: $[X]M at $[X]M pre-money — reasonable for stage?

Flag: Any claims that are unusual, unverifiable, or that warrant specific questions in the first call.
```

### Step 2.2 — First meeting prep

```
/deal-screening

Prepare 12 questions for a first-call with [company] founders.

Based on the deck/description, I want to understand:
- Is the market real and large enough?
- Do these founders have the right to win?
- What do the early traction numbers actually mean?
- What assumptions is the business built on that could be wrong?

Prioritise for a 45-minute call. First 3 questions should be about the founders themselves, not the business.
```

### Step 2.3 — First meeting notes

During the call, note:
- Direct answers to your questions
- Moments of hesitation or vague answers (flag for diligence)
- Your gut read on the founders: clarity, conviction, coachability
- Anything they said that surprised you (positive or negative)
- What they didn't say (gaps)

### Step 2.4 — Post-meeting deal memo

```
/deal-memo

Write a first-pass deal memo based on my notes from the founder meeting.

My meeting notes: [paste notes]
My initial reaction: [your gut — what excited you, what concerned you]

Build the deal memo structure. Mark everything I couldn't verify as [NEED TO CHECK].
Flag the 5 most important questions I still need to answer before I can recommend investing.
```

**Outcome of Stage 2:** Pass (with reason logged) or proceed to Stage 3. Share with a partner for a go/no-go on full diligence.

---

## Stage 3: Diligence (Days 7-21)

### Step 3.1 — Diligence plan

```
/diligence-review

Build a diligence plan for [company].

Investment thesis: [what we'd need to believe to invest]
Key risks identified in deal memo: [list top 5]
Available time: [X days] before decision deadline

Generate a diligence checklist prioritized by:
1. Items that could kill the deal (do first)
2. Items that validate the thesis (do second)
3. Items that are nice-to-have but not blocking

Assign: [customer calls / technical / financial / legal / reference]
```

### Step 3.2 — Customer reference calls (2-4 calls)

```
/diligence-review

I'm calling a reference customer of [company] — [customer name, title, company].

Investment thesis I'm testing: [your thesis]
Top risks I'm trying to de-risk: [list 3]

Generate 12 questions that:
- Probe genuine product usage (not testimonials)
- Ask about the alternative if they didn't have this product
- Assess how embedded/sticky the product is
- Test whether the company's claims about this customer are accurate
- Uncover any dissatisfaction they might not volunteer
```

After each call, log:
- Usage: how heavily they use it, how many users, which features
- Switching cost: would they cancel if there were a 20% price increase?
- Comparison to alternatives they evaluated
- Any complaints or concerns
- Overall NPS signal: would they recommend to a peer?

### Step 3.3 — Financial diligence

```
/diligence-review

I received financial data from [company]. Review for consistency and flag anomalies.

FINANCIAL DATA PROVIDED:
[Paste monthly P&L, ARR schedule, or financial summary]

Check for:
1. Revenue recognition: is ARR calculated consistently? (no inflated MRR → ARR math)
2. Gross margin: what's included in COGS? Are hosting costs fully loaded?
3. Burn rate: does it reconcile with bank balance movement?
4. Customer concentration: what % of ARR comes from top 3 customers?
5. Churn: how is gross vs. net churn calculated?
6. Cash: actual bank balance vs. what's implied by their burn and fundraising history

Flag any metric that doesn't add up. Generate questions to ask the CFO/founder.
```

### Step 3.4 — Comps and valuation

```
/comps-analysis

Run a comps analysis to benchmark this deal's valuation.

Company being evaluated: [name]
Metrics: ARR $[X]M, [X]% growth, [X]% gross margin, NRR [X]%
Deal terms: $[X]M raise at $[X]M pre-money = [X]x ARR multiple

Find comparable public SaaS companies and recent private transactions:
- Same sector or adjacent
- Similar revenue scale
- Similar growth rate

What EV/ARR multiple are comps trading at?
What's the premium or discount we'd be paying?
At what growth rate would this valuation be justified?
```

### Step 3.5 — Technical diligence (if applicable)

For developer tools, infrastructure, AI, or any product where technical architecture matters:

```
I need to understand the technical architecture and defensibility of [company].

What they've told me:
- Tech stack: [what they use]
- AI/ML claims: [if any]
- Infrastructure: [cloud provider, self-hosted, etc.]
- Moat claims: [proprietary data / algorithms / integrations]

Generate a technical diligence question list for a call with their CTO covering:
1. Build vs. buy decisions and their rationale
2. How much of the core IP is truly proprietary vs. wrappers
3. Scalability architecture (what breaks at 10x current volume)
4. Security posture and any history of breaches
5. Key technical hires and bus factor (how many people hold critical knowledge)
```

### Step 3.6 — Diligence synthesis

```
/diligence-review

Synthesize all diligence findings for [company] into a pre-IC summary.

Customer calls (N=X):
[Summarize key themes]

Financial review:
[Summarize findings, flags, clean items]

Technical review:
[Summarize if applicable]

Reference calls:
[Summarize founder references]

For each original risk from the deal memo:
[Risk] | [Status: De-risked / Still open / Confirmed as issue]

Recommendation update: [invest / pass / conditional] based on diligence. Has anything changed from the initial deal memo? What are the remaining open issues?
```

**Outcome of Stage 3:** Decision to invest or pass. If invest, proceed to Stage 4.

---

## Stage 4: IC preparation (Days 18-22)

### Step 4.1 — IC memo

```
/ic-memo

Convert the deal memo and diligence findings into a full IC memo for [company].

Deal memo: [paste or summarize]
Diligence findings summary: [paste]
Proposed terms: $[X]M at $[X]M pre-money, [X]% ownership

Generate all 9 sections. Mark [VERIFY] on anything not confirmed in diligence.
Highlight open items that IC needs to decide whether they are acceptable risks.
```

### Step 4.2 — IC meeting prep

Prepare yourself to defend the recommendation:

```
/deal-memo

I'm presenting [company] to IC. Help me prepare for hard questions.

My recommendation: [invest / pass]
IC members and their known concerns: [list partners and their typical areas of focus]

Generate the 10 hardest questions I'll face and draft my answers based on what I know.
Flag the 2-3 questions where I don't have a strong answer and need to prepare.
```

### Step 4.3 — IC decision log

After IC:
- Log the decision: invest / pass / more diligence
- If invest: log proposed terms, timeline, who's drafting the term sheet
- If pass: log the primary reason (useful for founder feedback and fund learning)
- If more diligence: log specific open items and who owns resolving them

**Outcome of Stage 4:** Investment decision with documented rationale.

---

## Stage 5: Post-investment setup (Week 4+)

### Step 5.1 — Portfolio monitoring setup

Once the investment closes:

```
/portfolio-monitor

Set up a monitoring framework for [company].

Investment thesis: [what we believed]
Key milestones we expect in Year 1: [list 3-5]
Key KPIs to track monthly: [ARR, burn, NRR, headcount, gross margin]
Board schedule: [monthly / quarterly]

Generate a company profile card for our portfolio tracking system.
```

### Step 5.2 — First board meeting

Within 60 days of close, run a board kickoff:

```
/portfolio-monitor

Prepare me for the first board meeting with [company].

Recent close: [date]
Investment thesis: [your thesis]
Founder priorities shared in closing: [what they said they want to focus on]
My priorities as a board member: [what I want to track]

Generate: board agenda proposal, initial KPI dashboard structure, first 90-day milestone plan to review with founders.
```

---

## Metrics to track (across your deal pipeline)

| Metric | Track weekly |
|---|---|
| Deals screened | Total, source breakdown |
| Pass rate at each stage | Stage 1 / 2 / 3 / 4 |
| Source quality | Which referral sources lead to IC-stage deals |
| IC conversion | Deals presented vs. approved |
| Deal velocity | Days from first contact to IC |
| Reference call insights | % of deals where customer calls changed your view |

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
