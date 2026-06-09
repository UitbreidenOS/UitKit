---
description: Resumir notas brutas de reuniones en decisiones, acciones y preguntas abiertas
argument-hint: "[raw notes or transcript]"
---
Resume las siguientes notas de reunión en un documento estructurado: $ARGUMENTS

Produce exactamente cuatro secciones:

**Contexto** (2–4 oraciones)
Quiénes asistieron, de qué fue la reunión, qué la motivó. Infiere de las notas si no es explícito.

**Decisiones Tomadas**
Lista con viñetas. Cada viñeta es una decisión concreta, no un tema discutido. Omite cualquier cosa que se haya discutido pero no se haya resuelto. Si no se tomaron decisiones, escribe "Ninguna".

**Elementos de Acción**
Lista con viñetas. Formato: `[Responsable] — Acción — Fecha de vencimiento (si se menciona)`. Si no hay responsable explícito, escribe `[POR DETERMINAR]`. Si no hay fecha de vencimiento, omítela.

**Preguntas Abiertas**
Lista con viñetas de preguntas no resueltas o elementos explícitamente pospuestos. Si no hay ninguno, omite la sección.

Reglas:
- No editorices — mantente fiel al material fuente.
- No inventes responsables, decisiones o plazos no presentes en las notas.
- Si las notas son demasiado escasas para producir un resumen útil, dilo y lista qué falta.
- Colapsa elementos duplicados o redundantes.
- Mantén el resultado total por debajo de 400 palabras a menos que la reunión fuera inusualmente compleja.
- Usa Markdown simple — sin HTML, sin tablas a menos que los elementos de acción sean demasiados para leer linealmente.

Solo el resumen. Sin preámbulo.
