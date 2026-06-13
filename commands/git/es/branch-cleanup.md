---
description: Identifica y lista ramas locales y remotas obsoletas seguras para eliminar
argument-hint: "[remote]"
---
Determina el remote por defecto. Usa $ARGUMENTS si se proporciona, en caso contrario detecta desde `git remote show` o retrocede a `origin`.

Ejecuta los siguientes comandos y captura su salida:
- `git branch -vv` — ramas locales con información de seguimiento de upstream
- `git branch -r` — ramas remotas
- `git log --oneline -1 HEAD` — confirma el estado de HEAD
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — metadatos de la rama

Clasifica cada rama local en una de estas categorías:

**Segura para eliminar:**
- Rama de seguimiento donde upstream es `[gone]` (rama remota eliminada)
- Completamente fusionada en la rama por defecto (`git branch --merged <default>`)
- Último commit más antiguo que 90 días sin asociación de PR abierto

**Posiblemente obsoleta — revisar primero:**
- Último commit entre 30–90 días atrás
- No fusionada, sin seguimiento de upstream configurado
- Nombre coincide con un patrón que sugiere una rama de corta vida (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**Mantener:**
- Rama HEAD actual
- `main`, `master`, `develop`, `staging`, `release/*` por defecto
- Cualquier rama con commits no alcanzables desde la rama por defecto y último commit dentro de 30 días

Imprime tres secciones con el nombre de la rama, fecha del último commit y razón de la clasificación.

Luego imprime los comandos exactos para eliminar las ramas seguras:
```
# Local
git branch -d <branch> ...

# Remote (si aplica)
git push <remote> --delete <branch> ...
```

Usa `-d` (eliminación segura), no `-D`, a menos que la rama ya esté confirmada como fusionada. No ejecutes ningún comando de eliminación — solo imprímelos para que el usuario los revise y ejecute.
