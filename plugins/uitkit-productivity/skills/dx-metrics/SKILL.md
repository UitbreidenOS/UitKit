---
name: "dx-metrics"
description: "Define and track developer experience metrics across Claude Code skills — success rate, invocations, time saved, adoption tier"
---

# DX Metrics Skill

## When to activate

- You need to calculate DX metrics from raw usage logs (`.claude/usage-log.jsonl`)
- Generating a monthly DX scorecard (`.claude/dx-scorecard.json`)
- Analyzing adoption trends for a specific skill or cohort
- Creating summary statistics for team reporting
- Identifying high-error or abandoned skills
- Benchmarking skill effectiveness (invocations vs. time saved)
- Building time-series trend data for dashboards

## When NOT to use

- Collecting raw usage data (use PostToolUse hook + usage-tracker instead)
- Analyzing a single session (use session-log.md instead)
- Debugging a specific tool failure (use code-review or audit-logger)
- Real-time monitoring (this is batch/periodic analysis)
- Privacy analysis or PII review (use audit-logger or security-review)

## Instructions

### Setup

1. Ensure `.claude/usage-log.jsonl` exists and contains PostToolUse hook output:

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true
}
```

2. Create metric calculation script (or use provided Python module):

```bash
python3 << 'PYTHON_EOF'
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict

# Configuration
METRICS_OUTPUT = Path.cwd() / ".claude" / "dx-scorecard.json"
USAGE_LOG = Path.cwd() / ".claude" / "usage-log.jsonl"
HISTORY_LOG = Path.cwd() / ".claude" / "dx-scorecard-history.jsonl"

class DXMetricsCalculator:
    def __init__(self, usage_log_path):
        self.usage_log = usage_log_path
        self.metrics_by_skill = defaultdict(lambda: {
            "invocations": 0,
            "successes": 0,
            "durations_ms": [],
            "users": set(),
            "errors": [],
            "last_invoked": None
        })
    
    def load_usage_logs(self):
        """Parse JSONL usage log into memory."""
        if not self.usage_log.exists():
            print(f"❌ Usage log not found: {self.usage_log}", file=sys.stderr)
            return False
        
        with open(self.usage_log) as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    entry = json.loads(line)
                    skill = entry.get("skill_name", "unknown")
                    self.metrics_by_skill[skill]["invocations"] += 1
                    
                    if entry.get("success", False):
                        self.metrics_by_skill[skill]["successes"] += 1
                    else:
                        self.metrics_by_skill[skill]["errors"].append({
                            "timestamp": entry.get("timestamp"),
                            "exit_code": entry.get("exit_code")
                        })
                    
                    self.metrics_by_skill[skill]["durations_ms"].append(
                        entry.get("duration_ms", 0)
                    )
                    self.metrics_by_skill[skill]["users"].add(entry.get("user_id"))
                    
                    ts = entry.get("timestamp")
                    if ts and (not self.metrics_by_skill[skill]["last_invoked"] or
                              ts > self.metrics_by_skill[skill]["last_invoked"]):
                        self.metrics_by_skill[skill]["last_invoked"] = ts
                
                except json.JSONDecodeError as e:
                    print(f"⚠️ Skipping malformed line: {line[:50]}", file=sys.stderr)
        
        return True
    
    def calculate_metrics(self):
        """Compute all DX metrics."""
        result = {
            "period_start": self._get_period_start(),
            "period_end": datetime.utcnow().isoformat() + "Z",
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "metrics": {},
            "summary": self._compute_summary()
        }
        
        for skill_name, data in sorted(self.metrics_by_skill.items()):
            result["metrics"][skill_name] = self._compute_skill_metrics(
                skill_name, data
            )
        
        return result
    
    def _compute_skill_metrics(self, skill_name, data):
        """Calculate metrics for a single skill."""
        invocations = data["invocations"]
        successes = data["successes"]
        durations = data["durations_ms"]
        
        success_rate = (successes / invocations * 100) if invocations > 0 else 0
        error_rate = 100 - success_rate
        avg_duration_ms = sum(durations) / len(durations) if durations else 0
        user_count = len(data["users"])
        
        adoption_tier = self._adoption_tier(invocations)
        
        # Estimate time saved (heuristic: avg_duration_sec * invocations)
        # Adjust multiplier based on skill type
        avg_duration_sec = avg_duration_ms / 1000
        time_saved_min = (avg_duration_sec * invocations * 2) / 60  # 2x multiplier (human would be slower)
        
        friction_index = error_rate + (100 - success_rate)
        
        return {
            "invocations": invocations,
            "success_rate": round(success_rate, 1),
            "error_rate": round(error_rate, 1),
            "avg_duration_sec": round(avg_duration_sec, 1),
            "avg_duration_ms": round(avg_duration_ms, 0),
            "user_count": user_count,
            "adoption_tier": adoption_tier,
            "time_saved_min": round(time_saved_min, 0),
            "friction_index": round(friction_index, 1),
            "last_invoked": data["last_invoked"],
            "errors": len(data["errors"]),
            "error_samples": data["errors"][:3]  # First 3 errors for debugging
        }
    
    def _adoption_tier(self, invocations):
        """Classify adoption level."""
        if invocations < 5:
            return "abandoned"
        elif invocations < 50:
            return "low"
        elif invocations < 500:
            return "active"
        else:
            return "core"
    
    def _compute_summary(self):
        """Aggregate org-level metrics."""
        all_users = set()
        total_time_saved = 0
        total_invocations = 0
        scores = []
        
        for skill_data in self.metrics_by_skill.values():
            all_users.update(skill_data["users"])
            total_invocations += skill_data["invocations"]
        
        # Will be populated after skill metrics computed
        for skill_metrics in self._compute_all_metrics():
            total_time_saved += skill_metrics.get("time_saved_min", 0)
            scores.append(self._dx_score(skill_metrics))
        
        avg_dx_score = sum(scores) / len(scores) if scores else 0
        
        # Find bottlenecks
        critical_issues = []
        high_issues = []
        
        for skill_name, metrics in self._compute_all_metrics():
            if metrics["error_rate"] > 20:
                critical_issues.append(f"{skill_name}: {metrics['error_rate']}% errors")
            elif metrics["error_rate"] > 10:
                high_issues.append(f"{skill_name}: {metrics['error_rate']}% errors")
        
        return {
            "total_users": len(all_users),
            "total_invocations": total_invocations,
            "total_time_saved_hours": round(total_time_saved / 60, 1),
            "avg_dx_score": round(avg_dx_score, 1),
            "avg_friction_index": round(self._avg_friction_index(), 1),
            "skills_count": len(self.metrics_by_skill),
            "adoption_breakdown": self._adoption_breakdown(),
            "critical_issues": critical_issues,
            "high_issues": high_issues,
            "top_skills": self._top_skills(3),
            "lowest_adoption": self._lowest_adoption(3)
        }
    
    def _compute_all_metrics(self):
        """Generator for all skill metrics (called after load_usage_logs)."""
        for skill_name, data in sorted(self.metrics_by_skill.items()):
            yield skill_name, self._compute_skill_metrics(skill_name, data)
    
    def _dx_score(self, metrics):
        """Compute DX health score (0–100)."""
        return (
            (metrics["success_rate"] * 0.4) +
            (self._adoption_score(metrics["adoption_tier"]) * 0.3) +
            (min(100, (metrics["time_saved_min"] / 10)) * 0.3)
        )
    
    def _adoption_score(self, tier):
        """Convert tier to score."""
        return {"abandoned": 0, "low": 50, "active": 85, "core": 100}.get(tier, 50)
    
    def _avg_friction_index(self):
        """Average friction across all skills."""
        indices = [m["friction_index"] for m in self._compute_all_metrics()]
        return sum(indices) / len(indices) if indices else 0
    
    def _adoption_breakdown(self):
        """Count by adoption tier."""
        breakdown = {"abandoned": 0, "low": 0, "active": 0, "core": 0}
        for skill_data in self.metrics_by_skill.values():
            tier = self._adoption_tier(skill_data["invocations"])
            breakdown[tier] += 1
        return breakdown
    
    def _top_skills(self, n):
        """Top N skills by invocation count."""
        return sorted(
            [(name, data["invocations"]) for name, data in self.metrics_by_skill.items()],
            key=lambda x: x[1],
            reverse=True
        )[:n]
    
    def _lowest_adoption(self, n):
        """Lowest N adoption skills."""
        return sorted(
            [(name, data["invocations"]) for name, data in self.metrics_by_skill.items()],
            key=lambda x: x[1]
        )[:n]
    
    def _get_period_start(self):
        """Default period start: 30 days ago."""
        start = datetime.utcnow() - timedelta(days=30)
        return start.isoformat() + "Z"

# Run calculation
calculator = DXMetricsCalculator(USAGE_LOG)
if calculator.load_usage_logs():
    metrics = calculator.calculate_metrics()
    
    # Write metrics file
    METRICS_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_OUTPUT, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"✅ Metrics written to {METRICS_OUTPUT}")
    print(json.dumps(metrics["summary"], indent=2))
    
    # Append to history for trend analysis
    HISTORY_LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORY_LOG, "a") as f:
        f.write(json.dumps(metrics) + "\n")
    print(f"✅ History appended to {HISTORY_LOG}")
else:
    sys.exit(1)

PYTHON_EOF
```

### Usage

**Interactive**: Invoke the skill to compute metrics:

```bash
# From Claude Code session
/dx-metrics
```

**Scripted**: Add to `.claude/hooks/` for automated monthly runs:

```bash
# In .claude/settings.json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "day-of-month == 1 && hour == 9",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/calculate-dx-metrics.sh"
          }
        ]
      }
    ]
  }
}
```

### Metric Definitions

| Metric | Formula | Notes |
|---|---|---|
| **invocations** | COUNT(*) | Total skill calls in period |
| **success_rate** | (successes / invocations * 100) | 0–100% |
| **error_rate** | 100 - success_rate | % of failed calls |
| **avg_duration_sec** | SUM(duration_ms) / COUNT(*) / 1000 | Seconds per invocation |
| **user_count** | COUNT(DISTINCT user_id) | Unique users |
| **adoption_tier** | CASE invocations < 5 'abandoned' ... 'core' END | Category |
| **time_saved_min** | avg_duration_sec * invocations * 2 / 60 | Estimated minutes saved (2x multiplier for human speed) |
| **friction_index** | error_rate + (100 - success_rate) | 0–200: lower is better |
| **dx_score** | (success_rate * 0.4) + (adoption_score * 0.3) + (time_saved * 0.3) | 0–100: overall health |

### Output Format

`.claude/dx-scorecard.json`:

```json
{
  "period_start": "2026-05-15T00:00:00Z",
  "period_end": "2026-06-15T00:00:00Z",
  "generated_at": "2026-06-15T14:32:00Z",
  "metrics": {
    "code-review": {
      "invocations": 127,
      "success_rate": 96.9,
      "error_rate": 3.1,
      "avg_duration_sec": 14.2,
      "avg_duration_ms": 14200,
      "user_count": 18,
      "adoption_tier": "active",
      "time_saved_min": 1589,
      "friction_index": 3.1,
      "last_invoked": "2026-06-15T14:32:15Z",
      "errors": 4,
      "error_samples": [
        {"timestamp": "2026-06-14T10:15:00Z", "exit_code": 1}
      ]
    },
    "deep-research": {...}
  },
  "summary": {
    "total_users": 22,
    "total_invocations": 412,
    "total_time_saved_hours": 28.2,
    "avg_dx_score": 81.4,
    "avg_friction_index": 12.3,
    "skills_count": 12,
    "adoption_breakdown": {"abandoned": 2, "low": 3, "active": 5, "core": 2},
    "critical_issues": ["deep-research: 25% errors"],
    "high_issues": [],
    "top_skills": [["code-review", 127], ["simplify", 84]],
    "lowest_adoption": [["validate-sql", 2], ["generate-tests", 4]]
  }
}
```

### Advanced Usage

**Filter by date range**:

```python
# In the calculator, add before load_usage_logs():
self.start_date = datetime.fromisoformat("2026-06-01T00:00:00Z")
self.end_date = datetime.fromisoformat("2026-06-30T23:59:59Z")

# In load_usage_logs(), add filter:
entry_ts = datetime.fromisoformat(entry["timestamp"])
if not (self.start_date <= entry_ts <= self.end_date):
    continue
```

**Compare periods** (YoY, MoM):

```bash
# Extract metrics for June 2025 and June 2026
jq 'select(.period_start | startswith("2025-06"))' .claude/dx-scorecard-history.jsonl > june-2025.json
jq 'select(.period_start | startswith("2026-06"))' .claude/dx-scorecard-history.jsonl > june-2026.json

# Diff summary
diff <(jq '.summary' june-2025.json) <(jq '.summary' june-2026.json)
```

**Identify high-friction skills**:

```bash
jq '.metrics | to_entries[] | 
  select(.value.friction_index > 15) | 
  {skill: .key, friction: .value.friction_index, error_rate: .value.error_rate}' \
  .claude/dx-scorecard.json
```

---

## Example

**Monthly DX Review Workflow**:

1. Run `/dx-metrics` to populate `.claude/dx-scorecard.json`
2. Review summary: `jq '.summary' .claude/dx-scorecard.json`
3. Identify critical issues: `jq '.summary.critical_issues[]' .claude/dx-scorecard.json`
4. Propose fixes: "deep-research needs retry logic (25% error rate → proposal in dx-review workflow)"
5. Schedule follow-up for 2 weeks post-fix

**Dashboard Integration**:

Export to Prometheus/Grafana:

```bash
jq '.metrics | to_entries[] | {name: .key, success_rate: .value.success_rate}' \
  .claude/dx-scorecard.json | \
  while read metric; do
    echo "dx_success_rate{skill=\"$(echo $metric | jq -r .name)\"} $(echo $metric | jq .success_rate)"
  done
```

---

