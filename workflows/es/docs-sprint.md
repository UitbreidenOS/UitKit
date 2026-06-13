# Flujo de Trabajo de Sprint de Documentación

Un flujo de trabajo paso a paso para un sprint de documentación enfocado — desde la auditoría de contenido hasta la redacción, revisión y publicación — utilizando las habilidades de Claude Code a lo largo de todo el proceso.

---

## Cuándo ejecutar este flujo de trabajo

- Un nuevo producto o funcionalidad se lanza y necesita documentación antes del anuncio
- Ha identificado una brecha en la documentación a partir de análisis (altas tasas de salida, búsquedas fallidas, correlación con tickets de soporte)
- Trimestral: sprint planificado de mejora de la documentación para reducir la carga de soporte
- Migración: traslado de una wiki a un sitio de documentación dedicado

---

## Resumen del sprint

Un sprint de documentación estándar es de 1 semana para un alcance enfocado (5-10 páginas):

| Día | Actividad |
|---|---|
| Día 1 | Auditoría de contenido y definición del alcance |
| Día 2 | Arquitectura y plantillas |
| Días 3-4 | Sprint de redacción |
| Día 5 | Revisión, publicación y configuración de retroalimentación |

Para un alcance mayor (20+ páginas), ejecute este sprint en 2 semanas con la misma estructura.

---

## Paso 1 — Auditoría de contenido (Día 1, mañana)

Antes de escribir nada, comprenda el estado de lo que existe.

**Prompt de auditoría:**
```
/doc-site-builder

Ejecutar una auditoría de contenido para nuestro sitio de documentación.

Producto: [nombre]
Inventario de documentación actual (pegue títulos de páginas y URLs o descripciones):
[liste todas las páginas existentes]

Cambios en el producto en los últimos [90 días / 6 meses]:
[pegue notas de versión recientes, registro de cambios o anuncios de funcionalidades]

Datos analíticos (si están disponibles):
- Top 10 páginas por visitas: [pegar]
- Top 10 búsquedas con 0 resultados: [pegar — esta es su lista de brechas de contenido]
- Páginas con mayor tasa de salida: [pegar]

Clasificar cada página existente por tipo Diátaxis: Tutorial / Guía práctica / Referencia / Explicación.
Marcar páginas de tipo mixto (páginas que intentan ser dos tipos a la vez — dividirlas).
Marcar páginas obsoletas (contenido que probablemente haya cambiado con las actualizaciones recientes del producto).
Marcar contenido faltante (temas que deberían existir según el producto y las necesidades del usuario pero que no existen).

Resultado: lista de tareas de contenido priorizada para este sprint.
```

**Decisión de alcance:** A partir del resultado de la auditoría, seleccione 5-10 páginas para escribir o actualizar en este sprint. Sea implacable con el alcance — 5 páginas excelentes valen más que 15 mediocres.

---

## Paso 2 — Alcance del sprint y priorización (Día 1, tarde)

**Priorizar la lista de tareas:**

| Prioridad | Tipo de contenido | Cuándo escribir primero |
|---|---|---|
| P1 | Falta Primeros pasos / Inicio rápido | Los usuarios están fallando en su primer punto de contacto |
| P1 | Contenido de referencia roto u obsoleto | La documentación incorrecta es peor que ninguna documentación |
| P2 | Guías prácticas faltantes para tareas comunes | Preguntas de soporte de alto volumen |
| P2 | Documentación de nuevas funcionalidades | Funcionalidad lanzada sin documentación |
| P3 | Documentación conceptual / de explicación | Los usuarios necesitan un modelo mental, no solo instrucciones |
| P3 | Mejoras estéticas | Bajo impacto — no haga un sprint sobre estas |

**Formato de la lista de tareas del sprint:**

```markdown
## Sprint de Documentación — [Fecha] — Lista de Tareas

| Prioridad | Página | Tipo | Estado actual | Por qué ahora |
|---|---|---|---|---|
| P1 | Primeros pasos / Inicio rápido | Tutorial | Faltante | Abandono en el primer contacto |
| P1 | Guía de autenticación | Guía práctica | Obsoleta (migración v1 → v2 la rompió) | Volumen de tickets de soporte |
| P2 | Endpoint POST /v1/events | Referencia | Incompleta (sin ejemplos) | Nuevo endpoint lanzado |
| P2 | Cómo configurar webhooks | Guía práctica | Faltante | Principal búsqueda fallida |
| P3 | Qué es [concepto central] | Explicación | Faltante | Los usuarios lo preguntan en soporte |
```

---

## Paso 3 — Alineación de la arquitectura (Día 2, mañana)

Si este sprint cambia la estructura de navegación o añade nuevas secciones, alinee la arquitectura de información antes de escribir.

```
/doc-site-builder

Proponer una estructura de navegación actualizada para estas nuevas páginas.

Navegación existente: [pegar estructura de navegación actual]
Nuevas páginas a añadir: [lista de la lista de tareas del sprint]

Restricciones:
- Profundidad máxima de navegación: 2 niveles (no crear nuevas secciones de nivel superior a menos que sea necesario)
- Plataforma: [Docusaurus / MkDocs / Mintlify]
- Audiencia: [desarrolladores / usuarios finales / administradores]

Recomendación: dónde colocar cada nueva página, si crear nuevas secciones,
y si alguna página existente debe moverse.

Incluir: una comparación de navegación antes/después.
```

---

## Paso 4 — Selección de plantillas (Día 2, tarde)

Use la plantilla correcta para cada tipo de contenido Diátaxis. Tome de `/doc-site-builder` o use estas:

**Tutorial (Primeros pasos):**
- Apertura: qué construirá / logrará — el estado final, 1-2 oraciones
- Requisitos previos: lista numerada — sea explícito sobre las versiones
- Pasos: numerados, cada uno produciendo un resultado visible
- Verificar que funcionó: el comando o comprobación que confirma el éxito en cada paso
- Qué acaba de pasar: 1-2 oraciones que explican lo que logró el tutorial
- Próximos pasos: máximo 3 enlaces — adónde ir desde aquí

**Guía práctica:**
- Título: "Cómo [realizar la tarea]" — debe ser accionable
- Apertura: 1 oración — para quién es y qué logra
- Requisitos previos
- Pasos: voz imperativa ("Ejecute el comando", no "El usuario debe ejecutar")
- Resolución de problemas: los 2-3 errores más probables y sus soluciones
- Relacionados: 2-3 enlaces a guías prácticas relacionadas y referencias

**Página de referencia:**
- Qué es esto (1 oración)
- Sintaxis / firma
- Todos los parámetros / opciones en una tabla
- Ejemplo mínimo funcional
- Notas / casos extremos
- Véase también

**Explicación / Concepto:**
- Qué es esto y por qué existe
- Cómo funciona (modelo mental, diagrama si ayuda)
- Cuándo usarlo vs. alternativas
- Conceptos erróneos comunes
- Referencia relacionada

---

## Paso 5 — Sprint de redacción (Días 3-4)

**Para documentación de API:**
```
/api-doc-writer

Documentar este endpoint de la API.

[pegar el código del manejador de rutas, el fragmento de OpenAPI o la descripción del endpoint]

Resultado: documentación de referencia completa con:
- Tabla de parámetros de solicitud (ruta, consulta, cuerpo)
- Tabla de campos de respuesta
- Todos los códigos de error con explicación
- Ejemplos de código en curl, Python, TypeScript
- Errores y casos extremos (si se conocen)
```

**Para README o Primeros pasos:**
```
/readme-generator

Escribir una guía de Primeros pasos para [producto/biblioteca].

Producto: [nombre y descripción de 1 oración]
Tipo de usuario: [desarrolladores / usuarios no técnicos]
Punto de partida: [qué tienen cuando comienzan]
Estado final: [qué tienen cuando esta guía está completa — el momento de valor]

Incluir: requisitos previos, instalación, primer ejemplo funcional, configuración común,
y 3 enlaces a los próximos pasos.

Idioma: [TypeScript / Python / cualquiera — coincidir con el SDK principal]
```

**Para runbooks operativos:**
```
/runbook-generator

Escribir un runbook para [proceso o tipo de incidente].

Proceso / tipo de incidente: [describir]
Audiencia: ingeniero de guardia que puede no haber visto esto antes
Disparador: [qué condición hace necesario este runbook]

Incluir:
- Síntomas y detección
- Pasos de diagnóstico (ordenados — comenzar con la causa más probable)
- Pasos de corrección (comandos exactos, con resultado esperado)
- Escalado: a quién avisar si esto no se resuelve en X minutos
- Prevención: qué comprobar para evitar esto la próxima vez
```

**Para registros de cambios:**
```
/changelog-writer

Escribir el registro de cambios para [versión / nombre de lanzamiento].

git log:
[pegar git log --oneline para este lanzamiento]

Audiencia: [desarrolladores / usuarios finales]
Filtrar: cambios internos, actualizaciones de dependencias, cambios solo de pruebas.
Agrupar: Cambios importantes → Novedades → Mejoras → Correcciones.
Incluir: enlaces a documentación para cada nueva funcionalidad si existe la documentación.
```

---

## Paso 6 — Revisión técnica (Día 4, tarde)

Cada página de documentación técnica debe ser revisada por un ingeniero antes de la publicación. La revisión detecta:
- Detalles técnicos incorrectos (nombres de parámetros incorrectos, sintaxis desactualizada)
- Pasos faltantes (algo que el escritor asumió que era obvio pero no lo es)
- Ejemplos de código que no se ejecutan (el error de documentación más común y dañino)

**Plantilla de solicitud de revisión:**

```markdown
Hola [nombre del ingeniero],

He redactado documentación para [funcionalidad/endpoint]. ¿Puedes revisar la precisión técnica?

Específicamente:
1. ¿Son correctos todos los nombres y tipos de parámetros?
2. ¿Funcionan realmente los ejemplos de código? (Si puedes ejecutarlos, por favor hazlo — deben producir el resultado documentado.)
3. ¿Me estoy perdiendo algún caso de error o caso extremo importante?
4. ¿Es el comportamiento descrito preciso para la versión actual?

[Enlace al borrador o pegar el borrador aquí]

Fecha límite necesaria: [fecha]. Esto está bloqueando la publicación.
```

Objetivo: respuesta de los ingenieros en 24 horas. Si una página necesita más de 2 rondas de revisión técnica, programe una llamada de 30 minutos en su lugar.

---

## Paso 7 — Revisión de estilo (Día 5, mañana)

```
Revisar esta página de documentación para verificar estilo y claridad.

Página: [pegar contenido]

Verificar:
1. ¿Es el título accionable / descriptivo — coincide con lo que buscaría un usuario?
2. ¿Comienza con el beneficio para el usuario, no con la descripción del producto?
3. ¿Son todos los ejemplos de código ejecutables (sin valores de marcador de posición que los rompan)?
4. ¿Está escrito en segunda persona ("usted") — sin "el usuario" ni voz pasiva?
5. ¿Las oraciones tienen en promedio menos de 25 palabras?
6. ¿Hay algo que pueda eliminarse sin perder significado?
7. ¿Se explican los mensajes de error con causa + solución?

Resultado: ediciones específicas a nivel de línea. Sin retroalimentación general — solo cambios específicos.
```

---

## Paso 8 — Publicación y configuración de retroalimentación (Día 5, tarde)

**Lista de verificación previa a la publicación:**
- [ ] Revisión técnica aprobada por el ingeniero
- [ ] Todos los ejemplos de código probados y producen el resultado documentado
- [ ] Todos los enlaces internos verificados (sin errores 404)
- [ ] Metadatos completos: título, descripción, last_updated, etiquetas
- [ ] La página aparece correctamente en la navegación
- [ ] Índice de búsqueda actualizado (reconstruir si usa Algolia, pagefind o similar)

**Instrumentación de retroalimentación:**

Añada un widget "¿Fue útil esta página?" a cada nueva página. La implementación mínima:

```html
<!-- Widget de retroalimentación mínimo — al final de cada página -->
<div class="feedback">
  <p>Was this page helpful?</p>
  <button onclick="sendFeedback('yes')">Yes</button>
  <button onclick="sendFeedback('no')">No</button>
</div>
```

Seguimiento: tasa positiva por página. Objetivo: >70% positivo. Las páginas por debajo del 50% necesitan investigación.

---

## Paso 9 — Retrospectiva del sprint (Final del Día 5)

```
Revisar este sprint de documentación e identificar mejoras para la próxima vez.

Páginas escritas: [lista]
Páginas no completadas: [lista con motivo]
Ciclos de revisión por página: [promedio]
Problemas de bloqueo: [lista — p. ej. "esperé 2 días la especificación de la API", "sin entorno de staging para verificar ejemplos"]
Tiempo por tipo de página: [Tutorial: Xh, Guía práctica: Xh, Referencia: Xh]

Preguntas a responder:
1. ¿Qué páginas tardaron más de lo esperado — por qué?
2. ¿Qué cuellos de botella en la revisión pueden eliminarse con cambios de proceso?
3. ¿Qué contenido debería haber estado en el alcance pero no lo estaba?
4. ¿Cuál es el próximo sprint de mayor impacto?
```

---

## Reglas de límite de tiempo

- Auditoría de contenido: máximo 3 horas. Use los datos analíticos para priorizar — no audite cada página.
- Redacción por página (con Claude Code): Tutorial: 90 min | Guía práctica: 45 min | Referencia: 60 min | Explicación: 60 min
- Revisión técnica: SLA de 24 horas de los ingenieros. Si se retrasa, escale o programe una llamada de sincronización.
- Prueba de ejemplos de código: innegociable. Cada ejemplo de código debe ejecutarse antes de la publicación.
- Alcance del sprint: 5-10 páginas por semana. Cualquier cosa más significa que el alcance es demasiado amplio.

---

## Configuración de CI para documentación como código

Añada esto a su repositorio para garantizar la calidad en cada PR:

```yaml
# .github/workflows/docs-quality.yml
name: Docs Quality

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Markdown lint
        uses: DavidAnson/markdownlint-cli2-action@v14
        
      - name: Spell check
        uses: streetsidesoftware/cspell-action@v6
        
      - name: Check broken links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './docs/**/*.md'
          
      - name: Check frontmatter
        run: |
          # Verify all .md files have required frontmatter: title, description, last_updated
          python scripts/check_frontmatter.py docs/
```

Esto garantiza la coherencia sin necesidad de una revisión de la guía de estilo para cada PR.

---
