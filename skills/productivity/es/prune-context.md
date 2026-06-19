---
name: prune-context
description: "Depurador de contexto de Claude Code: comando slash para resumir la sesión y restablecer la acumulación de tokens"
updated: 2026-06-19
---

# Depurador de Contexto (Context Pruner)

## Cuándo activar
Activar cuando el usuario ejecute el comando `/prune-context`, o cuando el consumo de tokens de la sesión sea alto, o cuando la ventana de contexto se esté saturando en una sesión larga.

## Cuándo NO usar
No usar al principio de una sesión, ni para consultas simples que no requieran persistencia del estado o reducción del contexto.

## Instrucciones
1. Pause las tareas actuales y revise el historial de conversaciones de la sesión activa.
2. Resuma la sesión en un estado altamente condensado y eficiente en tokens:
   - **Objetivo activo**: El objetivo actual de alto nivel en el que está trabajando.
   - **Completado en la sesión**: Una lista concisa con viñetas de los cambios, pruebas y archivos completados.
   - **Contexto arquitectónico clave**: Detalles cruciales del proyecto, las API o los archivos descubiertos durante la sesión.
   - **Próximos pasos**: Lista de verificación explícita de lo que debe hacerse a continuación.
3. Escriba este resumen en `.claude/pruned_context.md`.
4. Muestre el resumen en el chat para que el usuario pueda verlo.
5. Indique al usuario que ejecute el comando `/clear` para restablecer la ventana de contexto y limpiar el exceso de tokens.
6. Proporcione el comando o texto que debe ingresar después de limpiar para reanudar: *"Por favor, ejecute `/clear` ahora para restablecer la memoria. Una vez limpio, indíqueme: 'Resume from `.claude/pruned_context.md`' para restaurar este estado."*

## Ejemplo
Usuario: `/prune-context`
Claude:
Iniciando la depuración del contexto para reducir el exceso de tokens.
[Claude escribe el resumen en .claude/pruned_context.md]

### Instantánea de la Sesión Actual
- **Objetivo activo**: Reestructurar la documentación del README y añadir reglas de detención inmediata (fail-fast).
- **Completado**: Se crearon `rules/common/fail-fast.md` y `hooks/post-tool-use/fail-fast.sh`.
- **Contexto clave**: El compilador se ejecuta mediante `npm test` y requiere una configuración específica del autor de git.
- **Próximos pasos**: Implementar el hook pre-tool-use Plan-First.

Estado guardado en `.claude/pruned_context.md`.
Por favor, ejecute `/clear` ahora para restablecer la memoria y limpiar el exceso de tokens. Una vez limpio, indíqueme: `Resume from .claude/pruned_context.md` para restaurar este estado.
