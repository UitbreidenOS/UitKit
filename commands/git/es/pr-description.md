---
description: Elaborar un título y descripción de solicitud de cambios a partir de commits y diff de rama
argument-hint: "[base-branch]"
---
Determina la rama base: utiliza $ARGUMENTS si se proporciona, de lo contrario, usa `main` como predeterminado.

Ejecuta estos comandos para recopilar contexto:
1. `git log <base-branch>...HEAD --oneline` — lista commits en esta rama
2. `git diff <base-branch>...HEAD --stat` — resumen de cambios a nivel de archivo
3. `git diff <base-branch>...HEAD` — diff completo para análisis semántico

A partir de este contexto, produce una descripción de solicitud de cambios en Markdown:

```
## Resumen
<2-4 puntos cubriendo qué cambió y por qué — no una lista de archivos>

## Cambios
<Agrupados por concern, no por archivo. Usa sub-viñetas para detalles.>

## Pruebas
<Pasos de prueba específicos que un revisor debe ejecutar para validar la corrección.
Si las pruebas son automatizadas, nombra los archivos de prueba o comandos.>

## Notas para revisores
<Marca decisiones no obvias, compensaciones, áreas de incertidumbre o TODOs dejados para seguimiento posterior.
Omite esta sección si no hay nada digno de mención.>
```

En la parte superior, antes del cuerpo, emite una sola línea:
`Title: <imperativo, ≤70 caracteres, sin punto>`

No incluyas encabezados genéricos que el repositorio no necesita. No resumas cada archivo modificado — sintetiza la intención.
