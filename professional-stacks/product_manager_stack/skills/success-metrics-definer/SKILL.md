---
name: success-metrics-definer
description: Takes a PRD's success metrics and adds: baseline (where you are now), target (where you want to go), and measurement plan (how you'll track it). Ensures metrics are SMART: specific, measurable, achievable, relevant, time-bound. Returns a metrics validation report.
allowed-tools: Read, Write
effort: medium
---

# Success Metrics Definer

## When to activate
Before the PRD is finalized. Use this to turn vague success metrics into measurable, trackable targets.

## When NOT to use
Do not use if you don't have access to current baseline data. Baseline is critical; if you can't measure it now, the metric is not valid.

## Instructions

1. Read the PRD's success metrics section.
2. For each metric, define:
   - **Baseline:** Where is this metric right now? (e.g., "Avg onboarding time is currently 45 min")
   - **Target:** Where do you want it after the feature ships? (e.g., "Reduce to 30 min by end of quarter")
   - **Measurement plan:** How will you track it? (e.g., "Track via analytics event 'onboarding_complete' + timestamp")
   - **Confidence:** How certain are you this change is caused by your feature, not external factors? (0–100%)
3. Check for SMART criteria:
   - Specific: "Increase DAU" is vague; "increase DAU from 50k to 56k" is specific.
   - Measurable: defined baseline + target + measurement method.
   - Achievable: is a 12% lift realistic given industry benchmarks?
   - Relevant: does this metric tie to business outcome (revenue, retention, NPS)?
   - Time-bound: by when should the target be achieved?
4. Flag any metrics that can't be measured or don't have a baseline.

## Output Format

```
# Success Metrics — [Feature Name]

## Validated Metrics

**Metric 1: [Name]**
- Baseline: [current value + date] | Target: [goal value] | Timeline: [by when]
- Measurement plan: [how we measure; tool/event/report]
- Confidence: [0–100]% that feature causes this change
- SMART check: ✓ (Specific, Measurable, Achievable, Relevant, Time-bound)

---

**Metric 2: [Name]**
- Baseline: [current value] | Target: [goal] | Timeline: [by when]
- Measurement plan: [method]
- Confidence: [0–100]%
- SMART check: ✓

---

## Flagged Metrics (Needs Definition)

**Original:** "Improve user satisfaction"
**Issue:** Vague; no baseline or measurement plan
**Suggested:** "Increase NPS from [current score] to [target score] as measured by [survey frequency]"

---

## Summary
[X] metrics approved | [Y] metrics flagged for revision
Overall readiness: [Ready to launch / Needs refinement]
```

---
