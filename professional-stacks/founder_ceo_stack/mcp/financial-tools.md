# MCP: Financial Tools

## Purpose
Query, model, and analyze financial projections, unit economics, and cap table scenarios.

## Tools

### finance.calculate_runway
Calculate current runway and project burn-out date.
```
finance.calculate_runway({
  current_cash: number,
  monthly_burn: number,
  growth_rate: number (optional, default 0)
})
→ { runway_months, burnout_date, scenarios }
```

### finance.project_model
Build 12-24 month financial projection.
```
finance.project_model({
  current_revenue: number,
  current_burn: number,
  revenue_growth_percent: number,
  cost_growth_percent: number,
  months: 12 | 24
})
→ { month_by_month, breakeven_point, capital_required }
```

### finance.cap_table_calc
Equity and cap table modeling.
```
finance.cap_table_calc({
  founders_shares: number,
  series_amount: number,
  series_price_per_share: number,
  existing_vesting: object
})
→ { post_round_dilution, new_share_count, investor_equity }
```

## Configuration
```json
{
  "mcpServers": {
    "finance": {
      "command": "finance-server",
      "type": "stdio"
    }
  }
}
```

## Notes
- No external API required (local calculations)
- Used by financial-planning skill
- Outputs compatible with quarterly-review command

---
**Last Updated:** June 2026
