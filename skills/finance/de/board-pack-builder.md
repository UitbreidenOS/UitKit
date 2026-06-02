---
name: board-pack-builder
description: "Board-Pack erstellen: Finanzdaten, KPI-Dashboard, strategische Initiativen, Risiken, Anfragen — aus Rohdaten"
---

# Board-Pack-Builder Skill

## Wann aktivieren
- Vorbereitung eines monatlichen oder vierteljährlichen Board-Packs aus Finanzdaten und Management-Berichten
- Rohe Tabellendaten in eine vorstandsgerechte Narrative mit Kontext umwandeln
- Strukturierung einer Board-Präsentation für Unternehmen der Series A, B oder C
- Vorbereitung von Investoren-Updates im Board-Pack-Format
- Einen CFO oder CEO auf die Inhalte eines bevorstehenden Vorstandsmeetings hinweisen

## Wann NICHT verwenden
- Gewinnmitteilungen börsennotierter Unternehmen — anderes Format und SEC-Offenlegungsanforderungen
- Einseitige Investoren-Update-E-Mails — verwende eine schlankere Vorlage
- Board-Materialien, die vor der Verteilung eine rechtliche Überprüfung erfordern — Claude entwirft, Anwälte genehmigen
- Geprüfte Jahresabschlüsse — Claude arbeitet mit Management-Konten, nicht mit geprüften Zahlen

## WICHTIG

Alle Finanzzahlen in Board-Packs müssen mit `[VERIFY]` markiert werden, bis sie gegen die Quelldaten bestätigt wurden. Board-Packs sind Entscheidungsdokumente — präsentiere Daten korrekt und kennzeichne, wo Schätzungen verwendet wurden. Zahlen niemals glätten oder negative Abweichungen ohne Offenlegung weglassen.

## Anweisungen

### Board-Pack-Struktur

```
Standard board pack — 7 sections:

1. Executive Summary (1 page)
   - Month/quarter snapshot: revenue, burn, runway, headline KPIs
   - What went well, what didn't, what we're doing about it
   - The 1-2 decisions the board needs to make today

2. Financial Dashboard (2-3 pages)
   - P&L: actuals vs. budget vs. prior period
   - Cash flow statement
   - Balance sheet highlights
   - Key financial ratios

3. KPI Dashboard (1-2 pages)
   - Operational metrics by function (growth, product, customer)
   - Trend charts (last 6-12 months)
   - Leading vs. lagging indicators

4. Business Update (2-3 pages)
   - GTM: pipeline, bookings, churn, NRR
   - Product: roadmap progress, key releases
   - Ops: headcount, key hires/departures

5. Strategic Initiatives (1-2 pages)
   - Progress on board-approved initiatives
   - Status: on track / at risk / delayed + reason

6. Risk Register (1 page)
   - Top 3-5 risks, likelihood, impact, owner, mitigation

7. Asks (1 page)
   - Decisions required from the board
   - Introductions or resources requested
   - Items for approval (budget reforecasts, option grants, etc.)
```

### Kern-Generierungsprompt

```
Build a board pack for [COMPANY NAME] for [MONTH/QUARTER YEAR].

Company context:
- Stage: [Seed / Series A / B / C / growth]
- Industry: [sector]
- Business model: [SaaS / marketplace / services / hardware]
- Board composition: [investors + independents, brief list]
- Last board meeting: [date — what was discussed/committed to]

Financial data (paste raw or describe):
- Revenue: [actuals] vs. budget [X] vs. prior month/quarter [Y]
- Gross profit / gross margin: [%]
- Operating expenses: [by category if available]
- Net burn: [$X/month]
- Cash on hand: [$X as of [date]]
- Runway: [X months at current burn]

Key KPIs (provide actual numbers):
[List your key operational metrics with actuals]

Narrative context:
- 3 things that went well: [list]
- 2-3 things that underperformed: [list + brief reason]
- Biggest risk heading into next period: [describe]
- Decisions/asks for the board: [list]

Generate: all 7 sections with executive-level writing. Flag all figures with [VERIFY].
```

### Finanzdashboard-Prompt

```
Build the financial dashboard section of the board pack.

Raw data:
[Paste P&L table, or describe line items]

Instructions:
1. Format as a condensed management P&L:
   - Revenue (with MoM or QoQ growth %)
   - Cost of Revenue / Gross Profit / Gross Margin %
   - Operating expenses by major category (S&M, R&D, G&A)
   - EBITDA / Operating loss
   - Net burn
   
2. Add variance columns:
   - Actuals vs. Budget ($ and %)
   - Actuals vs. Prior Period ($ and %)
   - Note any variance > 10% with a brief explanation

3. Cash position section:
   - Opening cash balance
   - Cash in / cash out (operating, investing, financing)
   - Closing cash balance
   - Months of runway at current burn
   
4. Key ratios (calculate and flag for verification):
   - Gross margin %
   - LTV:CAC (if SaaS)
   - Burn multiple: Net burn / Net new ARR
   - Rule of 40: Revenue growth % + FCF margin %

All figures: [VERIFY] marker. Variance explanations should be factual, not defensive.
```

### KPI-Dashboard-Prompt

```
Build the KPI dashboard section.

Company type: [SaaS / marketplace / e-commerce / services]

GROWTH METRICS (provide actuals):
- MRR / ARR: [current] vs. [prior month] vs. [prior year]
- New MRR: [from new customers this period]
- Expansion MRR: [from upgrades/upsells]
- Churned MRR: [lost this period]
- Net Revenue Retention (NRR): [%]
- New customer count: [this period] vs. [prior]

PIPELINE (if sales-led):
- Pipeline value: [$X]
- Pipeline coverage ratio: [X:1 vs. revenue target]
- Win rate: [%]
- Average deal size: [$X]
- Sales cycle length: [X days]

PRODUCT / ENGAGEMENT:
- DAU/MAU: [X]
- Key activation metric: [what is it? what is the %?]
- Feature adoption: [key feature + usage %]
- NPS: [score + trend]

CUSTOMER SUCCESS:
- GRR (Gross Revenue Retention): [%]
- Churn rate: [% by count / by revenue]
- Time to value: [days from signup to first key outcome]
- Support tickets: [volume + resolution time]

Format as a 2-column dashboard: metric on left, sparkline description + current value + trend on right.
Mark any metric that is off-track vs. goal with [AT RISK].
```

### Tracker für strategische Initiativen

```
Build the strategic initiatives section.

List each board-approved initiative:

Initiative 1: [Name]
- Goal: [what success looks like]
- Owner: [name, title]
- Timeline: [start → target completion]
- Status: [On Track / At Risk / Delayed / Complete]
- Progress update: [2-3 sentences — what happened this period]
- Next milestone: [specific next deliverable + date]
- If at risk / delayed: [root cause + recovery plan]

Initiative 2: [Name]
...

Board expectation check:
- Were there any commitments made at the last board meeting?
- Are we delivering on those commitments, or do we need to flag a change?
```

### Risikoregister-Prompt

```
Build the risk register section.

For each risk, provide:
- Risk: [name]
- Category: [financial / operational / market / regulatory / people]
- Description: [1-2 sentences on what could happen]
- Likelihood: [High / Medium / Low]
- Impact: [High / Medium / Low]
- Owner: [who manages this risk]
- Mitigation: [what is being done]
- Status change vs. last board meeting: [New / Increasing / Stable / Decreasing]

Common risks to address for [stage] companies:
- Burn rate vs. fundraising timeline
- Key person dependency (CTO, top sales rep, etc.)
- Churn acceleration / NRR compression
- Competitor moves
- Regulatory or compliance exposure
- Hiring delays blocking roadmap
```

### Executive-Summary-Prompt

```
Write the executive summary for this board pack.

This is the first thing board members read. It must:
1. Convey the headline story in 150-200 words
2. Give 3 bullet points: what went well / what didn't / what we're doing about it
3. State clearly: what decisions the board needs to make today

Structure:
HEADLINE: One sentence on the period — were we on track, ahead, or behind?
FINANCIAL SNAPSHOT: [Revenue] | [Burn] | [Runway] | [ARR/MRR]

HIGHLIGHTS:
- [Win 1 — be specific, not vague]
- [Win 2]
- [Win 3]

CHALLENGES:
- [Challenge 1 + brief root cause]
- [Challenge 2]

WHAT WE'RE DOING:
- [Action 1 — owner + timeline]
- [Action 2]

BOARD ASKS TODAY:
1. [Decision or input needed]
2. [Introductions requested]
3. [Approvals required]

Tone: Factual, clear, no spin. Board members are sophisticated — they appreciate candour over polish.
If there is bad news, lead with it — don't bury it.
```

### Board-Pack-Review-Prompt

```
Review this board pack draft and give feedback.

Check for:
1. Completeness — are all 7 sections present and substantive?
2. Accuracy — are all variance explanations consistent with the data?
3. Narrative clarity — can a board member form a clear view in 10 minutes?
4. Decision readiness — are the asks specific and actionable?
5. Risk disclosure — are negative trends disclosed without being buried?
6. Number consistency — do figures match across sections (revenue in exec summary must match P&L)?
7. Missing context — what questions will a board member ask that aren't answered?

Output: Section-by-section feedback + a list of 3-5 changes to make before distribution.
```

## Beispiel

**Benutzer:** Hilf mir, ein Board-Pack zu erstellen. Wir sind ein Series-B-SaaS, 3,2 Mio. USD ARR, 280.000 USD/Monat Burn, 14 Monate Runway. MoM-ARR-Wachstum lag bei 3,2 % vs. 4,5 % Budget. NRR beträgt 108 %, Churn stieg auf 1,8 % vom Vormonatswert 1,4 %.

**Erwartete Ausgabe:**
```markdown
# Board Pack — [Company] — June 2026
[VERIFY all figures below against source data]

## Executive Summary
June was a mixed month. Revenue grew to $3.2M ARR (+3.2% MoM) but came in below our 4.5% budget target — a gap we attribute to two enterprise deals slipping to Q3. Churn ticked to 1.8%, our highest in 6 months, driven by three mid-market churns in our legacy segment. NRR remains healthy at 108%. With $3.9M cash and 14 months runway, we are not at risk, but the churn trend requires a board discussion.

FINANCIAL SNAPSHOT: $3.2M ARR | $280K net burn | 14 months runway | NRR 108%

HIGHLIGHTS:
- Closed $420K new ARR from 3 enterprise logos (largest deal in company history)
- Product shipped the AI workflow feature — 34% of active customers activated within 30 days
- Hired VP Customer Success — starts July 14

CHALLENGES:
- Two enterprise deals ($180K combined ARR) slipped to Q3 — impacted new MRR by ~40%
- Churn rate of 1.8% vs. 1.4% prior — 3 legacy plan churns, all were pre-2024 customers on deprecated tiers
- SDR team at 60% quota — new hire onboarding delayed

WHAT WE'RE DOING:
- CS playbook for legacy-tier customers launched June 15 (owner: incoming VP CS)
- SDR onboarding accelerated — full productivity expected by August
- Enterprise pipeline re-reviewed — both slipped deals confirmed for Q3 close

BOARD ASKS TODAY:
1. Input on reforecast: maintain ARR target or revise to $4.1M given pipeline coverage?
2. Approval: option grant for VP CS (0.35% fully diluted, 4-year vest, 1-year cliff)
3. Introductions: enterprise CISOs in financial services (for our Q3 target accounts)
```

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
