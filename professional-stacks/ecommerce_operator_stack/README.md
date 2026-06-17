# E-commerce Operator Stack

> Autonomous e-commerce operations — inventory, pricing, fulfillment, and order management with real-time monitoring and escalation.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project root.
2. **Configure MCP servers** — Add Shopify, WooCommerce, or native e-commerce platform APIs in `settings.json`.
3. **Add hooks** — Copy each `.sh` script from `hooks/` into `.claude/hooks/`, make them executable, and add settings.json entries.
4. **Run `/inventory-check [sku]`** — Check stock levels and reorder status before any operations.
5. **Run `/daily-ops-report`** — Generate orders, fulfillment, and inventory summary.
6. **Run `/pricing-optimizer`** — Analyze and recommend dynamic pricing adjustments.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, operational thresholds, SKU tiers, escalation rules, and approval gates. Start here. |
| `session-log.md` | Log | Auto-updated: inventory transactions, orders processed, pricing changes, escalations. |
| `skills/` | Directory | 8 reusable e-commerce skills — inventory, pricing, fulfillment, analytics. |
| `commands/` | Directory | 4 slash commands for daily operations workflow. |
| `hooks/` | Directory | 3 hooks enforcing inventory constraints, pricing rules, and audit logging. |
| `mcp/` | Directory | Platform-specific API configs (Shopify, WooCommerce, custom). |

---

## Skills (8)

| Skill | Trigger | Tools | Purpose |
|---|---|---|---|
| `inventory-manager` | /inventory-check | Read, WebFetch | Real-time stock levels; reorder alerts; dead stock flagging |
| `pricing-optimizer` | /pricing-optimizer | Read, Write | A/B-tested pricing; margin protection; competitive benchmarking |
| `order-processor` | /process-orders | Read, Write | Bulk order ingestion; validation; fulfillment routing |
| `fulfillment-tracker` | /daily-ops-report | Read | Status of pending shipments; carrier integration; delivery ETAs |
| `analytics-reporter` | /daily-ops-report | Read, Write | Sales, AOV, conversion, inventory turnover; trend analysis |
| `refund-handler` | On customer request | Read, Write | Refund eligibility check; payment reversal; inventory recovery |
| `dynamic-pricing-engine` | Scheduled or manual | Read, Write | Margin-aware pricing; velocity-based adjustments; competitor monitoring |
| `alert-escalator` | On threshold breach | Read, Write | Stock-out warnings; pricing anomalies; delivery delays to ops team |

---

## Commands (4)

| Command | What It Does |
|---|---|
| `/inventory-check` | Real-time stock levels, reorder points, and dead stock alerts for a SKU or category |
| `/daily-ops-report` | Orders, fulfillment status, inventory turnover, and anomaly summary |
| `/pricing-optimizer` | Analyze current pricing; recommend adjustments based on margin, velocity, and competition |
| `/process-orders` | Validate and route pending orders to fulfillment; flag exceptions |

---

## Hooks (3)

| Hook | Event | What It Enforces |
|---|---|---|
| `inventory-guardian` | PreToolUse | Prevents overselling; blocks orders when stock <reorder threshold |
| `pricing-ceiling` | PostToolUse | Enforces margin floor; prevents discounts below cost + 10% |
| `ops-audit-logger` | Stop | Immutable audit trail of all inventory, order, and pricing changes |

---

## MCP Setup

### Shopify

Get API credentials from your Shopify admin. Add to `settings.json`:

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "shopify-mcp"],
      "env": { 
        "SHOPIFY_STORE_NAME": "your-store.myshopify.com",
        "SHOPIFY_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

### WooCommerce

Get REST API credentials from WordPress admin. Add to `settings.json`:

```json
{
  "mcpServers": {
    "woocommerce": {
      "command": "npx",
      "args": ["-y", "woocommerce-mcp"],
      "env": {
        "WOOCOMMERCE_STORE_URL": "https://your-store.com",
        "WOOCOMMERCE_API_KEY": "your-key-here",
        "WOOCOMMERCE_API_SECRET": "your-secret-here"
      }
    }
  }
}
```

---

## How It Works

### 1. Monitor Inventory
Real-time stock checks trigger reorder alerts when levels fall below configured thresholds. Dead stock is flagged automatically for clearance or discontinuation.

### 2. Process Orders
Incoming orders are validated, routed to fulfillment based on warehouse location and inventory availability, and tracked end-to-end.

### 3. Optimize Pricing
Pricing engine monitors margin, velocity, and competitor pricing. Recommendations are generated daily and staged for approval before deployment.

### 4. Track Fulfillment
Shipments are monitored via carrier integrations. Delivery delays or exceptions trigger escalations to ops.

### 5. Handle Exceptions
Refunds, cancellations, and adjustments are processed with automatic inventory recovery and audit logging.

---

## Success Metrics

- **Inventory turnover:** Target >4x annually (varies by category)
- **Order fulfillment SLA:** Target >95% same-day or next-day processing
- **Refund rate:** Target <2% of total revenue
- **Pricing margin:** Maintain target margins; block discounts below floor
- **Dead stock:** <5% of total inventory value
- **Audit completeness:** 100% of transactions logged and reversible

---

## Key Constraints

- **Overselling prevention:** No orders accepted when inventory <reorder threshold.
- **Pricing floor:** Automatic block on discounts below cost + 10%.
- **Approval gates:** All pricing changes flagged for human review before live deployment.
- **Refund policy:** Customer-initiated refunds within 30 days; partial refunds flagged for manual review.
- **Inventory hold:** Confirmed orders reserve inventory immediately; cancelled orders release hold within 5 min.

---

**8 skills · 4 commands · 3 hooks · 2+ MCP servers · Full audit trail**

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/Claudients/Claudient) · [Claude Code](https://claude.com/claude-code)
