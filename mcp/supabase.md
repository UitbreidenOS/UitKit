# MCP: Supabase

Give Claude Code direct access to your Supabase project — query Postgres tables, inspect RLS policies, manage auth users, invoke Edge Functions, and work with Storage — all without pasting schema or API URLs into every session.

## Why you need this

Without MCP, working with Supabase means copying table definitions, hunting for API URLs, and re-establishing context every session. With the Supabase MCP:
- Claude queries your Postgres database directly — no copy-pasting schema
- Table structures, column types, and foreign keys are introspected in real time
- RLS policies are readable and auditable inside the same session as your code
- Auth users and authentication logs are queryable for debugging and compliance
- Edge Functions can be listed, inspected, and invoked with a payload
- Storage buckets are accessible for read and write operations
- Database branching enables safe schema iteration without touching production

## Installation

No npm install required for the remote variant. The local `npx` variant pulls the package on first run.

## Configuration

**Local (npx — recommended for most setups):**

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

Replace `YOUR_PROJECT_REF` with your project reference (the subdomain in your Supabase URL) and `YOUR_SERVICE_ROLE_KEY` with the service role key from the dashboard.

**Remote (SSE transport — no local dependency):**

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

The remote variant uses a Supabase personal access token rather than a service role key. Generate one under **Account Settings → Access Tokens**.

Add either block to `~/.claude.json` (global) or `.claude/mcp.json` (per-project).

## Finding your credentials

- **Project URL and service role key:** Supabase Dashboard → your project → **Settings → API**
- The service role key is labeled `service_role` under **Project API keys**
- The `anon` key is not sufficient — it respects RLS and will block many tool operations
- For the remote SSE variant: **supabase.com → Account → Access Tokens → Generate new token**

## Key tools

| Tool | What it does |
|---|---|
| `query_table` | Run a SQL SELECT against any table in any schema |
| `list_tables` | Enumerate tables with columns, types, nullability, and foreign keys |
| `get_rls_policies` | Show all Row-Level Security policies for a table |
| `list_functions` | List all Edge Functions with deployment status |
| `invoke_function` | Call an Edge Function with a JSON payload |
| `list_buckets` | Show Storage buckets and their access settings |
| `upload_file` | Upload a file to a Storage bucket |
| `list_auth_users` | Query auth.users — email, provider, confirmation status, metadata |
| `get_auth_logs` | Retrieve authentication events for auditing or debugging |

## Usage examples

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

Supabase branching creates an isolated copy of your database for development and preview work. Each branch gets its own URL and service role key, so migrations can be tested without risk to production.

Create a branch via the Supabase CLI:

```bash
supabase branches create dev
```

Point MCP at the branch URL for safe schema iteration:

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

Run multiple named MCP entries — one for production, one for the branch — and switch by referencing the server name in your prompts. Claude can apply a migration to the branch, validate the schema, and confirm correctness before you promote to main.

## Combine with GitHub MCP

Supabase MCP and GitHub MCP together let Claude close the loop on schema migrations:

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

With both servers active, Claude can read a PR, extract the migration SQL from the diff, compare it against the live schema using `list_tables`, and flag any conflicts before the PR is merged.

Example prompt:

```
Read PR #47, extract all SQL from the migrations/ directory, compare it against
the current public schema, and flag any column renames or drops that could
break existing queries.
```

## Security

The service role key bypasses Row-Level Security entirely. Treat it as a root credential.

- For solo development on a local or dev project: service role key in MCP config is acceptable.
- For shared team environments: create a read-only Postgres role with a direct connection string instead of using the service role key. Grant only the schemas Claude needs to read.
- Never commit your service role key to git. Add it to `.gitignore` if you use a `.env` file, and never inline it in a project `.claude/mcp.json` that is checked in.
- Rotate the service role key immediately if it is ever exposed in a public repository.

---
