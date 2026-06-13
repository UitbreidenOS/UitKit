# MCP: Shopify AI Toolkit

Manage a Shopify store from Claude Code — query products, orders, customers, analytics, and metafields without opening the dashboard.

## Why you need this

Store operations that normally require the Shopify admin UI or custom scripts — bulk product updates, order queries, analytics pulls, collection management — become single conversational requests. Claude can read real store data, act on it, and chain operations together: find low-inventory products → update descriptions → add to a sale collection, all in one session.

## Installation

```bash
npx -y @shopify/ai-toolkit-mcp
```

The package runs on demand via `npx` — no global install required.

## Configuration

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/ai-toolkit-mcp"],
      "env": {
        "SHOPIFY_STORE_URL": "your-store.myshopify.com",
        "SHOPIFY_ADMIN_TOKEN": "shpat_..."
      }
    }
  }
}
```

`SHOPIFY_STORE_URL` must be your `.myshopify.com` subdomain — not a custom domain. `SHOPIFY_ADMIN_TOKEN` is your custom app Admin API access token (see Authentication).

## Key tools

| Tool | What it does |
|---|---|
| `list_products` | Query products with filters (status, inventory, tags, vendor) |
| `get_product` | Full product detail including variants, metafields, and images |
| `create_product` | Create a new product with variants and pricing |
| `update_product` | Update title, description, price, tags, or status |
| `list_orders` | Query orders with filters (date range, value, fulfillment status) |
| `get_order` | Full order detail including line items, customer, and fulfillment |
| `list_customers` | Query customers by purchase history, tags, or location |
| `get_customer` | Customer profile including order history and lifetime value |
| `get_analytics` | Revenue, session, and conversion data by date range and breakdown |
| `list_collections` | List all smart and custom collections |
| `add_to_collection` | Add one or more products to a collection |
| `list_metafields` | List metafields on a product, variant, or customer |
| `update_metafield` | Write a metafield value |

## Usage examples

```
List all products with inventory below 5 units

Show me orders from the last 7 days over $200

Update the description for SKU SHIRT-BLK-L

Add all products tagged 'summer-sale' to the Summer Collection

What was revenue by product type last month?

Find customers who bought Product X but not Product Y

List all active discount codes and their usage counts
```

## Authentication

1. In your Shopify admin go to **Settings → Apps → Develop apps**
2. Click **Create an app** and give it a name (e.g., `claude-mcp`)
3. Under **Configuration → Admin API integration**, enable these access scopes:
   - `read_products`, `write_products`
   - `read_orders`
   - `read_customers`
   - `read_analytics`
4. Click **Install app** — Shopify generates the Admin API access token
5. Copy the token (shown once) and use it as `SHOPIFY_ADMIN_TOKEN`

For read-only analytics and reporting, omit `write_products` from the scope list.

## Tips

- Store URL must be the `.myshopify.com` domain — custom domains are not accepted in the env var.
- Standard plan rate limit: 2 requests/second. Shopify Plus: 4 requests/second. Bulk operations are handled automatically by the toolkit.
- Metafields are the most underused feature via MCP — Claude can read and write custom attributes on any resource, enabling CMS-style data management without a headless CMS.
- `get_analytics` returns data in the same structure as the Shopify Analytics API — specify `date_preset` (`today`, `last_7_days`, `last_30_days`) or an explicit date range.
- For large product catalogs, filter `list_products` by `status=active` and `vendor` to keep result sets manageable before chaining operations.

---
