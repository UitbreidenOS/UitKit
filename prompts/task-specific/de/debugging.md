> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../debugging.md).

# Prompt: Strukturiertes Debugging

Diesen Prompt verwenden, wenn ein Bug zur systematischen Diagnose an Claude übergeben wird.

---

## Vollständiger Debugging-Prompt

```
I have a bug. Help me diagnose it systematically.

## The symptom
[Describe exactly what goes wrong: error message, unexpected output, wrong behavior.
Include the exact error text if there is one.]

## Reproduction
[Describe how to reproduce it — steps, curl command, test case, or "cannot reliably reproduce"]

## What I've already tried
[List anything you've already checked or changed — saves Claude from repeating it]

## Relevant files
[List the files most likely involved — or ask Claude to identify them]

## Recent changes
[What changed recently in this area? Paste relevant git log output if helpful]

---

Using this information:

1. Identify the 3 most likely root causes, ranked by probability
2. For each cause, describe a specific test that would confirm or rule it out
3. Start with the highest-probability cause
4. Do not fix anything yet — diagnose first

After each test, report what you found and move to the next hypothesis or proceed to fix.
```

---

## Schnellvariante (offensichtliche Bugs)

Für Bugs, bei denen die Ursache ungefähr bekannt ist:

```
Bug: [describe the symptom]
Likely cause: [your hypothesis]
Relevant code: [paste the relevant function or file]

Confirm whether my hypothesis is correct, then apply the minimal fix.
Write a regression test after fixing.
```

---

## Produktionsvorfall-Variante

Für Live-Vorfälle, bei denen Schnelligkeit wichtig ist:

```
PRODUCTION INCIDENT — [service name] is [symptom]

Immediate priority: identify the blast radius and any actions to reduce user impact NOW.

Then diagnose:
- Error logs: [paste relevant log lines]
- Recent deployments: [list last 3 deploys with timestamps]
- Affected users: [number/percentage if known]

What is the fastest safe mitigation while we find the root cause?
```

---
