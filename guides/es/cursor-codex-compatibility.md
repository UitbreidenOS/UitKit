# Usar skills de Claudient en Cursor, Windsurf, Copilot y Codex

Los skills de Claudient son archivos Markdown simples. Nada en su formato es específico de Claude Code — sin binarios, sin sintaxis propietaria, sin llamadas API. Eso los hace portables a todas las herramientas principales de codificación IA con un mecanismo de inyección de reglas o contexto.

Esta guía cubre la mecánica de trasplante de un skill de Claudient a Cursor, Windsurf, GitHub Copilot y OpenAI Codex CLI — qué funciona, qué no funciona y dónde trazar la línea.

---

## Por qué funciona

Un skill de Claudient es cuatro secciones Markdown: `When to activate`, `When NOT to use`, `Instructions` y `Example`. El modelo lee esto como texto plano y ajusta su comportamiento en consecuencia.

Eso es exactamente lo que hace cada herramienta de codificación IA cuando coloca texto en su archivo de reglas o instrucciones — el texto se convierte en parte del prompt del sistema antes de que se procese su solicitud. El formato de skill ya está optimizado para esto:

- `When to activate` y `When NOT to use` dan al modelo restricciones de alcance que previenen la aplicación excesiva
- `Instructions` contiene lenguaje directivo ("siempre haz X", "nunca hagas Y") en lugar de lenguaje de documentación
- `Example` ancla el modelo en la estructura de salida esperada

Cualquier modelo que acepte un prompt del sistema o un archivo de instrucciones personalizado puede consumir un skill de Claudient sin modificación. Pierdes características específicas de Claude Code (invocación de comandos slash, desencadenadores de hooks, delegación de subagentes), pero la guía de comportamiento central se transfiere completamente.

---

## Referencia rápida

| Herramienta | Dónde colocar el skill |
|---|---|
| Claude Code | `.claude/skills/<skill>.md` (comando slash) o importar vía `CLAUDE.md` |
| Cursor | `.cursor/rules/<skill>.mdc` (cargado automáticamente) o `.cursorrules` (heredado) |
| Windsurf | `.windsurfrules` en raíz del proyecto |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex CLI | `AGENTS.md` en raíz del proyecto, o pasar con bandera `--context` |
| Zed | Archivo de reglas del proyecto (`.zed/settings.json` → clave `"system_prompt"`) |
| Continue.dev | `~/.continue/config.json` → campo `"systemMessage"`, o bloque `@Rules` |

---

## Cursor

Cursor es la alternativa más común a Claude Code para equipos que ya usan VS Code. Soporta reglas granulares por proyecto con controles de alcance.

### Ubicación del archivo de reglas

Cursor carga reglas automáticamente desde `.cursor/rules/`. Cada archivo debe usar la extensión `.mdc`. Cursor lee todos los archivos `.mdc` en este directorio al iniciar — no necesita hacer referencia a ellos manualmente.

```
your-project/
├── .cursor/
│   └── rules/
│       ├── fastapi.mdc
│       ├── db-migrations.mdc
│       └── test-coverage.mdc
└── src/
```

### Convertir un skill de Claudient a una regla de Cursor

1. Copie el archivo `.md` de `skills/` en `.cursor/rules/`
2. Cambie la extensión de `.md` a `.mdc`
3. Agregue un bloque frontmatter MDC en la parte superior para controlar el alcance:

```
---
description: Patrones de endpoints FastAPI — activar al crear o modificar rutas FastAPI
globs: ["**/*.py", "**/routers/**"]
alwaysApply: false
---

# FastAPI CRUD

## When to activate
...
```

El campo `globs` le indica a Cursor que adjunte esta regla solo cuando archivos que coincidan con esos patrones están abiertos en contexto. El campo `description` es usado por la lógica de coincidencia de reglas de Cursor — copie el contenido de la sección `When to activate` del skill como una frase de desencadenamiento concisa.

Establecer `alwaysApply: true` inyecta la regla en cada solicitud independientemente del archivo abierto. Úselo solo para estándares de codificación en todo el proyecto, nunca para skills específicos de tarea — desperdicia contexto y degrada la calidad de respuesta en tareas no relacionadas.

### `.cursorrules` heredado

`.cursorrules` es un único archivo en la raíz del proyecto. Se carga para cada solicitud sin alcance. Pegue el contenido completo del skill aquí solo si:

- El proyecto tiene una única pila de tecnología dominante
- Quiere que el skill esté activo independientemente de qué archivo esté abierto
- Aún no está usando la estructura de directorio `.cursor/rules/`

Para proyectos con múltiples skills, `.cursor/rules/` con archivos `.mdc` separados es estrictamente mejor — cada skill se carga solo cuando es relevante.

### Limitación específica de Cursor

Cursor no soporta invocación de comandos slash de skills individuales de la manera que Claude Code lo hace. Todos los archivos `.mdc` que coincidan con el contexto actual se cargan simultáneamente. Si tiene cinco skills instalados y los cinco coinciden (por ejemplo, todos tienen `alwaysApply: true`), Cursor inyecta los cinco en el prompt del sistema. Mantenga el alcance apretado mediante `globs` y valores `description` precisos para evitar esto.

---

## Windsurf

Windsurf (el editor de Codeium) usa un único archivo de reglas por proyecto.

### Ubicación del archivo de reglas

Coloque un archivo `.windsurfrules` en la raíz del proyecto:

```
your-project/
├── .windsurfrules
├── src/
└── package.json
```

### Convertir un skill de Claudient

Pegue el contenido del skill directamente en `.windsurfrules`. Para múltiples skills, concatene con una regla horizontal (`---`) como separador:

```markdown
# FastAPI CRUD

## When to activate
- Construyendo un nuevo endpoint de FastAPI (GET, POST, PUT, DELETE)
...

## Instructions
...

---

# Database Migrations

## When to activate
- Ejecutando migraciones de Alembic
...
```

Windsurf carga el archivo completo `.windsurfrules` para cada solicitud. No hay mecanismo de alcance por archivo — el modelo debe usar las secciones `When to activate` y `When NOT to use` para auto-seleccionarse. Esto funciona, pero archivos grandes (más de 3–4 skills) comienzan a diluir la atención del modelo. Mantenga `.windsurfrules` a los 2–3 skills más relevantes para el flujo de trabajo actual y rote según sea necesario.

---

## GitHub Copilot

El archivo de instrucciones personalizado de Copilot se aplica a todas las interacciones de Copilot en un repositorio.

### Ubicación del archivo de reglas

```
your-project/
├── .github/
│   └── copilot-instructions.md
└── src/
```

El nombre del archivo debe ser exactamente `copilot-instructions.md`. Copilot lo lee automáticamente para cualquier repositorio donde esté presente.

### Convertir un skill de Claudient

Pegue el contenido del skill en `copilot-instructions.md`. El formato de cuatro secciones es entendido por los modelos de clase GPT-4 que potencian Copilot — la sección `When NOT to use` es particularmente efectiva para prevenir que Copilot aplique patrones en el contexto incorrecto.

```markdown
# FastAPI CRUD

## When to activate
- Construyendo un nuevo endpoint de FastAPI
- Agregando modelos Pydantic de solicitud/respuesta
- Implementando inyección de dependencias en rutas

## When NOT to use
- Proyectos Flask o Django existentes
- Scripts simples sin capa API
- APIs de gRPC o GraphQL

## Instructions

Siempre defina un modelo Pydantic para cuerpos de solicitud. Nunca acepte dicts simples.
Levante `HTTPException` con el código de estado correcto — 422 para errores de validación,
404 para no encontrado, 500 solo para fallos inesperados.

## Example

**User:** Agregue un endpoint POST para crear un nuevo usuario.

**Expected:**
- Modelo Pydantic `UserCreate` con `email: EmailStr` y `password: str`
- Ruta en `POST /users` retornando `UserResponse` (sin campo password)
- `HTTPException(409)` si email ya existe
```

### Límites de caracteres de Copilot

A partir de mediados de 2025, Copilot aplica un límite flexible en el contenido `copilot-instructions.md` cargado por solicitud. Los archivos más allá de aproximadamente 8,000 caracteres pueden truncarse. Para proyectos con múltiples skills, priorice los skills más frecuentemente activados y mantenga las secciones individuales de `Instructions` densas en lugar de exhaustivas.

---

## OpenAI Codex CLI

Codex CLI (comando `codex`) usa `AGENTS.md` para contexto persistente, equivalente a CLAUDE.md en Claude Code.

### Ubicación del archivo de reglas

Coloque `AGENTS.md` en la raíz del proyecto:

```
your-project/
├── AGENTS.md
└── src/
```

### Convertir un skill de Claudient

Pegue el skill directamente en `AGENTS.md`. Codex lee este archivo al iniciar la sesión e lo incluye en el prompt del sistema para cada solicitud en ese directorio.

```markdown
# FastAPI CRUD

## When to activate
...

## Instructions
...
```

Para invocaciones puntuales sin modificar `AGENTS.md`, pase el skill como archivo de contexto:

```bash
codex --context skills/backend/python/fastapi.md "Agregar un endpoint POST /users"
```

La bandera `--context` acepta una ruta de archivo e antepone su contenido al prompt del sistema para esa invocación únicamente. Útil para probar skills antes de confirmarlos a `AGENTS.md`.

### Anidamiento

Como CLAUDE.md, `AGENTS.md` soporta invalidaciones a nivel de directorio. Un archivo en `services/api/AGENTS.md` se aplica solo cuando Codex opera dentro de ese subárbol, permitiendo asignación de skills por servicio en un monorepo.

---

## Zed y Continue.dev

### Zed

El contexto IA de Zed se configura en `.zed/settings.json`. Pegue el contenido del skill en el campo `"system_prompt"`:

```json
{
  "assistant": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-5"
    },
    "system_prompt": "# FastAPI CRUD\n\n## When to activate\n..."
  }
}
```

Para configuraciones de múltiples skills, concatene skills como una única cadena. Zed no soporta importaciones de reglas basadas en archivos, así que el contexto completo debe vivir en línea en `settings.json`.

### Continue.dev

Continue soporta invalidaciones de mensaje del sistema tanto globales como a nivel de proyecto. En `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4-5",
      "systemMessage": "# FastAPI CRUD\n\n## When to activate\n..."
    }
  ]
}
```

Para reglas a nivel de proyecto, Continue soporta bloques `@Rules` en `.continue/rules.md` (versión 0.9+). Pegue el contenido del skill allí — Continue lo inyecta junto con el prompt del sistema del modelo para solicitudes hechas en ese proyecto.

---

## Lo que se transfiere bien

**La sección Instructions** — el lenguaje directivo funciona idénticamente entre modelos. "Siempre defina un modelo Pydantic para cuerpos de solicitud. Nunca acepte dicts simples." no es ambiguo para GPT-4o, Claude, Gemini y cualquier otro modelo con capacidad de seguimiento de instrucciones.

**La sección Example** — la fundamentación de pocos ejemplos es independiente del modelo. Un ejemplo que muestra la estructura de salida esperada mejora la adhesión en todos los modelos, no solo Claude.

**La sección When NOT to use** — las restricciones negativas están subutilizadas en la mayoría de archivos de reglas. Esta sección es a menudo la diferencia entre un skill que ayuda y uno que interfiere con trabajo no relacionado.

**Reglas de alcance de archivo (globs de Cursor)** — el formato `.mdc` de Cursor con `globs` replica el campo frontmatter `paths` de Claude Code. Los skills que especifican patrones de archivo en su sección `When to activate` se traducen naturalmente a los `globs` de Cursor — automatice la conversión.

---

## Lo que no se transfiere

**Invocación de comandos slash** — `/skill-name` es específico de Claude Code. Otras herramientas cargan skills pasivamente desde su archivo de reglas; no puede activar un skill bajo demanda en medio de la sesión de la misma manera.

**Hooks** — los hooks `.claude/settings.json` (`PreToolUse`, `PostToolUse`, `Notification`, `Stop`) son solo Claude Code. Los scripts de shell activados en eventos de herramientas no tienen equivalente en Cursor, Windsurf o Copilot. No intente traducir archivos de hooks.

**Delegación de subagentes** — Los skills que instruyen a Claude a generar un subagente (herramienta `Task`, referencias `subagent_type`) no se ejecutarán en otras herramientas. El modelo leerá la instrucción y no hará nada significativo con ella, o intentará simular el comportamiento en una única ventana de contexto.

**Referencias de herramientas MCP** — Las instrucciones que hacen referencia a herramientas MCP específicas (`mcp__tool_name`) solo funcionan en Claude Code con el servidor MCP configurado. Elimine estos de skills antes de usarlos en otras herramientas, o reemplace con instrucciones de herramientas nativas equivalentes para la plataforma objetivo.

**Inyección de tiempo de ejecución `!command`** — La sintaxis `!git branch --show-current` para incrustar salida de shell en contexto de skill en tiempo de activación es específica de Claude Code. Otras herramientas no ejecutan estos comandos en línea. Reemplace con texto estático o elimine completamente al portar.

---

## Flujo de trabajo práctico para portar un skill

1. Abra el archivo de skill desde `skills/`
2. Elimine todas las inyecciones en línea `!command`
3. Elimine o reescriba secciones que hagan referencia a agentes Claude Code, hooks o herramientas MCP
4. Determine la herramienta de destino y archivo de destino (vea la tabla en la parte superior)
5. Para Cursor: agregue bloque frontmatter MDC; extraiga contenido `When to activate` como valor `description`; asigne patrones de archivo a `globs`
6. Para destinos de archivo único (Windsurf, Copilot, Codex): pegue tal cual con separador si concatena múltiples skills
7. Pruebe con una tarea que coincida con `When to activate` — verifique que el modelo aplique patrones de `Instructions`
8. Pruebe con una tarea que coincida con `When NOT to use` — verifique que el modelo no aplique los patrones

La estructura de cuatro secciones fue diseñada para ser autónoma. Un skill de Claudient bien escrito debe requerir menos de 10 minutos para portarse a cualquiera de estas herramientas.

---

> **Trabaje con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
