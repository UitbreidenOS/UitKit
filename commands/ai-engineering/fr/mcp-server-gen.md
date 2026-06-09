---
description: Générer un serveur MCP entièrement câblé exposant des outils, ressources ou prompts pour un domaine donné
argument-hint: "[domain or service to expose, e.g. 'GitHub issues' or 'Postgres query']"
---
Générer un serveur MCP (Model Context Protocol) prêt pour la production pour : $ARGUMENTS

**Étape 1 — Conception des capacités**

À partir du domaine dans $ARGUMENTS, énumérez ce que le serveur doit exposer à travers chaque primitive MCP :

- **Outils** — actions que le modèle peut invoquer (créer, mettre à jour, supprimer, interroger). Listez le nom, la description, le schéma d'entrée (JSON Schema) et la forme de retour.
- **Ressources** — données que le modèle peut lire (motifs de liste et URI de lecture). Listez le modèle d'URI et le type de contenu.
- **Prompts** — modèles de prompt réutilisables que l'hôte peut afficher. Listez le nom, les arguments et le texte du prompt.

Énoncez uniquement ce qui convient au domaine — les trois primitives ne sont pas toujours nécessaires.

**Étape 2 — Générer le serveur**

Écrivez un serveur MCP Python complet en utilisant le package `mcp` (`pip install mcp`). Conditions requises :

- Utilisez `mcp.server.Server` et le transport `stdio_server()`
- Enregistrez chaque outil, ressource et prompt identifiés à l'étape 1
- Chaque gestionnaire d'outil doit :
  - Valider l'entrée avec des modèles Pydantic
  - Retourner `[TextContent(...)]` ou `[ImageContent(...)]` selon le cas
  - Lever `McpError` avec un `ErrorCode` approprié en cas d'échec (ne pas renvoyer les chaînes d'erreur dans le contenu)
- Inclure un bloc `__main__` : `asyncio.run(main())`
- Utiliser `httpx.AsyncClient` ou le SDK approprié pour les appels API sortants — pas de `requests`
- Secrets via variables d'environnement uniquement — jamais codés en dur

**Étape 3 — extrait d'enregistrement settings.json**

Montrez le bloc JSON exact à coller dans `.claude/settings.json` (ou `~/.claude/settings.json`) pour enregistrer le serveur :

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "python",
      "args": ["path/to/server.py"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**Étape 4 — Test de fumée**

Écrivez un `test_server.py` en utilisant `mcp.client.session.ClientSession` et `stdio_client` qui :
- Se connecte au serveur via un sous-processus
- Liste les outils, ressources et prompts
- Appelle chaque outil avec une entrée valide minimale et affirme une réponse sans erreur
- S'exécute avec `pytest -xvs test_server.py`

**Résultat :** `server.py`, extrait `settings.json`, `test_server.py`. Pas de stubs `# TODO`. Pas de logique d'espace réservé.
