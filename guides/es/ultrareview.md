# Ultrareview — Revisión de Código Adversarial Basada en Flota

Ultrareview es el sistema de revisión multi-agente de Claude Code, lanzado en vista previa pública en abril de 2026. Reemplaza el modelo de revisor único de `/code-review` con una flota coordinada de subagentes especializados que revisan el mismo diff de forma independiente, se verifican mutuamente sus conclusiones y producen un informe sintetizado verificado para evitar falsos positivos. Las propiedades clave son: adversarial (los agentes intentan activamente socavar las conclusiones de los demás), paralelo (los agentes se ejecutan concurrentemente, no en secuencia) y escalado en profundidad (el tamaño de la flota y el nivel de esfuerzo se escalan con el tamaño y la complejidad del diff).

---

## Cómo funciona

### La arquitectura de la flota

Ultrareview genera una flota de subagentes revisores, cada uno con un rol distinto y una lectura diferente del mismo diff. La composición de la flota varía según las características del diff, pero una ejecución típica en un PR de tamaño medio incluye:

| Agente | Enfoque |
|---|---|
| **Revisor de Seguridad** | OWASP top 10, inyección, bypass de autenticación, exposición de datos, secretos en diffs |
| **Revisor de Corrección** | Errores lógicos, casos extremos, condiciones de carrera, desviación por uno, nulos |
| **Revisor de Rendimiento** | Consultas N+1, E/S bloqueante, complejidad algorítmica, patrones de asignación de memoria |
| **Revisor de Arquitectura** | Consistencia de diseño, acoplamiento, adherencia de patrones, contratos de interfaz |
| **Revisor de Cobertura de Pruebas** | Qué está cubierto, qué no, si las pruebas realmente prueban el comportamiento |
| **Verificador Adversarial** | Revisa los hallazgos de todos los demás agentes — marca falsos positivos, escalona problemas pasados por alto |

El Verificador Adversarial es la pieza distintiva. Recibe todos los hallazgos de los agentes especialistas y su tarea explícita es cuestionarlos: determinar si cada hallazgo es real, un falso positivo o una preocupación válida que el agente original subestimó. Esta verificación de segundo paso reduce sustancialmente el ruido en el resultado final.

### Qué se ejecuta en paralelo vs. secuencialmente

Fase 1 (paralela): Todos los agentes especialistas revisan el diff concurrentemente. Cada uno lee la misma entrada — el diff, archivos de contexto relevantes e instrucciones que proporcionaste — pero aplica su propia perspectiva.

Fase 2 (secuencial): El Verificador Adversarial recibe todos los hallazgos de la Fase 1 y produce la síntesis. Esto es intencionalmente secuencial — el verificador necesita la imagen completa.

Fase 3: El informe sintetizado se ensambla, se deduplica y se devuelve a ti.

El tiempo de reloj de pared de extremo a extremo es típicamente 90–180 segundos para un PR de tamaño medio, dependiendo del tamaño del diff y el número de archivos de contexto leídos. El paralelismo significa que esto es más rápido que ejecutar la misma profundidad de revisión secuencialmente, a pesar de usar más tokens totales.

### Resolución de contexto

Antes de entregar a la flota, Ultrareview resuelve el contexto de revisión. Lee:

- El diff mismo (solo líneas cambiadas a menos que se establezca `--full-files`)
- Los archivos adyacentes a los archivos cambiados (para entender patrones circundantes)
- Archivos de prueba que cubren el código cambiado
- Configuración relevante (linters, tsconfig, pyproject.toml) para entender qué análisis estático ya cubre
- `CLAUDE.md` si está presente — para aplicar reglas de revisión específicas del repositorio a la flota

Esta resolución de contexto sucede antes de que la flota se genere, por lo que cada agente recibe un paquete preensamblado, no acceso crudo al repositorio.

---

## Invocación

### Invocación principal

```
/ultrareview
```

No se necesitan argumentos para el caso predeterminado — Ultrareview recoge el diff actual (cambios staging + unstaging) y el diff de rama contra la rama remota predeterminada.

### Con un PR específico

```
/ultrareview 847
```

Pasa un número de PR de GitHub. Ultrareview obtiene el diff de PR a través del MCP de GitHub o la CLI `gh`. Esta es la invocación más común en la práctica — apuntas a un PR y lo revisa.

### Con un área de enfoque

```
/ultrareview --focus security
/ultrareview --focus performance
/ultrareview --focus correctness
```

Los consejos de enfoque sesgan la composición de la flota. `--focus security` expande el esfuerzo del revisor de seguridad y reduce el del revisor de arquitectura. El Verificador Adversarial siempre se ejecuta con esfuerzo completo independientemente del enfoque.

### Con nivel de esfuerzo

```
/ultrareview --effort high
/ultrareview --effort max
```

El esfuerzo escala la profundidad de cada agente individual, no el número de agentes. Con `--effort max`, cada agente usa pensamiento extendido y lee un conjunto más amplio de archivos de contexto. El costo se escala significativamente — usa `max` solo para cambios de seguridad crítica o que definan la arquitectura.

### Con contexto de archivo completo

```
/ultrareview --full-files
```

De forma predeterminada, los agentes ven solo las líneas cambiadas más contexto circundante. `--full-files` da a los agentes el contenido completo de cada archivo cambiado. Usa esto cuando el diff es pequeño pero el comportamiento depende en gran medida de la estructura completa del archivo (por ejemplo, una clase donde un cambio de método afecta invariantes en todo).

### Invocación desde la CLI

```bash
claude --ultrareview 847
claude --ultrareview --focus security --effort high
```

La invocación desde CLI es equivalente al comando slash. Útil para incluir Ultrareview en canalizaciones de CI o ganchos previos a la fusión.

---

## Precios

Ultrareview tiene precio por ejecución, no por token. El costo del token se sigue incurriendo (y se refleja en la facturación del asiento o el uso de API), pero el cargo por ejecución cubre la infraestructura de orquestación de flota.

### Niveles de precios (a partir de vista previa pública de abril de 2026)

| Nivel | Costo | Notas |
|---|---|---|
| Primeras 3 ejecuciones | Gratis | Por cuenta, nunca se reinicia — asignación de vista previa única |
| Ejecución estándar | $5 | Esfuerzo predeterminado, diffs hasta ~500 líneas cambiadas |
| Ejecución grande | $10 | Diffs 500–2000 líneas cambiadas, o `--effort high` |
| Ejecución máxima | $20 | `--effort max`, o diffs más de 2000 líneas cambiadas |

La ejecución tiene precio en el nivel que coincide con tu invocación *antes* de que confirmes. Verás un mensaje de confirmación de costo antes de que se genere la flota:

```
Ultrareview: Large run — estimated $10
Diff: 847 lines changed across 23 files
Fleet: 6 agents + adversarial verifier
Proceed? [y/N]
```

Escribe `y` para proceder. Si declinas, no se incurre ningún cargo.

### Para qué son buenas las ejecuciones gratis

Usa tus tres ejecuciones gratis en tus cambios más complejos o sensibles a la seguridad recientes. No las desperdicies en PRs pequeños — `/code-review` los cubre bien sin costo incremental. Guarda ejecuciones gratis para:

- Cambios en el sistema de autenticación
- PRs de migración de base de datos
- Código de facturación / pago
- Primera característica importante en una base de código desconocida
- PRs que otros revisores han marcado con preocupaciones pero sin especificidad

### Costo vs. Tiempo de ingeniería

La hora de revisión de un ingeniero de nivel medio cuesta $75–150 completamente cargada. Una ejecución de Ultrareview de $10 que detecta un error de bloqueo antes de que llegue a producción es un retorno de 10x en un solo incidente. El cálculo cambia en PRs pequeños donde `/code-review` es suficiente — no gastes $5 para revisar un cambio de configuración de una línea.

---

## `/ultrareview` vs. `/code-review`

Entender cuándo usar cada una es la decisión práctica más importante.

| Dimensión | `/code-review` | `/ultrareview` |
|---|---|---|
| **Agentes** | Revisor único | Flota de 5–7 especialistas |
| **Costo** | $0 (solo costo de token) | $5–20 por ejecución |
| **Tiempo** | 15–30 segundos | 90–180 segundos |
| **Tasa de falso positivo** | Moderada | Baja (verificación adversarial) |
| **Profundidad de seguridad** | Buena | Exhaustiva — agente dedicado + verificador |
| **Análisis entre archivos** | Limitado | Completo — los agentes pueden leer archivos adyacentes |
| **Mejor para** | Revisión diaria, PRs pequeños | PRs de alto riesgo, revisión de seguridad, cambios complejos |
| **Niveles de esfuerzo** | `low` / `medium` / `high` / `max` | `default` / `high` / `max` |
| **Integración de PR de GitHub** | Pegado de diff manual | Nativo a través de número de PR |

**Usa `/code-review` cuando:**
- El PR es pequeño y bien definido (< 200 líneas cambiadas)
- Ya has hecho una autorrevisión y quieres un segundo pasada rápido
- Estás revisando código de aplicación no crítica en una línea de tiempo ajustada
- Quieres iterar rápidamente en una característica con revisiones frecuentes

**Usa `/ultrareview` cuando:**
- El cambio es sensible a la seguridad (autenticación, pagos, acceso a datos, secretos)
- El PR es grande y toca múltiples subsistemas
- Estás a punto de fusionar en main en un sistema de producción
- Otro revisor marcó algo pero no podía articularlo con precisión
- Quieres un registro escrito de una revisión exhaustiva (el resultado de Ultrareview es de calidad de artefacto)
- La base de código te es desconocida y no confías en la profundidad de tu propia revisión

No hay vergüenza en ejecutar `/code-review` primero e actualizar a `/ultrareview` cuando detecta algo ambiguo. El costo de una `code-review` es casi cero, así que úsalo libremente; usa Ultrareview deliberadamente.

---

## Lectura de la salida

Ultrareview produce un informe estructurado. Entender el formato te permite clasificar más rápido.

### Estructura del informe

```
## Ultrareview Report
PR #847 · 23 files · 847 lines changed
Fleet: Security, Correctness, Performance, Architecture, Tests, Adversarial Verifier
Runtime: 142 seconds

---

### Critical Findings (must fix before merge)

🔴 [SECURITY] SQL injection in user search endpoint
Agent: Security Reviewer · Verified: Adversarial Verifier ✓
File: api/search.py:34
...

---

### Important Findings (should fix before merge)

🟠 [CORRECTNESS] Race condition in concurrent payment processing
Agent: Correctness Reviewer · Verified: Adversarial Verifier ✓
File: billing/processor.py:112
...

---

### Suggestions (worth discussing)

🟡 [ARCHITECTURE] Payment handler violates single-responsibility
Agent: Architecture Reviewer · Disputed: Adversarial Verifier — low confidence
...

---

### Dismissed Findings

ℹ️ 3 findings from specialist agents were dismissed by the Adversarial Verifier as false positives. See appendix.

---

### Summary
Critical: 1 · Important: 3 · Suggestions: 5 · Dismissed: 3
Recommendation: Request changes — critical finding must be resolved.
```

### El distintivo de verificación

Cada hallazgo lleva un estado de verificación del Verificador Adversarial:

- **Verificado ✓** — el Verificador Adversarial confirmó que el hallazgo es real y está correctamente descrito
- **Escalado ↑** — el Verificador Adversarial encontró que el hallazgo subestimó; la gravedad puede ser elevada
- **Disputado —** — el Verificador Adversarial está en desacuerdo; el hallazgo se incluye pero se marca como incierto
- **Descartado ✗** — el Verificador Adversarial concluyó que el hallazgo es un falso positivo; se movió al apéndice

No saltes los hallazgos Disputados. Se incluyen porque el Verificador Adversarial no podía descartarlos con confianza — significa que vale la pena una revisión humana incluso si el agente original exageró el riesgo.

### El apéndice de descartados

Siempre lee el apéndice de hallazgos descartados, especialmente en PRs sensibles a la seguridad. El Verificador Adversarial es bueno pero no infalible. Un hallazgo de seguridad descartado que resulta ser real es peor que un falso positivo que brevemente consideraste y rechazaste.

El formato de apéndice:

```
### Appendix: Dismissed Findings

[Security Reviewer] Potential SSRF via user-supplied URL
Dismissed: The URL is validated against an allowlist on line 12; the finding assumes
no validation exists. Confirmed safe by Adversarial Verifier.

[Performance Reviewer] O(n²) sort in user listing
Dismissed: Input size is capped at 50 by the pagination limit on line 8.
Actual complexity is O(50 log 50) = effectively constant.
```

Estos rechazos son explicativos, no solo sí/no. Si el razonamiento se ve incorrecto, confía en tu criterio sobre el Verificador Adversarial.

### Atribución de agente

Cada hallazgo nombra el agente que lo planteó. Esto importa por dos razones:

1. **Calibración**: Algunos agentes son más conservadores que otros. Si has visto al Revisor de Rendimiento marcar falsos positivos en tu base de código antes, aplica esa prior.
2. **Hacer preguntas de seguimiento**: Puedes hacer referencia al hallazgo y pedir a Claude que profundice — "Expande en el hallazgo de condición de carrera en billing/processor.py:112" — y continuará desde donde lo dejó el Revisor de Corrección.

---

## Consejos prácticos

### Consejo 1: Revisa los hallazgos descartados antes de aprobar

El hábito más accionable: antes de hacer clic en aprobar, dedica 60 segundos a leer el apéndice de hallazgos descartados. Estás buscando cualquier caso donde el razonamiento del Verificador Adversarial asume algo que no es verdad de tu base de código específica. Sucede.

### Consejo 2: Usa `--focus security` en cualquier PR que toque autenticación o pagos

Incluso si estás seguro del cambio, la composición de flota enfocada en seguridad detecta cosas que revisiones más amplias pierden. El agente de seguridad dedicado lee todo el flujo de autenticación, no solo el diff — entiende si un cambio en una función de middleware afecta a cada ruta autenticada o solo a la adyacente.

```bash
claude --ultrareview 312 --focus security
```

### Consejo 3: No ejecutes ultrareview en cada PR — establece un umbral

Los equipos que obtienen más valor de Ultrareview definen un umbral: cualquier PR con más de X líneas cambiadas, o cualquier PR que toque directorio Y, automáticamente va a través de Ultrareview. Debajo de ese umbral, se ejecuta `/code-review`. Ejemplo de umbral:

```
Ultrareview if:
  - diff > 300 lines changed, OR
  - any file in auth/, billing/, api/admin/ touched, OR
  - schema migration included
```

Documenta esto en tu `CLAUDE.md` para que Claude Code lo aplique automáticamente durante la revisión.

### Consejo 4: Ejecuta ultrareview en tus propios PRs antes de solicitar revisión humana

Un flujo de trabajo común: escribe el código, ejecuta `/code-review` para iteración rápida, corrige los problemas obvios, luego ejecuta `/ultrareview` antes de solicitar un revisor humano. El revisor humano luego ve un PR que ya ha sido revisado adversarialmente — su revisión puede enfocarse en decisiones de diseño y contexto en lugar de atrapar errores obvios.

### Consejo 5: Canaliza la salida a un archivo para revisión asincrónica

Ultrareview se ejecuta por 90–180 segundos. No necesitas verlo:

```bash
claude --ultrareview 847 > ultrareview-847.md
```

Luego abre el archivo cuando estés listo. El informe es autosuficiente y no requiere seguimiento interactivo a menos que quieras profundizar.

### Consejo 6: Usa `--full-files` para reescrituras de clases o módulos

Cuando un PR reestructura una clase pero el diff solo muestra métodos cambiados, los agentes pueden perder invariantes que los métodos no modificados asumen. `--full-files` da a la flota la imagen completa:

```bash
claude --ultrareview 512 --full-files --focus correctness
```

Cuesta más (más tokens por agente), pero en una refactorización a nivel de clase vale la pena.

### Consejo 7: Ultrareview el PR, no el commit

Apunta Ultrareview al diff completo del PR, no a un solo commit. Las revisiones de commit único pierden el efecto acumulativo de múltiples commits — una corrección de seguridad en el commit 2 que se revierte parcialmente en el commit 4, por ejemplo. El diff a nivel de PR siempre es el alcance correcto.

### Consejo 8: Si el Verificador Adversarial escala un hallazgo, trátalo como crítico

Las escaladas (↑) suceden cuando el Verificador Adversarial piensa que un agente original subestimó un hallazgo. Estas son raras — menos del 5% de hallazgos — pero son los casos más propensos a ser genuinamente serios. Un hallazgo escalado significa que dos agentes independientemente estuvieron de acuerdo en que el riesgo es mayor que lo inicialmente marcado. Trata las escaladas con la misma urgencia que una 🔴 Critical, independientemente de qué gravedad asignó el agente original.

---

## Gotchas conocidas

### Límites de ventana de contexto en PRs muy grandes

PRs de más de ~5000 líneas cambiadas pueden exceder el contexto que los agentes pueden leer coherentemente. Ultrareview te advertirá antes de ejecutarse si el diff está cerca de este límite. Opciones: divide el PR, usa `--focus` para reducir el alcance del agente, o acepta que algún análisis entre archivos será incompleto.

### El desacuerdo de agentes no es un error

Ocasionalmente el Revisor de Corrección y el Revisor de Arquitectura tendrán recomendaciones contradictorias — la corrección de corrección implica un patrón que el agente de arquitectura marca como inconsistente con la base de código. Esto es esperado. El Verificador Adversarial nota la contradicción pero no siempre la resuelve — eso es un juicio tuyo. Busca la contradicción explícitamente en hallazgos que están Disputados.

### El nivel gratuito no se acumula

Tus tres ejecuciones libres de Ultrareview se asignan en la creación de cuenta y no se reinician. Si estás en un equipo, cada miembro del equipo obtiene su propia asignación — no se agrupan. Un desarrollador individual obtiene tres ejecuciones libres; un equipo de 10 obtiene 30 (10 × 3).

### `--effort max` en un PR grande es caro

Una ejecución de max-effort en un PR de 2000 líneas puede costar $20 y tomar 4–6 minutos. El mensaje de confirmación de costo te mostrará esto antes de que te comprometas. No uses `--effort max` para revisión de rutina — resérvalo para código que tocará límites de seguridad de producción.

### Ultrareview no reemplaza la revisión humana para decisiones de arquitectura

El agente Revisor de Arquitectura es fuerte en análisis de consistencia de patrones y acoplamiento, pero no conoce la estrategia de producto de tu equipo, tu tolerancia de deuda técnica o las restricciones en tu modelo de despliegue. Usa hallazgos de Ultrareview como entradas para revisión de arquitectura humana, no como un reemplazo para ella.

### El informe tiene alcance al diff, no al sistema

Ultrareview revisa el diff en contexto pero no puede conocer errores en sistemas adyacentes con los que tu cambio interactuará. Un cambio que es correcto en aislamiento pero rompe una asunción en un servicio externo no será detectado. Esa es una preocupación a nivel de sistema que requiere conocimiento del dominio humano.

---

## Ejemplo de flujo de trabajo de extremo a extremo

**Escenario:** Has escrito un manejador de webhook de pago para Stripe. El PR tiene 340 líneas cambiadas en 8 archivos. Antes de solicitar revisión, ejecutas Ultrareview.

```bash
# Create the PR first so you have a PR number
gh pr create --title "Add Stripe webhook handler" --draft

# Get the PR number
gh pr list --state open | head -5
# Output: 923  Add Stripe webhook handler  feat/stripe-webhooks

# Run ultrareview with security focus
claude --ultrareview 923 --focus security
```

Mensaje de salida:
```
Ultrareview: Large run — estimated $10
Diff: 340 lines changed across 8 files
Fleet: Security (expanded), Correctness, Performance, Architecture, Tests, Adversarial Verifier
Focus: Security
Proceed? [y/N]
```

Escribes `y`. 147 segundos después:

```
## Ultrareview Report — PR #923
...

### Critical Findings

🔴 [SECURITY] Webhook signature not verified before processing payload
Agent: Security Reviewer · Verified: Adversarial Verifier ✓
File: webhooks/stripe.py:18
Issue: The handler processes the event payload without first verifying the
Stripe-Signature header. Any caller can send fake webhook events.
Fix:
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
  )
  # Raises stripe.error.SignatureVerificationError if invalid

🔴 [SECURITY] Replay attack possible — no timestamp validation
Agent: Security Reviewer · Escalated: Adversarial Verifier ↑
File: webhooks/stripe.py:18
Issue: Even with signature verification added, the timestamp in the Stripe-Signature
header must be validated to prevent replayed requests. Stripe recommends rejecting
events older than 300 seconds.
Fix:
  # stripe.Webhook.construct_event validates timestamp if you pass tolerance parameter
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET,
      tolerance=300
  )
```

Dos hallazgos críticos capturados antes de revisión humana. Corriges ambos, haces push, marcas el PR listo para revisión, y notas en la descripción del PR que Ultrareview fue ejecutado y se abordaron los hallazgos. Tu revisor dedica su tiempo a la lógica de negocios, no a los fundamentos de seguridad.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
