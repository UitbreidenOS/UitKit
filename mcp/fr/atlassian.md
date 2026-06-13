# MCP : Atlassian

Connectez Claude Code à Jira et Confluence. Lisez les tickets, mettez à jour le statut des problèmes, écrivez de la documentation, exécutez des requêtes JQL et liez les commits aux problèmes, sans ouvrir un navigateur ni quitter votre flux de développement.

## Pourquoi vous avez besoin de ceci

La gestion de projet et la documentation vivent dans Atlassian, mais le changement de contexte entre Jira, Confluence et votre éditeur tue la fluidité. Avec Atlassian MCP :
- La planification de sprint, le triage des tickets et les mises à jour de statut se font dans la même session que vos modifications de code
- Claude peut lier directement ce qu'il vient de créer au ticket Jira qui l'a demandé
- La documentation Confluence reste synchronisée avec l'implémentation car Claude peut écrire les deux à la fois
- Les requêtes JQL vous permettent de découper les données de sprint, de trouver des blocages ou d'auditer la charge de travail sans charger l'interface du tableau
- Les notes de version, les résumés rétro et les documents d'architecture sont générés à partir de données de tickets réelles, pas de la mémoire

## Installation

Installez via le package officiel MCP d'Atlassian à partir du portail développeur Atlassian ou npm :

```bash
npm install -g @atlassian/mcp
```

Si le package est disponible via téléchargement direct à partir du portail développeur Atlassian, suivez l'installateur spécifique à la plateforme et notez le chemin binaire pour le bloc de configuration ci-dessous.

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp"],
      "env": {
        "ATLASSIAN_API_TOKEN": "your-atlassian-api-token",
        "ATLASSIAN_EMAIL": "you@yourcompany.com",
        "ATLASSIAN_BASE_URL": "https://your-org.atlassian.net"
      }
    }
  }
}
```

Remplacez `your-org` par votre véritable sous-domaine Atlassian.

## Outils clés

**Jira**

- `get_issue` — récupérer un problème Jira avec les détails complets : description, commentaires, statut, assigné, problèmes liés
- `create_issue` — créer un nouveau ticket avec type, résumé, description, assigné, étiquettes et priorité
- `update_issue` — mettre à jour n'importe quel champ d'un problème existant
- `search_issues` — exécuter une requête JQL et retourner les problèmes correspondants
- `get_project` — récupérer les métadonnées du projet et la configuration du tableau
- `add_comment` — ajouter un commentaire à n'importe quel problème
- `transition_issue` — déplacer un problème dans le flux de travail (par exemple, À faire → En cours → Fait)
- `get_sprint` — obtenir tous les problèmes du sprint actuel ou spécifié

**Confluence**

- `get_page` — récupérer une page Confluence par ID ou titre avec le contenu complet du corps
- `create_page` — créer une nouvelle page dans un espace spécifié
- `update_page` — mettre à jour le contenu d'une page existante
- `search_content` — recherche texte intégral sur tous les espaces Confluence

## Exemples d'utilisation

```
Trouvez tous les tickets du sprint actuel qui me sont assignés et résumez
ce qu'il reste à faire, groupé par statut.
```

```
Je viens de corriger PROJ-123 — déplacez-le à Fait et ajoutez un commentaire
avec un lien vers la PR #456 et un résumé d'une phrase de la correction.
```

```
Recherchez dans Confluence notre documentation sur l'architecture d'authentification
et résumez les décisions de conception clés et les questions ouvertes.
```

```
Recherchez dans la base de code tous les commentaires TODO, puis créez un ticket Jira
pour chacun d'eux dans le projet TECH, assigné à moi, avec le chemin de fichier
et le numéro de ligne dans la description.
```

```
Générez les notes de version à partir de tous les tickets passés à Fait dans le
dernier sprint et créez une nouvelle page Confluence dans l'espace Engineering
intitulée « Notes de version — Sprint 42 ».
```

## Authentification

1. Connectez-vous à votre compte Atlassian et allez à **Paramètres du compte → Sécurité → Tokens API**
2. Cliquez sur **Créer un token API**, donnez-lui un label et copiez la valeur immédiatement (elle ne sera pas affichée à nouveau)
3. Définissez les trois variables d'environnement requises :
   - `ATLASSIAN_API_TOKEN` — le token que vous venez de copier
   - `ATLASSIAN_EMAIL` — l'adresse email de votre compte Atlassian
   - `ATLASSIAN_BASE_URL` — l'URL de votre instance, par exemple `https://acme.atlassian.net`
4. Le token utilise l'authentification HTTP Basic : e-mail comme nom d'utilisateur, token comme mot de passe

**OAuth vs token API :** Les tokens API sont plus simples et suffisants pour un usage personnel ou en petite équipe. Utilisez Atlassian OAuth 2.0 (3-legged) si vous construisez une intégration côté serveur qui agit au nom de plusieurs utilisateurs.

## Conseils

**Syntaxe JQL :** `search_issues` accepte toute JQL valide. Modèles utiles :
- Sprint actuel : `sprint in openSprints() AND assignee = currentUser()`
- Blocages : `issueType = Bug AND priority = Highest AND status != Done`
- Modifications récentes : `updated >= -7d AND project = PROJ ORDER BY updated DESC`

**Pagination :** Les résultats JQL volumineux sont paginés. Si vous avez besoin de tous les résultats, dites à Claude de récupérer les pages suivantes en utilisant le décalage `startAt` jusqu'à ce que le total soit épuisé.

**IDs de page Confluence :** L'ID de page apparaît dans l'URL Confluence en tant que `/pages/123456789/`. Utilisez-le lors de l'appel de `get_page` ou `update_page` pour la précision — les recherches basées sur le titre peuvent être ambiguës dans les grands espaces.

**Combinaison de Jira et Confluence :** Les flux de travail les plus puissants impliquent les deux. Récupérez les tickets de sprint avec `search_issues`, résumez le travail et écrivez la sortie dans une page Confluence avec `create_page` — tout dans une seule invite.

**Ne pas commiter les identifiants :** Gardez `ATLASSIAN_API_TOKEN` dans votre `~/.claude.json` global, pas un `.claude/mcp.json` au niveau du projet qui pourrait être commité au contrôle de version.

---
