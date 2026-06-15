# Systèmes Multi-Agents : Modèles d'Architecture

Guide complet des architectures courantes pour les systèmes multi-agents IA, leurs compromis et quand utiliser chaque modèle.

---

## Matrice de Sélection de Modèle

| Modèle | Agents | Complexité | Latence | Tolérance aux Pannes | Cas d'Utilisation |
|---------|--------|-----------|---------|-----------------|----------|
| Pipeline Séquentiel | 2-5 | Faible | N/A (séquentiel) | Aucune | Flux de travail linéaires, pas de parallélisation |
| Fan-Out Parallèle | 3-10 | Moyen | Réduite | Modérée | Sous-tâches indépendantes, fusion de résultats |
| Orchestration DAG | 5-100+ | Élevée | Optimisée | Bonne | Dépendances complexes, parallélisation |
| Modèle Tableau Noir | 3-20 | Moyen | N/A | Modérée | État partagé, agents collaboratifs |
| Modèle Saga | 3-10 | Moyen | N/A | Excellente | Transactions distribuées, restauration |
| Superviseur + Sous-agents | 5-50 | Élevée | Optimisée | Excellente | Grandes équipes, hiérarchie claire |

---

## Pipeline Séquentiel

Les agents s'exécutent l'un après l'autre, chacun utilisant la sortie précédente.

```
Input → Agent A → Output A → Agent B → Output B → Agent C → Final Output
```

**Quand l'utiliser :**
- Flux de travail avec ordre strict (pas de parallélisation possible)
- Chaque agent dépend entièrement de la sortie précédente
- < 3 agents (assez simple pour ne pas nécessiter d'orchestration)

**Implémentation :**
```python
result_a = agent_a(user_input)
result_b = agent_b(result_a)
result_c = agent_c(result_b)
return result_c
```

**Compromis :**
- ✓ Le plus simple à implémenter et déboguer
- ✗ Impossible de paralléliser ; latence totale = somme de toutes les latences
- ✗ Aucune tolérance aux pannes (la première défaillance arrête tout)

---

## Fan-Out Parallèle + Fusion

Une tâche d'orchestrateur se divise en sous-tâches indépendantes, puis fusionne les résultats.

```
                ┌─→ Agent A ─┐
Input → Split →├─→ Agent B ─┤→ Merge → Output
                └─→ Agent C ─┘
```

**Quand l'utiliser :**
- Plusieurs sous-tâches indépendantes (ex. recherche à partir de 3 sources)
- Les sous-tâches peuvent s'exécuter en parallèle
- Les résultats sont fusionnables (pas de dépendances complexes)

**Implémentation :**
```python
import asyncio

results = await asyncio.gather(
    agent_a(input),
    agent_b(input),
    agent_c(input)
)

merged = merge_results(*results)
return merged
```

**Compromis :**
- ✓ La parallélisation réduit la latence
- ✓ La défaillance d'un agent ne bloque pas les autres
- ✗ Impossible d'exprimer les dépendances partielles (l'Agent D dépend de A et B, mais pas C)
- ✗ La logique de fusion peut être complexe si les résultats entrent en conflit

---

## Orchestration DAG

Les agents sont représentés comme des nœuds, les dépendances comme des arêtes. Exécutez les tâches dans l'ordre topologique.

```
       validate
        /     \
    check    verify
       |       |
    reserve   (merged)
       \     /
       charge → send
```

**Quand l'utiliser :**
- 5+ agents avec dépendances complexes
- Besoin de paralléliser tout en respectant les dépendances partielles
- Détection automatique de blocage et récupération en cas de panne

**Implémentation :**
Utilisez un tri topologique pour calculer les voies d'exécution (ensembles de tâches qui peuvent s'exécuter en parallèle) :

```python
lanes = topological_sort(dag)
# lanes[0] = [validate]
# lanes[1] = [check, verify]
# lanes[2] = [reserve]
# lanes[3] = [charge]
# lanes[4] = [send]

for lane in lanes:
    results = await run_lane_parallel(lane)
    save_state(results)
```

**Compromis :**
- ✓ Parallélisation optimale
- ✓ Détection automatique de blocage
- ✓ Peut reprendre à partir de n'importe quel point (persistance d'état)
- ✗ Plus complexe à implémenter
- ✗ Nécessite une spécification formelle des dépendances

---

## Modèle Tableau Noir

Les agents lisent/écrivent une structure de données partagée (tableau noir), se coordonnant via l'état partagé plutôt que par des remises directes.

```
                ┌─────────────────┐
                │   Tableau Noir  │
                │ ┌─────────────┐ │
                │ │ recherche   │ │
                │ │ analyse     │ │
                │ │ synthèse    │ │
                │ └─────────────┘ │
                └────────┬────────┘
                 ╱      ╲      ╲
        Agent A ───    Agent B   Agent C
```

**Quand l'utiliser :**
- Les agents ont besoin de se coordonner via l'état partagé
- Plusieurs agents lisent les mêmes données
- Les agents peuvent travailler sur les données dans un ordre non linéaire
- La cohérence des versions et la résolution des conflits sont importantes

**Implémentation :**
```python
# Le chercheur écrit dans le tableau noir
write_phase('research', sources=[...], summary='...')

# L'analyste lit à partir du tableau noir
research_data = read_phase('research')

# L'analyste écrit l'analyse
write_phase('analysis', themes=[...])

# L'écrivain lit les deux
research = read_phase('research')
analysis = read_phase('analysis')
```

**Compromis :**
- ✓ Coordination flexible (les agents n'ont pas besoin de se connaître)
- ✓ L'état centralisé facilite le débogage
- ✗ Les écritures concurrentes nécessitent une détection des conflits
- ✗ Surcharge de gestion des versions
- ✗ Non adapté aux flux de travail basés sur des événements/streaming

---

## Modèle Saga

Modèle de transaction distribuée : exécutez les étapes vers l'avant, et si une étape échoue, compensez vers l'arrière.

```
Step 1 → Step 2 → Step 3 (fails) ← Compensate 2 ← Compensate 1
  ✓        ✓        ✗               ✓              ✓
```

**Quand l'utiliser :**
- Chaque étape mute l'état externe (écritures DB, appels API)
- Doit être atomique (tous les succès ou tous les retours)
- Impossible d'utiliser la validation en deux phases (pas de verrous distribués)
- Les étapes sont idempotentes et réversibles

**Implémentation :**
```python
for step in saga_steps:
    result = run_step(step)
    context[step.output_key] = result
    if result.error:
        # Restauration : exécutez les compensations en sens inverse
        for step in reversed(completed_steps):
            run_compensation(step, context)
        return 'FAILED_AND_ROLLED_BACK'
```

**Compromis :**
- ✓ Gère les mutations d'état distribuées
- ✓ Garanties de restauration fortes
- ✗ Incohérence transitoire (état partiellement engagé)
- ✗ La logique de compensation doit être écrite manuellement
- ✗ Non adapté aux flux de travail sans opérations réversibles

---

## Superviseur + Sous-agents

Hiérarchie stricte : le superviseur décompose les tâches et les délègue aux sous-agents spécialisés.

```
             Superviseur
           /    |     \
        Agent A Agent B Agent C
```

**Quand l'utiliser :**
- Structure hiérarchique claire (un orchestrateur, plusieurs agents spécialisés)
- Besoin d'application centralisée des ressources (budgets, délais)
- Besoin de portails de qualité et de validation entre les étapes
- Les agents ne devraient pas communiquer directement entre eux

**Implémentation :**
```python
class Supervisor:
    def decompose(self, request):
        return [task_1, task_2, task_3]
    
    def delegate(self, task):
        result = spawn_agent(task.agent, task.input)
        self.validate(result)
        return result
    
    def orchestrate(self, request):
        tasks = self.decompose(request)
        results = []
        for task in tasks:
            result = self.delegate(task)
            results.append(result)
        return self.assemble(results)
```

**Compromis :**
- ✓ Limites de rôles claires
- ✓ Application centralisée des ressources
- ✓ Le superviseur peut valider et réessayer
- ✗ Le superviseur devient un goulot d'étranglement
- ✗ Moins flexible (les agents ne peuvent pas communiquer directement)

---

## Comparaison : Exemple Réel

**Tâche :** Traiter une commande de commerce électronique (valider, vérifier l'inventaire, traiter le paiement, envoyer la confirmation)

### Pipeline Séquentiel
```python
validate_order(order)
check_inventory(order)
process_payment(order)
send_confirmation(order)
# Total latence : T_v + T_i + T_p + T_c
```

### Fan-Out Parallèle
```python
# Impossible : la validation doit d'abord venir, puis la vérification/le paiement en parallèle
```

### Orchestration DAG
```
validate (5s) → check (10s), payment (8s) → charge (5s) → send (3s)
# Total latence : 5 + max(10, 8) + 5 + 3 = 23s
# Accélération vs séquentiel : (5+10+8+5+3) / 23 = 1.7x
```

### Modèle Saga
```
1. Valider la commande          → succès
2. Vérifier l'inventaire        → succès, réserver les articles
3. Traiter le paiement          → ÉCHOUER (carte refusée)
   └─ Compensation : libérer l'inventaire
   └─ Compensation : marquer la commande comme annulée
# Résultat : Commande annulée, inventaire libéré, aucun paiement
```

### Superviseur + Sous-agents
```
Le superviseur se décompose : [validate, check&pay (parallel), charge, send]
Le superviseur délègue aux agents, valide les sorties
En cas de défaillance, réessaye (jusqu'à 2 fois) puis escalade
```

---

## Anti-Modèles à Éviter

### Maille Entièrement Connectée

Chaque agent communique avec tous les autres agents. Conduit à des modèles de communication imprévisibles et des bugs émergents.

❌ **Mauvais :**
```
A ←→ B ←→ C ←→ D
↑         ↑
└─────────┘
```

✓ **Bon :** Utilisez la hiérarchie ou DAG avec des dépendances explicites.

### Dépendances Circulaires

L'agent A attend l'agent B, qui attend l'agent A. Blocage.

❌ **Mauvais :**
```
A → B → A (cycle)
```

✓ **Bon :** Utilisez le tri topologique pour détecter et rejeter les cycles avant l'exécution.

### Défaillances Silencieuses

L'agent échoue mais l'orchestrateur ne le sait pas, procède avec des données obsolètes.

❌ **Mauvais :**
```python
result = agent_call(...)
# Pas de gestion d'erreur, supposer le succès
return result
```

✓ **Bon :**
```python
result = agent_call(...)
if result.status == 'error':
    raise AgentFailure(result.error)
    # ou réessayer, ou escalader
```

### Tentatives Non Limitées

L'agent échoue en boucle, réessayez indéfiniment, ne complétez jamais.

❌ **Mauvais :**
```python
while True:
    try:
        return agent_call(...)
    except:
        pass  # Réessayez indéfiniment
```

✓ **Bon :**
```python
for attempt in range(max_retries):
    try:
        return agent_call(...)
    except Exception as e:
        if attempt == max_retries - 1:
            escalate(e)
```

---

## Arbre de Décision

**Combien d'agents ?**
- 1-2 : Agent unique avec boucles, aucune orchestration nécessaire
- 3-5 : Pipeline séquentiel ou fan-out parallèle
- 5-20 : Orchestration DAG ou modèle de tableau noir
- 20+ : Superviseur + sous-agents avec application des ressources

**Les agents travaillent-ils sur l'état partagé ?**
- Oui : Modèle de tableau noir
- Non : DAG, saga ou superviseur

**Doit préserver les transactions atomiques ?**
- Oui : Modèle Saga
- Non : DAG ou tableau noir

**Besoin de parallélisation automatique ?**
- Oui : Orchestration DAG
- Non : Séquentiel ou fan-out

**Besoin de limites de rôles strictes ?**
- Oui : Superviseur + sous-agents
- Non : DAG ou tableau noir

---
