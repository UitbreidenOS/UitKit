---
name: model-router
description: Select optimal Claude model tier (Haiku/Sonnet/Opus) for any task using Mixture of Experts routing — 5 modes including tier classification, cascade escalation, parallel expert panel, domain routing, and budget governance
updated: 2026-06-23
---

# Model Router — Mixture of Experts Routing

## When to activate

- User asks which Claude model to use for a task ("should I use Opus or Haiku?")
- Optimizing cost by routing to the cheapest capable model tier
- Building a multi-agent workflow and need to assign model tiers to subtasks
- User mentions "MoE", "model routing", "tier selection", "cost optimization", "smart model selection"
- Debugging a workflow where wrong model was selected for a task
- Understanding Haiku/Sonnet/Opus capability boundaries and when to switch between them
- Session has token budget constraints and needs dynamic routing

## When NOT to use

- Model is already explicitly specified by the user (no routing needed)
- Single short interactive conversation where overhead exceeds benefit
- Task is clearly Opus-only (security architecture review, threat modeling) — skip routing
- Quality is only concern and cost is unlimited — default to Opus
- User is asking general questions about Claude's capabilities (not task-specific routing)

## Instructions

### Routing Mode 1: Tier Router (Task Classification)

Analyzes task text for complexity signals — keywords, word count, domain hints.

**Tier assignment logic:**
- **Opus tier** activated by keywords: architect, architecture, security, threat, exploit, vulnerability, design system, reasoning, planning, explore, critique, ambiguous, tradeoff, evaluate options, decide, strategy, complex decision, deep dive, analysis
- **Haiku tier** activated by keywords: format, lint, rename, translate, classify, extract, boilerplate, generate stub, template, sort, list, summarize short, count, convert, reformat, cleanup, validation, parsing, simple task
- **Sonnet tier** is default fallback for general-purpose work (coding, refactoring, writing, orchestration)

**Confidence scoring**: Higher confidence (0.7+) when multiple keywords match. Lower confidence (0.4) when task description is vague or very short.

**When to use**: Quick, automatic tier selection when you need to route immediately without complex reasoning.

### Routing Mode 2: Cascade Escalator (Progressive Refinement)

Starts with the cheapest capable model, escalates to higher tiers only when confidence is insufficient.

**Flow:**
1. Initial classification yields a tier + confidence score
2. If confidence < threshold (default 0.65), escalate one tier up (Haiku → Sonnet → Opus)
3. Stop at Opus or when confidence threshold is met
4. Max escalations default to 2 (prevents runaway escalation)

**When to use**: Uncertain task boundaries where you'd rather start cheap and escalate as needed. Balances cost with safety.

**Configuration:**
- `--confidence-threshold`: Re-classify at higher tier if below this (default 0.65)
- Max escalations capped at 2

### Routing Mode 3: Parallel Expert Panel (Multi-Model Voting)

Runs the same task prompt against all 3 model tiers simultaneously, aggregates results via voting.

**Voting strategies:**
- **Majority**: Tier chosen by most experts wins (e.g., 2/3 vote for Sonnet)
- **Confidence-weighted**: Score each tier by average confidence; highest-confidence tier wins
- **Synthesis**: Return all 3 results for an external judge model (Sonnet) to synthesize consensus

**When to use**: High-stakes decisions (security designs, architecture choices) where you want consensus from diverse model strengths. Costs 3x more upfront but reduces escalation/retry risk.

### Routing Mode 4: Domain Expert Router (Path-Based Routing)

Routes by file paths and task domain, without inspecting task text deeply.

**Domain rules** (checked in priority order):
| Path Pattern | Domain | Tier | Reasoning |
|---|---|---|---|
| `security/`, `auth`, `credentials`, `secrets`, `cors` | Security | **Opus** | High stakes, exploit-adjacent |
| `architecture/`, `.yaml`, `.yml`, `.tf` | Infra/Architecture | **Opus** | System design decisions |
| `data/`, `ml/`, `.py` | Data/ML | **Sonnet** | Complex but not architectural |
| `.ts`, `.tsx`, `.js`, `.jsx` | Source Code | **Sonnet** | Coding work, balanced reasoning |
| `.md`, `.txt` | Documentation | **Haiku** | Text formatting only |
| (no paths provided) | Task classification | Per Tier Router | Falls back to keyword analysis |

**When to use**: Codebases with clear domain structure. Automatic routing with zero inspection overhead. Ideal for high-volume pipelines.

### Routing Mode 5: Budget Governor (Token Ratio Thresholds)

Dynamically routes based on remaining token budget as a percentage of total session budget.

**Thresholds:**
- If `remaining / total < 15%`: Force Haiku (conservation mode; preserve tokens for critical tasks)
- If `remaining / total >= 50%` AND task classified as Opus: Use Opus (budget permissive)
- Otherwise: Use Tier Router classification

**Budget ratio thresholds:**
- Below 15%: "budget critical" → Haiku only
- 15–50%: "moderate budget" → Sonnet or Haiku
- 50%+: "budget healthy" → Any tier permitted

**When to use**: Long-running sessions with fixed token caps. Ensures you won't run out of tokens mid-session by auto-downgrading complexity under budget pressure.

**Configuration:**
- `totalBudget`: Session token budget (default 100000)
- `opusThreshold`: Use Opus only if >= 50% remains (default 0.5)
- `haikuThreshold`: Force Haiku if < 15% remains (default 0.15)

### Using the CLI

**Classify a task:**
```bash
claudient moe classify "format the JSON output"
# → Tier: HAIKU, Confidence: 85%, Reasoning: 2 haiku keywords detected
```

**Show escalation path:**
```bash
claudient moe cascade "design a distributed system" --confidence-threshold=0.7
# → Original Tier: SONNET, Escalations: 1, Final Tier: OPUS
```

**Get expert panel vote:**
```bash
claudient moe panel "review this code" --strategy=majority
# Shows Haiku, Sonnet, Opus opinions + voting consensus
```

**Route by file domain:**
```bash
claudient moe domain "src/security/auth.ts,src/security/jwt.ts" "security audit"
# → Domain: security, Routed Tier: OPUS
```

**Budget-aware routing:**
```bash
claudient moe budget "write unit tests" --remaining 25000 --total 100000
# → Budget Ratio: 25%, Routed Tier: SONNET (below 50% threshold but above 15%)
```

**System status:**
```bash
claudient moe status
# Prints active routing modes, thresholds, tier costs
```

### Programmatic Usage

```javascript
import MoeRouter, { classifyTask, routeByDomain, budgetGovernedRouter } from './lib/moe-router.js';

// Tier Router
const result = classifyTask('design a microservices architecture');
console.log(result.tier, result.confidence);  // claude-opus-4-7, 0.85

// Domain Router
const domainRoute = routeByDomain(['src/security/auth.ts'], 'refactor');
console.log(domainRoute.tier);  // claude-opus-4-7

// Budget Governor
const governor = budgetGovernedRouter({ totalBudget: 50000 });
const budgetRoute = governor.route('write tests', 7500);  // 15% remaining
console.log(budgetRoute.tier);  // claude-haiku-4-5 (forced)
```

## Example

**Scenario**: Task is "refactor the authentication module in `src/security/auth.ts`". Session has 60,000 tokens remaining out of 100,000 total.

**Tier Router analyzes:** Keyword "refactor" suggests Sonnet → confidence 0.62

**Domain Router checks:** File path contains "security/" → Opus candidate → confidence high

**Budget Governor sees:** 60% budget remaining >= 50% threshold → Opus allowed

**Decision:** Domain signal overrides tier signal. Security files always route to Opus for maximum scrutiny.

**Final Selection:** `claude-opus-4-7`

**CLI command:**
```bash
claudient moe domain "src/security/auth.ts" "refactor the authentication module"
# → Detected Domain: security
# → Routed Tier: OPUS
# → Reasoning: security-sensitive file detected
```

**Budget impact:** At 60% budget remaining, this Opus task is acceptable. If budget had been 12% remaining, Budget Governor would force Haiku instead despite security domain (conservation mode).

---

## Tier Reference

| Model | Cost | Speed | Reasoning | When to Use |
|---|---|---|---|---|
| **Haiku** | 1x | Fastest | Limited reasoning | Formatting, classification, templating, boilerplate, simple extraction |
| **Sonnet** | 12x | Fast | Good reasoning | General coding, refactoring, documentation, orchestration, reviews |
| **Opus** | 300x | Moderate | Deep reasoning | Architecture, security, ambiguous decisions, threat modeling, complex planning |

**Cost note**: Choosing Haiku over Opus saves ~300x on tokens for simple tasks. Cascade Escalator prevents overpaying for easy work while protecting against under-speccing hard problems.
