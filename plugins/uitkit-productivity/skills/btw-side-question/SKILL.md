---
name: "btw-side-question"
description: "- User wants to ask a quick question mid-session without it appearing in conversation history"
---

# /btw — Side Questions Without Breaking Flow

## When to activate
- User wants to ask a quick question mid-session without it appearing in conversation history
- User wants to look something up while Claude is actively working, without interrupting the main task
- User asks how to ask a side question, check something quietly, or get a one-off answer without polluting context
- User wants to use the `/btw` command or asks about the side chat overlay
- User wants to check a name, path, variable, branch, or config value mid-task without derailing the conversation

## When NOT to use
- The question requires tool access (file reads, Bash commands, web search) — `/btw` responses have no tool access
- The answer needs to influence what Claude does next in the main conversation — use a regular prompt instead so the answer lands in context
- The user wants a multi-turn side discussion — `/btw` is single response only, not a conversation thread
- The user is on the Claude web interface — `/btw` is a CLI-only feature

## Instructions

### Basic usage

```
/btw <question>
```

The question sees the full conversation context — everything Claude knows about the current session is available. The response appears as an overlay. It leaves no trace in the chat history: no user message, no assistant message, nothing. Once dismissed, it is gone.

**Dismissing the overlay:** Press Space, Enter, or Escape.

**Desktop equivalent:** `Cmd+;` opens a side chat panel with the same behavior.

### What /btw can and cannot do

| Capability | Available |
|---|---|
| Full conversation context | Yes |
| Prompt cache reuse | Yes (very low cost) |
| Tool access (Read, Bash, etc.) | No |
| Multi-turn exchange | No |
| Persists in history | No |
| Works during active Claude turn | Yes — non-blocking overlay |

### Cost

`/btw` reuses the prompt cache from the current conversation. The incremental cost is the output tokens for the response only — no re-encoding of context. For quick questions, this is effectively negligible.

### Good questions for /btw

- "What was that config variable called again?"
- "Which branch am I on in this session?"
- "What's the name of the file we refactored earlier?"
- "Remind me what the Stripe webhook env var is called in this project."
- "What does `OTEL_EXPORTER_OTLP_ENDPOINT` default to?"
- "Explain what the decorator we added earlier does — quick version."
- "What was the error message from that failed test?"
- "How many files have we modified so far?"

### Questions that belong in the main conversation

- "Read `config/database.yml` and tell me the connection pool size." — needs Read tool
- "What does `git log --oneline -10` show?" — needs Bash
- "Now that you know X, update the approach." — the answer needs to influence Claude's next action

## Example

**Scenario:** Claude is mid-way through extracting a service class. You are reading the original file on a second monitor and cannot remember which interface name was agreed on earlier in the session.

Rather than typing a message (which would appear in history and potentially distract Claude from its current work), you type:

```
/btw what did we name the new interface for the payment processor abstraction?
```

Claude responds in an overlay:

```
PaymentGateway — defined in the interfaces section around turn 12.
```

Press Space to dismiss. The main task continues uninterrupted. Nothing appears in the conversation history.

---

**Contrast with a regular prompt:**

If you asked the same question as a normal message, it would:
1. Appear in the conversation as a user turn
2. Potentially interrupt Claude's current chain of reasoning
3. Remain in context for all future turns (adding noise)
4. Count toward the conversation history that informs subsequent responses

For pure lookups with no downstream effect, `/btw` is the right tool.

---
