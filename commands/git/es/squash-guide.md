---
description: Planifica y genera un script de rebase interactivo squash para la rama actual
argument-hint: "[base-branch]"
---
Determina la rama base: usa $ARGUMENTS si se proporciona, de lo contrario detecta el merge-base con `git merge-base HEAD origin/main` (u `origin/master` si main no existe).

Ejecuta `git log --oneline <base>..HEAD` para listar todos los commits de la rama actual.

Analiza la lista de commits y produce un plan squash siguiendo estas reglas:

**Agrupa commits que deben combinarse:**
- Los commits `fixup!` o `squash!` pertenecen al commit que referencia
- Los commits con mensajes como "wip", "fix typo", "address review", "lint", "fmt", "cleanup" deben plegarse en el commit sustantivo anterior más cercano
- Los commits que tocan solo una unidad lógica de cambio (p. ej., todos tocan el mismo módulo o característica) pueden squash si sus mensajes son redundantes

**Deja como commits separados:**
- Características distintas, correcciones de errores o refactores que cada uno merece su propia entrada en el historial
- Commits con diferentes tipos (feat vs. fix vs. docs) que aparecerán en un changelog
- Merge commits — marca estos y advierte que hacer squash a través de ellos requiere cuidado

Genera la lista todo de `git rebase -i` propuesta usando el formato de script de rebase exacto:

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

Para cada entrada `squash` o `reword`, proporciona el mensaje de commit combinado sugerido debajo del bloque de script.

Luego imprime el comando único para lanzar el rebase:
```
git rebase -i <base-sha>
```

No ejecutes el rebase. Advierte si la rama ya ha sido subida a un repositorio remoto compartido — hacer squash requerirá un force push.
