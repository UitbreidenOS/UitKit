# Referencia de Frontmatter de Agente

Cada archivo de agente Claude Code comienza con un bloque de frontmatter YAML. Este bloque controla la identidad, el enrutamiento, la selección del modelo, el comportamiento de ejecución, el acceso a herramientas y la visualización. Esta referencia cubre todos los campos soportados con tipos, valores predeterminados y guía de uso.

---

## Campos obligatorios

### `name`

**Tipo:** `string` (kebab-case)
**Requerido:** Sí

El identificador utilizado para generar este agente mediante programación. Debe ser único en todos los archivos de agente del proyecto.

```yaml
name: security-auditor
```

Utilizado en:
```python
Agent(subagent_type="security-auditor", prompt="...")
```

Mantenga los nombres cortos, descriptivos e hiphenados. Evite números de versión o sufijos de entorno en el nombre — utilice archivos separados en su lugar.

---

### `description`

**Tipo:** `string`
**Requerido:** Sí
**Longitud máxima recomendada:** 200 caracteres

Descripción de una sola línea del dominio y propósito del agente. Utilizada por el enrutador de Claude para decisiones de delegación automática — esta es la señal principal que determina cuándo se selecciona este agente.

```yaml
description: "Audita código para vulnerabilidades del Top 10 de OWASP, exposición de secretos y riesgos de inyección. Activar para revisiones de seguridad antes de cualquier PR."
```

Escriba esto como si explicara a Claude cuándo delegar aquí. Las condiciones de activación específicas superan las descripciones genéricas de capacidad. Malo: `"Un agente de seguridad."` Bueno: `"Activar al revisar código de autenticación, puntos finales de API, o antes de fusionar cualquier PR que toque secretos, sesiones o manejo de entrada de usuario."`

---

## Campos de modelo

### `model`

**Tipo:** `string` — uno de `"haiku"`, `"sonnet"`, `"opus"`
**Predeterminado:** Hereda del modelo activo de la sesión padre

Anula el modelo utilizado para la ventana de contexto de este agente. No afecta a la sesión padre.

```yaml
model: opus
```

| Valor | Cuándo usar |
|-------|-------------|
| `"haiku"` | Tareas mecánicas: reformateo, renombrado, clasificación simple, generación de boilerplate. Reducción de costo ~60% vs Sonnet. |
| `"sonnet"` | Trabajo de desarrollo estándar. Buen equilibrio entre velocidad y razonamiento. |
| `"opus"` | Razonamiento complejo: análisis de seguridad, decisiones arquitectónicas, requisitos ambiguos, refactorizaciones multi-archivo con restricciones sutiles. |

Nunca use `"haiku"` para tareas que requieren juicio — análisis de seguridad, decisiones arquitectónicas, o cualquier cosa donde una respuesta incorrecta tiene consecuencias posteriores.

---

## Campos de ejecución

### `background`

**Tipo:** `boolean`
**Predeterminado:** `false`

Cuando es `true`, el agente siempre se ejecuta como una tarea de fondo no-bloqueante. La sesión padre continúa inmediatamente sin esperar a que el agente se complete.

```yaml
background: true
```

Utilice cuando:
- La salida del agente no es necesaria antes del siguiente paso del padre
- Está paralelizando múltiples agentes especializados
- La tarea es observabilidad/registro (logs de auditoría, escrituras de métricas) en lugar de toma de decisiones

Evite cuando:
- El padre necesita los hallazgos del agente para determinar su siguiente acción
- El agente escribe archivos que el padre leerá inmediatamente

---

### `isolation`

**Tipo:** `string` — `"worktree"` o ausente
**Predeterminado:** Ninguno (el agente se ejecuta en el directorio de trabajo actual)

Cuando se establece en `"worktree"`, Claude Code crea un árbol de trabajo git temporal para el agente. El agente opera en una copia aislada del repositorio. Si el agente no realiza cambios, el árbol de trabajo se limpia automáticamente al completarse.

```yaml
isolation: worktree
```

Utilice cuando:
- El agente realizará ediciones exploratorias que no deben afectar el árbol de trabajo a menos que se fusionen explícitamente
- Múltiples agentes se ejecutan en paralelo y no deben entrar en conflicto en los mismos archivos
- Desea una ruta de reversión limpia si los cambios del agente son insatisfactorios

**Advertencia:** Requiere un repositorio git. En directorios no-git, la creación del árbol de trabajo falla silenciosamente y el agente se ejecuta contra la copia de trabajo.

---

## Campos de solicitud

### `initialPrompt`

**Tipo:** `string`
**Predeterminado:** Ninguno

Una cadena enviada automáticamente como el primer turno del usuario cuando el agente se ejecuta como una sesión independiente (no como subagente). No tiene efecto cuando el agente se genera a través de `Agent(subagent_type="...")`.

```yaml
initialPrompt: "Está iniciando una sesión de auditoría de seguridad. Comience listando todos los archivos en /src/auth/ e identifique puntos de entrada que acepten entrada externa."
```

Utilice para agentes que actúan como puntos de entrada de proyecto o asistentes interactivos que los usuarios lanzan directamente en lugar de a través de un orquestador padre.

---

## Campos de visualización

### `color`

**Tipo:** `string` — nombre de color CSS o valor hexadecimal
**Predeterminado:** Ninguno (utiliza la predeterminación de terminal)

Establece el color de visualización para la salida de este agente en la CLI. Puramente cosmético — no tiene efecto en el comportamiento.

```yaml
color: "#ff4444"
```

Útil cuando se ejecutan múltiples agentes en paralelo y necesita distinguir visualmente sus flujos de salida. Acepta nombres de color CSS estándar (`"red"`, `"dodgerblue"`) o cadenas hexadecimales (`"#ff4444"`).

---

## Campos de gancho

### `hooks`

**Tipo:** `object`
**Predeterminado:** Ninguno

Define ganchos con alcance exclusivo a este agente. Misma estructura que los ganchos de nivel de sesión en `settings.json`. Los ganchos definidos aquí se activan solo cuando este agente está activo — no afectan la sesión padre u otros agentes.

```yaml
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-changes.sh"
```

Se admiten todos los eventos de gancho estándar: `SessionStart`, `PreToolUse`, `PostToolUse`, `PreCompact`, `PostCompact`, `Stop`, `Notification`.

Utilice para:
- Registrar la finalización del agente en archivos de auditoría
- Validar archivos que el agente escribe antes de que la sesión padre los lea
- Enviar notificaciones cuando un agente de larga duración se complete

---

## Campos de restricción de herramientas

### `tools`

**Tipo:** `array` de `string`
**Predeterminado:** Todas las herramientas disponibles (hereda de permisos de sesión)

Restringe el agente solo a las herramientas listadas. Cualquier llamada de herramienta no en esta lista se bloquea.

```yaml
tools:
  - Read
  - Grep
  - Glob
  - Bash
```

La restricción de herramientas es un mecanismo de seguridad y enfoque. Un agente de investigación de solo lectura no debe tener Write o Edit. Un agente de formato no necesita WebSearch.

**Advertencia importante:** Las restricciones de herramientas se aplican a las llamadas propias de este agente. No impiden que el agente ordene a un subagente que genere usar herramientas sin restricciones. Si está restringiendo un agente por razones de seguridad, restrinja también sus sub-subagentes por separado.

Conjunto de solo lectura común: `["Read", "Grep", "Glob"]`
Conjunto de análisis común: `["Read", "Grep", "Glob", "Bash"]`
Conjunto de desarrollo completo: `["Read", "Write", "Edit", "Bash", "Grep", "Glob"]`

---

## Campos de esfuerzo

### `effort`

**Tipo:** `string` — uno de `"low"`, `"medium"`, `"high"`, `"xhigh"`
**Predeterminado:** Hereda de la configuración de esfuerzo de la sesión padre

Establece el nivel de esfuerzo predeterminado para la ventana de contexto de este agente. Anula la predeterminación de sesión solo para este agente.

```yaml
effort: xhigh
```

| Valor | Cuándo usar |
|-------|-------------|
| `"low"` | Formateadores simples, clasificadores, transformaciones mecánicas |
| `"medium"` | Tareas de desarrollo rutinarias, refactorizaciones sencillas |
| `"high"` | Implementación de características complejas, cambios multi-archivo |
| `"xhigh"` | Decisiones arquitectónicas, auditorías de seguridad, depuración de problemas profundos, cualquier cosa donde perder un detalle tiene consecuencias reales |

El nivel de esfuerzo afecta cuánto el modelo "piensa" antes de responder. Mayor esfuerzo = más tokens, más latencia, salida más exhaustiva. Use `"low"` para agentes mecánicos sensibles a costos y `"xhigh"` cuando la exhaustividad es más importante que la velocidad.

---

## Ejemplo completo

Un agente completamente anotado que combina múltiples campos:

```yaml
---
name: security-auditor
description: "Audita código para vulnerabilidades del Top 10 de OWASP, exposición de secretos y riesgos de inyección. Activar para revisiones de seguridad antes de cualquier PR."
model: opus
background: false
isolation: worktree
effort: xhigh
tools:
  - Read
  - Grep
  - Glob
  - Bash
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
color: "#ff4444"
---

# Security Auditor

## Purpose
Performs a structured security review against OWASP Top 10, secret exposure patterns,
and injection risk surfaces. Runs in an isolated worktree so exploratory file reads
do not affect the working tree.

## Instructions
...
```

---

## Tabla de compatibilidad de campos

| Campo | Uso de subagente | Sesión independiente | Notas |
|-------|-------------|-------------------|-------|
| `name` | Requerido | Requerido | Utilizado en `Agent(subagent_type="name")` |
| `description` | Requerido | Requerido | Señal de enrutamiento primaria |
| `model` | Sí | Sí | Anula modelo padre para este contexto |
| `background` | Sí | No | Solo significativo cuando se genera como subagente |
| `isolation` | Sí | Sí | Requiere repositorio git |
| `initialPrompt` | No | Sí | Solo se activa en sesiones independientes |
| `color` | Sí | Sí | Puramente cosmético |
| `hooks` | Sí | Sí | Limitado solo a la sesión de este agente |
| `tools` | Sí | Sí | Lista blanca; bloquea todas las herramientas no listadas |
| `effort` | Sí | Sí | Anula esfuerzo de sesión para este contexto |

---

## Advertencias

**`isolation: "worktree"` requiere git.** En directorios no-git, la creación del árbol de trabajo falla silenciosamente y el agente se ejecuta contra la copia de trabajo sin aislamiento. Verifique que su proyecto sea un repositorio git antes de confiar en este campo para la seguridad.

**Los agentes `background: true` son "dispara y olvida" desde la perspectiva del padre.** El padre continúa inmediatamente. Si necesita la salida del agente para tomar una decisión, no use `background: true`. Úselo solo para tareas donde el resultado se consume de forma asincrónica (logs, notificaciones, efectos secundarios).

**`model: "haiku"` es una optimización de costo, no una degradación de capacidad para tareas simples.** Para trabajo mecánico — reformateo, renombrado simple, generación de boilerplate — Haiku funciona de manera equivalente a Sonnet a un costo ~60% más bajo. No use Haiku para análisis de seguridad, decisiones arquitectónicas, o cualquier tarea donde los errores sutiles se componen. La diferencia de costo no vale el riesgo de calidad.

**Las restricciones de herramientas no son un sandbox.** Bloquean las llamadas de herramientas directas del agente. Un agente ordenado para generar sub-subagentes puede pasar acceso de herramientas sin restricciones a esos sub-subagentes a menos que también los restrinja. Para límites de seguridad genuinos, restrinja cada capa del árbol de agentes por separado.

**`description` es el campo más importante después de `name`.** El enrutador lo utiliza para decidir cuándo delegar aquí. Una descripción vaga o genérica causa enrutamiento incorrecto — ya sea que el agente se active cuando no debería, o nunca se seleccione. Escriba la descripción como una condición de activación explícita, no un resumen de capacidad.

---
