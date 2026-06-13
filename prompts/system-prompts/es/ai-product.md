> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../ai-product.md).

# CLAUDE.md Starter — Producto de IA

Copia esto en el `CLAUDE.md` de tu proyecto y completa las secciones entre corchetes.

---

```markdown
# [Nombre del Proyecto] — Instrucciones para Claude Code

## Qué es esto
[Un párrafo: qué hace el producto de IA, qué modelo usa, quiénes son los usuarios]

## Stack
- Lenguaje: [TypeScript / Python]
- Framework: [Next.js / FastAPI]
- IA: [Claude API via Anthropic SDK / OpenAI / Gemini]
- Modelo: [claude-sonnet-4-6 / claude-opus-4-7 / claude-haiku-4-5]
- Base de datos: [PostgreSQL / Supabase]
- BD Vectorial: [Pinecone / pgvector / Weaviate] (si aplica)
- Despliegue: [Vercel / AWS / Railway]

## Estructura del proyecto
src/
├── app/          ← Rutas del router de Next.js / FastAPI
├── ai/           ← Todo el código relacionado con IA: prompts, chains, herramientas
│   ├── prompts/  ← Prompts de sistema y plantillas de prompts
│   ├── tools/    ← Definiciones de herramientas para function calling
│   └── agents/   ← Definiciones de agentes y orquestación
├── db/           ← Consultas a la base de datos y migraciones
├── services/     ← Lógica de negocio
└── utils/        ← Utilidades puras

## Convenciones de IA
- Todos los prompts de sistema viven en src/ai/prompts/ — nunca inline en los route handlers
- Siempre fija la versión del modelo — nunca uses el alias "latest"
- Siempre habilita el caché de prompts en los prompts de sistema (cache_control: ephemeral)
- Registra el uso de tokens por solicitud para seguimiento de costos
- Respuestas con streaming: usa SSE para respuestas > 1000 tokens
- Nunca pases PII del usuario al modelo a menos que la funcionalidad lo requiera explícitamente
- Las definiciones de herramientas viven en src/ai/tools/ — un archivo por herramienta

## Configuración de caché de prompts
- Los prompts de sistema deben usar cache_control para habilitar el caché
- Lectura de caché = $0.30/MTok vs sin caché = $3/MTok — siempre cachea
- Invalida el caché cuando el prompt de sistema cambia (automático al cambiar el contenido)

## Controles de costo
- Modelo por defecto: [claude-haiku-4-5] para tareas simples, [claude-sonnet-4-6] para complejas
- Tokens máximos: establece max_tokens explícito en cada solicitud — nunca ilimitado
- Límite de tasa: [X] solicitudes por usuario por minuto
- Alerta de presupuesto: registra cuando una sesión individual supera $[X]

## Decisiones (no re-discutir)
- [Justificación de la selección del modelo]
- [Por qué streaming vs. no-streaming]
- [Estrategia de ventana de contexto: resumir en N tokens]
- [Tool calling vs. generación directa para salida estructurada]

## Testing
- Pruebas unitarias para construcción de prompts y parseo de salida
- Pruebas de integración con respuestas de API grabadas (VCR / fixtures)
- Nunca hagas llamadas reales a la API en pruebas — cuesta dinero y es lento
- Prueba entradas adversariales: inyección de prompts, intentos de jailbreak, casos límite

## Comandos
- [comando de desarrollo]
- [comando de pruebas]
- [comando de despliegue]

## Nunca hacer
- Nunca pongas prompts de sistema inline en los route handlers
- Nunca hagas llamadas de IA sin límite sin max_tokens
- Nunca registres respuestas completas de IA en producción (pueden contener PII del usuario)
- Nunca hardcodees claves de API — usa variables de entorno
- Nunca llames al modelo de IA directamente desde componentes de UI
```

---
