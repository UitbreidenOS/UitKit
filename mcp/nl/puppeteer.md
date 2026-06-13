# MCP: Puppeteer Browser-automatisering

Bestuur een echte browser vanuit Claude Code. Navigeer, klik, vul formulieren in, maak screenshots en scrap pagina's — alles vanuit uw sessie.

## Waarom je dit nodig hebt

Sommige taken vereisen een echte browser: JavaScript-gerenderde inhoud scrapen, workflows op webapps automatiseren, UI-flows testen of screenshots vastleggen. De Puppeteer MCP-server geeft Claude volledige browserbesturing.

## Configuratie

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

Stel `PUPPETEER_HEADLESS` in op `false` om de browser terwijl deze draait te bekijken.

## Wat Claude kan doen

```
# Screenshot van pagina


# Gestructureerde gegevens schrapen
"Go to [URL] and extract all product names and prices into a JSON list"

# Formulieren invullen en versturen
"Navigate to our staging site, log in with test@example.com, and confirm the checkout flow works"

# PDF's genereren
"Convert https://docs.example.com/guide to a PDF"

# UI-interacties testen
"Click the 'Get started' button and tell me what happens next"
```

## Beschikbare tools

| Tool | Wat het doet |
|---|---|
| `puppeteer_navigate` | Naar een URL navigeren |
| `puppeteer_screenshot` | Screenshot vastleggen |
| `puppeteer_click` | Op element klikken |
| `puppeteer_fill` | Formulierveld invullen |
| `puppeteer_evaluate` | JavaScript op pagina uitvoeren |
| `puppeteer_pdf` | PDF genereren |
| `puppeteer_select` | Dropdown-optie selecteren |

## Gebruiksscenario's

**Content scraping:**
"Scrape the top 20 posts from this news site and summarise each one"

**Competitief onderzoek:**
"Go to competitor's pricing page and extract their tier names, prices, and features"

**Geautomatiseerd testen:**
"Run through our complete sign-up flow and report any errors you encounter"

**Documentatie:**
"Take screenshots of each page of our onboarding flow for the user guide"

## vs. Playwright-skill

De `/playwright-pro`-skill genereert Playwright-testcode. Deze MCP-server geeft Claude directe browserbesturing voor on-demand automatisering — aanvullend, niet concurrerend.

## Vereisten

```bash
# Puppeteer installeert Chromium automatisch bij eerste uitvoering
# Zorg ervoor dat Node.js 18+ is geïnstalleerd
node --version
```
