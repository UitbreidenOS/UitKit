# Optimización de Contexto Largo

Estrategias para trabajar efectivamente con ventanas de contexto de Claude de 200K–1M tokens — cómo evitar descomposición de contexto, mantener calidad a escala y saber cuándo compactar versus cuándo continuar.

Esta guía es complementaria a [context-budget.md](context-budget.md), que cubre contabilidad general de tokens y mecánica de compactación. Esta guía se enfoca específicamente en la escala de 200K+: qué significa ese tamaño de ventana en la práctica, por qué la calidad se degrada bien antes de golpear el límite, y cómo estructurar tus sesiones y herramientas para mantenerse en la zona de calidad en cargas de trabajo largas.

---

## Tamaños de ventana de contexto en la práctica

| Modelo | Ventana de contexto | Recuento de palabras aproximado | Recuento de páginas aproximado |
|---|---|---|---|
| Claude Haiku 4.5 | 200K tokens | ~150,000 palabras | ~500 páginas |
| Claude Sonnet 4.6 | 200K tokens (estándar) | ~150,000 palabras | ~500 páginas |
| Claude Sonnet 4.6 | 1M tokens (extendido) | ~750,000 palabras | ~2,500 páginas |
| Claude Opus 4.7 | 200K tokens | ~150,000 palabras | ~500 páginas |

**200K tokens en términos concretos:**

- Una ventana de contexto de 200K cabe aproximadamente en las obras completas de Shakespeare — dos veces seguidas
- Un monorepo grande con 300 archivos TypeScript a 200 líneas cada uno es ~60K tokens
- Un único archivo de registro grande con 10,000 líneas es aproximadamente 80–100K tokens
- Una sesión completa de Claude Code con 50 turnos de uso de herramienta moderadamente detallado promedia 40–80K tokens

Los números sugieren que tienes amplio espacio. La realidad es diferente. El límite de 200K no es tu techo de operación — es el acantilado. Tu techo efectivo es aproximadamente 60–70% de esa cifra, y para tareas complejas más cerca del 40–50%.

---

## La ventana de contexto de 1M (Sonnet 4.6 extendido)

Sonnet 4.6 puede accederse con una ventana de contexto extendida de 1M tokens. Esto no es el predeterminado.

**Cuándo usarlo:**
- Tareas de análisis en todo el repositorio donde necesitas sostener múltiples archivos grandes simultáneamente
- Bucles autónomos de larga duración donde la compactación descartaría estado intermedio crítico
- Refactores entre archivos donde 30+ archivos deben estar en contexto a la vez para corrección
- Tareas de análisis de documentos (legal, investigación, arqueología de código base) donde el corpus genuinamente requiere la ventana

**Cuándo no usarlo:**
- Trabajo general de desarrollo — el modelo estándar de 200K maneja la mayoría de sesiones sin problema
- Flujos de trabajo sensibles al costo — la ventana de 1M lleva precios premium por token
- Tareas donde la capacidad extra se llenaría con ruido en lugar de señal

**Implicaciones de costo y latencia:**

La ventana de 1M afecta precios y tiempo de respuesta. En contexto completo, la latencia del primer token aumenta notablemente. Los escritos de caché — incurridos en el primer turno de una sesión — escalan linealmente con el tamaño del contexto. Una sesión de 200K incurre en 200K tokens de escritura de caché en turno uno. Una sesión de 1M incurre en 1M. Si ejecutas 50 sesiones diarias y usas innecesariamente la ventana de 1M, ese sobrecargo se compone rápidamente en costos de escritura de caché.

Regla de oro: usa el modelo estándar de 200K a menos que tengas una razón específica y concreta de que la tarea requiere más. La mayoría de tareas que parecen requerir 1M pueden reestructurarse para caber en 200K con higiene de contexto adecuada.

---

## Descomposición de contexto: por qué la calidad se degrada antes del límite

La descomposición de contexto describe la degradación de calidad que ocurre a medida que una ventana de contexto se llena — bien antes del límite duro alcanzado. El mecanismo es dilución de atención.

Claude procesa contexto a través de atención — un mecanismo que pondera la relevancia de cada token para la generación actual. A medida que la ventana crece, la relación señal-ruido del contexto disminuye. Las restricciones importantes establecidas temprano en la sesión compiten con cientos de miles de tokens de salida de herramientas, razonamiento intermedio y contenidos de archivo. La atención del modelo se distribuye en todos.

**La curva de degradación empíricamente observada:**

| Nivel de llenado de contexto | Firma de calidad |
|---|---|
| 0–40% | Calidad completa; restricciones e instrucciones confiablemente seguidas |
| 40–60% | Desviación menor; instrucciones tempranas ocasionalmente perdidas; repetición ligera |
| 60–70% | Degradación notable; hechos clave enterrados y recuperados inconsistentemente |
| 70–85% | Descomposición significativa; decisiones contradicen restricciones anteriores de sesión |
| 85%+ | No confiable; efectivamente operando solo en contexto reciente |

Estas son observaciones empíricas, no umbrales duros. La curva de degradación actual varía por tipo de tarea, estructura de contexto y cómo el frontal versus distribuido uniformemente la señal es.

---

## Signos de alerta de descomposición de contexto

Observa estos patrones. Cualquiera de ellos en aislamiento puede ser ruido; dos o más ocurriendo juntos indican que la descomposición ha establecido.

**Repetición:** Claude explica algo que ya explicó dos páginas atrás, verbatim o casi verbatim. Esta es la señal más común de inicio — el modelo está generando desde contexto reciente sin recordar la derivación anterior.

**Olvido de restricción:** Estableciste temprano en la sesión que el proyecto usa ESLint con configuración estricta, o que una API específica está deprecada, o que las pruebas no deben usar `describe.only`. Claude comienza violando estas restricciones. La instrucción sigue en contexto pero ya no es confiablemente asistida.

**Decisiones inconsistentes:** Estableciste un enfoque arquitectónico — digamos, todos los accesos a base de datos a través de una capa de repositorio. Claude comienza escribiendo llamadas directas a base de datos en un servicio. Preguntado para explicar, produce razonamiento que contradice decisiones anteriores sin reconocer la contradicción.

**Re-preguntar por información:** Claude pregunta por información que recuperó o proporcionaste temprano en la sesión. El hecho está en contexto; el modelo no lo está recuperando.

**Respuestas vagas sobre tópicos específicos:** Temprano en la sesión, Claude produjo respuestas precisas y específicas. Luego en la misma sesión, en preguntas similares, las respuestas se vuelven vagas, genéricas o refieren la parte equivocada del código base. Esto refleja atención aplanada en un contexto grande en lugar de recuperación enfocada.

**La corrección no es siempre corregir:** Corregir después de que la descomposición se establezca agrega más tokens y compone el problema. La respuesta correcta es compactar o comenzar una sesión fresca.

---

## 7 estrategias de optimización

### 1. Carga frontal: primacía y recencia

La atención no es uniforme en la ventana de contexto. Claude atiende de forma confiable al inicio y fin del contexto más fuerte que al medio — este es el efecto de primacía y recencia. Estructura tu contexto para explotar esto.

**Restricciones de carga frontal:**

```
# Apertura de sesión buena — restricciones establecidas antes de cualquier uso de herramienta
Estás trabajando en el servicio de pagos en este monorepo.
Restricciones clave para esta sesión:
- Todas las llamadas a base de datos van a través de src/db/repositories/ — nunca directamente a Prisma
- La clase PaymentService debe permanecer sin estado — sin variables de instancia que contengan estado
- El manejo de errores debe usar la clase AppError desde src/errors/
- Nunca modifiques el directorio de migraciones — los cambios de esquema están fuera de alcance

Ahora comencemos revisando la implementación actual de PaymentService.
```

Si abres una sesión con uso de herramienta inmediatamente — lecturas de archivo, comandos bash — estas restricciones se empujan hacia abajo. Cuando el contexto se llena, están enterradas en la mitad de la ventana.

**Repetir restricciones críticas al final de entradas largas:**

Para mensajes de usuario muy largos o indicativos estructurados, reafirma la restricción más importante al final:

```
[... 500 tokens de contexto ...]

Recuerda: todo acceso a base de datos debe ir a través de la capa de repositorio.
```

La señal de recencia asegura que la restricción está en la atención inmediata de Claude cuando comienza a generar.

**No cargues ruido al frente:** Aplica la misma lógica inversamente. La información de antecedentes verbosa que no es relevante para la decisión no debe ocupar el slot de primacía. Lidera con restricciones y objetivos, no con historial del proyecto.

---

### 2. Resúmenes estructurados: tiempo de compactación

El comando `/compact` se cubre en detalle en [context-budget.md](context-budget.md). La pregunta de tiempo es específica para sesiones de contexto largo.

**Compacta en 40–50% de llenado, no 80%.**

En 50% de llenado, el sumarizador de compactación tiene señal de alta calidad para trabajar. La conversación es lo suficientemente larga como para haber producido decisiones significativas, pero lo suficientemente corta como para que el sumarizador aún pueda distinguir señal de ruido. El resumen resultante es preciso y completo.

En 80% de llenado, el sumarizador está trabajando con un contexto que ya está parcialmente degradado. El resumen que produce refleja el estado degradado — decisiones tempranas importantes pueden estar subrrepresentadas o faltantes.

**Usa compactación dirigida:**

```
/compact enfócate en la refactorización de autenticación — retén la decisión de usar RS256 y la forma JWT, descarta el contexto de depuración para el problema del token expirado
```

Sin una directiva, el sumarizador hace elecciones autónomas sobre qué importa. Una directiva específica lo ancla a tu hilo de trabajo actual.

**Compacta entre fases principales, no a mitad de tarea:**

Compacta después de completar una subtarea acotada, antes de comenzar la siguiente. Compactar a mitad de tarea riesgo perder el estado intermedio que necesitas continuar. El patrón:

```
Fase 1: exploración y análisis → completa → /compact "retén hallazgos en arquitectura del módulo de pagos"
Fase 2: implementación → ... → completa → /compact "retén todos los cambios realizados, rutas de archivo, decisiones de diseño"
Fase 3: pruebas → ...
```

---

### 3. Lecturas dirigidas: offset y límite

Cada lectura de archivo entra en contexto en completo a menos que la constrinas. Para sesiones de contexto largo, esta es la fuente principal de hinchazón evitable.

**Usa `offset` y `limit` en la herramienta Leer:**

```
# Archivo de 2,000 líneas: ~20K tokens — lee archivo completo
Read /path/to/service.ts

# Lectura dirigida de líneas 400–450: ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

**Grep antes de leer.** Usa Grep para localizar la sección relevante, luego lee solo esa sección:

```bash
# Paso 1: encuentra la función relevante
grep -n "processPayment" /path/to/payments.service.ts

# Salida: línea 847
# Paso 2: lee solo esa sección
Read /path/to/payments.service.ts, offset: 840, limit: 60
```

Este patrón — grep primero, lectura dirigida segundo — reduce consistentemente el consumo de contexto en 80–95% para tareas de navegación.

**Resume antes de leer archivos grandes:**

Para archivos muy grandes donde necesitas comprensión de alto nivel antes de decidir qué leer:

```bash
wc -l /path/to/large-file.ts && grep -n "^export\|^class\|^function\|^const.*=.*function" /path/to/large-file.ts | head -40
```

Esto te da los exports y estructura del archivo en ~40 líneas (~400 tokens) en lugar de leer 2,000+ líneas para entenderlo.

---

### 4. Recorte de salida de Bash

La salida de Bash sin controlar es la causa más común de llenado de contexto repentino en sesiones largas. Un único `npm install`, `docker build` o `pytest -v` puede agregar 5–20K tokens en una llamada de herramienta.

**Aplica estos patrones sistemáticamente:**

```bash
# Limita volumen de registro
docker logs my-container --tail 50
npm test 2>&1 | tail -30
./run-suite.sh | grep -E "PASS|FAIL|ERROR|WARN" | head -50

# Suprime ruido en la fuente
curl -s https://api.example.com/v1/status         # -s suprime progreso
rsync -a --quiet src/ dst/
npm install --silent

# Redirige stderr cuando no es relevante
make build 2>/dev/null
python setup.py install 2>/dev/null

# Extrae señal antes de que entre en contexto
git log --oneline -20
git diff --stat HEAD~5 HEAD
find . -name "*.ts" -newer src/auth.ts | head -20
```

**Canalizar-y-filtrar como disciplina predeterminada:**

```bash
# En lugar de: node scripts/analyze.js
# Usar: node scripts/analyze.js | grep -v "^DEBUG:" | head -100
```

El recuento exacto de líneas importa menos que el hábito. Cualquier comando Bash con salida potencialmente sin limites debe tener una tubería de truncamiento antes de entrar en contexto.

---

### 5. Aislamiento de subagente para tareas de lectura grandes

Cuando una tarea requiere leer muchos archivos — una encuesta de código base, un análisis de dependencia, un escaneo de seguridad a través de 50 módulos — hacerlo en el contexto principal llena la ventana con datos intermedios que solo son útiles para producir una conclusión.

**El patrón de subagente:**

```
# Lo que NO hacer (contexto principal lee 40 archivos):
"Lee todos los archivos en src/auth/ y cuéntame qué hacen"
[Claude lee 40 archivos en contexto principal — ~80K tokens]
"Ahora resume la arquitectura"

# Lo que hacer (subagente lee, devuelve resumen):
Genera un subagente con:
  Tarea: Encuesta todos los archivos en src/auth/.
  Devuelve: Un resumen estructurado cubriendo (1) qué exporta cada archivo,
  (2) el gráfico de dependencia entre ellos, (3) cualquier archivo que contenga
  lógica sensible a la seguridad como validación de token o verificación de permiso.
  No devuelvas contenidos de archivo — devuelve solo análisis estructurado.

[El subagente lee 40 archivos en su propio contexto — el contexto principal recibe ~1K tokens de hallazgos estructurados]
```

El contexto principal recibe conclusiones, no los datos intermedios sin procesar. El contexto del subagente se descarta después de la tarea.

**Cuándo usar aislamiento de subagente:**
- La tarea implica leer más de 10 archivos para propósitos de descubrimiento
- Los salidas de lectura intermedias (contenidos de archivo) no serán necesitadas nuevamente después de la conclusión
- La tarea es acotada y tiene un formato de entrega claro

**Cuándo no usarlo:**
- Necesitarás editar directamente los archivos siendo encuestados — el contexto padre necesita verlos
- La tarea es lo suficientemente simple que el sobrecargo de generación no vale la pena

---

### 6. Alcance CLAUDE.md

`CLAUDE.md` carga en cada inicio de sesión y ocupa primacía — es el primer contenido en contexto. Cada token en él es un costo fijo pagado en cada sesión que ejecutas.

**Reglas para sesiones de contexto largo:**

Mantén el `CLAUDE.md` de proyecto bajo 2,000 tokens. Esto no es una preferencia estética — es una decisión de presupuesto. Un `CLAUDE.md` de 3,000 tokens cuesta 1,000 tokens extra de contexto de posición-primacía en cada sesión. A través de 50 sesiones por día, esto es 50,000 tokens extra diarios, agravándose en costos de escritura de caché.

**Qué pertenece en CLAUDE.md (permanece para siempre):**
- Descripción del proyecto: 3–5 oraciones
- Directorios clave y su propósito
- Convenciones no obvias que Claude debe seguir
- Construcción, prueba, comandos lint
- Cosas que no se deben modificar sin instrucción explícita

**Qué no pertenece (carga bajo demanda):**
- Documentación de referencia de API — carga a través de una Lectura dirigida cuando se trabaja en esa área
- Decisiones históricas — mantén un `decisions.md` separado, cárgalo solo cuando se trabaja en el dominio relevante
- Ejemplos largos — referencia por ruta de archivo, lee bajo demanda
- Reglas para subsistemas que no estás trabajando actualmente

**Archivos CLAUDE.md con alcance de dominio:**

Para monorepos grandes, usa archivos `CLAUDE.md` a nivel de directorio:

```
/repo/
  CLAUDE.md                    # convenciones globales — bajo 1,000 tokens
  src/
    payments/
      CLAUDE.md                # reglas específicas de pagos — cargadas solo cuando Claude está en este directorio
    auth/
      CLAUDE.md                # reglas específicas de auth
```

Claude lee el `CLAUDE.md` a nivel de directorio cuando navega a ese directorio. Esto significa que el contexto carga incrementalmente a medida que el trabajo se mueve en dominios, en lugar de cargar todas las reglas de subsistema en inicio de sesión.

---

### 7. llms.txt: documentación externa sin pegar

Cuando una tarea requiere documentación externa — una referencia de API de biblioteca, una referencia de configuración de framework, una guía de integración de servicio — el instinto predeterminado es pegar las secciones relevantes en la conversación. Para sesiones de contexto largo, esto es costoso y a menudo innecesario.

**Verifica llms.txt primero:**

```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
curl -s https://docs.example.com/llms.txt | head -50
```

`llms.txt` es un formato de documentación comprimida diseñado para consumo LLM. Las librerías y frameworks que lo publican proporcionan representaciones 5–10x más pequeñas de su documentación comparado con contenido equivalente de sitio de docs. Si existe, úsalo como referencia primaria.

**Obtén solo la página específica que necesitas:**

```bash
# En lugar de: pega toda la documentación de hooks de React
# Usar: obtén la página del hook específico
curl -s "https://react.dev/reference/react/useCallback" | \
  python3 -c "import sys; from html.parser import HTMLParser; \
  class P(HTMLParser):
    def handle_data(self, d): print(d, end='')
  p = P(); p.feed(sys.stdin.read())" | \
  grep -v "^$" | head -100
```

O obtén a través de la herramienta WebFetch con una URL dirigida en lugar de raspar múltiples páginas vinculadas.

**Referencia, no pegues:**

Para APIs bien conocidas que Claude ya conoce (funciones de biblioteca estándar, APIs de framework principal), referencia el concepto y deja que Claude razone desde el entrenamiento en lugar de pegar la documentación. Solo pega documentación cuando tienes una configuración específica e inusual o un problema de cutoff de conocimiento conocido.

---

## El hook PreCompact

Cuando `/compact` dispara — ya sea manualmente o automáticamente — Claude genera un resumen de la conversación desde su contexto actual. El hook `PreCompact` se dispara antes de que ese resumen sea generado, dándote una ventana para inyectar estado estructurado que el sumarizador incorporará.

Este es el patrón correcto para sesiones de contexto largo donde perder contexto operacional después de compactación forzaría trabajo de re-establecimiento.

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
# Se dispara antes de /compact. Inyecta estado de sesión estructurado en el contexto de compactación.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --name-only 2>/dev/null | head -20 || echo "none")
unstaged=$(git diff --name-only 2>/dev/null | head -20 || echo "none")
open_files=$(git status --short 2>/dev/null | head -20 || echo "none")

# Lee la lista de tareas abiertas si mantienes una
tasks_file="${CLAUDE_PROJECT_DIR}/.claude/tasks.md"
tasks=""
if [ -f "$tasks_file" ]; then
  tasks=$(tail -30 "$tasks_file")
fi

cat <<EOF
=== INYECCIÓN DE ESTADO PRE-COMPACTO ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Rama: ${branch}

Commits recientes:
${recent_commits}

Archivos preparados:
${staged}

Archivos sin preparar:
${unstaged}

Estado del árbol de trabajo:
${open_files}
EOF

if [ -n "$tasks" ]; then
cat <<EOF

Tareas abiertas (desde .claude/tasks.md):
${tasks}
EOF
fi

echo "=== FIN INYECCIÓN DE ESTADO ==="
```

El contenido inyectado está presente en contexto cuando se genera el resumen de compactación. El resumen que Claude escribe incorporará la rama, historial de commit y estado de archivo — así que post-compactación, esta información está disponible sin requerir re-establecimiento.

**Extendiendo este patrón:**

Agrega cualquier estado estructurado que sea costoso derivar nuevamente después de compactación:
- Decisiones arquitectónicas hechas durante la sesión (leer desde un registro de decisiones)
- La salida de una fase de análisis mayor (escribe a un archivo a mitad de sesión, inyecta en tiempo de compacto)
- La cola de tareas actual si mantienes una

---

## Rastreo de uso de contexto con `/usage`

El comando `/usage` muestra un desglose de tokens por categoría para la sesión actual.

**Ejecútalo al inicio de sesión:**

```
/usage
```

El resumen de inicio de sesión muestra tu sobrecarga fija antes de cualquier trabajo: indicativo del sistema, CLAUDE.md, definiciones de herramientas MCP. Si este número excede 30–40K tokens, tienes un problema de configuración — demasiados servidores MCP, un `CLAUDE.md` demasiado crecido, o ambos. Arréglalo antes de que la sesión crezca.

**Categorías mostradas:**

| Categoría | Qué refleja | Acción si es alto |
|---|---|---|
| Indicativo del sistema | Built-ins de Claude Code + CLAUDE.md | Recorta CLAUDE.md; desactiva servidores MCP sin usar |
| Definiciones de herramientas MCP | Una entrada por herramienta en todos los servidores habilitados | Desactiva servidores que no usas en esta sesión |
| Historial de conversación | Turnos acumulados — usuario y asistente | Compacta si se acerca 40% |
| Resultados de herramientas | Lecturas de archivo, salidas de bash, respuestas MCP | Revisa llamadas de herramientas recientes para salidas detalladas |
| Llamadas de subagente | Contribución de contexto de cada subagente generado | Asegura que los subagentes devuelven resúmenes, no historial de herramientas sin procesar |

**Úsalo para hacer benchmark de fases:**

Ejecuta `/usage` al inicio de cada fase mayor — después de exploración, después de planificación, después de que comienza la implementación. Esto te da un mapa de consumo: cuántos tokens cuesta cada fase. En un proyecto segundo o tercero similar, puedes predecir dónde golpearás el umbral de 40% y planificar la compactación proactivamente.

---

## Patrones de bucles autónomos

Las sesiones autónomas de larga duración acumulan contexto de manera diferente a las sesiones interactivas. Cada iteración de bucle agrega a la misma ventana a menos que la sesión sea estructurada para evitarlo.

**Escribe estado a disco entre iteraciones:**

```bash
# Al final de cada iteración de bucle, escribe estado estructurado
cat > "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json" <<'EOF_TEMPLATE'
{
  "iteration": ${ITERATION},
  "completed": ${COMPLETED_JSON},
  "current_task": "${CURRENT_TASK}",
  "blockers": ${BLOCKERS_JSON},
  "next": "${NEXT_TASK}",
  "decisions": ${DECISIONS_JSON}
}
EOF_TEMPLATE
```

**Lee estado al inicio de cada iteración:**

```bash
# Inicio de siguiente iteración — lee el archivo de estado en lugar de cargar contexto
state=$(cat "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json")
echo "Reanudando desde estado: $state"
```

La sesión lleva solo los contenidos del archivo de estado como su contexto de inicio para la nueva iteración. Todo el historial de herramientas intermedio de iteraciones anteriores está ausente.

**Usa ScheduleWakeup para reinicios de contexto duros:**

Cuando una iteración de bucle tomará tiempo de pared significativo, usa `ScheduleWakeup` para terminar la ventana de contexto actual y reanudar en una fresca en el siguiente tic. El cambio es una falta de caché (retrasos de unos pocos minutos o más para inicialización de contexto), que es aceptable cuando cada iteración toma más de unos pocos minutos y el sobrecargo de contexto acumulado no vale la pena cargar.

**Hooks SessionStart + Stop para estado persistente:**

Para trabajo autónomo multi-sesión, empareja un hook `Stop` (escribe resumen de sesión a disco) con un hook `SessionStart` (inyecta el resumen de sesión anterior). Ver [context-budget.md](context-budget.md) para la implementación completa. Esto le da a cada nueva ventana de contexto orientación estructurada sin requerir lecturas de exploración.

---

## Cuándo compactar versus iniciar una nueva sesión

La elección entre `/compact` y una sesión fresca depende de qué necesites cargar adelante.

**Compacta cuando:**
- Necesitas continuar la tarea actual — la compactación preserva el hilo de trabajo
- Se han realizado ediciones de archivo y necesitas que Claude permanezca consciente de ellas
- Estás a mitad de implementación y abandonar la sesión requeriría re-establecer contexto sobre cambios ya escritos
- La sesión está en 40–60% de llenado y la tarea tiene trabajo significativo pendiente

**Inicia una sesión fresca cuando:**
- La tarea actual está completa — no hay nada para cargar adelante
- La sesión se ha degradado significativamente y la calidad de compactación sería pobre
- Estás comenzando una tarea completamente no relacionada en el mismo código base
- La sesión está pasada 70% de llenado y no has compactado — la descomposición acumulada hace el resumen de compactación no confiable

**El costo de esperar:**

Compactar a 80% cuesta más que compactar a 50% de dos formas. Primero, la sesión de 80% ya se ha degradado — Claude ha estado operando a calidad más baja por 30% de la ventana de contexto que no necesitaba. Segundo, el resumen de compactación generado desde un contexto de 80% degradado es menos preciso que uno generado desde un contexto claro de 50%. Pagas la penalización de degradación y obtienes un resumen peor.

**Compactación dirigida para preservar el hilo crítico:**

```
/compact enfócate en la refactorización de integración de pagos — específicamente retén:
- La decisión de usar claves de idempotencia en todas las operaciones de escritura
- El cambio a PaymentService.processCharge() en línea 847
- El problema abierto con la lógica de reintento de webhook aún no resuelto
```

Sin esta dirección, el sumarizador puede no saber cuál de los muchos hilos de la sesión es el que estás continuando.

---

## Implicaciones de costo de sesiones de contexto grande

El tamaño de contexto afecta directamente al costo de múltiples formas que no siempre son inmediatamente obvias.

**Escritura de tokens de caché en primer turno:**

Cuando una sesión comienza, todo el contexto se escribe en el caché de indicativo. Una sesión de 200K incurre en 200K tokens de escritura de caché en turno uno. Estos se cobran a la tasa de escritura de caché, que es más baja que la tasa de token de entrada pero no cero. Ejecutar sesiones diarias en llenado de contexto alto compone este costo.

**Tokens de entrada en falta de caché:**

Si una sesión no golpea el caché — primera sesión, inicio frío, sesión anterior al TTL de caché — todos los tokens de contexto se cobran como tokens de entrada a la tasa completa. Para un contexto de 200K, esta es una diferencia de costo significativa versus un acierto de caché.

**La prima de ventana de 1M:**

La ventana de contexto extendida de 1M en Sonnet 4.6 lleva una prima en precio y latencia. Ejecutar una sesión de contexto completo de 1M con contenido útil de 200K y 800K ruido desperdicia ambos. Usa la ventana extendida solo cuando la tarea genuinamente requiere la capacidad.

**Gestión de costo práctico para sesiones de contexto largo:**

- Mantén sesiones enfocadas en tareas únicas — el contexto inactivo no ahorra dinero
- Compacta antes de comenzar tareas de múltiples archivos costosas para mantener la línea de base baja
- Desactiva servidores MCP no necesitados para la sesión actual (las definiciones de herramientas MCP cargan en inicio de sesión y no pueden ser removidas a mitad de sesión)
- Usa la ventana estándar de 200K para todas las tareas que no demostradamente requieren más

---

## Lista de verificación pre-sesión para trabajo de contexto largo

Antes de iniciar una sesión que esperes ejecutar por más de 50–100 turnos o implique lecturas de archivo significativas, verifica estos 12 elementos.

- [ ] **Selección de modelo confirmada** — usando contexto de 1M solo si la tarea genuinamente lo requiere
- [ ] **Solo servidores MCP necesarios habilitados** — desactiva servidores no usados en esta sesión
- [ ] **CLAUDE.md está bajo 2,000 tokens** — auditarlo si ha crecido orgánicamente
- [ ] **Restricciones críticas escritas** — serán cargadas al frente en el mensaje de apertura
- [ ] **Estrategia de lectura de archivo planeada** — grep-entonces-lectura-dirigida, no lecturas de archivo completo
- [ ] **Tuberías de salida Bash en su lugar** — todos los comandos con salida sin limites tienen `| head -N` o `| grep pattern`
- [ ] **Hook de compresión PostToolUse instalado** — ver [context-budget.md](context-budget.md) para implementación
- [ ] **Hook PreCompact instalado** — inyectará estado git y lista de tareas en tiempo de compactación
- [ ] **Umbral de compactación decidido** — plan para compactar a 40–50% de llenado, no 80%+
- [ ] **Plan de subagente listo** — tareas involucrando 10+ lecturas de archivo serán delegadas a subagentes
- [ ] **Patrón de estado-a-disco configurado** — para bucles autónomos, rutas de archivo de estado definidas
- [ ] **`/usage` será verificado en inicio de sesión** — sobrecarga de línea base confirmada antes de primera tarea

Estos elementos son casillas, no objetivos aspiracionales. Faltando el hook PostToolUse cuesta dinero real en cada comando bash detallado en la sesión. Faltando la decisión del umbral de compactación significa que compactarás reactivamente a 80% en lugar de proactivamente a 50%. Cada elemento tiene un impacto medible en la calidad de sesión y costo.

---

## Patrones de fallo comunes y sus correcciones

**Fallo: la sesión se degrada en turno 30 a pesar de estar bajo 50% de llenado**

Causa: una salida de herramienta detallada temprana en la sesión (p. ej., una lectura de registro de 5,000 líneas en completo) está ocupando 40% de la ventana, dejando 10% para contexto de trabajo actual.

Corrección: identifica el bloque grande a través de `/usage`, nota que la categoría de resultados de herramientas es alta en relación al historial de conversación. Avanzando, agrega recorte de salida al comando ofensivo.

**Fallo: post-compactación Claude pregunta sobre cosas que debe saber**

Causa: el resumen de compactación perdió decisiones clave porque no fueron cargadas al frente o reforzadas. El sumarizador las deprioritizó.

Corrección: usa compactación dirigida con instrucciones de retención explícitas. Instala el hook PreCompact. Post-compactación, abre con una breve reafirmación de las restricciones más críticas antes de continuar trabajo.

**Fallo: sesión de contexto de 1M es lenta y costosa pero no produce resultados mejores**

Causa: la tarea no necesita tokens 1M. La capacidad extra se llena con ruido — salidas de bash detalladas, lecturas de archivo completo, contexto repetido.

Corrección: cambia a 200K estándar. Aplica estrategias de higiene de contexto para caber la sesión dentro de la ventana más pequeña. Si la tarea genuinamente no cabe en 200K con higiene adecuada, revisita la ventana 1M.

**Fallo: bucle autónomo degradado a través de 20 iteraciones sin compactación**

Causa: cada iteración agregó 10K tokens de historial de herramientas a la misma contexto sin mecanismo de reinicio.

Corrección: implementa el patrón de escrita-estado-a-disco. Considera ScheduleWakeup para un reinicio duro entre iteraciones largas.

---
