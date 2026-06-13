# Multi-Agent Saga Patroon

Coördineert gedistribueerde bewerkingen over meerdere agenten met behulp van compenserende transacties — elke stapfout triggert automatische rollback in omgekeerde volgorde, zonder gedistribueerde vergrendelingen of two-phase commit te vereisen.

---

## Wanneer gebruiken

- Multi-agent workflows waarbij elke agent onafhankelijk status muteert (databaseschrijvingen, API-aanroepen, bestandswijzigingen)
- Bewerkingen die atomair moeten worden vastgelegd of volledig teruggezet
- Reeksen met meer dan 2 stappen waar gedeeltelijke fout het systeem in een inconsistente toestand achterlaat
- Overal waar je anders naar gedistribueerde transacties zou grijpen maar de coördinatieoverhead wil vermijden

Niet gebruiken voor alleen-lezen workflows, single-agent pipelines, of bewerkingen die van nature idempotent en veilig zijn om opnieuw uit te proberen zonder rollback.

---

## Fasen / Stappen

### Saga vs. Two-Phase Commit

2PC vereist dat een coördinator gedistribueerde vergrendelingen vasthoudt terwijl alle deelnemers stemmen en committen. Het garandeert atomariteit maar blokkeert bij vergrendeling contention en mislukt hard als de coördinator halverwege crasht. Het saga patroon verhandelt sterke atomariteit voor uiteindelijke consistentie: elke stap commit lokaal en publiceert een event. Wenn een latere stap mislukt, maken compenserende acties vorige commits ongedaan. Geen vergrendelingen, geen coördinator bottleneck. Het systeem kan voorbijgaand inconsistent zijn (betaling in rekening gebracht voor bestellingbevestiging) maar convergeert naar een consistente toestand.

**Kies saga wanneer:** stappen externe services met hun eigen transactiebegrenzen omvatten, of vergrendeling contention is ondraaglijk op schaal.  
**Kies 2PC wanneer:** alle deelnemers delen één database en atomariteit is niet onderhandelbaar.

---

### Stap-definitie formaat

Elke saga-stap is een paar:

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

Regels:
- `output_key` legt forward-action output vast in de compensatiecontextkaart.
- `compensate.input` kan naar elke sleutel in de geaccumuleerde contextkaart verwijzen met `{{key}}` notatie.
- Elke forward action moet een gedefinieerde compenserende actie hebben — geen uitzonderingen.
- Compenserende acties moeten idempotent zijn (veilig om twee keer aan te roepen).

---

### Uitvoeringsvolgorde

**Forward pass:** voer stappen uit in volgorde. Na elke stap voegt u de uitvoer ervan toe aan de compensatiecontext.

```
stap 1 → succes → context += {order_id: "o_123"}
stap 2 → succes → context += {reservation_id: "r_456"}
stap 3 → MISLUKT
  → rollback: compenseer stap 2 (context heeft reservation_id) → succes
  → rollback: compenseer stap 1 (context heeft order_id) → succes
  → return saga_result: FAILED_AND_ROLLED_BACK
```

**Bij fout:** voer compensaties in omgekeerde volgorde uit voor alle eerder geslaagde stappen. Voer de compensatie voor de mislukte stap zelf niet uit — deze is nooit gecommit.

**Bij compensatiefout:** zie Dead Letter Handling hieronder.

---

### Compensatiecontext doorgeven tussen agenten

De orchestrator onderhoudt een mutable contextkaart. Elke agentoproep voegt zijn output sleutels toe voordat de volgende stap wordt uitgevoerd. Agenten ontvangen alleen de sleutels die ze nodig hebben — geef niet de volledige context aan elke agent door (vermindert prompt-injectierisico en token kosten).

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

### Claude Code Implementatie

Gebruik het `Agent` tool met gestructureerde JSON handoff tussen agenten. De orchestrator agent houdt het sagas plan in zijn system prompt en geeft context door als JSON in elke subagent invocatie.

**Orchestrator prompt patroon:**

```
Je bent een saga orchestrator. Je voert het volgende saga plan uit:

<saga_plan>
{{saga_plan_json}}
</saga_plan>

Huidige context:
<context>
{{context_json}}
</context>

Voer stap uit: {{current_step_id}}

Bij succes: return {"status": "ok", "output_key": "<value>"}
Bij fout: return {"status": "error", "error": "<reason>"}

Ga niet verder naar de volgende stap. De orchestrator handelt sequencing af.
```

De orchestrator agent is de enige agent die de contextkaart leest en schrijft. Subagenten zijn stateless — zij ontvangen exact wat ze nodig hebben en geven exact terug wat de forward of compensate action produceert.

---

### Dead Letter Handling

Wanneer een compenserende actie ook mislukt, kan de saga niet automatisch consistentie bereiken. Stappen:

1. Log de mislukte compensatie met volledige context in een dead letter store (`.claude/saga-dead-letters.jsonl`).
2. Stop alle overblijvende compensaties — ga niet zomaar blindlings verder.
3. Bel on-call of open een ticket met de dead letter payload.
4. Markeer de saga toestand als `COMPENSATION_FAILED` — onderscheidbaar van `FAILED_AND_ROLLED_BACK`.

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

Compensaties moeten worden herhaald met exponentiële backoff voordat fout wordt verklaard — voorbijgaande fouten vormen het merendeel van compensatiefouten.

---

## Voorbeeld

**E-commerce order saga — 4 stappen:**

| Stap | Forward actie | Compenserende actie |
|------|---------------|---------------------|
| 1 | `order-agent`: order aanmaken → `order_id` | `order-agent`: order annuleren |
| 2 | `inventory-agent`: items reserveren → `reservation_id` | `inventory-agent`: reservering vrijgeven |
| 3 | `payment-agent`: kaart belasten → `payment_id` | `payment-agent`: betaling terugbetalen |
| 4 | `notification-agent`: bevestigingsemail verzenden | `notification-agent`: annuleringsemail verzenden |

**Scenario: betalingsstap mislukt (kaart geweigerd)**

```
→ stap 1: order aanmaken           → ok, order_id = "o_789"
→ stap 2: inventaris reserveren      → ok, reservation_id = "r_012"
→ stap 3: betaling belasten         → MISLUKT (kaart geweigerd)
← compenseer stap 2: reservering r_012 vrijgeven  → ok
← compenseer stap 1: order o_789 annuleren          → ok
→ saga resultaat: FAILED_AND_ROLLED_BACK
→ gebruiker ziet: "Payment failed. Your order has been cancelled and inventory released."
```

Opmerking: notificatiestap (stap 4) is nooit uitgevoerd, dus heeft geen compensatie om uit te voeren.

**Saga plan JSON voor Claude Code orchestrator:**

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
