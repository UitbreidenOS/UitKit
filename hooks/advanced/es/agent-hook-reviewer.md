# Hook: Agent Reviewer — Spawn a Code-Review Subagent on Session Stop

Demuestra el hook `"type": "agent"`, que genera un subagente completo cuando se activa un evento. El subagente se ejecuta de forma asincrónica con su propio acceso a herramientas, lee los cambios de la sesión y produce una revisión estructurada, sin bloquear la sesión principal ni requerir invocación manual.

## What it does

Cuando la sesión principal de Claude Code termina (evento `Stop`), el harness genera un subagente configurado por el bloque `agent` del hook. El subagente:

1. Recibe el `stop_reason`, `session_id` y `project_dir` de la sesión en su contexto del sistema.
2. Lee el diff de git de los cambios realizados durante la sesión (`git diff HEAD~1` o `git diff --staged`).
3. Evalúa el diff para detectar errores de corrección, problemas de seguridad y violaciones de estilo.
4. Escribe una revisión estructurada en `.claude/reviews/<session_id>-review.md`.
5. Si encuentra problemas bloqueadores (severidad `error`), también añade un resumen a `.claude/reviews/open-issues.log` para que el desarrollador los aborde en la próxima sesión.

El agente generado tiene un conjunto de herramientas limitado: solo `Bash` (comandos git de solo lectura), `Read` y `Write` al directorio `.claude/reviews/`. No tiene permiso para editar archivos del proyecto, hacer commits ni llamar a APIs externas.

Ejemplo de salida de revisión en `.claude/reviews/abc123-review.md`:

```markdown
# Code Review — Session abc123 (2026-06-03T11:00:00Z)

## Summary
3 files changed, 120 insertions, 14 deletions

## Findings

### ERROR — src/auth/token.py:47
Hardcoded fallback secret `"dev-secret-do-not-use"` reachable in production if
`SECRET_KEY` env var is unset. Must be replaced with a hard failure.

### WARNING — src/api/users.py:112
N+1 query in `list_users()` — `get_user_permissions()` called inside loop.
Consider a bulk fetch before the loop.

### INFO — tests/test_auth.py
Good: new token expiry tests cover both the happy path and the expired-token branch.
```

## When it fires

`Stop` — se activa cuando la sesión principal termina, ya sea porque el usuario escribió `/exit`, la tarea se completó o la sesión agotó el tiempo. El subagente se ejecuta después de que la sesión ya ha parado; no retrasa la capacidad del usuario de cerrar la terminal.

Otros emparejamientos útiles para el tipo de hook `agent`:

| Event | Subagent purpose |
|---|---|
| `Stop` | Post-session code review, cost summary, changelog entry |
| `SubagentStop` | Validate subagent output before it is surfaced to the main agent |
| `PostToolUse` (Write) | Trigger a documentation-update agent when source files change |

## settings.json entry

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "agent",
            "agent": {
              "prompt": "You are a code reviewer. A Claude Code session has just ended. Your job is to review the changes made during this session and write a structured report.\n\nSteps:\n1. Run `git diff HEAD~1 --stat` to see which files changed.\n2. Run `git diff HEAD~1` to read the full diff.\n3. Analyse the diff for: correctness bugs, security issues (hardcoded secrets, injection vectors, missing auth checks), performance problems (N+1 queries, unbounded loops), and missing test coverage.\n4. Write your findings to `.claude/reviews/${CLAUDE_SESSION_ID}-review.md` using this format:\n   - A Summary section (files changed, lines added/removed)\n   - A Findings section with severity labels: ERROR / WARNING / INFO\n   - Each finding: severity, file:line, one-sentence description, one-sentence recommendation\n5. If any ERROR-severity findings exist, append a one-line summary to `.claude/reviews/open-issues.log`.\n6. If there are no changes (clean working tree), write a one-line note and exit.\n\nBe concise. Findings should be actionable. Do not restate the diff — diagnose and recommend.",
              "model": "claude-sonnet-4-5",
              "tools": ["Bash", "Read", "Write"],
              "tool_permissions": {
                "Bash": {
                  "allow": ["git diff*", "git log*", "git show*", "git status*"],
                  "deny": ["git commit*", "git push*", "git reset*", "rm *", "curl *"]
                },
                "Write": {
                  "allow": [".claude/reviews/*"]
                }
              },
              "max_turns": 10,
              "timeout": 120
            }
          }
        ]
      }
    ]
  }
}
```

## The spawned agent's tools and output

**Herramientas disponibles para el subagente:**

| Tool | Scope |
|---|---|
| `Bash` | Read-only git commands only (`git diff`, `git log`, `git show`, `git status`). Write commands are blocked by the `tool_permissions` deny list. |
| `Read` | Unrestricted — can read any file in the project to understand context around a diff hunk. |
| `Write` | Restricted to `.claude/reviews/` — cannot modify project files. |

**Artefactos de salida:**

- `.claude/reviews/<session_id>-review.md` — la revisión estructurada completa para esta sesión.
- `.claude/reviews/open-issues.log` — registro de solo adición de hallazgos de severidad ERROR en sesiones. Revisa este archivo al inicio de una nueva sesión para recoger problemas sin resolver.

**Ciclo de vida del subagente:**

El subagente se genera de forma asincrónica después de `Stop`. Se ejecuta en un proceso separado; la terminal está libre inmediatamente. El harness escribe el estado de salida del subagente en `.claude/reviews/<session_id>-agent.log`. Si el subagente excede el `timeout` (120 segundos), el harness lo mata y escribe una revisión parcial con un aviso de tiempo agotado.

## Notes

- Establece `"model": "claude-sonnet-4-5"` para el revisor. Haiku produce hallazgos superficiales en diffs complejos; Opus es innecesario para coincidencia de patrones estructurada. Sonnet logra el equilibrio correcto entre calidad y costo.
- `max_turns: 10` es suficiente para la mayoría de diffs. Si tus sesiones cambian rutinariamente más de 20 archivos, aumenta a 20 e incrementa el `timeout` proporcionalmente.
- Añade `.claude/reviews/` a `.gitignore` a menos que quieras que las revisiones se confirmen junto con el código. Las revisiones contienen metadatos de sesión que no son útiles en el historial de versiones.
- Las listas de `tool_permissions` allow/deny usan patrones glob. Ajusta o relaja según sea necesario; por ejemplo, añade `"git stash*"` a la lista allow si tu flujo de trabajo usa stashes.
- Para mostrar las revisiones en la siguiente sesión automáticamente, añade un hook del ciclo de vida `Start` que lea `open-issues.log` y prependa los hallazgos sin resolver al contexto inicial de Claude.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
