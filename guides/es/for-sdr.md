# Claude para SDRs

Todo lo que un Representante de Desarrollo de Ventas necesita para ejecutar prospección, contacto, gestión de respuestas y administración de pipeline potenciados por IA en Claude Code.

---

## Para quién es esto

Eres SDR, BDR o representante de ventas cuyo trabajo es generar pipeline calificado — encontrar las cuentas correctas, contactarlas, reservar reuniones y transferir a los AEs. Pasas demasiado tiempo en investigación, redacción de emails y gestión de la bandeja de entrada. Claude Code reduce eso entre 30-40x.

**Antes de Claude Code:** 20 minutos por cuenta investigada. 15 minutos por email personalizado. 2-4 horas al día en la bandeja de entrada. Actualizaciones manuales de CRM después de cada llamada.

**Después:** Brief completo de cuenta en 30 segundos. Email personalizado en 30 segundos. Bandeja de entrada clasificada y respuestas redactadas en 8 minutos. CRM actualizado automáticamente desde transcripciones de llamadas.

---

## Instalación en 30 segundos

```bash
# Instalar todas las habilidades, agentes y flujos de trabajo de SDR
npx claudient add skills gtm
npx claudient add agents roles/sdr-agent

# O seleccionar lo que necesitas:
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/sdr-agent
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

---

## Tu stack de Claude Code para SDR

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/sdr-research-brief` | Dossier de cuenta de 30 segundos con disparadores, puntuación ICP, mapa de partes interesadas | Antes de cualquier contacto |
| `/sdr-agent` | Flujo de trabajo SDR de extremo a extremo — investigar → redactar → aprobar → enviar → registrar | Sesiones completas de pipeline |
| `/sdr-reply-classifier` | Clasificar bandeja de entrada: clasificar intención, redactar respuesta, actualizar CRM | Revisión de bandeja de entrada dos veces al día |
| `/sdr-call-prep` | Guiones de conversación, scripts de objeciones, preguntas de descubrimiento para cualquier llamada | 30 min antes de llamar |
| `/sdr-call-analysis` | Transcripción post-llamada → nota de CRM + feedback de coaching + seguimiento | Después de cada llamada |
| `/sdr-objection-handler` | Rebate dinámico de objeciones por precio, competidor, timing, confianza | A demanda, cualquier canal |
| `/sdr-territory-mapper` | Análisis de espacio en blanco, cuentas prioritarias, plan de territorio | Planificación semanal/trimestral |
| `/sdr-lead-scorer` | Puntuación de ajuste ICP 0-100 con nivel y acción recomendada | Priorización de listas de leads |
| `/email-automation` | Diseño de secuencias de múltiples pasos, entregabilidad, enrutamiento de respuestas | Construcción de nuevas secuencias |
| `/lead-enrichment` | Pipeline de Apollo/Clearbit/Firecrawl para enriquecer y puntuar leads | Enriquecimiento masivo |
| `/crm-hygiene` | Limpieza de HubSpot/Salesforce, deduplicación, contactos obsoletos, propiedad | Salud mensual del CRM |
| `/hubspot` | Acceso nativo al CRM de HubSpot — leer/escribir contactos, tratos, notas | Trabajo directo en el CRM |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `sdr-agent` | Opus (investigación) / Sonnet (borradores) | Sesiones completas de investigación a contacto |
| `market-researcher` | Sonnet | Investigación profunda de cuentas o mercados |
| `competitive-analyst` | Sonnet | Inteligencia competitiva para preparación de objeciones |

---

## Flujo de trabajo diario

### Mañana (30-60 minutos)

**1. Brief de territorio — en qué enfocarse hoy**
```
/sdr-territory-mapper

Muéstrame las cuentas prioritarias de hoy:
- ¿Qué cuentas de nivel A aún no han sido contactadas?
- ¿Nuevas señales de disparador en cuentas en mi pipeline?
- ¿Qué secuencias están en el Día 3 o Día 7 (necesitan seguimiento hoy)?
```

**2. Puntuación de leads — nuevos leads de la noche anterior**
```
/sdr-lead-scorer

[Pegar cualquier nuevo lead entrante, registro de eventos o exportaciones de Apollo]

Puntúa según el ICP y dame la lista de nivel A para llamar hoy.
```

**3. Lote de contacto — investigar + redactar para los objetivos de hoy**
```
/sdr-agent

Investiga y redacta contacto personalizado para:
1. [Empresa 1] — contacto: [Nombre, Título]
2. [Empresa 2] — contacto: [Nombre, Título]
3. [Empresa 3] — contacto: [Nombre, Título]

Mi producto: [una línea]
Mi ICP: [definición]
Muéstrame todos los borradores para revisión antes de programar.
```

---

### Mediodía (15-20 minutos)

**4. Clasificación de bandeja de entrada — clasificación de respuestas**
```
/sdr-reply-classifier

Aquí están mis respuestas de esta mañana:

Respuesta 1 (de: nombre@empresa.com):
[pegar respuesta]

Respuesta 2 (de: nombre@empresa.com):
[pegar respuesta]

Clasifica cada una, redacta respuestas para respuestas interesadas/con objeciones,
actualiza el CRM, notifícame de cualquier lead caliente.
```

---

### Pre-llamada (2-5 minutos)

**5. Preparación de llamada — cualquier llamada en la próxima hora**
```
/sdr-call-prep

Nombre: [nombre del prospecto]
Título: [título]
Empresa: [empresa]
Tipo de llamada: [fría / seguimiento / descubrimiento]
Objetivo: [reservar descubrimiento de 20 minutos]
Mi producto: [una línea]
Disparador reciente: [lo que sabes sobre ellos]

Dame: guión de apertura, guión de conversación, top 3 objeciones + respuestas, mensaje de voz.
```

---

### Post-llamada (2-5 minutos)

**6. Análisis de llamada — registrar y aprender**
```
/sdr-call-analysis

[Pegar transcripción de llamada o notas]

Prospecto: [nombre, título, empresa]
Tipo de llamada: llamada fría
Objetivo: reservar reunión de descubrimiento
Resultado: [qué pasó]

Extrae: nota de CRM, próximo paso, objeciones planteadas, feedback de coaching, borrador de email de seguimiento.
```

---

### Semanal (viernes — 30 minutos)

**7. Revisión de territorio e informe de pipeline**
```
/sdr-territory-mapper

Revisión semanal:
- Reuniones reservadas esta semana: [N]
- Secuencias lanzadas: [N]
- Respuestas recibidas: [N]
- Espacio en blanco restante: [N]

Muéstrame: qué cuentas priorizar la próxima semana, disparadores que me perdí,
y si voy por buen camino para mi cuota mensual de reuniones.
```

---

## Plan de incorporación de 30 días (nuevos SDRs)

### Semana 1 — Configuración y dominio de la investigación
- Instala todas las habilidades de SDR mediante `npx claudient add skills gtm`
- Configura el MCP de HubSpot (ver habilidad `/hubspot` para la configuración)
- Ejecuta `/sdr-territory-mapper` en tu lista inicial de cuentas
- Puntúa 50+ cuentas con `/sdr-lead-scorer` — familiarízate con tu ICP
- Lee: biblioteca completa de `/sdr-objection-handler` antes de tu primera llamada

### Semana 2 — Lanzamiento de contacto
- Usa `/sdr-research-brief` para cada cuenta antes del primer contacto
- Redacta los primeros 20 emails con `/sdr-agent` — revisa cada uno cuidadosamente
- Comienza a rastrear: tiempo por email (objetivo: menos de 5 minutos con Claude)
- Usa `/sdr-call-prep` para cada llamada fría — no improvisar

### Semana 3 — Gestión de respuestas y análisis de llamadas
- Ejecuta `/sdr-reply-classifier` en cada respuesta — no clasifiques manualmente
- Graba cada llamada, ejecuta `/sdr-call-analysis` en la transcripción
- Compara tu manejo de objeciones con el playbook — identifica la 1 objeción que sigues perdiendo
- Usa `/sdr-objection-handler` para practicar las objeciones en las que eres más débil

### Semana 4 — Optimización
- Ejecuta tu primera sesión de planificación de territorio con `/sdr-territory-mapper`
- Revisa todos los análisis de llamadas — ¿qué patrones están emergiendo?
- Identifica tus ganchos de email con mejor rendimiento (mayor tasa de respuesta) y construye variantes
- Informa a tu gerente con datos de tu CRM

---

## Integraciones de herramientas

### HubSpot (CRM recomendado)

```json
// Agregar a ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Con esto conectado, Claude puede:
- Leer y escribir contactos, empresas, tratos y notas
- Actualizar etapas del ciclo de vida y asignaciones de propietario
- Crear tareas de seguimiento desde el análisis de llamadas
- Ejecutar higiene del CRM en tu territorio

### Gmail / Outlook
Usa Claude Code para redactar emails → pega en tu cliente de correo → envía.
Para envío automatizado, integra mediante n8n o Make con el nodo de Gmail.

### Apollo.io / Seamless.ai
Exporta leads como CSV → pega en `/sdr-lead-scorer` → obtén una lista priorizada.
Para enriquecimiento en tiempo real, usa la habilidad `/lead-enrichment` con la API de Apollo.

### Gong / Aircall / Fireflies
Obtén la transcripción de la llamada → pega en `/sdr-call-analysis` → extrae nota de CRM, coaching, seguimiento.
Para análisis automatizado post-llamada, configura un webhook que dispare `/sdr-call-analysis` cuando la grabación esté lista.

### n8n (orquestación de automatización)
```
Automatiza el ciclo completo:
- Nuevo lead entrante → /sdr-lead-scorer → enrutar al SDR o nutrir
- Nueva respuesta recibida → /sdr-reply-classifier → borrador + alerta en Slack
- Llamada completada → transcripción → /sdr-call-analysis → actualización de HubSpot
```

---

## Métricas a rastrear

Usa Claude Code para extraer estas de HubSpot semanalmente:

| Métrica | Objetivo (etapa inicial) | Objetivo (SDR consolidado) |
|---|---|---|
| Cuentas investigadas/día | 10 | 20 |
| Emails de contacto enviados/semana | 50 | 150 |
| Tasa de respuesta | >5% | >8% |
| Tasa de respuesta positiva | >1.5% | >3% |
| Reuniones reservadas/semana | 3-5 | 8-12 |
| Tasa de llamada a reunión | 5% | 10% |
| Tiempo por cuenta (investigación + borrador) | <10 min | <5 min |
| Tasa de actualización de CRM | 90% | 100% |

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Enviar contacto genérico**
Claude Code te fuerza a investigar un disparador antes de redactar. Sin disparador = sin email.

**Error 2: No registrar llamadas en el CRM**
`/sdr-call-analysis` genera la nota de CRM para ti — pega y listo.

**Error 3: Mal manejo de objeciones**
`/sdr-objection-handler` tiene 20+ scripts. Ejecútalos antes de cada llamada. Practica los que fallas.

**Error 4: Contactar prospectos que optaron por no recibir mensajes**
`/crm-hygiene` mantiene tu CRM limpio. Siempre verifica antes de agregar a una secuencia.

**Error 5: Enfocarse en las cuentas incorrectas**
`/sdr-territory-mapper` y `/sdr-lead-scorer` priorizan por ti. Trabaja primero el nivel A.

---

## Recursos

- [Primeros pasos con Claude Code](../getting-started.md)
- [Configuración del MCP de HubSpot](../mcp/hubspot.md)
- [Flujo de trabajo diario del SDR](../workflows/sdr-daily.md)
- [Guía de secuencias de email](../skills/gtm/email-automation.md)
- [Biblioteca completa de manejo de objeciones](../skills/gtm/sdr-objection-handler.md)

---
