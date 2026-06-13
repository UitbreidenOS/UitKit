# RIPER — Marco de trabajo de codificación agente estructurado

RIPER es un marco de 5 fases para desarrollo de características complejas: Research, Innovate, Plan, Execute, Review. Cada fase tiene un modo estricto, entradas y salidas definidas, y un límite explícito que no puede cruzarse hasta que la fase esté completa.

---

## Por qué RIPER

El creep de alcance es el modo de falla primario para codificación agente. Sin límites de fase explícitos, Claude salta de leer un archivo a proponer un refactor completo a comenzar implementación — todo en un mensaje. El resultado se parece al progreso pero produce código que no coincide con requisitos, contiene decisiones arquitectónicas no revisadas, y es difícil corregir porque el razonamiento sucedió implícitamente.

RIPER fuerza declaraciones de fase explícitas. Cada fase tiene exactamente un trabajo. Violar un límite de fase es un error de protocolo — no una preferencia de estilo.

---

## Declaración de modo

Cada fase comienza con una declaración de modo explícita:

```
I am now in RESEARCH mode.
```

Esta declaración no es ceremonial. Es un compromiso: en este modo, hago exactamente lo que esta fase requiere y nada más. Las declaraciones de modo hacen que las transiciones de fase sean visibles en la conversación y fuerzan la pregunta "¿realmente termino la fase anterior?"

---

## Fase 1: Research

**Un trabajo:** recopilar contexto. Sin soluciones, sin propuestas, sin opiniones.

### Qué recopilar

- Estructura de base de código: archivos relevantes, patrones existentes, puntos de entrada
- Restricciones: interfaces existentes que deben preservarse, requisitos de rendimiento, límites de seguridad
- Dependencias: en qué depende esta característica; qué depende de ella
- Arte anterior: características similares ya construidas; patrones usados en otros lugares en la base de código

### Salida

Un **documento de resumen de contexto** contiene:
- Lista de archivos relevantes con descripciones de una línea
- Patrones clave en uso (convenciones de nombres, manejo de errores, flujo de datos)
- Restricciones identificadas
- Preguntas abiertas (cosas que no se pueden responder desde la base de código sola)

### Anti-patrón

Proponer soluciones durante Research. El momento en que un pensamiento comienza con "podríamos..." o "el mejor enfoque sería...", el modo Research ha sido roto. Registra el pensamiento como una pregunta abierta y continúa recopilando.

**Equivocado:**
```
Veo que el módulo de pago usa Stripe. Podríamos agregar un manejador de webhook en /api/webhooks/stripe
que valide la firma y enrute eventos al manejador apropiado.
```

**Correcto:**
```
Ubicación del módulo de pago: src/payments/
SDK de Stripe presente: sí (package.json línea 23)
Infraestructura de webhook existente: ninguna encontrada
Pregunta abierta: ¿dónde registra la base de código las rutas de API?
```

---

## Fase 2: Innovate

**Un trabajo:** generar opciones. Sin implementación, sin compromiso profundo con un enfoque.

### Formato

Una lista numerada de enfoques, cada uno con:
- Descripción de una oración
- Compensaciones clave (2–3 puntos de bala)
- Estimación de complejidad aproximada

```markdown
## Opciones

**1. Manejador de webhook como ruta dedicada**
Un único endpoint que recibe eventos de Stripe, valida firma y envía a manejadores.
- Pro: simple de implementar, sigue patrones de ruta existentes
- Con: todos los tipos de evento comparten un endpoint — crece complejo con el tiempo
- Complejidad: baja

**2. Bus de eventos con manejadores tipados**
El endpoint del webhook publica a un bus interno; cada tipo de evento tiene un manejador registrado.
- Pro: separación de responsabilidades, fácil agregar nuevos tipos de evento
- Con: sobre-ingenierizado para <5 tipos de evento
- Complejidad: media

**3. Procesamiento basado en cola**
El endpoint del webhook encola evento sin procesar; trabajador procesa asincrónicamente.
- Pro: desacoplado, sobrevive fallas descendentes
- Con: agrega complejidad operacional (infraestructura de cola requerida)
- Complejidad: alta
```

### Salida

Un **documento de opciones** con todos los enfoques viables listados.

### Anti-patrón

Ir demasiado profundo en una opción durante Innovate. Si un enfoque está recibiendo un boceto de implementación completo, el modo Innovate ha roto en el modo Plan prematuramente. Lista la opción a nivel de compensación y continúa.

---

## Fase 3: Plan

**Un trabajo:** selecciona una opción y produce una lista de verificación numerada de acciones.

### Salida

Un **plan numerado** donde cada elemento es una acción, no una descripción. Cada paso debe ser ejecutable de forma aislada.

```markdown
## Plan: Manejador de webhook como ruta dedicada

**Seleccionado desde:** Opciones de Innovate, opción 1
**Racional:** Coincide con patrones de ruta existentes; volumen de evento no justifica un bus.

1. Agrega tipo `StripeWebhookPayload` a `src/types/payments.ts`
2. Crea `src/payments/webhook-handler.ts` — valida firma de Stripe, analiza tipo de evento
3. Agrega ruta `POST /api/webhooks/stripe` en `src/api/routes/payments.ts`
4. Registra ruta en `src/api/router.ts`
5. Agrega `STRIPE_WEBHOOK_SECRET` a esquema env en `src/config/env.ts`
6. Escribe pruebas unitarias para validación de firma en `tests/payments/webhook-handler.test.ts`
7. Escribe prueba de integración para registro de ruta en `tests/api/routes/payments.test.ts`
```

Cada paso es lo suficientemente específico que otro ingeniero podría ejecutarlo sin hacer preguntas.

### Gate

El plan debe ser revisado antes de que Execute comience. Este es el último punto para detectar problemas de alcance, pasos faltantes o problemas de arquitectura sin pagar costo de implementación. Claude lo revisa; un humano lo revisa para cambios de alto riesgo.

### Anti-patrón

Escribir pasos de plan como descripciones en lugar de acciones.

**Equivocado (descripción):** "El manejador de webhook debe validar la firma de Stripe"  
**Correcto (acción):** "Crea `src/payments/webhook-handler.ts` con una función `validateSignature(payload, secret)` usando el método `constructEvent` de Stripe"

---

## Fase 4: Execute

**Un trabajo:** implementa el plan exactamente como se escribe. Marca cada paso.

### El protocolo bloqueador

La regla más importante en Execute: si encuentras algo inesperado que el plan no contabiliza, **detente inmediatamente**.

No improvises. No tomes decisiones arquitectónicas sobre la marcha. No "solo agregues una cosa más".

El protocolo bloqueador:
1. Detente ejecutando
2. Nota el bloqueador: qué se encontró, por qué bloquea el paso actual
3. Vuelve a modo Plan
4. Actualiza el plan para contabilizar el bloqueador
5. Reanuda Execute desde el último paso completado

```
[BLOQUEADOR — volviendo a modo PLAN]
Encontrado: `src/api/router.ts` usa un patrón de registro de ruta diferente al documentado.
Las rutas se registran vía un decorador, no una llamada directa.
El paso del plan 4 necesita revisión para coincidir con el patrón decorador.
```

### Rastreo de pasos

Marca cada paso conforme se completa:

```markdown
1. [x] Agrega tipo `StripeWebhookPayload` a `src/types/payments.ts`
2. [x] Crea `src/payments/webhook-handler.ts`
3. [x] Agrega ruta `POST /api/webhooks/stripe`
4. [ ] Registra ruta en `src/api/router.ts`   ← paso actual
```

### Anti-patrón

Improvisar durante Execute. Cualquier cambio no en el plan — incluso una "pequeña mejora" — es un cambio de alcance. Regístralo como una tarea futura y continúa ejecutando el plan como se escribe. Desviarse del plan rompe la garantía que Execute produce exactamente lo que Plan diseñó.

---

## Fase 5: Review

**Un trabajo:** compara la implementación contra el plan y requisitos originales. Produce un informe de desviación.

### Qué verificar

- Cada paso del plan: ¿implementado como se especifica? (marca cada `[x]`)
- Cada criterio de aceptación de Research: ¿la implementación lo satisface?
- Requisitos no funcionales: rendimiento, seguridad, manejo de errores — ¿están presentes?
- Pruebas: ¿las pruebas realmente prueban el comportamiento descrito en requisitos?

### Salida

Un **informe de desviación + requisitos pass/fail**:

```markdown
## Informe de revisión

### Finalización del plan
- Pasos 1–6: completos como se especifica
- Paso 7 (prueba de integración): FALTANTE — no implementado

### Requisitos pass/fail
- [x] Webhook recibe y analiza eventos de Stripe
- [x] Firmas inválidas devuelven 400
- [ ] FALLO: Webhook no maneja evento `payment_intent.payment_failed` — no en plan pero presente en requisitos

### Desviaciones del plan
- Paso 3: ruta registrada en `/api/webhooks/stripe-v2` no `/api/webhooks/stripe` — inconsistencia de nombres

### Acciones recomendadas
1. Agrega prueba de integración (paso 7)
2. Agrega manejador para `payment_intent.payment_failed` — vuelve a Plan
3. Alinea ruta con plan o actualiza plan para reflejar ruta actual
```

### Qué hacer si se encuentran desviaciones

Desviaciones menores (typos, nombres): corrige en lugar, nota en informe de desviación.  
Pasos faltantes: vuelve a Execute para el elemento faltante específico.  
Fallos de requisito: vuelve a Plan — esto es un problema de alcance que necesita actualización de plan antes de re-ejecutar.  
Desviaciones de arquitectura: escala. Esta es una señal que Execute improvisó — determina qué cambió y si es aceptable.

---

## Tabla de anti-patrones

| Fase | Anti-patrón | Consecuencia |
|-------|-------------|-------------|
| Research | Proponer soluciones | Salta evaluación de opciones; ancla en primera idea |
| Research | Recopilación de contexto incompleta | El plan se construye sobre suposiciones equivocadas |
| Innovate | Comprometerse con una opción demasiado temprano | Pierde mejores enfoques |
| Innovate | Saltarse análisis de compensación | Las opciones se ven equivalentes; la opción es arbitraria |
| Plan | Pasos descriptivos en lugar de acciones | Execute se vuelve ambiguo; tasa de bloqueador aumenta |
| Plan | Saltarse revisión de gate | Problemas arquitectónicos descubiertos durante Execute |
| Execute | Improvisar | El plan ya no coincide con implementación; Review no tiene nada para comparar |
| Execute | Continuar pasado un bloqueador | El plan se vuelve inválido; los pasos descendentes pueden ser equivocados |
| Review | Saltarse | Las desviaciones no se detectan; los fallos de requisito se envían |
| Review | Suavizar hallazgos | Las desviaciones "menores" se componen en características |

---

## Cuándo usar RIPER vs solo codificar

**Usa RIPER para:**
- Características tomando más de 3 días
- Cambios de alto riesgo (autenticación, pagos, migraciones de datos, APIs públicas)
- Bases de código desconocidas donde los supuestos arquitectónicos no se verifican
- Trabajo donde la implementación incorrecta es costosa de arreglar post-despliegue

**Salta RIPER para:**
- Hotfixes e respuesta de incidente (ve directo a Fix + Review)
- Tareas bajo 2 horas con una ruta de implementación clara
- Cambios aditivos sin decisiones arquitectónicas (agregar bandera de configuración, actualizar dependencia)
- Trabajo donde los cinco fases tomarían más tiempo que solo codificar

RIPER tiene sobrecarga. La sobrecarga se paga a sí misma en trabajo complejo; no se paga a sí misma en trabajo pequeño. La regla de oro: si puedes mantener la implementación completa en tu cabeza sin escribirla, RIPER es excesivo.

---
