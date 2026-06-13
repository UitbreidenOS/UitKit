# Referencia de Alcance de Configuración — Global vs Proyecto

Todo en Claude Code existe en el alcance **global** (`~/.claude/`) o en el alcance **proyecto** (`.claude/`). Algunas funciones son solo globales. Esta guía es la referencia definitiva para saber dónde viven las cosas y cómo interactúan.

---

## Descripción general del alcance

| Característica | Global (`~/.claude/`) | Proyecto (`.claude/`) | Notas |
|---|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | `CLAUDE.md` (raíz del repositorio) | Ambos cargados; concatenados al inicio |
| `settings.json` | `~/.claude/settings.json` | `.claude/settings.json` | Fusionados; el proyecto anula el global |
| `settings.local.json` | `~/.claude/settings.local.json` | `.claude/settings.local.json` | Anulaciones personales; gitignored |
| Habilidades | `~/.claude/skills/` | `.claude/skills/` | Ambos activos simultáneamente |
| Agentes | `~/.claude/agents/` | `.claude/agents/` | Ambos activos simultáneamente |
| Hooks | `~/.claude/settings.json` | `.claude/settings.json` | Ambos se activan; las matrices se concatenan |
| Reglas | `~/.claude/rules/` | `.claude/rules/` | Ambas activas; coincididas por frontmatter `paths:` |
| Servidores MCP | `~/.claude.json` | `.claude/mcp.json` | Fusionados al inicio |
| Tareas | `~/.claude/tasks/` | — | Solo global |
| Equipos de agentes | `~/.claude/teams/` | — | Solo global |
| Enlaces de teclado | `~/.claude/keybindings.json` | — | Solo global |
| Archivos de memoria | `~/.claude/memory/` | — | Solo global |
| Credenciales / tokens | `~/.claude/` | — | Solo global; nunca comprometer |

---

## `settings.local.json`

Ambos alcances admiten una variante `.local.json` para anulaciones personales:

- `~/.claude/settings.local.json` — anulaciones globales personales (nunca comprometidas)
- `.claude/settings.local.json` — anulaciones de proyecto personal (gitignored por defecto)

Use `.local.json` para anular la configuración comprometida del equipo sin tocar la configuración compartida. Casos de uso comunes: desactivar un hook durante la depuración, configurar un `ANTHROPIC_BASE_URL` personal, anular el modelo predeterminado.

El orden de carga dentro de cada alcance es:

1. `settings.json` (base)
2. `settings.local.json` (anulaciones de base)

---

## Comportamiento de fusión

Cuando existe la misma clave en los alcances global y proyecto:

| Tipo de clave | Comportamiento |
|---|---|
| Escalar (`model`, `effort`, banderas de cadena) | El proyecto gana — el valor global se ignora |
| Matrices (`hooks`, `tools`, `permissions`) | Concatenadas — ambos valores están activos |
| Objetos anidados | Fusionado recursivamente; las claves de proyecto ganan en conflicto |

**Crítico:** las matrices de hooks se concatenan, no se reemplazan. Si define un hook `Stop` global y un hook `Stop` en el proyecto, **ambos se activan**. Este es a menudo el comportamiento previsto (los hooks globales manejan auditoría; los hooks del proyecto manejan validación específica del proyecto), pero puede causar ejecución duplicada si el mismo hook se define accidentalmente en ambos alcances.

---

## Orden de carga de CLAUDE.md

Todo lo siguiente se carga y concatena en el contexto al iniciar la sesión:

1. `~/.claude/CLAUDE.md` — instrucciones de usuario global
2. `CLAUDE.md` en la raíz del repositorio — instrucciones del proyecto
3. Archivos `CLAUDE.md` en directorios principales entre el archivo actual y la raíz del repositorio (subida)
4. Archivos `.claude/rules/*.md` cuyo frontmatter `paths:` coincide con el archivo actual

Las entradas posteriores no anulan las anteriores — todo el contenido está activo simultáneamente. Si las entradas entran en conflicto, el contenido a nivel de proyecto tiene precedencia práctica porque aparece más tarde en el aviso concatenado, pero no existe un mecanismo de anulación explícita entre archivos CLAUDE.md.

**Presupuesto de fichas:** El contenido CLAUDE.md combinado cuenta contra la ventana de contexto. Si todas las fuentes exceden el presupuesto, se recortan las fuentes antiguas o de menor prioridad. Mantenga CLAUDE.md global conciso — se carga para cada proyecto.

---

## Distribución de directorio de alcance de proyecto

Un alcance de proyecto bien estructurado se ve así:

```
.claude/
  settings.json         # cometido — configuración del equipo
  settings.local.json   # gitignored — anulaciones personales
  mcp.json              # cometido — servidores MCP del proyecto
  skills/
    feature-name.md     # comandos de barra invertida específicos del proyecto
  agents/
    specialist.md       # sub-agentes específicos del proyecto
  rules/
    style.md            # reglas siempre activas (sin paths: = siempre activo)
    tests.md            # paths: ["**/*.test.ts"] = activación automática
  hooks/
    validate.sh         # scripts de gancho (referenciados desde settings.json)
  memory/               # memoria de sesión (gitignored)
```

---

## Distribución de directorio de alcance global

```
~/.claude/
  CLAUDE.md             # instrucciones globales, cargadas para cada proyecto
  settings.json         # configuración global predeterminada
  settings.local.json   # anulaciones globales personales
  skills/               # habilidades activas en cada proyecto
  agents/               # agentes disponibles en cada proyecto
  rules/                # reglas activas en cada proyecto
  tasks/                # listas de tareas entre sesiones
  teams/                # definiciones de equipos de agentes
  keybindings.json      # remapeo de teclado
  memory/               # memoria persistente entre proyectos
```

---

## Trampas comunes

**Comprometer archivos `.local.json`.** Se gitignore por defecto, pero si los agrega por la fuerza, expone las claves API personales o las anulaciones de punto final al equipo. Agregue explícitamente `settings.local.json` a `.gitignore` si aún no está cubierto.

**Definir el mismo hook en ambos alcances.** El hook se activa dos veces. Esto es especialmente problemático para hooks que escriben registros de auditoría — obtiene entradas duplicadas. Auditar una vez globalmente; validar por proyecto.

**Poner todo en el CLAUDE.md global.** CLAUDE.md global se carga para cada proyecto. Atestarlo con instrucciones específicas del proyecto desperdicia fichas en sesiones no relacionadas. Coloque instrucciones específicas del proyecto en el `CLAUDE.md` del proyecto.

**Asumir que las habilidades suben en el árbol.** No lo hacen. Los archivos CLAUDE.md suben; las habilidades no. Una habilidad en `/workspace/project/.claude/skills/` no es visible cuando Claude trabaja en `/workspace/project/packages/api/`. Cada subpaquete necesita su propio `.claude/skills/` para habilidades específicas del paquete.

---
