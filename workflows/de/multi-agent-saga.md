# Multi-Agent-Saga-Muster

Koordiniert verteilte Operationen über mehrere Agenten mit kompensierenden Transaktionen — jeder Schrittfehler löst automatisches Rollback in umgekehrter Reihenfolge aus, ohne verteilte Sperren oder Two-Phase-Commit zu erfordern.

---

## Wann verwenden

- Multi-Agent-Workflows, bei denen jeder Agent den Status unabhängig ändert (Datenbankschreibvorgänge, API-Aufrufe, Dateiänderungen)
- Operationen, die atomar übergeben oder vollständig zurückgerollt werden müssen
- Sequenzen mit mehr als 2 Schritten, bei denen teilweises Fehlschlagen das System in einen inkonsistenten Zustand hinterlässt
- Überall dort, wo Sie ansonsten zu verteilten Transaktionen greifen würden, aber den Koordinationsaufwand vermeiden möchten

Nicht verwenden für schreibgeschützte Workflows, Single-Agent-Pipelines oder Operationen, die natürlich idempotent und sicher sind, ohne Rollback erneut zu versuchen.

---

## Phasen / Schritte

### Saga vs. Two-Phase-Commit

2PC erfordert, dass ein Koordinator verteilte Sperren hält, während alle Teilnehmer abstimmen und zusagen. Es garantiert Atomarität, blockiert aber bei Sperrenkontention und schlägt fehl, wenn der Koordinator mittendrin abstürzt. Das Saga-Muster tauscht starke Atomarität gegen eventuelle Konsistenz: Jeder Schritt committed lokal und veröffentlicht ein Ereignis. Schlägt ein späterer Schritt fehl, machen kompensierende Aktionen frühere Commits rückgängig. Keine Sperren, kein Koordinator-Engpass. Das System kann vorübergehend inkonsistent sein (Zahlung belastet vor Bestellbestätigung), konvergiert aber zu einem konsistenten Zustand.

**Wählen Sie Saga wenn:** Schritte externe Services mit ihren eigenen Transaktionsgrenzen umfassen, oder Sperrenkontention ist in großem Maßstab inakzeptabel.  
**Wählen Sie 2PC wenn:** Alle Teilnehmer teilen eine Datenbank und Atomarität ist nicht verhandelbar.

---

### Schrittdefinitionsformat

Jeder Saga-Schritt ist ein Paar:

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

Regeln:
- `output_key` erfasst die Vorwärtsaktion-Ausgabe in die Kompensationskontextkarte.
- `compensate.input` kann auf jeden Schlüssel in der angesammelten Kontextkarte mit `{{key}}`-Notation verweisen.
- Jede Vorwärtsaktion muss eine definierte kompensierende Aktion haben — ohne Ausnahmen.
- Kompensierende Aktionen müssen idempotent sein (sicher, zweimal aufzurufen).

---

### Ausführungssequenz

**Vorwärtsdurchlauf:** Führen Sie Schritte der Reihe nach aus. Nach jedem Schritt fügen Sie seine Ausgabe zum Kompensationskontext hinzu.

```
Schritt 1 → Erfolg → Kontext += {order_id: "o_123"}
Schritt 2 → Erfolg → Kontext += {reservation_id: "r_456"}
Schritt 3 → FEHLER
  → Rollback: Kompensiere Schritt 2 (Kontext hat reservation_id) → Erfolg
  → Rollback: Kompensiere Schritt 1 (Kontext hat order_id) → Erfolg
  → Rückgabe saga_result: FAILED_AND_ROLLED_BACK
```

**Bei Fehler:** Führen Sie Kompensationen in umgekehrter Reihenfolge für alle zuvor erfolgreich abgeschlossenen Schritte aus. Führen Sie nicht die Kompensation für den fehlgeschlagenen Schritt selbst aus — er hat sich nie committed.

**Bei Kompensationsfehler:** Siehe Dead Letter Handling unten.

---

### Kompensakontextweitergabe zwischen Agenten

Der Orchestrator verwaltet eine veränderliche Kontextkarte. Jeder Agentaufruf fügt seine Ausgabeschlüssel hinzu, bevor der nächste Schritt ausgeführt wird. Agenten erhalten nur die Schlüssel, die sie benötigen — geben Sie nicht den gesamten Kontext an jeden Agenten weiter (verringert Prompt-Injektionsrisiko und Tokenkosten).

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

### Claude-Code-Implementierung

Verwenden Sie das `Agent`-Tool mit strukturierter JSON-Übergabe zwischen Agenten. Der Orchestrator-Agent hält den Saga-Plan in seiner Systemaufforderung und übergibt den Kontext als JSON bei jedem Subagent-Aufruf.

**Orchestrator-Aufforderungsmuster:**

```
Sie sind ein Saga-Orchestrator. Sie führen den folgenden Saga-Plan aus:

<saga_plan>
{{saga_plan_json}}
</saga_plan>

Aktueller Kontext:
<context>
{{context_json}}
</context>

Führen Sie Schritt aus: {{current_step_id}}

Bei Erfolg: Rückgabe {"status": "ok", "output_key": "<value>"}
Bei Fehler: Rückgabe {"status": "error", "error": "<reason>"}

Fahren Sie nicht mit dem nächsten Schritt fort. Der Orchestrator übernimmt die Sequenzierung.
```

Der Orchestrator-Agent ist der einzige Agent, der die Kontextkarte liest und schreibt. Subagenten sind zustandslos — sie erhalten genau das, was sie brauchen, und geben genau das zurück, was die Vorwärts- oder Kompensationsaktion erzeugt.

---

### Dead Letter Handling

Wenn eine kompensierende Aktion auch fehlschlägt, kann die Saga nicht automatisch Konsistenz erreichen. Schritte:

1. Protokollieren Sie die fehlgeschlagene Kompensation mit vollem Kontext in einem Dead-Letter-Store (`.claude/saga-dead-letters.jsonl`).
2. Stoppen Sie alle verbleibenden Kompensationen — fahren Sie nicht blindlings fort.
3. Benachrichtigen Sie Bereitschaft oder öffnen Sie ein Ticket mit der Dead-Letter-Nutzlast.
4. Markieren Sie den Saga-Status als `COMPENSATION_FAILED` — unterscheidbar von `FAILED_AND_ROLLED_BACK`.

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

Kompensationen sollten mit exponentiellem Backoff erneut versucht werden, bevor ein Fehler erklärt wird — vorübergehende Fehler machen die Mehrheit der Kompensationsfehler aus.

---

## Beispiel

**E-Commerce-Bestellsaga — 4 Schritte:**

| Schritt | Vorwärtsaktion | Kompensierende Aktion |
|------|---------------|---------------------|
| 1 | `order-agent`: Bestellung erstellen → `order_id` | `order-agent`: Bestellung stornieren |
| 2 | `inventory-agent`: Artikel reservieren → `reservation_id` | `inventory-agent`: Reservierung freigeben |
| 3 | `payment-agent`: Karte belasten → `payment_id` | `payment-agent`: Zahlung erstatten |
| 4 | `notification-agent`: Bestätigungs-Email versenden | `notification-agent`: Stornierungsemail versenden |

**Szenario: Zahlungsschritt fehlschlagen (Karte abgelehnt)**

```
→ Schritt 1: Bestellung erstellen           → ok, order_id = "o_789"
→ Schritt 2: Inventar reservieren      → ok, reservation_id = "r_012"
→ Schritt 3: Zahlung belasten         → FEHLER (Karte abgelehnt)
← Kompensiere Schritt 2: Reservierung r_012 freigeben  → ok
← Kompensiere Schritt 1: Bestellung o_789 stornieren          → ok
→ Saga-Ergebnis: FAILED_AND_ROLLED_BACK
→ Benutzer sieht: "Payment failed. Your order has been cancelled and inventory released."
```

Hinweis: Benachrichtigungsschritt (Schritt 4) wurde nie ausgeführt, hat also keine auszuführende Kompensation.

**Saga-Plan-JSON für Claude-Code-Orchestrator:**

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
