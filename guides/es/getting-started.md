# Primeros pasos con Claudient

Esta guía te lleva de cero a un entorno Claude Code funcional con tu primera skill, agente y hook — en menos de 10 minutos.

---

## Requisitos previos

- [Claude Code](https://claude.ai/code) instalado y autenticado
- Un directorio de proyecto en el que estés trabajando activamente

---

## Paso 1 — Clonar Claudient

```bash

```

Ahora tienes la biblioteca completa localmente. Nada se ejecuta automáticamente — tú eliges lo que necesitas.

---

## Paso 2 — Configurar el directorio `.claude/` de tu proyecto

Claude Code busca la configuración en `.claude/` en la raíz de tu proyecto.

```bash
mkdir -p your-project/.claude/skills
mkdir -p your-project/.claude/hooks
```

La estructura de tu proyecto debería verse así:

```
your-project/
├── .claude/
│   ├── skills/        ← las skills van aquí (estándar actual)
│   ├── hooks/         ← los scripts de hooks van aquí
│   └── settings.json  ← la configuración de hooks va aquí
├── CLAUDE.md          ← las reglas van aquí
└── src/
```

---

## Paso 3 — Añadir tu primera skill

Las skills son comandos slash. Copia cualquier archivo `.md` de `skills/` a `.claude/skills/`:

```bash
# Ejemplo: añadir la skill de FastAPI
cp ~/Claudient/skills/backend/python/fastapi.md your-project/.claude/skills/
```

Ahora abre Claude Code en tu proyecto y escribe `/fastapi` — la skill se activa.

> **Nota:** `.claude/commands/` sigue funcionando (ruta heredada) pero `.claude/skills/` es el estándar actual. Cuando ambos existen, las skills tienen prioridad.

**Cómo elegir una skill:**
- Navega por `skills/` por categoría
- Lee la sección "When to activate" al inicio de cada archivo
- Si coincide con tu tarea actual, cópiala

---

## Paso 4 — Añadir una regla

Las reglas viven en `CLAUDE.md` en la raíz de tu proyecto. Claude lee este archivo al inicio de cada sesión.

```bash
# Copiar un conjunto de reglas comunes al CLAUDE.md de tu proyecto
cat ~/Claudient/rules/common/coding-style.md >> your-project/CLAUDE.md
```

O abre `rules/common/` y copia manualmente las secciones relevantes para tu proyecto.

---

## Paso 5 — Añadir tu primer hook

Los hooks se ejecutan automáticamente en los eventos de Claude Code. Viven en `.claude/settings.json`.

Crea o abre `.claude/settings.json` en tu proyecto:

```json
{
  "hooks": {}
}
```

Copia un hook de `hooks/` — cada archivo de hook incluye el JSON exacto a pegar. Por ejemplo, el hook de seguimiento de costes:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

Luego copia el script correspondiente:

```bash
cp ~/Claudient/hooks/lifecycle/cost-tracker.sh your-project/.claude/hooks/
chmod +x your-project/.claude/hooks/cost-tracker.sh
```

---

## Paso 6 — (Opcional) Añadir un agente

Los agentes son definiciones de sub-agentes que referencias en tus sesiones de Claude. No requieren copiar archivos — los llamas por `subagent_type` en una invocación de la herramienta Agent.

Navega por `agents/` para entender qué está disponible. Cuando quieras que Claude delegue una tarea a un especialista (por ejemplo, un revisor de seguridad, un especialista en bases de datos), referencia la definición del agente para entender qué espera y qué devuelve.

---

## Qué hacer a continuación

| Objetivo | Dónde buscar |
|---|---|
| Escribir tu propia skill | [guides/skill-authoring.md](skill-authoring.md) |
| Reducir costes de tokens | [guides/token-optimization.md](token-optimization.md) |
| Entender la memoria y el estado de sesión | [guides/memory-management.md](memory-management.md) |
| Asegurar tu configuración de Claude Code | [guides/security.md](security.md) |
| Construir workflows automatizados multi-paso | [guides/agent-orchestration.md](agent-orchestration.md) |
| Automatizar la calidad con hooks | [guides/hooks-cookbook.md](hooks-cookbook.md) |

---

## Solución de problemas

**La skill no aparece como comando slash**
— Comprueba que el archivo está en `.claude/skills/` (o `.claude/commands/` para la ruta heredada)
— Comprueba que la extensión del archivo es `.md`
— Reinicia Claude Code

**El hook no se activa**
— Verifica que el nombre del evento coincide exactamente: `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`
— Comprueba que la ruta del script es relativa a la raíz del proyecto
— Comprueba que el script es ejecutable (`chmod +x`)

**CLAUDE.md no se lee**
— Debe estar en la raíz del proyecto (al mismo nivel que `src/`, `package.json`, etc.)
— Reinicia la sesión de Claude Code después de editarlo

---

## Trabaja con nosotros
