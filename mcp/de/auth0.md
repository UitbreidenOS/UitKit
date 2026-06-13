# MCP: Auth0

Verbinde Claude Code mit Auth0 für Identity und Access Management — query Nutzer, verwalte Roles, inspiziere Login-Logs und führe Remediation-Actions aus, ohne dein Terminal zu verlassen.

## Warum du das brauchst

Nutzer-Access-Issues — gesperrte Accounts, verdächtige Login-Patterns, Role-Mismatches — erfordern konstante Context-Switches zwischen deinem Code und dem Auth0 Management Dashboard. Das Auth0 MCP bringt diese Daten in Claude, so du einen Incident untersuchen, einen kompromittierten Account blockieren oder Role-Assignments auditen kannst, in einer Konversation.

## Voraussetzungen

- Auth0 Account (jeder Plan; Management API Zugriff ist auf allen Plänen verfügbar, einschließlich Free)
- Ein **Machine-to-Machine (M2M) Application**, registriert in deinem Auth0 Tenant, autorisiert, den Auth0 Management API zu rufen
- Das M2M Application's **Client-ID** und **Client-Secret**
- Dein Auth0 **Domain** (z.B. `your-tenant.us.auth0.com`)

## Installation

Installiere offiziellen Auth0 MCP-Server via npx — keine Global-Installation erforderlich.

```bash
npx @auth0/auth0-mcp-server --version
```

## Konfiguration

Füge folgendes zu deinen `~/.claude/settings.json` (Nutzer-Level) oder `.claude/settings.json` (Projekt-Level) hinzu:

```json
{
  "mcpServers": {
    "auth0": {
      "command": "npx",
      "args": ["-y", "@auth0/auth0-mcp-server"],
      "env": {
        "AUTH0_DOMAIN": "your-tenant.us.auth0.com",
        "AUTH0_CLIENT_ID": "YOUR_M2M_CLIENT_ID",
        "AUTH0_CLIENT_SECRET": "YOUR_M2M_CLIENT_SECRET"
      }
    }
  }
}
```

Ersetze `your-tenant.us.auth0.com` mit deinem Aktuellen Auth0 Domain — sichtbar im Auth0 Dashboard unter **Applications → dein M2M App → Domain**.

## Schlüssel-Tools

| Tool | Beschreibung | Schlüssel-Parameter |
|---|---|---|
| `list_users` | Search und Liste Nutzer im Tenant | `q` (Lucene Query), `per_page`, `page`, `sort` |
| `get_user` | Fetch Vollständiges Profil für einen einzelnen Nutzer | `id` (Auth0 Nutzer-ID, z.B. `auth0\|abc123`) |
| `create_user` | Erstelle neuen Nutzer in einer Database Connection | `email`, `password`, `connection`, `name` |
| `assign_roles` | Assign eine oder mehrere Rollen zu einem Nutzer | `id`, `roles` (Array von Role-IDs) |
| `list_applications` | Liste alle Applications registriert im Tenant | `per_page`, `page` |
| `get_logs` | Retrieve Tenant-Log-Events mit Filter-Support | `q` (Event-Type, Nutzer, IP), `per_page`, `from`, `take` |
| `block_user` | Block einen Nutzer-Account (verhindert Login) | `id` |

## Verwendungsbeispiele

```
Liste alle Nutzer, die in den letzten 7 Tagen sich registriert haben

Block sofort den Account für email@example.com

Zeige alle fehlgeschlagenen Login-Attempts von den letzten 24 Stunden

Assign die "admin" Rolle zu Nutzer auth0|64a1f2b3c4d5e6f7a8b9c0d1

Liste alle Applications, die in diesem Auth0 Tenant registriert sind
```

## Authentifizierung — Erstelle die M2M Application

1. Melde dich bei Auth0 Dashboard ein und gehe zu **Applications → Create Application**
2. Wähle **Machine to Machine Applications** und benenne es (z.B. `claude-code-mcp`)
3. Auf dem nächsten Screen, wähle **Auth0 Management API** als die autorisiert API
4. Grant die Scopes, die dein Use-Case braucht (siehe Scopes unten) und klick **Authorize**
5. Gehe zu dem **Settings** Tab deiner neuen M2M App und copy **Domain**, **Client-ID** und **Client-Secret**
6. Paste alle drei in den `env` Block in settings.json

**Mindest-erforderliche Scopes nach Operation:**

| Operation | Erforderlicher Scope |
|---|---|
| Read Nutzer | `read:users` |
| Create Nutzer | `create:users` |
| Block/Unblock Nutzer | `update:users` |
| Assign Rollen | `update:users`, `read:roles` |
| Read Logs | `read:logs` |
| List Applications | `read:clients` |

Grant nur die Scopes, die du brauchst. Vermeide `read:client_keys` — es exponiert Client-Secrets für alle Applications.

## Tipps

- Auth0 Nutzer-IDs folgen dem Format `provider|id` — für Database Connections, es ist `auth0|hex_id`. Nutze `list_users` mit `q:email:user@example.com`, um die ID zu finden, bevor du Single-User-Operationen lauft.
- `get_logs` unterstützt Auth0's Event-Type Codes in der Query: `q=type:f` gibt alle fehlgeschlagenen Logins; `q=type:s` gibt Erfolge. Volle Event-Type Reference ist in Auth0 Docs unter Log Event Type Codes.
- `block_user` ist Reversible — nutze `update_user` mit `blocked: false` (oder das äquivalente MCP Tool, wenn exponiert), um zu unblock. Blocking validiert nicht Existierend Sessions — paare es mit einem Call zu Revoke Active Sessions, wenn sofortiges Lockout erforderlich ist.
- Management API hat Rate-Limit von 2 Requests/Sekunde pro Tenant auf Free Plans und höher Limits auf Bezahl-Plänen. Vermeide Looping `get_user` Calls in Tight-Sequenzen.
- M2M Tokens, issued durch Auth0, verfallen nach 24 Stunden standardmäßig. Der MCP Server handhabt Token Refresh automatisch — keine manuelle Rotation erforderlich.
- Für Multi-Tenant-Architekturen (ein Auth0 Tenant pro Kunde), du wirst eine separate MCP Config pro Tenant brauchen. Consider Nutzung von Projekt-Level settings.json scoped zu jedem Projekt.

## Kosten-Notizen

Auth0 Management API Calls sind in allen Auth0 Plänen enthalten — es gibt keine Per-Call-Fees. Aber, Free-Pläne cappen bei 1,000 Active-Usern und erzwingen Management API Rate-Limits. Produktions Tenants auf Bezahl-Plänen haben höhere Rate-Limits und Nutzer-Kapazität. Überprüfe dein Plan's Management API Quote unter **Settings → Tenant Settings** im Auth0 Dashboard.

---
