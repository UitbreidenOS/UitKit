---
name: model-tiering
description: "Automatically route and tier developer prompts across Opus, Sonnet, and Haiku based on task characteristics"
updated: 2026-06-23
---

# Automatic Model Tiering Skill

## When to activate

- Optimizing token costs during multi-step coding agent execution.
- Dynamically allocating model weights during large refactoring runs.
- Resolving complex planning tasks before generating implementation code.
- Triggering fallback configurations when high-reasoning tasks fail on smaller models.

## When NOT to use

- Fast interactive chats where switching models adds noticeable latency.
- Explicit developer model overrides (e.g. `--model sonnet`).

## Instructions

To route tasks dynamically, classify developer queries into one of the three following tiers:

### 1. The Reasoning Tier (Opus/Thinking Model)
- **Scope**: Large architectural changes, safety audits, complex algorithm designs, cross-cutting concerns.
- **Criteria**: High structural risk, requires reasoning over long context windows.
- **Implementation**:
  ```python
  def route_to_reasoning(task_ctx):
      return {
          "model": "claude-3-opus",
          "temperature": 0.2,
          "max_tokens": 4096,
          "system_prompt": "Focus entirely on planning and mathematical correctness."
      }
  ```

### 2. The Planning Tier (Sonnet)
- **Scope**: Middle-layer APIs, refactoring local functions, layout designs, and creating step-by-step implementation tasks.
- **Criteria**: Mid-level complexity, follows existing architecture patterns.
- **Implementation**:
  ```python
  def route_to_planning(task_ctx):
      return {
          "model": "claude-3-5-sonnet",
          "temperature": 0.3,
          "max_tokens": 4096
      }
  ```

### 3. The Coding Tier (Haiku)
- **Scope**: Writing boilerplate code, documentation, straightforward unit tests, script modifications.
- **Criteria**: Single-file changes, low architectural complexity, repeatable code patterns.
- **Implementation**:
  ```python
  def route_to_coding(task_ctx):
      return {
          "model": "claude-3-haiku",
          "temperature": 0.0,
          "max_tokens": 4096
      }
  ```

---

## Example

```typescript
// Routing pipeline orchestrator
import { getTaskComplexity } from "./complexity-analyzer";

export async function executeTaskWithMoE(task: string) {
  const complexity = getTaskComplexity(task);
  
  if (complexity.score > 0.8) {
    const plan = await callModel("claude-3-opus", `Plan this task: ${task}`);
    const code = await callModel("claude-3-5-sonnet", `Write code for plan: ${plan}`);
    return { plan, code };
  } else {
    return callModel("claude-3-haiku", `Write snippet: ${task}`);
  }
}
```
