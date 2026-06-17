---
name: patient-intake-optimizer
description: Optimizes patient intake and registration workflows to reduce wait times, improve data accuracy, and streamline insurance verification. Outputs a process map with bottleneck analysis and improvement recommendations.
allowed-tools: Read, Write
effort: medium
---

# Patient Intake Optimizer

## When to activate
When patients report long wait times, registration error rates exceed 5%, insurance denial rates are high, or when implementing a new patient portal or kiosk system. Use for ED, ambulatory, and inpatient admissions.

## When NOT to use
Skip for emergency/trauma admissions where clinical urgency overrides process optimization, or when the intake workflow was optimized within the last 6 months with no change in volume or systems.

## Instructions

1. **Map the current state:**
   - Step-by-step process from arrival to room/bed
   - Time per step (measured, not estimated)
   - Handoffs and dependencies
   - Technology touchpoints (kiosk, tablet, manual)

2. **Identify bottlenecks:**
   - Steps with longest wait time
   - Steps with highest error/rework rate
   - Manual steps that could be automated
   - Redundant data collection (same info asked multiple times)

3. **Insurance verification:**
   - Real-time eligibility check (X12 270/271)
   - Prior authorization status at point of service
   - Copay/coinsurance estimation and collection

4. **Improvement recommendations:**
   - Pre-visit: Digital forms, insurance upload, symptom questionnaire
   - At arrival: Kiosk self-check-in, barcode ID scan
   - During: Automated eligibility verification, real-time coding

5. **Metrics to track:**
   - Door-to-provider time
   - Registration error rate
   - Insurance denial rate (front-end)
   - Patient satisfaction with intake (HCAHPS domain)

## Output Format

```
INTAKE OPTIMIZATION: [Setting] — [Location/Department]
CURRENT STATE:
  Total intake time: [X] minutes (median)
  Steps: [count] | Handoffs: [count]

PROCESS MAP:
| Step | Action | Time | Error Rate | Automation |
|------|--------|------|------------|------------|

BOTTLENECKS:
  1. [Step] — [Issue] — [Impact]
  2. [...]

RECOMMENDATIONS:
  Pre-visit:
    1. [Improvement] — Est. time saved: [X] min
  At arrival:
    1. [Improvement] — Est. time saved: [X] min

EXPECTED OUTCOMES:
  Intake time: [current] → [target] minutes
  Error rate: [current]% → [target]%
  Denial rate: [current]% → [target]%
```

## Example

```
INTAKE OPTIMIZATION: Ambulatory Primary Care — Downtown Clinic
CURRENT STATE:
  Total intake time: 18 minutes (median)
  Steps: 7 | Handoffs: 3

PROCESS MAP:
| Step | Action                  | Time  | Error Rate | Automation     |
|------|-------------------------|-------|------------|----------------|
| 1    | Check-in at front desk  | 3 min | 2%         | Manual         |
| 2    | ID + insurance card copy| 2 min | 8%         | Scanner        |
| 3    | Demographics form       | 5 min | 12%        | Paper → manual |
| 4    | Eligibility check       | 3 min | 5%         | Batch (delayed)|
| 5    | Copay collection        | 2 min | 3%         | Manual         |
| 6    | Vitals (MA)             | 2 min | 1%         | EMR entry      |
| 7    | Rooming + chief complaint|1 min | 4%         | EMR entry      |

BOTTLENECKS:
  1. Demographics form — paper → manual re-entry causes 12% error rate, 5 min wait
  2. Eligibility check — batch processing means 15% discover denials after visit

RECOMMENDATIONS:
  Pre-visit:
    1. Digital intake forms via patient portal — Est. time saved: 5 min
    2. Real-time eligibility via API (X12 270/271) — catches denials pre-visit
  At arrival:
    1. Kiosk self-check-in with ID barcode scan — Est. time saved: 3 min
    2. Integrated copay estimation + card-on-file — Est. time saved: 2 min

EXPECTED OUTCOMES:
  Intake time: 18 → 8 minutes
  Error rate: 12% → 3%
  Denial rate: 15% → 5%
```
