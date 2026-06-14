# Portfolio Monitor Skill

## When to activate

Monthly review of portfolio company signals. Can be triggered on demand with `/portfolio-check` or auto-scheduled via hook.

## When NOT to use

- Exited or dissolved companies (archive)
- Companies requesting no contact or relationship inactive

## Instructions

1. For each portfolio company:
   - Track funding announcements (new rounds, acquisitions, secondary sales)
   - Key hires (CEO, CRO, CTO, board additions)
   - Product launches or major updates (new features, market entry, APIs)
   - Sector signals (regulation, competitor activity, market shifts)
   - Customer wins or losses (if public or signaled)
2. Gather data via:
   - Crunchbase feed (funding, hiring, updates)
   - Company news (press releases, blog posts)
   - LinkedIn signals (new team members)
   - Exa semantic search (industry mentions, news)
3. For each signal, classify:
   - Type: Positive (growth, hiring, funding), Neutral (update), Negative (departures, market shift)
   - Impact: High (funding, exec departure, market disruption), Medium (new hire, feature), Low (blog post, event)
4. Highlight:
   - Companies needing follow-up conversations (raised new round, hiring for key role)
   - Risk flags (exec departures, declining signals, market headwinds)
   - Wins to celebrate (acquisition, milestone, key customer)
5. Output: Portfolio signal summary with company-by-company breakdown, risk alerts, and follow-up recommendations

## Example

**Input:** Monthly portfolio monitoring for 12 companies

**Output:**

**Portfolio Signal Summary — June 2026**

| Company | Signal | Type | Impact | Action |
|---|---|---|---|---|
| XYZ Fintech | Series C funding close ($20M) | Positive | High | Schedule follow-up for expansion strategy |
| ABC SaaS | Chief Revenue Officer hire from Salesforce | Positive | Medium | Introduce to CRO network, discuss GTM plans |
| DEF Climate | Expanded to Asia-Pacific market | Positive | Medium | Monitor region performance |
| GHI Martech | Competitor acquired for $100M+ (acquired by marketing platform) | Negative | High | Schedule call to understand market consolidation impact |
| JKL DevTools | Co-founder departure (CTO leaving for other ventures) | Negative | High | Assess CEO confidence in transition, offer support |
| MNO Data | No signals this month | Neutral | Low | Continue monitoring |

**Risk Alerts:**
- **GHI Martech:** Competitive acquisition may impact roadmap and investor confidence. Recommend check-in call within 1 week.
- **JKL DevTools:** CTO departure is operational risk. CEO has replacement plan; monitor for execution.

**Follow-up Recommendations:**
1. Schedule expansion strategy call with XYZ Fintech CFO
2. Make CRO introduction (ABC SaaS hiring executive)
3. Risk assessment call with JKL DevTools CEO
