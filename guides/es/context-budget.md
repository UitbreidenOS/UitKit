# Gestión del Presupuesto de Contexto

Cómo rastrear, planificar y optimizar el uso de tokens dentro de una sesión de Claude Code — para desarrolladores senior que ejecutan sesiones grandes, pipelines de agentes y bucles de trabajo autónomos.

---

## Por qué el presupuesto de contexto importa

Las sesiones de Claude Code operan dentro de una ventana de contexto finita. Conforme una sesión crece, cada llamada de herramienta, lectura de archivo, salida de bash y turno del asistente se acumula. Cuando la ventana se llena:

- La calidad de respuesta de Claude se degrada notablemente antes del límite duro (empíricamente, alrededor de 300–400k tokens en el modelo 1M)
- Te ves obligado a usar `/compact` (summarización con pérdida) o una sesión nueva
- Los costos escalan con el tamaño del contexto — una ventana inflada cuesta más por turno

El modo de fallo no es alcanzar el límite duro — es quemar la mayoría de tu presupuesto en ruido antes de que tu tarea esté a mitad de camino. Salidas de log largas sin trimming, lectura de archivos completos cuando solo necesitabas 30 líneas, relecturas repetidas del mismo archivo, sub-calls de agentes que llevan contexto parental completo: estos son los patrones que colapsan un presupuesto.

Esta guía cubre qué consume presupuesto, cómo medirlo y cómo mantener el control en todo el ciclo de vida de la sesión.

---

## Qué consume contexto

| Fuente | Costo típico | Notas |
|---|---|---|
| System prompt / CLAUDE.md | 500–5.000 tokens | Cargado en cada inicio de sesión |
| Cada llamada de herramienta + resultado | 200–2.000 tokens | Depende completamente de la verbosidad del resultado |
| Lecturas de archivos | ~1 token por 4 caracteres | Un archivo de 1.000 líneas es aproximadamente 10K tokens |
| Bash stdout | Sin límite | La salida de log largo es el eliminador de presupuesto más común |
| Definiciones de herramientas MCP (10 servidores) | ~25.000–35.000 tokens | Cargado en el inicio de sesión, antes de escribir algo |
| Sub-calls de agentes | Contexto sub completo | Cada agente generado inicializa su propia ventana de contexto |
| Imágenes / capturas de pantalla | 1.500–3.000 tokens | Por imagen, independientemente de la complejidad del contenido |
| Historial de conversación | Crece cada turno | Tanto los turnos del usuario como del asistente se acumulan |

Las dos fuentes que la mayoría de los desarrolladores subestiman son **Bash stdout** y **definiciones de herramientas MCP**. Un único `npm install` con registro verboso puede agregar 3–5K tokens. Diez servidores MCP habilitados con ocho herramientas cada uno es ~30K tokens de overhead cargado antes del primer mensaje del usuario.

---

## El comando `/compact`

`/compact` resume el historial de conversación en una representación comprimida y la reemplaza en el contexto. Esto tiene pérdida — el resumen retiene decisiones y resultados pero descarta detalles exactos.

**Qué sobrevive a la compactación:**
- Decisiones de alto nivel y su razonamiento
- El estado del archivo actual (qué se escribió)
- Hechos clave explícitamente discutidos

**Qué no sobrevive a la compactación:**
- Mensajes de error exactos y trazas de stack
- Fragmentos de código específicos que se leyeron pero no se escribieron
- Cadenas de depuración paso a paso
- Contenidos de archivo que se leyeron pero no se modificaron

**Cuándo compactar:**
- En 50–60% de uso de contexto, no en 90%. La compactación al 50% produce un resumen de mayor calidad porque más señal sigue en la ventana en relación con el ruido.
- Después de completar una subtarea importante antes de comenzar la siguiente
- Antes de una tarea que requerirá leer muchos archivos grandes
- Después de una larga sesión de depuración donde intentos fallidos ensucian el contexto

**Compactación dirigida** preserva el hilo más importante:

```
/compact focus on the auth refactor — drop the test debugging context
```

Sin una sugerencia, el sintetizador toma sus propias decisiones sobre qué importa. Una sugerencia específica ancla el resumen.

**No esperes al umbral automático.** El auto-compact predeterminado se activa en ~95% de capacidad. Para entonces, la calidad ya se ha degradado significativamente y el resumen tiene menos señal con la que trabajar.

---

## Estrategias de presupuesto de contexto

### a. Lee solo lo que necesitas

Usa los parámetros `limit` y `offset` en la herramienta Read. Un archivo de 2.000 líneas leído completamente es ~20K tokens. Si necesitas las líneas 400–450, eso es ~500 tokens.

```
# Archivo completo: ~20K tokens
Read /path/to/service.ts

# Lectura dirigida: ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

Usa Grep en lugar de leer archivos cuando busques un patrón. Grep retorna líneas coincidentes y una pequeña cantidad de contexto — no el archivo completo. Para una base de código de 5.000 líneas, esta es la diferencia entre 50K tokens y 500.

Nunca leas archivos de log completos. Canaliza a `head` y busca primero la sección relevante.

### b. Recorta la salida de Bash

La salida de Bash sin control es la fuente más común de consumo de contexto desbocado. Aplica estos sistemáticamente:

```bash
# Limita el volumen de salida
npm install 2>/dev/null | tail -5
docker logs mycontainer --tail 100
git log --oneline -20

# Suprime ruido de progreso
curl -s https://api.example.com/endpoint
rsync -a --quiet src/ dst/

# Redirige stderr cuando no es relevante
make build 2>/dev/null

# Resume antes de retornar
./run-tests.sh | grep -E "PASS|FAIL|ERROR" | tail -30
```

Para cualquier comando que produzca salida de múltiples pantallas, agrega `| head -N` o `| tail -N` como disciplina predeterminada. El N exacto es menos importante que el hábito.

### c. Usa compresión de salida PostToolUse

A partir de Claude Code v2.1.121+, un hook `PostToolUse` puede reemplazar la salida de la herramienta antes de que Claude la procese. Esto te permite comprimir, redactar o resumir automáticamente los resultados de herramientas verbose — sin cambiar la llamada de herramienta en sí.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/compress-output.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/compress-output.sh`:**
```bash
#!/usr/bin/env bash
# Lee la salida de la herramienta desde stdin (JSON), comprime si está por encima del umbral, escribe en stdout.
# Claude recibe la salida del hook como el resultado de la herramienta.

set -euo pipefail

input=$(cat)
output=$(echo "$input" | jq -r '.output // ""')
line_count=$(echo "$output" | wc -l | tr -d ' ')

if [ "$line_count" -gt 150 ]; then
  # Trunca y anota — Claude ve una versión recortada
  trimmed=$(echo "$output" | head -100)
  tail_section=$(echo "$output" | tail -20)
  echo "$input" | jq --arg trimmed "$trimmed" --arg tail "$tail_section" \
    '.output = "[Output truncated from '"$line_count"' lines]\n\nFirst 100 lines:\n" + $trimmed + "\n\n[...]\n\nLast 20 lines:\n" + $tail'
else
  echo "$input"
fi
```

Esto se activa en cada llamada de Bash. Si la salida está por debajo de 150 líneas, pasa sin cambios. Por encima de 150 líneas, reemplaza el resultado con una versión recortada anotada con el recuento de líneas. El contexto de Claude recibe el resultado comprimido — la salida completa nunca entra en la ventana.

El mismo patrón funciona para redactar secretos: elimina líneas que coincidan con `API_KEY|SECRET|TOKEN|PASSWORD` antes de que Claude las procese.

### d. Límita CLAUDE.md agresivamente

El `CLAUDE.md` a nivel de proyecto se carga en cada inicio de sesión. Cada token en él es un costo fijo que se compone en cada sesión que ejecutas.

**Objetivo:** Mantén tu `CLAUDE.md` del proyecto por debajo de 2.000 tokens (~300–400 líneas de prosa simple). El `~/.claude/CLAUDE.md` a nivel de usuario se suma — trata el total combinado como tu overhead base.

**Qué mantener en CLAUDE.md:**
- Descripción del proyecto (3–5 oraciones)
- Directorios clave y su propósito
- Convenciones no obvias que Claude debe seguir
- Comandos para build, test, lint
- Cosas no modificar sin preguntar

**Qué sacar:**
- Documentación de referencia (formas de API, descripciones de esquema) — lee estas bajo demanda, solo cuando sea relevante
- Ejemplos largos — refiérete a ellos por ruta de archivo y lee bajo demanda
- Decisiones históricas — mantén un `decisions.md` separado y cárgalo solo cuando trabajes en ese dominio

Un `CLAUDE.md` que creció orgánicamente durante meses a menudo contiene reglas para problemas que ya no existen. Audítalo y elimina reglas muertas. Cada regla eliminada ahorra tokens en cada sesión por siempre.

### e. Resume antes de generar agentes

Cuando generas un subagente, obtiene su propia ventana de contexto. La forma en que le pasas información determina si estás pasando señal o ruido.

**No reenvíes historial de herramientas sin procesar.** Si acabas de hacer 20 lecturas de archivo y 10 llamadas bash en el contexto parental, pasar esa conversación textualmente a un subagente desperdicia presupuesto y degrada el enfoque del subagente.

En su lugar, resume los hallazgos en un briefing estructurado antes de generar:

```
# Enfoque pobre:
Genera agente con: historial de conversación parental completo

# Mejor enfoque:
Antes de generar, construye un briefing:
  "The auth module is in src/auth/. The issue is in jwt.ts line 84 —
  the expiry check compares against Date.now() but tokens use seconds, not
  milliseconds. The fix is to multiply exp by 1000 before comparing.
  Relevant files: jwt.ts, middleware/auth.ts, tests/auth.test.ts.
  Task: fix the comparison and update the test."

Genera agente con: solo el briefing
```

El subagente recibe exactamente lo que necesita. El contexto parental recupera las conclusiones del subagente sin haber re-inyectado el historial completo de herramientas del subagente.

### f. Conciencia de LLMS.txt

Cuando incorporas documentación externa — una referencia de API de biblioteca, una guía de configuración de framework — verifica si el proyecto publica un archivo `llms.txt`.

`llms.txt` es un formato de documentación comprimida específicamente diseñado para consumo de LLM. Típicamente es 5–10x más pequeño que el contenido equivalente del sitio de docs. Obtener `https://docs.example.com/llms.txt` en lugar de raspar múltiples páginas puede ahorrar 50–200K tokens en tareas de documentación intensa.

Verifica antes de leer docs sin procesar:
```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
```

Si existe, úsalo como tu fuente principal. Si no existe, obtén solo la página específica que necesitas en lugar de seguir enlaces.

### g. Usa operaciones por lotes

En pipelines de agentes y flujos de trabajo de SDK, acumula resultados en llamadas por lotes en lugar de turnos interactivos individuales. `agent_sdk.batch()` ejecuta múltiples subtareas y retorna sus resultados sin que cada subtarea llene el contexto interactivo del padre con historial de herramientas intermedio.

Esto es el equivalente programático de la estrategia de resumen de subagente anterior — estructura el trabajo para que los pasos intermedios no persistan en el contexto principal.

---

## El comando `/usage`

`/usage` muestra un desglose de tokens por categoría para la sesión actual. Disponible en Claude Code (verifica `claude --version` para disponibilidad en tu compilación).

**Categorías mostradas:**
- System prompt (CLAUDE.md + contexto del sistema integrado)
- Definiciones de herramientas MCP
- Historial de conversación (turnos de usuario + asistente)
- Resultados de herramientas (lecturas de archivo, salidas bash, respuestas MCP)
- Sub-calls de agentes

**Cómo usarlo efectivamente:**

Ejecuta `/usage` al inicio de la sesión, inmediatamente después de que Claude cargue. Esto te da una línea base — el overhead fijo de tu CLAUDE.md, herramientas MCP y aviso del sistema antes de haber hecho ningún trabajo. Este número es tu piso; cada sesión costará al menos esto.

Si la línea base de inicio de sesión está por encima de 30–40K tokens, tienes un problema de configuración:
- Demasiados servidores MCP habilitados
- CLAUDE.md es demasiado grande
- Ambos

Ejecuta `/usage` de nuevo después de una fase de tarea importante (p. ej., después de completar exploración de archivos, antes de comenzar implementación). Esto te muestra cuánto presupuesto consumió cada fase, lo que informa decisiones sobre si compactar antes de continuar.

---

## Presupuesto de contexto en bucles autónomos / agentes

Los bucles autónomos (`/loop`, agentes programados, pipelines de CI) acumulan contexto de manera diferente a las sesiones interactivas. Cada iteración de un bucle se suma al mismo contexto a menos que lo administres activamente.

**Patrones clave:**

**Resume entre iteraciones.** Al final de cada iteración del bucle, escribe un resumen estructurado en un archivo. La siguiente iteración lee el archivo de resumen en lugar de llevar el historial completo de herramientas de la iteración anterior.

```bash
# Final de cada iteración del bucle — escribe estado al disco
cat > /tmp/loop-state.json <<EOF
{
  "iteration": 3,
  "completed": ["auth module", "user service"],
  "current": "payment service",
  "blockers": [],
  "next": "review payment integration tests"
}
EOF
```

**Usa ScheduleWakeup para reiniciar el contexto.** La herramienta `ScheduleWakeup` termina la ventana de contexto actual y reanuda en el siguiente tick programado en una ventana nueva. Para tareas autónomas largas, esto es preferible a acumular contexto en docenas de iteraciones. El tradeoff es un cache miss (>5 minutos de retraso) — aceptable cuando el trabajo de iteración toma más de unos minutos.

**Escribe resúmenes de sesión en el hook Stop.** Cuando Claude termina un turno en una sesión autónoma, el hook Stop se activa. Úsalo para escribir un resumen de sesión en el disco antes de que el contexto se acumule más.

**`.claude/hooks/stop-summary.sh`:**
```bash
#!/usr/bin/env bash
# Se activa en evento Stop. Agrega un resumen de sesión a un log persistente.

set -euo pipefail

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
last_commit=$(git log -1 --oneline 2>/dev/null || echo "no commits")

cat >> "${CLAUDE_PROJECT_DIR}/.claude/session-log.md" <<EOF

## Session ended: ${timestamp}
Branch: ${branch}
Last commit: ${last_commit}

EOF
```

**Inyecta contexto compacto en SessionStart.** En lugar de restableces el contexto a través de lecturas de archivo repetidas al inicio de cada sesión autónoma, usa un hook `SessionStart` para inyectar el resumen escrito por el hook Stop de la sesión anterior. Esto proporciona al nuevo window de contexto orientación estructurada inmediatamente.

**`.claude/hooks/session-start.sh`:**
```bash
#!/usr/bin/env bash
# Se activa en SessionStart. Genera un briefing compacto que Claude lee al abrir sesión.

set -euo pipefail

summary_file="${CLAUDE_PROJECT_DIR}/.claude/session-log.md"

if [ -f "$summary_file" ]; then
  echo "=== SESSION CONTEXT (from previous session) ==="
  tail -50 "$summary_file"
  echo "=== END SESSION CONTEXT ==="
fi
```

---

## Patrón de hook Pre-compact

Cuando `/compact` se activa, Claude genera un resumen de la conversación. El hook `PreCompact` se activa antes de que ese resumen se genere — dándote una ventana para inyectar estado estructurado que enriquezca el resumen.

Sin un hook PreCompact, el resumen se genera puramente del diálogo. Con un hook PreCompact que inyecta rama actual, tareas abiertas, commits recientes y decisiones clave, el resumen de compactación lleva contexto operacional significativamente más en la siguiente ventana.

**settings.json:**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/pre-compact.sh`:**
```bash
#!/usr/bin/env bash
# Se activa antes de /compact. Genera estado estructurado que enriquece el resumen de compactación.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --stat 2>/dev/null || echo "none")
unstaged=$(git diff --stat 2>/dev/null || echo "none")

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged changes:
${staged}

Unstaged changes:
${unstaged}
=== END STATE INJECTION ===
EOF
```

La salida inyectada aparece en contexto inmediatamente antes de que se genere el resumen de compactación. Claude incorpora este estado al escribir el resumen. El resumen resultante — que se convierte en la apertura del nuevo window de contexto — contendrá rama, historial de commit reciente y estado de cambios sin que necesites restableces estos hechos manualmente después de la compactación.

Extiende este patrón para incluir tareas abiertas (desde un archivo de tareas), decisiones arquitectónicas tomadas durante la sesión (desde un log de decisiones), o cualquier otro estado estructurado que de otro modo se perdería.

---

## Referencia rápida — lista de verificación de higiene de contexto

- [ ] CLAUDE.md del proyecto está por debajo de 2.000 tokens; CLAUDE.md del usuario es lean
- [ ] Solo los servidores MCP necesarios para esta sesión están habilitados
- [ ] Los comandos Bash canalizan a `| head -N` o `| tail -N` donde la salida es sin límite
- [ ] Hook de compresión PostToolUse instalado para herramientas verbose (Bash, MCPs que producen logs)
- [ ] Lecturas de archivo grande usan `limit` y `offset` — no lecturas completas de archivos sobre 200 líneas a menos que se necesite el contenido completo
- [ ] `/compact` activado en 50–60% de uso de contexto, no en 90%+
- [ ] Subagentes reciben un briefing estructurado, no historial de conversación parental sin procesar
- [ ] Documentación externa cargada vía `llms.txt` cuando está disponible
- [ ] Iteraciones de bucle autónomo escriben estado al disco; la siguiente iteración lee desde disco
- [ ] Hook PreCompact instalado para enriquecer resúmenes de compactación
- [ ] Hook Stop escribe resumen de sesión para el cargador de contexto de la siguiente sesión
- [ ] `/usage` marcado en el inicio de la sesión para confirmar que el overhead base es aceptable

---
