# Flujo de Trabajo de Incidentes DevOps

Un flujo de trabajo estructurado para ingenieros de DevOps y SRE que usan Claude Code — desde la primera alerta hasta el triaje, la coordinación del equipo de guerra, la resolución y el análisis post-mortem.

---

## Resumen

**Ahorro de tiempo:** La respuesta estructurada a incidentes con Claude reduce la carga cognitiva durante eventos de alta tensión, reduce el tiempo de redacción de análisis post-mortem en un 60% y garantiza que las lagunas en los runbooks se capturen antes del próximo incidente.

**Lo que cubre este flujo de trabajo:**
- Disparo de alerta → triaje → evaluación de severidad
- Coordinación del equipo de guerra P1
- Pistas de investigación paralelas
- Comunicación con las partes interesadas durante el incidente
- Resolución y verificación
- Proceso de análisis post-mortem

**Requisito previo:** `/incident-response` y `/oncall-runbook` instalados. Recomendado: PagerDuty u OpsGenie MCP conectado, runbooks accesibles desde Claude.

---

## Fase 1: Disparo de alerta (0-5 minutos)

### Primeros 60 segundos — triaje de severidad

No avise a nadie ni inicie un equipo de guerra antes de haber pasado 60 segundos evaluando.

```
/incident-response

Alerta: [nombre de la alerta de PagerDuty/Datadog]
Servicio: [qué servicio]
Hora: [alerta disparada a HH:MM]

Triaje rápido:
1. ¿Qué me dice realmente la alerta? (copie el texto de la alerta + umbral)
2. ¿Es esta alerta nueva, o ha disparado recientemente? (comprobar: últimos 7 días de esta alerta)
3. ¿Hubo algún despliegue reciente en los últimos 30-60 minutos? (comprobar: registro de despliegues)
4. ¿También están alertando los servicios relacionados? (comprobar: otros servicios en el grafo de dependencias)
5. ¿Existe un runbook para esta alerta? (comprobar: biblioteca de runbooks)

Evaluación inicial: ¿P1 / P2 / P3?

Criterios P1: servicio orientado al cliente caído, riesgo de pérdida de datos, fallo en el procesamiento de pagos, > 10% de los usuarios afectados
Criterios P2: rendimiento degradado, tasa de error elevada, < 10% de los usuarios afectados
Criterios P3: trabajo en segundo plano retrasado, servicio no orientado al cliente, rendimiento degradado pero SLO aún cumplido
```

**Regla de decisión:**
- P1 → ir inmediatamente a la Fase 2 (equipo de guerra)
- P2 → investigar usted mismo durante 10 minutos antes de avisar a otros; si no se resuelve, escalar
- P3 → investigar y resolver durante el horario normal; avísese a sí mismo como recordatorio, no a otros

---

## Fase 2: Configuración del equipo de guerra (solo P1 — 5-10 minutos)

### Avisar y reunir

```
/incident-response

P1 confirmado: [breve descripción de lo que está ocurriendo]

Configurar el equipo de guerra:

1. Crear canal de incidentes: #inc-[AAAA-MM-DD]-[descripción-corta]
2. Publicar mensaje inicial en el canal:

--- PLANTILLA ---
🔴 INCIDENTE P1 — [NOMBRE DEL SERVICIO] — [HH:MM]

Estado: INVESTIGANDO
Severidad: P1
Servicios afectados: [lista]
Impacto en el cliente: [describir — p. ej., "el proceso de pago está devolviendo errores 500 para todos los usuarios"]
Comandante del incidente: [su nombre]
On-call: [ingeniero de guardia]

Todas las actualizaciones en este hilo. No crear conversaciones paralelas.
Equipo de guerra: [enlace de Zoom/Meet]
Runbook: [enlace]
Panel de control: [enlace]
--- FIN DE LA PLANTILLA ---

3. A quién avisar para este tipo de incidente:
- Responsable de ingeniería: [nombre] — si el P1 persiste > 15 minutos
- Equipo de base de datos: [contacto] — si está relacionado con la base de datos
- Seguridad: [contacto] — si hay alguna indicación de brecha o exposición de datos
- Éxito del cliente: [contacto] — para gestionar las comunicaciones con los clientes
- CEO: [contacto] — si el impacto en los ingresos de los clientes > $X o la interrupción > 30 minutos

Avisar a [liste a quién avisar] ahora.
```

### Rol de comandante del incidente

Para un P1, una persona es el comandante del incidente. No investigan — coordinan.

```
/incident-response

Soy el comandante del incidente para este P1. Asignar pistas de investigación.

Incidente: [describir]
Ingenieros disponibles: [lista de quiénes están en el equipo de guerra]

Pistas de investigación paralelas:
Pista A — Investigación de la causa raíz: [nombre del ingeniero]
  - Investigando: [registros del servicio, base de datos, despliegue reciente]
  - Informar en: 5 minutos con hallazgos o "aún investigando"

Pista B — Mitigación: [nombre del ingeniero]
  - Probando: [revertir / reiniciar / desactivar indicador de funcionalidad / escalar manualmente]
  - Estimación: [X minutos]

Pista C — Evaluación del impacto en el cliente: [nombre del ingeniero]
  - Midiendo: [cuántos usuarios afectados, qué geografías, tasa de error]
  - Resultado: impacto cuantificado en el cliente para la actualización a las partes interesadas

Mi función como CI: recibir actualizaciones de estado cada 5 minutos, tomar decisiones, comunicar externamente.

Generar una plantilla de cadencia de actualización cada 5 minutos para publicar en el canal.
```

---

## Fase 3: Investigación (pistas paralelas)

### Investigación de registros

```
/incident-response

Investigando: [descripción del incidente]

Registros disponibles (pegue o describa):
[pegue las líneas de registro relevantes — filtradas a la ventana de tiempo del incidente]

Ayúdame a identificar:
1. Primera ocurrencia del error — marca de tiempo exacta y línea de registro
2. Patrón: ¿es este un tipo de error específico o múltiples?
3. Cualquier traza de pila o error ascendente que indique la causa raíz
4. Cualquier correlación: ¿se correlaciona con un usuario, endpoint o patrón de solicitud específico?
5. Tasa de errores a lo largo del tiempo — ¿está empeorando, estable o recuperándose?

Basándome en los registros: ¿cuáles son las 2-3 hipótesis principales sobre la causa raíz?
```

### Investigación de métricas

```
/incident-response

Métricas durante la ventana del incidente [HH:MM a HH:MM]:

[Pegue o describa lo que ve en su panel de control]
- CPU: [tendencia durante el incidente]
- Memoria: [tendencia]
- Tasa de error: [tendencia]
- Latencia: [tendencia]
- Rendimiento (RPS): [tendencia]
- Conexiones de base de datos: [tendencia]
- Cualquier otra métrica relevante]

Interpretar:
1. ¿Qué cambió primero — qué métrica se movió antes que las demás?
2. ¿Es esto un agotamiento de recursos (CPU/memoria) o un error de aplicación?
3. ¿Hay una "rodilla" en la métrica — un punto donde las cosas empeoraron repentinamente?
4. ¿Qué métrica debo observar para saber si la mitigación está funcionando?
```

### Decisión de mitigación

```
/incident-response

Opciones de mitigación para: [describir hipótesis de causa raíz o causa raíz confirmada]

Opciones disponibles:
A. Revertir el último despliegue (despliegue [X] a [HH:MM]) — recuperación estimada: [X min] — riesgo: [Y]
B. Reiniciar pods: `kubectl rollout restart deployment/[service] -n [namespace]` — recuperación: 2-3 min — riesgo: solicitudes en vuelo descartadas
C. Desactivar indicador de funcionalidad: [nombre del indicador] — recuperación: 1-2 min — riesgo: [funcionalidad eliminada para todos los usuarios]
D. Escalar: añadir N réplicas — recuperación: 3-5 min — riesgo: costo; no soluciona la causa raíz
E. [Otra opción]

Recomendar: ¿cuál es la mejor mitigación para esta situación?
Criterios: tiempo más rápido para recuperar el impacto en el cliente, menor riesgo de empeorar las cosas, reversible.

¿Qué observo en los 5 minutos después de aplicar la mitigación para confirmar que está funcionando?
```

---

## Fase 4: Comunicación durante el incidente

### Actualización de la página de estado orientada al cliente

```
/incident-response

Escribir una actualización de la página de estado.

Audiencia: clientes / público
Tono: honesto, tranquilo, sin alarmar
Evitar: jerga técnica, asignación de culpa, compartir detalles internos de la investigación

Estado: [Investigando / Identificado / Monitorizando / Resuelto]
Componente afectado: [qué servicio / funcionalidad]
Impacto en el cliente: [lo que experimenta — "algunos usuarios pueden experimentar fallos en el proceso de pago"]
Cuándo comenzó: [HH:MM zona horaria]
Qué estamos haciendo: [breve — "nuestro equipo ha identificado el problema y está implementando una solución"]

NO decir: "Pedimos disculpas por cualquier inconveniente." — sobresaturado y hueco.
SÍ decir: impacto específico, qué se está haciendo, y cuándo se actualizará de nuevo.

Plantilla:
[ESTADO]: [Titular breve de lo que está ocurriendo]
Estamos [investigando / hemos identificado / monitorizando] un problema que afecta a [componente].
[Lo que experimenta el cliente — específico].
Nuestro equipo está [qué acción está en curso — p. ej., implementando una solución / revirtiendo un cambio].
Actualizaremos esta página a las [hora de la próxima actualización].
```

### Actualización interna a las partes interesadas (cada 15-30 minutos durante un P1)

```
/incident-response

Escribir una actualización interna para las partes interesadas del incidente P1 [NOMBRE].

Tiempo desde que comenzó el incidente: [X minutos]
Última actualización publicada: [HH:MM]

Estado actual:
- Causa raíz: [identificada / aún investigando]
- Estado de la mitigación: [aplicada / en curso / aún no]
- Impacto en el cliente: [actual — p. ej., "el 50% de las solicitudes de pago están fallando, el resto está bien"]
- Estimación para la resolución: [X minutos / desconocida]

Audiencia: [canal de Slack con equipo ejecutivo, CS, ventas]
Longitud: máximo 5-6 oraciones — nadie lee un muro de texto durante una crisis.

Formato:
[HORA] Actualización P1 — [SERVICIO]:
Estado: [una palabra]
Impacto: [estado actual del impacto en el cliente]
Causa raíz: [encontrada/no encontrada]
Acción: [qué está ocurriendo ahora mismo]
ETA: [estimación o "investigando más"]
Próxima actualización: [HH:MM]
```

---

## Fase 5: Resolución y verificación

### Lista de verificación de resolución del incidente

```
/incident-response

Verificar la resolución del incidente para [SERVICIO].

Mitigación aplicada: [qué se hizo]
Hora de aplicación: [HH:MM]

Verificar la recuperación en estas dimensiones:

1. Tasa de error: tasa de error actual vs. referencia (debe volver al SLO)
   Actual: [X%] | Referencia: [X%] | Umbral SLO: [X%]

2. Latencia: latencia p99 de vuelta a lo normal
   Actual: [Xms] | Referencia: [Xms] | Umbral SLO: [Xms]

3. Rendimiento: RPS recuperándose a los niveles previos al incidente
   Actual: [X] | Pre-incidente: [X]

4. Comprobación orientada al cliente: ejecutar prueba sintética o comprobar datos de usuarios reales
   ¿Puede un cliente completar con éxito [el flujo afectado]?

5. Servicios descendentes: ¿hay efectos en cascada en los servicios dependientes?
   [Comprobar cada servicio que depende de este]

Si todas las comprobaciones pasan: declarar el incidente resuelto.
Si alguna comprobación falla: no declarar resuelto — continuar la investigación.

Redactar el mensaje de "todo despejado" para el canal del incidente y la página de estado.
```

### Mensaje de todo despejado

```
/incident-response

Escribir el mensaje de todo despejado para:

Incidente: [nombre]
Duración: [X minutos en total]
Causa raíz (breve): [qué ocurrió]
Solución aplicada: [qué lo resolvió]
Cualquier seguimiento que el equipo deba saber: [cambios de monitorización, ticket creado, etc.]

Canal: #inc-[nombre] (copiar a #engineering y a la página de estado)

Formato: 3-4 oraciones. Específico. Incluir la hora de resolución.

No escribir: "Nos complace anunciar que el incidente está resuelto." Demasiado corporativo.
Sí escribir: "A partir de [HH:MM], [servicio] se ha recuperado completamente. La causa raíz fue [X]. Hemos [Y] y hemos creado un ticket para [prevenir la recurrencia]."
```

---

## Fase 6: Análisis post-mortem

### Análisis post-mortem en las 48 horas posteriores al incidente

```
/incident-response

Escribir el análisis post-mortem de [NOMBRE DEL INCIDENTE] — [FECHA].

Información:
- Historial del canal del incidente: [pegue o resuma]
- Cronología tal como la conoce:
  [HH:MM] — [qué ocurrió]
  [HH:MM] — [qué ocurrió]
  [HH:MM] — [resolución]
- Causa raíz encontrada: [describir]
- Factores contribuyentes: [cualquier cosa que lo empeoró o dificultó la detección/solución]
- Impacto: [duración, servicios afectados, impacto en el cliente, impacto en los ingresos si se conoce]

Estructura del análisis post-mortem:

## Resumen
[3-4 oraciones: qué ocurrió, impacto, resolución]

## Cronología
[Cronología precisa con horas — primera señal, primera alerta, triaje, pasos de investigación, solución aplicada, verificación]

## Causa raíz
[Causa raíz técnica específica — no "el servicio cayó" sino qué causó que cayera]

## Factores contribuyentes
[Cosas que empeoraron esto: detección lenta, runbook faltante, reversión no probada, prueba defectuosa que no detectó el error]

## Impacto
[Cuantificar: N minutos de tiempo de inactividad, X% de usuarios afectados, Y tickets de soporte creados, $Z de impacto en los ingresos]

## Qué salió bien
[Sea específico — qué funcionó en la respuesta que debemos preservar]

## Elementos de acción
Formato: [QUÉ] | Responsable: [NOMBRE] | Fecha límite: [FECHA]
- [ ] [Acción 1 — p. ej., añadir alerta para [X] que habría detectado esto 10 minutos antes] | Responsable: [nombre] | Fecha límite: [fecha]
- [ ] [Acción 2] | Responsable: [nombre] | Fecha límite: [fecha]
- [ ] [Acción 3 — actualizar el runbook con los pasos de resolución usados hoy] | Responsable: [nombre] | Fecha límite: [fecha]

Regla: máximo 5 elementos de acción. Cada uno debe ser específico y asignado. Las acciones vagas no son acciones.

## Qué no vamos a arreglar
[Cualquier cosa que haya decidido no priorizar deliberadamente después de evaluar el costo vs. el riesgo]
```

---

## Preparación para el turno de guardia (antes de su rotación)

### Lista de verificación previa a la rotación

Ejecute esto 2 días antes de que comience su turno de guardia:

```
/oncall-runbook

Preparación previa a la rotación para el turno de guardia que comienza el [FECHA]:

Mis servicios a cubrir: [lista]

Para cada servicio, verificar:
1. ¿Está actualizado el runbook? (¿Actualizado en los últimos 90 días?)
2. ¿Tengo acceso a todas las herramientas necesarias? (consola en la nube, Kubernetes, base de datos, registros)
3. ¿Están correctamente configuradas mis notificaciones de PagerDuty? (Probar disparando manualmente una alerta de baja severidad)
4. ¿Conozco la ruta de escalado? (Nombre, teléfono, Slack para cada nivel)

Lagunas encontradas: [listar todo lo que falta]
Acciones antes de que comience el turno: [lista]

Además:
- Leer los últimos 3 análisis post-mortem — entender qué ha fallado recientemente
- Comprobar si hay algún despliegue planificado durante mi turno — coordinar con el equipo
- Conocer el contexto empresarial: ¿hay períodos de alto tráfico, lanzamientos o eventos durante mi semana?
```

---

## Referencias

| Métrica | Objetivo | Señal de advertencia |
|---|---|---|
| De alerta a decisión de triaje | < 5 minutos | > 10 min: calidad de la alerta o laguna en el runbook |
| Equipo de guerra P1 reunido | < 10 minutos | > 20 min: problema de comunicación o de avisos |
| Tiempo hasta el primer intento de mitigación | < 20 minutos | > 30 min: ruta de investigación poco clara |
| MTTR (P1) | < 45 minutos | > 60 min: laguna en el runbook o en las habilidades |
| MTTR (P2) | < 2 horas | > 4 horas: triaje inexacto o investigación ineficaz |
| Análisis post-mortem publicado | En las 48 horas | > 72 horas: lecciones que se están perdiendo |
| Elementos de acción completados | 100% en 30 días | < 70%: los elementos de acción no son compromisos reales |
| Incidentes por mes (tendencia) | Decreciente | Plano o creciente: problemas sistémicos que no se están resolviendo |

---
