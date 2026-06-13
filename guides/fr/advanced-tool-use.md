# Utilisation avancée des outils dans l'API Claude

Quatre modèles qui réduisent les coûts en jetons et améliorent la précision pour les applications Claude API lourdes en outils. Chaque modèle résout un problème spécifique ; le tableau de décision à la fin mappe le problème au modèle.

---

## Modèle 1 : Appel d'outil programmatique (PTC)

**Ce que c'est :** au lieu que Claude appelle les outils un par un dans une boucle, Claude écrit du code d'orchestration qui appelle plusieurs outils en un seul passage d'inférence.

Quand vous avez besoin de lire 20 fichiers et extraire une valeur de chacun, l'approche standard appelle l'outil `read_file` 20 fois — 20 allers-retours, 20 messages de résultat d'outil, 20 additions au contexte. Avec PTC, Claude écrit un script Python qui appelle `read_file` dans une boucle; l'exécuteur de code le lance; vous obtenez un résultat.

**Économies de jetons :** environ 37% pour les workflows multi-outils. Pour une séquence d'outils de 3 sans PTC, vous payez le message d'appel d'outil, le résultat d'outil, et la relecture du contexte accumulé à chaque aller-retour. PTC l'effondre en un seul passage d'inférence.

### Configuration

Ajoutez `allowed_callers` à la définition de l'outil pour permettre à l'outil d'exécution de code de l'invoquer :

```python
tools = [
    {
        "name": "read_file",
        "description": "Read a file from the codebase",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"}
            },
            "required": ["path"]
        },
        "allowed_callers": ["code_execution_20250825"]  # enables PTC
    }
]
```

### Avant PTC (20 allers-retours)

```python
# Without PTC — Claude calls read_file 20 times
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools,
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude makes 20 sequential tool calls. 20 API round trips.
```

### Après PTC (1 passage d'inférence)

```python
# With PTC — Claude writes code to batch the reads
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools + [{"type": "code_execution_20250825"}],
    messages=[{"role": "user", "content": "Extract the version from each of these 20 package.json files: [list]"}]
)
# Claude writes: results = [read_file(p) for p in paths]; return [json.loads(r)['version'] for r in results]
# One code execution. One round trip.
```

### Quand utiliser

- Modèles d'outil répétitifs : lire N fichiers, extraire X de chacun, transformer Y
- Tout workflow où le même outil est appelé plus de 3 fois avec différentes entrées
- Traitement de données par lot où la logique est simple

### Quand ne pas utiliser

- Outils avec effets secondaires (écrire, supprimer, envoyer) — l'exécution de code d'outils à effet secondaire est imprévisible
- Outils qui dépendent de la sortie d'un appel d'outil antérieur quand la dépendance n'est pas connue à l'avance
- Workflows interactifs où la révision humaine est requise entre les étapes

---

## Modèle 2 : Filtrage dynamique pour les outils Web

**Ce que c'est :** avant que les résultats de recherche web ou extraction ne entrent dans la fenêtre de contexte, Claude écrit du code de filtrage qui extrait uniquement le contenu pertinent. Les pages web brutes peuvent être de 50 000–200 000 jetons ; les résultats filtrés sont généralement 1 000–5 000 jetons.

**Économies de jetons :** environ 24% moins de jetons d'entrée sur les tâches typiques de récupération. La précision sur les tâches augmentées par récupération s'améliore de 13–16 points de pourcentage parce que le modèle répond à partir d'un extrait propre et pertinent plutôt que de scanner un document complet bruyant.

### Configuration

Utilisez les nouveaux types d'outils avec l'en-tête bêta requis :

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=[
        {"type": "web_search_20260209", "name": "web_search"},
        {"type": "web_fetch_20260209", "name": "web_fetch"}
    ],
    messages=[{"role": "user", "content": "What is the current Stripe API version?"}],
    betas=["code-execution-web-tools-2026-02-09"]
)
```

### Comment fonctionne le filtrage

Avec l'en-tête bêta actif, Claude est autorisé à écrire du code de filtrage avant que le contenu web n'entre dans le contexte du message. Pour une recherche de « Stripe API version » :

1. Claude émet `web_search("Stripe API version changelog")`
2. Avant que les résultats entrent dans le contexte, Claude écrit : `[r for r in results if 'api-version' in r['url']]`
3. Seuls les résultats correspondants (3 sur 10) entrent dans le contexte
4. Pour chaque URL correspondante, Claude émet `web_fetch(url)` avec un script d'extraction : `soup.find('h1', class_='version').text`
5. Seule la chaîne extraite entre dans le contexte — pas le HTML complet

Sans filtrage dynamique, les 10 résultats de recherche et le HTML complet de chaque page extraite entreraient dans la fenêtre de contexte à chaque tour.

### Quand utiliser

- Toute application utilisant la recherche web ou l'extraction pour répondre aux questions
- Agents de recherche qui extraient plusieurs sources
- Agents de surveillance qui sondent les URL pour des données spécifiques

### Quand ne pas utiliser

- Quand vous avez besoin du contenu du document complet (résumé, analyse de page complète)
- Quand le critère de filtrage n'est pas connu jusqu'après avoir vu le contenu

---

## Modèle 3 : Chargement d'outil différé (Recherche d'outil)

**Ce que c'est :** les outils sont cachés du contexte de Claude jusqu'à ce qu'ils soient nécessaires. Claude découvre les outils disponibles en appelant un méta-outil (`MCPSearch` ou équivalent), puis charge et appelle l'outil spécifique dont il a besoin.

**Économies de jetons :** environ 85% pour les catalogues d'outils importants. Un catalogue de 50 outils ajoute environ 15 000–25 000 jetons à chaque message de la conversation. Avec chargement différé, seuls 1–3 schémas d'outil sont chargés par tour.

### Configuration

```python
tools = [
    {
        "name": "database_query",
        "description": "Query the production database",
        "input_schema": { ... },
        "defer_loading": True   # hide this tool until requested
    },
    # ... 49 more tools with defer_loading: True
]

# Set the number of tools auto-loaded from search results
import os
os.environ["ENABLE_TOOL_SEARCH"] = "auto:3"  # auto-load top 3 matches
```

Avec `ENABLE_TOOL_SEARCH=auto:3`, Claude reçoit un méta-outil `tool_search`. Quand il a besoin d'une capacité, il recherche :

```json
{"type": "tool_use", "name": "tool_search", "input": {"query": "query database"}}
```

Le harnais retourne les 3 schémas d'outil correspondants les plus importants. Claude appelle alors l'outil directement.

### Quand utiliser

- 10 ou plus d'outils chargés simultanément
- Serveurs MCP avec des catalogues larges où seuls 2–3 outils sont pertinents par requête
- Agents avec outils spécifiques au domaine utilisés uniquement dans des situations spécifiques

### Quand ne pas utiliser

- Outils utilisés à presque chaque tour (recherche de fichier, lecture) — le surcoût de recherche dépasse le coût de chargement
- Petits catalogues d'outils (moins de 10 outils) où le coût de jeton est gérable
- Applications sensibles à la latence où le aller-retour supplémentaire de recherche d'outil est inacceptable

---

## Modèle 4 : Exemples d'utilisation d'outil

**Ce que c'est :** des exemples d'utilisation concrets ajoutés directement à la définition de l'outil, au-delà du schéma JSON. Le schéma décrit la structure ; les exemples démontrent l'intention.

**Amélioration de la précision :** 72% → 90% sur les combinaisons de paramètres complexes dans les benchmarks internes. L'écart est le plus grand pour les outils avec des paramètres imbriqués, des combinaisons d'énumération, ou les interactions de champ non évidentes.

### Format

Ajoutez un tableau `input_examples` à la définition de l'outil :

```python
{
    "name": "create_alert",
    "description": "Create a monitoring alert with conditions and notification channels",
    "input_schema": {
        "type": "object",
        "properties": {
            "metric": {"type": "string"},
            "condition": {
                "type": "object",
                "properties": {
                    "operator": {"type": "string", "enum": ["gt", "lt", "eq"]},
                    "threshold": {"type": "number"},
                    "window_minutes": {"type": "integer"}
                }
            },
            "channels": {
                "type": "array",
                "items": {"type": "string", "enum": ["slack", "pagerduty", "email"]}
            },
            "severity": {"type": "string", "enum": ["info", "warning", "critical"]}
        }
    },
    "input_examples": [
        {
            "description": "Page on high error rate",
            "input": {
                "metric": "http_error_rate",
                "condition": {"operator": "gt", "threshold": 0.05, "window_minutes": 5},
                "channels": ["pagerduty", "slack"],
                "severity": "critical"
            }
        },
        {
            "description": "Ticket on slow p99 latency",
            "input": {
                "metric": "api_latency_p99_ms",
                "condition": {"operator": "gt", "threshold": 2000, "window_minutes": 15},
                "channels": ["slack"],
                "severity": "warning"
            }
        }
    ]
}
```

### Quand utiliser

- Outils avec des paramètres imbriqués complexes
- Outils avec plusieurs champs d'énumération où les combinaisons valides ne sont pas évidentes
- Outils où la description seule n'est pas suffisante pour comprendre l'utilisation correcte
- Tout outil qui a été appelé incorrectement lors des tests

### Quand ne pas utiliser

- Outils simples avec des paramètres plats et auto-documentés
- Outils où l'ajout d'exemples augmenterait le contexte sans améliorer la précision (vérifier : le modèle utilise-t-il déjà correctement cet outil ?)

---

## Combinaison des quatre modèles

Pour une efficacité maximale en jetons dans une application agentic en production :

```python
import anthropic
import os

os.environ["ENABLE_TOOL_SEARCH"] = "auto:3"

client = anthropic.Anthropic()

# Tool catalog — all deferred except the meta-tool
tools = [
    # Always-loaded tools (used every turn)
    {"type": "web_search_20260209", "name": "web_search"},
    {"type": "web_fetch_20260209", "name": "web_fetch"},

    # Deferred tools (loaded on demand via tool_search)
    {
        "name": "query_database",
        "description": "Run a read-only SQL query against the analytics database",
        "input_schema": {
            "type": "object",
            "properties": {"sql": {"type": "string"}},
            "required": ["sql"]
        },
        "defer_loading": True,
        "allowed_callers": ["code_execution_20250825"],  # PTC enabled
        "input_examples": [
            {
                "description": "Count users by plan",
                "input": {"sql": "SELECT plan, COUNT(*) FROM users GROUP BY plan"}
            }
        ]
    },
    # ... more deferred tools
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=tools + [{"type": "code_execution_20250825"}],
    messages=[{"role": "user", "content": "..."}],
    betas=["code-execution-web-tools-2026-02-09"]
)
```

Cette configuration applique :
- **PTC**: `query_database` peut être appelé en lot par l'exécuteur de code
- **Filtrage dynamique**: les outils web filtrent avant que les résultats n'entrent dans le contexte
- **Chargement différé**: `query_database` ne se charge que lorsqu'il est recherché
- **Exemples d'entrée**: l'utilisation correcte de paramètre est démontrée dans la définition de l'outil

Économies combinées sur un workflow analytique de 10 requêtes : environ 60% moins de jetons vs utilisation d'outil vanille avec le même catalogue.

---

## Tableau de décision

| Problème | Modèle |
|---------|---------|
| Même outil appelé 3+ fois dans un workflow | PTC (Modèle 1) |
| Contenu web gonflant la fenêtre de contexte | Filtrage dynamique (Modèle 2) |
| Catalogue d'outils > 10 outils; la plupart rarement utilisés | Chargement différé (Modèle 3) |
| Outil appelé incorrectement; paramètres imbriqués complexes | Exemples d'entrée (Modèle 4) |
| Précision de récupération faible | Filtrage dynamique (Modèle 2) + Exemples d'entrée (Modèle 4) |
| Grand catalogue ET outils complexes | Chargement différé (3) + Exemples d'entrée (4) |
| Coût de jeton élevé à chaque tour | Tous les quatre combinés |

---
