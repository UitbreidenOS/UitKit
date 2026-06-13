# Guía de gestión de memoria

Cómo persistir contexto entre sesiones, sobrevivir a la compactación y mantener la memoria de trabajo de Claude afilada.

---

## El problema de la memoria

Claude Code no tiene memoria persistente entre sesiones por defecto. Cada nueva sesión comienza desde cero. Dentro de una sesión, el contexto crece hasta que se activa la compactación — en ese momento, el historial de conversación se comprime y se pierden detalles.

La gestión de memoria es la práctica de controlar explícitamente qué sabe Claude, cuándo lo sabe y cómo ese conocimiento sobrevive los límites de sesión.

---

## Las cuatro capas de memoria

| Capa | Dónde | Persiste entre sesiones | Sobrevive compactación |
|---|---|---|---|
| **CLAUDE.md** | Raíz del proyecto | Sí | Sí |
| **Archivos de sesión** | `.claude/memory/` o `.tmp/` | Sí (si se guarda) | Sí (si se guarda antes del compact) |
| **Ventana de contexto** | Solo en sesión | No | No (comprimido) |
| **Contexto de sub-agente** | Por sub-agente | No | No |

---

## 1. CLAUDE.md como memoria permanente

`CLAUDE.md` se lee al inicio de cada sesión. Es la capa de memoria más confiable.

**Qué pertenece a CLAUDE.md:**
- Descripción general de la arquitectura del proyecto (un párrafo, no exhaustivo)
- Convenciones que Claude haría mal sin orientación
- Decisiones ya tomadas que no deben revisarse
- Lo que Claude nunca debe hacer en este proyecto

**Qué NO pertenece a CLAUDE.md:**
- Trabajo en progreso o estado de tareas (cambia demasiado rápido, se vuelve obsoleto)
- Largas explicaciones de cómo funcionan las tecnologías
- Todo — CLAUDE.md de más de 500 líneas empieza a costar más de lo que aporta

---

## 2. Archivos de sesión para memoria de trabajo

Para contexto en progreso que no pertenece permanentemente a CLAUDE.md, usa archivos de sesión.

**Patrón:**
```
.claude/
└── memory/
    ├── current-task.md       ← en qué estás trabajando ahora mismo
    ├── decisions.md          ← decisiones tomadas esta semana
    └── context-dump.md       ← contexto necesario para una tarea larga
```

**Comprimir archivos de sesión:** Usa el patrón caveman-compress — reescribir archivos de memoria de sesión ahorra ~46% en tokens de entrada leídos cada sesión.

---

## 3. Hook pre-compact para sobrevivir

Cuando la compactación se activa automáticamente, cualquier contexto de trabajo en la sesión que no se haya guardado en un archivo se pierde. Un hook `PreCompact` se ejecuta antes de la compactación.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

**Lo que `pre-compact-save.sh` debe hacer:**
1. Pedirle a Claude que resuma: estado actual de la tarea, decisiones abiertas, archivos modificados, próximos pasos
2. Escribir ese resumen en `.claude/memory/session-state.md` con una marca de tiempo

---

## 4. Aislamiento de memoria de sub-agentes

Los sub-agentes obtienen una ventana de contexto limpia — no tienen memoria de la sesión padre por defecto.

**Pasar memoria a sub-agentes:**
- Incluir explícitamente las secciones relevantes de CLAUDE.md en el prompt del sub-agente
- Pasar las rutas de archivos específicas y decisiones que el sub-agente necesita

**Recuperar memoria de sub-agentes:**
- Hacer que el sub-agente escriba sus hallazgos en un archivo
- Leer ese archivo de vuelta en la sesión padre

---

## 5. CONTEXT.md para lenguaje de dominio

Los proyectos complejos se benefician de un `CONTEXT.md` — un glosario de términos específicos del dominio.

**Estructura:**
```markdown
# Contexto del proyecto

## Language
**Order**: Intención de compra de un cliente para uno o más Productos.
**Cart**: Estado temporal pre-pedido. Distinto de Order — no confundir.

## Relationships
- Un Order contiene uno o más OrderLines
- Un Cart pertenece exactamente a un User

## Decisions
- "Basket" se usaba en el código antiguo — resuelto: siempre usar "Cart"
```

---

## 6. Estrategia de compactación de memoria

**La compactación proactiva supera a la reactiva.**

**Cuándo compactar manualmente (`/compact`):**
- Antes de comenzar una nueva tarea importante en la misma sesión
- Después de terminar una larga sesión de depuración
- Cuando Claude empieza a repetir preguntas o pierde el hilo de las decisiones

---

## Referencia rápida

| Situación | Acción |
|---|---|
| Decisiones que nunca deben cambiar | Poner en CLAUDE.md |
| Estado de tarea actual | `.claude/memory/current-task.md` |
| Terminología del dominio | `CONTEXT.md` en raíz del proyecto |
| Sobrevivir compactación | Hook `PreCompact` → session-state.md |
| Comenzar nueva tarea importante | `/compact` primero |
| Pasar contexto a un sub-agente | Incluirlo explícitamente en el prompt |
| Claude hace preguntas ya respondidas | Añadir la respuesta a CLAUDE.md |

---

## Trabaja con nosotros
