---
name: caveman
description: "Token compression via caveman mode: ~65% output reduction, caveman-compress, cavecrew subagents"
updated: 2026-06-13
---

# Caveman Mode Skill

## When to activate
- You want to dramatically reduce token usage across a long session
- Context window is filling up and you need to extend the session's useful life
- You're running a cost-sensitive workload (many parallel agents, batch processing)
- Claude's responses are verbose and you want terse, fragment-style output
- You want to compress existing memory or CLAUDE.md files to reduce input tokens

## When NOT to use
- Security warnings or irreversible action confirmations — these need full sentences
- Multi-step sequences where fragment ambiguity could cause misread actions
- Onboarding new team members to a codebase — clarity beats brevity here
- Writing documentation that external people will read

## Instructions

Caveman mode is an established token-compression technique with a dedicated implementation at [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman). This skill is a pointer — use the original repo, do not duplicate it.

### What it does

Caveman mode instructs Claude to output compressed, fragment-style prose:

| Level | Rule | Example |
|-------|------|---------|
| `lite` | Drop filler and hedging, keep articles and full sentences | "The function handles edge cases." |
| `full` | Drop articles, fragments OK, short synonyms | "func handles edge cases" |
| `ultra` | Abbreviate prose words, strip conjunctions, arrows for causality | "fn→edge cases handled" |

Benchmarked results (March 2026, [arxiv.org/abs/2604.00025](https://arxiv.org/abs/2604.00025)):
- ~65% output token reduction
- 26-point accuracy improvement on benchmarks (brevity sharpens reasoning)
- 100% technical accuracy maintained

### caveman-compress sub-skill
Rewrites `.md` memory and CLAUDE.md files to caveman prose — ~46% input token savings every session because compressed files are re-read on every context load.

### cavecrew subagents
Haiku-based subagents running in caveman mode — ~60% fewer tokens than vanilla agents for simple classification, extraction, and routing tasks.

### caveman-shrink MCP middleware
Compresses MCP tool descriptions before they enter Claude's context — reduces MCP overhead by ~30% without changing tool behaviour.

## Example

**Activating caveman mode in a session:**
```
Use caveman mode (full level) for this session. Drop articles, use fragments,
short synonyms. Auto-revert to normal prose for: security warnings,
irreversible action confirmations, multi-step sequences.
```

**Using caveman-compress on a memory file:**
```
/caveman-compress .claude/memory/project-context.md
```

**Using cavecrew for a classification task:**
```
Spawn a cavecrew subagent (Haiku, caveman full) to classify these 200 support
tickets into 5 categories. Return only: ticket_id, category.
```

---

**Reference:** [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — the authoritative caveman implementation. Claudient references this work; it is not duplicated here.

---
