> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../recommended-servers.md).

# MCP Aanbevolen Servers

Een praktische gids voor MCP-servers die het waard zijn om in Claude Code in te schakelen. Georganiseerd per categorie met tokenkostraming en duidelijke richtlijnen over wanneer elke te gebruiken.

---

## Token Budget Bewustzijn

Elke ingeschakelde MCP-server draagt zijn toolbeschrijvingen bij aan het contextvenster van Claude.

| Ingeschakelde MCP-servers | Geschatte tokenkosten |
|--------------------|----------------------|
| 3 servers (~10 tools) | ~10.000 tokens |
| 10 servers (~30 tools) | ~30.000 tokens |
| 20 servers (~60 tools) | ~60.000 tokens |

Met een 200k tokenvenster verbruiken 10 actieve MCP's ~15% van je context voor elk gesprek. Wees selectief. Schakel servers uit die je niet actief gebruikt.

---

## Bestandssysteem & Zoeken

### `@modelcontextprotocol/server-filesystem`
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/project
```
- **Wat het biedt:** Bestanden lezen, schrijven, weergeven en zoeken met configureerbare padrestricties
- **Tokenkosten:** ~2.000 tokens
- **Gebruik wanneer:** Je wilt dat Claude een codebasedirectory verkent buiten de huidige werkmap
- **Vermijd wanneer:** Claude Code's ingebouwde Read/Write-tools al je project afdekken

### `@modelcontextprotocol/server-brave-search` of `tavily`
```bash
npx -y @modelcontextprotocol/server-brave-search
```
- **Wat het biedt:** Webzoeken vanuit Claude
- **Tokenkosten:** ~1.500 tokens
- **Gebruik wanneer:** Agenten actuele informatie nodig hebben (documentatie, nieuws, pakketversies) die niet in trainingsdata zit
- **Vermijd wanneer:** Je alleen codegeneratie nodig hebt, geen webzoekopdrachten

---

## Databases

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
- **Wat het biedt:** Query's uitvoeren, schema inspecteren, tabellen weergeven — directe DB-toegang vanuit Claude
- **Tokenkosten:** ~3.000 tokens
- **Gebruik wanneer:** Schema-exploratie, complexe queries schrijven, dataproblemen debuggen
- **Vermijd wanneer:** Productiedatabase — gebruik een alleen-lezen replica of dev-DB
- **Beveiliging:** Wijs nooit naar productie-DB. Gebruik minimaal een alleen-lezen gebruiker.

### `@modelcontextprotocol/server-sqlite`
- **Wat het biedt:** Hetzelfde als postgres maar voor SQLite-bestanden
- **Tokenkosten:** ~2.500 tokens
- **Gebruik wanneer:** Lokale ontwikkeling met SQLite, ingebedde databases

---

## API's & Services

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
- **Wat het biedt:** Issues, PR's, commits, bestanden lezen vanuit GitHub-repo's
- **Tokenkosten:** ~4.000 tokens
- **Gebruik wanneer:** PR's reviewen, issues triagen, context ophalen vanuit externe repo's
- **Vermijd wanneer:** Je alleen lokale git-context nodig hebt (git CLI is sneller)

### `@modelcontextprotocol/server-linear`
- **Wat het biedt:** Linear-issues en -projecten aanmaken, bijwerken en bevragen
- **Tokenkosten:** ~3.000 tokens
- **Gebruik wanneer:** Issue-tracking geïntegreerd in ontwikkelingsworkflow

### `stripe-mcp` (Stripe officieel)
```bash
npx -y @stripe/mcp --api-key sk_test_...
```
- **Wat het biedt:** Klanten, producten, prijzen, checkout-sessies aanmaken; betalingen bevragen
- **Tokenkosten:** ~5.000 tokens
- **Gebruik wanneer:** Stripe-integraties bouwen, betalingsflows testen
- **Vermijd wanneer:** Productie Stripe-sleutels — gebruik testmodus alleen in ontwikkeling

---

## Browser & Testen

### `@modelcontextprotocol/server-puppeteer`
- **Wat het biedt:** Een browser starten, pagina's navigeren, elementen klikken, schermafbeeldingen maken
- **Tokenkosten:** ~3.500 tokens
- **Gebruik wanneer:** Web-UI's testen, scrapen, browserinteracties automatiseren
- **Vermijd wanneer:** API-testen — overkill, gebruik fetch/curl

### `@playwright/mcp`
```bash
npx -y @playwright/mcp@latest
```
- **Wat het biedt:** Playwright-automatisering — betrouwbaarder dan Puppeteer voor moderne SPA's
- **Tokenkosten:** ~4.000 tokens
- **Gebruik wanneer:** E2E-tests schrijven, UI-verificatie, complexe browserautomatisering
- **Aanbevolen boven Puppeteer** voor Next.js / React-apps

---

## AI & Redenering

### `@modelcontextprotocol/server-memory`
```bash
npx -y @modelcontextprotocol/server-memory
```
- **Wat het biedt:** Een kennisgraaf die persisteert over sessies — entiteiten, relaties, observaties
- **Tokenkosten:** ~2.000 tokens
- **Gebruik wanneer:** Langlopende projecten waarbij je wilt dat Claude context onthoudt tussen sessies
- **Vermijd wanneer:** Enkelvoudige sessietaken — overhead zonder voordeel

### `@modelcontextprotocol/server-sequential-thinking`
- **Wat het biedt:** Dwingt Claude door expliciete redenerstappen voor het beantwoorden
- **Tokenkosten:** ~1.500 tokens
- **Gebruik wanneer:** Complexe meerstaps probleemoplossing, architectuurbeslissingen
- **Vermijd wanneer:** Eenvoudige queries — voegt latentie toe zonder voordeel

---

## Configuratiesjabloon

Voeg servers toe aan `~/.claude/settings.json` (globaal) of `.claude/settings.json` (project):

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

Gebruik omgevingsvariabele-verwijzingen (`${VAR}`) in plaats van hardcoded secrets.

---
