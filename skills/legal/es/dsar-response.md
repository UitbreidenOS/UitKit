---
name: dsar-response
description: "Flujo de respuesta DSAR GDPR/CCPA: clasificar solicitud, verificar identidad, auditar sistemas, aplicar exenciones, redactar confirmación y respuesta sustantiva"
---

# Habilidad de Respuesta DSAR

## Cuándo activar
- Un cliente o empleado presenta una solicitud de acceso, eliminación, portabilidad o corrección de datos
- Necesitas confirmar la recepción dentro del plazo reglamentario
- Identificar todos los datos personales para esta persona
- Aplicar exenciones GDPR o CCPA antes de responder
- Redactar la carta de respuesta sustantiva

## Cuándo NO usar
- Notificaciones masivas de brechas de datos — marco legal diferente (Art. 33/34 GDPR)
- Investigaciones regulatorias — involucra a tu DPO y asesoramiento legal
- Las solicitudes son claramente acoso vago sin propósito legítimo — aún requiere manejo apropiado

## ⚠️ Importante

Los plazos son estrictos: **GDPR: 1 mes (extendible a 3 meses para solicitudes complejas). CCPA: 45 días.** Perder el plazo es en sí mismo una violación de cumplimiento. Claude ayuda a estructurar el proceso — tu DPO o asesoramiento legal deben revisar antes de enviar cualquier respuesta.

## Instrucciones

### Paso 1 — Clasificar la solicitud

```
Un sujeto de datos envió este mensaje: „[pega solicitud]"

Clasificar:
1. ¿Qué tipo de solicitud es esta?
   - Acceso (Artículo 15 GDPR / CCPA derecho a saber)
   - Eliminación (Art. 17 GDPR / CCPA derecho a eliminar)
   - Portabilidad (Art. 20 GDPR — formato estructurado, legible por máquina)
   - Corrección (Art. 16 GDPR)
   - Restricción del procesamiento (Art. 18 GDPR)
   - Objeción del procesamiento (Art. 21 GDPR)
   - Múltiples derechos combinados

2. ¿Qué regulación se aplica?
   - GDPR (residente de EU/RU u operaciones de EU)
   - CCPA (residente de California)
   - Ambos / Otro

3. ¿Cuál es el plazo?
   - GDPR: [hoy + 30 días] = [fecha]
   - CCPA: [hoy + 45 días] = [fecha]
```

## Ejemplo

**El cliente envía un correo:** „Quiero saber qué datos tienes sobre mí y quiero que los elimines."

**Salida del flujo de trabajo de Claude:**

**Clasificación:** Solicitud combinada de acceso + eliminación bajo GDPR (cliente de UE identificado por dominio de correo).

**Plazo:** 30 días a partir de hoy = [fecha].

**Verificación de identidad:** El correo coincide con la cuenta en el archivo — riesgo bajo, no se necesita verificación adicional para cliente conocido.

**Sistemas a verificar:** CRM (HubSpot), procesador de pagos (Stripe), plataforma de correo (Mailchimp), análisis (Mixpanel), tickets de soporte (Intercom), sistemas de copia de seguridad/archivo.

**Borrador de confirmación** (enviar hoy): Confirma recepción, número de referencia, plazo de respuesta de 30 días, contacto DPO.

**Análisis de eliminación:** Los datos de ventas/marketing se pueden eliminar inmediatamente. Los registros de pago se conservan 7 años según la ley fiscal del Reino Unido (excepción de obligación legal, Art. 17(3)(b)). Confirma la excepción antes de eliminar.

**Borrador de respuesta:** Confirma las categorías de datos encontradas, confirma eliminación de datos de marketing, explica retención de 7 años de registros de pago con base legal, incluye derecho de queja ante ICO.

---
