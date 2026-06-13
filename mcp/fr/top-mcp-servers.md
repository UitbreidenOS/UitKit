# Top 100 serveurs MCP pour les créateurs indépendants

Les serveurs MCP les plus utiles en 2026 — avec des commandes d'installation, ce que chacun fait et des bundles de démarrage organisés. Basé sur le volume de recherche mensuel (170K+ combinés), les étoiles GitHub et l'utilisation réelle en production.

**Commencez ici :** Obtenez 80 % de la valeur à partir de 5 serveurs. Pour les créateurs indépendants : **GitHub + Memory + Playwright + PostgreSQL/Supabase + Stripe**. Tout le reste est additionnel.

---

## Comment installer n'importe quel serveur MCP

Ajoutez à `~/.claude.json` (global) ou `.claude/mcp.json` (projet) :

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

Pour les serveurs Python, utilisez : `"command": "uvx"` ou `"command": "python"` avec l'argument `"-m"`.
Redémarrez Claude Code après avoir ajouté les serveurs.

---

## 🏆 TIER 1 — Essentiels (Tous les créateurs indépendants)

### 1. GitHub (82K recherches mensuelles · Officiel)
Lisez les PR, cherchez du code, créez des problèmes, gérez les branches, examinez les diffs.

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
}
```
Token : github.com/settings/tokens → portées `repo, read:org`

---

### 2. Memory (Persistance du graphe de connaissances)
Se souvient des faits, des décisions et du contexte entre les sessions Claude Code. Capacité la plus demandée.

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

### 3. Playwright (82K recherches · Officiel Microsoft)
Contrôlez un navigateur réel — naviguez, cliquez, remplissez des formulaires, capturez des images, scrapez les pages rendues par JS. Utilise l'arborescence d'accessibilité pour une automatisation fiable.

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"],
  "env": { "BROWSER": "chromium" }
}
```

---

### 4. PostgreSQL (Officiel)
Exécutez des requêtes SQL, explorez les schémas, répondez aux questions métier sans exporter les données.

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
}
```
Utilisez une chaîne de connexion en lecture seule pour la sécurité.

---

### 5. Stripe (Officiel)
Recherche de client, requêtes de paiement, gestion des abonnements, génération de factures.

```json
"stripe": {
  "command": "npx",
  "args": ["-y", "@stripe/agent-toolkit"],
  "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
}
```
docs.stripe.com/mcp pour l'installation complète.

---

### 6. Filesystem (Officiel)
Lisez, écrivez et cherchez des fichiers en dehors du répertoire du projet actuel.

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
}
```

---

### 7. Fetch (Officiel)
Effectuez des requêtes HTTP vers n'importe quelle URL, récupérez des pages web, appelez des API REST.

```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

---

## 💻 TIER 2 — Pile de développeur

### 8. Context7 (32K recherches)
Récupère la documentation de bibliothèque actuelle et spécifique à la version. Empêche Claude d'utiliser des API obsolètes.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

---

### 9. Supabase (26K recherches · Officiel)
Contrôle complet de Supabase — base de données, authentification, stockage, fonctions edge, politiques RLS.

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

### 10. Git (Officiel)
Accès local au dépôt — branches, commits, diffs, log, blame.

```json
"git": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
}
```

---

### 11. GitLab (Officiel)
MR, problèmes, pipelines, gestion des CI/CD.

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

### 12. Sentry (4.7K recherches · Officiel)
Interrogez les erreurs, créez des problèmes, affichez les traces de pile et les données de performance.

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
Accès terminal, gestion des processus, contrôle du système de fichiers, recherche ripgrep.

```json
"desktop-commander": {
  "command": "npx",
  "args": ["-y", "@wonderwhy-er/desktop-commander"]
}
```

---

### 14. Docker (10.3K recherches)
Gérez les conteneurs, images, volumes, réseaux.

```json
"docker": {
  "command": "npx",
  "args": ["-y", "mcp-server-docker"]
}
```

---

### 15. MySQL (4.2K recherches)
Interrogez les bases de données MySQL, exploration de schémas, exécution SQL.

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

### 16. Redis (1.4K recherches)
Lisez/écrivez les clés Redis, inspectez les données, gérez le cache.

```json
"redis": {
  "command": "npx",
  "args": ["-y", "mcp-server-redis"],
  "env": { "REDIS_URL": "redis://localhost:6379" }
}
```

---

### 17. Prisma (Officiel)
Interrogez Prisma Postgres, gérez les migrations de schémas.

```json
"prisma": {
  "command": "npx",
  "args": ["prisma", "mcp"]
}
```

---

### 18. MongoDB
Accès aux données documentaires, inspection de schémas, interrogation JSON.

```json
"mongodb": {
  "command": "npx",
  "args": ["-y", "@mongodb-js/mongodb-mcp-server"],
  "env": { "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017" }
}
```

---

### 19. Neon (Postgres sans serveur)
PostgreSQL sans serveur de Neon avec branchement — gérez directement votre projet Neon.

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon"],
  "env": { "NEON_API_KEY": "..." }
}
```

---

### 20. E2B (Exécution de code en bac à sable)
Environnement cloud sécurisé pour exécuter Python/JS, exécutez des commandes shell en toute sécurité.

```json
"e2b": {
  "command": "npx",
  "args": ["-y", "@e2b/mcp-server"],
  "env": { "E2B_API_KEY": "e2b_..." }
}
```

---

### 21. Semgrep
Analyse statique pour les vulnérabilités de sécurité et la qualité du code.

```json
"semgrep": {
  "command": "semgrep",
  "args": ["mcp"]
}
```

---

## 🔍 TIER 3 — Recherche et recherche

### 22. Brave Search (4.3K recherches)
Recherche web sans suivi. Tier gratuit : 2 000 requêtes/mois.

```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": { "BRAVE_API_KEY": "BSA..." }
}
```

---

### 23. Firecrawl (7.2K recherches)
Convertissez n'importe quelle URL en Markdown propre — gère les pages rendues par JS.

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "fc-..." }
}
```

---

### 24. Exa (3.5K recherches)
Recherche sémantique neuronale sur le web.

```json
"exa": {
  "command": "npx",
  "args": ["-y", "exa-mcp-server"],
  "env": { "EXA_API_KEY": "..." }
}
```

---

### 25. Tavily (2.9K recherches)
Recherche optimisée par IA pour RAG et agents IA.

```json
"tavily": {
  "command": "npx",
  "args": ["-y", "tavily-mcp"],
  "env": { "TAVILY_API_KEY": "tvly-..." }
}
```

---

### 26. Jina Reader
Convertit les URLs en Markdown propre — excellent pour le scraping de documentation.

```json
"jina": {
  "command": "npx",
  "args": ["-y", "@jina-ai/mcp-server-jina-reader"],
  "env": { "JINA_API_KEY": "jina_..." }
}
```

---

### 27. Perplexity
Recherche sémantique + recherche web en temps réel avec citations.

```json
"perplexity": {
  "command": "npx",
  "args": ["-y", "mcp-server-perplexity"],
  "env": { "PERPLEXITY_API_KEY": "pplx-..." }
}
```

---

### 28. GPT Researcher
Agent de recherche profonde qui planifie, exécute et rédige des rapports soutenus par des citations.

```json
"gpt-researcher": {
  "command": "uvx",
  "args": ["gptr-mcp"],
  "env": { "OPENAI_API_KEY": "sk-..." }
}
```

---

## 📊 TIER 4 — Analyse et surveillance

### 29. Grafana (6.1K recherches)
Interrogez les métriques, explorez les tableaux de bord, enquêtez sur les alertes.

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

### 30. Datadog (6.9K recherches · Officiel)
Interrogez les métriques, journaux, traces pour diagnostics.

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
Analyse de produit, drapeaux de fonctionnalité, enregistrements de sessions.

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

## 📋 TIER 5 — Gestion de projet

### 32. Linear (10.6K recherches · Officiel)
Créez des problèmes, mettez à jour le statut, interrogez les projets, gérez les cycles.

```json
"linear": {
  "command": "npx",
  "args": ["-y", "@linear/mcp-server"],
  "env": { "LINEAR_API_KEY": "lin_api_..." }
}
```

---

### 33. Notion (23K recherches)
Lisez/écrivez les pages, interrogez les bases de données, cherchez dans l'espace de travail.

```json
"notion": {
  "command": "npx",
  "args": ["-y", "@notionhq/notion-mcp-server"],
  "env": { "NOTION_API_KEY": "secret_..." }
}
```

---

### 34. Jira / Atlassian (40K recherches · Officiel)
Problèmes, sprints, documents Confluence.

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

### 35. Asana (2.8K recherches)
Gestion des tâches, projets et équipes.

```json
"asana": {
  "command": "npx",
  "args": ["-y", "asana-mcp-server"],
  "env": { "ASANA_ACCESS_TOKEN": "..." }
}
```

---

### 36. Task Master
Transforme les PRD en listes de tâches structurées avec dépendances.

```json
"taskmaster": {
  "command": "npx",
  "args": ["-y", "task-master-ai"],
  "env": { "ANTHROPIC_API_KEY": "sk-ant-..." }
}
```

---

## 💬 TIER 6 — Communication

### 37. Slack (17.7K recherches · Officiel)
Lisez les canaux, cherchez les messages, publiez les mises à jour.

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

### 38. Gmail (5.6K recherches)
Cherchez, lisez, envoyez et répondez aux e-mails.

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

## ☁️ TIER 7 — Cloud et Infrastructure

### 39. AWS (16K recherches · Officiel)
Interrogez et gérez les services AWS — suite complète.

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

### 40. Azure (13K recherches · Officiel)
Gestion des ressources Azure.

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

### 41. Cloudflare (2.3K recherches · Officiel)
Gestion de Workers, KV, D1, R2, DNS, Pages.

```json
"cloudflare": {
  "command": "npx",
  "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
  "env": { "CLOUDFLARE_API_TOKEN": "..." }
}
```

---

### 42. Vercel (3.1K recherches · Officiel)
Déployez, gérez les domaines, affichez les journaux, contrôlez les environnements.

```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@vercel/mcp"],
  "env": { "VERCEL_TOKEN": "..." }
}
```

---

### 43. Netlify (Officiel)
Gestion des sites, hooks de construction, variables d'environnement.

```json
"netlify": {
  "command": "npx",
  "args": ["-y", "@netlify/mcp"],
  "env": { "NETLIFY_AUTH_TOKEN": "..." }
}
```

---

### 44. Kubernetes (2.1K recherches)
Gérez les pods, déploiements, services, espaces de noms.

```json
"kubernetes": {
  "command": "npx",
  "args": ["-y", "mcp-server-kubernetes"]
}
```
Utilise votre `~/.kube/config`.

---

### 45. Terraform (3.2K recherches)
Exécutez les plans, appliquez, gérez l'état.

```json
"terraform": {
  "command": "npx",
  "args": ["-y", "terraform-mcp-server"]
}
```

---

## 🛒 TIER 8 — E-commerce et paiements

### 46. Shopify (5.4K recherches · Officiel)
Produits, commandes, inventaire, clients.

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

## 📁 TIER 9 — Productivité et contenu

### 47. Google Drive (5.9K recherches · Officiel)
Cherchez, lisez, créez des fichiers Google Drive.

```json
"gdrive": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gdrive"],
  "env": { "GDRIVE_CREDENTIALS_PATH": "/path/to/credentials.json" }
}
```

---

### 48. Google Sheets (2.1K recherches)
Lisez/écrivez les Sheets — rapports, pipelines de données.

```json
"gsheets": {
  "command": "npx",
  "args": ["-y", "google-sheets-mcp"],
  "env": { "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/creds.json" }
}
```

---

### 49. Google Calendar (3.5K recherches)
Lisez et créez des événements de calendrier.

```json
"gcal": {
  "command": "npx",
  "args": ["-y", "google-calendar-mcp"],
  "env": { "GOOGLE_CREDENTIALS": "/path/to/credentials.json" }
}
```

---

### 50. Airtable (2.2K recherches)
Lisez/écrivez Airtable — base de données légère ou CMS.

```json
"airtable": {
  "command": "npx",
  "args": ["-y", "airtable-mcp-server"],
  "env": { "AIRTABLE_API_KEY": "pat..." }
}
```

---

### 51. Obsidian (8.1K recherches)
Lisez et écrivez vos notes du coffre-fort Obsidian.

```json
"obsidian": {
  "command": "npx",
  "args": ["-y", "mcp-obsidian"],
  "env": { "OBSIDIAN_VAULT_PATH": "/path/to/vault" }
}
```

---

### 52. WordPress (3.5K recherches)
Créez des articles, gérez les pages, gérez les médias.

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

## 🎨 TIER 10 — Conception

### 53. Figma (74K recherches · Mode de développeur officiel)
Structure de conception en direct, couches, variantes pour la génération de code.

```json
"figma": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp"],
  "env": { "FIGMA_API_KEY": "figd_..." }
}
```
Nécessite Figma Dev Mode (plan payant).

---

### 54. Magic UI
Bibliothèque de composants React + Tailwind pour la génération d'interface utilisateur assistée par IA.

```json
"magicui": {
  "command": "npx",
  "args": ["-y", "@magicui/mcp"]
}
```

---

## 🔔 TIER 11 — Notifications et automatisation

### 55. ntfy (Push mobile)
Notifications push téléphoniques à partir des flux d'agents.

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

### 56. Zapier (10.8K recherches)
Déclenchez plus de 7 000 automatisations à partir de Claude Code.

```json
"zapier": {
  "command": "npx",
  "args": ["-y", "@zapier/mcp"],
  "env": { "ZAPIER_MCP_API_KEY": "..." }
}
```

---

### 57. n8n
Automatisation de flux de travail multi-étapes et peu coûteuse.

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
Déclenchez du code sans serveur sur 2 500 API.

```json
"pipedream": {
  "command": "npx",
  "args": ["-y", "@pipedream/mcp"],
  "env": { "PIPEDREAM_ACCESS_TOKEN": "..." }
}
```

---

## 🧠 TIER 12 — IA et mémoire

### 59. Sequential Thinking (13K recherches)
Force un raisonnement explicite étape par étape avant de répondre.

```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

---

### 60. Chroma (Base de données vectorielle)
Récupération de documents sémantiques pour RAG.

```json
"chroma": {
  "command": "uvx",
  "args": ["chroma-mcp"],
  "env": { "CHROMA_HOST": "localhost", "CHROMA_PORT": "8000" }
}
```

---

### 61. MindsDB (39K étoiles)
Moteur de requête fédérée sur plusieurs bases de données et SaaS.

```json
"mindsdb": {
  "command": "npx",
  "args": ["-y", "@mindsdb/mcp-server-mindsdb"],
  "env": { "MINDSDB_HOST": "cloud.mindsdb.com", "MINDSDB_API_KEY": "..." }
}
```

---

## 📈 TIER 13 — Données et analyse

### 62. HubSpot (3.8K recherches · Officiel)
Automatisation CRM — contacts, entreprises, offres, tickets.

```json
"hubspot": {
  "command": "npx",
  "args": ["-y", "@hubspot/mcp-server"],
  "env": { "HUBSPOT_ACCESS_TOKEN": "pat-..." }
}
```

---

### 63. Snowflake (3.6K recherches)
Interrogez l'entrepôt de données Snowflake.

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

### 64. dbt (1.9K recherches)
Exécutez les modèles dbt, testez, explorez la documentation.

```json
"dbt": {
  "command": "npx",
  "args": ["-y", "dbt-mcp"],
  "env": { "DBT_PROJECT_DIR": "/path/to/dbt/project" }
}
```

---

## 🧪 TIER 14 — Tests et assurance qualité

### 65. BrowserStack
Tests multi-navigateurs et multi-appareils dans le cloud.

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

### 66. Puppeteer (7.3K recherches · Officiel)
Alternative d'automatisation de navigateur à Playwright.

```json
"puppeteer": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
  "env": { "PUPPETEER_HEADLESS": "true" }
}
```

---

## 🎨 TIER 15 — Médias et créatif

### 67. Excalidraw
Générez des diagrammes d'architecture et des croquis.

```json
"excalidraw": {
  "command": "npx",
  "args": ["-y", "excalidraw-mcp-server"]
}
```

---

### 68. Spotify
Recherchez, mettez en file d'attente et changez les listes de lecture de votre éditeur.

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

## 🔐 TIER 16 — Sécurité et conformité

### 69. Snyk
Balayage CVE en temps réel pour les dépendances.

```json
"snyk": {
  "command": "npx",
  "args": ["-y", "snyk-mcp"],
  "env": { "SNYK_TOKEN": "..." }
}
```

---

### 70. Salesforce (6.5K recherches)
CRM, opportunités, pistes, comptes.

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

## Serveurs supplémentaires (71–100)

| # | Serveur | Installer | Ce qu'il fait |
|---|---|---|---|
| 71 | **Google Maps** | `npx mcp-server-google-maps` | Données de localisation, POI |
| 72 | **Convex** | `npx convex-mcp` | BaaS stack complet |
| 73 | **Milvus** | `npx mcp-server-milvus` | BD vectorielle |
| 74 | **SQLite** | `npx @modelcontextprotocol/server-sqlite` | SQL intégré |
| 75 | **Serena** | `npx serena-mcp` | Compréhension symbolique du code (24K étoiles) |
| 76 | **Skyvern** | `pip install skyvern` | Automatisation de navigateur avec vision par ordinateur |
| 77 | **Last9** | `npx last9-mcp-server` | Ingénierie de la fiabilité |
| 78 | **Weaviate** | `npx mcp-server-weaviate` | Recherche vectorielle sémantique |
| 79 | **Cognee** | `uvx cognee-mcp` | Connaissance du graphe-RAG |
| 80 | **Google Search Console** | `npx google-search-console-mcp` | Données SEO organiques |
| 81 | **Ahrefs** | `npx ahrefs-mcp` | Recherche SEO |
| 82 | **Resend** | `npx resend-mcp` | API d'e-mail transactionnel |
| 83 | **Algolia** | `npx algolia-mcp` | Infrastructure de recherche |
| 84 | **Pinecone** | `npx pinecone-mcp` | BD vectorielle |
| 85 | **Upstash** | `npx upstash-mcp` | Redis sans serveur |
| 86 | **Liveblocks** | `npx liveblocks-mcp` | Collaboration en temps réel |
| 87 | **Cloudinary** | `npx cloudinary-mcp` | Gestion des médias |
| 88 | **Webflow** | `npx webflow-mcp` | CMS du site Web |
| 89 | **Framer** | `npx framer-mcp` | Conception au code |
| 90 | **PlanetScale** | `npx planetscale-mcp` | BD compatible MySQL |
| 91 | **Turso** | `npx turso-mcp` | SQLite Edge |
| 92 | **Supabase Realtime** | via Supabase MCP | Abonnements en temps réel |
| 93 | **Neon** | `npx @neondatabase/mcp-server-neon` | (voir #19) |
| 94 | **MindsDB** | (voir #61) | — |
| 95 | **BrowserStack** | (voir #65) | — |
| 96 | **Task Master** | (voir #36) | — |
| 97 | **Pipedream** | (voir #58) | — |
| 98 | **Chrome DevTools** | `npx chrome-devtools-mcp` | Console, Réseau, Perf |
| 99 | **Magic UI** | (voir #54) | — |
| 100 | **Jina Reader** | (voir #26) | — |

---

## Bundles de démarrage rapide

### Créateur SaaS indépendant (Commencez ici — 5 serveurs)
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

### Développeur full-stack (10 serveurs)
Ajouter à SaaS indépendant : `playwright`, `sentry`, `linear`, `slack`, `sequential-thinking`

### Données et analyse
`postgres` + `snowflake` + `grafana` + `firecrawl` + `fetch` + `dbt`

### Contenu et marketing
`notion` + `wordpress` + `gmail` + `google-sheets` + `brave-search` + `firecrawl`

### DevOps et Infrastructure
`github` + `kubernetes` + `terraform` + `aws` + `datadog` + `docker`

### Recherche et connaissance
`memory` + `context7` + `brave-search` + `firecrawl` + `sequential-thinking` + `obsidian`

---

## Meilleures pratiques de sécurité

- Utilisez des **connexions de base de données en lecture seule** sauf si l'accès en écriture est explicitement nécessaire
- Stockez les clés API comme variables d'environnement, ne codez jamais en dur dans les fichiers de configuration
- Utilisez `.claude/mcp.json` au niveau du projet pour les serveurs spécifiques au projet
- Commencez avec les étendues minimales du token GitHub (`read:org`) — développez uniquement si nécessaire
- Pour les bases de données de production : créez un utilisateur MCP dédié en lecture seule

---
