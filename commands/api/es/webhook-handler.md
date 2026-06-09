---
description: Implementa un receptor de webhook seguro e idempotente con verificación de firma y tolerancia a reintentos
argument-hint: "[provider] [event-types]"
---
Implementa un manejador de webhook para: $ARGUMENTS

Analiza como: nombre del proveedor de webhook (por ejemplo, Stripe, GitHub, Twilio) y una lista separada por comas de los tipos de eventos a manejar. Si el proveedor es desconocido, construye un patrón genérico de webhook firmado.

Seguridad — innegociable:
- Verifica la firma del proveedor antes de procesar cualquier carga útil. Lee el patrón de documentación del proveedor para el encabezado exacto y el algoritmo HMAC (generalmente `HMAC-SHA256`)
- Compara firmas usando una función de comparación de tiempo constante — nunca igualdad de cadena
- Rechaza solicitudes con firmas faltantes o inválidas con `401` inmediatamente — registra el fallo
- Valida el campo `timestamp` si el proveedor incluye uno; rechaza eventos más antiguos que 5 minutos para prevenir ataques de repetición
- El secreto debe venir de una variable de entorno — nunca codificado

Idempotencia:
- Cada entrega de webhook tiene un ID de evento único en el encabezado o carga útil — extráelo
- Comprueba un almacén de deduplicación (tabla DB o conjunto Redis con TTL) antes de procesar
- Si el ID de evento ya fue procesado, devuelve `200` inmediatamente — no reproceses
- Almacena el ID de evento con un TTL de al menos la ventana de reintento del proveedor (típicamente 72 horas)

Patrón de procesamiento:
- Reconoce inmediatamente con `200` — no hagas que el proveedor espere por lógica empresarial
- Encola la carga útil validada y deserializada en una cola de trabajos para procesamiento asincrónico
- Si no existe cola de trabajos, procesa síncronamente pero aún responde dentro de 5 segundos
- Registra el tipo de evento, ID de evento y resultado del procesamiento para cada evento

Estructura del manejador:
1. Middleware de verificación de firma (reutilizable, no en línea)
2. Comprobación de deduplicación
3. Análisis de carga útil y distribución de tipos por tipo de evento
4. Funciones manejadoras por evento (una por tipo de evento listado en $ARGUMENTS)
5. Manejo de errores que devuelve 200 incluso en caso de fallo de procesamiento (para evitar reintentos por errores)

Escribe pruebas para: firma válida, firma inválida, evento duplicado, cada tipo de evento distribuido correctamente.
