# MCP: Playwright

Beheer een echte browser rechtstreeks vanuit Claude Code. Playwright MCP laat Claude pagina's navigeren, op elementen klikken, formulieren invullen, schermafbeeldingen nemen en inhoud extraheren — waardoor browserautomatisering een natuurlijk gesprek wordt in plaats van een scriptingoefening.

## Waarom je dit nodig hebt

Browsertaken dwingen je normaal gesproken uit de terminal: open een browser, klik handmatig rond, copy-paste resultaten terug. Met Playwright MCP:
- Claude kan UI-flows van begin tot eind testen zonder je muis aan te raken
- Schermafbeeldingen geven Claude visuele bevestiging van wat de pagina werkelijk ziet
- Formulierinvulling, login-flows en multi-stap-interacties draaien in een eenmalige prompt
- Scraping en content-extractie worden eenliners in plaats van scripts
- Werkt headless in CI of zichtbaar lokaal voor debugging

## Installatie

```bash
# Installeer de MCP-server
npm install -g @playwright/mcp

# Installeer de Chromium-browser-binary (vereist)
npx playwright install chromium
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

Voor headed-modus (zichtbaar browservenster, handig voor debugging):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}
```

## Sleuteltools

- `browser_navigate` — ga naar een URL
- `browser_screenshot` — leg de huidige pagina vast als afbeelding
- `browser_click` — klik op een element via CSS-selector of coördinaten
- `browser_type` — typ tekst in een invoerveld
- `browser_select_option` — kies een waarde uit een vervolgkeuzelijst
- `browser_scroll` — scroll de pagina met een pixelbedrag of naar een element
- `browser_evaluate` — voer JavaScript uit in de paginacontext en retourneer het resultaat
- `browser_get_text` — extraheer zichtbare tekst van de pagina of een specifiek element
- `browser_wait_for` — wacht tot een element verschijnt, netwerk inactief is of een timeout

## Gebruiksvoorbeelden

```
Navigeer naar de login-pagina, vul de testreferenties in, dien het formulier in,
en maak een schermafbeelding zodat ik kan verifiëren dat het dashboard correct wordt geladen.
```

```
Ga naar onze staging-omgeving op https://staging.myapp.com/dashboard,
extraheer alle tekst uit foutberichtelementen en retourneer ze als lijst.
```

```
Test de checkout-flow: navigeer naar de productpagina, voeg het eerste item
aan de winkelwagen toe, ga naar checkout en verifieer dat de ordersamenvatting
het juiste item en de juiste prijs toont.
```

```
Scrape de prijspagina op https://myapp.com/pricing — extraheer de plannamen,
prijzen en functielijsten, retourneer dan alles als gestructureerde JSON.
```

```
Maak een schermafbeelding van elke pagina in de hoofdnavigatie en sla deze op
in /screenshots met bestandsnamen die overeenkomen met de navigatielabels.
```

## Verificatie

Geen API-sleutel vereist. De browser draait lokaal op je machine. Voor sites die inloggen vereisen:
- Gebruik `browser_navigate` + `browser_type` + `browser_click` om als onderdeel van de prompt te verifiëren
- Voor persistente sessies, gebruik `browser_evaluate` om auth-cookies direct in te voegen:
  ```
  Stel de auth-cookie in: document.cookie = "session=abc123; path=/"
  ```

## Tips

**Headless versus headed:** Standaard headless — sneller en CI-veilig. Wissel naar `PLAYWRIGHT_HEADLESS=false` wanneer een flow mislukt en je wilt zien wat Claude klikt.

**Viewport-grootte:** Als een pagina zich anders gedraagt bij mobiele versus desktopbreedte, specificeer deze in de prompt: `"Stel de viewport in op 375x812 voordat je de schermafbeelding maakt"`.

**Wachten op inhoud:** Dynamische pagina's die gegevens asynchroon laden kunnen `browser_get_text` bedriegen. Vraag Claude om `browser_wait_for` met een netwerk-inactief-voorwaarde te gebruiken voordat inhoud wordt geëxtraheerd.

**Playwright MCP versus Playwright-testscripts:** Gebruik deze MCP voor verkenningen, eenmalige of conversationele automatisering. Schrijf een correct Playwright-testscript wanneer je herhaalbare, versiecontroleerde tests nodig hebt die in CI bij elke push draaien.

**Multi-stap-flows:** Keten tools natuurlijk in een eenmalige prompt. Claude zal `navigate → wait → type → click → screenshot` in de juiste volgorde uitvoeren zonder dat je elke stap apart specificeert.

---
