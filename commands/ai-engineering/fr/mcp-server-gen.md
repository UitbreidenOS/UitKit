---
description: Générer un serveur MCP prêt pour la production exposant des outils, des ressources ou des invites pour un domaine donné
argument-hint: "[domaine ou service à exposer, par ex. 'GitHub issues' ou 'Postgres query']"
---
Générer un serveur MCP (Model Context Protocol) prêt pour la production pour: $ARGUMENTS

**Étape 1 — Conception des capacités**

À partir du domaine dans $ARGUMENTS, énumérez ce que le serveur doit exposer parmi chaque primitive MCP:

- **Outils** — actions que le modèle peut invoquer (créer, mettre à jour, supprimer, requêter). Lister le nom, la description, le schéma d'entrée (JSON Schema) et la forme de retour.
- **Ressources** — données que le modèle peut lire (modèles de liste + URI de lecture). Lister le modèle d'URI et le type de contenu.
- **Invites** — modèles d'invites réutilisables que l'hôte peut exposer. Lister le nom, les arguments et le texte de l'invite.

N'énoncez que ce qui est approprié pour le domaine — les trois primitives ne sont pas toujours nécessaires.

**Étape 2 — Générer le serveur**

Écrire un serveur MCP Python complet utilisant le paquet `mcp` (`pip install mcp`). Exigences:

- Utiliser `mcp.server.Server` et le transport `stdio_server()`
- Enregistrer chaque outil, ressource et invite identifiés à l'étape 1
- Chaque gestionnaire d'outil doit:
  - Valider l'entrée avec les modèles Pydantic
  - Retourner `[TextContent(...)]` ou `[ImageContent(...)]` selon les besoins
  - Lever `McpError` avec un `ErrorCode` approprié en cas d'échec (ne pas retourner de chaînes d'erreur dans le contenu)
- Inclure un bloc `__main__`: `asyncio.run(main())`
- Utiliser `httpx.AsyncClient` ou le SDK pertinent pour les appels d'API sortants — pas de `requests`
- Secrets via variables d'environnement uniquement — jamais codés en dur

**Étape 3 — Extrait d'enregistrement settings.json**

Afficher le bloc JSON exact à coller dans `.claude/settings.json` (ou `~/.claude/settings.json`) pour enregistrer le serveur:

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

Écrire un `test_server.py` utilisant `mcp.client.session.ClientSession` et `stdio_client` qui:
- Se connecte au serveur via un processus secondaire
- Liste les outils, ressources et invites
- Appelle chaque outil avec une entrée minimale valide et affirme une réponse sans erreur
- S'exécute avec `pytest -xvs test_server.py`

**Résultat:** `server.py`, extrait `settings.json`, `test_server.py`. Pas de stubs `# TODO`. Pas de logique d'espace réservé.
