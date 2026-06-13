---
description: Planificar y generar un script de rebase interactivo para squashear la rama actual
argument-hint: "[base-branch]"
---
Determinar la rama base: usar $ARGUMENTS si se proporciona, de lo contrario detectar el merge-base con `git merge-base HEAD origin/main` (u `origin/master` si main no existe).

Ejecutar `git log --oneline <base>..HEAD` para listar todos los commits en la rama actual.

Analizar la lista de commits y producir un plan de squash siguiendo estas reglas:

**Agrupar commits que deben combinarse:**
- Los commits `fixup!` o `squash!` pertenecen al commit al que hacen referencia
- Los commits con mensajes como "wip", "fix typo", "address review", "lint", "fmt", "cleanup" deben fusionarse con el commit sustantivo más cercano anterior
- Los commits que tocan solo una unidad de cambio lógica (por ejemplo, todos tocando el mismo módulo o feature) pueden ser squasheados si sus mensajes son redundantes

**Dejar como commits separados:**
- Features distintos, correcciones de errores o refactores que cada uno merece su propia entrada en el historial
- Commits con diferentes tipos (feat vs. fix vs. docs) que aparecerán en un changelog
- Merge commits — marcar estos y advertir que squashear a través de ellos requiere cuidado

Generar la lista de tareas de `git rebase -i` propuesta usando el formato exacto del script de rebase:

```
pick <sha> <subject>
squash <sha> <subject>
fixup <sha> <subject>
reword <sha> <subject>
```

Para cada entrada `squash` o `reword`, proporcionar el mensaje de commit combinado sugerido debajo del bloque de script.

Luego imprimir el comando único para lanzar el rebase:
```
git rebase -i <base-sha>
```

No ejecutar el rebase. Advertir si la rama ya ha sido empujada a un repositorio remoto compartido — squashear requerirá un force push.
