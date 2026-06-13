# SDK del Agente Claude

## Cuándo activar
Construir una aplicación Python o TypeScript que utiliza las capacidades de Claude Code de manera programática; desplegar Claude como agente autónomo dentro de un producto; escribir código que impulsa el CLI `claude` en modo no interactivo; script de flujos de trabajo agentic que necesitan llamadas de herramientas, reintentos y gestión de contexto manejados automáticamente.

## Cuándo NO usar
Usar Claude Code interactivamente en la terminal — esa es la experiencia predeterminada, no un caso de uso de SDK; crear un chatbot simple o interfaz de Q&A de turno único (usar directamente la API de Mensajes); cuando Anthropic Managed Agents es un mejor ajuste (infraestructura hospedada, escalado automático, persistencia de memoria integrada).

## Instrucciones

**Qué es el SDK del Agente :**
Mismo loop de herramientas, gestión de contexto y capacidades de agente que Claude Code interactivo — empaquetado como una biblioteca que incrusta en su propia aplicación. Usted controla la infraestructura; Anthropic proporciona el modelo y el loop de agente.

**SDK versus alternativas — elegir la capa correcta :**

| Necesidad | Usar |
|---|---|
| Incrustar Claude agentic en app, controlar infra | SDK del Agente |
| Claude agentic hospedado por Anthropic, ops sin intervención | Managed Agents |
| Respuestas de turno único, sin necesidad de loop de herramientas | API de Mensajes |
| Flujo de trabajo interactivo de terminal | CLI Claude Code |

**Instalación :**

Python :
```bash
pip install claude-code-sdk
```

TypeScript :
```bash
npm install @anthropic-ai/claude-code
```

**Bandera `--bare` mediante opciones :** Omite la carga de `CLAUDE.md` y el descubrimiento del servidor MCP. Use esto en contextos de CI y scripting donde la velocidad de inicio importa — aproximadamente 10× inicialización más rápida.

**Facturación (15 de junio de 2026+) :** Las sesiones del SDK del Agente extraen de un pool de créditos dedicados del SDK del Agente, separado de los límites de sesión interactiva.

**Herramientas en proceso :** Las herramientas se ejecutan en proceso en lugar de generar subprocesos. Use esto para llamadas de alta frecuencia donde la sobrecarga de subprocess se suma.

**Soporte de proveedor de nube :** AWS Bedrock, Google Vertex AI y Microsoft Azure AI Foundry son todos compatibles. Configure mediante variables de entorno — no se requieren cambios de código del SDK.

**Ejemplo de Python :**
```python
import asyncio
from claude_code_sdk import query, ClaudeCodeOptions

async def run_agent(task: str):
    options = ClaudeCodeOptions(system_prompt="You are a code reviewer.")
    async for message in query(prompt=task, options=options):
        if message.type == "result":
            print(message.result)

asyncio.run(run_agent("Review this PR diff and list security issues"))
```

**Ejemplo de TypeScript :**
```typescript
import { query, ClaudeCodeOptions } from "@anthropic-ai/claude-code";

const options: ClaudeCodeOptions = {
  systemPrompt: "You are a code reviewer.",
};

for await (const message of query({ prompt: "Review this PR diff", options })) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

**SDK del Agente versus Managed Agents — guía de decisión :**
- SDK del Agente: control total de infraestructura, se ejecuta en su CI/CD, cargas de trabajo sensibles a latencia, logging y observabilidad personalizados
- Managed Agents: Anthropic maneja crashes, escalado y persistencia de memoria; sin infraestructura que administrar; mejor para equipos no técnicos que despliegan agentes como una característica de producto

## Ejemplo

Un pipeline de revisión de código en CI: en cada evento de apertura de PR, un job de GitHub Actions llama al SDK del Agente con el diff del PR como prompt. El agente revisa el diff, llama a herramientas internas para verificar la base de datos de cobertura de pruebas, y publica un comentario de revisión estructurado de vuelta al PR a través de la API de GitHub. La bandera `--bare` mantiene el tiempo de inicio en frío por debajo de 2 segundos.

---
