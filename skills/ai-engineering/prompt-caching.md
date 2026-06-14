---
name: prompt-caching
description: Optimize Claude API costs and latency with prompt caching strategies
updated: 2026-06-13
---

# Prompt Caching

## When to activate
Claude API usage with repeated large context blocks — system prompts, prepended documents, large tool definitions — or when the user wants to reduce API costs or latency for workloads that reuse the same context across multiple calls.

## When NOT to use
- Single-shot API calls with no repeated context
- Conversations where the system prompt changes every request
- Contexts smaller than 1024 tokens (Claude 3) or 2048 tokens (Claude 3.5+ Haiku) — below these thresholds, caching has no effect

## Instructions

### How Prompt Caching Works
Cache breakpoints mark content blocks as eligible for caching. When Anthropic's infrastructure sees the same prefix again (up to the breakpoint), it reads from cache instead of reprocessing.

- **Cache write cost:** 1.25× standard input token price
- **Cache read cost:** 0.1× standard input token price
- **Break-even point:** ~9 reads of the same content
- **Default TTL:** 5 minutes
- **Extended TTL:** 1 hour — set `ENABLE_PROMPT_CACHING_1H=1` as an environment variable (beta)

### cache_control Syntax
Add `"cache_control": {"type": "ephemeral"}` to the last content block you want included in the cache prefix:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "<your large system prompt here — must be >1024 tokens to cache>",
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=[{"role": "user", "content": "What does the system prompt say about X?"}],
)
```

### Where to Place Breakpoints

**System prompt (always cache if >1024 tokens):**
```python
system=[
    {"type": "text", "text": base_instructions},          # not cached
    {"type": "text", "text": large_doc, "cache_control": {"type": "ephemeral"}},  # cache up to here
]
```

**Large document prepended to conversation:**
```python
messages=[
    {
        "role": "user",
        "content": [
            {"type": "text", "text": large_reference_doc, "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": "Now answer this question about the document above: ..."},
        ],
    }
]
```

**Tool definitions (cache when using many tools):**
```python
tools=[
    # ... all your tool definitions ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "cache_control": {"type": "ephemeral"},  # cache everything up to and including this tool
    }
]
```

### Multi-Turn Caching
In a multi-turn conversation, the messages array grows with each turn. Place the cache breakpoint at the end of the tools array or system prompt — the messages array is handled automatically by Anthropic's caching infrastructure as the conversation grows.

Do not add `cache_control` to every message — add it only to the large static content at the top of the context. Anthropic caches everything up to the last breakpoint in the prefix.

### Measuring Cache Effectiveness
Check `usage` in the response:
```python
print(response.usage)
# Usage(
#   input_tokens=850,
#   cache_creation_input_tokens=12500,   # tokens written to cache (first call)
#   cache_read_input_tokens=12500,       # tokens read from cache (subsequent calls)
#   output_tokens=200
# )
```

A healthy multi-turn session should show `cache_creation_input_tokens > 0` only on the first call and `cache_read_input_tokens > 0` on all subsequent calls.

### Cost Calculation Example
System prompt: 15,000 tokens. 50 user messages processed per hour.

| Scenario | Cost per call | Cost/hour (50 calls) |
|---|---|---|
| No caching | 15,000 × $3/MTok | $2.25 |
| With caching (after break-even) | 15,000 × $0.30/MTok | $0.225 |

10× cost reduction for large, frequently-reused context.

### Common Mistakes
- Placing the breakpoint too early — content after the breakpoint is re-processed every call
- Adding breakpoints inside the messages array on short turns — the minimum cacheable size won't be hit
- Forgetting that cache TTL is 5 minutes — a 10-minute batch job will lose the cache mid-run (use extended TTL)
- Using caching for unique per-request content — caching only helps when the prefix is identical across calls

## Example

A document Q&A system processes 200 questions against the same 80-page PDF per day:

```python
# Load and cache the document once per session
doc_text = extract_text_from_pdf("report.pdf")  # ~50,000 tokens

def ask_question(question: str) -> str:
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"<document>\n{doc_text}\n</document>",
                        "cache_control": {"type": "ephemeral"},
                    },
                    {"type": "text", "text": question},
                ],
            }
        ],
    )
    return response.content[0].text

# Call 1: cache_creation_input_tokens=50000 (1.25× price)
# Calls 2-200: cache_read_input_tokens=50000 (0.1× price)
# Net savings vs no caching: ~88% on document tokens
```

---
