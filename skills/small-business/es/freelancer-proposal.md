---
name: freelancer-proposal
description: "Kit de herramientas de freelancer: propuestas de proyecto, orientación de precios, secuencias de seguimiento de facturas, contratos de proyecto en lenguaje simple y documentos de liberación de clientes"
---

# Freelancer Proposal

## When to activate
- Un prospecto te pidió una propuesta y necesitas sacar una hoy
- Estás inseguro de cómo fijar el precio de un proyecto — hora vs. fijo, qué tarifa, cuánto búfer
- Una factura de cliente está vencida y necesitas hacer un seguimiento sin dañar la relación
- Estás terminando un proyecto y necesitas un proceso limpio de entrega y liberación

## When NOT to use
- Contratos legales formales para compromisos de alto valor o alto riesgo — haz que un abogado revise cualquier cosa por encima de $25K o con términos de PI inusuales
- Asesoramiento fiscal o financiero — usa un contador para estimaciones trimestrales, deducciones y estructura comercial
- Facturación o procesamiento de pagos automatizados — usa FreshBooks, Wave o QuickBooks para eso

## Instructions

### Proposals (90 seconds)

Cuéntale a Claude:
- Lo que el cliente quiere lograr — en sus palabras si las tienes
- Tu comprensión del alcance del trabajo: qué entregarás, qué está fuera de alcance
- Tu tarifa (por hora o basada en proyecto) y estimación de cronograma
- Cualquier restricción conocida: su fecha límite, su rango de presupuesto si lo compartieron, cualquier límite técnico o logístico

Claude escribe un documento de propuesta completo:

**Resumen ejecutivo** — 2-3 oraciones que reafirmen su problema y tu solución. Escrito desde su perspectiva, no la tuya. Comienza con su objetivo, no tus credenciales.

**Alcance del trabajo** — qué está explícitamente incluido (entregables, rondas de revisión, reuniones, formatos). Luego: qué explícitamente no está incluido. Esta sección previene la expansión del alcance más que cualquier cláusula de contrato. Claude es riguroso sobre la lista « no incluido ».

**Cronograma** — fases con fechas de finalización estimadas, basadas en tu estimación. Claude señala dependencias: « La fase 2 comienza después de la aprobación del cliente de los entregables de la fase 1 » — para que los retrasos de su parte no compriman tu cronograma.

**Inversión** — tu precio, calendario de pagos y qué dispara cada pago. Para proyectos de precio fijo, Claude agrega un búfer del 20% a tu estimación bruta y te muestra cómo presentarlo claramente al cliente.

**Próximos pasos** — una única acción clara para que el cliente tome (firmar, responder para confirmar, pagar depósito).

---

### Pricing guidance

Cuéntale a Claude:
- El tipo de proyecto (diseño de logo, construcción de sitio web, estrategia de marketing, contabilidad, redacción, etc.)
- Tu tarifa por hora objetivo
- Tus horas estimadas para este proyecto
- Tu mercado (EE.UU., Reino Unido, UE, etc.) y tu nivel de experiencia (1-3 años, 5+ años, especialista)
- ¿El cliente tiene un presupuesto declarado?

Claude calcula tu tarifa de proyecto, verifica si se alinea con los puntos de referencia del mercado para tu categoría y recomienda si citar por hora o fijo para este tipo de trabajo.

Cuándo citar fijo: proyectos con entregables claros y alcance definido. Cuándo citar por hora: consultoría, estrategia o cualquier cosa donde el alcance sea exploratorio.

La regla del búfer del 20%: Claude la agrega a tu estimación bruta al generar un precio fijo y explica cómo presentarla a clientes que piden un desglose. El marco es: esto cuenta para ciclos de revisión, gastos generales de comunicación con clientes e incógnitas técnicas. La mayoría de los clientes lo aceptan cuando se explica.

---

### Invoice follow-up

Cuéntale a Claude:
- El monto de la factura y fecha de vencimiento
- Cuántos días de retraso es
- Tu relación con este cliente (largo plazo vs. primer proyecto, amigable vs. distancia profesional)
- Qué comunicación ya ha ocurrido (¿enviaste la factura? ¿algunas respuestas?)

Claude redacta el mensaje de seguimiento apropiado para la etapa. Escalada de tres etapas:

**Etapa 1 — 3 días de retraso:** Amigable, asume un error. Sin mención de cargos por demora. « Solo para verificar que esto no se perdió en tu bandeja de entrada. »

**Etapa 2 — 14 días de retraso:** Directo. Hace referencia a la factura original. Observa tu política de cargos por demora si tienes una. Propone una fecha de pago específica. Aún profesional, no amenazante.

**Etapa 3 — 30 días de retraso:** Aviso final. Declaración clara de próximos pasos si el pago no se recibe antes de una fecha específica. Si tienes cargos por demora en tu contrato, este mensaje los aplica. Tono: factual, no emocional.

---

### Project contracts

Cuéntale a Claude:
- Tipo de trabajo y entregables
- Duración del proyecto y cronograma de pagos (depósito + hitos, o depósito + final)
- Tu política de revisión (cuántas rondas se incluyen antes de cargos adicionales)
- Propiedad intelectual: ¿el cliente posee el trabajo después del pago final, o retienes algo?
- Tarifa de cancelación: lo que cobras si el cliente cancela a mitad de proyecto (típicamente 25-50% del saldo restante)
- Tu jurisdicción (estado o país, para cláusula de ley aplicable)

Claude produce un acuerdo de proyecto en lenguaje simple. Sin jerga legal — oraciones completas que ambas partes realmente entienden. Cubre: alcance, cronograma, pago, revisiones, transferencia de PI, tarifa de cancelación, qué sucede si alguna de las partes necesita pausar y proceso básico de disputas.

Este es un punto de partida, no asesoramiento legal. Para contratos por encima de $25K, situaciones complejas de PI o cualquier cliente en una jurisdicción legal diferente, haz que un abogado lo revise.

---

### Client offboarding

Cuéntale a Claude:
- Nombre del proyecto y qué fue entregado
- Cualquier relación continua (retainer, período de soporte, arreglo de referencia)
- ¿Quieres pedir un testimonio o referencia?

Claude produce un paquete de liberación limpio:
- Correo de entrega con resumen de transferencia — qué fue entregado, dónde viven los archivos, todas las credenciales o acceso siendo transferidos
- Factura final (si aún no fue enviada)
- Lenguaje de oferta de soporte de 30 días (si quieres incluir uno)
- Solicitud de testimonio — una solicitud específica y de bajo fricción que dice al cliente exactamente lo que quieres que hable

---

### Prompt template — proposal

```
Por favor, escribe una propuesta de cliente.

Objetivo del cliente: [lo que quieren lograr]
Alcance del trabajo:
- Incluido: [entregables, rondas de revisión, reuniones]
- No incluido: [explícitamente fuera de alcance]

Mi tarifa: $[X] [por hora/basado en proyecto]
Estimación de cronograma: [X] semanas
Términos de pago: [depósito % + estructura de hito]
Fecha límite: [fecha límite declarada del cliente, si aplica]

Por favor, incluye un búfer del 20% en el precio fijo y muéstrame cómo presentarlo.
Escribe en un tono [profesional/cálido/directo].
```

## Example

Un diseñador web recibe una consulta vaga: « ¿Puedes construirnos un sitio web? Presupuesto alrededor de $5K. »

El diseñador le dice a Claude: el cliente es un contador local que necesita un sitio de 5 páginas con formulario de contacto, sus activos de marca actuales existen (logo, colores), quieren lanzar antes de la temporada fiscal, y el diseñador estima 40 horas de trabajo a $120/hora.

Claude produce:

Estimación bruta: 40 horas x $120 = $4.800. Con búfer del 20%: $5.760. Claude redondea a $6.200 y redacta la presentación: « Este proyecto se cotiza en $6.200 tarifa fija. Esto incluye hasta dos rondas de revisión en cada página, toda optimización móvil y una ventana de soporte de 30 días después del lanzamiento. No incluye redacción, fotografía o alojamiento continuo — estos pueden agregarse si es necesario. »

El alcance del trabajo incluye exactamente: 5 páginas (Inicio, Acerca de, Servicios, Preguntas Frecuentes, Contacto), formulario de contacto con notificación por correo electrónico, configuración básica de SEO en la página, diseño responsive móvil, 2 rondas de revisión por página.

No incluido: ilustraciones personalizadas, blog o sistema de gestión de contenidos, configuración de Google Ads, integración de redes sociales más allá de enlazar iconos, compra de dominio u configuración de alojamiento.

Cronograma: 4 semanas desde la firma del acuerdo y recepción del depósito.

---
