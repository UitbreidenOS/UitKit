---
description: Redacta un título y descripción de pull request desde los commits y diff de la rama
argument-hint: "[base-branch]"
---
Determina la rama base: usa $ARGUMENTS si se proporciona, de lo contrario, usa `main` por defecto.

Ejecuta estos comandos para recopilar contexto:
1. `git log <base-branch>...HEAD --oneline` — lista los commits en esta rama
2. `git diff <base-branch>...HEAD --stat` — resumen de cambios a nivel de archivo
3. `git diff <base-branch>...HEAD` — diff completo para análisis semántico

A partir de este contexto, produce una descripción de pull request en Markdown:

```
## Summary
<2-4 puntos cubriendo qué cambió y por qué — no una lista de archivos>

## Changes
<Agrupados por preocupación, no por archivo. Usa sub-viñetas para detalles.>

## Testing
<Pasos de prueba específicos que un revisor debe ejecutar para validar la corrección.
Si las pruebas son automatizadas, menciona los archivos de prueba o comandos.>

## Notes for reviewers
<Señala decisiones no obvias, compensaciones, áreas de incertidumbre o TODOs dejados para seguimiento.
Omite esta sección si no hay nada notable.>
```

En la parte superior, antes del cuerpo, genera una sola línea:
`Title: <imperativo, ≤70 caracteres, sin punto>`

No incluyas encabezados genéricos que el repositorio no necesita. No resumas cada archivo cambiado — sintetiza la intención.
