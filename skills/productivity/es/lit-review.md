---
name: lit-review
description: "Revisión de literatura académica: estrategia de búsqueda sistemática, evaluación de artículos, marcos de síntesis, gestión de citas y producción de una sección de revisión estructurada o resumen"
---

# Habilidad Lit Review

## Cuándo activar
- Realizar una revisión sistemática o exploratoria de la literatura académica
- Sintetizar resultados en múltiples artículos sobre un tema
- Escribir una sección de revisión de literatura para una tesis, informe o artículo
- Identificar brechas en la investigación existente
- Evaluar la calidad de la evidencia académica
- Encontrar las citas canónicas para un concepto técnico

## Cuándo NO usar
- Análisis de patentes — usar la habilidad patent-analysis
- Investigación general de internet — esto es específico de literatura académica
- Recopilación de datos primarios o diseño de estudios — habilidad de métodos de investigación diferente
- Escribir el artículo completo — esta habilidad cubre revisión, no investigación original

## Instrucciones

### Estrategia de búsqueda

```
Diseñar una estrategia de búsqueda de literatura para [tema].

Tema de investigación: [descripción — ¿qué pregunta intenta responder?]
Tipo de revisión: [sistemática (exhaustiva) / exploratoria (mapeo amplio) / narrativa (selectiva)]
Bases de datos a buscar: [PubMed / Scopus / Web of Science / ACM / IEEE / Google Scholar / arXiv]
Rango de fechas: [últimos 5 años / 2000-presente / todo el tiempo]
Idiomas: [solo inglés / todos los idiomas]

Estrategia de búsqueda:

1. Descomponer el tema en conceptos:
   PICO (para médico/clínico) o SPIDER (cualitativo):
   Población: [quién/qué se está estudiando]
   Intervención/exposición: [qué se está haciendo/estudiando]
   Comparación: [con qué se compara, si aplica]
   Resultado: [qué se está midiendo]

2. Construir listas de palabras clave para cada concepto:
   Concepto 1: [término principal] Y [sinónimos] Y [abreviaturas]
   Ejemplo: "machine learning" O "ML" O "artificial intelligence" O "deep learning"
   
   Concepto 2: [término principal] Y [sinónimos]
   Ejemplo: "clinical prediction" O "diagnostic accuracy" O "clinical decision support"

3. Combinar con operadores booleanos:
   (Palabras clave Concepto 1) Y (Palabras clave Concepto 2) Y (Palabras clave Concepto 3)

4. Aplicar filtros:
   - Rango de fechas: publicado: [YYYY] a [YYYY]
   - Tipo de documento: artículos de revista / artículos de conferencia / excluir disertaciones
   - Idioma: inglés
   - Tipo de estudio (si aplica): ensayo controlado aleatorizado / revisión sistemática / cohorte

5. Ejecutar en cada base de datos por separado (no asumir que sean iguales):
   - Registrar: base de datos, cadena de búsqueda utilizada, fecha de ejecución, número de resultados

6. Gestionar duplicados entre bases de datos:
   Usar: Zotero / Mendeley / Rayyan para deduplicación
   Exportar todos los resultados → combinar → deduplicar por título/DOI

Generar la estrategia de búsqueda para mi tema con cadenas de búsqueda específicas de la base de datos.
```

### Protocolo de evaluación

```
Evalúe artículos para inclusión/exclusión para [revisión].

Total recuperado: [X artículos]
Criterios de inclusión: [qué se califica para la inclusión]
Criterios de exclusión: [qué se elimina y por qué]

Protocolo de evaluación:

ETAPA 1 — Evaluación de título y resumen (más rápido):
Incluir si: el título o resumen sugiere que el artículo aborda [su tema]
Excluir si: claramente fuera del tema, población incorrecta, tipo de estudio incorrecto
Decisión: incluir / excluir / incierto (incierto → incluir para revisión de texto completo)

ETAPA 2 — Evaluación de texto completo:
Leer la sección de métodos: ¿cumple con todos los criterios de inclusión?
Aplicar criterios de exclusión sistemáticamente

Lista de verificación de criterios de inclusión (personalizar para su tema):
☐ Población: [describir quién/qué se califica]
☐ Intervención: [describir qué debe estudiarse]
☐ Resultado: [qué debe medirse/reportarse]
☐ Diseño del estudio: [diseños aceptables — p. ej., ECA, cohorte, antes-después]
☐ Publicación: [solo revisado por pares / literatura gris OK / artículos de conferencia OK]
☐ Idioma: [solo inglés]
☐ Fecha: [publicado después de YYYY]

Criterios de exclusión:
☐ Publicación duplicada del mismo estudio
☐ Datos insuficientes para extracción (solo resumen disponible)
☐ Artículo de protocolo sin resultados
☐ Resumen de conferencia sin artículo completo
☐ No revisado por pares (si aplica)

Registrar decisiones:
| Artículo | Título | Decisión | Razón para exclusión |
|---|---|---|---|
| [1] | [título] | Incluir | — |
| [2] | [título] | Excluir | Población incorrecta |

Objetivo: tasa de inclusión de 5-15% es típica para revisiones sistemáticas.
Si > 30%: la búsqueda es demasiado estrecha o los criterios demasiado amplios — revisar.
Si < 2%: la búsqueda es demasiado amplia o los criterios demasiado estrechos — ajustar.

Generar criterios de evaluación para mi tema específico de revisión.
```

### Plantilla de extracción de datos

```
Extraer datos de artículos para [revisión].

Artículos a extraer: [X artículos incluidos]
Pregunta de investigación: [reformular]
Datos a extraer: [qué información necesita de cada artículo]

Tabla de extracción de datos (personalizar columnas para su tema):

Para cada artículo registrar:
| Campo | Descripción |
|---|---|
| Cita | Autor (Año). Título. Revista. DOI. |
| Diseño del estudio | ECA / cohorte / transversal / caso-control / cualitativo |
| Población | N, demografía, escenario, país |
| Intervención | Qué se hizo, duración, dosis |
| Comparación | Condición de control |
| Medida de resultado | Resultado primario, cómo se midió |
| Resultado clave | Hallazgo principal (incluir tamaño del efecto / valor p / IC) |
| Riesgo de sesgo | Alto / Medio / Bajo (basado en diseño del estudio) |
| Relevancia para nuestra pregunta | Directa / Indirecta / Periférica |
| Notas | Limitaciones, hallazgos inusuales, conflictos de autores |

Herramientas de evaluación de calidad por tipo de estudio:
- ECA: Herramienta de Riesgo de Sesgo de Cochrane (RoB 2)
- Estudios de cohorte: Escala Newcastle-Ottawa (NOS)
- Cualitativo: Lista de verificación CASP
- Revisiones sistemáticas: AMSTAR-2
- Todos los tipos de estudio: GRADE para certeza de la evidencia

Mejores prácticas de extracción:
- Extraer por una persona, verificar por una segunda (extracción doble reduce errores)
- Extraer a la unidad de análisis — si el artículo reporta 3 resultados relevantes, extraer cada uno
- Anotar si faltan datos o son poco claros — no imputar
- Registrar la fuente de figura/tabla para cada número extraído

Generar la plantilla de extracción para mi pregunta de revisión y tipos de artículos.
```

### Síntesis y redacción

```
Sintetizar resultados y escribir una sección de revisión de literatura.

Artículos incluidos: [X]
Temas emergentes: [describir 3-5 temas recurrentes en artículos]
Hallazgos de consenso: [donde los artículos concuerdan]
Contradicciones: [donde los artículos no concuerdan y por qué]
Brechas: [qué no ha sido estudiado]
Audiencia: [comité de tesis / revisores de revista / legisladores / no especialistas]

Enfoques de síntesis:

SÍNTESIS NARRATIVA (más común):
Agrupar artículos por tema o hallazgo, no por artículo individual.
No: "Smith (2020) encontró X. Jones (2021) encontró Y. Brown (2022) encontró Z."
Sí: "Múltiples estudios demuestran [X], particularmente en [contexto] (Smith 2020; Jones 2021). Sin embargo, la evidencia es mixta en [contexto diferente], con Brown (2022) encontrando [Y] pero Chen (2023) reportando [Z], potencialmente debido a [diferencia metodológica]."

META-ANÁLISIS (si los datos cuantitativos son homogéneos):
Agrupar tamaños de efecto entre estudios → promedio ponderado
Requiere: misma medida de resultado, poblaciones comparables, diseños de estudio compatibles
Herramientas: RevMan, paquete R metafor

ANÁLISIS TEMÁTICO (para cualitativo):
Codificar temas entre artículos → sintetizar patrones

Estructura de la sección de revisión de literatura:

1. Párrafo de apertura:
   [Enmarcar la revisión en contexto de su pregunta de investigación]
   "Esta sección revisa [X] estudios examinando [tema]."

2. Cuerpo (organizado por tema, no por artículo):
   Tema 1: [Hallazgo en múltiples artículos + citas]
   Tema 2: [Evidencia contradictoria + explicación]
   Tema 3: [Avances metodológicos]

3. Párrafo de brechas:
   "A pesar de evidencia sustancial para [X], [brecha] sigue siendo poco estudiada. [Solo N estudios] han examinado [población/contexto específico]. Esta revisión [identifica / aborda] esta brecha."

4. Párrafo de cierre:
   [Qué establece la revisión / qué no puede establecer / cómo esto configura su investigación]

Escribir la sección de revisión de literatura para mis artículos incluidos y temas.
```

## Ejemplo

**Usuario:** Estoy revisando la literatura sobre alucinaciones de LLM en contextos médicos para un artículo de conferencia. He encontrado 32 artículos. ¿Cómo los sintetizo?

**Plan de síntesis de Claude:**

32 artículos es manejable para una síntesis narrativa en un artículo de conferencia (en lugar de una revisión sistemática completa). Organizar por tema, no por artículo.

**Temas probables en 32 artículos sobre alucinaciones de LLM en medicina:**

1. **Frecuencia y dominios clínicos** — ¿Qué tasa de alucinación? ¿Qué dominios clínicos (radiología, dosificación de medicamentos, enfermedades raras) son los peores? (Organizar artículos por dominio y reportar tasas)

2. **Métodos de detección** — ¿Cómo identifican los investigadores alucinaciones? (Revisión de expertos / verificación de hechos automatizada / correlación de resultados de pacientes) — sintetizar enfoques metodológicos

3. **Factores de riesgo** — ¿Qué aumenta el riesgo de alucinación? (¿Salidas de forma larga? ¿Condiciones raras? ¿LLM específicos?) — aquí es donde vive el desacuerdo

4. **Estrategias de mitigación** — RAG, ajuste fino, humano en el bucle, IA constitucional — ¿qué evidencia existe para cada una?

5. **Brechas metodológicas** — La mayoría de estudios: N pequeño, institución única, solo inglés, LLM generales en lugar de ajustes finos clínicos. Esta es su sección de brechas.

**Ejemplo de párrafo de síntesis (tema 1):**

"Las tasas de alucinación en aplicaciones clínicas de LLM varían sustancialmente por dominio y complejidad de tareas. En tareas de dosificación de medicamentos y farmacología, [X] estudios reportan tasas de error de [rango]% (Smith 2023; Lee 2024; Patel 2024), con tasas más altas observadas para medicamentos raros o escenarios complejos de polifarmacia (Smith 2023; Brown 2024). La generación de informes de radiología muestra tasas de alucinación comparativamente más bajas ([Y]%) en tareas que involucran hallazgos estructurados (Jones 2023), aunque tareas de interpretación narrativa muestran tasas cercanas a [Z]% (Kim 2024; Thomas 2024). En todos los dominios, las tasas de alucinación son consistentemente más altas en contextos donde el modelo debe generar valores numéricos específicos (dosis, rangos de referencia de laboratorio) comparado con asesoramiento clínico general (Smith 2023; Lee 2024; Kim 2024)."

Nota: Estoy sintetizando artículos por hallazgo, no por artículo — este es el cambio estructural clave.

---
