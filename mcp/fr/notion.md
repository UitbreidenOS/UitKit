# MCP : Notion

Lisez et écrivez les pages, bases de données et blocs Notion depuis Claude Code — recherchez votre espace de travail, créez et mettez à jour le contenu, interrogez les bases de données structurées sans quitter le terminal.

## Pourquoi vous avez besoin de ceci

Notion est l'endroit où une grande partie du contexte produit vit : spécifications, notes de réunion, journaux de décision, bases de données de projet. Sans MCP, Claude n'a accès à aucun de ceux-ci. Avec Notion MCP :
- Claude peut rechercher votre espace de travail entier et tirer le contexte pertinent dans n'importe quelle session de codage
- Les requêtes de base de données apportent des données de projet structurées (tâches, sprints, décisions) directement dans le flux de travail
- La création et la mise à jour de pages depuis Claude signifie que la documentation se fait à l'intérieur de la session, pas après
- La référence croisée des modifications de code par rapport aux spécifications Notion ou aux ADRs devient une invite unique

## Installation

```bash
npm install -g @notionhq/notion-mcp-server
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer your-notion-integration-token\", \"Notion-Version\": \"2022-06-28\"}"
      }
    }
  }
}
```

## Outils clés / Ce qu'ils font

- `search` — recherche texte intégral sur toutes les pages et bases de données auxquelles l'intégration peut accéder
- `get_page` — récupérer une page et ses propriétés par ID de page
- `create_page` — créer une nouvelle page dans une page parent ou une base de données
- `update_page` — mettre à jour les propriétés de la page (titre, statut, dates, sélections, relations)
- `get_database` — récupérer un schéma de base de données et les métadonnées
- `query_database` — interroger une base de données avec des filtres, des tris et une pagination
- `create_database_item` — ajouter une nouvelle ligne/élément à une base de données
- `update_database_item` — mettre à jour les propriétés d'un élément de base de données existant
- `append_block_children` — ajouter des blocs de contenu (paragraphes, code, listes, callouts) à n'importe quelle page

## Exemples d'utilisation

```
Interrogez ma base de données de projet et listez toutes les tâches avec le statut « En cours »,
triées par date d'échéance. Afficher l'assigné et la priorité pour chacune.
```

```
Créer une nouvelle page dans ma base de données de notes de réunion avec la date d'aujourd'hui comme titre,
et ajouter une section d'agenda avec ces trois sujets : [lister les sujets].
```

```
Rechercher dans Notion nos décisions de conception d'API du Q1 et résumer
les choix clés que nous avons faits autour de l'authentification et du versioning.
```

```
Mettre à jour le statut de la tâche « ENG-Implémenter le flux OAuth » à Fait
et définir la date d'achèvement à aujourd'hui.
```

```
Ajouter un résumé de cette session de codage à ma page de journal de développement —
incluez ce que nous avons changé, ce que nous avons reporté et les questions ouvertes.
```

## Authentification

1. Allez sur **notion.so/my-integrations** et cliquez sur **Nouvelle intégration**
2. Donnez-lui un nom, sélectionnez votre espace de travail et définissez les capacités : **Lire le contenu**, **Mettre à jour le contenu**, **Insérer le contenu**
3. Copiez le **Token d'intégration interne** — il commence par `secret_`
4. Définissez-le comme valeur de porteur `Authorization` dans le bloc de configuration ci-dessus
5. **Pour chaque page ou base de données à laquelle l'intégration doit accéder :** ouvrez-la dans Notion, cliquez sur le menu à trois points, allez à **Connexions** et ajoutez votre intégration par son nom

L'intégration ne voit que les pages explicitement partagées avec elle. Partager une page parente ne partage pas automatiquement les pages enfants — vous devez partager chacune, ou partager une page de niveau supérieur et vérifier **Inclure les sous-pages**.

## Conseils

**Trouvez les IDs de page à partir des URLs :** Les IDs de page Notion sont la chaîne hexadécimale de 32 caractères à la fin de l'URL. Utilisez `search` pour découvrir les pages par nom plutôt que de chasser manuellement les IDs.

**Les requêtes de base de données prennent en charge les filtres et les tris :** Utilisez le paramètre `filter` avec les conditions composées (et/ou) pour répliquer les mêmes vues que vous avez dans l'interface utilisateur Notion. Le schéma de filtre reflète exactement l'API de filtre Notion.

**Le limite de débit est de 3 requêtes par seconde :** Pour les opérations en masse (créer de nombreux éléments, interroger de grandes bases de données), ajoutez des retards entre les appels ou regroupez les écritures en utilisant `append_block_children` avec plusieurs blocs en un seul appel.

**Texte riche par rapport au texte brut :** La plupart des champs `create_page` et `update_page` attendent le format de tableau de texte riche de Notion, pas les chaînes brutes. En cas de doute, enveloppez le texte comme `[{"type": "text", "text": {"content": "your text"}}]`.

**Utilisez search pour l'amorçage :** Quand vous n'avez pas d'IDs, commencez toujours par `search` en utilisant un titre descriptif. Il retourne les IDs de page et les IDs de base de données que vous pouvez utiliser dans les appels suivants.

---
