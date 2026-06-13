# Migrating to Claude Opus 4.7

Claude Opus 4.7 introduces breaking changes to the Messages API alongside new capabilities. Three parameters that previously accepted non-default values now return HTTP 400. Before you update your model ID to `claude-opus-4-7`, audit your existing code for these patterns.

---

## Breaking Changes

### 1. Extended thinking budget removed

Opus 4.7 no longer accepts `budget_tokens` in the thinking config. The model manages its own thinking budget adaptively.

**Old (returns 400 on Opus 4.7):**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=[{"role": "user", "content": "..."}]
)
```

**New:**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}]
)
```

`effort` accepts `"low"`, `"medium"`, or `"high"`. Use `"high"` for complex reasoning tasks where you previously set a large `budget_tokens`. The model decides how much thinking to apply — the `effort` hint influences that decision.

---

### 2. Sampling parameters removed

`temperature`, `top_p`, and `top_k` must be omitted or left at their defaults. Passing non-default values returns HTTP 400.

**Old (returns 400 on Opus 4.7):**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    temperature=0.7,
    top_p=0.9,
    messages=[{"role": "user", "content": "..."}]
)
```

**New — remove the parameters entirely:**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}]
)
```

There is no workaround for this. Opus 4.7 does not expose sampling knobs. If your use case requires explicit temperature control, remain on Opus 4.6 or use a different model in the 4.7 family.

---

### 3. Thinking content omitted by default

Thinking blocks still execute and are streamed, but the `thinking` field in the response is empty by default. This is a change from Opus 4.6 behavior.

**To see thinking summaries:**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    messages=[{"role": "user", "content": "..."}]
)

for block in response.content:
    if block.type == "thinking":
        print("Thinking summary:", block.thinking)
    elif block.type == "text":
        print("Response:", block.text)
```

`"display": "full"` returns complete thinking output. `"display": "summarized"` returns a condensed version. `"display": "none"` (the default) omits it. Use `"summarized"` for debugging; use `"none"` in production to reduce response size.

---

## New Capabilities

### Adaptive thinking

The only supported thinking mode on Opus 4.7. Off by default — enable it for tasks that benefit from extended reasoning:

```python
# Enable — let the model decide how much to think
thinking={"type": "adaptive"}

# Enable with effort hint
thinking={"type": "adaptive"}
output_config={"effort": "high"}

# Disabled (default)
# Omit the thinking parameter entirely
```

Adaptive thinking activates automatically on complex multi-step problems when enabled. On straightforward prompts, it may use little or no extended thinking even with `effort: "high"` — the model calibrates to the task.

---

### Task budgets (beta)

An advisory cross-loop token budget. The model uses it as a guideline — it is not a hard cap, but the model will try to complete the task within the budget.

**Beta header required:** `task-budgets-2026-03-13`

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=32000,
    output_config={
        "task_budget": {
            "type": "tokens",
            "total": 128000
        }
    },
    extra_headers={"anthropic-beta": "task-budgets-2026-03-13"},
    messages=[{"role": "user", "content": "..."}]
)
```

**Minimum:** 20,000 tokens. Budgets below 20k are rejected. The budget is advisory — if the task genuinely requires more tokens, the model may exceed it rather than produce an incomplete response.

Use task budgets when orchestrating multi-step agents where runaway token consumption is a concern. Do not use them as a billing control mechanism — they are a behavioral hint, not an enforcement boundary.

---

### High-resolution image support

Opus 4.7 accepts images up to 2,576px on the longest side, with a maximum of 3.75 megapixels. This is up from 1,568px / 1.15MP on older models.

```python
# Computer use tasks benefit from the higher resolution
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": screenshot_b64
                }
            },
            {"type": "text", "text": "Click the 'Submit' button."}
        ]
    }]
)
```

The new size limit enables 1:1 pixel coordinates for computer use tasks — you can reference exact screen positions without scaling math.

If you are passing images larger than 2,576px, they will be resized server-side. Pre-resize on the client to avoid the overhead.

---

### New tokenizer

Opus 4.7 uses a new tokenizer that produces 1x–1.35x more tokens than Opus 4.6 for equivalent content. The same input text costs more tokens and the same output costs more tokens.

**Impact on `max_tokens`:** If your existing code sets `max_tokens` based on expected output length, increase it by 35% as a starting point. Responses that previously fit in 4,000 tokens may now require up to 5,400.

```python
# Old — may truncate on 4.7 if output is token-heavy
max_tokens=4096

# New — add ~35% headroom
max_tokens=5600
```

Run your eval suite on a sample of real prompts and compare output token counts before updating all your `max_tokens` values.

---

## Behavior Changes (Non-Breaking)

These are not API errors, but they will affect output quality if your prompts relied on previous behavior.

**More literal instruction following.** Opus 4.7 interprets prompts more precisely. Vague instructions that previously worked may produce unexpected results. Be explicit: instead of "clean up this code," write "remove unused variables and add type annotations to all function signatures."

**Fewer tool calls and subagents by default.** The model is more conservative about spawning subagents and calling tools. If your workflow depends on the model automatically reaching for tools, you may need to instruct it explicitly to do so.

**Response length calibrates to task complexity.** Short questions get short answers. If you require a detailed response to a simple question, instruct the model to be thorough rather than assuming it will be.

---

## Migration Checklist

- [ ] Remove `budget_tokens` from all `thinking` configs — replace with `thinking: {type: "adaptive"}`
- [ ] Remove `temperature`, `top_p`, `top_k` if set to non-default values
- [ ] Add `"display": "summarized"` to thinking config if you read thinking blocks in your application
- [ ] Increase `max_tokens` by ~35% to account for the new tokenizer
- [ ] Test image inputs: verify dimensions are within 2,576px / 3.75MP, update any coordinate calculations
- [ ] Update model ID strings: `claude-opus-4-7`
- [ ] Review prompts for vague instructions — Opus 4.7 is more literal
- [ ] Check any orchestration that relies on automatic tool use — may need explicit instruction

---

## Claude Code Users

Claude Code manages the API layer for you. There are no API-level breaking changes to handle — update the model in your settings and Claude Code handles the rest.

What may require adjustment is your prompting style. Opus 4.7's more literal interpretation and more conservative tool use can affect complex multi-step sessions. If Claude Code sessions become less autonomous after the model update, add explicit instructions to your CLAUDE.md: specify which tools should be used proactively, define what "thorough" means for your codebase, and remove any ambiguous standing instructions that relied on the model inferring intent.

---
