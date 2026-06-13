# Claude para Redactores Técnicos e Ingenieros de Documentación

Todo lo que un Redactor Técnico o Ingeniero de Documentación necesita para ejecutar flujos de trabajo de documentación aumentados por IA — documentación de API, READMEs, runbooks, changelogs, ADRs, arquitectura de sitios de documentación, guías de estilo y auditorías de contenido.

---

## Para quién es esta guía

Eres un redactor técnico, ingeniero de documentación o developer advocate cuyo trabajo es hacer que los productos técnicos complejos sean comprensibles. Escribes documentación de API, guías de incorporación, runbooks y changelogs. Revisas PRs en busca de precisión en la documentación. Mantienes un sitio de documentación. Luchas por mantener la información actualizada. Claude Code hace que las partes mecánicas de este trabajo sean rápidas y consistentes para que puedas concentrarte en la escritura y el juicio editorial que realmente requieren experiencia.

**Antes de Claude Code:** 4 horas para documentar un endpoint de API desde cero. 30 minutos para escribir una entrada de changelog que se leerá durante 30 segundos. 2 horas para producir un runbook a partir de un post-mortem de incidente. Esperar a que un ingeniero explique qué hace una nueva función antes de poder empezar a escribir.

**Después:** Endpoint de API documentado en 10 minutos a partir del código o la especificación. Changelog a partir de un git log en 5 minutos. Runbook a partir de una línea de tiempo de incidente en 20 minutos. Revisión de la arquitectura de información del sitio de documentación en 30 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar todas las habilidades de Redactor Técnico
npx claudient add skills productivity

# O seleccionar individualmente:
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/runbook-generator
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/changelog-writer
npx claudient add agents roles/changelog-narrator
```

---

## Tu stack de documentación con Claude Code

### Habilidades (comandos slash)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/readme-generator` | README completo a partir de código o descripción | Nuevo proyecto, nuevo lanzamiento de código abierto |
| `/runbook-generator` | Runbook operacional a partir de un incidente o descripción de proceso | Después de cada incidente, para cada proceso operacional |
| `/adr-writer` | Architecture Decision Record a partir de una decisión técnica | Cuando se toma una decisión arquitectónica significativa |
| `/doc-site-builder` | Arquitectura de información del sitio de documentación: estructura de navegación, plantillas, taxonomía de contenido, estrategia de búsqueda | Al iniciar o reestructurar un sitio de documentación |
| `/api-doc-writer` | Documentación de API a partir de especificación OpenAPI o código: endpoints, ejemplos, códigos de error, SDKs | Cambios en la API, nuevos endpoints, guías de migración |
| `/changelog-writer` | Changelog orientado al usuario a partir de git log o lista de PRs | Cada versión, resumen semanal |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `changelog-narrator` | Haiku | Generación de changelogs en lote para múltiples versiones |

---

## Flujo de trabajo diario

### Por la mañana — salida del standup de ingeniería → tareas de documentación

**Convertir los PRs del día anterior en tareas de documentación:**
```
/changelog-writer

Estos PRs se fusionaron ayer. Clasifica cada uno como: necesita nueva documentación /
necesita actualización de documentación / necesita entrada en el changelog / solo interno (no se necesita documentación).

Lista de PRs:
[pegar títulos y descripciones de los PRs fusionados]

Para cada uno que necesite documentación o entrada en el changelog: dame un breve resumen de una línea sobre qué escribir.
```

**Documentación rápida de API para un nuevo endpoint:**
```
/api-doc-writer

Documenta este endpoint de API a partir del código:

[pegar el código del manejador de ruta, el fragmento OpenAPI o la descripción en texto plano]

Resultado: documento de referencia completo del endpoint con tablas de solicitud/respuesta, todos los parámetros,
códigos de error y ejemplos de código en curl, Python y TypeScript.
```

---

### Ciclo de revisión de contenido

**Auditar una sección de la documentación para detectar obsolescencia:**
```
/doc-site-builder

Audita esta sección de nuestra documentación en busca de problemas de contenido.

Páginas (indica título y fecha de última actualización):
[lista de páginas]

Cambios recientes en el producto que pueden haber vuelto obsoletas estas páginas:
[lista de cambios del producto de los últimos 90 días — obtener del changelog o las notas de versión]

Identifica: páginas que probablemente estén obsoletas / páginas con contenido faltante / páginas que deberían dividirse o fusionarse.
Resultado: backlog de actualización de contenido priorizado.
```

**Revisión de estilo de una página de documentación:**
```
Revisa esta página de documentación en cuanto a claridad, completitud y estilo.

Página: [pegar contenido]

Verifica:
1. ¿El objetivo del usuario queda claro solo con el título?
2. ¿La página comienza con lo que el usuario puede lograr, no con lo que hace la función?
3. ¿Los ejemplos de código son ejecutables tal como están (sin valores de marcador de posición que los rompan)?
4. ¿Los mensajes de error se explican con causas y soluciones, en lugar de solo listarlos?
5. ¿Está escrito en segunda persona ("tú/usted") de principio a fin?
6. ¿Hay secciones innecesarias que podrían eliminarse?

Resultado: ediciones específicas a nivel de línea con explicación.
```

---

### Ciclo de versión — Escritura del changelog

**En cada versión:**
```
/changelog-writer

Convierte este git log en un changelog orientado al usuario para v[X.Y.Z].

Audiencia: [usuarios finales / desarrolladores / administradores]
Fecha de lanzamiento: [fecha]

git log:
[pegar la salida de git log --oneline para esta versión]

Filtra: actualizaciones de dependencias, refactorizaciones internas, cambios solo de pruebas.
Agrupa por: Cambios que rompen compatibilidad → Nuevas funciones → Mejoras → Correcciones.
Escribe para una audiencia de [desarrolladores / usuarios no técnicos].
Incluye enlaces a la documentación de cualquier nueva función que tenga documentación.
```

---

### Documentación de incidentes — Runbooks

**Post-incidente: capturar la respuesta como un runbook:**
```
/runbook-generator

Crea un runbook a partir de esta línea de tiempo del incidente.

Servicio: [nombre del servicio]
Tipo de incidente: [qué salió mal]
Línea de tiempo del incidente:
[pegar desde tu herramienta de seguimiento de incidentes o hilo de Slack]

Produce un runbook que cubra:
- Síntomas y criterios de detección
- Procedimiento de diagnóstico paso a paso
- Pasos de remediación (numerados, con comandos exactos)
- Ruta de escalado
- Lista de verificación de prevención (qué verificar antes de que esto vuelva a suceder)

Formato: runbook operacional que un ingeniero de guardia que nunca ha visto este incidente pueda seguir.
```

---

### Decisiones de arquitectura — ADRs

**Capturar una decisión técnica antes de que se pierda:**
```
/adr-writer

Escribe un Architecture Decision Record para [decisión].

Decisión: [qué se decidió]
Contexto: [la situación que requirió una decisión — ¿por qué era necesaria?]
Opciones consideradas: [lista de alternativas que se evaluaron]
Justificación de la decisión: [por qué se eligió esta opción sobre las alternativas]
Consecuencias: [las concesiones — qué hace esta decisión más fácil y qué hace más difícil]
Estado: [Aceptado / Propuesto / Obsoleto / Reemplazado por ADR-N]

Usa el formato Nygard. Incluye: título, fecha, estado, contexto, decisión, consecuencias.
```

---

### Arquitectura del sitio de documentación

**Reestructurar un sitio de documentación:**
```
/doc-site-builder

Diseña la arquitectura de información de nuestro sitio de documentación.

Producto: [nombre y descripción]
Audiencia: [desarrolladores / usuarios finales / administradores / todos]
Estado actual: [migrando desde Notion / reestructurando sitio existente / empezando desde cero]
Tipos de documentación necesarios: [primeros pasos, referencia de API, guías prácticas, documentación conceptual, notas de versión]
Volumen de contenido: [número aproximado de páginas]
Plataforma: [Docusaurus / MkDocs / Mintlify / aún no elegida]

Produce:
- Estructura de navegación de nivel superior con justificación
- Clasificación de contenido Diátaxis (Tutorial / Cómo hacer / Referencia / Explicación)
- Plantillas de página para cada tipo de contenido
- Análisis de brechas de contenido
- Lista de verificación de preparación para el lanzamiento
```

---

## Plan de incorporación de 30 días (nuevos redactores técnicos)

### Semana 1 — Configuración y auditoría de documentación
- Instalar todas las habilidades de productividad: `npx claudient add skills productivity`
- Ejecutar `/doc-site-builder` con clasificación Diátaxis en toda la documentación existente — identificar brechas y páginas de tipo mixto
- Leer toda la documentación existente en tu área principal — anotar todo lo que esté desactualizado (comparar con PRs recientes)
- Acompañar 2-3 standups de ingeniería — escuchar qué se lanzará en el próximo sprint

### Semana 2 — Documentación de API y escritura de referencia
- Seleccionar 3 endpoints de API sin buena documentación
- Usar `/api-doc-writer` para redactar cada uno a partir del código — revisar con el ingeniero que lo escribió
- Medir el tiempo desde el borrador hasta la aprobación — rastrear los ciclos de edición para mejorar los prompts
- Configurar el proceso de revisión de PRs de docs-as-code con ingeniería

### Semana 3 — Changelog y notas de versión
- Obtener acceso al git log o al feed de PRs fusionados
- Escribir el próximo changelog de versión con `/changelog-writer` — comparar con changelogs anteriores en cuanto a tono y profundidad
- Escribir 3 runbooks para incidentes de guardia comunes que aún no tienen documentación
- Revisar el archivo de ADRs — ¿están documentadas las decisiones que se han tomado?

### Semana 4 — Estrategia de contenido
- Ejecutar una auditoría completa de contenido: ¿qué documentos tienen más páginas vistas? ¿Mayor tasa de salida? ¿Mayor correlación con tickets de soporte?
- Usar analíticas para identificar las 5 páginas principales donde los usuarios aterrizan y que los decepcionan (alta salida + baja satisfacción)
- Proponer un sprint de mejora de documentación a ingeniería: 5 páginas, objetivo medible
- Presentar los hallazgos de la auditoría de contenido al equipo

---

## Integraciones de herramientas

### GitHub / GitLab (docs-as-code)

Ejecutar verificaciones de CI en cada PR de documentación:

```yaml
# .github/workflows/docs.yml
- name: Check broken links
  uses: lycheeverse/lychee-action@v1

- name: Spell check
  uses: streetsidesoftware/cspell-action@v2

- name: Lint markdown
  uses: DavidAnson/markdownlint-cli2-action@v9
```

Claude Code puede ayudar a escribir el texto — CI aplica consistencia y detecta enlaces rotos antes de que lleguen a los usuarios.

### OpenAPI / Swagger (especificaciones de API)

Si tu equipo usa OpenAPI:
- Incluye la especificación en el mismo repositorio que la documentación
- Usa `/api-doc-writer` para generar documentación legible para humanos a partir de la especificación
- Regenera en cada cambio de especificación — no mantengas manualmente la referencia de API que puede generarse

```bash
# Generar documentación a partir de la especificación
npx claudient run api-doc-writer --input openapi.yaml --audience developers
```

### Mintlify / Docusaurus / MkDocs (plataformas de documentación)

Todas estas plataformas soportan MDX o Markdown con frontmatter. Claude Code genera Markdown; tú gestionas la configuración de la plataforma.

Patrón de frontmatter recomendado:
```yaml
---
title: "Cómo configurar la autenticación"
description: "Configura la autenticación OAuth 2.0, clave de API o SSO para tu integración"
last_updated: "2026-06-02"
tags: [autenticación, seguridad, configuración]
---
```

### Linear / Jira (backlog de documentación)

Rastrea las tareas de documentación como tickets de ingeniería de primera clase. Etiqueta: `docs`, `docs-api`, `docs-runbook`.

Claude Code genera el borrador — el ticket rastrea la revisión y la publicación. No omitas el ciclo de revisión.

### Slack / Teams (colaboración con ingeniería)

Configura un canal `#docs-updates` donde:
- Los PRs fusionados con cambios visibles para el usuario activen una notificación
- Los redactores técnicos puedan pedir contexto a los ingenieros en un hilo (con posibilidad de búsqueda futura)
- Los changelogs de versión se publiquen para revisión antes de la publicación

---

## Métricas a rastrear

| Métrica | Objetivo |
|---|---|
| Cobertura de documentación de endpoints de API | 100% de los endpoints públicos documentados |
| Tiempo de entrega del changelog después del lanzamiento | El mismo día del lanzamiento |
| Cobertura de ADRs | Existe un ADR para cada decisión arquitectónica significativa |
| Cobertura de runbooks | Existe un runbook para cada tipo de incidente P1 |
| Enlaces rotos en la documentación de producción | 0 (aplicado por CI) |
| Puntuación de comentarios de la documentación ("¿Fue útil esto?") | >70% positivo |
| Tiempo desde la fusión del PR hasta la publicación de la documentación | <24 horas para cambios menores, <72 horas para funciones importantes |
| Páginas obsoletas (no actualizadas en >6 meses vs. cambios del producto) | <10% de la documentación |

---

## Errores comunes (y cómo Claude Code ayuda a evitarlos)

**Error 1: Documentación de API escrita como si fuera para ti, no para el integrador**
`/api-doc-writer` siempre escribe desde la perspectiva del integrador, incluye ejemplos de código funcionales en varios idiomas y explica los códigos de error con causas y soluciones — no solo una tabla de códigos de estado.

**Error 2: Changelogs que suenan como mensajes de commit**
`/changelog-writer` reescribe los mensajes de commit en lenguaje de beneficios orientado al usuario, filtra el ruido interno y agrupa por impacto en el usuario.

**Error 3: Documentación que mezcla contenido de tutorial, guía práctica y referencia en una sola página**
`/doc-site-builder` ejecuta la clasificación Diátaxis y marca las páginas de tipo mixto. Divídelas antes de que se vuelvan inmanejables.

**Error 4: Runbooks que nunca se usan porque están desactualizados**
Escribe runbooks inmediatamente después de los incidentes con `/runbook-generator` mientras el contexto está fresco. Agrega una fecha de "última validación" y valídalos en simulacros.

**Error 5: ADRs que nunca se escriben**
La escritura de ADRs debe ocurrir cuando se toma la decisión — no seis meses después. Usa `/adr-writer` en el mismo PR donde aterriza el cambio arquitectónico.

---

## Recursos

- [Primeros pasos con Claude Code](../getting-started.md)
- [Flujo de trabajo del sprint de documentación](../workflows/docs-sprint.md)
- [Agente narrador de changelog](../agents/roles/changelog-narrator.md)
- [Habilidad de escritura de ADR](../skills/productivity/adr-writer.md)
- [Habilidad de generación de runbooks](../skills/productivity/runbook-generator.md)

---
