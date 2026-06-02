# E-commerce Brand Operations — Project Structure

> For DTC brand teams running Shopify Plus who need Claude to own daily product management, email and SMS campaigns, paid ad copy, inventory reorder, customer service escalation, and performance analytics across a modern martech stack.

## Stack

- Shopify Plus — storefront, product catalog, inventory, metafields, B2B
- Klaviyo — email flows, SMS sequences, segments, campaign management
- Meta Ads Manager — prospecting, retargeting, DPA campaigns
- Google Performance Max — shopping, search, display unified campaigns
- Triple Whale or Northbeam — multi-touch attribution, MER, nCAC, blended ROAS
- Gorgias — customer support ticketing, macros, CSAT, automation rules
- ShipBob — 3PL fulfillment, WMS, returns portal, distributed inventory
- Recharge Payments — subscription plans, billing logic, churn management
- Yotpo — reviews, UGC, loyalty and referral programs
- QuickBooks Online — P&L, COGS tracking, Shopify payout reconciliation

---

## Directory tree

```
ecommerce-brand/
├── .claude/
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── product-launch.md                  # End-to-end new SKU launch checklist driver
│       ├── listing-optimizer.md               # Rewrite title, description, SEO meta by SKU
│       ├── campaign-brief.md                  # Generate Klaviyo or paid ad campaign brief
│       ├── email-copy.md                      # Draft campaign or flow email with subject variants
│       ├── sms-copy.md                        # Draft Klaviyo SMS with opt-out and character count
│       ├── ad-copy-meta.md                    # 5 primary text hooks + 5 headlines for Meta
│       ├── ad-copy-pmax.md                    # Headlines, descriptions, and assets for PMax
│       ├── inventory-check.md                 # Flag SKUs below reorder threshold by supplier
│       ├── reorder-draft.md                   # Draft PO or supplier email from reorder-tracker
│       ├── cs-macro.md                        # Generate Gorgias macro from ticket type + policy
│       ├── escalation-handler.md              # Triage ticket and apply escalation path
│       ├── subscription-retention.md          # Draft retention offer for Recharge cancel intent
│       ├── review-response.md                 # Draft Yotpo public reply for 1–3 star reviews
│       └── weekly-report.md                   # Narrative report from Triple Whale/Northbeam export
├── CLAUDE.md                                  # Workspace instructions (see template below)
├── products/
│   ├── sku-overview.csv                       # Master: handle, title, variant, price, cost, status, supplier
│   ├── listings/
│   │   ├── _brand-voice.md                    # Tone guide, banned words, style rules for all copy
│   │   ├── _pdp-template.md                   # Standard PDP structure: hook, benefits, specs, CTA
│   │   ├── cotton-canvas-tote-natural.md      # Example: one file per active SKU
│   │   ├── merino-crewneck-charcoal.md
│   │   └── stainless-tumbler-matte-black.md
│   ├── seo/
│   │   ├── meta-titles.csv                    # handle, current_title, proposed_title, char_count
│   │   ├── meta-descriptions.csv              # handle, current_desc, proposed_desc, char_count
│   │   ├── keyword-map.md                     # Primary + secondary keywords by collection
│   │   └── collection-page-copy.md            # SEO-optimized collection page descriptions
│   ├── drafts/
│   │   ├── new-product-brief-template.md      # Pre-launch form: concept, pricing, supplier, launch date
│   │   ├── 2026-q3-canvas-crossbody.md        # In-progress brief for upcoming launch
│   │   └── 2026-q4-holiday-bundle.md
│   └── archived/
│       └── discontinued-skus.csv              # Retired SKUs with discontinuation date and reason
├── marketing/
│   ├── email-sms/
│   │   ├── sequences/
│   │   │   ├── welcome-series.md              # Emails 1–3: onboarding flow copy + timing notes
│   │   │   ├── abandoned-cart.md              # Emails 1–2 + SMS 1: cart recovery sequence
│   │   │   ├── post-purchase.md               # Emails 1–2: review request + cross-sell
│   │   │   ├── win-back-90d.md                # 3-touch win-back for 90-day lapsed buyers
│   │   │   ├── subscription-churn.md          # Recharge cancel-intent: offer + save copy
│   │   │   └── loyalty-milestone.md           # Yotpo points milestone triggered email
│   │   └── campaigns/
│   │       ├── _campaign-brief-template.md    # Audience, goal, offer, CTA, Klaviyo segment, send date
│   │       ├── 2026-q2-mothers-day.md         # Finalized brief + copy for May campaign
│   │       ├── 2026-q3-back-to-school.md
│   │       ├── 2026-q4-bfcm-email.md          # Black Friday / Cyber Monday campaign file
│   │       └── klaviyo-campaign-log.csv       # Campaign name, send date, list size, OR, CTR, revenue
│   └── paid-ads/
│       ├── copy/
│       │   ├── meta-primary-text.md           # Hook variants (5+) per offer for Meta primary text
│       │   ├── meta-headlines.md              # 5+ headline variants for Meta ad sets
│       │   ├── pmax-headlines.md              # 15 headlines (≤30 chars) for Google PMax asset group
│       │   ├── pmax-descriptions.md           # 4 descriptions (≤90 chars) for PMax
│       │   └── dpa-catalog-copy.md            # Dynamic product ad overlay copy rules
│       └── creative-briefs/
│           ├── _ad-brief-template.md          # Offer, hook angle, audience, platform, budget, format
│           ├── 2026-q2-prospecting-meta.md    # Brief for Q2 cold traffic Meta campaigns
│           ├── 2026-q2-retargeting-meta.md
│           ├── 2026-q2-branded-pmax.md        # Branded search PMax campaign brief
│           └── 2026-q3-ugc-creative-meta.md
│   └── social/
│       ├── content-calendar.md                # Monthly post schedule with format and hook
│       └── caption-library.md                 # Reusable captions organized by product/theme
├── operations/
│   ├── inventory-sops/
│   │   ├── reorder-triggers.md                # Reorder threshold rules by SKU velocity and lead time
│   │   ├── reorder-tracker.csv                # SKU, supplier, last_po_date, next_reorder_date, qty
│   │   ├── low-stock-alert-process.md         # Step-by-step: detect → draft PO → confirm → log
│   │   └── dead-stock-review.md               # Quarterly process for slow-moving inventory decisions
│   ├── fulfillment-sops/
│   │   ├── shipbob-receiving-checklist.md     # Steps for logging inbound shipments in ShipBob WMS
│   │   ├── returns-processing.md              # ShipBob returns portal → grade → restock or write-off
│   │   ├── shipbob-exception-handler.md       # Lost, damaged, or delayed shipment resolution steps
│   │   └── distributed-inventory-rules.md    # Which SKUs live in which ShipBob warehouse and why
│   └── cs-playbooks/
│       ├── escalation-matrix.md               # Ticket type → tier 1 / tier 2 / founder escalation map
│       ├── wismo-playbook.md                  # WISMO: check ShipBob → Gorgias macro → follow-up SLA
│       ├── damaged-item-playbook.md           # Damaged goods: photo required → replacement or refund
│       ├── wrong-item-playbook.md             # Wrong item: prepaid label → reship → log in Gorgias
│       ├── subscription-cancel-playbook.md    # Recharge cancel intent → retention offer → log churn
│       └── chargeback-playbook.md             # Evidence collection, Shopify response, dispute timeline
├── analytics/
│   ├── weekly-dashboard.md                    # Template: MER, blended ROAS, nCAC, AOV, top SKUs, action
│   ├── channel-benchmarks.md                  # Platform-level KPI benchmarks by month and quarter
│   ├── cohort-analysis.md                     # LTV cohort table: 30/60/90/180-day repurchase by month
│   ├── triple-whale-export-notes.md           # How to read TW exports, known discrepancies, overrides
│   └── northbeam-attribution-log.md           # Model change log and weekly anomaly notes
├── finance/
│   ├── p-and-l-template.md                    # Monthly P&L: revenue, COGS, gross margin, ad spend, net
│   ├── unit-economics.md                      # CAC, LTV, payback period, contribution margin by SKU
│   ├── quickbooks-reconciliation-sop.md       # Shopify payouts → QB income account → COGS entry
│   └── end-of-month-close.md                  # Checklist: QB reconcile, payout match, margin review
└── vendors/
    ├── supplier-directory.md                  # Name, contact, MOQ, lead time, payment terms, currency
    ├── po-template.md                          # Standard purchase order with all required fields
    └── [supplier-name]/
        ├── po-history.md                       # All POs with dates, quantities, confirmations
        └── quality-notes.md                    # Defect rates, inspection results, unresolved issues
```

---

## Key files explained

| Path | Purpose |
|---|---|
| `products/sku-overview.csv` | Master SKU registry — feed this to Claude before any listing, inventory, or supplier task so context is accurate |
| `products/listings/_brand-voice.md` | Tone guide Claude applies to every listing rewrite, campaign draft, and CS macro — edit this first when brand voice changes |
| `operations/cs-playbooks/escalation-matrix.md` | Decision tree Claude follows when running `/escalation-handler` — maps ticket type to Tier 1, Tier 2, or founder-level response |
| `operations/inventory-sops/reorder-tracker.csv` | Source of truth for when to reorder — Claude reads this when running `/inventory-check` or `/reorder-draft` |
| `marketing/email-sms/campaigns/_campaign-brief-template.md` | Required brief format before Claude drafts any Klaviyo campaign copy — enforces audience, segment, offer, and CTA fields |
| `analytics/weekly-dashboard.md` | Structured template Claude fills each Monday from a pasted Triple Whale or Northbeam export |
| `finance/unit-economics.md` | CAC, LTV, and contribution margin by SKU — Claude references this for any budget or channel recommendation |
| `vendors/supplier-directory.md` | Supplier contacts, MOQs, and lead times — Claude pulls from this before drafting any PO or supplier email |

---

## Quick scaffold

```bash
# Create all directories
mkdir -p ecommerce-brand/.claude/commands
mkdir -p ecommerce-brand/products/listings
mkdir -p ecommerce-brand/products/seo
mkdir -p ecommerce-brand/products/drafts
mkdir -p ecommerce-brand/products/archived
mkdir -p ecommerce-brand/marketing/email-sms/sequences
mkdir -p ecommerce-brand/marketing/email-sms/campaigns
mkdir -p ecommerce-brand/marketing/paid-ads/copy
mkdir -p ecommerce-brand/marketing/paid-ads/creative-briefs
mkdir -p ecommerce-brand/marketing/social
mkdir -p ecommerce-brand/operations/inventory-sops
mkdir -p ecommerce-brand/operations/fulfillment-sops
mkdir -p ecommerce-brand/operations/cs-playbooks
mkdir -p ecommerce-brand/analytics
mkdir -p ecommerce-brand/finance
mkdir -p ecommerce-brand/vendors

# Seed key stub files
touch ecommerce-brand/products/sku-overview.csv
touch ecommerce-brand/products/listings/_brand-voice.md
touch ecommerce-brand/products/listings/_pdp-template.md
touch ecommerce-brand/products/seo/meta-titles.csv
touch ecommerce-brand/products/seo/meta-descriptions.csv
touch ecommerce-brand/marketing/email-sms/campaigns/_campaign-brief-template.md
touch ecommerce-brand/marketing/email-sms/campaigns/klaviyo-campaign-log.csv
touch ecommerce-brand/marketing/paid-ads/creative-briefs/_ad-brief-template.md
touch ecommerce-brand/operations/inventory-sops/reorder-tracker.csv
touch ecommerce-brand/operations/cs-playbooks/escalation-matrix.md
touch ecommerce-brand/analytics/weekly-dashboard.md
touch ecommerce-brand/analytics/channel-benchmarks.md
touch ecommerce-brand/analytics/cohort-analysis.md
touch ecommerce-brand/finance/p-and-l-template.md
touch ecommerce-brand/finance/unit-economics.md
touch ecommerce-brand/vendors/supplier-directory.md
touch ecommerce-brand/vendors/po-template.md
touch ecommerce-brand/CLAUDE.md

# Install Claudient skills
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/klaviyo-campaign
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill operations/inventory-management
npx claudient add skill operations/customer-service-escalation
npx claudient add skill data-ml/weekly-performance-report

# Install slash commands
npx claudient add command product-launch
npx claudient add command listing-optimizer
npx claudient add command campaign-brief
npx claudient add command email-copy
npx claudient add command sms-copy
npx claudient add command ad-copy-meta
npx claudient add command ad-copy-pmax
npx claudient add command inventory-check
npx claudient add command reorder-draft
npx claudient add command cs-macro
npx claudient add command escalation-handler
npx claudient add command subscription-retention
npx claudient add command review-response
npx claudient add command weekly-report
```

---

## CLAUDE.md template

```markdown
# E-commerce Brand Operations Workspace

This is a Claude Code workspace for operating a Shopify Plus DTC brand. Claude handles
product listing optimization, Klaviyo campaign and flow copy, Meta and Google PMax ad copy,
inventory reorder management, customer service escalation, Recharge subscription retention,
Yotpo review responses, and weekly performance reporting. No application code lives here.

---

## Stack

- Shopify Plus — storefront, catalog, inventory, metafields
- Klaviyo — email flows, SMS sequences, campaign management
- Meta Ads Manager — prospecting, retargeting, DPA
- Google Performance Max — shopping, search, display
- Triple Whale / Northbeam — attribution, MER, nCAC, blended ROAS
- Gorgias — support tickets, macros, CSAT, escalation routing
- ShipBob — 3PL fulfillment, WMS, returns portal
- Recharge Payments — subscriptions, billing, cancel-intent flows
- Yotpo — reviews, UGC, loyalty and referral
- QuickBooks Online — P&L, COGS, Shopify payout reconciliation

---

## Directory conventions

- `products/sku-overview.csv` — always feed this file when running listing or inventory tasks
- `products/listings/_brand-voice.md` — apply these tone rules to every piece of copy
- `marketing/email-sms/campaigns/_campaign-brief-template.md` — required before drafting any campaign
- `marketing/paid-ads/creative-briefs/_ad-brief-template.md` — required before drafting any ad copy
- `operations/cs-playbooks/escalation-matrix.md` — follow this when triaging any support ticket
- `operations/inventory-sops/reorder-tracker.csv` — source of truth for reorder timing
- `analytics/weekly-dashboard.md` — fill this template every Monday from platform exports
- `vendors/supplier-directory.md` — pull contact and terms from here before any PO or supplier email

---

## New product launch workflow

When asked to launch a new product, work through these steps in order:
1. Confirm a completed `products/drafts/[product-slug].md` brief exists
2. Run `/listing-optimizer` to produce title, PDP description, meta title, meta description
3. Verify SKU is added to `products/sku-overview.csv` with correct COGS and supplier
4. Run `/campaign-brief` for the launch email — use Klaviyo segment: All Subscribers
5. Run `/email-copy` using the approved brief
6. Run `/ad-copy-meta` and `/ad-copy-pmax` using the launch brief
7. Confirm reorder threshold is set in `operations/inventory-sops/reorder-tracker.csv`
8. Move the draft file from `products/drafts/` to `products/listings/[slug].md`

---

## Campaign briefing process

Before writing any campaign copy, a completed brief must exist in the appropriate folder.
For Klaviyo campaigns: `marketing/email-sms/campaigns/[campaign-slug].md`
For paid ads: `marketing/paid-ads/creative-briefs/[campaign-slug].md`

A brief must specify: audience/segment, goal (acquisition / retention / reactivation),
offer or hook, CTA, platform, send date or go-live date, and budget (for paid).
Claude will not draft copy without a complete brief — prompt for any missing fields.

---

## Inventory reorder triggers

Claude checks `operations/inventory-sops/reorder-tracker.csv` and flags reorder when:
- Units on hand fall below the SKU's reorder threshold (column: reorder_threshold)
- Days of stock remaining (units_on_hand / avg_daily_velocity) < supplier lead time + 7 days
On trigger: run `/reorder-draft` with the SKU and supplier name pulled from supplier-directory.md.

---

## Customer service escalation paths

Follow `operations/cs-playbooks/escalation-matrix.md` for all ticket triage.
Tier 1 (Gorgias macro): WISMO, standard return requests, sizing questions
Tier 2 (CS lead review): damaged goods, wrong item, chargeback disputes, subscription billing
Founder escalation: media threats, legal language, orders > $500, repeated failures

When running `/escalation-handler`, always pull the current policy from:
- `operations/cs-playbooks/[issue-type]-playbook.md` for step-by-step resolution
- `operations/fulfillment-sops/returns-processing.md` for any physical return
- Gorgias ticket history if the customer has contacted before (note if repeat contact)

---

## Common tasks — exact commands

### Optimize a product listing
/listing-optimizer
Provide: product handle or slug, current title, target keywords (from `products/seo/keyword-map.md`).
Output: rewritten title (≤70 chars), PDP description (benefit-led, 150–200 words),
meta title (≤60 chars), meta description (≤155 chars).

### Draft a Klaviyo email campaign
/email-copy
Provide: link to the completed brief in `marketing/email-sms/campaigns/`.
Output: 2 subject line variants (A/B), preview text, full body copy formatted for Klaviyo paste.

### Draft a Klaviyo SMS
/sms-copy
Provide: campaign goal, offer, Klaviyo segment, send date.
Output: SMS body (≤160 chars including opt-out), and a 2-part fallback if >160 chars.

### Generate Meta ad copy
/ad-copy-meta
Provide: link to the brief in `marketing/paid-ads/creative-briefs/`.
Output: 5 primary text hooks, 5 headlines (≤40 chars each), 2 link description variants.

### Generate Google PMax asset group copy
/ad-copy-pmax
Provide: link to the brief in `marketing/paid-ads/creative-briefs/`.
Output: 15 headlines (≤30 chars), 4 descriptions (≤90 chars), long headline (≤90 chars).

### Check inventory and draft reorder
/inventory-check — paste current ShipBob stock export
/reorder-draft — provide SKU and supplier name after alert fires

### Triage a support ticket
/escalation-handler
Provide: Gorgias ticket ID or paste the ticket body.
Claude returns: tier assignment, playbook to follow, macro to use or draft.

### Generate weekly performance report
/weekly-report
Paste the Triple Whale or Northbeam weekly summary export.
Output: structured narrative covering MER, blended ROAS, nCAC, AOV, top 5 SKUs, one action item.

---

## Conventions

- All monetary values in USD unless a supplier's terms specify otherwise.
- Product copy leads with the customer benefit, not the product feature.
- Klaviyo segments are proper-cased exactly as they appear in the Klaviyo UI.
- Do not edit `products/archived/` — records are read-only.
- When updating a policy file, prepend a dated change note at the top of that file.
- Weekly dashboard files are named `YYYY-Www-performance.md` (e.g., `2026-W22-performance.md`).
```

---

## MCP servers

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "${SHOPIFY_ACCESS_TOKEN}",
        "SHOPIFY_SHOP_DOMAIN": "${SHOPIFY_SHOP_DOMAIN}"
      }
    },
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "${KLAVIYO_API_KEY}"
      }
    },
    "gorgias": {
      "command": "npx",
      "args": ["-y", "@gorgias/mcp-server"],
      "env": {
        "GORGIAS_DOMAIN": "${GORGIAS_DOMAIN}",
        "GORGIAS_API_KEY": "${GORGIAS_API_KEY}",
        "GORGIAS_API_EMAIL": "${GORGIAS_API_EMAIL}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/path/to/ecommerce-brand"
      ]
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

---

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_PATH\"; if [[ \"$FILE\" == */analytics/weekly-dashboard* || \"$FILE\" == */analytics/*performance* ]]; then echo \"[$(date +%Y-%m-%d)] Report written: $FILE\" >> .claude/report-log.txt; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_PATH\"; if [[ \"$FILE\" == */marketing/paid-ads/copy/* || \"$FILE\" == */marketing/email-sms/campaigns/* ]]; then echo \"[$(date +%Y-%m-%d)] Campaign asset written: $FILE\" >> .claude/campaign-log.txt; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_PATH\"; if [[ \"$FILE\" == */operations/cs-playbooks/* || \"$FILE\" == *escalation-matrix* ]]; then cp \"$FILE\" \"${FILE}.bak\" 2>/dev/null; echo \"[$(date +%Y-%m-%d)] Backup created: ${FILE}.bak\"; fi'"
          }
        ]
      }
    ]
  }
}
```

---

## Skills to install

```bash
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/klaviyo-campaign
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill operations/inventory-management
npx claudient add skill operations/customer-service-escalation
npx claudient add skill data-ml/weekly-performance-report
npx claudient add skill productivity/vendor-evaluator
```

---

## Related

- [Guide: Claude for E-commerce Operators](../guides/for-ecommerce-operator.md)
- [Workflow: New Product Launch](../workflows/new-product-launch.md)
- [Workflow: Weekly Performance Review](../workflows/weekly-performance-review.md)
- [Workflow: Inventory Reorder](../workflows/inventory-reorder.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
