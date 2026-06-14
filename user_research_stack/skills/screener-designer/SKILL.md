---
name: screener-designer
description: Build participant screening questionnaires with inclusion/exclusion criteria and quota management
allowed-tools: [Read, Write, Grep]
effort: low
---

## When to activate

- Recruiting participants for user research studies
- Defining inclusion/exclusion criteria for studies
- Building screener surveys for recruiting platforms
- Managing participant quotas and diversity targets
- Evaluating screener quality and no-show rates

## When NOT to use

- For survey research questionnaires
- For customer satisfaction surveys
- For market research segmentation studies

## Instructions

1. **Define target participants.** Who represents the user population for this study? Behaviors, not just demographics.
2. **Set inclusion criteria.** 3-5 must-have characteristics: product usage, frequency, role, experience level.
3. **Set exclusion criteria.** Who to exclude: competitors' employees, UX professionals (for some studies), recent participants.
4. **Write screener questions.** 8-12 questions, mix of open and closed. Use indirect questions to avoid gaming ("Which of these tools do you use?" not "Do you use Tool X?").
5. **Add red herring options.** Include plausible distractors to prevent participants from guessing the "right" answer.
6. **Set quotas.** Target breakdown: e.g., 4 power users + 4 casual users, balanced by platform (iOS/Android).
7. **Pilot test.** Run screener with 2-3 people to check clarity, completion time (<5 min), and criteria accuracy.

## Example

```
Screener: Onboarding Study

Inclusion:
- Signed up for [Product] in last 14 days
- Used mobile app at least once
- Has NOT completed onboarding flow

Exclusion:
- Works in tech/UX/design
- Participated in research in last 6 months

Screener Questions:
Q1: "Which of the following apps have you used in the past month?" (multi-select, include 8 options including our product)
Q2: "How often do you use [category] tools?" (Daily/Weekly/Monthly/Rarely)
Q3: "When you signed up for [Product], what were you hoping to accomplish?" (open-ended)
```
