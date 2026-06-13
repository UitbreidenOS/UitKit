---
name: invoice-chaser
description: "Automatizar cuentas por cobrar: redactar recordatorios de mora, secuencias de escalada, banderas de riesgo de impago — para QuickBooks, Stripe o cualquier herramienta de facturación"
---

# Habilidad Invoice Chaser

## Cuándo activar
- Tiene facturas vencidas y necesita redactar mensajes de seguimiento
- Configurar una secuencia de recordatorios multi-toque para morosos
- Identificar clientes en riesgo de no pagar
- Redactar correos de escalada cuando un cliente deja de responder
- Resumir su posición de cuentas por cobrar

## Cuándo NO usar
- Facturas vencidas menos de 7 días — demasiado pronto, daña relaciones
- Disputas donde el cliente ha planteado un problema válido — resolver primero
- Procesos legales/cobranza — esto es solo para comunicación pre-legal

## Instrucciones

### Describa su situación a Claude

Simplemente descríbalo en inglés claro:

```
Tengo 3 facturas vencidas:
- Acme Corp: $4.200 — 14 días vencida
- Smith & Co: $850 — 32 días vencida
- Blue Sky Ltd: $12.000 — 45 días vencida, sin respuesta a últimos 2 correos

Redacte mensajes de seguimiento apropiados para cada una.
```

Claude va a:
- Redactar mensajes con tono apropiado (recordatorio gentil a 14 días, más firme a 32, aviso formal a 45)
- Hacer referencia al monto específico y días vencidos
- Incluir una llamada a la acción clara (pagar ahora / confirmar recibido / contáctenos)
- Sugerir el siguiente paso apropiado para cada nivel de vencimiento

### La escala de escalada

| Días vencidos | Tono | Acción |
|---|---|---|
| 1–14 | Recordatorio amigable | "Solo verificaba — ¿esto se perdió?" |
| 15–30 | Seguimiento cortés | "Esto ahora tiene X días de vencimiento, por favor avíseme" |
| 31–60 | Aviso firme | "Se requiere pago dentro de 7 días para evitar cargos por mora" |
| 60+ | Demanda formal | "Aviso de pago vencido — se requiere acción" |
| 90+ | Pre-cobranza | "Aviso final antes de derivación a cobranza" |

### Configurar una secuencia

```
Quiero configurar una secuencia automática de 4 toques para cualquier factura impaga:
- Día 3 después de vencimiento: recordatorio suave
- Día 14: seguimiento con enlace de pago
- Día 30: aviso firme mencionando política de cargos por mora
- Día 45: aviso final antes de cobranza

Redacte plantillas para las 4 etapas. Mi empresa es un estudio de diseño web, factura promedio es $2.000–$8.000.
```

### Analizar su posición de cuentas por cobrar

```
Aquí están mis facturas pendientes de QuickBooks [pegue o describa]:
- Cliente A: $X, fecha de vencimiento, último contacto
- Cliente B: $X, fecha de vencimiento, último contacto

Categorice por riesgo (bajo/medio/alto), total pendiente, y recomiende acciones prioritarias.
```

### Extracción desde QuickBooks

```
Exporté esto desde QuickBooks [pegue los datos].
¿Qué facturas necesitan atención inmediata?
Redacte correos de recordatorio para cualquier cosa mayor a 30 días.
```

## Ejemplo

**Usted dice:**
```
Cliente: Johnson Consulting
Factura: $6.500 por rediseño de sitio web
Vencida: hace 28 días
Contacto previo: Factura enviada, sin respuesta desde entonces
Mi tono: profesional pero firme
```

**Claude produce:**
```
Asunto: Factura #1042 — Pago Vencido ($6.500)

Hola [Nombre],

Espero que estés bien. Le escribo sobre la Factura #1042 por $6.500,
que vencía el [fecha] y ahora tiene 28 días de retraso.

Entiendo que las cosas se ponen ocupadas — por favor avíseme si tiene alguna pregunta
sobre la factura o si hay un problema que pueda ayudar a resolver.

Si el pago ya ha sido enviado, ignore este mensaje y comparta
el número de referencia para que pueda actualizar mis registros.

Puede pagar en línea aquí: [enlace de pago]

Gracias por su atención rápida.
```

---
