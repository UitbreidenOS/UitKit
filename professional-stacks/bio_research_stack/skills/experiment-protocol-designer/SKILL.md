---
name: experiment-protocol-designer
description: Designs rigorous biological experiment protocols with power analysis, control strategy, randomization plan, and step-by-step methodology. Outputs a structured protocol document with exact reagent concentrations, timing, and sample size justification.
allowed-tools: Read, Write, WebSearch
effort: high
---

# Experiment Protocol Designer

## When to activate
When planning any new biological experiment — before touching a pipette. Use for in-vitro assays, animal studies, cell culture experiments, molecular biology protocols, and field studies.

## When NOT to use
Skip for routine lab maintenance tasks, reagent preparation without experimental context, or literature-only reviews without experimental components.

## Instructions

1. **Define the research question:** State the hypothesis (H₀ and H₁), primary outcome measure, and expected effect size.
2. **Power analysis:** Calculate minimum sample size using:
   - Significance level (α = 0.05 default)
   - Power (1-β = 0.80 default)
   - Expected effect size (Cohen's d for continuous, OR for categorical)
   - Specify the statistical test planned
3. **Control strategy:**
   - Positive control: Known response condition
   - Negative control: Vehicle/mock treatment
   - Technical replicates: Minimum 3 per biological replicate
   - Biological replicates: Defined by power analysis
4. **Randomization:** Method (block, stratified, simple), unit of randomization, blinding approach
5. **Protocol steps:** Numbered, with exact:
   - Reagents (supplier, catalog number, concentration)
   - Equipment (model, settings)
   - Timing (incubation duration, temperature)
   - Volume/mass measurements with units
6. **Data collection plan:** What to measure, when, instrument, format
7. **Statistical analysis plan:** Test selection, software, correction method

## Output Format

```
PROTOCOL: [Title]
HYPOTHESIS: H₀: [...]  H₁: [...]
PRIMARY OUTCOME: [measure + units]
SAMPLE SIZE: n=[X] per group (power analysis: α=0.05, β=0.20, effect size d=[X])

CONTROLS:
  Positive: [...]
  Negative: [...]
  Technical replicates: [X]

RANDOMIZATION: [method] | BLINDING: [method]

MATERIALS:
  - [Reagent] ([Supplier], Cat#[number], [concentration])
  - [Equipment] ([Model], [settings])

PROCEDURE:
  1. [Step with exact conditions]
  2. [...]

DATA COLLECTION:
  | Timepoint | Measurement | Instrument | Format |
  |-----------|-------------|------------|--------|

ANALYSIS PLAN: [Test] with [correction], software: [name]
```

## Example

**Request:** "Design an experiment to test if compound X inhibits tumor growth in mice"

```
PROTOCOL: Compound X Anti-Tumor Efficacy Study
HYPOTHESIS: H₀: Compound X has no effect on tumor volume  H₁: Compound X reduces tumor volume by ≥40%
PRIMARY OUTCOME: Tumor volume (mm³) measured by caliper at day 21
SAMPLE SIZE: n=12 per group (power analysis: α=0.05, β=0.20, effect size d=1.2 based on pilot)

CONTROLS:
  Positive: Doxorubicin 5mg/kg IP q3d
  Negative: Vehicle (0.5% CMC in PBS)
  Technical replicates: 3 caliper measurements per timepoint

RANDOMIZATION: Block randomization by tumor size at enrollment | BLINDING: Caliper operator blinded to group

MATERIALS:
  - Compound X (synthesized in-house, ≥95% purity, 50mg/kg PO)
  - Doxorubicin (Sigma, Cat#D1515, 5mg/kg IP)
  - Digital caliper (Mitutoyo 500-196-30, ±0.02mm)

PROCEDURE:
  1. Implant 1×10⁶ cells subcutaneously in right flank (Day 0)
  2. When tumors reach 100-150mm³, randomize to groups (Day 7)
  3. Dose daily × 14 days (Day 7-20)
  4. Measure tumor volume every 3 days (V = L×W²×0.5)

DATA COLLECTION:
  | Timepoint | Measurement | Instrument | Format |
  |-----------|-------------|------------|--------|
  | D7,10,13,16,20 | Tumor volume | Caliper | mm³ |
  | D20 | Tumor weight | Balance | grams |

ANALYSIS PLAN: One-way ANOVA with Dunnett's post-hoc, GraphPad Prism 10
```
