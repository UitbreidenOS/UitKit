# Claude Code Auto Mode — Referencia Profunda (Marzo 2026, Estable)

La versión estable de marzo de 2026 del Auto Mode reemplazó las capas de permisos anteriores basadas en heurísticas con un clasificador ML entrenado. El resultado práctico: 84% menos solicitudes de permisos en promedio en repositorios típicos, con una capa de rechazo fijo que es inmune a anulaciones de configuración. Esta guía cubre cómo funciona el clasificador, todas las opciones de `defaultMode`, patrones de configuración en equipos, la distinción entre `bypassPermissions` vs `--auto`, y un enfoque sistemático para diagnosticar acciones bloqueadas.

---

## El Clasificador ML de Permisos

### Qué es

Antes de marzo de 2026, Auto Mode utilizaba un conjunto de reglas estático en capas — operaciones de lectura aprobadas automáticamente, escrituras preguntaban una vez, operaciones destructivas siempre preguntaban. El problema: ese conjunto de reglas no tenía contexto. `git push` a un fork personal en un sandbox desencadenaba el mismo mensaje que `git push --force origin main` en un repositorio compartido. Cada `npm run` invocaba confirmación independientemente de lo que el script hiciera.

El clasificador de marzo de 2026 reemplaza capas estáticas con un modelo que evalúa cada llamada de herramienta propuesta contra tres ejes:

1. **Reversibilidad** — ¿se puede deshacer esta acción sin pérdida de datos?
2. **Radio de explosión** — ¿cuántos sistemas o colaboradores se ven afectados si esto sale mal?
3. **Señal de autorización** — ¿indica el contexto actual de la sesión (configuración del proyecto, aprobaciones previas, identidad del usuario) que esto fue preautorizado?

El clasificador emite una de tres etiquetas: `auto`, `ask`, o `deny`. La etiqueta `deny` tiene dos subtipos: `deny-soft` (anulable por configuración de usuario explícita) y `deny-hard` (no anulable bajo ninguna circunstancia).

### Cómo logra una reducción del 84%

La reducción proviene principalmente de tres mejoras sobre el sistema de capas estáticas:

**Conocimiento contextual de git.** El clasificador sabe si el repositorio remoto de destino es la rama canónica aguas arriba o una rama personal/fork, si `--force` está presente, si la rama tiene PR abiertas, y si el repositorio es un repositorio de equipo compartido o un sandbox privado. Un `git push` a `origin feature/my-branch` en un proyecto individual se clasifica como `auto`; el mismo comando dirigido a `main` en un repositorio con protección de rama se clasifica como `ask`.

**Fingerprinting de scripts.** Cuando Claude propone `npm run <script>`, el clasificador lee la definición del script desde `package.json` antes de etiquetar la llamada. Un script `build` que solo ejecuta `tsc` o `vite build` es `auto`. Un script `deploy` que contiene `aws s3 sync` o `kubectl apply` es `ask`. Un script `purge` que contiene `rm -rf dist/ && ...` es `deny-soft`.

**Memoria de sesión.** Una vez que un patrón de llamada es aprobado dentro de una sesión, las llamadas semánticamente equivalentes son `auto` para el resto de esa sesión. Apruebas `git commit` una vez; las siguientes llamadas a `git commit` no repromptean. Esto se limita a la sesión — no persiste entre reinicios a menos que lo codifiques en `settings.json`.

### Confianza del clasificador y alternativa

Cuando la puntuación de confianza del clasificador cae por debajo de 0.72 (el umbral predeterminado), retrocede a `ask` independientemente de la etiqueta predicha. Puedes observar esto en modo verbose:

```bash
claude --auto --verbose "Refactor the auth module"
```

Una decisión de baja confianza aparece en la salida como:

```
[classifier] git push origin feature/auth-refactor → ask (confidence: 0.61, fallback from: auto)
```

El umbral es configurable pero no se recomienda cambiar — es la guardia principal contra errores del clasificador causando automatización involuntaria.

---

## Opciones de `defaultMode`

`defaultMode` es el campo de nivel superior en `settings.json` que rige cómo se comporta Auto Mode cuando ninguna regla más específica coincide.

### Los Tres Valores

```json
{
  "defaultMode": "auto" | "ask" | "deny"
}
```

**`"ask"` (el predeterminado)**

Cada llamada de herramienta que no coincida con una regla de `allow` explícita genera un mensaje. Esta es la experiencia interactiva estándar. El clasificador ML sigue activo — informa la UI (por ejemplo, preseleccionando "Allow" para llamadas seguras de alta confianza) pero no suprime el mensaje.

**`"auto"`**

Las llamadas de herramienta clasificadas como `auto` por el clasificador ML se ejecutan sin mensaje. Las llamadas clasificadas como `ask` generan un mensaje. Las llamadas clasificadas como `deny-soft` se bloquean pero pueden desbloquearse mediante reglas de `allow` explícitas. Las llamadas clasificadas como `deny-hard` se bloquean independientemente de cualquier configuración.

Este es el modo destinado a estaciones de trabajo de desarrolladores ejecutando sesiones extendidas.

**`"deny"`**

Solo las llamadas de herramienta cubiertas por reglas de `allow` explícitas en `settings.json` se ejecutan. Todo lo demás se bloquea. Este es el modo correcto para agentes restringidos — tuberías CI, automatización adyacente a producción, entornos de contratista restringidos.

### Configurar por Ámbito

`defaultMode` puede establecerse en tres ámbitos. Los ámbitos inferiores anulan los superiores:

| Ámbito | Archivo | Uso típico |
|---|---|---|
| Global | `~/.claude/settings.json` | Predeterminado personal del desarrollador |
| Proyecto | `.claude/settings.json` | Línea base del equipo compartido |
| Local | `.claude/settings.local.json` | Anulación por desarrollador, gitignored |

```json
// ~/.claude/settings.json — predeterminado personal: auto para todos los proyectos
{
  "defaultMode": "auto"
}
```

```json
// .claude/settings.json — anulación del proyecto: ask en este repositorio compartido
{
  "defaultMode": "ask"
}
```

```json
// .claude/settings.local.json — anulación del desarrollador: auto incluso en repositorio compartido
{
  "defaultMode": "auto"
}
```

Un desarrollador puede establecer su predeterminado global a `"auto"` mientras el proyecto impone `"ask"`, y su `settings.local.json` se vuelve a optar por `"auto"` para su estación de trabajo. Este es el patrón de equipo recomendado.

---

## Configurar Auto Mode para Equipos

### La Estrategia de Configuración en Capas

Para un equipo de cualquier tamaño, el enfoque recomendado es:

1. **Proyecto `.claude/settings.json`** define la línea base segura — típicamente `"ask"` con reglas de `allow` explícitas para las operaciones que cada desarrollador ejecuta constantemente (lectura, búsqueda, pruebas).
2. **Desarrollador `~/.claude/settings.json`** establece preferencia personal — la mayoría de desarrolladores establecen `"auto"` aquí.
3. **Desarrollador `.claude/settings.local.json`** maneja anulaciones específicas del proyecto — útil cuando un desarrollador necesita `"auto"` en un proyecto que obliga `"ask"`.

Esto proporciona auditoría a los equipos (la configuración compartida se verifica en) sin restringir el flujo de trabajo del desarrollador individual.

### Configuración del Equipo de Línea Base

Un punto de partida razonable para un proyecto TypeScript/Node.js:

```json
// .claude/settings.json
{
  "defaultMode": "ask",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git show*)",
      "Bash(npm run lint)",
      "Bash(npm run test*)",
      "Bash(npm run typecheck)",
      "Bash(npm run build)",
      "Bash(tsc*)",
      "Bash(find . *)",
      "Bash(ls*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push origin main*)",
      "Bash(git push origin master*)",
      "Bash(npm publish*)",
      "Bash(rm -rf*)",
      "Bash(* | sudo *)",
      "Bash(sudo *)"
    ]
  }
}
```

Esta configuración significa: con `defaultMode: "ask"`, Claude prompta para la mayoría de cosas, pero las operaciones de lectura y prueba listadas nunca interrumpen el flujo, y las operaciones destructivas listadas se rechazan fuertemente a nivel del proyecto independientemente de la configuración personal del desarrollador.

### Configuración de CI/CD

En CI, usa `"deny"` como predeterminado y enumera exactamente lo que la tubería necesita:

```json
// .claude/settings.ci.json (pasar mediante la bandera --config)
{
  "defaultMode": "deny",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm ci)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Write(dist/*)",
      "Write(.claude/tasks.jsonl)"
    ]
  }
}
```

```bash
# En CI
claude --config .claude/settings.ci.json --dangerously-skip-permissions \
  "Work through .claude/tasks.jsonl and run the test suite"
```

`--dangerously-skip-permissions` en este contexto es seguro: el predeterminado `"deny"` y la lista de allow explícita significan que las únicas operaciones que Claude puede realizar son las del array `allow`. La bandera solo elimina la capa de solicitud de UI — el modelo de permiso aún se aplica por la configuración.

### Incorporar Nuevos Miembros del Equipo

Incluye lo siguiente en tu README del proyecto o documentos de incorporación:

```bash
# Habilitar el modo auto globalmente (recomendado para todos los desarrolladores)
# Agregar a ~/.claude/settings.json:
{
  "defaultMode": "auto"
}

# La .claude/settings.json del proyecto aplica líneas base seguras automáticamente.
# Tu configuración global "auto" está limitada por la configuración del proyecto.
# Para anular más para este proyecto solo, crear (gitignored):
touch .claude/settings.local.json
```

Un error común de incorporación: establecer `defaultMode: "auto"` en el `.claude/settings.json` compartido del proyecto. Esto fuerza a cada desarrollador en modo auto en CI y en contextos donde un humano puede no estar observando. Mantén la configuración compartida conservadora.

---

## Reglas de Rechazo Fijo

### Qué Significa Rechazo Fijo

Las etiquetas `deny-hard` del clasificador ML no pueden ser anuladas por ninguna regla de `allow` en ningún `settings.json` en ningún ámbito. No pueden ser evitadas con `--dangerously-skip-permissions`. No pueden ser desbloqueadas con `bypassPermissions`. Se aplican en el binario de Claude Code en sí, no en la configuración.

La versión estable de marzo de 2026 se envió con el siguiente conjunto de rechazo fijo:

| Patrón | Razón |
|---|---|
| `Bash(* --no-verify *)` en `git commit` o `git push` | Evita hooks pre-commit y pre-push, que son controles de seguridad |
| `Bash(rm -rf /)`, `Bash(rm -rf /*)` | Destrucción del sistema de archivos |
| `Bash(dd if=* of=/dev/*)` | Escrituras de disco sin procesar |
| `Bash(mkfs*)` | Creación del sistema de archivos (destructivo para datos existentes) |
| `Bash(chmod -R 777 *)` en rutas del sistema | Escalada de permisos |
| Cualquier comando modificando `/etc/sudoers` o `/etc/passwd` | Escalada de privilegios |
| `Bash(curl * | bash)`, `Bash(wget * | bash)` | Ejecución de código remoto via canalización |
| `Bash(python -c "import os; os.system*")` y cadenas de eval similares | Patrones de escape de sandbox |

### Rechazo Suave vs Rechazo Fijo en la Práctica

Cuando una llamada de `deny-soft` se bloquea, la salida de Claude incluye la etiqueta y la ruta para desbloquearla:

```
Action blocked: Bash(rm -rf dist/)
Classification: deny-soft
To allow: add "Bash(rm -rf dist/)" to permissions.allow in .claude/settings.json
```

Cuando una llamada de `deny-hard` se bloquea:

```
Action blocked: Bash(git commit --no-verify)
Classification: deny-hard
This action cannot be enabled via configuration. It is blocked at the binary level.
Reason: bypasses pre-commit hooks (security control)
```

Si encuentras un rechazo fijo que está bloqueando un caso de uso legítimo (por ejemplo, `--no-verify` durante una anulación de hook deliberada en un script controlado), debes ejecutar ese comando tú mismo en la terminal en lugar de delegarlo a Claude. Claude no lo ejecutará bajo ninguna configuración.

### Identificar Etiquetas de Rechazo Antes de Ejecutar

Usa `--dry-run` para ver las etiquetas del clasificador para cada llamada de herramienta propuesta antes de la ejecución:

```bash
claude --auto --dry-run "Clean up the build artifacts and push to the release branch"
```

La salida incluye un desglose por llamada:

```
[dry-run] Bash(rm -rf dist/)         → deny-soft  (confidence: 0.97)
[dry-run] Bash(git push origin main) → ask        (confidence: 0.89)
[dry-run] Read(package.json)         → auto        (confidence: 0.99)
```

Esto te permite ajustar tu solicitud de tarea o `settings.json` antes de gastar tokens en una sesión que se estancará.

---

## `bypassPermissions` vs `--auto`

Esta es la distinción más comúnmente malentendida en Auto Mode.

### Qué Hace Cada Una

**`--auto` (o `defaultMode: "auto"`)**

Le dice al clasificador que suprima mensajes para llamadas que etiqueta como `auto`. El modelo de permiso sigue ejecutándose. Las llamadas etiquetadas como `ask` aún generan mensajes. Las llamadas etiquetadas como `deny-soft` aún se bloquean (a menos que tengas una regla de `allow` explícita). Las llamadas etiquetadas como `deny-hard` siempre se bloquean.

El modo auto es una optimización de UX. Elimina fricción para operaciones sobre las que el clasificador es confiado. La red de seguridad está intacta.

**`bypassPermissions: true` / `--dangerously-skip-permissions`**

Deshabilita completamente la capa de solicitud de UI. Claude ejecuta todas las llamadas de herramienta sin detenerse a preguntar. Sin embargo — y esta es la distinción crítica — las reglas de `deny-hard` aún se aplican. La diferencia es que los bloqueos de `deny-soft` también se evitan.

`bypassPermissions` es una bandera de CI/sandbox. Asume que has codificado tus restricciones de seguridad completamente en reglas de `deny` y el conjunto de rechazo fijo. Si no has hecho esto correctamente, Claude puede ejecutar operaciones destructivas sin ninguna confirmación.

### El Modelo Mental Correcto

```
Solicitud de usuario
    │
    ▼
Clasificador ML
    │ auto ──────────────────────────────────────────── ejecutar (sin mensaje)
    │ ask  ──── [bypassPermissions?] ──── sí ────────── ejecutar (sin mensaje)
    │            │                                        │
    │            no                                       │
    │            │                                        │
    │            ▼                                        │
    │         preguntar al usuario ──── aprobado ──────── ejecutar
    │ deny-soft ── [regla de allow explícita?] ── sí ──── ejecutar (sin mensaje)
    │               │                                     │
    │               no                                    │
    │               ▼                                     │
    │            bloqueado (anulable via configuración)   │
    │ deny-hard ─────────────────────────────────────────── siempre bloqueado
```

### Cuándo Usar Cada Una

Usa `--auto` (o `defaultMode: "auto"`) cuando:
- Un humano está disponible para responder a ocasionales solicitudes de `ask`
- Deseas un flujo más suave sin sacrificar la red de seguridad
- Ejecutando en una estación de trabajo de desarrollador

Usa `--dangerously-skip-permissions` cuando:
- Ejecutando en un entorno CI arenado con una lista de `deny` preconfigurada
- El entorno es desechable (contenedor, VM, espacio de trabajo efímero)
- Has verificado que las reglas de `deny` en `settings.json` cubren todas las operaciones destructivas
- Ningún humano está observando y necesitas ejecución completamente no interactiva

Nunca uses `--dangerously-skip-permissions` en una estación de trabajo de desarrollador sin una lista de `deny` bloqueada. La combinación de `defaultMode: "auto"` y `--dangerously-skip-permissions` sin reglas de `deny` explícitas es efectivamente ningún modelo de permiso.

### Ejemplo Práctico: La Diferencia Importa

```bash
# Esta sesión se pausará en "git push origin main" y esperará aprobación
claude --auto "Implement the feature from TICKET-442 and push when tests pass"

# Esta sesión NO se pausará — empujará a main sin confirmación
# Seguro solo si .claude/settings.json niega "Bash(git push origin main)"
claude --dangerously-skip-permissions "Implement the feature from TICKET-442 and push when tests pass"
```

Para la mayoría de flujos de trabajo de desarrollo, `--auto` es la opción correcta. `--dangerously-skip-permissions` es para tuberías.

---

## Solución de Problemas de Acciones Bloqueadas

### Paso 1: Identificar la Clasificación

Ejecuta con `--verbose` para ver la salida del clasificador para la llamada bloqueada:

```bash
claude --auto --verbose "Run the deployment script"
```

Busca líneas como:

```
[classifier] Bash(./scripts/deploy.sh) → deny-soft (confidence: 0.94)
[classifier] reason: script contains 'kubectl apply' — blast radius: cluster
```

Si la salida no incluye líneas de clasificador, verifica que `--verbose` esté activo y que el bloqueo esté sucediendo en la capa de permiso (no un error de tiempo de ejecución).

### Paso 2: Verificar Malclasificación de Fingerprinting de Scripts

El clasificador lee contenidos de scripts desde `package.json` y archivos de script comunes, pero puede malclasificar si:

- El script es un envoltorio que llama a otro script dinámicamente
- La ruta del script se construye en tiempo de ejecución (por ejemplo, `bash ${SCRIPT_DIR}/run.sh`)
- El archivo de script está fuera de la raíz del proyecto

Para diagnosticar: ejecuta `claude --auto --dry-run` e inspecciona la puntuación de confianza. Baja confianza (< 0.72) desencadena una alternativa a `ask` o `deny-soft`. Si un script se malclasifica, agrega una regla de `allow` explícita en `settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(./scripts/deploy-staging.sh)"
    ]
  }
}
```

Nota: la regla de allow debe coincidir exactamente con la cadena de comando que Claude producirá. Usa `--dry-run` para ver la cadena exacta antes de escribir la regla.

### Paso 3: Distinguir Rechazo Suave de Rechazo Fijo

La salida de Claude establece explícitamente si un bloqueo es suave o fijo. Si es suave, la salida te dice la regla de `allow` exacta a agregar. Si es fijo, ningún cambio de configuración ayudará — necesitas ejecutar el comando tú mismo.

Malidentificación común: los desarrolladores asumen que los commits `--force` se rechazan fuertemente. No es así. `git commit --amend` es `deny-soft`. `git commit --no-verify` es `deny-hard`. La distinción es: `--amend` reescribe el historial (reversible con reflog), mientras que `--no-verify` evita hooks de seguridad (la evasión en sí es el problema, no el commit).

### Paso 4: Verificar Precedencia de Ámbito de Configuración

Un problema común: un desarrollador agrega una regla de `allow` a `settings.local.json`, pero la `settings.json` del proyecto tiene una regla de `deny` para el mismo patrón. Las reglas de `deny` en archivos de ámbito inferior no anulan las reglas de `deny` en archivos de ámbito superior — pero las reglas de `allow` en cualquier ámbito pueden anular las reglas de `deny-soft` de ámbitos superiores a menos que la configuración del proyecto use `forcePermissions`.

Verificar configuración efectiva:

```bash
claude --print-config
```

La salida muestra el conjunto de permisos fusionados con anotaciones de fuente:

```
permissions.allow:
  "Read"                          [global]
  "Bash(npm run test)"            [project]
  "Bash(./scripts/deploy.sh)"     [local]

permissions.deny:
  "Bash(git push --force*)"       [project] [forced]
  "Bash(rm -rf*)"                 [project] [forced]
```

Las reglas marcadas como `[forced]` no pueden ser anuladas por reglas de `allow` de ámbito inferior. El administrador del proyecto establece estos con la clave `forcePermissions`:

```json
// .claude/settings.json
{
  "forcePermissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(npm publish*)"
    ]
  }
}
```

### Paso 5: Ajuste del Umbral del Clasificador

Si el clasificador está aplicando consistentemente solicitudes de `ask` a operaciones que consideras seguras — y las puntuaciones de confianza están rondando 0.65–0.75 — puedes bajar el umbral de confianza por tu propia cuenta:

```json
// ~/.claude/settings.json
{
  "classifier": {
    "confidenceThreshold": 0.65
  }
}
```

Esta es una configuración personal, no una configuración de equipo. No la pongas en la configuración del proyecto. Umbrales más bajos significan más automatización pero también más potencial para que las llamadas malclasificadas se ejecuten silenciosamente.

### Paso 6: Depurar con Transcripciones de Sesión

Cada sesión de Claude Code escribe una transcripción a `~/.claude/sessions/`. Para una sesión de modo auto bloqueada o estancada, examina la última transcripción:

```bash
ls -t ~/.claude/sessions/ | head -1 | xargs -I{} cat ~/.claude/sessions/{}
```

Busca entradas `[blocked]` con la salida del clasificador adjunta. Esto te da la cadena de llamada exacta, la etiqueta, y la puntuación de confianza — las tres entradas que necesitas para escribir una regla de `allow` específica o diagnosticar una malclasificación.

### Patrones Comunes y Correcciones

| Síntoma | Causa probable | Corrección |
|---|---|---|
| `npm run deploy` siempre prompta | Script fingerprinted como despliegue | Agregar regla de `allow` explícita para el script exacto |
| `git push` a fork personal prompta | El clasificador no puede verificar el estado del fork | Agregar `allow` para ese patrón de remoto específico |
| Todo prompta a pesar de `defaultMode: "auto"` | La `settings.json` del proyecto tiene `defaultMode: "ask"` y `forcePermissions` | Verificar `--print-config` para reglas forzadas |
| Rechazo fijo en un comando que controlas | El comando coincide con un patrón de rechazo fijo | Reestructurar el comando para evitar el patrón |
| La sesión se estanca silenciosamente | Solicitud de `ask` emitida pero terminal no observando | Usar `--max-turns` para forzar salida; revisar transcripción |
| Baja confianza en todas las llamadas | El proyecto usa herramientas inusuales que el clasificador no ha visto | Agregar reglas de `allow` explícitas para tu cadena de herramientas |

---

## Referencia: Campos de Configuración Clave

```json
{
  "defaultMode": "auto",                    // auto | ask | deny
  "permissions": {
    "allow": ["..."],                       // patrones que siempre se ejecutan
    "deny": ["..."]                         // patrones que se bloquean (suave)
  },
  "forcePermissions": {
    "deny": ["..."]                         // reglas de deny que ámbitos inferiores no pueden anular
  },
  "classifier": {
    "confidenceThreshold": 0.72,            // por debajo de esto → alternativa a ask
    "verbose": false                        // registrar decisiones del clasificador a consola
  },
  "maxTurns": 200,                          // límite fijo de giros por sesión
  "bypassPermissions": false               // establecer verdadero solo en CI arenado
}
```

---

## Lista de Verificación de Inicio Rápido

- [ ] Establecer `defaultMode: "auto"` en `~/.claude/settings.json` para desarrollo local
- [ ] Agregar reglas de `deny` explícitas para operaciones destructivas en la `.claude/settings.json` del proyecto
- [ ] Usar `forcePermissions.deny` para reglas que deben mantenerse incluso cuando los desarrolladores anulan
- [ ] Probar tu configuración con `--dry-run` antes de ejecutar una sesión autónoma larga
- [ ] Usar `--dangerously-skip-permissions` solo en CI con una lista de `deny` bloqueada
- [ ] Monitorear la salida de `--print-config` al incorporar nuevos desarrolladores para capturar conflictos de ámbito
- [ ] Verificar transcripciones de `~/.claude/sessions/` después de cualquier sesión estancada

---

🔗 **[Uitbreiden — construyendo productos de IA y herramientas B2B con comunidades de desarrolladores.](https://uitbreiden.com/)**
📺 **[Suscribirse a nuestro Canal de YouTube para más análisis profundos](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
