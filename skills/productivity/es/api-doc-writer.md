---
name: api-doc-writer
description: "Documentación de API a partir de especificación OpenAPI o código: endpoints, parámetros, ejemplos, códigos de error, SDKs"
---

# Habilidad: Escritor de Documentación de API

## Cuándo activar
- Tienes una especificación OpenAPI/Swagger y necesitas producir documentación de referencia legible por personas
- Estás escribiendo documentación para una API REST, GraphQL o webhook desde código o un archivo de especificación
- La documentación de API existente está incompleta — faltan ejemplos, códigos de error o documentación de autenticación
- Necesitas producir guías de inicio rápido para SDKs o ejemplos de código en múltiples lenguajes
- Estás produciendo una guía de migración entre versiones de API (v1 → v2, cambios incompatibles)

## Cuándo NO usar
- Necesitas diseñar la API en sí — esta habilidad documenta APIs existentes, no diseña nuevas
- Necesitas un registro de cambios del historial de git — usa `/changelog-writer`
- Necesitas una arquitectura completa de sitio de documentación — usa `/doc-site-builder` primero, luego usa esta habilidad para escribir la sección de referencia
- La API es solo interna y la audiencia es tu propio equipo — adapta la profundidad y el estilo; los wikis internos no necesitan el tratamiento completo orientado al consumidor

## Instrucciones

### Especificación OpenAPI → documentación de referencia

```
Convierte esta especificación OpenAPI (o descripción de API) en documentación de referencia legible por personas.

## Entrada
Formato de especificación: [OpenAPI 3.x / Swagger 2.x / descripción simple de endpoints]
Nombre de la API: [nombre]
Versión de la API: [v1 / v2 / etc.]
URL base: [https://api.example.com/v1]
Autenticación: [Clave API / Token Bearer / OAuth 2.0 / Básica]

[Pega el JSON/YAML de OpenAPI aquí, o describe los endpoints]

## Formato de salida
Para cada endpoint, produce una sección de documentación:

---

### [Método HTTP] [/ruta]
[Una oración — qué hace este endpoint y cuándo usarlo]

**Autenticación:** [requerida / opcional — y cómo]

**Solicitud**

Encabezados:
| Encabezado | Requerido | Valor |
|---|---|---|
| `Authorization` | Sí | `Bearer {token}` |
| `Content-Type` | Sí | `application/json` |

Parámetros de ruta:
| Parámetro | Tipo | Descripción |
|---|---|---|
| `{id}` | string | El identificador único del [recurso] |

Parámetros de consulta:
| Parámetro | Tipo | Requerido | Valor predeterminado | Descripción |
|---|---|---|---|---|
| `limit` | integer | No | 20 | Número máximo de resultados (1-100) |
| `cursor` | string | No | — | Cursor de paginación de la respuesta anterior |

Cuerpo de la solicitud:
```json
{
  "field_name": "string",        // Requerido. Descripción del campo.
  "optional_field": 42,          // Opcional. Predeterminado: 0. Descripción.
  "nested_object": {
    "child_field": true          // Requerido. Descripción.
  }
}
```

**Respuesta**

Respuesta exitosa — `200 OK`:
```json
{
  "id": "res_abc123",
  "created_at": "2026-06-01T12:00:00Z",
  "status": "active",
  "data": {
    "field": "value"
  }
}
```

Campos de la respuesta:
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único, con prefijo `res_` |
| `created_at` | ISO 8601 | Marca de tiempo de creación del recurso (UTC) |
| `status` | enum | `active` \| `inactive` \| `pending` |

**Respuestas de error**
| Estado | Código de error | Cuándo ocurre |
|---|---|---|
| `400` | `invalid_request` | Campo requerido faltante o formato inválido |
| `401` | `unauthorized` | Clave API faltante o inválida |
| `403` | `forbidden` | Autenticado pero permisos insuficientes |
| `404` | `not_found` | No existe un recurso con ese ID |
| `429` | `rate_limited` | Límite de tasa excedido — ver sección de límites de tasa |
| `500` | `internal_error` | Error en el servidor — reintentar con retroceso exponencial |

**Ejemplos de código**

```bash
# cURL
curl -X POST https://api.example.com/v1/[ruta] \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "value"
  }'
```

```python
import requests

response = requests.post(
    "https://api.example.com/v1/[ruta]",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"field_name": "value"}
)
response.raise_for_status()
data = response.json()
```

```typescript
const response = await fetch('https://api.example.com/v1/[ruta]', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ field_name: 'value' }),
});
const data = await response.json();
```

---

## Secciones transversales a producir junto con la documentación de endpoints:

### Guía de autenticación
[Escribe una guía completa de configuración de autenticación — no solo una mención]

Secciones:
1. Cómo obtener una clave API / token
2. Cómo autenticar solicitudes (muestra todos los métodos soportados)
3. Rotación de claves / renovación de tokens
4. Alcances y permisos (si aplica)
5. Probar la autenticación (un comando curl que pueden ejecutar para verificar que funciona)

### Límites de tasa
- Valores del límite de tasa: [X solicitudes por minuto / hora / día]
- Qué encabezados transportan la información del límite de tasa: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Cómo manejar errores 429: encabezado retry-after, retroceso exponencial
- Límites por endpoint vs. globales

### Paginación
Si la API usa paginación por cursor o por offset:
- Explica el modelo de paginación (basado en cursor / offset / basado en página)
- Muestra cómo paginar a través de todos los resultados con un ejemplo de código (un bucle)
- Explica qué sucede en la última página

### Sección de Webhooks (si aplica)
- Estructura del payload del webhook (con ejemplo)
- Verificación de firma (con ejemplo de código en 3 lenguajes)
- Política de reintentos y garantías de entrega
- Cómo registrar endpoints de webhook
- Cómo probar localmente (ngrok / Cloudflare Tunnel)

### Guía de manejo de errores (transversal)
No solo listar códigos de error — escribe una guía:
- Cómo distinguir entre errores reintentables (5xx, 429) y no reintentables (4xx)
- Ejemplo de implementación de retroceso exponencial
- Claves de idempotencia — cuándo usarlas
- Cómo leer y usar el cuerpo de la respuesta de error

### Inicio rápido del SDK
Para cada lenguaje de SDK soportado, un ejemplo mínimo funcional:
- Instalar el SDK
- Autenticarse
- Hacer la llamada de API más común
- Manejar errores
- Ejemplo de código completo, ejecutable sin modificación (sin valores de marcador de posición que lo rompan)
```

### Guía de migración de API (actualización de versión)

```
Escribe una guía de migración de [API vANTIGUA] a [API vNUEVA].

## Cambios incompatibles a documentar
[Lista cada cambio incompatible — endpoint renombrado, parámetro eliminado, forma de respuesta cambiada, método de autenticación cambiado]

## Estructura de la guía de migración:

### Resumen
- Qué cambió y por qué (razón orientada al usuario, no técnica)
- Cronograma: cuándo se depreca v[ANTIGUA], cuándo se retira
- Complejidad de la migración: [horas / días / semanas para una integración típica]

### Cambios incompatibles

Para cada cambio incompatible:
**[Título del cambio]**
Qué cambió: [descripción simple]
Antes (v[ANTIGUA]):
```[lenguaje]
[código antiguo]
```
Después (v[NUEVA]):
```[lenguaje]
[código nuevo]
```
Pasos de migración:
1. [Paso específico]
2. [Paso específico]
Impacto: [qué se rompe si no migras esto]

### Adiciones no incompatibles
[Funcionalidades disponibles en vNUEVA que no están en vANTIGUA — lectura opcional para usuarios de v[ANTIGUA]]

### Lista de verificación de migración
- [ ] Actualizar versión del SDK a [X]
- [ ] Actualizar URL base de [antigua] a [nueva]
- [ ] [Cada cambio incompatible como una casilla de verificación]
- [ ] Ejecutar suite de pruebas
- [ ] Desplegar en staging y verificar
- [ ] Desplegar en producción

### Obtener ayuda durante la migración
[Enlace al canal de soporte, horario de atención para migración, o formulario de retroalimentación]
```

### Auditoría de calidad de documentación — referencia de API

```
Audita esta documentación de API en cuanto a completitud y calidad.

[Pega la documentación de API existente]

Evalúa con esta rúbrica:

COMPLETITUD:
- [ ] Cada endpoint tiene: descripción, todos los parámetros documentados, respuesta exitosa, respuestas de error
- [ ] La autenticación se explica con ejemplo funcional
- [ ] Límites de tasa documentados
- [ ] Paginación documentada (si aplica)
- [ ] Ejemplos de código en al menos 2 lenguajes para cada endpoint
- [ ] Documentación de webhooks (si aplica) incluye verificación de firma

PRECISIÓN:
- [ ] Los tipos de parámetros son precisos
- [ ] Requerido vs. opcional marcado correctamente
- [ ] Valores predeterminados indicados para parámetros opcionales
- [ ] Los códigos de error son reales (no inventados)

USABILIDAD:
- [ ] ¿Puede un desarrollador integrarse sin leer el código fuente?
- [ ] ¿Hay ejemplos de código funcionales (no pseudocódigo)?
- [ ] ¿El lenguaje es claro y preciso (no marketing)?
- [ ] ¿Están documentados los casos extremos y advertencias donde existen?

Para cada brecha: recomendación específica de corrección.
Prioridad: qué brechas tienen más probabilidad de causar fallos de integración o tickets de soporte.
```

## Ejemplo

**Usuario:** Documenta este endpoint REST. Es `POST /v1/payments` que crea un pago. Campos requeridos: amount (entero, en centavos), currency (string ISO 4217), customer_id (string). Opcionales: description (string), metadata (objeto). Retorna el objeto de pago con id, status, amount, currency, created_at. Errores: 400 para amount inválido, 401 para autenticación incorrecta, 402 para fallo de pago (con un campo decline_code).

**Salida:**

```markdown
### POST /v1/payments

Crea un nuevo cargo de pago para un cliente.

**Autenticación:** Requerida — Token Bearer

**Cuerpo de la solicitud**
```json
{
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "description": "Factura #1042",
  "metadata": {
    "order_id": "ord_789"
  }
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `amount` | integer | Sí | Monto en la unidad de moneda más pequeña (centavos para USD). Debe ser > 0. |
| `currency` | string | Sí | Código de moneda ISO 4217 en minúsculas (`usd`, `eur`, `gbp`). |
| `customer_id` | string | Sí | ID del cliente a cobrar. Debe existir. |
| `description` | string | No | Una descripción legible almacenada en el pago. |
| `metadata` | object | No | Pares clave-valor para referencia interna. Máximo 50 claves, 500 caracteres por valor. |

**Respuesta exitosa — `200 OK`**
```json
{
  "id": "pay_abc123",
  "status": "succeeded",
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**Respuestas de error**
| Estado | Código | Cuándo |
|---|---|---|
| `400` | `invalid_amount` | El monto es 0, negativo o no es un entero |
| `401` | `unauthorized` | Token Bearer faltante o inválido |
| `402` | `payment_failed` | Tarjeta rechazada — revisa `decline_code` en el cuerpo de la respuesta |

Para respuestas `402`, el cuerpo incluye:
```json
{
  "error": "payment_failed",
  "decline_code": "insufficient_funds",
  "message": "The card has insufficient funds to complete the purchase."
}
```

Valores comunes de `decline_code`: `insufficient_funds`, `card_declined`, `expired_card`, `incorrect_cvc`.

**Ejemplos de código**

```bash
curl -X POST https://api.example.com/v1/payments \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd", "customer_id": "cus_abc123"}'
```

```python
response = requests.post(
    "https://api.example.com/v1/payments",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"amount": 2000, "currency": "usd", "customer_id": customer_id},
)
if response.status_code == 402:
    decline_code = response.json()["decline_code"]
    # manejar rechazo
response.raise_for_status()
payment = response.json()
```
```

---
