# MCP: Cloudflare

Verwalte den kompletten Cloudflare Edge Stack — Workers, R2, D1, KV, DNS, Pages, AI und Zero Trust — von Claude Code aus via einer Familie von 16 spezialisierten MCP-Modulen.

## Warum du das brauchst

Cloudflares Dashboard umfasst Dutzende von Produktbereichen über mehrere Navigationsebenen hinweg. Das Cloudflare MCP-Ökosystem macht aus diesem alles Direkt-Tool-Aufrufe: Deploye einen Worker, aktualisiere einen DNS-Record, führe eine D1-SQL-Abfrage aus oder rufe ein Workers-AI-Modell auf — alles von einer einzigen Claude Code Session. Jedes Modul ist unabhängig, sodass du nur das aktivierst, was dein Projekt nutzt.

## Installation

```bash
npx -y @cloudflare/mcp-server-cloudflare <module>
```

Ersetze `<module>` mit dem spezifischen Service-Namen (z.B. `workers`, `dns`, `d1`). Jedes Modul läuft als separater MCP-Server-Eintrag.

## Konfiguration

Jedes Modul wird als separater Server registriert, sodass du sie einzeln aktivieren und deaktivieren kannst:

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

Füge Module unabhängig hinzu oder entferne sie aus deiner Konfiguration.

## Schlüssel-Tools

### workers
Deploye, aktualisiere und lösche Worker-Scripts. Zeige Logs an und verfolge Live-Ausgaben.

### r2
Erstelle und lösche Buckets. Lade, lade herunter und liste Objekte im R2-Speicher auf.

### d1
Erstelle D1-Datenbanken. Führe SQL-Abfragen aus. Führe Schema-Migrationen durch.

### kv
Lese, schreibe und lösche Einträge in KV-Namespaces. Liste Keys mit Präfix-Filtern auf.

### pages
Liste und erstelle Pages-Deployments. Verwalte benutzerdefinierte Domains auf Pages-Projekten.

### dns
Füge DNS-Records hinzu, aktualisiere und lösche sie (A, AAAA, CNAME, MX, TXT, SRV).

### ai
Führe Workers-AI-Modelle aus: Text-Generierung, Bild-Generierung, Speech-to-Text und Embeddings.

### analytics
Abfrage Web-Analytics-Event-Daten. Zugriff auf Zaraz-Analytics-Konfiguration.

### zero-trust
Verwalte Zero-Trust-Zugriffspolitiken, Tunnel und Device-Posture-Regeln.

## Verwendungsbeispiele

```
Deploye mein aktualisiertes Worker-Script zur Produktions-Zone example.com

Füge einen CNAME-Record für api.example.com hinzu, der auf my-load-balancer.com zeigt

Frage die letzten 100 Zeilen aus meiner D1-Analytics-Datenbank ab

Führe Workers-AI Llama-3-Text-Generierung mit diesem Prompt aus

Zeige Web-Analytics für die letzten 7 Tage, aufgeschlüsselt nach Land

Lade diese JSON-Datei in den my-app-assets R2-Bucket hoch

Schreibe einen KV-Eintrag: key=feature_flags value={"dark_mode":true}

Liste alle aktiven Zero-Trust-Zugriffspolitiken für die Admin-Subdomain auf
```

## Authentifizierung

1. Gehe zu [cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Klicke auf **Create Token** — verwende **Create Custom Token**
3. Setze Berechtigungen basierend auf den aktivierten Modulen:
   - DNS-Modul: `Zone → DNS → Edit`
   - Workers-Modul: `Account → Workers Scripts → Edit`
   - R2-Modul: `Account → R2 Storage → Edit`
   - D1-Modul: `Account → D1 → Edit`
   - Zero Trust-Modul: `Account → Access: Organizations, Identity Providers, and Groups → Edit`
4. Finde deine Account ID in der Cloudflare-Dashboard-Sidebar (rechte Seite einer beliebigen Zone-Übersichtsseite)
5. Setze beide `CLOUDFLARE_API_TOKEN` und `CLOUDFLARE_ACCOUNT_ID` im Env-Block für jedes Modul

Ein einzelnes Token kann mehrere Berechtigungssätze tragen — du brauchst nicht ein Token pro Modul.

## Tipps

- Registriere jedes Modul als separaten benannten MCP-Server (`cloudflare-workers`, `cloudflare-dns`, etc.), sodass du ungenutzte Module ohne Auswirkungen auf andere auskommentieren kannst.
- Workers-AI (`ai`-Modul) gibt Zugang zu Cloudflares gehosteten Modellen — Llama 3, Mistral, Whisper, SDXL — ohne zusätzliche API-Schlüssel-Kosten jenseits deines Cloudflare-Kontos.
- Zero-Trust-Modul erfordert `Access: Organizations, Identity Providers, and Groups`-Berechtigung auf deinem Token — dies ist separat von Standard-Zone/Account-Berechtigungen.
- D1 `execute_sql` unterstützt Lesen und Schreiben — verwende es direkt für einmalige Abfragen oder verbinde es mit Migrations-Workflows neben dem Neon MCP für Multi-Datenbank-Projekte.
- `kv`-Operationen sind eventual consistent über Cloudflares Edge — Lesevorgänge können Schreibvorgänge um bis zu 60 Sekunden in entfernten Regionen verzögern.
- Das `dns`-Modul ist der schnellste Weg, um DNS-Änderungen programmgesteuert zu verwalten — Änderungen propagieren innerhalb von Sekunden auf Cloudflare-verwalteten Zones.

---
