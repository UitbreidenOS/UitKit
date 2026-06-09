---
description: Identificar y enumerar ramas locales y remotas obsoletas seguras de eliminar
argument-hint: "[remote]"
---
Determina el control remoto predeterminado. Usa $ARGUMENTS si se proporciona, de lo contrario detécta desde `git remote show` o usa `origin` como respaldo.

Ejecuta los siguientes comandos y captura su salida:
- `git branch -vv` — ramas locales con información de seguimiento ascendente
- `git branch -r` — ramas remotas
- `git log --oneline -1 HEAD` — confirma el estado de HEAD
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — metadatos de ramas

Clasifica cada rama local en una de estas categorías:

**Segura de eliminar:**
- Rama de seguimiento donde el upstream es `[gone]` (rama remota eliminada)
- Completamente fusionada en la rama predeterminada (`git branch --merged <default>`)
- Último commit más antiguo que 90 días sin asociación con PR abierto

**Posiblemente obsoleta — revisar primero:**
- Último commit entre 30–90 días atrás
- No fusionada, sin seguimiento upstream configurado
- Nombre coincide con un patrón que sugiere una rama de corta vida (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**Mantener:**
- Rama HEAD actual
- `main`, `master`, `develop`, `staging`, `release/*` por defecto
- Cualquier rama con commits no alcanzables desde la rama predeterminada y último commit dentro de 30 días

Genera tres secciones con nombre de rama, fecha del último commit y razón de la clasificación.

Luego imprime los comandos exactos para eliminar las ramas seguras:
```
# Local
git branch -d <branch> ...

# Remote (if applicable)
git push <remote> --delete <branch> ...
```

Usa `-d` (eliminación segura), no `-D`, a menos que la rama ya esté confirmada como fusionada. No ejecutes ningún comando de eliminación — solo imprímelos para que el usuario los revise y ejecute.
