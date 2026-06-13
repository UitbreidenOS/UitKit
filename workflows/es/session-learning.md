# Captura de aprendizaje de sesión

Flujo de trabajo de fin de sesión que extrae lecciones, decisiones y descubrimientos de una sesión Claude Code y los persiste antes de que se cierre la ventana de contexto. Previene la evaporación del conocimiento entre sesiones.

---

## Cuándo usarlo

- Al final de cualquier sesión que dure más de 30 minutos
- Después de tomar una decisión arquitectónica durante una sesión de codificación
- Cuando resuelve un problema no obvio y desea que futuras sesiones Claude se beneficien de la solución
- Antes de cerrar una sesión autónoma larga para preservar lo que se aprendió
- Cada vez que se encuentra pensando "recordaré esto" — no lo hará, y tampoco Claude

---

## Fases

### Fase 1 — Resumen de sesión

Comience esta fase antes de que el contexto se comprima demasiado.

```
Estamos terminando esta sesión. Antes de cerrar:

Resuma lo que sucedió en esta sesión:
1. ¿Cuál era el objetivo original?
2. ¿Qué fue realmente construido o cambiado?
3. ¿Qué enfoques se intentaron y se abandonaron — y por qué?
4. ¿Qué cosas no obvias descubrimos? (gotchas, comportamiento no documentado, limitaciones)
5. ¿Qué sigue sin terminar y cuál es el siguiente paso concreto?

Manténgalo fáctico. Sin relleno.
```

Revise el resumen para verificar su precisión antes de proceder. Corrija cualquier cosa que Claude entendió mal sobre lo que se decidió.

---

### Fase 2 — Extracción de regla

```
Basado en este resumen de sesión, identifique instrucciones que deberían agregarse a CLAUDE.md.

Una regla pertenece a CLAUDE.md si:
- Es específica de este proyecto (no consejo de programación general)
- Claude tomaría una decisión diferente sin ser informado
- Provino de una decisión real tomada en esta sesión

Para cada regla candidata:
  - Texto propuesto (una o dos líneas, tono directivo)
  - Sección de CLAUDE.md donde pertenece
  - Por qué importaría en una sesión futura

No proponga reglas que ya estén presentes en CLAUDE.md.
No proponga consejos genéricos ("escribir código limpio", "manejar errores").
```

Revise cada regla propuesta. Acepte, rechace o edite cada una. No agregue reglas con las que no esté de acuerdo — Claude las seguirá literalmente en futuras sesiones.

---

### Fase 3 — Captura de decisión arquitectónica

```
¿Implicó esta sesión decisiones arquitectónicas?

Una decisión califica como ADR si:
- Fue difícil de revertir (o costoso cambiar más tarde)
- El razonamiento no sería obvio para alguien leyendo el código
- Había una alternativa real que fue considerada y rechazada

Para cada decisión que califique:
  - Título de decisión (una línea)
  - Contexto (qué problema forzó esta decisión)
  - Decisión tomada (una oración, voz activa)
  - Alternativas que fueron rechazadas y por qué
  - Consecuencias (lo que esto hace más fácil, lo que lo hace más difícil)

Si no se tomaron decisiones dignas de ADR, dígalo explícitamente.
```

Si se identifican ADRs, genérelas usando el formato ADR de `skills/productivity/adr-writer.md` y guarde en `docs/decisions/`.

---

### Fase 4 — Actualización de LESSONS.md

```
Actualice LESSONS.md con lo que se aprendió en esta sesión.

Si LESSONS.md no existe, créelo con esta estructura:
# Lecciones aprendidas
Un registro viviente de cosas no obvias descubiertas durante el desarrollo.

## [Fecha] — [Tema de sesión en 5 palabras]
### Lo que aprendimos
[2–5 puntos de hallazgos concretos y específicos]
### Qué hacer la próxima vez
[1–3 conclusiones accionables]

Si LESSONS.md existe, agregue una entrada con fecha nueva — no reescriba entradas existentes.

Importante: solo incluya cosas que fueron genuinamente no obvias.
No rellene con cosas que salieron según lo planeado.
```

---

### Fase 5 — Confirmación antes de escribir

Muestre al usuario un resumen de todas las escrituras propuestas antes de tocar cualquier archivo:

```
Aquí es lo que estoy a punto de escribir:

1. Adiciones CLAUDE.md: [enumere reglas aceptadas]
2. Nuevos archivos ADR: [enumere rutas de archivo y resúmenes de una línea]
3. Adiciones LESSONS.md: [vista previa de la nueva entrada]

Confirme para proceder, o dígame qué cambiar.
```

Solo escriba archivos después de la confirmación explícita del usuario. Nunca actualice CLAUDE.md silenciosamente.

---

## Ejemplo

Sesión: "Debugged por qué las consultas de Prisma agotaron el tiempo en producción"

Resumen de Fase 1: descubrió que los valores predeterminados del grupo de conexiones de Prisma son 5 conexiones, la carga de producción requería 20, la corrección fue `DATABASE_CONNECTION_LIMIT=20` en env + `connection_limit=20` en la URL de la base de datos.

Extracción de Fase 2 de regla:
- Regla CLAUDE.md propuesta: "Siempre verifique `DATABASE_CONNECTION_LIMIT` cuando depure consultas de BD lentasven producción — el grupo predeterminado de Prisma de 5 es demasiado pequeño para cualquier carga real."
- Sección: `## Base de datos`

Fase 3 ADR: sin decisión a nivel arquitectónico, solo una corrección de configuración → sin ADR.

Entrada LESSONS.md de Fase 4:
```
## 2026-05-23 — Grupo de conexiones de Prisma demasiado pequeño
### Lo que aprendimos
- Prisma predeterminado a 5 conexiones DB independientemente del plan o tamaño del servidor
- El agotamiento del grupo se parece a consultas lentes, no errores de conexión
- La corrección es `connection_limit=N` en DATABASE_URL, no código de aplicación
### Qué hacer la próxima vez
- Establezca connection_limit explícitamente en DATABASE_URL en cada nuevo proyecto
- Monitoree `pg_stat_activity` para conexiones inactivas antes de asumir problemas de rendimiento de consulta
```

---
