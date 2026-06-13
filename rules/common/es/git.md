> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../git.md).

# Reglas de Git

Copia las secciones relevantes en el `CLAUDE.md` de tu proyecto.

---

## Mensajes de commit

- Formato: `tipo: descripción corta` (modo imperativo, ≤ 72 caracteres)
- Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Ejemplos: `feat: add webhook signature verification`, `fix: handle null user in auth middleware`
- Sin mensajes genéricos: "update", "changes", "fix bug", "wip" no son aceptables
- Cuerpo (opcional): explica el POR QUÉ, no el qué. El diff muestra el qué.

## Ramas

- Ramas de funcionalidades: `feat/descripción-corta`
- Correcciones de bugs: `fix/descripción-corta`
- Nunca hagas commit directamente en `main` o `master`
- Elimina las ramas después de hacer merge

## Qué nunca hacer commit

- Archivos `.env` o cualquier archivo que contenga secretos
- `node_modules/`, `__pycache__/`, artefactos de build
- Configuraciones personales del editor (`.idea/`, `.vscode/settings.json`)
- Archivos > 10MB (usa git-lfs o almacenamiento externo)
- Archivos generados que pueden reproducirse desde el código fuente

## Antes de hacer push

- Ejecuta las pruebas localmente — nunca hagas push en rojo
- Revisa tu propio diff antes de cada push: `git diff origin/main...HEAD`
- Aplasta los commits WIP antes de hacer push a una rama compartida
- Nunca hagas force-push en `main` ni en ninguna rama compartida

## Comandos peligrosos — siempre confirmar antes de ejecutar

- `git reset --hard` — destruye los cambios sin commit permanentemente
- `git clean -f` — elimina archivos sin rastrear permanentemente
- `git push --force` — reescribe el historial remoto
- `git stash drop` — descarta permanentemente los cambios guardados en stash

---
