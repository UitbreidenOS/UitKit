# MCP : Automatisation du navigateur Puppeteer

Contrôlez un vrai navigateur depuis Claude Code. Naviguez, cliquez, remplissez les formulaires, prenez des captures d'écran et grattez les pages — tout depuis votre session.

## Pourquoi vous en avez besoin

Certaines tâches nécessitent un vrai navigateur : grattage de contenu rendu JavaScript, automatisation de flux de travail sur des applications Web, test de flux d'interface utilisateur ou capture de captures d'écran. Le serveur MCP Puppeteer donne à Claude un contrôle de navigateur complet.

## Configuration

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

Définissez `PUPPETEER_HEADLESS` à `false` pour regarder le navigateur pendant qu'il s'exécute.

## Ce que Claude peut faire

```
# Capturer une page


# Grattage de données structurées
"Go to [URL] and extract all product names and prices into a JSON list"

# Remplir et soumettre des formulaires
"Navigate to our staging site, log in with test@example.com, and confirm the checkout flow works"

# Générer des PDF
"Convert https://docs.example.com/guide to a PDF"

# Tester les interactions de l'interface utilisateur
"Click the 'Get started' button and tell me what happens next"
```

## Outils disponibles

| Outil | Ce qu'il fait |
|---|---|
| `puppeteer_navigate` | Accédez à une URL |
| `puppeteer_screenshot` | Capturer une capture d'écran |
| `puppeteer_click` | Cliquez sur un élément |
| `puppeteer_fill` | Remplissez un champ de formulaire |
| `puppeteer_evaluate` | Exécutez JavaScript sur la page |
| `puppeteer_pdf` | Générez un PDF |
| `puppeteer_select` | Sélectionnez une option de liste déroulante |

## Cas d'usage

**Grattage de contenu :**
"Scrape the top 20 posts from this news site and summarise each one"

**Recherche concurrentielle :**
"Go to competitor's pricing page and extract their tier names, prices, and features"

**Test automatisé :**
"Run through our complete sign-up flow and report any errors you encounter"

**Documentation :**
"Take screenshots of each page of our onboarding flow for the user guide"

## vs. compétence Playwright

La compétence `/playwright-pro` génère le code du test Playwright. Ce serveur MCP donne à Claude un contrôle de navigateur direct pour l'automatisation à la demande — complémentaire, non concurrentiel.

## Prérequis

```bash
# Puppeteer installe Chromium automatiquement au premier lancement
# Assurez-vous que Node.js 18+ est installé
node --version
```
