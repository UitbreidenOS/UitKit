---
description: Audit a prompt or LLM pipeline for token waste and apply targeted reductions
argument-hint: "[prompt file, chain file, or code path]"
---
Audit the prompt or pipeline at $ARGUMENTS for token inefficiency and produce an optimized version.

Read any file paths provided. If the argument is a directory, scan for `.py`, `.ts`, `.md` files containing prompt strings or LLM call sites.

**Audit dimensions — check each:**

**1. Prompt verbosity**
- Filler phrases that add tokens without adding constraint ("As an AI language model", "Of course!", "Certainly")
- Repeated instructions that appear in both system and user message
- Redundant examples that cover identical cases
- Prose instructions that could be a bulleted list at half the tokens

**2. Context window misuse**
- Full document passed when only a section is needed — flag with estimated savings
- Chat history included verbatim when a summary would suffice
- Duplicate content: same text included twice under different keys

**3. Caching opportunities**
- Identify static prompt segments (system prompt, static context, few-shot examples) that should use `cache_control: {"type": "ephemeral"}` on the Anthropic API
- Flag if the cache-eligible segment is < 1024 tokens (below the minimum cache threshold — no benefit)
- Show the restructured message array with cache blocks placed correctly

**4. Output length**
- Is `max_tokens` set? If not, flag as unbounded cost risk
- Does the prompt ask for explanation when only structured data is needed?
- Would a shorter output format (JSON vs prose, code only vs code+explanation) reduce generation cost?

**5. Model tier fit**
- Is the task using `claude-sonnet-4-6` or `claude-opus-4-7` for work that `claude-haiku-4-5-20251001` can handle at 10x lower cost?
- Classify task complexity: simple extraction/classification → Haiku; reasoning/generation → Sonnet; complex multi-step → Opus

**Output format:**

```
## Token audit summary
| Issue | Location | Est. token impact | Priority |
|-------|----------|-------------------|----------|
| ...   | ...      | ...               | H/M/L    |

## Optimized prompt / chain
<full rewritten version with changes applied>

## Caching configuration
<message array snippet showing cache_control placement, if applicable>

## Estimated savings
Before: ~N tokens/call  →  After: ~M tokens/call  (~X% reduction)
At 1000 calls/day on [model]: $Y/month savings
```

Apply all high-priority fixes directly in the output. Explain medium/low priority items but do not apply without asking.
