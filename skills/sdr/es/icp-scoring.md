# Puntuación de ICP

## Cuándo activar

Estás haciendo prospección en empresas B2B SaaS y necesitas calificar leads contra un perfil de cliente ideal (ICP) definido. Activa esto cuando: estés puntuando un nuevo lead para nivel de alcance, priorizando una lista de prospectos, decidiendo profundidad de contacto para una empresa, o validando ajuste antes de transferencia a ventas.

## Cuándo NO usar

- Ya tienes un lead dentro de un flujo de éxito de cliente/retención — usa marcos de prevención de pérdida en su lugar.
- El prospecto ya es cliente u oportunidad activa en tu CRM — esto es solo para prospección nueva.
- Estás haciendo sourcing de generación de leads (encontrando *qué* empresas prospectar) — esto es para *calificar* empresas que ya has identificado.
- La empresa objetivo tiene menos de 10 empleados o está en una vertical de descalificación severa — la puntuación no tiene sentido; marca como no-contactar.

## Instrucciones

### Definición de ICP de 3 Capas

Cada ICP se define en tres dimensiones ortogonales. Puntúa cada una de forma independiente, luego combina.

**Capa 1: Ajuste Firmográfico (0–40 puntos)**

Atributos objetivos de la empresa que determinan la capacidad estructural de compra.

| Atributo | Objetivo | Puntos |
|---|---|---|
| **Vertical industrial** | Primaria (ej., SaaS, FinTech, Healthcare Tech) | 20 |
| Ajuste secundario (adyacente, caso de uso probado) | 10 |
| Vertical incorrecta (descalificador) | 0 |
| **Número de empleados** | 50–500 | 15 |
| 25–49 o 501–1.000 | 8 |
| 10–24 o 1.001+ | 2 |
| Menos de 10 | 0 (descalificador severo) |
| **Ingresos Recurrentes Anuales (ARR)** | $5M–$100M | 5 |
| $2M–$4,9M o $100M–$500M | 3 |
| Menos de $2M o más de $500M | 0 |
| **Geografía** | US, UK, Canadá, Europa Occidental (primaria) | Incluido arriba; mercados secundarios puntúan al 80% |

*Techo firmográfico: 40 puntos. Una empresa perfecta en todos los atributos puntúa 40.*

**Capa 2: Ajuste Tecnográfico (0–30 puntos)**

Señales de stack tecnológico e infraestructura que indican ajuste de producto o descalificación.

Puntúa según *presencia* de señales (no ausencia). Verifica: stacks tecnológicos públicos (StackShare, LinkedIn, publicaciones de empleo, decks de financiación), repos públicos de GitHub, publicaciones de empleo para roles técnicos, anuncios de fundación/financiación.

| Tipo de Señal | Ejemplos | Puntos |
|---|---|---|
| **Ajuste central** (tu solución se conecta directamente a su stack) | Usando Node.js, PostgreSQL, Kubernetes; contratando "DevOps Engineer"; discutiendo públicamente microservicios | 15 |
| **Ajuste secundario** (adyacencia fuerte) | Infraestructura en la nube (AWS, GCP, Azure); menciones de CI/CD; inversiones en pipelines de datos | 10 |
| **Señal débil** (tech moderno general, no específico para tu ICP) | Stack SaaS estándar (React, Python, AWS típico); sin señales rojas pero tampoco ajuste fuerte | 5 |
| **Descalificador severo** | Atrapado en stack de tecnología competidor; solo mainframe legacy; usando vendor completamente incompatible | 0 |

*Selecciona la categoría de señal con puntuación más alta encontrada. Techo tecnográfico: 30 puntos.*

**Capa 3: Señales de Comportamiento (0–20 puntos)**

Señales recientes de momento y crecimiento que indican intención de compra y asignación de presupuesto.

| Señal | Recencia | Puntos |
|---|---|---|
| **Ronda de financiación** (Series A o posterior, no seed) | Últimos 12 meses | 8 |
| 13–24 meses atrás | 5 |
| Más de 24 meses | 2 |
| **Ola de contratación** (5+ posiciones publicadas en tu departamento objetivo: ingeniería, datos, producto) | Últimos 30 días | 8 |
| 31–90 días atrás | 5 |
| Más de 90 días | 2 |
| **Señales de expansión** (nueva oficina, lanzamiento de producto, entrada a nuevo mercado, nuevo ecosistema de integración) | Últimos 90 días | 4 |

*Techo de comportamiento: 20 puntos. Múltiples señales son aditivas hasta 20.*

### Decaimiento por Recencia (0–10 puntos bonus/penalización)

Todos los datos firmográficos se vuelven obsoletos. Ajusta la puntuación final según la frescura de los datos.

| Frescura de datos | Ajuste |
|---|---|
| Todos los atributos de ICP verificados en últimos 30 días | +10 |
| Verificados 31–90 días atrás | +5 |
| Verificados 91–180 días atrás | 0 |
| Más de 180 días (sin verificación reciente) | –5 |

*Ejemplo: Un lead de 75 puntos con datos de tamaño de empresa de 6 meses se convierte en 70 puntos.*

### Modelo de Puntuación Completo: 0–100

**Fórmula:**
```
SCORE = Firmográfico (0–40) + Tecnográfico (0–30) + Comportamiento (0–20) + Recencia (–5 a +10)
RANGO: 0–100
```

### Descalificadores Severos (Puntuación = 0, omite todos los niveles)

Incluso si otras dimensiones puntúan alto, marca el lead **no-contactar** si alguno aplica:

1. **Competidor** — Construyen/venden un producto competidor.
2. **Cliente existente** — Ya en tu base de clientes o trial activo.
3. **Vertical industrial incorrecta** — Fuera de tus verticales primarias/secundarias definidas (ej., contratista gubernamental cuando diriges SaaS).
4. **Número de empleados bajo 10** — Demasiado pequeño para tener proceso de compra o presupuesto.
5. **Señales de descalificación explícita** — Declaraciones públicas contra tu categoría; usando vendor incompatible exclusivamente; anuncios de bancarrota/despidos que indican congelamiento de presupuesto.

### Definiciones de Nivel y Libros de Jugadas de Alcance

Después de puntuar (y confirmar sin descalificadores severos), enruta al nivel de alcance:

#### Nivel 1 (80–100 puntos)
**Características:** Ajuste perfecto o casi perfecto. Coincidencia de ICP en 2+ dimensiones. Señales recientes.

**Libro de jugadas de alcance:**
- Investigación profunda manual: Lee últimas 3 llamadas de ganancias (si es pública), publicaciones recientes de blog, Twitter del CEO, publicaciones de contratación en LinkedIn, anuncio de financiación reciente.
- Identifica 2–3 hooks específicos y personalizados (ej., "Noté que publicaste 7 roles de ingeniería el mes pasado; ayudamos a equipos como el tuyo a reducir tiempo de incorporación en 40%").
- Secuencia de email personalizado: 5 toques, cadencia de 21 días. Hook personalizado en email 1. Referencia hito específico de empresa en email 3. Toque social (comentario en LinkedIn en publicación reciente) como toque 4.
- Participación de ventas: Asigna a ejecutivo de cuenta nombrado. Usa libro de jugadas completo de desarrollo de ventas.

**Punto de referencia de tasa de respuesta:** 8–12% tasa de respuesta (con personalización).

#### Nivel 2 (50–79 puntos)
**Características:** Ajuste fuerte en 1 dimensión, ajuste adecuado en otras. Coincidencia clara de ICP pero puede carecer de momento reciente.

**Libro de jugadas de alcance:**
- Email de plantilla con 1 hook de personalización (ej., "Tu equipo contrató 6 ingenieros el trimestre pasado; ayudamos a equipos como [empresa similar] a reducir [resultado]").
- Secuencia estándar de 3 toques en 14 días: Email → espera 5 días → mensaje LinkedIn → espera 3 días → email final.
- Sin investigación profunda manual; usa solo señales públicas (LinkedIn, StackShare, anuncios de financiación).
- Participación ligera de ventas: Solo SDR, sin asignación de AE.

**Punto de referencia de tasa de respuesta:** 4–6% tasa de respuesta.

#### Nivel 3 (20–49 puntos)
**Características:** Ajuste parcial. Coincide con ICP en una dimensión solo, o señales débiles en múltiples dimensiones.

**Libro de jugadas de alcance:**
- Email de plantilla (sin personalización). Toque único solamente.
- Batch-and-blast: Envía en campañas en masa. Sin secuencia de seguimiento.
- Usa para construcción de lista y conciencia de marca, no ventas directas.
- Sin participación de ventas.

**Punto de referencia de tasa de respuesta:** 1–2% tasa de respuesta (espera bajo compromiso).

#### Menos de 20 puntos
**Acción:** No contactar. Mueve a segmento "nutrición" para campañas futuras solamente. Re-puntúa trimestralmente.

---

### Plantilla de Prompt de Puntuación

Usa esta estructura de prompt para puntuar un lead con Claude:

```
Puntúa esta empresa contra nuestro ICP usando el modelo 0–100 adjunto.

EMPRESA: [Nombre de empresa]
INDUSTRIA: [Industria]
NÚMERO DE EMPLEADOS: [Número] (fuente: [LinkedIn/PitchBook/etc])
ARR: [Estimado o público $] (fuente: [cómo lo sabes])
GEOGRAFÍA: [País/región]

SEÑALES DE STACK TECNOLÓGICO:
- [Herramienta/plataforma 1] (fuente: [publicación de empleo/StackShare/GitHub])
- [Herramienta/plataforma 2]
- [Herramienta/plataforma 3]

SEÑALES DE COMPORTAMIENTO:
- Financiación: [Series X, $Y, fecha] (fuente: [Crunchbase/comunicado de prensa])
- Contratación: [Número de posiciones abiertas en departamento objetivo, fechas publicadas] (fuente: [empleos LinkedIn])
- Expansión: [Nuevo mercado/oficina/lanzamiento de producto] (fuente: [anuncio])

FRESCURA DE DATOS: Todos los datos verificados [rango de fechas]

TAREA:
1. Puntúa cada dimensión de forma independiente (Firmográfico, Tecnográfico, Comportamiento, Recencia).
2. Identifica cualquier descalificador severo.
3. Retorna: PUNTUACIÓN TOTAL, NIVEL, RECOMENDACIÓN (profundidad de contacto + tipo de secuencia).
4. Lista los 2 hooks de personalización principales (si Nivel 1 o 2).

Formatea respuesta como:
---
**PUNTUACIÓN: [0-100]**
**NIVEL: [1/2/3/No Contactar]**
**DESCALIFICADORES:** [Ninguno / Lista cualquiera encontrado]
**FIRMOGRÁFICO:** [X puntos] — [razonamiento]
**TECNOGRÁFICO:** [X puntos] — [razonamiento]
**COMPORTAMIENTO:** [X puntos] — [razonamiento]
**AJUSTE DE RECENCIA:** [+/- X puntos]

**HOOKS DE PERSONALIZACIÓN PRINCIPALES:**
1. [Hook 1 — específico, limitado en tiempo]
2. [Hook 2 — específico, limitado en tiempo]

**RECOMENDACIÓN:** [Libro de jugadas de alcance y próximo paso]
---
```

---

## Ejemplo

### Escenario: Puntúa TechVentures Inc. (Hipotético FinTech SaaS)

**Datos crudos recopilados:**

| Atributo | Valor | Fuente |
|---|---|---|
| Empresa | TechVentures Inc. | Crunchbase |
| Industria | FinTech (procesamiento de pagos) | Sitio web, LinkedIn |
| Número de empleados | 180 | Página de Empresa LinkedIn (actualizado hace 2 semanas) |
| ARR | $18M | Financiación Crunchbase + cálculo de burn |
| Geografía | San Francisco, CA (US) | Sitio web de empresa |
| Stack tecnológico | Python, PostgreSQL, AWS, Kubernetes, microservicios Node.js | Publicaciones de empleo (ago 2026), repos públicos de GitHub |
| Financiación | Series B, $45M, levantados mar 2026 | Crunchbase, TechCrunch |
| Contratación | 12 roles de Ingeniería abiertos (publicados últimos 30 días) | Página de empleos LinkedIn |
| Expansión | Anunció expansión a UK (jul 2025) | Blog de empresa |
| Datos verificados | jun 2026 | Esta sesión de puntuación |

### Puntuación:

**FIRMOGRÁFICO (40 máx):**
- Ajuste industrial (vertical FinTech primaria): 20 puntos
- Número de empleados (180, en rango 50–500): 15 puntos
- ARR ($18M, en rango $5M–$100M): 5 puntos
- **Subtotal: 40 puntos** ✓

**TECNOGRÁFICO (30 máx):**
- Ajuste central: PostgreSQL + microservicios Python en AWS/Kubernetes coincide con infraestructura SaaS moderna (15 puntos).
- Sin señales descalificadoras.
- **Subtotal: 15 puntos** ✓

**COMPORTAMIENTO (20 máx):**
- Financiación (Series B, $45M, mar 2026 = 3 meses atrás): 8 puntos
- Ola de contratación (12 roles de Ingeniería, publicados <30 días): 8 puntos
- Expansión (oficina UK anunciada, pero 11+ meses atrás): 2 puntos
- **Subtotal: 18 puntos** ✓

**RECENCIA (±10):**
- Todos los datos verificados en últimos 30 días: +10 puntos

---

### PUNTUACIÓN FINAL: 40 + 15 + 18 + 10 = **83 puntos**

### NIVEL: **Nivel 1 (80–100)**

### DESCALIFICADORES: Ninguno

### RECOMENDACIÓN:

**Libro de Jugadas de Alcance — Nivel 1:**

**Hooks de Personalización:**
1. "Levantaste $45M en Series B (mar 2026) y estás contratando agresivamente (12 roles de ingeniería abiertos). Ayudamos a plataformas FinTech que escalan en AWS/Kubernetes a reducir complejidad de infraestructura en 35%—directamente relevante conforme te expandes a UK y añades personal."
2. "Construiste en PostgreSQL + microservicios, que es exactamente donde [nuestra solución] proporciona el mayor valor. Equipos como Stripe y Wise nos usan para acelerar ciclos de despliegue cuando escalan entre regiones."

**Secuencia de email (5 toques, 21 días):**
- **Día 1:** Email personalizado. Asunto: "[Nombre CTO], trayectoria de crecimiento de TechVentures + stack de microservicios." Incluye llamada de anuncio de financiación + 1 hook de personalización.
- **Día 6:** Email de seguimiento. "¿Mi email anterior sobre desafíos de expansión a UK llegó?"
- **Día 10:** Mensaje LinkedIn para CTO/VP de Ingeniería (ángulo de mensajería diferente).
- **Día 14:** Toque de valor agregado: Comparte caso de estudio relevante (empresa FinTech, ARR similar, escenario de escalado).
- **Día 21:** Email de ruptura final. "Última oportunidad: Hablemos sobre tus objetivos de infraestructura Q3."

**Participación de ventas:** Asigna a AE nombrado. Objetivo de llamada de descubrimiento de 30 min.

**Resultado esperado:** 8–12% tasa de respuesta. Objetivo para calificación de ventas inmediata.

---

**Fin del ejemplo de puntuación. TechVentures Inc. es verde para alcance a intensidad Nivel 1.**
