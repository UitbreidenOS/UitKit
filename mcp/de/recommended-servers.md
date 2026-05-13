> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../recommended-servers.md).

# MCP Empfohlene Server

Ein praktischer Leitfaden zu MCP-Servern, die in Claude Code aktiviert werden sollten. Geordnet nach Kategorie mit Token-Kostenschätzungen und klarer Anleitung, wann jeder verwendet werden sollte.

---

## Token-Budget-Bewusstsein

Jeder aktivierte MCP-Server trägt seine Tool-Beschreibungen zum Kontextfenster von Claude bei.

| Aktivierte MCP-Server | Ungefähre Token-Kosten |
|--------------------|----------------------|
| 3 Server (~10 Tools) | ~10.000 Token |
| 10 Server (~30 Tools) | ~30.000 Token |
| 20 Server (~60 Tools) | ~60.000 Token |

Mit einem 200k-Token-Fenster verbrauchen 10 aktive MCPs ~15% des Kontexts vor jedem Gespräch. Selektiv sein. Server deaktivieren, die nicht aktiv verwendet werden.

---

## Dateisystem & Suche

### `@modelcontextprotocol/server-filesystem`
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/project
```
- **Was es bietet:** Dateien lesen, schreiben, auflisten und suchen mit konfigurierbaren Pfadbeschränkungen
- **Token-Kosten:** ~2.000 Token
- **Verwenden wenn:** Claude eine Codebase-Verzeichnisstruktur über das aktuelle Arbeitsverzeichnis hinaus erkunden soll
- **Vermeiden wenn:** Claude Codes eingebaute Read/Write-Tools bereits das Projekt abdecken

### `@modelcontextprotocol/server-brave-search` oder `tavily`
```bash
npx -y @modelcontextprotocol/server-brave-search
```
- **Was es bietet:** Websuche aus Claude heraus
- **Token-Kosten:** ~1.500 Token
- **Verwenden wenn:** Agenten aktuelle Informationen benötigen (Docs, Neuigkeiten, Paketversionen), die nicht in den Trainingsdaten sind
- **Vermeiden wenn:** Nur Code-Generierung benötigt wird, keine Web-Lookups erforderlich

---

## Datenbanken

### `@modelcontextprotocol/server-postgres`
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```
- **Was es bietet:** Abfragen, Schema inspizieren, Tabellen auflisten — direkter DB-Zugriff aus Claude
- **Token-Kosten:** ~3.000 Token
- **Verwenden wenn:** Schema-Erkundung, komplexe Abfragen schreiben, Datenprobleme debuggen
- **Vermeiden wenn:** Produktionsdatenbank — stattdessen ein schreibgeschütztes Replikat oder Dev-DB verwenden
- **Sicherheit:** Niemals auf Produktions-DB zeigen. Mindestens einen schreibgeschützten Benutzer verwenden.

### `@modelcontextprotocol/server-sqlite`
- **Was es bietet:** Dasselbe wie postgres, aber für SQLite-Dateien
- **Token-Kosten:** ~2.500 Token
- **Verwenden wenn:** Lokale Entwicklung mit SQLite, eingebettete Datenbanken

---

## APIs & Dienste

### `@modelcontextprotocol/server-github`
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    }
  }
}
```
- **Was es bietet:** Issues, PRs, Commits, Dateien aus GitHub-Repos lesen
- **Token-Kosten:** ~4.000 Token
- **Verwenden wenn:** PRs überprüfen, Issues priorisieren, Kontext aus Remote-Repos abrufen
- **Vermeiden wenn:** Nur lokaler Git-Kontext benötigt wird (git CLI ist schneller)

### `@modelcontextprotocol/server-linear`
- **Was es bietet:** Linear-Issues und -Projekte erstellen, aktualisieren und abfragen
- **Token-Kosten:** ~3.000 Token
- **Verwenden wenn:** Issue-Tracking in den Entwicklungs-Workflow integriert ist

### `stripe-mcp` (offiziell von Stripe)
```bash
npx -y @stripe/mcp --api-key sk_test_...
```
- **Was es bietet:** Kunden, Produkte, Preise, Checkout-Sessions erstellen; Zahlungen abfragen
- **Token-Kosten:** ~5.000 Token
- **Verwenden wenn:** Stripe-Integrationen bauen, Zahlungsflows testen
- **Vermeiden wenn:** Produktions-Stripe-Keys — in der Entwicklung nur Testmodus verwenden

---

## Browser & Tests

### `@modelcontextprotocol/server-puppeteer`
- **Was es bietet:** Browser starten, Seiten navigieren, Elemente klicken, Screenshots machen
- **Token-Kosten:** ~3.500 Token
- **Verwenden wenn:** Web-UIs testen, Scraping, Browser-Interaktionen automatisieren
- **Vermeiden wenn:** API-Tests — überdimensioniert, fetch/curl verwenden

### `@playwright/mcp`
```bash
npx -y @playwright/mcp@latest
```
- **Was es bietet:** Playwright-Automatisierung — zuverlässiger als Puppeteer für moderne SPAs
- **Token-Kosten:** ~4.000 Token
- **Verwenden wenn:** E2E-Test-Schreiben, UI-Verifikation, komplexe Browser-Automatisierung
- **Gegenüber Puppeteer empfohlen** für Next.js / React-Apps

---

## KI & Reasoning

### `@modelcontextprotocol/server-memory`
```bash
npx -y @modelcontextprotocol/server-memory
```
- **Was es bietet:** Ein Wissensgraph, der über Sitzungen hinweg persistiert — Entitäten, Beziehungen, Beobachtungen
- **Token-Kosten:** ~2.000 Token
- **Verwenden wenn:** Langfristige Projekte, bei denen Claude sich Kontext zwischen Sitzungen merken soll
- **Vermeiden wenn:** Einzel-Sitzungs-Aufgaben — Overhead ohne Nutzen

### `@modelcontextprotocol/server-sequential-thinking`
- **Was es bietet:** Erzwingt, dass Claude explizite Reasoning-Schritte durchläuft, bevor es antwortet
- **Token-Kosten:** ~1.500 Token
- **Verwenden wenn:** Komplexe mehrstufige Problemlösung, Architekturentscheidungen
- **Vermeiden wenn:** Einfache Abfragen — fügt Latenz ohne Nutzen hinzu

---

## Konfigurationsvorlage

Server zu `~/.claude/settings.json` (global) oder `.claude/settings.json` (Projekt) hinzufügen:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    }
  }
}
```

Umgebungsvariablen-Referenzen (`${VAR}`) anstelle von hartcodierten Secrets verwenden.

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
