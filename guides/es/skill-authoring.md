# Guía de creación de skills

Cómo escribir una skill de Claude Code que realmente funcione — triggers precisos, patrones reales, sin relleno.

---

## Qué es una skill

Una skill es un archivo Markdown colocado en `.claude/skills/` que se convierte en un comando slash en Claude Code. Cuando escribes `/nombre-skill`, Claude lee el archivo y usa su contenido para guiar la sesión.

Una skill **no** es una plantilla de prompt. Es un conjunto estructurado de instrucciones que:
- Indica a Claude cuándo activarse y cuándo mantenerse al margen
- Proporciona patrones específicos del dominio que Claude no aplicaría por defecto
- Establece restricciones y anti-patrones para un tipo de tarea específico

---

## Ubicación y nombre del archivo

| Alcance | Ruta |
|---|---|
| Nivel de proyecto | `.claude/skills/<nombre-skill>.md` |
| Personal (todos los proyectos) | `~/.claude/skills/<nombre-skill>.md` |

Reglas de nomenclatura:
- Solo `kebab-case.md`
- El nombre debe coincidir con el comando slash deseado: `fastapi-crud.md` → `/fastapi-crud`
- Sé específico: `django-migrations.md` es mejor que `django.md`

---

## La estructura requerida

Cada skill debe tener estas cuatro secciones en este orden:

```markdown
# Nombre de la skill

## When to activate
[Condiciones de activación específicas]

## When NOT to use
[Anti-patrones — cuándo esta skill es la herramienta incorrecta]

## Instructions
[El contenido de la skill]

## Example
[Al menos un ejemplo concreto]
```

No añadas secciones más allá de estas sin una razón clara. La brevedad es una característica.

---

## Escribir "When to activate"

Esta es la sección más importante. Determina si Claude aplica la skill correctamente o la ignora.

**Malo — demasiado vago:**
```markdown
## When to activate
When working with Python APIs.
```

**Bueno — específico y accionable:**
```markdown
## When to activate
- Building a new FastAPI endpoint (GET, POST, PUT, DELETE)
- Adding request validation with Pydantic models
- Implementing dependency injection in FastAPI routes
- Writing async route handlers with background tasks
```

Reglas:
- Usa puntos de lista, un trigger por línea
- Sé concreto sobre la tarea, no la tecnología
- Si solo aplica a código nuevo versus código existente, dilo explícitamente

---

## Escribir "When NOT to use"

Esta sección evita que Claude aplique la skill en el contexto equivocado. Omítela y la skill se convierte en ruido.

**Ejemplo para una skill de FastAPI:**
```markdown
## When NOT to use
- Existing Flask or Django projects — use the appropriate skill instead
- Simple scripts that don't need an API layer
- When the user has already defined their own router structure — follow it rather than imposing this pattern
- gRPC or GraphQL APIs — different paradigms, different skills
```

---

## Escribir las instrucciones

Aquí es donde reside el valor de la skill. Escríbelas como instrucciones directas a Claude, no como documentación.

**Principios:**

1. **Sé directivo, no descriptivo.** Dile a Claude qué *hacer*, no qué *es* la tecnología.

   Malo: "FastAPI uses Pydantic for validation."
   Bueno: "Always define a Pydantic model for request bodies. Never accept raw dicts."

2. **Codifica decisiones.** Una skill debe resolver la ambigüedad, no crearla.

   Malo: "Use appropriate error handling."
   Bueno: "Raise `HTTPException` with status 422 for validation errors, 404 for not-found, 500 only for unexpected failures. Never let exceptions propagate to the response."

3. **Incluye lo no obvio.** Si un patrón es obvio, Claude ya lo sabe. Las skills ganan su valor codificando lo que es fácil hacer mal.

4. **Referencia las capacidades reales de Claude Code.** Una skill puede instruir a Claude para usar herramientas específicas, lanzar sub-agentes o activar hooks — úsalo.

5. **Mantenlo escaneable.** Usa encabezados, viñetas y bloques de código. Claude lee el archivo completo pero lo aplica mejor cuando la estructura es clara.

---

## Escribir el ejemplo

El ejemplo no es opcional. Ancla la skill en la realidad y muestra a Claude la calidad de salida esperada.

Un buen ejemplo incluye:
- El prompt del usuario que activaría la skill
- La estructura de salida esperada (no necesariamente código completo — la estructura importa más)
- Cualquier restricción que el ejemplo demuestre

---

## Longitud de la skill

| Tipo de skill | Longitud objetivo |
|---|---|
| Skill de tarea enfocada | 50–150 líneas |
| Skill de dominio (amplia) | 150–300 líneas |
| Skill de workflow | 300–500 líneas |

Si tu skill supera las 500 líneas, divídela en dos skills enfocadas. Las skills largas diluyen la atención de Claude.

---

## Probar tu skill

Antes de enviar a Claudient:

1. Copia la skill en el `.claude/skills/` de un proyecto real
2. Abre Claude Code y actívala con el comando slash
3. Dale a Claude una tarea que coincida con tus condiciones "When to activate"
4. Verifica que Claude aplica los patrones de tu sección Instructions
5. Dale a Claude una tarea que coincida con tus condiciones "When NOT to use"
6. Verifica que Claude NO aplica los patrones de la skill

Una skill que supera el paso 5 pero falla en el paso 6 necesita un trigger más específico.

---

## Errores comunes

**Describir la tecnología en lugar de guiar el comportamiento**
Las skills que leen como documentación no ayudan a Claude. Claude ya sabe qué es FastAPI. Dile cómo *tú* quieres que lo use.

**Triggers demasiado amplios**
`## When to activate: When writing Python` se activará en todo. Acótalo.

**Anti-patrones faltantes**
Sin "When NOT to use", Claude puede aplicar tu skill en contextos donde causa daño.

**Sin ejemplo**
Los ejemplos son la forma más rápida para que Claude se calibre a tu calidad de salida esperada.

**Importar buenas prácticas genéricas**
Una skill llena de consejos de codificación generales (usar anotaciones de tipo, escribir tests, manejar errores) añade ruido. Esos pertenecen a `rules/`, no a skills.

---

## Trabaja con nosotros





---

## Plantilla de skill

```markdown
# [Nombre de la skill]

## When to activate
- [Trigger específico 1]
- [Trigger específico 2]
- [Trigger específico 3]

## When NOT to use
- [Anti-patrón 1]
- [Anti-patrón 2]

## Instructions

### [Subtema 1]
[Instrucciones directivas]

### [Subtema 2]
[Instrucciones directivas]

## Example

**User:** [Prompt de ejemplo]

**Expected output:**
[Estructura o código esperado]
```
