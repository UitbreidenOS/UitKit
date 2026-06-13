# Migration vers Claude Opus 4.7

Claude Opus 4.7 introduit des modifications incompatibles à l'API Messages avec de nouvelles capacités. Trois paramètres qui acceptaient auparavant des valeurs autres que par défaut renvoient maintenant HTTP 400. Avant de mettre à jour votre ID de modèle vers `claude-opus-4-7`, auditez votre code existant pour ces modèles.

---

## Modifications incompatibles

### 1. Budget de réflexion prolongée supprimé

Opus 4.7 n'accepte plus `budget_tokens` dans la configuration de réflexion. Le modèle gère son propre budget de réflexion de manière adaptative.

**Ancien (renvoie 400 sur Opus 4.7) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=[{"role": "user", "content": "..."}]
)
```

**Nouveau :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}]
)
```

`effort` accepte `"low"`, `"medium"`, ou `"high"`. Utilisez `"high"` pour les tâches de raisonnement complexe où vous définissiez auparavant un grand `budget_tokens`. Le modèle décide combien réfléchir — l'indication `effort` influence cette décision.

---

### 2. Paramètres d'échantillonnage supprimés

`temperature`, `top_p`, et `top_k` doivent être omis ou laisser leurs valeurs par défaut. Passer des valeurs autres que par défaut renvoie HTTP 400.

**Ancien (renvoie 400 sur Opus 4.7) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    temperature=0.7,
    top_p=0.9,
    messages=[{"role": "user", "content": "..."}]
)
```

**Nouveau — supprimez complètement les paramètres :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}]
)
```

Il n'y a pas de solution de contournement pour cela. Opus 4.7 n'expose pas les commandes d'échantillonnage. Si votre cas d'usage nécessite un contrôle de température explicite, restez sur Opus 4.6 ou utilisez un modèle différent de la famille 4.7.

---

### 3. Contenu de réflexion omis par défaut

Les blocs de réflexion s'exécutent toujours et sont transmis en continu, mais le champ `thinking` dans la réponse est vide par défaut. C'est un changement par rapport au comportement d'Opus 4.6.

**Pour voir les résumés de réflexion :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    messages=[{"role": "user", "content": "..."}]
)

for block in response.content:
    if block.type == "thinking":
        print("Thinking summary:", block.thinking)
    elif block.type == "text":
        print("Response:", block.text)
```

`"display": "full"` renvoie la sortie de réflexion complète. `"display": "summarized"` renvoie une version condensée. `"display": "none"` (la valeur par défaut) l'omet. Utilisez `"summarized"` pour le débogage ; utilisez `"none"` en production pour réduire la taille de la réponse.

---

## Nouvelles capacités

### Réflexion adaptative

Le seul mode de réflexion supporté sur Opus 4.7. Désactivé par défaut — activez-le pour les tâches qui bénéficient d'un raisonnement prolongé :

```python
# Activer — laisser le modèle décider combien réfléchir
thinking={"type": "adaptive"}

# Activer avec indication d'effort
thinking={"type": "adaptive"}
output_config={"effort": "high"}

# Désactivé (par défaut)
# Omettez complètement le paramètre thinking
```

La réflexion adaptative s'active automatiquement sur les problèmes multi-étapes complexes lorsqu'elle est activée. Sur les prompts simples, elle peut utiliser peu ou pas du tout de réflexion prolongée même avec `effort: "high"` — le modèle s'adapte à la tâche.

---

### Budgets de tâche (bêta)

Un budget de jetons consultatif en boucle. Le modèle l'utilise comme ligne directrice — ce n'est pas une limite stricte, mais le modèle essaiera de terminer la tâche dans le budget.

**En-tête bêta requis :** `task-budgets-2026-03-13`

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=32000,
    output_config={
        "task_budget": {
            "type": "tokens",
            "total": 128000
        }
    },
    extra_headers={"anthropic-beta": "task-budgets-2026-03-13"},
    messages=[{"role": "user", "content": "..."}]
)
```

**Minimum :** 20 000 jetons. Les budgets inférieurs à 20k sont rejetés. Le budget est consultatif — si la tâche nécessite vraiment plus de jetons, le modèle peut le dépasser plutôt que de produire une réponse incomplète.

Utilisez les budgets de tâche lors de l'orchestration d'agents multi-étapes où la consommation incontrôlée de jetons est une préoccupation. Ne les utilisez pas comme mécanisme de contrôle de facturation — ce sont une indication comportementale, pas une limite d'application.

---

### Support d'images haute résolution

Opus 4.7 accepte des images jusqu'à 2 576 px sur le côté le plus long, avec un maximum de 3,75 mégapixels. C'est une augmentation par rapport à 1 568 px / 1,15 MP sur les modèles plus anciens.

```python
# Les tâches d'utilisation informatique bénéficient de la résolution supérieure
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": screenshot_b64
                }
            },
            {"type": "text", "text": "Click the 'Submit' button."}
        ]
    }]
)
```

La nouvelle limite de taille permet les coordonnées de pixels 1:1 pour les tâches d'utilisation informatique — vous pouvez référencer les positions exactes de l'écran sans mathématiques d'échelle.

Si vous transmettez des images plus grandes que 2 576 px, elles seront redimensionnées côté serveur. Redimensionnez-les au préalable sur le client pour éviter les frais généraux.

---

### Nouveau encodeur de jetons

Opus 4.7 utilise un nouvel encodeur de jetons qui produit 1x–1,35x plus de jetons qu'Opus 4.6 pour un contenu équivalent. Le même texte d'entrée coûte plus de jetons et la même sortie coûte plus de jetons.

**Impact sur `max_tokens` :** Si votre code existant définit `max_tokens` en fonction de la longueur de sortie attendue, augmentez-le de 35 % comme point de départ. Les réponses qui tenaient auparavant dans 4 000 jetons peuvent maintenant nécessiter jusqu'à 5 400.

```python
# Ancien — peut tronquer sur 4.7 si la sortie est lourde en jetons
max_tokens=4096

# Nouveau — ajouter ~35% de marge
max_tokens=5600
```

Exécutez votre suite d'évaluation sur un échantillon de vraies invites et comparez les nombres de jetons de sortie avant de mettre à jour toutes vos valeurs `max_tokens`.

---

## Changements de comportement (non incompatibles)

Ce ne sont pas des erreurs d'API, mais elles affecteront la qualité de sortie si vos invites dépendaient du comportement précédent.

**Suivi d'instructions plus littéral.** Opus 4.7 interprète les invites plus précisément. Les instructions vagues qui fonctionnaient auparavant peuvent produire des résultats inattendus. Soyez explicite : au lieu de « nettoyer ce code », écrivez « supprimer les variables inutilisées et ajouter des annotations de type à toutes les signatures de fonction ».

**Moins d'appels d'outils et de sous-agents par défaut.** Le modèle est plus conservateur dans l'enclenchement des sous-agents et l'appel d'outils. Si votre flux de travail dépend du modèle qui accède automatiquement aux outils, vous devrez peut-être l'instruire explicitement de le faire.

**La longueur de réponse s'adapte à la complexité de la tâche.** Les questions courtes obtiennent des réponses courtes. Si vous exigez une réponse détaillée à une question simple, instruisez le modèle d'être minutieux plutôt que de supposer qu'il le sera.

---

## Liste de contrôle de migration

- [ ] Supprimer `budget_tokens` de toutes les configurations `thinking` — remplacer par `thinking: {type: "adaptive"}`
- [ ] Supprimer `temperature`, `top_p`, `top_k` s'ils sont définis sur des valeurs autres que par défaut
- [ ] Ajouter `"display": "summarized"` à la configuration de réflexion si vous lisez les blocs de réflexion dans votre application
- [ ] Augmenter `max_tokens` d'environ 35 % pour tenir compte du nouvel encodeur de jetons
- [ ] Tester les entrées d'image : vérifier que les dimensions se situent dans 2 576 px / 3,75 MP, mettre à jour tous les calculs de coordonnées
- [ ] Mettre à jour les chaînes d'ID de modèle : `claude-opus-4-7`
- [ ] Vérifier les invites pour les instructions vagues — Opus 4.7 est plus littéral
- [ ] Vérifier toute orchestration qui repose sur l'utilisation automatique des outils — peut nécessiter une instruction explicite

---

## Utilisateurs de Claude Code

Claude Code gère la couche API pour vous. Il n'y a pas de modifications incompatibles au niveau de l'API à gérer — mettez à jour le modèle dans vos paramètres et Claude Code gère le reste.

Ce qui peut nécessiter un ajustement est votre style d'invite. L'interprétation plus littérale d'Opus 4.7 et l'utilisation des outils plus conservatrice peuvent affecter les sessions multi-étapes complexes. Si les sessions de Claude Code deviennent moins autonomes après la mise à jour du modèle, ajoutez des instructions explicites à votre CLAUDE.md : spécifiez quels outils doivent être utilisés de manière proactive, définissez ce que « minutieux » signifie pour votre base de code, et supprimez toutes les instructions permanentes ambiguës qui dépendaient du modèle pour déduire l'intention.

---
