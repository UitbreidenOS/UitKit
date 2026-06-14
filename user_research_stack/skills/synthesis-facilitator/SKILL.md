---
name: synthesis-facilitator
description: Analyze qualitative research data using affinity mapping, thematic analysis, and insight generation frameworks
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Analyzing interview transcripts or research notes
- Conducting affinity mapping or thematic analysis
- Synthesizing findings into actionable insights
- Creating research reports and highlight reels
- Running synthesis workshops with cross-functional teams

## When NOT to use

- For quantitative survey analysis
- For A/B test statistical analysis
- For analytics dashboard interpretation

## Instructions

1. **Debrief immediately.** After each session, write top 3 observations while memory is fresh.
2. **Transcribe and tag.** Transcribe recordings; tag by participant, topic, sentiment, and severity.
3. **Extract data points.** Pull notable quotes, behaviors, pain points, and workarounds from each session.
4. **Affinity mapping.** Group data points into clusters by theme. Name each cluster with an insight statement.
5. **Identify patterns.** Look for patterns across participants: shared pain points, divergent behaviors, unmet needs.
6. **Generate insights.** Transform patterns into insight statements: "[User type] needs [need] because [reason]."
7. **Prioritize recommendations.** Map insights to product decisions. Rank by: user impact × frequency × feasibility.

## Example

```
Theme: Onboarding Confusion (6/8 participants)

Insight: New users don't understand the difference between "projects" and "workspaces" because the terminology doesn't match their mental model.

Evidence:
- P1: "I'm not sure if I should create a project or a workspace..."
- P3: Created 3 workspaces thinking they were projects
- P5: Asked support chat for clarification (15 min delay)

Recommendation: Rename "workspace" to "team" and add tooltip explaining hierarchy.
Priority: HIGH (affects 75% of new users, blocks activation)
```
