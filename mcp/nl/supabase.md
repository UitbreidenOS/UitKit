# MCP: Supabase

Geef Claude Code direct access tot uw Supabase project — query Postgres tables, inspect RLS policies, manage auth users, invoke Edge Functions, en werk met Storage — alles zonder schema of API URLs in elke sessie te plakken.

## Waarom u dit nodig hebt

Zonder MCP betekent werken met Supabase het kopiëren van table definitions, het zoeken naar API URLs, en het herestableren van context in elke sessie. Met de Supabase MCP:
- Claude queries uw Postgres database direct — geen copy-pasting schema
- Table structures, column types, en foreign keys worden in real time geïntrospecteerd
- RLS policies zijn leesbaar en auditable binnen dezelfde sessie als uw code
- Auth users en authentication logs zijn queryable voor debugging en compliance
- Edge Functions kunnen worden gelisted, geïnspecteerd, en aangeroepen met een payload
- Storage buckets zijn accessible voor read en write operations
- Database branching maakt veilige schema iteration mogelijk zonder production aan te raken

## Installatie

Geen npm install vereist voor de remote variant. De lokale `npx` variant pullt de package bij eerste run.

## Configuratie

**Lokaal (npx — aanbevolen voor meeste setups):**

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

Vervang `YOUR_PROJECT_REF` met uw project reference (de subdomain in uw Supabase URL) en `YOUR_SERVICE_ROLE_KEY` met de service role key uit de dashboard.

**Remote (SSE transport — geen lokale dependency):**

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

De remote variant gebruikt een Supabase personal access token in plaats van een service role key. Genereer één onder **Account Settings → Access Tokens**.

Voeg beide blok toe aan `~/.claude.json` (globaal) of `.claude/mcp.json` (per-project).

## Uw credentials zoeken

- **Project URL en service role key:** Supabase Dashboard → uw project → **Settings → API**
- De service role key is gelabeld `service_role` onder **Project API keys**
- De `anon` key is niet voldoende — het respecteert RLS en zal veel tool operations blokkeren
- Voor de remote SSE variant: **supabase.com → Account → Access Tokens → Generate new token**

## Key tools

| Tool | Wat het doet |
|---|---|
| `query_table` | Run een SQL SELECT tegen elke table in elke schema |
| `list_tables` | Enumerate tables met columns, types, nullability, en foreign keys |
| `get_rls_policies` | Show alle Row-Level Security policies voor een table |
| `list_functions` | List alle Edge Functions met deployment status |
| `invoke_function` | Call een Edge Function met een JSON payload |
| `list_buckets` | Show Storage buckets en hun access settings |
| `upload_file` | Upload een file naar een Storage bucket |
| `list_auth_users` | Query auth.users — email, provider, confirmation status, metadata |
| `get_auth_logs` | Retrieve authentication events voor auditing of debugging |

## Gebruik voorbeelden

```
Show me all tables in the public schema with their column types and RLS policies
```

```
Find all users who signed up in the last 7 days but never confirmed their email
```

```
Generate a TypeScript type definition for the profiles table based on the actual schema
```

```
Write a migration to add a soft-delete column (deleted_at timestamptz) to the posts table
```

```
Check every table in the public schema — flag any that have no RLS policies enabled
```

```
Show all Edge Functions, their last deployed version, and invocation counts for this week
```

```
List all auth.users where the provider is 'email' and email_confirmed_at is null
```

```
Upload the file at ./exports/report.pdf to the reports Storage bucket
```

## Database branching

Supabase branching maakt een isolated copy van uw database voor development en preview work. Elke branch krijgt zijn eigen URL en service role key, dus migrations kunnen zonder risk naar production worden tested.

Maak een branch via de Supabase CLI:

```bash
supabase branches create dev
```

Point MCP naar de branch URL voor veilige schema iteration:

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

Run meerdere named MCP entries — één voor production, één voor de branch — en wissel door de server name in uw prompts te refereneren. Claude kan een migration naar de branch toepassen, het schema valideren, en correctness bevestigen voordat u naar main promoveert.

## Combineer met GitHub MCP

Supabase MCP en GitHub MCP samen laten Claude de loop op schema migrations sluiten:

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

Met beide servers actief, kan Claude een PR lezen, de migration SQL uit de diff extracten, het tegen het live schema vergelijken met `list_tables`, en conflicts flaggen voordat de PR merged is.

Voorbeeld prompt:

```
Read PR #47, extract all SQL from the migrations/ directory, compare it against
the current public schema, and flag any column renames or drops that could
break existing queries.
```

## Security

De service role key omzeilt Row-Level Security volledig. Behandel het als een root credential.

- Voor solo development op een lokaal of dev project: service role key in MCP config is acceptabel.
- Voor shared team environments: maak een read-only Postgres role met een direct connection string in plaats van de service role key. Grant alleen de schemas die Claude moet lezen.
- Commit nooit uw service role key naar git. Voeg het toe aan `.gitignore` als u een `.env` file gebruikt, en inline het nooit in een project `.claude/mcp.json` die is checked in.
- Rotate de service role key onmiddellijk als het ooit in een public repository is blootgesteld.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
