---
description: Generate a test harness to evaluate an LLM prompt or chain against a dataset
argument-hint: "[prompt file or description of the task being evaluated]"
---
You are building an LLM evaluation harness for the task described in $ARGUMENTS.

Read any file paths given. If a bare description is given, infer the task.

**Step 1 — Identify evaluation requirements**

Determine:
- Task type: classification, extraction, generation, RAG, tool use, multi-turn, or other
- What "correct" looks like: exact match, semantic match, rubric score, structured schema validation, or human-in-the-loop
- Failure modes worth catching: hallucination, refusal, format violation, latency, token overrun

**Step 2 — Design the test dataset schema**

Output a JSONL schema for test cases. Each record must include:
- `id`: unique string
- `input`: the user message or full prompt context (include system prompt if relevant)
- `expected`: ground truth or rubric (adapt shape to task type)
- `tags`: array of strings for filtering (e.g. `["edge-case", "language:fr"]`)

Show 3–5 representative example records covering: happy path, edge case, adversarial input.

**Step 3 — Generate the harness script**

Write a self-contained Python script using the Anthropic SDK (`anthropic` package). Requirements:
- Load test cases from `evals.jsonl`
- Call the model for each case (default: `claude-sonnet-4-6`, overridable via `--model`)
- Score each result using the appropriate evaluator:
  - Exact/regex match for structured outputs
  - Embedding cosine similarity for semantic tasks (use `sentence-transformers` if available, else skip)
  - LLM-as-judge rubric scoring for open-ended generation (self-contained, use `claude-haiku-4-5-20251001`)
- Output a results JSONL and a summary table to stdout
- Support `--sample N` flag to run on N random cases
- Use `asyncio` + `AsyncAnthropic` for parallel execution with a configurable concurrency limit

**Step 4 — CI integration snippet**

Show a GitHub Actions step that:
- Runs the harness on every PR
- Fails the check if pass rate drops below a configurable threshold (default 90%)
- Posts a summary comment with per-tag breakdowns

**Output format:**
1. Dataset schema + example records (JSONL)
2. Full Python harness (`eval_harness.py`)
3. GitHub Actions YAML snippet
4. One-line `README` usage block

No placeholder comments. Every function must be implemented.
