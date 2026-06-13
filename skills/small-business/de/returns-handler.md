---
name: returns-handler
description: "Rückgabe- und Rückerstattungsmanagement: Richtlinienentwurf, Antwortvorlagen, Streitbeilegung, Trendanalyse"
---

# Returns Handler Skill

## Wann aktivieren
- Verfassen oder Aktualisieren deiner Rückgabe- und Rückerstattungsrichtlinie
- Antworten auf eine Kundenrückgabeanfrage, Rückerstattungsforderung oder Beschwerde
- Bearbeitung einer Rückbuchung oder Zahlungsstreitigkeit
- Ein Kunde eskaliert aggressiv und du brauchst eine abgewogene Antwort
- Analyse von Rückgabedaten, um Produkt- oder Prozessprobleme zu finden, die die Rate erhöhen
- Schulung von Kundendienstmitarbeitern zu Rückgabehandlungsstandards

## Wann NICHT verwenden
- Komplexe Rechtsstreitigkeiten — hol dir einen Anwalt, nicht Claude
- Massenbearbeitung von Rückgaben in deinem Shopify/WooCommerce-Admin — verwende die nativen Tools deiner Plattform
- Betrugsuntersuchungen, die eine Auftragsebenen-Datenanalyse erfordern — verwende die Betrugstools deiner Plattform
- Fälle, in denen du bereits eine endgültige Geschäftsentscheidung getroffen hast — verwende keine KI, um sie zu legitimieren

## Anweisungen

### Rückgaberichtlinien-Generator

```
Write a returns and refunds policy for my [business type].

Business: [describe — what you sell, average order value, sales channels]
Platform: [Shopify / WooCommerce / Amazon / Etsy / own site]
Customer type: [consumer B2C / business B2B]
Current return rate: [X%] (industry average for reference: 5-15% ecommerce, 20-30% apparel)
Problem areas: [what types of returns are causing you the most pain]

Write a policy covering:

1. Return window
   - Standard: 30 days from delivery
   - Defective/damaged: 60 days
   - Final sale / customised items: no return — must be explicit
   Recommendation based on my category: [suggest window]

2. Return conditions
   - Unused, original packaging (strict — reduces fraud)
   - Lightly used (gentler — reduces buyer hesitation)
   - Any condition (fullest protection for buyer confidence)

3. Refund types and timelines
   - Full refund to original payment method: [X business days]
   - Store credit: [X business days]
   - Exchange: [X business days to ship replacement]
   - Restocking fee (if applicable): [X% — justify with category norm]

4. Who pays return shipping
   - Seller pays: [when — defective, wrong item, free threshold]
   - Buyer pays: [when — change of mind, ordered wrong size]
   - Pre-paid label: [when to include it in the box]

5. Non-returnable items
   [List categories: digital products, consumables, personalised/custom, final sale]

6. Process steps (how to initiate a return)
   - Where to submit request
   - What information to include
   - Expected response time
   - Where to ship the item

7. Dispute and escalation path
   - What happens if refund is denied
   - Who to contact if unresolved

Format: customer-facing policy page. Clear, plain language. No legal jargon that confuses customers.
```

### Kunden-Rückgabe-Antwortvorlagen

```
Generate response templates for the following return/refund scenarios.

My business: [describe — product type, AOV, brand tone: formal / friendly / empathetic]

Template 1: Straightforward return request (within policy)
Customer says: "I'd like to return this, it's not what I expected."
Response: Approve immediately, provide return instructions, set expectation for refund timeline.
Tone: Warm and efficient — don't make them work for it.

Template 2: Return outside the window
Customer says: "I know it's been 45 days but I never got to use it — can I still return it?"
Response: Acknowledge, explain policy, offer store credit as goodwill gesture (or firm decline with empathy).
Tone: Empathetic but clear on the boundary.

Template 3: Defective product
Customer says: "This broke after one week. I want a refund."
Response: Apologise, ask for photo evidence, offer immediate replacement or full refund, no return required for low-value items.
Tone: Proactive — make them whole before they escalate.

Template 4: "I changed my mind" on a final sale item
Customer says: "I accidentally ordered the wrong size on a sale item. Can I return it?"
Response: Explain the final sale policy, offer exchange for same item in correct size if in stock, do not offer refund.
Tone: Helpful within the rules — offer what you can, not what you can't.

Template 5: Aggressive or threatening customer
Customer says: "Give me my money back or I'll do a chargeback / leave a 1-star review / report you."
Response: De-escalate, do not match aggression, state facts, offer resolution — do not be coerced into policy exceptions by threats.
Tone: Calm, professional, firm. If threat involves illegal action (e.g., defamation), note it neutrally.

Template 6: Item not received (but tracking shows delivered)
Customer says: "I never got my package — tracking says delivered."
Response: Acknowledge frustration, explain carrier delivery confirmation, ask to check with neighbours/building, offer replacement after X days if still unresolved.
Tone: Believe them first — then verify.

For each template: subject line + body + internal note (what to log in your system)
```

### Rückbuchungs-Streitantwort

```
Help me respond to a chargeback dispute.

Transaction details:
- Order ID: [X]
- Product: [what was sold]
- Order date: [date]
- Delivery date / tracking: [date and tracking number]
- Amount: [$X]
- Chargeback reason code: [e.g., "item not received" / "item not as described" / "unauthorised transaction"]

Evidence I have:
- Order confirmation: [yes/no]
- Delivery confirmation with tracking: [yes/no]
- Customer communication: [paste relevant emails/messages]
- Product photos or description: [yes/no]
- Any prior return request from this customer: [yes/no]

Write:
1. Chargeback rebuttal letter (2-3 paragraphs)
   - State the facts of the transaction
   - Reference evidence (tracking, communications)
   - Explain why the chargeback reason is incorrect
   - Request the chargeback be reversed

2. Evidence checklist
   What to attach, in order of persuasiveness for this reason code

3. Response deadline note
   Chargebacks typically require response within 7-21 days depending on card network — confirm your deadline with your payment processor.
```

### Rückgabe-Trendanalyse

```
Analyse my return data to identify product and process issues.

Return data for the last [X months]:
[Paste your return log — or provide: product name | return reason | date | order value | return shipping cost]

Analyse:
1. Return rate by product (which SKUs have the highest return rate?)
2. Return reason breakdown (size/fit / defective / not as described / change of mind / wrong item sent)
3. Return rate trend (is it rising, falling, or stable?)
4. High-value return analysis (what's your average order value among returned orders vs. non-returned?)
5. Returns by channel (if selling on multiple platforms — is one channel driving higher returns?)
6. Time-to-return distribution (returns within 7 days = product problem; 15-30 days = buyer remorse; >30 days = late defect)

Output:
- Top 3 SKUs to investigate (name, return rate %, primary reason)
- Top return reason and root cause hypothesis
- Recommended action per issue type:
  - "Not as described" > 20% of reasons → listing problem → use /product-listing-optimizer
  - "Defective" > 10% → supplier quality issue → audit supplier
  - Size/fit > 30% → sizing chart missing or inaccurate → add size guide
  - Wrong item shipped > 5% → fulfillment process problem → warehouse audit
- Estimated annual cost of returns ([return rate] × [average order value] × [volume])
- Projected savings if top issue is resolved
```

### Rückgabebetrug-Prävention

```
Help me identify and prevent return fraud patterns.

My business: [describe — product type, AOV, volume]
Current problem: [what types of fraud you're seeing — or general audit]

Common return fraud patterns:
1. Wardrobing / renting: customer uses product and returns it (apparel, electronics)
2. Empty box scam: customer claims item not received, ships back empty box or wrong item
3. Receipt fraud: returning item bought at lower price with higher-price receipt
4. Policy abuse: serial returners who return > X% of orders
5. Friendly fraud chargebacks: customer claims "not received" after confirmed delivery

Detection signals:
- Customer return rate > 20% of their orders (flag for review)
- Returns always submitted near the end of the return window
- Photos of returned item don't match order
- Chargeback history: more than 2 chargebacks per customer
- New account + high-value first order + return request within 3 days

Policy adjustments to reduce fraud without hurting genuine customers:
1. Require photo evidence for defective claims before approving
2. Flag returns for manual review above $[threshold]
3. Track serial returners in your CRM — offer exchange-only for flagged accounts
4. Use a return merchandise authorisation (RMA) system — random check some returns before refund
5. Add "return must match original item" language to policy

Write a brief internal fraud detection SOP (not customer-facing).
```

### Rückgabequoten-Benchmarks

```typescript
const RETURN_RATE_BENCHMARKS = {
  // Industry averages — flag if significantly above
  electronics: { average: 0.11, high: 0.20 },
  apparel_footwear: { average: 0.25, high: 0.40 },
  home_goods: { average: 0.08, high: 0.15 },
  beauty: { average: 0.05, high: 0.10 },
  books_media: { average: 0.03, high: 0.06 },
  general_ecommerce: { average: 0.10, high: 0.20 },

  // By return reason — flag if above threshold
  reasonBenchmarks: {
    defective: 0.05,           // > 5% = supplier quality issue
    notAsDescribed: 0.08,      // > 8% = listing accuracy issue
    wrongItemShipped: 0.02,    // > 2% = fulfillment process issue
    sizeFit: 0.10,             // > 10% (apparel) = sizing guide issue
    changedMind: 0.05,         // > 5% = possible impulse purchase problem
    itemNotReceived: 0.02,     // > 2% = shipping/carrier issue
  },

  // Return shipping cost as % of order value
  costThreshold: 0.15,         // > 15% of AOV = investigate fulfillment or pricing
}

// Return rate formula:
// return_rate = returned_orders / total_shipped_orders
// high-value return rate = (returned_order_value) / (total_shipped_order_value)
// net return cost = (returned orders × avg AOV) + (return shipping × returned orders) - (restocked value)
```

## Beispiel

**Nutzer:** A customer is demanding a full refund on a $180 pair of boots. They say "the sole is already peeling after 3 weeks." This is within my 30-day window. They've sent one photo that's blurry and doesn't clearly show the defect.

**Antwort:**

```
Subject: About your boot return — [Order #12345]

Hi [Name],

Thank you for reaching out. A sole separating after 3 weeks is absolutely not acceptable, and I want to make this right for you.

To process your replacement or refund quickly, could you send one clear photo of the separation — ideally with the boot flat on a table and good lighting? This helps me document the defect with our supplier and ensures the replacement pair goes through quality control before shipping to you.

Once I have the photo, I'll process your choice of:
- A full replacement pair shipped within 2 business days
- A full refund to your original payment method within 5 business days

You won't need to return the defective pair — I'll just need the photo for our records.

[Your name]

---
INTERNAL NOTE: Log as defective return. Attach photo once received. If sole separation > 3 claims this month for this SKU → escalate to supplier QC review. Do not require return for items under $200 with photo evidence — processing cost exceeds item value.
```

---
