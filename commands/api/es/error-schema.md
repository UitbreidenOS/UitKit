---
description: Define y aplica un esquema de respuesta de error consistente en todos los puntos finales de API
argument-hint: "[scope: file, router, or 'all']"
---
Audita y aplica un esquema de respuesta de error consistente para: $ARGUMENTS

El alcance se establece en toda la API si $ARGUMENTS está vacío o es "all".

Esquema de error objetivo (RFC 9457 / Problem Details para APIs HTTP):
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
1. Escanea todas las rutas de código que devuelven errores: excepciones lanzadas, middleware de error, bloques catch, manejadores de validación
2. Identifica inconsistencias: cadenas simples, claves inconsistentes (`message` vs `error` vs `detail`), códigos de estado faltantes, formas mixtas
3. Define un único tipo de error/interfaz/clase en la raíz del proyecto (`ApiError` o equivalente)
4. Reemplaza cada respuesta de error ad-hoc con construcción estructurada de ese tipo
5. Centraliza toda la serialización de errores en un lugar (middleware de error / manejador de excepciones) — no disperso en controladores
6. Asegúrate de que los errores de validación enumeren errores por campo:
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Elimina trazas de pila de respuestas de producción — regístralas del lado del servidor, nunca envíes al cliente
8. Mapea tipos de error internos a códigos de estado HTTP en una tabla de búsqueda — sin literales de código de estado fuera de esa tabla
9. Añade un `trace_id` correlacionado con tu sistema de registro si hay uno en uso

Resultado:
- La definición del tipo de error
- El manejador de error centralizado
- Lista de todos los archivos cambiados
- Cualquier respuesta de error que no pudo ser estandarizada (con razón)
