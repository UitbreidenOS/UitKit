# Ablation Study Planner

## When to activate

When planning, designing, or executing ablation studies to isolate the impact of individual model components, features, or hyperparameters on performance metrics.

## When NOT to use

- For general hyperparameter tuning (use grid/random search skills instead)
- When causality is not the primary research question
- For optimization without systematic removal of components
- When computational budget is too constrained to run multiple model variants

## Instructions

Ablation studies isolate component contributions through systematic removal. The planner should:

1. **Define the baseline** — document the full model configuration, data, and metrics
2. **Identify ablation targets** — list components to remove (attention heads, layers, loss terms, features, etc.)
3. **Design ablation sequence** — determine order (independent vs. cascading removals)
4. **Specify metrics** — define what to measure (accuracy, F1, inference time, memory, etc.)
5. **Plan resource allocation** — estimate compute needed for all runs
6. **Document protocol** — ensure reproducibility (seeds, data splits, hardware specs)

Output should include:
- Ablation plan with all variants
- Expected runtime and resource requirements
- Reproducibility checklist
- Template for result tracking and visualization

## Example

A vision transformer ablation study:

- **Baseline**: Full ViT model (12 layers, 12 attention heads, 768 hidden dim)
- **Ablations**: 
  - Remove attention heads (6, 3, 1 remaining)
  - Remove transformer layers (6, 3 remaining)
  - Remove patch embedding positional encoding
  - Remove layer normalization components
- **Metrics**: Top-1 accuracy, latency, peak memory
- **Sequence**: Run all single-component removals first; then cascading removals if interesting interactions found
- **Resources**: 24 GPU hours estimated
