---
name: ai-impact-assessment
description: "Evaluación de impacto de IA (AIA): clasificación de la Ley de IA de la UE, pista de riesgo, selección de caso de uso, consistencia de política, revisión de IA del proveedor — para equipos legal y cumplimiento"
---

> 🇪🇸 Versión en español. [Versión en inglés](../ai-impact-assessment.md).

# Habilidad de Evaluación de Impacto de IA

## Cuándo activar
- Su organización implementa un nuevo sistema o caso de uso de IA
- Necesita clasificar un sistema de IA bajo la Ley de IA de la UE
- Realizando una revisión de IA del proveedor antes de procurar un producto de IA
- Auditoría de implementaciones de IA existentes para detectar brechas de cumplimiento
- Generación de un documento de evaluación de impacto de IA para governance interno

## Cuándo NO usar
- Reemplazar una evaluación formal de impacto de protección de datos (DPIA) — ejecute ambas cuando sea necesario
- Asesoramiento legal sobre obligaciones de la Ley de IA — consulte asuntos legal especializado
- Monitoreo de sistema de IA en tiempo real — requiere herramientas dedicadas

## Importante

La Ley de IA de la UE entró en plena aplicación en agosto de 2026. Los sistemas de IA de alto riesgo requieren evaluaciones de conformidad obligatorias y registro. Claude estructura la evaluación — su DPO y asesoramiento legal deben revisar antes de presentaciones formales.

## Instrucciones

### Paso 1 — Toma de caso de uso

```
Nuevo sistema/caso de uso de IA para evaluar:

Nombre: [nombre del sistema o caso de uso]
Descripción: [qué hace, en lenguaje simple]
Implementador/desarrollador: [¿estamos construyendo esto o lo compramos?]
Usuarios: [empleados / clientes / terceros / público]
Tipo de salida: [decisión / recomendación / contenido / clasificación / predicción]
Resultados consecuentes: [qué sucede basado en la salida de IA?]
Entradas de datos: [datos personales / biométricos / categorías sensibles?]
Escala: [¿cuántas personas se ven afectadas?]
```

### Paso 2 — Clasificación bajo la Ley de IA de la UE

```
Clasificar este sistema de IA bajo la Ley de IA de la UE:

PROHIBIDO (Artículo 5) — verificar primero:
- Calificación social por autoridades públicas
- Identificación biométrica remota en tiempo real en espacios públicos
- Manipulación subliminal
- Explotación de grupos vulnerables
- Deducción de características políticas/religiosas/raciales de datos biométricos

Si ninguno de los anteriores aplica, clasificar por nivel de riesgo:

ALTO RIESGO (Anexo III) — evaluación de conformidad obligatoria requerida:
- Identificación/categorización biométrica
- Gestión de infraestructura crítica
- Resultados de educación/capacitación profesional
- Decisiones de empleo/RRHH
- Acceso a servicios esenciales (crédito, seguros, sanidad)
- Cumplimiento de la ley
- Migración/control fronterizo
- Administración de justicia

RIESGO LIMITADO:
- Chatbots e IA conversacional (obligación de transparencia)
- Reconocimiento de emociones (revelación requerida)
- Contenido generado por IA (marca de agua)
- Modelos de IA de propósito general

RIESGO MÍNIMO:
- IA en juegos
- Filtros anti-spam
- Búsqueda potenciada por IA

[VERIFY] clasificación con asesoramiento legal antes de confiar en ella.
```

### Paso 3 — Pista de riesgo (vía rápida vs. evaluación completa)

```
Basado en la clasificación:

VÍA RÁPIDA (riesgo mínimo/limitado):
- Documentar el sistema y su propósito
- Implementar medidas de transparencia requeridas
- Registrar la evaluación en el inventario de IA

VÍA COMPLETA (alto riesgo):
Documentación requerida:
1. Documentación técnica (Art. 11)
2. Evaluación de conformidad (Art. 43)
3. Registro en base de datos de la UE (Art. 71)
4. Plan de monitoreo post-mercado (Art. 72)
5. Procedimiento de informe de incidentes graves (Art. 73)

También requerido donde estén involucrados datos personales:
- Evaluación de impacto de protección de datos (DPIA) bajo GDPR
- Revisión de minimización de datos
- Comprobación de limitación de propósito

¿Qué pista se aplica a este sistema?
```

### Paso 4 — Comprobación de consistencia de política

```
Verificar este caso de uso de IA contra nuestras políticas internas:

Caso de uso: [describir]
Nuestra política de IA dice: [pegar texto de política relevante o describir]

¿Es este caso de uso consistente con:
1. Nuestra política de uso aceptable para IA?
2. Nuestros estándares de manejo de datos?
3. Nuestro proceso de aprobación de proveedores?
4. Nuestra declaración de apetito de riesgo?

Identificar brechas entre el caso de uso y nuestras políticas declaradas.
Redactar una solicitud de excepción si existe una brecha pero el caso de uso sigue siendo justificado.
```

### Paso 5 — Revisión de IA del proveedor

```
Estamos adquiriendo un producto de IA de [nombre del proveedor].
Producto: [qué hace]
Sus afirmaciones de IA: [qué dicen sobre sus capacidades de IA]

Revisar este proveedor para governance de IA:
1. ¿Publican una tarjeta de modelo o tarjeta de sistema?
2. ¿Divulgan fuentes de datos de entrenamiento?
3. ¿Tienen resultados de pruebas de sesgo?
4. ¿Tienen una política de IA responsable?
5. ¿Qué datos utilizan de nuestras entradas para entrenar modelos futuros?
6. ¿Estado de cumplimiento de la Ley de IA de la UE?
7. ¿Disposiciones contractuales clave que debería requerir?

Marcar todas las banderas rojas que deberían bloquear la adquisición sin revisión adicional.
```

### Paso 6 — Generar el documento AIA

```
Generar un documento formal de evaluación de impacto de IA.

Sistema: [nombre]
Clasificación: [alto riesgo / limitado / mínimo]
Resumen de evaluación: [pegar hallazgos de los pasos 1-4]

Secciones del documento:
1. Descripción del sistema y propósito
2. Clasificación de riesgo y justificación
3. Entradas de datos y evaluación de datos personales
4. Daños potenciales y grupos afectados
5. Consideraciones de sesgo e imparcialidad
6. Mecanismos de supervisión humana
7. Governance y responsabilidad
8. Riesgos residuales y medidas de mitigación
9. Condiciones para la implementación
10. Cronograma de revisión

[VERIFY] con DPO y asesoramiento legal antes de finalizar.
```

## Ejemplo

**Caso de uso:** Un equipo de RRHH quiere usar una herramienta de IA que evalúe CVs y puntúe candidatos antes de la revisión humana.

**Evaluación de Claude:**

**Clasificación: ALTO RIESGO** — Anexo III, Sección 4: Sistemas de IA utilizados en empleo y gestión de trabajadores, incluida la selección, captación y evaluación de candidatos.

**Requerido antes de la implementación:**
- Documentación técnica completa (Art. 11)
- Evaluación de conformidad o auditoría de terceros
- Registro en base de datos de la Ley de IA de la UE
- DPIA (procesa datos similares a biométricos — fotos, inferencia de edad)

**Riesgos clave:**
- Discriminación indirecta: modelo puede representar características protegidas a través de código postal, nombre, año de graduación
- Sesgo de datos de entrenamiento: si se entrena con contrataciones históricas, replica sesgo histórico
- Falta de transparencia: los candidatos tienen derecho a explicación significativa de decisiones automatizadas (GDPR Art. 22)

**Protecciones requeridas:**
- Revisión humana obligatoria antes de cualquier rechazo
- Divulgación a candidatos de que se usa IA en el screening
- Pruebas de sesgo en características protegidas antes de la implementación
- Derecho a revisión humana bajo solicitud
- Auditorías de sesgo regulares post-implementación

**Recomendado:** La adquisición debe estar condicionada a que el proveedor proporcione documentación de conformidad y acepte derechos de auditoría contractual.

---

> **Trabaje con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
