# MCP: Puppeteer-Browserautomatisierung

Kontrollieren Sie einen echten Browser aus Claude Code. Navigieren, klicken, Formulare ausfüllen, Screenshots machen und Seiten scrapen — alles aus Ihrer Session.

## Warum Sie das brauchen

Einige Aufgaben erfordern einen echten Browser: JavaScript-gerenderten Inhalt scrapen, Workflows auf Web-Apps automatisieren, UI-Flows testen oder Screenshots erfassen. Der Puppeteer MCP-Server gibt Claude volle Browser-Kontrolle.

## Konfiguration

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {
        "PUPPETEER_HEADLESS": "true"
      }
    }
  }
}
```

Setzen Sie `PUPPETEER_HEADLESS` auf `false`, um den Browser während der Ausführung zu beobachten.

## Was Claude tun kann

```
# Screenshot einer Seite


# Strukturierte Daten scrapen
"Go to [URL] and extract all product names and prices into a JSON list"

# Formulare ausfüllen und senden
"Navigate to our staging site, log in with test@example.com, and confirm the checkout flow works"

# PDFs generieren
"Convert https://docs.example.com/guide to a PDF"

# UI-Interaktionen testen
"Click the 'Get started' button and tell me what happens next"
```

## Verfügbare Tools

| Tool | Was es macht |
|---|---|
| `puppeteer_navigate` | Zu einer URL navigieren |
| `puppeteer_screenshot` | Screenshot erfassen |
| `puppeteer_click` | Element anklicken |
| `puppeteer_fill` | Formularfeld ausfüllen |
| `puppeteer_evaluate` | JavaScript auf Seite ausführen |
| `puppeteer_pdf` | PDF generieren |
| `puppeteer_select` | Dropdown-Option auswählen |

## Anwendungsfälle

**Content-Scraping:**
"Scrape the top 20 posts from this news site and summarise each one"

**Wettbewerbsforschung:**
"Go to competitor's pricing page and extract their tier names, prices, and features"

**Automatisiertes Testen:**
"Run through our complete sign-up flow and report any errors you encounter"

**Dokumentation:**
"Take screenshots of each page of our onboarding flow for the user guide"

## vs. Playwright-Skill

Der `/playwright-pro`-Skill generiert Playwright-Test-Code. Dieser MCP-Server gibt Claude direkte Browser-Kontrolle für On-Demand-Automatisierung — komplementär, nicht konkurrierend.

## Voraussetzungen

```bash
# Puppeteer installiert Chromium automatisch beim ersten Lauf
# Stellen Sie sicher, dass Node.js 18+ installiert ist
node --version
```
