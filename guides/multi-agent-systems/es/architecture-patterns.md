# Sistemas Multi-Agentes: Patrones de Arquitectura

Guía completa de arquitecturas comunes para sistemas de IA multi-agentes, sus compensaciones y cuándo usar cada patrón.

---

## Matriz de Selección de Patrones

| Patrón | Agentes | Complejidad | Latencia | Tolerancia a Fallos | Caso de Uso |
|---------|--------|-----------|---------|-----------------|----------|
| Pipeline Secuencial | 2-5 | Bajo | N/A (secuencial) | Ninguno | Flujos de trabajo lineales, sin paralelización |
| Fan-Out Paralelo | 3-10 | Medio | Reducida | Algunas | Subtareas independientes, fusión de resultados |
| Orquestación DAG | 5-100+ | Alto | Optimizada | Buena | Dependencias complejas, paralelización |
| Patrón Pizarra | 3-20 | Medio | N/A | Moderada | Estado compartido, agentes colaborativos |
| Patrón Saga | 3-10 | Medio | N/A | Excelente | Transacciones distribuidas, reversión |
| Supervisor + Subagentes | 5-50 | Alto | Optimizada | Excelente | Equipos grandes, jerarquía clara |

---

## Pipeline Secuencial

Los agentes se ejecutan uno tras otro, cada uno utilizando la salida anterior.

```
Input → Agent A → Output A → Agent B → Output B → Agent C → Final Output
```

**Cuándo usar:**
- Flujos de trabajo con orden estricto (no se puede paralelizar)
- Cada agente depende completamente de la salida anterior
- < 3 agentes (lo suficientemente simple como para no necesitar orquestación)

**Implementación:**
```python
result_a = agent_a(user_input)
result_b = agent_b(result_a)
result_c = agent_c(result_b)
return result_c
```

**Compensaciones:**
- ✓ Más simple de implementar y depurar
- ✗ No se puede paralelizar; latencia total = suma de todas las latencias
- ✗ Sin tolerancia a fallos (el primer fallo detiene todo)

---

## Fan-Out Paralelo + Fusión

Una tarea de orquestador se divide en subtareas independientes, luego se fusionan los resultados.

```
                ┌─→ Agent A ─┐
Input → Split →├─→ Agent B ─┤→ Merge → Output
                └─→ Agent C ─┘
```

**Cuándo usar:**
- Múltiples subtareas independientes (p. ej., investigación de 3 fuentes)
- Las subtareas pueden ejecutarse en paralelo
- Los resultados son fusionables (sin dependencias complejas)

**Implementación:**
```python
import asyncio

results = await asyncio.gather(
    agent_a(input),
    agent_b(input),
    agent_c(input)
)

merged = merge_results(*results)
return merged
```

**Compensaciones:**
- ✓ La paralelización reduce la latencia
- ✓ El fallo de un agente no bloquea a otros
- ✗ No puede expresar dependencias parciales (Agent D depende de A y B, pero no de C)
- ✗ La lógica de fusión puede ser compleja si los resultados entran en conflicto

---

## Orquestación DAG

Los agentes se representan como nodos, las dependencias como aristas. Ejecute tareas en orden topológico.

```
       validate
        /     \
    check    verify
       |       |
    reserve   (merged)
       \     /
       charge → send
```

**Cuándo usar:**
- 5+ agentes con dependencias complejas
- Necesita paralelizar respetando dependencias parciales
- Quiere detección automática de interbloqueos y recuperación de fallos

**Implementación:**
Use ordenamiento topológico para calcular carriles de ejecución (conjuntos de tareas que pueden ejecutarse en paralelo):

```python
lanes = topological_sort(dag)
# lanes[0] = [validate]
# lanes[1] = [check, verify]
# lanes[2] = [reserve]
# lanes[3] = [charge]
# lanes[4] = [send]

for lane in lanes:
    results = await run_lane_parallel(lane)
    save_state(results)
```

**Compensaciones:**
- ✓ Paralelización óptima
- ✓ Detección automática de interbloqueos
- ✓ Puede reanudarse desde cualquier punto (persistencia de estado)
- ✗ Más complejo de implementar
- ✗ Requiere especificación formal de dependencias

---

## Patrón Pizarra

Los agentes leen/escriben una estructura de datos compartida (pizarra), coordinándose a través del estado compartido en lugar de entregas directas.

```
                ┌─────────────────┐
                │   Pizarra       │
                │ ┌─────────────┐ │
                │ │ research    │ │
                │ │ analysis    │ │
                │ │ synthesis   │ │
                │ └─────────────┘ │
                └────────┬────────┘
                 ╱      ╲      ╲
        Agent A ───    Agent B   Agent C
```

**Cuándo usar:**
- Los agentes necesitan coordinarse a través del estado compartido
- Múltiples agentes leen los mismos datos
- Los agentes pueden trabajar en datos en orden no lineal
- La coherencia de versiones y la resolución de conflictos son importantes

**Implementación:**
```python
# El investigador escribe en la pizarra
write_phase('research', sources=[...], summary='...')

# El analista lee de la pizarra
research_data = read_phase('research')

# El analista escribe análisis
write_phase('analysis', themes=[...])

# El escritor lee ambos
research = read_phase('research')
analysis = read_phase('analysis')
```

**Compensaciones:**
- ✓ Coordinación flexible (los agentes no necesitan conocerse)
- ✓ El estado centralizado facilita la depuración
- ✗ Las escrituras concurrentes requieren detección de conflictos
- ✗ Gastos generales de gestión de versiones
- ✗ No apto para flujos de trabajo basados en eventos/streaming

---

## Patrón Saga

Patrón de transacción distribuida: ejecute pasos hacia adelante y, si algún paso falla, compense hacia atrás.

```
Step 1 → Step 2 → Step 3 (fails) ← Compensate 2 ← Compensate 1
  ✓        ✓        ✗               ✓              ✓
```

**Cuándo usar:**
- Cada paso muta el estado externo (escrituras de BD, llamadas a API)
- Debe ser atómico (todos los pasos exitosos o todos revertidos)
- No se puede usar confirmación de dos fases (sin cerraduras distribuidas)
- Los pasos son idempotentes y reversibles

**Implementación:**
```python
for step in saga_steps:
    result = run_step(step)
    context[step.output_key] = result
    if result.error:
        # Reversión: ejecute compensaciones en orden inverso
        for step in reversed(completed_steps):
            run_compensation(step, context)
        return 'FAILED_AND_ROLLED_BACK'
```

**Compensaciones:**
- ✓ Maneja mutaciones de estado distribuidas
- ✓ Garantías de reversión sólidas
- ✗ Incoherencia transitoria (estado parcialmente confirmado)
- ✗ La lógica de compensación debe escribirse manualmente
- ✗ No apto para flujos de trabajo sin operaciones reversibles

---

## Supervisor + Subagentes

Jerarquía estricta: el supervisor descompone tareas y delega a subagentes especializados.

```
             Supervisor
           /    |     \
        Agent A Agent B Agent C
```

**Cuándo usar:**
- Estructura jerárquica clara (un orquestador, muchos agentes especializados)
- Necesita aplicación centralizada de recursos (presupuestos, tiempos de espera)
- Necesita puertas de calidad y validación entre pasos
- Los agentes no deben comunicarse directamente entre sí

**Implementación:**
```python
class Supervisor:
    def decompose(self, request):
        return [task_1, task_2, task_3]
    
    def delegate(self, task):
        result = spawn_agent(task.agent, task.input)
        self.validate(result)
        return result
    
    def orchestrate(self, request):
        tasks = self.decompose(request)
        results = []
        for task in tasks:
            result = self.delegate(task)
            results.append(result)
        return self.assemble(results)
```

**Compensaciones:**
- ✓ Límites de rol claros
- ✓ Aplicación centralizada de recursos
- ✓ El supervisor puede validar y reintentar
- ✗ El supervisor se convierte en un cuello de botella
- ✗ Menos flexible (los agentes no pueden comunicarse directamente)

---

## Comparación: Ejemplo del Mundo Real

**Tarea:** Procesar un pedido de comercio electrónico (validar, verificar inventario, procesar pago, enviar confirmación)

### Pipeline Secuencial
```python
validate_order(order)
check_inventory(order)
process_payment(order)
send_confirmation(order)
# Latencia total : T_v + T_i + T_p + T_c
```

### Fan-Out Paralelo
```python
# Imposible: la validación debe venir primero, luego verificación/pago en paralelo
```

### Orquestación DAG
```
validate (5s) → check (10s), payment (8s) → charge (5s) → send (3s)
# Latencia total : 5 + max(10, 8) + 5 + 3 = 23s
# Aceleración vs secuencial : (5+10+8+5+3) / 23 = 1.7x
```

### Patrón Saga
```
1. Validar pedido          → éxito
2. Verificar inventario    → éxito, reservar artículos
3. Procesar pago           → FALLAR (tarjeta rechazada)
   └─ Compensación: liberar inventario
   └─ Compensación: marcar pedido como cancelado
# Resultado : Pedido cancelado, inventario liberado, sin pago
```

### Supervisor + Subagentes
```
Supervisor descompone: [validate, check&pay (parallel), charge, send]
Supervisor delega a agentes, valida salidas
En caso de fallo, reintenta (hasta 2 veces) luego escala
```

---

## Anti-Patrones a Evitar

### Malla Completamente Conectada

Cada agente se comunica con cada otro agente. Conduce a patrones de comunicación impredecibles y errores emergentes.

❌ **Malo:**
```
A ←→ B ←→ C ←→ D
↑         ↑
└─────────┘
```

✓ **Bueno:** Use jerarquía o DAG con dependencias explícitas.

### Dependencias Circulares

El agente A espera al agente B, que espera al agente A. Interbloqueo.

❌ **Malo:**
```
A → B → A (cycle)
```

✓ **Bueno:** Use ordenamiento topológico para detectar y rechazar ciclos antes de la ejecución.

### Fallos Silenciosos

El agente falla pero el orquestador no lo sabe, procede con datos obsoletos.

❌ **Malo:**
```python
result = agent_call(...)
# Sin manejo de errores, asumir éxito
return result
```

✓ **Bueno:**
```python
result = agent_call(...)
if result.status == 'error':
    raise AgentFailure(result.error)
    # o reintentar, o escalar
```

### Reintentos Sin Límite

El agente falla en un bucle, reintenta eternamente, nunca completa.

❌ **Malo:**
```python
while True:
    try:
        return agent_call(...)
    except:
        pass  # Reintentar eternamente
```

✓ **Bueno:**
```python
for attempt in range(max_retries):
    try:
        return agent_call(...)
    except Exception as e:
        if attempt == max_retries - 1:
            escalate(e)
```

---

## Árbol de Decisión

**¿Cuántos agentes?**
- 1-2: Agente único con bucles, sin orquestación necesaria
- 3-5: Pipeline secuencial o fan-out paralelo
- 5-20: Orquestación DAG o patrón pizarra
- 20+: Supervisor + subagentes con aplicación de recursos

**¿Los agentes trabajan en estado compartido?**
- Sí: Patrón pizarra
- No: DAG, saga o supervisor

**¿Deben preservar transacciones atómicas?**
- Sí: Patrón saga
- No: DAG o pizarra

**¿Necesita paralelización automática?**
- Sí: Orquestación DAG
- No: Secuencial o fan-out

**¿Necesita límites de rol estrictos?**
- Sí: Supervisor + subagentes
- No: DAG o pizarra

---
