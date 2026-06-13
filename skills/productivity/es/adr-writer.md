---
name: adr-writer
description: "Escribir registros de decisiones arquitectónicas en formato Nygard. Se activa en decisiones arquitectónicas, comparaciones de enfoques o decisiones pasadas no documentadas."
---

# ADR Writer

## Cuándo activar

- Tomar una decisión entre dos o más enfoques técnicos (por ejemplo, elegir un ORM, seleccionar una estrategia de caché, elegir un sistema de colas)
- Después de que una decisión se haya tomado verbalmente en una reunión o chat y necesite documentación formal
- Cuando la base de código muestra un patrón inusual y no hay explicación de por qué fue elegido
- Antes de comprometerse con un cambio arquitectónico difícil de revertir (esquema de base de datos, modelo de autenticación, versionamiento de API)
- Cuando una decisión afecta a múltiples equipos o servicios y necesita un registro de auditoría claro

## Cuándo no usar

- Detalles de implementación fácilmente cambiables sin impacto (nombres de variables, estructura de carpetas dentro de un módulo)
- Decisiones puramente estilísticas sin compensaciones
- Actualizaciones de versión de dependencias de terceros a menos que introduzcan comportamientos críticos
- Decisiones totalmente reversibles en menos de una hora sin efectos aguas abajo

## Instrucciones

### Qué califica como ADR

Una decisión requiere un ADR si los tres puntos son verdaderos:
1. Es **difícil de revertir** — deshacerla requiere esfuerzo significativo o causa impactos aguas abajo
2. Sería **sorprendente sin contexto** — un nuevo desarrollador leyendo el código se preguntaría por qué
3. **Existió un verdadero compromiso** — al menos una alternativa plausible fue considerada y rechazada

Si tiene dudas, escriba el ADR. El costo de documentar un no-evento es bajo; el costo de perder la documentación de una decisión crítica es alto.

### Formato ADR (Nygard)

```markdown
# ADR-[NNNN]: [Título corto en forma nominal]

**Fecha:** [YYYY-MM-DD]
**Estado:** [Aceptado | Reemplazado por ADR-NNNN | Deprecado]
**Reemplaza:** [ADR-NNNN si aplica, de lo contrario omitir]

## Contexto

[2–4 oraciones: ¿Qué situación o problema forzó esta decisión?
Incluya restricciones relevantes: tamaño del equipo, cronograma, stack existente, requisitos externos.]

## Decisión

[Una oración, voz activa, presente.
"Usaremos X para Y porque Z." No "Se decidió que..."]

## Justificación

[¿Por qué esta opción sobre las alternativas?
Enfóquese en los factores específicos que hicieron esta la opción correcta para este contexto.
Evite elogios genéricos — "es popular" no es una justificación.]

## Alternativas consideradas

| Opción | Razón del rechazo |
|---|---|
| [Alternativa A] | [Razón específica del rechazo] |
| [Alternativa B] | [Razón específica del rechazo] |

## Consecuencias

**Positivas:**
- [Lo que esto hace más fácil o mejor]

**Negativas:**
- [Lo que esto hace más difícil o introduce como nueva complejidad]

**Neutrales:**
- [Cambios que son ni buenos ni malos, simplemente diferentes]

## Fecha de revisión

[Fecha 6–12 meses a partir de ahora, o el evento que debería desencadenar una revisión: "Revisar cuando el equipo supere 10 ingenieros" o "Revisar después del primer incidente de producción que involucre X"]
```

### Almacenamiento y numeración

- Almacenar en `docs/decisions/` o `docs/adr/` — elegir uno y nunca mezclar
- Nombre de archivo: `ADR-0001-kebab-case-titulo.md`, `ADR-0002-...`
- La numeración es secuencial y nunca se reutiliza — incluso si un ADR es deprecado
- Al reemplazar un ADR: actualice el estado del ADR antiguo a `Reemplazado por ADR-NNNN`, vincule el nuevo ADR al antiguo

### Vincular ADRs reemplazados

Cuando una decisión cambia:
```markdown
# ADR-0007: Cambiar de REST a GraphQL para API de Cliente

**Estado:** Aceptado
**Reemplaza:** ADR-0003 (Diseño de API REST-first)
```

Y actualice el ADR antiguo:
```markdown
**Estado:** Reemplazado por ADR-0007
```

### Qué NO incluir

- Detalles de implementación (versión exacta de biblioteca, valores de configuración) — estos pertenecen al README o comentarios en línea
- Nombres de miembros del equipo — use roles ("equipo backend", "CTO") si se requiere atribución
- Predicciones sobre el futuro — manténgase en lo que se sabe ahora
- Texto copiado del sitio web de un proveedor

## Ejemplo

**Escenario:** El equipo eligió Drizzle ORM sobre Prisma para un nuevo proyecto TypeScript.

**ADR generado:**

```markdown
# ADR-0004: Drizzle ORM sobre Prisma para capa de acceso a datos

**Fecha:** 2026-05-23
**Estado:** Aceptado

## Contexto

Selección de un ORM para una nueva API TypeScript que interactúa con PostgreSQL.
El proyecto tiene un equipo pequeño (2 ingenieros), requisitos de rendimiento estricto en operaciones de inserción masiva, y un esquema ya existente definido como migraciones SQL.
El equipo tiene experiencia previa con ambas opciones.

## Decisión

Usaremos Drizzle ORM para todos los accesos de base de datos porque nos proporciona consultas type-safe sin un paso de generación de código y no abstrae SQL sin procesar cuando lo necesitamos.

## Justificación

Drizzle trata SQL como la fuente de verdad, lo que se alinea con nuestros archivos de migración escritos a mano existentes. El modelo schema-first de Prisma requeriría duplicar definiciones de tablas. En benchmarks de inserción masiva contra nuestro tamaño de conjunto de datos objetivo (500k filas/lote), Drizzle fue 2,3× más rápido en nuestro prototipo.
El cliente generado de Prisma agrega ~100ms de inicio en frío que importa en nuestro contexto de implementación sin servidor.

## Alternativas consideradas

| Opción | Razón del rechazo |
|---|---|
| Prisma 5 | El paso de generación de código agrega complejidad de CI; schema-first entra en conflicto con nuestras migraciones SQL existentes; inicio en frío más lento |
| Cliente pg sin procesar | Demasiado boilerplate para la construcción de consultas; sin inferencia de tipo en resultados de consulta |
| Kysely | Contendiente fuerte — rechazado solo porque el equipo no tiene experiencia previa con Kysely y la API de Drizzle es más familiar |

## Consecuencias

**Positivas:**
- Los resultados de consultas están tipados sin un paso de compilación
- Escape SQL directo disponible sin dejar el ORM
- Tamaño de paquete más pequeño que Prisma

**Negativas:**
- El ecosistema de Drizzle es más pequeño que el de Prisma — menos plugins comunitarios
- Las herramientas de migración (drizzle-kit) son menos maduras que Prisma Migrate

**Neutrales:**
- El equipo debe aprender la sintaxis del constructor de consultas de Drizzle

## Fecha de revisión

2027-05-23, o si un lanzamiento de Prisma 6 aborda significativamente el problema de inicio en frío.
```

---
