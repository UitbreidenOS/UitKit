# Construcción incremental con compuertas de confirmación

Construye una característica paso a paso con revisión obligatoria del ser humano entre cada fase. Claude se compromete a los límites de fase antes de comenzar y no puede expandir el alcance a mitad de fase. Previene el arrastre del alcance, detecta problemas de integración tempranamente y mantiene a los humanos en control de la dirección de construcción.

---

## Cuándo usarlo

- Construir una característica que toca más de tres archivos o dos subsistemas
- Características de alto riesgo donde la finalización parcial es peor que ninguna finalización (autenticación, facturación, migraciones)
- Construcciones colaborativas donde una parte interesada no técnica necesita revisar cada incremento
- Cualquier tarea donde anteriormente vio a Claude construir algo correcto pero no lo que usted quería

---

## Fases

### Fase 0 — Definición de fase (primer paso obligatorio)

Antes de que se escriba código, Claude define el plan de fase completo. Este es el contrato.

```
Quiero construir: [describa la característica]

Antes de escribir código, produzca un plan de fase.

Para cada fase:
  - Nombre de fase (por ejemplo, "Fase 1: Modelo de datos")
  - Alcance: exactamente lo que se creará o cambiará (nombres de archivo, no descripciones)
  - Salida: lo que el usuario verá o podrá verificar al final de esta fase
  - Criterios de éxito: cómo sabemos que esta fase se completó correctamente (comando de prueba, verificación manual, etc.)
  - Plan de reversión: cómo deshacer esta fase si la rechazamos (dejar tabla, eliminar archivos, revertir commit)
  - Límite explícito de alcance: lo que NO está incluido en esta fase

Reglas para el plan de fase:
  - Ninguna fase debe tocar más de 5 archivos
  - Cada fase debe ser revisable independientemente sin requerir la siguiente fase
  - Los límites de fase deben estar en costuras naturales (modelo de datos, API, UI — no "la mitad de la API")
  - Ninguna fase puede contener "y también" — si le tienta agregar alcance, cree una nueva fase

Presente el plan de fase. No comience a codificar hasta que lo apruebe.
```

El usuario revisa y aprueba, rechaza o reestructura el plan de fase antes de que comience cualquier trabajo. Esta es la única vez para reformar el alcance.

---

### Fase 1–N — Patrón de ejecución

Cada fase sigue la misma estructura. Reemplace `[N]` y `[nombre de fase]` según corresponda.

**Inicio de fase:**
```
Comience la Fase [N]: [nombre de fase].

Recordatorio de alcance: [pegue el alcance del plan aprobado]
Límite de alcance: [pegue lo que NO está incluido]

Implemente solo lo que está en el alcance. Si encuentra algo que parece necesario pero está fuera del alcance, DETÉNGASE y dígame — no lo agregue unilateralmente. Decidiré si expando esta fase o agrego una Fase [N+1].
```

**Durante la fase:**
- Claude escribe código y ejecuta pruebas solo para el alcance de esta fase
- Si Claude descubre una dependencia de alcance (Fase 2 requiere algo de Fase 3), se detiene e informa en lugar de avanzar
- Sin commits hasta que el usuario revise

**Indicador de fin de fase:**
```
La Fase [N] está completa. Antes de que revise:

1. Liste todos los archivos que creó o modificó
2. Muestre la salida que debo verificar (resultados de prueba, respuesta del servidor, solicitud de captura de pantalla de UI, etc.)
3. Confirme los criterios de éxito del plan: [pegue criterios]
4. Marque cualquier desviación del alcance aprobado (incluso pequeñas)

No comience la Fase [N+1] hasta que diga explícitamente "proceder".
```

**Decisión de puerta:**

| Decisión | Acción |
|---|---|
| "Proceder" | Claude comienza la Fase N+1 usando el mismo patrón de ejecución |
| "Rehacer fase [N]" | Claude vuelve al estado antes de que comenzara la Fase N (usando el plan de reversión) e intenta nuevamente |
| "Modificar alcance" | Pausa — usuario y Claude renegocian el alcance de la Fase N+1 antes de proceder |
| "Detener aquí" | Flujo de trabajo termina; Claude documenta qué está completo y qué queda |

---

### Fase final — Verificación de integración

Después de la aprobación individual de todas las fases, ejecute una verificación de integración.

```
Todas las fases están completas. Ejecute la verificación de integración:

1. Ejecute la suite de prueba completa (no solo las nuevas pruebas)
2. Liste cualquier fallo de prueba, advertencia o error de tipo introducido por esta construcción
3. Verifique que los planes de reversión para cada fase sigan siendo válidos (no hayan sido invalidados por fases posteriores)
4. Produzca un resumen de un párrafo de lo que se construyó y lo que el usuario ahora puede hacer

No repare fallas de integración unilateralmente — repórtelas y espere instrucción.
```

---

## Reglas anti-arrastre de alcance

Estas reglas se aplican a Claude en todo el flujo de trabajo. Péguelas en CLAUDE.md si desea aplicarlas a nivel de proyecto:

```
Durante construcciones incrementales:
- Nunca agregue código fuera del alcance de la fase actual, incluso si parece claramente necesario
- Nunca realice cambios adicionales "mientras estoy en este archivo"
- Nunca cree archivos no enumerados en el plan de fase aprobado
- Si algo falta del plan pero es necesario, DETÉNGASE e informe — no lo agregue silenciosamente
- Los commits ocurren en límites de fase, no a mitad de fase
```

---

## Ejemplo

Característica: "Agregar notificación por correo electrónico cuando se envía un pedido"

Plan de fase (salida de Fase 0):
- **Fase 1: Plantilla de correo electrónico** — Crear `emails/order-shipped.html` y `emails/order-shipped.txt`. Éxito: la plantilla se renderiza con datos de prueba. Reversión: eliminar ambos archivos.
- **Fase 2: Integración del servicio de correo electrónico** — Agregar `sendOrderShippedEmail(orderId)` a `services/email.ts`. Sin UI, sin desencadenantes. Éxito: `npm run test:email` pasa. Reversión: revertir `services/email.ts`.
- **Fase 3: Desencadenar en envío** — Conectar la llamada de servicio en `handlers/shipment.ts` cuando el estado cambia a `shipped`. Éxito: la prueba de extremo a extremo pasa. Reversión: revertir `handlers/shipment.ts`.

El usuario aprueba el plan. Claude ejecuta la Fase 1. El usuario revisa la plantilla, dice "proceder". Claude ejecuta la Fase 2. Durante la Fase 2, Claude nota que el servicio de correo electrónico necesita una clave API que no está en la configuración — se detiene e informa en lugar de agregar unilateralmente la clave de configuración. El usuario agrega la clave, dice "proceder". La Fase 3 se completa. La verificación de integración pasa.

---
