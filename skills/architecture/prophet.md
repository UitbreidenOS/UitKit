# The Prophet (Predictive Tech Debt Analyzer)

## When to activate
Activate when planning the next sprint or quarterly roadmap. Invoked via `/prophet`.

## When NOT to use
Do not use in brand new repositories with no git history.

## Instructions
1. **Analyze Git Churn:** Use `Bash` to run `git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -n 20`. This identifies the most frequently changed files in the repository.
2. **Analyze Complexity:** Read the top 5 most frequently changed files. Calculate their length and complexity.
3. **The Prediction:** Cross-reference high churn with high complexity. These are the "Hotspots"—files statistically guaranteed to cause future bugs because they change too often and are too hard to understand.
4. **The Recommendation:** Write a `TECH_DEBT_ROADMAP.md` report. Detail the top 3 hotspots and provide a concrete architectural plan to refactor or decouple them before they cause a production outage.

## Example
User: `/prophet What should we refactor next quarter?`
Claude: [Analyzes Git history]. The file `PaymentController.ts` has been modified 142 times in the last year and is 3,000 lines long. It is a massive hotspot. I predict this will cause an outage. I recommend extracting the Stripe webhooks into a separate microservice. Here is the roadmap.