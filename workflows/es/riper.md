# Flujo de trabajo RIPER

Marco de codificación agentivo estructurado de cinco fases. Cada fase tiene modo estricto, entradas definidas y salida de artefacto concreto. Pasar a la siguiente fase requiere completar la actual.

---

## Cuándo usarlo

- Características complejas donde el arrastre del alcance es un riesgo predecible
- Codebases desconocidas donde saltar a la implementación demasiado pronto causa rework costoso
- Tareas donde la corrección importa más que la velocidad del primer intento
- Cualquier situación donde un colaborador (humano o agente) necesita revisar antes de que continúe el trabajo

---

## Fases

### 1. Investigación

**Declaración de modo:** "Estoy en modo RESEARCH."

**Qué sucede:** Recopilar solo información. Leer archivos relevantes, consultar documentación, identificar incógnitas. Hacer preguntas de aclaración si es necesario. No proponer soluciones. No escribir código.

**Prohibido en esta fase:** Sugerir enfoques, escribir código de implementación, editar archivos.

**Salida:** Un resumen de contexto — qué se encontró, qué sigue siendo desconocido y la pregunta concreta que la siguiente fase debe responder.

```
Resumen de contexto:
- Archivos relevantes: [lista]
- Comportamiento actual: [descripción]
- Desconocido: [brechas específicas]
- Pregunta para fase Innovate: [pregunta precisa]
```

---

### 2. Innovar

**Declaración de modo:** "Estoy en modo INNOVATE."

**Qué sucede:** Lluvia de ideas sobre posibles enfoques basados en salida de investigación. Listar cada enfoque con sus compensaciones. Sin implementación. Sin código. Sin edición de archivos de proyecto.

**Prohibido en esta fase:** Escribir código de implementación, seleccionar un enfoque, editar archivos de proyecto.

**Salida:** Lista numerada de enfoques, cada uno con pros, contras y evaluación de ajuste de contexto.

```
Opciones:
1. [Enfoque] — pros: [...] contras: [...] ajuste: [alto/medio/bajo]
2. ...
```

---

### 3. Plan

**Declaración de modo:** "Estoy en modo PLAN."

**Qué sucede:** Seleccionar un enfoque de salida Innovate y producir un plan de implementación paso a paso. Cada paso debe ser atómico: un cambio de archivo, una función, una migración de base de datos — no "implementar la característica". Numerar cada paso. Identificar cualquier paso prerequisito.

**Puerta:** El plan debe ser aprobado (por el usuario o un agente revisor) antes de que comience la Fase 4.

**Salida:** Lista de verificación numerada sin ambigüedad.

```
Plan de implementación:
[ ] 1. Crear src/lib/export.ts con exportToCsv(rows: Row[]): string
[ ] 2. Agregar ruta GET /api/export en src/routes/export.ts llamando a exportToCsv
[ ] 3. Agregar botón Exportar al componente OrdersTable en src/components/OrdersTable.tsx
[ ] 4. Escribir pruebas unitarias en src/lib/export.test.ts cubriendo casos vacío, una fila y múltiples filas
```

---

### 4. Ejecutar

**Declaración de modo:** "Estoy en modo EXECUTE."

**Qué sucede:** Implementar el plan exactamente como está escrito, un paso a la vez. Tachar cada paso después de completarlo. No improvisar. No agregar características no en el plan. Si se encuentra algo inesperado — un archivo que no existe, un conflicto de tipo, una dependencia faltante — detener, documentar el bloqueador y volver al modo Plan para resolverlo.

**Prohibido en esta fase:** Saltar pasos, agregar alcance, tomar decisiones de diseño no cubiertas por el plan.

**Protocolo bloqueador:** Si está bloqueado, emitir:

```
BLOQUEADO en paso N: [descripción del problema]
Volviendo al modo PLAN para resolver.
```

Luego actualizar el plan para abordar el bloqueador y reanudar Execute.

**Salida:** Implementación funcional con cada paso del plan tachado.

---

### 5. Revisión

**Declaración de modo:** "Estoy en modo REVIEW."

**Qué sucede:** Comparar la implementación con el plan original línea por línea. Identificar cualquier desviación (adiciones, omisiones o sustituciones). Verificar que se cumpla cada criterio de aceptación de la fase Plan. Documentar hallazgos.

**Salida:** Informe de revisión.

```
Informe de revisión:
- Pasos completados: [N/N]
- Desviaciones: [lista o "ninguna"]
- Requisitos cumplidos: [sí / parcial — detalles]
- Elementos de seguimiento: [lista o "ninguno"]
```

---

## Reglas

1. Nunca salte fases. La secuencia es siempre Investigación → Innovar → Plan → Ejecutar → Revisión.
2. Declarar modo explícitamente al inicio de cada respuesta de fase.
3. En Ejecutar: solo haga lo que el plan dice. Los hallazgos inesperados regresan a Plan, no a Innovar o Investigación.
4. Cada fase produce un artefacto concreto antes de que comience la siguiente.
5. La aprobación entre Plan y Ejecutar es requerida — firma explícita del usuario o agente revisor.

---

## Ejemplo

```
Usuario: Use RIPER para agregar limitación de velocidad a la API.

Claude: Estoy en modo RESEARCH.
[lee pila de middleware, rutas existentes, pipeline de solicitud...]
Resumen de contexto: Sin middleware de limitación de velocidad presente. express-rate-limit ya en package.json pero sin usar. Desconocido: límites por ruta vs globales. Pregunta: ¿deberían ser los límites globales o por ruta?

Usuario: Por ruta, 100 req/min para endpoints públicos, 1000 para autenticado.

Claude: Estoy en modo INNOVATE.
[lista enfoques: fábrica de middleware, patrón decorador, controlado por config...]

Usuario: Use el enfoque de fábrica de middleware.

Claude: Estoy en modo PLAN.
[produce lista de verificación numerada de 6 pasos...]

Usuario: Aprobado.

Claude: Estoy en modo EXECUTE.
[implementa paso a paso, tachando cada...]

Claude: Estoy en modo REVIEW.
[compara con plan, confirma 6/6 pasos completos, sin desviaciones, requisitos cumplidos]
```

---
