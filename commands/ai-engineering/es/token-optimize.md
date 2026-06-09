---
description: Auditar un prompt o pipeline de LLM para desperdicio de tokens y aplicar reducciones dirigidas
argument-hint: "[prompt file, chain file, or code path]"
---
Auditar el prompt o pipeline en $ARGUMENTS para ineficiencia de tokens y producir una versión optimizada.

Lee cualquier ruta de archivo proporcionada. Si el argumento es un directorio, escanea archivos `.py`, `.ts`, `.md` que contengan cadenas de prompt o sitios de llamadas LLM.

**Dimensiones de auditoría — verifica cada una:**

**1. Verbosidad del prompt**
- Frases de relleno que añaden tokens sin añadir restricción ("Como un modelo de lenguaje de IA", "¡Por supuesto!", "Ciertamente")
- Instrucciones repetidas que aparecen tanto en el mensaje del sistema como en el del usuario
- Ejemplos redundantes que cubren casos idénticos
- Instrucciones en prosa que podrían ser una lista con viñetas con la mitad de tokens

**2. Mal uso de ventana de contexto**
- Documento completo pasado cuando solo se necesita una sección — señala con ahorros estimados
- Historial de chat incluido textualmente cuando un resumen sería suficiente
- Contenido duplicado: el mismo texto incluido dos veces bajo claves diferentes

**3. Oportunidades de almacenamiento en caché**
- Identifica segmentos de prompt estáticos (prompt del sistema, contexto estático, ejemplos few-shot) que deben usar `cache_control: {"type": "ephemeral"}` en la API de Anthropic
- Señala si el segmento elegible para caché es < 1024 tokens (por debajo del umbral mínimo de caché — sin beneficio)
- Muestra la matriz de mensajes reestructurada con bloques de caché colocados correctamente

**4. Longitud de salida**
- ¿Se establece `max_tokens`? Si no, señala como riesgo de costo ilimitado
- ¿El prompt solicita explicación cuando solo se necesitan datos estructurados?
- ¿Un formato de salida más corto (JSON vs prosa, solo código vs código+explicación) reduciría el costo de generación?

**5. Ajuste del nivel de modelo**
- ¿La tarea está utilizando `claude-sonnet-4-6` o `claude-opus-4-7` para trabajo que `claude-haiku-4-5-20251001` puede manejar a 10x menor costo?
- Clasifica la complejidad de la tarea: extracción/clasificación simple → Haiku; razonamiento/generación → Sonnet; complejo multi-paso → Opus

**Formato de salida:**

```
## Resumen de auditoría de tokens
| Problema | Ubicación | Impacto de tokens estimado | Prioridad |
|----------|-----------|---------------------------|-----------|
| ...      | ...       | ...                       | H/M/L     |

## Prompt / cadena optimizada
<versión completamente reescrita con cambios aplicados>

## Configuración de almacenamiento en caché
<fragmento de matriz de mensajes mostrando colocación de cache_control, si aplica>

## Ahorros estimados
Antes: ~N tokens/llamada  →  Después: ~M tokens/llamada  (~X% reducción)
En 1000 llamadas/día en [modelo]: $Y/mes de ahorros
```

Aplica todas las correcciones de alta prioridad directamente en la salida. Explica elementos de prioridad media/baja pero no apliques sin preguntar.
