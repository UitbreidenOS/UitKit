# Multi-Agent Patterns Guide

Design patterns for building reliable multi-agent systems with Claude Code.

## When to use multi-agent patterns

Use multiple agents when:
- A task has genuinely independent sub-tasks that can run in parallel
- Different sub-tasks require different expertise or context
- The task is too large to fit in a single context window
- You need redundant checks (multiple agents reviewing the same output)
- Different parts of the task require different tool access levels

Don't use multiple agents when:
- A single agent can handle the task — orchestration overhead isn't free
- Sub-tasks have complex dependencies (better to use sequential prompting)
- The task requires continuous shared state (agents can't share memory easily)

## Pattern 1: Parallel Workers

**When:** Multiple independent tasks of the same type.

```typescript
// Claude Code — spawn agents in parallel for independent tasks
// Example: translate a skill file into 4 languages simultaneously

const translationTasks = ['fr', 'de', 'nl', 'es'].map(lang =>
  Agent({
    description: `Translate to ${lang}`,
    model: 'haiku',  // use smaller model for translation
    prompt: `Translate this skill file to ${lang}: [content]`
  })
)

// All 4 run in parallel — 4x faster than sequential
const [fr, de, nl, es] = await Promise.all(translationTasks)
```

**Rules:**
- Each agent must be fully self-contained (all context in the prompt)
- No agent should depend on another's output
- Use cheaper models for simpler tasks

## Pattern 2: Pipeline (Sequential Handoff)

**When:** Each stage's output is the next stage's input.

```
Research Agent → Analysis Agent → Writing Agent → Review Agent
```

```typescript
// Stage 1: research
const research = await Agent({
  prompt: 'Research the competitive landscape for [topic]. Output structured findings.'
})

// Stage 2: analysis (uses stage 1's output)
const analysis = await Agent({
  prompt: `Analyse these research findings and identify key strategic insights:
  ${research.output}`
})

// Stage 3: write (uses stage 2's output)
const draft = await Agent({
  prompt: `Write a strategic brief based on this analysis:
  ${analysis.output}`
})

// Stage 4: review (independent check)
const reviewed = await Agent({
  prompt: `Review this brief for accuracy, clarity, and strategic gaps:
  ${draft.output}`
})
```

**Rules:**
- Each stage validates the previous stage's output before proceeding
- Include explicit pass/fail criteria at each handoff
- Define what to do if a stage fails (retry, skip, alert)

## Pattern 3: Specialist + Generalist

**When:** A general task but specific parts require deep expertise.

```
Generalist Agent (coordinates)
├── Security Specialist Agent (auth code)
├── Performance Specialist Agent (database queries)
└── UX Specialist Agent (user-facing copy)
```

```typescript
const [securityReview, perfReview, uxReview] = await Promise.all([
  Agent({
    description: 'Security review',
    prompt: `Review this code for security vulnerabilities. Focus on: auth, injection, data exposure.
    Code: ${authCode}`
  }),
  Agent({
    description: 'Performance review', 
    prompt: `Review these database queries for performance issues. Focus on: N+1, missing indexes.
    Code: ${dbCode}`
  }),
  Agent({
    description: 'UX review',
    prompt: `Review this copy for clarity and conversion. Focus on: CTA text, error messages.
    Copy: ${uiCopy}`
  })
])

// Synthesise findings
const synthesis = await Agent({
  prompt: `Combine these specialist reviews into a prioritised action list:
  Security: ${securityReview}
  Performance: ${perfReview}
  UX: ${uxReview}`
})
```

## Pattern 4: Redundant Verification

**When:** Correctness is critical and errors are costly.

```typescript
// Same task, two independent agents, compare outputs
const [agent1Result, agent2Result] = await Promise.all([
  Agent({ prompt: reviewPrompt }),
  Agent({ prompt: reviewPrompt })
])

// Compare for agreement
if (agent1Result.verdict !== agent2Result.verdict) {
  // Disagreement — escalate to human or use a third agent as tiebreaker
  const tiebreaker = await Agent({
    prompt: `Two reviewers disagreed. Reconcile:
    Reviewer 1: ${agent1Result}
    Reviewer 2: ${agent2Result}
    Provide the correct conclusion.`
  })
}
```

**When to use:** Security reviews, legal risk assessments, financial calculations, medical information.

## Pattern 5: Map-Reduce

**When:** Process a large dataset in parallel, then aggregate.

```typescript
// Map: process each chunk independently
const chunks = splitIntoChunks(largeDocument, chunkSize)
const chunkResults = await Promise.all(
  chunks.map(chunk => Agent({
    model: 'haiku',
    prompt: `Extract key entities and claims from this section: ${chunk}`
  }))
)

// Reduce: aggregate all chunk results
const finalSummary = await Agent({
  model: 'sonnet',
  prompt: `Synthesise these section analyses into a unified summary:
  ${chunkResults.join('\n\n')}`
})
```

## Agent communication best practices

**Design for statelessness:**
- Each agent receives all context it needs in the prompt
- Agents don't share memory or state between invocations
- Output is the only communication channel between agents

**Explicit output contracts:**
```typescript
// Tell agents exactly what format to output
prompt: `
Analyse this code for bugs.

Output ONLY valid JSON in this exact format:
{
  "bugs": [{"severity": "high|medium|low", "description": "string", "line": number}],
  "summary": "string"
}
`

// Then validate the output
const result = outputSchema.parse(JSON.parse(agentOutput))
```

**Error handling:**
```typescript
try {
  const result = await Agent({ prompt })
  return parseOutput(result)
} catch (error) {
  // Agent failed — decide: retry, use fallback, or escalate
  if (isRetryable(error)) {
    return await retryWithBackoff(() => Agent({ prompt }), 3)
  }
  throw new AgentError(`Agent failed for task: ${taskDescription}`, { cause: error })
}
```

## Cost management

- Use Haiku for extraction, translation, classification (high volume, simple tasks)
- Use Sonnet for reasoning, writing, analysis (default for most tasks)
- Use Opus for critical decisions, complex code review (high stakes only)
- Run expensive agents only once — cache or store their outputs

## Pattern 6: Fan-out / Fan-in

Dispatch N independent agents in parallel, aggregate results:
```python
# Pseudocode — spawn all at once, collect results
agents = [Agent(task=f"audit {service}") for service in services]
results = await asyncio.gather(*agents)  # parallel
summary = aggregate(results)
```
Use when: N independent tasks, no dependencies between them.

## Pattern 7: Sequential Pipeline

Output of agent A feeds into agent B:
```
Agent A: research → structured findings
Agent B: takes findings → implementation plan
Agent C: takes plan → code
```
Use when: later steps depend on earlier results.

## Pattern 8: Specialist Routing

Classify the task first, then route to the right specialist:
```
Classifier agent → security? → security-auditor agent
                 → data?     → data-pipeline-architect
                 → frontend? → senior-frontend agent
```

## Pattern 9: Validation Chain

Implementation agent → reviewer agent → security agent, each gating the next.

## Background Agent Isolation

**`worktree.bgIsolation: "none"`**
Background agents normally work in isolated git worktrees. Disable with `worktree.bgIsolation: "none"` in `.claude/settings.json` when git worktrees aren't practical for your repo structure.

## Structured Communication Between Agents

Always use JSON for agent-to-agent data. Pass minimal context — only what the receiving agent needs. Never pass full conversation history (token overhead). Use a structured schema:
```json
{"task": "...", "findings": [...], "next_action": "..."}
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
