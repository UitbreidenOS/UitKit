---
name: "skill-composition"
description: "Skill composition and chaining: design multi-skill workflows, chain skill outputs as inputs, build reusable skill pipelines, and orchestrate complex tasks from atomic skill building blocks"
---

# Skill Composition & Chaining

## When to activate
- Building complex workflows that require multiple skills in sequence
- When a single skill cannot handle the full task scope
- Designing reusable skill pipelines for recurring multi-step processes
- Orchestrating skills across different domains (e.g., design → code → test → deploy)
- When skill outputs need to feed into downstream skills as structured inputs

## When NOT to use
- Single-purpose tasks that one skill handles completely
- Simple sequential commands that don't need state passing between steps
- When the workflow is ad-hoc and unlikely to recur

## Instructions

### 1. Skill Composition Patterns

**Sequential Pipeline (Linear Chain):**
```
Skill A → output → Skill B → output → Skill C → final output
```
Use when each step depends on the previous step's output.

**Fan-Out / Fan-In (Parallel + Merge):**
```
         ┌→ Skill B ─┐
Skill A ─┤→ Skill C ─├→ Skill E (merge)
         └→ Skill D ─┘
```
Use when independent analyses can run in parallel before merging.

**Conditional Branching:**
```
Skill A → router → Skill B (if condition X)
                  → Skill C (if condition Y)
```
Use when the next skill depends on the output of the previous one.

**Recursive / Iterative:**
```
Skill A → evaluate → Skill A (refine) → evaluate → done
```
Use when output quality improves with iteration (e.g., write → review → revise).

### 2. Interface Contracts

Define explicit input/output contracts between skills:

```yaml
skill_contracts:
  code-review:
    input:
      required: [file_paths, language, standards_ref]
      optional: [focus_areas, severity_filter]
    output:
      format: structured_report
      fields: [issues, severity_counts, summary, recommendations]
      
  security-scan:
    input:
      required: [file_paths, scan_type]
      optional: [severity_threshold, exclude_patterns]
    output:
      format: vulnerability_report
      fields: [findings, severity_counts, remediation_steps, risk_score]
      
  fix-generator:
    input:
      required: [issues, file_paths]  # from code-review or security-scan
      optional: [auto_apply, test_after]
    output:
      format: patch_set
      fields: [patches, test_results, applied, skipped]
```

### 3. Pipeline Definition

```yaml
pipeline: code-quality-gate
description: "Full code quality pipeline before merge"
trigger: pre-merge

steps:
  - name: lint-and-format
    skill: code-review
    input:
      file_paths: "$changed_files"
      focus_areas: [style, formatting, naming]
    output: lint_report
    
  - name: security-check
    skill: security-scan
    input:
      file_paths: "$changed_files"
      severity_threshold: medium
    output: security_report
    parallel_with: lint-and-format  # run in parallel
    
  - name: test-generation
    skill: test-generator
    input:
      file_paths: "$changed_files"
      coverage_target: 80
      existing_tests: "$test_files"
    output: test_report
    depends_on: [lint-and-format]  # needs clean code first
    
  - name: fix-suggestions
    skill: fix-generator
    input:
      issues: "$lint_report.issues + $security_report.findings"
      file_paths: "$changed_files"
    output: fixes
    depends_on: [lint-and-format, security-check]
    condition: "$lint_report.issues_count + $security_report.findings_count > 0"

  - name: summary
    skill: report-generator
    input:
      reports: [$lint_report, $security_report, $test_report, $fixes]
    output: final_summary
    depends_on: [fix-suggestions, test-generation]

gate:
  pass_condition: "$security_report.findings_count == 0 AND $lint_report.severity_counts.critical == 0"
  on_fail: "block_merge with $final_summary"
```

### 4. State Passing Between Skills

```python
class SkillPipeline:
    """Manages state passing between composed skills."""
    
    def __init__(self, pipeline_def: dict):
        self.steps = pipeline_def["steps"]
        self.state = {}  # accumulated outputs
    
    async def execute(self, initial_input: dict) -> PipelineResult:
        for step in self.topological_sort(self.steps):
            # Resolve input references
            resolved_input = self.resolve_references(
                step.input, self.state, initial_input
            )
            
            # Check conditions
            if step.condition and not self.evaluate_condition(
                step.condition, self.state
            ):
                self.state[step.name] = {"skipped": True}
                continue
            
            # Execute the skill
            result = await self.run_skill(step.skill, resolved_input)
            
            # Store output in state
            self.state[step.name] = result
        
        # Evaluate gate conditions
        gate_result = self.evaluate_gate(pipeline_def.get("gate"), self.state)
        return PipelineResult(state=self.state, gate=gate_result)
    
    def resolve_references(self, input_def: dict, state: dict, initial: dict):
        """Resolve $variable references in input definitions."""
        resolved = {}
        for key, value in input_def.items():
            if isinstance(value, str) and value.startswith("$"):
                ref_path = value[1:].split(".")
                resolved[key] = self.nested_get(
                    {**state, **initial}, ref_path
                )
            else:
                resolved[key] = value
        return resolved
```

### 5. Reusable Pipeline Library

**DevOps Pipeline:**
```yaml
pipeline: deploy-to-production
steps:
  1. infrastructure-review → terraform-validate → security-scan
  2. build-and-test → container-scan → push-to-registry
  3. canary-deploy → smoke-test → promote-or-rollback
```

**Content Pipeline:**
```yaml
pipeline: blog-post-production
steps:
  1. topic-research → outline-generator → draft-writer
  2. seo-optimizer → grammar-check → fact-checker
  3. image-suggester → social-preview → publish-scheduler
```

**Data Pipeline:**
```yaml
pipeline: data-quality-check
steps:
  1. schema-validator → null-checker → outlier-detector
  2. freshness-check → consistency-check → completeness-score
  3. quality-report → alert-if-degraded → suggest-fixes
```

### 6. Error Handling in Pipelines

```yaml
error_handling:
  strategy: continue-on-non-critical  # or: fail-fast, retry-then-skip
  
  retries:
    max_attempts: 3
    backoff: exponential
    retry_on: [timeout, rate_limit, transient_error]
  
  fallback:
    on_failure: "use_cached_result"  # or: skip_step, abort_pipeline
    cache_ttl: "24h"
  
  compensation:
    # Undo partial work if pipeline fails mid-way
    on_abort:
      - rollback_deployment
      - revert_database_changes
```

## Example

**Composing a full application review pipeline:**

```
TRIGGER: /review-app

PIPELINE: application-review v1.0
├── Step 1: code-review (all changed files)
│   └── Output: 12 issues (2 critical, 4 medium, 6 low)
├── Step 2: security-scan (parallel with Step 1)
│   └── Output: 3 vulnerabilities (1 high, 2 medium)
├── Step 3: test-generator (depends on Step 1)
│   └── Output: 8 new tests, coverage 67% → 82%
├── Step 4: fix-generator (depends on Steps 1+2)
│   └── Output: 11 auto-fixes proposed, 4 require manual review
└── Step 5: summary-report (depends on all)
    └── Output: Review report with BLOCK (critical security finding)

GATE RESULT: BLOCKED — 1 high severity security vulnerability
ACTION: Merge blocked until security finding is resolved
```

## Anti-Patterns

- **Over-composition:** Chaining 10 skills when 2 would suffice — complexity tax
- **Tight coupling:** Skills that only work in one specific pipeline — design for reuse
- **State explosion:** Passing entire datasets between skills — use summaries and references
- **No error handling:** Pipeline fails silently when one skill errors — always define failure modes
- **Missing contracts:** Skills with implicit assumptions about input format — define explicit contracts
