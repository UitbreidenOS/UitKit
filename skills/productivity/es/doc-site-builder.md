---
name: doc-site-builder
description: "Arquitectura de sitio de documentación: jerarquía de información, estructura de navegación, plantillas de contenido, estrategia de búsqueda"
---

# Habilidad: Constructor de Sitio de Documentación

## Cuándo activar
- Comenzar un nuevo sitio de documentación desde cero y necesitas una arquitectura de información
- Migrando documentación de un wiki (Notion, Confluence) o archivos README a un sitio de documentación dedicado
- Un sitio de documentación existente ha superado su estructura y necesita un rediseño de IA
- Necesitas definir plantillas de contenido para que múltiples colaboradores produzcan páginas consistentes
- Planificando un flujo de trabajo docs-as-code donde ingenieros y escritores colaboran en el mismo repositorio

## Cuándo NO usar
- Necesitas escribir páginas de documentación individuales — usa `/api-doc-writer` o `/readme-generator` para contenido específico
- Estás eligiendo una plataforma de documentación (Docusaurus vs MkDocs vs Mintlify vs GitBook) — esta habilidad cubre la arquitectura, no la selección de plataforma; toma esa decisión primero
- Quieres auditar la calidad de la documentación existente — esta es una habilidad estructural y de arquitectura, no una herramienta de auditoría
- Necesitas configurar el pipeline de compilación técnico — esta habilidad produce la arquitectura; la implementación es una tarea de ingeniería

## Instrucciones

### Arquitectura completa del sitio de documentación

```
Diseña la arquitectura de información para un sitio de documentación.

## Contexto
Producto: [nombre y descripción de 1 oración]
Audiencia: [quién lee esta documentación — usuarios finales / desarrolladores / administradores / los tres]
Tipos de documentación necesarios: [inicio rápido / referencia de API / guías prácticas / guías conceptuales / notas de lanzamiento / solución de problemas / todos]
Estado actual: [nuevo desde cero / migrando desde [fuente] / reestructurando sitio existente]
Volumen de contenido: [número aproximado de páginas — estimación aproximada está bien]
Equipo: [quién escribe: [N] escritores técnicos / los ingenieros escriben lo suyo / mixto]
Plataforma elegida: [Docusaurus / MkDocs / Mintlify / GitBook / Notion / personalizada / aún no elegida]

## Producir:

### 1. Resumen de la arquitectura de información
Estructura de navegación de nivel superior con justificación para cada sección:

```
/ (Inicio)
├── Inicio rápido/
│   ├── Introducción
│   ├── Inicio rápido
│   └── Instalación
├── Guías/
│   ├── [Tema 1]
│   └── [Tema 2]
├── Referencia/
│   ├── Referencia de API
│   ├── Configuración
│   └── Referencia de CLI
├── Conceptos/
│   └── [Explicaciones de conceptos fundamentales]
└── Registro de cambios/
```

Para cada sección de nivel superior: explica la intención del usuario que sirve y el contenido que contiene.

### 2. Taxonomía de contenido
Define los cuatro tipos de contenido Diátaxis para este producto:

**Tutoriales** (orientados al aprendizaje, experiencia guiada):
- Cuándo escribir un tutorial vs. una guía práctica
- Plantilla para tutoriales en el contexto de este producto
- Títulos de tutoriales de ejemplo para este producto

**Guías prácticas** (orientadas a tareas, resolución de problemas):
- Cuándo escribir una guía práctica vs. un tutorial
- Plantilla para guías prácticas
- Títulos de guías prácticas de ejemplo para este producto

**Referencia** (orientada a la información, consulta):
- Qué pertenece en referencia (endpoints de API, claves de configuración, indicadores de CLI, modelos de datos)
- Plantilla para páginas de referencia
- Cómo se genera automáticamente vs. se escribe a mano la referencia para este producto

**Explicación / Conceptual** (orientada a la comprensión):
- Qué conceptos necesitan documentación explicativa para este producto
- Plantilla para páginas de conceptos
- Temas conceptuales de ejemplo para este producto

### 3. Plantillas de páginas
Proporcionar plantillas de completar en blanco para:

**Plantilla de Inicio rápido:**
```markdown
# Primeros pasos con [Producto]

## Qué construirás
[1-2 oraciones — el resultado que logra el lector]

## Requisitos previos
- [requisito 1]
- [requisito 2]

## Paso 1: [Primera acción]
[instrucción]

```[lenguaje]
[ejemplo de código]
```

Salida esperada:
```
[qué ven cuando funciona]
```

## Paso 2: [Siguiente acción]
[instrucción]

## Qué acaba de suceder
[Breve explicación de lo que hace el código de inicio rápido — construye el modelo mental]

## Próximos pasos
- [Enlace al siguiente tutorial]
- [Enlace a la guía práctica relevante]
- [Enlace a referencia]
```

**Plantilla de guía práctica:**
```markdown
# Cómo [realizar una tarea específica]

[Una oración: para quién es y qué logra]

## Requisitos previos
- [Lo que necesitan antes de empezar]

## Pasos

### 1. [Primer paso]
[instrucción — voz imperativa, segunda persona]

```[lenguaje]
[código]
```

### 2. [Segundo paso]
[instrucción]

## Solución de problemas
**[Problema común]:** [Solución]
**[Mensaje de error común]:** [Qué significa y cómo solucionarlo]

## Relacionado
- [Guía práctica que a menudo va junto a esta]
- [Página de referencia para la configuración/API principal usada aquí]
```

**Plantilla de página de referencia:**
```markdown
# [Clave de configuración / Endpoint de API / Nombre del comando CLI]

[Una oración que describe qué hace esto]

## Sintaxis / Firma
```
[sintaxis exacta]
```

## Parámetros / Opciones
| Parámetro | Tipo | Requerido | Predeterminado | Descripción |
|---|---|---|---|---|
| `name` | string | Sí | — | [qué hace] |
| `timeout` | number | No | 30 | [qué hace] |

## Ejemplo
```[lenguaje]
[ejemplo mínimo funcional]
```

## Notas
[Casos extremos, advertencias, restricciones de versión]

## Ver también
[Elementos de referencia relacionados]
```

### 4. Reglas de diseño de navegación
Principios para la navegación del sitio de documentación:

- Profundidad máxima: [2 / 3 niveles — elige uno; más profundo casi siempre es peor]
- Barra lateral: [siempre visible / colapsada en móvil / con alcance de sección]
- Migas de pan: [sí / no — sí para jerarquías profundas]
- Longitud de página: [longitud máxima recomendada y cuándo dividir en subpáginas]
- Versionado: [¿necesita el sitio versionar la documentación? Estrategia para cómo]

### 5. Estrategia de búsqueda
- Herramienta de búsqueda: [Algolia DocSearch / texto completo integrado / pagefind / ninguna]
- Optimización de búsqueda: qué metadatos agregar a cada página (título, descripción, etiquetas)
- Facetado / filtrado: ¿necesita la audiencia filtrar por rol, nivel de producto o versión?

### 6. Flujo de trabajo de colaboradores
Cómo colaboran ingenieros y escritores:

- Convención de nombres de archivos: [kebab-case.md / tema/subtema.md]
- Proceso de revisión de PR: [el escritor revisa todos los PRs que tocan documentación / el ingeniero hace auto-merge con revisión del escritor]
- Señal de actualidad: frontmatter last_updated en cada página
- Verificación de enlaces rotos: [paso de CI — usar qué herramienta]
- Ubicación de la guía de estilo: [enlace o incorporar]

### 7. Lista de verificación de preparación para el lanzamiento
- [ ] La página de inicio tiene rutas claras a las 3 intenciones de usuario más comunes
- [ ] Cada página tiene título, descripción y last_updated
- [ ] Todos los ejemplos de código están probados y son ejecutables
- [ ] La búsqueda está configurada e indexada
- [ ] La página 404 tiene navegación útil de vuelta al contenido
- [ ] Análisis configurados (vistas de página, consultas de búsqueda, errores 404)
- [ ] Widget de retroalimentación en cada página ("¿Fue útil esto?")
- [ ] La verificación de enlaces rotos pasa en CI
```

### Clasificación de contenido Diátaxis

```
Clasifica este contenido por tipo Diátaxis y dime qué falta.

Tengo las siguientes páginas de documentación (lista títulos y descripción de 1 línea):
[lista tus páginas existentes]

Para cada página:
1. Clasificar como: Tutorial / Guía práctica / Referencia / Explicación / Poco claro / Mixto (marcar mixto como un problema)
2. Marcar páginas que son de tipo "mixto" — necesitan dividirse
3. Identificar qué cuadrantes de Diátaxis tienen brechas de contenido para este producto

Salida del análisis de brechas:
| Tipo Diátaxis | Cobertura | Temas faltantes |
|---|---|---|
| Tutorial | Buena / Escasa / Ninguna | [qué falta] |
| Guía práctica | Buena / Escasa / Ninguna | [qué falta] |
| Referencia | Buena / Escasa / Ninguna | [qué falta] |
| Explicación | Buena / Escasa / Ninguna | [qué falta] |

Prioridad recomendada: [qué tipo escribir más primero, y por qué]
```

### Interpretación de analíticas del sitio de documentación

```
Interpreta las analíticas del sitio de documentación y detecta problemas de contenido.

Fuente de analíticas: [Google Analytics / Plausible / Posthog / personalizado]

Datos disponibles:
- Top 10 páginas por vistas: [pegar]
- Top 10 consultas de búsqueda: [pegar]
- Páginas con mayor tasa de salida: [pegar]
- Errores 404 (rutas rotas más comunes): [pegar]

Analizar:
1. CONSULTAS DE BÚSQUEDA QUE NO ENCUENTRAN NADA: consultas en el registro de búsqueda con 0 resultados = brecha de contenido. Listarlas.
2. PÁGINAS CON ALTA TASA DE SALIDA: páginas con tasa de salida muy alta pueden estar fallando en responder la pregunta del usuario. Diagnosticar las 3 principales.
3. PÁGINAS FALTANTES (404s): listar rutas rotas — ¿cuáles de estas representan contenido real que debería existir?
4. PÁGINAS CON BAJO RENDIMIENTO: páginas que deberían tener mucho tráfico pero no lo tienen. ¿Qué podría explicar la brecha?

Salida: backlog de contenido priorizado basado en evidencia de analíticas.
```

## Ejemplo

**Usuario:** Estoy construyendo documentación para una biblioteca de integración de webhooks orientada a desarrolladores. Los usuarios son ingenieros que integran nuestra API. Necesito pasar de 3 archivos README a un sitio de documentación adecuado en Docusaurus. Estimado: ~40 páginas en total.

**Salida (extracto):**

```markdown
## Arquitectura de Información: Documentación de la Biblioteca de Webhooks

### Navegación de nivel superior

```
/ (Inicio)
├── Inicio rápido/
│   ├── Introducción (qué hace la biblioteca; lectura de 2 minutos)
│   ├── Inicio rápido (webhook funcionando en 5 minutos)
│   └── Instalación (todos los gestores de paquetes)
├── Guías/
│   ├── Recibir webhooks
│   ├── Validar firmas
│   ├── Manejar reintentos e idempotencia
│   ├── Probar webhooks localmente
│   └── Migrar desde manejo directo de HTTP
├── Referencia/
│   ├── Opciones del cliente
│   ├── Tipos de eventos
│   ├── Códigos de error
│   └── Registro de cambios
└── Conceptos/
    ├── Cómo funciona la entrega de webhooks
    ├── Verificación de firma en profundidad
    └── Garantías de reintento y orden
```

### Análisis de brechas de contenido
Tus 3 archivos README probablemente cubren: instalación, uso básico y algo de referencia de API.

Faltante (alta prioridad):
- Tutorial: "Recibe tu primer webhook en 5 minutos" — este es el punto de entrada para todos los nuevos usuarios
- Guía práctica: "Probar webhooks localmente con ngrok o Cloudflare Tunnel" — el punto de fricción más común para los desarrolladores
- Concepto: "Garantías de reintento y orden" — los ingenieros necesitarán esto antes de usarlo en producción
- Referencia: Catálogo de tipos de eventos — debería generarse automáticamente desde tu esquema, no escribirse a mano
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
