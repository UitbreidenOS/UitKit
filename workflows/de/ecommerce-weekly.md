# Wöchentlicher E-Commerce-Operator-Workflow

Ein wiederholbarer wöchentlicher Workflow für einen KI-gestützten E-Commerce-Operator — deckt Verkaufsüberwachung, Listing-Optimierung, Kundenservice, E-Mail-Marketing, Anzeigenperformance und Bestandsmanagement ab.

---

## Überblick

**Zeitaufwand:** ~2–3 Stunden strukturierter Claude Code-Sessions pro Woche (ersetzt 10–12 Stunden manuelle Arbeit).

**Was dieser Workflow abdeckt:**
- Jeden Morgen: Sales-Dashboard + Kunden-Triage (20 Minuten)
- Montag: Wochenplanung + E-Mail-Kampagnenstart
- Dienstag–Mittwoch: Listing- und SEO-Arbeit
- Donnerstag: Anzeigenperformance und bezahltes Marketing
- Freitag: Wochenbericht + Bestandsplanung

**Voraussetzungen:** Mindestens `/ecommerce-seller`, `/product-listing-optimizer` und `/review-response` installiert.

---

## Täglich — Morgenroutine (20 Minuten, jeden Tag)

### Sales-Dashboard-Check

```
/ecommerce-seller

Daily check — [DATE]:

Yesterday's performance:
- Revenue: [$X] vs. [$X same day last week] vs. [$X daily target]
- Orders: [X] / AOV: [$X]
- Top product by units: [name, X units]
- Cart abandonment rate: [X%]

Customer service:
- New inquiries: [X] — any urgent/escalated?
- Return requests: [X]
- New reviews: [positive: X / neutral: X / negative: X]

Inventory alerts:
- Any SKU with < 14 days supply at current velocity: [list or none]
- Any reorder that should have been placed and hasn't been?

Marketing:
- Ad spend yesterday: [$X] / Revenue attributed: [$X] / ROAS: [X]
- Active email campaign performance: [open rate, click rate if sent]

Flag: what requires attention today (ranked by urgency)?
```

---

### Kundenservice-Triage (15 Minuten)

**Review-Antwort:**

```
/review-response

[Paste any new reviews from overnight — with star rating and platform]

For negative reviews (1-3 stars): write professional response addressing the specific complaint.
For positive reviews: acknowledge briefly (optional, helps on Amazon).
For neutral reviews with a concern buried in them: treat as negative.

Under 100 words per response. Never defensive.
```

**Rücksendungs- und Erstattungsanfragen:**

```
/returns-handler

New return requests:
1. [Describe request — product, complaint, order date, value]
2. [etc.]

For each: within policy? [yes/no] → write appropriate response + internal note.
```

---

## Montag — Wochenplanung und E-Mail-Start

### 9:00–9:30 Uhr — Wochenplanung

```
/ecommerce-seller

Week planning for [DATE RANGE]:

Last week's performance:
- Revenue: [$X] vs. [$X target]
- Best performer: [SKU + revenue]
- Worst performer: [SKU]
- Customer service load: [X tickets, X returns]

This week:
- Any upcoming sales events or promotions? [yes/no + details]
- Seasonal keywords that should peak this week? [e.g., "Father's Day gifts"]
- Products to prioritise for listing work this week: [list]
- Ads to review: [campaigns due for creative refresh or bid adjustment]

Top 3 priorities this week: what will move revenue most?
```

### 9:30–10:30 Uhr — E-Mail-Kampagnenstart

```
/email-campaign

This week's email:
- Segment: [segment name, size — or full list]
- Objective: [drive revenue / re-engage inactive / announce new product]
- Offer: [% off / new arrival / content piece / seasonal hook]
- Send day and time: [recommendation based on segment]

Produce:
- Subject line (A/B variants)
- Preview text
- Email draft (brief but complete — hero, body, CTA)
- UTM parameters for tracking

After approval, schedule in [Klaviyo / Mailchimp / your platform].
```

---

## Dienstag — Listing-Optimierung

### 9:00–11:00 Uhr — Listing-Arbeit

**Priorisieren nach:** niedrigste Conversion-Rate unter deinen Top-20-Umsatz-SKUs.

**Neues oder unterperformendes Listing:**

```
/product-listing-optimizer

Marketplace: [Amazon / Shopify / Etsy]
Product: [name]
Current performance: [conversion rate X%, ranking position for main keyword]
Target customer: [who buys this]
Key features: [list]
Competitors: [name 2-3]

Mode: [Full optimisation / Audit only]

Produce: keyword research, optimised title, bullets, description, image brief.
```

**Saisonale Aktualisierung (falls zutreffend):**

```
/product-listing-optimizer

Seasonal refresh mode.

Product: [name]
Season/event: [Q4 / Prime Day / Mother's Day / etc.]
Current title + bullets: [paste]

Add seasonal angle without making permanent changes. Flag which edits to revert after the event.
```

**Verfolge deine Änderungen:**
Nach jedem Listing-Update notieren: Datum, was geändert wurde, aktuelle Conversion-Rate. In 14 Tagen überprüfen.

---

## Mittwoch — SEO und Wettbewerber-Check

### 10:00–11:00 Uhr — Wettbewerber- und Keyword-Review

Monatlich ausführen, nicht wöchentlich. Mittwochs dafür verwenden, wenn es ansteht:

```
/product-listing-optimizer

Competitor gap analysis for: [product category]

My top SKU: [name]
Competitors: [name 2-3 + their URLs or ASINs]

Find:
- Keywords competitors rank for that I don't
- Complaints in competitor reviews that my product solves
- Visual gaps in their listing (images they're missing)

Produce: keyword gap list + differentiation angles I should emphasise in my next listing update.
```

---

## Donnerstag — Bezahlte Anzeigen und Marketing-Performance

### 10:00–11:00 Uhr — Anzeigenperformance-Review

```
/paid-ads

Platform: [Meta Ads / Google Ads / Amazon PPC]

Last 7-day performance:
- Total spend: [$X]
- Revenue attributed: [$X] / ROAS: [X]
- CTR: [X%] / Conversion rate: [X%]

By campaign:
[List each active campaign: name, spend, ROAS, CTR]

Analyse:
1. Which campaigns are below target ROAS ($[X] target)?
   → Recommendation: pause / reduce bids / new creative
2. Which campaigns are above target?
   → Recommendation: scale spend
3. Any ad sets with CTR > 2% but conversion < 1%?
   → Likely a landing page problem, not the ad
4. Any audiences that are saturating? (CTR dropping week-over-week)
   → Time for new creative or audience expansion

Produce: specific changes to make today + creative brief for any ad needing a refresh.
```

### 11:00–11:30 Uhr — Creative-Produktion (falls nötig)

```
/paid-ads

Write ad copy for: [campaign name and objective]
Product: [name and key features]
Target audience: [demographics + interests + pain points]
Offer: [if any — discount, bundle, free shipping threshold]
Format: [single image / carousel / video script]

Write: headline variants (5), primary text variants (3), CTA options, and a brief for the creative team/designer.
```

---

## Freitag — Wochenbericht und Bestandsplanung

### 14:00–15:00 Uhr — Bestand und Nachbestellplanung

```
/ecommerce-seller

Inventory planning for week ending [DATE]:

Current inventory by SKU:
[Paste your inventory CSV or key SKUs with: units on hand, daily sales velocity last 14 days]

Lead times:
- Supplier A: [X days]
- Supplier B: [X days]

Reorder rules:
- Reorder point: [X days of supply remaining]
- Minimum order quantity: [X units per SKU]

Produce:
1. Stockout risk list: SKUs hitting reorder point in < 14 days
2. Overstocked items: > 90 days supply — recommend discount, bundle, or pause ad spend
3. Reorder recommendation: which SKUs to order now, quantity, and expected arrival date
4. Supplier instructions: format reorder requests for each supplier
```

### 15:00–16:00 Uhr — Wöchentlicher Performance-Bericht

```
/ecommerce-seller

Weekly report for week ending [DATE]:

Revenue: [$X] vs. [$X prior week] vs. [$X target]
Orders: [X] / AOV: [$X]
Units sold: [X]
Return rate this week: [X%]

Marketing:
- Email: sent to [X] subscribers, open rate [X%], click rate [X%], revenue $[X]
- Paid ads: spend $[X], ROAS [X], revenue $[X]
- Organic: [any SEO/listing updates made this week]

Customer service:
- Tickets: [X] / Avg response time: [X hours]
- Returns: [X] / Total refund value: [$X]
- New negative reviews: [X] / All responded: [yes/no]

Top product: [SKU, units, revenue]
Worst product: [SKU, units — flag if below expected]

Listings updated this week: [list]
A/B tests running: [list with current status]

Next week priorities: [top 3 based on this week's data]

Format: 3-bullet executive summary + full detail for records.
```

---

## Monatlicher Rhythmus

### Erste Woche des Monats — Vollständiges Reporting

```
/ecommerce-seller

Monthly report for [MONTH]:

Revenue: [$X] vs. [$X target] vs. [$X same month last year]
Orders: [X] / AOV: [$X] / Total units: [X]
Return rate: [X%] — trend vs. last 3 months: [up/flat/down]

Top 5 SKUs by revenue: [list]
Bottom 5 SKUs by margin (if known): [list]

Email programme:
- Total sends: [X]
- Average open rate: [X%] / click rate: [X%]
- Revenue attributed: [$X]

Paid ads:
- Total spend: [$X] / Revenue attributed: [$X] / Blended ROAS: [X]

List and inventory:
- Stockouts: [X incidents, X days out of stock]
- Overstock write-downs: [$X if any]

Customer service:
- Total tickets: [X] / Return rate: [X%] / CSAT if tracked: [X]

What worked this month?
What didn't?
What to change for next month?
```

### Saisonale Planung (90–60 Tage vor großen Events)

```
@ecommerce-specialist

Prepare our [SEASON / EVENT] plan.

Products to feature: [list with inventory levels]
Competitors' likely moves: [what you know or expect]
Budget: [$X for ads + email promotion]
Event date: [date]
Today's date: [date]

Produce:
- 90/60/30-day checklist
- Pricing and discount strategy
- Listing refresh plan (which SKUs need seasonal update)
- Email calendar: [N emails, themes, send dates]
- Ad budget allocation
- Inventory top-up: quantities to order and order deadline based on lead time
```

---

## Wenn etwas schiefläuft

### „ROAS ist diese Woche um 30 % gesunken"

```
/paid-ads

ROAS diagnostic:
Platform: [specify]
Current ROAS: [X] — last month average: [X]

Check:
1. Did CPM (cost per 1000 impressions) increase? → Audience saturation or competitive pressure
2. Did CTR drop? → Creative fatigue
3. Did conversion rate drop with stable CTR? → Landing page or listing issue
4. Did AOV drop? → Wrong product being pushed or offer less compelling

Identify the metric that changed first. That's where the problem is.
Recommended diagnostic: change one variable at a time.
```

### „Ich habe eine negative Rezension, die viral geht"

```
/review-response

Escalated review situation:
Platform: [Amazon / Google / Trustpilot / social media]
Review text: [paste]
Star rating: [1]
Engagement: [X likes/shares — it's gaining traction]
Order details: [what we know about this customer and order]
Is the complaint factually accurate? [yes / partial / no]

Write:
1. Public response (under 100 words — calm, factual, solution-focused)
2. Private outreach message to the reviewer
3. Internal note: what systemic issue does this review expose, if any?
```

### „Ein Schlüsselprodukt ist ausverkauft und ich verliere Ranking"

```
/ecommerce-seller

Out-of-stock recovery plan for: [product name]

Current status: 0 units / estimated restock: [date]
Current ranking for main keyword: [position — was [X] before stockout]
Daily revenue impact: [$X per day]
Supplier options:
- Option A: [lead time, cost]
- Option B (expedited): [lead time, higher cost]

Recommend:
1. Whether to expedite (ROI of expedite cost vs. ranking recovery value)
2. How to minimise ranking damage while out of stock (reduce ad spend, mark as "temporarily unavailable" vs. leave live)
3. Re-launch strategy once restocked (review request campaign, ad ramp-up schedule)
```

---

## Wichtige Benchmarks

| Metrik | Ziel | Untersuchen wenn... |
|---|---|---|
| Produkt-Conversion-Rate | > 3 % (Shopify) / > 15 % (Amazon) | < 1,5 % / < 8 % |
| Rückgabequote | < 10 % | > 20 % |
| Antwortrate auf negative Rezensionen | 100 % | Jede unbeantwortete |
| E-Mail-ROAS | > 10x | < 5x |
| Bezahlte Anzeigen ROAS | > 3x | < 2x |
| Ausverkaufsrate | < 2 % der SKUs | > 5 % |
| Kundenantwortzeit | < 4 Stunden | > 24 Stunden |
| Listing-Aktualisierungsrhythmus | Monatlich für Top-20-SKUs | Vierteljährlich oder seltener |

---
