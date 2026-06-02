# Claude para Account Executives

Todo lo que un Account Executive necesita para gestionar deals con IA — revisiones de deals, planes de éxito mutuos, desarrollo de champions, respuestas a RFPs, posicionamiento competitivo y gestión de previsiones.

---

## Para quién es esto

Eres un Account Executive (AE) gestionando un pipeline de deals de mercado medio o enterprise. Tu día a día incluye revisiones de deals, llamadas con clientes, gestión de champions, redacción de propuestas, negociación y llamadas de previsión con tu manager. Pasas demasiado tiempo en tareas administrativas — construyendo diapositivas para revisiones de deals, reformateando respuestas a RFPs, puntuando MEDDPICC manualmente y escribiendo emails de seguimiento tras las llamadas. Claude Code se encarga del proceso para que puedas centrarte en la actividad que realmente cierra deals: hablar con compradores.

**Antes de Claude Code:** 45 minutos para preparar una diapositiva de revisión de deal. 2 horas para redactar una sección de respuesta a RFP. 30 minutos para escribir un plan de éxito mutuo desde cero. Puntuación MEDDPICC manual que siempre está desactualizada.

**Después:** Revisión de deal en 15 minutos con MEDDPICC puntuado y alertas de riesgo identificadas. Sección de respuesta a RFP en 10 minutos. Borrador de plan de éxito mutuo en 20 minutos. Paquete de habilitación para el champion en 15 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar todas las skills de AE
npx claudient add skills gtm

# O seleccionar individualmente:
npx claudient add skill gtm/deal-review
npx claudient add skill gtm/champion-builder
npx claudient add skill gtm/mutual-success-plan
npx claudient add skill gtm/deal-desk
npx claudient add skill gtm/rfp-responder
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
npx claudient add skill gtm/revenue-operations
npx claudient add agents advisors/cro-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Tu stack de Claude Code para AE

### Skills (comandos slash)

| Skill | Qué hace | Cuándo usarla |
|---|---|---|
| `/deal-review` | Puntuación MEDDPICC, alertas de riesgo, categoría de previsión, próximos pasos | Revisión semanal del pipeline, antes de llamada con el manager |
| `/champion-builder` | Identificación del champion, paquete de habilitación, scripts de reactivación | Cuando el champion es débil o ha dejado de responder |
| `/mutual-success-plan` | Plan de cierre conjunto: hitos, stakeholders, compromisos mutuos | Deals en etapa avanzada (Evaluación → Negociación) |
| `/deal-desk` | Estructuración del deal, aprobación de descuentos, revisión de condiciones contractuales | Condiciones complejas, precios no estándar |
| `/rfp-responder` | Secciones de respuesta a RFP/RFI, matrices de cumplimiento, resúmenes ejecutivos | Cualquier RFP/RFI recibido |
| `/commercial-forecaster` | Análisis de pipeline y previsión, puntuación de deals, proyecciones de ingresos | Llamadas semanales de previsión |
| `/crm-hygiene` | Limpieza de contactos/deals, auditoría de pipeline estancado, deduplicación | Salud mensual del CRM |
| `/hubspot` | Lectura/escritura directa en HubSpot CRM | Registro de notas, actualización de etapas de deals |
| `/revenue-operations` | Métricas de pipeline, tasas de conversión por etapa, análisis de ARR | QBRs, planificación de territorio |

### Agentes

| Agente | Modelo | Cuándo invocarlo |
|---|---|---|
| `cro-advisor` | Opus | Deals complejos con múltiples stakeholders, estrategia de negociación, manejo de objeciones a nivel ejecutivo |
| `competitive-analyst` | Sonnet | Inteligencia competitiva en tiempo real, posicionamiento frente a competidores específicos |

---

## Flujo de trabajo diario

### Mañana — Revisión del pipeline (15-30 minutos)

**1. Identificación de deals prioritarios:**
```
/commercial-forecaster

Revisión matutina del pipeline. Muéstrame:
- ¿Qué deals están en Commit esta semana?
- ¿Qué deals en Commit tienen mayor riesgo (brechas MEDDPICC, fecha de cierre pospuesta)?
- ¿Qué deals en Best Case han avanzado o retrocedido en los últimos 7 días?
- ¿Algún deal que no he tocado en 14+ días?

Datos del CRM: [pega tu pipeline abierto de HubSpot/Salesforce, o conéctate mediante MCP]
```

**2. Revisión de deal para la llamada de esta semana con el manager:**
```
/deal-review

Revisión MEDDPICC para [nombre del deal].

Empresa: [nombre]
Tamaño del deal: $[ACV]
Etapa: [etapa]
Fecha de cierre: [fecha]

[pega tus notas de discovery, hilos de email o notas de reunión]

Puntúa cada dimensión MEDDPICC, identifica los 3 principales riesgos y recomienda una categoría de previsión.
```

---

### Trabajo activo en deals (la mayor parte del día)

**3. Desarrollo del champion:**
```
/champion-builder

Evalúa a [nombre del contacto] como champion para [deal].

Interacciones hasta ahora: [resumen de reuniones y emails]
Pruebas del champion: [¿qué evidencia tienes para cada una de las 4 pruebas?]

Dime:
- ¿Esta persona es un champion sólido, un contacto pasivo o un coach?
- ¿Qué evidencia respalda la evaluación?
- ¿Qué acción específica debo tomar hoy para fortalecer o encontrar un mejor champion?
```

**4. Plan de éxito mutuo (deals en etapa avanzada):**
```
/mutual-success-plan

Crea un plan de éxito mutuo para [deal].

Comprador: [empresa], Champion: [nombre/cargo], Comprador económico: [nombre/cargo]
Tamaño del deal: $[ACV], Cierre objetivo: [fecha]
Etapa actual: transición de Evaluación → Negociación
Pasos restantes antes de la firma: [lo que sabes que queda]

Produce un documento MSP completo que pueda compartir con el champion hoy.
Incluye: definición de éxito, tabla de hitos, compromisos mutuos, registro de riesgos.
```

**5. Respuesta a RFP:**
```
/rfp-responder

Responde a esta sección del RFP.

Pregunta del RFP: [pega la pregunta]
Nuestro producto: [descripción en un párrafo]
Nuestros diferenciadores para este comprador: [específicos para esta cuenta y sus criterios]
Límite de palabras: [si se especifica]

Escribe una respuesta que responda directamente, demuestre adecuación y no use frases vacías.
```

---

### Tras la llamada — Registro y seguimiento (10-15 minutos)

**6. Resumen de la llamada y actualización del CRM:**
```
Acabo de terminar una llamada con [nombre, cargo] en [empresa].

Puntos clave:
[viñetas de lo que se discutió — toma 2 minutos de notas rough inmediatamente después de la llamada]

Produce:
1. Una nota para el CRM (3-4 párrafos — qué se discutió, qué aprendimos, próximos pasos acordados)
2. Un email de seguimiento para enviar hoy
3. Actualización MEDDPICC: ¿qué dimensiones cambiaron según lo que escuché?
4. La cosa más importante que debo hacer antes de la próxima llamada con esta cuenta

/hubspot — Registra la nota del CRM para [nombre del contacto] en [empresa].
```

---

### Fin de semana — Previsión e higiene del pipeline

**7. Preparación de la previsión:**
```
/commercial-forecaster

Prepara mi previsión semanal.

Mis deals:
[pega tu lista de pipeline con etapa, ACV, fecha de cierre y categoría de previsión actual]

Para cada deal en Commit: puntúa la confianza del 1 al 10 con razonamiento.
Para cada deal en Best Case: ¿qué tendría que ocurrir para mover a Commit esta semana?
Para cualquier deal que deba eliminar de la previsión: márcalo.

Mi cuota semanal: $[X] en nuevo ARR.
```

**8. Higiene del pipeline:**
```
/crm-hygiene

Audita mi pipeline en busca de datos estancados e inexactos.

Mi pipeline abierto: [pega la lista de deals con la fecha de última actividad, etapa y fecha de cierre]

Marca:
- Deals con fecha de cierre en el pasado que no están en Cerrado Ganado o Perdido
- Deals sin actividad en 30+ días (por normas de etapa: Discovery >30 días, Evaluación >45 días)
- Deals donde la etapa no coincide con la puntuación MEDDPICC
- Registros duplicados de contacto o empresa

Para cada deal estancado: recomienda una acción — actualizar / desactivar / investigar.
```

---

## Plan de incorporación de 30 días (nuevos AEs o al incorporarse a un nuevo segmento)

### Semana 1 — Configuración e inventario de deals
- Instala todas las skills de GTM: `npx claudient add skills gtm`
- Conecta HubSpot mediante MCP (ver integraciones de herramientas más abajo)
- Ejecuta `/deal-review` en cada deal del pipeline heredado — obtén una puntuación MEDDPICC base
- Ejecuta `/commercial-forecaster` en tu pipeline completo — identifica qué deals son reales vs. estancados

### Semana 2 — Discovery y desarrollo del champion
- Ejecuta la evaluación `/champion-builder` en tus 3 deals principales — ¿quién es tu champion real?
- Usa el agente `/cro-advisor` para tu deal de mayor valor — obtén una estrategia para cada brecha MEDDPICC
- Practica o revisa respuestas a RFPs de tu producto usando `/rfp-responder`
- Configura tu plantilla de revisión de deal para que la preparación antes de las llamadas con el manager tarde menos de 15 minutos

### Semana 3 — Mecánicas de etapa avanzada y cierre
- Usa `/mutual-success-plan` para cada deal en Evaluación o posterior — crea un plan de cierre
- Ejecuta `/deal-desk` en cualquier deal con condiciones no estándar — entiende tu autoridad de descuento
- Practica `/competitive-analyst` para tus 2-3 competidores principales — sabe cómo ganar la comparación
- Revisa la precisión de tu previsión de las semanas 1-2 frente a los resultados reales

### Semana 4 — Optimización e informes
- Preparación para el QBR: usa `/revenue-operations` para obtener tus métricas de pipeline y tasas de conversión
- Identifica tu dimensión MEDDPICC más débil en todos los deals — ¿cuál es la que más deals te cuesta?
- Usa `/crm-hygiene` para limpiar el pipeline heredado — elimina deals muertos, actualiza etapas
- Realiza una evaluación del champion en cada deal activo — mapea dónde estás expuesto

---

## Integraciones de herramientas

### HubSpot (CRM recomendado)

```json
// Añadir a ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "tu-token-aquí"
      }
    }
  }
}
```

Con HubSpot MCP conectado:
- Registra notas de llamadas directamente: `Claude, registra esta nota de llamada para [contacto] en [empresa] en HubSpot`
- Actualiza la etapa del deal: `Mueve [nombre del deal] a Negociación en HubSpot`
- Obtén el pipeline abierto: `Obtén todos mis deals abiertos en HubSpot, incluye etapa, ACV y fecha de cierre`
- Crea una tarea de seguimiento: `Crea una tarea en HubSpot para hacer seguimiento con [contacto] el [fecha]`

### Gong / Chorus (grabación de llamadas)

Pega las transcripciones de llamadas en Claude Code para:
- Actualización MEDDPICC tras la llamada
- Redacción de emails de seguimiento
- Actualización de la evaluación del champion según lo escuchado
- Generación de notas para el CRM

```
Aquí está la transcripción de mi llamada con [contacto] en [empresa]:
[pega la transcripción de Gong]

Extrae:
1. Qué dimensiones MEDDPICC se confirmaron o actualizaron
2. Cualquier señal de alerta que deba comunicar a mi manager
3. El email de seguimiento que debo enviar hoy
4. La nota del CRM que debo registrar
```

### Salesforce

Pega los datos de oportunidades de Salesforce en cualquier prompt de `/deal-review` o `/commercial-forecaster`. Para integración directa con Salesforce, configura el servidor MCP de Salesforce si está disponible en tu stack.

### DocuSign / PandaDoc (gestión de contratos)

Usa `/deal-desk` para revisar las condiciones comerciales antes de enviarlas a legal. Pega las cláusulas clave en `/deal-desk` para una evaluación de riesgos antes de la firma final.

### Slack (canales de deal room)

Para deals grandes, mantén un canal Slack `#deal-[empresa]`. Pega las actualizaciones de ese canal en `/deal-review` para una revisión rápida del estado del deal antes de una llamada con el manager.

---

## Métricas a seguir

Extráelas de HubSpot o Salesforce semanalmente usando `/revenue-operations`:

| Métrica | Objetivo (AE en rampa) | Objetivo (cuota completa) |
|---|---|---|
| Deals con MEDDPICC completo | >80% del pipeline activo | 100% |
| MSP en vigor para deals en etapa avanzada | >90% de Evaluación+ | 100% |
| Precisión de previsión (Commit → Ganado) | >60% | >80% |
| Tiempo medio del ciclo de deal | Seguimiento vs. media del equipo | En o por debajo de la media del equipo |
| Tasa de cierre (Evaluación → Ganado) | Seguimiento vs. cohorte | En o por encima de la cohorte |
| Actividad por deal por semana | 2+ contactos significativos | 2+ contactos significativos |
| Cobertura del pipeline (vs. cuota) | 3x | 4x |
| Tasa de actualización del CRM (notas registradas) | 90% en 24h | 100% |

---

## Errores comunes (y cómo Claude Code ayuda a evitarlos)

**Error 1: Avanzar deals sin un comprador económico confirmado**
`/deal-review` marca un comprador económico ausente como una brecha MEDDPICC Crítica. No te dejará llamar a un deal Commit sin él.

**Error 2: Tratar a un contacto pasivo como champion**
`/champion-builder` aplica las cuatro pruebas del champion. Un contacto que no te ha dado acceso al comprador económico es un coach, no un champion. La skill te lo dice explícitamente.

**Error 3: Construir un plan de éxito mutuo que el comprador nunca ve**
Un MSP solo funciona si ambas partes lo aceptan. La skill incluye una plantilla de email para enviárselo a tu champion para su revisión antes de que lo vea el comprador económico.

**Error 4: Dejar deals estancados en Commit**
`/commercial-forecaster` marca deals con última actividad >14 días. Los deals en Commit sin actividad son inflación de la previsión, no pipeline real.

**Error 5: Respuestas a RFPs que no responden la pregunta real**
`/rfp-responder` responde primero la pregunta específica del RFP y luego la apoya con evidencia — no entierra la respuesta en un párrafo de marketing.

---

## Recursos

- [Cómo empezar con Claude Code](../getting-started.md)
- [Flujo de trabajo del ciclo de deal para AE](../workflows/ae-deal-cycle.md)
- [Skill de deal desk](../skills/gtm/deal-desk.md)
- [Skill de RFP responder](../skills/gtm/rfp-responder.md)
- [Agente CRO Advisor](../agents/advisors/cro-advisor.md)
- [Agente competitive analyst](../agents/roles/competitive-analyst.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
