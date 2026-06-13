# Remote MCP Servers — Transport, Auth, en Production Operations

Hoe je Claude Code verbindt met remote MCP servers: transport selectie, authentication patronen, deferred tool discovery, hosting, en hardening voor production.

---

## Wat een MCP "Remote" maakt

Lokale MCP servers lopen als een child process op dezelfde machine als Claude Code. Remote MCP servers lopen ergens anders — op een cloud host, een gedeelde interne service, of vendor's infrastructuur — en Claude Code maakt via netwerk verbinding.

Het onderscheid is belangrijk voor:
- **Auth:** lokale processen erven environment variabelen; remote servers vereisen expliciete credential passing
- **Startup cost:** lokale servers starten met Claude Code; remote servers hebben network round-trip latentie op elke tool aanroep
- **Sharing:** een remote MCP kan meerdere developers en omgevingen van één deployment bediening
- **Maintenance:** lokale server binaries moeten overal geïnstalleerd en bijgewerkt worden; remote servers worden centraal geüpgrade

---

## Transport Types

MCP 2025-11 spec defineert drie transport types. Begrijpen welke één een server gebruikt bepaalt hoe je het configureert en welke latentie karakteristieken verwachten.

### stdio — Local Process (command field)

De originele MCP transport. Claude Code spawnt de server als subprocess en communiceert over stdin/stdout pipes.

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

**Karakteristieken:**
- Zero network latentie — IPC pipe communicatie
- Server process is eigendom van Claude Code — lifecycle gebonden aan de sessie
- Auth via environment variabelen doorgegeven in `env` field
- Niet deelbaar over machines of gebruikers
- Subprocess crashes beëindigen de MCP verbinding stil

**Wanneer stdio gebruiken:** lokale development tools (filesystem, git, lokale database), tools die toegang nodig hebben tot lokale machine bestanden of processen, single-developer workflows.

---

### SSE — HTTP Streaming (legacy remote)

Server-Sent Events over HTTP. De client houdt een persistent HTTP connection open; de server pusht events omlaag. SSE was de eerste remote MCP transport en blijft het meest ondersteund als van mid-2026.

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

**Karakteristieken:**
- HTTP/1.1 compatibel — werkt door meeste proxies en firewalls
- Persistent connection — server kan tool resultaten incrementeel pushen
- Headers worden verzonden met de initiale connection request
- Reconnect gedrag is automatisch in Claude Code (met exponentiële backoff)
- SSE verbindingen zijn unidirectionaal van server naar client — tool invocaties gaan terug over een apart POST kanaal

**Latentie profiel:** 50–300ms extra latentie per tool aanroep vs stdio, afhankelijk van server geografie en connection reuse.

---

### Streamable-HTTP — New Default (MCP 2025-11)

MCP 2025-11 spec introduceerde streamable-HTTP als de geprefereerde remote transport. Het gebruikt standaard HTTP POST verzoeken met streaming response bodies, eliminerend het onbeholpen SSE dual-channel patroon.

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

**Karakteristieken:**
- Elke tool aanroep is een enkel POST verzoek met streaming response
- Geen persistent connection vereist — werkt goed achter HTTP/2 load balancers
- Eenvoudiger server implementatie dan SSE (geen dual-channel management)
- Stateless van infrastructuur perspectief — gemakkelijk horizontaal schaal
- Ondersteunt session tokens via `Mcp-Session-Id` response header voor stateful servers die het nodig hebben

**Wanneer streamable-HTTP over SSE gebruiken:**
- Hosting achter Cloudflare Workers of enig edge runtime (SSE persistent connections zijn problematisch daar)
- High-concurrency multi-tenant deployments
- Enig nieuw server je zelf schrijft — prefer streamable-HTTP

**Compatibiliteit opmerking:** Claude Code ondersteunt beide `"transport": "sse"` en `"transport": "http"`. Oudere servers die alleen SSE spreken zullen doorgaan werken. Nieuwe vendor MCPs gelanceerd na 2025-11 spec gebruiken steeds vaker streamable-HTTP.

---

## Remote MCP Configuration in settings.json

Het `"url"` field signaleert een remote verbinding. Het `"command"` field signaleert een lokaal stdio process. Gebruik nooit beide in dezelfde server entry.

**Settings.json locatie:**
- Project-niveau: `.claude/settings.json` (ingecheckt in repo — vermijd tokens hier inbedden)
- Gebruiker-niveau: `~/.claude/settings.json` (machine-lokaal — veilig voor persoonlijke tokens)
- Systeem-niveau: `/etc/claude/settings.json` (beheerd door admins voor gedeelde omgevingen)

**Volledige remote server config structuur:**
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

| Field | Vereist | Doel |
|---|---|---|
| `transport` | Nee (standaard naar `"sse"`) | `"sse"` of `"http"` |
| `url` | Ja | Volledige URL naar het MCP endpoint |
| `headers` | Nee | HTTP headers verzonden met elk verzoek |
| `timeout` | Nee | Tool aanroep timeout in milliseconden (standaard 30000) |
| `connectionTimeout` | Nee | Initiale connection timeout in milliseconden |

---

## Auth Patronen

### OAuth 2.0 Bearer Tokens

Het standaard auth patroon voor vendor-hosted remote MCPs. Je verkrijgt een token van de service's OAuth flow of API key pagina, dan pass het als Authorization header.

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

**Token sourcing:** Hardcode nooit tokens in `.claude/settings.json` als het bestand ingecheckt is in version control. Gebruik environment variable interpolatie in plaats daarvan:

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

Claude Code expandeert `${VAR_NAME}` uit het proces environment voordat het de verbinding maakt. Stel de variabele in je shell profile in of in `env` sectie van je user-level settings.

**OAuth 2.0 PKCE flow (browser-based auth):** Sommige remote MCPs (Supabase remote, GitHub MCP) ondersteunen browser-based OAuth. Wanneer geconfigureerd met `"auth": "oauth"` en geen expliciete token, Claude Code opent een browser venster voor OAuth flow en slaat het resulterende token op in de system keychain.

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

Sommige services gebruiken een custom header naam in plaats van `Authorization`. Cloudflare, Vercel, en verscheidene interne enterprise MCPs volgen dit patroon.

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

Voor interne MCPs, het is gewoon om ook service identifier of environment tag te verzenden:

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

Voor enterprise omgevingen waar de server ook moet verifiëren client identiteit naast client verifying server. mTLS is geconfigureerd buiten headers — het vereist Claude Code om te worden gelanceerd met certificate environment variabelen ingesteld.

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

TLS handshake gebruikt certificaten uit environment; de header is application-level client identificatie bovenop.

**Wanneer mTLS setup complexiteit waard is:** gereguleerde industrieën (fintech, healthcare, defense) waar network-level auth vereist is door compliance beleid, of interne MCPs die alleen bereikbaar moeten zijn van corporate-issued machines met ingeschreven certificaten.

---

## Deferred Tool Discovery

Standaard, wanneer Claude Code verbindt met MCP server haalt het onmiddellijk het volledige tool schema — namen, beschrijvingen, en JSON Schema voor elk input parameter — voor elke geregistreerde server. Bij startup met 10+ servers, kan dit 2–5 seconden toevoegen en burst van network verzoeken.

Deferred tool discovery verandert dit: de server verbinding is vastgesteld, maar tool schemas zijn niet opgehaald tot Claude Code werkelijk een tool van die server nodig heeft. Een stub "use this server" entry verschijnt in Claude's context onmiddellijk; het volledige schema laadt on first access.

**Inschakelen:**
```bash
CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY=1 claude
```

Of stel permanent in je user-level settings:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  }
}
```

**Hoe het werkt:**
1. Bij sessie start, Claude Code opent verbindingen naar alle geconfigureerde MCP servers (TCP handshake + auth)
2. Het roept geen `tools/list` op enige server op
3. Claude's context bevat server naam en placeholder — Claude weet server bestaat maar niet welke tools het expose
4. Als Claude beslist een tool van die server te gebruiken (gebaseerd op server naam of vorig sessie kennis), het triggert `tools/list` aanroep om schema op te halen
5. Het schema wordt gecachet voor de rest van de sessie

**Latentie implicaties van lazy loading:**
- Eerste gebruik van enige tool van server incurr `tools/list` round-trip voorafgaand aan de werkelijke tool aanroep
- Op remote server met 100ms latentie, dit voegt ~200ms toe op eerste tool aanroep (request + response voor `tools/list`)
- Volgende aanroepen in dezelfde sessie gebruiken het gecachte schema — geen overhead
- Voor servers je één keer per sessie gebruikt (bijv. een deploy tool), overhead is irrelevant
- Voor servers je herhaaldelijk gebruikt (bijv. database MCP), one-time kosten is onmiddellijk amortized

**Wanneer inschakelen:**
- Je hebt 5+ MCP servers geconfigureerd
- Meeste sessies gebruiken alleen 2–3 van hen
- Startup latentie is merkbaar of je gebruiken Claude Code in CI/automation context waar sessie startup tijd belang

**Wanneer uit houden:**
- Je vertrouwt op Claude proactief tools suggereren van servers het nog niet deze sessie gebruikt
- Je hebt alleen 2–3 servers — startup kosten is verwaarloosbaar

---

## Running Your Own Remote MCP

### Cloudflare Workers

Best voor: tools accessed globaal, nodig lage latentie wereldwijd, en heb eenvoudige stateless logica. Workers lopen op de edge — verzoeken zijn verwerkt in de regio dichtst bij client.

**Constraints:**
- 128MB geheugen limiet per verzoek
- 30-seconden CPU time limiet (wall time is tot 30s met slim placement, kan worden uitgebreid)
- Geen persistent in-memory staat tussen verzoeken — gebruik Durable Objects of KV voor staat
- SSE persistent verbindingen zijn onhandig in Workers — gebruik streamable-HTTP transport in plaats daarvan

**Minimale Workers MCP scaffold:**
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

**Pricing:** Workers free tier dekt 100K verzoeken/dag. Voor developer tool gebruikt door één persoon, dit is effectief gratis.

---

### Railway

Best voor: servers die persistent verbindingen nodig hebben, in-memory staat, of background workers. Railway loopt standaard Docker containers met persistent processen.

**Pluspunten:**
- Waar long-running processen — SSE verbindingen werken normaal
- Filesystem toegang voor tools die het nodig hebben
- Environment variabelen beheerd via Railway dashboard
- `railway link` + `railway up` deployment in onder 60 seconden
- Auto-restart op crash

**Minpunten:**
- Minimaal $5/maand voor always-on service (Hobby plan)
- Cold starts als service slaapt (op free tier)
- Single-region standaard — geen globale edge

**Aanbevolen voor:** interne team MCPs, MCPs met database verbindingen die connection pooling nodig hebben, enig MCP waar je nodig hebt debug met echte logs.

**Railway settings.json patroon:**
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

Best voor: MCPs die globale distributie nodig hebben met persistent processen (anders dan Workers, Fly loopt werkelijk VMs). Fly kan je app in 30+ regio's plaatsen en verzoeken naar dichtste instance routeren.

**Pluspunten:**
- Persistent VMs — volle OS, geen CPU time limieten
- Multi-region met anycast routing ingebouwd
- Free tier dekt kleine instances (256MB RAM, gedeelde CPU)
- Native WireGuard VPN voor private network toegang

**Minpunten:**
- Complexere config dan Railway (vereist `fly.toml`)
- Free tier machines slapen na 15 minuten inactiviteit — cold starts gelden
- Stateful multi-region vereist voorzichtige coördinatie (Fly Volumes zijn single-region)

**Wanneer Fly over Railway kiezen:** je gebruikers zijn in meerdere continenten en latentie naar MCP belang, of je nodig hebben co-locate MCP met database in specifieke regio.

**Fly.io settings.json patroon:**
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

Dit zijn vendor-operated remote MCPs met production SLAs, geen lokale afhankelijkheid, en officiële ondersteuning.

### Supabase Remote MCP

Biedt toegang tot je Supabase project's Postgres database, Auth, Storage, en Edge Functions.

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

Verkrijg je access token op `supabase.com/dashboard/account/tokens`. Token is personal access token bereikt op je Supabase account — kan toegang tot al je projecten.

### Sentry Remote MCP

Toegang tot issues, stack traces, release health, en performance data.

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

Token van: `sentry.io` > Settings > Auth Tokens > Create New Token. Vereiste scopes: `project:read`, `org:read`, `event:read`.

### Neon Remote MCP

Database branching, SQL uitvoering, schema introspectie, en connection string management.

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

Token van: `console.neon.tech` > Account Settings > API Keys.

### GitHub Copilot Extension MCPs

GitHub's MCP laag expose repository data, pull requests, issues, code search, en Actions — dezelfde data oppervlak als Copilot, toegankelijk van Claude Code.

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

Token van: GitHub > Settings > Developer settings > Personal access tokens > Fine-grained. Vereiste scopes hangen af van tools gebruikt — op minimaal `repo:read` en `issues:read`.

---

## Security: Trust Model en Wat Remote MCPs Kunnen Toegang

### Wat remote MCP kan doen

Remote MCP server heeft toegang tot alles je geef het via:
1. **Headers je configureert** — tokens, API keys, credentials
2. **Tool aanroep argumenten** — alles Claude naar tool invocatie geeft
3. **Context leakage** — als tool resultaat data naar Claude teruggeeft, die data is zichtbaar in Claude's context en kan in toekomstige turns verwezen zijn

Remote MCP kan niet toegang:
- Je lokale filesystem (tenzij tool expliciet filepath neemt en je het noemt)
- Ander MCP servers data
- Claude's system prompt direct (hoewel tool resultaten kunnen crafted zijn om in context in te spuiten)

### Trust niveaus

Claude Code behandelt alle verbonden MCP servers als semi-vertrouwd. Tools van MCP servers kunnen bestanden lezen, netwerk verzoeken maken, en code uitvoeren — als server expose tools die die dingen doen. Trust grens is: Claude beslist of tool aanroepen, maar server beslist wat tool doet.

**Risk niveaus door server type:**

| Server type | Risk | Waarom |
|---|---|---|
| Vendor-operated (Sentry, Neon, Supabase) | Laag | Bereikt naar je account data via auth token |
| Interne self-hosted | Medium | Hangt af van welke tools expose |
| Third-party community MCP | Hoog | Inspect bron voordat verbinding maken |
| Onbekende oorsprong | Niet gebruiken | Geen manier om audit welke tools doen |

### Prompt injection via MCP

Compromised of malicious MCP server kan tool resultaten die injectie instructies bevatten terugkeren die proberen Claude's gedrag manipuleren. Dit staat bekend als indirect prompt injection.

**Mitigaties:**
- Verbind alleen naar MCPs je vertrouwt of kan audit
- Gebruik read-only tokens overal waar mogelijk — token met alleen read permissies limiet blast radius
- Enable `--mcp-debug` tijdens initiële setup om raw data van tools te inspecteren
- Review tool beschrijvingen tijdens setup: tool beschrijving die instructies bevat ("altijd dit in je respons includeren") is rode vlag

### Sandboxing overwegingen

Remote MCPs lopen in server operator infrastructuur — je hebt geen controle over die omgeving. Voor interne self-hosted MCPs:
- Laat MCP proces in container zonder netwerk toegang behalve specifieke upstream APIs het nodig heeft
- Gebruik read-only database credentials waar MCP alleen lezen nodig heeft
- Log alle tool invocaties server-side — als Claude roept destructieve tool onverwacht, je wil audit trail

---

## Debugging Remote MCPs

### --mcp-debug vlag

Inschakelen verbose MCP protocol logging — elk bericht verzonden en ontvangen tussen Claude Code en MCP server wordt naar stderr geprint.

```bash
claude --mcp-debug
```

Output formaat:
```
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/list","id":1}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_issues",...},"id":2}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":2,"result":{"content":[...]}}
```

Gebruik dit om diagnose:
- Auth mislukking (server keert error op `tools/list`)
- Schema mismatch (tool aanroep afgewezen vanwege verkeerde input shape)
- Onverwachte tool outputs (zie exact wat terugkwam voordat Claude het verwerkte)

### Gewone connection errors

**`ECONNREFUSED` / `Connection refused`:**
Server loopt niet of URL is fout. Verify URL met curl:
```bash
curl -I https://your-mcp-server.com/sse
```

**`401 Unauthorized`:**
Auth header ontbreekt of token ongeldig. Controleer environment variabele ingesteld:
```bash
echo $YOUR_MCP_TOKEN
```

**`Connection timeout`:**
Server bereikbaar maar traag reageren. Vergroot `connectionTimeout` in settings:
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
Server verbonden maar geen tools geregistreerd. Meestal duidt server opstartte maar tool registry initialisatie mislukkt — controleer server logs.

**`Tool call timeout`:**
Tool liep maar retourneerde niet binnen timeout window. Vergroot `timeout` (standaard 30000ms):
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

### Testen zonder Claude Code

Gebruik `curl` of `npx @modelcontextprotocol/inspector` om remote MCP server onafhankelijk verifiëren:

```bash
# Test SSE verbinding
curl -N -H "Authorization: Bearer $TOKEN" https://mcp.example.com/sse

# MCP Inspector — interactive GUI voor testing MCP servers
npx @modelcontextprotocol/inspector https://mcp.example.com/sse
```

Inspector laat je tools browse, invoke met custom argumenten, en ruw protocol berichten zien — essentieel voor debugging server je bouwt.

---

## Multi-Tenant MCPs: Per-User Tokens en Isolatie

Wanneer je MCPs host voor team, moet elke gebruiker geïsoleerd zijn van ander's data. Twee patronen:

### Token-per-user isolatie (aanbevolen)

Elke developer genereren eigen token van upstream service (bijv. hun eigen Sentry auth token). MCP server gebruikt token naar upstream API aanroepen hun namens — toegang is wat hun eigen permissions toestaan.

**Configuration:** elke developer voegt MCP toe hun user-level `~/.claude/settings.json` met hun eigen token. Project-level `.claude/settings.json` definieert MCP URL zonder token.

Project settings (gedeeld, in repo):
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

User settings (lokaal, niet in repo):
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

Claude Code samenvoegen dit — URL komt van project settings, auth header komt van user settings.

### Server-side sessie isolatie

Voor MCPs dat gedeelde staat manage, moet server data per authenticated gebruiker isolaten. Patroon:

1. Client verzend user-identifying token (API key of JWT) in `Authorization` header
2. Server valideert token en extraheert user ID of tenant ID
3. Alle tool operaties bereikt naar die tenant's data
4. Server-side audit log verslag `(user_id, tool_name, timestamp, args_hash)` voor elk aanroep

```typescript
// Pseudocode — server-side isolatie
async function handleToolCall(request: Request, toolName: string, args: unknown) {
  const userId = await authenticateRequest(request)  // throws on invalid auth
  const userDb = getDbForTenant(userId)              // isolated connection/schema
  return await tools[toolName](userDb, args)
}
```

Laat nooit client hun eigen tenant ID naar tool argument passeren — derive het server-side van auth token. Client passeren `tenant_id: "other-company"` moet resulteren in 403, niet data exposure.

---

## MCP Proxy Patroon

Single remote MCP dat upstream tools aggregaat. Nuttig voor:
- De aantal MCP verbindingen Claude Code manage reduceren
- Centralisering auth management voor team
- Logging/audit laag toevoegen over alle tool aanroepen
- Rate limiting of caching upstream API aanroepen

**Architectuur:**
```
Claude Code
    |
    v
[MCP Proxy Server]  <-- one connection, one auth token van Claude perspective
    |        |        |
    v        v        v
 Sentry   GitHub    Internal API
 (token)  (token)   (token)
```

Proxy houdt upstream credentials server-side. Claude Code nodig alleen credentials voor proxy zelf. Proxy vertaalt tool aanroepen en routet naar passende upstream service.

**Wanneer proxy bouwen:**
- Team heeft 8+ MCP services en startup tijd is merkbaar traag
- Je nodig hebben auth middleware (token refresh, rate limiting) dat vendors niet bieden
- Je willen enkel audit log voor alle MCP activiteit over team
- Sommige upstream services geen officiële MCP servers hebben en je wrapped hun REST APIs

**Wanneer niet proxy bouwen:**
- Je hebt 2–4 services — overhead rechtvaardigen niet
- Je nodig hebben live updates naar tool schemas — proxy voegt caching laag dat kan stale
- Je willen per-user isolatie — proxy maakt user-level token management harder

---

## Performance: Production MCP op Scale

### Connection Pooling

Remote MCP servers moeten persistent verbindingen maintain in plaats van New TCP+TLS handshake op tool aanroep. Voor SSE transport, verbinding is inherent persistent. Voor streamable-HTTP, server-side connection pooling naar upstream services is server implementatie verantwoordelijkheid.

Server-side:
```typescript
// Reuse database verbindingen over verzoeken
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Gebruik pool over alle tool aanroep handlers
```

### Keep-Alive voor SSE

SSE verbindingen kunnen stil worden afgebroken door intermediate proxies die idle verbindingen sluiten. Verzend periodic heartbeat comment naar verbinding levend houden:

```typescript
// Server verzend comment elke 30 seconden om proxy timeout voorkomen
const keepAlive = setInterval(() => {
  res.write(': keepalive\n\n')
}, 30000)

req.on('close', () => clearInterval(keepAlive))
```

Claude Code verwerkt reconnectie automatisch, maar heartbeat voorkomt onnodig reconnectie overhead.

### Retry met Exponentiële Backoff

Claude Code retries mislukken MCP tool aanroepen, maar server-side retries voor upstream afhankelijkheden zijn je verantwoordelijkheid. Implementeer backoff voor enig network aanroep MCP maakt:

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

Pas backoff toe naar: upstream API aanroepen, database queries (voor transient connection errors), en object storage operaties.

### Response Caching

Tool resultaten dat duur zijn naar compute en niet frequent wijzigen moeten server-side cached. Dit is bijzonder waarvol voor schema introspectie tools — database schema wijzigt niet tussen tool aanroepen.

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

// Usage: cache schema voor 5 minuten
const schema = await cached('db-schema', 5 * 60 * 1000, () => db.introspectSchema())
```

---

## Volledige settings.json Snippets

### 1 — Supabase + Sentry + Neon (remote alleen, user-level)

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

### 2 — Interne team MCP met mTLS en custom headers

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

### 3 — GitHub + Cloudflare + Vercel (API-key patroon)

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

### 4 — Gemengd lokaal + remote (project-level, tokens van environment)

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

### 5 — Self-hosted proxy MCP met deferred discovery ingeschakeld

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

Proxy aggregaat alle upstream tools — Claude Code ziet één server veel tools. Deferred discovery bijzonder waardevol hier omdat proxy exposure 50+ tools en je alleen handfuls per sessie gebruiken.

---

## Werk Met Ons
