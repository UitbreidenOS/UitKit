# Remote MCP Server — Transport, Auth und Production Operations

Wie man Claude Code mit Remote MCP-Servern verbindet: Transport-Auswahl, Authentication-Patterns, Deferred Tool Discovery, Hosting und Hardening für Production.

---

## Was macht einen MCP "Remote"

Lokale MCP-Server laufen als Child-Process auf der gleichen Maschine wie Claude Code. Remote MCP-Server laufen irgendwo anders — auf einem Cloud-Host, einem gemeinsamen internen Service oder Vendor-Infrastruktur — und Claude Code verbindet sich über ein Netzwerk.

Die Unterscheidung ist wichtig für:
- **Auth:** lokale Prozesse erben Environment-Variablen; Remote-Server erfordern explizite Credential-Übergabe
- **Startup-Kosten:** lokale Server starten mit Claude Code; Remote-Server haben Network-Round-Trip-Latenz auf jedem Tool-Call
- **Sharing:** Ein Remote MCP kann mehrere Entwickler und Environments von einer Deployment bedienen
- **Wartung:** lokale Server-Binaries müssen überall installiert und aktualisiert werden; Remote-Server werden zentral aktualisiert

---

## Transport-Typen

MCP 2025-11 Spec definiert drei Transport-Typen. Zu verstehen, welchen ein Server nutzt, bestimmt, wie du ihn konfigurierst und welche Latenz-Charakteristiken zu erwarten sind.

### stdio — Lokaler Process (command field)

Der ursprüngliche MCP-Transport. Claude Code spawnt den Server als Subprocess und kommuniziert über stdin/stdout Pipes.

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

**Charakteristiken:**
- Null Network-Latenz — IPC Pipe-Kommunikation
- Server-Prozess ist Eigentum von Claude Code — Lifecycle an die Session gebunden
- Auth via Environment-Variablen im `env` Feld übergeben
- Nicht sharebar über Maschinen oder Nutzer
- Subprocess-Crashes unterbrechen die MCP-Verbindung stillschweigend

**Wann man stdio nutzt:** Lokale Development-Tools (Dateisystem, Git, lokale Datenbank), Tools, die Zugriff auf lokale Machine-Dateien oder Prozesse brauchen, Single-Developer-Workflows.

---

### SSE — HTTP Streaming (legacy remote)

Server-Sent Events über HTTP. Der Client hält eine persistente HTTP-Verbindung offen; der Server pushed Events hinab. SSE war der erste Remote MCP-Transport und bleibt die am meisten unterstützte um Mitte 2026.

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

**Charakteristiken:**
- HTTP/1.1 kompatibel — funktioniert durch die meisten Proxies und Firewalls
- Persistente Verbindung — Server kann Tool-Ergebnisse inkrementell pushen
- Header werden mit der initialen Connection-Request gesendet
- Reconnect-Verhalten ist automatisch in Claude Code (mit Exponential Backoff)
- SSE-Verbindungen sind unidirektional vom Server zum Client — Tool-Invocations gehen zurück über einen separaten POST Channel

**Latenz-Profil:** 50–300ms zusätzliche Latenz pro Tool-Call vs. stdio, abhängig von Server-Geographie und Connection-Wiederverwendung.

---

### Streamable-HTTP — Neuer Default (MCP 2025-11)

Die MCP 2025-11 Spec führte Streamable-HTTP als bevorzugten Remote-Transport ein. Es nutzt Standard-HTTP-POST-Requests mit Streaming-Response-Bodies, eliminiert das unbeholfene SSE-Dual-Channel-Pattern.

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

**Charakteristiken:**
- Jeder Tool-Call ist ein einzelner POST-Request mit Streaming-Response
- Keine persistente Verbindung erforderlich — funktioniert gut hinter HTTP/2-Load-Balancern
- Einfachere Server-Implementierung als SSE (keine Dual-Channel-Verwaltung)
- Stateless aus Infrastruktur-Perspektive — leicht horizontal skalierbar
- Unterstützt Session-Tokens via `Mcp-Session-Id` Response-Header für Stateful-Server, die es brauchen

**Wann man Streamable-HTTP über SSE nutzt:**
- Hosting hinter Cloudflare Workers oder jeder Edge-Runtime (SSE persistente Verbindungen sind dort problematisch)
- High-Concurrency Multi-Tenant-Deployments
- Jeden neuen Server, den du selbst schreibst — bevorzuge Streamable-HTTP

**Kompatibilität-Notiz:** Claude Code unterstützt sowohl `"transport": "sse"` als auch `"transport": "http"`. Ältere Server, die nur SSE sprechen, werden weiterhin funktionieren. Neue Vendor-MCPs, die nach der 2025-11 Spec gestartet werden, nutzen zunehmend Streamable-HTTP.

---

## Remote MCP-Konfiguration in settings.json

Das `"url"` Feld signalisiert eine Remote-Verbindung. Das `"command"` Feld signalisiert einen lokalen Stdio-Prozess. Nutze nie beide in der gleichen Server-Entry.

**settings.json Location:**
- Projekt-Level: `.claude/settings.json` (ins Repo eingecheckt — vermeide Token-Embedding hier)
- Nutzer-Level: `~/.claude/settings.json` (Maschinen-lokal — sicher für persönliche Tokens)
- System-Level: `/etc/claude/settings.json` (von Admins für gemeinsame Umgebungen verwaltet)

**Volle Remote-Server-Config-Struktur:**
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

| Feld | Erforderlich | Zweck |
|---|---|---|
| `transport` | Nein (defaults zu `"sse"`) | `"sse"` oder `"http"` |
| `url` | Ja | Volle URL zum MCP-Endpoint |
| `headers` | Nein | HTTP-Header mit jedem Request gesendet |
| `timeout` | Nein | Tool-Call-Timeout in Millisekunden (default 30000) |
| `connectionTimeout` | Nein | Initiale Connection-Timeout in Millisekunden |

---

## Auth-Patterns

### OAuth 2.0 Bearer Tokens

Das Standard-Auth-Pattern für Vendor-gehostete Remote MCPs. Du erhältst einen Token vom OAuth-Flow oder API-Key-Seite des Service, dann übergibst ihn als Authorization-Header.

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

**Token-Sourcing:** Hardcode niemals Tokens in `.claude/settings.json`, wenn die Datei ins Versionskontrolle geht. Nutze stattdessen Environment-Variable-Interpolation:

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

Claude Code expandiert `${VAR_NAME}` aus der Process-Umgebung, bevor die Verbindung hergestellt wird. Setze die Variable in deinem Shell-Profil oder in der `env` Section deiner Nutzer-Level-Settings.

**OAuth 2.0 PKCE Flow (Browser-basierte Auth):** Einige Remote MCPs (Supabase Remote, GitHub MCP) unterstützen Browser-basierte OAuth. Wenn konfiguriert mit `"auth": "oauth"` und keinem expliziten Token, öffnet Claude Code ein Browser-Fenster für den OAuth-Flow und speichert den resultierenden Token im System-Keychain.

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

### API-Key in Custom-Header

Einige Services nutzen einen Custom-Header-Namen statt `Authorization`. Cloudflare, Vercel und mehrere interne Enterprise-MCPs folgen diesem Pattern.

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

Für interne MCPs ist es üblich, einen Service-Identifier oder Environment-Tag auch zu senden:

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

Für Enterprise-Umgebungen, wo der Server die Identität des Clients zusätzlich verifizieren muss. mTLS ist außerhalb von Headers konfiguriert — es erfordert, Claude Code mit Certificate-Environment-Variablen gestartet zu laufen.

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

Das TLS-Handshake nutzt die Certificates aus der Umgebung; der Header ist Anwendungs-Level-Client-Identifikation oben drauf.

**Wann mTLS Setup-Komplexität wert ist:** Regulierte Industrien (Fintech, Healthcare, Defense), wo Netzwerk-Level-Auth von Compliance-Policy erforderlich ist, oder interne MCPs, die nur von Corporate-ausgegebenen Maschinen mit eingeschriebenen Certificates erreichbar sein sollten.

---

## Deferred Tool Discovery

Standardmäßig, wenn Claude Code sich mit einem MCP-Server verbindet, ruft es sofort das vollständige Tool-Schema auf — Namen, Beschreibungen und JSON-Schema für jeden Input-Parameter — für jeden registrierten Server. Bei Startup mit 10+ Servern kann dies 2–5 Sekunden hinzufügen und einen Burst von Network-Requests.

Deferred Tool Discovery ändert dies: die Server-Verbindung wird hergestellt, aber Tool-Schemas werden nicht gepullt, bis Claude Code wirklich ein Tool von diesem Server braucht. Eine Stub-"nutze diesen Server"-Entry erscheint in Claudes Kontext sofort; das vollständige Schema lädt beim First Access.

**Aktiviere es:**
```bash
CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY=1 claude
```

Oder setze es dauerhaft in deinen Nutzer-Level-Settings:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  }
}
```

**Wie es funktioniert:**
1. Bei Session-Start öffnet Claude Code Verbindungen zu allen konfigurierten MCP-Servern (TCP Handshake + Auth)
2. Es ruft nicht `tools/list` auf jedem Server auf
3. Claudes Kontext enthält den Server-Namen und einen Platzhalter — Claude weiß, dass der Server existiert, aber nicht, welche Tools er exposes
4. Wenn Claude sich entscheidet, ein Tool von diesem Server zu nutzen (basierend auf Server-Namen oder vorherigem Session-Wissen), triggert es einen `tools/list`-Call zur Schema-Abholung
5. Das Schema wird für den Rest der Session gecacht

**Latenz-Implikationen des Lazy Loading:**
- Erstes Use von einem Tool aus einem Server incurriert einen `tools/list` Round-Trip vor dem eigentlichen Tool-Call
- Auf einem Remote-Server mit 100ms Latenz, dies fügt ~200ms hinzu (Request + Response für `tools/list`)
- Nachfolgende Calls in der gleichen Session nutzen das gecachte Schema — kein Overhead
- Für Server, die du einmal pro Session nutzt (z.B. ein Deploy-Tool), ist der Overhead irrelevant
- Für Server, die du wiederholt nutzt (z.B. ein Datenbank-MCP), ist die One-Time-Kosten sofort amortisiert

**Wann man es aktiviert:**
- Du hast 5+ MCP-Server konfiguriert
- Die meisten Sessions nutzen nur 2–3 von ihnen
- Startup-Latenz ist bemerkenswert oder du nutzt Claude Code in einem CI/Automation-Kontext, wo Session-Startup-Zeit wichtig ist

**Wann man es deaktiviert lässt:**
- Du vertraust darauf, dass Claude proaktiv Tools von Servern vorschlägt, die es noch nicht in dieser Session nutzt
- Du hast nur 2–3 Server — die Startup-Kosten sind vernachlässigbar

---

## Führe deinen eigenen Remote MCP aus

### Cloudflare Workers

Best für: Tools, die global zugegriffen werden, niedrige Latenz weltweit brauchen und einfache Stateless-Logik haben. Workers laufen am Edge — Requests werden in der Region nächst zum Client handgehabt.

**Constraints:**
- 128MB Memory-Limit pro Request
- 30-Second CPU-Time-Limit (Wall-Time ist bis zu 30s mit Smart Placement, kann aber erweitert werden)
- Kein persistenter In-Memory-State zwischen Requests — nutze Durable Objects oder KV für State
- SSE persistente Verbindungen sind awkward in Workers — nutze stattdessen Streamable-HTTP-Transport

**Minimal Workers MCP Scaffold:**
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

**Pricing:** Workers Free-Tier deckt 100K Requests/Day. Für ein Developer-Tool, das eine Person nutzt, ist das effektiv kostenlos.

---

### Railway

Best für: Server, die persistente Verbindungen, In-Memory-State oder Background-Worker brauchen. Railway läuft Standard-Docker-Container mit persistenten Prozessen.

**Pros:**
- Echte Long-Running-Prozesse — SSE-Verbindungen funktionieren normal
- Dateisystem-Zugriff für Tools, die es brauchen
- Environment-Variablen von Railway-Dashboard verwaltet
- `railway link` + `railway up` Deployment in unter 60 Sekunden
- Auto-Restart bei Crash

**Cons:**
- Minimum $5/Monat für Always-On-Service (Hobby-Plan)
- Cold Starts wenn der Service schläft (auf Free-Tier)
- Einzelne Region standardmäßig — kein Global-Edge

**Empfohlen für:** Interne Team-MCPs, MCPs mit Datenbank-Verbindungen, die Connection-Pooling brauchen, beliebige MCP, wo du mit echten Logs debuggen musst.

**Railway settings.json Pattern:**
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

Best für: MCPs, die Global-Distribution mit persistenten Prozessen brauchen (anders als Workers, Fly läuft echte VMs). Fly kann deine App in 30+ Regionen platzieren und Requests zur nächsten Instanz routen.

**Pros:**
- Persistente VMs — vollständiges OS, keine CPU-Time-Limits
- Multi-Region mit Anycast-Routing eingebaut
- Free-Tier deckt kleine Instanzen (256MB RAM, Shared CPU)
- Native WireGuard-VPN für Private-Network-Zugriff

**Cons:**
- Komplexere Config als Railway (erfordert `fly.toml`)
- Free-Tier-Maschinen schlafen nach 15 Minuten Inaktivität — Cold Starts gelten
- Stateful Multi-Region erfordert sorgfältige Koordination (Fly Volumes sind Single-Region)

**Wann Fly über Railway wählen:** Deine Nutzer sind über mehrere Kontinente verteilt und Latenz zum MCP zählt, oder du brauchst den MCP co-locate mit einer Datenbank in einer bestimmten Region.

**Fly.io settings.json Pattern:**
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

## Offizielle Remote MCPs (2026)

Dies sind Vendor-betriebene Remote MCPs mit Production-SLAs, keine lokale Abhängigkeit und offizieller Support.

### Supabase Remote MCP

Bietet Zugriff auf dein Supabase-Project's Postgres Datenbank, Auth, Storage und Edge Functions.

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

Erhalte deinen Access-Token bei `supabase.com/dashboard/account/tokens`. Der Token ist ein Persönlicher Access-Token scoped zu deinem Supabase-Account — er kann auf alle deine Projekte zugreifen.

### Sentry Remote MCP

Zugriff auf Issues, Stack-Traces, Release-Health und Performance-Daten.

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

Token von: `sentry.io` > Settings > Auth Tokens > Create New Token. Erforderliche Scopes: `project:read`, `org:read`, `event:read`.

### Neon Remote MCP

Datenbank-Branching, SQL-Ausführung, Schema-Introspection und Connection-String-Verwaltung.

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

Token von: `console.neon.tech` > Account Settings > API Keys.

### GitHub Copilot Extension MCPs

Githubs MCP-Layer exposes Repository-Daten, Pull-Requests, Issues, Code-Suche und Actions — die gleiche Daten-Surface wie Copilot, zugänglich von Claude Code.

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

Token von: GitHub > Settings > Developer Settings > Personal Access Tokens > Fine-Grained. Erforderliche Scopes hängen von Tools ab, die genutzt werden — mindestens `repo:read` und `issues:read`.

---

## Security: Trust-Modell und Was Remote MCPs Zugreifen Können

### Was ein Remote MCP tun kann

Ein Remote MCP-Server hat Zugriff auf alles, das du ihm über folgende gibst:
1. **Headers, die du konfigurierst** — Tokens, API-Keys, Credentials
2. **Tool-Call-Argumente** — Was auch immer Claude zu einem Tool-Invocation übergeben
3. **Kontext-Leakage** — Wenn ein Tool Daten an Claude zurückgibt, sind diese Daten in Claudes Kontext sichtbar und können in zukünftigen Zügen referenziert werden

Ein Remote MCP kann nicht zugreifen auf:
- Dein lokales Dateisystem (außer ein Tool nimmt explizit einen Datei-Pfad und du rufst es auf)
- Andere MCPs Daten
- Claudes System-Prompt direkt (obwohl Tool-Ergebnisse crafted werden können, um in Kontext zu injizieren)

### Trust-Level

Claude Code behandelt alle verbundenen MCP-Server als semi-trusted. Tools von MCP-Servern können Dateien lesen, Network-Requests machen und Code ausführen — wenn der Server Tools exponiert, die das tun. Die Trust-Grenze ist: Claude entscheidet, ob ein Tool gerufen wird, aber der Server entscheidet, was das Tool tut.

**Risk-Level nach Server-Typ:**

| Server-Typ | Risk | Warum |
|---|---|---|
| Vendor-betrieben (Sentry, Neon, Supabase) | Niedrig | Scoped zu deinen Account-Daten via Auth-Token |
| Interne Self-Hosted | Mittel | Hängt von Exponierten Tools ab |
| Third-Party Community MCP | Hoch | Inspiziere die Quelle, bevor du verbindest |
| Unbekannte Herkunft | Nutze nicht | Keine Möglichkeit, zu auditen, was Tools tun |

### Prompt-Injection via MCP

Ein kompromittierter oder bösartiger MCP-Server kann Tool-Ergebnisse mit injizierten Instruktionen zurückgeben, die versuchen, Claudes Verhalten zu manipulieren. Das ist als Indirekte Prompt-Injection bekannt.

**Mitigationen:**
- Verbinde nur mit MCPs, die du vertraust oder auditen kannst
- Nutze Read-Only-Tokens wo möglich — ein Token mit nur Read-Permissions begrenzt den Blast-Radius
- Aktiviere `--mcp-debug` während initiales Setup, um zu inspizieren, welche Roh-Daten von Tools zurückkommen
- Review Tool-Beschreibungen während Setup: eine Tool-Beschreibung, die Instruktionen enthält ("immer schließe das in deine Antwort ein") ist ein Rotes Flag

### Sandboxing-Überlegungen

Remote MCPs laufen in der Server-Operator's Infrastruktur — du hast keine Kontrolle über die Umgebung. Für interne Self-Hosted MCPs:
- Laufe den MCP-Prozess in einem Container mit keinem Network-Zugriff außer zu den spezifischen Upstream-APIs, die er braucht
- Nutze Read-Only-Datenbank-Credentials wo der MCP nur lesen muss
- Logge alle Tool-Invocations Server-seitig — wenn Claude unerwartet ein destruktives Tool ruft, möchtest du einen Audit-Trail

---

## Debugging Remote MCPs

### --mcp-debug Flag

Aktiviert Ausführliches MCP-Protokoll-Logging — jede zwischen Claude Code und dem MCP-Server gesendete/empfangene Nachricht ist zu stderr gedruckt.

```bash
claude --mcp-debug
```

Output-Format:
```
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/list","id":1}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_issues",...},"id":2}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":2,"result":{"content":[...]}}
```

Nutze das, um zu diagnostizieren:
- Auth-Fehler (Server gibt einen Error auf `tools/list` zurück)
- Schema-Mismatches (Tool-Call abgelehnt wegen falscher Input-Form)
- Unerwartete Tool-Outputs (sehe genau, was kam, bevor Claude es verarbeitete)

### Häufige Connection-Fehler

**`ECONNREFUSED` / `Connection refused`:**
Server läuft nicht oder die URL ist falsch. Verifiziere die URL mit curl:
```bash
curl -I https://your-mcp-server.com/sse
```

**`401 Unauthorized`:**
Auth-Header fehlt oder Token ist ungültig. Überprüfe, dass die Environment-Variable gesetzt ist:
```bash
echo $YOUR_MCP_TOKEN
```

**`Connection timeout`:**
Server ist erreichbar, aber langsam zu antworten. Erhöhe `connectionTimeout` in Settings:
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
Server verbunden, aber keine Tools registriert. Normalerweise zeigt, dass der Server gestartet ist, aber seine Tool-Registry nicht initialisiert hat — überprüfe Server-Logs.

**`Tool call timeout`:**
Das Tool lief, aber gab nicht innerhalb des Timeout-Fensters zurück. Erhöhe `timeout` (default ist 30000ms):
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

### Testing Ohne Claude Code

Nutze `curl` oder `npx @modelcontextprotocol/inspector`, um einen Remote MCP-Server unabhängig zu verifizieren:

```bash
# Test SSE-Verbindung
curl -N -H "Authorization: Bearer $TOKEN" https://mcp.example.com/sse

# MCP Inspector — interaktive GUI für Testing MCP-Server
npx @modelcontextprotocol/inspector https://mcp.example.com/sse
```

Der Inspector lässt dich Tools durchsuchen, sie mit Custom-Argumenten invoke und Roh-Protocol-Nachrichten sehen — essentiell zum Debuggen eines Servers, den du baust.

---

## Multi-Tenant MCPs: Per-User-Tokens und Isolation

Wenn du einen MCP für ein Team hostest, muss jeder Nutzer von anderen's Daten isoliert sein. Zwei Patterns:

### Token-Per-User Isolation (empfohlen)

Jeder Entwickler generiert seinen eigenen Token vom Upstream-Service (z.B. ihren eigenen Sentry-Auth-Token). Der MCP-Server nutzt diesen Token, um Upstream-API-Calls im Namen des Nutzers zu machen — Zugriff ist, was die Nutzer's eigene Permissions erlauben.

**Konfiguration:** Jeder Entwickler fügt den MCP zu ihren Nutzer-Level `~/.claude/settings.json` mit ihrem eigenen Token. Das Projekt-Level `.claude/settings.json` definiert die MCP-URL ohne Token.

Projekt-Settings (geteilt, im Repo):
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

Nutzer-Settings (lokal, nicht im Repo):
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

Claude Code merged diese — die URL kommt von Projekt-Settings, der Auth-Header kommt von Nutzer-Settings.

### Server-Seitige Session-Isolation

Für MCPs, die geteilen State verwalten, muss der Server Daten pro authentifizierten Nutzer isolieren. Das Pattern:

1. Client sendet einen Nutzer-identifizierenden Token (API-Key oder JWT) im `Authorization` Header
2. Server validiert den Token und extrahiert eine User-ID oder Tenant-ID
3. Alle Tool-Operationen sind zu diesem Tenant's Daten scoped
4. Server-seitig Audit-Log Records `(user_id, tool_name, timestamp, args_hash)` für jeden Call

```typescript
// Pseudocode — Server-seitige Isolation
async function handleToolCall(request: Request, toolName: string, args: unknown) {
  const userId = await authenticateRequest(request)  // throws bei ungültiger Auth
  const userDb = getDbForTenant(userId)              // isolierte Connection/Schema
  return await tools[toolName](userDb, args)
}
```

Lasse nie einen Client ihre eigene Tenant-ID als Tool-Argument übergeben — leite sie Server-seitig vom Auth-Token ab. Ein Client, die `tenant_id: "other-company"` übergeben, sollte einen 403 resultat, nicht Daten-Exposition.

---

## MCP Proxy-Pattern

Ein einzelner Remote MCP, der mehrere Upstream-Tools aggregiert. Nützlich für:
- Reduction der Anzahl MCP-Verbindungen, die Claude Code verwaltet
- Zentralisierung der Auth-Verwaltung für ein Team
- Hinzufügen einer Logging/Audit-Schicht über alle Tool-Calls
- Rate-Limiting oder Caching von Upstream-API-Calls

**Architektur:**
```
Claude Code
    |
    v
[MCP Proxy Server]  <-- Eine Verbindung, Ein Auth-Token aus Claudes Perspektive
    |        |        |
    v        v        v
 Sentry   GitHub    Internal API
 (token)  (token)   (token)
```

Der Proxy hält Upstream-Credentials Server-seitig. Claude Code braucht nur Credentials für den Proxy selbst. Der Proxy übersetzt Tool-Calls und routet sie zum angemessenen Upstream-Service.

**Wann ein Proxy zu bauen ist:**
- Team hat 8+ MCP-Services und Startup-Zeit ist merklich langsam
- Du brauchst Auth-Middleware (Token-Refresh, Rate-Limiting), die Vendors nicht bieten
- Du möchtest ein einzelnes Audit-Log für alle MCP-Aktivität über dein Team
- Manche Upstream-Services haben keine offiziellen MCP-Server, und du wrappest ihre REST-APIs

**Wann man keinen Proxy baut:**
- Du hast 2–4 Services — der Overhead rechtfertigt nicht die Komplexität
- Du brauchst Live-Updates zu Tool-Schemas — Proxy fügt eine Caching-Schicht hinzu, die stale wird
- Du möchtest Per-User-Isolation — ein Proxy macht Nutzer-Level-Token-Verwaltung schwieriger

---

## Performance: Production MCP bei Scale

### Connection-Pooling

Remote MCP-Server sollten persistente Verbindungen beibehalten, statt eine neue TCP+TLS Handshake pro Tool-Call zu etablieren. Für SSE-Transport ist die Verbindung inhärent persistent. Für Streamable-HTTP ist Server-seitige Connection-Pooling zu Upstream-Services die Verantwortung der Server-Implementierung.

Server-seitig:
```typescript
// Datenbank-Verbindungen über Requests wiederverwenden
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Nutze Pool über alle Tool-Call-Handler
```

### Keep-Alive für SSE

SSE-Verbindungen können stillschweigend von Intermediate-Proxies gelöscht werden, die Idle-Verbindungen schließen. Sende einen Periodischen Heartbeat-Comment, um die Verbindung am Leben zu halten:

```typescript
// Server sendet alle 30 Sekunden einen Comment, um Proxy-Timeout zu verhindern
const keepAlive = setInterval(() => {
  res.write(': keepalive\n\n')
}, 30000)

req.on('close', () => clearInterval(keepAlive))
```

Claude Code handhabt Reconnection automatisch, aber ein Heartbeat verhindert unnötige Reconnection-Overhead.

### Retry mit Exponential Backoff

Claude Code wiederversucht fehlgeschlagene MCP Tool-Calls, aber Server-seitige Retries für Upstream-Abhängigkeiten sind deine Verantwortung. Implementiere Backoff für jeden Network-Call, den der MCP macht:

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

Wende Backoff auf an: Upstream-API-Calls, Datenbank-Queries (für Transient-Connection-Fehler) und Object-Storage-Operationen.

### Response-Caching

Tool-Ergebnisse, die teuer zu compute sind und nicht häufig ändern, sollten Server-seitig gecacht werden. Das ist besonders wertvoll für Schema-Introspection-Tools — ein Datenbank-Schema ändert sich nicht zwischen Tool-Calls.

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

// Usage: cache Schema für 5 Minuten
const schema = await cached('db-schema', 5 * 60 * 1000, () => db.introspectSchema())
```

---

## Komplette settings.json Snippets

### 1 — Supabase + Sentry + Neon (Remote-Only, Nutzer-Level)

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

### 2 — Interner Team MCP mit mTLS und Custom-Headers

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

### 3 — GitHub + Cloudflare + Vercel (API-Key-Pattern)

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

### 4 — Gemischt Local + Remote (Projekt-Level, Tokens aus Umgebung)

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

### 5 — Self-Hosted Proxy MCP mit Deferred Discovery aktiviert

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

Der Proxy aggregiert alle Upstream-Tools — Claude Code sieht einen Server mit vielen Tools. Deferred Discovery ist besonders wertvoll hier, weil der Proxy 50+ Tools exponiert und du nur ein Handvoll pro Session nutzt.

---

## Arbeite mit uns
