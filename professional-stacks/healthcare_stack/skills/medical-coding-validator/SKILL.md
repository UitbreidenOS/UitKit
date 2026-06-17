---
name: medical-coding-validator
description: Validates medical coding accuracy for ICD-10-CM/PCS, CPT, and HCPCS codes against clinical documentation. Outputs a coding audit with accuracy scores, common error patterns, and correction recommendations.
allowed-tools: Read, Write, WebSearch
effort: medium
---

# Medical Coding Validator

## When to activate
When auditing coded claims before submission, reviewing denial patterns, training new coders, or when implementing a new EHR coding module. Use for inpatient, outpatient, and professional fee coding.

## When NOT to use
Skip for pre-authorization code estimates (not final coding), patient-facing cost estimates (use patient-intake-optimizer), or when the coding audit was completed within the last 30 days with no system changes.

## Instructions

1. **Documentation review:**
   - Chief complaint and history
   - Assessment and plan (diagnoses with specificity)
   - Procedures performed (approach, devices, body part, qualifier)
   - Time documentation (for E/M level selection)

2. **Diagnosis coding (ICD-10-CM):**
   - Specificity: Laterality, episode of care, severity
   - Combination codes vs. multiple codes
   - Sequencing: Principal diagnosis first
   - Z-codes for social determinants of health

3. **Procedure coding (CPT/ICD-10-PCS):**
   - E/M level: MDM complexity or time-based
   - Surgical: Root operation, approach, body part
   - Modifiers: -25 (separate E/M), -59 (distinct procedure), -51 (multiple)

4. **Compliance checks:**
   - NCCI edits (bundled services)
   - MUE (medically unlikely edits)
   - LCD/NCD coverage policies
   - Documentation supports coded diagnoses

5. **Common error patterns to flag:**
   - Unspecified codes when specificity is available
   - Upcoding (E/M level higher than documentation supports)
   - Downcoding (missed complexity)
   - Missing Z-codes for social determinants

## Output Format

```
CODING AUDIT: [Encounter type] — [Department/Specialty]
SAMPLE: [X] encounters reviewed | DATE RANGE: [start — end]

ACCURACY:
  Diagnosis (ICD-10-CM): [X]% correct
  Procedure (CPT): [X]% correct
  Modifiers: [X]% correct
  Overall: [X]%

ERRORS FOUND:
| # | Encounter | Code Used | Correct Code | Error Type | Impact |
|---|-----------|-----------|--------------|------------|--------|

COMMON ERROR PATTERNS:
  1. [Pattern] — [Frequency] — [Recommendation]
  2. [...]

COMPLIANCE FLAGS:
  - NCCI edits triggered: [X]
  - MUE exceeded: [X]
  - Documentation gaps: [X]

RECOMMENDATIONS:
  1. [Training focus]
  2. [EHR template change]
  3. [Process improvement]
```

## Example

```
CODING AUDIT: Outpatient Primary Care — Internal Medicine
SAMPLE: 50 encounters | DATE RANGE: 2026-05-01 to 2026-05-31

ACCURACY:
  Diagnosis (ICD-10-CM): 88% correct
  Procedure (CPT): 82% correct
  Modifiers: 74% correct
  Overall: 81%

ERRORS FOUND:
| # | Encounter | Code Used | Correct Code | Error Type        | Impact      |
|---|-----------|-----------|--------------|-------------------|-------------|
| 1 | ENC-4521  | J06.9     | J06.9 + J02.9| Missing specificity| Undercoded  |
| 2 | ENC-4537  | 99214     | 99215        | MDM supports higher| Undercoded  |
| 3 | ENC-4548  | 99215-25  | 99215        | -25 not supported  | Overcoded   |
| 4 | ENC-4552  | E11.9     | E11.65       | Missing complication| Undercoded |

COMMON ERROR PATTERNS:
  1. Using unspecified codes (E11.9 vs. E11.65) — 12% — Train on diabetes sub-classification
  2. Missing -25 modifier documentation — 8% — Add template prompt for separate E/M

COMPLIANCE FLAGS:
  - NCCI edits triggered: 3 (99214 + 36415 bundled)
  - MUE exceeded: 0
  - Documentation gaps: 4 encounters missing ROS

RECOMMENDATIONS:
  1. Coder training: ICD-10-CM diabetes and respiratory sub-classification
  2. EHR template: Add modifier -25 documentation prompt
  3. Pre-bill audit: Sample 10% of encounters before claim submission
```
