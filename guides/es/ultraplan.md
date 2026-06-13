# Ultraplan — Modo de planificación profunda

Ultraplan es un modo de planificación extendido que instruye a Claude a pensar exhaustivamente antes de actuar. Lee la base de código, mapea dependencias, identifica riesgos y produce un plan integral antes de tocar cualquier código. El objetivo es acertar con el plan la primera vez en trabajo donde un plan equivocado es costoso de deshacer.

---

## Cómo activar

**Comando de barra diagonal:**
```
/ultraplan
```

Luego describe la tarea. Ultraplan toma el control durante la fase de planificación.

**Bandera CLI:**
```bash
claude --ultraplan "Add multi-tenant support to the billing module"
```

**Combinado con esfuerzo:**
```bash
claude --ultraplan --effort xhigh "Migrate auth from JWT to session-based"
```

---

## Qué diferencia a Ultraplan de `/plan`

| | `/plan` | `/ultraplan` |
|---|---|---|
| **Lecturas de archivo** | Solo archivos referenciados | Todos los archivos en la ruta afectada + sus dependencias |
| **Verificación de patrón** | Ninguna | Lee patrones existentes antes de proponer nuevos |
| **Mapeo de dependencia** | Implícito | Gráfico de dependencias explícito en la salida |
| **Evaluación de riesgo** | Ninguna | Sección de riesgo dedicada con mitigaciones |
| **Plan de reversión** | Ninguno | Pasos de reversión explícitos para cada fase |
| **Costo de token** | ~1× | ~3–5× |
| **Longitud de salida** | Corta | Larga (integral) |

La fase de investigación de Ultraplan es lo que justifica el costo. Lee la base de código actual antes de planificar — no solo los archivos que mencionas, sino los archivos que esos archivos importan, las pruebas que los cubren, el historial de migración si es relevante, y los patrones existentes que debe coincidir.

---

## Estructura de salida de Ultraplan

Un Ultraplan completado produce un documento con estas secciones en orden:

**1. Resumen de contexto**
Lo que Ultraplan encontró durante su fase de investigación — archivos clave, patrones existentes, decisiones previas relevantes.

**2. Evaluación de riesgos**
Riesgos clasificados por gravedad. Cada riesgo tiene: descripción, probabilidad, impacto y mitigación propuesta.

**3. Mapa de dependencias**
Qué componentes dependen de qué. Resalta dependencias circulares, estado compartido e integraciones externas que el cambio toca.

**4. Pasos ordenados**
El plan de implementación en secuencia. Cada paso especifica: qué cambia, qué archivos, qué probar después de este paso, y si un commit parcial es apropiado aquí.

**5. Plan de reversión**
Cómo deshacer cada fase si algo sale mal — comandos git específicos, alternadores de características o reversiones de migración.

---

## Cuándo usar

- **Características complejas que abarcan múltiples archivos** — especialmente cuando no estás seguro de qué depende de qué
- **Bases de código desconocidas** — antes de tocar código que no has leído, la fase de investigación de Ultraplan construye el contexto que gastarías horas construyendo manualmente
- **Cambios de alta relevancia** — reescrituras de sistema de autenticación, migraciones de esquema de base de datos, cambios de API pública, cualquier cosa donde un enfoque equivocado significa rework significativo
- **Características estimadas en más de un día** — la inversión de planificación se amortiza más rápido cuanto más tiempo dure la implementación

---

## Cuándo NO usar

- **Tareas simples** — una corrección de función única no necesita un mapa de dependencias
- **Hotfixes** — ya sabes qué está roto; la sobrecarga de planificación te ralentiza
- **Trabajo exploratorio / spike** — cuando estás prototipando para aprender, quieres iterar rápido, no planificar exhaustivamente al principio
- **Cambios bien entendidos** — si has hecho este tipo de cambio diez veces en esta base de código, no necesitas la fase de investigación de Ultraplan
- **Sesiones sensibles a costos** — a 3–5× costo de token, Ultraplan en tareas triviales desperdicia presupuesto

---

## Integración de esfuerzo

`--effort` controla cuán profundamente piensa Claude dentro de cada turno. Ultraplan + esfuerzo se componen:

```bash
# Profundidad máxima: investigación amplia de Ultraplan + razonamiento máximo por turno
claude --ultraplan --effort xhigh "Refactor the payment processing module"
```

| Combinación | Usar para |
|---|---|
| `--ultraplan` solo | Características complejas estándar |
| `--ultraplan --effort high` | Decisiones de arquitectura, bases de código desconocidas |
| `--ultraplan --effort xhigh` | Planificación de migración, cambios críticos de seguridad |

Evita `--ultraplan --effort low` — estás sacrificando la profundidad de investigación que hace que Ultraplan valga la pena.

---

## Compensación de costo

Ultraplan gasta tokens en investigación al inicio. El punto de equilibrio es aproximadamente:

- Si el plan ahorra 1 hora de depuración o rework: equilibrio en ~$2–5 de tokens extra
- Si el plan evita una decisión arquitectónica equivocada: equilibrio en ~$10–50 de tokens extra

Para características estimadas en más de un día de trabajo, Ultraplan casi siempre vale la pena. Para tareas de medio día, depende de cuán bien conozcas la base de código.

---

## Combinación de Ultraplan con RIPER

El marco RIPER (Research → Implement → Probe → Evaluate → Reflect) se asigna limpiamente a Ultraplan:

- **Research** → fase de investigación de Ultraplan (lectura de archivos, identificación de patrones)
- **Implement** → Ejecuta los pasos ordenados de la salida de Ultraplan
- **Probe** → Ejecuta pruebas después de cada paso como se especifica en el plan
- **Evaluate** → Verifica contra la evaluación de riesgos de Ultraplan — ¿se materializó algún riesgo predicho?
- **Reflect** → Revisa el plan de reversión; actualiza si la implementación divergió del plan

Ejecuta Ultraplan antes de entrar en la fase Implement de RIPER. La salida de Ultraplan se convierte en el resumen de la fase Implement.

```
/ultraplan
[describe the feature]

[review the plan]

/riper implement
[execute the plan step by step]
```

---
