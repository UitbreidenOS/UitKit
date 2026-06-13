# Remote MCP Servers — Transport, Auth, and Production Operations

How to connect Claude Code to remote MCP servers: transport selection, authentication patterns, deferred tool discovery, hosting, and hardening for production.

---

## What Makes an MCP "Remote"

Local MCP servers run as a child process on the same machine as Claude Code. Remote MCP servers run somewhere else — on a cloud host, a shared internal service, or a vendor's infrastructure — and Claude Code connects to them over a network.

The distinction matters for:
- **Auth:** local processes inherit environment variables; remote servers require explicit credential passing
- **Startup cost:** local servers start with Claude Code; remote servers have network round-trip latency on every tool call
- **Sharing:** a remote MCP can serve multiple developers and environments from one deployment
- **Maintenance:** local server binaries need to be installed and updated everywhere; remote servers are upgraded centrally

---

## Transport Types

MCP 2025-11 spec defines three transport types. Understanding which one a server uses determines how you configure it and what latency characteristics to expect.

### stdio — Local Process (command field)

The original MCP transport. Claude Code spawns the server as a subprocess and communicates over stdin/stdout pipes.

```json
{
  "mcpServers": {
    "my-local-server": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Characteristics:**
- Zero network latency — IPC pipe communication
- Server process is owned by Claude Code — lifecycle tied to the session
- Auth via environment variables passed in the `env` field
- Not shareable across machines or users
- Subprocess crashes terminate the MCP connection silently

**When to use stdio:** local development tools (filesystem, git, local database), tools that need access to the local machine's files or processes, single-developer workflows.

---

### SSE — HTTP Streaming (legacy remote)

Server-Sent Events over HTTP. The client holds a persistent HTTP connection open; the server pushes events down it. SSE was the first remote MCP transport and remains the most widely supported as of mid-2026.

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_TOKEN"
      }
    }
  }
}
```

**Characteristics:**
- HTTP/1.1 compatible — works through most proxies and firewalls
- Persistent connection — server can push tool results incrementally
- Headers are sent with the initial connection request
- Reconnect behavior is automatic in Claude Code (with exponential backoff)
- SSE connections are unidirectional from server to client — tool invocations go back over a separate POST channel

**Latency profile:** 50–300ms additional latency per tool call vs stdio, depending on server geography and connection reuse.

---

### Streamable-HTTP — New Default (MCP 2025-11)

The MCP 2025-11 spec introduced streamable-HTTP as the preferred remote transport. It uses standard HTTP POST requests with streaming response bodies, eliminating the awkward SSE dual-channel pattern.

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "http",
      "url": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN"
      }
    }
  }
}
```

**Characteristics:**
- Each tool call is a single POST request with a streaming response
- No persistent connection required — works well behind HTTP/2 load balancers
- Simpler server implementation than SSE (no dual-channel management)
- Stateless from the infrastructure perspective — easy to scale horizontally
- Supports session tokens via the `Mcp-Session-Id` response header for stateful servers that need it

**When to use streamable-HTTP over SSE:**
- Hosting behind Cloudflare Workers or any edge runtime (SSE persistent connections are problematic there)
- High-concurrency multi-tenant deployments
- Any new server you are writing yourself — prefer streamable-HTTP

**Compatibility note:** Claude Code supports both `"transport": "sse"` and `"transport": "http"`. Older servers that only speak SSE will continue to work. New vendor MCPs launched after the 2025-11 spec are increasingly using streamable-HTTP.

---

## Remote MCP Configuration in settings.json

The `"url"` field signals a remote connection. The `"command"` field signals a local stdio process. Never use both in the same server entry.

**Settings.json location:**
- Project-level: `.claude/settings.json` (checked into repo — avoid embedding tokens here)
- User-level: `~/.claude/settings.json` (machine-local — safe for personal tokens)
- System-level: `/etc/claude/settings.json` (managed by admins for shared environments)

**Full remote server config structure:**
```json
{
  "mcpServers": {
    "server-name": {
      "transport": "sse",
      "url": "https://hostname/path",
      "headers": {
        "HeaderName": "value"
      },
      "timeout": 30000,
      "connectionTimeout": 10000
    }
  }
}
```

| Field | Required | Purpose |
|---|---|---|
| `transport` | No (defaults to `"sse"`) | `"sse"` or `"http"` |
| `url` | Yes | Full URL to the MCP endpoint |
| `headers` | No | HTTP headers sent with every request |
| `timeout` | No | Tool call timeout in milliseconds (default 30000) |
| `connectionTimeout` | No | Initial connection timeout in milliseconds |

---

## Auth Patterns

### OAuth 2.0 Bearer Tokens

The standard auth pattern for vendor-hosted remote MCPs. You obtain a token from the service's OAuth flow or API key page, then pass it as an Authorization header.

```json
{
  "mcpServers": {
    "github-copilot": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ghp_YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

**Token sourcing:** Never hardcode tokens in `.claude/settings.json` if the file is checked into version control. Use environment variable interpolation instead:

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

Claude Code expands `${VAR_NAME}` from the process environment before making the connection. Set the variable in your shell profile or in the `env` section of your user-level settings.

**OAuth 2.0 PKCE flow (browser-based auth):** Some remote MCPs (Supabase remote, GitHub MCP) support browser-based OAuth. When configured with `"auth": "oauth"` and no explicit token, Claude Code opens a browser window for the OAuth flow and stores the resulting token in the system keychain.

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "auth": "oauth"
    }
  }
}
```

---

### API Key in Custom Header

Some services use a custom header name rather than `Authorization`. Cloudflare, Vercel, and several internal enterprise MCPs follow this pattern.

```json
{
  "mcpServers": {
    "cloudflare": {
      "transport": "http",
      "url": "https://mcp.cloudflare.com/mcp",
      "headers": {
        "X-Auth-Key": "${CLOUDFLARE_API_KEY}",
        "X-Auth-Email": "${CLOUDFLARE_EMAIL}"
      }
    }
  }
}
```

For internal MCPs, it is common to also send a service identifier or environment tag:

```json
{
  "mcpServers": {
    "internal-api": {
      "transport": "http",
      "url": "https://mcp.internal.company.com/mcp",
      "headers": {
        "X-Api-Key": "${INTERNAL_MCP_KEY}",
        "X-Environment": "production",
        "X-Client": "claude-code"
      }
    }
  }
}
```

---

### Mutual TLS (mTLS)

For enterprise environments where the server needs to verify the client's identity in addition to the client verifying the server. mTLS is configured outside the headers — it requires Claude Code to be launched with certificate environment variables set.

```bash
export MCP_CLIENT_CERT=/path/to/client.crt
export MCP_CLIENT_KEY=/path/to/client.key
export MCP_CA_CERT=/path/to/ca.crt
```

```json
{
  "mcpServers": {
    "enterprise-mcp": {
      "transport": "http",
      "url": "https://secure-mcp.corp.example.com/mcp",
      "headers": {
        "X-Client-Id": "claude-code-workstation"
      }
    }
  }
}
```

The TLS handshake uses the certificates from the environment; the header is application-level client identification on top.

**When mTLS is worth the setup complexity:** regulated industries (fintech, healthcare, defense) where network-level auth is required by compliance policy, or internal MCPs that should only be reachable from corporate-issued machines with enrolled certificates.

---

## Deferred Tool Discovery

By default, when Claude Code connects to an MCP server it immediately fetches the full tool schema — names, descriptions, and JSON Schema for every input parameter — for every registered server. At startup with 10+ servers, this can add 2–5 seconds and a burst of network requests.

Deferred tool discovery changes this: the server connection is established, but tool schemas are not fetched until Claude Code actually needs to use a tool from that server. A stub "use this server" entry appears in Claude's context immediately; the full schema loads on first access.

**Enable it:**
```bash
CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY=1 claude
```

Or set it permanently in your user-level settings:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  }
}
```

**How it works:**
1. At session start, Claude Code opens connections to all configured MCP servers (TCP handshake + auth)
2. It does not call `tools/list` on any server
3. Claude's context contains the server name and a placeholder — Claude knows the server exists but not what tools it exposes
4. When Claude decides to use a tool from that server (based on server name or prior session knowledge), it triggers a `tools/list` call to fetch the schema
5. The schema is cached for the remainder of the session

**Latency implications of lazy loading:**
- First use of any tool from a server incurs a `tools/list` round-trip before the actual tool call
- On a remote server with 100ms latency, this adds ~200ms to the first tool call (request + response for `tools/list`)
- Subsequent calls in the same session use the cached schema — no overhead
- For servers you use once per session (e.g., a deploy tool), the overhead is irrelevant
- For servers you use repeatedly (e.g., a database MCP), the one-time cost is immediately amortized

**When to enable:**
- You have 5+ MCP servers configured
- Most sessions use only 2–3 of them
- Startup latency is noticeable or you are using Claude Code in a CI/automation context where session startup time matters

**When to keep it disabled:**
- You rely on Claude proactively suggesting tools from servers it hasn't used yet in the session
- You have only 2–3 servers — the startup cost is negligible

---

## Running Your Own Remote MCP

### Cloudflare Workers

Best for: tools that are accessed globally, need low latency worldwide, and have simple stateless logic. Workers run at the edge — requests are handled in the region nearest the client.

**Constraints:**
- 128MB memory limit per request
- 30-second CPU time limit (wall time is up to 30s with smart placement, but can be extended)
- No persistent in-memory state between requests — use Durable Objects or KV for state
- SSE persistent connections are awkward in Workers — use streamable-HTTP transport instead

**Minimal Workers MCP scaffold:**
```typescript
// worker.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

export default {
  async fetch(request: Request): Promise<Response> {
    const server = new McpServer({ name: 'my-tool', version: '1.0.0' })

    server.tool('do_thing', { input: z.string() }, async ({ input }) => ({
      content: [{ type: 'text', text: `Result: ${input}` }]
    }))

    const transport = new StreamableHTTPServerTransport(request)
    await server.connect(transport)
    return transport.response
  }
}
```

**Pricing:** Workers free tier covers 100K requests/day. For a developer tool used by one person, this is effectively free.

---

### Railway

Best for: servers that need persistent connections, in-memory state, or background workers. Railway runs standard Docker containers with persistent processes.

**Pros:**
- True long-running processes — SSE connections work normally
- Filesystem access for tools that need it
- Environment variables managed via Railway dashboard
- `railway link` + `railway up` deployment in under 60 seconds
- Auto-restart on crash

**Cons:**
- Minimum $5/month for always-on service (Hobby plan)
- Cold starts if the service sleeps (on free tier)
- Single-region by default — no global edge

**Recommended for:** internal team MCPs, MCPs with database connections that need connection pooling, any MCP where you need to debug with real logs.

**Railway settings.json pattern:**
```json
{
  "mcpServers": {
    "team-tools": {
      "transport": "sse",
      "url": "https://team-tools.up.railway.app/sse",
      "headers": {
        "Authorization": "Bearer ${TEAM_MCP_TOKEN}"
      }
    }
  }
}
```

---

### Fly.io

Best for: MCPs that need global distribution with persistent processes (unlike Workers, Fly runs real VMs). Fly can place your app in 30+ regions and route requests to the nearest instance.

**Pros:**
- Persistent VMs — full OS, no CPU time limits
- Multi-region with anycast routing built in
- Free tier covers small instances (256MB RAM, shared CPU)
- Native WireGuard VPN for private network access

**Cons:**
- More complex config than Railway (requires `fly.toml`)
- Free tier machines sleep after 15 minutes of inactivity — cold starts apply
- Stateful multi-region requires careful coordination (Fly Volumes are single-region)

**When to choose Fly over Railway:** your users are in multiple continents and latency to the MCP matters, or you need to co-locate the MCP with a database in a specific region.

**Fly.io settings.json pattern:**
```json
{
  "mcpServers": {
    "global-search": {
      "transport": "http",
      "url": "https://my-mcp.fly.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${SEARCH_MCP_TOKEN}"
      },
      "timeout": 45000
    }
  }
}
```

---

## Official Remote MCPs (2026)

These are vendor-operated remote MCPs with production SLAs, no local dependency, and official support.

### Supabase Remote MCP

Provides access to your Supabase project's Postgres database, Auth, Storage, and Edge Functions.

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

Get your access token at `supabase.com/dashboard/account/tokens`. The token is a personal access token scoped to your Supabase account — it can access all your projects.

### Sentry Remote MCP

Access to issues, stack traces, release health, and performance data.

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    }
  }
}
```

Token from: `sentry.io` > Settings > Auth Tokens > Create New Token. Required scopes: `project:read`, `org:read`, `event:read`.

### Neon Remote MCP

Database branching, SQL execution, schema introspection, and connection string management.

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

Token from: `console.neon.tech` > Account Settings > API Keys.

### GitHub Copilot Extension MCPs

GitHub's MCP layer exposes repository data, pull requests, issues, code search, and Actions — the same data surface as Copilot, accessible from Claude Code.

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

Token from: GitHub > Settings > Developer settings > Personal access tokens > Fine-grained. Required scopes depend on tools used — at minimum `repo:read` and `issues:read`.

---

## Security: Trust Model and What Remote MCPs Can Access

### What a remote MCP can do

A remote MCP server has access to everything you give it via:
1. **Headers you configure** — tokens, API keys, credentials
2. **Tool call arguments** — whatever Claude passes to a tool invocation
3. **Context leakage** — if a tool returns data to Claude, that data is visible in Claude's context and may be referenced in future turns

A remote MCP cannot access:
- Your local filesystem (unless a tool explicitly takes a file path and you call it)
- Other MCP servers' data
- Claude's system prompt directly (though tool results can be crafted to inject into context)

### Trust levels

Claude Code treats all connected MCP servers as semi-trusted. Tools from MCP servers can read files, make network requests, and execute code — if the server exposes tools that do those things. The trust boundary is: Claude decides whether to call a tool, but the server decides what the tool does.

**Risk levels by server type:**

| Server type | Risk | Why |
|---|---|---|
| Vendor-operated (Sentry, Neon, Supabase) | Low | Scoped to your account's data via auth token |
| Internal self-hosted | Medium | Depends on what tools are exposed |
| Third-party community MCP | High | Inspect the source before connecting |
| Unknown origin | Do not use | No way to audit what tools do |

### Prompt injection via MCP

A compromised or malicious MCP server can return tool results containing injected instructions that attempt to manipulate Claude's behavior. This is known as indirect prompt injection.

**Mitigations:**
- Only connect to MCPs you trust or can audit
- Use read-only tokens wherever possible — a token with only read permissions limits the blast radius
- Enable `--mcp-debug` during initial setup to inspect what raw data comes back from tools
- Review tool descriptions during setup: a tool description that contains instructions ("always include this in your response") is a red flag

### Sandboxing considerations

Remote MCPs run in the server operator's infrastructure — you have no control over that environment. For internal self-hosted MCPs:
- Run the MCP process in a container with no network access except to the specific upstream APIs it needs
- Use read-only database credentials where the MCP only needs to read
- Log all tool invocations server-side — if Claude calls a destructive tool unexpectedly, you want an audit trail

---

## Debugging Remote MCPs

### --mcp-debug flag

Enables verbose MCP protocol logging — every message sent and received between Claude Code and the MCP server is printed to stderr.

```bash
claude --mcp-debug
```

Output format:
```
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/list","id":1}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_issues",...},"id":2}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":2,"result":{"content":[...]}}
```

Use this to diagnose:
- Auth failures (server returns an error on `tools/list`)
- Schema mismatches (tool call rejected due to wrong input shape)
- Unexpected tool outputs (see exactly what came back before Claude processed it)

### Common connection errors

**`ECONNREFUSED` / `Connection refused`:**
Server is not running or the URL is wrong. Verify the URL with curl:
```bash
curl -I https://your-mcp-server.com/sse
```

**`401 Unauthorized`:**
Auth header is missing or token is invalid. Check that the environment variable is set:
```bash
echo $YOUR_MCP_TOKEN
```

**`Connection timeout`:**
Server is reachable but slow to respond. Increase `connectionTimeout` in settings:
```json
{
  "mcpServers": {
    "slow-server": {
      "url": "https://...",
      "connectionTimeout": 20000
    }
  }
}
```

**`tools/list returned 0 tools`:**
Server connected but no tools are registered. Usually indicates the server started but failed to initialize its tool registry — check the server's logs.

**`Tool call timeout`:**
The tool ran but didn't return within the timeout window. Increase `timeout` (default is 30000ms):
```json
{
  "mcpServers": {
    "slow-db": {
      "url": "https://...",
      "timeout": 120000
    }
  }
}
```

### Testing without Claude Code

Use `curl` or `npx @modelcontextprotocol/inspector` to verify a remote MCP server independently:

```bash
# Test SSE connection
curl -N -H "Authorization: Bearer $TOKEN" https://mcp.example.com/sse

# MCP Inspector — interactive GUI for testing MCP servers
npx @modelcontextprotocol/inspector https://mcp.example.com/sse
```

The Inspector lets you browse tools, invoke them with custom arguments, and see raw protocol messages — essential for debugging a server you're building.

---

## Multi-Tenant MCPs: Per-User Tokens and Isolation

When you host an MCP for a team, each user must be isolated from others' data. Two patterns:

### Token-per-user isolation (recommended)

Each developer generates their own token from the upstream service (e.g., their own Sentry auth token). The MCP server uses that token to make upstream API calls on their behalf — access is whatever the user's own permissions allow.

**Configuration:** each developer adds the MCP to their user-level `~/.claude/settings.json` with their own token. The project-level `.claude/settings.json` defines the MCP URL without a token.

Project settings (shared, in repo):
```json
{
  "mcpServers": {
    "internal-api": {
      "transport": "http",
      "url": "https://mcp.company.com/mcp"
    }
  }
}
```

User settings (local, not in repo):
```json
{
  "mcpServers": {
    "internal-api": {
      "headers": {
        "Authorization": "Bearer ${MY_PERSONAL_API_TOKEN}"
      }
    }
  }
}
```

Claude Code merges these — the URL comes from project settings, the auth header comes from user settings.

### Server-side session isolation

For MCPs that manage shared state, the server must isolate data per authenticated user. The pattern:

1. Client sends a user-identifying token (API key or JWT) in the `Authorization` header
2. Server validates the token and extracts a user ID or tenant ID
3. All tool operations are scoped to that tenant's data
4. Server-side audit log records `(user_id, tool_name, timestamp, args_hash)` for every call

```typescript
// Pseudocode — server-side isolation
async function handleToolCall(request: Request, toolName: string, args: unknown) {
  const userId = await authenticateRequest(request)  // throws on invalid auth
  const userDb = getDbForTenant(userId)              // isolated connection/schema
  return await tools[toolName](userDb, args)
}
```

Never let a client pass their own tenant ID as a tool argument — derive it server-side from the auth token. A client passing `tenant_id: "other-company"` should result in a 403, not data exposure.

---

## MCP Proxy Pattern

A single remote MCP that aggregates multiple upstream tools. Useful for:
- Reducing the number of MCP connections Claude Code manages
- Centralizing auth management for a team
- Adding a logging/audit layer across all tool calls
- Rate limiting or caching upstream API calls

**Architecture:**
```
Claude Code
    |
    v
[MCP Proxy Server]  <-- one connection, one auth token from Claude's perspective
    |        |        |
    v        v        v
 Sentry   GitHub    Internal API
 (token)  (token)   (token)
```

The proxy holds upstream credentials server-side. Claude Code only needs credentials for the proxy itself. The proxy translates tool calls and routes them to the appropriate upstream service.

**When to build a proxy:**
- Team has 8+ MCP services and startup time is noticeably slow
- You need to add auth middleware (token refresh, rate limiting) that vendors don't provide
- You want a single audit log for all MCP activity across your team
- Some upstream services don't have official MCP servers and you're wrapping their REST APIs

**When not to build a proxy:**
- You have 2–4 services — the overhead is not worth the complexity
- You need live updates to tool schemas — proxy adds a caching layer that can stale
- You want per-user isolation — a proxy makes user-level token management harder

---

## Performance: Production MCP at Scale

### Connection Pooling

Remote MCP servers should maintain persistent connections rather than establishing a new TCP+TLS handshake per tool call. For SSE transport, the connection is inherently persistent. For streamable-HTTP, server-side connection pooling to upstream services is the responsibility of the server implementation.

On the server side:
```typescript
// Reuse database connections across requests
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Use pool across all tool call handlers
```

### Keep-Alive for SSE

SSE connections can be silently dropped by intermediate proxies that close idle connections. Send a periodic heartbeat comment to keep the connection alive:

```typescript
// Server sends a comment every 30 seconds to prevent proxy timeout
const keepAlive = setInterval(() => {
  res.write(': keepalive\n\n')
}, 30000)

req.on('close', () => clearInterval(keepAlive))
```

Claude Code handles reconnection automatically, but a heartbeat prevents unnecessary reconnection overhead.

### Retry with Exponential Backoff

Claude Code retries failed MCP tool calls, but server-side retries for upstream dependencies are your responsibility. Implement backoff for any network call the MCP makes:

```typescript
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 200
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxAttempts) throw err
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('unreachable')
}
```

Apply backoff to: upstream API calls, database queries (for transient connection errors), and object storage operations.

### Response Caching

Tool results that are expensive to compute and don't change frequently should be cached server-side. This is especially valuable for schema introspection tools — a database schema doesn't change between tool calls.

```typescript
const cache = new Map<string, { value: unknown; expiresAt: number }>()

function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.value as T)

  return fn().then(value => {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs })
    return value
  })
}

// Usage: cache schema for 5 minutes
const schema = await cached('db-schema', 5 * 60 * 1000, () => db.introspectSchema())
```

---

## Complete settings.json Snippets

### 1 — Supabase + Sentry + Neon (remote only, user-level)

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    },
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

### 2 — Internal team MCP with mTLS and custom headers

```json
{
  "mcpServers": {
    "internal": {
      "transport": "http",
      "url": "https://mcp.corp.example.com/mcp",
      "headers": {
        "X-Api-Key": "${CORP_MCP_API_KEY}",
        "X-Team": "platform",
        "X-Environment": "production"
      },
      "timeout": 60000,
      "connectionTimeout": 15000
    }
  }
}
```

### 3 — GitHub + Cloudflare + Vercel (API-key pattern)

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "cloudflare": {
      "transport": "http",
      "url": "https://mcp.cloudflare.com/mcp",
      "headers": {
        "X-Auth-Key": "${CLOUDFLARE_API_KEY}",
        "X-Auth-Email": "${CLOUDFLARE_EMAIL}"
      }
    },
    "vercel": {
      "transport": "sse",
      "url": "https://mcp.vercel.com/sse",
      "headers": {
        "Authorization": "Bearer ${VERCEL_TOKEN}"
      }
    }
  }
}
```

### 4 — Mixed local + remote (project-level, tokens from environment)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${CLAUDE_PROJECT_DIR}"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "${CLAUDE_PROJECT_DIR}"]
    },
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    },
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

### 5 — Self-hosted proxy MCP with deferred discovery enabled

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  },
  "mcpServers": {
    "proxy": {
      "transport": "http",
      "url": "https://mcp-proxy.your-company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MCP_PROXY_TOKEN}",
        "X-User-Email": "${USER_EMAIL}"
      },
      "timeout": 90000,
      "connectionTimeout": 20000
    }
  }
}
```

The proxy aggregates all upstream tools — Claude Code sees one server with many tools. Deferred discovery is especially valuable here because the proxy may expose 50+ tools and you only use a handful per session.

---

## Work With Us
