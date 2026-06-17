---
name: lab-notebook-writer
description: Creates structured electronic lab notebook entries with complete experimental records including materials, conditions, observations, deviations, and raw data references. Entries follow FAIR data principles.
allowed-tools: Read, Write
effort: low
---

# Lab Notebook Writer

## When to activate
After completing any experiment, when recording results, or when documenting observations during a procedure. Use for every experiment — no exceptions.

## When NOT to use
Skip for informal brainstorming, meeting notes, or administrative tasks unrelated to experimental work.

## Instructions

1. **Entry header:** Date, experiment ID (sequential), project name, researcher
2. **Objective:** One sentence — what question does this experiment answer?
3. **Materials & Methods:**
   - Exact reagents with lot numbers and concentrations
   - Equipment used with settings
   - Protocol version reference (or full protocol if new)
   - Deviations from planned protocol (with reason)
4. **Observations:** Timestamped, factual — what you saw, measured, recorded. No interpretation here.
5. **Raw data:** File paths, instrument output references, image file names
6. **Results:** Processed data, calculations, statistical summary
7. **Interpretation:** What the results mean in context of the hypothesis
8. **Next steps:** Based on results, what experiment follows
9. **Deviations/Issues:** Any problems, unexpected observations, or protocol changes

## Output Format

```
LAB NOTEBOOK ENTRY #[ID]
DATE: [YYYY-MM-DD] | PROJECT: [name] | RESEARCHER: [name]

OBJECTIVE: [One sentence]

MATERIALS:
  - [Reagent] (Lot#[X], [concentration], [supplier])
  - [Equipment] (Model, settings: [parameters])

PROTOCOL: Version [X] / [reference] | DEVIATIONS: [list or "None"]

OBSERVATIONS:
  [HH:MM] — [Factual observation]
  [HH:MM] — [...]

RAW DATA:
  - [File path or instrument output ID]
  - [Image file names]

RESULTS:
  [Processed data, calculations]
  Summary: [mean ± SD, n=X]

INTERPRETATION: [What results mean for the hypothesis]

NEXT STEPS:
  1. [Follow-up experiment]
  2. [...]

ISSUES: [Problems encountered or "None"]
```

## Example

```
LAB NOTEBOOK ENTRY #2024-047
DATE: 2026-06-13 | PROJECT: Compound X Efficacy | RESEARCHER: Dr. Chen

OBJECTIVE: Determine IC50 of compound X on HeLa cell viability.

MATERIALS:
  - Compound X (Lot#CX-2026-03, 10mM stock in DMSO, in-house)
  - MTT reagent (Sigma, Lot#M2128, 5mg/mL in PBS)
  - HeLa cells (ATCC CCL-2, passage 12, 5000 cells/well)
  - Plate reader (BioTek Synergy H1, 570nm)

PROTOCOL: Version 3.1 | DEVIATIONS: Extended incubation from 24h to 48h based on pilot

OBSERVATIONS:
  09:00 — Cells plated, 90% confluent at seeding
  10:30 — Compound X added: 0.1, 1, 10, 50, 100µM (6 wells each)
  14:30 (Day 2) — MTT added, 4h incubation
  18:45 — Plate read at 570nm

RAW DATA:
  - /data/mtt/2026-06-13_compX_hela.csv
  - /data/mtt/2026-06-13_compX_hela_raw.xlsx

RESULTS:
  IC50 = 12.3µM (95% CI: 9.8-15.4), R² = 0.97
  DMSO vehicle control: 98.2 ± 3.1% viability (n=6)

INTERPRETATION: Compound X shows sub-micromolar potency against HeLa. IC50 comparable
to doxorubicin positive control (IC50 = 8.7µM in this assay).

NEXT STEPS:
  1. Test on normal fibroblast line for selectivity index
  2. Mechanism of action: apoptosis vs. necrosis (Annexin V assay)

ISSUES: Edge wells showed evaporation artifacts — excluded from analysis
```
