---
description: Genera un endpoint REST completamente tipado con validación, manejo de errores y pruebas
argument-hint: "[method] [path] [description]"
---
Genera un endpoint de API REST listo para producción a partir de la especificación: $ARGUMENTS

Analiza la entrada como: método HTTP, ruta y una breve descripción de la operación del recurso.

Reglas:
- Infiere el framework del código existente (Express, FastAPI, Gin, Rails, etc.)
- Coincide con la estructura de archivos, convenciones de nombres y estilo de importaciones existentes del proyecto
- Define tipos de solicitud/respuesta usando el sistema de tipos del proyecto (interfaces TypeScript, modelos Pydantic, structs de Go, etc.)
- Valida todas las entradas en el límite — rechaza solicitudes mal formadas antes de que se ejecute la lógica empresarial
- Devuelve códigos de estado HTTP estándar: 200/201 éxito, 400 solicitud incorrecta, 401 no autenticado, 403 prohibido, 404 no encontrado, 409 conflicto, 422 no procesable, 500 error interno
- Nunca expongas trazas de pila o detalles internos de errores en cuerpos de respuesta
- Extrae la lógica empresarial en una capa de servicio, mantén el controlador delgado
- Añade verificaciones de autenticación/autorización si el proyecto usa protecciones de middleware
- Escribe al menos tres pruebas: caso de éxito, fallo de validación, caso no encontrado
- Sigue convenciones de recursos RESTful — usa sustantivos en las rutas, no verbos

Salida:
1. Archivo de ruta/controlador (o adición al router existente)
2. Definiciones de tipos de solicitud/respuesta
3. Función de servicio stub (o implementación si la lógica es simple)
4. Archivo de prueba con los tres casos requeridos
5. Cualquier migración o cambio de esquema si el endpoint toca la BD

Si $ARGUMENTS está vacío, pregunta: método, ruta y qué hace el endpoint.
