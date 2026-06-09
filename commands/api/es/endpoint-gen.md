---
description: Generar un endpoint REST completamente tipado con validación, manejo de errores y pruebas
argument-hint: "[method] [path] [description]"
---
Generar un endpoint de API REST listo para producción a partir de la especificación: $ARGUMENTS

Analiza la entrada como: método HTTP, ruta y una descripción breve de la operación del recurso.

Reglas:
- Inferir el framework a partir del código existente (Express, FastAPI, Gin, Rails, etc.)
- Coincidir con la estructura de archivos, convenciones de nomenclatura e importaciones del proyecto
- Definir tipos de solicitud/respuesta utilizando el sistema de tipos del proyecto (interfaces TypeScript, modelos Pydantic, estructuras Go, etc.)
- Validar todas las entradas en el límite — rechazar solicitudes malformadas antes de que la lógica empresarial se ejecute
- Devolver códigos de estado HTTP estándar: 200/201 éxito, 400 solicitud incorrecta, 401 no autenticado, 403 prohibido, 404 no encontrado, 409 conflicto, 422 no procesable, 500 interno
- Nunca exponer seguimientos de pila o detalles internos de errores en cuerpos de respuesta
- Extraer la lógica empresarial en una capa de servicio, mantener el controlador delgado
- Agregar controles de autenticación/autorización si el proyecto utiliza protecciones de middleware
- Escribir al menos tres pruebas: caso de éxito, fallo de validación, caso no encontrado
- Seguir convenciones de recursos RESTful — usar sustantivos en rutas, no verbos

Salida:
1. Archivo de ruta/controlador (o adición a enrutador existente)
2. Definiciones de tipos de solicitud/respuesta
3. Función de servicio stub (o implementación si la lógica es simple)
4. Archivo de prueba con los tres casos requeridos
5. Cualquier migración o cambio de esquema si el endpoint toca la base de datos

Si $ARGUMENTS está vacío, preguntar: método, ruta y qué hace el endpoint.
