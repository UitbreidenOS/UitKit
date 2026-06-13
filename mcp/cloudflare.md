# MCP: Cloudflare

Manage the full Cloudflare edge stack — Workers, R2, D1, KV, DNS, Pages, AI, and Zero Trust — from Claude Code via a family of 16 specialized MCP modules.

## Why you need this

Cloudflare's dashboard covers dozens of product areas across multiple navigation layers. The Cloudflare MCP ecosystem collapses that into direct tool calls: deploy a Worker, update a DNS record, run a D1 SQL query, or invoke a Workers AI model — all from a single Claude Code session. Each module is independent, so you enable only what your project uses.

## Installation

```bash
npx -y @cloudflare/mcp-server-cloudflare <module>
```

Replace `<module>` with the specific service name (e.g., `workers`, `dns`, `d1`). Each module runs as a separate MCP server entry.

## Configuration

Each module is registered as a separate server so you can enable and disable them individually:

```json
{
  "mcpServers": {
    "cloudflare-workers": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "workers"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-dns": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "dns"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-d1": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "d1"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

Add or remove modules from your config independently.

## Key tools

### workers
Deploy, update, and delete Workers scripts. View logs and tail real-time output.

### r2
Create and delete buckets. Upload, download, and list objects in R2 storage.

### d1
Create D1 databases. Execute SQL queries. Run schema migrations.

### kv
Read, write, and delete entries in KV namespaces. List keys with prefix filters.

### pages
List and create Pages deployments. Manage custom domains on Pages projects.

### dns
Add, update, and delete DNS records (A, AAAA, CNAME, MX, TXT, SRV).

### ai
Run Workers AI models: text generation, image generation, speech-to-text, and embeddings.

### analytics
Query Web Analytics event data. Access Zaraz analytics configuration.

### zero-trust
Manage Zero Trust access policies, tunnels, and device posture rules.

## Usage examples

```
Deploy my updated worker script to production zone example.com

Add a CNAME record for api.example.com pointing to my-load-balancer.com

Query the last 100 rows from my D1 analytics database

Run Workers AI llama-3 text generation with this prompt

Show web analytics for the last 7 days broken down by country

Upload this JSON file to the my-app-assets R2 bucket

Write a KV entry: key=feature_flags value={"dark_mode":true}

List all active Zero Trust access policies for the admin subdomain
```

## Authentication

1. Go to [cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token** — use **Create Custom Token**
3. Set permissions based on the modules you are enabling:
   - DNS module: `Zone → DNS → Edit`
   - Workers module: `Account → Workers Scripts → Edit`
   - R2 module: `Account → R2 Storage → Edit`
   - D1 module: `Account → D1 → Edit`
   - Zero Trust module: `Account → Access: Organizations, Identity Providers, and Groups → Edit`
4. Find your Account ID in the Cloudflare dashboard sidebar (right side of any zone overview page)
5. Set both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the env block for each module

A single token can carry multiple permission sets — you do not need one token per module.

## Tips

- Register each module as a separate named MCP server (`cloudflare-workers`, `cloudflare-dns`, etc.) so you can comment out unused modules without touching the others.
- Workers AI (`ai` module) gives access to Cloudflare's hosted models — Llama 3, Mistral, Whisper, SDXL — at no additional API key cost beyond your Cloudflare account.
- Zero Trust module requires `Access: Organizations, Identity Providers, and Groups` permission on your token — this is separate from the standard zone/account permissions.
- D1 `execute_sql` supports read and write — use it directly for one-off queries or wire it into migration workflows alongside the Neon MCP for multi-database projects.
- `kv` operations are eventually consistent across Cloudflare's edge — reads may lag writes by up to 60 seconds in distant regions.
- The `dns` module is the fastest way to manage DNS changes programmatically — changes propagate within seconds on Cloudflare-managed zones.

---
