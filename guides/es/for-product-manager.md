# Claude para Product Managers

Todo lo que un product manager necesita para ejecutar descubrimiento, planificación de roadmap, entrega de sprints, alineación de partes interesadas y decisiones basadas en datos potenciados por IA — usando Claude Code.

---

## Para quién es esto

Eres PM en una startup o scale-up gestionando un producto con clientes reales, un equipo de ingeniería que depende de ti para especificaciones claras, y partes interesadas que necesitan alineación. Pasas demasiado tiempo escribiendo documentos, preparando reuniones y persiguiendo decisiones. Claude Code recorta esa sobrecarga para que puedas pasar más tiempo con clientes pensando en el producto.

**Antes de Claude Code:** 4 horas para escribir un PRD. 2 horas para preparar entrevistas de descubrimiento. 1 hora para escribir historias de sprint. Media jornada para construir un análisis competitivo.

**Después:** PRD redactado en 45 minutos. Guía de entrevistas en 10 minutos. Backlog de sprint refinado en 30 minutos. Análisis competitivo en una hora.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo de PM
npx claudient add skill product/product-discovery
npx claudient add skill product/product-roadmap
npx claudient add skill product/experiment-designer
npx claudient add skill product/product-analytics
npx claudient add skill product/competitive-teardown
npx claudient add skill product/ux-researcher
npx claudient add skill product/code-to-prd
npx claudient add skill product/product-manager-toolkit
npx claudient add skill product/pm-sprint-review
npx claudient add skill product/user-story-writer
npx claudient add agents advisors/cpo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Tu stack de Claude Code para PM

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/product-discovery` | Guías de entrevistas con clientes, análisis JTBD, puntuación de oportunidades, informes de problema | Antes de comprometerse a construir cualquier cosa |
| `/user-story-writer` | Convertir ideas aproximadas en historias estructuradas con criterios de aceptación y casos límite | Refinamiento del backlog, planificación de sprint |
| `/code-to-prd` | Ingeniera inversa un PRD a partir del código existente — o genera un PRD a partir de un brief | Documentación de características, alineación de partes interesadas |
| `/product-roadmap` | Construir y comunicar un roadmap priorizado con justificación | Planificación trimestral, revisiones con partes interesadas |
| `/pm-sprint-review` | Velocidad del sprint, entregado vs. planificado, retrospectiva, prioridades del siguiente sprint | Al final de cada sprint |
| `/experiment-designer` | Diseño de pruebas A/B, formulación de hipótesis, tamaño de muestra, métricas de éxito | Experimentos de crecimiento, feature flags |
| `/product-analytics` | Análisis de embudo, retención de cohortes, esquema de eventos, interpretación de métricas | Revisión semanal de datos, post-lanzamiento |
| `/ux-researcher` | Scripts de pruebas de usabilidad, síntesis de entrevistas, construcción de personas | Validación de diseño |
| `/competitive-teardown` | Análisis completo de competidores: posicionamiento, características, precios, DAFO | Trimestral, antes de ciclos de planificación |
| `/product-manager-toolkit` | Marcos de priorización (RICE, ICE, MoSCoW), mapas de partes interesadas, documentos de decisión | Trabajo de PM del día a día |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `cpo-advisor` | Opus | Decisiones estratégicas de producto, compromisos en el roadmap, diseño organizacional |
| `competitive-analyst` | Sonnet | Inteligencia detallada de competidores, benchmarking de características |

---

## Flujo de trabajo diario

### Preparación del standup matutino (10 minutos)

```
/pm-sprint-review

Resumen rápido del standup para el Sprint [N] — Día [X]:

Equipo: [N ingenieros, N diseñadores]
Objetivo del sprint: [indicarlo]

Actualizaciones de ayer (extraer de Linear/Jira):
- [Ticket] completado por [persona]
- [Ticket] en revisión
- [Ticket] bloqueado — [razón]

Plan de hoy:
- [Ticket] — [nombre del ingeniero]
- [Ticket] — [nombre del diseñador]

Bloqueos que necesitan atención del PM:
- [Bloqueo 1 — ¿qué necesito resolver hoy?]

Resume como un briefing de standup de 2 minutos que pueda leer en voz alta o publicar en Slack.
```

### Refinamiento del backlog (según sea necesario)

```
/user-story-writer

Refina estos elementos aproximados del backlog:

1. "[Idea aproximada o solicitud de parte interesada]"
   Contexto: [cualquier detalle adicional que tengas]

2. "[Idea aproximada]"
   Contexto: [...]

Para cada uno: escribe una historia de usuario completa con criterios de aceptación, casos límite, definición de hecho y estimación de puntos de historia. Señala si alguno necesita más descubrimiento antes de escribir.
```

### Comunicaciones con partes interesadas

```
/product-manager-toolkit

Escribe una actualización para partes interesadas para [audiencia — equipo ejecutivo / CEO / ventas / customer success]:

Resultado del Sprint [N]: [entregado / no entregado / parcial]
Entregable clave: [qué se entregó que les importa]
Impacto: [qué habilita esto — valor para el cliente o métrica de negocio]
Lo siguiente: [elemento principal del Sprint N+1]
Riesgos o decisiones que necesitan de ellos: [lista]

Que no supere un mensaje de Slack o un email corto. Sin párrafos de viñetas.
```

---

## Flujos de trabajo clave por escenario

### Nueva solicitud de función de un cliente o parte interesada

```
Paso 1: ¿Es esto real?
/product-discovery

Solicitud del cliente: "[pegar la solicitud o pregunta sobre la función]"
Fuente: [cliente empresarial / 15 tickets de soporte separados / CEO / un usuario avanzado]

Analiza:
- ¿Es esto un síntoma o el trabajo real a realizar?
- ¿Cuántos clientes tienen este problema?
- ¿Qué están haciendo hoy como solución alternativa?
- ¿Resolver esto se alinea con nuestra tesis de producto?
- ¿Qué tendríamos que creer para que esto esté en las 5 prioridades principales?

Paso 2: Si es real — escribe la historia
/user-story-writer

Brief de función: [pegar lo que aprendiste del paso 1]
Escribe la historia de usuario lista para la planificación del sprint.

Paso 3: Tamaño y priorización
/product-manager-toolkit

Agrega esta historia a mi matriz de priorización.
Candidatos actuales: [lista de elementos del backlog existentes]
Puntuaciones RICE: [Alcance, Impacto, Confianza, Esfuerzo]
¿Dónde aterriza esta nueva historia en el orden de prioridad?
```

### PRD para una función significativa

```
/code-to-prd

Escribe un PRD para: [NOMBRE DE LA FUNCIÓN]

Problema: [qué problema resuelve y para quién]
Evidencia: [investigación con clientes, datos de soporte, análisis que muestra la brecha]
Alcance: [qué está dentro y qué está explícitamente fuera de esta versión]
Métrica de éxito: [la única métrica que prueba que esta función tuvo éxito]
Cronograma: [sprint objetivo o fecha]
Dependencias: [otros equipos, APIs, trabajo de diseño necesario]

Genera el PRD completo: declaración del problema, objetivos y no-objetivos, historias de usuario, métricas de éxito, preguntas abiertas, fuera del alcance.
```

### Planificación trimestral del roadmap

```
/product-roadmap

Construye el roadmap de producto para [TRIMESTRE/AÑO].

Temas de entrada (de investigación con clientes, objetivos de negocio, deuda técnica):
Tema 1: [descripción] — importancia estratégica: [por qué esto importa ahora]
Tema 2: [descripción]
Tema 3: [descripción]

Restricciones:
- Capacidad de ingeniería: [N semanas-ingeniero]
- Capacidad de diseño: [N semanas-diseñador]
- Fechas límite fijas: [cualquier compromiso ya asumido]
- No negociables: [cualquier cosa que deba entregarse independientemente de la priorización]

Produce: un roadmap AHORA / PRÓXIMO / DESPUÉS con justificación por elemento, dependencias y riesgos.
```

### Análisis post-lanzamiento

```
/product-analytics

Analiza el rendimiento de [FUNCIÓN] lanzada el [FECHA].

Métricas disponibles:
- Adopción: [X% de usuarios activaron la función en las primeras 2 semanas]
- Impacto en retención: [retención D14 para usuarios de la función vs. control: X% vs. Y%]
- Embudo: [X usuarios la vieron, Y activaron, Z completaron el flujo principal]
- Tickets de soporte: [N tickets relacionados con esta función desde el lanzamiento]
- Comentarios de NPS mencionándola: [pegar comentarios relevantes]

Dime:
1. ¿Funciona esta función? (señal fuerte / señal débil / demasiado pronto para saber)
2. ¿Qué sugieren los datos que hagamos a continuación? (iterar, expandir, retirar o esperar)
3. ¿Cuál es la única métrica que debo rastrear semanalmente para saber si está mejorando?
```

---

## Plan de incorporación de 30 días (PM uniéndose a un nuevo equipo o producto)

### Semana 1 — Contexto y descubrimiento
- Instala todas las habilidades de PM mediante los comandos anteriores
- Ejecuta `/product-discovery` en los 3 principales puntos de dolor del cliente que has escuchado
- Habla con 5 clientes — usa la guía de entrevistas de `/product-discovery`
- Mapea el producto existente con `/competitive-teardown` (tu propio producto, no un competidor) — entiende qué tienes

### Semana 2 — Backlog y ritmo de sprint
- Ejecuta `/pm-sprint-review` en los últimos 3 sprints — entiende la velocidad y los bloqueos recurrentes
- Revisa los 20 principales elementos del backlog con `/user-story-writer` — evalúa la calidad y refina las peores historias
- Asiste a todos los rituales del sprint — aún no los dirijas, solo observa

### Semana 3 — Roadmap y partes interesadas
- Usa `/product-roadmap` para mapear lo que existe y lo que se ha comprometido
- Usa `/product-manager-toolkit` para construir un mapa de partes interesadas — ¿quién tiene influencia sobre las decisiones del roadmap?
- Redacta tu primera actualización para partes interesadas con `/product-manager-toolkit`

### Semana 4 — Tómalo en serio
- Ejecuta tu primera revisión completa del sprint con `/pm-sprint-review`
- Escribe tus primeras historias de usuario para el siguiente sprint con `/user-story-writer`
- Comparte tu tesis de producto para los próximos 30-60-90 días con el CPO — usa `/cpo-advisor` para ponerla a prueba

---

## Integraciones de herramientas

### Linear (recomendado para gestión de sprints)

```json
// Agregar a ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Con Linear conectado, Claude puede leer el estado del sprint, detalles de tickets e historial de ciclos — potenciando las revisiones de sprint sin copiar y pegar manualmente.

### Notion (para PRDs y roadmaps)

Conecta el MCP de Notion para que Claude pueda leer y actualizar tu base de datos de PRDs, vista del roadmap y notas de descubrimiento — manteniendo la documentación sincronizada con las decisiones.

### Amplitude / Mixpanel

Exporta datos de eventos como CSV o pega resultados de consultas en `/product-analytics`. Para análisis en tiempo real, la API de Amplitude puede conectarse mediante MCP para consultas de métricas en vivo durante las sesiones de planificación.

### Figma

Para la colaboración diseño-PM, Claude puede leer enlaces de Figma y referenciar contexto visual al escribir criterios de aceptación. Combina con `/user-story-writer` para escribir criterios que referencien estados de diseño específicos.

---

## Métricas a rastrear

### Salud del sprint

| Métrica | Objetivo | Señal de advertencia |
|---|---|---|
| Tasa de cumplimiento del objetivo del sprint | >70% | <50%: problema de planificación o alcance |
| Predictibilidad de velocidad | ±20% del promedio | Grandes oscilaciones: problema de estimación o trabajo no planificado |
| Trabajo no planificado | <20% de la capacidad del sprint | >30%: equipo reactivo, no proactivo |
| Precisión de puntos de historia | ±1 punto de promedio | Sobreestimaciones consistentes: margen de seguridad |

### Salud del producto

| Métrica | Objetivo (varía según producto) | Por qué importa |
|---|---|---|
| Adopción de función (D14) | >30% de usuarios activos | ¿Alguien usa lo que entregaste? |
| Tiempo hasta el valor | Decreciente | ¿Está mejorando el onboarding? |
| Tasa de tickets de soporte por función | Decreciente | ¿Está mejorando la calidad? |
| Impacto en NPS de nuevas funciones | Neutral a positivo | ¿Estás construyendo cosas que los usuarios aman? |
| Tasa de éxito de experimentos | >30% | ¿Están calibradas tus hipótesis? |

---

## Errores comunes de PM que Claude Code ayuda a evitar

**Error 1: Construir antes de validar**
`/product-discovery` te fuerza a enmarcar el problema y recopilar evidencia antes de escribir una palabra de especificación. Sin descubrimiento → sin historia.

**Error 2: Historias demasiado grandes para terminar en un sprint**
`/user-story-writer` incluye una verificación de tamaño y guía de división. Cualquier cosa estimada en > 5 puntos se divide antes de ir a la planificación del sprint.

**Error 3: Criterios de aceptación que no se pueden probar**
El verificador de calidad de criterios de aceptación en `/user-story-writer` señala criterios demasiado vagos para que un ingeniero de QA los pruebe. Cada criterio debe ser observable y específico.

**Error 4: Retrospectivas sin acción**
`/pm-sprint-review` impone un máximo de 2 elementos de acción de retrospectiva por sprint. Más de 2 significa que ninguno se hace.

**Error 5: Roadmap sin justificación**
`/product-roadmap` genera justificación para cada elemento del roadmap. Si no puedes explicar por qué algo está en el roadmap, no debería estar allí.

---

## Recursos

- [Primeros pasos con Claude Code](getting-started.md)
- [Flujo de trabajo de sprint de PM](../workflows/pm-sprint.md)
- [Habilidad de descubrimiento de producto](../skills/product/product-discovery.md)
- [Habilidad de escritor de historias de usuario](../skills/product/user-story-writer.md)
- [Habilidad de revisión de sprint](../skills/product/pm-sprint-review.md)
- [Agente asesor de CPO](../agents/advisors/cpo-advisor.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
