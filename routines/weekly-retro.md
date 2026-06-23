# Weekly Retrospective Routine

Automated weekly retrospective — gathers sprint metrics, summarizes team progress, and generates action items.

---

## Schedule

Every Friday at 4:00 PM (or end of sprint).

---

## Steps

1. **Gather metrics.** Count commits, PRs merged, issues closed, and bugs filed this week.
2. **Summarize progress.** What shipped? What's still in progress? What was blocked?
3. **Identify patterns.** Recurring blockers? Slow PR reviews? Flaky tests?
4. **Generate action items.** 2-3 concrete improvements for next week.
5. **Output format.** Markdown retrospective document saved to `retros/`.

---

## Configuration

```yaml
schedule: "every Friday 16:00"
inputs:
  - git log --since="last Monday"
  - closed PRs this week
  - resolved issues this week
output: retros/YYYY-MM-DD-retro.md
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
