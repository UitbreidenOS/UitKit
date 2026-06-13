# Flujo de trabajo de investigación de errores

Depuración de múltiples hipótesis paralelas — cuando la causa raíz de un error es poco clara, ejecute múltiples agentes simultáneamente investigando diferentes teorías. Significativamente más rápido que la depuración secuencial.

## Cuándo usar

Utilice este flujo de trabajo cuando:
- Un error tiene múltiples causas probables y no sabe cuál
- Un problema de producción requiere identificación rápida de la causa raíz
- Ha estado depurando el mismo error durante más de 30 minutos
- El error es intermitente y difícil de reproducir de forma determinista

## Fase 1: Generación de hipótesis (5 minutos)

Antes de ejecutar agentes, defina 3-5 hipótesis mutuamente excluyentes:

```
Error: [describa el síntoma — error exacto o comportamiento]
Contexto: [qué cambió recientemente, qué entorno, qué condiciones lo desencadenan]

Genere 3-5 hipótesis distintas de causa raíz clasificadas por probabilidad.
Cada hipótesis debe ser:
- Específica (nombra una causa concreta, no "algo mal con auth")
- Comprobable (puede ser confirmada o descartada leyendo código específico)
- Mutuamente excluyente (no "tal vez el caché o tal vez la base de datos")

Formato:
H1 (más probable): [hipótesis] — evidencia: [por qué lo cree]
H2: [hipótesis] — evidencia: [...]
H3: [hipótesis] — evidencia: [...]
```

**Hipótesis de ejemplo para "el pago falla intermitentemente":**
```
H1: Condición de carrera — dos solicitudes simultáneas crean pedidos duplicados
    Evidencia: el error solo ocurre en alta concurrencia, los logs muestran IDs de pedido duplicados
H2: Límite de velocidad de Stripe — alcanzar límite de 100 req/s en tráfico de pico
    Evidencia: los errores alcanzan un pico exactamente en picos de tráfico, 429 en algunos registros de error
H3: Agotamiento de la conexión de la base de datos — el grupo agota el tiempo durante la carga alta
    Evidencia: el mensaje de error "connection timeout" aparece en algunos casos
H4: Colisión de reintento de webhook — Stripe reintentando un webhook previamente fallido
    Evidencia: algunos cargos duplicados se trazan a la misma ID de evento webhook
```

## Fase 2: Investigación paralela

Genere un agente por hipótesis. Cada agente obtiene exactamente una teoría para investigar y nada más:

```
[Ejecute estos agentes en paralelo, no secuencialmente]

Agente 1 (H1 — Condición de carrera):
"Investigar si una condición de carrera causa pedidos duplicados.
Mirar: src/api/orders/create.ts, nivel de aislamiento de transacción de base de datos,
cualquier mecanismo de mutex o bloqueo en su lugar.
Objetivo: confirme o descarte esta hipótesis con evidencia de código específica."

Agente 2 (H2 — Límite de velocidad de Stripe):
"Investigar si estamos alcanzando límites de velocidad de API de Stripe.
Mirar: src/services/stripe.ts, registro de solicitudes, panel de control de Stripe si es accesible,
cualquier lógica de reintento o cola para llamadas de Stripe.
Objetivo: confirme o descarte con evidencia."

Agente 3 (H3 — Grupo de conexiones DB):
"Investigar si el agotamiento del grupo de conexiones DB causa fallos de pago.
Mirar: configuración de conexión de base de datos, tamaño de grupo vs solicitudes concurrentes,
cualquier registro de error de conexión.
Objetivo: confirme o descarte con evidencia."

Agente 4 (H4 — Replay de webhook):
"Investigar si los reintentos de webhook de Stripe causan procesamiento duplicado.
Mirar: src/webhooks/stripe.ts, implementación de clave de idempotencia,
deduplicación de ID de evento webhook.
Objetivo: confirme o descarte con evidencia."
```

## Fase 3: Síntesis (después de que todos los agentes informen)

```
Dadas estos resultados de investigación: [pegue todas las salidas de agentes]

1. ¿Qué hipótesis fue confirmada y por qué?
2. ¿Qué evidencia descarta las otras hipótesis?
3. ¿Cuál es la corrección específica?
4. ¿Qué pruebas prevendrían esta regresión?
```

## Fase 4: Corrección y verificación

Implemente la corrección solo para la hipótesis confirmada.

Ejecute el caso de prueba específico que hubiera podido detectar este error:
```bash
# Agregue primero una prueba de regresión
# Luego implemente la corrección
# Luego confirme que la prueba pase
```

## Alternativa: Triaje rápido (< 15 min de errores)

Para errores más simples con un culpable obvio, omita agentes paralelos y use esta lista de verificación rápida:

```
1. ¿Qué cambió en la última implementación? (git log --since="2 hours ago")
2. ¿Es el error reproducible en aislamiento? (reproducción mínima)
3. ¿Qué dice la traza de pila? (lea la línea real, no adivine)
4. ¿Hay una prueba que debería haber detectado esto? (si no, escríbala antes de arreglarlo)
5. Corrección → verificar prueba → implementar
```

## Contenido relacionado

- `/agents/roles/incident-commander` — para incidentes de producción que requieren comunicación
- `/skills/productivity/debug` — habilidad de depuración para investigación de un solo agente
- `/skills/productivity/self-eval` — califique la calidad de su proceso de depuración

---
