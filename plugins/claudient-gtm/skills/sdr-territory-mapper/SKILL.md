---
name: "sdr-territory-mapper"
description: "SDR territory analysis: map account coverage, identify whitespace, prioritise by ICP density and trigger signal concentration, build territory plans and coverage reports"
---

# SDR Territory Mapper Skill

## When to activate
- Planning a new territory assignment for an SDR or AE
- Auditing your current territory for whitespace and untouched accounts
- Quarterly territory planning and headcount alignment
- Identifying which segments or geographies have the highest ICP density
- Presenting a territory plan to your manager or in a QBR
- Re-balancing territories after team changes or a market pivot

## When NOT to use
- Individual account research — use `/sdr-research-brief` for that
- Full RevOps forecasting — use `/revenue-operations` for pipeline metrics
- Customer segmentation for CS — different function and signals
- TAM/SAM/SOM for investor decks — use `/pitch-deck` for that

## Instructions

### Territory health check

```
Run a territory health check for [TERRITORY — e.g. "Mid-Market EMEA, 200-1000 employees, SaaS verticals"].

My product: [what you sell]
My ICP: [company size, industry, tech stack, role targeted]
Territory data available: [CRM export / Apollo list / LinkedIn Sales Navigator export / manual list]

[PASTE ACCOUNT LIST OR DATA]

Analyse:

## 1. Coverage summary
- Total accounts in territory: [N]
- Accounts contacted at least once: [N] ([%])
- Accounts never contacted: [N] — these are the whitespace
- Accounts in active sequence: [N]
- Accounts with open opportunities: [N]
- Accounts closed-won: [N]
- Accounts closed-lost: [N] → eligible for re-engagement in [X months]?

## 2. ICP density by segment
Break down accounts by:
- Company size bucket (50-200 / 200-500 / 500-1000 / 1000+)
- Industry vertical
- Geography (country/region)
Identify: which segment has the highest ICP density AND lowest coverage = priority whitespace

## 3. Trigger signal concentration
Which segment has the most accounts with active triggers right now?
(Funding, exec hires, product launches, hiring surges)
These are your highest-probability targets this month.

## 4. Priority account list
Top 25 accounts to focus on this quarter:
Ranked by: ICP score × trigger recency × contact accessibility
| Rank | Account | ICP Score | Trigger | Last Contact | Priority |
|---|---|---|---|---|---|

## 5. Territory gaps
- Segments you're underpenetrated in
- Industries with no coverage
- Geographies with accounts but no outreach
- Roles you haven't targeted (only emailing VP Sales but not CTO)

## 6. Recommended weekly cadence
Based on territory size and pipeline targets:
- Accounts to research per day: [N]
- New outreach to start per week: [N]
- Follow-ups per day: [N]
- Calls per day target: [N]
```

### ICP density mapping prompt

```
Map ICP density across my target market.

ICP definition:
- Industry: [list]
- Company size: [X-Y employees]
- Geography: [region/country]
- Tech stack signals: [tools that indicate fit]
- Roles to target: [titles]

Data source: [Apollo export / LinkedIn Sales Nav / CRM / manual]

[PASTE DATA]

Output:
1. Heat map by segment — where is ICP density highest?
2. Underserved segments — high ICP density, low existing coverage
3. Oversaturated segments — high competition, diminishing returns
4. Recommended: where to allocate 80% of outreach effort this quarter
```

### Whitespace identification prompt

```
Identify whitespace in my territory.

[PASTE CRM EXPORT OR ACCOUNT LIST]
[PASTE ACCOUNTS ALREADY TOUCHED IN LAST 6 MONTHS]

Whitespace = accounts that:
1. Match ICP criteria
2. Have NOT been contacted in the last 6 months
3. Have at least one active trigger signal (funding, hiring, exec hire)

Output:
- Total whitespace accounts: [N]
- Top 20 whitespace accounts ranked by ICP score + trigger recency
- How to approach: cold, warm (mutual connection), or research-first
```

### Territory plan document (for manager review)

```
Write a quarterly territory plan for Q[X] [YEAR].

Territory: [definition]
SDR/AE: [name]
Quota: [$ or meeting target]
Previous quarter performance: [attainment %]

Generate:

## Territory Overview
[1 paragraph — what the territory is and why it's a good market]

## ICP Analysis
[Which companies in territory are best fit and why]

## Top Accounts (Priority 1)
[Top 10 accounts — why each is a priority, trigger signal, contact strategy]

## Coverage Plan
[Weekly activity breakdown — research, new outreach, follow-ups, calls]

## Pipeline Projection
[Expected meetings booked, conversion to pipeline, projected revenue contribution]

## Resource Needs
[What support is needed — marketing campaigns, content, introductions, tools]

## Risks and Mitigations
[What could go wrong and the contingency]
```

### Account scoring model for territory prioritisation

```typescript
interface TerritoryAccount {
  company: string
  employees: number
  industry: string
  techStack: string[]
  lastContactedDaysAgo: number | null
  triggerSignals: TriggerSignal[]
  linkedInConnections: number // 2nd-degree connections
  crmStatus: 'never_contacted' | 'in_sequence' | 'opportunity' | 'closed_lost' | 'closed_won'
}

function scoreTerritoryAccount(account: TerritoryAccount, icp: ICPCriteria): number {
  let score = 0

  // ICP fit (50 points)
  score += scoreCompanySize(account.employees, icp.sizeRange) * 0.2    // max 20
  score += scoreIndustry(account.industry, icp.industries) * 0.15       // max 15
  score += scoreTechStack(account.techStack, icp.techStack) * 0.15     // max 15

  // Timing (30 points)
  const recentTriggers = account.triggerSignals.filter(t => t.recencyDays <= 90)
  score += Math.min(30, recentTriggers.length * 10)

  // Accessibility (10 points)
  score += Math.min(10, account.linkedInConnections * 2)

  // Contact recency penalty (10 points)
  if (account.lastContactedDaysAgo === null) {
    score += 10 // Never contacted — fresh territory = bonus
  } else if (account.lastContactedDaysAgo > 180) {
    score += 7  // Eligible for re-engagement
  } else if (account.lastContactedDaysAgo > 90) {
    score += 3
  } else {
    score -= 10 // Recently contacted — reduce priority
  }

  // CRM status adjustment
  if (account.crmStatus === 'closed_lost') score += 5  // Can re-engage
  if (account.crmStatus === 'closed_won') score -= 50  // Never cold outreach existing customers

  return Math.max(0, Math.min(100, score))
}

function buildTerritoryPriorityList(
  accounts: TerritoryAccount[],
  icp: ICPCriteria,
  topN: number = 25
): TerritoryAccount[] {
  return accounts
    .map(account => ({ account, score: scoreTerritoryAccount(account, icp) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ account }) => account)
}
```

### Re-engagement identification

```
Identify closed-lost accounts eligible for re-engagement.

[PASTE CRM EXPORT OR CLOSED-LOST LIST]

Re-engagement criteria:
- Lost the deal more than [90/180] days ago
- Lost reason is NOT: "never a fit" / "wrong company" / "opted out"
- Company has a new trigger signal since the deal closed
- OR: new decision-maker has joined since the deal closed

Output:
- Eligible accounts: [N]
- Top 10 re-engagement targets ranked by: new trigger strength + time since loss
- Suggested approach: [cold restart / warm email referencing history / new contact only]
- Subject line suggestion for re-engagement email
```

## Example

**User:** Territory planning Q3. I have EMEA mid-market SaaS, 200-1000 employees. My CRM export shows 847 accounts, only 312 have been contacted in the last 6 months. Help me prioritise.

**Output:**

**Coverage summary:**
- 847 total accounts | 312 touched (37%) | **535 whitespace accounts** (63%)
- Active sequences: 89 accounts
- Open opportunities: 23 accounts
- Closed-lost eligible for re-engagement: 67 accounts (lost 90+ days ago with new triggers)

**Priority breakdown:**
- Priority 1 (ICP score 80+, recent trigger): 48 accounts → 100% of outreach Week 1-2
- Priority 2 (ICP score 60-79, no trigger): 127 accounts → outreach Week 3-6
- Priority 3 (ICP score 40-59): 360 accounts → low-touch sequence only
- Deprioritise (<40 score): 312 accounts → exclude this quarter

**Whitespace hot zone:** UK-based FinTech (100-500 employees) — 34 uncontacted accounts with high ICP density, 12 with funding triggers in last 60 days. This is your Q3 sprint target.

**Weekly plan:**
- Mon-Tue: 8 new accounts researched + sequence started
- Wed-Thu: 15 follow-ups + 20 calls
- Fri: Pipeline review + next week prep
- Target: 12 new meetings booked / month → 36 meetings / quarter

---
