# CLAUDE.md Starter — AI Product

Drop this into your project's `CLAUDE.md` and fill in the bracketed sections.

---

```markdown
# [Project Name] — Claude Code Instructions

## What this is
[One paragraph: what the AI product does, what model it uses, who the users are]

## Stack
- Language: [TypeScript / Python]
- Framework: [Next.js / FastAPI]
- AI: [Claude API via Anthropic SDK / OpenAI / Gemini]
- Model: [claude-sonnet-4-6 / claude-opus-4-7 / claude-haiku-4-5]
- Database: [PostgreSQL / Supabase]
- Vector DB: [Pinecone / pgvector / Weaviate] (if applicable)
- Deployment: [Vercel / AWS / Railway]

## Project structure
src/
├── app/          ← Next.js app router / FastAPI routes
├── ai/           ← All AI-related code: prompts, chains, tools
│   ├── prompts/  ← System prompts and prompt templates
│   ├── tools/    ← Tool definitions for function calling
│   └── agents/   ← Agent definitions and orchestration
├── db/           ← Database queries and migrations
├── services/     ← Business logic
└── utils/        ← Pure utilities

## AI conventions
- All system prompts live in src/ai/prompts/ — never inline in route handlers
- Always pin the model version — never use "latest" alias
- Always enable prompt caching on system prompts (cache_control: ephemeral)
- Log token usage per request for cost tracking
- Streaming responses: use SSE for responses > 1000 tokens
- Never pass user PII to the model unless the feature explicitly requires it
- Tool definitions live in src/ai/tools/ — one file per tool

## Prompt caching setup
- System prompts must use cache_control to enable caching
- Cache read = $0.30/MTok vs uncached = $3/MTok — always cache
- Invalidate cache when system prompt changes (automatic on content change)

## Cost controls
- Default model: [claude-haiku-4-5] for simple tasks, [claude-sonnet-4-6] for complex
- Max tokens: set explicit max_tokens on every request — never unlimited
- Rate limit: [X] requests per user per minute
- Budget alert: log when a single session exceeds $[X]

## Decisions (do not re-discuss)
- [Model selection rationale]
- [Why streaming vs. non-streaming]
- [Context window strategy: summarize at N tokens]
- [Tool calling vs. direct generation for structured output]

## Testing
- Unit tests for prompt construction and output parsing
- Integration tests with recorded API responses (VCR / fixtures)
- Never make real API calls in tests — costs money and is slow
- Test adversarial inputs: prompt injection, jailbreak attempts, edge cases

## Commands
- [dev command]
- [test command]
- [deploy command]

## Never do
- Never inline system prompts in route handlers
- Never make unbounded AI calls without max_tokens
- Never log full AI responses in production (may contain user PII)
- Never hardcode API keys — use environment variables
- Never call the AI model directly from UI components
```

---
