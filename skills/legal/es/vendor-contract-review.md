---
name: vendor-contract-review
description: "Revisión de contrato de proveedor: identifique cláusulas riesgosas en contratos de SaaS, servicios y adquisiciones — límites de responsabilidad, indemnización, procesamiento de datos, derechos de terminación y trampas de renovación automática"
---

# Habilidad de Revisión de Contratos de Proveedores

## Cuándo activar
- Revisión de un contrato antes de firmar con un nuevo proveedor o suministrador
- Identificación de cláusulas desfavorables en acuerdos de SaaS o software
- Revisión de un acuerdo de servicios, MSA o SOW para su empresa
- Verificación de una renovación antes de renovar automáticamente una gran compra
- Banderas de riesgos de procesamiento de datos y responsabilidad en contratos de proveedores

## Cuándo NO usar
- Negociación de sus propios contratos de clientes (diferentes prioridades de riesgo)
- Contratos de empleo — marco legal diferente
- Acuerdos inmobiliarios o de activos físicos — fuera de alcance
- Contratos que requieren análisis de cumplimiento regulatorio (FDA, banca) — necesita consejo legal calificado
- Reemplazar un abogado para contratos de alto riesgo (> $500K o exposición de responsabilidad significativa)

## Instrucciones

### Revisión estándar de contrato de proveedor

```
Revise este contrato de proveedor y señale cláusulas riesgosas.

Tipo de contrato: [Suscripción SaaS / Servicios profesionales / MSA + SOW / Adquisición / NDA]
Proveedor: [nombre]
Valor anual: $[X]
Duración: [X meses / anual]
Renovación: [automática / manual]
Su rol: [comprador que recibe el servicio]

Revise estas cláusulas en orden de prioridad:

1. LÍMITE DE RESPONSABILIDAD (máxima prioridad):
   - ¿Cuál es la responsabilidad máxima del proveedor hacia usted?
   - Bandera roja: límite igual o inferior a 1× honorarios mensuales
   - Estándar: 12× honorarios mensuales (1 año de valor del contrato)
   - Mejor: ilimitado para incumplimiento intencional, fraude, muerte/lesión, infracción de patentes, incumplimiento de datos

2. INDEMNIZACIÓN:
   - ¿Quién indemniza a quién por qué?
   - Bandera roja: usted indemniza al proveedor por su "mal uso" (demasiado amplio)
   - Estándar: indemnización mutua para infracción de patentes, negligencia
   - Tenga cuidado: exclusiones de indemnización que anulan su protección

3. DATOS Y PRIVACIDAD:
   - ¿Quién es dueño de los datos que ingresa o genera?
   - ¿Hay un DPA (Acuerdo de Procesamiento de Datos) adjunto o referenciado?
   - Bandera roja: proveedor puede usar sus datos para mejora de productos sin consentimiento
   - GDPR / CCPA: si procesa datos personales de EU/CA, DPA es legalmente requerido
   - Tenga cuidado: derechos de devolución/eliminación de datos en terminación

4. DERECHOS DE TERMINACIÓN:
   - ¿Puede terminar por conveniencia (sin causa)?
   - Período de notificación requerido para terminar: [X días]
   - Bandera roja: sin terminación por conveniencia / terminación requiere notificación de 90+ días
   - Derecho de terminar por causa material: ¿cuánto tiempo para remediar?

5. RENOVACIÓN AUTOMÁTICA:
   - ¿Se renueva automáticamente el contrato?
   - ¿Cuánto tiempo de anticipación debe dar aviso de cancelación? [X días]
   - Bandera roja: renovación automática con ventana de notificación > 60 días (fácil de perder)
   - Mejor práctica: recordatorio de calendario a 90 días antes de la fecha de renovación

6. PRECIOS E INCREMENTOS DE PRECIO:
   - ¿Puede el proveedor aumentar el precio en la renovación?
   - ¿Límite en los aumentos anuales de precio? [X%]
   - Bandera roja: aumentos de precio sin límite en renovación

7. SLA Y CRÉDITOS DE SERVICIO:
   - ¿Qué disponibilidad está garantizada? [X%]
   - ¿Cuáles son los recursos si se incumple el SLA?
   - Bandera roja: los créditos SLA son su único recurso (limita su recuperación)
   - Tenga cuidado: solo créditos, sin derecho a terminar por incumplimientos SLA repetidos

8. PROPIEDAD INTELECTUAL:
   - ¿Quién es propietario del producto del trabajo o personalizaciones?
   - Bandera roja: proveedor retiene PI para trabajos que pagó
   - Estándar: usted posee trabajos personalizados; proveedor retiene su PI preexistente

Marque cada cláusula como: VERDE (favorable) / AMARILLO (negociar) / ROJO (rechazar o escalar a legal)
```

### Revisión de cláusula específica de SaaS

```
Revise este acuerdo de SaaS para riesgos específicos de software comunes.

Producto SaaS del proveedor: [describir]
Usuarios: [X asientos / ilimitados]
Datos almacenados en el producto: [describir sensibilidad — PII / financiero / propietario]

Cláusulas específicas de SaaS a verificar:

POLÍTICA DE USO ACEPTABLE (AUP):
- ¿Cuáles usos están prohibidos?
- Bandera roja: derechos de suspensión amplios "a discreción del proveedor"
- Tenga cuidado: AUP vago que podría afectar su caso de uso legítimo

PORTABILIDAD DE DATOS Y EXPORTACIÓN:
- ¿Puede exportar sus datos en cualquier momento?
- ¿En qué formato? (CSV/JSON legible por máquina es estándar)
- ¿Qué sucede con los datos después de la terminación? Una ventana de 30 días para exportar es estándar.
- Bandera roja: sin exportación de datos / formato propietario / datos eliminados en terminación sin período de gracia

DISPONIBILIDAD Y MANTENIMIENTO:
- ¿El mantenimiento programado cuenta contra el SLA de disponibilidad?
- ¿Cuánta notificación para el tiempo de inactividad planificado?
- Mantenimiento de emergencia: ¿cuál es el proceso?

SUBPROCESADORES Y SERVICIOS DE TERCEROS:
- ¿El proveedor utiliza subprocesadores que tocarán sus datos?
- ¿Están listados? ¿Puede objetar contra nuevos?
- Requisito GDPR: debe notificar a los clientes de cambios de subprocesador

OBLIGACIONES DE SEGURIDAD:
- ¿A qué estándares de seguridad se compromete el proveedor? (SOC 2, ISO 27001)
- Notificación de incidente: ¿con qué rapidez deben notificarle de una infracción?
- Estándar: 72 horas (requisito GDPR); tenga cuidado: > 72 horas o sin compromiso

CAMBIOS DE SERVICIO:
- ¿Puede el proveedor cambiar características o eliminar funcionalidad?
- ¿Se requiere notificación de cambios materiales? (30-90 días es estándar)
- Bandera roja: proveedor puede cambiar el servicio unilateralmente sin notificación

Resultado: lista de cláusulas señaladas + solicitudes de negociación recomendadas para cada cláusula ROJA/AMARILLA.
```

### Manual de negociación de contrato

```
Construya una estrategia de negociación para [contrato].

Valor del contrato: $[X/año]
Apalancamiento del proveedor: [alto / medio / bajo — ¿hay alternativas?]
Su apalancamiento: [alto / medio / bajo — tamaño de su gasto relativo al proveedor]
Cláusulas que deben ganar: [enumere los 2-3 más importantes para solucionar]
Agradable tener: [enumere solicitudes secundarias]

Manual de negociación:

Priorizar: elija sus 3 batallas, deje ir el resto.
Los proveedores esperan negociación — no se irán de un acuerdo material por solicitudes razonables.

Para cada cláusula ROJA:

Cláusula: [nombre]
Problema: [qué dice el idioma actual, por qué es desfavorable]
Su solicitud: [el cambio de lenguaje específico que desea]
Su respaldo: [idioma mínimo aceptable si retrocede]
Justificación: [por qué esto es una solicitud comercial razonable]

Tácticas de apalancamiento:
- Compromiso de múltiples años: "Firmaremos 3 años si soluciona el límite de responsabilidad"
- Compromiso de volumen: "Expandiremos a 500 asientos si soluciona la portabilidad de datos"
- Urgencia de cronograma: "Necesitamos esto resuelto para [fecha] para proceder"
- Competencia: "El contrato de su competidor ya incluye esta protección"

Ruta de escalada:
- Nivel 1: correcciones estándar de su AE
- Nivel 2: negociación legal-a-legal
- Nivel 3: escalada ejecutiva (solo para acuerdos estratégicos)

Genere el manual de negociación para mis correcciones específicas.
```

### Lista de verificación de contrato

```
Genere una lista de verificación de revisión de contrato de proveedor para [empresa/equipo].

Caso de uso: [todos los proveedores nuevos / proveedores por encima de $X gasto / solo herramientas SaaS]
Tolerancia al riesgo: [conservadora / moderada / startup estándar]

Lista de verificación de revisión rápida (para contratos < $50K/año):
□ ¿Límite de responsabilidad ≥ 12 meses de honorarios?
□ ¿Período de aviso de renovación automática ≤ 60 días?
□ ¿Derechos de exportación de datos incluidos?
□ ¿Terminación por conveniencia disponible con ≤ 30 días de notificación?
□ ¿Sin cláusulas de asignación de PI inusuales?
→ Si todo verde: firme. Si rojo: escale.

Lista de verificación de revisión completa (contratos > $50K/año o que involucren datos sensibles):
□ Límite de responsabilidad y exclusiones revisados
□ Alcance de indemnización entendido
□ DPA adjunto (si procesamiento de datos personales)
□ SLA revisado y los recursos son adecuados
□ Derechos de terminación (por causa y por conveniencia)
□ Términos de renovación automática en calendario
□ Cláusula de escalada de precio revisada
□ Derechos de portabilidad y eliminación de datos confirmados
□ Requisitos de certificación de seguridad cumplidos
□ Ley aplicable y jurisdicción aceptable
→ Revisión legal interna requerida para elementos ROJO

Genere la lista de verificación específica para el proceso de revisión de contratos de mi empresa.
```

## Ejemplo

**Usuario:** Un nuevo proveedor de SaaS nos envió un contrato. Gasto anual: $84K. Su límite de responsabilidad es "un mes de honorarios pagados." Se renueva automáticamente con 90 días de notificación requerida. Sin DPA adjunto aunque almacenaremos direcciones de correo electrónico de clientes. ¿Sobre qué debo presionar por cambios?

**Correcciones prioritarias de Claude:**

Tres problemas que deben repararse antes de firmar:

**1. Límite de responsabilidad (ROJO — rechazar como está escrito):**
Actual: 1 mes de honorarios = $7,000 responsabilidad máxima (usted paga $84K/año)
Su solicitud: "Mínimo 12 meses de honorarios pagados en los 12 meses anteriores ($84,000)"
Respaldo: "$6 meses de honorarios ($42,000) con exclusiones ilimitadas para infracción de datos y fraude"
Por qué aceptarán: Esta es una solicitud estándar industrial razonable. Cualquier proveedor respetable se alejará de 1 mes.

**2. Notificación de renovación automática (AMARILLO — negociar):**
Actual: Ventana de notificación de 90 días — fácil de perder, especialmente si la persona que firmó se va
Su solicitud: "60 días o menos"
Respaldo: "90 días es aceptable si el contrato incluye recordatorio escrito del proveedor a 120 días"
Corrección práctica: Establezca un recordatorio de calendario recurrente inmediatamente para [fecha de renovación - 100 días] independientemente de lo que esté en el contrato.

**3. DPA / privacidad de datos (ROJO — requerido, no opcional):**
Actual: Sin DPA adjunto, sin embargo procesará direcciones de correo electrónico de clientes (datos personales)
Su solicitud: "Ejecute el DPA estándar del proveedor antes de la puesta en marcha, como apéndice de este acuerdo"
Por qué no negociable: Si está sujeto a GDPR o CCPA, está legalmente obligado a tener un DPA con cualquier procesador que maneje datos personales. La mayoría de los proveedores tienen un DPA estándar — simplemente pídaselo. Si no tienen uno, eso es una bandera roja sobre sus prácticas de datos.

**Lo que dejar ir:** Créditos SLA, cláusulas de PI (suponiendo sin desarrollo personalizado) y ley aplicable son prioridad más baja en este nivel de gasto.

---
