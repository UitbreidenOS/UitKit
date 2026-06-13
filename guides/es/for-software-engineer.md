# Claude para Ingenieros de Software

Todo lo que un Ingeniero de Software o Desarrollador Full-Stack necesita para ejecutar desarrollo de funciones, revisión de código, depuración, documentación de arquitectura y toma de decisiones técnicas aumentados por IA en Claude Code.

---

## Para quién es esta guía

Eres un ingeniero de software, desarrollador full-stack o líder técnico cuyo trabajo consiste en entregar código confiable — diseñar sistemas, escribir funciones, revisar PRs, corregir errores y evitar que la deuda técnica se acumule. Pasas demasiado tiempo cambiando de contexto entre herramientas, escribiendo código repetitivo y generando documentación manualmente. Claude Code reduce esa sobrecarga en 20-40x.

**Antes de Claude Code:** 45 minutos para revisar un PR complejo. 2 horas para depurar un problema de producción sin un stack trace obvio. Decisiones de arquitectura documentadas semanas después, si acaso. Incorporar a un nuevo compañero de equipo lleva una semana completa.

**Después:** PR revisado con comentarios en línea en menos de 5 minutos. Causa raíz identificada en una sesión de depuración. ADRs escritos en el momento de la decisión. Documento de incorporación generado a partir del código base en 30 segundos.

---

## Instalación en 30 segundos

```bash
# Instalar conjuntos de habilidades por disciplina
npx claudient add skills backend
npx claudient add skills devops-infra
npx claudient add skills ai-engineering
npx claudient add skills database
npx claudient add skills productivity

# O seleccionar lo que necesitas:
npx claudient add skill backend/next-js
npx claudient add skill backend/fastapi
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/pr-review
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/ship-gate
npx claudient add skill productivity/tech-debt-tracker
npx claudient add skill ai-engineering/claude-api
npx claudient add skill ai-engineering/rag-architect
npx claudient add skill ai-engineering/mcp-server-builder
npx claudient add skill database/drizzle
npx claudient add skill database/postgres
```

---

## Tu stack de ingeniería con Claude Code

### Habilidades (comandos slash)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/next-js` | Scaffolding de Next.js App Router, patrones RSC, enrutamiento, rutas de API, acciones de servidor | Construir o extender aplicaciones Next.js |
| `/fastapi` | Generación de endpoints FastAPI, esquemas Pydantic, inyección de dependencias, tareas en segundo plano | Desarrollo de APIs en Python |
| `/docker` | Creación de Dockerfiles, compilaciones multi-etapa, archivos Compose, optimización de imágenes | Contenedorizar servicios |
| `/kubernetes` | Generación de manifiestos, estrategias de despliegue, revisión de charts de Helm, límites de recursos | Configuración de K8s y revisiones de despliegue |
| `/terraform` | Módulos de infraestructura como código, revisión de planes, orientación sobre gestión de estado | Aprovisionamiento de infraestructura en la nube |
| `/code-review` | Revisión profunda de corrección: errores, fallos de lógica, casos límite, problemas de seguridad | Revisar tu propio código antes de hacer push |
| `/debug` | Análisis sistemático de causa raíz — stack traces, registros, hipótesis, pasos de reproducción | Cualquier error que no sea obvio en 10 minutos |
| `/refactor` | Refactorización estructurada con diff antes/después y análisis de impacto en pruebas | Limpiar código sin romper el comportamiento |
| `/pr-review` | Resumen del PR, calificación de riesgo, generación de comentarios en línea, recomendación de fusión | Revisar PRs entrantes |
| `/adr-writer` | Generación de Architecture Decision Record a partir de un contexto y una decisión | Documentar decisiones arquitectónicas en el momento de tomarlas |
| `/ship-gate` | Lista de verificación previa a la fusión: pruebas, cobertura, seguridad, rendimiento, documentación | Verificación final antes de fusionar con main |
| `/tech-debt-tracker` | Identificar, categorizar y priorizar la deuda técnica en un código base | Sesiones trimestrales de planificación de deuda |
| `/claude-api` | Integración de la API de Claude y el SDK de Anthropic con caché de prompts, uso de herramientas y streaming | Construir funciones sobre Claude |
| `/rag-architect` | Diseño de pipelines RAG: fragmentación, embeddings, recuperación, reordenamiento | Construir funciones de recuperación de conocimiento |
| `/mcp-server-builder` | Andamiar y conectar un servidor Model Context Protocol | Extender Claude con herramientas personalizadas |
| `/drizzle` | Diseño de esquemas Drizzle ORM, migraciones, generación de consultas, relaciones | Trabajo de base de datos en TypeScript |
| `/postgres` | Optimización de consultas, diseño de esquemas, estrategia de indexación, análisis EXPLAIN | Trabajo con bases de datos PostgreSQL |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `core/architect` | Opus | Decisiones de diseño de sistemas, arquitectura entre servicios, refactorizaciones importantes |
| `core/code-reviewer` | Sonnet | Revisión profunda de PRs, auditorías de corrección, verificación de lógica |
| `core/security-reviewer` | Sonnet | Auditorías de seguridad, revisión de dependencias, modelado de amenazas |
| `core/planner` | Sonnet | Desglosar epics en tareas, planificación de sprints, estimación |
| `roles/senior-backend` | Sonnet | Implementación de backend, diseño de API, ajuste de rendimiento |
| `roles/senior-frontend` | Sonnet | Implementación de UI/UX, arquitectura de componentes, accesibilidad |
| `roles/fullstack-developer` | Sonnet | Funciones que abarcan frontend y backend con tipos compartidos |
| `build-resolvers/typescript-resolver` | Haiku | Errores de compilación de TypeScript, fallos de inferencia de tipos, problemas de tsconfig |
| `build-resolvers/python-resolver` | Haiku | Errores de importación de Python, conflictos de dependencias, problemas de entorno virtual |

---

## Flujo de trabajo diario

### Por la mañana — carga de contexto (10-15 minutos)

**1. Orientarse sobre lo que cambió durante la noche**
```
/pr-review

Lista todos los PRs abiertos en main. Para cada uno:
- Resumen de una línea de lo que hace
- Calificación de riesgo (bajo / medio / alto)
- Si necesita mi revisión hoy
```

**2. Cargar contexto en tu rama de función actual**
```
/adr-writer

Estoy retomando el trabajo en [nombre de la función].
Aquí está el diff de la rama: [pegar git diff o describir el estado]

Resume qué se ha decidido, qué está pendiente,
y señala cualquier decisión que necesite tomar antes de escribir más código.
```

---

### Desarrollo de funciones (continuo)

**3. Andamiar un nuevo endpoint o componente**
```
/fastapi

Agrega un endpoint POST /api/v1/documents/ingest:
- Auth: token Bearer, validar contra la tabla de usuarios
- Body: { source_url: str, metadata: dict }
- Tarea en segundo plano: obtener contenido, fragmentar, embeber, almacenar en pgvector
- Respuesta: { job_id: uuid, status: "queued" }

Usa el patrón de inyección de dependencias existente en app/dependencies.py.
```

**4. Revisar tu propio código antes de hacer push**
```
/code-review

[pegar el diff o describir el archivo]

Verificar:
- Errores de corrección y casos límite
- Riesgos de inyección SQL o bypass de autenticación
- Consultas N+1 o índices faltantes
- Manejo de errores faltante
- Cualquier lógica que falle bajo concurrencia
```

---

### Revisión de PRs (5-10 minutos por PR)

**5. Revisar un PR entrante**
```
/pr-review

PR: [título o enlace]
Autor: [nombre]
Diff:
[pegar diff]

Dame:
- Lo que hace este PR en 2-3 oraciones
- Calificación de riesgo y por qué
- Cualquier error o problema de corrección
- Comentarios en línea que debería publicar
- Recomendación de fusión
```

---

### Depuración (bajo demanda)

**6. Diagnosticar un error sistemáticamente**
```
/debug

Error:
[pegar stack trace o describir el síntoma]

Contexto:
- Entorno: [producción / staging / local]
- Cuándo empezó: [despliegue, cambio de configuración, evento de datos]
- Frecuencia: [cada solicitud / intermitente / bajo carga]
- Lo que ya he verificado: [lista]

Guíame a través del aislamiento de la causa raíz paso a paso.
```

---

### Arquitectura y documentación

**7. Documentar una decisión en el momento de tomarla**
```
/adr-writer

Decisión: Cambiar de REST a tRPC para la comunicación interna entre servicios
Contexto: Tenemos 4 servicios compartiendo tipos de TypeScript. REST está generando deriva.
Alternativas consideradas: GraphQL, gRPC, REST simple con paquete de tipos compartidos
Decisión: tRPC — mismo lenguaje, cero deriva de esquemas, seguridad de tipos de extremo a extremo
Consecuencias: El equipo de frontend necesita actualizar, todos los clientes REST existentes se deprecan

Escribe el ADR en formato estándar.
```

**8. Sesión semanal de deuda técnica**
```
/tech-debt-tracker

Escanea los siguientes archivos/directorios en busca de deuda técnica:
[pegar lista de archivos o describir el área]

Categoriza por:
- Riesgo de corrección (¿esto se romperá?)
- Arrastre de velocidad (¿está ralentizando el desarrollo?)
- Exposición de seguridad
- Costo de mantenimiento

Genera una entrada priorizada en el backlog para cada elemento.
```

---

## Plan de incorporación de 30 días (ingenieros nuevos en Claude Code)

### Semana 1 — Instalación y primeras victorias
- Instalar todos los conjuntos de habilidades: `npx claudient add skills backend devops-infra productivity`
- Configurar el MCP de GitHub (ver integraciones de herramientas a continuación)
- Ejecutar `/pr-review` en los últimos 5 PRs fusionados en tu repositorio — calibrar con los patrones de tu código base
- Usar `/debug` en el error más reciente que resolviste manualmente — ver qué habría detectado más rápido
- Usar `/code-review` en tu próximo PR antes de hacer push — encontrar al menos un problema que habrías pasado por alto

### Semana 2 — Integración del flujo de trabajo diario
- Empezar cada mañana con un escaneo de la cola de PRs usando `/pr-review`
- Usar `/fastapi` o `/next-js` para cada nuevo andamiaje de endpoint o página — sin síndrome de la página en blanco
- Escribir tu primer ADR con `/adr-writer` — cualquier decisión tomada esta semana califica
- Ejecutar `/ship-gate` en tu próximo PR antes de solicitar revisión

### Semana 3 — Automatización más profunda
- Configurar el hook de Sentry (ver integraciones de herramientas a continuación) para que el contexto de los errores llegue a Claude automáticamente
- Ejecutar `/tech-debt-tracker` en el área del código base que te pertenece
- Usar `core/architect` para cualquier decisión de diseño que involucre más de 2 servicios
- Activar `build-resolvers/typescript-resolver` para el próximo error de compilación de TypeScript — deja de leer texto rojo manualmente

### Semana 4 — Apalancamiento del equipo
- Ejecutar `/pr-review` en cada PR antes de aprobarlo — publicar los comentarios en línea generados por Claude directamente
- Usar `core/planner` para desglosar tu próximo epic en una lista de tareas del tamaño de un sprint
- Programar una sesión trimestral de deuda técnica con `/tech-debt-tracker` en todo el repositorio
- Medir: rastrear el tiempo de revisión de PRs, el tiempo de resolución de errores y la cobertura de documentación antes y después

---

## Integraciones de herramientas

### GitHub MCP (recomendado)

```json
// Agregar a ~/.claude/settings.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Con esta conexión, Claude puede:
- Leer diffs de PRs, comentarios e hilos de revisión sin copiar y pegar
- Publicar comentarios de revisión en línea directamente en GitHub
- Leer descripciones de problemas y vincularlos a cambios de código
- Verificar el estado de CI y mostrar la salida de pruebas fallidas

### Jira / Linear MCP

```json
// Linear — agregar a ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Con esta conexión, Claude puede:
- Leer descripciones de tickets al planificar la implementación
- Actualizar el estado de los tickets y agregar notas de ingeniería
- Vincular PRs a problemas automáticamente durante las sesiones de `/pr-review`
- Generar resúmenes de sprint a partir de tickets completados

### Hook de Sentry (contexto automático de errores)

Configura un hook que canalice el contexto de las alertas de Sentry a Claude antes de una sesión de `/debug`:

```json
// Agregar a .claude/settings.json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "sentry",
        "command": "python .claude/hooks/sentry-context.py"
      }
    ]
  }
}
```

El hook obtiene el evento completo de Sentry — stack trace, breadcrumbs, etiquetas, usuarios afectados — y lo antepone a tu sesión de `/debug` automáticamente. Sin copiar y pegar manualmente desde el panel de Sentry.

---

## Métricas de referencia

Estos son resultados observados de equipos de ingeniería que usan el stack completo de Claudient. Los resultados individuales varían según la complejidad del código base y la adopción del flujo de trabajo.

| Métrica | Antes de Claude Code | Después de Claude Code |
|---|---|---|
| Tiempo de revisión de PRs (promedio) | 35-50 min | 5-8 min |
| Tiempo de resolución de errores (P2) | 2-4 horas | 25-45 min |
| Cobertura de ADRs (decisiones documentadas) | 20-30% | 85-95% |
| Tiempo para andamiar un nuevo endpoint | 20-30 min | 3-5 min |
| Tiempo de incorporación (nuevo ingeniero hasta el primer PR) | 5-7 días | 2-3 días |
| Elementos del backlog de deuda técnica identificados/trimestre | 10-20 (manual) | 60-100 (escaneo automatizado) |
| Tiempo de resolución de errores de compilación | 15-30 min | 3-8 min |

---

## Recursos

- [Primeros pasos con Claude Code](./getting-started.md)
- [Configuración de GitHub MCP](../mcp/github.md)
- [Configuración de Jira MCP](../mcp/jira.md)
- [Flujo de trabajo de revisión de código](../workflows/code-review.md)
- [Habilidad de escritura de ADR](../skills/productivity/adr-writer.md)
- [Habilidad de arquitectura RAG](../skills/ai-engineering/rag-architect.md)
- [Habilidad de construcción de servidor MCP](../skills/ai-engineering/mcp-server-builder.md)

---
