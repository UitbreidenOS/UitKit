# MCP: Meta Ads

Manage Facebook and Instagram ad campaigns from Claude Code — create campaigns, optimize audiences, analyze A/B tests, and act on performance data without opening Ads Manager.

## Why you need this

Ads Manager is built for human navigation, not programmatic analysis. Getting performance data out, finding underperforming ad sets, and making bulk changes all require repetitive UI work. The Meta MCP puts your full campaign tree — campaigns, ad sets, ads, audiences, and insights — into Claude's context so you can analyze and act in plain language.

## Installation

```bash
npx -y @meta/mcp-server-ads
```

Runs on demand via `npx` — no global install required.

## Configuration

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "@meta/mcp-server-ads"],
      "env": {
        "META_ACCESS_TOKEN": "your-system-user-token",
        "META_AD_ACCOUNT_ID": "act_XXXXXXXXX"
      }
    }
  }
}
```

`META_AD_ACCOUNT_ID` always starts with `act_`. Find it in Meta Business Manager under **Business Settings → Ad Accounts**.

## Key tools

| Tool | What it does |
|---|---|
| `list_campaigns` | List all campaigns with status, objective, and spend |
| `get_campaign` | Full campaign detail including budget, schedule, and performance |
| `create_campaign` | Create a new campaign with objective and budget |
| `update_campaign` | Update budget, status, schedule, or bid strategy |
| `list_ad_sets` | List ad sets with targeting, placement, and delivery status |
| `create_ad_set` | Create an ad set with audience and placement config |
| `list_ads` | List individual ads with creative previews and metrics |
| `create_ad` | Create an ad with creative and copy |
| `get_insights` | Pull performance metrics with breakdowns and date ranges |
| `list_audiences` | List saved, custom, and lookalike audiences |
| `create_custom_audience` | Build a custom audience from a customer list or pixel events |
| `create_lookalike_audience` | Generate a lookalike from a seed audience |
| `get_ab_test_results` | Retrieve A/B test statistical results and winning variant |

## Usage examples

```
Show all active campaigns with spend vs budget for this month

Which ad creative had the best CTR this week?

Create a lookalike audience from our top 5% purchasers

Pause all ad sets with CPA above $40

Compare performance of the two variants in A/B test #12345

Get a breakdown of spend by age group and placement for the retargeting campaign

Which campaigns are underpacing relative to their daily budget?
```

## Authentication

1. In Meta Business Manager go to **Business Settings → System Users**
2. Create a new system user (or use an existing admin system user)
3. Click **Generate New Token** and select the ad account you want to manage
4. Enable these permissions: `ads_management`, `ads_read`, `business_management`
5. Copy the token and set it as `META_ACCESS_TOKEN`
6. Find your Ad Account ID under **Business Settings → Ad Accounts** — it starts with `act_`

System user tokens do not expire on a 60-day cycle like user tokens — use them for persistent MCP access.

## Tips

- Use `get_insights` with `breakdowns=["age","placement","device"]` for granular performance segmentation in a single call.
- System user tokens carry higher rate limits than personal user tokens and do not expire — always prefer them for API access.
- Always specify `date_preset` or an explicit `time_range` on insights calls — the default lookback window is only 7 days and may not surface trends.
- Meta Ads MCP launched April 2026 as part of Meta's official developer MCP program.
- `create_lookalike_audience` requires a seed audience of at least 100 people. Lookalikes take 1-2 hours to populate before they can be used in ad sets.
- To avoid overspending during testing, set `status=PAUSED` when creating campaigns via MCP — enable them manually after reviewing the setup.

---
