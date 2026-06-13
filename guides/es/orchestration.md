# Protocolo de Orquestación

Un patrón ligero para coordinar personas, agentes y habilidades en trabajo complejo multidisciplinario.

No se requiere marco. Sin dependencias. Solo indicaciones estructuradas.

---

## Concepto principal

La mayoría del trabajo real cruza límites de dominio. Un lanzamiento de producto requiere ingeniería, marketing y estrategia. Una revisión arquitectónica requiere seguridad, análisis de costos y evaluación de equipo.

La orquestación conecta la experiencia adecuada con cada fase del trabajo:

- **Agentes** definen *quién* piensa — identidad, juicio, estilo de comunicación
- **Habilidades** definen *cómo* ejecutar — pasos, plantillas, ejemplos, patrones
- **Fases** definen *cuándo* cambiar — a medida que el trabajo pasa de un dominio a otro

Los combinas. El patrón es siempre el mismo.

---

## El patrón

### 1. Definir el objetivo

Indique qué desea lograr, no cómo lograrlo.

```
Objetivo: Lanzar un nuevo producto SaaS para pequeños despachos de contabilidad.
Restricciones: equipo de 2 personas, presupuesto de $5K, cronograma de 6 semanas.
Criterios de éxito: 50 clientes pagadores en los primeros 30 días.
```

### 2. Seleccionar el agente correcto

Elija el agente cuyo juicio se ajuste a la fase actual. Los agentes llevan opiniones, prioridades y marcos de toma de decisiones.

| Situación | Agente | Por qué |
|---|---|---|
| Decisiones arquitectónicas, pila de tecnología, comprar o construir | `cto-advisor` | Juicio de ingeniería |
| Estrategia de lanzamiento, canales de crecimiento, contenido | `cmo-advisor` | Experiencia GTM y canal |
| Modelo financiero, economía unitaria, financiamiento | `cfo-advisor` | Decisiones basadas en números |
| Hoja de ruta de producto, priorización, investigación de usuarios | `cpo-advisor` | Enfoque en éxito del usuario |
| Operaciones, proceso, estructura del equipo | `coo-advisor` | Ejecución primero |
| Todo a la vez, solo | `ceo-advisor` | Priorización multidisciplinaria |

**Activación:**
```
/agents/advisors/cto-advisor
```

### 3. Cargar habilidades para la ejecución

Los agentes saben *qué* hacer. Las habilidades saben *cómo* hacerlo con precisión. Cargue las habilidades que su fase actual necesita.

```
/skills/devops-infra/aws-architect       — patrón de infraestructura
/skills/backend/nodejs/nextjs            — marco frontend
/skills/devops-infra/cicd               — canalización de despliegue
```

El agente impulsa las decisiones. Las habilidades proporcionan pasos estructurados, plantillas y patrones concretos.

### 4. Trabajar en fases

Divida el objetivo en fases. Cada fase puede usar diferentes agentes y habilidades.

```
Fase 1: Fundación técnica (Semana 1-2)
  Agente: cto-advisor
  Habilidades: aws-architect, codebase-onboarding, cicd
  Salida: Doc de arquitectura, esqueleto implementado, canalización CI

Fase 2: Preparación del lanzamiento (Semana 3-4)
  Agente: cmo-advisor
  Habilidades: copywriting, content-strategy, seo-audit
  Salida: Página de inicio, calendario de contenido, plan de lanzamiento

Fase 3: Go-to-Market (Semana 5-6)
  Agente: ceo-advisor
  Habilidades: email-sequence, analytics-tracking, pricing-strategy
  Salida: Producto lanzado, seguimiento, primeros clientes
```

### 5. Transferencia entre fases

Al cambiar de fase, resuma siempre lo que se decidió y qué está abierto:

```
Fase 1 completada.
Decisiones: AWS serverless (Lambda + DynamoDB), frontend Next.js, CI GitHub Actions
Artefactos creados: architecture-doc.md, implementado en staging
Preguntas abiertas: modelo de precios (decisión Fase 3)

Cambio a Fase 2. Cargando habilidades cmo-advisor + copywriting + content-strategy.
```

---

## Patrones de orquestación comunes

### Patrón A: Sprint en solitario

Una persona, un objetivo, múltiples dominios. Cambie agentes mientras avanza por las fases.

```
Semana 1: cto-advisor + habilidades de ingeniería → Construir el producto
Semana 2: cmo-advisor + habilidades de marketing  → Preparar el lanzamiento
Semana 3: ceo-advisor + habilidades GTM        → Enviar e iterar
```

Mejor para: proyectos paralelos, MVPs, fundadores en solitario, startups de una persona.

### Patrón B: Inmersión en dominio profundo

Un dominio, profundidad máxima. Agente único, múltiples habilidades apiladas.

```
Agente: cto-advisor
Habilidades cargadas simultáneamente:
  - aws-architect       → diseño de infraestructura
  - cloud-security      → postura de seguridad
  - slo-architect       → objetivos de confiabilidad
  - chaos-engineering   → prueba de modo fallo

Tarea: Revisión de preparación de producción completa
```

Mejor para: revisiones arquitectónicas, auditorías de cumplimiento, inmersiones técnicas profundas antes del lanzamiento.

### Patrón C: Revisión multi-agente

Diferentes agentes examinan el mismo problema desde diferentes ángulos.

```
Paso 1: cto-advisor diseña la arquitectura técnica
Paso 2: cfo-advisor revisa el modelo de costo de compra vs construcción
Paso 3: ceo-advisor hace la llamada de compromiso final
```

Mejor para: decisiones de alto riesgo, preparación de inversores, recomendaciones a nivel de junta, pivots importantes.

### Patrón D: Cadena de habilidades

Sin agente requerido. Encadene habilidades secuencialmente para trabajo procedural.

```
1. /product-discovery    → Identificar y validar el problema
2. /experiment-designer  → Diseñar la prueba
3. /analytics-tracking   → Configurar medición
4. /product-analytics    → Interpretar resultados
```

Mejor para: flujos de trabajo repetibles, tuberías de contenido, listas de verificación de cumplimiento, procesos de investigación.

---

## Ejemplo: Lanzamiento completo del producto (6 semanas)

**Configuración:**
```
Objetivo: Lanzar una herramienta de facturación B2B para autónomos
Equipo: 1 desarrollador + 1 comercializador
Cronograma: 6 semanas
Presupuesto: $5K
```

**Semana 1-2: Construir**
```
Agente: cto-advisor
Habilidades: aws-architect, nextjs, postgresql, stripe

Entregables:
- Decisión arquitectónica (sin servidor: Lambda + DynamoDB + Stripe)
- MVP implementado: auth, facturación, cobro de pagos
- Canalización CI/CD (GitHub Actions → AWS)
```

**Semana 3-4: Preparación del lanzamiento**
```
Agente: cmo-advisor
Habilidades: copywriting, seo-audit, content-strategy, email-sequence

Entregables:
- Página de inicio en vivo (héroe, precios, prueba social)
- 3 publicaciones de blog programadas (objetivo SEO)
- Secuencia de correo electrónico de bienvenida configurada (5 correos, goteo de 14 días)
- Lista de verificación del día del lanzamiento
```

**Semana 5: Lanzamiento**
```
Agente: ceo-advisor
Habilidades: pricing-strategy, analytics-tracking, onboarding-cro

Entregables:
- Precios finalizados (3 niveles: Solo $19 / Pro $49 / Team $99)
- Seguimiento de análisis verificado de extremo a extremo
- Envío de Product Hunt preparado
- Lista de verificación de incorporación activada (5 pasos en la aplicación)
```

**Semana 6: Iterar**
```
Agente: ceo-advisor
Habilidades: product-analytics, experiment-designer, customer-success

Entregables:
- Métricas de la semana 1: registros, tasa de activación, primer pago
- Punto de fricción superior identificado (paso de incorporación 3)
- Experimento diseñado e iniciado
- Mapa de ruta del mes 2 esbozado
```

---

## Reglas

1. **Un agente a la vez.** El cambio está bien, pero no mezcle dos agentes en el mismo turno de conversación.
2. **Las habilidades se apilan libremente.** Cargue tantas habilidades como la tarea necesite. No entran en conflicto.
3. **Los agentes son opcionales.** Para trabajo procedural, las cadenas de habilidades son suficientes.
4. **El contexto se continúa.** Al cambiar de fase, siempre resuma primero las decisiones y los artefactos.
5. **Usted decide.** La orquestación es una sugerencia. Ignora cualquier fase, agente o habilidad en cualquier momento.

---

## Referencia rápida

**Activación de agente:**
```
/agents/advisors/cto-advisor
/agents/advisors/cmo-advisor
/agents/advisors/cfo-advisor
/agents/advisors/cpo-advisor
/agents/advisors/coo-advisor
/agents/advisors/ceo-advisor
/agents/advisors/general-counsel
/agents/roles/incident-commander
/agents/roles/senior-backend
/agents/roles/senior-frontend
/agents/roles/red-team
```

**Activación de habilidades:**
```
/skills/devops-infra/aws-architect
/skills/marketing/content-strategy
/skills/product/product-discovery
[ver directorio skills/ para catálogo completo]
```

**Plantilla de transferencia de fase:**
```
Fase [N] completada.
Decisiones: [enumerar decisiones clave tomadas]
Artefactos: [enumerar archivos o documentos creados]
Elementos abiertos: [lo que la siguiente fase debe resolver]
Cambio a: [agente] + [habilidades]
```

---
