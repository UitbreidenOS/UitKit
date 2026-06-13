# AE Deal Cycle Workflow

Een stapsgewijze workflow voor het beheren van een B2B-verkoopdeal van de eerste vergadering tot het ondertekende contract — met Claude Code-prompts in elke fase.

---

## Wanneer deze workflow te gebruiken

- Je hebt een eerste vergadering geboekt met een gekwalificeerde account
- Je neemt een lopende deal over en wilt snel bijgepraat worden
- Je wilt je dealmanagementproces standaardiseren over een heel gebied
- Je bereidt je voor op een eindejaarsoffensief voor kansen in een laat stadium

---

## Dealfasen en uitstapcriteria

Elke fase heeft een duidelijke definitie en uitstapcriteria. Verplaats een deal pas naar de volgende fase als aan de criteria is voldaan.

| Fase | Definitie | Uitstapcriteria (doorgaan naar volgende fase) |
|---|---|---|
| Discovery | Het begrijpen van de situatie, pijn en geschiktheid van de koper | Bevestigde pijn, geïdentificeerde stakeholders, gekwalificeerd budgetbestaan |
| Demo/Evaluatie | De oplossing demonstreren aan de hand van de gestelde behoeften | Koper heeft het product gezien, technische geschiktheid bevestigd, evaluatieplan overeengekomen |
| Voorstel | Commercieel aanbod in handen van de koper | Voorstel beoordeeld door economische koper, vragen beantwoord |
| Onderhandeling | Voorwaarden worden besproken | Commerciële en juridische voorwaarden afgestemd, inkoopproces lopend |
| Mondeling | Mondelinge of schriftelijke toezegging om door te gaan | Economische koper bevestigt intentie, papierproces in gang gezet |
| Gesloten Gewonnen | Ondertekend contract | DocuSign voltooid, CS-overdracht geïnitieerd |

---

## Fase 1 — Discovery

### Voorbereiding voor het gesprek (15 minuten voor elk discoverygesprek)

```
/deal-desk (for initial fit check)

Pre-discovery brief for [company name].

Product I sell: [one line]
ICP: [company size / industry / role]

What I know about this company: [paste anything from LinkedIn, website, or your research]

Tell me:
1. ICP fit signal: do they look like a good fit based on what I can see?
2. The most likely pain point I should probe based on their profile
3. The 3 discovery questions I should prioritise for a 30-minute first call
4. The one question I must get answered to decide if this is worth advancing
```

### Uitvoering van het discoverygesprek

Voer een gestructureerd discoverygesprek uit met behulp van dit raamwerk:

**SPIN Selling-volgorde:**
1. **Situatievragen** (huidige toestand begrijpen): "Vertel me hoe je team momenteel [proces] afhandelt."
2. **Probleemvragen** (pijn aan de oppervlakte brengen): "Waar loopt dat proces vast? Wat kost het je als dat gebeurt?"
3. **Implicatievragen** (de pijn vergroten): "Wat gebeurt er verderop wanneer [probleem] optreedt? Wie heeft er nog meer last van?"
4. **Behoeftevragen** (hen de waarde laten verwoorden): "Als je [het probleem kunt oplossen], wat zou dat dan betekenen voor [hun doel]?"

### MEDDPICC-update na het gesprek (direct na het gesprek)

```
/deal-review

Update MEDDPICC from this discovery call.

Company: [name]
Deal size estimate: $[X] (if discussed) / unknown
Stage: Discovery → Demo

What I learned on the call:
[paste your rough notes — bullet points are fine]

For each MEDDPICC dimension: what did I confirm, what's still missing?
Flag the dimension with the most risk.
Tell me: should I advance this to Demo stage, or do I need another discovery call?
```

**Fasepoort:** Ga NIET door naar Demo totdat je het volgende hebt:
- [ ] Bevestigde pijn (door de koper geuit, niet verondersteld)
- [ ] Geïdentificeerd wie de economische koper is (ook als je hem/haar nog niet hebt ontmoet)
- [ ] Bevestigd dat er op zijn minst potentieel budget is of de intentie om dat te vinden
- [ ] Een volgende stap afgesproken waaraan de koper zich committeert

---

## Fase 2 — Demo / Evaluatie

### Voorbereiding van de demo

```
Build a demo plan for [company name].

What we learned in discovery:
- Primary pain: [what they said]
- Desired outcome: [what they want to achieve]
- Technical environment: [what systems they use]
- Stakeholders attending the demo: [names and titles]

Demo structure:
1. Open with their pain (2 min) — reference their exact words from discovery
2. Show the before state (1 min) — what the problem looks like today
3. Demo the solution (15-20 min) — focused on their specific use case, not a feature tour
4. Show the outcome (2 min) — what success looks like for them, in their numbers
5. Next steps (5 min) — propose evaluation plan

For [specific use case they described]:
- Which features to show (and which to skip — most features are irrelevant for this call)
- The one "aha moment" to build toward
- Technical questions they will likely ask
- How to handle "can you also show X" questions that aren't in scope
```

### Evaluatieplan (overeengekomen aan het einde van de demo)

```
/mutual-success-plan

Create a lightweight evaluation plan for [company] — early stage version.

Current stage: Demo → Evaluation
Champion: [name, title]
Economic buyer: [known / not yet met]
Deal size estimate: $[X]
Target close date: [if discussed]

Evaluation plan contents:
- What they need to validate (technical / security / business case)
- Trial or POC parameters (if applicable)
- Who from their side will be involved
- Timeline from evaluation to decision
- The single most important question this evaluation must answer

Output: a 1-page evaluation plan I can send after the demo — not a full MSP yet.
```

### Ondersteuning bij technische evaluatie

```
/rfp-responder

Answer this technical evaluation question from [company].

Question: [paste their question]
Context: [what you know about their technical environment]
Answer: [paste or describe what you know — don't invent; ask your SE if uncertain]

Format: direct answer first, then supporting evidence. Under 200 words.
```

---

## Fase 3 — Voorstel

### Voorbereiding van het voorstel

Zorg vóór het verzenden van een voorstel dat:
- [ ] De economische koper is geïntroduceerd en weet dat de deal plaatsvindt
- [ ] Commerciële voorwaarden mondeling zijn voorgoedgekeurd (geen verrassingen in het voorstel)
- [ ] Je hun inkoopproces kent (moet juridisch voor of na commerciële voorwaarden beoordelen?)
- [ ] Je een kampioen hebt die het voorstel actief ontvangt en verdedigt

```
/deal-desk

Structure the commercial proposal for [company].

Customer: [name, size]
Deal type: [new logo / expansion]
Products requested: [list]
Requested ACV: $[X] (target) / list price is $[Y]
Term: [12 / 24 / 36 months]
Special requirements: [any non-standard elements]

Validate:
1. Is this within my discount authority, or do I need manager approval?
2. What's the recommended term structure (payment terms, multi-year pricing)?
3. Are there any commercial red flags I should address before sending?
4. What's the recommended proposal format for this deal size?
```

### Opvolging van het voorstel (48 uur na verzending)

```
Write a follow-up email for [company] — sent the proposal 48 hours ago, no response yet.

Proposal contents: [1-line summary of what was proposed]
Champion: [name]
Context: [any signals from the demo or recent communications]

Goal: light-touch check-in that creates a reason to reconnect (not "just checking in").
Provide a piece of value or a relevant insight alongside the nudge.
Length: under 100 words.
```

---

## Fase 4 — Onderhandeling

### Dealreview vóór onderhandelingsgesprekken

```
/deal-review

Full MEDDPICC review before entering negotiation with [company].

Deal: [name, $ACV, current stage]
Negotiation dynamics:
- What they're pushing on: [price / terms / timeline / features]
- What we've already conceded: [any discounts or commitments made]
- Their stated deadline: [date if given]
- Competitive pressure: [who else is in the deal]

MEDDPICC status:
[paste what you know about each dimension]

Tell me:
1. Where are we strong enough to hold our position?
2. Where are we weak and at risk?
3. What's the one concession I should be willing to make to close?
4. What's my BATNA (best alternative to a negotiated agreement)?
5. What are the red lines — what I should NOT concede?
```

### Beoordeling van contractvoorwaarden

```
/deal-desk

Review these negotiated contract terms for commercial risks.

[Paste any redlines, counter-proposals, or term sheets from the buyer's legal team]

Flag: RED (reject or escalate) / YELLOW (flag but potentially acceptable) / GREEN (standard).
For each RED and YELLOW: explain the risk and recommend a counter-position.

HUMAN LEGAL REVIEW REQUIRED before finalising contract.
```

### Activering van het Mutual Success Plan

```
/mutual-success-plan

Create a full mutual success plan for [company] — now in Negotiation.

[Paste all deal context: champion, economic buyer, deal size, close date, what's left]

This MSP must cover:
- All remaining milestones to signature (legal, security, procurement, executive alignment)
- Specific dates for each milestone, working backward from close date
- Mutual commitments (what each side commits to)
- Risk register (what could delay each milestone)

I'll share this with the champion today and review it with the economic buyer next week.
```

---

## Fase 5 — Mondeling / Sluiting

### Briefing van de kampioen vóór de sluiting

```
/champion-builder

Prepare [champion name] for the final close conversation.

Deal context: [ACV, terms, close date]
Economic buyer: [name, title]
Open issues: [any unresolved commercial or legal questions]

Give me:
1. What the champion should say to the economic buyer to get final approval
2. The most likely last-minute objection and how to handle it
3. The specific ask: "Can you get me a signed contract by [date]?"
4. What I do if the answer is "we need more time" — how to respond without losing urgency
```

### Opvolging van de mondelinge bevestiging

Binnen 1 uur na een mondelinge toezegging:

```
Write a verbal confirmation summary email.

Context: [company] just gave us a verbal commitment to proceed.
Agreed terms: [ACV, term, payment terms, start date]
Open items: [anything still pending — e.g. legal, security sign-off]
Next step: [what needs to happen next — e.g. "legal review of the MSA, target signature by [date]"]

Email should:
- Confirm what was agreed (their commitment in writing)
- Document any open items with owners and dates
- Propose the next concrete step with a specific date
- Set the tone: excited but not done until signed

Send to: [economic buyer + champion]
```

### Vastgelopen bij mondeling — nieuw leven inblazen

```
/champion-builder

This deal has been at verbal for [N] days. Help me get to signature.

Company: [name]
Verbal given: [date]
Open items: [what's blocking signature]
Champion status: [engaged / quiet]
Economic buyer: [last contact date and what was said]

Diagnosis: which of these is the real blocker?
1. Legal is slow (process stall — not a deal risk)
2. Budget has been frozen (financial event)
3. Someone above the champion is second-guessing the decision
4. Competitive re-engagement (another vendor stepped in)
5. My own process (something I haven't done)

For the most likely blocker: give me the specific action to take today.
```

---

## Fase 6 — Gesloten Gewonnen

### CRM en CS-overdracht (binnen 24 uur na ondertekening)

```
/hubspot

Log the closed won deal in HubSpot.

Company: [name]
ACV: $[X]
Term: [months]
Products: [list]
Champion: [name, email]
Economic buyer: [name, email]
Close date: [date]
Start date: [date]
Notes: [anything CS needs to know for a smooth handoff]

Create a CS handoff task assigned to [CSM name] due [date].
```

**CS-overdrachts-e-mail:**
```
Write a CS handoff email for [company].

What to include:
- Why they bought (the primary pain and expected outcome)
- Who the key stakeholders are (champion, economic buyer, day-to-day contacts)
- Any commitments made during the sale (specific features, integrations, timeline promises)
- Known risks or concerns to monitor
- The success criterion we defined in the MSP

This email is from me (the AE) to the assigned CSM. It should give them everything they need
to run the kickoff call without asking me for context.
```

### Post-mortem (winanalyse)

Na elke Gesloten Gewonnen deal boven $50K, voer een 20-minuten winanalyse uit:

```
Run a deal win analysis for [company].

Deal: $[ACV], [N] days to close
Key events: [list the 3-5 moments that most influenced the outcome — good or bad]
What worked: [what you'd replicate]
What almost killed it: [the biggest risk that materialised — and how you recovered]
Champion quality: [how strong was the champion, in retrospect]
Competitive dynamic: [how competition influenced the deal]

Output: 5 bullet points I can share at team review to help other AEs.
```

---

## Wekelijkse dealmanagement-checklist

Voer dit elke maandagochtend uit vóór je pipeline-review:

```
/commercial-forecaster

Weekly pipeline health check.

My open pipeline: [paste deal list — company, ACV, stage, close date, last activity]

Flag:
- Commit deals with no activity in 7+ days
- Deals where close date is this month but MSP hasn't been created
- Deals stuck in the same stage for > [25 days Discovery / 45 days Evaluation / 30 days Proposal]
- Best Case deals that could move to Commit this week with the right action
- Deals to mark as Closed Lost (be honest)

For each flagged deal: the one action to take today.
```

---
