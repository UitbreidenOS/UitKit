---
name: clinical-decision-supporter
description: Designs clinical decision support (CDS) rules and alert logic for EHR systems. Outputs structured CDS specifications with trigger conditions, evidence grading, alert severity, and alert fatigue mitigation strategies.
allowed-tools: Read, Write, WebSearch
effort: high
---

# Clinical Decision Supporter

## When to activate
When building or refining CDS rules in an EHR, designing clinical alerts, implementing order sets, or when alert fatigue is reported and rules need optimization. Use for drug-drug interactions, sepsis screening, VTE prophylaxis, and preventive care reminders.

## When NOT to use
Skip for simple reference lookups (lab ranges, drug dosing tables), administrative reminders without clinical impact, or when the CDS rule already exists and is functioning within acceptable parameters.

## Instructions

1. **Clinical trigger:** What patient data element or event activates the CDS rule?
   - Lab value thresholds, vital sign patterns, medication orders, diagnosis codes
   - Time-based triggers (e.g., 48h post-op without ambulation)

2. **Evidence grading:** What is the evidence level for this recommendation?
   - Level A: Multiple RCTs or meta-analyses
   - Level B: Single RCT or large observational studies
   - Level C: Expert consensus or small studies

3. **Alert specification:**
   - **Severity:** CRITICAL (must acknowledge before continuing), WARNING (can dismiss with reason), INFO (passive display)
   - **Timing:** On order entry, on result review, on admission, on discharge
   - **Display:** Concise clinical question + recommended action + evidence level

4. **Alert fatigue mitigation:**
   - Override rate monitoring (target <50%)
   - Specificity optimization (minimize false positives)
   - Tiered alerting (only interrupt for high-severity, high-confidence)
   - Context-aware suppression (don't alert if action already taken)

5. **Outcome measurement:** How will CDS effectiveness be measured?

## Output Format

```
CDS RULE: [Name]
TRIGGER: [Condition] | TIMING: [When]
EVIDENCE: Level [A/B/C] — [Source]

ALERT:
  Severity: [CRITICAL/WARNING/INFO]
  Display: "[Clinical message]"
  Recommended action: [Specific action]
  Dismissal requires: [Reason / Nothing / Acknowledgment]

SUPPRESSION LOGIC:
  - [Condition under which alert should NOT fire]
  - [...]

METRICS:
  Sensitivity target: [X]% | Specificity target: [X]%
  Override rate target: <[X]%
  Outcome: [Clinical metric to track]

SAFETY REVIEW:
  Patient safety impact: [Positive/Negative/Neutral]
  False positive consequence: [Clinical burden]
  False negative consequence: [Risk]
```

## Example

```
CDS RULE: Sepsis Early Warning
TRIGGER: SIRS criteria ≥2 + organ dysfunction marker | TIMING: On vital sign entry + lab result
EVIDENCE: Level A — Surviving Sepsis Campaign 2021, qSOFA validation studies

ALERT:
  Severity: CRITICAL
  Display: "SEPSIS ALERT: Patient meets ≥2 SIRS criteria + lactate 3.2 mmol/L.
           Recommend: blood cultures ×2, broad-spectrum antibiotics within 1h, fluid bolus 30mL/kg."
  Recommended action: Initiate sepsis bundle order set
  Dismissal requires: Documented clinical reason (dropdown + free text)

SUPPRESSION LOGIC:
  - Sepsis bundle already ordered within last 2h
  - Patient already in ICU with active sepsis protocol
  - Palliative care / comfort measures only order active

METRICS:
  Sensitivity target: 85% | Specificity target: 70%
  Override rate target: <40%
  Outcome: Time to first antibiotic, in-hospital mortality

SAFETY REVIEW:
  Patient safety impact: Positive — early detection saves lives
  False positive consequence: Unnecessary labs, antibiotic exposure
  False negative consequence: Delayed treatment, increased mortality
```
