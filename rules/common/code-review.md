# Code Review Rules

## Apply to
All pull request reviews — author and reviewer conduct.

## Rules

### As an Author

1. **Keep PRs small and focused** — one logical change per PR. A PR that touches auth, billing, and routing simultaneously is three PRs. Smaller PRs get better review, merge faster, and revert cleanly.

2. **Write the PR description for the reviewer, not for yourself** — explain what changed, why it changed, and what the risk is. Include a test plan. "Fixed bug" is not a description.

3. **Self-review before requesting review** — read your own diff as if you wrote none of it. Catch typos, debug artifacts, commented-out code, and missing edge cases before asking others.

4. **Respond to every comment** — acknowledge, resolve, or discuss. Silence signals disengagement. If you disagree, say so with reasoning. If you agree, apply the change and mark resolved.

5. **Annotate non-obvious choices** — if you did something surprising and the reason isn't captured in a code comment, explain it in the PR description or as a reply to the expected "why?" question.

### As a Reviewer

6. **Distinguish blockers from suggestions** — prefix comments clearly: `blocking:`, `nit:`, `question:`, `suggestion:`. Reviewers who mark everything as blocking slow down delivery. Reserve blocking for correctness and security.

7. **Review the intent, not just the lines** — does the change accomplish what the PR description claims? Are there edge cases the tests don't cover? Would you be comfortable owning this code?

8. **Suggest, don't dictate style** — style comments should reference a documented rule. "I would have done it this way" is not a blocking comment unless the rule exists. Style without a rule is preference.

9. **Approve when it's good enough, not perfect** — the cost of a blocked PR compounds. If remaining nits are minor and non-blocking, approve and let the author decide. Perfect is the enemy of shipped.

10. **Don't review stale PRs without acknowledging the rebase** — if a PR was rebased since your last review, note it and re-review the diff from scratch. Stale reviews create false confidence.

### Process

11. **First-pass review within one business day** — PRs rot. Context fades. Delayed reviews demotivate authors and block dependent work. Set team expectations and honor them.

12. **Avoid review-by-committee on every PR** — one required reviewer is usually enough. Multiple required approvers for every change creates bottlenecks. Reserve multi-reviewer requirements for high-risk paths (auth, payments, data migrations).

13. **Check automated signals before reviewing** — CI must pass before human review. If tests are failing or linting is broken, return the PR to the author. Don't review code the machine has already rejected.

14. **Don't approve what you don't understand** — "LGTM" on code you can't explain is a liability. Ask questions until you understand the change. A question is not a block.

15. **Document patterns worth repeating** — if a review surfaces a pattern that should be enforced broadly, don't fix it only in this PR. File a rule, add a lint, or update the coding guide.


---
