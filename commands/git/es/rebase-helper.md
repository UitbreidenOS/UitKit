---
description: Producir un plan de rebase seguro y paso a paso para la rama actual en un objetivo
argument-hint: "[target-branch]"
---
Rama objetivo: $ARGUMENTS (por defecto `main` si no se proporciona).

Recopilar contexto:
1. `git log <target>...HEAD --oneline` — commits a ser rebaseados
2. `git diff <target>...HEAD --stat` — archivos tocados
3. `git log <target> -5 --oneline` — historial objetivo reciente
4. `git status` — estado del árbol de trabajo

Analizar y producir un plan de rebase que cubra:

**Verificaciones previas**
- Listar cualquier cambio no confirmado que deba ser almacenado o confirmado primero
- Identificar commits que pueden tener conflictos basándose en rutas de archivo superpuestas
- Marcar commits de fusión — el rebase interactivo necesitará `--rebase-merges` si están presentes

**Comando recomendado**
Proporcionar la invocación exacta de `git rebase` (interactivo o no, con banderas) apropiada para esta situación.

**Plan de commits** (para rebase interactivo)
Listar los commits en orden de rebase con la acción recomendada para cada uno:
- `pick` — mantener tal cual
- `squash` / `fixup` — combinar con su predecesor (explicar por qué)
- `reword` — mejorar el mensaje (proporcionar el nuevo mensaje)
- `drop` — eliminar (explicar por qué)
- `edit` — pausar para enmendar (explicar qué cambiar)

**Predicción de conflictos**
Para cada archivo que aparezca tanto en la rama como en el historial objetivo reciente, anotar el conflicto probable y sugerir la estrategia de resolución.

**Recuperación**
Proporcionar el comando exacto para abortar y restaurar el estado original si algo sale mal.

Sea preciso. No dude. Si el rebase es directo, dígalo brevemente.
