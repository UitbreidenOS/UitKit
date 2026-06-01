# Claude for E-commerce Operators

Everything an e-commerce operator needs to run AI-augmented product listings, customer service, marketing campaigns, and operational reporting — whether you're on Shopify, Amazon, Etsy, or all three.

---

## Who this is for

You are an e-commerce operator, online store owner, or marketplace seller whose job spans product, marketing, customer service, and operations. You write listings, run email campaigns, manage reviews, handle returns, and monitor ad spend — often all in the same day.

**Before Claude Code:** New product listing: 45 minutes. Customer complaint response: 15 minutes (and you second-guess yourself). Email campaign: 2 hours. Monthly reporting: half a day.

**After:** Product listing optimised in 15 minutes. Customer complaint handled in 3 minutes. Email campaign briefed and drafted in 30 minutes. Monthly report pulled and formatted in 20 minutes.

---

## 30-second install

```bash
# Install the full e-commerce stack
npx claudient add skills small-business/shopify-operations
npx claudient add skills small-business/ecommerce-seller
npx claudient add skills small-business/email-campaign
npx claudient add skills small-business/review-response
npx claudient add skills marketing/paid-ads
npx claudient add skills small-business/product-listing-optimizer
npx claudient add skills small-business/returns-handler
npx claudient add agents specialists/ecommerce-specialist
```

---

## Your Claude Code e-commerce stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/product-listing-optimizer` | Optimise listings for SEO and conversion: title, bullets, description, A+ content, image brief | New listings, low-conversion SKUs, seasonal refreshes |
| `/ecommerce-seller` | Full seller operations: pricing strategy, inventory decisions, marketplace tactics | Day-to-day seller decisions |
| `/shopify-operations` | Shopify-specific: store setup, theme decisions, app recommendations, checkout optimisation | Shopify store management |
| `/email-campaign` | Campaign planning, copy, send strategy for email marketing | Promotional and newsletter campaigns |
| `/review-response` | Respond to customer reviews: positive, negative, neutral — all channels | Daily review triage |
| `/returns-handler` | Returns policy, response templates, dispute resolution, trend analysis | Returns and refund management |
| `/paid-ads` | Ad copy, campaign structure, audience targeting, performance analysis | Paid social and search |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `ecommerce-specialist` | Sonnet | Complex decisions: marketplace strategy, seasonal planning, category expansion |

---

## Daily workflow

### Morning sales dashboard (15 minutes)

Start every day with a clear picture of performance:

```
/ecommerce-seller

Morning check-in for [DATE]:

Yesterday's metrics:
- Revenue: [$X]
- Orders: [X]
- Average order value: [$X]
- Units sold by top SKU: [list]
- Return requests: [X]
- New reviews: [positive: X / negative: X]
- Ad spend: [$X] / ROAS: [X]
- Cart abandonment rate: [X%]

Flag:
- Any SKU with stock < 14 days of supply at current velocity
- Any ad campaign with ROAS below threshold [$X target]
- Any negative reviews needing same-day response
- Any orders with fulfilment delay risk
```

---

### Customer inquiries and review management (20-30 minutes)

**Negative review response:**

```
/review-response

Platform: [Amazon / Google / Trustpilot / Etsy]
Review: [paste review text]
Star rating: [1-3]
Product: [name]
Order details I have (if any): [paste]

Write a professional response that:
- Acknowledges the specific complaint (not a generic apology)
- States what we're doing to fix it (or have already done)
- Offers a resolution path (replacement, refund, direct contact)
- Doesn't get defensive
- Under 100 words
```

**Return request:**

```
/returns-handler

Scenario: [describe the request — e.g., customer wants to return boots claiming sole is peeling after 3 weeks]
Order details: [date, product, amount]
Within policy window: [yes / no — and which policy applies]

Write: customer response + internal note for logging.
```

---

### Listing optimisation (30-60 minutes)

**New product listing:**

```
/product-listing-optimizer

Marketplace: [Amazon / Shopify / Etsy / eBay]
Product: [name and description]
Category: [category + subcategory]
Price: [$X]
Target customer: [who buys this, what problem it solves]
Key features: [list]
Top competitor: [name or URL]

Produce: keyword research, optimised title, 5 bullets, description, image brief.
```

**Listing audit (low-conversion SKU):**

```
/product-listing-optimizer

Audit mode.

Current listing: [paste title + bullets + description]
Current conversion rate: [X%] (category average: [Y%])
Current ranking for main keyword: [position or unknown]

Diagnose: what's hurting conversion? Score each element. Give me the top 2 highest-impact fixes.
```

---

### Ad performance review (20 minutes)

```
/paid-ads

Platform: [Meta Ads / Google Ads / Amazon PPC]

Last 7-day performance:
- Total spend: [$X]
- Revenue attributed: [$X]
- ROAS: [X]
- CTR: [X%]
- Conversion rate: [X%]
- Top 3 campaigns: [name, spend, ROAS each]
- Bottom 3 campaigns: [name, spend, ROAS each]

Analysis:
- Which campaigns are below target ROAS? Recommend: pause / reduce bid / refresh creative
- Which audiences are over-indexing? Recommend: scale
- Are there any budget allocation changes I should make today?
```

---

### Inventory check (10 minutes, daily)

```
/ecommerce-seller

Inventory status:

[Paste your inventory CSV or list key SKUs with: units on hand, daily average sales velocity]

Flag:
- Stockout risk in < 14 days at current velocity
- Overstocked items (> 90 days supply) — recommend discount or bundle
- Reorder recommendations: quantity and timing based on lead time of [X days]

Output: prioritised action list — what to order today, what to discount, what to monitor.
```

---

## Weekly rhythm

### Monday — Campaign and content planning

```
/email-campaign

Plan this week's email:
- Audience segment: [segment name, size]
- Objective: [drive revenue / re-engage / announce product]
- Offer or content angle: [e.g., new product launch / 20% sale / seasonal feature]
- Previous campaign performance: [last open rate, CTR]

Produce: campaign brief, subject line (A/B variants), email draft, send time recommendation.
```

### Wednesday — Listing and SEO check

Run `/product-listing-optimizer` on your lowest-performing 3 SKUs (by conversion rate).
One optimised listing per week = significant compound improvement in 90 days.

### Friday — Weekly performance report

```
/ecommerce-seller

Weekly report for [week]:

Revenue: [$X] vs. [$X prior week] vs. [$X target]
Orders: [X] / AOV: [$X]
Top 3 products by revenue: [list]
Marketing spend: [$X] / Revenue attributed: [$X] / Blended ROAS: [X]
Customer service: [X tickets] / [X returns] / Avg resolution time: [X hours]
Inventory: [any stockouts or overstock issues?]

Format: executive summary (3 bullets) + detailed breakdown for records.
What do I need to focus on next week?
```

---

## Seasonal planning

Use the `ecommerce-specialist` agent 60-90 days before major events:

```
@ecommerce-specialist

Plan our [Q4 / Prime Day / Black Friday / Valentine's Day] campaign.

Products to feature: [list]
Budget: [$X total for marketing]
Timeline: [start date to event date]
Inventory position: [current stock + lead time for reorder]
Last year's results for this event (if applicable): [metrics]

Produce:
- 90-60-30 day preparation checklist
- Pricing and discount strategy
- Campaign calendar (email + paid)
- Inventory order quantities and timing
- Listing refresh plan for featured products
```

---

## 30-day ramp plan

### Week 1 — Audit your baseline

- Install all e-commerce skills
- Run `/product-listing-optimizer` in audit mode on your top 10 revenue SKUs
- Check your current returns policy with `/returns-handler` — does it protect you legally and retain customers?
- Pull 30-day ad performance data and run a gap analysis with `/paid-ads`
- Set up your daily dashboard template in `/ecommerce-seller`

### Week 2 — Listing and reviews overhaul

- Rewrite your 3 lowest-converting listings with `/product-listing-optimizer`
- Respond to every unresponded review from the last 90 days with `/review-response`
- Set up a review monitoring workflow: daily review triage as part of morning routine

### Week 3 — Marketing and customer service

- Plan and launch your first AI-drafted email campaign with `/email-campaign`
- Rewrite your returns policy and response templates with `/returns-handler`
- Run a `/paid-ads` creative refresh on your top-spending campaigns

### Week 4 — Systemise

- Build your weekly reporting template with `/ecommerce-seller`
- Train any team members or VAs on using the skills for daily triage
- Identify your next seasonal event and begin 60-day planning
- Review month-over-month performance: which metrics improved most?

---

## Tool integrations

### Shopify (store management)

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "your-token",
        "SHOPIFY_STORE_DOMAIN": "yourstore.myshopify.com"
      }
    }
  }
}
```

With Shopify connected: Claude can read orders, product data, and inventory directly.

### Klaviyo (email marketing)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Use for: segment analysis, campaign performance data, flow optimisation.

### Google Analytics / GA4

Export your product performance and traffic data as CSV → paste into `/ecommerce-seller` for analysis.

### n8n (automation)

```
Automate the review response loop:
New review → classify sentiment → draft response → Slack alert for human approval → post

Automate inventory alerts:
Daily stock check → if stock < 14 days → create reorder task in your project tool
```

---

## Metrics to track

| Metric | Target | Red flag |
|---|---|---|
| Conversion rate (product page) | > 3% (Shopify avg) / > 15% (Amazon) | < 1.5% |
| Return rate | < 10% (general) / < 20% (apparel) | > 25% |
| ROAS (paid ads) | > 3x (minimum) / > 5x (healthy) | < 2x |
| Email open rate | > 25% | < 15% |
| Review response rate | 100% of negative reviews | Any unresponded negative |
| Customer inquiry response time | < 4 hours | > 24 hours |
| Stockout rate | < 2% of SKUs at any time | > 5% |
| AOV (average order value) | Growing month-over-month | Declining 2+ consecutive months |

---

## Common mistakes and how Claude Code helps avoid them

**Mistake 1: Generic product listings that don't rank**
`/product-listing-optimizer` forces keyword research before writing. No keywords = no ranking = no traffic.

**Mistake 2: Ignoring negative reviews**
`/review-response` makes responding a 3-minute task. Every unresponded negative review costs future conversions.

**Mistake 3: Running the same creative indefinitely**
`/paid-ads` surfaces creative fatigue before you notice it in ROAS. Refresh signals come from CTR trends, not just ROAS.

**Mistake 4: Returns policy as an afterthought**
`/returns-handler` builds policies that retain customers and protect you from fraud. "Contact us to return" is a policy — it's just the worst one.

**Mistake 5: Buying inventory based on feeling**
`/ecommerce-seller` turns your velocity data into a reorder recommendation. Stockouts and overstock are both expensive.

---

## Resources

- [Getting started with Claude Code](./getting-started.md)
- [Shopify operations skill](../skills/small-business/shopify-operations.md)
- [Product listing optimizer](../skills/small-business/product-listing-optimizer.md)
- [Returns handler](../skills/small-business/returns-handler.md)
- [E-commerce weekly workflow](../workflows/ecommerce-weekly.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
