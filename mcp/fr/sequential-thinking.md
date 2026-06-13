# MCP: Pensée séquentielle

Serveur de raisonnement structuré et étape par étape qui force Claude à réfléchir méthodiquement aux problèmes complexes avant de répondre, réduisant considérablement les erreurs sur les tâches multi-étapes.

## Pourquoi vous en avez besoin

Le comportement par défaut de Claude sur les problèmes difficiles est de répondre immédiatement, ce qui peut produire un raisonnement qui semble confiant mais incomplet. La Pensée séquentielle change les mécaniques :
- Chaque étape de raisonnement est explicite, numérotée et s'appuie sur la précédente
- Le modèle peut réviser les étapes antérieures s'il découvre une contradiction — le raisonnement n'est pas verrouillé
- Les décisions architecturales complexes, les chaînes de débogage et les plans de migration bénéficient de cette contrainte
- La sortie structurée est vérifiable — vous pouvez voir exactement où le raisonnement s'est déroulé et contester chaque étape

## Installation

```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

## Configuration

Ajoutez à `~/.claude.json` ou au fichier `.claude/mcp.json` du projet :

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

Aucune variable d'environnement ou clé API requise.

## Outils clés / Ce qu'il fait

**`sequentialThinking`** — l'outil unique exposé par ce serveur. Il conduit un processus de chaîne de pensée structurée.

Paramètres :
- `thought` — le contenu de l'étape de raisonnement actuelle
- `nextThoughtNeeded` — booléen ; `true` si d'autres étapes sont nécessaires, `false` quand la conclusion est atteinte
- `thoughtNumber` — l'index de l'étape actuelle (commençant à 1)
- `totalThoughts` — nombre total d'étapes estimé (peut être révisé en cours de processus)
- `isRevision` — booléen optionnel ; marque une étape comme une correction d'une étape antérieure
- `revisesThought` — optionnel ; le numéro de l'étape révisée

Le serveur gère la chaîne et retourne le raisonnement accumulé à chaque étape. Claude l'utilise en interne pour travailler sur les problèmes avant de présenter une réponse.

## Exemples d'utilisation

```
Utilisez la pensée séquentielle pour planifier la migration de notre système d'authentification
de JWT aux tokens basés sur les sessions. Considérez la stratégie de restauration,
les options de stockage des sessions et la compatibilité rétroactive.
```

```
Réfléchissez étape par étape : ce service devrait-il être un microservice séparé
ou un module dans le monolithe ? Considérez la taille de l'équipe, la fréquence de déploiement,
le couplage des données et l'isolation des défaillances.
```

```
Pensée séquentielle : quels sont tous les cas limites que nous devons gérer
pour le flux de traitement du webhook de paiement ? Incluez la logique de retry,
l'idempotence, les défaillances partielles et le décalage d'horloge.
```

```
Parcourez les étapes de débogage pour ce test intermittent qui n'apparaît que dans CI.
Commencez par ce que nous savons et raisonnez sur ce qui pourrait différer
entre les environnements locaux et CI.
```

```
Utilisez la pensée séquentielle pour examiner ce changement de schéma de base de données
et identifier chaque système en aval qui devra être mis à jour.
```

## Authentification

Aucune authentification requise. La Pensée séquentielle est un processus local — elle s'exécute entièrement sur votre machine et n'effectue aucun appel API externe. La seule activité réseau dans votre session est les appels API normaux de Claude.

## Conseils

**Meilleurs cas d'utilisation :** Décisions architecturales, débogage complexe, planification de migration, analyse des risques, et toute tâche où « qu'est-ce que j'oublie ? » est une préoccupation réelle. La sortie structurée facilite le repérage des lacunes.

**S'associe avec des invites explicites :** Combinez avec des expressions comme « réfléchissez étape par étape avant de répondre » ou « considérez tous les cas limites » pour un effet maximal. Le serveur applique la structure ; votre invitation guide le raisonnement.

**Compromis de latence :** La pensée séquentielle ajoute 2–5 secondes par chaîne de raisonnement selon la complexité. Réservez-la pour les problèmes où la correction compte plus que la vitesse — ne l'utilisez pas pour les recherches simples ou les tâches monoétapes.

**Les étapes de révision sont précieuses :** Quand Claude marque une étape comme une révision, prêtez attention. Cela signifie que le raisonnement a découvert une erreur ou une contradiction en cours de chaîne. Ce sont souvent les insights les plus importants.

**Sortie lisible :** Demandez à Claude de présenter la chaîne de raisonnement finale sous forme de liste numérotée une fois l'outil terminé. La sortie brute de l'outil est du JSON structuré — la version reformatée est plus facile à examiner et à partager.

**Pas un substitut à la connaissance du domaine :** La Pensée séquentielle améliore la structure et l'exhaustivité du raisonnement. Elle n'ajoute pas d'informations que Claude ne possède pas. Si le problème nécessite des données externes actuelles, associez-le à la recherche web ou à des outils de récupération.

---
