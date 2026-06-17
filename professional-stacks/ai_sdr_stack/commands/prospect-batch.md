---
description: Score and queue a batch of inbound or outbound leads. Returns a ranked list with GO/NO-GO, ICP gaps, and recommended next action per lead. Prioritizes the queue for the session.
---

# /prospect-batch

## What This Does
Scores a list of prospects in bulk against the ICP matrix. Returns a ranked, prioritized queue — highest-scored GO leads at the top — with a one-line recommended action per prospect. Eliminates wasted research time on low-fit leads.

## Steps Claude Follows
1. Ask for the lead list: paste a CSV or describe the list (source, role filter, company size range).
2. For each prospect in the list:
   a. Score using lead-scorer skill (all 4 dimensions).
   b. Assign GO/CAUTION/NO-GO.
   c. Note the top gap dimension for CAUTION leads.
3. Rank results: GO leads first (by score descending), then CAUTION, then NO-GO.
4. For each GO lead, suggest next action: account research → email draft, or add to existing sequence.
5. Return the ranked list with a session queue recommendation (how many to action today based on capacity).

## Output Format

```
PROSPECT BATCH RESULTS
Processed: [X] leads | GO: [X] | CAUTION: [X] | NO-GO: [X]
Recommended today's queue: top [X] GO leads

RANK  NAME              COMPANY         SCORE  DECISION   GAP / NOTE          NEXT ACTION
1     [Name, Title]     [Company]       [X]    GO         —                   Account research
2     [Name, Title]     [Company]       [X]    GO         —                   Add to Series B sequence
3     [Name, Title]     [Company]       [X]    CAUTION    Weak: Tech stack    Research before deciding
...
[X]   [Name, Title]     [Company]       [X]    NO-GO      Size + Industry     Skip
```

## Notes
- Run this at the start of each prospecting session to set priorities.
- NO-GO leads are not deleted — they're archived in case company stage changes.
- CAUTION leads worth researching are ones where the weak dimension could be offset by a strong trigger.
