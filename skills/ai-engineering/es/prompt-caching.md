# Almacenamiento en Caché de Prompts

## Cuándo activar
Uso de Claude API con bloques de contexto grandes repetidos — avisos del sistema, documentos antepuestos, definiciones grandes de herramientas — o cuando el usuario quiere reducir costos de API o latencia para cargas de trabajo que reutilizan el mismo contexto en múltiples llamadas.

## Cuándo NO usar
- Llamadas de API de una sola vez sin contexto repetido
- Conversaciones donde el aviso del sistema cambia cada solicitud
- Contextos más pequeños que 1024 tokens (Claude 3) o 2048 tokens (Claude 3.5+ Haiku) — por debajo de estos umbrales, el almacenamiento en caché no tiene efecto

## Instrucciones

### Cómo Funciona el Almacenamiento en Caché de Prompts
Los puntos de corte de caché marcan bloques de contenido como elegibles para almacenamiento en caché. Cuando la infraestructura de Anthropic ve el mismo prefijo nuevamente (hasta el punto de corte), lo lee desde caché en lugar de reprocesarlo.

- **Costo de escritura en caché:** 1.25× precio del token de entrada estándar
- **Costo de lectura en caché:** 0.1× precio del token de entrada estándar
- **Punto de equilibrio:** ~9 lecturas del mismo contenido
- **TTL predeterminado:** 5 minutos
- **TTL extendido:** 1 hora — establecer `ENABLE_PROMPT_CACHING_1H=1` como variable de entorno (beta)

### Sintaxis de cache_control
Agregar `"cache_control": {"type": "ephemeral"}` al último bloque de contenido que quieres incluir en el prefijo de caché:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "<your large system prompt here — must be >1024 tokens to cache>",
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=[{"role": "user", "content": "What does the system prompt say about X?"}],
)
```

### Dónde Colocar Puntos de Corte

**Aviso del sistema (siempre cachear si >1024 tokens):**
```python
system=[
    {"type": "text", "text": base_instructions},          # not cached
    {"type": "text", "text": large_doc, "cache_control": {"type": "ephemeral"}},  # cache up to here
]
```

**Documento grande antepuesto a la conversación:**
```python
messages=[
    {
        "role": "user",
        "content": [
            {"type": "text", "text": large_reference_doc, "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": "Now answer this question about the document above: ..."},
        ],
    }
]
```

**Definiciones de herramientas (cachear cuando se usan muchas herramientas):**
```python
tools=[
    # ... all your tool definitions ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "cache_control": {"type": "ephemeral"},  # cache everything up to and including this tool
    }
]
```

### Almacenamiento en Caché Multi-Turno
En una conversación multi-turno, el array de mensajes crece con cada turno. Colocar el punto de corte de caché al final del array de herramientas o aviso del sistema — el array de mensajes es manejado automáticamente por la infraestructura de almacenamiento en caché de Anthropic a medida que la conversación crece.

No agregar `cache_control` a cada mensaje — agregarlo solo al contenido estático grande en la parte superior del contexto. Anthropic cachea todo hasta el último punto de corte en el prefijo.

### Medición de Eficacia de Caché
Verificar `usage` en la respuesta:
```python
print(response.usage)
# Usage(
#   input_tokens=850,
#   cache_creation_input_tokens=12500,   # tokens written to cache (first call)
#   cache_read_input_tokens=12500,       # tokens read from cache (subsequent calls)
#   output_tokens=200
# )
```

Una sesión multi-turno saludable debe mostrar `cache_creation_input_tokens > 0` solo en la primera llamada y `cache_read_input_tokens > 0` en todas las llamadas posteriores.

### Ejemplo de Cálculo de Costo
Aviso del sistema: 15,000 tokens. 50 mensajes de usuario procesados por hora.

| Scenario | Cost per call | Cost/hour (50 calls) |
|---|---|---|
| No caching | 15,000 × $3/MTok | $2.25 |
| With caching (after break-even) | 15,000 × $0.30/MTok | $0.225 |

Reducción de costo 10× para contexto grande y frecuentemente reutilizado.

### Errores Comunes
- Colocar el punto de corte demasiado temprano — contenido después del punto de corte se reprocesa cada llamada
- Agregar puntos de corte dentro del array de mensajes en turnos cortos — el tamaño cacheable mínimo no se alcanzará
- Olvidar que el TTL de caché es 5 minutos — un trabajo por lote de 10 minutos perderá el caché a mitad de camino (usar TTL extendido)
- Usar almacenamiento en caché para contenido único por solicitud — el almacenamiento en caché solo ayuda cuando el prefijo es idéntico en las llamadas

## Ejemplo

Un sistema de Q&A de documentos procesa 200 preguntas contra el mismo PDF de 80 páginas por día:

```python
# Load and cache the document once per session
doc_text = extract_text_from_pdf("report.pdf")  # ~50,000 tokens

def ask_question(question: str) -> str:
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"<document>\n{doc_text}\n</document>",
                        "cache_control": {"type": "ephemeral"},
                    },
                    {"type": "text", "text": question},
                ],
            }
        ],
    )
    return response.content[0].text

# Call 1: cache_creation_input_tokens=50000 (1.25× price)
# Calls 2-200: cache_read_input_tokens=50000 (0.1× price)
# Net savings vs no caching: ~88% on document tokens
```

---
