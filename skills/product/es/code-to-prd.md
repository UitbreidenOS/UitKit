---
name: code-to-prd
description: "Ingeniería inversa de PRD desde código existente — extraer qué se construyó, inferir las decisiones de producto realizadas, y generar un documento de requisitos de producto adecuado para documentación o entrega"
---

# Skill Code to PRD

## Cuándo activar
- Documentar qué se construyó sin una especificación escrita (deuda técnica en documentación)
- Incorporar un nuevo PM que hereda características no documentadas
- Prepararse para una entrega de producto o transición de equipo
- Auditar qué se construyó realmente vs. qué fue originalmente intencionado
- Crear documentación a partir de un prototipo que se envió sin especificaciones

## Cuándo NO usar
- Escribir un nuevo PRD antes de construir — usar la habilidad product-manager-toolkit
- Documentar una API para consumidores externos — usar el generador de README
- Crear documentación de cara al usuario — público y formato diferentes

## Instrucciones

### Extracción completa de PRD de característica

```
Ingeniería inversa de PRD a partir de este código/característica.

Característica/base de código: [describir o señalar archivos relevantes]
Leer: [listar archivos clave — rutas, modelos, componentes UI, pruebas]

Proceso de extracción:

PASO 1 — QUÉ SE CONSTRUYÓ (desde código):
- ¿Qué datos crea, lee, actualiza o elimina esta característica?
- ¿Cuáles son los puntos de entrada? (endpoints API, páginas UI, comandos CLI)
- ¿Cuáles son los resultados? (respuestas, correos electrónicos, notificaciones, efectos secundarios)
- ¿Qué reglas de validación existen? (esquemas Zod, cláusulas de protección, pruebas)
- ¿Qué estados de error se manejan?

PASO 2 — INFERIR LAS DECISIONES DE PRODUCTO:
- ¿Para quién es esto? (inferir desde patrones UX, nombres, datos de prueba)
- ¿Qué problema resuelve? (inferir desde la lógica y contexto de la característica)
- ¿Qué intencionalmente NO incluyeron? (¿qué falta que esperarías?)
- ¿Cuáles son las restricciones implicadas? (requisitos de autenticación, límites de velocidad, límites de datos)

PASO 3 — GENERAR EL PRD:

## Característica: [Nombre]
**Construido:** [fecha desde historial de git]
**Autor:** [desde git log]
**Estado:** Enviado

### Declaración del problema
[Qué problema resuelve esta característica — inferido desde la implementación]

### Usuarios
[Para quién es esto — inferido desde lógica de autenticación, patrones UI, datos de prueba]

### Lo que se construyó
#### Viajes del usuario
[Describir los flujos que el código permite]

#### Modelo de datos
[Tablas/colecciones afectadas + campos clave]

#### Superficie API
| Endpoint | Método | Autenticación | Descripción |
|---|---|---|---|
| [ruta] | [GET/POST/etc] | [sí/no/rol] | [qué hace] |

#### Reglas empresariales
[Lógica de validación, límites, permisos encontrados en el código]

#### Manejo de errores
[Estados de error implementados y sus respuestas]

### Lo que NO se construyó (brechas)
[Cosas que esperarías pero no están presentes — validación faltante, sin paginación, sin registro de auditoría, etc.]

### Preguntas abiertas
[Cosas que no podría inferirse solo del código]

Generar el PRD para la característica que describo.
```

### Análisis de archivo único

```
Extraer elementos de PRD desde [archivo].

Archivo: [pegar archivo o ruta]

Analizar y extraer:
1. PROPÓSITO: ¿Qué está haciendo este archivo? (1-2 oraciones)
2. ENTRADAS: ¿Qué datos entran? (parámetros, cuerpo de solicitud, variables de entorno)
3. SALIDAS: ¿Qué devuelve o produce?
4. REGLAS EMPRESARIALES: ¿Qué lógica/validación/decisiones están integradas?
5. DEPENDENCIAS: ¿En qué se basa? (servicios, BD, APIs externas)
6. REQUISITOS IMPLÍCITOS: ¿Qué debe ser verdadero para que funcione? (autenticación, permisos, forma de datos)
7. CASOS EXTREMOS MANEJADOS: ¿Qué modos de fallo se manejan explícitamente?
8. BRECHAS: ¿Qué falta que una versión de producción necesitaría?
```

### Análisis del historial de Git

```
Reconstruir historial de producto desde git log.

Repositorio: [directorio actual]
Rama de características o ruta: [ej. src/payments/ o rama main]
Período: [últimos 6 meses / desde v1.0 / todo el tiempo]

Ejecutar: git log --follow --stat -- [ruta]

Del historial de commits, extraer:
1. LÍNEA DE TIEMPO: ¿Cuándo se construyó cada pieza principal?
2. ITERACIONES: ¿Qué cambió después de la construcción inicial? (correcciones de errores, adiciones de características, eliminaciones)
3. DECISIONES VISIBLES EN CÓDIGO: ¿Qué se refacturizó y por qué? (inferir desde mensajes de commit)
4. QUÉ SE ELIMINÓ: ¿Alguna funcionalidad eliminada?

Salida: una narrativa de historial de producto para esta característica/área.
```

## Ejemplo

**Usuario:** Enviamos una característica de factura hace 6 meses sin especificación. Un nuevo PM se está uniendo. Generar el PRD desde el código.

**Claude lee:**
- `src/api/invoices/route.ts` (endpoints API)
- `db/schema.ts` (tabla de facturas)
- `src/services/invoices.ts` (lógica de negocio)
- `src/emails/InvoicePaidEmail.tsx` (plantilla de correo electrónico)
- `tests/invoices.test.ts` (casos de prueba)

**Salida de PRD de Claude:**

```markdown
## Característica: Gestión de Facturas
**Construido:** Enero 2026 (git log muestra commit inicial: 8 de enero 2026)
**Estado:** Enviado, en producción

### Declaración del problema
Los clientes necesitaban enviar facturas a sus clientes y rastrear el estado del pago. Anteriormente se hacía manualmente vía correo electrónico con PDFs adjuntos.

### Usuarios
Primario: Propietarios de negocios (inferido desde middleware de autenticación requiriendo `role: 'business'`)
Secundario: Sus clientes reciben facturas (sin cuenta requerida para pagar)

### Lo que se construyó

#### Viajes del usuario
1. Crear factura → establecer correo de cliente, elementos de línea, fecha de vencimiento
2. Enviar factura → cliente recibe correo electrónico con enlace de pago
3. Cliente paga → webhook de Stripe marca como pagada → propietario notificado
4. Propietario ve lista de facturas → filtrar por estado (borrador/enviada/pagada/vencida)

#### Modelo de datos
**Tabla de facturas:**
- id, userId (FK), clientEmail, clientName
- lineItems (JSONB), totalCents
- status: draft | sent | paid | overdue
- dueDate, sentAt, paidAt
- stripePaymentIntentId

#### Superficie API
| Endpoint | Método | Autenticación | Descripción |
|---|---|---|---|
| /api/invoices | GET | usuario | Listar facturas del usuario |
| /api/invoices | POST | usuario | Crear factura |
| /api/invoices/:id | PATCH | usuario (propietario) | Actualizar factura de borrador |
| /api/invoices/:id/send | POST | usuario (propietario) | Enviar al cliente |
| /api/invoices/:id/pay | POST | ninguna | Página de pago del cliente |

#### Reglas empresariales
- Solo facturas de `borrador` se pueden editar (forzado en capa de servicio)
- El total se calcula del lado del servidor desde lineItems (cliente no puede establecer total directamente)
- Facturas con dueDate en el pasado y status=sent se marcan vencidas por un cron diario
- El pago crea un PaymentIntent de Stripe; webhook confirma el pago

### Brechas (no construido)
- Sin descarga de PDF para facturas pagadas
- Sin sistema de numeración de facturas (facturas tienen UUIDs, no formato INV-001)
- Sin pagos parciales
- Sin plantillas de facturas
- Sin cálculo de impuestos
- Lado del cliente: sin reintento de pago si tarjeta rechazada (solo redirige a página de error)

### Preguntas abiertas
- ¿Se rastrean facturas canceladas? (sin endpoint de cancelación encontrado — eliminación es la única opción)
- ¿Hay un plan para agregar facturas recurrentes? (sin evidencia en código)
```

---
