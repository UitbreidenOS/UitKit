# MCP : Thomson Reuters Westlaw et Practical Law

Thomson Reuters fournit un serveur MCP officiel donnant à Claude Code un accès direct à Westlaw — la base de données principales de recherche juridique aux États-Unis — et Practical Law, qui couvre les guides pratiques, les documents standards et les listes de contrôle. Nécessite un abonnement Westlaw actif. Une fois connecté, Claude peut récupérer les jurisprudences actuelles, les statuts et les réglementations plutôt que de compter sur les données d'entraînement gelées à la date limite de ses connaissances.

## Pourquoi vous avez besoin de cela

Sans MCP TR, les connaissances juridiques de Claude sont statiques. Avec cela :
- Recherchez et récupérez les jurisprudences actuelles par juridiction, tribunal et plage de dates
- Récupérez les statuts et réglementations dans leur forme actuelle et en vigueur
- Accédez aux notes pratiques Practical Law et aux modèles de documents standards
- Shepardize / KeyCite les cas pour confirmer qu'ils sont toujours valides en droit
- Générez les citations au format Bluebook
- Répondez aux questions comme : « Cette clause est-elle toujours exécutoire en vertu de la loi de New York en 2026 ? »

## Conditions préalables

- Abonnement Westlaw actif (individuel, cabinet ou entreprise)
- Clé API Thomson Reuters Developer — obtenue à partir de `developer.thomsonreuters.com`
- L'accès à l'API peut nécessiter le niveau legal.ai sur votre compte TR ; confirmez auprès de votre représentant de compte avant la configuration

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Remplacez `@thomsonreuters/westlaw-mcp@latest` par le nom exact du paquet listé sur le Portail Développeur TR — le nom ci-dessus est illustratif et peut différer du paquet publié.

## Ce qu'il expose

| Outil | Ce qu'il fait |
|---|---|
| `search_cases` | Recherche jurisprudence texte intégral avec filtres pour juridiction, tribunal et date |
| `get_case` | Récupérez l'opinion complète du cas par citation |
| `shepardize` | Vérifiez si un cas est toujours valide en droit via KeyCite |
| `search_statutes` | Recherchez les statuts fédéraux et étatiques par sujet ou citation |
| `get_statute` | Récupérez une section de statut avec annotations |
| `search_regulations` | Recherchez le CFR et les codes administratifs étatiques |
| `get_practical_law` | Récupérez les notes pratiques Practical Law et les modèles de documents |
| `search_secondary` | Recherchez les revues de droit, traités et guides pratiques |
| `format_citation` | Générez une citation au format Bluebook |

## Exemples de prompts

```
"Find Delaware Court of Chancery cases from 2022–2026 on director fiduciary duty in M&A transactions"

"Is the arbitration clause in this contract enforceable under 9 USC §2 and recent Second Circuit case law?"

"Get the Practical Law standard NDA for M&A with governing law set to New York"

"Shepardize Revlon v. MacAndrews and tell me if it is still good law"

"What are the current GDPR Article 17 obligations under EU regulation and has anything changed in 2025–2026?"
```

## Coût

Les appels d'API TR puisent dans votre quota d'API Westlaw, qui est distinct de l'utilisation de tokens Claude. Surveillez la consommation sur `developer.thomsonreuters.com/usage`. Les contrats Enterprise incluent généralement un niveau d'API groupé — confirmez votre quota avant d'exécuter des flux de travail de recherche en masse.

## Combiner avec iManage

L'association du MCP Thomson Reuters avec iManage DMS permet à Claude de récupérer les cas de précédent de Westlaw et de récupérer votre travail antérieur de la matière du DMS iManage de votre cabinet, puis de rédiger un mémo qui cite les deux sources. Configuration combinée :

```json
{
  "mcpServers": {
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/mcp-server@latest"],
      "env": {
        "IMANAGE_SERVER": "https://your-firm.imanage.work",
        "IMANAGE_CLIENT_ID": "your-client-id",
        "IMANAGE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

Avec les deux serveurs actifs, un prompt comme « Draft a memo on enforceability of MNDA liquidated damages clauses under NY law, citing relevant cases and any prior firm memos on the topic » tirera de Westlaw pour la jurisprudence actuelle et iManage pour les précédents internes simultanément.
