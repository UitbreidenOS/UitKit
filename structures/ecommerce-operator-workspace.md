# E-commerce Operator Workspace — Project Structure

> For DTC brand operators running a Shopify storefront who need Claude to handle daily listing optimization, campaign drafting, customer service templating, supplier communication, and performance reporting across the full stack.

## Stack

- Shopify (storefront, inventory, orders, metafields)
- Klaviyo (email + SMS flows, segments, campaigns)
- Meta Ads Manager + Google Ads (paid acquisition)
- Triple Whale or Northbeam (multi-touch attribution, MER, nCAC)
- Gorgias (support tickets, macros, CSAT)
- ShipBob or Flexport (3PL fulfillment, tracking, returns)
- QuickBooks Online (P&L, COGS, reconciliation)
- Slack (team comms, alert routing)

---

## Directory tree

```
ecommerce-workspace/
├── .claude/
│   ├── settings.json                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── listing-optimizer.md         # Rewrites a product title + description + SEO meta
│       ├── email-campaign.md            # Drafts Klaviyo campaign copy with subject variants
│       ├── ad-copy.md                   # Generates Meta and Google ad copy sets
│       ├── returns-policy.md            # Drafts or updates returns policy language
│       ├── supplier-update.md           # Generates supplier PO follow-up or reorder email
│       ├── weekly-performance.md        # Summarizes channel ROAS, CAC, and top SKUs
│       └── inventory-alert.md           # Flags SKUs below reorder threshold
├── CLAUDE.md                            # Workspace instructions (see template below)
├── products/
│   ├── active/
│   │   ├── sku-overview.csv             # Master SKU list with handle, title, price, cost, status
│   │   ├── descriptions/
│   │   │   ├── product-copy-template.md # Brand voice + structure for all PDPs
│   │   │   ├── seasonal-refresh-log.md  # What was updated and when, by SKU
│   │   │   └── [slug].md                # One file per product (e.g., cotton-tote-natural.md)
│   │   └── seo/
│   │       ├── meta-titles.csv          # Current title tag and proposed variants per product
│   │       ├── meta-descriptions.csv    # 155-char meta descriptions per product
│   │       └── keyword-targets.md       # Primary and secondary keyword map by collection
│   ├── drafts/
│   │   └── new-product-brief-template.md # Pre-launch checklist for new SKUs
│   └── archived/
│       └── discontinued-skus.csv        # Retired products with discontinuation reason
├── campaigns/
│   ├── email/
│   │   ├── briefs/
│   │   │   ├── campaign-brief-template.md   # Audience, goal, offer, CTA, send date
│   │   │   ├── 2026-q2-mothers-day.md
│   │   │   └── 2026-q3-back-to-school.md
│   │   ├── copy/
│   │   │   ├── welcome-series.md            # 3-email onboarding flow copy
│   │   │   ├── abandoned-cart.md            # 2-touch abandoned cart sequence
│   │   │   ├── post-purchase.md             # Review request + upsell flow
│   │   │   └── win-back-90d.md              # Win-back flow for 90-day lapsed buyers
│   │   └── results/
│   │       └── klaviyo-campaign-log.csv     # Campaign name, send date, OR, CTR, revenue
│   └── paid-ads/
│       ├── briefs/
│       │   ├── ad-brief-template.md         # Offer, audience, hook, CTA, budget, platform
│       │   ├── 2026-q2-prospecting-meta.md
│       │   └── 2026-q2-branded-search-gads.md
│       ├── copy/
│       │   ├── meta-primary-text.md         # Hook variants (5+) for Meta primary text
│       │   ├── meta-headlines.md            # Headline variants for Meta
│       │   ├── google-rsa-headlines.md      # 15 headlines for Google RSA
│       │   └── google-rsa-descriptions.md   # 4 descriptions for Google RSA
│       └── results/
│           └── attribution-notes.md         # Triple Whale / Northbeam anomalies and decisions
├── customer-service/
│   ├── templates/
│   │   ├── response-library.md          # 20+ macro drafts by ticket type
│   │   ├── where-is-my-order.md         # WISMO macro with tracking link placeholder
│   │   ├── damaged-item.md              # Damaged goods response + replacement flow
│   │   ├── wrong-item.md                # Wrong item received — resolution template
│   │   └── subscription-cancel.md       # Retention offer + cancellation acknowledgment
│   ├── policies/
│   │   ├── returns-policy.md            # Current customer-facing returns policy
│   │   ├── shipping-policy.md           # Carrier SLAs, international rules, cutoffs
│   │   └── refund-matrix.md             # Internal decision tree for edge cases
│   └── gorgias/
│       └── macro-import-template.csv    # Gorgias-format CSV for bulk macro upload
├── suppliers/
│   ├── vendor-directory.md              # Supplier name, contact, lead time, MOQ, terms
│   ├── po-template.md                   # Purchase order template with all required fields
│   ├── reorder-tracker.csv              # SKU, supplier, last PO date, next reorder date
│   └── comms/
│       ├── supplier-update-template.md  # Standard follow-up email template
│       └── [supplier-name]/
│           └── po-history.md            # Thread of POs and confirmations per supplier
├── reports/
│   ├── weekly/
│   │   ├── weekly-performance-template.md   # Blended ROAS, CAC, AOV, CR, top SKUs
│   │   └── 2026-w22-performance.md
│   ├── monthly/
│   │   ├── monthly-pl-template.md           # Revenue, COGS, gross margin, ad spend, net
│   │   ├── channel-performance-template.md  # Shopify vs. wholesale vs. Amazon by month
│   │   └── 2026-05-monthly.md
│   └── attribution/
│       └── triple-whale-export-notes.md     # How to read the exports, known discrepancies
└── sops/
    ├── new-product-launch.md            # End-to-end checklist: brief → listing → ads → email
    ├── inventory-reorder.md             # Trigger conditions, supplier contact, lead time buffer
    ├── returns-processing.md            # ShipBob returns workflow → restock or write-off
    ├── ad-account-audit.md              # Weekly paid media review checklist
    ├── klaviyo-health-check.md          # List hygiene, deliverability, flow audit cadence
    └── end-of-month-close.md            # QuickBooks reconciliation with Shopify payouts
```

---

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/listing-optimizer.md` | Slash command: takes a product handle or raw info and outputs rewritten title, description, and meta tags in brand voice |
| `.claude/commands/weekly-performance.md` | Slash command: accepts pasted Triple Whale or Northbeam summary and produces a structured narrative for stakeholders |
| `products/active/sku-overview.csv` | Source of truth for all live SKUs — feed this to Claude when running listing or inventory tasks |
| `campaigns/email/copy/welcome-series.md` | Drafted 3-email welcome flow — edit here, then paste into Klaviyo flow editor |
| `customer-service/policies/refund-matrix.md` | Internal decision tree Claude uses when generating edge-case macro responses |
| `suppliers/vendor-directory.md` | Supplier contacts and terms — Claude reads this before drafting any supplier communication |
| `reports/weekly/weekly-performance-template.md` | Structured template Claude fills out each Monday from pasted platform exports |
| `sops/new-product-launch.md` | The checklist Claude works through when a new SKU goes from brief to live |

---

## Quick scaffold

```bash
# Create the top-level workspace and all subdirectories
mkdir -p ecommerce-workspace/.claude/commands
mkdir -p ecommerce-workspace/products/active/descriptions
mkdir -p ecommerce-workspace/products/active/seo
mkdir -p ecommerce-workspace/products/drafts
mkdir -p ecommerce-workspace/products/archived
mkdir -p ecommerce-workspace/campaigns/email/briefs
mkdir -p ecommerce-workspace/campaigns/email/copy
mkdir -p ecommerce-workspace/campaigns/email/results
mkdir -p ecommerce-workspace/campaigns/paid-ads/briefs
mkdir -p ecommerce-workspace/campaigns/paid-ads/copy
mkdir -p ecommerce-workspace/campaigns/paid-ads/results
mkdir -p ecommerce-workspace/customer-service/templates
mkdir -p ecommerce-workspace/customer-service/policies
mkdir -p ecommerce-workspace/customer-service/gorgias
mkdir -p ecommerce-workspace/suppliers/comms
mkdir -p ecommerce-workspace/reports/weekly
mkdir -p ecommerce-workspace/reports/monthly
mkdir -p ecommerce-workspace/reports/attribution
mkdir -p ecommerce-workspace/sops

# Install Claudient skills
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/ecommerce-seller
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill small-business/returns-handler
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro

# Install Claudient slash commands into .claude/commands/
npx claudient add command listing-optimizer
npx claudient add command email-campaign
npx claudient add command ad-copy
npx claudient add command returns-policy
npx claudient add command supplier-update
npx claudient add command weekly-performance
npx claudient add command inventory-alert

# Create placeholder CLAUDE.md
touch ecommerce-workspace/CLAUDE.md

# Seed key CSV and template files
touch ecommerce-workspace/products/active/sku-overview.csv
touch ecommerce-workspace/suppliers/vendor-directory.md
touch ecommerce-workspace/suppliers/reorder-tracker.csv
```

---

## CLAUDE.md template

```markdown
# E-commerce Operator Workspace

This is a Claude Code workspace for operating a DTC brand on Shopify. Claude assists with
product listing optimization, campaign copy, customer service templating, supplier
communications, and weekly performance reporting. All tasks are operational — no application
code lives here.

---

## Stack

- Shopify — storefront, inventory, orders
- Klaviyo — email and SMS campaigns and flows
- Meta Ads Manager + Google Ads — paid acquisition
- Triple Whale (or Northbeam) — attribution, MER, blended ROAS
- Gorgias — customer support tickets and macros
- ShipBob (or Flexport) — 3PL fulfillment and returns
- QuickBooks Online — P&L, COGS, reconciliation

---

## Directory conventions

- `products/active/` — all live SKUs; edit descriptions here before pushing to Shopify
- `campaigns/` — briefs go in `briefs/`, finalized copy goes in `copy/`
- `customer-service/policies/` — source of truth for all customer-facing policy language
- `suppliers/comms/[supplier-name]/` — one folder per vendor for PO history
- `reports/weekly/` — one file per week named `YYYY-Www-performance.md`
- `sops/` — operational checklists Claude follows step-by-step

---

## Common tasks — exact commands

### Rewrite a product listing
/listing-optimizer
Paste the current Shopify product title, description, price, and target keywords.
Claude returns a rewritten title (≤70 chars), PDP description (benefit-led, 150-200 words),
and meta title + meta description ready to paste into Shopify.

### Draft an email campaign
/email-campaign
Provide: campaign goal, target Klaviyo segment, offer or hook, send date.
Claude returns 2 subject line variants (A/B), preview text, and full body copy.

### Generate ad copy
/ad-copy
Provide: platform (Meta or Google), campaign objective, product or offer, audience.
Meta output: 5 primary text hooks + 5 headlines. Google output: 15 RSA headlines + 4 descriptions.

### Update returns policy
/returns-policy
Describe the change needed (e.g., "extend return window from 30 to 45 days for holiday orders").
Claude rewrites the affected section and flags any downstream impact on the refund matrix.

### Draft a supplier email
/supplier-update
Provide: supplier name, PO number or product, the issue or request.
Claude pulls contact info from `suppliers/vendor-directory.md` and drafts a professional email.

### Generate weekly performance report
/weekly-performance
Paste your Triple Whale or Northbeam weekly summary export.
Claude returns a structured narrative covering blended ROAS, nCAC, MER, top 5 SKUs by revenue,
and one recommended action.

### Trigger an inventory alert
/inventory-alert
Paste the SKU list with current stock levels.
Claude flags any SKU below the reorder threshold in `suppliers/reorder-tracker.csv`
and drafts a reorder recommendation.

---

## Conventions

- Brand voice is [INSERT BRAND TONE: e.g., "direct, warm, never pushy"]. Apply to all copy.
- Product descriptions lead with the customer benefit, not the feature.
- All monetary figures in USD unless otherwise noted.
- Supplier emails are professional and concise — no filler language.
- Weekly reports follow the template in `reports/weekly/weekly-performance-template.md` exactly.
- Do not edit `products/archived/` — discontinued SKUs are read-only records.
- When a policy file changes, note the date and reason at the top of that file.
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
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/path/to/ecommerce-workspace"
      ]
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_OUTPUT_PATH\" == */reports/weekly/* ]]; then echo \"[hook] Weekly report written: $CLAUDE_TOOL_OUTPUT_PATH\" >> .claude/report-log.txt; fi'"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_PATH\" == */customer-service/policies/* ]]; then cp \"$CLAUDE_TOOL_INPUT_PATH\" \"${CLAUDE_TOOL_INPUT_PATH}.bak\" 2>/dev/null; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"Session ended at $(date)\" >> .claude/session-log.txt'"
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
npx claudient add skill small-business/ecommerce-seller
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill small-business/returns-handler
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
```

---

## Related

- [Guide: Claude for E-commerce Operators](../guides/for-ecommerce-operator.md)
- [Workflow: New Product Launch](../workflows/new-product-launch.md)
- [Workflow: Weekly Performance Review](../workflows/weekly-performance-review.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
