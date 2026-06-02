---
name: deal-memo
description: "Investment-Deal-Memo: Marktthese, Unternehmensanalyse, Finanzprojektionen, Risikofaktoren und Empfehlung — für VC, Growth-Equity und Frühphasen-Investments"
---

# Deal-Memo Skill

## Wann aktivieren
- Schreiben eines Deal-Memos nach einem ersten oder zweiten Gespräch mit einem Gründer
- Synthese von Due-Diligence-Ergebnissen zu einer strukturierten Investitionsempfehlung
- Präsentation eines neuen Deals vor den Partnern oder dem IC zum ersten Mal
- Aufbau der Investitionsthese vor dem IC-Memo — das Deal-Memo ist das frühere, explorativer ausgerichtete Dokument
- Vorbereitung eines VC-typischen Deal-Memos für Seed-, Series-A- oder Growth-Runden

## Wann NICHT verwenden
- Formelle IC-Memos, die die Genehmigung eines Finanzmodells erfordern — verwende `/ic-memo` dafür
- PE-Buyout-Analysen — Deal-Memo-Format unterscheidet sich (verwende PE-spezifische Vorlagen)
- Investitionsthesen für öffentliche Märkte — anderes Format und regulatorische Anforderungen
- Vorläufige Deal-Screenings — verwende `/deal-screening`, bevor du Zeit in ein Memo investierst

## Wichtig

Deal-Memos enthalten Investitionsempfehlungen auf Basis begrenzter Due Diligence. Alle unverifizierten Angaben sind mit `[UNVERIFIED]` zu markieren. Finanzprojektionen werden vom Gründer bereitgestellt, sofern nicht anders angegeben — gib die Quelle immer an.

## Anweisungen

### Vollständiger Deal-Memo-Prompt

```
Write a deal memo for an investment opportunity.

COMPANY:
- Name: [company name]
- Founded: [year]
- Stage: [pre-seed / seed / Series A / Series B / growth]
- Industry: [sector]
- HQ: [location]
- Team size: [X] employees

BUSINESS:
- What they do (1 sentence): [describe]
- Business model: [SaaS / marketplace / transactional / hardware / other]
- Revenue model: [subscription / usage / one-time / hybrid]
- Current traction: [ARR/GMV/revenue, growth rate, key customers]
- Product maturity: [MVP / early product / mature]

MARKET:
- TAM: $[X]B [source or [UNVERIFIED]]
- Market growth rate: [X]% [source]
- Why now: [what has changed that makes this moment the right time]
- Key tailwinds: [technology, regulatory, consumer behavior shifts]

INVESTMENT TERMS:
- Round size: $[X]M
- Our check: $[X]M
- Pre-money valuation: $[X]M
- Post-money ownership: [X]%
- Lead: [who is leading the round]
- Other investors: [co-investors, if known]

FINANCIALS (founder-provided):
- LTM revenue: $[X]M
- ARR (if SaaS): $[X]M
- YoY growth: [X]%
- Gross margin: [X]%
- Burn rate: $[X]M/month
- Runway: [X] months
- Path to profitability: [description or [UNVERIFIED]]

TEAM:
- CEO: [name, background in 1 sentence]
- CTO: [name, background]
- Other key executives: [list]
- Team strengths: [domain expertise, prior exits, technical depth]
- Team gaps: [what's missing — finance, enterprise sales, etc.]

COMPETITIVE LANDSCAPE:
- Main competitors: [list 3-5]
- Differentiation: [why this company wins]
- Defensibility: [switching costs / network effects / IP / data moat]

MY THESIS:
- Why invest: [your 2-3 sentence investment thesis]
- Why now: [timing rationale]
- Why us: [what we bring beyond capital]

Generate a structured deal memo with:
1. Company overview and what they do
2. Market opportunity and why now
3. Business model and unit economics
4. Team assessment
5. Competitive analysis and moat
6. Financial overview and key metrics
7. Investment terms and valuation
8. Risk factors (top 5)
9. Diligence checklist (what to verify before IC)
10. Preliminary recommendation
```

---

### Marktthesen-Abschnitt

```
Write the Market Opportunity section of a deal memo.

Company: [name]
Category: [what space they're in]

Market sizing:
- TAM: $[X]B — [how calculated: top-down / bottom-up / [UNVERIFIED]]
- SAM (addressable given product scope): $[X]B
- SOM (realistic near-term capture): $[X]M

Why now (select applicable):
[ ] Technology shift: [AI / cloud / mobile / API ecosystem]
[ ] Regulatory change: [describe]
[ ] Consumer behavior shift: [describe]
[ ] Incumbent failure to adapt: [describe]
[ ] New distribution channel unlocked: [describe]

Key tailwinds: [list 3]
Key risks to market thesis: [list 2]

Write a 200-word market opportunity section that argues why this market is large, growing, and winnable — and why this is the right time to invest.
```

---

### Team-Bewertungsabschnitt

```
Write the Team section of a deal memo.

Founders:
[For each founder: Name, role, prior companies, relevant expertise, notable achievements]

Assess against these dimensions:
1. Domain expertise: do they know this space deeply?
2. Technical ability: can they build the product?
3. Commercial ability: can they sell and tell the story?
4. Prior founder experience: first time or repeat?
5. Coachability signals (from references or conversation): [any notes]
6. Team completeness: what key roles are missing?

Write a balanced team assessment — strengths and gaps. Do not over-inflate. VCs who present every team as "world-class" lose credibility.
```

---

### Abschnitt Unit Economics und Finanzen

```
Write the Financial Overview and Unit Economics section.

Metrics provided by company ([UNVERIFIED] unless audited):
- ARR: $[X]M, growing [X]% YoY
- MRR: $[X]M
- Gross margin: [X]%
- CAC: $[X] ([payback period: X months])
- LTV: $[X] (LTV/CAC ratio: [X]x)
- Churn: [X]% monthly / [X]% annual gross churn
- Net revenue retention: [X]%
- Burn rate: $[X]M/month
- Current ARR per employee: $[X]K

Benchmarks for comparison (SaaS, seed to Series A):
- Good gross margin: >70%
- Good LTV/CAC: >3x
- Healthy net revenue retention: >100%
- Efficient burn: <18 months runway at current rate

Write the financial overview section. Flag any metrics that are below benchmark. Note which figures are unverified and what we need to confirm in diligence.
```

---

### Risikofaktoren-Abschnitt

```
Write the Risk Factors section for this deal.

Company: [name], [stage], [industry]

Evaluate these risk categories:
1. Market risk: is the market real and large enough?
2. Product risk: can they build it / does it work at scale?
3. Team risk: founder-market fit, key person dependency
4. Competition risk: can incumbents replicate or acquire competitors?
5. Technology risk: AI disruption, API dependency, platform risk
6. Regulatory risk: any pending regulation that could change the landscape?
7. Fundraising risk: how much runway do they have and what triggers the next round?
8. Customer concentration: does one customer represent >20% of revenue?

For each risk: [Risk] | [Probability: High/Med/Low] | [Impact: High/Med/Low] | [Mitigant or open question]

Prioritise the top 5. Flag which risks need resolution before we can invest.
```

---

### Due-Diligence-Checkliste

```
Generate a pre-IC diligence checklist for a [stage] investment in [sector].

Based on what I know:
- Known gaps: [list anything you couldn't verify from founder conversations]
- High-risk areas: [which risks from the risk assessment need investigation]
- References needed: [customer, prior employer, investor references]

Generate a checklist covering:
[ ] Financial diligence: [what to request from the company]
[ ] Customer diligence: [which customers to call, what to ask]
[ ] Technical diligence: [code review, architecture, security]
[ ] Legal/corporate: [cap table, IP assignment, prior financing terms]
[ ] Reference calls: [founder references — prior employers, co-founders, investors]
[ ] Market diligence: [expert calls, industry reports to pull]
[ ] Competitive diligence: [conversations with people who've evaluated alternatives]
```

---

### Investitionsempfehlungs-Abschnitt

```
Write the Recommendation section of a deal memo.

Summary of findings:
- Investment thesis (your 2 sentences): [describe]
- Key strengths: [top 3]
- Key risks: [top 3]
- Valuation: $[X]M pre-money, [X]x ARR / revenue multiple vs. comps at [X]x
- Our proposed check: $[X]M for [X]% ownership

Recommendation options:
[ ] INVEST — proceed to IC with the following conditions: [list]
[ ] PASS — primary reason: [state clearly, not diplomatically]
[ ] INVEST WITH CONDITIONS — invest only if: [specific conditions met]
[ ] WAIT — re-evaluate at: [next milestone or date]

Write a crisp recommendation section (150 words max). State your view clearly. Avoid mealy-mouthed language. If you're passing, say why directly so the team learns from it.
```

---

### Deal-Memo-Ausgabeformat

```markdown
# Deal Memo: [Company Name]
**Date:** [Date] | **Stage:** [Stage] | **Analyst:** [Name]
**Round:** $[X]M | **Our check:** $[X]M | **Post-money valuation:** $[X]M

---

## TL;DR
[3 bullet points: what they do, why the market, why we'd invest or pass]

---

## 1. Company Overview
[What they do, founded when, where, team size, stage]

## 2. Market Opportunity
[TAM/SAM/SOM, why now, tailwinds]

## 3. Business Model & Unit Economics
[Revenue model, key metrics, unit economics — with [UNVERIFIED] flags]

## 4. Team Assessment
[Strengths, gaps, founder-market fit]

## 5. Competitive Analysis
[Competitive map, differentiation, moat]

## 6. Financial Overview
[ARR, growth, burn, runway — all figures marked as founder-provided unless verified]

## 7. Investment Terms & Valuation
[Round terms, our check, ownership, valuation vs. comps]

## 8. Risk Factors
[Top 5 risks with probability, impact, and mitigant]

## 9. Diligence Required Before IC
[Checklist of what must be verified]

## 10. Recommendation
[Invest / Pass / Conditional — stated clearly with rationale]
```

## Beispiel

**Benutzer:** Ich hatte gerade ein Gespräch mit den Gründern eines Seed-Stage-B2B-KI-Unternehmens, das die rechtliche Vertragsüberprüfung automatisiert. 2 Mitgründer — ein ehemaliger BigLaw-Anwalt und ein Engineering-Lead von einem führenden Legal-Tech-Unternehmen. 400.000 USD ARR, 30 % MoM-Wachstum, 4 Enterprise-Piloten. Raisingphase: 3 Mio. USD Seed bei 15 Mio. USD Pre-Money. 18 Monate Runway.

**Erwartete Ausgabe:** Ein vollständiges Deal-Memo mit Marktanalyse (Legal Tech X0 Mrd. USD, KI-Disruptions-Timing), Team (ausgezeichnete Domain/Technik-Passung, fehlender Enterprise-Sales-Leader), Unit Economics (Aufforderung zur LTV/CAC-Verifizierung), Wettbewerbslandschaft (Harvey, Ironclad, Kira als Vergleichsunternehmen), Risikofaktoren (Kundenkonzentration in Piloten, regulatorische Risiken rund um KI in Rechtsberatung, Enterprise-Sales-GTM) und ein Empfehlungsabschnitt, der entweder für oder gegen das Investment argumentiert. Alle vom Gründer bereitgestellten Finanzzahlen sind mit [UNVERIFIED] markiert.

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
