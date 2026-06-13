# Referencia de Frontmatter de Habilidades

Referencia completa para todos los campos de frontmatter YAML en archivos de habilidad de Claude Code. El frontmatter controla la activación correspondiente, la invocación automática, los valores predeterminados de esfuerzo y si la habilidad activa una llamada al modelo en absoluto.

---

## Campos Requeridos

### `name`

**Tipo :** `string` (kebab-case)
**Requerido :** Sí

El identificador que se convierte en el comando de barra invertida. `name: fastapi-crud` → `/fastapi-crud`.

```yaml
name: fastapi-crud
```

Reglas:
- Debe ser único en todos los archivos de habilidad en alcance (proyecto + global)
- Solo kebab-case — sin guiones bajos, sin puntos
- Manténgalo lo suficientemente corto para escribir sin fricción de autocompletado

---

### `description`

**Tipo :** `string`
**Requerido :** Sí
**Límite de caracteres :** Cuenta hacia el límite compartido de 1.536 caracteres con `when_to_use`

La señal principal que Claude usa para coincidencia semántica — tanto para invocación automática como para responder a comandos de barra invertida del usuario. Escriba esto como una condición de activación explícita, no como un resumen de capacidades.

```yaml
description: "Creación de puntos finales FastAPI con validación Pydantic, manejadores de ruta asincrónica e inyección de dependencias. Active para nuevas rutas de API, definiciones de modelos de solicitud o configuración de tareas en segundo plano."
```

Malo: `"Una habilidad para FastAPI."` — demasiado vago, mala señal de coincidencia.
Bueno: el ejemplo anterior — tecnología + tipo de tarea + subtareas específicas.

---

## Campos Opcionales

### `when_to_use`

**Tipo :** `string`
**Límite de caracteres :** Límite compartido de 1.536 caracteres con `description`

Contexto de activación adicional añadido a `description` en la lista de habilidades. Use para condiciones de activación que son demasiado verbosas para la descripción pero mejoran la precisión de coincidencia.

```yaml
when_to_use: "Activar cuando el usuario mencione FastAPI, API de Python asincrónica, modelos Pydantic, o esté trabajando en un proyecto que tenga main.py con app = FastAPI() definido."
```

Trate `description` como el encabezado y `when_to_use` como el contexto de coincidencia extendido. Ambos cuentan hacia el mismo límite de 1.536 caracteres — presupueste en consecuencia.

---

### `paths`

**Tipo :** `array` de cadenas glob
**Predeterminado :** Ninguno (la habilidad nunca se activa automáticamente por contexto de archivo)

Activa automáticamente la habilidad cuando Claude toca un archivo que coincide con cualquier patrón listado. Útil para utilidades de prueba, ayudantes de archivo de configuración y herramientas de esquema que deben cargar silenciosamente cuando Claude abre archivos específicos.

```yaml
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "**/jest.config.*"
```

Notas:
- La coincidencia es contra la ruta del archivo que Claude está leyendo o editando actualmente, no el directorio de trabajo
- Las habilidades con `paths:` se activan silenciosamente — el usuario no ve una invocación de comando de barra invertida
- Múltiples habilidades pueden activarse a través de `paths:` simultáneamente — no hay resolución de conflictos; todas las habilidades activadas se cargan

---

### `effort`

**Tipo :** `string` — `"low"` | `"medium"` | `"high"` | `"xhigh"`
**Predeterminado :** Hereda de la configuración de esfuerzo activo de la sesión

Anula el nivel de esfuerzo para sesiones donde esta habilidad está activa. Use `"xhigh"` para habilidades que implican análisis de seguridad, decisiones de arquitectura o cualquier tarea donde perder una restricción sutil tiene consecuencias reales.

```yaml
effort: xhigh
```

| Valor | Apropiado para |
|---|---|
| `"low"` | Reformateo, cambio de nombre, generación de boilerplate, clasificación simple |
| `"medium"` | Implementación de funcionalidad de rutina, refactores simples |
| `"high"` | Trabajo de función compleja, cambios de múltiples archivos con dependencias |
| `"xhigh"` | Revisión de seguridad, decisiones de arquitectura, depuración de problemas profundos |

---

### `shell`

**Tipo :** `string`
**Predeterminado :** `"bash"`

Anula el intérprete de shell para bloques de script dentro de la habilidad. Relevante solo para habilidades específicas de Windows donde se requiere PowerShell.

```yaml
shell: powershell
```

Deje sin configurar para cualquier habilidad dirigida a macOS, Linux o ambientes multiplataforma.

---

### `disable-model-invocation`

**Tipo :** `boolean`
**Predeterminado :** `false`

Cuando `true`, activar la habilidad no desencadena una respuesta del modelo. El cuerpo de la habilidad se carga en contexto como una directiva, y el modelo la aplica a interacciones subsecuentes en lugar de generar una respuesta inmediata.

```yaml
disable-model-invocation: true
```

Use para:
- Habilidades que configuran comportamiento sin necesidad de "responder" (p. ej., directivas de estilo `always-use-typescript`)
- Habilidades que inyectan contexto pasivamente (p. ej., una habilidad que carga convenciones de proyecto en contexto sin actuar sobre ellas inmediatamente)

---

## Presupuesto de Caracteres

La lista de habilidades utilizada para coincidencia de invocación automática tiene un límite estricto:

| Campo | Presupuesto |
|---|---|
| `description` + `when_to_use` combinados | 1.536 caracteres |
| Cuerpo completo de habilidad (cargado al encontrar coincidencia) | ~15.000 caracteres |

**Estrategia :** Ponga desencadenantes de activación densos y ricos en palabras clave en `description` y `when_to_use`. Ponga instrucciones detalladas, ejemplos de código y patrones en el cuerpo de la habilidad. El cuerpo solo se carga después de que se haga la coincidencia — no afecta el desempeño de coincidencia.

---

## Detección de Monorepo

Las habilidades **no** suben por el árbol de directorios. Esta es la fuente más común de confusión al migrar de patrones CLAUDE.md.

| Característica | ¿Sube por el árbol? |
|---|---|
| `CLAUDE.md` | Sí — sube del archivo actual a la raíz del repositorio |
| `.claude/rules/` | No — usa coincidencia de frontmatter `paths:` |
| `.claude/skills/` | No — solo las habilidades en el `.claude/skills/` más cercano están activas |
| `~/.claude/skills/` | Siempre activo independientemente del directorio |

En un monorepo:
- Las habilidades globales (`~/.claude/skills/`) están disponibles en todas partes
- Las habilidades de nivel raíz `.claude/skills/` están disponibles solo desde la raíz del repositorio
- Los directorios `.claude/skills/` a nivel de paquete son necesarios para habilidades específicas de paquete

---

## Ejemplo de Frontmatter Completo

```yaml
---
name: drizzle-orm
description: "Definición de esquema Drizzle ORM, construcción de consultas e integración Neon Postgres en TypeScript. Active para trabajo de esquema de base de datos, patrones de consulta ORM o creación de migración."
when_to_use: "Use al trabajar con archivos drizzle.config.ts, schema.ts, directorio db/, o cuando el usuario mencione Drizzle, Neon o migraciones de base de datos en un proyecto TypeScript."
paths:
  - "**/schema.ts"
  - "**/drizzle.config.ts"
  - "db/**"
  - "**/migrations/**"
effort: high
---

# Drizzle ORM

## Cuándo activar
...
```

---

## Resumen de Compatibilidad de Campos

| Campo | Requerido | Efecto de invocación automática | Efecto de invocación manual |
|---|---|---|---|
| `name` | Sí | Nombre del comando de barra invertida | Identificador principal |
| `description` | Sí | Señal de coincidencia principal | Se muestra en la lista de habilidades |
| `when_to_use` | No | Señal de coincidencia secundaria | Se muestra en la lista de habilidades |
| `paths` | No | Activación automática basada en archivo | Sin efecto |
| `effort` | No | Establece esfuerzo cuando se activa la habilidad | Establece esfuerzo cuando se activa la habilidad |
| `shell` | No | Sin efecto en coincidencia | Cambia intérprete de script |
| `disable-model-invocation` | No | Sin respuesta generada | Sin respuesta generada |

---
