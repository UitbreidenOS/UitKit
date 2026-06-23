# Code Review Rotation Routine

Ensures PRs get timely reviews, tracks review load balance, and flags stale PRs.

---

## Schedule

Daily at 9:00 AM.

---

## Steps

1. **List open PRs.** Find all PRs awaiting review (not draft, not self-approved).
2. **Check age.** Flag PRs open >48 hours as stale.
3. **Assign reviewers.** Round-robin based on team roster, skip author and recently assigned.
4. **Notify.** Post summary in team Slack channel or add review request comments.
5. **Track metrics.** Average time to first review, review load per developer.

---

## Configuration

```yaml
schedule: "daily 09:00"
inputs:
  - open PRs (GitHub API)
  - team roster
  - review history
output:
  - stale PR warnings
  - review assignments
  - weekly review stats
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
