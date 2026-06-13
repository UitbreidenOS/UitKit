> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../coding-style.md).

# Reglas de Estilo de Código

Copia las secciones relevantes en el `CLAUDE.md` de tu proyecto.

---

## Nomenclatura

- Variables y funciones: `camelCase` (JS/TS), `snake_case` (Python, Go, Rust)
- Clases y tipos: `PascalCase` en todos los lenguajes
- Constantes: `SCREAMING_SNAKE_CASE` solo para constantes verdaderas que nunca cambian
- Variables booleanas: prefijo con `is`, `has`, `can`, `should` — `isActive`, `hasPermission`
- No abrevies nombres a menos que la abreviatura sea universalmente conocida (`id`, `url`, `db`, `ctx`)

## Funciones

- Una responsabilidad por función — si necesitas "y" en la descripción, divídela
- Máximo 40 líneas por función; si es más larga, extrae sub-funciones
- Sin parámetros booleanos — usa un objeto de opciones o dos funciones separadas
- Retorno anticipado para cláusulas de guarda — no anides el camino feliz dentro de condicionales

## Comentarios

- No escribas comentarios a menos que el POR QUÉ no sea obvio
- Nunca escribas comentarios que describan lo que hace el código (el código ya lo hace)
- Escribe un comentario cuando: hay una restricción oculta, una solución para un bug específico, o comportamiento que sorprendería al lector
- Nunca escribas comentarios TODO — crea un issue rastreado en su lugar

## Manejo de errores

- Nunca ignores errores silenciosamente (`catch (e) {}` siempre está mal)
- Siempre maneja los errores en el límite donde puedas tomar acción
- Propaga los errores hacia arriba con contexto — envuelve con el ID o nombre de operación relevante
- No uses `console.error` en código de producción — usa el logger del proyecto

## Organización de archivos

- Una exportación primaria por archivo
- Los nombres de archivo coinciden con su exportación primaria: `UserService.ts` exporta `UserService`
- Sin archivos barrel (`index.ts` re-exportaciones) — importa directamente desde el archivo fuente
- Agrupa las importaciones: paquetes externos primero, luego módulos internos, luego importaciones relativas

---
