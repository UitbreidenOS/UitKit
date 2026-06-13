# AE-Deal-Zyklus-Workflow

Ein schrittweiser Workflow zur Verwaltung eines B2B-Vertriebsdeals vom ersten Meeting bis zum unterzeichneten Vertrag — mit Claude Code-Prompts in jeder Phase.

---

## Wann dieser Workflow ausgeführt wird

- Du hast ein erstes Meeting mit einem qualifizierten Account gebucht
- Du übernimmst einen laufenden Deal und musst dich schnell einarbeiten
- Du möchtest dein Deal-Management-Prozess über ein Territorium standardisieren
- Du bereitest dich auf einen Quartalsendspurt bei Opportunities in der Spätstadium vor

---

## Deal-Phasen und Abschlusskriterien

Jede Phase hat eine klare Definition und Abschlusskriterien. Einen Deal erst voranbringen, wenn die Kriterien erfüllt sind.

| Phase | Definition | Abschlusskriterien (Wechsel zur nächsten Phase) |
|---|---|---|
| Discovery | Verständnis der Situation, des Schmerzpunkts und der Eignung des Käufers | Bestätigter Schmerz, identifizierte Stakeholder, qualifiziertes Budget vorhanden |
| Demo/Evaluierung | Demonstration der Lösung gegenüber den genannten Anforderungen | Käufer hat das Produkt gesehen, technische Eignung bestätigt, Evaluierungsplan vereinbart |
| Angebot | Kommerzielles Angebot liegt beim Käufer vor | Angebot vom wirtschaftlichen Käufer geprüft, Fragen beantwortet |
| Verhandlung | Konditionen werden besprochen | Kommerzielle und rechtliche Bedingungen abgestimmt, Beschaffungsprozess läuft |
| Mündliche Zusage | Mündliche oder schriftliche Zusage zur Weiterführung | Wirtschaftlicher Käufer bestätigt Absicht, Papierprozess in Gang |
| Abgeschlossen Gewonnen | Unterzeichneter Vertrag | DocuSign abgeschlossen, CS-Übergabe eingeleitet |

---

## Phase 1 — Discovery

### Vorbereitung vor dem Anruf (15 Minuten vor jedem Discovery-Anruf)

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

### Durchführung des Discovery-Anrufs

Einen strukturierten Discovery-Anruf mit diesem Framework durchführen:

**SPIN-Selling-Sequenz:**
1. **Situationsfragen** (aktuellen Zustand verstehen): „Schildern Sie mir, wie Ihr Team [Prozess] derzeit handhabt."
2. **Problemfragen** (Schmerz aufzeigen): „Wo bricht dieser Prozess zusammen? Was kostet es Sie, wenn das passiert?"
3. **Implikationsfragen** (Schmerz vertiefen): „Was passiert nachgelagert, wenn [Problem] auftritt? Wen betrifft es noch?"
4. **Nutzenfragen** (sie den Wert formulieren lassen): „Wenn Sie [das Problem beheben] könnten, was würde das für [ihr Ziel] bedeuten?"

### MEDDPICC-Update nach dem Anruf (unmittelbar danach)

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

**Phasentor:** NICHT zur Demo übergehen, bis Folgendes vorliegt:
- [ ] Bestätigter Schmerz (vom Käufer geäußert, nicht angenommen)
- [ ] Identifiziert, wer der wirtschaftliche Käufer ist (auch wenn noch nicht getroffen)
- [ ] Zumindest potenzielles Budget oder Absicht, es zu finden, bestätigt
- [ ] Vereinbarter nächster Schritt, den der Käufer eingeht

---

## Phase 2 — Demo / Evaluierung

### Demo-Vorbereitung

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

### Evaluierungsplan (am Ende der Demo vereinbaren)

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

### Technische Evaluierungsunterstützung

```
/rfp-responder

Answer this technical evaluation question from [company].

Question: [paste their question]
Context: [what you know about their technical environment]
Answer: [paste or describe what you know — don't invent; ask your SE if uncertain]

Format: direct answer first, then supporting evidence. Under 200 words.
```

---

## Phase 3 — Angebot

### Angebotsvorbereitung

Vor dem Versenden eines Angebots sicherstellen:
- [ ] Wirtschaftlicher Käufer wurde vorgestellt und weiß, dass der Deal stattfindet
- [ ] Kommerzielle Konditionen wurden mündlich vorab genehmigt (keine Überraschungen im Angebot)
- [ ] Beschaffungsprozess bekannt (muss die Rechtsabteilung vor oder nach den kommerziellen Bedingungen prüfen?)
- [ ] Ein Champion vorhanden, der das Angebot aktiv empfängt und befürwortet

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

### Angebots-Follow-up (48 Stunden nach dem Versand)

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

## Phase 4 — Verhandlung

### Deal-Review vor Verhandlungsgesprächen

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

### Prüfung der Vertragsbedingungen

```
/deal-desk

Review these negotiated contract terms for commercial risks.

[Paste any redlines, counter-proposals, or term sheets from the buyer's legal team]

Flag: RED (reject or escalate) / YELLOW (flag but potentially acceptable) / GREEN (standard).
For each RED and YELLOW: explain the risk and recommend a counter-position.

HUMAN LEGAL REVIEW REQUIRED before finalising contract.
```

### Aktivierung des gegenseitigen Erfolgsplans

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

## Phase 5 — Mündliche Zusage / Abschluss

### Pre-Close-Champion-Briefing

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

### Follow-up nach mündlicher Bestätigung

Innerhalb von 1 Stunde nach einer mündlichen Zusage:

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

### Bei mündlicher Zusage feststeckend — neu beleben

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

## Phase 6 — Abgeschlossen Gewonnen

### CRM- und CS-Übergabe (innerhalb von 24 Stunden nach der Unterzeichnung)

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

**CS-Übergabe-E-Mail:**
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

### Post-Mortem (Gewinnanalyse)

Nach jedem abgeschlossenen Deal über 50.000 $ eine 20-minütige Gewinnanalyse durchführen:

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

## Wöchentliche Deal-Management-Checkliste

Diese jeden Montagmorgen vor der Pipeline-Review ausführen:

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
