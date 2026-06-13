# Guía de optimización de tokens

Cómo reducir los costes de Claude Code y mejorar la velocidad de respuesta sin sacrificar la calidad de salida.

---

## El principio fundamental

Cada token en la ventana de contexto de Claude Code cuesta dinero y ralentiza las respuestas. El objetivo es mantener la ventana de contexto ligera — solo lo que Claude necesita para realizar bien la tarea actual.

Hay cuatro palancas:
1. **Selección de modelo** — hacer coincidir el modelo correcto con la tarea
2. **Gestión de contexto** — controlar qué hay en la ventana
3. **Disciplina MCP** — limitar la sobrecarga de herramientas
4. **Estrategia de compactación** — cuándo y cómo comprimir el historial

---

## 1. Selección de modelo

Claude Code soporta múltiples modelos. Elegir el modelo equivocado para una tarea es el error más costoso.

| Modelo | Mejor para | Coste relativo |
|---|---|---|
| Claude Haiku 4.5 | Ediciones simples, tareas de un solo archivo, operaciones repetitivas, resumen | Más bajo |
| Claude Sonnet 4.6 | La mayoría del trabajo de desarrollo — cambios multi-archivo, depuración, revisión de código | Medio |
| Claude Opus 4.7 | Decisiones de arquitectura complejas, análisis de seguridad, orquestación multi-agente | Más alto |

**Reglas generales:**
- Por defecto Sonnet 4.6 para desarrollo general
- Cambiar a Haiku 4.5 para: correcciones de linting, formateo, renombrados simples, ediciones de funciones únicas, generación de boilerplate desde una plantilla
- Escalar a Opus 4.7 solo cuando: el problema requiere razonamiento profundo sobre muchos archivos, se involucran decisiones de seguridad, o estás orquestando múltiples sub-agentes

**Haiku ahorra ~60% vs Sonnet en tareas elegibles.**

---

## 2. Gestión de la ventana de contexto

La ventana de contexto de Claude Code es grande (hasta 1M tokens en Opus 4.7 y Sonnet 4.6), pero la ventana **utilizable** es más pequeña una vez que se tiene en cuenta la sobrecarga.

### Qué consume contexto

| Fuente | Coste aproximado |
|---|---|
| Herramientas MCP (10 habilitadas) | ~30k tokens |
| CLAUDE.md (proyecto + usuario) | 1k–10k tokens |
| Historial de conversación | Crece con cada turno |
| Contenidos de archivos leídos en contexto | Variable — a menudo el factor más grande |
| Prompt del sistema | ~5k–10k tokens |

### Mantener el contexto ligero

**CLAUDE.md:**
- Mantén el CLAUDE.md del proyecto bajo 500 líneas
- Elimina reglas que ya no aplican al estado actual del proyecto
- No dupliques contenido del CLAUDE.md a nivel usuario en el CLAUDE.md a nivel proyecto

**Lecturas de archivos:**
- Pide a Claude que lea rangos de líneas específicos en lugar de archivos completos cuando sea posible
- Evita leer el mismo archivo grande varias veces en una sesión
- Usa sub-agentes para tareas aisladas — obtienen una ventana de contexto fresca

**Historial de conversación:**
- Las sesiones largas acumulan contexto muerto
- Activa la compactación de forma proactiva en lugar de esperar al umbral automático

---

## 3. Disciplina MCP

Cada servidor MCP habilitado carga sus definiciones de herramientas en el contexto al inicio de la sesión. Con 10 servidores MCP y ~8 herramientas cada uno, estás consumiendo ~80 slots de herramientas — aproximadamente 30k tokens antes de haber escrito una palabra.

**Audita tus MCPs activos:**
- Solo habilita MCPs que uses en el proyecto actual
- Deshabilita MCPs específicos de dominio (ej. base de datos, cloud) cuando no trabajes en ese dominio
- Comprueba `.claude/settings.json` y `~/.claude/settings.json` para servidores habilitados

---

## 4. Estrategia de compactación

Claude Code compacta el historial de conversación automáticamente cuando el contexto se acerca a su límite. El umbral predeterminado es tardío — se activa al ~95% de capacidad.

### Activar la compactación antes

Usa el comando `/compact` manualmente antes de comenzar una nueva tarea importante.

**Cuándo compactar manualmente:**
- Antes de cambiar de una tarea importante a otra en la misma sesión
- Después de una larga sesión de depuración con muchos intentos fallidos en el historial
- Antes de comenzar una tarea que requerirá leer muchos archivos grandes

### Qué hace la compactación

La compactación resume el historial de conversación y lo reemplaza con una representación comprimida. Pierdes el historial exacto turno a turno pero conservas las decisiones, el código escrito y el contexto clave.

**Hook pre-compact:** Usa un hook `PreCompact` para guardar el estado crítico de la sesión en un archivo antes de que se active la compactación.

---

## 5. Eficiencia de prompts

**Sé específico sobre el alcance:**

En lugar de: "Arregla la autenticación"
Usa: "Arregla la comprobación de expiración JWT en `auth/middleware.py:45` — no está rechazando tokens con `exp` en el pasado"

**Limita la longitud de respuesta cuando sea apropiado:**

Para tareas donde necesitas un cambio de código pero no una explicación: "Haz el cambio, no se necesita explicación."

**Agrupa solicitudes relacionadas:**

En lugar de cinco solicitudes separadas de "añade un test para X", di "añade tests para las cinco funciones en `utils.py`."

---

## 6. Aislamiento de contexto de sub-agentes

Los sub-agentes obtienen una ventana de contexto fresca. Esta es una de las técnicas de optimización más infrautilizadas.

**Usa sub-agentes cuando:**
- Una tarea es autónoma (entradas claras, salidas claras)
- La tarea requiere leer muchos archivos no relevantes para el resto de la sesión
- Estás haciendo algo repetitivo en múltiples archivos

---

## 7. Seguimiento de costes

Usa un hook `PostToolUse` para registrar el uso de herramientas y estimar costes por sesión.

Ver `hooks/lifecycle/cost-tracker.sh` para una implementación lista para usar.

---

## Referencia rápida

| Situación | Acción |
|---|---|
| Edición simple de un solo archivo | Cambiar a Haiku 4.5 |
| Sesión larga que se vuelve lenta | Compactar manualmente (`/compact`) |
| Comenzar una nueva tarea importante | Compactar primero, luego empezar |
| Trabajando en un dominio que no tocarás | Deshabilitar MCPs del dominio |
| La tarea es autónoma | Usar un sub-agente |
| Solicitud vaga produciendo respuestas largas | Reescribir como prompt específico y delimitado |
| CLAUDE.md con más de 500 líneas | Auditar y eliminar reglas obsoletas |

---

## Trabaja con nosotros
