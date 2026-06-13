# MCP: Stripe

Query Stripe data, manage customers, products, and subscriptions directly from Claude Code — without switching to the Stripe dashboard or writing one-off scripts.

## Why you need this

Stripe holds the business-critical data layer: who's paying, what they're paying for, and whether payments are succeeding. Without MCP, accessing it means context-switching to a dashboard or writing throwaway scripts. With Stripe MCP:
- Revenue queries, churn analysis, and payment failure investigations run inside the coding session
- Product and pricing changes happen without leaving the terminal
- Claude can correlate code changes against real billing data — catching mismatches before they reach production
- Routine support tasks (looking up customers, checking subscription state) take seconds instead of minutes

## Installation

```bash
npm install -g @stripe/mcp
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your-restricted-key-here"
      }
    }
  }
}
```

Use a restricted key scoped to only the resources your workflow touches. Never use `sk_live_` in development config.

## Key tools / What it does

- `list_customers` — list customers with optional filters (email, created date range, metadata)
- `get_customer` — retrieve a single customer with full profile and metadata
- `create_customer` — create a new customer with name, email, and metadata
- `list_products` — list all products with their active/inactive status
- `create_product` — create a new product with name, description, and metadata
- `list_prices` — list prices for a product or across all products
- `create_price` — create a new price (recurring or one-time) for a product
- `list_subscriptions` — list subscriptions with filters (customer, status, price)
- `get_subscription` — retrieve a subscription with current period, status, and items
- `create_payment_link` — generate a hosted payment link for a product/price
- `list_invoices` — list invoices with filters (customer, status, date range)
- `retrieve_balance` — get current Stripe account balance (available and pending)
- `list_charges` — list charges with filters (customer, outcome, date range)
- `list_payment_intents` — list payment intents with status filters (failed, succeeded, processing)

## Usage examples

```
Show me all customers who churned in the last 30 days —
subscriptions that moved to canceled status. Include their email,
plan name, and how long they were subscribed.
```

```
Create a new product called "Pro Plan" and add a recurring monthly
price of $49 and an annual price of $490. Return the price IDs
so I can update the frontend config.
```

```
List all failed payment intents from the past 24 hours,
group them by failure reason, and summarize the top 3 causes.
```

```
Generate a revenue summary for Q1 2026 — total MRR, new subscriptions,
churned subscriptions, and net revenue change month over month.
```

```
Find all customers currently on the "Starter" plan and list their
emails, subscription start dates, and monthly spend. I need this
for a plan migration campaign.
```

## Authentication

1. Go to **dashboard.stripe.com → Developers → API keys**
2. Click **Create restricted key** (not the full secret key)
3. Name it (e.g., `claude-code-readonly`) and grant only the permissions your workflow needs:
   - For read-only analysis: **Read** on Customers, Products, Prices, Subscriptions, Invoices, Payment Intents, Charges, Balance
   - For product/price creation: add **Write** on Products and Prices
4. Copy the key (starts with `sk_test_` for test mode, `sk_live_` for production)
5. Set it as `STRIPE_SECRET_KEY` in the config above

Always use test mode keys (`sk_test_`) in development and local config files. Only use live keys in production deployments with environment variables injected at runtime — never in committed config.

## Tips

**Restricted keys over full secret keys:** A restricted key limits blast radius if the key is exposed. Scope it to the minimum permissions your workflow actually uses, and never grant write access unless you need to create or modify data.

**Test vs live mode:** Keys beginning with `sk_test_` operate against your test data. Keys beginning with `sk_live_` touch real customer data and real money. Keep these strictly separated — use test keys in all local and CI config.

**Pagination on list endpoints:** Most list endpoints return a maximum of 100 items per call. For large datasets, use the `limit` parameter and `starting_after` with the last item's ID to page through results. Claude will handle this automatically if you ask for "all" results.

**Webhook verification is out of scope:** MCP cannot verify webhook signatures — use the Stripe CLI (`stripe listen`) or the dashboard for webhook testing. MCP is for querying and managing data, not handling incoming events.

**Metadata fields are queryable:** If your application writes structured metadata to customers or subscriptions (e.g., `plan_tier`, `internal_user_id`), those fields are filterable in `list_customers` and `list_subscriptions` — useful for targeted queries.

---
