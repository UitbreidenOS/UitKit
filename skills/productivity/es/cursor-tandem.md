# Flujo de Trabajo Cursor + Claude Code Tándem

## Cuándo activar
El usuario utiliza tanto Cursor como Claude Code y pregunta cómo usarlos efectivamente juntos; el usuario menciona cambiar entre IDE y IA de terminal; el usuario quiere saber qué herramienta usar para una tarea determinada cuando ambas están disponibles.

## Cuándo NO usar
El usuario tiene solo una de las dos herramientas; el usuario hace preguntas sobre una herramienta aisladamente sin referencia a la otra; el usuario quiere una comparación para decidir qué herramienta comprar.

## Instrucciones

**Roles de herramientas — manténgalos distintos :**

- **Cursor** = IDE inteligente. Autocompletado en línea, chat multiarquivo, búsqueda de codebase, ediciones rápidas, escritura de componentes, revisión de diffs, exploración de código desconocido.
- **Claude Code** = agente autónomo de terminal. Ejecuta comandos de shell, orquesta sub-agentes, maneja tareas multietapa en muchos archivos, realiza commits, configura infraestructura.

**Enrutamiento de tareas — qué herramienta para qué trabajo :**

Buenas tareas Cursor:
- Escribir nuevos componentes o funciones
- Revisar un diff antes de hacer commit
- Explorar una codebase desconocida para entender la estructura
- Cambios rápidos y refactorizaciones locales
- Documentación en línea

Buenas tareas Claude Code:
- Ejecutar la suite de pruebas completa, luego corregir fallas
- Refactorizaciones a gran escala en 20+ archivos
- Configurar GitHub Actions, Dockerfiles o configs de CI/CD
- Migraciones de base de datos
- Cualquier cosa que requiera comandos bash u orquestación de sub-agentes
- Generación de características de extremo a extremo de especificación a PR

**Contexto compartido vía CLAUDE.md :**
Ambas herramientas leen `CLAUDE.md`. Escriba sus convenciones, reglas de nomenclatura, decisiones arquitectónicas y preferencias una vez — ambas herramientas las respetan automáticamente. Este es el punto de integración más importante.

**Regla crítica — nunca deje que ambas editen el mismo archivo simultáneamente.** Esto causa conflictos de git que ninguna de las dos herramientas puede resolver limpiamente. Termine la tarea Claude Code, haga commit, luego abra en Cursor.

**Patrón de entrega :**
1. Claude Code ejecuta la tarea multietapa → confirma el resultado
2. Abre el commit en Cursor para ajustes, revisión de código o pulido
3. Las ediciones Cursor van en un commit de seguimiento

**Patrón de uso paralelo :**
Ejecute Claude Code en segundo plano en una tarea larga (suite de pruebas, migración, compilación) mientras trabaja en Cursor en archivos no relacionados. Claude Code informa cuando termina sin bloquear su flujo de trabajo del editor.

## Ejemplo

"Utilizo Cursor para escribir componentes React y explorar la codebase. Cambio a la terminal Claude Code cuando necesito: ejecutar la suite de pruebas completa, refactorizar en 30 archivos, configurar GitHub Actions o realizar una migración de base de datos. `CLAUDE.md` contiene nuestras convenciones compartidas — ambas herramientas las toman automáticamente sin configuración adicional."

---
