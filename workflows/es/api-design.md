# Flujo de trabajo de diseño de API

Flujo de trabajo estructurado para diseñar una nueva API — de requisitos a especificación lista para implementación.

## Cuándo usar

Utilice antes de implementar un nuevo punto final de API o interfaz de servicio, especialmente cuando:
- Múltiples equipos o servicios consumirán la API
- La API será externa/orientada al cliente
- El punto final implica mutación de datos o lógica empresarial compleja
- Está diseñando un nuevo límite de servicio

## Fase 1: Requisitos (30 minutos)

**Responda primero estas preguntas:**

1. ¿Quiénes son los consumidores?
   - ¿Solo servicio interno / múltiples servicios internos / consumidores de API externos / clientes móviles?
   
2. ¿Qué debe hacer cada consumidor?
   - Enumere los casos de uso, no los puntos finales

3. ¿Qué datos están involucrados?
   - ¿Qué entidades se crean, leen, actualizan o eliminan?
   - ¿Cuáles son los patrones de acceso a datos (por ID, por usuario, por rango de fechas)?

4. ¿Cuáles son los requisitos no funcionales?
   - Objetivo de latencia (p99 < X ms)
   - Rendimiento (X solicitudes/segundo)
   - Requisitos de consistencia (fuerte / eventual)
   - Requisitos de autenticación (público / autenticado / servicio a servicio)

## Fase 2: Diseño de interfaz (45 minutos)

**Diseñe los puntos finales desde la perspectiva del consumidor:**

1. Comience con los casos de uso, no el modelo de datos
   ```
   Caso de uso: "El usuario quiere ver su historial de pedidos"
   → GET /api/orders?userId={id}&status=completed&limit=20&cursor={cursor}
   
   Caso de uso: "El usuario quiere cancelar un pedido"
   → POST /api/orders/{id}/cancel  (punto final de acción, no PATCH con estado)
   ```

2. Aplique convenciones REST (ver rules/common/api-design.md)

3. Diseñe esquemas de solicitud/respuesta:
   ```typescript
   // Defina tipos de TypeScript o esquema JSON antes de la implementación
   type CreateOrderRequest = {
     customerId: string
     items: Array<{ productId: string; quantity: number }>
     shippingAddressId: string
   }
   
   type Order = {
     id: string
     customerId: string
     status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
     items: OrderItem[]
     total: number
     createdAt: string  // ISO 8601
   }
   ```

4. Diseñe respuestas de error para cada punto final:
   - ¿Qué puede salir mal? (entrada inválida, no encontrada, conflicto, fallo de autenticación)
   - ¿Cómo se ve cada respuesta de error?

## Fase 3: Validación y revisión (20 minutos)

**Revise el diseño contra estos criterios:**

**Perspectiva del consumidor:**
- ¿Puede un consumidor completar todos los casos de uso con los puntos finales diseñados?
- ¿Son las formas de respuesta predecibles y consistentes?
- ¿Los códigos de error ayudan al consumidor a recuperarse?

**Perspectiva de implementación:**
- ¿Requiere esto N+1 consultas para implementar? (diseñar para evitar)
- ¿Hay trampas de latencia? (grandes joins, llamadas externas síncronas)
- ¿Está la paginación diseñada para el volumen de datos esperado?

**Perspectiva de seguridad:**
- ¿Tiene cada punto final requisitos de autenticación claros?
- ¿Hay puntos finales que podrían filtrar datos entre usuarios?
- ¿Se considera la limitación de velocidad?

**Versionamiento:**
- ¿Es esto compatible hacia atrás con consumidores existentes?
- Si es importante: ¿está planificado el versionamiento?

## Fase 4: Documentar y compartir (20 minutos)

**Formato de especificación de API (OpenAPI o markdown simple):**

```markdown
## POST /api/orders

Cree un nuevo pedido.

**Autenticación:** Requerida (usuario)

**Solicitud:**
\```json
{
  "customerId": "string (UUID)",
  "items": [{ "productId": "string", "quantity": "integer (> 0)" }],
  "shippingAddressId": "string (UUID)"
}
\```

**Respuesta 201:**
\```json
{ "id": "string", "status": "pending", "total": "number" }
\```

**Respuesta 400:**
\```json
{ "error": { "code": "validation_error", "message": "string", "details": {} } }
\```

**Respuesta 404:**
\```json
{ "error": { "code": "not_found", "message": "Customer not found" } }
\```
```

**Compartir con:**
- Equipos consumidores (para comentarios antes de la implementación)
- Director de ingeniería (para revisión arquitectónica)
- Seguridad (si maneja datos sensibles)

## Fase 5: Implementación

1. Escriba primero las pruebas (de la especificación — estas se convierten en sus pruebas de aceptación)
2. Implemente el manejador
3. Valide manualmente contra la especificación
4. Documente las desviaciones de la especificación original

## Habilidades relacionadas

- `/rules/common/api-design` — convenciones REST a aplicar
- `/skills/productivity/spec-driven-workflow` — patrón especificación → prueba → implementación
- `/skills/productivity/api-test-builder` — generar suites de prueba a partir de especificaciones

---
