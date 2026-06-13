# Programmatic Tool Calling (PTC)

## Quand activer
L'utilisateur souhaite réduire l'utilisation des tokens API pour les workflows lourds en outils, mentionne l'appel d'outils programmatique, ou a un modèle où le même outil est appelé plus de 3 fois en un seul passage d'inférence.

## Quand ne PAS utiliser
- Les outils avec des effets secondaires qui ont besoin d'examen humain entre les appels (écrire, supprimer, déployer)
- Les outils nécessitant une réauthentification par appel ou des invites d'autorisation par appel
- Les appels d'outils uniques — le surcoût PTC ne vaut pas la peine en dessous de ~3 appels
- Les environnements d'exécution non-Python — le sandbox PTC est Python uniquement

## Instructions

### Ce que fait PTC
Utilisation standard d'outils : Claude appelle un outil → résultat retourné → Claude appelle l'outil suivant. Chaque aller-retour est un passage d'inférence API.

Avec PTC : Claude écrit du code d'orchestration Python qui appelle plusieurs outils en boucle, exécute dans un sandbox, et seulement la sortie stdout finale entre en contexte. Trois outils = 1 passage d'inférence au lieu de 3.

**Réduction de tokens mesurée : ~37% moins de tokens pour les workflows multi-outils.**

### Activation de PTC
Ajouter `code_execution_20250825` comme appelant autorisé dans votre définition d'outil :
```python
tools = [
    {
        "name": "read_file",
        "description": "Read a file from the filesystem",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path to read"},
            },
            "required": ["path"],
        },
        "allowed_callers": ["code_execution_20250825"],  # Enable PTC for this tool
    }
]
```

Quand PTC est activé, Claude peut choisir d'écrire du code d'orchestration au lieu d'appeler l'outil directement.

### Sandbox d'exécution
- Python uniquement
- Pas d'accès au système de fichiers par défaut (sauf si l'outil lui-même le fournit)
- Bibliothèque standard limitée — pas d'appels réseau depuis le code du sandbox
- Les résultats d'outils sont retournés en tant qu'objets Python au code du sandbox
- Seulement stdout du sandbox entre en contexte de conversation

### Quand Claude utilise PTC automatiquement
Claude sélectionne PTC quand il détecte un motif qui bénéficie du batching :
- Lire N fichiers et extraire un champ de chacun
- Exécuter la même transformation sur une liste d'entrées
- Agréger les résultats de plusieurs appels d'outils avant de répondre
- Toute boucle où un outil est appelé avec des paramètres différents à chaque itération

### Quand forcer PTC (ingénierie de prompt)
Si Claude n'utilise pas PTC pour un modèle qui en bénéficie clairement, ajouter à l'invite système :
```
When you need to call the same tool multiple times with different inputs, write Python orchestration code using code_execution_20250825 to batch the calls rather than calling the tool individually each time.
```

### Conception d'outils pour compatibilité PTC
Les outils utilisés avec PTC devraient :
- Accepter des entrées simples et sérialisables (chaînes, nombres, listes)
- Retourner une sortie propre et analysable (préférer JSON au texte libre)
- Être idempotentes (lectures, recherches) plutôt que stateful (écritures, mutations)
- Ne pas nécessiter de confirmation interactive

### Combinaison de PTC avec la mise en cache de prompts
Pour une efficacité maximale des tokens : mettre en cache les définitions d'outils (qui peuvent être volumineuses) avec `cache_control`, et activer PTC pour réduire le nombre d'allers-retours :
```python
tools = [
    # ... your tools ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"],
        "cache_control": {"type": "ephemeral"},  # Cache all tools up to here
    }
]
```

### Limitations
- PTC ne peut pas appeler les outils qui nécessitent une approbation homme-boucle au milieu de l'exécution
- Le sandbox a un timeout — les boucles très longues peuvent être coupées
- Les outils qui retournent des données binaires (images, fichiers) ne conviennent pas à l'orchestration PTC
- Le débogage est plus difficile — le code et les résultats intermédiaires ne sont pas visibles dans le contexte principal

## Exemple

Extraction de signatures de fonction à partir de 20 fichiers sources sans PTC : 20 appels d'outils `read_file`, 20 allers-retours, ~40 000 tokens de surcoût d'appel d'outil + résultat.

Avec PTC activé sur `read_file` :

Claude écrit (en interne, dans le sandbox) :
```python
files = [
    "src/api/users.ts", "src/api/orders.ts", "src/api/products.ts",
    # ... 17 more
]
signatures = []
for f in files:
    content = read_file(path=f)
    # Extract export function lines
    sigs = [line.strip() for line in content.split("\n") if line.startswith("export function")]
    signatures.extend(sigs)
print("\n".join(signatures))
```

Un passage d'inférence. Seulement les signatures extraites (pas les contenus de fichiers complets) entrent en contexte. Réduction de tokens : 37% sur ce workflow.

---
