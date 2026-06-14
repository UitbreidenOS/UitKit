# Funnel Analyzer

Analyze the full AARRR funnel: Acquisition, Activation, Retention, Revenue, Referral.

## When to activate
User requests `/analyze-funnel` with product/company data or metrics.

## Instructions
1. Map current state: acquisition → activation → retention → revenue → referral
2. Identify drop-off stages (show % and user count per stage)
3. Prioritize top 3 bottlenecks by impact (% drop × user count)
4. For each bottleneck: hypothesis, test plan, success criteria
5. Estimate ROI per lever

## Example
Input: 10K signups → 2K activated (20%) → 400 L30 (20%) → 50 paying (12.5%) → 5 referrals (10%)

Output:
- Biggest drop: Signup → Activation (80% loss)
- Lever 1: Improve onboarding (hypothesis: friction in first task)
- Lever 2: Reduce feature bloat (hypothesis: users confused)
- Lever 3: Email nurture sequence (hypothesis: disengaged cohort)
