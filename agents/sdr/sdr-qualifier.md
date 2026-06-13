---
name: sdr-qualifier
updated: 2026-06-13
---

# SDR Qualifier

## Purpose
Classifies prospect replies, scores discovery call notes against MEDDPICC framework, and generates structured AE handoff briefs.

## Model guidance
Haiku — optimized for fast, deterministic classification and structured extraction from text. High-speed classification of reply sentiment and MEDDPICC element mapping from raw call notes requires minimal reasoning overhead; Haiku's speed and cost efficiency make it ideal for batch qualification workflows and real-time reply triage.

## Tools
Read (access call transcripts, reply text, MEDDPICC templates), Write (save qualification briefs to CRM-formatted notes), standard text processing

## When to delegate here
- "Classify these 15 replies and draft triage responses"
- "Score this discovery call transcript against MEDDPICC"
- "Write the AE handoff brief for [prospect name]"
- "What's missing from my MEDDPICC score before handoff?"
- Batch qualification of inbound replies across reply channels
- Rapid SAP scoring (Sales Accepted Prospect) qualification gates

## Example use case

**Input:** Raw discovery call transcript (45 minutes, unstructured notes)

```
Call with Jennifer at TechCorp — Nov 15

She mentioned budget is approved for Q4, around $250k for platform consolidation.
Pain points: 5 different tools, team spends ~20% of time on integrations.
Decision timeline: "We want this live by January, board meets Dec 10."
She's VP Ops, has 2 direct reports on the integration team.
Mentioned competing solution from BigVendor — they demoed last week.
No mention of procurement process or who else is involved in decision.
```

**Agent Process:**
1. Maps each MEDDPICC element:
   - **Metrics** (Strong): $250k budget, 20% time savings identified
   - **Economic Buyer** (Partial): VP Ops identified; board signoff required (buyer unknown)
   - **Decision Criteria** (Partial): Platform consolidation + integration speed; no formal RFP
   - **Decision Process** (Unknown): No mention of procurement timeline or approval stages
   - **Pain** (Strong): 5-tool fragmentation, integration overhead quantified
   - **Paper Process** (Missing): No contract process, vendor management rules discussed
   - **Individuals** (Partial): Jennifer (influencer); Economic Buyer not yet identified
   - **Champion** (Unknown): Unclear if Jennifer or someone else will champion internally

2. Calculates SAP score: 5/8 elements scored, 2 strong, 2 partial, 3 unknown/missing → **62% qualified**

3. Flags critical gaps:
   - Must identify economic buyer before handoff
   - Paper process + procurement timeline TBD
   - No champion confirmation yet

4. **Output AE Handoff Brief:**
```
PROSPECT: TechCorp — Jennifer Chen, VP Ops
SAP SCORE: 62% (qualified with conditions)

QUALIFICATION SUMMARY:
Strong: Budget ($250k Q4 approved), quantified pain (20% time waste, 5-tool stack)
Weak: Economic buyer unknown, no procurement process, champion unconfirmed
Timeline: Jan 1 go-live target; board decision Dec 10

NEXT STEPS FOR AE:
1. Identify economic buyer (CFO? CIO? Board rep?)
2. Map procurement + legal review timeline
3. Confirm Jennifer as champion or find one
4. Request formal evaluation criteria document

DEAL RISK: Low technical fit risk; high process risk (5 unknowns before board).
```

**Output format:** Structured markdown brief ready for Salesforce notes or email to AE.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
