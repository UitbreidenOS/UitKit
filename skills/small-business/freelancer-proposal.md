---
name: freelancer-proposal
description: "Freelancer toolkit: project proposals, pricing guidance, invoice follow-up sequences, plain-English project contracts, and client offboarding documents"
updated: 2026-06-13
---

# Freelancer Proposal

## When to activate
- A prospect asked for a proposal and you need to get one out today
- You are unsure how to price a project — hourly vs. fixed, what rate, how much buffer
- A client invoice is overdue and you need to follow up without damaging the relationship
- You are wrapping up a project and need a clean delivery and offboarding process

## When NOT to use
- Formal legal contracts for high-value or high-risk engagements — have a lawyer review anything over $25K or with unusual IP terms
- Tax or financial advice — use an accountant for quarterly estimates, deductions, and business structure
- Automated invoicing or payment processing — use FreshBooks, Wave, or QuickBooks for that

## Instructions

### Proposals (90 seconds)

Tell Claude:
- What the client wants to accomplish — in their words if you have them
- Your understanding of the scope of work: what you will deliver, what is out of scope
- Your rate (hourly or project-based) and timeline estimate
- Any known constraints: their deadline, their budget range if they shared it, any technical or logistical limits

Claude writes a complete proposal document:

**Executive summary** — 2-3 sentences restating their problem and your solution. Written from their perspective, not yours. Starts with their goal, not your credentials.

**Scope of work** — what is explicitly included (deliverables, rounds of revisions, meetings, formats). Then: what is explicitly not included. This section prevents scope creep more than any contract clause. Claude is rigorous about the "not included" list.

**Timeline** — phases with estimated completion dates, based on your estimate. Claude flags dependencies: "Phase 2 begins after client approval of Phase 1 deliverables" — so delays on their end do not compress your timeline.

**Investment** — your price, payment schedule, and what triggers each payment. For fixed-fee projects, Claude adds a 20% buffer to your raw estimate and shows you how to present it cleanly to the client.

**Next steps** — a single clear action for the client to take (sign, reply to confirm, pay deposit).

---

### Pricing guidance

Tell Claude:
- The type of project (logo design, website build, marketing strategy, bookkeeping, copywriting, etc.)
- Your target hourly rate
- Your estimated hours for this project
- Your market (US, UK, EU, etc.) and your experience level (1-3 years, 5+ years, specialist)
- Whether the client has a stated budget

Claude calculates your project rate, checks whether it aligns with market benchmarks for your category, and recommends whether to quote hourly or fixed for this type of work.

When to quote fixed: projects with clear deliverables and defined scope. When to quote hourly: consulting, strategy, or anything where the scope is exploratory.

The 20% buffer rule: Claude adds it to your raw estimate when generating a fixed price and explains how to present it to clients who ask for a breakdown. The framing is: this accounts for revision cycles, client communication overhead, and any technical unknowns. Most clients accept it when it is explained.

---

### Invoice follow-up

Tell Claude:
- The invoice amount and due date
- How many days overdue it is
- Your relationship with this client (long-term vs. first project, friendly vs. professional distance)
- What communication has already happened (did you send the invoice? any responses?)

Claude drafts the follow-up message appropriate to the stage. Three-stage escalation:

**Stage 1 — 3 days overdue:** Friendly, assumes a mistake. No mention of late fees. "Just checking in to make sure this didn't get lost in your inbox."

**Stage 2 — 14 days overdue:** Direct. References the original invoice. Notes your late fee policy if you have one. Proposes a specific payment date. Still professional, not threatening.

**Stage 3 — 30 days overdue:** Final notice. Clear statement of next steps if payment is not received by a specific date. If you have a late fee in your contract, this message applies it. Tone: factual, not emotional.

---

### Project contracts

Tell Claude:
- Type of work and deliverables
- Project duration and payment schedule (deposit + milestones, or deposit + final)
- Your revision policy (how many rounds are included before additional charges)
- IP ownership: does the client own the work on final payment, or do you retain anything?
- Kill fee: what you charge if the client cancels mid-project (typically 25-50% of the remaining balance)
- Your jurisdiction (state or country, for governing law clause)

Claude produces a plain-English project agreement. Not legalese — complete sentences that both parties actually understand. Covers: scope, timeline, payment, revisions, IP transfer, kill fee, what happens if either party needs to pause, and basic dispute process.

This is a starting point, not legal advice. For contracts over $25K, complex IP situations, or any client in a different legal jurisdiction, have a lawyer review it.

---

### Client offboarding

Tell Claude:
- Project name and what was delivered
- Any ongoing relationship (retainer, support period, referral arrangement)
- Whether you want to ask for a testimonial or referral

Claude produces a clean offboarding package:
- Delivery email with a handoff summary — what was delivered, where files live, any credentials or access being transferred
- Final invoice (if not already sent)
- 30-day support offer language (if you want to include one)
- Testimonial request — a specific, low-friction ask that tells the client exactly what you want them to speak to

---

### Prompt template — proposal

```
Please write a client proposal.

Client goal: [what they want to achieve]
Scope of work:
- Included: [deliverables, rounds of revisions, meetings]
- Not included: [explicitly out of scope]

My rate: $[X] [hourly/project-based]
Timeline estimate: [X] weeks
Payment terms: [deposit % + milestone structure]
Deadline: [client's stated deadline, if any]

Please include a 20% buffer in the fixed price and show me how to present it.
Write in a [professional/warm/direct] tone.
```

## Example

A web designer receives a vague inquiry: "Can you build us a website? Budget around $5K."

The designer tells Claude: the client is a local accountant who needs a 5-page site with a contact form, their current branding assets exist (logo, colors), they want to launch before tax season, and the designer estimates 40 hours of work at $120/hour.

Claude produces:

Raw estimate: 40 hours x $120 = $4,800. With 20% buffer: $5,760. Claude rounds to $6,200 and drafts the presentation: "This project is quoted at $6,200 fixed-fee. That includes up to two rounds of revisions on each page, all mobile optimization, and a 30-day support window after launch. It does not include copywriting, photography, or ongoing hosting — those can be added if needed."

Scope of work includes exactly: 5 pages (Home, About, Services, FAQ, Contact), contact form with email notification, basic on-page SEO setup, mobile-responsive design, 2 rounds of revisions per page.

Not included: custom illustrations, blog or content management system, Google Ads setup, social media integration beyond linking icons, domain purchase or hosting setup.

Timeline: 4 weeks from signed agreement and deposit receipt.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
