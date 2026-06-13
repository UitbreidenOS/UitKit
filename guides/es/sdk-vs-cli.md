# SDK vs CLI — Diferencias de Indicación del Sistema

Cuando usa Claude Code a través de la CLI en comparación con el SDK del Agente Claude, la indicación del sistema cargada en el contexto del modelo es dramáticamente diferente. Esto importa al construir canalizaciones automatizadas, depurar comportamiento inesperado o ajustar costos.

---

## Qué carga la CLI

La CLI carga una indicación del sistema modular ensamblada a partir de 110+ fragmentos activados condicionalmente al inicio. Lo que se incluye depende de su configuración de proyecto:

| Categoría de fragmento | Fichas (aproximado) |
|---|---|
| Indicación base (siempre cargada) | ~269 |
| Descripciones de herramientas (Read, Write, Edit, Bash, etc.) | ~800–1.200 |
| Contenido CLAUDE.md (global + proyecto) | Varía — puede ser 0 a 4.000+ |
| Descripciones de habilidades (`.claude/skills/`) | ~50–200 por habilidad |
| Archivos de reglas (`.claude/rules/`) | Varía |
| Descripciones de herramientas MCP | ~100–500 por servidor |
| Contexto de sesión (cwd, git status, platform) | ~100–300 |
| **Total con configuración completa** | **hasta ~5.000–8.000 fichas** |

Nada de esto es visible para usted en la terminal. Los fragmentos se inyectan antes de su primer mensaje.

---

## Qué carga el SDK

Sin configuración explícita, el SDK (paquete `anthropic` con `messages.create` estándar) no carga ningún contexto de Claude Code — se comporta como una llamada API simple. Sin CLAUDE.md, sin habilidades, sin descripciones de herramientas más allá de lo que usted pasa explícitamente.

Para cargar la indicación del sistema equivalente a la CLI desde el SDK:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system=[
        {
            "type": "text",
            "text": "Your custom instructions here"
        }
    ],
    messages=[{"role": "user", "content": "Do X"}]
)
```

Para cargar el preestablecimiento de Claude Code (incluye descripciones de herramientas e indicación base):

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system={"type": "preset", "preset": "claude_code"},
    messages=[{"role": "user", "content": "Do X"}]
)
```

Para cargar también la configuración del proyecto desde `.claude/settings.json`, agregue:

```python
extra_headers={"X-Setting-Sources": "project"}
```

---

## Diferencias de comportamiento de un vistazo

| Comportamiento | CLI | SDK (predeterminado) | SDK + preestablecimiento |
|---|---|---|---|
| CLAUDE.md cargado | Sí | No | No (agregar manualmente) |
| Uso de herramientas habilitado | Sí | Requiere herramientas explícitas | Sí |
| Descripciones de habilidades | Sí | No | No |
| Archivos de reglas | Sí | No | No |
| Contexto git de sesión | Sí | No | No |
| Instrucciones de seguridad base | Sí | Sí | Sí |
| Descripciones de herramientas MCP | Sí (si se configura) | No | No |
| Costo vs sesión CLI | Referencia | ~40–70% más bajo | ~80–95% de CLI |

---

## La bandera `--bare`

`claude -p "task" --bare` omite toda la detección de proyectos a nivel de CLI:

- Sin carga de CLAUDE.md
- Sin detección de `.claude/settings.json`
- Sin conexiones de servidores MCP
- Sin carga de habilidades

El resultado es una invocación CLI que se comporta como una llamada SDK directa, con la capa UX de CLI encima. El tiempo de inicio se reduce de ~2–3 segundos a ~200ms en sistemas cálidos.

Use `--bare` para:
- Scripts de automatización de alta frecuencia que llaman a Claude a través de CLI
- Integraciones de estilo SDK que casualmente usan el binario CLI
- Pruebe indicaciones de forma aislada sin interferencia del contexto del proyecto

No use `--bare` para:
- Sesiones de desarrollo interactivas (pierde CLAUDE.md, habilidades, reglas)
- Flujos de trabajo que necesitan acceso a servidores MCP del proyecto

---

## Sin garantía de determinismo

No hay parámetro `seed` equivalente para Claude Code o la API Claude. Con temperature=0, las respuestas son consistentes en la práctica pero no se garantiza que sean idénticas entre llamadas API. Esta es una propiedad fundamental del modelo — no un problema de configuración, y no algo que `--bare` o el preestablecimiento resuelve.

Si su automatización depende de una salida determinista:
- Use salida estructurada con esquemas JSON definidos
- Valide salidas contra un esquema en lugar de comparar texto sin procesar
- Construya canalizaciones idempotentes que toleren variación en formulaciones

---

## Referencia de latencia de inicio

| Modo | Inicio en frío típico | Inicio cálido típico |
|---|---|---|
| `claude` (CLI completa) | 3–5 segundos | 1–2 segundos |
| `claude -p "x"` (modo impresión) | 2–4 segundos | 1–1,5 segundos |
| `claude -p "x" --bare` | 0,3–0,5 segundos | 0,1–0,2 segundos |
| SDK `messages.create` | ~100–200ms (red) | ~100ms (red) |

El modo CLI desnudo es la opción correcta cuando necesita el binario de Claude Code pero le preocupa la latencia. El SDK es aún más rápido cuando no necesita la CLI en absoluto.

---
