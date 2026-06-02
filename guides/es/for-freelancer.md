# Claude para Freelancers y Consultores

Todo lo que un freelancer o consultor independiente necesita para gestionar la adquisición de clientes, la gestión de proyectos, la facturación y el desarrollo de negocio aumentados con IA en Claude Code.

---

## Para quién es esta guía

Eres un freelancer o consultor independiente — diseñador, desarrollador, escritor, estratega, marketero o especialista — que gestiona tu propio negocio de servicios a clientes. Tus ingresos dependen de ganar proyectos, entregarlos bien, cobrar y mantener el pipeline continuamente. Dedicas el 30% de tu tiempo a operaciones de negocio que no generan ingresos. Claude Code reduce esa carga para que puedas dedicar más tiempo al trabajo facturable y al desarrollo de negocio.

**Antes de Claude Code:** 2 horas para escribir una propuesta ganadora. 45 minutos para redactar un alcance de trabajo. 30 minutos por informe de estado del cliente. Horas persiguiendo facturas impagadas cada mes.

**Después:** Propuesta en 20 minutos. Alcance de trabajo en 15 minutos. Informe de estado en 8 minutos. Seguimiento de facturas redactado en 60 segundos.

---

## Instalación en 30 segundos

```bash
# Instalar todas las habilidades de freelancer
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/agency-operations

# Instalar el agente de asesor CEO
npx claudient add agent advisors/ceo-advisor
```

---

## Tu stack de freelancer en Claude Code

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/freelancer-proposal` | Gana más proyectos — redacción de propuestas con propuestas de valor claras, justificación del precio y llamada a la acción | Cualquier nueva oportunidad de proyecto |
| `/scope-of-work` | Define entregables, exclusiones, cronograma, pago y política de órdenes de cambio | Antes de comenzar cada proyecto |
| `/client-status-report` | Actualizaciones semanales/mensuales al cliente — progreso, bloqueos, decisiones necesarias | Gestión activa de proyectos |
| `/invoice-chaser` | Seguimiento profesional de pagos para facturas vencidas — secuencia de escalada | Cualquier factura vencida |
| `/cold-outreach` | Prospección saliente a nuevos clientes — personalizada, no spam | Desarrollo de negocio |
| `/cash-flow-forecast` | Previsión de flujo de caja a 90 días — cuándo entra el dinero, cuándo salen las facturas | Planificación financiera mensual |
| `/agency-operations` | SOPs, incorporación, procesos de equipo si estás escalando | Crecimiento más allá del trabajo en solitario |

### Agente

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `ceo-advisor` | Sonnet | Decisiones de precios, situaciones difíciles con clientes, estrategia de negocio |

---

## Flujo de trabajo diario

### Mañana (15 minutos)

**1. Nueva oportunidad — alcance y respuesta**
```
/freelancer-proposal

He recibido una consulta de nuevo proyecto. Aquí está lo que me dijeron:
[Pega el mensaje o briefing del cliente]

Mis servicios: [lo que haces]
Mi tarifa: $[X]/hora o $[X] para este tipo de proyecto
Preguntas clave que tengo: [lo que necesitas saber antes de proponer]

Redacta una respuesta que:
1. Reconozca su consulta
2. Haga 2-3 preguntas de aclaración (no 10 — respeta su tiempo)
3. Dé un rango aproximado si tengo suficiente información para hacerlo
4. Proponga una llamada de 20 minutos para hablar

Tono: seguro, experto, cálido.
```

**2. Proyecto activo — informe de estado para el cliente**
```
/client-status-report

Actualización de estado semanal para [nombre del cliente] — [nombre del proyecto].

Semana de: [fechas]
Completado: [lista lo que hiciste]
En progreso: [trabajo actual]
Bloqueado por: [lo que necesitas de ellos — sé específico]
Próxima semana: [lo que harás]
```

---

### Al ganar un nuevo proyecto

**3. Propuesta ganadora**
```
/freelancer-proposal

Escribe una propuesta para esta oportunidad de proyecto.

Cliente: [nombre de la empresa, nombre del contacto]
Lo que necesitan: [descripción del proyecto]
Presupuesto (si se ha revelado): $[X]
Plazo que mencionaron: [X semanas/meses]
Cómo lo abordaré: [tu metodología]
Por qué soy la elección correcta: [experiencia relevante, resultados pasados]

Mi precio propuesto: $[X]
```

**4. Alcance de trabajo — protégete**
```
/scope-of-work

Escribe un alcance de trabajo para el proyecto que acabamos de acordar.

Cliente: [nombre]
Proyecto: [descripción]
Entregables: [lista específica]
Exclusiones: [lo que no voy a hacer]
Cronograma: [fechas]
Pago: $[X], [X]% por adelantado, [X]% en la entrega
Revisiones: [X rondas incluidas]
Tarifa de órdenes de cambio: $[X]/hora
```

---

### Cuando no te han pagado

**5. Seguimiento de factura**
```
/invoice-chaser

La factura #[X] de $[X] tiene [X] días de retraso.

Cliente: [nombre]
Fecha de factura: [fecha]
Fecha de vencimiento: [fecha]
Condiciones de pago: [Net 15 / Net 30]
Contacto: [nombre, email]
Seguimientos anteriores: [ninguno / email enviado el [fecha] / llamada el [fecha]]

Redacta un seguimiento que escale apropiadamente para [X] días de retraso.
Mantén abierta la puerta para el pago mientras dejas claro la seriedad del asunto.
```

---

### Desarrollo de negocio (semanal)

**6. Prospección saliente**
```
/cold-outreach

Investiga y redacta un mensaje de contacto para un cliente potencial.

Objetivo: [nombre de la empresa o tipo de negocio]
Contacto: [nombre, cargo si se conoce]
Por qué podrían necesitarme: [tu evaluación]
Mi experiencia relevante: [lo que he hecho que sea relevante]
Lo que ofrezco: [lo que harías para ellos]

Escribe un email de contacto personalizado. No es un argumento de venta — más bien una introducción profesional con una observación específica sobre su negocio.
```

---

### Revisión financiera mensual

**7. Previsión de flujo de caja**
```
/cash-flow-forecast

Previsión de flujo de caja a 90 días para mi negocio freelance.

Caja actual: $[X]
Contratos firmados con pagos próximos:
- [Cliente A]: $[X] con vencimiento el [fecha]
- [Cliente B]: $[X] con vencimiento el [fecha]

Facturas pendientes (aún sin pagar):
- Factura #[X] — [cliente] — $[X] — [X] días de retraso

Gastos mensuales:
- [Software/herramientas]: $[X]/mes
- [Contabilidad/admin]: $[X]/mes
- [Otros]: $[X]/mes

Gastos próximos (puntuales):
- [Elemento]: $[X] en [mes]

Pipeline (aún sin firmar):
- [Prospecto A]: $[X] — probabilidad [alta/media/baja]
- [Prospecto B]: $[X] — probabilidad [media]

Muéstrame: flujo de caja mes a mes, cuándo podría haber un déficit, qué lo está causando.
```

---

## Plan de 30 días (nuevos freelancers o nuevo mercado)

### Semana 1 — Infraestructura de negocio
- Instala todas las habilidades de freelancer: `npx claudient add skill small-business/[nombre]`
- Escribe tu plantilla de propuesta estándar usando `/freelancer-proposal` — personalízala para tus servicios
- Escribe tu plantilla maestra de alcance de trabajo usando `/scope-of-work` — úsala para cada proyecto futuro
- Define tus precios: tarifa por hora, tarifas por proyecto, tarifas de retainer — documéntalos

### Semana 2 — Gestión activa de clientes
- Usa `/client-status-report` en todos los proyectos activos — establece una cadencia semanal los viernes
- Usa `/invoice-chaser` en cualquier factura vencida — no dejes que pase más de 7 días
- Ejecuta `/cash-flow-forecast` para entender tu posición a 90 días

### Semana 3 — Desarrollo de negocio
- Identifica 10 clientes potenciales en tu red existente
- Usa `/cold-outreach` para redactar mensajes personalizados para cada uno — dedica 5 minutos a personalizar cada mensaje
- Registra las respuestas — ¿qué gancho funciona mejor en tu mercado?

### Semana 4 — Sistematizar
- Usa `/agency-operations` para documentar tu proceso de incorporación (qué reciben los nuevos clientes en la semana 1)
- Escribe un FAQ para clientes usando Claude — reduce el tiempo dedicado a responder las mismas preguntas
- Revisa tus tarifas: ¿estás registrando el tiempo con precisión? ¿Tienes precios demasiado bajos?

---

## Precios y estrategia de negocio

Usa el agente de asesor CEO para decisiones difíciles de negocio:

**Subir tarifas:**
```
/ceo-advisor

Quiero subir mis tarifas de $[X]/hora a $[X]/hora. Mis clientes actuales pagan $[X]. Llevo [X] años como freelancer. Mi pipeline está lleno.

Ayúdame a pensar en:
- Cómo comunicar el aumento de tarifas a los clientes existentes
- Si respetar los contratos existentes o aplicar inmediatamente
- Cómo posicionar mi nueva tarifa con nuevos clientes
- Si cambiar a precios por proyecto en lugar de por hora
```

**Despedir a un mal cliente:**
```
/ceo-advisor

Tengo un cliente que [describe el problema: paga tarde, expansión constante del alcance, falta de respeto, no es rentable]. Representan el [X]% de mis ingresos mensuales.

Ayúdame a pensar en:
- Si despedirlos o intentar arreglar la relación
- Si debo despedirlos, cómo hacerlo profesionalmente
- Cómo reemplazar los ingresos
```

**Evaluar una oferta de retainer:**
```
/ceo-advisor

Un cliente quiere contratarme con un retainer mensual de $[X]/mes por [X] horas. Mi tarifa diaria actual es $[X].

¿Es un buen trato? ¿Cómo deberían ser los términos del retainer? ¿Cuáles son los riesgos?
```

---

## Integraciones de herramientas

### Facturación (Wave, FreshBooks, Bonsai)
Claude redacta tu propuesta profesional y alcance de trabajo → lo pegas en tu herramienta de facturación para crear el proyecto y generar facturas. Para el seguimiento de facturas, usa `/invoice-chaser` para redactar emails → envía desde tu herramienta de facturación o directamente.

### Registro de tiempo (Toggl, Harvest, Clockify)
Registra el tiempo en tu herramienta → exporta los totales semanales → pégalos en `/client-status-report` para contextualizar tus entregables con el tiempo dedicado (útil para transparencia en facturación por hora).

### Firma de contratos (DocuSign, PandaDoc, HelloSign)
Claude genera el texto del SOW → pégalo en tu herramienta de firma electrónica → envía para firmar. Para clientes recurrentes, guarda tus plantillas generadas por Claude en PandaDoc o Bonsai.

### CRM / pipeline (HubSpot gratuito, Notion, Airtable)
Usa un Kanban simple para tu pipeline: Prospecto → Propuesta enviada → Negociando → Activo → Facturado → Pagado. Claude ayuda en cada etapa — `/cold-outreach` para Prospecto, `/freelancer-proposal` para Propuesta enviada, `/scope-of-work` para Activo.

---

## Métricas a seguir

| Métrica | Objetivo | Seguimiento mensual |
|---|---|---|
| Tasa de éxito en propuestas | >35% | Propuestas enviadas / proyectos ganados |
| Valor medio del proyecto | [tu objetivo] | ¿Creciendo o estancado? |
| Días hasta el pago | <15 días | Señala clientes que pagan lento |
| Tasa de utilización | 70-80% de horas laborales facturables | Por encima del 80% = sube tarifas o contrata |
| Ingresos por cliente | Rastrea los 3 principales | No dejes que ningún cliente supere el 40% de los ingresos |
| Horas de desarrollo de negocio | 5-10% de tu tiempo | Si es cero, tendrás ciclos de abundancia/escasez |
| Margen de ingreso neto | >50% (negocio de servicios) | Tu parte después de herramientas, impuestos, administración |

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Alcance vago = expansión del alcance**
`/scope-of-work` te obliga a enumerar cada entregable y listar cada exclusión. No se permite alcance vago.

**Error 2: Sin proceso de órdenes de cambio**
`/scope-of-work` incluye la cláusula de orden de cambio. Cada solicitud adicional la activa — nada de trabajo gratuito.

**Error 3: No hacer seguimiento de facturas vencidas**
`/invoice-chaser` hace que el seguimiento tome 60 segundos. Nada de "lo haré cuando tenga un momento".

**Error 4: Propuestas que describen el proceso en lugar de los resultados**
`/freelancer-proposal` pone los resultados del cliente en primer lugar. Tu proceso es secundario a sus resultados.

**Error 5: Sorpresas de flujo de caja**
`/cash-flow-forecast` cada mes. Conoce tu posición a 90 días antes de que se convierta en una crisis.

---

## Recursos

- [Comenzar con Claude Code](getting-started.md)
- [Habilidad de alcance de trabajo](../skills/small-business/scope-of-work.md)
- [Habilidad de informe de estado del cliente](../skills/small-business/client-status-report.md)
- [Habilidad de seguimiento de facturas](../skills/small-business/invoice-chaser.md)
- [Flujo de trabajo semanal del freelancer](../workflows/freelancer-weekly.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
