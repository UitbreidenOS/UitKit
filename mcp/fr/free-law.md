# MCP : Projet Free Law (CourtListener)

Le MCP CourtListener du Projet Free Law fournit des opinions judiciaires américaines, des données de dossier et des profils de juges en accès libre et ouvert. Aucun abonnement requis. La couverture s'étend aux opinions de cour de district fédérale, circuit et Cour suprême, provenant de PACER et de flux directs des tribunaux, ainsi que de nombreux tribunaux étatiques. La base de données contient actuellement plus de 8,4 millions d'opinions et est continuellement mise à jour au fur et à mesure que de nouvelles décisions sont publiées.

## Pourquoi vous avez besoin de cela

- 8,4 millions+ d'opinions judiciaires, librement accessibles sans frais par document
- Opinions de tribunal de district fédéral, circuit et Cour suprême remontant des décennies
- Données de dossier PACER — historiques de dépôt complets pour les cas fédéraux actifs et clos
- Profils de juges incluant l'historique de nomination et les dossiers de déport
- Audio des arguments oraux et transcriptions pour les cas où ils sont disponibles
- Flux en temps réel pour les nouveaux dépôts et décisions

## Installation

```bash
npm install -g @freelawproject/courtlistener-mcp
```

Ou utilisez directement le point de terminaison SSE distant dans votre configuration — aucune installation locale requise (voir la configuration ci-dessous).

## Configuration

**Local (npx) :**

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    }
  }
}
```

Clé API : inscription gratuite à `courtlistener.com/sign-in/`. L'accès anonyme fonctionne mais est limité en débit. Un compte gratuit augmente la limite substantiellement et est suffisant pour la plupart des flux de travail de recherche.

## Ce qu'il expose

| Outil | Ce qu'il fait |
|---|---|
| `search_opinions` | Recherche texte intégral à travers toutes les opinions judiciaires avec filtres |
| `get_opinion` | Récupérez le texte complet de l'opinion par ID ou citation |
| `search_dockets` | Recherchez les dossiers PACER par nom du cas, numéro ou tribunal |
| `get_docket` | Dossier complet avec toutes les entrées de dépôt et liens de documents |
| `get_judge` | Profil du juge, historique de nomination et dossier de déport |
| `search_oral_arguments` | Recherchez l'audio et les transcriptions des arguments oraux |
| `get_court_info` | Métadonnées du tribunal et détails de juridiction |
| `cite_count` | Combien de fois un cas a été cité dans les opinions ultérieures |

## Exemples de prompts

```
"Find all Second Circuit opinions on fair use in software copyright from 2018–2026"

"Get the docket for Oracle v. Google in the Federal Circuit"

"Who are the current district court judges in SDNY and when were they appointed?"

"How many times has Campbell v. Acuff-Rose been cited in circuit court opinions?"

"Find recent EDVA opinions on preliminary injunctions in trade secret cases"
```

## Combiner avec Westlaw

Pour une recherche juridique sérieuse, exécutez les deux serveurs ensemble : CourtListener pour la recherche large gratuite et le décompte des citations, MCP Westlaw pour la récupération texte intégral, la shepardisation, les statuts et les documents Practical Law. Configuration combinée :

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    },
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

Flux de travail : utilisez `search_opinions` sur CourtListener pour identifier les cas pertinents à travers une large plage de dates sans frais, puis utilisez `get_case` et `shepardize` sur Westlaw pour récupérer le texte intégral et vérifier la validité actuelle pour les cas qui importent.

## Confidentialité

Toutes les données servies par CourtListener sont des dossiers publics. Il n'y a pas de préoccupations en matière de privilège pour les requêtes de recherche. Les données de dossier PACER sont publiques, mais les téléchargements de documents complets pour les articles pas encore en cache CourtListener engagent des frais PACER standard par page (actuellement 0,10 $/page, plafonné à 3,00 $ par document). Les opinions que CourtListener a déjà récupérées et indexées sont servies gratuitement à partir de son propre stockage.
