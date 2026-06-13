# Facturación y precios — Planes de Claude, créditos del SDK del agente y gestión de costos

Una referencia práctica para entender los niveles de suscripción de Claude, la división de facturación del 15 de junio, las tarifas de tokens de API y las estrategias de optimización de costos.

---

## Descripción general de planes

| Plan | Precio mensual | Límites interactivos | Créditos del SDK del agente |
|---|---|---|---|
| **Pro** | $20/mes | Estándar | $20/mes |
| **Max 5×** | $100/mes | 5× estándar | $100/mes |
| **Max 20×** | $200/mes | 20× estándar | $200/mes |
| **Team** | Por usuario | Fondo compartido | Facturación separada por API |
| **Enterprise** | Por usuario | Negociado | Facturación separada por API |

Las cuentas **Team** y **Enterprise** utilizan precios por usuario con facturación de API a tasas de tokens — no hay un fondo de créditos del SDK del agente fijo. Todo el consumo de tokens se mide directamente contra la API.

---

## El cambio de facturación del 15 de junio de 2026

> **Este cambio afecta a todos los suscriptores Pro y Max.** Los usuarios de clave API (sin suscripción) no se ven afectados — siempre se han facturado por token.

Antes del 15 de junio de 2026: `claude -p` (modo de impresión), sesiones del SDK del agente y sesiones del Agente administrado, todos extraían del mismo fondo que las sesiones de chat interactivo de Claude y sesiones de terminal de Claude Code.

Después del 15 de junio de 2026: **Dos fondos separados.**

### Fondo 1 — Fondo interactivo
Cubre:
- Sesiones de chat de Claude.ai
- Sesiones de terminal de Claude Code (`claude` en tu terminal, modo interactivo)

### Fondo 2 — Fondo de créditos del SDK del agente
Cubre:
- `claude -p` (modo de impresión / no interactivo)
- Sesiones del SDK del agente (llamadas API programáticas)
- Sesiones del Agente administrado (agentes alojados en la nube vía `client.beta.sessions`)

### Qué significa esto en la práctica

- Puedes ejecutar scripts `claude -p`, tuberías y automatización todo el mes sin tocar tus límites de chat interactivo.
- Los créditos del SDK del agente **no** se transfieren de mes a mes. Los créditos no utilizados expiran al final del período de facturación.
- Si alcanzas el límite de créditos del SDK del agente, las llamadas posteriores devuelven un `429` con `X-Limit-Pool: agent_sdk` en el encabezado de respuesta. El uso interactivo no se ve afectado.
- Usuarios de clave API: sin cambios. Facturados por token como siempre — sin fondos, sin transferencia.

### Supervisión de uso

```bash
# En Claude Code — muestra desglose por categoría
/usage
```

La salida de `/usage` ahora muestra dos filas: `interactive` (interactivo) y `agent_sdk`, cada una con tokens utilizados y asignación restante. Verifica esto antes de ejecutar trabajos por lotes grandes para confirmar que tienes suficientes créditos del SDK del agente.

La página de uso de Claude.ai (Configuración → Uso) también rastrea los límites mensuales por fondo con una barra de progreso para cada uno.

---

## Precios de API (usuarios de clave API)

Facturados por token. No se requiere suscripción. Tarifas a partir de junio de 2026:

### Tarifas de entrada/salida

| Modelo | Entrada (por 1M tokens) | Salida (por 1M tokens) |
|---|---|---|
| Claude Opus 4.7 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $0.25 | $1.25 |

### Tarifas de caché de prompts

| Operación de caché | Multiplicador sobre precio de entrada |
|---|---|
| Lectura de caché | 0.1× (descuento del 90%) |
| Escritura en caché | 1.25× (prima del 25% en primera escritura) |

El almacenamiento en caché es positivo neto cuando esperas más de 1 lectura por escritura. A las tarifas de Opus 4.7: un contexto de 100K tokens cuesta $0.50 para escribir en caché, y $0.05 por lectura de caché. Equilibrio en 1.25 lecturas; cada lectura después de eso ahorra $0.45.

### API por lotes

La API de lotes procesa solicitudes de forma asincrónica y devuelve resultados en 24 horas. Descuento: **50% de descuento en tarifas estándar** en tokens de entrada y salida. Úsalo para:
- Trabajos de clasificación
- Procesamiento de documentos en lote
- Tuberías de análisis nocturno
- Cualquier carga de trabajo donde la latencia no sea una restricción

---

## Estrategias de optimización de costos

### 1. Utiliza Haiku para tareas mecánicas

Haiku 4.5 es aproximadamente 12× más barato que Opus 4.7 en tokens de entrada. Para tareas que no requieren razonamiento — clasificación, resumen, relleno de plantillas, traducción, extracción de datos estructurados — Haiku produce resultados equivalentes a una fracción del costo.

Regla de oro: si podrías escribir una expresión regular para ello, Haiku lo maneja. Si la tarea requiere razonamiento de múltiples pasos o criterio, recurre a Sonnet u Opus.

### 2. Almacenamiento en caché de prompts para contextos grandes recurrentes

Cualquier bloque de contexto que recurra en llamadas — prompts del sistema, bases de código grandes, documentos de referencia, esquemas de herramientas — debe almacenarse en caché. A una tasa de lectura de caché de 0.1×, un prompt del sistema de 200K tokens cuesta $1.00 para escribir una vez y $0.10 por lectura posterior.

Las escrituras en caché son explícitas: usa el marcador `cache_control: {"type": "ephemeral"}` en el bloque de contenido. El contenido almacenado en caché tiene un TTL de 5 minutos que se reinicia en cada lectura.

### 3. API de lotes para cargas de trabajo no sensibles al tiempo

Si una tubería puede tolerar una latencia de hasta 24 horas, rútala a través de la API de lotes. Descuento del 50% en todos los modelos. A escala, esto reduce a la mitad tu gasto en API en trabajos asincrónico.

### 4. Control de longitud de salida

Los tokens de salida cuestan 5× más que los tokens de entrada a la misma tasa. Instruye al modelo para ser conciso cuando solo necesitas salida estructurada o respuestas cortas. Agrega a tu prompt del sistema:

```
Responde solo con lo que se preguntó. No agregues explicaciones, advertencias o resúmenes a menos que se solicite explícitamente.
```

Para tareas de extracción: instruye salida solo en JSON sin prosa circundante.

### 5. Carga diferida de herramientas

Listar 50+ herramientas en un prompt del sistema puede agregar 10K–20K tokens de contexto por llamada. El patrón de carga diferida de herramientas de Claude Code carga esquemas de herramientas solo cuando Claude los solicita, reduciendo el contexto de inicio en hasta 85% para catálogos de herramientas grandes.

Ver `guides/token-cost-reduction.md` para el patrón de implementación de carga diferida.

### 6. Utiliza créditos del SDK del agente antes que claves API para scripting

Si tienes una suscripción Max, tu fondo de créditos del SDK del agente está prepagado. Ejecutar scripts `claude -p` contra tu suscripción no cuesta nada adicional hasta que el fondo de créditos se agote. Solo recurre a facturación de clave API directa cuando tu fondo de créditos se agota o para cargas de trabajo que exceden el límite de crédito.

---

## Supervisión

| Herramienta | Qué muestra |
|---|---|
| `/usage` en Claude Code | Uso de tokens de sesión actual por categoría (interactivo / agent_sdk) |
| Claude.ai → Configuración → Uso | Límites mensuales, barras de progreso por fondo |
| `hooks/post-tool-use/cost-tracker.sh` | Registro de costos por sesión vía hook PostToolUse |

Para usuarios de clave API, la consola de Anthropic (console.anthropic.com) proporciona uso de tokens por día desglosado por modelo y un gráfico de gastos para el período de facturación.

---
