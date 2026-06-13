# Flujo de decisión para la gestión del contexto

Un proceso de decisión estructurado para elegir la acción correcta en cada límite de turno para preservar la calidad del contexto y el costo de la sesión. La opción incorrecta degrada la calidad de salida; la opción correcta mantiene la sesión eficiente.

---

## Cuándo usarlo

Aplique este marco cuando note cualquiera de las siguientes señales:
- Las respuestas se vuelven más lentas o repetitivas
- Claude pierde el rastro de decisiones anteriores
- El conteo de tokens se acerca a un umbral donde la compresión o una nueva sesión se vuelve rentable
- Terminar una tarea importante y comenzar algo no relacionado

---

## Las 5 opciones

### 1. Continuar

**Acción predeterminada.** No tome ninguna acción especial — simplemente envíe el siguiente mensaje.

**Use cuando:**
- Claude está en la ruta correcta y haciendo progreso
- El contexto es fresco (directriz aproximada: menos de 200k tokens)
- Ningún intento de implementación fallido se ha acumulado en el contexto
- La siguiente tarea está directamente relacionada con el trabajo actual

**Implicación de costo:** Cada turno consume tokens proporcionales a la ventana de contexto completa. Continuar es barato por turno cuando el contexto es pequeño; costoso cuando es grande.

---

### 2. Rebobinar (`Esc+Esc` o `/rewind`)

Deshacer el último turno o varios turnos. Elimina la respuesta del asistente pero mantiene el estado de contexto anterior — las lecturas de archivo, el razonamiento anterior y el contexto cargado antes del turno malo permanecen.

**Use cuando:**
- Claude fue por mal camino en el último turno
- Desea mantener la exploración de codebase útil que ocurrió anteriormente en la sesión pero descartar un intento de implementación fallido
- El error es reciente y poco profundo — rebobinar uno o dos turnos es suficiente para recuperarse

**Lo que no es:** una forma de deshacer cambios del sistema de archivos. Rebobinar elimina turnos del asistente del contexto pero no deshace las escrituras que Claude hizo al disco. Revierte esas por separado si es necesario.

**Mejor para:** recuperarse de un enfoque incorrecto sin perder el contexto de exploración útil que lo precedió.

---

### 3. Compresión dirigida (`/compact <hint>`)

Comprima el contexto actual en un resumen y luego continúe. El `<hint>` le dice al paso de compresión qué importa — sin él, la compresión puede perder contexto crítico.

**Use cuando:**
- El contexto se está volviendo largo (directriz aproximada: 300k+ tokens en modelo de 1M tokens) pero está a mitad de una tarea y desea continuar en la misma sesión
- Ha acumulado mucho razonamiento intermedio, lecturas de archivos y salida de depuración que ya no necesita
- El estado de tarea principal aún está activo y no desea informar una sesión nueva

**Ejemplos de hint:**
```
/compact keep auth refactor context, drop the test debugging
/compact preserve the data model decisions and API contract, drop the installation steps
/compact focus on the migration plan, nothing else matters now
```

**Sin hint:** la compresión usa heurísticas que pueden descartar decisiones que aún son relevantes. Siempre pase un hint para sesiones complejas.

**Umbral empírico:** la calidad del contexto en el modelo de 1M comienza a degradarse notablemente alrededor de 300–400k tokens para tareas que requieren recuerdo preciso de decisiones anteriores. Por debajo de eso, continúe a menos que el costo sea una preocupación.

---

### 4. Sesión nueva

Inicie una nueva invocación de `claude`. Sin contexto transferido.

**Use cuando:**
- La tarea actual está completada y está comenzando algo no relacionado
- La sesión ha acumulado demasiados callejones sin salida e intentos fallidos — el ruido supera al contexto útil
- Desea una pizarra limpia con solo CLAUDE.md y archivos explícitamente referenciados como contexto
- El contexto es muy grande y puede reconstruir el estado necesario más rápidamente al informar una nueva sesión que por compresión

**No use:** para continuar el trabajo a mitad de una tarea a menos que la sesión actual esté irremediablemente corrompida. El costo de recuperación de contexto no es trivial para tareas complejas.

---

### 5. Subagente

Genere una llamada de herramienta de Agente para una subtarea limitada. El subagente se ejecuta con su propia ventana de contexto; el razonamiento intermedio no aparece en la sesión padre.

**Use cuando:**
- Necesita el resultado de una operación específica (por ejemplo, "leer estos 10 archivos y devolver un resumen") pero no necesita los pasos intermedios en su contexto principal
- La tarea tiene entrada claramente limitada y salida bien definida
- Desea mantener el contexto de su sesión principal limpio y enfocado

**Lo que no es:** un reemplazo para una sesión completa cuando la subtarea requiere intercambio continuo de ida y vuelta.

---

## Tabla de decisión

| Señal | Acción recomendada |
|---|---|
| Último turno falló, resto de sesión está bien | Rebobinar |
| Contexto > 300k tokens, a mitad de tarea | `/compact <hint>` |
| Contexto > 300k tokens, tarea completada | Sesión nueva |
| Comenzar una tarea no relacionada | Sesión nueva |
| Necesita resultado de subtarea aislada | Subagente |
| Ninguno de los anteriores | Continuar |

---

## Implicaciones de costo

- **Continuar** — más barato por turno cuando el contexto es pequeño; más costoso cuando el contexto es grande (cada turno reenvía la ventana completa)
- **Comprimir** — un turno de compresión costoso, luego turnos más baratos en contexto comprimido; rentable cuando tiene 5+ turnos restantes
- **Rebobinar** — gratis; simplemente elimina contexto de la memoria
- **Sesión nueva** — costo de transferencia cero; solo paga por lo que carga explícitamente
- **Subagente** — costo aislado; sesión padre no se factura por contexto de subagente

---

## Cuándo NO comprimir

- Sesión de depuración a mitad donde el rastro de error y la hipótesis anterior son ambos aún relevantes — la compresión puede resumirlos en ambigüedad
- Cuando está a punto de terminar la tarea de todos modos (1–2 turnos restantes) — no vale la pena el costo de compresión
- Cuando el hint tendría que ser tan detallado que escribirlo toma más tiempo que informar una nueva sesión

---
