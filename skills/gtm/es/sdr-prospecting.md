# Prospección SDR

## Cuándo activar
- Construir una lista de cuentas completamente nueva desde cero (campañas de prospección trimestral, penetración de mercado)
- Investigación previa a una llamada de descubrimiento programada
- Planificar un sprint de prospección (activación de cadencia semanal, llenar pipeline)
- Escalar movimiento de outbound en múltiples personas de comprador
- Refrescar listas de cuentas estancadas para exponer nuevas señales

## Cuándo NO usar
- Cerrar acuerdos — esto es solo investigación de cuentas y secuencias de inicio de funnel
- Manejar leads inbound — la calificación de inbound sigue una lógica diferente
- Flujos de éxito del cliente — la gestión de cuentas post-venta es separada
- Sourcing de candidatos — esto no es reclutamiento
- Outreach oportunista aislado — usa esto solo para campañas sistemáticas

## Instrucciones

### Fase 1: Definición de ICP y Filtrado Firmográfico

Comienza aguas arriba. Tu lista es solo tan buena como tu ICP.

**Capa Firmográfica (No Negociable):**
- **Vertical industrial:** Mapea a códigos NAICS/SIC. Si vendes a "equipos de software SMB", eso es demasiado amplio. Sé específico: "empresas SaaS Series A/B en MarTech, PipeTech o Automatización de Ventas."
- **Rango de empleados:** Define con precisión. Ejemplo: 20–150 empleados (product-market fit temprano, todavía improvisados en ops). Usa las bandas de headcount de LinkedIn como filtro principal.
- **Rango de ARR:** Si vendes upmarket, establece piso (mínimo $1M ARR). Si downmarket, establece techo ($10M ARR). Mezclar rompe tu modelo.
- **Stack tecnológico:** Lista tus herramientas punto de mira (Salesforce + Marketo + Workato) o evita listas (empresas en solución incumbente = intención más baja). Usa filtros de Apollo, Clay o BuiltWith aquí.
- **Geografía:** Predeterminado a mercados de habla inglesa (US, UK, Canada, Australia) a menos que tu GTM sea global. Afina por zona horaria para coincidir con tus ops de ventas.

**Salida de Fase 1:** Una lista de semillas de prospectos, no puntuada aún, típicamente 500–5k cuentas dependiendo del tamaño del mercado.

### Fase 2: Puntuación de Ajuste — Proxies de Crecimiento y Dolor

No todos los ICPs están igualmente listos para comprar. Superpón señales que predigan disponibilidad de compra.

**Indicadores de Crecimiento (Intención de Expansión):**
- Ronda de financiación anunciada (<6 meses) — fuertes señales de contratación + gasto
- Crecimiento de headcount >20% AoY — fricción operativa aumenta
- Lanzamientos de productos o lanzamientos de características principales — nuevo movimiento GTM = disponibilidad de presupuesto
- Expansión a nuevas geografías/verticales — inversión en infraestructura en curso
- Publicaciones de empleo en roles clave (Sales Ops, Marketing Ops, Revenue Ops) — área de dolor explícita

**Proxies de Dolor (Señales de Fricción):**
- Fragmentación de stack tecnológico — 8+ soluciones puntuales en una categoría que podrían consolidarse en tu plataforma
- Herramienta recientemente cancelada o consolidación de proveedor — presupuesto ya asignado, ahora disponible
- Cambios ejecutivos en la organización del comprador — nuevos líderes a menudo mandatan actualización de herramientas
- Cambios regulatorios que afectan su industria — gasto de cumplimiento = ventana de presupuesto abierto
- Ganancias de competidores en su espacio — están evaluando cómo responder

**Fórmula de Puntuación (Simple):**
- Señales de crecimiento: +1 punto cada una (máx +5)
- Proxies de dolor: +1 punto cada uno (máx +5)
- Prospectos Tier 1: 7–10 puntos (profundidad de investigación: 20 min)
- Prospectos Tier 2: 5–6 puntos (profundidad de investigación: 10 min)
- Prospectos Tier 3: 1–4 puntos (profundidad de investigación: 5 min + 1 punto de personalización)

**Salida de Fase 2:** Una lista clasificada con puntuaciones. Ahora sabes dónde invertir tiempo de investigación.

### Fase 3: La Regla de 3 Contactos — Multi-Threading a Nivel de Cuenta

Nunca secuencies un contacto único. Los puntos muertos matan el impulso. Siempre construye 3+ hilos de contactos por cuenta.

**Arquetipos de Contacto a Enfocar:**
1. **Comprador Económico** (tiene presupuesto, toma decisión sí/no)
   - Señales de título: CFO, VP Finance, VP Ops, VP Sales, Chief Revenue Officer, VP/Director de [función del comprador]
   - Persona varía por producto. Si vendes herramientas de ops: VP Ops o Chief Operations Officer. Si habilitación de ventas: CRO o VP Sales.
   - Ángulo de investigación: contrataciones recientes = sin relaciones con proveedor incumbente, pizarra en blanco

2. **Campeón** (evangelizará internamente, ejecuta prueba de concepto, tiene credibilidad de pares)
   - Señales de título: Senior Manager, Director (debajo de C-suite), Ops Lead, Program Manager
   - A menudo ejecuta el proceso día a día, experimenta directamente el dolor
   - Ángulo de investigación: promociones, cambios de trabajo de otras empresas en tu espacio (ya entienden tu pitch)

3. **Influyente** (guardián técnico, forma criterios de selección)
   - Señales de título: Principal [función], Head of, Manager, Senior Specialist
   - Las decisiones de stack tecnológico a menudo se encaminan a través de ellos
   - Ángulo de investigación: habla en eventos industriales, publica sobre temas de dolor relevantes para tu solución

**Encontrar Estos Contactos:**
- LinkedIn Sales Navigator: Company > Role filter + botón "Messaging". Nota: limita a conexiones de 1er grado para tasas de respuesta más altas en primera secuencia.
- Hunter.io o RocketReach: Exportación masiva de lista de cuenta objetivo, luego verifica emails manualmente (falsos positivos son caros en tus límites de envío).
- Clay: Configura un flujo: Clearbit (investigación de empresa) → Hunter (email) → LinkedIn (enriquecer detalles de contacto) → revisión manual para ajuste de rol.
- Sitio web de la empresa: Revisa /team, /leadership, página de empresa en LinkedIn, noticias/PR para anuncios de empleo.

**Lógica de Secuencia:**
- Contacto 1 (Comprador Económico): Outreach Día 1, seguimiento Día 2, seguimiento Día 5
- Contacto 2 (Campeón): Día 0 o 1 (desplazado ligeramente), misma cadencia de seguimiento
- Contacto 3 (Influyente): Día 2, escalonado, tono de menor urgencia (información/opinión, no una solicitud)
- Mix (no envíes 3 emails idénticos el Día 1 a la misma cuenta—se ve robótico; desplaza por 1–2 días para romper patrón)

### Fase 4: Tiers de Profundidad de Investigación — Asigna Tiempo, No Esfuerzo Equitativo

Tu tiempo es finito. Escaloniza tu investigación para coincidir con el ajuste de cuenta.

**Cuentas Tier 1 (Puntuación de Ajuste Tier 1: 7–10)** — Profundidad de investigación de 20 minutos
- Investigación completa de empresa: sitio web, noticias recientes, financiamiento/valoración, biografías de ejecutivos
- Investigación específica del comprador: historial de perfil LinkedIn, contenido publicado, menciones en blog de empresa o podcasts
- Mapeo de dolor: Identifica 2–3 problemas específicos que probablemente enfrenten basado en etapa + vertical
- Documento de investigación: Breve de outreach con 3 puntos personalizados por contacto (correlación de dolor, evento reciente, conexión común)
- Secuenciamiento: Email personalizado por contacto (no plantilla), 3+ hilos de contactos en paralelo

**Cuentas Tier 2 (Puntuación de Ajuste Tier 2: 5–6)** — Profundidad de investigación de 10 minutos
- Snapshot de empresa: Industria, tamaño, financiamiento, títulos clave de comprador
- Específico del comprador: Escaneo rápido de LinkedIn (movimientos recientes, seniority, un punto de dato que puedas referenciar)
- Mapeo de dolor: Dolor genérico para su vertical (salta profundización específica de cuenta)
- Documento de investigación: Breve de outreach ligero, 1 punto personalizado + 2 puntos de plantilla por contacto
- Secuenciamiento: Email de plantilla + personalización ligera (primera línea, nombre de empresa, 1 detalle), aún 3+ contactos

**Cuentas Tier 3 (Puntuación de Ajuste Tier 3: 1–4)** — Profundidad de investigación de 5 minutos
- Snapshot de empresa: Tamaño, vertical solo (salta investigación profunda)
- Específico del comprador: Título + titular de LinkedIn solo (sin lectura profunda de perfil)
- Mapeo de dolor: Solo dolor vertical (sin investigación de cuenta)
- Documento de investigación: Email de plantilla con 1 punto de inserción (nombre de empresa o dolor vertical)
- Secuenciamiento: Pura plantilla con fusión de correo, aún 3+ contactos (deja que el volumen lleve)
- Triage: Si no hay respuesta después de 3 secuencias en 2 semanas, agrega a lote de espera inmediatamente (no desperdicies secuencias)

**Presupuesto de Tiempo:**
- Tier 1: 20 cuentas → 6–8 horas
- Tier 2: 40 cuentas → 6–7 horas
- Tier 3: 100+ cuentas → 8–10 horas (principalmente fusión de correo)
- Total: ~20–25 cuentas por día (varía según mezcla de tier)

### Fase 5: Flujo de Clay / LinkedIn Sales Navigator para Construcción de Lista a Escala

**Configuración de Flujo Clay (Recomendado para 100+ cuentas):**

1. **Capa Fuente:**
   - Entrada: Lista de industria de Clearbit, exportación Crunchbase, Apollo o ZoomInfo
   - Filtro 1: Rango de headcount (solo rango objetivo)
   - Filtro 2: Rango de ARR (umbral mínimo)
   - Filtro 3: Stack tecnológico (Clearbit: debe incluir herramientas punto de mira, excluir herramientas de competidor)
   - Salida: 200–1000 empresas (ajusta filtros hasta que el tamaño coincida con tu capacidad semanal)

2. **Capa de Enriquecimiento:**
   - Enriquecimiento Clearbit: Financiales de empresa, financiamiento, ubicación, vertical industrial, número de empleados
   - Buscador de Email Hunter: Búsqueda de email masiva (PRECAUCIÓN: la tasa de aciertos de Hunter baja en empleados antiguos/inactivos; verifica manualmente)
   - Raspado LinkedIn: Ejecuta búsqueda de URL personalizada por empresa para extraer perfiles de ejecutivo + fundador → email vía Hunter
   - API BuiltWith: Validación secundaria de stack tecnológico (para verticales sensibles al stack tecnológico)

3. **Capa de Puntuación:**
   - Agregar columna: "Growth Signal" (verdadero/falso basado en noticias/financiamiento en últimos 6 meses)
   - Agregar columna: "Pain Proxy Match" (conteo de indicadores de dolor presentes)
   - Fórmula: IF(growth=true, +2) + pain_proxy_count = Fit Score
   - Ordena descendente, asigna Tier (1/2/3) basado en bandas de puntuación

4. **Contacto Threading:**
   - Filtrar por palabras clave de rol de contacto: ejecutivo (CEO, CFO, CRO), director/VP (rol de comprador), manager (campeón)
   - Desduplicar en la misma cuenta (un comprador económico, un campeón, un influyente por cuenta)
   - Pase de QA manual: 5–10% verificación de muestra para ajuste de rol (evita títulos de trabajo que no coincidan con tu comprador)
   - Salida: Lista encadenada con columnas [Account, Contact1_Name, Contact1_Email, Contact1_Role, Contact2_Name…] para importar a secuencias de email

5. **Integración de LinkedIn Sales Navigator:**
   - Flujo paralelo (no reemplazo): Exporta lista de empresa objetivo
   - Sales Navigator > Company search > Agrega cuentas objetivo a lista
   - Nota: Visita perfiles (señal de compromiso a prospectos), pero confía en Hunter/Clay para email (Sales Navigator no proporciona exportación de email masiva)

**Salida de Fase 5:** Lista limpia y encadenada de 100–500 cuentas con 3+ contactos por cuenta, lista para secuenciamiento.

### Fase 6: El Método del Lote de Espera — Captura Señales Débiles Temprano

No toda cuenta está lista para secuenciar hoy. Pero las señales caducan. Captura todo.

**Qué Va en el Lote de Espera:**
- Cuentas con solo 1–2 señales de crecimiento/dolor (Prospectos Tier 3 con solo 1 punto)
- Empresas que investigaste pero detalles de contacto están incompletos (falta comprador económico o campeón)
- Cuentas con fuerte ajuste de ICP pero sin señal de dolor actual (fuerte coincidencia vertical, headcount pequeño, pero financiamiento estable)
- Objetivos de outreach aislado de intros calientes que no son parte de tu lista principal

**Mantenimiento del Lote de Espera (Semanal):**
- Marca cualquier nueva señal (publicaciones de empleo, financiamiento, mención de noticias) que mueva cuentas de Tier 3 → Tier 2 o Tier 2 → Tier 1
- Promociona cuentas de alta señal a lista de secuenciamiento activo
- No elimines cuentas; permanecen en lote de espera hasta:
  - Contactadas 3+ veces sin respuesta (luego: etiqueta "sin interés", suprimir)
  - Acuerdo cerrado (luego: etiqueta "cliente")
  - Explícitamente no apto (luego: etiqueta "fuera de ICP")

**Configuración de Herramienta:**
- Google Sheet o Airtable: Columnas [Company, ICP Fit Score, Latest Signal, Signal Date, Status (Active/Parking Lot/Suppressed), Last Outreach Date]
- Script semanal: Busca feeds de noticias + publicaciones de empleo + LinkedIn para empresas del lote de espera, registra nuevas señales en columna Signal Date
- Promoción mensual: Mueve cualquier cuenta Tier 3 con nueva señal a bucket Tier 2, agrega a secuencia de próxima semana

**Por Qué Importa:**
- Las cuentas del lote de espera son prospectos de inicio caliente para la campaña del próximo trimestre
- Primera secuencia aterriza cuando ya están considerando cambio (señal apareció esta semana, llegas tú la próxima = timing)
- Reduce desperdicio: no reinvestigas cuentas que ya has tocado

### Fase 7: Ritmo de Prospección Diaria — El Día de Trabajo de 4 Horas

**Hora 1: Investigación (9:00–10:00am)**
- Revisa compromiso nocturno (aperturas, clics, respuestas del día anterior)
- Investiga 20–30 cuentas basado en tier (mezcla Tier 1/2/3 para mantenerte fresco)
- Completa plantilla de breve de outreach para cada cuenta
- Time-box: 2–3 min por Tier 3, 5 min por Tier 2, 15–20 min por Tier 1

**Hora 2–3: Secuenciamiento (10:00am–12:00pm)**
- Escribe o personaliza secuencias basado en breve de investigación
- Envía secuencias de outreach a 20–40 cuentas (secuencias Día 1 para cuentas recientemente investigadas)
- Ejecuta secuencias de seguimiento (secuencias Día 2, Día 5 para cuentas que ya has contactado)
- Revisa entregabilidad: verifica rebotes, banderas de spam; cambia emails si es necesario
- Time-box: 3 min por cuenta para envíos de plantilla, 8 min para personalizado (Tier 1)

**Hora 4: Seguimiento y Revisión de Pipeline (12:00–1:00pm)**
- Registra todas las respuestas en CRM (no dejes que los emails se acumulen en bandeja de entrada)
- Responde a respuestas positivas/comprometidas inmediatamente (prioridad Tier 1; Tier 2 secundario)
- Mueve objeciones a seguimiento de objeciones (registra patrón, no respondas aún; respuesta batch más tarde)
- Agrega nuevos prospectos al lote de espera si se captura señal débil
- Revisa métricas: Enviado esta semana, Tasa de apertura por tier, Tasa de respuesta por posición de secuencia, Conversión a reunión

**Por Qué 4 Horas:**
- Investigación más profunda (énfasis Tier 1) → conversaciones de mayor calidad
- Secuenciamiento por lote → eficiencia (no cambio de contexto constante)
- Manejo de respuesta mismo día → construcción de confianza, velocidad de pipeline más rápida
- Revisión de métricas → iteración rápida (cambia secuencias si tasa de apertura <20%, pivota mensajería si emerge patrón de objeción)

---

## Ejemplo

**Escenario: Plataforma SaaS de Habilitación de Ventas B2B, objetivo de $3k–$8k MRR, enfocándose en US/UK mid-market**

**Fase 1: Definición de ICP**
- Industria: SaaS (NAICS 5112xx), MarTech (contenido/analítica/compromiso), PipeTech (adyacente a CRM)
- Headcount: 40–300 empleados (no pre-seed, no empresarial-bloqueado)
- ARR: $5M–$50M (zona dulce: $10M–$30M, mínimo $5M)
- Stack tecnológico: Salesforce + Slack + Outreach/Salesloft + Gong o Chorus (punto de mira), sin Showpad (incumbente)
- Geografía: US y UK (soporte de habla inglesa)

**Fase 2: Ejemplo de Puntuación de Ajuste de Cuenta**
```
Empresa: DataBox (Analytics SaaS, 80 empleados, $15M ARR)
Señales de crecimiento:
  - Financiación Series B anunciada (hace 2 meses) → +1
  - Contrató 3 roles de sales ops (el mes pasado) → +1
  - Abrió oficina UK (anunciado) → +1
Proxies de dolor:
  - Stack de 12+ herramientas (reportes fragmentados) → +1
  - Actualmente usa Tableau + Looker (sin plataforma única de analítica de ventas) → +1
Puntuación de Ajuste: 5 puntos (Tier 2)
```

**Fase 3: Hilo de 3 Contactos**
```
Cuenta: DataBox
Contacto 1 (Comprador Económico):
  - Nombre: James Chen, VP Sales
  - LinkedIn: Recientemente promocionado (hace 6 meses), anteriormente Manager AE en Stripe
  - Ángulo de outreach: "James — vi que escalaste la organización de Ventas de Stripe; Databox contrató 3 roles de ops. Las herramientas de habilitación de ventas que he visto funcionan mejor cuando..."
  
Contacto 2 (Campeón):
  - Nombre: Sarah Patel, Sales Operations Manager
  - LinkedIn: Recientemente contratada (hace 2 meses), anteriormente 4 años en HubSpot en rol similar
  - Ángulo de outreach: "Sarah — gente de HubSpot con la que trabajo a menudo enfrenta el mismo caos de reportes en etapa temprana; construimos [feature] específicamente para..."
  
Contacto 3 (Influyente):
  - Nombre: Marcus Rodriguez, Senior Product Manager (Sales)
  - LinkedIn: Activo en comunidad SaaS Ops, publicó sobre integración de tech de ventas
  - Ángulo de outreach: "Marcus — noté tu publicación reciente sobre analítica unificada. Curioso tus pensamientos sobre [tema]—algo en lo que hemos estado obsesionando con nuestros clientes..."
```

**Fase 4: Profundidad de Investigación**
- Asignación de Tier: Puntuación de Ajuste 5 = Tier 2
- Tiempo de investigación: 10 minutos
  - Snapshot de empresa (2 min): DataBox, Series B, 80 empleados, $15M ARR, producto es panel de analítica
  - Investigación de comprador (3 min): James promocionado hace 6mo desde Stripe; Sarah contratada hace 2mo desde HubSpot; Marcus activo en comunidad
  - Mapeo de dolor (3 min): Orgs de ventas con herramientas fragmentadas + crecimiento pesado = brechas de reportes; panel único de cristal para dashboards = su dolor
  - Breve de outreach (2 min): 3 ganchos personalizados (señal de crecimiento, experiencia de empresa anterior, señal de comunidad)

**Fase 5: Salida de Flujo Clay**
```
Entrada (exportación Crunchbase): 500 empresas SaaS, 40–300 HC, $5M–$50M ARR, US/UK
↓
Enriquecer Clearbit (eliminar <$5M, >$50M, no US/UK)
↓
Filtro de stack tecnológico (Salesforce + excluir Showpad)
↓
Email Hunter (búsqueda masiva para perfiles James Chen, Sarah Patel, Marcus Rodriguez)
↓
Fórmula de puntuación: (¿Financiación Series en 6mo? +2) + (¿Contrataciones de Sales ops? +1) + (0–5 proxy de dolor) = Fit Score
↓
Asignación de Tier + dedup de contacto
↓
Salida: 120 cuentas, 360 contactos, lista lista para thread, 30 Tier 1 / 60 Tier 2 / 30 Tier 3
```

**Fase 6: Entradas del Lote de Espera**
```
Empresa: TechCorp Inc.
- Ajuste de ICP: 6/10 (Tier 2 borderline)
- Señal: Sin financiación reciente, pero abrió rol de Sales ops la semana pasada
- Estado: Lote de Espera
- Última verificación: 2026-01-15
- Acción: Monitorea semanalmente; si contratan 2+ personal de ops, promociona a secuencia activa

Empresa: MidMarket SaaS Co.
- Ajuste de ICP: 4/10 (Tier 3)
- Señal: Fuerte coincidencia vertical (MarTech), pero aún en HubSpot (no Salesforce)
- Estado: Lote de Espera
- Última verificación: 2026-01-15
- Acción: Marca si anuncian migración de Salesforce o cambio de herramientas
```

**Fase 7: Ritmo Diario (Lunes, 20 de Enero)**
```
9:00–10:00am Investigación:
- Investigué 5 cuentas Tier 1 del lote de espera con nuevas señales
- Investigué 10 cuentas Tier 2 de lista nueva (salida Clay)
- Investigué 20 cuentas Tier 3 (plantilla de fusión de correo)
- Salida: 35 briefs de investigación, listos para secuenciar

10:00am–12:00pm Secuenciamiento:
- Envié outreach Día 1: 35 cuentas (5 personalizado, 30 plantilla con personalización)
- Ejecuté seguimientos Día 5: 12 cuentas (gente que se contactó la semana pasada, sin respuesta)
- Ejecuté seguimientos Día 2: 8 cuentas (toque ligero, segundo contacto en hilo)
- Estado CRM: 55 secuencias enviadas esta mañana

12:00–1:00pm Seguimiento y Revisión:
- Registré 3 respuestas en CRM (2 "interesado en llamada," 1 "persona incorrecta, reenviado a James")
- Programé 2 llamadas de descubrimiento para próxima semana
- Patrón identificado: 35% tasa de apertura en Tier 1, 18% en Tier 2, 4% en Tier 3 (en camino para objetivos)
- Agregué 5 cuentas del lote de espera con nuevas señales a cola de secuencia de esta semana
- Snapshot de métricas: 90 secuencias enviadas esta semana, 12 respuestas (13% tasa de respuesta), 2 reuniones reservadas

Actualización del lote de espera:
- DataBox (del ejemplo anterior) movida de Lote de Espera a Activa (nueva señal: Series B)
- Agregada a cola de secuencia de esta semana (comenzar miércoles para evitar amontonamiento de lunes)
```

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
