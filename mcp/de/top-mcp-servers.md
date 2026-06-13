# Top 100 MCP-Server für Indie-Builder

Die nützlichsten MCP-Server 2026 — mit Installationsbefehlen, was jeder tut und kuratierte Starter-Bundles. Basierend auf monatlichem Suchvolumen (170K+ kombiniert), GitHub-Stars und realer Produktionsnutzung.

**Beginnen Sie hier:** Erhalten Sie 80 % des Wertes von 5 Servern. Für Indie-Builder: **GitHub + Memory + Playwright + PostgreSQL/Supabase + Stripe**. Alles andere ist additiv.

---

## So installieren Sie jeden MCP-Server

Fügen Sie zu `~/.claude.json` (global) oder `.claude/mcp.json` (Projekt) hinzu:

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

Für Python-Server verwenden Sie: `"command": "uvx"` oder `"command": "python"` mit dem Argument `"-m"`.
Starten Sie Claude Code nach dem Hinzufügen von Servern neu.

---

## 🏆 TIER 1 — Essentiell (Jeder Indie-Builder)

### 1. GitHub (82K monatliche Suchanfragen · Offiziell)
PRs lesen, Code durchsuchen, Probleme erstellen, Branches verwalten, Diffs überprüfen.

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
}
```
Token: github.com/settings/tokens → Bereiche `repo, read:org`

---

### 2. Memory (Knowledge Graph Persistenz)
Merkt sich Fakten, Entscheidungen und Kontext über Claude Code-Sitzungen hinweg. Die am meisten angeforderte Fähigkeit.

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

### 3. Playwright (82K Suchanfragen · Microsoft Official)
Steuern Sie einen echten Browser — navigieren, klicken, Formulare ausfüllen, Screenshots, Scrape JS-gerenderte Seiten. Nutzt Accessibility-Baum für zuverlässige Automatisierung.

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"],
  "env": { "BROWSER": "chromium" }
}
```

---

### 4. PostgreSQL (Offiziell)
Führen Sie SQL-Abfragen aus, erkunden Sie Schemas, beantworten Sie Geschäftsfragen ohne Datenexport.

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
}
```
Verwenden Sie eine schreibgeschützte Verbindungszeichenfolge für Sicherheit.

---

### 5. Stripe (Offiziell)
Kundensuche, Zahlungsabfragen, Abonnementverwaltung, Rechnungsgenerierung.

```json
"stripe": {
  "command": "npx",
  "args": ["-y", "@stripe/agent-toolkit"],
  "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
}
```
docs.stripe.com/mcp für vollständiges Setup.

---

### 6. Filesystem (Offiziell)
Lesen, schreiben und durchsuchen Sie Dateien außerhalb des aktuellen Projektverzeichnisses.

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
}
```

---

### 7. Fetch (Offiziell)
Machen Sie HTTP-Anfragen an jede URL, laden Sie Webseiten, rufen Sie REST-APIs auf.

```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

---

## 💻 TIER 2 — Entwickler-Stack

### 8. Context7 (32K Suchanfragen)
Ruft aktuelle, versionsspezifische Bibliotheksdokumentation ab. Verhindert, dass Claude veraltete APIs nutzt.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

---

### 9. Supabase (26K Suchanfragen · Offiziell)
Vollständige Supabase-Kontrolle — Datenbank, Authentifizierung, Speicher, Edge-Funktionen, RLS-Richtlinien.

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

### 10. Git (Offiziell)
Lokaler Repo-Zugriff — Branches, Commits, Diffs, Log, Blame.

```json
"git": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
}
```

---

### 11. GitLab (Offiziell)
MRs, Probleme, Pipelines, CI/CD-Verwaltung.

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

### 12. Sentry (4.7K Suchanfragen · Offiziell)
Fehler abfragen, Probleme erstellen, Stack Traces und Performance-Daten ansehen.

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
Terminal-Zugriff, Prozessverwaltung, Dateisystem-Kontrolle, ripgrep-Suche.

```json
"desktop-commander": {
  "command": "npx",
  "args": ["-y", "@wonderwhy-er/desktop-commander"]
}
```

---

### 14. Docker (10.3K Suchanfragen)
Verwalten Sie Container, Images, Volumes, Netzwerke.

```json
"docker": {
  "command": "npx",
  "args": ["-y", "mcp-server-docker"]
}
```

---

### 15. MySQL (4.2K Suchanfragen)
MySQL-Datenbanken abfragen, Schema-Erkundung, SQL-Ausführung.

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

### 16. Redis (1.4K Suchanfragen)
Redis-Schlüssel lesen/schreiben, Daten inspizieren, Cache verwalten.

```json
"redis": {
  "command": "npx",
  "args": ["-y", "mcp-server-redis"],
  "env": { "REDIS_URL": "redis://localhost:6379" }
}
```

---

### 17. Prisma (Offiziell)
Prisma Postgres abfragen, Schema-Migrationen verwalten.

```json
"prisma": {
  "command": "npx",
  "args": ["prisma", "mcp"]
}
```

---

### 18. MongoDB
Dokumentdatenzugriff, Schema-Inspektion, JSON-Abfrage.

```json
"mongodb": {
  "command": "npx",
  "args": ["-y", "@mongodb-js/mongodb-mcp-server"],
  "env": { "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017" }
}
```

---

### 19. Neon (Serverless Postgres)
Neons serverless PostgreSQL mit Branching — verwalten Sie direkt Ihr Neon-Projekt.

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon"],
  "env": { "NEON_API_KEY": "..." }
}
```

---

### 20. E2B (Sandboxed Code Execution)
Sichere Cloud-Umgebung zum Ausführen von Python/JS, sichere Shell-Befehle ausführen.

```json
"e2b": {
  "command": "npx",
  "args": ["-y", "@e2b/mcp-server"],
  "env": { "E2B_API_KEY": "e2b_..." }
}
```

---

### 21. Semgrep
Statische Analyse für Sicherheitslücken und Code-Qualität.

```json
"semgrep": {
  "command": "semgrep",
  "args": ["mcp"]
}
```

---

## 🔍 TIER 3 — Suche und Forschung

### 22. Brave Search (4.3K Suchanfragen)
Web-Suche ohne Tracking. Kostenlos: 2.000 Anfragen/Monat.

```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": { "BRAVE_API_KEY": "BSA..." }
}
```

---

### 23. Firecrawl (7.2K Suchanfragen)
Konvertieren Sie jede URL in sauberes Markdown — verarbeitet JS-gerenderte Seiten.

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "fc-..." }
}
```

---

### 24. Exa (3.5K Suchanfragen)
Neuronale semantische Suche über das Web.

```json
"exa": {
  "command": "npx",
  "args": ["-y", "exa-mcp-server"],
  "env": { "EXA_API_KEY": "..." }
}
```

---

### 25. Tavily (2.9K Suchanfragen)
KI-optimierte Suche für RAG und KI-Agenten.

```json
"tavily": {
  "command": "npx",
  "args": ["-y", "tavily-mcp"],
  "env": { "TAVILY_API_KEY": "tvly-..." }
}
```

---

### 26. Jina Reader
Konvertiert URLs in sauberes Markdown — hervorragend für Dokumentations-Scraping.

```json
"jina": {
  "command": "npx",
  "args": ["-y", "@jina-ai/mcp-server-jina-reader"],
  "env": { "JINA_API_KEY": "jina_..." }
}
```

---

### 27. Perplexity
Semantische Suche + Echtzeit-Web-Recherche mit Zitaten.

```json
"perplexity": {
  "command": "npx",
  "args": ["-y", "mcp-server-perplexity"],
  "env": { "PERPLEXITY_API_KEY": "pplx-..." }
}
```

---

### 28. GPT Researcher
Deep-Research-Agent, der zitiergestützte Berichte plant, ausführt und schreibt.

```json
"gpt-researcher": {
  "command": "uvx",
  "args": ["gptr-mcp"],
  "env": { "OPENAI_API_KEY": "sk-..." }
}
```

---

## 📊 TIER 4 — Analytik und Monitoring

### 29. Grafana (6.1K Suchanfragen)
Metriken abfragen, Dashboards erkunden, Warnungen untersuchen.

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

### 30. Datadog (6.9K Suchanfragen · Offiziell)
Metriken, Protokolle, Traces für Diagnosen abfragen.

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
Produktanalytik, Feature-Flags, Sitzungsaufzeichnungen.

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

## 📋 TIER 5 — Projektmanagement

### 32. Linear (10.6K Suchanfragen · Offiziell)
Erstellen Sie Probleme, aktualisieren Sie den Status, fragen Sie Projekte ab, verwalten Sie Zyklen.

```json
"linear": {
  "command": "npx",
  "args": ["-y", "@linear/mcp-server"],
  "env": { "LINEAR_API_KEY": "lin_api_..." }
}
```

---

### 33. Notion (23K Suchanfragen)
Lesen/schreiben Sie Seiten, fragen Sie Datenbanken ab, durchsuchen Sie den Arbeitsbereich.

```json
"notion": {
  "command": "npx",
  "args": ["-y", "@notionhq/notion-mcp-server"],
  "env": { "NOTION_API_KEY": "secret_..." }
}
```

---

### 34. Jira / Atlassian (40K Suchanfragen · Offiziell)
Probleme, Sprints, Confluence-Docs.

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

### 35. Asana (2.8K Suchanfragen)
Aufgaben-, Projekt- und Teamverwaltung.

```json
"asana": {
  "command": "npx",
  "args": ["-y", "asana-mcp-server"],
  "env": { "ASANA_ACCESS_TOKEN": "..." }
}
```

---

### 36. Task Master
Wandelt PRDs in strukturierte Aufgabenlisten mit Abhängigkeiten um.

```json
"taskmaster": {
  "command": "npx",
  "args": ["-y", "task-master-ai"],
  "env": { "ANTHROPIC_API_KEY": "sk-ant-..." }
}
```

---

## 💬 TIER 6 — Kommunikation

### 37. Slack (17.7K Suchanfragen · Offiziell)
Lesen Sie Kanäle, durchsuchen Sie Nachrichten, posten Sie Updates.

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

### 38. Gmail (5.6K Suchanfragen)
Durchsuchen, lesen, senden und beantworten Sie E-Mails.

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

## ☁️ TIER 7 — Cloud und Infrastruktur

### 39. AWS (16K Suchanfragen · Offiziell)
Fragen Sie AWS-Services ab und verwalten Sie sie — vollständige Suite.

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

### 40. Azure (13K Suchanfragen · Offiziell)
Azure-Ressourcenverwaltung.

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

### 41. Cloudflare (2.3K Suchanfragen · Offiziell)
Workers, KV, D1, R2, DNS, Pages-Verwaltung.

```json
"cloudflare": {
  "command": "npx",
  "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
  "env": { "CLOUDFLARE_API_TOKEN": "..." }
}
```

---

### 42. Vercel (3.1K Suchanfragen · Offiziell)
Bereitstellen, Domänen verwalten, Protokolle ansehen, Umgebungen kontrollieren.

```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@vercel/mcp"],
  "env": { "VERCEL_TOKEN": "..." }
}
```

---

### 43. Netlify (Offiziell)
Seiten-Verwaltung, Build-Hooks, Umgebungsvariablen.

```json
"netlify": {
  "command": "npx",
  "args": ["-y", "@netlify/mcp"],
  "env": { "NETLIFY_AUTH_TOKEN": "..." }
}
```

---

### 44. Kubernetes (2.1K Suchanfragen)
Verwalten Sie Pods, Deployments, Services, Namespaces.

```json
"kubernetes": {
  "command": "npx",
  "args": ["-y", "mcp-server-kubernetes"]
}
```
Nutzt Ihre `~/.kube/config`.

---

### 45. Terraform (3.2K Suchanfragen)
Führen Sie Pläne aus, wenden Sie an, verwalten Sie den Zustand.

```json
"terraform": {
  "command": "npx",
  "args": ["-y", "terraform-mcp-server"]
}
```

---

## 🛒 TIER 8 — E-Commerce und Zahlungen

### 46. Shopify (5.4K Suchanfragen · Offiziell)
Produkte, Bestellungen, Inventar, Kunden.

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

## 📁 TIER 9 — Produktivität und Inhalte

### 47. Google Drive (5.9K Suchanfragen · Offiziell)
Durchsuchen Sie, lesen und erstellen Sie Google Drive-Dateien.

```json
"gdrive": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gdrive"],
  "env": { "GDRIVE_CREDENTIALS_PATH": "/path/to/credentials.json" }
}
```

---

### 48. Google Sheets (2.1K Suchanfragen)
Lesen/schreiben Sie Sheets — Berichte, Datenpipelines.

```json
"gsheets": {
  "command": "npx",
  "args": ["-y", "google-sheets-mcp"],
  "env": { "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/creds.json" }
}
```

---

### 49. Google Calendar (3.5K Suchanfragen)
Lesen und erstellen Sie Kalenderereignisse.

```json
"gcal": {
  "command": "npx",
  "args": ["-y", "google-calendar-mcp"],
  "env": { "GOOGLE_CREDENTIALS": "/path/to/credentials.json" }
}
```

---

### 50. Airtable (2.2K Suchanfragen)
Lesen/schreiben Sie Airtable — leichte Datenbank oder CMS.

```json
"airtable": {
  "command": "npx",
  "args": ["-y", "airtable-mcp-server"],
  "env": { "AIRTABLE_API_KEY": "pat..." }
}
```

---

### 51. Obsidian (8.1K Suchanfragen)
Lesen und schreiben Sie Ihre Obsidian-Vault-Notizen.

```json
"obsidian": {
  "command": "npx",
  "args": ["-y", "mcp-obsidian"],
  "env": { "OBSIDIAN_VAULT_PATH": "/path/to/vault" }
}
```

---

### 52. WordPress (3.5K Suchanfragen)
Erstellen Sie Beiträge, verwalten Sie Seiten, verwalten Sie Medien.

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

## 🎨 TIER 10 — Design

### 53. Figma (74K Suchanfragen · Offizieller Dev Mode)
Live-Design-Struktur, Ebenen, Varianten für Code-Generierung.

```json
"figma": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp"],
  "env": { "FIGMA_API_KEY": "figd_..." }
}
```
Erfordert Figma Dev Mode (bezahlter Plan).

---

### 54. Magic UI
React + Tailwind-Komponentenbibliothek für KI-unterstützte UI-Generierung.

```json
"magicui": {
  "command": "npx",
  "args": ["-y", "@magicui/mcp"]
}
```

---

## 🔔 TIER 11 — Benachrichtigungen und Automatisierung

### 55. ntfy (Mobile Push)
Telefon-Push-Benachrichtigungen aus Agent-Flows.

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

### 56. Zapier (10.8K Suchanfragen)
Starten Sie 7.000+ Automatisierungen aus Claude Code.

```json
"zapier": {
  "command": "npx",
  "args": ["-y", "@zapier/mcp"],
  "env": { "ZAPIER_MCP_API_KEY": "..." }
}
```

---

### 57. n8n
Multi-Step-Low-Code-Workflow-Automatisierung.

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
Starten Sie serverlosen Code über 2.500 APIs.

```json
"pipedream": {
  "command": "npx",
  "args": ["-y", "@pipedream/mcp"],
  "env": { "PIPEDREAM_ACCESS_TOKEN": "..." }
}
```

---

## 🧠 TIER 12 — KI und Speicher

### 59. Sequential Thinking (13K Suchanfragen)
Erzwingt explizites Schritt-für-Schritt-Denken vor der Antwort.

```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

---

### 60. Chroma (Vector DB)
Semantisches Dokument-Abrufen für RAG.

```json
"chroma": {
  "command": "uvx",
  "args": ["chroma-mcp"],
  "env": { "CHROMA_HOST": "localhost", "CHROMA_PORT": "8000" }
}
```

---

### 61. MindsDB (39K Stars)
Föderiertes Abfrage-Engine über mehrere Datenbanken und SaaS.

```json
"mindsdb": {
  "command": "npx",
  "args": ["-y", "@mindsdb/mcp-server-mindsdb"],
  "env": { "MINDSDB_HOST": "cloud.mindsdb.com", "MINDSDB_API_KEY": "..." }
}
```

---

## 📈 TIER 13 — Daten und Analyse

### 62. HubSpot (3.8K Suchanfragen · Offiziell)
CRM-Automatisierung — Kontakte, Unternehmen, Deals, Tickets.

```json
"hubspot": {
  "command": "npx",
  "args": ["-y", "@hubspot/mcp-server"],
  "env": { "HUBSPOT_ACCESS_TOKEN": "pat-..." }
}
```

---

### 63. Snowflake (3.6K Suchanfragen)
Fragen Sie das Snowflake-Data-Warehouse ab.

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

### 64. dbt (1.9K Suchanfragen)
Führen Sie dbt-Modelle aus, testen, erkunden Sie die Dokumentation.

```json
"dbt": {
  "command": "npx",
  "args": ["-y", "dbt-mcp"],
  "env": { "DBT_PROJECT_DIR": "/path/to/dbt/project" }
}
```

---

## 🧪 TIER 14 — Tests und QA

### 65. BrowserStack
Cross-Browser- und Device-Tests in der Cloud.

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

### 66. Puppeteer (7.3K Suchanfragen · Offiziell)
Alternative zur Browser-Automatisierung zu Playwright.

```json
"puppeteer": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
  "env": { "PUPPETEER_HEADLESS": "true" }
}
```

---

## 🎨 TIER 15 — Medien und kreativ

### 67. Excalidraw
Generieren Sie Architektur-Diagramme und Skizzen.

```json
"excalidraw": {
  "command": "npx",
  "args": ["-y", "excalidraw-mcp-server"]
}
```

---

### 68. Spotify
Durchsuchen, queueing und Playlist-Wechsel von Ihrem Editor.

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

## 🔐 TIER 16 — Sicherheit und Compliance

### 69. Snyk
Echtzeit-CVE-Scanning für Abhängigkeiten.

```json
"snyk": {
  "command": "npx",
  "args": ["-y", "snyk-mcp"],
  "env": { "SNYK_TOKEN": "..." }
}
```

---

### 70. Salesforce (6.5K Suchanfragen)
CRM, Chancen, Leads, Konten.

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

## Weitere Server (71–100)

| # | Server | Installieren | Was es tut |
|---|---|---|---|
| 71 | **Google Maps** | `npx mcp-server-google-maps` | Standortdaten, POIs |
| 72 | **Convex** | `npx convex-mcp` | Vollständiger BaaS-Stack |
| 73 | **Milvus** | `npx mcp-server-milvus` | Vector DB |
| 74 | **SQLite** | `npx @modelcontextprotocol/server-sqlite` | Eingebettetes SQL |
| 75 | **Serena** | `npx serena-mcp` | Symbolisches Code-Verständnis (24K Stars) |
| 76 | **Skyvern** | `pip install skyvern` | Browser-Automatisierung mit Computer Vision |
| 77 | **Last9** | `npx last9-mcp-server` | Zuverlässigkeitstechnik |
| 78 | **Weaviate** | `npx mcp-server-weaviate` | Semantische Vektorsuche |
| 79 | **Cognee** | `uvx cognee-mcp` | Graph-RAG-Wissen |
| 80 | **Google Search Console** | `npx google-search-console-mcp` | SEO-organische Daten |
| 81 | **Ahrefs** | `npx ahrefs-mcp` | SEO-Forschung |
| 82 | **Resend** | `npx resend-mcp` | Transaktionale E-Mail-API |
| 83 | **Algolia** | `npx algolia-mcp` | Suchinfrastruktur |
| 84 | **Pinecone** | `npx pinecone-mcp` | Vector DB |
| 85 | **Upstash** | `npx upstash-mcp` | Redis Serverless |
| 86 | **Liveblocks** | `npx liveblocks-mcp` | Echtzeit-Zusammenarbeit |
| 87 | **Cloudinary** | `npx cloudinary-mcp` | Medienverwaltung |
| 88 | **Webflow** | `npx webflow-mcp` | Website-CMS |
| 89 | **Framer** | `npx framer-mcp` | Design-to-Code |
| 90 | **PlanetScale** | `npx planetscale-mcp` | MySQL-kompatible DB |
| 91 | **Turso** | `npx turso-mcp` | Edge SQLite |
| 92 | **Supabase Realtime** | via Supabase MCP | Echtzeit-Abos |
| 93 | **Neon** | `npx @neondatabase/mcp-server-neon` | (siehe #19) |
| 94 | **MindsDB** | (siehe #61) | — |
| 95 | **BrowserStack** | (siehe #65) | — |
| 96 | **Task Master** | (siehe #36) | — |
| 97 | **Pipedream** | (siehe #58) | — |
| 98 | **Chrome DevTools** | `npx chrome-devtools-mcp` | Konsole, Netzwerk, Perf |
| 99 | **Magic UI** | (siehe #54) | — |
| 100 | **Jina Reader** | (siehe #26) | — |

---

## Quick-Start-Bundles

### Indie SaaS Builder (Jetzt beginnen — 5 Server)
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

### Full-Stack Developer (10 Server)
Zu Indie SaaS hinzufügen: `playwright`, `sentry`, `linear`, `slack`, `sequential-thinking`

### Daten und Analyse
`postgres` + `snowflake` + `grafana` + `firecrawl` + `fetch` + `dbt`

### Inhalte und Marketing
`notion` + `wordpress` + `gmail` + `google-sheets` + `brave-search` + `firecrawl`

### DevOps und Infrastruktur
`github` + `kubernetes` + `terraform` + `aws` + `datadog` + `docker`

### Forschung und Wissen
`memory` + `context7` + `brave-search` + `firecrawl` + `sequential-thinking` + `obsidian`

---

## Sicherheitsbestpraktiken

- Verwenden Sie **schreibgeschützte Datenbankverbindungen**, es sei denn, Schreibzugriff ist explizit erforderlich
- Speichern Sie API-Schlüssel als Umgebungsvariablen, codieren Sie sie nie in Konfigurationsdateien
- Verwenden Sie `.claude/mcp.json` auf Projektebene für projektspezifische Server
- Beginnen Sie mit minimalen GitHub-Token-Bereichen (`read:org`) — erweitern Sie nur bei Bedarf
- Für Produktionsdatenbanken: Erstellen Sie einen dedizierten schreibgeschützten MCP-Benutzer

---
