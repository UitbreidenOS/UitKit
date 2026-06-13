# MCP: Vercel

Verwalte Vercel-Deployments, Projekte, Domains und Umgebungs-Variablen von Claude Code aus — ohne das Dashboard zu öffnen oder Deployment-Logs zu copy-pasten.

## Warum du das brauchst

Deployment-Debugging bedeutet normalerweise: öffne Vercel-Dashboard, finde das fehlgeschlagene Deployment, scrolle durch Build-Logs, kopiere den Fehler, paste in deinen Editor. Das Vercel MCP macht aus dem einen einzelnen Request. Claude zieht die Logs, liest den Fehler, verfolgt ihn zur Quell-Datei und schlägt die Fix vor — alles im Kontext.

## Installation

```bash
npm install -g @vercel/mcp-server
```

## Konfiguration

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_TOKEN": "YOUR_VERCEL_TOKEN",
        "VERCEL_TEAM_ID": "YOUR_TEAM_ID"
      }
    }
  }
}
```

`VERCEL_TEAM_ID` ist nur für Team- oder Organisations-Deployments erforderlich. Persönliche Projekte funktionieren mit dem Token allein.

## Schlüssel-Tools

| Tool | Was es tut |
|---|---|
| `list_deployments` | Liste kürzliche Deployments für ein Projekt mit Status auf |
| `get_deployment` | Komplette Deployment-Detail inkl. Build-Metadaten |
| `create_deployment` | Triggere ein neues Deployment von einem Branch oder Commit |
| `list_projects` | Liste alle Projekte im Account oder Team auf |
| `get_project` | Projekt-Konfiguration und Framework-Settings |
| `list_domains` | Alle Custom-Domains, die zu einem Projekt angehängt sind |
| `add_domain` | Hänge eine neue Custom-Domain an |
| `list_env_vars` | Liste Umgebungs-Variablen auf (Werte standardmäßig gemacht) |
| `upsert_env_var` | Füge oder aktualisiere eine Umgebungs-Variable (Insert oder Overwrite) |
| `delete_env_var` | Entferne eine Umgebungs-Variable |
| `get_deployment_logs` | Stream Build und Runtime-Logs für ein Deployment |
| `rollback_deployment` | Rolle sofort zur vorherigen Production-Deployment zurück |

## Verwendungsbeispiele

```
Zeige mir die letzten 5 Deployments für my-app und ihren Status

Welche Fehler erschienen im letzten fehlgeschlagenen Deployment des Checkout-Service?

Füge die STRIPE_SECRET_KEY Umgebungs-Variable zu Production hinzu — Wert ist sk_live_xxx

Rolle Production sofort zur vorherigen Deployment zurück

Liste alle Custom-Domains, die zum Storefront-Projekt angehängt sind auf

Warum schlug der Build vor 20 Minuten fehl? Zeige mir die kompletten Logs.
```

## Authentifizierung

1. Gehe zu [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Klicke auf **Create Token** — nenne ihn etwas Identifizierbares (z.B. `claude-mcp`)
3. Setze Scope auf **Full Account** für persönliche Projekte oder wähle ein bestimmtes Team
4. Kopiere das Token — es wird einmal angezeigt
5. Für Team-Deployments: finde deine Team-ID unter **Team Settings → General**

## Tipps

- `get_deployment_logs` ist der Hauptgrund, dieses MCP zu installieren — Piping Live-Logs in Claudes Kontext ist schneller als jeder manuelle Debugging-Workflow.
- `rollback_deployment` macht den Build nicht erneut — es promotet das vorherige immutable Deployment zu Production sofort. Zero Downtime.
- Kombiniere mit dem GitHub MCP, um eine komplette Loop zu bauen: PR merged → Deployment triggert → Logs bestätigen Erfolg → fertig.
- Umgebungs-Variablen hinzugefügt via `upsert_env_var` treten auf dem nächsten Deployment in Kraft — sie sind nicht Hot-Reloaded.
- Verwende `list_env_vars`, um zu prüfen, welche Umgebungs-Variablen existieren, bevor upsert; `upsert_env_var` überschreibt existierende Werte stillschweigend.
- Preview-Deployments (von PRs) und Production-Deployments sind separat — spezifiziere die Ziel-Umgebung beim Ausführen von Umgebungs-Variablen-Operationen.

---
