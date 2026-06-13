---
name: api-design
description: "REST API design: resource naming, versioning, pagination, error responses, rate limiting headers, idempotency, OpenAPI documentation"
---

> 🇪🇸 Versión en español. [Versión en inglés](../api-design.md).

# Skill Diseño de API

## Cuándo activar
- Diseñar una nueva API REST (estructura de recursos, métodos HTTP, códigos de estado)
- Agregar paginación a un endpoint de lista existente
- Estandarizar el formato de respuesta de error en una base de código
- Establecer una estrategia de versionado de API
- Escribir documentación OpenAPI/Swagger
- Implementar idempotencia para endpoints POST

## Cuándo NO usar
- APIs GraphQL — diferentes restricciones de diseño
- Comunicación interna entre microservicios donde gRPC es más apropiado
- APIs WebSocket/tiempo real — protocolo diferente

## Instrucciones

### Nomenclatura de recursos

```
# Patrón: /resources/{id}/sub-resources/{sub-id}
# Sustantivos, no verbos. Plural. Minúsculas con guiones.

GET    /users              → listar usuarios
POST   /users              → crear usuario
GET    /users/{id}         → obtener usuario
PATCH  /users/{id}         → actualización parcial de usuario
PUT    /users/{id}         → reemplazo completo de usuario
DELETE /users/{id}         → eliminar usuario

GET    /users/{id}/posts   → listar posts del usuario
POST   /users/{id}/posts   → crear post para el usuario

# Acciones que no encajan en CRUD — usar un sub-recurso con verbo
POST   /users/{id}/activate
POST   /users/{id}/password-reset
POST   /orders/{id}/cancel
POST   /invoices/{id}/send

# Nunca:
POST /getUser          ❌
GET  /deleteUser/{id}  ❌
POST /user_management  ❌
```

### Códigos de estado HTTP — usar el correcto

```
2xx Éxito
  200 OK           — éxito GET, PATCH, PUT con cuerpo
  201 Created      — éxito POST, incluir encabezado Location
  204 No Content   — éxito DELETE, o PUT/PATCH sin cuerpo de respuesta
  202 Accepted     — operación asíncrona iniciada (aún no completada)

4xx Errores del cliente (su culpa)
  400 Bad Request        — JSON malformado, campo requerido faltante
  401 Unauthorized       — no autenticado (sin token/token inválido)
  403 Forbidden          — autenticado pero no autorizado
  404 Not Found          — el recurso no existe
  405 Method Not Allowed — GET en un endpoint solo de escritura
  409 Conflict           — restricción de unicidad (email ya tomado)
  410 Gone               — recurso eliminado permanentemente
  422 Unprocessable      — JSON válido pero validación fallida
  429 Too Many Requests  — límite de tasa excedido

5xx Errores del servidor (tu culpa)
  500 Internal Server Error  — error inesperado
  502 Bad Gateway            — servicio upstream caído
  503 Service Unavailable    — mantenimiento planificado o sobrecarga
  504 Gateway Timeout        — timeout del upstream
```

### Formato de respuesta de error

Formato de error consistente en cada endpoint:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ],
    "requestId": "req_01JKM3X2...",
    "docsUrl": "https://docs.example.com/errors/VALIDATION_FAILED"
  }
}
```

**Convenciones de código de error:**
- Códigos en `SNAKE_UPPER_CASE` (no numéricos)
- Suficientemente específicos para actuar: `EMAIL_ALREADY_REGISTERED` no `CONFLICT`
- Estables entre versiones de API (no cambiarlos)

```python
# Ejemplo FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, code: str, message: str, status: int, details=None):
        self.code = code
        self.message = message
        self.status = status
        self.details = details or []

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "requestId": request.state.request_id,
            }
        }
    )

# Uso
raise AppError(
    code="EMAIL_ALREADY_REGISTERED",
    message="This email address is already in use",
    status=409,
)
```

### Paginación

**Paginación basada en cursor (recomendada para grandes conjuntos de datos):**
```json
GET /posts?limit=20&cursor=eyJpZCI6IjEwMCJ9

{
  "data": [...],
  "pagination": {
    "limit": 20,
    "nextCursor": "eyJpZCI6IjEyMCJ9",
    "hasMore": true
  }
}
```

```python
# Cursor = base64(JSON) de la clave de ordenación del último elemento
import base64, json

def encode_cursor(id: str) -> str:
    return base64.b64encode(json.dumps({"id": id}).encode()).decode()

def decode_cursor(cursor: str) -> dict:
    return json.loads(base64.b64decode(cursor).decode())

@router.get("/posts")
async def list_posts(limit: int = 20, cursor: str | None = None):
    query = Post.query.order_by(Post.id.desc())
    if cursor:
        last_id = decode_cursor(cursor)["id"]
        query = query.filter(Post.id < last_id)
    posts = query.limit(limit + 1).all()
    has_more = len(posts) > limit
    posts = posts[:limit]
    return {
        "data": posts,
        "pagination": {
            "limit": limit,
            "nextCursor": encode_cursor(str(posts[-1].id)) if has_more else None,
            "hasMore": has_more,
        }
    }
```

**Paginación por offset (más simple, válida para conjuntos de datos pequeños):**
```json
GET /posts?page=2&perPage=20

{
  "data": [...],
  "pagination": {
    "page": 2,
    "perPage": 20,
    "total": 347,
    "totalPages": 18
  }
}
```

### Estrategia de versionado

```
# Versionado por URL (más común, más explícito)
/v1/users
/v2/users

# Versionado por encabezado (URLs más limpias, más difícil de probar en el navegador)
GET /users
Accept: application/vnd.myapi.v2+json

# Parámetro de consulta (evitar — contamina el espacio de consulta)
GET /users?version=2  ❌
```

**Reglas de versionado:**
- Incrementar la versión solo para **cambios incompatibles**
- Las adiciones no incompatibles (nuevos campos, nuevos parámetros opcionales) no necesitan incremento de versión
- Mantener versiones antiguas activas al menos 6 meses después del aviso de deprecación
- Comunicar la deprecación mediante encabezados `Deprecation` y `Sunset`:

```
Deprecation: Sun, 01 Jan 2027 00:00:00 GMT
Sunset: Sun, 01 Jul 2027 00:00:00 GMT
Link: <https://docs.example.com/migration/v1-to-v2>; rel="deprecation"
```

### Encabezados de respuesta estándar

```python
# Limitación de tasa
X-RateLimit-Limit: 1000       # requests per window
X-RateLimit-Remaining: 450    # remaining in current window
X-RateLimit-Reset: 1716835200 # unix timestamp of window reset

# Idempotencia
Idempotency-Key: client-generated-uuid

# Seguimiento de solicitudes
X-Request-ID: req_01JKM3X2...

# Enlaces de paginación (RFC 5988)
Link: <https://api.example.com/posts?cursor=next>; rel="next"
```

### Idempotencia para endpoints POST

```python
# La idempotencia previene cargos/acciones duplicadas en reintentos de red
import hashlib

@router.post("/payments")
async def create_payment(
    payload: PaymentRequest,
    idempotency_key: str = Header(alias="Idempotency-Key"),
    redis: Redis = Depends(get_redis),
):
    # Verificar si esta clave ya fue procesada
    cache_key = f"idempotency:{idempotency_key}"
    cached = await redis.get(cache_key)
    if cached:
        return JSONResponse(content=json.loads(cached))  # return same response

    # Procesar el pago
    result = await charge_card(payload)

    # Cachear la respuesta por 24 horas
    await redis.setex(cache_key, 86400, json.dumps(result))
    return result
```

### Documentación OpenAPI (FastAPI la genera automáticamente)

```python
@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    responses={
        404: {"model": ErrorResponse, "description": "User not found"},
        401: {"model": ErrorResponse, "description": "Not authenticated"},
    },
    summary="Obtener un usuario por ID",
    description="Devuelve el perfil público del usuario. Requiere autenticación.",
    tags=["Users"],
)
async def get_user(
    user_id: str = Path(description="El UUID del usuario"),
    include_private: bool = Query(default=False, description="Incluir campos privados (solo para uno mismo)"),
):
    ...
```

## Ejemplo

**Usuario:** Diseña la API para una app de gestión de tareas con proyectos, tareas y comentarios — incluyendo paginación, formato de error y cómo manejar la asignación de tareas.

**Salida esperada:**
```
GET  /v1/projects                    → lista paginada
POST /v1/projects                    → crear, devuelve 201 + Location
GET  /v1/projects/{id}/tasks         → paginado, filtrable (?status=open)
POST /v1/projects/{id}/tasks         → crear tarea
PATCH /v1/tasks/{id}                 → actualizar (título, descripción, estado)
POST /v1/tasks/{id}/assign           → asignar a usuario (endpoint de acción)
POST /v1/tasks/{id}/comments         → agregar comentario
DELETE /v1/tasks/{id}                → eliminación suave, 204

Formato de error: { error: { code, message, details[], requestId } }
Paginación: basada en cursor en todos los endpoints de lista
```

---
