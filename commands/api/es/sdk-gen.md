---
description: Generar un SDK cliente tipado desde una especificación OpenAPI o rutas API existentes
argument-hint: "[language] [spec-file-or-base-url]"
---
Generar un SDK cliente para: $ARGUMENTS

Interpretar como: lenguaje de destino (TypeScript, Python, Go, etc.) y ya sea una ruta a un archivo de especificación OpenAPI o una URL base. Si no existe un archivo de especificación, generar uno primero desde el código base antes de generar el SDK.

Requisitos de SDK por lenguaje:

TypeScript:
- Salida dual ESM + CommonJS a través del campo `exports` en `package.json`
- Tipos genéricos completos — sin `any`, sin aserciones de tipo sin justificación
- Usar `fetch` nativamente; aceptar una implementación personalizada opcional de fetch para mocking de pruebas
- Esquemas Zod para validación de respuestas en tiempo de ejecución (opcional pero incluir si el proyecto usa Zod)
- Tree-shakeable: cada recurso como un export nombrado, no una clase con todo en ella

Python:
- `httpx` para async, `requests` para sync — proporcionar ambos o preguntar cuál
- Modelos Pydantic para todos los tipos de solicitud/respuesta
- Type hints en todo, marcador `py.typed` para cumplimiento con PEP 561
- Cliente async como interfaz principal, sync como un wrapper fino

Go:
- Go idiomático: métodos en un struct `Client`, contexto como primer parámetro, patrón de retorno `(T, error)`
- Paquete de tipos separado para modelos generados
- Sin dependencias externas más allá de `net/http` a menos que el proyecto ya use una

Todos los lenguajes:
- Una clase cliente/struct por grupo de recursos (refleja los `tags` de OpenAPI)
- Constructor acepta: URL base, token de autenticación/clave API, cliente HTTP opcional
- Todos los métodos corresponden 1:1 con valores de `operationId` de OpenAPI
- Devolver objetos de respuesta tipados — nunca strings crudos o maps sin tipo
- Propagar todos los errores HTTP como objetos de error tipados con `status`, `code`, y `message`
- README con instalación, inicialización, y un ejemplo por grupo de recursos

Generar el SDK como listado de estructura de directorios, luego el contenido completo del archivo para cada archivo. Si la especificación tiene más de 20 operaciones, generar la infraestructura cliente principal y el primer grupo de recursos, luego listar los grupos restantes para generar bajo demanda.
