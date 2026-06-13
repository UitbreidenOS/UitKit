---
name: editorial-calendar
description: "Calendario editorial mensual: clústeres de temas, calendario de publicación, mezcla de contenido, plan de distribución"
---

# Habilidad de Calendario Editorial

## Cuándo activar
- Planificar un mes o trimestre de contenido para un blog, boletín o redes sociales
- Mapear clústeres de temas a palabras clave y construir un calendario de publicación coherente
- Decidir la mezcla de contenido adecuada (tutoriales, liderazgo de opinión, casos de estudio, comparativas, etc.)
- Crear planes de distribución que relacionen el tipo de contenido con el canal
- Incorporar a una nueva persona de contenido y necesitar un sistema de publicación estructurado
- Lanzar una nueva marca o sitio web y necesitar construir autoridad temática rápidamente

## Cuándo NO usar
- Redactar piezas de contenido individuales — usa `/content-brief` para eso
- Auditar SEO de un sitio existente — usa `/seo-audit` en su lugar
- Publicaciones sociales puntuales sin un plan de publicación estratégico
- Ya tienes un calendario y solo necesitas rellenar huecos de contenido — comienza con `/seo-audit` para encontrar los huecos primero

## Instrucciones

### Prompt principal de generación de calendario

```
Construye un calendario editorial mensual para [MARCA/PUBLICACIÓN].

Contexto:
- Marca: [nombre de la empresa, descripción en una línea]
- Público objetivo: [ICP — cargo, sector, puntos de dolor]
- Objetivo principal del negocio: [p. ej. tráfico orgánico, suscriptores de boletín, generación de pipeline]
- Canales de contenido: [blog, boletín, LinkedIn, X, YouTube — lista los que correspondan]
- Cadencia de publicación: [p. ej. 2 entradas de blog/semana, LinkedIn diario, boletín semanal]
- Autoridad de dominio / madurez del contenido: [sitio nuevo / 6-12 meses / establecido (DA 40+)]
- Clúster de palabras clave principal: [área temática principal, p. ej. "onboarding SaaS B2B"]
- Competidor que publica en: [URL o nombre — opcional]

Produce:

## 1. Mapa de clústeres de temas
Construye 3-5 temas pilares y 4-6 subtemas bajo cada uno:
- Pilar 1: [tema amplio] → subtemas: [lista]
- Pilar 2: [tema amplio] → subtemas: [lista]
...

## 2. Mezcla de tipos de contenido (% del total de contenido)
- Tutorial educativo: [X]%
- Liderazgo de opinión / opinión: [X]%
- Caso de estudio / historia de cliente: [X]%
- Comparativa / versus: [X]%
- Orientado a palabras clave (fondo de embudo): [X]%
- Newsjacking de tendencias: [X]%

## 3. Calendario mensual — [MES AÑO]
Para cada semana, especifica:
- Entradas de blog (título, palabra clave objetivo, tipo de contenido, potencial de tráfico estimado)
- Boletín (línea de asunto, tema, CTA principal)
- Publicaciones en LinkedIn (tema, formato: texto/imagen/carrusel/encuesta/video)
- Contenido para otros canales

## 4. Plan de distribución
Para cada pieza publicada, indica:
- Canal principal: [dónde vive]
- Reutilización: [cómo reutilizar en canales en 48 horas]
- Promoción: [alcance, comunidades, amplificación de pago si hay presupuesto]

## 5. Estrategia de enlaces internos
Mapea qué piezas nuevas deben enlazar al contenido pilar existente y entre sí.
```

### Marco de clústeres de temas

```typescript
interface TopicCluster {
  pillar: {
    title: string
    targetKeyword: string
    searchVolume: string      // from Ahrefs/Semrush or estimated
    difficulty: number        // 0-100
    format: 'ultimate-guide' | 'hub-page' | 'long-form'
    wordCount: number         // target
  }
  spokes: Array<{
    title: string
    targetKeyword: string
    searchVolume: string
    intent: 'informational' | 'navigational' | 'commercial' | 'transactional'
    format: 'how-to' | 'listicle' | 'comparison' | 'case-study' | 'opinion'
    linksToPillar: boolean    // always true for hub-and-spoke
    priority: 'high' | 'medium' | 'low'
  }>
}

// Reglas para contenido pilar:
// - Apunta a palabras clave principales (1-2 palabras), alto volumen, alta dificultad
// - 3.000-8.000 palabras — completo, genera enlaces
// - Actualizar trimestralmente
//
// Reglas para contenido radio:
// - Apunta a palabras clave de cola larga (3-5 palabras), volumen moderado, dificultad baja-media
// - 1.200-2.500 palabras — específico, accionable
// - Siempre enlaza de vuelta al pilar y a 2-3 radios relacionados
```

### Calculadora de mezcla de contenido

```
Calcula la mezcla de contenido óptima para mi situación:

Etapa del negocio: [inicial / crecimiento / madura]
Objetivo: [tráfico / leads / marca / comunidad]
Frecuencia de publicación: [X piezas/mes]
Tamaño del equipo: [solo / 1-2 redactores / equipo pequeño / agencia]

Etapa inicial + objetivo de tráfico:
- 60% SEO informacional (parte superior del embudo, educativo)
- 20% SEO comercial (comparativas, mejores opciones, alternativas)
- 20% liderazgo de opinión (construye autoridad + se comparte)
- Boletín: resumen semanal, 500-800 palabras, alto valor de curaduría

Etapa de crecimiento + objetivo de pipeline:
- 40% SEO informacional
- 30% SEO comercial/transaccional (fondo del embudo)
- 20% casos de estudio + historias de clientes
- 10% liderazgo de opinión sobre puntos de dolor del comprador
- Boletín: insight semanal + un CTA de producto

Etapa madura + objetivo de marca:
- 30% mantenimiento SEO (actualizar las mejores piezas)
- 40% liderazgo de opinión + investigación propia
- 20% colaboración con comunidad/audiencia
- 10% formatos experimentales (video, audio, interactivo)
```

### Calendario semanal de producción de contenido

```markdown
# Plantilla de Producción de Contenido Semanal

## Lunes — Planificación
- [ ] Revisar analítica de la semana anterior (sesiones, tiempo en página, conversiones por pieza)
- [ ] Confirmar que las piezas de esta semana tienen briefing y asignación
- [ ] Revisar temas de tendencia en tu espacio (Twitter/LinkedIn, Google Trends, Feedly)
- [ ] Hacer briefing de piezas reactivas (oportunidades de newsjacking)

## Martes–Miércoles — Producción
- [ ] El redactor entrega los borradores
- [ ] Revisión del editor: precisión, estructura, SEO, CTA
- [ ] Auditoría de enlaces internos (¿enlaza cada pieza a 3+ otras?)
- [ ] Título meta y descripción finalizados

## Jueves — Publicación y Distribución
- [ ] Publicar entrada de blog (confirmar URL canónica, schema, etiquetas OG)
- [ ] Enviar boletín si la cadencia es semanal
- [ ] Publicación en LinkedIn redactada desde el blog — formato carrusel o texto
- [ ] Enviar a comunidades relevantes (HN Show, Reddit, grupos de Slack)

## Viernes — Reutilización
- [ ] Convertir secciones del blog en 3-5 publicaciones de LinkedIn (programar para las próximas 2 semanas)
- [ ] Extraer citas para hilo de X/Twitter
- [ ] Actualizar el calendario de contenido con fechas de publicación reales y marcadores de analítica
- [ ] Añadir la pieza publicada al backlog de enlaces internos para piezas futuras
```

### Estrategia de canal de distribución por tipo de contenido

```
Mapea cada tipo de contenido a su distribución óptima:

TUTORIAL / CÓMO HACER:
Principal: Blog (SEO) + YouTube (si es apto para video)
Reutilización: Carrusel de LinkedIn → Hilo de X → Fragmento de boletín → Tutorial en Reddit
Amplificación de pago: Solo si estás en la página 2 y necesitas un empuje

LIDERAZGO DE OPINIÓN / OPINIÓN:
Principal: LinkedIn (el formato largo nativo funciona bien) + Publicación cruzada en blog
Reutilización: Historia principal del boletín → Hilo de X → Tema de discusión en podcast
Amplificación: Etiquetar a las personas mencionadas, interactuar con comentarios en los primeros 60 minutos

CASO DE ESTUDIO / HISTORIA DE CLIENTE:
Principal: Blog (pilar, opcional con acceso restringido) + Material de ventas
Reutilización: Destacado del cliente en LinkedIn → Email a prospectos similares → Diapositiva del deck de ventas
Amplificación: Enviar al cliente para que lo comparta — su audiencia confía más en él que en ti

COMPARATIVA / VERSUS:
Principal: Blog (fondo del embudo, alta intención de compra)
Reutilización: Adjunto de email de ventas → Respuesta de chatbot → Página de aterrizaje de PPC
Amplificación: NO compartir en redes sociales — parece autopromoción; deja que el SEO haga el trabajo

NEWSJACKING / TENDENCIA:
Principal: LinkedIn (publicar en 2 horas tras romper la noticia) + X
Reutilización: Sección P.D. del boletín → Entrada breve de blog al día siguiente
Amplificación: La velocidad es la amplificación; distribuye de inmediato o no lo hagas
```

### Plantilla de calendario editorial (copiar y pegar)

```markdown
# Calendario Editorial — [MES AÑO]

## Objetivos de este mes
- Objetivo de tráfico: [X sesiones]
- Objetivo de boletín: [X suscriptores / X% tasa de apertura]
- Objetivo de pipeline: [X leads originados en contenido]
- Objetivo de autoridad: [X backlinks / mejora Y de DA]

## Semana 1 ([Rango de fechas])

| Día | Canal | Título / Asunto | Tipo | Palabra clave | CTA |
|---|---|---|---|---|---|
| Lun | Blog | [Título] | Tutorial | [palabra clave] | [suscribirse / demo / descargar] |
| Mié | Boletín | [Línea de asunto] | Resumen | — | [CTA] |
| Jue | LinkedIn | [Tema del post] | Carrusel | — | [interactuar / visitar] |
| Vie | LinkedIn | [Tema del post] | Texto | — | — |

## Semana 2 ([Rango de fechas])
...

## Semana 3 ([Rango de fechas])
...

## Semana 4 ([Rango de fechas])
...

## Backlog permanente (publicar cuando haya capacidad)
- [Título] — [Palabra clave] — [Prioridad: A/M/B]
- [Título] — [Palabra clave] — [Prioridad: A/M/B]

## Auditorías de contenido pendientes este mes
- [URL] — última actualización [fecha] — acción: [actualizar / consolidar / eliminar]
```

### Prompt de planificación trimestral

```
Ejecuta una sesión de planificación de contenido trimestral.

Rendimiento del trimestre anterior:
- 5 piezas con mayor tráfico: [lista]
- 5 piezas con más conversiones: [lista]
- 5 piezas con peor rendimiento (poco tráfico, sin conversiones): [lista]
- Nuevas palabras clave posicionadas en página 1: [lista]
- Palabras clave que cayeron de la página 1: [lista]

Prioridades de este trimestre:
1. Reforzar: [lo que funcionó] — producir más contenido en estos clústeres
2. Actualizar: [lo que cayó] — actualizar, reoptimizar, añadir enlaces internos
3. Consolidar: [contenido delgado] — fusionar en una pieza sólida
4. Atacar: [nuevo clúster] — nueva área temática donde construir autoridad
5. Eliminar: [bajo rendimiento irreversible] — redirección 301 a contenido sólido relacionado

Resultado:
- Prioridades de clústeres para el T[X]
- Una hoja de ruta de publicación de 13 semanas
- Asignación del equipo: [X piezas/redactor/semana]
- Estimación de presupuesto si se externaliza: [X piezas × $[Y]/pieza]
```

## Ejemplo

**Usuario:** Construye un calendario editorial mensual para una startup SaaS B2B (herramienta de gestión de proyectos) dirigida a líderes de operaciones en empresas de 50-500 empleados. Publicar 2 blogs/semana, boletín semanal, LinkedIn diario. El mes es junio.

**Resultado:**
```markdown
# Calendario Editorial — Junio 2026
**Marca:** [Project Management SaaS] | **Audiencia:** Directores de Operaciones, Jefes de Gabinete | **Objetivo:** Tráfico orgánico + crecimiento del boletín

## Clústeres de Temas
**Pilar 1:** Eficiencia Operacional → radios: flujos de trabajo de equipos remotos, documentación de procesos, plantillas de cadencia de reuniones, seguimiento de OKRs
**Pilar 2:** Gestión de Proyectos → radios: planificación de recursos, mapeo de dependencias, proyectos interfuncionales, informes de estado
**Pilar 3:** Escalado de Operaciones → radios: SOPs para escalar, playbook de contratación de operaciones, auditoría de stack tecnológico, KPIs de operaciones

## Mezcla de Contenido
60% SEO educativo | 20% liderazgo de opinión | 15% casos de estudio | 5% comparativas

## Semana 1 (1-7 de junio)
| Día | Canal | Título | Tipo | Palabra clave | CTA |
|---|---|---|---|---|---|
| Lun 2 | Blog | "Cómo hacer una revisión de operaciones semanal que realmente funcione" | Tutorial | "reunión de revisión de ops" | Suscripción al boletín |
| Mié 4 | Boletín | "La semana de 5 reuniones que se gestiona sola" | Insight | — | Leer el blog |
| Jue 5 | LinkedIn | Carrusel sobre saturación de reuniones: 5 plantillas de reuniones de ops | Carrusel | — | DM para la plantilla |
| Sáb 7 | LinkedIn | "Opinión impopular: la mayoría de las herramientas de gestión de proyectos no resuelven el problema real" | Texto | — | Comentar |

## Semana 2 (8-14 de junio)
| Día | Canal | Título | Tipo | Palabra clave | CTA |
|---|---|---|---|---|---|
| Lun 9 | Blog | "Asana vs Monday vs [Tu Herramienta]: ¿Cuál encaja mejor con equipos de ops?" | Comparativa | "asana vs monday para operaciones" | Prueba gratuita |
| Mié 11 | Boletín | "Cómo [Cliente] redujo su tiempo de informes semanales un 70%" | Fragmento de caso de estudio | — | Leer historia completa |
| Jue 12 | LinkedIn | Carrusel de 5 diapositivas: "La transformación de ops de nuestro cliente en 90 días" | Carrusel | — | Enlace en comentarios |
| Vie 13 | LinkedIn | "3 señales de que tu herramienta de gestión de proyectos te está frenando" | Texto | — | — |

## Reglas de Distribución
- Cada entrada de blog → carrusel de LinkedIn en 48 horas
- Cada caso de estudio → el equipo de ventas recibe el enlace para su pipeline
- Clic de suscriptor del boletín → Etiquetado en HubSpot como "lead de contenido comprometido"
```

---
