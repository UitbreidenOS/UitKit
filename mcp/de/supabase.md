# MCP: Supabase

Geben Sie Claude Code direkten Zugriff auf Ihr Supabase-Projekt — fragen Sie Postgres-Tabellen ab, überprüfen Sie RLS-Richtlinien, verwalten Sie Auth-Benutzer, rufen Sie Edge Functions auf und arbeiten Sie mit Storage — alles ohne Schema oder API-URLs in jede Session einzufügen.

## Warum Sie das brauchen

Ohne MCP bedeutet das Arbeiten mit Supabase, Tabellendefinitionen zu kopieren, API-URLs zu suchen und den Kontext bei jeder Session neu zu etablieren. Mit dem Supabase MCP:
- Claude fragt Ihre Postgres-Datenbank direkt ab — kein Copy-Paste von Schema
- Tabellenstrukturen, Spaltentypen und Foreign Keys werden in Echtzeit introspektiert
- RLS-Richtlinien sind lesbar und nachprüfbar in der gleichen Session wie Ihr Code
- Auth-Benutzer und Authentication Logs sind abfragbar zum Debugging und für Compliance
- Edge Functions können aufgelistet, inspiziert und mit einer Payload aufgerufen werden
- Storage-Buckets sind für Read- und Write-Operationen zugänglich
- Database Branching ermöglicht sichere Schema-Iteration ohne Production zu berühren

## Installation

Kein npm Install erforderlich für die Remote-Variante. Die lokale `npx`-Variante ruft das Paket beim ersten Run ab.

## Konfiguration

**Lokal (npx — empfohlen für die meisten Setups):**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_PROJECT_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

Ersetzen Sie `YOUR_PROJECT_REF` mit Ihrer Project Reference (die Subdomain in Ihrer Supabase URL) und `YOUR_SERVICE_ROLE_KEY` mit dem Service Role Key vom Dashboard.

**Remote (SSE Transport — keine lokale Abhängigkeit):**

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SUPABASE_ACCESS_TOKEN"
      }
    }
  }
}
```

Die Remote-Variante verwendet einen Supabase Personal Access Token statt eines Service Role Keys. Generieren Sie einen unter **Account Settings → Access Tokens**.

Fügen Sie entweder den Block zu `~/.claude.json` (global) oder `.claude/mcp.json` (per-project) hinzu.

## Ihre Credentials finden

- **Project URL und Service Role Key:** Supabase Dashboard → Ihr Project → **Settings → API**
- Der Service Role Key ist mit `service_role` unter **Project API keys** gekennzeichnet
- Der `anon` Key ist nicht ausreichend — er respektiert RLS und blockiert viele Tool-Operationen
- Für die Remote SSE-Variante: **supabase.com → Account → Access Tokens → Generate new token**

## Key Tools

| Tool | Was es tut |
|---|---|
| `query_table` | Führe eine SQL SELECT gegen any Table in any Schema aus |
| `list_tables` | Zähle Tables mit Columns, Types, Nullability und Foreign Keys auf |
| `get_rls_policies` | Zeige alle Row-Level Security Policies für eine Table |
| `list_functions` | Auflisten aller Edge Functions mit Deployment Status |
| `invoke_function` | Rufe eine Edge Function mit JSON Payload auf |
| `list_buckets` | Zeige Storage Buckets und ihre Access Settings |
| `upload_file` | Lade eine Datei zu einem Storage Bucket hoch |
| `list_auth_users` | Abfrage auth.users — Email, Provider, Confirmation Status, Metadata |
| `get_auth_logs` | Rufe Authentication Events für Auditing oder Debugging ab |

## Verwendungsbeispiele

```
Zeige mir alle Tables im public Schema mit ihren Column Types und RLS Policies
```

```
Finde alle Users, die sich in den letzten 7 Tagen registriert haben aber ihre Email nie bestätigt haben
```

```
Generiere eine TypeScript Type Definition für die profiles Table basierend auf dem tatsächlichen Schema
```

```
Schreibe eine Migration, um eine Soft-Delete Column (deleted_at timestamptz) zur posts Table zu addieren
```

```
Überprüfe jede Table im public Schema — kennzeichne jede, die keine RLS Policies aktiviert hat
```

```
Zeige alle Edge Functions, ihre zuletzt deployed Version und Invocation Counts für diese Woche
```

```
Auflisten aller auth.users wo Provider 'email' ist und email_confirmed_at null ist
```

```
Lade die Datei unter ./exports/report.pdf in den reports Storage Bucket hoch
```

## Database Branching

Supabase Branching erstellt eine isolierte Kopie Ihrer Datenbank für Development und Preview Work. Jeder Branch erhält seine eigene URL und Service Role Key, sodass Migrations getestet werden können ohne Produktions-Risiko.

Erstellen Sie einen Branch via Supabase CLI:

```bash
supabase branches create dev
```

Zeige MCP auf die Branch URL für sichere Schema Iteration:

```json
{
  "mcpServers": {
    "supabase-dev": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_BRANCH_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_BRANCH_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

Führe mehrere benannte MCP Entries aus — eine für Production, eine für den Branch — und wechsle, indem du den Server Name in deinen Prompts referenzierst. Claude kann eine Migration auf den Branch anwenden, das Schema validieren und die Korrektheit bestätigen, bevor du zu main promotest.

## Kombinieren mit GitHub MCP

Supabase MCP und GitHub MCP zusammen ermöglichen Claude die Schließung der Schleife bei Schema Migrations:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://YOUR_PROJECT_REF.supabase.co",
        "--supabase-service-role-key", "YOUR_SERVICE_ROLE_KEY"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT"
      }
    }
  }
}
```

Mit beiden Servern aktiv kann Claude eine PR lesen, die Migration SQL aus dem Diff extrahieren, sie gegen das live Schema mit `list_tables` vergleichen und alle Konflikte kennzeichnen, bevor die PR merged wird.

Beispiel Prompt:

```
Lies PR #47, extrahiere all SQL aus dem migrations/ Directory, vergleiche es
gegen das aktuelle public Schema und kennzeichne every Column Rename oder Drop
die existierende Queries brechen könnte.
```

## Sicherheit

Der Service Role Key umgeht Row-Level Security komplett. Behandle ihn als Root Credential.

- Für Solo Development auf einem lokalen oder Dev Project: Service Role Key in MCP Config ist akzeptabel.
- Für geteilte Team Umgebungen: erstelle eine Read-Only Postgres Role mit direkter Connection String statt Service Role Key zu verwenden. Gewähre nur die Schemas, die Claude lesen darf.
- Committet deinen Service Role Key nie zu Git. Addiere ihn zu `.gitignore` wenn du eine `.env` Datei verwendest und inline ihn nie in einem Project `.claude/mcp.json`, das checked in ist.
- Rotiere den Service Role Key sofort, wenn er jemals in einem public Repository exposiert ist.

---

> **Arbeiten Sie mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir bauen KI-Produkte und B2B Lösungen mit Developer Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
