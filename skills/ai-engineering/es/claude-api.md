> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../claude-api.md).

# Skill de Claude API

## Cuándo activar
- Escribir código que llama a la API de Claude de Anthropic (SDK de Python o TypeScript)
- Implementar caché de prompts, streaming o procesamiento por lotes
- Diseñar la gestión de conversaciones multi-turno
- Seleccionar el modelo de Claude adecuado (Haiku, Sonnet, Opus) para una tarea
- Agregar uso de herramientas / llamadas a funciones a una integración de Claude
- Optimizar el costo o la latencia en una aplicación Claude de producción

## Cuándo NO usar
- APIs de OpenAI u otros proveedores — SDK diferente, patrones diferentes
- Consejos genéricos sobre LLM no relacionados con la API de Anthropic
- Proyectos que ya usan abstracciones de LangChain o LlamaIndex — abordar la capa de abstracción directamente

## Instrucciones

### Guía de selección de modelos
| Modelo | Usar cuando | Evitar cuando |
|-------|----------|------------|
| `claude-haiku-4-5-20251001` | Clasificación, extracción, routing, Q&A simple, alto volumen bajo costo | Razonamiento complejo, generación de código multi-paso |
| `claude-sonnet-4-6` | Uso general: código, análisis, escritura, flujos de trabajo agénticos | Presupuestos de tokens muy ajustados a escala masiva |
| `claude-opus-4-7` | Razonamiento de nivel experto, juicio matizado, contenido largo complejo | La mayoría de tareas — Sonnet suele ser suficiente |

### Llamada básica a messages (Python)
```python
import anthropic

client = anthropic.Anthropic()  # lee ANTHROPIC_API_KEY del entorno

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a helpful assistant specialized in Python.",
    messages=[
        {"role": "user", "content": "Explain Python's GIL in 3 sentences."}
    ]
)
print(message.content[0].text)
```

### Caché de prompts (crítico para el costo)
La caché de prompts puede reducir costos hasta un 90% para contexto repetido. Cachea contenido estable (prompts de sistema, documentos grandes, ejemplos few-shot).

```python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a code review assistant. Here are our coding standards: ...",
            "cache_control": {"type": "ephemeral"}  # Cachear este bloque
        }
    ],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": large_document,
                    "cache_control": {"type": "ephemeral"}  # También cachear el documento
                },
                {
                    "type": "text",
                    "text": "Summarize the key points."
                }
            ]
        }
    ]
)
# Verificar uso de caché en la respuesta
print(message.usage.cache_read_input_tokens)   # tokens leídos de la caché
print(message.usage.cache_creation_input_tokens)  # tokens escritos en la caché
```

Reglas de caché:
- Bloque mínimo cacheable: 1024 tokens (Sonnet/Opus), 2048 tokens (Haiku)
- TTL de caché: 5 minutos
- Solo el último bloque `cache_control` en un array de mensajes importa — los puntos de caché son acumulativos

### Streaming
```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# O con eventos:
with client.messages.stream(...) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="")
        elif event.type == "message_stop":
            print()  # nueva línea al terminar
```

### Uso de herramientas
```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Paris?"}]
)

# Verificar si Claude quiere usar una herramienta
if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    tool_result = call_tool(tool_use.name, tool_use.input)

    # Continuar la conversación con el resultado de la herramienta
    follow_up = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What's the weather in Paris?"},
            {"role": "assistant", "content": response.content},
            {
                "role": "user",
                "content": [{
                    "type": "tool_result",
                    "tool_use_id": tool_use.id,
                    "content": json.dumps(tool_result)
                }]
            }
        ]
    )
```

### Conversación multi-turno
```python
class Conversation:
    def __init__(self, system: str, model: str = "claude-sonnet-4-6"):
        self.client = anthropic.Anthropic()
        self.model = model
        self.system = system
        self.messages: list[dict] = []

    def chat(self, user_message: str, max_tokens: int = 1024) -> str:
        self.messages.append({"role": "user", "content": user_message})
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=self.system,
            messages=self.messages,
        )
        assistant_message = response.content[0].text
        self.messages.append({"role": "assistant", "content": assistant_message})
        return assistant_message
```

### Procesamiento por lotes
```python
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

requests = [
    Request(
        custom_id=f"review-{i}",
        params=MessageCreateParamsNonStreaming(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            messages=[{"role": "user", "content": f"Classify: {review}"}],
        )
    )
    for i, review in enumerate(reviews)
]

batch = client.messages.batches.create(requests=requests)
print(f"Batch ID: {batch.id}")

# Sondear resultados (o usar webhooks)
import time
while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    time.sleep(60)

for result in client.messages.batches.results(batch.id):
    print(result.custom_id, result.result.message.content[0].text)
```

### Manejo de errores y reintentos
```python
from anthropic import APIStatusError, APITimeoutError, RateLimitError

def call_with_retry(client, **kwargs, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except RateLimitError:
            wait = 2 ** attempt
            time.sleep(wait)
        except APITimeoutError:
            if attempt == max_retries - 1:
                raise
            time.sleep(1)
        except APIStatusError as e:
            if e.status_code >= 500 and attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise
```

### Lista de verificación de optimización de costos
- Usar Haiku para clasificación, routing y tareas de extracción simple
- Habilitar caché de prompts para cualquier prompt de sistema > 1024 tokens
- Usar la API de lotes para cargas de trabajo offline/asíncronas — 50% de reducción de costo
- Establecer `max_tokens` al mínimo necesario — pagas por los tokens de salida generados
- Cachear documentos grandes en el mensaje del usuario, no solo en el prompt del sistema
- Monitorear la relación `cache_read_input_tokens` vs `input_tokens` — objetivo >80% para contextos estables

## Ejemplo

**Usuario:** Construir una clase Python que clasifica tickets de soporte al cliente en categorías usando Claude, con caché de prompts para la lista de categorías y streaming para la explicación.

**Salida esperada:**
- Clase `TicketClassifier` con `ANTHROPIC_API_KEY` del entorno
- Prompt de sistema con todas las categorías cacheadas mediante `cache_control: ephemeral`
- `classify(ticket_text)` → devuelve `{category: str, confidence: str}` parseado de salida estructurada
- `classify_and_explain(ticket_text)` → transmite la explicación a stdout
- Usa `claude-haiku-4-5-20251001` para clasificación (eficiente en costo), `claude-sonnet-4-6` para explicación

---
