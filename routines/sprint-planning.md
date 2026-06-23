# Sprint Planning Routine

Structured sprint planning — backlog grooming, story point estimation, and capacity-based sprint commitment.

---

## Schedule

First day of each sprint (typically Monday).

---

## Steps

1. **Review backlog.** List top-priority unstarted issues from project tracker (Linear, Jira, GitHub).
2. **Estimate effort.** Use story points (Fibonacci: 1, 2, 3, 5, 8) or T-shirt sizes (S, M, L, XL).
3. **Check capacity.** Available developer days = team size × sprint days - (meetings + PTO + buffer).
4. **Commit sprint.** Select stories until capacity is filled. Tag as "Sprint N".
5. **Break down tasks.** Each story gets sub-tasks (max 1 day each).
6. **Define done.** Explicit acceptance criteria for each committed story.

---

## Configuration

```yaml
schedule: "first Monday of sprint"
inputs:
  - backlog priority list
  - team availability
  - velocity history (last 3 sprints)
output: sprint-plan-N.md + committed issues
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
