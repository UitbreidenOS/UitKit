# Ciclo de vida del Worktree

Flujo de trabajo completo de cuatro comandos para administrar trabajo paralelo de Claude Code mediante worktrees git. Cada worktree es un directorio de trabajo aislado en su propia rama — múltiples sesiones Claude pueden ejecutarse simultáneamente sin pisarse los pies.

---

## Cuándo usarlo

- Ejecutar múltiples sesiones Claude Code en paralelo en el mismo repo
- Aislar trabajo experimental de una rama principal estable
- Revisar el trabajo de otra rama sin perturbar la sesión activa
- Cualquier flujo de trabajo donde desee aislamiento limpio de rama sin el costo de múltiples clones de repo

---

## Comandos

### Init — crear un worktree de una descripción de tarea

**Entrada:** descripción de tarea (texto libre)

**Pasos:**
1. Derivar nombre de rama en kebab-case de descripción de tarea (eliminar artículos, unir palabras significativas con `-`, máx 5 palabras)
2. Ejecutar:
   ```bash
   git worktree add -b {branch} .worktrees/{branch} main
   ```
3. Crear `.worktree-task.md` en el nuevo worktree:
   ```markdown
   # Tarea
   {descripción de tarea original}

   ## Rama
   {branch}

   ## Creada
   {marca de tiempo ISO}
   ```
4. Salida del comando de inicio:
   ```bash
   cd .worktrees/{branch} && claude
   ```

**Ejemplo:**
```
Init: "agregar manejo de webhook de Stripe para eventos de suscripción"
Rama: add-stripe-webhook-subscription
Worktree: .worktrees/add-stripe-webhook-subscription
```

---

### Check — estado de todos los worktrees activos

**Pasos:**
1. Ejecutar `git worktree list --porcelain` y analizar salida
2. Para cada worktree (excluyendo main):
   - Nombre de rama y hash de commit HEAD + mensaje
   - Si existe `.worktree-task.md` (indica tarea administrada activa)
   - `git diff --stat {main}...{branch}` — archivos modificados desde creación de rama
3. Salida tabla compacta:

```
Rama                                Último commit          Archivo de tarea  Archivos modificados
add-stripe-webhook-subscription     abc1234 add webhook    sí                3 archivos (+180/-0)
refactor-auth-middleware            def5678 wip            sí                7 archivos (+92/-61)
hotfix-null-pointer                 ghi9012 fix null       no                1 archivo  (+3/-1)
```

---

### Deliver — commit, push y crear PR de un worktree

**Precondición:** `.worktree-task.md` debe existir en directorio actual (confirma que está en worktree administrado, no main).

**Pasos:**
1. Leer descripción de tarea de `.worktree-task.md`
2. Eliminar `.worktree-task.md` — es un artefacto de trabajo, no código de proyecto y no debe aparecer en diferencia de PR
3. Preparar todos los cambios: `git add -A`
4. Determinar tipo de commit convencional de la diferencia:
   - Solo archivos nuevos → `feat:`
   - Eliminaciones y modificaciones → `fix:` o `refactor:`
   - Config/herramientas solo → `chore:`
5. Derivar mensaje de commit de descripción de tarea (imperativo, ≤72 caracteres)
6. Commit: `git commit -m "{type}: {message}"`
7. Push: `git push -u origin {branch}`
8. Crear PR:
   ```bash
   gh pr create --title "{type}: {message}" --body "{task description}"
   ```
9. Salida URL de PR

---

### Cleanup — eliminar worktrees fusionados

**Pasos:**
1. Listar todos los worktrees administrados: `git worktree list`
2. Para cada rama, verificar si se fusionó con main: `git branch --merged main`
3. Reportar qué sería eliminado (siempre mostrar esto antes de actuar)

**Banderas:**
- `--dry-run` — listar worktrees y ramas fusionadas, no tomar acción
- `--force-all` — solicitar confirmación, luego eliminar todos los worktrees fusionados:
  ```bash
  git worktree remove .worktrees/{branch}
  git branch -d {branch}
  ```

**Salida de dry-run:**
```
Se eliminaría:
  .worktrees/add-stripe-webhook-subscription  (fusionado con main en abc1234)
  .worktrees/hotfix-null-pointer              (fusionado con main en def5678)

Ejecutar con --force-all para eliminar.
```

---

## Convenciones de directorio

```
.worktrees/           # todos los worktrees administrados viven aquí
  {branch-name}/      # un directorio por worktree
    .worktree-task.md # creado por Init, eliminado por Deliver
```

Agregar `.worktrees/` a `.gitignore` — estos directorios son estado del sistema de archivos local, no contenido rastreado.

---

## Notas

- `.worktree-task.md` es la única señal de que un worktree es administrado por este flujo de trabajo. Los worktrees creados manualmente (sin Init) mostrarán "sin archivo de tarea" en salida Check y serán omitidos por Cleanup a menos que se pase `--force-all`.
- Nunca ejecutar `git worktree remove` en un worktree con cambios no confirmados a menos que tenga la intención de descartarlos. Check siempre muestra la estadística de diferencia antes de cualquier acción destructiva.
- Los worktrees comparten el mismo directorio `.git` que el repo principal. Las operaciones como `git fetch` y `git log` en cualquier worktree ven todas las ramas.

---
