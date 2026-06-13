# Top 100 MCP-servers voor onafhankelijke bouwers

De meest bruikbare MCP-servers in 2026 — met installatiecommando's, wat elk doet en gecureerde starterbundels. Gebaseerd op maandelijks zoekvolume (170K+ gecombineerd), GitHub-sterren en real productiegebruik.

**Begin hier:** Krijg 80% waarde van 5 servers. Voor onafhankelijke bouwers: **GitHub + Memory + Playwright + PostgreSQL/Supabase + Stripe**. Al het rest is aanvullend.

---

## Hoe je een MCP-server installeert

Voeg toe aan `~/.claude.json` (global) of `.claude/mcp.json` (project):

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name@latest"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

Voor Python-servers gebruik je: `"command": "uvx"` of `"command": "python"` met het argument `"-m"`.
Start Claude Code opnieuw na het toevoegen van servers.

---

## 🏆 TIER 1 — Essentieel (Elke onafhankelijke bouwer)

### 1. GitHub (82K maandelijkse zoekopdrachten · Officieel)
Lees PR's, zoek code, maak problemen aan, beheer branches, bekijk diffs.

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
}
```
Token: github.com/settings/tokens → bereiken `repo, read:org`

---

### 2. Memory (Knowledge Graph Persistentie)
Onthoudt feiten, beslissingen en context over Claude Code-sessies. Meest gewilde mogelijkheid.

```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"],
  "env": {
    "MEMORY_FILE_PATH": "/Users/you/.claude/memory/knowledge.json"
  }
}
```

---

### 3. Playwright (82K zoekopdrachten · Microsoft Officieel)
Beheer een echte browser — navigeer, klik, vul formulieren in, maak schermafbeeldingen, schraper JS-gerichte pagina's. Gebruikt toegankelijkheidsboom voor betrouwbare automatisering.

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"],
  "env": { "BROWSER": "chromium" }
}
```

---

### 4. PostgreSQL (Officieel)
Voer SQL-query's uit, verken schema's, beantwoord bedrijfsvragen zonder gegevens te exporteren.

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
}
```
Gebruik een alleen-lezen verbindingsreeks voor veiligheid.

---

### 5. Stripe (Officieel)
Klantopzoeking, betalingsvragen, abonnementsbeheer, factuurautomatisering.

```json
"stripe": {
  "command": "npx",
  "args": ["-y", "@stripe/agent-toolkit"],
  "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
}
```
docs.stripe.com/mcp voor volledige instellingen.

---

### 6. Filesystem (Officieel)
Lees, schrijf en zoek bestanden buiten de huidige projectmap.

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
}
```

---

### 7. Fetch (Officieel)
Maak HTTP-verzoeken naar elke URL, haal webpagina's op, roep REST-API's aan.

```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

---

## 💻 TIER 2 — Ontwikkelaarsstapel

### 8. Context7 (32K zoekopdrachten)
Haalt actuele, versiespecifieke bibliotheekdocumentatie op. Voorkomt dat Claude verouderde API's gebruikt.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

---

### 9. Supabase (26K zoekopdrachten · Officieel)
Volledige Supabase-controle — database, verificatie, opslag, edge-functies, RLS-beleid.

```json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase@latest"],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_...",
    "SUPABASE_PROJECT_REF": "your-project-ref"
  }
}
```

---

### 10. Git (Officieel)
Lokale repo-toegang — branches, commits, diffs, log, blame.

```json
"git": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
}
```

---

### 11. GitLab (Officieel)
MR's, problemen, pipelines, CI/CD-beheer.

```json
"gitlab": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gitlab"],
  "env": {
    "GITLAB_PERSONAL_ACCESS_TOKEN": "glpat-...",
    "GITLAB_API_URL": "https://gitlab.com/api/v4"
  }
}
```

---

### 12. Sentry (4.7K zoekopdrachten · Officieel)
Query fouten, maak problemen aan, bekijk stack traces en prestatiegegevens.

```json
"sentry": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sentry"],
  "env": {
    "SENTRY_AUTH_TOKEN": "sntrys_...",
    "SENTRY_ORGANIZATION": "your-org-slug"
  }
}
```

---

### 13. Desktop Commander
Terminal-toegang, procestbeheer, bestandssysteembeheer, ripgrep-zoeking.

```json
"desktop-commander": {
  "command": "npx",
  "args": ["-y", "@wonderwhy-er/desktop-commander"]
}
```

---

### 14. Docker (10.3K zoekopdrachten)
Beheer containers, afbeeldingen, volumes, netwerken.

```json
"docker": {
  "command": "npx",
  "args": ["-y", "mcp-server-docker"]
}
```

---

### 15. MySQL (4.2K zoekopdrachten)
Query MySQL-databases, schema-verkenning, SQL-uitvoering.

```json
"mysql": {
  "command": "npx",
  "args": ["-y", "@benborla29/mcp-server-mysql"],
  "env": {
    "MYSQL_HOST": "localhost",
    "MYSQL_PORT": "3306",
    "MYSQL_USER": "root",
    "MYSQL_PASSWORD": "password",
    "MYSQL_DATABASE": "mydb"
  }
}
```

---

### 16. Redis (1.4K zoekopdrachten)
Lees/schrijf Redis-sleutels, controleer gegevens, beheer cache.

```json
"redis": {
  "command": "npx",
  "args": ["-y", "mcp-server-redis"],
  "env": { "REDIS_URL": "redis://localhost:6379" }
}
```

---

### 17. Prisma (Officieel)
Query Prisma Postgres, beheer schemamigraties.

```json
"prisma": {
  "command": "npx",
  "args": ["prisma", "mcp"]
}
```

---

### 18. MongoDB
Documentgegevenstoegang, schema-inspectie, JSON-query.

```json
"mongodb": {
  "command": "npx",
  "args": ["-y", "@mongodb-js/mongodb-mcp-server"],
  "env": { "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017" }
}
```

---

### 19. Neon (Serverless Postgres)
Neons serverless PostgreSQL met branching — beheer rechtstreeks je Neon-project.

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon"],
  "env": { "NEON_API_KEY": "..." }
}
```

---

### 20. E2B (Sandboxed Code Execution)
Veilige cloudomgeving om Python/JS uit te voeren, shell-commando's veilig uit te voeren.

```json
"e2b": {
  "command": "npx",
  "args": ["-y", "@e2b/mcp-server"],
  "env": { "E2B_API_KEY": "e2b_..." }
}
```

---

### 21. Semgrep
Statische analyse voor beveiligingslekken en codekwaliteit.

```json
"semgrep": {
  "command": "semgrep",
  "args": ["mcp"]
}
```

---

## 🔍 TIER 3 — Zoeken en onderzoek

### 22. Brave Search (4.3K zoekopdrachten)
Webzoeking zonder tracking. Gratis tier: 2.000 query's/maand.

```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": { "BRAVE_API_KEY": "BSA..." }
}
```

---

### 23. Firecrawl (7.2K zoekopdrachten)
Converteer elke URL naar schone Markdown — behandelt JS-gerichte pagina's.

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "fc-..." }
}
```

---

### 24. Exa (3.5K zoekopdrachten)
Neural semantische zoeken over het web.

```json
"exa": {
  "command": "npx",
  "args": ["-y", "exa-mcp-server"],
  "env": { "EXA_API_KEY": "..." }
}
```

---

### 25. Tavily (2.9K zoekopdrachten)
AI-geoptimaliseerde zoeking voor RAG en AI-agenten.

```json
"tavily": {
  "command": "npx",
  "args": ["-y", "tavily-mcp"],
  "env": { "TAVILY_API_KEY": "tvly-..." }
}
```

---

### 26. Jina Reader
Converteert URL's naar schone Markdown — geweldig voor documentatieschraping.

```json
"jina": {
  "command": "npx",
  "args": ["-y", "@jina-ai/mcp-server-jina-reader"],
  "env": { "JINA_API_KEY": "jina_..." }
}
```

---

### 27. Perplexity
Semantische zoeking + real-time webonderzoek met citaten.

```json
"perplexity": {
  "command": "npx",
  "args": ["-y", "mcp-server-perplexity"],
  "env": { "PERPLEXITY_API_KEY": "pplx-..." }
}
```

---

### 28. GPT Researcher
Deep-research-agent die plannen, uitvoering en citation-backed rapporten schrijft.

```json
"gpt-researcher": {
  "command": "uvx",
  "args": ["gptr-mcp"],
  "env": { "OPENAI_API_KEY": "sk-..." }
}
```

---

## 📊 TIER 4 — Analyses en monitoring

### 29. Grafana (6.1K zoekopdrachten)
Query metrics, verken dashboards, onderzoek waarschuwingen.

```json
"grafana": {
  "command": "npx",
  "args": ["-y", "@grafana/mcp-grafana"],
  "env": {
    "GRAFANA_URL": "http://localhost:3000",
    "GRAFANA_API_KEY": "glsa_..."
  }
}
```

---

### 30. Datadog (6.9K zoekopdrachten · Officieel)
Query metrics, logboeken, traces voor diagnostieken.

```json
"datadog": {
  "command": "npx",
  "args": ["-y", "@datadog/mcp-server"],
  "env": {
    "DD_API_KEY": "...",
    "DD_APP_KEY": "...",
    "DD_SITE": "datadoghq.com"
  }
}
```

---

### 31. PostHog
Productanalytiek, functievlaggen, sessie-opnamen.

```json
"posthog": {
  "command": "npx",
  "args": ["-y", "posthog-mcp-server"],
  "env": {
    "POSTHOG_API_KEY": "phx_...",
    "POSTHOG_HOST": "https://app.posthog.com"
  }
}
```

---

## 📋 TIER 5 — Projectmanagement

### 32. Linear (10.6K zoekopdrachten · Officieel)
Maak problemen aan, update status, query projecten, beheer cycli.

```json
"linear": {
  "command": "npx",
  "args": ["-y", "@linear/mcp-server"],
  "env": { "LINEAR_API_KEY": "lin_api_..." }
}
```

---

### 33. Notion (23K zoekopdrachten)
Lees/schrijf pagina's, query databases, zoek werkruimte.

```json
"notion": {
  "command": "npx",
  "args": ["-y", "@notionhq/notion-mcp-server"],
  "env": { "NOTION_API_KEY": "secret_..." }
}
```

---

### 34. Jira / Atlassian (40K zoekopdrachten · Officieel)
Problemen, sprints, Confluence-documenten.

```json
"atlassian": {
  "command": "npx",
  "args": ["-y", "@sooperset/mcp-atlassian"],
  "env": {
    "JIRA_URL": "https://your-domain.atlassian.net",
    "JIRA_USERNAME": "you@email.com",
    "JIRA_API_TOKEN": "...",
    "CONFLUENCE_URL": "https://your-domain.atlassian.net/wiki",
    "CONFLUENCE_USERNAME": "you@email.com",
    "CONFLUENCE_API_TOKEN": "..."
  }
}
```

---

### 35. Asana (2.8K zoekopdrachten)
Taak-, project- en teambeheer.

```json
"asana": {
  "command": "npx",
  "args": ["-y", "asana-mcp-server"],
  "env": { "ASANA_ACCESS_TOKEN": "..." }
}
```

---

### 36. Task Master
Transformeert PRD's in gestructureerde takenlijsten met afhankelijkheden.

```json
"taskmaster": {
  "command": "npx",
  "args": ["-y", "task-master-ai"],
  "env": { "ANTHROPIC_API_KEY": "sk-ant-..." }
}
```

---

## 💬 TIER 6 — Communicatie

### 37. Slack (17.7K zoekopdrachten · Officieel)
Lees kanalen, zoek berichten, post updates.

```json
"slack": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-...",
    "SLACK_TEAM_ID": "T..."
  }
}
```

---

### 38. Gmail (5.6K zoekopdrachten)
Zoeken, lees, verzend en antwoord op e-mails.

```json
"gmail": {
  "command": "npx",
  "args": ["-y", "gmail-mcp-server"],
  "env": {
    "GMAIL_CLIENT_ID": "...",
    "GMAIL_CLIENT_SECRET": "...",
    "GMAIL_REFRESH_TOKEN": "..."
  }
}
```

---

## ☁️ TIER 7 — Cloud en infrastructuur

### 39. AWS (16K zoekopdrachten · Officieel)
Query en beheer AWS-services — volledige suite.

```json
"aws": {
  "command": "npx",
  "args": ["-y", "@aws/aws-mcp-server"],
  "env": {
    "AWS_ACCESS_KEY_ID": "AKIA...",
    "AWS_SECRET_ACCESS_KEY": "...",
    "AWS_DEFAULT_REGION": "us-east-1"
  }
}
```

---

### 40. Azure (13K zoekopdrachten · Officieel)
Beheer Azure-resources.

```json
"azure": {
  "command": "npx",
  "args": ["-y", "@azure/mcp"],
  "env": {
    "AZURE_SUBSCRIPTION_ID": "...",
    "AZURE_TENANT_ID": "...",
    "AZURE_CLIENT_ID": "...",
    "AZURE_CLIENT_SECRET": "..."
  }
}
```

---

### 41. Cloudflare (2.3K zoekopdrachten · Officieel)
Workers, KV, D1, R2, DNS, Pages-beheer.

```json
"cloudflare": {
  "command": "npx",
  "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
  "env": { "CLOUDFLARE_API_TOKEN": "..." }
}
```

---

### 42. Vercel (3.1K zoekopdrachten · Officieel)
Implementeer, beheer domeinen, bekijk logboeken, controleer omgevingen.

```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@vercel/mcp"],
  "env": { "VERCEL_TOKEN": "..." }
}
```

---

### 43. Netlify (Officieel)
Site-beheer, build hooks, omgevingsvariabelen.

```json
"netlify": {
  "command": "npx",
  "args": ["-y", "@netlify/mcp"],
  "env": { "NETLIFY_AUTH_TOKEN": "..." }
}
```

---

### 44. Kubernetes (2.1K zoekopdrachten)
Beheer pods, deployments, services, namespaces.

```json
"kubernetes": {
  "command": "npx",
  "args": ["-y", "mcp-server-kubernetes"]
}
```
Gebruikt je `~/.kube/config`.

---

### 45. Terraform (3.2K zoekopdrachten)
Voer plannen uit, pas toe, beheer staat.

```json
"terraform": {
  "command": "npx",
  "args": ["-y", "terraform-mcp-server"]
}
```

---

## 🛒 TIER 8 — E-commerce en betalingen

### 46. Shopify (5.4K zoekopdrachten · Officieel)
Producten, bestellingen, inventaris, klanten.

```json
"shopify": {
  "command": "npx",
  "args": ["-y", "@shopify/dev-mcp"],
  "env": {
    "SHOPIFY_ACCESS_TOKEN": "shpat_...",
    "MYSHOPIFY_DOMAIN": "your-store.myshopify.com"
  }
}
```

---

## 📁 TIER 9 — Productiviteit en inhoud

### 47. Google Drive (5.9K zoekopdrachten · Officieel)
Zoek, lees, maak Google Drive-bestanden aan.

```json
"gdrive": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gdrive"],
  "env": { "GDRIVE_CREDENTIALS_PATH": "/path/to/credentials.json" }
}
```

---

### 48. Google Sheets (2.1K zoekopdrachten)
Lees/schrijf Sheets — rapportages, gegevenspijplijnen.

```json
"gsheets": {
  "command": "npx",
  "args": ["-y", "google-sheets-mcp"],
  "env": { "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/creds.json" }
}
```

---

### 49. Google Calendar (3.5K zoekopdrachten)
Lees en maak agendagebeurtenissen aan.

```json
"gcal": {
  "command": "npx",
  "args": ["-y", "google-calendar-mcp"],
  "env": { "GOOGLE_CREDENTIALS": "/path/to/credentials.json" }
}
```

---

### 50. Airtable (2.2K zoekopdrachten)
Lees/schrijf Airtable — lichte database of CMS.

```json
"airtable": {
  "command": "npx",
  "args": ["-y", "airtable-mcp-server"],
  "env": { "AIRTABLE_API_KEY": "pat..." }
}
```

---

### 51. Obsidian (8.1K zoekopdrachten)
Lees en schrijf je Obsidian-kluisnotities.

```json
"obsidian": {
  "command": "npx",
  "args": ["-y", "mcp-obsidian"],
  "env": { "OBSIDIAN_VAULT_PATH": "/path/to/vault" }
}
```

---

### 52. WordPress (3.5K zoekopdrachten)
Maak berichten aan, beheer pagina's, beheer media.

```json
"wordpress": {
  "command": "npx",
  "args": ["-y", "wordpress-mcp"],
  "env": {
    "WORDPRESS_URL": "https://yoursite.com",
    "WORDPRESS_USERNAME": "admin",
    "WORDPRESS_APP_PASSWORD": "..."
  }
}
```

---

## 🎨 TIER 10 — Ontwerp

### 53. Figma (74K zoekopdrachten · Officiële Dev Mode)
Live designstructuur, lagen, varianten voor codegeneratie.

```json
"figma": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp"],
  "env": { "FIGMA_API_KEY": "figd_..." }
}
```
Vereist Figma Dev Mode (betaald plan).

---

### 54. Magic UI
React + Tailwind-componentenbibliotheek voor AI-ondersteunde UI-generatie.

```json
"magicui": {
  "command": "npx",
  "args": ["-y", "@magicui/mcp"]
}
```

---

## 🔔 TIER 11 — Meldingen en automatisering

### 55. ntfy (Mobiele push)
Telefoon-pushnotificaties uit agent-stromen.

```json
"ntfy": {
  "command": "npx",
  "args": ["-y", "ntfy-mcp-server"],
  "env": {
    "NTFY_TOPIC": "your-unique-topic",
    "NTFY_SERVER": "https://ntfy.sh"
  }
}
```

---

### 56. Zapier (10.8K zoekopdrachten)
Trigger 7.000+ automatiseringen vanuit Claude Code.

```json
"zapier": {
  "command": "npx",
  "args": ["-y", "@zapier/mcp"],
  "env": { "ZAPIER_MCP_API_KEY": "..." }
}
```

---

### 57. n8n
Automatisering van multistap low-code-werkstroom.

```json
"n8n": {
  "command": "npx",
  "args": ["-y", "n8n-mcp-server"],
  "env": {
    "N8N_BASE_URL": "http://localhost:5678",
    "N8N_API_KEY": "..."
  }
}
```

---

### 58. Pipedream
Trigger serverlose code over 2.500 API's.

```json
"pipedream": {
  "command": "npx",
  "args": ["-y", "@pipedream/mcp"],
  "env": { "PIPEDREAM_ACCESS_TOKEN": "..." }
}
```

---

## 🧠 TIER 12 — AI en geheugen

### 59. Sequential Thinking (13K zoekopdrachten)
Dwingt expliciet stap-voor-stap-denken af voordat je antwoord geeft.

```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

---

### 60. Chroma (Vector DB)
Semantische documentophaling voor RAG.

```json
"chroma": {
  "command": "uvx",
  "args": ["chroma-mcp"],
  "env": { "CHROMA_HOST": "localhost", "CHROMA_PORT": "8000" }
}
```

---

### 61. MindsDB (39K sterren)
Gefedereerde queryengine over meerdere databases en SaaS.

```json
"mindsdb": {
  "command": "npx",
  "args": ["-y", "@mindsdb/mcp-server-mindsdb"],
  "env": { "MINDSDB_HOST": "cloud.mindsdb.com", "MINDSDB_API_KEY": "..." }
}
```

---

## 📈 TIER 13 — Gegevens en analyses

### 62. HubSpot (3.8K zoekopdrachten · Officieel)
CRM-automatisering — contacten, bedrijven, deals, kaartjes.

```json
"hubspot": {
  "command": "npx",
  "args": ["-y", "@hubspot/mcp-server"],
  "env": { "HUBSPOT_ACCESS_TOKEN": "pat-..." }
}
```

---

### 63. Snowflake (3.6K zoekopdrachten)
Query Snowflake-datawarehouse.

```json
"snowflake": {
  "command": "npx",
  "args": ["-y", "snowflake-mcp"],
  "env": {
    "SNOWFLAKE_ACCOUNT": "your-account",
    "SNOWFLAKE_USER": "username",
    "SNOWFLAKE_PASSWORD": "password",
    "SNOWFLAKE_DATABASE": "MY_DB",
    "SNOWFLAKE_WAREHOUSE": "COMPUTE_WH"
  }
}
```

---

### 64. dbt (1.9K zoekopdrachten)
Voer dbt-modellen uit, test, verken documentatie.

```json
"dbt": {
  "command": "npx",
  "args": ["-y", "dbt-mcp"],
  "env": { "DBT_PROJECT_DIR": "/path/to/dbt/project" }
}
```

---

## 🧪 TIER 14 — Tests en QA

### 65. BrowserStack
Cross-browser- en apparaattesting in de cloud.

```json
"browserstack": {
  "command": "npx",
  "args": ["-y", "@browserstack/mcp-server"],
  "env": {
    "BROWSERSTACK_USERNAME": "...",
    "BROWSERSTACK_ACCESS_KEY": "..."
  }
}
```

---

### 66. Puppeteer (7.3K zoekopdrachten · Officieel)
Alternatief voor browserautomatisering naar Playwright.

```json
"puppeteer": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
  "env": { "PUPPETEER_HEADLESS": "true" }
}
```

---

## 🎨 TIER 15 — Media en creatief

### 67. Excalidraw
Genereer architectuurdiagrammen en schets.

```json
"excalidraw": {
  "command": "npx",
  "args": ["-y", "excalidraw-mcp-server"]
}
```

---

### 68. Spotify
Zoek, queue en wissel afspeellijsten vanuit je editor.

```json
"spotify": {
  "command": "npx",
  "args": ["-y", "spotify-mcp"],
  "env": {
    "SPOTIFY_CLIENT_ID": "...",
    "SPOTIFY_CLIENT_SECRET": "...",
    "SPOTIFY_REDIRECT_URI": "http://localhost:8080"
  }
}
```

---

## 🔐 TIER 16 — Beveiliging en naleving

### 69. Snyk
Realtime CVE-scanning voor afhankelijkheden.

```json
"snyk": {
  "command": "npx",
  "args": ["-y", "snyk-mcp"],
  "env": { "SNYK_TOKEN": "..." }
}
```

---

### 70. Salesforce (6.5K zoekopdrachten)
CRM, kansen, leads, accounts.

```json
"salesforce": {
  "command": "npx",
  "args": ["-y", "salesforce-mcp"],
  "env": {
    "SF_CLIENT_ID": "...",
    "SF_CLIENT_SECRET": "...",
    "SF_USERNAME": "...",
    "SF_PASSWORD": "..."
  }
}
```

---

## Aanvullende servers (71–100)

| # | Server | Installeren | Wat het doet |
|---|---|---|---|
| 71 | **Google Maps** | `npx mcp-server-google-maps` | Locatiegegevens, POI's |
| 72 | **Convex** | `npx convex-mcp` | Volledige BaaS-stapel |
| 73 | **Milvus** | `npx mcp-server-milvus` | Vector DB |
| 74 | **SQLite** | `npx @modelcontextprotocol/server-sqlite` | Ingebedde SQL |
| 75 | **Serena** | `npx serena-mcp` | Symbolisch code-begrip (24K sterren) |
| 76 | **Skyvern** | `pip install skyvern` | Browserautomatisering met computervision |
| 77 | **Last9** | `npx last9-mcp-server` | Betrouwbaarheidstechniek |
| 78 | **Weaviate** | `npx mcp-server-weaviate` | Semantische vectorzoeking |
| 79 | **Cognee** | `uvx cognee-mcp` | Graph-RAG-kennis |
| 80 | **Google Search Console** | `npx google-search-console-mcp` | SEO-organische gegevens |
| 81 | **Ahrefs** | `npx ahrefs-mcp` | SEO-onderzoek |
| 82 | **Resend** | `npx resend-mcp` | Transactioneel e-mail-API |
| 83 | **Algolia** | `npx algolia-mcp` | Zoekinfrastructuur |
| 84 | **Pinecone** | `npx pinecone-mcp` | Vector DB |
| 85 | **Upstash** | `npx upstash-mcp` | Redis-serverless |
| 86 | **Liveblocks** | `npx liveblocks-mcp` | Realtime samenwerking |
| 87 | **Cloudinary** | `npx cloudinary-mcp` | Mediabeheer |
| 88 | **Webflow** | `npx webflow-mcp` | Website-CMS |
| 89 | **Framer** | `npx framer-mcp` | Design-to-code |
| 90 | **PlanetScale** | `npx planetscale-mcp` | MySQL-compatibele DB |
| 91 | **Turso** | `npx turso-mcp` | Edge SQLite |
| 92 | **Supabase Realtime** | via Supabase MCP | Realtime-abonnementen |
| 93 | **Neon** | `npx @neondatabase/mcp-server-neon` | (zie #19) |
| 94 | **MindsDB** | (zie #61) | — |
| 95 | **BrowserStack** | (zie #65) | — |
| 96 | **Task Master** | (zie #36) | — |
| 97 | **Pipedream** | (zie #58) | — |
| 98 | **Chrome DevTools** | `npx chrome-devtools-mcp` | Console, Netwerk, Perf |
| 99 | **Magic UI** | (zie #54) | — |
| 100 | **Jina Reader** | (zie #26) | — |

---

## Snelstartbundels

### Onafhankelijke SaaS Builder (Begin hier — 5 servers)
```json
{
  "mcpServers": {
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."} },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "postgres": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"] },
    "stripe": { "command": "npx", "args": ["-y", "@stripe/agent-toolkit"], "env": {"STRIPE_SECRET_KEY": "sk_test_..."} },
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp@latest"] }
  }
}
```

### Full-Stack Developer (10 servers)
Toevoegen aan Indie SaaS: `playwright`, `sentry`, `linear`, `slack`, `sequential-thinking`

### Gegevens en analyse
`postgres` + `snowflake` + `grafana` + `firecrawl` + `fetch` + `dbt`

### Inhoud en marketing
`notion` + `wordpress` + `gmail` + `google-sheets` + `brave-search` + `firecrawl`

### DevOps en infrastructuur
`github` + `kubernetes` + `terraform` + `aws` + `datadog` + `docker`

### Onderzoek en kennis
`memory` + `context7` + `brave-search` + `firecrawl` + `sequential-thinking` + `obsidian`

---

## Aanbevolen beveiligingspraktijken

- Gebruik **alleen-lezen databaseverbindingen** tenzij schrijftoegang expliciet nodig is
- Sla API-sleutels op als omgevingsvariabelen, codeer nooit hardcoded in configuratiebestanden
- Gebruik `.claude/mcp.json` op projectniveau voor projectspecifieke servers
- Begin met minimale GitHub-tokenbereiken (`read:org`) — vouw alleen uit indien nodig
- Voor productiondatabases: maak een speciale alleen-lezen MCP-gebruiker

---
