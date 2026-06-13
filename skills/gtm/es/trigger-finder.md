# Buscador de Triggers

## Cuándo activar
Flujo de prospección diario al construir secuencias activadas por eventos, priorizando a quién contactar en las próximas 24 horas, u operacionalizando señales de intención de compra en un cadence de outreach repetible.

## Cuándo NO usar
Outreach en frío donde no existe trigger alguno — usa la habilidad de Personalización en su lugar para ICP de outreach estático. No uses Buscador de Triggers para leads inbound cálidos (ya tienen intención) o ventas basadas en cuentas donde las relaciones están pre-establecidas.

## Instrucciones

### Las 4 Categorías de Triggers

**1. Eventos de Empresa** — cambios organizacionales directos que crean presupuesto y urgencia
- Rondas de financiación (Serie A/B/C, seed) — afluencia de capital dispara contrataciones, expansión de herramientas, sobrecarga de infraestructura
- Contratación acelerada (3+ ofertas de trabajo en 90 días) — nuevo equipo = nuevos presupuestos de herramientas, brechas de habilidades, cuellos de botella de procesos
- Actividad M&A (adquisición o siendo adquirido) — desafíos de integración, consolidación de sistemas, reemplazo de plataforma legacy
- Cambio de liderazgo (nuevo CTO, VP Engineering, CMO) — ejecutivos nuevos traen relaciones de vendedores frescos y mandato de mejorar bajo su vigilancia

**2. Señales de Comportamiento** — actividades que revelan intención e indican evaluación activa
- Descargas de contenido (whitepapers, guías, calculadoras de ROI) — fase de auto-educación, comparando opciones
- Asistencia a webinar/demo (eventos de competidores, conferencias de la industria) — modo de compra, recopilación de benchmarks
- Actividad en sitios de reseñas (G2, Capterra, Trustpilot — visitas, vistas de comparación, solicitudes de demo) — evaluación en etapa tardía
- Ofertas de trabajo mencionando brechas de habilidades o nuevas iniciativas — contratando por capacidades que no tienen en-house

**3. Cambios en la Stack Tecnológica** — adopción de plataforma y churn que revelan cambios de gasto y prioridades
- Nuevas instalaciones de herramientas (via BuiltWith, ofertas de trabajo en LinkedIn que mencionan "experiencia con X") — expansión activa de stack, presupuesto asignado
- Anuncios de eliminación/discontinuación de herramienta de competidor — búsqueda de reemplazo activa en marcha
- Adopción de competidor por sus pares (visibilidad de caso de estudio, erosión de prueba social) — FOMO, miedo a quedarse atrás
- Iniciativas de consolidación o modernización de stack (extraídas de ofertas de trabajo, contenido en LinkedIn, blogs de ingeniería) — racionalización de plataforma = ventana de RFP

**4. Eventos Externos** — triggers macro que desplazan urgencia de compra a escala
- Cambio regulatorio (GDPR, SOC2, leyes de residencia de datos, cumplimiento de IA) — gasto de cumplimiento forzado
- Fracaso de competidor o contracción del mercado — pérdida de confianza, comportamiento de búsqueda de alternativas
- Cambio de mercado o disrupción de industria (IA, primero API, adopción serverless) — creación de categoría, adopción de nueva categoría

### Fuentes de Señales: La Stack

**Fuentes gratuitas o de bajo costo:**
1. **LinkedIn** (gratuito) — ofertas de trabajo, actualizaciones de empresa, cambios de liderazgo, posts de fundadores sobre financiación
2. **G2/Capterra** (gratuito) — actividad de reseña de competidores, conteos de descargas, picos de solicitudes de demo
3. **Crunchbase** (tier gratuito, alertas via email) — anuncios de financiación, datos de contratación, noticias de empresa
4. **BuiltWith** (gratuito/pago) — identificar quién usa tecnología específica, configurar seguimiento para competidores o perfiles de ICP
5. **Google Alerts** (gratuito) — configurar alertas para empresas, competidores, palabras clave regulatorias, términos de la industria
6. **Agregadores de ofertas de trabajo** (gratuito: LinkedIn, Indeed, Ashby) — proxy para velocidad de contratación, puntos de dolor, dirección de presupuesto
7. **Página de carreras de la empresa** (gratuito) — contratos acelerados activos, formación de nuevo equipo
8. **Plantillas Zapier/Make** (pago, $10–50/mo) — automatizar recopilación diaria de señales en tu CRM

**Fuentes premium** (opcional para operaciones a escala):
- Apollo.io, Hunter.io, o ZoomInfo — alertas de trigger, overlays de datos de intención
- 6sense, Demandbase, Terminus — señales de intención a nivel de cuenta

### Marco de Puntuación de Triggers

Asigna a cada señal una puntuación que determina la velocidad de respuesta:

**Alto (Actuar en 24 horas)**
- Anuncio de financiación activa (en 7 días)
- Oferta de trabajo mencionando explícitamente tu categoría de producto o brecha competitiva
- Reseña de competidor en G2 (solicitud de demo, reseñas móviles, actividad de seguimiento)
- Cambio de liderazgo en rol objetivo (CTO, VP Ing, CMO)
- Noticias de empresa sobre pivote de producto, expansión o M&A (adquirido o adquiriendo)

**Medio (Actuar en 1 semana)**
- Descarga de contenido de tu sitio o sitio de competidor
- Asistencia a webinar (tus propios eventos o eventos de competidores)
- Contratación de 2+ roles que sugieren brechas de capacidad
- Cambio en la stack tecnológica indicando iniciativa de modernización
- Anuncio regulatorio afectando su industria

**Bajo (Aparcar para secuencia futura)**
- Oferta de trabajo general (no dolor específico del rol)
- Mención de ganancias trimestrales de iniciativa estratégica
- Adopción por pares (interesante pero no intención directa)
- Tendencia de la industria (macro, no específica de empresa)
Puntúa señales bajas y agrega a una secuencia de nurture; revisa si aparece un trigger de puntuación más alta.

### La Fórmula de Mensaje de Trigger

Tu mensaje de apertura debe contener exactamente tres elementos en este orden:

1. **[Nombre el trigger específico]** — Sé explícito sobre qué observaste
   - ✓ "Vi tu anuncio de Serie B el martes pasado"
   - ✗ "Noté que estás creciendo"

2. **[Por qué importa específicamente para ellos]** — Conecta el trigger a un impacto empresarial concreto
   - ✓ "La Serie B típicamente significa 2–3 nuevos objetivos de contratación, y ahí es donde la fricción de onboarding mata la velocidad"
   - ✗ "Las empresas de Serie B necesitan escalar"

3. **[Una pregunta]** — Abierta, no sí/no, que los invite a compartir su desafío específico
   - ✓ "¿Cuál es el mayor dolor en el onboarding de tus nuevos empleados en este momento?"
   - ✗ "¿Te interesa un mejor onboarding?"

**Ejemplo de fórmula en acción:**
> "Hola [Nombre], vi que [Empresa] cerró tu Serie B — felicitaciones. La mayoría de equipos en tu posición luchan con onboarding de nuevos ingenieros rápidamente, lo que retrasa TTM. ¿Cuál ha sido el cuello de botella para ti?"

### Construyendo tu Stack de Monitoreo de Triggers

**Flujo de trabajo diario:**
1. Cada mañana, ejecuta consultas a través de tus fuentes (o configura automatizaciones de Zapier/Make para ejecutar durante la noche)
2. Recopila señales en un documento de intake único o vista de CRM
3. Puntúa cada señal (alto/medio/bajo)
4. Enruta señales de puntuación alta a tu lista de outreach diario
5. Agrega señales medias y bajas a tu CRM con una fecha de seguimiento de 7–14 días

**Patrón de automatización (Zapier/Make):**
- Trigger: "Nueva oferta de trabajo coincidiendo palabras clave [tu ICP]" O "Anuncio de financiación para [lista de empresas]" O "Reseña en G2 publicada en [competidor]"
- Acción: Crear una nueva fila en tu CRM (Salesforce, HubSpot, Pipedrive) con tipo de señal, puntuación, fecha y enlace
- Frecuencia: Diaria 8 AM tu hora
- Costo: ~$20–50/mes para una automatización de 3–5 triggers

**Setup de Zapier de ejemplo:**
1. Trigger de oferta de trabajo en LinkedIn → Filtrar por palabras clave ("contratación", "ingeniero", "full-stack") + ICP de empresa
2. Trigger de financiación en Crunchbase → Agregar filtro "Serie A, B, C"
3. Acción: Crear/actualizar deal en HubSpot con pipeline "Trigger Queue", establecer tag de puntuación
4. Notificación: Resumen diario de Slack de señales de puntuación alta para tu equipo

### La Ventana de Decay de 14 Días

**Regla crítica: La mayoría de los triggers pierden relevancia después de 14 días.**

- Un anuncio de financiación el Día 1 es fresco y urgente (se está asignando presupuesto)
- Por Día 14, los ciclos de adquisición se han endurecido; por Día 30, la ventana se ha cerrado
- Las ofertas de trabajo alcanzan su máxima relevancia durante las semanas 2–3 (contratación activa, posiciones sin cubrir = dolor)
- Los cambios de liderazgo tienen la intención más alta en los días 1–7; después de 30 días, se han establecido en su rol
- Los anuncios regulatorios tienen una ventana más larga (60–90 días) pero se apilan con otras señales

**Implicaciones:**
- No te sientes en triggers de puntuación alta. Outreach en día 1 o 2
- Los triggers de puntuación media pueden esperar 3–5 días pero no más
- Después de 14 días, mueve una señal a "nurture" (cadencia más baja, agrega a secuencia de email)
- Rastrear tasas de respuesta por antigüedad del trigger; verás un declive agudo después del día 10–14

### Operacionalización: De Señal a Secuencia

1. **Identificar** — Ejecuta tus fuentes diarias, captura señal
2. **Puntuar** — Marco alto/medio/bajo arriba
3. **Mensaje** — Usa la fórmula de trigger; personaliza en 2 minutos
4. **Tiempo** — Alto = hoy, Medio = esta semana, Bajo = nurture
5. **Rastrear** — Registra tipo de trigger, fecha, puntuación y respuesta en CRM para puntuación predictiva
6. **Decay** — Archiva o nurture después de 14 días si no hay respuesta

### Plantillas de Mensaje de Trigger por Categoría

**Eventos de Empresa:**
> "Vi que [Empresa] contrató a [Nombre] como [Título] el mes pasado. Los líderes en ese rol típicamente remodelan la stack de [función]. ¿Cuál ha sido el mandato de tu liderazgo alrededor de [tema]?"

**Señales de Comportamiento:**
> "Noté que descargaste nuestra guía '[Recurso]' la semana pasada. Los equipos que más la usan están abordando [dolor específico]. ¿Dónde estás más bloqueado en este momento?"

**Cambios en la Stack Tecnológica:**
> "Vi que [Empresa] agregó [Herramienta] a tu stack recientemente. Muchos equipos lo hacen cuando [razón de negocio]. ¿Estás reconstruyendo [sistema] en este ciclo?"

**Eventos Externos:**
> "Con [regulación] entrando en vigor en [cronograma], equipos como el tuyo están revisando soluciones de [categoría]. ¿Cuál es tu prioridad—cumplimiento o rendimiento?"

## Ejemplo

**Escenario:** Estás vendiendo automatización de onboarding para desarrolladores a equipos de ingeniería en startups de Serie A/B.

**Intake de señales de hoy:**

| Empresa | Trigger | Puntuación | Fuente | Mensaje de Hoy | Respuesta |
|---------|---------|-------|--------|-----------------|----------|
| TechCorp Labs | Serie B, ronda de $25M (anunciada hace 2 días) | Alto | Crunchbase | "Felicitaciones por el cierre de Serie B. La mayoría de equipos en esta etapa contratan 5–8 nuevos ingenieros en el próximo trimestre, lo que rompe onboarding. ¿Cuál es tu TTM actual para una nueva contratación?" | Leído (2h después): "Ja, estamos en 6 semanas. De acuerdo, apesta." |
| Aurora Systems | VP Engineering contratado (post en LinkedIn, hace 3 días) | Alto | LinkedIn | "Vi que trajiste a [Nombre] como VP Ing—buena contratación. Los nuevos líderes típicamente quieren cortar TTM a la mitad. ¿Estás mirando herramientas de onboarding este ciclo?" | Leído (al día siguiente): "En realidad sí, estamos evaluando ahora." |
| Vertex AI | 4 ofertas de trabajo para "Senior Backend Engineer" publicadas en 7 días | Medio | Búsqueda de trabajo en LinkedIn + Crunchbase | "Veo que estás contratando agresivamente para backend. Cuando escalas el equipo de ing tan rápido, los cuellos de botella de onboarding se componen. Pregunta rápida—¿cómo estás escalando procesos de onboarding para mantener el ritmo?" | Sin respuesta aún (aparcar para seguimiento de 5 días) |
| Momentum Inc | Descargó tu guía "Métricas de Onboarding" (email rastreado) | Medio | Rastreo de Email | "Gracias por descargar la guía de métricas. La mayoría de equipos encuentran que su TTM es 40% del camino a la mejor práctica de la industria. ¿Cuál es tu línea base en este momento?" | Leído (mismo día): "Alrededor de 6 semanas, buscando cortar a 3" |
| Scale Ventures | Cerró Serie A hace 8 semanas; sin señal reciente | Bajo | Historial de CRM | [Sin outreach hoy; agregar a secuencia de email de nurture] | — |

**Resultado del trabajo de una mañana:** 2 conversaciones de puntuación alta abiertas el mismo día, 1 medio movido a seguimiento, 1 inbound cálido generado desde toque de email.

**Observación clave:** La contratación de VP Engineering y el anuncio de Serie B movieron la aguja más rápidamente porque señalan nuevo tomador de decisiones + presupuesto nuevo. La descarga de guía de onboarding fue de menor velocidad pero indicó evaluación activa. Las ofertas de trabajo son indicadores rezagados (el dolor ya existía; ahora están contratando para arreglarlo).

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
