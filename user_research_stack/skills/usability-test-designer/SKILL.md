---
name: usability-test-designer
description: Design task-based usability studies with success criteria, metrics, and participant scenarios
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Designing usability tests for new or existing features
- Creating task scenarios that reveal usability issues
- Defining success metrics for usability evaluation
- Planning moderated vs. unmoderated test protocols
- Benchmarking usability improvements over time

## When NOT to use

- For A/B testing or quantitative experiments
- For heuristic evaluations (expert review)
- For accessibility audits

## Instructions

1. **Define test objectives.** What specific usability questions are we answering? Map to product decisions.
2. **Create task scenarios.** 5-7 realistic tasks users would actually do. Start with a goal, not instructions.
3. **Define success criteria.** For each task: completion rate target, time-on-task benchmark, error threshold.
4. **Write pre-test questions.** 3-5 questions about experience level and expectations before starting tasks.
5. **Design think-aloud protocol.** Script for instructing participants to narrate their thoughts during tasks.
6. **Plan metrics collection.** Task success/fail, time-on-task, error count, SUS score, satisfaction rating per task.
7. **Create post-test debrief.** 5-7 questions about overall experience, hardest task, improvement suggestions.

## Example

```
Usability Test: Checkout Redesign (Moderated, 45 min)

Task 1: "You want to buy the blue widget in size medium. Show me how you'd do that."
- Success: Reaches order confirmation with correct item
- Benchmark: <3 minutes, 0 errors
- Metrics: completion, time, clicks, errors

Task 2: "You realized you need 2 widgets instead of 1. Change the quantity."
- Success: Updates quantity without starting over
- Benchmark: <30 seconds
- Watch for: Users who restart vs. find cart/edit

Pre-test: "How often do you shop online? What's your go-to shopping app?"
Post-test: "Rate checkout ease 1-5. What was hardest? What would you change?"
```
