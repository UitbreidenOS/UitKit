# Flujo de Trabajo de Evaluación de Oportunidades

Un proceso repetible paso a paso para evaluar el flujo de operaciones entrantes — desde el primer vistazo hasta la decisión lista para el comité de inversión — utilizando las habilidades de Claude Code en cada etapa.

---

## Resumen

Este flujo de trabajo cubre un ciclo completo de evaluación de oportunidades: aproximadamente 2-3 semanas desde el primer contacto hasta la decisión del comité de inversión para una operación de semilla/Serie A. Los pasos están diseñados para usarse con habilidades de Claude Code en cada fase. Las estimaciones de tiempo asumen la potenciación con Claude.

**Tiempo total (con Claude):** 8-12 horas a lo largo de 3 semanas para una operación que avanza hasta el comité de inversión
**Tiempo total (sin Claude):** 25-40 horas

---

## Etapa 1: Evaluación inicial (Día 1 — 30-60 minutos)

### Desencadenante
Operación entrante de: contacto directo del fundador, referencia de socio limitado, co-inversor, conferencia, lote de aceleradora, scout.

### Paso 1.1 — Capturar información de la operación

Antes de usar Claude, recopile:
- Nombre de la empresa y URL
- Nombres de los fundadores y perfiles de LinkedIn
- Presentación o resumen ejecutivo (si se proporcionó)
- Breve descripción de lo que hacen
- Etapa y tamaño de la ronda que están captando
- Ingresos o ARR (si se reveló)

### Paso 1.2 — Evaluación rápida

```
/deal-screening

Ejecutar una evaluación inicial rápida de [nombre de la empresa].

Lo que sé:
- Empresa: [nombre], [sitio web]
- Qué hacen: [pegue su descripción]
- Etapa: [pre-semilla / semilla / Serie A]
- Captando: $[X]M a $[X]M pre-dinero (si se reveló)
- Ingresos/ARR: $[X]M (si se reveló)
- Antecedentes del fundador: [breve]

Mi mandato de fondo:
- Etapa objetivo: [semilla / Serie A]
- Sectores objetivo: [lista]
- Tamaño de cheque objetivo: $[X]M–$[X]M
- Enfoque geográfico: [EE. UU. / UE / global]

Opciones de veredicto: PASAR / SOLICITAR PRESENTACIÓN / SOLICITAR REUNIÓN / MARCAR PARA EL SOCIO
```

### Paso 1.3 — Entrada en el registro de operaciones

Si el veredicto es SOLICITAR PRESENTACIÓN o SOLICITAR REUNIÓN, registre en su pipeline:
- Nombre de la empresa, sector, etapa
- Fuente de la introducción
- Notas de la evaluación inicial (2-3 oraciones)
- Próxima acción y responsable
- Fecha del primer contacto

**Resultado de la Etapa 1:** Pasar (registrado como pase con motivo) o avanzar a la Etapa 2.

---

## Etapa 2: Revisión de la presentación y primera reunión (Días 3-7)

### Paso 2.1 — Análisis de la presentación

```
/deal-screening

Analizar esta presentación y extraer las señales de inversión clave.

[Pegue el contenido de la presentación o las diapositivas clave como texto]

Extraer:
1. ¿Qué problema están resolviendo y para quién?
2. ¿Cuál es la solución propuesta y el modelo de negocio?
3. Métricas clave destacadas: [ingresos, crecimiento, clientes, NPS]
4. Afirmación del tamaño del mercado: [TAM/SAM] — ¿parece creíble?
5. Equipo: [quiénes son, qué han hecho antes]
6. Solicitud: $[X]M a $[X]M pre-dinero — ¿razonable para la etapa?

Marcar: Cualquier afirmación que sea inusual, no verificable, o que justifique preguntas específicas en la primera llamada.
```

### Paso 2.2 — Preparación de la primera reunión

```
/deal-screening

Preparar 12 preguntas para una primera llamada con los fundadores de [empresa].

Basándome en la presentación/descripción, quiero entender:
- ¿Es el mercado real y lo suficientemente grande?
- ¿Tienen estos fundadores el derecho a ganar?
- ¿Qué significan realmente los primeros números de tracción?
- ¿Qué suposiciones sobre las que se construye el negocio podrían ser incorrectas?

Priorizar para una llamada de 45 minutos. Las primeras 3 preguntas deben ser sobre los propios fundadores, no sobre el negocio.
```

### Paso 2.3 — Notas de la primera reunión

Durante la llamada, anote:
- Respuestas directas a sus preguntas
- Momentos de vacilación o respuestas vagas (marcar para la diligencia debida)
- Su impresión de los fundadores: claridad, convicción, capacidad de adaptación
- Cualquier cosa que le sorprenda (positiva o negativamente)
- Lo que no dijeron (lagunas)

### Paso 2.4 — Memorando de la operación posterior a la reunión

```
/deal-memo

Escribir un memorando inicial de la operación basado en mis notas de la reunión con el fundador.

Mis notas de la reunión: [pegue las notas]
Mi reacción inicial: [su instinto — qué le entusiasmó, qué le preocupó]

Construir la estructura del memorando de la operación. Marcar todo lo que no pude verificar como [NECESITA COMPROBACIÓN].
Señalar las 5 preguntas más importantes que aún necesito responder antes de poder recomendar la inversión.
```

**Resultado de la Etapa 2:** Pasar (con motivo registrado) o avanzar a la Etapa 3. Compartir con un socio para obtener un sí/no sobre la diligencia debida completa.

---

## Etapa 3: Diligencia debida (Días 7-21)

### Paso 3.1 — Plan de diligencia debida

```
/diligence-review

Construir un plan de diligencia debida para [empresa].

Tesis de inversión: [lo que necesitaríamos creer para invertir]
Riesgos clave identificados en el memorando de la operación: [lista de los 5 principales]
Tiempo disponible: [X días] antes de la fecha límite de decisión

Generar una lista de verificación de diligencia debida priorizada por:
1. Elementos que podrían matar la operación (hacer primero)
2. Elementos que validan la tesis (hacer segundo)
3. Elementos que son convenientes pero no bloqueantes

Asignar: [llamadas a clientes / técnico / financiero / legal / referencias]
```

### Paso 3.2 — Llamadas de referencia a clientes (2-4 llamadas)

```
/diligence-review

Voy a llamar a un cliente de referencia de [empresa] — [nombre del cliente, título, empresa].

Tesis de inversión que estoy probando: [su tesis]
Principales riesgos que intento mitigar: [lista de 3]

Generar 12 preguntas que:
- Sondeen el uso real del producto (no testimoniales)
- Pregunten sobre la alternativa si no tuvieran este producto
- Evalúen qué tan integrado/adherente es el producto
- Comprueben si las afirmaciones de la empresa sobre este cliente son precisas
- Descubran cualquier insatisfacción que no mencionen voluntariamente
```

Después de cada llamada, registre:
- Uso: con qué frecuencia lo utilizan, cuántos usuarios, qué funcionalidades
- Costo de cambio: ¿cancelarían si hubiera un aumento de precio del 20%?
- Comparación con las alternativas que evaluaron
- Cualquier queja o preocupación
- Señal general de NPS: ¿lo recomendarían a un colega?

### Paso 3.3 — Diligencia debida financiera

```
/diligence-review

Recibí datos financieros de [empresa]. Revisar para verificar coherencia y señalar anomalías.

DATOS FINANCIEROS PROPORCIONADOS:
[Pegue el P&L mensual, el calendario de ARR o el resumen financiero]

Verificar:
1. Reconocimiento de ingresos: ¿se calcula el ARR de forma coherente? (sin inflación de MRR → cálculo de ARR)
2. Margen bruto: ¿qué se incluye en el COGS? ¿Se incluyen completamente los costos de hosting?
3. Tasa de consumo: ¿coincide con el movimiento del saldo bancario?
4. Concentración de clientes: ¿qué % del ARR proviene de los 3 principales clientes?
5. Abandono: ¿cómo se calcula el abandono bruto vs. neto?
6. Efectivo: saldo bancario real vs. lo que implican su consumo e historial de captación de fondos

Señalar cualquier métrica que no cuadre. Generar preguntas para hacerle al CFO/fundador.
```

### Paso 3.4 — Comparables y valoración

```
/comps-analysis

Ejecutar un análisis de comparables para establecer el punto de referencia de la valoración de esta operación.

Empresa evaluada: [nombre]
Métricas: ARR $[X]M, [X]% crecimiento, [X]% margen bruto, NRR [X]%
Términos de la operación: captación de $[X]M a $[X]M pre-dinero = múltiplo de [X]x ARR

Encontrar empresas públicas de SaaS comparables y transacciones privadas recientes:
- El mismo sector o adyacente
- Escala de ingresos similar
- Tasa de crecimiento similar

¿A qué múltiplo EV/ARR cotizan los comparables?
¿Qué prima o descuento estaríamos pagando?
¿A qué tasa de crecimiento se justificaría esta valoración?
```

### Paso 3.5 — Diligencia debida técnica (si aplica)

Para herramientas de desarrollo, infraestructura, IA, o cualquier producto donde la arquitectura técnica sea importante:

```
Necesito entender la arquitectura técnica y la defensibilidad de [empresa].

Lo que me han dicho:
- Stack tecnológico: [lo que usan]
- Afirmaciones de IA/ML: [si las hay]
- Infraestructura: [proveedor de nube, auto-alojado, etc.]
- Afirmaciones de foso: [datos propietarios / algoritmos / integraciones]

Generar una lista de preguntas de diligencia debida técnica para una llamada con su CTO que cubra:
1. Decisiones de construir vs. comprar y su justificación
2. Cuánto de la propiedad intelectual central es verdaderamente propia frente a envoltorios
3. Arquitectura de escalabilidad (qué falla a 10x el volumen actual)
4. Postura de seguridad y cualquier historial de brechas
5. Contrataciones técnicas clave y factor de autobús (cuántas personas tienen conocimiento crítico)
```

### Paso 3.6 — Síntesis de la diligencia debida

```
/diligence-review

Sintetizar todos los hallazgos de la diligencia debida de [empresa] en un resumen previo al comité de inversión.

Llamadas a clientes (N=X):
[Resumir temas clave]

Revisión financiera:
[Resumir hallazgos, señales, elementos limpios]

Revisión técnica:
[Resumir si aplica]

Llamadas de referencia:
[Resumir referencias del fundador]

Para cada riesgo original del memorando de la operación:
[Riesgo] | [Estado: Mitigado / Aún abierto / Confirmado como problema]

Actualización de la recomendación: [invertir / pasar / condicional] basado en la diligencia debida. ¿Ha cambiado algo desde el memorando inicial de la operación? ¿Cuáles son los problemas abiertos restantes?
```

**Resultado de la Etapa 3:** Decisión de invertir o pasar. Si se invierte, avanzar a la Etapa 4.

---

## Etapa 4: Preparación del comité de inversión (Días 18-22)

### Paso 4.1 — Memorando para el comité de inversión

```
/ic-memo

Convertir el memorando de la operación y los hallazgos de la diligencia debida en un memorando completo para el comité de inversión de [empresa].

Memorando de la operación: [pegue o resuma]
Resumen de hallazgos de la diligencia debida: [pegue]
Términos propuestos: $[X]M a $[X]M pre-dinero, [X]% de propiedad

Generar las 9 secciones completas. Marcar [VERIFICAR] en cualquier cosa no confirmada en la diligencia debida.
Destacar los elementos abiertos sobre los que el comité de inversión debe decidir si son riesgos aceptables.
```

### Paso 4.2 — Preparación de la reunión del comité de inversión

Prepárese para defender la recomendación:

```
/deal-memo

Voy a presentar [empresa] al comité de inversión. Ayúdame a prepararme para las preguntas difíciles.

Mi recomendación: [invertir / pasar]
Miembros del comité de inversión y sus preocupaciones conocidas: [liste los socios y sus áreas de enfoque habituales]

Generar las 10 preguntas más difíciles que enfrentaré y redactar mis respuestas basándome en lo que sé.
Señalar las 2-3 preguntas donde no tengo una respuesta sólida y necesito prepararme.
```

### Paso 4.3 — Registro de decisiones del comité de inversión

Después del comité de inversión:
- Registrar la decisión: invertir / pasar / más diligencia debida
- Si se invierte: registrar los términos propuestos, el cronograma, quién redacta la hoja de términos
- Si se pasa: registrar el motivo principal (útil para el feedback al fundador y el aprendizaje del fondo)
- Si se necesita más diligencia debida: registrar los elementos abiertos específicos y quién es el responsable de resolverlos

**Resultado de la Etapa 4:** Decisión de inversión con justificación documentada.

---

## Etapa 5: Configuración posterior a la inversión (Semana 4+)

### Paso 5.1 — Configuración del seguimiento de cartera

Una vez que se cierra la inversión:

```
/portfolio-monitor

Configurar un marco de seguimiento para [empresa].

Tesis de inversión: [lo que creíamos]
Hitos clave que esperamos en el Año 1: [lista de 3-5]
KPIs clave a seguir mensualmente: [ARR, consumo, NRR, plantilla, margen bruto]
Calendario del consejo: [mensual / trimestral]

Generar una tarjeta de perfil de empresa para nuestro sistema de seguimiento de cartera.
```

### Paso 5.2 — Primera reunión del consejo

Dentro de los 60 días posteriores al cierre, organice una reunión inaugural del consejo:

```
/portfolio-monitor

Prepararme para la primera reunión del consejo con [empresa].

Cierre reciente: [fecha]
Tesis de inversión: [su tesis]
Prioridades del fundador compartidas en el cierre: [lo que dijeron que quieren enfocar]
Mis prioridades como miembro del consejo: [lo que quiero seguir]

Generar: propuesta de agenda del consejo, estructura inicial del cuadro de mando de KPIs, plan de hitos para los primeros 90 días para revisar con los fundadores.
```

---

## Métricas a seguir (a lo largo de su pipeline de operaciones)

| Métrica | Seguimiento semanal |
|---|---|
| Operaciones evaluadas | Total, desglose por fuente |
| Tasa de pase en cada etapa | Etapa 1 / 2 / 3 / 4 |
| Calidad de la fuente | Qué fuentes de referencia llevan a operaciones en la etapa del comité de inversión |
| Conversión en el comité de inversión | Operaciones presentadas vs. aprobadas |
| Velocidad de la operación | Días desde el primer contacto hasta el comité de inversión |
| Perspectivas de las llamadas de referencia | % de operaciones donde las llamadas a clientes cambiaron su opinión |

---
