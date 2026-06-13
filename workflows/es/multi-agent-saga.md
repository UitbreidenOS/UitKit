# Patrón de Saga Multi-Agente

Coordina operaciones distribuidas en múltiples agentes mediante transacciones compensatorias — cualquier fallo de paso desencadena un rollback automático en orden inverso, sin requerir bloqueos distribuidos o validación en dos fases.

---

## Cuándo usar

- Workflows multi-agente donde cada agente muta el estado independientemente (escrituras de base de datos, llamadas API, cambios de archivos)
- Operaciones que deben confirmarse atómicamente o revertirse completamente
- Secuencias de más de 2 pasos donde una falla parcial deja el sistema en un estado inconsistente
- En cualquier lugar donde de otro modo recurrirías a transacciones distribuidas pero quieres evitar el costo general de coordinación

No usar para workflows de solo lectura, pipelines de un solo agente, u operaciones que son naturalmente idempotentes y seguras de reintentar sin rollback.

---

## Fases / Pasos

### Saga vs. Validación en Dos Fases

2PC requiere que un coordinador mantenga bloqueos distribuidos mientras todos los participantes votan y confirman. Garantiza atomicidad pero se bloquea en contención de bloqueos y falla duramente si el coordinador falla a mitad de camino. El patrón saga intercambia atomicidad fuerte por consistencia eventual: cada paso se confirma localmente y publica un evento. Si un paso posterior falla, las acciones compensatorias deshacen confirmaciones anteriores. Sin bloqueos, sin cuello de botella del coordinador. El sistema puede ser temporalmente inconsistente (pago cobrado antes de confirmación de pedido) pero converge a un estado consistente.

**Elige saga cuando:** los pasos abarcan servicios externos con sus propios límites de transacción, o la contención de bloqueos es inaceptable a escala.  
**Elige 2PC cuando:** todos los participantes comparten una base de datos y la atomicidad es innegociable.

---

### Formato de Definición de Paso

Cada paso de saga es un par:

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

Reglas:
- `output_key` captura la salida de la acción directa en el mapa de contexto de compensación.
- `compensate.input` puede hacer referencia a cualquier clave en el mapa de contexto acumulado usando la notación `{{key}}`.
- Cada acción directa debe tener una acción compensatoria definida — sin excepciones.
- Las acciones compensatorias deben ser idempotentes (seguras de llamar dos veces).

---

### Secuencia de Ejecución

**Paso directo:** ejecuta pasos en orden. Después de cada paso, añade su salida al contexto de compensación.

```
paso 1 → éxito → contexto += {order_id: "o_123"}
paso 2 → éxito → contexto += {reservation_id: "r_456"}
paso 3 → FALLA
  → rollback: compensar paso 2 (contexto tiene reservation_id) → éxito
  → rollback: compensar paso 1 (contexto tiene order_id) → éxito
  → resultado saga: FAILED_AND_ROLLED_BACK
```

**En caso de falla:** ejecuta compensaciones en orden inverso para todos los pasos previamente exitosos. No ejecutes la compensación del paso fallido en sí — nunca se confirmó.

**En caso de falla de compensación:** ver Manejo de Cartas Muertas abajo.

---

### Pasar Contexto de Compensación Entre Agentes

El orquestador mantiene un mapa de contexto mutable. Cada llamada de agente añade sus claves de salida antes de que se ejecute el siguiente paso. Los agentes solo reciben las claves que necesitan — no pases el contexto completo a cada agente (reduce el riesgo de inyección de prompt y costo de tokens).

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

### Implementación de Claude Code

Usa la herramienta `Agent` con entrega JSON estructurada entre agentes. El agente orquestador sostiene el plan de saga en su indicación del sistema y pasa contexto como JSON en cada invocación de subagente.

**Patrón de indicación del orquestador:**

```
Eres un orquestador de saga. Estás ejecutando el siguiente plan de saga:

<saga_plan>
{{saga_plan_json}}
</saga_plan>

Contexto actual:
<context>
{{context_json}}
</context>

Ejecuta el paso: {{current_step_id}}

En éxito: devuelve {"status": "ok", "output_key": "<value>"}
En falla: devuelve {"status": "error", "error": "<reason>"}

No procedas al siguiente paso. El orquestador maneja la secuenciación.
```

El agente orquestador es el único agente que lee y escribe el mapa de contexto. Los subagentes no tienen estado — reciben exactamente lo que necesitan y devuelven exactamente lo que producen las acciones directas o compensatorias.

---

### Manejo de Cartas Muertas

Cuando una acción compensatoria también falla, la saga no puede alcanzar automáticamente consistencia. Pasos:

1. Registra la compensación fallida con contexto completo en un almacén de cartas muertas (`.claude/saga-dead-letters.jsonl`).
2. Detén todas las compensaciones restantes — no procedas ciegamente.
3. Llama de guardia o abre un ticket con la carga útil de la carta muerta.
4. Marca el estado de la saga como `COMPENSATION_FAILED` — distinguible de `FAILED_AND_ROLLED_BACK`.

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

Las compensaciones deben reintentarse con backoff exponencial antes de declarar una falla — los errores transitorios representan la mayoría de fallos de compensación.

---

## Ejemplo

**Saga de pedido de e-commerce — 4 pasos:**

| Paso | Acción directa | Acción compensatoria |
|------|---------------|---------------------|
| 1 | `order-agent`: crear pedido → `order_id` | `order-agent`: cancelar pedido |
| 2 | `inventory-agent`: reservar artículos → `reservation_id` | `inventory-agent`: liberar reserva |
| 3 | `payment-agent`: cobrar tarjeta → `payment_id` | `payment-agent`: reembolsar pago |
| 4 | `notification-agent`: enviar email de confirmación | `notification-agent`: enviar email de cancelación |

**Escenario: paso de pago falla (tarjeta rechazada)**

```
→ paso 1: crear pedido           → ok, order_id = "o_789"
→ paso 2: reservar inventario      → ok, reservation_id = "r_012"
→ paso 3: cobrar pago         → FALLA (tarjeta rechazada)
← compensar paso 2: liberar reserva r_012  → ok
← compensar paso 1: cancelar pedido o_789          → ok
→ resultado saga: FAILED_AND_ROLLED_BACK
→ usuario ve: "Payment failed. Your order has been cancelled and inventory released."
```

Nota: el paso de notificación (paso 4) nunca se ejecutó, por lo que no tiene compensación para ejecutar.

**JSON del plan de saga para orquestador Claude Code:**

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
