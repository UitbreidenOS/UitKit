# Prompt Caching

## Quand activer
Utilisation de l'API Claude avec des blocs de contexte volumineux répétés — invites système, documents prépandus, grandes définitions d'outils — ou quand l'utilisateur souhaite réduire les coûts API ou la latence pour les charges de travail réutilisant le même contexte sur plusieurs appels.

## Quand ne PAS utiliser
- Les appels API uniques sans contexte répété
- Les conversations où l'invite système change à chaque demande
- Les contextes plus petits que 1024 tokens (Claude 3) ou 2048 tokens (Claude 3.5+ Haiku) — sous ces seuils, la mise en cache n'a aucun effet

## Instructions

### Comment fonctionne la mise en cache des prompts
Les points d'arrêt de cache marquent les blocs de contenu comme admissibles pour la mise en cache. Quand l'infrastructure d'Anthropic voit le même préfixe à nouveau (jusqu'au point d'arrêt), elle lit à partir du cache au lieu de retraiter.

- **Coût d'écriture en cache :** 1,25× prix du token d'entrée standard
- **Coût de lecture en cache :** 0,1× prix du token d'entrée standard
- **Point de seuil :** ~9 lectures du même contenu
- **TTL par défaut :** 5 minutes
- **TTL prolongé :** 1 heure — définir `ENABLE_PROMPT_CACHING_1H=1` comme variable d'environnement (bêta)

### Syntaxe cache_control
Ajouter `"cache_control": {"type": "ephemeral"}` au dernier bloc de contenu que vous voulez inclure dans le préfixe de cache :

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "<your large system prompt here — must be >1024 tokens to cache>",
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=[{"role": "user", "content": "What does the system prompt say about X?"}],
)
```

### Où placer les points d'arrêt

**Invite système (toujours mettre en cache si >1024 tokens) :**
```python
system=[
    {"type": "text", "text": base_instructions},          # not cached
    {"type": "text", "text": large_doc, "cache_control": {"type": "ephemeral"}},  # cache up to here
]
```

**Grand document prépandu à la conversation :**
```python
messages=[
    {
        "role": "user",
        "content": [
            {"type": "text", "text": large_reference_doc, "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": "Now answer this question about the document above: ..."},
        ],
    }
]
```

**Définitions d'outils (mettre en cache lors de l'utilisation de nombreux outils) :**
```python
tools=[
    # ... all your tool definitions ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "cache_control": {"type": "ephemeral"},  # cache everything up to and including this tool
    }
]
```

### Mise en cache multi-tour
Dans une conversation multi-tour, le tableau des messages se développe à chaque tour. Placer le point d'arrêt du cache à la fin du tableau d'outils ou de l'invite système — le tableau des messages est géré automatiquement par l'infrastructure de mise en cache d'Anthropic à mesure que la conversation se développe.

Ne pas ajouter `cache_control` à chaque message — ajouter uniquement au contenu statique volumineux en haut du contexte. Anthropic met en cache tout jusqu'au dernier point d'arrêt du préfixe.

### Mesure de l'efficacité du cache
Vérifier `usage` dans la réponse :
```python
print(response.usage)
# Usage(
#   input_tokens=850,
#   cache_creation_input_tokens=12500,   # tokens written to cache (first call)
#   cache_read_input_tokens=12500,       # tokens read from cache (subsequent calls)
#   output_tokens=200
# )
```

Une session multi-tour saine devrait montrer `cache_creation_input_tokens > 0` seulement au premier appel et `cache_read_input_tokens > 0` sur tous les appels suivants.

### Exemple de calcul de coût
Invite système : 15 000 tokens. 50 messages utilisateur traités par heure.

| Scénario | Coût par appel | Coût/heure (50 appels) |
|---|---|---|
| Sans mise en cache | 15 000 × $3/MTok | $2,25 |
| Avec mise en cache (après seuil) | 15 000 × $0,30/MTok | $0,225 |

Réduction de coût 10× pour le contexte volumineux et fréquemment réutilisé.

### Erreurs courantes
- Placer le point d'arrêt trop tôt — le contenu après le point d'arrêt est retraité à chaque appel
- Ajouter des points d'arrêt à l'intérieur du tableau de messages sur les tours courts — la taille minimale pouvant être mise en cache ne sera pas atteinte
- Oublier que le TTL du cache est de 5 minutes — un job batch de 10 minutes perdra le cache au milieu du run (utiliser le TTL prolongé)
- Utiliser la mise en cache pour le contenu unique par demande — la mise en cache n'aide que lorsque le préfixe est identique sur les appels

## Exemple

Un système de Q&A de documents traite 200 questions contre le même PDF de 80 pages par jour :

```python
# Load and cache the document once per session
doc_text = extract_text_from_pdf("report.pdf")  # ~50,000 tokens

def ask_question(question: str) -> str:
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"<document>\n{doc_text}\n</document>",
                        "cache_control": {"type": "ephemeral"},
                    },
                    {"type": "text", "text": question},
                ],
            }
        ],
    )
    return response.content[0].text

# Call 1: cache_creation_input_tokens=50000 (1.25× price)
# Calls 2-200: cache_read_input_tokens=50000 (0.1× price)
# Net savings vs no caching: ~88% on document tokens
```

---
