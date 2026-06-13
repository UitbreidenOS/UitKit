# Mode de Réflexion Étendue (Extended Thinking)

Comment utiliser les capacités de chaîne de raisonnement interne de Claude — quand l'activer, comment contrôler le budget de tokens, et comment éviter de payer pour du temps de réflexion dont vous n'avez pas besoin.

---

## Qu'est-ce que la réflexion étendue

La réflexion étendue donne à Claude un brouillon qu'il utilise avant de produire une réponse. Le contenu de la réflexion est une chaîne de raisonnement — Claude travaille à travers le problème étape par étape avant de s'engager sur une réponse. Vous voyez la sortie de la réflexion dans la réponse (sous forme de bloc `thinking`), et la réponse finale reflète ce raisonnement.

C'est structurellement différent de la génération standard. En mode standard, Claude produit des tokens de gauche à droite, et chaque token est validé au fur et à mesure de sa génération. En mode réflexion, Claude alloue d'abord un budget de tokens internes pour raisonner à travers le problème, puis synthétise une réponse finale à partir de ce raisonnement. La réponse finale tend à être plus précise, plus complète, et moins susceptible de faire une erreur évidente précoce sur laquelle il doublerait.

Les compromis clés :

| Propriété | Mode standard | Réflexion étendue |
|---|---|---|
| Latence | Faible (premier token rapide) | Plus élevée (réflexion d'abord) |
| Coût | Tokens de sortie uniquement | Tokens de réflexion + tokens de sortie |
| Précision sur tâches complexes | Ligne de base | Significativement meilleure |
| Précision sur tâches simples | Ligne de base | Marginalement meilleure, rarement utile |
| Cohérence de réponse | Bonne | Meilleure sur tâches multi-étapes |
| Streaming | Immédiat | Les blocs de réflexion se streament séparément |

La réflexion étendue n'est pas une amélioration magique — elle échange le coût et la latence pour la précision sur des tâches qui requièrent du raisonnement délibéré. Utilisez-la quand la complexité du raisonnement justifie le compromis.

---

## Support des modèles

La réflexion étendue est disponible sur :

| Modèle | Support réflexion | Notes |
|---|---|---|
| Claude Opus 4.7 | Support complet | Qualité de raisonnement la plus élevée; coût le plus élevé |
| Claude Sonnet 4.6 | Support complet | Meilleur ratio coût/performance pour la plupart des tâches |
| Claude Haiku 3.5 | Non supporté | Utilisez pour les tâches rapides et peu coûteuses sans réflexion |
| Modèles antérieurs | Non supporté | Opus 4 et versions antérieures ne supportent pas `thinking` |

Pour la plupart des cas d'usage en production, Sonnet 4.6 avec réflexion activée surpasse Opus 4 à coût inférieur. Réservez Opus 4.7 avec budget de réflexion maximum pour les tâches les plus difficiles — conception d'architecture sous contraintes complexes, vérification de preuves, correction d'algorithmes à travers les cas limites.

---

## Activation de la réflexion étendue

### Claude Code : commande `/effort`

Dans une session Claude Code, le paramètre `/effort` contrôle le mode réflexion :

```
/effort low       # Mode standard — pas de réflexion étendue
/effort medium    # Réflexion légère; adapté aux tâches modérément complexes
/effort high      # Réflexion complète activée; ~budget de 16K tokens de réflexion
/effort max       # Budget de réflexion maximum; utilisez pour les problèmes les plus difficiles
```

`/effort` est limité à la session. Le définir une fois s'applique à tous les tours suivants jusqu'à ce que vous le changiez ou démarriez une nouvelle session.

**Comportement à chaque niveau :**

| Niveau | Réflexion activée | Budget de tokens approximatif | Cas d'usage |
|---|---|---|---|
| `low` | Non | 0 | Boilerplate, éditions simples, lookups |
| `medium` | Parfois | ~4,000 | Revue de code, refactors modérés |
| `high` | Oui | ~16,000 | Logique complexe, décisions architecturales |
| `max` | Oui | ~32,000+ | Problèmes de niveau recherche, preuves, conception profonde |

En pratique, `high` couvre la majorité des tâches où la réflexion ajoute de la valeur. `max` est pour les problèmes où vous avez vraiment besoin que Claude explore plusieurs stratégies de solution avant de s'engager.

**Vérifier le niveau d'effort actuel :**

```bash
# Le niveau /effort actuel est affiché dans la barre d'état de la session.
# Pour réinitialiser au mode par défaut (mode standard):
/effort low
```

### API : paramètre `thinking`

Lors de l'appel de l'API directement, passez un bloc `thinking` dans la requête :

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "thinking",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Concevez un limiteur de débit distribué qui traite 1M RPS avec une latence p99 sous-milliseconde. Considérez Redis, token buckets, sliding windows, et protocoles gossip. Justifiez chaque compromis."
    }
  ]
}
```

**Règles pour `budget_tokens` :**

- Minimum : `1024` — tout ce qui est inférieur est rejeté
- Plage typique : `8,000–16,000` pour la plupart des tâches complexes
- Plage haute complexité : `16,000–32,000`
- Plafond dur : dépend du modèle; Opus 4.7 supporte jusqu'à `32,000+`; vérifiez la documentation du modèle pour les limites actuelles
- `budget_tokens` doit être inférieur à `max_tokens`

Claude peut utiliser moins de tokens que le budget. Le budget est un plafond, pas une garantie.

---

## La réponse de l'API : blocs de réflexion

Quand la réflexion est activée, la réponse contient un bloc `thinking` avant le bloc de texte :

```json
{
  "id": "msg_01XFDUDYJgAACTu2zCjM9e64",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "thinking",
      "thinking": "Travaillons systématiquement à travers la conception du limiteur de débit. La contrainte clé est 1M RPS avec une latence p99 sous-milliseconde...\n\nOption 1: Redis avec token bucket...\nPros: Simple, largement compris\nCons: Redis devient un goulot d'étranglement à 1M RPS — exécution de commandes single-threaded, la latence RTT du réseau ajoute de la latence...\n\nOption 2: Fenêtre glissante in-process avec synchronisation gossip...\n[Claude continue à raisonner à travers les options, puis synthétise]\n\nConclusion: Approche hybride — compteurs in-process avec synchronisation gossip asynchrone pour la coordination inter-nœuds..."
    },
    {
      "type": "text",
      "text": "## Conception du Limiteur de Débit Distribué\n\nPour 1M RPS avec p99 sous-milliseconde, Redis seul est insuffisant comme magasin de compteurs principal..."
    }
  ],
  "usage": {
    "input_tokens": 147,
    "output_tokens": 2341,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  }
}
```

Le champ `thinking` est le contenu du brouillon brut. Il est lisible par l'humain mais pas la réponse polie — attendez-vous à du langage exploratoire, des impasses que Claude abandonne, et des conclusions provisoires révisées en cours de réflexion. Le bloc `text` final est la réponse réelle.

---

## Modèle de coût

Les tokens de réflexion sont facturés au même tarif que les tokens de sortie. Ils ne sont pas remisés.

```
Coût total = (input_tokens × taux_input) + (thinking_tokens × taux_output) + (output_tokens × taux_output)
```

**Exemple au tarif Sonnet 4.6 (illustratif, vérifiez les tarifs actuels sur anthropic.com) :**

| Composant | Tokens | Tarif (par 1M) | Coût |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Thinking | 8,000 | $15.00 | $0.12 |
| Output | 800 | $15.00 | $0.012 |
| **Total** | | | **$0.1335** |

Sans réflexion :

| Composant | Tokens | Tarif (par 1M) | Coût |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Output | 800 | $15.00 | $0.012 |
| **Total** | | | **$0.0135** |

La réflexion étendue est environ 10× plus chère sur cet exemple de tâche. Ce multiplicateur est le bon ordre de grandeur pour l'utilisation typique. Quand vous résolvez un problème difficile une fois, ce coût est trivial. Quand vous l'appelez en boucle sur des milliers d'entrées qui ne requièrent pas de raisonnement, c'est une régression significative.

**Les tokens de réflexion ne bénéficient pas du cache de prompt.** Les tokens d'input avant le bloc de réflexion peuvent être mis en cache, mais la sortie de réflexion elle-même ne peut pas l'être. Structurez les requêtes pour que les prompts système stables et le contexte soient positionnés pour bénéficier du caching avant le bloc `thinking`.

---

## Streaming avec réflexion

Lors du streaming d'une réponse avec réflexion activée, les blocs `thinking` et `text` se streamént séparément. Le bloc de réflexion se termine généralement avant que le bloc de texte ne commence dans la plupart des clients.

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "thinking",
        "budget_tokens": 8000
    },
    messages=[{"role": "user", "content": "..."}]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "thinking":
                print("[Thinking started]")
            elif event.content_block.type == "text":
                print("[Response started]")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                # Tokens de réflexion streamant bruts
                pass  # Supprimez si vous ne voulez pas l'afficher
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

Dans les produits orientés utilisateur, vous pouvez masquer complètement le bloc de réflexion et ne streamer que le bloc `text`. La latence jusqu'au premier token de texte est plus élevée avec réflexion activée — calibrez vos états de chargement UX en conséquence.

---

## Mode standard vs réflexion : même prompt, sorties différentes

**Prompt :** "Une fonction s'exécute en O(n log n) cas moyen. Vous devez traiter 10M d'éléments en moins de 2 secondes sur une machine avec 8 cœurs. C'est-ce faisable ? Quels sont les modes de défaillance ?"

**Réponse en mode standard (abrégée) :**

> O(n log n) sur 10M d'éléments est environ 10M × 23 ≈ 230M d'opérations. À 1 milliard d'opérations/seconde par cœur, c'est 0,23 secondes single-threaded. Avec 8 cœurs vous êtes bien dans les 2 secondes. Modes de défaillance principaux : bande passante mémoire, cache misses, et surcharge de synchronisation des threads.

Correct au niveau surface. Manque plusieurs modes de défaillance significatifs.

**Réponse en mode réflexion (abrégée, à partir du bloc de réflexion réel) :**

*Réflexion :* "Soyons prudents ici. O(n log n) cas moyen — quel est le cas pire ? Non spécifié. Quel est le facteur constant ? Non spécifié. Motif d'accès mémoire ? Non spécifié. 'Fonction' — est-ce un tri basé sur la comparaison ? Algorithme de graphe ? Le cadrage est ambigu..."

*Réponse :*

> La faisabilité dépend des facteurs que la question laisse ouverts. Voici ce que vous devez clarifier avant de vous engager sur cette conception :
>
> **Les mathématiques au niveau surface :** 10M × log₂(10M) ≈ 230M d'opérations. À des IPC réalistes sur matériel moderne (~2–4 opérations effectives/cycle à 3GHz), vous avez environ 6–12 milliards de "slots d'opération" par seconde par cœur. Single-threaded, c'est trivialement rapide. Mais ce calcul cache les vrais risques.
>
> **Modes de défaillance qui vous mordront réellement :**
>
> 1. **Facteur constant :** O(n log n) avec une grande constante (par ex., accès mémoire non cache-friendly) peut être 10–100× plus lent que la limite théorique inférieure. Un tri avec bonne localité de cache bat un algorithme théoriquement équivalent avec pointer chasing à chaque fois.
>
> 2. **Dégénérescence cas pire :** Si le cas moyen est O(n log n) mais le cas pire est O(n²) (par ex., quicksort naïf sur entrée adversariale), les données de production finiront par l'atteindre.
>
> 3. **Surcharge de parallélisation :** Fractionner 10M d'éléments à travers 8 cœurs introduit la synchronisation aux points de fusion. Pour les algorithmes où l'étape de fusion est O(n), vous pouvez perdre la plupart de votre gain de parallélisation.
>
> 4. **Plafond de bande passante mémoire :** À 10M d'éléments × 8 bytes chacun = 80MB. C'est adapté à L3 sur la plupart des puces serveur, mais tout juste. Si le working set ne s'adapte pas, la bande passante mémoire (pas le calcul) devient le goulot d'étranglement, et le nombre de cœurs cesse d'aider.
>
> 5. **Le budget de 2 secondes est la mauvaise métrique :** La latence p99 ou p999 est ce pour lequel vous serez paused. Si la moyenne est 1,8 secondes mais p99 est 4,1 secondes, vous dépassez le budget quand ça compte.

La réponse en mode réflexion surface ce que la question demandait réellement — pas seulement un calcul, mais une analyse de faisabilité complète. C'est le motif où la réflexion étendue paie : les problèmes où une réponse superficielle est techniquement correcte mais opérationnellement inutile.

---

## Quand utiliser la réflexion étendue

Utilisez la réflexion étendue quand la tâche a une ou plusieurs de ces propriétés :

**Chaînes de dépendances multi-étapes.** La correction de chaque étape dépend d'une étape précédente. Une erreur à l'étape 2 se propage et corrompt les étapes 3–10. La génération linéaire est fragile ici; le mode réflexion permet à Claude de vérifier les étapes intermédiaires avant de s'engager.

**Exigences ambiguës ou sous-spécifiées.** Quand la question contient des suppositions cachées ou des interprétations valides multiples, le mode réflexion laisse Claude énumérer les interprétations et choisir délibérément plutôt que de s'engager sur la première lecture plausible.

**Correction mathématique ou logique.** Vérification de preuve, analyse de correction d'algorithme, bornes de complexité. Ceux-ci requièrent de vérifier des cas multiples et suivre des contraintes — la génération linéaire tend à sauter les cas limites.

**Décisions architecturales avec compromis non-évidents.** Conception de système, choix de modèle de données, conception de contrat API. La bonne réponse dépend de contraintes qui interagissent de manière non-évidente. Le mode réflexion rend l'analyse des contraintes explicite.

**Débogage d'interactions système complexes.** Quand la cause première d'un bug s'étend sur plusieurs systèmes et requiert de raisonner sur le timing, l'état, et les effets secondaires simultanément.

**Logique sensible à la sécurité.** Flux d'auth, modèles de permission, implémentation de protocole cryptographique. Le coût d'une erreur est élevé; la latence et le coût supplémentaires de la réflexion sont bon marché par comparaison.

---

## Quand NE PAS utiliser la réflexion étendue

La réflexion étendue gaspille l'argent et ajoute la latence avec aucun bénéfice de qualité sur :

**CRUD simple et boilerplate.** Générer un endpoint REST, écrire une classe modèle, scaffolder un composant. Ces tâches ont une seule structure évidente. La réflexion ne les améliore pas.

**Traduction et localisation.** Convertir du contenu dans une autre langue. La tâche est le mapping token-par-token, pas le raisonnement. Le mode réflexion sur traduction brûle le budget de tokens de sortie sans gain.

**Lookups et résumés.** "Que fait cette fonction ?" ou "Résumez ce fichier." La réponse est dans l'input. Aucun raisonnement requis.

**Boucles de haut volume.** Si vous appelez l'API en boucle sur des milliers d'entrées similaires, le mode réflexion multiplie votre coût par 5–15×. Réservez la réflexion pour la phase de planification; utilisez le mode standard pour l'exécution.

**Flux interactifs sensibles au temps.** Autocomplete, suggestions inline, réponses de chat où l'utilisateur s'attend à une réponse sous-seconde. La latence de réflexion paraîtra cassée.

**Brouillon itératif.** Génération de premier brouillon, brainstorming, exploration spéculative. Vous voulez le volume et la variété, pas la rigueur. Utilisez le mode standard et itérez.

---

## Intégration Claude Code : `/effort` en pratique

Quand vous définissez `/effort high` ou `/effort max` dans une session Claude Code, plusieurs comportements changent :

- **La planification d'appel d'outil s'améliore.** Avant d'émettre une séquence de lectures, éditions, et appels bash, Claude raisonnera en interne à travers le plan complet plutôt que de s'engager sur la première action plausible. Cela réduit le backtracking mid-séquence.

- **Les opérations multi-fichiers sont plus cohérentes.** Quand une tâche requiert des changements sur plusieurs fichiers qui doivent rester cohérents, le mode réflexion aide Claude à maintenir toutes les contraintes dans la portée simultanément.

- **L'amélioration de la décomposition de tâche ambiguë.** Si la description de votre tâche est sous-spécifiée, Claude est plus susceptible de surface l'ambiguïté et demander, plutôt que de deviner et de procéder incorrectement.

- **La récupération d'erreur est meilleure.** Quand un appel d'outil retourne un résultat inattendu, le mode réflexion rend Claude plus susceptible de raisonner à travers ce qui s'est mal passé plutôt que de réessayer la même action.

**Motif de session recommandé :**

```
# Début de tâche complexe
/effort high

# ... travailez à travers la conception/architecture complexe ...

# Revenez quand vous passez à l'implémentation
/effort low

# ... générez le boilerplate, écrivez les tests, etc. ...

# Revenez pour tout débogage difficile ou préoccupations transversales
/effort high
```

Ne laissez pas `/effort high` pour une session longue entière. Vous payez les tarifs de tokens de réflexion sur chaque tour, incluant "ok, lisez ce fichier" et "maintenant exécutez les tests" qui ne gagnent rien de la réflexion.

---

## Cas d'usage réels

### 1. Migration de schéma de base de données sous contraintes

**Prompt:**
```
Nous migrons d'un schéma Postgres single-tenant (une DB par client) à
un schéma multi-tenant (isolation au niveau des lignes via tenant_id). Nous avons 47 tables,
plusieurs avec des clés étrangères entre tables. Nous ne pouvons pas
nous permettre de downtime. Nous traitons 8,000 transactions d'écriture/minute au pic. 
Concevez la stratégie de migration.
```

**Pourquoi la réflexion aide :** La migration doit traiter les contraintes de clés étrangères, l'ordre du backfill, les changements d'index, et le cutover sans downtime simultanément. Ces contraintes interagissent — un ordre qui satisfait les clés étrangères peut entrer en conflit avec la performance du backfill. La génération linéaire choisit une contrainte à résoudre en premier puis retro-adapte les autres, produisant souvent un plan avec un mode de défaillance silencieux. Le mode réflexion laisse Claude énumérer les interactions de contrainte avant de s'engager sur un plan.

---

### 2. Analyse de cause première de bug compilateur

**Prompt:**
```
Notre binaire Rust compile proprement mais segfaults à l'exécution seulement quand compilé
avec --release et seulement sur ARM64. Le crash est dans une hot loop qui traite
des byte arrays. Pas de code unsafe dans notre codebase. Voici le diff d'assembly pertinent
entre debug et release: [...]
```

**Pourquoi la réflexion aide :** La cause première implique l'interaction des passes d'optimisation LLVM, les suppositions d'alignement, et le comportement indéfini dans du code Rust qui paraît sûr. Diagnostiquer cela requiert de maintenir plusieurs hypothèses simultanément et de raisonner sur les motifs d'assembly correspondant à quelles constructions au niveau source. C'est une tâche classique de mode réflexion.

---

### 3. Conception de contrat API pour rétrocompatibilité

**Prompt:**
```
Nous devons ajouter la pagination à un endpoint API qui retourne actuellement tous les résultats.
Notre API a 200+ consommateurs externes. Nous ne pouvons pas casser les intégrations existantes.
Le schéma de réponse actuel est: { "results": [...] }. Concevez le versioning
et le chemin de migration.
```

**Pourquoi la réflexion aide :** La conception doit satisfaire les nouveaux consommateurs (qui ont besoin de pagination), les anciens consommateurs (qui s'attendent à l'array plat), et la période de transition (où les deux existent). Ces contraintes suggèrent des approches différentes qui s'excluent mutuellement sans conception prudente. Le mode réflexion mappe l'espace des contraintes avant de proposer une structure.

---

### 4. Vérification de correction des systèmes distribués

**Prompt:**
```
Ceci est notre algorithme d'élection de leader. Identifiez toutes les conditions sous lesquelles
deux nœuds pourraient simultanément croire qu'ils sont le leader.
[pseudocode d'algorithme suit]
```

**Pourquoi la réflexion aide :** Les violations de propriété de sécurité dans les algorithmes distribués requièrent de vérifier exhaustivement tous les entrelacemments d'événements concurrents. La génération linéaire vérifie les cas évidents et s'arrête. Le mode réflexion est plus susceptible de construire l'analyse de cas systématique qui trouve les races subtiles.

---

### 5. Revue de modèle de sécurité

**Prompt:**
```
Voici notre modèle de permission pour un SaaS multi-tenant. Les utilisateurs appartiennent à
des organisations. Les organisations ont des rôles. Les ressources appartiennent à
des organisations. Les utilisateurs peuvent partager des ressources cross-organisation avec
des subventions explicites. Identifiez les chemins d'escalade de privilège. [schéma et code de vérification de permission suit]
```

**Pourquoi la réflexion aide :** Les vulnérabilités d'escalade de privilège vivent à l'intersection des règles de permission multiples. Les trouver requiert de maintenir le modèle de permission complet en tête tout en raisonnant sur les séquences d'opérations qui paraissent valides-en-regardant se composent en un état invalide. C'est exactement le type de raisonnement multi-contrainte où le mode réflexion améliore la précision.

---

## Guide de dimensionnement du budget de tokens

Choisir la bonne valeur de `budget_tokens` n'est pas une question de maximisation — c'est une question d'appariement à la complexité de la tâche.

| Complexité de tâche | Budget recommandé | Exemples |
|---|---|---|
| Modérée | 4,000–6,000 | Revue de code, débogage single-fonction, questions de modèle de données |
| Élevée | 8,000–12,000 | Décisions architecturales, refactors multi-fichiers, conception d'algorithme |
| Très élevée | 16,000–24,000 | Conception de système sous contraintes dures, revues de sécurité |
| Maximum | 32,000+ | Correction de compilateur, vérification formelle, analyse de preuve |

Commencez à 8,000 et augmentez seulement si vous observez un raisonnement tronqué. Les signes que le budget est trop petit :

- Le bloc de réflexion se termine abruptement mid-analyse
- La réponse finale manque des contraintes qui étaient visibles dans le prompt
- La réponse hedges fortement où une réponse décisive était possible

Les signes que le budget est trop grand :

- Le bloc de réflexion est répétitif — Claude explore la même branche plusieurs fois
- La réponse finale ne s'améliore pas significativement par rapport à ce qu'un budget de 4,000 tokens aurait produit
- La latence est élevée mais la réponse est une simple recommandation

---

## Checklist de réflexion étendue

Utilisez ceci avant d'activer le mode réflexion. Si moins de 3 éléments s'appliquent, utilisez le mode standard.

- [ ] La tâche a plus de 2 dépendances séquentielles (l'étape A doit être correcte avant l'étape B peut procéder)
- [ ] La tâche contient des conflits de contrainte explicites ou cachés qui ont besoin de résolution
- [ ] Une réponse incorrecte serait coûteuse à trouver et corriger (bug en production, problème de sécurité, migration irréversible)
- [ ] La tâche implique une propriété de correction, pas juste une préférence de style ou structure
- [ ] Vous avez été déçu par une réponse en mode standard sur une tâche similaire auparavant
- [ ] Le prompt est ambigu d'une manière qui requiert une interprétation avant de répondre
- [ ] La tâche requiert d'énumérer des cas (toutes les conditions d'erreur, tous les entrelacemments, tous les cas limites)
- [ ] La tâche s'étend sur plusieurs systèmes ou fichiers qui doivent rester mutuellement cohérents
- [ ] La tâche est une décision one-off (pas une opération batch de haut volume)
- [ ] Vous avez du temps pour la latence — ce n'est pas un appel synchrone orienté utilisateur

---

## Erreurs courantes

**Définir `/effort max` pour une session entière.** Le multiplicateur de coût s'applique à chaque tour, incluant les banals. Utilisez l'élévation d'effort ciblée pour les parties difficiles, revenez à `low` pour l'exécution.

**Utiliser le mode réflexion sur des tâches créatives.** La réflexion étendue ne s'améliore pas la prose, le brainstorming de conception, ou la génération de contenu. L'amélioration de qualité est spécifique aux tâches requérant la correction logique.

**Ignorer le bloc de réflexion en débogage.** Quand le mode réflexion produit une réponse erronée, lisez le bloc de réflexion en premier. Il révèle habituellement exactement où le raisonnement s'est trompé, qui est le chemin le plus direct pour corriger votre prompt.

**Traiter `budget_tokens` comme un cadran de qualité.** Doubler le budget ne double pas de manière fiable la qualité. Au-delà d'un plafond adapté à la tâche, le budget supplémentaire produit du raisonnement répétitif sans meilleures conclusions. Commencez à 8,000 et validez avant d'aller plus haut.

**Activer la réflexion sur des endpoints streaming avec budgets de latence serrés.** Le mode réflexion retarde le premier token de texte de la durée complète de la phase de réflexion. Si votre UI montre un indicateur de dactylographie et les utilisateurs s'attendent à une réponse dans 1–2 secondes, cela paraîtra cassé. Soit masquez la phase de réflexion derrière un état de chargement délibéré soit désactivez la réflexion sur cet endpoint.

---
