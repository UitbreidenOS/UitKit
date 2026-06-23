# MoE Router — Mixture of Experts Model Routing

Intelligent model tier selection for Claude tasks. Routes incoming work to Haiku (cost-optimized), Sonnet (balanced), or Opus (advanced reasoning) using 5 distinct routing strategies.

## Overview

The MoE Router automatically classifies task complexity and selects the optimal model tier, reducing costs while preserving quality. Each routing mode uses different signals: keyword detection, file paths, token budgets, confidence scoring, and parallelizable expert voting.

## 5 Routing Modes

### 1. Tier Router (Task Classification)
Analyzes task text for complexity signals — keywords, task length, domain hints.

**Tier assignment:**
- **Opus**: architecture, security, reasoning, planning, threat analysis, system design, complex decision-making
- **Haiku**: formatting, translation, renaming, boilerplate generation, simple classification, templating
- **Sonnet**: default fallback for general-purpose coding, refactoring, documentation writing

**Output**: `{ tier, reasoning, confidence }` where confidence ranges 0.0–1.0 based on keyword matches.

### 2. Cascade Escalator (Progressive Refinement)
Starts with the cheapest capable model, escalates only on confidence failure.

**Flow**:
1. `classifyTask()` → initial tier + confidence score
2. If confidence < threshold (default 0.65), escalate one tier up
3. Repeat until confidence threshold met or Opus reached
4. Stops at max escalations (default 2)

**Use case**: Uncertain task boundaries; avoid over-purchasing Opus upfront.

### 3. Parallel Expert Panel (Multi-Model Voting)
Runs same task against all 3 tiers simultaneously, aggregates results via voting.

**Voting strategies**:
- `majority`: Pick tier chosen by most experts
- `confidence-weighted`: Score each tier by average confidence of its votes
- `synthesis`: Return all results for external judge model to synthesize

**Use case**: High-stakes decisions; get consensus from diverse model strengths.

### 4. Domain Expert Router (Path-Based Routing)
Routes by file path and domain signals detected in the task description.

**Domain rules** (checked in priority order):
| Path Pattern | Domain | Tier |
|---|---|---|
| `*/security/*`, `*auth*`, `*credentials*`, `*secrets*`, `*cors*` | Security | Opus |
| `*/architecture/*`, `*.yaml`, `*.yml`, `*.tf` | Infra/Config | Opus |
| `*/data/*`, `*/ml/*`, `*.py` | Data/ML | Sonnet |
| `*.ts`, `*.tsx`, `*.js`, `*.jsx` | Source Code | Sonnet |
| `*.md`, `*.txt` | Documentation | Haiku |
| (no paths match) | Task classification | By Tier Router |

**Use case**: Codebases with clear domain structure; automatic routing without prompt inspection.

### 5. Budget Governor (Token Ratio Thresholds)
Dynamically routes based on remaining token budget as a percentage of total session budget.

**Thresholds**:
- If `remaining / total < 15%`: Force Haiku (conservation mode)
- If `remaining / total >= 50%` AND task is Opus-classified: Use Opus (budget-permissive mode)
- Otherwise: Use Tier Router classification

**Output**: `{ tier, reasoning, budgetRatio }`

**Use case**: Long-running sessions with fixed token caps; ensures completion even under budget pressure.

---

## Quick Start

### Programmatic Usage

```javascript
import MoeRouter, { classifyTask, routeByDomain, budgetGovernedRouter } from './lib/moe-router.js';

// Classify a task
const result = classifyTask('design a distributed cache system');
console.log(result.tier);     // claude-opus-4-7
console.log(result.confidence); // 0.85

// Route by file paths
const domainRoute = routeByDomain(['src/security/auth.ts'], 'refactor');
console.log(domainRoute.tier); // claude-opus-4-7 (security)

// Budget-aware routing
const governor = budgetGovernedRouter({ totalBudget: 100000 });
const route = governor.route('write unit tests', 12000);
console.log(route.tier);      // claude-haiku-4-5 (budget critical)
```

### CLI Usage

```bash
# Classify a task
claudient moe classify "format the JSON output"
# → Tier: HAIKU

# Show escalation path
claudient moe cascade "design a secure authentication flow"
# → Original Tier: SONNET, Final Tier: OPUS (escalated)

# Expert panel voting
claudient moe panel "code review this PR" --strategy=majority
# → Consensus: SONNET (2/3 experts)

# Domain-based routing
claudient moe domain "src/security/auth.ts,src/security/jwt.ts" "security audit"
# → Domain: security, Routed Tier: OPUS

# Budget-governed routing
claudient moe budget "write tests" --remaining 20000 --total 100000
# → Budget Ratio: 0.20 (20%), Routed Tier: HAIKU

# System status
claudient moe status
# → Prints 5-mode status table
```

---

## API Reference

### Core Functions

#### `classifyTask(taskText: string): { tier, reasoning, confidence }`
Analyzes task text and returns tier assignment with confidence score.

```javascript
const result = classifyTask('architect a microservices system');
// { tier: 'claude-opus-4-7', reasoning: '2 opus keyword(s) detected', confidence: 0.82 }
```

#### `routeByDomain(filePaths: string[], taskText: string): { tier, domain, reasoning }`
Routes based on file path domains (security, data, code, docs, infra).

```javascript
const result = routeByDomain(['src/security/jwt.ts'], 'review');
// { tier: 'claude-opus-4-7', domain: 'security', reasoning: '...' }
```

#### `createCascadeRunner(options): async (taskText) => { tier, escalations, originalTier, reasoning }`
Creates an escalation engine: starts low, escalates if confidence insufficient.

```javascript
const cascader = createCascadeRunner({ confidenceThreshold: 0.7 });
const result = await cascader('format this data');
// Confidence too low → escalates Haiku → Sonnet
```

#### `createParallelPanel(options): { run, aggregate }`
Fan out to multiple models, aggregate via voting.

```javascript
const panel = createParallelPanel({ votingStrategy: 'majority' });
const results = await panel.run('classify this document');
const consensus = panel.aggregate(results);
// { consensus: 'claude-sonnet-4-6', reasoning: '2/3 experts chose sonnet' }
```

#### `budgetGovernedRouter(options): { route, getBudgetThresholds }`
Dynamic routing respecting token budget constraints.

```javascript
const governor = budgetGovernedRouter({ totalBudget: 50000 });
const route = governor.route('refactor module', 5000);  // 10% budget remaining
// { tier: 'claude-haiku-4-5', reasoning: 'budget critical ...' }
```

---

## Tier Reference

| Model | ID | Input Cost | Output Cost | Context | Use When |
|---|---|---|---|---|---|
| **Haiku** | `claude-haiku-4-5` | 0.25¢ | 1.25¢ | 200K | Formatting, classification, templating, fast turnaround |
| **Sonnet** | `claude-sonnet-4-6` | 3¢ | 15¢ | 200K | General coding, refactoring, documentation, orchestration |
| **Opus** | `claude-opus-4-7` | 15¢ | 75¢ | 200K | Architecture, security, ambiguous decisions, deep reasoning |

**Cost multipliers** (relative to Haiku):
- Haiku: 1x
- Sonnet: ~12x
- Opus: ~300x

---

## Integration Examples

### With Cost Optimizer

The `budgetGovernedRouter` integrates with `lib/cost-optimizer.js`:

```javascript
import { CostAnalysis } from './lib/cost-optimizer.js';
import MoeRouter from './lib/moe-router.js';

const budget = new CostAnalysis({ totalBudget: 100000 });
const route = MoeRouter.budgetGovernedRouter({ totalBudget: budget.totalBudget });
const selection = route.route(taskText, budget.remaining());

// If budget tight, MoeRouter auto-selects Haiku; cost-optimizer confirms savings
const savings = budget.estimateSavings(route.tier, budget.remaining());
```

### In Multi-Agent Workflows

Use MoE Router in orchestrator to assign model tiers to pipeline subtasks:

```javascript
const tasks = [
  { id: 1, description: 'parse CSV', files: ['data.csv'] },
  { id: 2, description: 'design schema', files: [] },
  { id: 3, description: 'security audit', files: ['src/auth.ts'] },
];

for (const task of tasks) {
  const route = MoeRouter.routeByDomain(task.files, task.description);
  const agent = spawnAgent(task.id, route.tier);  // Use determined tier
}
```

### With Cascade Escalation

For uncertain tasks, start with Haiku and let confidence drive escalation:

```javascript
const cascader = MoeRouter.createCascadeRunner({ 
  confidenceThreshold: 0.7,
  maxEscalations: 2 
});

const result = await cascader(userPrompt);
console.log(`Routed to: ${result.selectedTier}, escalations: ${result.escalations}`);
```

---

## Configuration

### Cascade Escalator Options
```javascript
{
  confidenceThreshold: 0.65,  // Re-classify at higher tier if below this
  maxEscalations: 2,          // Max escalation hops (Haiku → Sonnet → Opus)
}
```

### Budget Governor Options
```javascript
{
  totalBudget: 100000,        // Session token budget
  opusThreshold: 0.5,         // Use Opus only if >= 50% budget remains
  haikuThreshold: 0.15,       // Force Haiku if < 15% budget remains
}
```

### Parallel Panel Options
```javascript
{
  models: [TIERS.HAIKU, TIERS.SONNET, TIERS.OPUS],  // Models to query
  judgeModel: TIERS.SONNET,                         // Judge for synthesis
  votingStrategy: 'majority',                        // 'majority' | 'synthesis' | 'confidence-weighted'
}
```

---

## Troubleshooting

**Q: Task always routes to Haiku even though it's complex.**
A: Keywords may not match. Use `classifyTask()` to see matched keywords, or try `cascade` mode to escalate based on confidence. Alternatively, use `panel` mode to see all 3 tier opinions.

**Q: Budget Governor is too conservative.**
A: Adjust thresholds in `budgetGovernedRouter({ opusThreshold: 0.4, haikuThreshold: 0.1 })` to allow Opus earlier and defer Haiku fallback longer.

**Q: Parallel panel results don't agree.**
A: Try `confidence-weighted` voting instead of `majority`, or use `synthesis` strategy to let Sonnet model arbitrate disagreements.

**Q: How do I verify the selected tier is correct?**
A: Run `claudient moe classify <task>` to see tier + confidence + reasoning. Use `panel` mode to compare all 3 tiers' opinions side-by-side.

---

## Files

- **`lib/moe-router.js`** — Core logic (ESM module)
- **`lib/moe-router.test.js`** — 10 test assertions
- **`scripts/claudient-moe.js`** — CLI tool
- **`skills/ai-engineering/model-router.md`** — User-facing skill
- **`agents/core/moe-router.md`** — Routing agent for orchestrators

---

## References

- **CLAUDE.md** — Canonical tier guidance (Haiku cost, Sonnet balanced, Opus reasoning)
- **`guides/decision-framework.md`** — When to use skills vs agents vs direct prompting
- **`scripts/cost-optimizer.js`** — Token pricing and cost analysis
