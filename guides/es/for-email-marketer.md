# Claude para Especialistas en Email Marketing

Todo lo que un especialista en email marketing necesita para ejecutar campañas asistidas por IA — higiene de listas, capacidad de entrega, pruebas A/B, flujos de automatización, redacción publicitaria e informes de rendimiento.

---

## Para quién es esto

Eres un especialista en email marketing, gestor de CRM o marketero de ciclo de vida cuyo trabajo es adquirir, involucrar y retener clientes a través del correo electrónico. Escribes campañas, gestionas flujos de automatización, mantienes la salud de las listas, ejecutas pruebas divididas e informas sobre el rendimiento del programa.

**Antes de Claude Code:** Del brief de campaña al envío en vivo: 2-3 días. Análisis de pruebas A/B: 45 minutos de trabajo en hojas de cálculo. Auditoría de capacidad de entrega: un ticket al equipo de soporte de tu ESP. Informe mensual: 3 horas.

**Después:** Borrador de campaña en 25 minutos. Prueba A/B interpretada en 5 minutos. Auditoría de capacidad de entrega realizada por ti mismo (sin ticket necesario). Informe mensual en 30 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar la pila completa de email marketing
npx claudient add skills marketing/email-sequence
npx claudient add skills small-business/email-campaign
npx claudient add skills marketing/onboarding-cro
npx claudient add skills marketing/analytics-tracking
npx claudient add skills marketing/email-deliverability
npx claudient add skills marketing/email-ab-tester
npx claudient add agents advisors/cmo-advisor
```

---

## Tu pila de Claude Code para email marketing

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/email-deliverability` | Auditoría de capacidad de entrega: SPF/DKIM/DMARC, disparadores de spam, higiene de listas, calendario de calentamiento | Cuando las tasas de apertura caen, al configurar un nuevo dominio, auditoría trimestral |
| `/email-ab-tester` | Diseño de pruebas A/B, cálculo del tamaño de muestra, interpretación de resultados | Cada campaña donde tengas capacidad de prueba dividida |
| `/email-sequence` | Secuencias automatizadas: bienvenida, nutrición, reactivación, post-compra | Construir u optimizar flujos automatizados |
| `/email-campaign` | Texto de campaña única, líneas de asunto, texto de vista previa, CTA | Creación de campañas |
| `/onboarding-cro` | Optimización del correo de incorporación — eventos de activación, puntos de fricción | Flujos de incorporación de nuevos usuarios/clientes |
| `/analytics-tracking` | Análisis de rendimiento de correo, atribución, análisis de cohortes | Informes semanales y mensuales |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `cmo-advisor` | Sonnet | Estrategia del programa — combinación de canales, estrategia de segmentación, asignación de presupuesto |

---

## Flujo de trabajo diario

### Revisión de rendimiento de campaña matutina (15 minutos)

Empieza cada día sabiendo qué está funcionando:

```
/analytics-tracking

Revisión matutina del programa de correo — [FECHA]:

Métricas de ayer:
- Campañas enviadas: [lista + volumen de envío de cada una]
- Tasas de apertura: [X%] vs. [X% promedio de 30 días]
- Tasas de clics: [X%] vs. [X% promedio de 30 días]
- Ingresos atribuidos: [$X]
- Cancelaciones de suscripción: [X] (marcar si > 0,5% por campaña)
- Quejas de spam: [X] (marcar si > 0,1%)
- Rebotes duros: [X] (marcar si > 0,5%)

Flujos automatizados (ventana de 24 horas):
- Serie de bienvenida: [correos enviados, tasa de apertura promedio]
- Carrito abandonado: [correos enviados, tasa de recuperación]
- Post-compra: [correos enviados, tasa de clics promedio]

Marca cualquier elemento que requiera atención hoy.
```

---

### Gestión de listas (10-15 minutos por semana)

**Revisión semanal de higiene:**

```
/email-deliverability

Revisión de higiene de listas para la semana del [fecha]:

Métricas actuales de la lista:
- Total de suscriptores activos: [X]
- Nuevos suscriptores esta semana: [X]
- Cancelaciones esta semana: [X]
- Rebotes duros esta semana: [X]
- Rebotes suaves (3+): [X]
- Inactivos > 90 días (sin apertura): [X]
- Inactivos > 180 días (sin apertura): [X]

Importación de nueva fuente esta semana: [sí/no — si sí, describe la fuente y el volumen]

Acciones necesarias:
- Qué suprimir de inmediato
- Qué poner en reactivación
- Si alguna importación reciente necesita verificación
```

---

### Redacción de correos

**Correo de campaña:**

```
/email-campaign

Campaña: [nombre y objetivo]
Segmento de audiencia: [quiénes, cuántos]
Objetivo: [acción específica que quieres que realicen]
Oferta o mensaje clave: [qué estás enviando — promoción / contenido / anuncio]
Voz de marca: [formal / conversacional / directa]

Produce:
- Línea de asunto (+ variante A/B)
- Texto de vista previa (50 caracteres)
- Borrador del correo (con encabezado, cuerpo, CTA)
- Recomendación de hora de envío para este segmento y objetivo
- Notas de vista previa móvil (cómo se lee en 375px de ancho)
```

**Correo de secuencia automatizada:**

```
/email-sequence

Secuencia: [nombre — p. ej., Serie de Bienvenida, Post-Compra, Reactivación]
Posición del correo: [Día X, Correo N de N]
Qué vino antes: [resumen del correo anterior]
Objetivo de este correo: [qué etapa del viaje sirve]
Segmento: [quién lo recibe]

Escribe este correo en el contexto de la secuencia completa — haz referencia a lo que hemos establecido, constrúyelo, llévalo a la siguiente etapa.
```

---

### Trabajo de pruebas A/B

**Diseñar una nueva prueba:**

```
/email-ab-tester

Campaña: [describe]
Lo que quiero probar: [línea de asunto / CTA / hora de envío / longitud del correo / encuadre de la oferta]
Tamaño de lista disponible: [X suscriptores]
Métrica de referencia que intento mejorar: [tasa de apertura X% / tasa de clics X% / conversión X%]
Mi hipótesis: [formato Si/Entonces/Porque]

Diseña la prueba: aísla la variable, calcula el tamaño de muestra, define los criterios de éxito, establece la regla de decisión.
```

**Interpretar resultados:**

```
/email-ab-tester

Interpreta estos resultados:
Prueba: [qué se probó]
Variante A: [descripción] — [X% métrica] — [N envíos]
Variante B: [descripción] — [X% métrica] — [N envíos]

¿Es esto significativo? ¿Qué debo hacer con este resultado? ¿Qué principio me enseña?
```

---

## Ritmo semanal

### Lunes — Planificación de campañas

```
/email-campaign

Planifica los correos de esta semana:

Contexto empresarial: [¿hay promociones, lanzamientos de productos, eventos de temporada esta semana?]
Segmentos a segmentar: [lista de segmentos y fecha de último envío]
Objetivo de frecuencia de correo: [X correos esta semana a la lista principal, X a segmentos]
Pruebas A/B activas esta semana: [lista — no envíes a audiencias de prueba hasta que concluya la prueba]

Produce: calendario de campañas para la semana con fechas de envío, segmentos, objetivos y opciones de línea de asunto.
```

### Miércoles — Auditoría de automatización

Elige un flujo de automatización para revisar cada semana:

```
/email-sequence

Modo de auditoría — [NOMBRE DEL FLUJO]:

Estadísticas del flujo actual:
- Correo 1: [asunto, tasa de apertura, tasa de clics, tasa de cancelación]
- Correo 2: [asunto, tasa de apertura, tasa de clics]
- [etc.]

Conversión del correo 1 a la finalización del objetivo: [X%]

¿Cuál es el eslabón más débil en esta secuencia? ¿Dónde se están perdiendo personas? ¿Qué debo probar o reescribir?
```

### Viernes — Informe de rendimiento semanal

```
/analytics-tracking

Informe semanal del programa de correo para [semana]:

Métricas de campaña:
[Lista cada campaña: nombre, segmento, aperturas, clics, ingresos, cancelaciones]

Rendimiento de flujos de automatización:
[Lista los flujos principales: correos enviados, tasa de apertura, tasa de conversión vs. semana anterior]

Salud de la lista:
- Nuevos suscriptores netos: [X] (nuevos brutos menos cancelaciones)
- Tasa de crecimiento de la lista: [X%]
- Tasa de participación activa (abrió en los últimos 90 días / total): [X%]

Capacidad de entrega:
- Tasa de rebote: [X%]
- Tasa de quejas de spam: [X%]
- Ubicación en bandeja de entrada (si se rastrea): [X%]

Pruebas A/B concluidas esta semana: [resultados y aprendizajes]

Produce: resumen semanal (3 viñetas para liderazgo) + sección detallada para mis registros.
¿Qué necesito priorizar la próxima semana?
```

---

## Plan de 30 días

### Semana 1 — Fundamentos de capacidad de entrega

- Instala todas las habilidades de email marketing
- Ejecuta una auditoría completa de capacidad de entrega con `/email-deliverability` — autenticación, higiene de listas, puntuaciones de spam
- Verifica los registros SPF/DKIM/DMARC y corrige cualquier brecha de inmediato
- Establece tu segmentación de listas: activa (< 90 días) / ligeramente activa (90-180 días) / inactiva (180+ días)
- Nunca envíes a inactivos mezclados con activos hasta que hayas ejecutado una campaña de reactivación

### Semana 2 — Revisión de automatización

- Audita tu secuencia de bienvenida con `/email-sequence` — este es tu flujo de mayor ROI
- Identifica la automatización con la peor tasa de abandono — reescríbela
- Revisa tu secuencia de reactivación (o crea una si no existe)
- Establece tu ritual semanal de higiene de listas

### Semana 3 — Programa de pruebas

- Construye tu primer backlog de pruebas A/B de 90 días con `/email-ab-tester`
- Lanza tu primera prueba A/B correctamente diseñada (línea de asunto — la más fácil para empezar)
- Establece tu regla de decisión de significancia estadística antes de ver los resultados
- Documenta tu primera nota de "aprendizajes de correo" (principios que probarás)

### Semana 4 — Informes y optimización

- Establece tu plantilla de informes de rendimiento semanal
- Revisa los últimos 3 meses de campañas: ¿qué segmentos, asuntos y horas de envío tienen mejor rendimiento?
- Presenta tu primer informe de salud del programa a tu gerente
- Identifica el flujo de automatización que, si mejora en un 20%, tendría el mayor impacto en ingresos

---

## Integraciones de herramientas

### Klaviyo (correo de ciclo de vida)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Con Klaviyo conectado: datos de segmentos, análisis de flujos y salud de listas directamente en Claude Code.

### HubSpot (correo B2B)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

### Mailchimp / Brevo / Postmark

Exporta tus informes de campaña como CSV → pégalos en `/analytics-tracking` para análisis de tendencias y benchmarking.

### Google Postmaster Tools

Herramienta gratuita de Google — conecta tu dominio de envío y monitorea la reputación del dominio, tasas de spam y ubicación en bandeja de entrada para destinatarios de Gmail. Revisa semanalmente como parte de tu revisión de capacidad de entrega.

### Litmus / Email on Acid

Vista previa de renderizado en distintos clientes → pega los problemas en `/email-campaign` para correcciones rápidas de HTML.

---

## Métricas a rastrear

| Métrica | Objetivo | Señal de alerta |
|---|---|---|
| Tasa de apertura | > 25% (varía por industria) | < 15% |
| Tasa de clics | > 2% | < 1% |
| Tasa de clics por apertura (CTOR) | > 10% | < 6% |
| Tasa de cancelación (por campaña) | < 0,2% | > 0,5% |
| Tasa de quejas de spam | < 0,05% | > 0,1% (Google bloquea al 0,1%) |
| Tasa de rebote duro | < 0,5% | > 1% |
| Tasa de crecimiento de la lista | Positiva mes a mes | Disminuyendo 2+ meses |
| Tasa de participación activa | > 40% de la lista | < 25% |
| Tasa de apertura del correo de bienvenida | > 50% | < 35% |
| Conversión del flujo de automatización | Depende del flujo — establece objetivo por flujo | Por debajo del objetivo establecido durante 60+ días |

Nota: Apple Mail Privacy Protection infla las tasas de apertura para usuarios de iOS (marcados como "abiertos" cuando se precarga). Trata la tasa de clics y el CTOR como tus métricas principales de participación para listas con predominio de iOS.

---

## Errores comunes y cómo Claude Code ayuda a evitarlos

**Error 1: Enviar a suscriptores inactivos sin una campaña de reactivación previa**
Esta es la forma más rápida de arruinar la capacidad de entrega. Los suscriptores inactivos que no interactúan envían una señal a los proveedores de que estás enviando spam — penalizan todo tu dominio. Ejecuta primero una campaña de suspensión.

**Error 2: Declarar ganadores de pruebas A/B basándose en 6 horas de datos**
`/email-ab-tester` calcula si tu resultado es estadísticamente significativo. Si no lo es, es ruido — no un ganador.

**Error 3: Sin registro DMARC en tu dominio de envío**
`/email-deliverability` lo detecta en la primera auditoría. Sin DMARC, tu dominio es falsificable y los proveedores confían menos en él.

**Error 4: Escribir correos de bienvenida como un envío de un solo correo**
`/email-sequence` diseña series de bienvenida de 3-5 correos. Un único correo de bienvenida es una oportunidad de activación perdida.

**Error 5: Probar líneas de asunto sin una hipótesis**
`/email-ab-tester` requiere una hipótesis antes de diseñar la prueba. "Probar diferentes líneas de asunto" no es una hipótesis — es variación aleatoria que no te enseña nada incluso cuando ganas.

---

## Recursos

- [Primeros pasos con Claude Code](./getting-started.md)
- [Habilidad de capacidad de entrega de correo](../skills/marketing/email-deliverability.md)
- [Habilidad de pruebas A/B de correo](../skills/marketing/email-ab-tester.md)
- [Habilidad de secuencia de correo](../skills/marketing/email-sequence.md)
- [Flujo de trabajo de campaña de correo](../workflows/email-campaign.md)
- [Agente asesor CMO](../agents/advisors/cmo-advisor.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
