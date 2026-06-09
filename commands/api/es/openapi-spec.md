---
description: Generar o actualizar una especificación OpenAPI 3.1 desde rutas existentes o una descripción
argument-hint: "[source-file-or-description]"
---
Generar o actualizar una especificación OpenAPI 3.1 basada en: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, lee las definiciones de rutas desde ese archivo. Si es una descripción, crea un andamiaje para una especificación desde cero. Si está vacío, escanea la base de código para todas las definiciones de rutas y genera una especificación completa.

Requisitos:
- Usar OpenAPI 3.1.0 (no 3.0.x — usar `type: "null"` en lugar de `nullable: true`)
- Cada ruta debe tener: summary, operationId (camelCase, único), tags, parameters, requestBody (si corresponde) y responses
- Definir todos los esquemas bajo `components/schemas` — los esquemas en línea en elementos de ruta están prohibidos
- Usar `$ref` para cualquier esquema referenciado más de una vez
- Documentar todos los códigos de estado de respuesta posibles que el código realmente devuelve — no inventar códigos adicionales
- Los campos requeridos deben estar en matrices `required` — sin opcionales silenciosos
- Los valores enum deben coincidir con lo que el código exige
- Incluir definiciones de esquema de seguridad si la API usa autenticación (JWT Bearer, clave API, OAuth2, etc.)
- Agregar campos de `description` en todas las propiedades no obvias
- Marcar puntos finales obsoletos con `deprecated: true` si se encuentran

Reglas de formato:
- Salida YAML, indentación de 2 espacios
- Mantener `paths` ordenadas alfabéticamente por ruta
- Mantener `components/schemas` ordenadas alfabéticamente

Generar el archivo `openapi.yaml` completo. Si se actualiza una especificación existente, mostrar solo las secciones modificadas con contexto suficiente para ubicarlas, luego escribir el archivo actualizado completo.

Si la fuente de ruta es ambigua o los decoradores específicos del marco no se reconocen, enumerar qué rutas se omitieron y por qué.
