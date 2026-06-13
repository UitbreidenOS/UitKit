---
description: Auditar un prompt o pipeline de LLM para detectar desperdicio de tokens y aplicar reducciones específicas
argument-hint: "[archivo de prompt, archivo de cadena, o ruta de código]"
---
Audita el prompt o pipeline en $ARGUMENTS para detectar ineficiencia de tokens y produce una versión optimizada.

Lee cualquier ruta de archivo proporcionada. Si el argumento es un directorio, escanea archivos `.py`, `.ts`, `.md` que contengan strings de prompts o sitios de llamadas LLM.

**Dimensiones de auditoría — verifica cada una:**

**1. Verbosidad del prompt**
- Frases de relleno que añaden tokens sin añadir restricción ("Como modelo de lenguaje AI", "¡Por supuesto!", "Ciertamente")
- Instrucciones repetidas que aparecen en el mensaje del sistema y del usuario
- Ejemplos redundantes que cubren casos idénticos
- Instrucciones en prosa que podrían ser una lista con viñetas a la mitad de los tokens

**2. Uso incorrecto de la ventana de contexto**
- Documento completo pasado cuando solo se necesita una sección — marca con ahorros estimados
- Historial de chat incluido literalmente cuando un resumen sería suficiente
- Contenido duplicado: el mismo texto incluido dos veces bajo claves diferentes

**3. Oportunidades de caché**
- Identifica segmentos estáticos de prompts (prompt del sistema, contexto estático, ejemplos few-shot) que deben usar `cache_control: {"type": "ephemeral"}` en la API de Anthropic
- Marca si el segmento elegible para caché es < 1024 tokens (por debajo del umbral mínimo de caché — sin beneficio)
- Muestra el array de mensajes reestructurado con bloques de caché colocados correctamente

**4. Longitud de salida**
- ¿Está configurado `max_tokens`? Si no, marca como riesgo de costo sin límites
- ¿El prompt pide explicación cuando solo se necesitan datos estructurados?
- ¿Un formato de salida más corto (JSON vs prosa, solo código vs código+explicación) reduciría el costo de generación?

**5. Ajuste del nivel de modelo**
- ¿La tarea está usando `claude-sonnet-4-6` o `claude-opus-4-7` para trabajo que `claude-haiku-4-5-20251001` puede hacer a 10x menor costo?
- Clasifica la complejidad de la tarea: extracción/clasificación simple → Haiku; razonamiento/generación → Sonnet; multi-paso complejo → Opus

**Formato de salida:**

```
## Resumen de auditoría de tokens
| Problema | Ubicación | Impacto de tokens est. | Prioridad |
|----------|-----------|------------------------|-----------|
| ...      | ...       | ...                    | A/M/B     |

## Prompt / cadena optimizada
<versión completamente reescrita con cambios aplicados>

## Configuración de caché
<fragmento de array de mensajes mostrando la ubicación de cache_control, si es aplicable>

## Ahorros estimados
Antes: ~N tokens/llamada  →  Después: ~M tokens/llamada  (~X% reducción)
A 1000 llamadas/día en [modelo]: $Y/mes de ahorros
```

Aplica todas las correcciones de alta prioridad directamente en la salida. Explica elementos de prioridad media/baja pero no apliques sin preguntar.
