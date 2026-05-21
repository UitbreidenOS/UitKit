# Context Engineering

## When to activate
User wants to optimize how context is provided to Claude, reduce token usage, improve response quality through better context design, or is hitting context window limits.

## When NOT to use
- Prompt engineering for stylistic output (tone, format, persona) — that is a different concern
- RAG system architecture — retrieval pipeline design is separate from context layout
- Token counting for billing estimates — use the tokenizer API directly

## Instructions

### Progressive Disclosure
Provide only the context needed for the current step. Load additional context when the task requires it.

Do not dump an entire codebase at the start of a conversation. Instead:
1. Start with the specific file or function relevant to the task
2. Reference other files by name: "See `utils/auth.ts` for the token validation logic"
3. Add context when Claude asks or when a subtask requires it

### Structured Context vs Prose
Claude parses structure more reliably than prose paragraphs. Prefer:
- Headers (`##`) to separate distinct concerns
- Bullet points for lists of constraints, requirements, or facts
- Code blocks for all code — even short snippets
- Tables for comparisons or config options

Avoid: long prose paragraphs that bury the key instruction in the middle.

### Context Priority Order
Claude reads start-to-finish but has two attention peaks: **beginning** and **end**.

- Put critical constraints and the primary task at the very beginning
- Put the final instruction or the most important detail at the end
- Let background/supporting context occupy the middle

For a 200k context window:
| Section | Token budget |
|---|---|
| System prompt | <5,000 |
| CLAUDE.md / project rules | <2,000 |
| Task description + constraints | <10,000 |
| Reference files / documents | remainder |
| Reserve for output | ~10,000 |

### Reference, Don't Repeat
Point to a file instead of pasting it:
```
Read `src/api/routes/user.ts` — focus on the `POST /users` handler.
```
This uses 10 tokens instead of 2,000 and avoids stale context if the file changes mid-session.

Only paste file content when:
- The file cannot be read (external doc, screenshot, etc.)
- You need Claude to analyze a specific version that differs from disk
- The content is very short (<30 lines) and central to every response in the conversation

### Anti-Patterns
- **Full-file paste for a single function:** paste only the function plus its immediate imports
- **Repeating established context:** if Claude already knows X, do not re-state X in every message
- **Over-explaining what Claude knows:** do not explain what JSON is, what a REST API is, etc.
- **Vague task + huge context:** a vague instruction with 50k tokens of context produces vague output; define the task precisely first
- **Injecting raw HTML/PDF dumps:** extract and clean the relevant text before including it

### Multi-Turn Context Management
- After 10+ turns, key facts from turn 1 may receive less attention — restate critical constraints in the message where they become relevant again
- Use CLAUDE.md or a pinned system prompt for invariant project rules rather than repeating them in messages
- Compaction (Claude Code's `/compact`) summarizes history — use it before starting a new phase of a task

### Semantic Chunking for Large Documents
When you must include a large document, chunk by semantic unit not by token count:
- API docs: one section per endpoint, not arbitrary 500-token blocks
- Code: one class or one function per chunk, not split at line 500
- Prose: one argument or one topic per chunk

Label each chunk clearly so Claude can cite it: `### Section: Authentication (lines 45-89)`

## Example

**Bad context delivery:**
```
Here is my entire project (12 files pasted). I want you to fix the login bug.
```

**Good context delivery:**
```
I have a login bug: users get a 401 even with valid credentials.

Relevant file: `src/auth/login.ts` (read it)
The JWT signing key is loaded from `process.env.JWT_SECRET`.
The middleware that validates tokens is in `src/middleware/auth.ts` (read it).

The bug was introduced in commit abc123. Focus on the token validation path.
```

The second version gives Claude the right files, the failure mode, the suspected location, and a time anchor — with no wasted tokens on unrelated code.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
