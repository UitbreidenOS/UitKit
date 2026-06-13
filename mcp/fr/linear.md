# MCP : Linear

Gérez les problèmes, projets et cycles Linear directement depuis Claude Code — interrogez les tickets, mettez à jour le statut, créez des problèmes et exécutez les workflows de triage sans basculer vers le navigateur.

## Pourquoi vous avez besoin de ceci

Linear est l'endroit où le travail d'ingénierie est suivi. Sans MCP, Claude peut écrire du code mais n'a aucune connaissance de ce sur quoi l'équipe travaille réellement, ce qui est bloqué ou ce qui est dans le sprint actuel. Avec Linear MCP :
- Le contexte des problèmes s'écoule directement dans les sessions de code — sans copier-coller les descriptions des tickets
- La création de problèmes à partir du code (TODOs, découvertes de bugs, candidats de refactorisation) prend une invite
- La planification du sprint, le triage et les mises à jour de statut se déroulent dans le même flux que le développement
- Les rapports multi-projets (vélocité, blocages, descente du cycle) sont à une seule requête

## Installation

```bash
npm install -g @linear/mcp-server
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-linear-api-key-here"
      }
    }
  }
}
```

## Outils clés / Ce qu'ils font

- `get_issue` — récupérer un seul problème par identifiant (par exemple, ENG-123) ou UUID, y compris la description, le statut, l'assigné et les commentaires
- `create_issue` — créer un nouveau problème avec titre, description, équipe, assigné, priorité, étiquettes et cycle
- `update_issue` — mettre à jour n'importe quel champ d'un problème existant : statut, assigné, priorité, date limite, estimation
- `search_issues` — recherche texte intégral et filtrée sur les problèmes par équipe, statut, assigné, étiquette ou cycle
- `list_teams` — lister toutes les équipes de l'espace de travail avec leurs IDs et clés
- `list_projects` — lister les projets avec les données d'étape et de progression
- `list_cycles` — lister les cycles (sprints) pour une équipe avec les dates de début/fin et la progression
- `get_cycle` — obtenir un cycle spécifique avec tous ses problèmes
- `create_comment` — ajouter un commentaire à n'importe quel problème
- `list_workflow_states` — lister tous les états pour une équipe (par exemple, À faire, En cours, En révision, Fait)

## Exemples d'utilisation

```
Montrez-moi tous les bugs ouverts qui m'ont été assignés dans le cycle actuel,
triés par priorité. Incluez l'ID du problème et le statut actuel.
```

```
Analysez la base de code pour les commentaires TODO et FIXME, puis créez un problème Linear
pour chacun d'eux dans l'équipe ENG avec l'étiquette « tech-debt » et la priorité Moyen.
```

```
Déplacez le problème ENG-123 à l'état « En révision » et ajoutez un commentaire
avec ce lien PR et un résumé d'une phrase du changement.
```

```
Listez tous les problèmes du carnet en attente triés par priorité et estimation,
puis suggérez un plan de sprint qui tient dans 40 points de story.
```

```
Montrez-moi tout ce qui est marqué comme bloqué dans le cycle actuel
et listez la dépendance de blocage pour chaque problème.
```

## Authentification

1. Allez sur **linear.app → Paramètres → API** (ou lien direct : `linear.app/settings/api`)
2. Cliquez sur **Créer une nouvelle clé API** sous Clés API personnelles
3. Nommez-la (par exemple, `claude-code`) et copiez la clé — elle ne sera affichée qu'une seule fois
4. Définissez-la comme `LINEAR_API_KEY` dans le bloc de configuration ci-dessus

Pour les déploiements en équipe où plusieurs personnes ont besoin d'accès, créez plutôt une application OAuth sous **Paramètres → API → Applications OAuth** au lieu d'utiliser une clé personnelle.

## Conseils

**Appelez toujours `list_teams` en premier :** Les IDs d'équipe (UUIDs, pas seulement la clé comme `ENG`) sont requis lors de la création de problèmes. Exécutez `list_teams` une fois et notez l'UUID pour chaque équipe avec laquelle vous travaillez.

**Identifiants de problème vs UUIDs :** La plupart des outils acceptent à la fois `ENG-123` (identifiant lisible) et l'UUID complet. Utilisez l'identifiant dans les invites — c'est plus facile de référencer et de suivre.

**Les états du flux de travail varient selon l'équipe :** Les états comme « En révision » ou « QA » peuvent ne pas exister sur chaque équipe. Appelez `list_workflow_states` pour l'équipe pertinente avant de tenter de mettre à jour le statut, pour que vous connaissiez les noms et IDs d'état exacts.

**Requêtes de cycle pour le travail de sprint :** Utilisez `get_cycle` plutôt que `search_issues` quand vous voulez tout dans le sprint actuel — cela retourne l'ensemble complet de problèmes sans avoir besoin de filtrer manuellement.

**Création en masse avec prudence :** La création de nombreux problèmes en une session est rapide, mais Linear envoie des notifications pour chacun. Avertissez l'équipe ou utilisez une clé API de compte de service pour les opérations en masse.

---
