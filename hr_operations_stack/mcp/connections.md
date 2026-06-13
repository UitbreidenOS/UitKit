# MCP: Connections (HRIS & ATS Integration)

## What This MCP Does
Connects to HRIS (human resources information systems) and ATS (applicant tracking systems) to pull real-time employee data, hiring pipelines, and compensation records. Enables live queries without manual data export/import.

## Supported Systems

**HRIS Platforms:**
- Workday
- SuccessFactors
- BambooHR
- Lattice
- 15Five
- Paychex
- ADP

**ATS Platforms:**
- Greenhouse
- Lever
- Ashby
- Workable
- iCIMS
- Taleo

## When to Use

- **Live headcount queries:** "How many engineers in NYC with tenure >2 years?"
- **Hiring pipeline:** "Show me all candidates in offer stage for Q3 roles"
- **Compensation review:** Pull current salary data directly from HRIS
- **Performance data:** Query eNPS, engagement scores, recent review ratings
- **Retention tracking:** Monitor voluntary/involuntary separations in real-time

## Setup

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "connections": {
      "command": "npx",
      "args": ["@hris-ats/mcp"],
      "env": {
        "HRIS_API_KEY": "your-hris-key",
        "ATS_API_KEY": "your-ats-key",
        "HRIS_PROVIDER": "workday|successfactors|bamboohr|lattice",
        "ATS_PROVIDER": "greenhouse|lever|ashby|workable"
      }
    }
  }
}
```

Get API keys from your HRIS/ATS admin or settings portal.

## Typical Queries

**Headcount Analysis:**
```
"How many employees by department? Show tenure distribution."
→ Returns: headcount by dept, avg tenure, distribution of tenure cohorts
```

**Hiring Pipeline:**
```
"Show all candidates in offer stage or interview stage for Engineering roles."
→ Returns: candidate name, role, stage, days in pipeline, hiring manager
```

**Compensation Review:**
```
"List all Senior Software Engineers in San Francisco with their current salary and last merit increase date."
→ Returns: name, current salary, last adjustment date, benchmark position
```

**Retention Risk:**
```
"Show employees with engagement score <4.0, eNPS <0, or tenure >2 years without promotion."
→ Returns: name, engagement score, role, manager, time since last promotion
```

---
