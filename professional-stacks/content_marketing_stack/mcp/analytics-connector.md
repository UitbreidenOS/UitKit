# Analytics Connector MCP

Multi-source analytics integration for GA4, HubSpot, Stripe, and customer data APIs.

## Tools

- `analytics.fetch_metrics` — Pull GA4 metrics for date range
- `analytics.get_conversion_funnel` — Retrieve conversion data by stage
- `hubspot.list_contacts` — Query HubSpot CRM contacts
- `stripe.get_revenue` — Fetch revenue and MRR data
- `analytics.calculate_ltv` — Compute customer lifetime value

## Configuration

```json
{
  "mcp": {
    "analytics": {
      "ga4_property_id": "${GA4_PROPERTY_ID}",
      "hubspot_api_key": "${HUBSPOT_API_KEY}",
      "stripe_api_key": "${STRIPE_API_KEY}"
    }
  }
}
```

## Usage Example

```
Pull GA4 traffic and conversion data for past 30 days, compare to previous period
```
