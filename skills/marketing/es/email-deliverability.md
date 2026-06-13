---
name: email-deliverability
description: "Auditoría de entregabilidad de email: verificación de SPF/DKIM/DMARC, análisis de disparadores de spam, higiene de listas, estrategia de calentamiento"
---

# Habilidad de Entregabilidad de Email

## Cuándo activar
- Las tasas de apertura caen inesperadamente (> 20% de descenso semana a semana)
- Una campaña aterriza en spam o en la carpeta de promociones en lugar de la bandeja de entrada
- Estás configurando un nuevo dominio de envío y necesitas configurar la autenticación
- Nunca has auditado tu infraestructura de envío y no estás seguro de si está correctamente configurada
- Lanzando una nueva plataforma de email o dirección IP y necesitas un plan de calentamiento
- Estás viendo tasas de rebote altas (> 2%) o tasas de quejas de spam (> 0,1%)

## Cuándo NO usar
- Redacción de emails — usa las habilidades `/email-sequence` o `/email-campaign`
- Decisiones de estrategia de campaña — esta habilidad trata de infraestructura e higiene, no de mensajería
- Gestión de datos de CRM — usa tu herramienta de CRM; esta habilidad diagnostica la salud del envío
- Emails transaccionales puntuales que controlas de extremo a extremo (restablecimientos de contraseña, recibos) — céntrate en los envíos de marketing

## Instrucciones

### Auditoría completa de entregabilidad

```
Ejecuta una auditoría de entregabilidad en mi configuración de envío de email.

Mi configuración:
- Plataforma de email: [Mailchimp / Klaviyo / HubSpot / SendGrid / Postmark / otra]
- Dominio de envío: [p. ej., newsletter.miempresa.com o miempresa.com]
- Volumen de envío mensual: [X emails/mes]
- Tamaño de lista: [X suscriptores]
- Antigüedad de la lista: [¿qué tan antiguo es el segmento más antiguo?]
- Tasa de apertura promedio (últimos 3 meses): [X%]
- Tasa de clic promedio: [X%]
- Tasa de rebote: [X%]
- Tasa de quejas de spam: [X%] (encontrar en la analítica de tu plataforma)
- Ubicación actual en bandeja de entrada: [bandeja de entrada / promociones / spam — o desconocido]

Realiza un diagnóstico en estas áreas:

## 1. Autenticación (SPF / DKIM / DMARC)
Verifica estos registros para [DOMINIO]:
SPF: verifica que el registro TXT incluya los servidores de tu plataforma de envío
DKIM: verifica que los registros CNAME o TXT de tu plataforma estén activos
DMARC: verifica que exista una política DMARC y qué hace (none / quarantine / reject)

Qué significa cada uno:
- SPF ausente → clasificación fácil como spam, algunos proveedores rechazan directamente
- DKIM ausente → sin firma criptográfica → tratado como correo no firmado/no verificado
- DMARC ausente → suplantación de dominio trivial → los proveedores penalizan el dominio

Política DMARC inicial recomendada:
v=DMARC1; p=none; rua=mailto:dmarc-reports@tudominio.com; pct=100

Pasar a p=quarantine después de 30 días de informes limpios, luego a p=reject después de 60 días.

## 2. Configuración del dominio de envío
- ¿Estás enviando desde un subdominio (newsletter.empresa.com) o desde el dominio raíz?
  Recomendación: subdominio para marketing, dominio raíz para transaccional — grupos de reputación separados
- ¿La dirección De coincide con el dominio autenticado?
- ¿Es el Responder-A diferente del De? (no es un problema, pero nótalo)
- ¿Tiene el IP de envío DNS inverso (registro PTR)?

## 3. Análisis de contenido
Pega el HTML + versión de texto de un email reciente y escanearé:
- Palabras desencadenantes de spam en la línea de asunto y el cuerpo
- Relación texto-imagen (< 20% de texto = probablemente carpeta de promociones)
- Dominios de enlaces — ¿estás usando un dominio de seguimiento de clics personalizado?
- Texto alternativo en imágenes (ausente = señal de spam)
- Presencia del enlace de desuscripción (legalmente requerido, mejora la entregabilidad)
- Encabezado List-Unsubscribe (debe estar presente en los encabezados)
- Dirección física en el pie de página (requisito CAN-SPAM)

## 4. Higiene de lista
Proporciona el desglose de tu lista:
- Total de suscriptores: [X]
- Nunca abrieron en 90 días: [X] → candidato a supresión
- Nunca abrieron en 180 días: [X] → necesita campaña de reenganche / eliminación
- Rebotes duros: [X] → deben eliminarse inmediatamente
- Rebotes suaves (3+ veces): [X] → eliminar
- Desuscripciones no atendidas en 10 días: [X] → riesgo legal, arreglar inmediatamente

## 5. Segmentación por engagement
El factor de entregabilidad más importante en 2024+ es el engagement.
Gmail y Apple Mail filtran principalmente según si los destinatarios interactúan.

Segmenta tu lista:
- Muy comprometidos: abrieron o hicieron clic en los últimos 30 días → Envío Prioritario 1
- Comprometidos: abrieron en los últimos 90 días → Envío estándar
- Levemente comprometidos: última apertura entre 90-180 días → Campaña de reenganche antes de incluir
- Inactivos: sin apertura en 180+ días → Secuencia de eliminación, luego eliminar

Nunca envíes a suscriptores inactivos mezclados con suscriptores comprometidos.
La tasa de quejas y no-engagement de segmentos inactivos penaliza la reputación de todo tu dominio.

## 6. Resumen de puntuación de entregabilidad
| Área | Estado | Acción Requerida |
|---|---|---|
| SPF | ✓ / ✗ | [arreglar si falta] |
| DKIM | ✓ / ✗ | [arreglar si falta] |
| DMARC | ✓ / none / reject | [establecer política] |
| Aislamiento de subdominio | ✓ / ✗ | [separar si es necesario] |
| Higiene de lista | Limpia / Problemas | [describir problemas] |
| Segmentos de engagement | Segmentados / Sin segmentar | [acción] |
| Indicadores de contenido | [N problemas encontrados] | [lista] |

Salud general: Verde / Ámbar / Rojo
Acciones prioritarias ordenadas por impacto: [lista numerada]
```

### Guía de configuración de registros DNS

```
Genera los registros DNS exactos que necesito configurar para [PLATAFORMA DE ENVÍO] en el dominio [DOMINIO].

Plataforma: [Mailchimp / Klaviyo / SendGrid / Postmark / HubSpot / otra]
Dominio de envío: [tudominio.com o subdominio]
Proveedor DNS actual: [Cloudflare / Route53 / GoDaddy / Namecheap / otro]

Genera:

## Registro SPF
Tipo: TXT
Host: @ (o subdominio)
Valor: [declaración include específica de la plataforma]
Ejemplo: "v=spf1 include:sendgrid.net include:_spf.google.com ~all"
TTL: 3600

Nota: solo UN registro SPF por dominio/subdominio. Si ya tienes uno, añade el nuevo include — no crees un segundo registro TXT.

## Registros DKIM
[La plataforma los proporciona — lista los registros CNAME o TXT con host y valor]
Tipo: CNAME o TXT (específico de la plataforma)
TTL: 3600

## Registro DMARC
Tipo: TXT
Host: _dmarc.[dominio]
Valor: v=DMARC1; p=none; rua=mailto:dmarc@[dominio]; pct=100
Empieza con p=none. Revisa los informes durante 30 días. Pasa a p=quarantine, luego a p=reject.

## Registro BIMI (opcional — logo de marca en la bandeja de entrada)
Requiere DMARC con p=quarantine o p=reject primero.
Tipo: TXT
Host: default._bimi.[dominio]
Valor: v=BIMI1; l=https://[dominio]/logo.svg; a=;

## Pasos de verificación tras la propagación DNS (24-48 horas)
Probar SPF: usa el verificador de registros SPF de MXToolbox
Probar DKIM: envía un email de prueba y verifica los encabezados en Gmail (Ver fuente)
Probar DMARC: verifica [dominio] en dmarcanalyzer.com
Probar entregabilidad: envía a mail-tester.com para obtener una puntuación sobre 10
```

### Escáner de palabras desencadenantes de spam

```
Escanea este email en busca de disparadores de spam.

Línea de asunto: [pegar]
Texto de vista previa: [pegar]
Cuerpo del email: [pegar texto plano o HTML]

Verificar:
1. Palabras de spam clásicas en el asunto (evitar por completo):
   - Financiero: "dinero gratis", "ingresos garantizados", "sin riesgo", "ganar $", "efectivo"
   - Abuso de urgencia: "actúa ahora", "tiempo limitado!!!", "date prisa", "no te lo pierdas"
   - Demasiado promocional: "mejor precio", "compra ahora", "descuento", "precio más bajo"
   - Patrones de phishing: "haz clic aquí", "verifica tu", "confirma tu cuenta"
   - MAYÚSCULAS EXCESIVAS Y SIGNOS DE EXCLAMACIÓN!!!

2. Problemas de contenido del cuerpo:
   - Relación imagen-texto: imágenes sin texto alternativo + texto mínimo = promoción/spam
   - Enlaces a dominios sospechosos o dominios de seguimiento no relacionados
   - Enlace de desuscripción ausente o enterrado
   - Sin dirección física en el pie de página

3. Longitud y puntuación de la línea de asunto:
   - Longitud óptima: 30-50 caracteres
   - Evitar: 3+ signos de puntuación, 3+ emojis seguidos
   - Evitar: líneas de asunto en minúsculas o MAYÚSCULAS

4. Problemas de HTML:
   - Solo estilos en línea (el CSS externo puede ser eliminado)
   - HTML limpio — no copiado desde Word (Word incrusta etiquetas ocultas)
   - Versión de solo texto presente (HTML sin respaldo de texto plano = señal de spam)

Resultado:
- Puntuación de riesgo de spam: Bajo / Medio / Alto
- Disparadores específicos encontrados y qué regla infringen
- Línea de asunto revisada (si es necesario)
- Las 3 mejoras principales del cuerpo
```

### Calendario de calentamiento de nuevo dominio

```
Construye un calendario de calentamiento para un nuevo dominio de envío o IP.

Dominio/IP: [nuevo dominio de envío o dirección IP]
Volumen de envío objetivo: [X emails/mes a pleno rendimiento]
Calidad inicial de la lista: [opt-in verificado, doble opt-in, o importado/desconocido]
Plataforma: [nombre del ESP]

Principios de calentamiento:
1. Comienza con tus suscriptores más comprometidos (aperturas y clics recientes) — señalan un engagement positivo
2. Aumenta lentamente — duplicar o triplicar demasiado rápido activa los filtros de spam
3. Monitorea la tasa de rebote y la tasa de quejas diariamente durante el calentamiento
4. Nunca envíes a una lista fría/inactiva durante el calentamiento — arruina la reputación del dominio desde el día 1
5. El envío diario constante supera los grandes envíos irregulares

Calendario de calentamiento:

Semana 1:
- Volumen diario: 50 emails
- Enviar a: Suscriptores más comprometidos (últimos 7 días)
- Umbral de tasa de rebote: < 1%
- Umbral de quejas: < 0,05%

Semana 2:
- Volumen diario: 200 emails
- Enviar a: Comprometidos (últimos 30 días)
- Umbrales: iguales

Semana 3:
- Volumen diario: 500 emails
- Enviar a: Comprometidos (últimos 60 días)

Semana 4:
- Volumen diario: 1.000-2.000 emails
- Enviar a: Comprometidos (últimos 90 días)

Mes 2:
- Escalar al 10% del volumen objetivo
- Comenzar a incluir moderadamente comprometidos (últimos 180 días)

Mes 3+:
- Volumen completo, todos los suscriptores verificados
- Inactivos > 180 días: campaña de eliminación antes de incluir

Si la tasa de rebote supera el 2% o la tasa de quejas supera el 0,1% en cualquier etapa:
DETÉN el aumento. Diagnostica. Limpia la lista. Reanuda desde el nivel de volumen anterior.

Genera mi calendario semanal específico desde [FECHA DE INICIO] para alcanzar [VOLUMEN OBJETIVO] en [FECHA OBJETIVO].
```

### PNT de higiene de lista

```
Genera un procedimiento normalizado de trabajo de higiene de lista para [PLATAFORMA].

Lista actual: [X suscriptores]
Problemas actuales: [rebotes altos / tasa de apertura baja / quejas de spam / todos los anteriores]

Lista de verificación de higiene (ejecutar mensualmente):

1. Eliminar rebotes duros inmediatamente
   Definición: la dirección de email no existe o no es entregable permanentemente
   Acción: la mayoría de las plataformas lo suprimen automáticamente — verifica que tu plataforma lo hace

2. Eliminar acumulación de rebotes suaves
   Definición: 3+ rebotes suaves en 90 días (buzón lleno, problema temporal del servidor)
   Acción: mover a lista de supresión, re-verificar mediante un servicio de verificación de email

3. Eliminar reclamantes de spam
   Definición: el suscriptor hizo clic en "marcar como spam" (reportado a ti mediante bucle de retroalimentación)
   Acción: suprimir inmediatamente, no volver a suscribir aunque pidan ser añadidos de nuevo

4. Eliminar suscriptores inactivos (trimestralmente)
   Definición: sin apertura de email en 180 días
   Proceso:
   a. Enviar campaña de reenganche de 3 emails durante 2 semanas
   b. Rastrear quién abre o hace clic — restaurar a la lista activa
   c. Después de 3 emails sin engagement: eliminar permanentemente
   d. No reenviar a contactos eliminados — respetar su desuscripción implícita

5. Verificar nuevas importaciones de lista
   Antes de enviar a cualquier lista importada (feria comercial, comprada, datos antiguos de CRM):
   - Ejecutar a través de un servicio de verificación de email (NeverBounce, ZeroBounce, BriteVerify)
   - Eliminar direcciones desconocidas/de riesgo (> 5% de riesgo = no envíes en absoluto)
   - Confirmación de doble opt-in antes de añadir a envíos de marketing

Resultado: calendario de higiene mensual y plantilla de email para secuencia de reenganche.
```

### Referencia de métricas clave de entregabilidad

```typescript
interface DeliverabilityHealth {
  // Inbox placement rate (use GlockApps, Litmus, or 250ok to measure)
  inboxPlacementRate: number  // target: > 90%

  // From your ESP dashboard
  openRate: number            // target: > 20% (Gmail/Apple Mail clip post-privacy)
  clickRate: number           // target: > 2%
  bounceRate: number          // alert at > 2%, danger at > 5%
  spamComplaintRate: number   // alert at > 0.08%, danger at > 0.1% (Google threshold)
  unsubscribeRate: number     // alert at > 0.5% per campaign

  // List health
  activeEngagedPercent: number    // subscribers who opened in last 90 days / total
  inactivePercent: number         // no open in 180 days / total
}

const DELIVERABILITY_THRESHOLDS = {
  inboxPlacementRate: { healthy: 0.90, concern: 0.80, critical: 0.70 },
  bounceRate: { healthy: 0.02, concern: 0.05, critical: 0.10 },
  spamComplaintRate: { healthy: 0.0005, concern: 0.001, critical: 0.003 },
  // Note: Google's postmaster tools flag domains at 0.1% complaint rate
  // Apple Mail Privacy Protection (iOS 15+) inflates open rates — do not use open rate alone
}
```

## Ejemplo

**Usuario:** Mis tasas de apertura cayeron del 32% al 19% en 3 meses. No he cambiado nada. ¿Qué verifico primero?

**Marco de diagnóstico:**

```
Una caída de 13 puntos en la tasa de apertura en 3 meses sin cambios de contenido apunta a una de estas causas
en orden de probabilidad:

1. Deterioro de la lista — los suscriptores inactivos se acumularon y están arrastrando el engagement
   Verificar: % de tu lista sin apertura en 90 días. Si > 30%, este es tu culpable.
   Solución: suprimir el segmento inactivo inmediatamente, ejecutar campaña de reenganche

2. Cambio de entregabilidad — la reputación del dominio o IP cambió (común tras un envío con muchos rebotes)
   Verificar: acceder a Google Postmaster Tools para tu dominio. Revisa los gráficos de reputación del dominio
   y tasa de spam. Una caída en la reputación del dominio se correlaciona directamente con la pérdida de ubicación en bandeja de entrada.
   Solución: ejecutar auditoría completa de autenticación, limpiar la lista, reducir la frecuencia de envío durante 30 días

3. Acumulación de Apple Mail Privacy Protection — si tu lista es mayoritariamente de usuarios de iOS,
   las aperturas artificialmente infladas desde 2021 están ahora saliendo del sistema a medida que esos usuarios se vuelven inactivos.
   Esto no es un problema real de entregabilidad — es un problema de medición.
   Solución: cambiar a la tasa de clic como métrica principal de engagement. La tasa de apertura no es fiable para iOS.

4. Cambio de dominio de envío — ¿migraste a un nuevo subdominio, ESP o IP sin volver a calentar?
   Verificar: encabezados de email de una campaña enviada. ¿Cuál es la IP de envío real?
   Solución: calendario de calentamiento para la nueva infraestructura.

Empieza con Google Postmaster Tools — es gratuito y te dice en 24 horas si Gmail está
clasificando tu dominio como spam. Eso acota el diagnóstico inmediatamente.
```

---
