# Claude para Agentes Inmobiliarios

Todo lo que un agente inmobiliario residencial necesita para gestionar listados, trabajo con compradores, presentaciones de CMA, contacto con clientes potenciales y comunicaciones con clientes potenciados por IA en Claude Code.

---

## Para quién es esto

Eres un agente inmobiliario — independiente o en un equipo — que gana dinero convirtiendo relaciones en transacciones cerradas. Tu tiempo se consume escribiendo descripciones de listados, investigando comparables, redactando cartas de oferta, haciendo seguimiento de leads y manteniendo informados a 20 clientes activos. Claude Code elimina el trabajo de escritura repetitiva para que puedas estar frente a los clientes en lugar de detrás de un teclado.

**Antes de Claude Code:** 45 minutos para escribir una narrativa de CMA. 20 minutos por descripción de listado. 15 minutos por seguimiento de visita. Horas de investigación de mercado por semana.

**Después:** Narrativa de CMA en 3 minutos. Descripción de listado en 90 segundos. Seguimiento de visita en 60 segundos. Actualización semanal del mercado en 5 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar todas las habilidades inmobiliarias
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/customer-inquiry

# Instalar el agente especialista en bienes raíces
npx claudient add agent roles/real-estate-specialist
```

---

## Tu stack inmobiliario de Claude Code

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/real-estate-listing` | Descripciones para el MLS, seguimientos de visitas, secuencias de nutrición de leads, publicaciones en redes sociales — con cumplimiento de Fair Housing | Nuevo listado, post-visita, contenido para redes |
| `/cma-report` | Narrativa completa de CMA: selección de comparables, análisis de ajustes, niveles de precio, presentación al vendedor | Cada cita de listado |
| `/buyer-offer-writer` | Cartas de presentación personales y de agente a agente para ofertas — escenarios emocionales y competitivos | Cualquier presentación de oferta |
| `/cold-outreach` | Cartas de prospección, contacto con propietarios FSBO, contacto con listados vencidos, toques a la esfera de influencia | Campañas de prospección |
| `/customer-inquiry` | Responder a consultas entrantes de compradores/vendedores — calificar, nutrir, convertir | Nuevos leads de Zillow, Realtor.com, referencias |

### Agente

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `real-estate-specialist` | Sonnet | Sesiones completas de preparación de listados, preparación de consultas con compradores, investigación de mercado |

---

## Flujo de trabajo diario

### Mañana (20-30 minutos)

**1. Seguimiento de leads — nuevas consultas de la noche anterior**
```
/customer-inquiry

Tengo [X] nuevos leads de [Zillow / referencia / casa abierta]. Aquí están los detalles:

Lead 1:
Nombre: [nombre]
Fuente: [fuente]
Mensaje: [qué dijeron]
Propiedad sobre la que consultaron: [dirección o rango de precio]
Plazo: [lo que sabes]

Redacta respuestas para cada uno. Cálidas, profesionales, orientadas hacia una llamada telefónica o visita.
```

**2. Seguimientos de visitas — visitas de ayer**
```
/real-estate-listing

Seguimiento post-visita para:
- Nombre del comprador: [nombre]
- Propiedad: [dirección]
- Lo que les gustó: [notas de la visita]
- Preocupaciones planteadas: [notas]
- Su plazo: [X meses]
- Competencia: [otras propiedades que han visto]

Redacta un email de seguimiento personalizado. Haz referencia a algo específico de la visita. Próximo paso suave.
```

---

### Preparación de cita de listado (60-90 minutos antes)

**3. Informe CMA — presentación completa al vendedor**
```
/cma-report

Propiedad sujeto: [habitaciones/baños, m², vecindario, año de construcción, renovaciones]

Ventas comparables:
Comparable 1: [detalles]
Comparable 2: [detalles]
Comparable 3: [detalles]

Competencia activa:
Activo 1: [detalles]
Activo 2: [detalles]

Contexto del mercado: [tasa de absorción, días en el mercado promedio, ratio lista-venta]
Plazo del vendedor: [X semanas]
Mi rango de precio recomendado: $[X] – $[X]

Genera el informe CMA completo y la narrativa de presentación al vendedor.
```

**4. Marketing del listado — texto para el MLS y redes sociales**
```
/real-estate-listing

Nuevo listado — escribe la descripción para el MLS y publicaciones en redes sociales.

Propiedad: [habitaciones/baños, m², características principales, vecindario]
Top 5 características: [lista]
Estilo de vida del comprador objetivo: [describir]
Límite de caracteres del MLS: [X palabras]
```

---

### Situaciones de oferta

**5. Carta de oferta del comprador — escenario competitivo**
```
/buyer-offer-writer

Comprador: [nombres de pila]
Oferta: $[X] sobre precio de lista $[X]
Perfil del vendedor: [lo que sabes — propietario de larga data, le importa el legado, etc.]
Lo que los compradores aman de la propiedad: [características específicas]
Fortalezas del comprador: [pre-aprobación, pago inicial, renuncia de contingencias]
Contexto competitivo: [se esperan múltiples ofertas]

Genera carta de presentación personal (con cumplimiento de Fair Housing) + carta de agente.
```

---

### Tareas semanales (viernes — 30 minutos)

**6. Actualización del mercado para clientes activos**
```
/cold-outreach

Escribe un email semanal de actualización del mercado para mis clientes compradores activos.

Estadísticas del mercado esta semana:
- Nuevos listados en su rango de precio: [X]
- Reducciones de precio: [X]
- Vendidos esta semana: [X]
- Precio de venta promedio: $[X]
- Días en el mercado promedio: [X] días
- Actualización de tasas de interés: [X]%

Criterios de búsqueda de mis clientes: [rango de precio, área, tipo de propiedad]
Tono: Informativo, experto, sin alarmar. Posicióneme como su asesor de confianza.
```

**7. Toque a la esfera de influencia — prospección mensual**
```
/cold-outreach

Email mensual de prospección a mi esfera de influencia.

Tema de este mes: [actualización del mercado / consejo de mantenimiento del hogar / evento local / anuncio de listado]
Mi área de prospección: [vecindario]
Objetivo: Mantenerse en la mente, no vender.

Redacta un email de 150 palabras que suene personal, no como un boletín. Incluye un hecho útil y un CTA suave (café, verificación del valor de la vivienda, solicitud de referencia).
```

---

## Plan de incorporación de 30 días (nuevos agentes o nuevo mercado)

### Semana 1 — Configuración y conocimiento del mercado
- Instala todas las habilidades inmobiliarias mediante `npx claudient add skill small-business/[nombre]`
- Ejecuta `/cma-report` en 5 ventas recientes en tu área de prospección para calibrar tu lectura de comparables
- Usa `/real-estate-listing` para reescribir 3 de tus descripciones de listados pasadas — compara la calidad
- Mapea tu esfera de influencia: 50 contactos → ejecuta `/cold-outreach` en tu primer toque

### Semana 2 — Flujos de trabajo de listados y compradores
- Ejecuta una simulación completa de cita de listado con `/cma-report` en la casa de un vecino (ejercicio)
- Escribe tus primeros 10 seguimientos de visita con `/real-estate-listing` — pon un temporizador: objetivo <3 minutos cada uno
- Construye una secuencia de nutrición de 4 toques para compradores con `/real-estate-listing` para un comprador de 6 meses

### Semana 3 — Prospección
- Lanza tu primera campaña de contacto con propietarios FSBO con `/cold-outreach` — 10 propietarios FSBO en tu área
- Contacto con listados vencidos: identifica 5 listados vencidos recientemente, redacta contacto personalizado
- Ejecuta una prospección geográfica: área de 100 hogares, toque mensual, rastrea la tasa de respuesta

### Semana 4 — Situaciones competitivas
- Practica `/buyer-offer-writer` en la próxima oferta de tu comprador antes de la presentación
- Ejecuta el prompt de cláusula de escalada — entiende la mecánica antes de necesitarla en el momento
- Rastrea tus métricas: visitas por listado, tasa de respuesta al seguimiento, conversión de citas de CMA

---

## Integraciones de herramientas

### Tu CRM

```json
// Agregar a ~/.claude/settings.json para flujo de trabajo conectado con CRM
// La mayoría de los agentes usan Follow Up Boss, LionDesk o KVCore
{
  "mcpServers": {
    "followupboss": {
      "command": "npx",
      "args": ["-y", "@followupboss/mcp-server"],
      "env": {
        "FUB_API_KEY": "your-key-here"
      }
    }
  }
}
```

Con el CRM conectado, Claude puede:
- Recuperar el historial completo de un contacto antes de redactar el seguimiento
- Registrar interacciones después de cada comunicación con el cliente
- Señalar contactos que no han sido contactados en 30+ días

### Datos del MLS
Exporta tus datos de comparables como CSV o pega directamente desde tu MLS → Claude los lee y los formatea para el análisis de CMA. No se necesita integración especial.

### DocuSign / DotLoop
Claude redacta el lenguaje y los puntos de conversación — tú los pegas en tu plataforma de gestión de transacciones. En el futuro: disparadores de webhook para redactar automáticamente cuando se abre un formulario.

### Canva / materiales de marketing
Usa Claude para generar el texto → pégalo en plantillas de Canva para volantes de listados, publicaciones en redes sociales y correos de prospección. Claude respeta los límites de caracteres cuando los especificas.

---

## Métricas a rastrear

| Métrica | Línea base (manual) | Objetivo con Claude |
|---|---|---|
| Tiempo por descripción de listado | 45 min | 5 min |
| Tiempo por narrativa de CMA | 60 min | 10 min |
| Tiempo por seguimiento de visita | 15 min | 3 min |
| Frecuencia de toque a la esfera | Mensual (si lo recuerdas) | Semanal (borradores automatizados) |
| Conversión de citas de listado | Rastrear desde el primer CMA | Benchmark después de 10 CMAs |
| Tasa de aceptación de oferta (lado del comprador) | Rastrear | Rastrear carta vs. sin carta |

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Violaciones de Fair Housing en el texto de listados**
Claude señala y elimina el lenguaje de clases protegidas automáticamente. Tú aún haces la revisión final — Claude es una salvaguarda, no una garantía.

**Error 2: Seguimientos genéricos de visitas que se ignoran**
`/real-estate-listing` requiere que proporciones notas específicas de la visita. Sin notas = sin email. Te fuerza a escuchar durante las visitas.

**Error 3: Presentar un CMA sin narrativa**
Los vendedores no recuerdan datos — recuerdan historias. `/cma-report` genera la narrativa que lees en voz alta. Es la diferencia entre un precio y una conversación.

**Error 4: Personalizar demasiado una carta del comprador y generar responsabilidad por Fair Housing**
`/buyer-offer-writer` revisa el lenguaje de clases protegidas antes de que lo presentes.

**Error 5: Dejar que los contactos de la esfera se enfríen**
Configura un recordatorio semanal → `/cold-outreach` → toque mensual a la esfera en 5 minutos.

---

## Recursos

- [Primeros pasos con Claude Code](getting-started.md)
- [Habilidad de listado inmobiliario](../skills/small-business/real-estate-listing.md)
- [Habilidad de informe CMA](../skills/small-business/cma-report.md)
- [Habilidad de escritor de oferta del comprador](../skills/small-business/buyer-offer-writer.md)
- [Habilidad de contacto en frío](../skills/small-business/cold-outreach.md)

---
