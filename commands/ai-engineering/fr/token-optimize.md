---
description: Auditer une invite ou un pipeline LLM pour le gaspillage de tokens et appliquer des réductions ciblées
argument-hint: "[fichier d'invite, fichier de chaîne, ou chemin de code]"
---
Auditez l'invite ou le pipeline à $ARGUMENTS pour les inefficacités de tokens et produisez une version optimisée.

Lisez tous les chemins de fichiers fournis. Si l'argument est un répertoire, scannez les fichiers `.py`, `.ts`, `.md` contenant des chaînes d'invite ou des sites d'appel LLM.

**Dimensions d'audit — vérifiez chacune :**

**1. Verbosité de l'invite**
- Les phrases de remplissage qui ajoutent des tokens sans ajouter de contrainte (« En tant que modèle de langage IA », « Bien sûr! », « Certainement »)
- Les instructions répétées qui apparaissent à la fois dans le message système et dans le message utilisateur
- Les exemples redondants qui couvrent des cas identiques
- Les instructions en prose qui pourraient être une liste à puces avec la moitié des tokens

**2. Mauvais usage de la fenêtre contextuelle**
- Le document complet transmis alors que seule une section est nécessaire — signalez avec les économies estimées
- L'historique de chat inclus tel quel alors qu'un résumé suffirait
- Contenu dupliqué : le même texte inclus deux fois sous des clés différentes

**3. Opportunités de mise en cache**
- Identifiez les segments d'invite statiques (invite système, contexte statique, exemples few-shot) qui devraient utiliser `cache_control: {"type": "ephemeral"}` sur l'API Anthropic
- Signalez si le segment éligible au cache est < 1024 tokens (sous le seuil de cache minimum — aucun bénéfice)
- Montrez le tableau de messages restructuré avec les blocs de cache placés correctement

**4. Longueur de la sortie**
- `max_tokens` est-il défini? Si non, signalez comme un risque de coût illimité
- L'invite demande-t-elle une explication alors que seules des données structurées sont nécessaires?
- Un format de sortie plus court (JSON vs prose, code seul vs code+explication) réduirait-il le coût de génération?

**5. Ajustement du niveau de modèle**
- La tâche utilise-t-elle `claude-sonnet-4-6` ou `claude-opus-4-7` pour un travail que `claude-haiku-4-5-20251001` peut gérer à un coût 10 fois inférieur?
- Classifiez la complexité de la tâche : extraction/classification simple → Haiku; raisonnement/génération → Sonnet; multi-étapes complexes → Opus

**Format de sortie :**

```
## Résumé de l'audit de tokens
| Problème | Localisation | Impact estimé de tokens | Priorité |
|----------|--------------|-------------------------|----------|
| ...      | ...          | ...                     | H/M/L    |

## Invite/chaîne optimisée
<version entièrement réécrite avec les modifications appliquées>

## Configuration du cache
<extrait du tableau de messages montrant le placement de cache_control, le cas échéant>

## Économies estimées
Avant : ~N tokens/appel  →  Après : ~M tokens/appel  (~X% réduction)
À 1000 appels/jour sur [modèle] : $Y/mois d'économies
```

Appliquez directement tous les correctifs de haute priorité dans la sortie. Expliquez les éléments de priorité moyenne/basse mais ne les appliquez pas sans demander.
