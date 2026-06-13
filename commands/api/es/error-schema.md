---
description: Define y aplica un esquema de respuesta de error consistente en todos los puntos finales de la API
argument-hint: "[scope: file, router, o 'all']"
---
Auditar y aplicar un esquema de respuesta de error consistente para: $ARGUMENTS

El alcance predeterminado es la API completa si $ARGUMENTS está vacío o es "all".

Esquema de error objetivo (RFC 9457 / Problem Details for HTTP APIs):
```json
{
  "type": "https://example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The 'email' field must be a valid email address.",
  "instance": "/requests/abc-123",
  "trace_id": "3f2e1d..."
}
```

Usa este esquema a menos que el proyecto ya tenga un formato de error establecido — si es así, estandariza a ese en su lugar.

Pasos:
1. Escanear todas las rutas de código que devuelven errores: excepciones lanzadas, middleware de error, bloques catch, manejadores de validación
2. Identificar inconsistencias: cadenas simples, claves inconsistentes (`message` vs `error` vs `detail`), códigos de estado faltantes, formas mixtas
3. Definir un único tipo de error/interfaz/clase en la raíz del proyecto (`ApiError` o equivalente)
4. Reemplazar cada respuesta de error ad-hoc con construcción estructurada de ese tipo
5. Centralizar toda la serialización de errores en un lugar (middleware de error / manejador de excepciones) — no disperso en controladores
6. Asegurar que los errores de validación enumeren errores por campo:
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Eliminar trazas de pila de respuestas de producción — regístralas en el servidor, nunca envíes al cliente
8. Asignar tipos de error internos a códigos de estado HTTP en una tabla de búsqueda — sin literales de código de estado fuera de esa asignación
9. Agregar un `trace_id` correlacionado con tu sistema de registro si uno está en uso

Resultado:
- La definición del tipo de error
- El manejador de errores centralizado
- Lista de todos los archivos modificados
- Cualquier respuesta de error que no pudo estandarizarse (con razón)
