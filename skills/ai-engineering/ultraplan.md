---
name: ultraplan
description: Leverage Claude Code's ultra-deep planning mode for complex architecture decisions, multi-file refactors, and system design
allowed-tools: [Read, Write, Grep, Glob]
effort: high
updated: 2026-06-13
---

# Ultraplan Skill

## When to activate

- Designing system architecture for a new service or major feature
- Planning multi-phase refactors that span 10+ files
- Evaluating technology choices with significant trade-offs
- Breaking down ambiguous requirements into concrete implementation steps
- Creating migration plans with zero-downtime requirements

## When NOT to use

- Simple bug fixes or single-file changes
- Tasks with obvious solutions
- Quick prototyping where speed matters more than thoroughness

## Instructions

1. **Define the problem space.** What's the current state? What's the desired state? What constraints exist?

2. **Explore the codebase thoroughly.** Read relevant files, trace dependencies, understand patterns before proposing changes.

3. **Generate multiple approaches.** At minimum 3 options with pros/cons for each:
   - Option A: Minimal change (lowest risk)
   - Option B: Moderate refactor (balanced)
   - Option C: Major restructure (highest impact)

4. **Evaluate trade-offs explicitly.** For each option assess:
   - Development effort (hours/days)
   - Risk (blast radius if wrong)
   - Reversibility (how hard to undo)
   - Performance impact
   - Testing complexity

5. **Recommend with reasoning.** Pick the best option and explain WHY. Include a phased execution plan:
   ```
   Phase 1: [Low-risk foundation] → verify
   Phase 2: [Core implementation] → verify  
   Phase 3: [Integration + polish] → verify
   ```

6. **Define success criteria.** How do we know the plan worked?
   - Metrics (latency < 200ms, error rate < 0.1%)
   - Tests (specific test cases that must pass)
   - Rollback plan (how to undo if things go wrong)

## Example

```
Task: "Migrate from REST to GraphQL for our public API"

Ultraplan output:

Option A: Add GraphQL alongside REST (additive)
  Pros: Zero risk to existing clients, incremental migration
  Cons: Dual maintenance burden, 2x the surface area
  Effort: 2-3 weeks

Option B: GraphQL gateway in front of REST (strangler fig)
  Pros: No backend changes, clean client API
  Cons: Extra latency hop, gateway is new dependency
  Effort: 1-2 weeks

Option C: Full GraphQL rewrite
  Pros: Clean architecture, single API surface
  Cons: High risk, requires all clients to migrate
  Effort: 6-8 weeks

Recommendation: Option B (gateway)
Reasoning: Lowest risk while delivering client value.
Can evolve to Option A or C based on adoption.

Phase 1: Set up Apollo Server gateway → test with internal tooling
Phase 2: Add top 10 queries (covers 80% of usage) → beta testers
Phase 3: Full schema + migration guide → public launch
Phase 4: Deprecate REST endpoints → sunset after 6 months

Success: 90% of API calls go through GraphQL within 3 months.
Rollback: Remove gateway, REST continues unchanged.
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
