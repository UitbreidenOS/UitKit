> 🇫🇷 This is the French translation. [English version](../recommended-servers.md).

# Serveurs MCP Recommandés

Un guide pratique des serveurs MCP valant la peine d'être activés dans Claude Code. Organisé par catégorie avec des estimations du coût en tokens et des conseils clairs sur quand utiliser chacun.

---

## Sensibilisation au Budget de Tokens

Chaque serveur MCP activé contribue ses descriptions d'outils à la fenêtre de contexte de Claude.

| Serveurs MCP activés | Coût approximatif en tokens |
|---------------------|----------------------------|
| 3 serveurs (~10 outils) | ~10 000 tokens |
| 10 serveurs (~30 outils) | ~30 000 tokens |
| 20 serveurs (~60 outils) | ~60 000 tokens |

Avec une fenêtre de 200k tokens, 10 MCPs actifs consomment ~15% de votre contexte avant toute conversation. Soyez sélectif. Désactivez les serveurs que vous n'utilisez pas activement.

---

## Système de Fichiers & Recherche

### `@modelcontextprotocol/server-filesystem`
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/project
```
- **Ce qu'il apporte :** Lire, écrire, lister et rechercher des fichiers avec des restrictions de chemin configurables
- **Coût en tokens :** ~2 000 tokens
- **Utiliser quand :** Vous voulez que Claude explore un répertoire de base de code au-delà du répertoire de travail actuel
- **Éviter quand :** Les outils intégrés Read/Write de Claude Code couvrent déjà votre projet

### `@modelcontextprotocol/server-brave-search` ou `tavily`
```bash
npx -y @modelcontextprotocol/server-brave-search
```
- **Ce qu'il apporte :** Recherche web depuis Claude
- **Coût en tokens :** ~1 500 tokens
- **Utiliser quand :** Les agents ont besoin d'informations actuelles (docs, actualités, versions de packages) non présentes dans les données d'entraînement
- **Éviter quand :** Vous n'avez besoin que de génération de code, pas de recherches web

---

## Bases de Données

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
- **Ce qu'il apporte :** Requêter, inspecter le schéma, lister les tables — accès DB direct depuis Claude
- **Coût en tokens :** ~3 000 tokens
- **Utiliser quand :** Exploration de schéma, rédaction de requêtes complexes, débogage de problèmes de données
- **Éviter quand :** Base de données de production — utiliser un replica en lecture seule ou une DB de dev
- **Sécurité :** Ne jamais pointer vers la DB de production. Utiliser un utilisateur en lecture seule au minimum.

### `@modelcontextprotocol/server-sqlite`
- **Ce qu'il apporte :** Identique à postgres mais pour les fichiers SQLite
- **Coût en tokens :** ~2 500 tokens
- **Utiliser quand :** Développement local avec SQLite, bases de données embarquées

---

## APIs & Services

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
- **Ce qu'il apporte :** Lire les issues, PRs, commits, fichiers depuis des dépôts GitHub
- **Coût en tokens :** ~4 000 tokens
- **Utiliser quand :** Révision de PRs, triage d'issues, récupération de contexte depuis des dépôts distants
- **Éviter quand :** Vous n'avez besoin que du contexte git local (le CLI git est plus rapide)

### `@modelcontextprotocol/server-linear`
- **Ce qu'il apporte :** Créer, mettre à jour et interroger les issues et projets Linear
- **Coût en tokens :** ~3 000 tokens
- **Utiliser quand :** Suivi des issues intégré dans le workflow de développement

### `stripe-mcp` (Stripe officiel)
```bash
npx -y @stripe/mcp --api-key sk_test_...
```
- **Ce qu'il apporte :** Créer des customers, produits, prix, sessions checkout ; interroger les paiements
- **Coût en tokens :** ~5 000 tokens
- **Utiliser quand :** Construction d'intégrations Stripe, test des flux de paiement
- **Éviter quand :** Clés Stripe de production — utiliser uniquement le mode test en développement

---

## Navigateur & Tests

### `@modelcontextprotocol/server-puppeteer`
- **Ce qu'il apporte :** Lancer un navigateur, naviguer sur des pages, cliquer sur des éléments, prendre des captures d'écran
- **Coût en tokens :** ~3 500 tokens
- **Utiliser quand :** Tests d'UI web, scraping, automatisation d'interactions navigateur
- **Éviter quand :** Tests API — surdimensionné, utiliser fetch/curl

### `@playwright/mcp`
```bash
npx -y @playwright/mcp@latest
```
- **Ce qu'il apporte :** Automatisation Playwright — plus fiable que Puppeteer pour les SPAs modernes
- **Coût en tokens :** ~4 000 tokens
- **Utiliser quand :** Rédaction de tests E2E, vérification UI, automatisation complexe de navigateur
- **Recommandé plutôt que Puppeteer** pour les applications Next.js / React

---

## IA & Raisonnement

### `@modelcontextprotocol/server-memory`
```bash
npx -y @modelcontextprotocol/server-memory
```
- **Ce qu'il apporte :** Un graphe de connaissances qui persiste entre les sessions — entités, relations, observations
- **Coût en tokens :** ~2 000 tokens
- **Utiliser quand :** Projets long-running où vous voulez que Claude se souvienne du contexte entre les sessions
- **Éviter quand :** Tâches à session unique — surcoût sans bénéfice

### `@modelcontextprotocol/server-sequential-thinking`
- **Ce qu'il apporte :** Force Claude à travers des étapes de raisonnement explicites avant de répondre
- **Coût en tokens :** ~1 500 tokens
- **Utiliser quand :** Résolution de problèmes multi-étapes complexes, décisions architecturales
- **Éviter quand :** Requêtes simples — ajoute de la latence sans bénéfice

---

## Template de Configuration

Ajouter des serveurs à `~/.claude/settings.json` (global) ou `.claude/settings.json` (projet) :

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

Utiliser des références à des variables d'environnement (`${VAR}`) plutôt que des secrets codés en dur.

---
