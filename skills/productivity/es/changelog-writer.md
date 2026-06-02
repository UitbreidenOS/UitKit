---
name: changelog-writer
description: "Registro de cambios orientado al usuario a partir del historial de git o PRs: agrupar por impacto, lenguaje claro, enlaces a documentación"
---

# Habilidad: Escritor de Registro de Cambios

## Cuándo activar
- Preparando un lanzamiento y necesitas convertir un git log o lista de PRs en un registro de cambios orientado al usuario
- Tu equipo lanza continuamente y necesitas escribir un resumen semanal o mensual de los cambios
- El CHANGELOG.md de ingeniería es demasiado técnico para compartirlo con los clientes
- Necesitas producir notas de lanzamiento para un anuncio de producto, correo electrónico o notificación dentro de la aplicación
- Quieres clasificar los cambios por impacto en el usuario (nueva función / mejora / corrección / cambio incompatible)

## Cuándo NO usar
- Estás escribiendo notas de lanzamiento técnicas internas para ingenieros — esas pueden mantenerse más cercanas al log de commits
- Necesitas una entrada de blog completa anunciando una función importante — eso es copia de marketing, no una entrada de registro de cambios
- Quieres una guía de migración para cambios incompatibles — usa `/api-doc-writer` para la guía de migración; la entrada del registro de cambios debe enlazar a ella, no reemplazarla
- Aún no has lanzado nada — escribe el registro de cambios después de que el código esté disponible, no antes

## Instrucciones

### Historial de git → registro de cambios orientado al usuario

```
Convierte este historial de git / lista de PRs en una entrada de registro de cambios orientada al usuario.

## Contexto del lanzamiento
Producto: [nombre]
Versión: [v2.4.0 / "lanzamiento de junio de 2026" / resumen semanal]
Fecha de lanzamiento: [fecha]
Audiencia: [usuarios finales / desarrolladores / administradores / mixta]

## Entrada sin procesar
[Pega uno de: salida de git log / lista de PRs fusionados / lanzamiento de Jira / hito de Linear / lista libre de cambios]

Formato de ejemplo de git log:
abc1234 feat: add bulk invite flow for workspace admins (#1203)
def5678 fix: pagination breaks when filter is active (#1188)
ghi9012 chore: upgrade React to 18.3 (#1201)  ← omitir este
jkl3456 feat(api): add cursor-based pagination to /v1/events (#1195)
mno7890 fix: email notifications sent twice on plan upgrade (#1179)
pqr2345 perf: reduce dashboard initial load time by 40% (#1197)
stu6789 BREAKING: remove deprecated /v1/users/bulk endpoint (#1200)

## Instrucciones

1. FILTRAR: Omitir cambios solo internos:
   - Actualizaciones de dependencias sin impacto visible para el usuario (`chore: upgrade X`)
   - Refactorizaciones sin cambio visible para el usuario (`refactor:`)
   - Cambios solo de pruebas (`test:`)
   - Cambios de CI/CD (`ci:`, `build:`)
   - Herramientas internas

2. CLASIFICAR cada cambio restante:
   - Nueva función: capacidad nueva que el usuario no tenía antes
   - Mejora: una función existente ahora funciona mejor (más rápido, más simple, extendida)
   - Corrección: algo que estaba roto ahora funciona
   - Cambio incompatible: algo que requiere acción del usuario para seguir funcionando
   - Seguridad: corrección relevante para la seguridad

3. REESCRIBIR en lenguaje claro:
   - Escribe para [audiencia] — no para ingenieros que leen el código
   - Sin hashes de commit, nombres de rama o números de tickets internos en la salida
   - Voz activa: "Ahora puedes..." / "Corregimos..." / "Mejoramos..."
   - Una oración por entrada para correcciones y mejoras; 2-3 oraciones para nuevas funciones
   - Enlaza a documentación donde sea relevante: "(Ver [enlace a documentación])"

4. ORDENAR por impacto:
   - Cambios incompatibles primero (para que los usuarios los vean de inmediato)
   - Nuevas funciones
   - Mejoras
   - Correcciones

## Formato de salida

---

## [Versión / Nombre del lanzamiento] — [Fecha]

### Cambios incompatibles
> Acción requerida antes de actualizar

- **[Título del cambio]:** [Descripción en lenguaje claro de qué cambió y qué debe hacer el usuario.] [Guía de migración →](#)

### Nuevas funciones
- **[Nombre de la función]:** [Qué hace y para quién es. Qué problema resuelve.]
- **[Nombre de la función]:** [...]

### Mejoras
- [Descripción en lenguaje claro de la mejora y su beneficio para el usuario]
- [...]

### Correcciones
- Corregido [descripción de qué estaba roto y cuál es ahora el comportamiento correcto]
- [...]

---
```

### Resumen de lanzamiento continuo (semanal/mensual)

```
Escribe una actualización de producto [semanal / mensual] a partir de esta lista de cambios lanzados.

Período: [rango de fechas]
Audiencia: [clientes en un boletín de producto / desarrolladores / administradores empresariales]
Tono: [conversacional / formal / técnico]

Cambios lanzados en este período:
[lista o pega git log / PRs]

Formato:
- Comienza con el cambio más impactante (1-2 oraciones — el gancho)
- Agrupa por área de producto o tema, no por fecha de lanzamiento
- Usa el lenguaje "nosotros" para los cambios ("Hemos hecho X más rápido..."), "tú" para los beneficios ("Ahora puedes...")
- Termina con una sección "próximamente" si tienes elementos del roadmap comprometidos para anunciar

Salida: un resumen de registro de cambios listo para pegar en un correo electrónico, notificación dentro de la aplicación o entrada de blog.
Extensión: [breve (menos de 200 palabras) / estándar (200-400 palabras) / detallado (400+ palabras para lanzamientos importantes)]
```

### Entrada de cambio incompatible (detallada)

```
Escribe una entrada de cambio incompatible para el registro de cambios.

Cambio: [describe el cambio incompatible en términos técnicos]
Qué solía funcionar: [el comportamiento antiguo]
Qué sucede ahora: [el nuevo comportamiento]
Por qué lo cambiamos: [la razón — sé honesto si es por deuda técnica, no solo "mejoras"]
Usuarios afectados: [quién se ve impactado — todos / solo usuarios de la función X / solo en el plan X]
Qué deben hacer: [pasos de acción específicos numerados 1, 2, 3]
Fecha límite: [fecha en que se elimina el comportamiento antiguo / cuándo deben migrar]
Guía de migración: [enlace a documentación]
Soporte: [dónde obtener ayuda]

Salida: una entrada de registro de cambios que sea suficientemente alarmante para que los usuarios la lean, pero no que provoque pánico.
Incluir: un encabezado claramente marcado como "Acción requerida".
No hacer: enterrar la acción requerida en texto de párrafo.
```

### Revisión de calidad del registro de cambios

```
Revisa este registro de cambios por calidad y completitud.

[Pega la entrada de registro de cambios existente]

Evalúa con estos criterios de calidad:

COMPLETITUD:
- [ ] ¿Todos los cambios incompatibles están listados y marcados claramente?
- [ ] ¿Cada entrada tiene una descripción en lenguaje claro (sin jerga, sin hashes de commit)?
- [ ] ¿Hay enlaces a documentación para las principales nuevas funciones?
- [ ] ¿Las correcciones explican qué estaba roto, no solo "se corrigió un error"?

LENGUAJE:
- [ ] ¿Escrito para [usuarios finales / desarrolladores] — no para el equipo interno?
- [ ] ¿Voz activa en todo momento?
- [ ] ¿Entradas ordenadas por impacto en el usuario (incompatible → nuevo → mejora → corrección)?
- [ ] ¿Sin números de tickets internos (JIRA-1234) visibles para lectores externos?

CAMBIOS INCOMPATIBLES:
- [ ] ¿Claramente separados de otros cambios?
- [ ] ¿Incluyen la acción específica que el usuario debe tomar?
- [ ] ¿Incluyen fecha límite y enlace a documentación de migración?

Para cada brecha: reescribe la entrada correctamente.
```

### Orientación de versionado semántico

```
Dados estos cambios, recomienda el aumento de versión semántica correcto.

Versión actual: [vX.Y.Z]
Cambios en este lanzamiento:
[lista los cambios]

Reglas de versionado semántico:
- MAYOR (X): cambios incompatibles — cambio de API incompatible, función eliminada, comportamiento cambiado que rompe el uso existente
- MENOR (Y): nuevas funciones — adiciones compatibles con versiones anteriores
- PARCHE (Z): correcciones de errores — solo correcciones compatibles con versiones anteriores

Recomendación: aumentar a v[X.Y.Z]
Razón: [qué cambio desencadenó el nivel de aumento]

Si el aumento es MAYOR: recordatorio de actualizar la guía de migración y comunicar el cronograma claramente.
```

## Ejemplo

**Usuario:** Aquí está nuestro git log del último sprint. Escribe el registro de cambios para v3.2.0.

```
a1b2c3d feat: workspace members can now export their own data (#445)
d4e5f6a feat(api): add filtering by date range to GET /v1/reports (#441)
g7h8i9j fix: CSV export includes duplicate rows when >1000 records (#438)
k1l2m3n fix: notifications not sent when user is on legacy plan (#436)
o4p5q6r perf: report generation 3x faster for large datasets (#440)
s7t8u9v chore: upgrade lodash to 4.17.21 (#443)
w1x2y3z docs: update API authentication guide (#444)
a4b5c6d BREAKING: /v1/exports now returns 202 Accepted instead of 200 OK for async exports (#439)
```

**Salida:**

```markdown
## v3.2.0 — 2 de junio de 2026

### Cambios incompatibles
> Acción requerida: actualiza tu integración si usas la API de Exportaciones

- **La API de Exportaciones ahora devuelve 202 para exportaciones asíncronas:** `POST /v1/exports` anteriormente devolvía `200 OK` con la URL de exportación. Ahora devuelve `202 Accepted` de inmediato, y debes consultar `GET /v1/exports/{id}` para el estado. Esto permite que las exportaciones se ejecuten de forma asíncrona sin bloquear tu solicitud. Actualiza cualquier código que verifique un código de estado `200` en la creación de exportaciones. [Guía de migración →](https://docs.example.com/guides/exports-migration)

### Nuevas funciones
- **Exportación de datos de autoservicio:** Los miembros del workspace ahora pueden exportar sus propios datos desde la configuración de su cuenta, sin necesidad de que un administrador lo haga en su nombre.
- **Filtrado por rango de fechas en la API de Reportes:** `GET /v1/reports` ahora acepta los parámetros de consulta `start_date` y `end_date` para filtrar resultados por un rango de fechas personalizado. [Ver referencia →](https://docs.example.com/api/reports)

### Mejoras
- La generación de reportes ahora es 3 veces más rápida para conjuntos de datos grandes. Los reportes que antes tardaban 30+ segundos ahora se completan en menos de 10.

### Correcciones
- Corregido un error donde las exportaciones CSV incluían filas duplicadas cuando la exportación contenía más de 1,000 registros.
- Corregido un problema donde las notificaciones por correo electrónico no se enviaban a usuarios en planes heredados.
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
