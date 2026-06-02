# AI Agent Application (Claude + MCP) — Project Structure

> For engineers building production AI agent systems on the Anthropic SDK — optimizing the full cycle from tool definition to evaluated, observable, token-budget-aware deployment.

## Stack

- **Language / runtime:** TypeScript 5.5+, Node.js 22 LTS
- **AI SDK:** @anthropic-ai/sdk 0.30+ (streaming, tool use, prompt caching)
- **MCP client:** @modelcontextprotocol/sdk 1.x (StdioClientTransport, SSEClientTransport)
- **Schema validation:** Zod 3.23+ (tool input schemas, API request/response contracts)
- **HTTP layer:** Hono 4.x on Node.js adapter (or Express 4.x — swap in src/api/)
- **ORM:** Drizzle ORM 0.31+ with drizzle-kit for migrations
- **Database:** PostgreSQL 16 (pg driver, connection pooling via node-postgres)
- **Conversation cache:** Redis 7 (ioredis) — sliding-window message history, token budget tracking
- **Testing:** Vitest 2.x (unit + integration), @anthropic-ai/sdk mock fixtures for agent tests
- **Containerisation:** Docker 25 (multi-stage build), docker-compose v2 for local deps
- **CI/CD:** GitHub Actions (typecheck → lint → test → build → push)
- **Linting / formatting:** ESLint 9 (flat config), Prettier 3
- **Observability:** pino (structured JSON logs), OpenTelemetry Node.js SDK, Sentry Node SDK

## Directory tree

```
ai-agent-app/
├── .github/
│   └── workflows/
│       ├── ci.yml                              # typecheck, lint, vitest, coverage gate (80%)
│       ├── cd-staging.yml                      # Push to staging on merge to main
│       └── cd-production.yml                   # Deploy on semver tag push
├── docker/
│   ├── Dockerfile                              # Multi-stage: deps → build → runtime (non-root)
│   └── docker-compose.yml                      # Local: app + postgres + redis
├── drizzle/
│   ├── 0000_create_conversations.sql           # conversations + messages tables
│   ├── 0001_create_tool_calls.sql              # tool_calls audit table with input/output JSON
│   ├── 0002_create_evals.sql                   # eval_runs + eval_results tables
│   └── meta/
│       └── _journal.json                       # Drizzle migration journal (committed)
├── prompts/
│   ├── base-agent.md                           # Root system prompt — persona, capabilities, limits
│   ├── tool-use-agent.md                       # System prompt variant for heavy tool-use tasks
│   ├── summarization-agent.md                  # Focused prompt for conversation summarisation
│   └── versions/
│       ├── base-agent@v1.md                    # Archived v1 — never delete, used by evals
│       ├── base-agent@v2.md                    # Archived v2
│       └── tool-use-agent@v1.md               # Archived tool-use v1
├── evals/
│   ├── golden/
│   │   ├── tool-selection.jsonl                # Golden dataset: input → expected tool calls
│   │   ├── multi-turn-reasoning.jsonl          # Multi-turn conversations with expected outputs
│   │   └── edge-cases.jsonl                    # Refusals, ambiguous inputs, budget exhaustion
│   ├── harness/
│   │   ├── runner.ts                           # Main eval runner: loads golden set, runs agent
│   │   ├── scorer.ts                           # Exact-match + LLM-as-judge scoring functions
│   │   ├── report.ts                           # Markdown + JSON report generator
│   │   └── types.ts                            # EvalCase, EvalResult, ScoreBreakdown types
│   └── results/
│       └── .gitkeep                            # Results committed per eval run (named by date+sha)
├── src/
│   ├── agents/
│   │   ├── base-agent.ts                       # AgentRunner class: orchestrates tool loop + streaming
│   │   ├── tool-use-agent.ts                   # Extends BaseAgent with pre-configured tool subset
│   │   ├── summarization-agent.ts              # Single-turn summarisation agent (no tools)
│   │   └── types.ts                            # AgentConfig, AgentRunOptions, AgentResponse types
│   ├── tools/
│   │   ├── index.ts                            # Central tool registry: exports TOOLS array for SDK
│   │   ├── definitions/
│   │   │   ├── search-web.ts                   # Zod schema + ToolDefinition for web search
│   │   │   ├── read-file.ts                    # Zod schema + ToolDefinition for filesystem reads
│   │   │   ├── run-query.ts                    # Zod schema + ToolDefinition for SQL queries
│   │   │   ├── send-email.ts                   # Zod schema + ToolDefinition for email dispatch
│   │   │   └── create-ticket.ts                # Zod schema + ToolDefinition for Linear/Jira tickets
│   │   └── implementations/
│   │       ├── search-web.ts                   # Actual implementation: calls Brave/Tavily search API
│   │       ├── read-file.ts                    # Sandboxed filesystem read with path allowlist
│   │       ├── run-query.ts                    # Executes read-only SQL against pg pool
│   │       ├── send-email.ts                   # Calls Resend/SendGrid with validated recipients
│   │       └── create-ticket.ts                # Linear GraphQL mutation via @linear/sdk
│   ├── mcp/
│   │   ├── client.ts                           # MCP client factory: StdioClientTransport + SSEClientTransport
│   │   ├── registry.ts                         # MCPServerRegistry: loads servers from mcp.config.json
│   │   ├── tool-bridge.ts                      # Converts MCP tool schemas → Anthropic SDK ToolDefinition
│   │   └── mcp.config.json                     # Server definitions: command, args, env keys
│   ├── api/
│   │   ├── index.ts                            # Hono app factory: registers routes, middleware
│   │   ├── middleware/
│   │   │   ├── auth.ts                         # Bearer token + API key verification middleware
│   │   │   ├── ratelimit.ts                    # Redis sliding-window rate limiter
│   │   │   └── request-id.ts                   # X-Request-ID injection + pino child logger
│   │   └── routes/
│   │       ├── chat.ts                         # POST /chat — non-streaming agent invocation
│   │       ├── chat-stream.ts                  # POST /chat/stream — SSE streaming response
│   │       ├── conversations.ts                # GET /conversations, GET /conversations/:id/messages
│   │       └── health.ts                       # GET /health (liveness), GET /health/ready (readiness)
│   ├── lib/
│   │   ├── anthropic.ts                        # Singleton Anthropic client with prompt cache headers
│   │   ├── conversation-manager.ts             # Load/save conversation history from Redis + Postgres
│   │   ├── token-counter.ts                    # Count tokens via SDK beta, enforce per-turn budget
│   │   ├── prompt-loader.ts                    # Load versioned prompt from prompts/ by name + version
│   │   └── stream-handler.ts                   # Parse SSE stream chunks, emit typed events
│   ├── db/
│   │   ├── client.ts                           # Drizzle client singleton over node-postgres pool
│   │   ├── schema.ts                           # All Drizzle table definitions in one file
│   │   └── queries/
│   │       ├── conversations.ts                # findById, create, listByUser, deleteById
│   │       ├── messages.ts                     # appendMessage, getHistory, pruneOldMessages
│   │       └── tool-calls.ts                   # logToolCall, getToolCallsForRun
│   ├── types/
│   │   ├── api.ts                              # Zod schemas: ChatRequest, ChatResponse, SSEEvent
│   │   ├── conversation.ts                     # ConversationRow, MessageRow, MessageRole enum
│   │   └── tool.ts                             # ToolCallRow, ToolResult, ToolExecutionError
│   └── index.ts                                # Entry point: init MCP registry, start Hono server
├── tests/
│   ├── unit/
│   │   ├── agents/
│   │   │   ├── base-agent.test.ts              # Tool loop logic, retry, stop conditions
│   │   │   └── token-budget.test.ts            # Budget enforcement, summarisation trigger
│   │   ├── tools/
│   │   │   ├── search-web.test.ts              # Schema validation, mock API response handling
│   │   │   └── run-query.test.ts               # SQL injection guards, read-only enforcement
│   │   └── lib/
│   │       ├── conversation-manager.test.ts    # Redis round-trip, history pruning
│   │       └── token-counter.test.ts           # Counting accuracy, budget threshold logic
│   └── integration/
│       ├── chat-route.test.ts                  # POST /chat end-to-end with mocked Anthropic SDK
│       ├── stream-route.test.ts                # SSE stream correctness, early termination
│       └── agent-e2e.test.ts                   # Full agent loop with real tools (stubbed externals)
├── .claude/
│   └── commands/
│       ├── add-tool.md                         # /add-tool: scaffold new tool definition + implementation
│       ├── add-mcp-server.md                   # /add-mcp-server: add server to mcp.config.json + bridge
│       ├── run-evals.md                        # /run-evals: run harness against golden set, show diff
│       ├── archive-prompt.md                   # /archive-prompt: copy current prompt to versions/ with tag
│       └── token-budget-report.md              # /token-budget-report: query Redis for budget usage stats
├── drizzle.config.ts                           # Drizzle Kit config: schema path, out dir, pg credentials
├── tsconfig.json                               # Strict mode, paths alias (@/* → src/*), ESNext target
├── vitest.config.ts                            # Vitest: include tests/, alias, coverage via v8
├── eslint.config.js                            # ESLint flat config: typescript-eslint recommended + custom
├── .env.example                                # All env vars with descriptions, no real values
├── .env.test                                   # Test DB/Redis URLs — committed, no secrets
└── package.json                                # Scripts: dev, build, start, test, lint, db:migrate, eval
```

## Key files explained

| Path | Purpose |
|---|---|
| `src/lib/anthropic.ts` | Singleton `Anthropic` client configured with `anthropic-beta: prompt-caching-2024-07-31`; wraps `messages.create` and `messages.stream` with automatic `cache_control: { type: "ephemeral" }` injection on the system prompt block; re-exports types |
| `src/agents/base-agent.ts` | `AgentRunner` class that owns the agentic tool loop: calls the API, dispatches tool results, checks token budget via `TokenCounter`, triggers summarisation when budget is at 70%, halts at 95% |
| `src/tools/index.ts` | Central registry that assembles the `TOOLS` array passed to `messages.create`; imports all `ToolDefinition` objects from `definitions/`; provides `executeTool(name, input)` dispatcher to `implementations/` |
| `src/mcp/tool-bridge.ts` | Converts an MCP `ListToolsResult` into Anthropic SDK `Tool[]` objects; handles JSON Schema → Zod coercion for runtime validation of MCP tool inputs before dispatch |
| `src/lib/conversation-manager.ts` | Loads message history from Redis (hot, last 20 turns) and falls back to Postgres for older turns; writes new messages atomically; enforces sliding-window eviction keyed on `conversationId` |
| `src/lib/token-counter.ts` | Uses `client.beta.messages.countTokens` to measure token usage before each API call; stores per-conversation running totals in Redis; exposes `isNearBudget(threshold)` and `mustSummarise()` helpers |
| `drizzle/0001_create_tool_calls.sql` | Audit table capturing every tool invocation: `tool_name`, `input` (JSONB), `output` (JSONB), `duration_ms`, `error` — feeds the eval harness and observability dashboards |
| `evals/harness/runner.ts` | Loads `.jsonl` golden files, runs each case through the agent with a fixed model and prompt version, collects `AgentResponse`, passes to `scorer.ts`; exits non-zero if pass rate drops below threshold |

## Quick scaffold

```bash
# Prerequisites: Node.js 22+, Docker, pnpm (npm install -g pnpm)
PROJECT=ai-agent-app
mkdir -p $PROJECT && cd $PROJECT

# Init Node project
pnpm init
pnpm add @anthropic-ai/sdk @modelcontextprotocol/sdk zod hono \
  drizzle-orm pg ioredis pino \
  @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node \
  @sentry/node

pnpm add -D typescript @types/node @types/pg \
  vitest @vitest/coverage-v8 \
  drizzle-kit \
  eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  prettier tsx

# Directory structure
mkdir -p .github/workflows
mkdir -p docker
mkdir -p drizzle/meta
mkdir -p prompts/versions
mkdir -p evals/golden evals/harness evals/results
mkdir -p src/agents src/tools/definitions src/tools/implementations
mkdir -p src/mcp
mkdir -p src/api/middleware src/api/routes
mkdir -p src/lib src/db/queries src/types
mkdir -p tests/unit/agents tests/unit/tools tests/unit/lib
mkdir -p tests/integration
mkdir -p .claude/commands

# Touch source files
touch src/index.ts
touch src/agents/base-agent.ts src/agents/tool-use-agent.ts
touch src/agents/summarization-agent.ts src/agents/types.ts
touch src/tools/index.ts
touch src/tools/definitions/search-web.ts src/tools/definitions/read-file.ts
touch src/tools/definitions/run-query.ts src/tools/definitions/send-email.ts
touch src/tools/definitions/create-ticket.ts
touch src/tools/implementations/search-web.ts src/tools/implementations/read-file.ts
touch src/tools/implementations/run-query.ts src/tools/implementations/send-email.ts
touch src/tools/implementations/create-ticket.ts
touch src/mcp/client.ts src/mcp/registry.ts src/mcp/tool-bridge.ts src/mcp/mcp.config.json
touch src/api/index.ts
touch src/api/middleware/auth.ts src/api/middleware/ratelimit.ts src/api/middleware/request-id.ts
touch src/api/routes/chat.ts src/api/routes/chat-stream.ts
touch src/api/routes/conversations.ts src/api/routes/health.ts
touch src/lib/anthropic.ts src/lib/conversation-manager.ts
touch src/lib/token-counter.ts src/lib/prompt-loader.ts src/lib/stream-handler.ts
touch src/db/client.ts src/db/schema.ts
touch src/db/queries/conversations.ts src/db/queries/messages.ts src/db/queries/tool-calls.ts
touch src/types/api.ts src/types/conversation.ts src/types/tool.ts
touch evals/harness/runner.ts evals/harness/scorer.ts
touch evals/harness/report.ts evals/harness/types.ts
touch tests/unit/agents/base-agent.test.ts tests/unit/agents/token-budget.test.ts
touch tests/unit/tools/search-web.test.ts tests/unit/tools/run-query.test.ts
touch tests/unit/lib/conversation-manager.test.ts tests/unit/lib/token-counter.test.ts
touch tests/integration/chat-route.test.ts tests/integration/stream-route.test.ts
touch tests/integration/agent-e2e.test.ts
touch prompts/base-agent.md prompts/tool-use-agent.md prompts/summarization-agent.md
touch .env.example .env.test

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*", "evals/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

# drizzle.config.ts
cat > drizzle.config.ts << 'EOF'
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
EOF

# vitest.config.ts
cat > vitest.config.ts << 'EOF'
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: { provider: "v8", thresholds: { lines: 80 } },
  },
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
});
EOF

# docker-compose for local dev
cat > docker/docker-compose.yml << 'EOF'
version: "3.9"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: agent
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: agent_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U agent"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
EOF

# package.json scripts section (merge into pnpm init output)
cat > package.json << 'EOF'
{
  "name": "ai-agent-app",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc --noEmit false",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/ tests/ --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push",
    "eval": "tsx evals/harness/runner.ts",
    "infra:up": "docker compose -f docker/docker-compose.yml up -d",
    "infra:down": "docker compose -f docker/docker-compose.yml down"
  }
}
EOF

# .claude/commands stubs
cat > .claude/commands/add-tool.md << 'EOF'
Create a new tool with name $ARGUMENTS.
1. Add src/tools/definitions/$ARGUMENTS.ts with Zod schema + ToolDefinition export.
2. Add src/tools/implementations/$ARGUMENTS.ts with the implementation.
3. Register both in src/tools/index.ts.
4. Add tests/unit/tools/$ARGUMENTS.test.ts with happy path + validation error cases.
EOF

cat > .claude/commands/run-evals.md << 'EOF'
Run the eval harness: pnpm eval -- --golden evals/golden/ --prompt $ARGUMENTS --output evals/results/$(date +%Y%m%d)-$(git rev-parse --short HEAD).json
Print pass rate and any regressions vs the previous result file.
EOF

cat > .claude/commands/archive-prompt.md << 'EOF'
Archive the current prompt file at prompts/$ARGUMENTS.md to prompts/versions/$ARGUMENTS@$(git describe --tags --abbrev=0 2>/dev/null || echo v0).md
Then confirm the prompts/versions/ entry is referenced in the eval golden set header.
EOF

echo "Scaffold complete. Next: pnpm install && pnpm infra:up && pnpm db:migrate"
```

## CLAUDE.md template

```markdown
# AI Agent Application (Claude + MCP)

Production AI agent built on the Anthropic SDK with tool use, MCP server integration,
conversation memory, token budget management, and an eval harness.
All agent logic is in src/agents/. Tools live in src/tools/. MCP config in src/mcp/.

## Stack

- @anthropic-ai/sdk 0.30+ — messages.create + messages.stream; prompt caching enabled
- @modelcontextprotocol/sdk 1.x — StdioClientTransport for local servers, SSEClientTransport for remote
- Zod 3.23 — all tool input schemas defined in src/tools/definitions/; validated before dispatch
- Hono 4 on Node.js — HTTP API in src/api/; streaming via SSE on POST /chat/stream
- Drizzle ORM 0.31 + PostgreSQL 16 — schema in src/db/schema.ts; migrations in drizzle/
- ioredis — conversation cache in src/lib/conversation-manager.ts; token budget in src/lib/token-counter.ts
- Vitest 2 — unit tests mocking Anthropic SDK; integration tests with stub tool implementations

## Adding a new tool (exact steps)

1. **Define the schema** — create `src/tools/definitions/<tool-name>.ts`:
   - Export a `const toolDefinition: Tool` (Anthropic SDK type)
   - Define input schema as a Zod object; export as `<ToolName>Input`
   - Use `zodToJsonSchema` from `zod-to-json-schema` for the `input_schema` field

2. **Write the implementation** — create `src/tools/implementations/<tool-name>.ts`:
   - Export `async function execute(input: <ToolName>Input): Promise<string>`
   - Parse and validate input with `<ToolName>Input.parse(raw)` at the top
   - Return a plain string (JSON-serialised if structured data)
   - Throw `ToolExecutionError` from `src/types/tool.ts` on failure (not generic Error)

3. **Register** — in `src/tools/index.ts`:
   - Import the definition and add to the `TOOLS` array
   - Add a `case "<tool-name>":` branch in `executeTool()` switch

4. **Test** — create `tests/unit/tools/<tool-name>.test.ts`:
   - Test happy path, Zod validation rejection, and ToolExecutionError propagation
   - Mock all external API calls; never make real network calls in unit tests

## Adding an MCP server

1. Add the server entry to `src/mcp/mcp.config.json`:
   ```json
   {
     "servers": {
       "<server-name>": {
         "transport": "stdio",
         "command": "npx",
         "args": ["-y", "@org/mcp-server-name"],
         "env": { "API_KEY": "${MCP_SERVER_API_KEY}" }
       }
     }
   }
   ```
2. Add the required env var to `.env.example` with a description.
3. The `MCPServerRegistry` in `src/mcp/registry.ts` auto-loads on startup — no code change needed.
4. `tool-bridge.ts` converts the MCP tool list to Anthropic `Tool[]` objects automatically.
5. Verify with: `pnpm dev` then `curl -X POST /health/ready` — the MCP server must appear in the readiness check output.

## Prompt versioning convention

- Active prompts live at `prompts/<name>.md` — edit these for live changes.
- Before any prompt change that affects eval results, run `/archive-prompt <name>` to snapshot the current version to `prompts/versions/<name>@<tag>.md`.
- Golden eval cases reference a specific version in their header: `{ "prompt_version": "base-agent@v2" }`.
- The eval harness (`evals/harness/runner.ts`) loads the versioned file — never the live `prompts/` file.
- Prompt format inside `.md` files: plain text system prompt, no frontmatter, no markdown headers. The `prompt-loader.ts` reads the file as-is.

## Eval harness usage

```bash
# Run full eval suite against current prompts and model
pnpm eval

# Run against a specific golden file
pnpm eval -- --golden evals/golden/tool-selection.jsonl

# Run against a specific prompt version (reads from prompts/versions/)
pnpm eval -- --prompt base-agent@v2

# Compare two runs
diff evals/results/<old>.json evals/results/<new>.json | jq .

# CI gate: fails if pass rate < 90%
pnpm eval -- --threshold 0.90
```

Golden dataset format (`.jsonl`, one JSON object per line):
```json
{ "id": "ts-001", "prompt_version": "base-agent@v2", "input": [{"role": "user", "content": "Search for Q3 revenue data"}], "expected_tools": ["search-web"], "expected_output_contains": ["revenue"] }
```

Scoring: exact tool-name match scores 1.0; LLM-as-judge on output content scores 0.0–1.0.
Final case score = 0.5 * tool_score + 0.5 * output_score.

## Token budget management

The `TokenCounter` in `src/lib/token-counter.ts` enforces a configurable budget per conversation.

```typescript
// Default budgets (override via env)
MAX_CONVERSATION_TOKENS=100000   // Hard limit per conversation
SUMMARISE_THRESHOLD=0.70         // Trigger summarisation at 70%
REFUSE_THRESHOLD=0.95            // Refuse new turns at 95%
```

When `isNearBudget(0.70)` returns true, the agent calls `summarization-agent.ts`
to compress history into a single assistant message before continuing.

When `mustSummarise()` (>95%) returns true, the API call is blocked and the caller
receives a `429 Token budget exhausted` response with the `Retry-After` header set
to when the conversation resets (daily by default).

Check per-conversation usage: `GET /conversations/:id` returns `token_usage` in the response.

## Streaming vs non-streaming

Use `POST /chat/stream` (SSE) when:
- Response may exceed 2 seconds (most multi-tool agent runs)
- Client is a browser or CLI that can consume SSE
- You want tool-call progress events before the final response

Use `POST /chat` (non-streaming) when:
- Caller is a server-to-server integration expecting a JSON body
- Response is expected to be short (single tool call, simple Q&A)
- You need the complete response for logging before returning to the client

Streaming implementation: `src/lib/stream-handler.ts` wraps `client.messages.stream()`,
emits typed `SSEEvent` objects (`tool_start`, `tool_result`, `text_delta`, `done`),
and flushes via Hono's `streamSSE` helper. Non-streaming uses `client.messages.create()`
and awaits the full `Message` object.

## Running the stack locally

```bash
pnpm infra:up          # Start PostgreSQL + Redis in Docker
pnpm db:migrate        # Apply Drizzle migrations
pnpm dev               # Start Hono server with tsx watch on :3000
pnpm test              # Run Vitest suite
pnpm test:coverage     # Coverage report (target: 80%)
pnpm eval              # Run eval harness against golden datasets
pnpm db:studio         # Open Drizzle Studio at localhost:4983
```

## What not to do

- Do not call `client.messages.create` directly in routes — always go through `AgentRunner`
- Do not skip Zod validation on tool inputs — `executeTool()` validates before dispatch, never after
- Do not store raw conversation messages only in Redis — always flush to Postgres via `conversation-manager.ts`
- Do not edit files in `prompts/versions/` — they are immutable archives; the eval harness depends on them
- Do not add tools that make write operations (DB writes, email sends) without a dry_run parameter
- Do not use `model: "claude-opus-4-5"` for evals — always pin to `claude-sonnet-4-5` to control cost
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/ai-agent-app"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == *.ts ]]; then npx prettier --write \"$FILE\" 2>/dev/null || true; npx eslint --fix \"$FILE\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"pnpm eval|tsx evals\"; then echo \"[HOOK] Eval run starting — ensure ANTHROPIC_API_KEY is set and infra is up.\" >&2; if [ -z \"$ANTHROPIC_API_KEY\" ]; then echo \"[ERROR] ANTHROPIC_API_KEY not set. Evals will fail.\" >&2; exit 1; fi; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && UNTYPED=$(npx tsc --noEmit 2>&1 | grep -c \"error TS\" || true); if [ \"$UNTYPED\" -gt 0 ]; then echo \"[Reminder] $UNTYPED TypeScript error(s) detected — run pnpm typecheck to review.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill backend/typescript/hono-api
npx claudient add skill backend/typescript/drizzle-orm
npx claudient add skill backend/typescript/zod-schemas
npx claudient add skill data-ml/ai/anthropic-tool-use
npx claudient add skill data-ml/ai/mcp-server-integration
npx claudient add skill data-ml/ai/prompt-versioning
npx claudient add skill data-ml/ai/eval-harness
npx claudient add skill productivity/test-generator
npx claudient add skill productivity/security-audit
npx claudient add skill git/pr-description
```

## Related

- [Building AI Agents Guide](../guides/building-ai-agents.md)
- [Anthropic Tool Use Workflow](../workflows/anthropic-tool-use.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
