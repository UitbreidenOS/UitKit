# Generador de Secuencias SDR

## Cuándo ejecutar

Este flujo de trabajo se activa cuando estás lanzando una nueva secuencia de outbound dirigida a un segmento de cuenta específico. Los activadores incluyen:
- El ciclo de planificación trimestral requiere un nuevo enfoque de segmento
- El lanzamiento de producto requiere actividades de outbound dirigidas a nuevas personas compradoras
- La estrategia de expansión vertical necesita secuencias específicas por segmento
- El análisis de ganancias y pérdidas identifica una señal repetible que deseas orientar

## Entradas requeridas

Antes de comenzar, reúne:
1. **Definición del ICP** — tamaño de la empresa, industria, rango de ingresos, pila tecnológica
2. **Tipo de señal** — basada en desencadenantes (financiación, cambio de trabajo, adopción de tecnología) u outbound estática (expansión dentro del segmento existente)
3. **Nivel de cuenta** — qué nivel(es) estás orientando (Nivel 1 = $10M+, Nivel 2 = $1-10M, Nivel 3 = <$1M, o tu propia escala)
4. **Objetivo de antigüedad** — Nivel VP, C-suite, Director, Gerente
5. **Lista de cuentas o fuente de datos** — CSV, resultado de consulta de Salesforce o exportación de Apollo/Hunter (N cuentas, típicamente 50-500)
6. **Opciones de marco de mensajería** — selecciona entre: Short Trigger, Do the Math, Founder's Story, Compliance + ROI, Community Proof, Feature Parity, DM Social, o personalizado

## Pasos

### Paso 1 — Definir Segmento Objetivo (15 min)

**Acción de Claude:**
Pide a Claude que refine tu definición de segmento. Proporciona:
- Definición del ICP (o un bosquejo aproximado)
- Tipo de señal (desencadenante o estática)
- Nivel(es) de cuenta
- Objetivo de antigüedad

**Indicación de Claude:**
"Ayúdame a definir el segmento para esta secuencia. ICP: [X]. Señal: [Y]. Nivel de cuenta: [Z]. Antigüedad: [W]. ¿Qué filtros demográficos y tecnográficos debo usar para reducir esta lista? ¿Debería excluir algún tipo de empresa, región o industria?"

**Salida de Claude:**
- Criterios de segmento refinados (5-10 filtros específicos)
- Justificación para cada filtro
- Tamaño estimado del mercado direccionable
- Marcar cualquier preocupación sobre la calidad de los datos

**Punto de decisión:**
¿El segmento se siente accionable (500-2000 cuentas) o demasiado estrecho (<100) o demasiado amplio (>5000)?

---

### Paso 2 — Construir y Puntuar Lista de Cuentas (30 min)

**Tu acción:**
Exporta tu lista de cuentas de tu fuente de datos. Asegúrate de que incluya:
- Nombre de la empresa, dominio, tamaño de la empresa, financiación, pila tecnológica (si está disponible)
- Nombres de contactos, títulos, correos electrónicos de 2-4 tomadores de decisiones por cuenta
- Cualquier señal reciente (cambio de trabajo, evento de financiación, adopción de tecnología) con fechas

**Acción de Claude:**
Puntúa y categoriza las cuentas. Proporciona la lista a Claude.

**Indicación de Claude:**
"Puntúa estas [N] cuentas contra el ICP. Categorízalas 1/2/3 según el ajuste. Marca cuáles tienen señales en los últimos 14 días. Para las 20 cuentas de Nivel 1 con mayor puntuación, enumera la(s) señal(es) y fechas. Salida como CSV: Cuenta | Nivel | Puntuación | Señal | Fecha de Señal."

**Salida de Claude:**
- Lista de cuentas puntuadas (clasificada por nivel y puntuación de ajuste)
- 20 cuentas cálidas (Nivel 1 + señal reciente)
- 20 cuentas frías (Nivel 1, sin señal, pero con fuerte ajuste de ICP)
- Banderas rojas (empresas a deprioritizar o evitar)

**Punto de decisión:**
¿Tienes al menos 15 cuentas de Nivel 1 para orientar? Si no, expande el segmento o reduce el umbral de nivel.

---

### Paso 3 — Seleccionar Marco de Mensajería (10 min)

**Acción de Claude:**
Recomienda el mejor marco de mensajería para tu segmento.

**Indicación de Claude:**
"Dado este segmento: cuentas de Nivel 1, [objetivo de antigüedad], [tipo de señal], en [industria/caso de uso], ¿cuál de estos 8 marcos se ajusta mejor y por qué? Marcos: (1) Short Trigger, (2) Do the Math, (3) Founder's Story, (4) Compliance + ROI, (5) Community Proof, (6) Feature Parity, (7) DM Social, (8) Personalizado. Justifica tu elección con 2-3 razones."

**Salida de Claude:**
- Marco recomendado con justificación
- Ganchos clave y puntos de dolor a enfatizar
- 3 líneas de apertura de ejemplo únicas para este marco
- Marco alternativo si el principal no resuena

**Punto de decisión:**
¿El marco se alinea con tu libreto de ventas y la mensajería de tu equipo? Si no, sugiere un marco diferente.

---

### Paso 4 — Escribir la Secuencia (45 min)

**Acción de Claude:**
Genera la secuencia de 4 correos para 3-5 cuentas de ejemplo.

**Indicación de Claude:**
"Escribe la secuencia de 4 correos para estas 3 cuentas de ejemplo usando el marco [Marco]. Detalles: Título objetivo [X], nivel de empresa [Y], señal: [Z]. Correo 1: gancho + referencia de señal específica, menos de 100 palabras. Correo 2: punto de dolor + KPI relevante, 120-150 palabras. Correo 3: delegación/prueba social + solicitud suave, 100-140 palabras. Correo 4: ruptura + recordatorio de valor, 80-100 palabras. Incluye líneas de asunto. Para cada correo, muestra 2 variaciones (Versión A y B) para que pueda hacer pruebas A/B."

**Salida de Claude:**
Para cada una de las 3 cuentas:
- Correo 1 (2 versiones): Gancho + Señal
- Correo 2 (2 versiones): Dolor + KPI
- Correo 3 (2 versiones): Delegación + Solicitud
- Correo 4 (2 versiones): Ruptura
- Cadencia de envío recomendada (días entre cada correo)

**Punto de decisión:**
¿Los 4 correos se sienten personalizados y creíbles para tu equipo? ¿Evitan el discurso de producto en el Correo 1?

---

### Paso 5 — Verificación de QA (15 min)

**Acción de Claude:**
Revisión de QA contra la lista de verificación de calidad de 5 puntos.

**Indicación de Claude:**
"QA estos 12 correos contra las reglas de mensajería. Para cada correo, verifica: (1) ¿Bajo el límite de palabras (Correo 1: <100p, Correo 2: <150p, Correo 3: <140p, Correo 4: <100p)? (2) ¿Personalización específica (menciona señal, empresa o caso de uso, no genérico)? (3) ¿El Correo 1 no tiene discurso de producto? (4) ¿CTA claro (solicitud específica, no 'hablemos')? (5) ¿Sin palabras de spam? Marca violaciones. Sugiere 1 corrección por problema."

**Salida de Claude:**
- Aprobación/rechazo de QA para cada correo
- Violaciones marcadas con correcciones específicas
- Correos revisados (si es necesario)
- Aprobación para proceder a la carga del CRM

**Punto de decisión:**
¿Los 4 correos están aprobados? Si no, revisa y re-QA.

---

### Paso 6 — Carga del CRM y Configuración de Secuencia (20 min)

**Tu acción:**
1. Etiqueta todos los contactos en tu lista objetivo con: `[Nombre de Secuencia] - Activo` y etiquetas de nivel de cuenta
2. Inicia sesión en tu herramienta de outreach (Salesforce/Outreach/Instantly/etc.)
3. Crea la secuencia con fechas de inicio escalonadas
4. Configura la cadencia de envío:
   - Correo 1: Día 0 (inmediato, 9 AM en la zona horaria del destinatario)
   - Correo 2: Día 2 (48 horas después, 10 AM)
   - Correo 3: Día 5 (3 días después del Correo 2, 2 PM)
   - Correo 4: Día 9 (4 días después del Correo 3, 11 AM)
5. Nunca hagas un envío masivo de todos los contactos el mismo día — escalonados durante 5 días
6. Configura el seguimiento de respuestas y la parada automática en respuesta positiva

**Acción de Claude:**
Asiste con la lógica de secuencia si es necesario.

**Indicación de Claude:**
"Ayúdame a configurar esta secuencia en [nombre de herramienta]. Quiero escalonar 250 cuentas durante 5 días, 50 por día. ¿Debo aleatorizar dentro de cada día o usar una hora fija? ¿Cuál es la mejor lógica de parada automática: respuesta recibida, reunión de calendario reservada, o ambas?"

**Salida de Claude:**
- Lista de verificación de configuración
- Estrategia de escalonamiento recomendada
- Condiciones de parada automática

**Punto de decisión:**
¿La secuencia está activa y los contactos fluyen? Verifica 2-3 contactos que recibieron el Correo 1 antes de proceder.

---

### Paso 7 — Puerta de Revisión de Desempeño (después de 7 días)

**Acción de Claude:**
Analiza métricas de 7 días y recomienda optimizaciones.

**Indicación de Claude:**
"Aquí están las métricas para esta secuencia después de 7 días: Tasa de Apertura [X]%, Tasa de Respuesta [Y]%, Tasa de Clics [Z]%, Tasa de Desuscripción [W]%. Comparación: El promedio de la empresa es [A]% de apertura, [B]% de respuesta. Calidad de señal (Nivel 1 vs Nivel 2): [desglose]. Rendimiento del marco: [marco] vs [alternativo]. ¿Qué deberíamos cambiar y por qué? Prioriza los 3 principales ajustes."

**Salida de Claude:**
- Comparación de referencia (vs tu línea de base)
- Análisis de causa raíz (mensaje, calidad de lista, tiempo o segmentación)
- Principales 3 recomendaciones de optimización:
  1. Ajuste de copia de correo (línea o gancho específico)
  2. Ajuste de tiempo o cadencia
  3. Refinamiento de segmentación o lista
- Decisión: ¿Continuar tal como está, pausar + revisar, o expandir a nuevo segmento?

**Punto de decisión:**
¿El desempeño justifica escalar a más cuentas? Si las métricas son débiles, implementa los ajustes recomendados por Claude y re-prueba en un microsegmento nuevo antes del lanzamiento amplio.

---

## Salida

Una secuencia de outbound lista para producción que consta de:
1. **Documento de definición de segmento** — filtros de ICP, desglose de nivel, mercado direccionable
2. **Lista de cuentas puntuadas** — 250-500 cuentas clasificadas por ajuste y recencia de señal
3. **Secuencia de 4 correos (8 variaciones)** — 2 versiones A/B por correo, 4 cadencias de envío, marco de mensajería claramente indicado
4. **Informe de QA** — Todos los correos aprueban la lista de verificación de calidad, sin banderas de spam, personalización confirmada
5. **Configuración de secuencia** — Activa en herramienta de CRM/outreach, escalonada durante 5 días, reglas de parada automática configuradas
6. **Instantánea de desempeño de 7 días** — Métricas, referencias y principales 3 recomendaciones de optimización

---

## Ejemplo

**Escenario:** Eres un Account Executive en una empresa B2B SaaS que vende infraestructura de datos. Quieres orientar a empresas de mercado medio (Nivel 1: $10-50M) en FinTech que recientemente adoptaron una herramienta de datos competidora.

### Paso 1 — Definir Segmento
- **ICP:** FinTech, $10-50M ARR, fundada 2015+, co-fundador técnico aún en la empresa
- **Señal:** Instaló Databricks o Snowflake en los últimos 30 días (basado en desencadenante)
- **Antigüedad:** VP Ingeniería, VP Datos
- **Salida de Claude:** "Agrega filtro: Debe tener 50+ empleados de ingeniería. Excluye operadores puros (no son propietarios de infraestructura). Orienta 8 metrópolis clave: NYC, SF, LA, Boston, Austin, Chicago, Londres, Singapur."

### Paso 2 — Construir y Puntuar
- **Entradas:** 300 empresas de FinTech de G2/Crunchbase + datos de instalación de Salesforce
- **Salida de Claude:**
  - 45 cuentas de Nivel 1 (fuerte ICP, $20-50M, >50 ingenieros)
  - 15 de esas 45 con señal de Snowflake/Databricks en los últimos 14 días (cálidas)
  - 30 sin señal pero con fuerte ajuste de ICP (frías)

### Paso 3 — Seleccionar Marco
- **Segmento:** Nivel 1, VP Ingeniería, basado en desencadenante (instalación reciente de Databricks)
- **Recomendación de Claude:** "**Do the Math** — mejor ajuste. Estos VPs están evaluando costos de infraestructura. Engáncha en la brecha de ROI entre Databricks + tu herramienta vs. pilas heredadas. Abre con el desencadenante (vemos que instalaste Databricks) + valor inmediato (30% menos costos de computación)."

### Paso 4 — Escribir Secuencia
**Cuenta de ejemplo:** Prism Analytics, NYC, VP Ing. llamada Sarah Chen, instaló Databricks hace 8 días.

**Correo 1 (Gancho + Señal):**
> Asunto: Una cosa que le falta a la instalación de Databricks en Prism
> 
> Sarah,
> 
> Vi que tu equipo implementó Databricks la semana pasada. Un movimiento inteligente—las consultas son 10x más rápidas listas para usar.
> 
> Aquí está lo que generalmente vemos después: los costos de infraestructura se disparan cuando el volumen de consultas escala. ¿Curioso si eso está en tu hoja de ruta para resolver?
> 
> ¿Vale la pena una llamada de 10 minutos?
> 
> [Nombre]

**Correo 2 (Dolor + KPI):**
> Asunto: Re: Una cosa que le falta a la instalación de Databricks...
> 
> Sarah,
> 
> Los equipos de datos que ejecutan Databricks típicamente golpean una pared de costos en ~3M consultas diarias. A esa escala, las facturas de computación a menudo se duplican trimestre tras trimestre.
> 
> La mayoría de los equipos con los que hablamos no estaban preparados para eso. Pocos tienen una estrategia de gobernanza de costos construida desde el primer día.
> 
> Esto es algo que hemos resuelto para equipos como Ramp y Stripe—ambos redujeron sus costos de Databricks 35% en Q1 sin perder velocidad de consulta.
> 
> Si la optimización de costos está en tu hoja de ruta, feliz de caminar por lo que se veía para ellos.
> 
> [Nombre]

**Correo 3 (Delegación + Solicitud):**
> Asunto: Vi a tu VP de Datos en LinkedIn—pensé que esto le importaría
> 
> Sarah,
> 
> Acabo de publicar un documento de 1 página sobre "Patrones de Costo de Databricks a Escala" basado en 200+ implementaciones. Tu VP de Datos podría encontrarlo útil para la planificación.
> 
> Lo enviaré si es útil.
> 
> [Nombre]

**Correo 4 (Ruptura):**
> Asunto: Última nota—Oportunidad de Databricks de Prism
> 
> Sarah,
> 
> Me retiraré, pero un último recurso: nuestra calculadora de ROI muestra que empresas similares a Prism ahorran ~$2.1M anuales con controles de costos inteligentes.
> 
> Si eso cambia tu forma de pensar, estoy aquí.
> 
> [Nombre]

### Paso 5 — Verificación de QA
- **Correo 1:** ✓ 47 palabras, ✓ señal específica (implementó Databricks la semana pasada), ✓ sin discurso de producto, ✓ CTA claro (llamada de 10 minutos), ✓ sin palabras de spam. **APROBADO**
- **Correo 2:** ✓ 91 palabras, ✓ KPI específico (3M consultas, ahorros del 35%), ✓ prueba social (Ramp, Stripe), ✓ solicitud clara, ✓ sin spam. **APROBADO**
- **Correo 3:** ✓ 43 palabras, ✓ delegación personalizada, ✓ CTA claro, ✓ sin spam. **APROBADO**
- **Correo 4:** ✓ 44 palabras, ✓ la referencia de calculadora agrega valor no discurso, ✓ ruptura limpia, ✓ puerta abierta. **APROBADO**

### Paso 6 — Carga del CRM
- Etiquetadas 45 cuentas de Nivel 1 de FinTech: `Databricks-Sequence-2024Q2`, `Tier1`, `VP-Eng`
- Secuencia creada en Outreach
- Cadencia: Correo 1 (Día 0, 9 AM PT), Correo 2 (Día 2, 10 AM PT), Correo 3 (Día 5, 2 PM PT), Correo 4 (Día 9, 11 AM PT)
- Escalonadas 45 contactos durante 5 días: 9 por día, aleatorizadas dentro de cada día
- Parada automática: Respuesta recibida o reunión de calendario reservada

### Paso 7 — Desempeño (instantánea de 7 días)
- **Métricas:** Tasa de apertura 34%, Tasa de respuesta 8.2%, Desuscripción 1.1%
- **Referencia:** Promedio de empresa 28% de apertura, 6% de respuesta
- **Nivel 1 vs Nivel 2:** Cuentas de Nivel 1: 41% de apertura, 12% de respuesta (señal = calidad)
- **Recomendación de Claude:** "Estás superando referencias. 12% de respuesta en Nivel 1 cálido es excelente. Expande esto a las 30 cuentas de Nivel 1 frías (sin señal reciente) y haz pruebas A/B del gancho—prueba 'Ayudamos a [competidor] a reducir costos de Databricks' vs. versión actual 'una cosa que falta' en los próximos 50 cuentas."
- **Decisión:** Escala al cohorte de Nivel 1 frío y prueba variación de gancho.

---

**Creado:** 2026-06-02
**Última actualización:** 2026-06-02
