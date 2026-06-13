# Deal-Screening-Workflow

Ein wiederholbarer, schrittweiser Prozess zur Bewertung eingehender Deal-Flow — vom ersten Eindruck bis zur IC-reifen Entscheidung — unter Einsatz von Claude Code-Skills in jeder Phase.

---

## Überblick

Dieser Workflow deckt einen vollständigen Deal-Bewertungszyklus ab: etwa 2–3 Wochen vom ersten Kontakt bis zur IC-Entscheidung bei einem Seed/Series-A-Deal. Die Schritte sind so gestaltet, dass Claude Code-Skills in jeder Phase eingesetzt werden. Zeitschätzungen gehen von Claude-Unterstützung aus.

**Gesamtzeit (mit Claude):** 8–12 Stunden über 3 Wochen für einen Deal, der bis zum IC gelangt
**Gesamtzeit (ohne Claude):** 25–40 Stunden

---

## Stufe 1: Erster Screening-Durchgang (Tag 1 — 30–60 Minuten)

### Auslöser
Eingehender Deal von: Kaltakquise des Gründers, LP-Empfehlung, Co-Investor, Konferenz, Accelerator-Batch, Scout.

### Schritt 1.1 — Deal-Informationen erfassen

Bevor du Claude verwendest, sammle:
- Unternehmensname und URL
- Namen der Gründer und LinkedIn-Profile
- Deck oder One-Pager (falls vorhanden)
- Kurze Beschreibung dessen, was sie tun
- Phase und Rundenvolumen, das sie einsammeln
- Umsatz oder ARR (falls offengelegt)

### Schritt 1.2 — Schneller Screening-Durchgang

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

### Schritt 1.3 — Deal-Log-Eintrag

Wenn das Urteil REQUEST DECK oder REQUEST MEETING lautet, trage in deine Pipeline ein:
- Unternehmensname, Sektor, Phase
- Quelle der Vorstellung
- Erste Einschätzungsnotizen (2–3 Sätze)
- Nächste Aktion und Verantwortlicher
- Datum des ersten Kontakts

**Ergebnis von Stufe 1:** Pass (mit Grund protokolliert) oder Übergang zu Stufe 2.

---

## Stufe 2: Deck-Review und erstes Meeting (Tage 3–7)

### Schritt 2.1 — Deck-Analyse

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

### Schritt 2.2 — Vorbereitung auf das erste Meeting

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

### Schritt 2.3 — Notizen zum ersten Meeting

Notiere während des Gesprächs:
- Direkte Antworten auf deine Fragen
- Momente des Zögerns oder vager Antworten (für Diligence markieren)
- Dein Bauchgefühl zu den Gründern: Klarheit, Überzeugung, Coachability
- Alles, was sie sagten und dich überrascht hat (positiv oder negativ)
- Was sie nicht gesagt haben (Lücken)

### Schritt 2.4 — Deal-Memo nach dem Meeting

```
/deal-memo

Write a first-pass deal memo based on my notes from the founder meeting.

My meeting notes: [paste notes]
My initial reaction: [your gut — what excited you, what concerned you]

Build the deal memo structure. Mark everything I couldn't verify as [NEED TO CHECK].
Flag the 5 most important questions I still need to answer before I can recommend investing.
```

**Ergebnis von Stufe 2:** Pass (mit protokolliertem Grund) oder Übergang zu Stufe 3. Teile mit einem Partner für ein Go/No-Go zur vollständigen Diligence.

---

## Stufe 3: Diligence (Tage 7–21)

### Schritt 3.1 — Diligence-Plan

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

### Schritt 3.2 — Kunden-Referenzgespräche (2–4 Gespräche)

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

Nach jedem Gespräch protokolliere:
- Nutzung: wie intensiv sie es nutzen, wie viele Nutzer, welche Features
- Wechselkosten: würden sie kündigen bei einem 20 %igen Preisanstieg?
- Vergleich zu bewerteten Alternativen
- Beschwerden oder Bedenken
- Gesamt-NPS-Signal: würden sie es einem Kollegen empfehlen?

### Schritt 3.3 — Finanzielle Diligence

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

### Schritt 3.4 — Comps und Bewertung

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

### Schritt 3.5 — Technische Diligence (falls zutreffend)

Für Developer Tools, Infrastruktur, KI oder jedes Produkt, bei dem die technische Architektur relevant ist:

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

### Schritt 3.6 — Diligence-Synthese

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

**Ergebnis von Stufe 3:** Entscheidung zu investieren oder zu passen. Bei Investition weiter zu Stufe 4.

---

## Stufe 4: IC-Vorbereitung (Tage 18–22)

### Schritt 4.1 — IC-Memo

```
/ic-memo

Convert the deal memo and diligence findings into a full IC memo for [company].

Deal memo: [paste or summarize]
Diligence findings summary: [paste]
Proposed terms: $[X]M at $[X]M pre-money, [X]% ownership

Generate all 9 sections. Mark [VERIFY] on anything not confirmed in diligence.
Highlight open items that IC needs to decide whether they are acceptable risks.
```

### Schritt 4.2 — IC-Meeting-Vorbereitung

Bereite dich darauf vor, die Empfehlung zu verteidigen:

```
/deal-memo

I'm presenting [company] to IC. Help me prepare for hard questions.

My recommendation: [invest / pass]
IC members and their known concerns: [list partners and their typical areas of focus]

Generate the 10 hardest questions I'll face and draft my answers based on what I know.
Flag the 2-3 questions where I don't have a strong answer and need to prepare.
```

### Schritt 4.3 — IC-Entscheidungsprotokoll

Nach dem IC:
- Entscheidung protokollieren: investieren / passen / weitere Diligence
- Bei Investition: vorgeschlagene Konditionen, Zeitplan, wer das Term Sheet entwirft
- Bei Pass: Hauptgrund protokollieren (nützlich für Gründer-Feedback und Fund-Learning)
- Bei weiterer Diligence: spezifische offene Punkte protokollieren und Verantwortliche benennen

**Ergebnis von Stufe 4:** Investitionsentscheidung mit dokumentierter Begründung.

---

## Stufe 5: Post-Investment-Setup (Woche 4+)

### Schritt 5.1 — Portfolio-Monitoring-Setup

Sobald die Investition abgeschlossen ist:

```
/portfolio-monitor

Set up a monitoring framework for [company].

Investment thesis: [what we believed]
Key milestones we expect in Year 1: [list 3-5]
Key KPIs to track monthly: [ARR, burn, NRR, headcount, gross margin]
Board schedule: [monthly / quarterly]

Generate a company profile card for our portfolio tracking system.
```

### Schritt 5.2 — Erstes Board-Meeting

Innerhalb von 60 Tagen nach Abschluss ein Board-Kickoff durchführen:

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

## Zu verfolgende Metriken (über deine Deal-Pipeline)

| Metrik | Wöchentlich verfolgen |
|---|---|
| Gescreente Deals | Gesamt, Quellen-Aufschlüsselung |
| Pass-Rate je Stufe | Stufe 1 / 2 / 3 / 4 |
| Quellen-Qualität | Welche Empfehlungsquellen führen zu IC-Stage-Deals |
| IC-Conversion | Präsentierte vs. genehmigte Deals |
| Deal-Velocity | Tage vom ersten Kontakt bis zum IC |
| Referenzgespräch-Erkenntnisse | % der Deals, bei denen Kundengespräche deine Einschätzung geändert haben |

---
