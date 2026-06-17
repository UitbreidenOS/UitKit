---
name: clinical-trial-tracker
description: Designs clinical trial monitoring dashboards and tracking frameworks for enrollment, protocol adherence, safety reporting, and regulatory milestones. Outputs a trial tracking specification with KPIs and alert thresholds.
allowed-tools: Read, Write, WebSearch
effort: high
---

# Clinical Trial Tracker

## When to activate
When setting up monitoring for a new clinical trial, when an existing trial has enrollment or protocol deviation concerns, or when preparing for a regulatory audit or DSMB review. Use for Phase I-IV trials across all therapeutic areas.

## When NOT to use
Skip for pre-clinical (animal) studies (use bio_research_stack), retrospective chart reviews without prospective tracking, or when the trial monitoring framework is already operational and meeting all KPIs.

## Instructions

1. **Trial design parameters:**
   - Phase, therapeutic area, primary endpoint
   - Number of sites, target enrollment, timeline
   - Key inclusion/exclusion criteria
   - Randomization scheme and blinding

2. **Enrollment tracking:**
   - Screened vs. enrolled vs. target (by site)
   - Screen failure rate and reasons
   - Enrollment velocity (patients/week) vs. plan
   - Diversity metrics (race, ethnicity, sex, age)

3. **Protocol adherence:**
   - Deviations: Major (affect safety/data integrity) vs. minor
   - Deviation rate per site, trend over time
   - Common deviation types and root causes
   - Corrective and preventive actions (CAPA)

4. **Safety monitoring:**
   - SAE reporting: Count, relatedness, expectedness
   - SUSAR reporting timeline (7 or 15 calendar days)
   - DSMB review schedule and data packages
   - Stopping rules and futility boundaries

5. **Regulatory milestones:**
   - IND/NDA/BLA submission timeline
   - FDA/EMA meeting dates (Pre-IND, End-of-Phase 2)
   - IRB/EC renewal dates per site
   - Informed consent version tracking

## Output Format

```
TRIAL TRACKER: [Protocol ID] — [Title]
PHASE: [I/II/III/IV] | THERAPEUTIC AREA: [area]
PRIMARY ENDPOINT: [endpoint] | TARGET ENROLLMENT: [N]

ENROLLMENT DASHBOARD:
| Site | Screened | Enrolled | Target | Screen Fail % | Velocity |
|------|----------|----------|--------|---------------|----------|

PROTOCOL DEVIATIONS:
  Total: [X] | Major: [X] | Minor: [X]
  Rate: [X] per 100 patient-visits
  Top types: [list]

SAFETY:
  SAEs: [X] | Related: [X] | SUSARs: [X]
  Deaths: [X] | Discontinuations (AE): [X]

REGULATORY MILESTONES:
| Milestone | Planned | Actual/Forecast | Status |
|-----------|---------|-----------------|--------|

ALERT THRESHOLDS:
  Enrollment: <[X] patients/week → escalate
  Screen fail: >[X]% → review criteria
  Deviations: >[X] per site → monitoring visit
  SAE: Report within [X] hours of awareness
```

## Example

```
TRIAL TRACKER: PROTOCOL-2026-042 — Phase III Anti-PD-1 in Metastatic NSCLC
PHASE: III | THERAPEUTIC AREA: Oncology (NSCLC)
PRIMARY ENDPOINT: Overall survival (OS) | TARGET ENROLLMENT: 600

ENROLLMENT DASHBOARD:
| Site        | Screened | Enrolled | Target | Screen Fail % | Velocity  |
|-------------|----------|----------|--------|---------------|-----------|
| MD Anderson | 89       | 52       | 60     | 42%           | 3.2/week  |
| Mayo Clinic | 67       | 38       | 45     | 43%           | 2.8/week  |
| UCLA        | 45       | 21       | 40     | 53%           | 1.5/week  |
| Total       | 312      | 178      | 600    | 43%           | 8.1/week  |

PROTOCOL DEVIATIONS:
  Total: 23 | Major: 4 | Minor: 19
  Rate: 2.1 per 100 patient-visits
  Top types: Missed imaging window (8), dose modification without documentation (5)

SAFETY:
  SAEs: 34 | Related: 12 | SUSARs: 3
  Deaths: 8 (5 disease progression, 2 infection, 1 unknown)
  Discontinuations (AE): 14

REGULATORY MILESTONES:
| Milestone           | Planned    | Actual/Forecast | Status  |
|---------------------|------------|-----------------|---------|
| FPFV               | 2025-09-01 | 2025-08-28     | ✅ Done |
| Interim analysis    | 2026-06-01 | 2026-07-15     | ⚠️ Delay|
| DSMB review #3      | 2026-08-01 | 2026-08-01     | On track|
| LPLV               | 2027-03-01 | 2027-06-01     | ⚠️ Risk |

ALERT THRESHOLDS:
  Enrollment: <6 patients/week → escalate (CURRENT: 8.1 ✅)
  Screen fail: >50% → review criteria (CURRENT: 43% ✅, UCLA 53% ⚠️)
  Deviations: >5 per site → monitoring visit
  SAE: Report within 24h of awareness
```
