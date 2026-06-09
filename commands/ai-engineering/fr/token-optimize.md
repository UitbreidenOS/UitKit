---
description: Auditez un prompt ou un pipeline LLM pour les gaspillages de tokens et appliquez des réductions ciblées
argument-hint: "[prompt file, chain file, or code path]"
---
Auditez le prompt ou le pipeline situé à $ARGUMENTS pour les inefficacités de tokens et produisez une version optimisée.

Lisez tous les chemins de fichier fournis. Si l'argument est un répertoire, scannez les fichiers `.py`, `.ts`, `.md` contenant des chaînes de prompt ou des sites d'appel LLM.

**Dimensions d'audit — vérifiez chacune :**

**1. Verbosité du prompt**
- Phrases de remplissage qui ajoutent des tokens sans ajouter de contrainte (« As an AI language model », « Of course! », « Certainly »)
- Instructions répétées qui apparaissent dans le message système et le message utilisateur
- Exemples redondants qui couvrent des cas identiques
- Instructions en prose qui pourraient être une liste à puces avec la moitié des tokens

**2. Mauvaise utilisation de la fenêtre contextuelle**
- Document complet transmis quand seule une section est nécessaire — signalisez avec les économies estimées
- Historique de chat inclus littéralement quand un résumé suffirait
- Contenu dupliqué : même texte inclus deux fois sous des clés différentes

**3. Opportunités de mise en cache**
- Identifiez les segments de prompt statiques (system prompt, contexte statique, exemples few-shot) qui devraient utiliser `cache_control: {"type": "ephemeral"}` sur l'API Anthropic
- Signalez si le segment admissible au cache est < 1024 tokens (en dessous du seuil de cache minimum — aucun bénéfice)
- Affichez le tableau de messages restructuré avec les blocs de cache placés correctement

**4. Longueur de sortie**
- `max_tokens` est-il défini ? Si ce n'est pas le cas, signalez-le comme un risque de coût illimité
- Le prompt demande-t-il une explication quand seules les données structurées sont nécessaires ?
- Un format de sortie plus court (JSON vs prose, code seul vs code+explication) réduirait-il le coût de génération ?

**5. Adéquation du modèle**
- La tâche utilise-t-elle `claude-sonnet-4-6` ou `claude-opus-4-7` pour un travail que `claude-haiku-4-5-20251001` peut gérer à un coût 10x inférieur ?
- Classifiez la complexité de la tâche : extraction/classification simple → Haiku ; raisonnement/génération → Sonnet ; multi-étapes complexes → Opus

**Format de sortie :**

```
## Token audit summary
| Issue | Location | Est. token impact | Priority |
|-------|----------|-------------------|----------|
| ...   | ...      | ...               | H/M/L    |

## Optimized prompt / chain
<full rewritten version with changes applied>

## Caching configuration
<message array snippet showing cache_control placement, if applicable>

## Estimated savings
Before: ~N tokens/call  →  After: ~M tokens/call  (~X% reduction)
At 1000 calls/day on [model]: $Y/month savings
```

Appliquez tous les correctifs haute priorité directement dans la sortie. Expliquez les éléments de priorité moyenne/basse mais ne les appliquez pas sans demander.
