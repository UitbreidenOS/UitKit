---
name: claude-api
description: "Anthropic Claude API: prompt caching, streaming, tool use, batch processing, model selection, cost optimization"
---

# Claude API Skill

## When to activate
- Writing code that calls the Anthropic Claude API (Python or TypeScript SDK)
- Implementing prompt caching, streaming, or batch processing
- Designing multi-turn conversation management
- Selecting the right Claude model (Haiku, Sonnet, Opus) for a task
- Adding tool use / function calling to a Claude integration
- Optimizing for cost or latency in a production Claude app

## When NOT to use
- OpenAI or other provider APIs — different SDK, different patterns
- Generic LLM advice unrelated to the Anthropic API
- Projects already using LangChain or LlamaIndex abstractions — address the abstraction layer instead

## Instructions

### Model selection guide
| Model | Use when | Avoid when |
|-------|----------|------------|
| `claude-haiku-4-5-20251001` | Classification, extraction, routing, simple Q&A, high-volume low-cost | Complex reasoning, multi-step code generation |
| `claude-sonnet-4-6` | General-purpose: code, analysis, writing, agentic workflows | Token-constrained budgets at massive scale |
| `claude-opus-4-7` | Expert-level reasoning, nuanced judgment, complex long-form | Most tasks — usually Sonnet is sufficient |

### Basic message call (Python)
```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a helpful assistant specialized in Python.",
    messages=[
        {"role": "user", "content": "Explain Python's GIL in 3 sentences."}
    ]
)
print(message.content[0].text)
```

### Prompt caching (critical for cost)
Prompt caching can reduce costs by up to 90% for repeated context. Cache stable content (system prompts, large documents, few-shot examples).

```python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a code review assistant. Here are our coding standards: ...",
            "cache_control": {"type": "ephemeral"}  # Cache this block
        }
    ],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": large_document,
                    "cache_control": {"type": "ephemeral"}  # Also cache the document
                },
                {
                    "type": "text",
                    "text": "Summarize the key points."
                }
            ]
        }
    ]
)
# Check cache usage in response
print(message.usage.cache_read_input_tokens)   # tokens read from cache
print(message.usage.cache_creation_input_tokens)  # tokens written to cache
```

Cache rules:
- Minimum cacheable block: 1024 tokens (Sonnet/Opus), 2048 tokens (Haiku)
- Cache TTL: 5 minutes
- Only the last `cache_control` block in a message array matters — cache points are cumulative

### Streaming
```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Or with events:
with client.messages.stream(...) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="")
        elif event.type == "message_stop":
            print()  # newline when done
```

### Tool use
```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Paris?"}]
)

# Check if Claude wants to use a tool
if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    tool_result = call_tool(tool_use.name, tool_use.input)

    # Continue conversation with tool result
    follow_up = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What's the weather in Paris?"},
            {"role": "assistant", "content": response.content},
            {
                "role": "user",
                "content": [{
                    "type": "tool_result",
                    "tool_use_id": tool_use.id,
                    "content": json.dumps(tool_result)
                }]
            }
        ]
    )
```

### Multi-turn conversation
```python
class Conversation:
    def __init__(self, system: str, model: str = "claude-sonnet-4-6"):
        self.client = anthropic.Anthropic()
        self.model = model
        self.system = system
        self.messages: list[dict] = []

    def chat(self, user_message: str, max_tokens: int = 1024) -> str:
        self.messages.append({"role": "user", "content": user_message})
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=self.system,
            messages=self.messages,
        )
        assistant_message = response.content[0].text
        self.messages.append({"role": "assistant", "content": assistant_message})
        return assistant_message
```

### Batch processing
```python
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

requests = [
    Request(
        custom_id=f"review-{i}",
        params=MessageCreateParamsNonStreaming(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            messages=[{"role": "user", "content": f"Classify: {review}"}],
        )
    )
    for i, review in enumerate(reviews)
]

batch = client.messages.batches.create(requests=requests)
print(f"Batch ID: {batch.id}")

# Poll for results (or use webhooks)
import time
while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    time.sleep(60)

for result in client.messages.batches.results(batch.id):
    print(result.custom_id, result.result.message.content[0].text)
```

### Error handling and retries
```python
from anthropic import APIStatusError, APITimeoutError, RateLimitError

def call_with_retry(client, **kwargs, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except RateLimitError:
            wait = 2 ** attempt
            time.sleep(wait)
        except APITimeoutError:
            if attempt == max_retries - 1:
                raise
            time.sleep(1)
        except APIStatusError as e:
            if e.status_code >= 500 and attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise
```

### Cost optimization checklist
- Use Haiku for classification, routing, and simple extraction tasks
- Enable prompt caching for any system prompt > 1024 tokens
- Use batch API for offline/async workloads — 50% cost reduction
- Set `max_tokens` to the minimum needed — you pay for output tokens generated
- Cache large documents in the user message, not just the system prompt
- Monitor `cache_read_input_tokens` vs `input_tokens` ratio — target >80% for stable contexts

## Example

**User:** Build a Python class that classifies customer support tickets into categories using Claude, with prompt caching for the category list and streaming for the explanation.

**Expected output:**
- `TicketClassifier` class with `ANTHROPIC_API_KEY` from env
- System prompt with all categories cached via `cache_control: ephemeral`
- `classify(ticket_text)` → returns `{category: str, confidence: str}` parsed from structured output
- `classify_and_explain(ticket_text)` → streams the explanation to stdout
- Uses `claude-haiku-4-5-20251001` for classification (cost-efficient), `claude-sonnet-4-6` for explanation

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
