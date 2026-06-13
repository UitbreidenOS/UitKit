# Modèle de saga multi-agent

Coordonne les opérations distribuées sur plusieurs agents à l'aide de transactions compensatoires — toute défaillance d'une étape déclenche une annulation automatique dans l'ordre inverse, sans nécessiter de verrous distribués ni de validation en deux phases.

---

## Quand utiliser

- Workflows multi-agent où chaque agent modifie indépendamment l'état (écritures de base de données, appels API, modifications de fichiers)
- Opérations qui doivent être atomiquement validées ou complètement annulées
- Séquences de plus de 2 étapes où une défaillance partielle laisse le système dans un état incohérent
- Partout où vous auriez autrement recours aux transactions distribuées mais voulez éviter les frais généraux de coordination

Ne pas utiliser pour les workflows en lecture seule, les pipelines à agent unique, ou les opérations naturellement idempotentes et sûres à réessayer sans annulation.

---

## Phases / Étapes

### Saga vs. Validation en deux phases

2PC exige qu'un coordinateur maintienne des verrous distribués tandis que tous les participants votent et valident. Il garantit l'atomicité mais se bloque en cas de contention de verrous et échoue brutalement si le coordinateur plante au milieu de la validation. Le modèle de saga échange l'atomicité forte pour la cohérence éventuelle : chaque étape valide localement et publie un événement. Si une étape ultérieure échoue, les actions compensatoires annulent les validations antérieures. Pas de verrous, pas de goulot d'étranglement du coordinateur. Le système peut être temporairement incohérent (paiement facturé avant confirmation de la commande) mais converge vers un état cohérent.

**Choisissez saga quand :** les étapes s'étendent sur des services externes avec leurs propres limites de transaction, ou la contention de verrous est inacceptable à l'échelle.  
**Choisissez 2PC quand :** tous les participants partagent une base de données et l'atomicité est non négociable.

---

### Format de définition d'étape

Chaque étape de saga est une paire :

```json
{
  "step_id": "charge_payment",
  "forward": {
    "agent": "payment-agent",
    "action": "charge",
    "input": { "order_id": "{{order_id}}", "amount": "{{total}}" },
    "output_key": "payment_id"
  },
  "compensate": {
    "agent": "payment-agent",
    "action": "refund",
    "input": { "payment_id": "{{payment_id}}" }
  }
}
```

Règles :
- `output_key` capture la sortie de l'action directe dans la carte de contexte de compensation.
- `compensate.input` peut référencer n'importe quelle clé dans la carte de contexte accumulée à l'aide de la notation `{{key}}`.
- Chaque action directe doit avoir une action compensatoire définie — sans exception.
- Les actions compensatoires doivent être idempotentes (sûres à appeler deux fois).

---

### Séquence d'exécution

**Passage direct :** exécutez les étapes dans l'ordre. Après chaque étape, ajoutez sa sortie au contexte de compensation.

```
étape 1 → succès → contexte += {order_id: "o_123"}
étape 2 → succès → contexte += {reservation_id: "r_456"}
étape 3 → ÉCHOUE
  → annulation : compensation étape 2 (le contexte a reservation_id) → succès
  → annulation : compensation étape 1 (le contexte a order_id) → succès
  → retour saga_result : FAILED_AND_ROLLED_BACK
```

**En cas d'échec :** exécutez les compensations dans l'ordre inverse pour toutes les étapes précédemment réussies. N'exécutez pas la compensation pour l'étape défaillante elle-même — elle n'a jamais été validée.

**En cas d'échec de la compensation :** voir Gestion des lettres mortes ci-dessous.

---

### Passage du contexte de compensation entre agents

L'orchestrateur maintient une carte de contexte mutable. Chaque appel d'agent ajoute ses clés de sortie avant que l'étape suivante ne s'exécute. Les agents ne reçoivent que les clés dont ils ont besoin — ne passez pas le contexte complet à chaque agent (réduit le risque d'injection de prompt et le coût en jetons).

```python
context = {}

for step in saga_steps:
    agent_input = resolve_template(step["forward"]["input"], context)
    result = run_agent(step["forward"]["agent"], step["forward"]["action"], agent_input)
    
    if result["status"] == "error":
        rollback(saga_steps, context, failed_at=step)
        return {"saga": "FAILED", "reason": result["error"]}
    
    context[step["forward"]["output_key"]] = result["output"]

return {"saga": "COMMITTED", "context": context}


def rollback(steps, context, failed_at):
    completed = [s for s in steps if s["step_id"] != failed_at["step_id"]]
    for step in reversed(completed):
        comp_input = resolve_template(step["compensate"]["input"], context)
        run_agent(step["compensate"]["agent"], step["compensate"]["action"], comp_input)
```

---

### Implémentation Claude Code

Utilisez l'outil `Agent` avec remise JSON structurée entre agents. L'agent orchestrateur contient le plan de saga dans son invite système et transmet le contexte en JSON à chaque invocation de sous-agent.

**Modèle d'invite d'orchestrateur :**

```
Vous êtes un orchestrateur de saga. Vous exécutez le plan de saga suivant :

<saga_plan>
{{saga_plan_json}}
</saga_plan>

Contexte actuel :
<context>
{{context_json}}
</context>

Exécutez l'étape : {{current_step_id}}

En cas de succès : retournez {"status": "ok", "output_key": "<value>"}
En cas d'échec : retournez {"status": "error", "error": "<reason>"}

Ne procédez pas à l'étape suivante. L'orchestrateur gère le séquençage.
```

L'agent orchestrateur est le seul agent qui lit et écrit la carte de contexte. Les sous-agents sont sans état — ils reçoivent exactement ce dont ils ont besoin et retournent exactement ce que l'action directe ou compensatoire produit.

---

### Gestion des lettres mortes

Lorsqu'une action de compensation échoue également, la saga ne peut pas atteindre automatiquement la cohérence. Étapes :

1. Enregistrez la compensation défaillante avec le contexte complet dans un magasin de lettres mortes (`.claude/saga-dead-letters.jsonl`).
2. Arrêtez toutes les compensations restantes — ne procédez pas aveuglément.
3. Appelez à froid ou ouvrez un ticket avec la charge utile de la lettre morte.
4. Marquez l'état de la saga comme `COMPENSATION_FAILED` — distinguable de `FAILED_AND_ROLLED_BACK`.

```json
{
  "saga_id": "s_abc123",
  "state": "COMPENSATION_FAILED",
  "failed_step": "reserve_inventory",
  "failed_compensation": "release_inventory",
  "context": { "order_id": "o_123", "reservation_id": "r_456" },
  "error": "Inventory service timeout after 3 retries",
  "timestamp": "2026-05-23T14:32:00Z"
}
```

Les compensations doivent être réessayées avec backoff exponentiel avant de déclarer un échec — les erreurs transitoires représentent la majorité des défaillances de compensation.

---

## Exemple

**Saga de commande e-commerce — 4 étapes :**

| Étape | Action directe | Action compensatoire |
|------|---------------|---------------------|
| 1 | `order-agent`: créer commande → `order_id` | `order-agent`: annuler commande |
| 2 | `inventory-agent`: réserver articles → `reservation_id` | `inventory-agent`: libérer réservation |
| 3 | `payment-agent`: facturer carte → `payment_id` | `payment-agent`: rembourser paiement |
| 4 | `notification-agent`: envoyer email de confirmation | `notification-agent`: envoyer email d'annulation |

**Scénario : étape de paiement échoue (carte refusée)**

```
→ étape 1: créer commande           → ok, order_id = "o_789"
→ étape 2: réserver inventaire      → ok, reservation_id = "r_012"
→ étape 3: facturer paiement         → ÉCHOUE (carte refusée)
← compenser étape 2: libérer réservation r_012  → ok
← compenser étape 1: annuler commande o_789          → ok
→ résultat saga : FAILED_AND_ROLLED_BACK
→ l'utilisateur voit : "Payment failed. Your order has been cancelled and inventory released."
```

Remarque : l'étape de notification (étape 4) n'a jamais eu lieu, donc elle n'a pas de compensation à exécuter.

**JSON du plan de saga pour l'orchestrateur Claude Code :**

```json
{
  "saga_id": "ecommerce_order",
  "steps": [
    {
      "step_id": "create_order",
      "forward": { "agent": "order-agent", "action": "create", "input": { "cart_id": "{{cart_id}}" }, "output_key": "order_id" },
      "compensate": { "agent": "order-agent", "action": "cancel", "input": { "order_id": "{{order_id}}" } }
    },
    {
      "step_id": "reserve_inventory",
      "forward": { "agent": "inventory-agent", "action": "reserve", "input": { "order_id": "{{order_id}}" }, "output_key": "reservation_id" },
      "compensate": { "agent": "inventory-agent", "action": "release", "input": { "reservation_id": "{{reservation_id}}" } }
    },
    {
      "step_id": "charge_payment",
      "forward": { "agent": "payment-agent", "action": "charge", "input": { "order_id": "{{order_id}}", "amount": "{{total}}" }, "output_key": "payment_id" },
      "compensate": { "agent": "payment-agent", "action": "refund", "input": { "payment_id": "{{payment_id}}" } }
    },
    {
      "step_id": "send_confirmation",
      "forward": { "agent": "notification-agent", "action": "confirm", "input": { "order_id": "{{order_id}}" }, "output_key": "notification_id" },
      "compensate": { "agent": "notification-agent", "action": "cancel_notify", "input": { "order_id": "{{order_id}}" } }
    }
  ]
}
```

---
