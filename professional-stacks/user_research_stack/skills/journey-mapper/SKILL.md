---
name: journey-mapper
description: Map user journeys with touchpoints, emotions, pain points, and opportunity areas across the full user lifecycle
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Mapping the end-to-end user experience
- Identifying pain points and opportunities across touchpoints
- Aligning teams on the user's perspective of a process
- Prioritizing improvements by stage and impact
- Connecting research findings to specific journey moments

## When NOT to use

- For service blueprinting (backstage processes)
- For process flow diagrams (operational perspective)
- For feature prioritization roadmaps

## Instructions

1. **Define journey scope.** Start and end points: e.g., "awareness → purchase → onboarding → regular use → advocacy."
2. **List journey stages.** 4-7 major phases the user passes through.
3. **Map touchpoints per stage.** What the user does, thinks, feels, and what systems they interact with.
4. **Plot emotional curve.** Rate emotion at each touchpoint: delighted (+2), satisfied (+1), neutral (0), frustrated (-1), angry (-2).
5. **Identify pain points.** Mark moments of friction, confusion, delay, or disappointment with severity.
6. **Find opportunities.** For each pain point, brainstorm solutions. Tag with effort (low/med/high) and impact.
7. **Visualize the map.** Create a visual journey with stages across top, layers (actions, thoughts, emotions, touchpoints) down.

## Example

```
Journey: New User Onboarding (Mobile App)

Stage: Sign Up → Setup → First Task → Value Discovery → Habit Formation

Touchpoint: First Task
- Does: Taps "Create first project", enters name, sees empty canvas
- Thinks: "Okay, now what? Where do I add my team?"
- Feels: Confused 😐 → Frustrated 😤 (can't find invite button)
- System: App → Project page (no guided next step)
- Pain: No clear next action after creating project (severity: HIGH)
- Opportunity: Add "Next steps" card with invite team, add first task, set deadline
```
