---
name: sdr-research-brief
description: "Dosier de cuenta en 30 segundos para SDRs: resumen de empresa, desencadenantes recientes, señales de compra, mapa de partes interesadas y ángulo de contacto personalizado — a partir de una URL o nombre de empresa"
---

# Habilidad de Resumen de Investigación para SDR

## Cuándo activar
- Necesitas un resumen completo de cuenta antes de escribir contacto en frío
- Tienes un nombre de empresa o URL y quieres desencadenantes, señales y partes interesadas en menos de un minuto
- Preparándote para una llamada en frío y necesitas puntos de conversación + objeciones probables
- Construyendo una lista de cuentas objetivo y quieres priorizar por ajuste + momento
- Investigando una empresa que acaba de interactuar con tu contenido o agendó una reunión

## Cuándo NO usar
- Ya tienes contexto profundo de la cuenta de un AE anterior o en el CRM
- Enriquecimiento masivo de 50+ cuentas a la vez — usa la habilidad `/lead-enrichment` en su lugar
- Objetivos de consumidor/B2C — señales y métodos de investigación diferentes
- Cuando solo necesitas personalización de email — usa `/sdr-agent` directamente

## Instrucciones

### Prompt de resumen de cuenta principal

```
Genera un resumen de cuenta SDR para [NOMBRE DE EMPRESA / URL].

Mi producto: [lo que vendes en una oración]
Mi ICP: [perfil de cliente ideal — tamaño, industria, rol, dolor]

Produce:

## 1. Resumen de empresa (30 segundos)
- Qué hacen (1 oración, sin jerga)
- Tamaño: headcount, estimado de ingresos, etapa de financiación
- Sede y mercados principales
- Señales de tech stack (de ofertas de empleo, BuiltWith, reseñas de G2)
- Modelo de negocio: PLG / liderado por ventas / self-serve / enterprise

## 2. Desencadenantes recientes (por qué contactar AHORA — no hace 6 meses)
Busca:
- Ronda de financiación en los últimos 90 días → presupuesto desbloqueado
- Contratación ejecutiva (nuevo VP Ventas, CRO, CFO) → nuevo comprador con mandato de cambio
- Lanzamiento de producto → modo de escala, nueva contratación
- Despidos → mandato de eficiencia, reducción de costos
- Adquisición → dolor de integración, nuevas necesidades de tech stack
- Ofertas de empleo para roles que tu producto elimina o mejora

## 3. Puntuación de ajuste al ICP (0-100)
Puntúa en estas dimensiones:
- Ajuste de tamaño de empresa: [peso 25]
- Ajuste de industria: [peso 20]
- Superposición de tech stack: [peso 20]
- Desencadenante/momento: [peso 25]
- Accesibilidad del tomador de decisiones: [peso 10]

## 4. Mapa de partes interesadas
Identifica 3 personas a contactar (Campeón, Comprador Económico, Bloqueador):
- Nombre, cargo, URL de LinkedIn (si es público)
- Por qué les importa tu producto
- Mejor canal para contactarlos
- Actividad reciente o publicación a referenciar

## 5. Ángulo de contacto personalizado
- EL UN gancho que hace este contacto relevante ahora mismo
- Línea de asunto sugerida (variante A/B)
- Borrador de primera oración (no genérico — referencia desencadenante específico)
- Objeción que probablemente plantearán primero
```

### Resumen rápido (estilo CLI — menos de 10 segundos)

```
Resumen rápido de SDR — [EMPRESA]:
- Qué hacen: [1 oración]
- Desencadenante: [la señal más reciente — financiación, contratación ejecutiva, oferta de empleo]
- A quién contactar: [nombre, cargo]
- Gancho de apertura: [1 oración referenciando el desencadenante]
- Riesgo: [qué podría hacer que NO sean un buen ajuste]
```

### Marco de investigación de desencadenantes

Usa esto para encontrar señales que Claude puede investigar:

```typescript
interface TriggerSignal {
  type: 'funding' | 'exec_hire' | 'product_launch' | 'layoffs' | 'acquisition' | 'hiring_surge' | 'tech_change'
  recency: number // days ago
  relevance: number // 0-1, how relevant is this to your product
  hook: string // how to reference it in outreach
}

const TRIGGER_SOURCES = [
  'Crunchbase / TechCrunch — funding rounds',
  'LinkedIn — exec hires in last 90 days',
  'Company blog — product announcements',
  'LinkedIn Jobs — open roles (signal: 10+ eng roles = growth)',
  'G2 / Capterra reviews — what tools they use and hate',
  'Glassdoor — culture signals, tech stack mentions',
  'SEC filings — public companies only, use earnings calls for pain points',
  'Reddit/HN — if technical founders, check what they complain about',
]

// Priority order: funding > exec hire > product launch > layoffs > hiring surge > tech change
// Older than 90 days: deprioritise — timing has passed
```

### Prompt de mapeo de partes interesadas

```
Mapea el comité de compra para [EMPRESA] para una compra de [CATEGORÍA DE PRODUCTO].

Roles típicos en esta decisión de compra:
- Campeón (usa el producto diariamente, aboga internamente)
- Comprador Económico (firma el contrato, le importa el ROI)
- Evaluador Técnico (evalúa seguridad, integración, escalabilidad)
- Bloqueador (legal, finanzas, TI — puede matar acuerdos)

Por cada rol:
1. ¿Quién en [EMPRESA] probablemente lo ocupa? (nombre si se puede encontrar en LinkedIn)
2. ¿Qué les importa más?
3. ¿Qué objeción plantean?
4. ¿Qué mensaje hace que digan sí?

Produce una tabla: Rol | Nombre | Cargo | Dolor | Mensaje | Objeción
```

### Rúbrica de puntuación de ICP (personalizar por producto)

```
Puntuación de ICP — [NOMBRE DEL PRODUCTO]

TAMAÑO DE EMPRESA (25 pts):
- 50-500 empleados: 25 pts
- 500-2000: 15 pts
- <50 o >2000: 5 pts

INDUSTRIA (20 pts):
- Verticales objetivo [lista los tuyos]: 20 pts
- Adyacente: 10 pts
- Fuera: 0 pts

TECH STACK (20 pts):
- Usa [tus socios de integración]: +5 pts cada uno, máx 20
- Usa competidor directo: -10 pts (venta más difícil, pero posible)

DESENCADENANTE (25 pts):
- Financiación en 90 días: 25 pts
- Contratación ejecutiva en 90 días: 20 pts
- Lanzamiento de producto: 15 pts
- Pico de contratación (>20% de crecimiento del headcount): 15 pts
- Sin desencadenante reciente: 5 pts

ACCESO AL TOMADOR DE DECISIONES (10 pts):
- Conexión directa en LinkedIn con el comprador: 10 pts
- Conexión de 2º grado: 7 pts
- Sin conexión: 3 pts

TOTAL: /100
- 80+: Prioridad 1 — contacto personalizado inmediatamente
- 60-79: Prioridad 2 — secuencia en 2 semanas
- 40-59: Prioridad 3 — nurture
- <40: No es un ajuste — omitir
```

### Plantilla de resultado de investigación

```markdown
# Resumen de Cuenta: [EMPRESA] — [FECHA]

## Resumen
[Empresa] es [descripción]. [Empleados] empleados. [Etapa de financiación].
Mercado principal: [geografía + segmento]. Tech stack: [herramientas clave].

## Por qué ahora (Desencadenante)
[TIPO DE DESENCADENANTE] — [evento específico, fecha, fuente].
Relevancia: [cómo esto conecta con tu producto/punto de dolor].

## Puntuación ICP: [X]/100
- Tamaño: [X/25] | Industria: [X/20] | Stack: [X/20] | Desencadenante: [X/25] | Acceso: [X/10]

## A quién contactar
| Rol | Nombre | Cargo | LinkedIn | Prioridad |
|---|---|---|---|---|
| Campeón | [Nombre] | [Cargo] | [URL] | 1º |
| Comprador Económico | [Nombre] | [Cargo] | [URL] | 2º |
| Bloqueador | [Nombre] | [Cargo] | [URL] | Informativo |

## Ángulo de contacto
Gancho: [el gancho específico basado en el desencadenante]
Asunto: [versión A] / [versión B]
Apertura: [primera oración referenciando el gancho — no genérica]
Objeción probable: [en qué harán pushback primero]
```

## Ejemplo

**Usuario:** Dame un resumen de cuenta sobre Vercel. Vendo una herramienta de observabilidad B2B para rendimiento frontend.

**Resultado:**
```markdown
# Resumen de Cuenta: Vercel — Junio 2026

## Resumen
Vercel es una plataforma en la nube para desarrolladores frontend, usada por más de 1M de desarrolladores globalmente.
~1.200 empleados. Serie E ($150M, 2023). Sede: San Francisco. Stack: Next.js (propio),
Turborepo, Datadog, PagerDuty, Segment.

## Por qué ahora (Desencadenante)
NUEVA CONTRATACIÓN EJECUTIVA — VP de Ingeniería de Plataforma contratado desde Cloudflare (LinkedIn, hace 14 días).
Los nuevos líderes de plataforma típicamente auditan herramientas de monitorización en los primeros 90 días.
Relevancia: La escala de Vercel (millones de despliegues/día) crea complejidad de latencia frontend
que su stack actual (Datadog) no optimiza.

## Puntuación ICP: 88/100
- Tamaño: 25/25 | Industria: 20/20 | Stack: 15/20 | Desencadenante: 25/25 | Acceso: 3/10

## A quién contactar
| Rol | Nombre | Cargo | LinkedIn | Prioridad |
|---|---|---|---|---|
| Campeón | [VP Plataforma] | VP Ingeniería de Plataforma | [URL] | 1º |
| Comprador Económico | [CTO] | CTO | [URL] | 2º |
| Bloqueador | [TI/Seguridad] | Head of Security | [URL] | Informativo |

## Ángulo de contacto
Gancho: Nuevo VP Plataforma a tu escala — Datadog no muestra latencia frontend por nodo edge
Asunto A: "Observabilidad frontend para la escala de Vercel" / Asunto B: "Cómo [X] redujo la latencia p95 un 40%"
Apertura: "Felicidades por la contratación del VP Plataforma — los equipos a tu escala suelen encontrar que la auditoría de los primeros 90 días
descubre brechas en observabilidad específica de frontend que las herramientas generales de APM como Datadog no cubren."
Objeción probable: "Ya tenemos Datadog / lo construimos internamente"
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
